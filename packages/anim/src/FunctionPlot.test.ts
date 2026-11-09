import { describe, expect, it } from 'vitest';
import { isTerm, termsIn } from './FunctionPlot.tsx';

describe('FunctionPlot 的数列画哪些项', () => {
  it('没写 step 时逐项画，只画横轴范围里的', () => {
    expect(termsIn({ expr: '1/n', n: [1, 40] }, 0, 6.5)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(termsIn({ expr: '1/n', n: [1, 40] }, 37.2, 50)).toEqual([38, 39, 40]);
  });

  it('step: 2 隔一项画一个：从 2 起是偶数项，从 1 起是奇数项；横轴从中间开始时对齐到数列的项', () => {
    expect(termsIn({ expr: '1/n', n: [2, 12], step: 2 }, 0, 100)).toEqual([2, 4, 6, 8, 10, 12]);
    expect(termsIn({ expr: '1/n', n: [1, 11], step: 2 }, 4.5, 100)).toEqual([5, 7, 9, 11]);
    expect(termsIn({ expr: '1/n', n: [2, 12], step: 2 }, 5, 9)).toEqual([6, 8]);
  });

  it('鼠标所在的 n 是不是画出来的一项', () => {
    const even = { expr: '1/n', n: [2, 12] as [number, number], step: 2 };
    expect([1, 2, 3, 12, 13, 14].map((n) => isTerm(even, n))).toEqual([false, true, false, true, false, false]);
    expect(isTerm({ expr: '1/n', n: [1, 40] }, 7)).toBe(true);
  });
});
