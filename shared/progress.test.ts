import { describe, expect, it } from 'vitest';
import {
  applyOp,
  EMPTY_PROGRESS,
  firstResult,
  hintsBeforeFirstCorrect,
  hintsShown,
  laterTimestamp,
  latestGrade,
  localTimestamp,
  problemStatus,
  reviewReasons,
  solutionUnlocked,
  type ProgressOp,
  type ProgressState,
} from './progress.ts';

const L = 'math.analysis.completeness';
const attempt = (id: string, at: string, result: 'correct' | 'wrong' | 'gave-up', input = 'x'): ProgressOp => ({
  type: 'attempt',
  lesson: L,
  problem: 'p1',
  attempt: { id, at, input, result },
});
const run = (ops: ProgressOp[], start: ProgressState = EMPTY_PROGRESS): ProgressState => ops.reduce(applyOp, start);

describe('合并规则', () => {
  it('作答按 id 去重：补交重发不会重复计次', () => {
    const a = attempt('aaaaaaaa', '2026-11-08T15:41:02+08:00', 'wrong');
    expect(run([a, a, a]).problems[L].p1.attempts).toHaveLength(1);
  });

  it('作答按时间排序，不管到达顺序（时区不同也按真实时间比）', () => {
    const state = run([
      attempt('bbbbbbbb', '2026-11-08T15:42:30+08:00', 'correct'),
      attempt('aaaaaaaa', '2026-11-08T07:41:02Z', 'wrong'),
    ]);
    expect(state.problems[L].p1.attempts!.map((a) => a.id)).toEqual(['aaaaaaaa', 'bbbbbbbb']);
    expect(firstResult(state.problems[L].p1)).toBe('wrong');
  });

  it('每级提示取最早的时间；第一次打开取最早', () => {
    const state = run([
      { type: 'hint', lesson: L, problem: 'p1', level: 1, at: '2026-11-08T15:45:00+08:00' },
      { type: 'hint', lesson: L, problem: 'p1', level: 1, at: '2026-11-08T15:40:00+08:00' },
      { type: 'lesson-open', lesson: L, at: '2026-11-08T15:30:00+08:00' },
      { type: 'lesson-open', lesson: L, at: '2026-11-08T15:00:00+08:00' },
    ]);
    expect(state.problems[L].p1.hints![1]).toBe('2026-11-08T15:40:00+08:00');
    expect(state.lessons[L].startedAt).toBe('2026-11-08T15:00:00+08:00');
  });

  it('学完、撤销：取时间较新的（晚到的旧操作不会盖掉新的）', () => {
    const state = run([
      { type: 'lesson-status', lesson: L, status: 'none', at: '2026-11-08T16:20:00+08:00' },
      { type: 'lesson-status', lesson: L, status: 'completed', at: '2026-11-08T16:10:00+08:00' },
    ]);
    expect(state.lessons[L]).toMatchObject({ status: 'none', statusAt: '2026-11-08T16:20:00+08:00' });
  });
});

describe('由记录算出来的统计', () => {
  it('答对前用到第几级提示：只算第一次答对之前点开的', () => {
    const state = run([
      { type: 'hint', lesson: L, problem: 'p1', level: 1, at: '2026-11-08T15:41:00+08:00' },
      attempt('aaaaaaaa', '2026-11-08T15:42:00+08:00', 'correct'),
      { type: 'hint', lesson: L, problem: 'p1', level: 2, at: '2026-11-08T15:43:00+08:00' },
    ]);
    const p = state.problems[L].p1;
    expect(hintsShown(p)).toBe(2);
    expect(hintsBeforeFirstCorrect(p)).toBe(1);
    expect(solutionUnlocked(p)).toBe(true);
  });

  it('还没答对时没有「答对前」的提示级数', () => {
    expect(hintsBeforeFirstCorrect(run([attempt('aaaaaaaa', '2026-11-08T15:42:00+08:00', 'wrong')]).problems[L].p1)).toBeNull();
  });
});

describe('localTimestamp', () => {
  it('写成本地时间加时区，能被解析回同一时刻', () => {
    const now = new Date('2026-11-08T07:30:12Z');
    const text = localTimestamp(now);
    expect(text).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    expect(Date.parse(text)).toBe(now.getTime());
  });

  it('laterTimestamp：同一秒里连点两下，第二下的时间也更晚', () => {
    const now = new Date('2026-11-08T07:30:12.400Z');
    const first = laterTimestamp(undefined, now);
    expect(Date.parse(first)).toBe(Date.parse('2026-11-08T07:30:12Z'));
    const second = laterTimestamp(first, new Date('2026-11-08T07:30:12.900Z'));
    expect(Date.parse(second)).toBe(Date.parse('2026-11-08T07:30:13Z'));
    // 过了一会儿再点，就用当时的时间
    expect(Date.parse(laterTimestamp(first, new Date('2026-11-08T07:31:00.200Z')))).toBe(Date.parse('2026-11-08T07:31:00Z'));
  });
});

describe('台阶 4：没把握、难题状态、批改记录、复习列表', () => {
  const hard = (op: Record<string, unknown>): ProgressOp => ({ lesson: L, problem: 'p5', ...op }) as ProgressOp;

  it('没把握、难题状态：各自取时间较新的', () => {
    const state = run([
      hard({ type: 'unsure', value: true, at: '2026-11-09T10:02:00+08:00' }),
      hard({ type: 'unsure', value: false, at: '2026-11-09T10:01:00+08:00' }),
      hard({ type: 'problem-status', status: 'ready', at: '2026-11-09T10:40:00+08:00' }),
      hard({ type: 'problem-status', status: 'idea', at: '2026-11-09T10:30:00+08:00' }),
    ]);
    expect(state.problems[L].p5).toMatchObject({ unsure: true, unsureAt: '2026-11-09T10:02:00+08:00', status: 'ready' });
  });

  it('批改记录只追加、按 id 去重；录入时状态改成「已批改」，但盖不过更晚改的状态', () => {
    const grade = hard({ type: 'grade', grade: { id: 'gggggggg-1', at: '2026-11-09T11:05:00+08:00', result: 'partial', comment: '第二步没说明 A+B 非空。' } });
    const state = run([hard({ type: 'problem-status', status: 'ready', at: '2026-11-09T10:40:00+08:00' }), grade, grade]);
    const p = state.problems[L].p5;
    expect(p.grades).toHaveLength(1);
    expect(problemStatus(p)).toBe('graded');
    expect(latestGrade(p)?.result).toBe('partial');
    // 之后又改回「写完待批改」，再收到重发的旧批改记录，状态不变
    const later = run([hard({ type: 'problem-status', status: 'ready', at: '2026-11-09T12:00:00+08:00' }), grade], state);
    expect(problemStatus(later.problems[L].p5)).toBe('ready');
    expect(later.problems[L].p5.grades).toHaveLength(1);
  });

  it('复习列表：没把握、答错过、看过提示；移出以后只看新情况', () => {
    const base = run([
      attempt('aaaaaaaa', '2026-11-09T09:00:00+08:00', 'wrong'),
      attempt('bbbbbbbb', '2026-11-09T09:01:00+08:00', 'correct'),
      { type: 'hint', lesson: L, problem: 'p1', level: 1, at: '2026-11-09T08:59:00+08:00' },
    ]);
    expect(reviewReasons(base.problems[L].p1)).toEqual(['wrong', 'hints']);
    const dismissed = run([{ type: 'review-dismiss', lesson: L, problem: 'p1', at: '2026-11-09T09:30:00+08:00' }], base);
    expect(reviewReasons(dismissed.problems[L].p1)).toEqual([]);
    // 移出以后又标了没把握：回来，原因只有没把握
    const back = run([{ type: 'unsure', lesson: L, problem: 'p1', value: true, at: '2026-11-09T10:00:00+08:00' }], dismissed);
    expect(reviewReasons(back.problems[L].p1)).toEqual(['unsure']);
    // 移出时间取最晚的
    const again = run([{ type: 'review-dismiss', lesson: L, problem: 'p1', at: '2026-11-09T09:00:00+08:00' }], dismissed);
    expect(again.problems[L].p1.reviewDismissedAt).toBe('2026-11-09T09:30:00+08:00');
  });

  it('难题的「答错过」看批改结果：部分、没过算，通过不算', () => {
    const graded = (result: 'pass' | 'partial' | 'fail') =>
      run([hard({ type: 'grade', grade: { id: `g-${result}-0000`, at: '2026-11-09T11:00:00+08:00', result } })]).problems[L].p5;
    expect(reviewReasons(graded('pass'))).toEqual([]);
    expect(reviewReasons(graded('partial'))).toEqual(['wrong']);
    expect(reviewReasons(graded('fail'))).toEqual(['wrong']);
  });

  it('「内容有误」不进进度', () => {
    const issue: ProgressOp = { type: 'issue', issue: { id: 'iiiiiiii', at: '2026-11-09T10:20:00+08:00', lesson: L, part: 'p3 / 解答' } };
    expect(run([issue])).toEqual(EMPTY_PROGRESS);
  });
});
