// 作答记录：每道题的作答、看过几级提示。
// 台阶 3 才有进度服务，现在只存在这个页面的内存里（切换小节还在，刷新就没了）；
// 接口按台阶 3 的需要设计：作答只追加、每条带 id 和时间，统计按第一次作答。

import { useSyncExternalStore } from 'react';

export type AttemptResult = 'correct' | 'wrong' | 'gave-up';

export interface Attempt {
  id: string;
  /** ISO 时间（UTC，带 Z）。 */
  at: string;
  input: string;
  result: AttemptResult;
}

export interface ProblemPractice {
  /** 判过的作答和「放弃」；格式错误不算作答，不记。 */
  attempts: Attempt[];
  /** 已经点开到第几级提示（0–3）。 */
  hintsShown: number;
  /** 第一次答对时已经点开的提示级数；还没答对时为 null（那时用 hintsShown）。 */
  hintsBeforeCorrect: number | null;
}

const EMPTY: ProblemPractice = { attempts: [], hintsShown: 0, hintsBeforeCorrect: null };
const state = new Map<string, ProblemPractice>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function update(key: string, change: (p: ProblemPractice) => ProblemPractice): void {
  state.set(key, change(state.get(key) ?? EMPTY));
  listeners.forEach((l) => l());
}

/** 局域网地址不是安全上下文，没有 crypto.randomUUID，退一步自己拼。 */
function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function practiceKey(lessonId: string, problemId: string): string {
  return `${lessonId}/${problemId}`;
}

export function usePractice(key: string): ProblemPractice {
  return useSyncExternalStore(subscribe, () => state.get(key) ?? EMPTY);
}

export function recordAttempt(key: string, input: string, result: AttemptResult): void {
  update(key, (p) => ({
    ...p,
    attempts: [...p.attempts, { id: newId(), at: new Date().toISOString(), input, result }],
    hintsBeforeCorrect: p.hintsBeforeCorrect ?? (result === 'correct' ? p.hintsShown : null),
  }));
}

export function revealHint(key: string): void {
  update(key, (p) => ({ ...p, hintsShown: Math.min(3, p.hintsShown + 1) }));
}

/** 统计用的结果：按第一次作答，「放弃」算错。 */
export function firstResult(p: ProblemPractice): AttemptResult | null {
  return p.attempts[0]?.result ?? null;
}

/** 答对或放弃之后才显示 solution。 */
export function solutionUnlocked(p: ProblemPractice): boolean {
  return p.attempts.some((a) => a.result === 'correct' || a.result === 'gave-up');
}

/** 是在放弃（看解答）之前自己答对的。 */
export function solvedBeforeGivingUp(p: ProblemPractice): boolean {
  const correct = p.attempts.findIndex((a) => a.result === 'correct');
  const gaveUp = p.attempts.findIndex((a) => a.result === 'gave-up');
  return correct >= 0 && (gaveUp < 0 || correct < gaveUp);
}
