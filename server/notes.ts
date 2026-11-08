// 难题、思考题的思路笔记：progress/notes/<小节 id>/<题号>.md，就是你写的 Markdown 原文。
// 整份保存，保存时带上开始编辑时那一版的指纹；文件已被另一台设备改过（指纹对不上）时，
// 不覆盖，把这次的内容另存为 <题号>.conflict-<时间>.md，两份都保留（见 docs/plan.md「合并与写入」）。

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { writeFileAtomic } from '../compiler/fsutil.ts';

export interface NoteVersion {
  text: string;
  version: string;
}

export interface NoteConflict {
  file: string;
  text: string;
}

export interface LessonNotes {
  notes: Record<string, NoteVersion>;
  conflicts: Record<string, NoteConflict[]>;
}

export type SaveResult =
  | { ok: true; version: string | null }
  | { ok: false; conflict: NoteConflict; current: NoteVersion | null };

export const CONFLICT_FILE_RE = /^(p[1-8])\.conflict-\d{8}-\d{6}(-\d+)?\.md$/;
const NOTE_FILE_RE = /^(p[1-8])\.md$/;

/** 内容的指纹：只要文件被改过（哪怕是手动改的），就和网页手里那一版对不上。 */
export function noteVersion(text: string): string {
  return createHash('sha1').update(text).digest('hex').slice(0, 16);
}

/** 20261108-153000：Windows 文件名不能有冒号。 */
function stamp(date: Date): string {
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

export class NotesStore {
  private readonly queues = new Map<string, Promise<unknown>>();

  constructor(readonly dir: string) {}

  file(lesson: string, problem: string): string {
    return path.join(this.dir, lesson, `${problem}.md`);
  }

  private read(file: string): NoteVersion | null {
    if (!fs.existsSync(file)) return null;
    const text = fs.readFileSync(file, 'utf8');
    return { text, version: noteVersion(text) };
  }

  /** 一节的全部笔记和另存的冲突版本。 */
  readLesson(lesson: string): LessonNotes {
    const result: LessonNotes = { notes: {}, conflicts: {} };
    const dir = path.join(this.dir, lesson);
    if (!fs.existsSync(dir)) return result;
    for (const name of fs.readdirSync(dir).sort()) {
      const note = NOTE_FILE_RE.exec(name);
      if (note) {
        result.notes[note[1]] = this.read(path.join(dir, name))!;
        continue;
      }
      const conflict = CONFLICT_FILE_RE.exec(name);
      if (conflict) (result.conflicts[conflict[1]] ??= []).push({ file: name, text: fs.readFileSync(path.join(dir, name), 'utf8') });
    }
    return result;
  }

  /** 同一道题的保存排队，免得两次保存交错。 */
  private enqueue<T>(key: string, task: () => Promise<T>): Promise<T> {
    const next = (this.queues.get(key) ?? Promise.resolve()).then(task, task);
    this.queues.set(
      key,
      next.catch(() => undefined),
    );
    return next;
  }

  /**
   * 保存一道题的笔记。base 是网页开始编辑时那一版的指纹（当时还没有笔记就是 null）。
   * 文件现在的指纹和 base 一样（或文件已经不在了）才写；不一样就另存为冲突文件。空文字表示删掉笔记。
   */
  save(lesson: string, problem: string, text: string, base: string | null, now = new Date()): Promise<SaveResult> {
    const file = this.file(lesson, problem);
    return this.enqueue(file, async () => {
      const current = this.read(file);
      if (current && current.version !== base) {
        // 内容一样就不算冲突（比如两台设备补交了同一份草稿）
        if (current.text === text) return { ok: true, version: current.version };
        return { ok: false, conflict: await this.saveConflict(lesson, problem, text, now), current };
      }
      if (text === '') {
        if (current) fs.rmSync(file);
        const dir = path.dirname(file);
        if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
        return { ok: true, version: null };
      }
      await writeFileAtomic(file, text);
      return { ok: true, version: noteVersion(text) };
    });
  }

  private async saveConflict(lesson: string, problem: string, text: string, now: Date): Promise<NoteConflict> {
    const base = `${problem}.conflict-${stamp(now)}`;
    let name = `${base}.md`;
    for (let i = 2; fs.existsSync(path.join(this.dir, lesson, name)); i++) name = `${base}-${i}.md`;
    await writeFileAtomic(path.join(this.dir, lesson, name), text);
    return { file: name, text };
  }

  /** 你合并完以后删掉另存的版本。 */
  deleteConflict(lesson: string, file: string): boolean {
    if (!CONFLICT_FILE_RE.test(file)) return false;
    const target = path.join(this.dir, lesson, file);
    if (!fs.existsSync(target)) return false;
    fs.rmSync(target);
    return true;
  }
}
