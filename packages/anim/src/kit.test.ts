import { describe, expect, it } from 'vitest';
import { formatSliderValue } from './kit.tsx';

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
