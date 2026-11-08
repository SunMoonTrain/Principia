// 进度的数据和合并规则，网站（先在本地应用、排队）和进度服务（写进 progress/）共用。
// 文件格式见 docs/plan.md「进度存储 · 文件格式」。网页不发整份文件，只发一条条操作，服务端按操作合并。

export type LessonStatus = 'completed' | 'known' | 'none';
export type AttemptResult = 'correct' | 'wrong' | 'gave-up';

export interface LessonProgress {
  /** 第一次打开这一节。 */
  startedAt?: string;
  status?: LessonStatus;
  statusAt?: string;
}

export interface AttemptRecord {
  id: string;
  at: string;
  /** 填的原文；选择题记成 AD 这样的字母；放弃时为空。 */
  input: string;
  result: AttemptResult;
}

export interface ProblemProgress {
  attempts?: AttemptRecord[];
  /** 每级提示（1–3）第一次点开的时间。 */
  hints?: Partial<Record<1 | 2 | 3, string>>;
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>;
  /** 小节 id → 题号 → 记录。 */
  problems: Record<string, Record<string, ProblemProgress>>;
}

export type ProgressOp =
  | { type: 'lesson-open'; lesson: string; at: string }
  | { type: 'lesson-status'; lesson: string; status: LessonStatus; at: string }
  | { type: 'attempt'; lesson: string; problem: string; attempt: AttemptRecord }
  | { type: 'hint'; lesson: string; problem: string; level: 1 | 2 | 3; at: string };

export const EMPTY_PROGRESS: ProgressState = { lessons: {}, problems: {} };

/** 本地时间加时区，如 2026-11-08T15:30:12+08:00。 */
export function localTimestamp(date = new Date()): string {
  const pad = (n: number): string => String(Math.abs(n)).padStart(2, '0');
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(Math.trunc(offset / 60))}:${pad(offset % 60)}`
  );
}

/** 带时区的时间不能按字符串比大小，换成毫秒数再比。 */
function time(at: string | undefined): number {
  const t = at ? Date.parse(at) : Number.NaN;
  return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t;
}

function earlier(a: string | undefined, b: string): string {
  return a !== undefined && time(a) <= time(b) ? a : b;
}

function updateProblem(state: ProgressState, lesson: string, problem: string, change: (p: ProblemProgress) => ProblemProgress): ProgressState {
  const lessonProblems = state.problems[lesson] ?? {};
  return {
    ...state,
    problems: { ...state.problems, [lesson]: { ...lessonProblems, [problem]: change(lessonProblems[problem] ?? {}) } },
  };
}

/** 应用一条操作，返回新的状态（不改原来的）。同一条操作应用两次和一次结果一样，补交重发不会重复计次。 */
export function applyOp(state: ProgressState, op: ProgressOp): ProgressState {
  switch (op.type) {
    case 'lesson-open': {
      const lesson = state.lessons[op.lesson] ?? {};
      return { ...state, lessons: { ...state.lessons, [op.lesson]: { ...lesson, startedAt: earlier(lesson.startedAt, op.at) } } };
    }
    case 'lesson-status': {
      const lesson = state.lessons[op.lesson] ?? {};
      if (lesson.statusAt !== undefined && time(op.at) <= time(lesson.statusAt)) return state;
      return { ...state, lessons: { ...state.lessons, [op.lesson]: { ...lesson, status: op.status, statusAt: op.at } } };
    }
    case 'attempt':
      return updateProblem(state, op.lesson, op.problem, (p) => {
        const attempts = p.attempts ?? [];
        if (attempts.some((a) => a.id === op.attempt.id)) return p;
        const merged = [...attempts, op.attempt].sort((a, b) => time(a.at) - time(b.at));
        return { ...p, attempts: merged };
      });
    case 'hint':
      return updateProblem(state, op.lesson, op.problem, (p) => ({ ...p, hints: { ...p.hints, [op.level]: earlier(p.hints?.[op.level], op.at) } }));
  }
}

// ---------- 由记录算出来的统计 ----------

export function isLearned(lesson: LessonProgress | undefined): boolean {
  return lesson?.status === 'completed' || lesson?.status === 'known';
}

/** 点开到第几级提示（0–3）。 */
export function hintsShown(p: ProblemProgress | undefined): number {
  return Math.max(0, ...Object.keys(p?.hints ?? {}).map(Number));
}

/** 统计用的结果：按第一次作答，「放弃」算错。 */
export function firstResult(p: ProblemProgress | undefined): AttemptResult | null {
  return p?.attempts?.[0]?.result ?? null;
}

/** 答对或放弃之后才显示 solution。 */
export function solutionUnlocked(p: ProblemProgress | undefined): boolean {
  return (p?.attempts ?? []).some((a) => a.result === 'correct' || a.result === 'gave-up');
}

/** 是在放弃（看解答）之前自己答对的。 */
export function solvedBeforeGivingUp(p: ProblemProgress | undefined): boolean {
  const attempts = p?.attempts ?? [];
  const correct = attempts.findIndex((a) => a.result === 'correct');
  const gaveUp = attempts.findIndex((a) => a.result === 'gave-up');
  return correct >= 0 && (gaveUp < 0 || correct < gaveUp);
}

/** 第一次答对之前点开过的最高一级提示；还没答对时为 null。 */
export function hintsBeforeFirstCorrect(p: ProblemProgress | undefined): number | null {
  const correct = (p?.attempts ?? []).find((a) => a.result === 'correct');
  if (!correct) return null;
  const levels = Object.entries(p?.hints ?? {})
    .filter(([, at]) => time(at) <= time(correct.at))
    .map(([level]) => Number(level));
  return Math.max(0, ...levels);
}
