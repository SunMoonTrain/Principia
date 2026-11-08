// 进度的数据和合并规则，网站（先在本地应用、排队）和进度服务（写进 progress/）共用。
// 文件格式见 docs/plan.md「进度存储 · 文件格式」。网页不发整份文件，只发一条条操作，服务端按操作合并。

export type LessonStatus = 'completed' | 'known' | 'none';
export type AttemptResult = 'correct' | 'wrong' | 'gave-up';
/** 难题、思考题：未开始 → 有思路 → 写完待批改 → 已批改。 */
export type ProblemStatus = 'none' | 'idea' | 'ready' | 'graded';
export type GradeResult = 'pass' | 'partial' | 'fail';

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

export interface GradeRecord {
  id: string;
  at: string;
  result: GradeResult;
  /** 批语，可省略。 */
  comment?: string;
}

export interface ProblemProgress {
  attempts?: AttemptRecord[];
  /** 每级提示（1–3）第一次点开的时间。 */
  hints?: Partial<Record<1 | 2 | 3, string>>;
  /** 没把握（任何题都有）；取消时为 false。 */
  unsure?: boolean;
  unsureAt?: string;
  /** 从复习列表移出的时间：之后只看这个时间以后的新情况。 */
  reviewDismissedAt?: string;
  /** 难题、思考题的状态；录入批改结果时改成 graded。 */
  status?: ProblemStatus;
  statusAt?: string;
  /** 批改记录：只追加，每次都保留。 */
  grades?: GradeRecord[];
}

/** 「内容有误」：写进 content/issues.yaml，不算进度。 */
export interface IssueRecord {
  id: string;
  at: string;
  lesson: string;
  /** 题号 / 题干、提示 N、解答、选项 X；或部分标题，如「讲解 / 有理数轴上的洞」。 */
  part: string;
  /** 选中的原文，公式还原成 $…$。 */
  quote?: string;
  /** 你补的一句话。 */
  note?: string;
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
  | { type: 'hint'; lesson: string; problem: string; level: 1 | 2 | 3; at: string }
  | { type: 'unsure'; lesson: string; problem: string; value: boolean; at: string }
  | { type: 'problem-status'; lesson: string; problem: string; status: ProblemStatus; at: string }
  | { type: 'grade'; lesson: string; problem: string; grade: GradeRecord }
  | { type: 'review-dismiss'; lesson: string; problem: string; at: string }
  | { type: 'issue'; issue: IssueRecord };

/** 写进 progress/problems/<领域>.yaml 的操作。 */
export type ProblemOp = Extract<ProgressOp, { problem: string }>;

export function isProblemOp(op: ProgressOp): op is ProblemOp {
  return 'problem' in op;
}

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

/**
 * 给「取较新的」那类状态（学完、没把握、难题状态）用的时间：至少比现在的时间晚 1 秒。
 * 时间只精确到秒，同一秒里连点两下时，第二下要算更新的，不然会被当成旧操作丢掉。
 */
export function laterTimestamp(current: string | undefined, now = new Date()): string {
  const t = current ? Date.parse(current) : Number.NaN;
  return localTimestamp(Number.isNaN(t) || t < now.getTime() - 999 ? now : new Date(Math.floor(t / 1000) * 1000 + 1000));
}

/** 带时区的时间不能按字符串比大小，换成毫秒数再比。 */
function time(at: string | undefined): number {
  const t = at ? Date.parse(at) : Number.NaN;
  return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t;
}

function earlier(a: string | undefined, b: string): string {
  return a !== undefined && time(a) <= time(b) ? a : b;
}

function later(a: string | undefined, b: string): string {
  return a !== undefined && time(a) >= time(b) ? a : b;
}

/** op 的时间比现有的新（现有的没有时间也算新）。 */
function newer(at: string, current: string | undefined): boolean {
  return current === undefined || time(at) > time(current);
}

function byTime<T extends { at: string }>(a: T, b: T): number {
  return time(a.at) - time(b.at);
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
      if (!newer(op.at, lesson.statusAt)) return state;
      return { ...state, lessons: { ...state.lessons, [op.lesson]: { ...lesson, status: op.status, statusAt: op.at } } };
    }
    case 'attempt':
      return updateProblem(state, op.lesson, op.problem, (p) => {
        const attempts = p.attempts ?? [];
        if (attempts.some((a) => a.id === op.attempt.id)) return p;
        return { ...p, attempts: [...attempts, op.attempt].sort(byTime) };
      });
    case 'hint':
      return updateProblem(state, op.lesson, op.problem, (p) => ({ ...p, hints: { ...p.hints, [op.level]: earlier(p.hints?.[op.level], op.at) } }));
    case 'unsure':
      return updateProblem(state, op.lesson, op.problem, (p) => (newer(op.at, p.unsureAt) ? { ...p, unsure: op.value, unsureAt: op.at } : p));
    case 'problem-status':
      return updateProblem(state, op.lesson, op.problem, (p) => (newer(op.at, p.statusAt) ? { ...p, status: op.status, statusAt: op.at } : p));
    case 'grade':
      return updateProblem(state, op.lesson, op.problem, (p) => {
        const grades = p.grades ?? [];
        if (grades.some((g) => g.id === op.grade.id)) return p;
        // 录入批改结果 = 状态改成「已批改」，时间取批改时间，同样按较新的算
        const status = newer(op.grade.at, p.statusAt) ? { status: 'graded' as const, statusAt: op.grade.at } : {};
        return { ...p, ...status, grades: [...grades, op.grade].sort(byTime) };
      });
    case 'review-dismiss':
      return updateProblem(state, op.lesson, op.problem, (p) => ({ ...p, reviewDismissedAt: later(p.reviewDismissedAt, op.at) }));
    case 'issue':
      // 「内容有误」写进 content/issues.yaml，不在进度里
      return state;
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

export function problemStatus(p: ProblemProgress | undefined): ProblemStatus {
  return p?.status ?? 'none';
}

/** 最新一条批改记录。 */
export function latestGrade(p: ProblemProgress | undefined): GradeRecord | null {
  const grades = p?.grades ?? [];
  return grades.length ? grades[grades.length - 1] : null;
}

export type ReviewReason = 'unsure' | 'wrong' | 'hints';

/**
 * 为什么在复习列表里：标了没把握、答错过（难题、思考题是批改结果为部分或没过）、看过提示。
 * 只看移出复习列表以后的新情况；返回空数组表示不在列表里。
 */
export function reviewReasons(p: ProblemProgress | undefined): ReviewReason[] {
  if (!p) return [];
  const since = p.reviewDismissedAt === undefined ? Number.NEGATIVE_INFINITY : time(p.reviewDismissedAt);
  const after = (at: string | undefined): boolean => since === Number.NEGATIVE_INFINITY || (at !== undefined && time(at) > since);
  const reasons: ReviewReason[] = [];
  if (p.unsure && after(p.unsureAt)) reasons.push('unsure');
  const wrong = (p.attempts ?? []).some((a) => a.result !== 'correct' && after(a.at)) || (p.grades ?? []).some((g) => g.result !== 'pass' && after(g.at));
  if (wrong) reasons.push('wrong');
  if (Object.values(p.hints ?? {}).some((at) => after(at))) reasons.push('hints');
  return reasons;
}

/** 这道题最近一次有动静的时间（作答、提示、批改、没把握），复习列表按它排序。 */
export function lastActivity(p: ProblemProgress | undefined): number {
  const times = [
    ...(p?.attempts ?? []).map((a) => a.at),
    ...Object.values(p?.hints ?? {}),
    ...(p?.grades ?? []).map((g) => g.at),
    p?.unsureAt,
  ]
    .map((at) => (at ? Date.parse(at) : Number.NaN))
    .filter((t) => !Number.isNaN(t));
  return Math.max(0, ...times);
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
