import { describe, expect, it } from 'vitest';
import type { Answer, Tolerance } from './content-types.ts';
import { judgeChoice, judgeNumeric, splitList } from './judge.ts';

const DEFAULT: Tolerance = { rel: 1e-3, abs: 1e-9 };
const num = (value: number): Extract<Answer, { type: 'number' }> => ({ type: 'number', value, source: String(value), unit: null });
const list = (type: 'tuple' | 'set', value: number[]): Extract<Answer, { type: 'tuple' | 'set' }> => ({
  type,
  value,
  source: value.map(String),
  unit: null,
});
const choice = (multiple: boolean, value: number[]): Extract<Answer, { type: 'choice' }> => ({ type: 'choice', multiple, options: [], value });

// plan.md「测试用例与验收 / 判题」（标准答案 0.5，默认容差）
describe('判题用例表', () => {
  it.each([
    ['1/2', true],
    ['0.5004', true],
    ['0.51', false],
  ])('标准答案 0.5，输入 %s → %s', (input, correct) => {
    expect(judgeNumeric(num(0.5), DEFAULT, input)).toEqual({ kind: 'graded', correct });
  });

  it('输入 abc 只提示格式，不算尝试', () => {
    expect(judgeNumeric(num(0.5), DEFAULT, 'abc')).toMatchObject({ kind: 'format' });
  });

  it('标准答案 1.5708，输入 pi/2 → 对', () => {
    expect(judgeNumeric(num(1.5708), DEFAULT, 'pi/2')).toEqual({ kind: 'graded', correct: true });
  });

  it('标准答案 0，输入 1e-12 → 对（绝对容差兜底）', () => {
    expect(judgeNumeric(num(0), DEFAULT, '1e-12')).toEqual({ kind: 'graded', correct: true });
  });
});

describe('number', () => {
  it.each(['2 s', 'sqrt(-1)', '1,5', '', '   ', '1/0'])('「%s」是格式错误', (input) => {
    expect(judgeNumeric(num(0.5), DEFAULT, input).kind).toBe('format');
  });

  it('题目自带的容差', () => {
    const answer = num(2 * Math.PI * Math.sqrt(1 / 9.8));
    expect(judgeNumeric(answer, { rel: 5e-3, abs: 1e-9 }, '2.01')).toEqual({ kind: 'graded', correct: true });
    expect(judgeNumeric(answer, DEFAULT, '2.01')).toEqual({ kind: 'graded', correct: false });
  });

  it('√3、全角括号也认', () => {
    expect(judgeNumeric(num(Math.sqrt(3)), DEFAULT, '√3')).toEqual({ kind: 'graded', correct: true });
    expect(judgeNumeric(num(Math.sqrt(3)), DEFAULT, 'sqrt（3）')).toEqual({ kind: 'graded', correct: true });
  });
});

describe('tuple', () => {
  const answer = list('tuple', [-1, 1]);
  it.each([
    ['-1, 1', true],
    ['(-1, 1)', true],
    ['－1，1', true],
    ['1, -1', false],
  ])('「%s」→ %s', (input, correct) => {
    expect(judgeNumeric(answer, DEFAULT, input)).toEqual({ kind: 'graded', correct });
  });

  it('个数不对是格式错误', () => {
    expect(judgeNumeric(answer, DEFAULT, '-1')).toMatchObject({ kind: 'format', message: expect.stringContaining('2 个数') });
  });

  it('括号里的逗号不拆', () => {
    expect(splitList('nthRoot(8, 3), 1')).toEqual(['nthRoot(8, 3)', '1']);
    expect(splitList('(1)+(2), 3')).toEqual(['(1)+(2)', '3']);
  });

  it('某个分量写错时指出是第几个', () => {
    expect(judgeNumeric(answer, DEFAULT, '-1, abc')).toMatchObject({ kind: 'format', message: expect.stringContaining('第 2 个数') });
  });
});

describe('set（多重集合）', () => {
  it.each([
    ['3, -3', true],
    ['{-3, 3}', true],
    ['3, 3', false],
  ])('标准答案 {-3, 3}，「%s」→ %s', (input, correct) => {
    expect(judgeNumeric(list('set', [-3, 3]), DEFAULT, input)).toEqual({ kind: 'graded', correct });
  });

  it('重复的元素要重复写', () => {
    const answer = list('set', [1, 1, 2]);
    expect(judgeNumeric(answer, DEFAULT, '1, 2, 1')).toEqual({ kind: 'graded', correct: true });
    expect(judgeNumeric(answer, DEFAULT, '1, 2, 2')).toEqual({ kind: 'graded', correct: false });
    expect(judgeNumeric(answer, DEFAULT, '1, 2').kind).toBe('format');
  });
});

describe('choice', () => {
  it('多选：选项相同就对，不管点的顺序', () => {
    expect(judgeChoice(choice(true, [1, 4]), [4, 1])).toEqual({ kind: 'graded', correct: true });
    expect(judgeChoice(choice(true, [1, 4]), [1])).toEqual({ kind: 'graded', correct: false });
  });

  it('什么都没选、单选选了两个，是格式错误', () => {
    expect(judgeChoice(choice(true, [1, 4]), []).kind).toBe('format');
    expect(judgeChoice(choice(false, [2]), [1, 2]).kind).toBe('format');
    expect(judgeChoice(choice(false, [2]), [2])).toEqual({ kind: 'graded', correct: true });
  });
});
