import { expect, it } from 'vitest';
import { judgeNumeric, judgeSequence } from './judge.ts';
import type { Answer } from './content-types.ts';

it.each([
  [127, '127', true], [127, '0x7f', true], [127, '0b1111111', true], [127, '126.9999', false],
  [127, '0X7F', true], [11, '０Ｂ１０１１', true], [-16, '-0O20', true],
  [0x7fc00000, '2143289344', true], [0x7fc00000, '2143289345', false],
] as const)('整数 %s 与 %s 精确比较', (value, input, correct) => {
  expect(judgeNumeric({ type: 'number', source: String(value), value, exact: true, unit: null }, null, input)).toEqual({ kind: 'graded', correct });
});
it('整数格式错误只提示；数对保序、集合保留重数', () => {
  const data = { source: ['1', '1', '2'], value: [1, 1, 2], exact: true, unit: null } as const;
  const set: Extract<Answer, { type: 'tuple' | 'set' }> = { ...data, source: [...data.source], value: [...data.value], type: 'set' };
  expect(judgeNumeric({ type: 'number', value: 127, source: '127', exact: true, unit: null }, null, 'abc').kind).toBe('format');
  expect(judgeNumeric(set, null, '2,1,1')).toEqual({ kind: 'graded', correct: true });
  expect(judgeNumeric(set, null, '2,1,2')).toEqual({ kind: 'graded', correct: false });
  expect(judgeNumeric({ ...set, type: 'tuple' }, null, '2,1,1')).toEqual({ kind: 'graded', correct: false });
});
const sequence = { type: 'sequence', value: ['A', 'B', 'D'], alphabet: ['A', 'B', 'C', 'D'] } as const;
it.each(['Ａ　Ｂ　Ｄ', 'ａ－＞ｂ，ｄ', 'a b d', 'A, B, D', 'A→B→D', 'A，B，D', 'A、B->D', 'A, D, B', 'A, B', 'A,B,X'])('序列 %s', (input) => {
  const result = judgeSequence({ ...sequence, value: [...sequence.value], alphabet: [...sequence.alphabet] }, input);
  if (input.endsWith('X')) expect(result.kind).toBe('format');
  else expect(result).toEqual({ kind: 'graded', correct: !['A, D, B', 'A, B'].includes(input) });
});
it('区分大小写时小写记号不能匹配大写', () => {
  expect(judgeSequence({ type: 'sequence', value: ['A'], caseSensitive: true }, 'a')).toEqual({ kind: 'graded', correct: false });
  expect(judgeSequence({ type: 'sequence', value: ['A'], caseSensitive: true }, 'Ａ')).toEqual({ kind: 'graded', correct: true });
  expect(judgeSequence({ type: 'sequence', value: ['A'], caseSensitive: true }, 'ａ')).toEqual({ kind: 'graded', correct: false });
});
