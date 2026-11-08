import { describe, expect, it } from 'vitest';
import {
  applyOp,
  EMPTY_PROGRESS,
  firstResult,
  hintsBeforeFirstCorrect,
  hintsShown,
  localTimestamp,
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
});
