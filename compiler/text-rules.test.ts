import { describe, expect, it } from 'vitest';
import { countChars, hasPrecisionRequirement } from './text-rules.ts';

describe('字数规则', () => {
  it.each([
    ['实数轴上没有洞', 7],
    ['  实数轴上没有洞  ', 7],
    ['有上界的非空实数集的最小上界，记作$\\sup A$。', 19],
    ['Hilbert 空间', 3],
    ['第 2 层', 3],
    ['x2 与 abc', 3],
    ['$a$、$b$', 3],
  ])('「%s」算 %d 字', (text, n) => {
    expect(countChars(text)).toBe(n);
  });
});

describe('精度要求', () => {
  it.each(['结果保留三位有效数字', '保留 3 位小数', '保留两位', '答案取 4 位有效数字', '精确到 0.01'])('「%s」算写了精度要求', (s) => {
    expect(hasPrecisionRequirement(s)).toBe(true);
  });

  it.each(['求$\\sup A$', '保留原式', '三位数'])('「%s」不算', (s) => {
    expect(hasPrecisionRequirement(s)).toBe(false);
  });
});
