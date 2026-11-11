import { describe, expect, it } from 'vitest';
import { formatSliderValue, formatTick } from './kit.tsx';

describe('滑块旁边显示的数', () => {
  it('位数按 step 和 min 里小数位多的那个：step 0.25 显示两位，min 0.55、step 0.1 也显示两位', () => {
    expect(formatSliderValue(0.75, { min: -6, step: 0.25 })).toBe('0.75');
    expect(formatSliderValue(0.55 + 3 * 0.1, { min: 0.55, step: 0.1 })).toBe('0.85');
    expect(formatSliderValue(0.4, { min: 0.2, step: 0.05 })).toBe('0.40');
    expect(formatSliderValue(3, { min: 0, step: 1 })).toBe('3');
  });

  it('负数用减号 −，舍入出来的负零不带符号', () => {
    expect(formatSliderValue(-0.5, { min: -1, step: 0.1 })).toBe('−0.5');
    expect(formatSliderValue(-1e-17, { min: -1, step: 0.05 })).toBe('0.00');
  });
});

describe('坐标轴的刻度数字', () => {
  it('小数位跟着间隔走，负数用减号 −', () => {
    expect(formatTick(2, 1)).toBe('2');
    expect(formatTick(-0.5, 0.5)).toBe('−0.5');
    expect(formatTick(0.25, 0.05)).toBe('0.25');
  });

  it('一格格加出来的 0 可能是很小的负数，显示成 0，不带负号', () => {
    // 从 −0.9 起每次加 0.3，第三格是 −1.1e-16，不正好是 0
    let x = -0.9;
    for (let k = 0; k < 3; k++) x += 0.3;
    expect(x).toBeLessThan(0);
    expect(formatTick(x, 0.3)).toBe('0.0');
    expect(formatTick(-1e-17, 0.5)).toBe('0.0');
    expect(formatTick(-1e-17, 1)).toBe('0');
    expect(formatTick(-0, 1)).toBe('0');
  });
});
