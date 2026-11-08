// 思路笔记的网页这一侧：读一节的笔记；编辑时停止输入约 1 秒自动保存；连不上时草稿存在浏览器里，重连后补交。
// 笔记整份保存，不走进度操作队列。保存时带上开始编辑时那一版的指纹，服务端发现文件已被另一台设备改过，
// 就把这次的内容另存为冲突文件（见 server/notes.ts），网页上一直提示，直到你合并完删掉它。

import { useEffect, useSyncExternalStore } from 'react';

export interface NoteConflict {
  file: string;
  text: string;
}

interface Saved {
  text: string;
  /** 服务端那一版的指纹；还没有笔记时为 null。 */
  version: string | null;
}

interface Draft {
  text: string;
  /** 开始编辑时那一版的指纹。 */
  base: string | null;
}

interface LessonNotesResponse {
  notes: Record<string, { text: string; version: string }>;
  conflicts: Record<string, NoteConflict[]>;
}

const DRAFTS_KEY = 'principia.note-drafts';
const SAVE_DELAY = 1000;
const RETRY_MS = 3000;
/** 和服务端的上限一致（server/app.ts）。 */
export const NOTE_MAX_LENGTH = 200_000;

const saved = new Map<string, Saved>();
const conflicts = new Map<string, NoteConflict[]>();
const errors = new Map<string, string>();
const loadedLessons = new Set<string>();
const timers = new Map<string, number>();
const inflight = new Map<string, Promise<boolean>>();
let drafts: Record<string, Draft> = loadDrafts();
let failing = false;
let retryTimer: number | undefined;

let revision = 0;
const listeners = new Set<() => void>();

function emit(): void {
  revision++;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getRevision = (): number => revision;

function loadDrafts(): Record<string, Draft> {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Draft>) : {};
  } catch {
    return {};
  }
}

function setDrafts(next: Record<string, Draft>): void {
  drafts = next;
  try {
    if (Object.keys(drafts).length) localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
    else localStorage.removeItem(DRAFTS_KEY);
  } catch {
    // 存不了（隐私模式）也不影响这次使用，只是关掉页面后没保存的会丢
  }
}

function withoutDraft(key: string): Record<string, Draft> {
  const { [key]: _, ...rest } = drafts;
  return rest;
}

const keyOf = (lesson: string, problem: string): string => `${lesson}/${problem}`;

function scheduleRetry(): void {
  window.clearTimeout(retryTimer);
  retryTimer = window.setTimeout(() => {
    for (const lesson of loadedLessons) void loadLessonNotes(lesson);
    void flushNotes();
  }, RETRY_MS);
}

/** 读一节的全部笔记（以服务端为准；没保存的草稿留着，照样显示草稿）。 */
export async function loadLessonNotes(lesson: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/notes/${lesson}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const body = (await res.json()) as LessonNotesResponse;
    const prefix = `${lesson}/`;
    for (const map of [saved, conflicts]) {
      for (const key of [...map.keys()]) if (key.startsWith(prefix)) map.delete(key);
    }
    for (const [problem, note] of Object.entries(body.notes)) saved.set(keyOf(lesson, problem), note);
    for (const [problem, list] of Object.entries(body.conflicts)) conflicts.set(keyOf(lesson, problem), list);
    loadedLessons.add(lesson);
    failing = false;
    emit();
    // 上次没保存上的草稿，连上了就补交
    if (Object.keys(drafts).length) void flushNotes();
    return true;
  } catch {
    failing = true;
    emit();
    scheduleRetry();
    return false;
  }
}

/** 改了笔记：先存草稿，停止输入约 1 秒后保存。 */
export function editNote(lesson: string, problem: string, text: string): void {
  const key = keyOf(lesson, problem);
  const current = saved.get(key) ?? { text: '', version: null };
  const base = drafts[key]?.base ?? current.version;
  window.clearTimeout(timers.get(key));
  if (text === current.text && base === current.version) {
    // 改回了服务端那一版，不用保存
    setDrafts(withoutDraft(key));
    emit();
    return;
  }
  setDrafts({ ...drafts, [key]: { text, base } });
  emit();
  timers.set(
    key,
    window.setTimeout(() => void saveNote(key), SAVE_DELAY),
  );
}

async function saveNote(key: string): Promise<boolean> {
  // 同一道题一次只发一个，前一个回来以后再发最新的草稿
  while (inflight.has(key)) await inflight.get(key);
  const draft = drafts[key];
  if (!draft) return true;
  window.clearTimeout(timers.get(key));
  const [lesson, problem] = key.split('/');
  const run = (async (): Promise<boolean> => {
    try {
      const res = await fetch(`/api/notes/${lesson}/${problem}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (res.status === 409) {
        // 另一台设备改过：服务端保留它那一版，这次发出去的另存了。发出去以后又改的部分还按旧指纹发，也会另存，一个字都不丢。
        const body = (await res.json()) as { conflict: NoteConflict; current: Saved | null };
        saved.set(key, body.current ?? { text: '', version: null });
        conflicts.set(key, [...(conflicts.get(key) ?? []), body.conflict]);
        if (drafts[key]?.text === draft.text) setDrafts(withoutDraft(key));
      } else if (res.ok) {
        const body = (await res.json()) as { version: string | null };
        saved.set(key, { text: draft.text, version: body.version });
        // 发出去以后又改过的，下次以刚存下的这一版为底
        if (drafts[key]?.text === draft.text) setDrafts(withoutDraft(key));
        else if (drafts[key]) setDrafts({ ...drafts, [key]: { ...drafts[key], base: body.version } });
      } else if (res.status === 400) {
        // 请求本身不对（比如太长），重发也没用；草稿留在浏览器里，不丢
        errors.set(key, '这段笔记保存不了（太长了？），先留在这台设备的浏览器里');
        emit();
        return false;
      } else {
        throw new Error(String(res.status));
      }
      errors.delete(key);
      failing = false;
      emit();
      return true;
    } catch {
      failing = true;
      emit();
      scheduleRetry();
      return false;
    }
  })();
  inflight.set(key, run);
  emit();
  try {
    return await run;
  } finally {
    inflight.delete(key);
    emit();
  }
}

/** 马上保存所有草稿（存档前用）；全部保存上才返回 true。 */
export async function flushNotes(): Promise<boolean> {
  const results = await Promise.all(Object.keys(drafts).map((key) => saveNote(key)));
  return results.every(Boolean);
}

/** 你对照着合并进笔记以后，删掉另存的版本。 */
export async function deleteConflict(lesson: string, problem: string, file: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/notes/${lesson}/${problem}/conflicts/${encodeURIComponent(file)}`, { method: 'DELETE' });
    if (!res.ok) return false;
    const key = keyOf(lesson, problem);
    const rest = (conflicts.get(key) ?? []).filter((c) => c.file !== file);
    if (rest.length) conflicts.set(key, rest);
    else conflicts.delete(key);
    emit();
    return true;
  } catch {
    return false;
  }
}

export interface NoteView {
  /** 这一节的笔记读到了。 */
  loaded: boolean;
  /** 编辑框里的文字：有草稿就是草稿。 */
  text: string;
  /** 有还没保存上的改动。 */
  pending: boolean;
  saving: boolean;
  conflicts: NoteConflict[];
  error: string | null;
  offline: boolean;
}

export function useNote(lesson: string, problem: string): NoteView {
  useSyncExternalStore(subscribe, getRevision);
  const key = keyOf(lesson, problem);
  return {
    loaded: loadedLessons.has(lesson),
    text: drafts[key]?.text ?? saved.get(key)?.text ?? '',
    pending: key in drafts,
    saving: inflight.has(key),
    conflicts: conflicts.get(key) ?? [],
    error: errors.get(key) ?? null,
    offline: failing,
  };
}

/** 小节页打开时读这一节的笔记；回到页面时（可能在另一台设备上写过）重新读。 */
export function useLessonNotes(lesson: string | null): void {
  useEffect(() => {
    if (!lesson) return;
    void loadLessonNotes(lesson);
    const refresh = (): void => {
      if (document.visibilityState === 'visible') void loadLessonNotes(lesson);
    };
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('online', refresh);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('online', refresh);
    };
  }, [lesson]);
}

/** 顶栏用：还有几份笔记没保存上、是不是连不上。 */
export function useNotesSync(): { pending: number; offline: boolean } {
  useSyncExternalStore(subscribe, getRevision);
  return { pending: Object.keys(drafts).length, offline: failing };
}
