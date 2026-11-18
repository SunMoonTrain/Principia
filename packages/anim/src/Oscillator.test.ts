import { describe, expect, it } from 'vitest';
import { compile, mechanismLayout, referenceAmplitude } from './Oscillator.tsx';

describe('Oscillator 的画面比例', () => {
  const slider = (name: string, min: number, max: number, value: number) => ({ name, min, max, step: 0.1, default: value, label: name });

  it('参考振幅取滑块范围里初始位移的最大值：拖控制振幅的滑块时看得出变化', () => {
    const params = { masses: [1, 1], springs: [1, 'k', 1], initial: ['A', 0], dt: 0.01, sliders: [slider('A', 0.2, 2, 1), slider('k', 0, 3, 1)] };
    const compiled = compile(params);
    if (typeof compiled === 'string') throw new Error(compiled);
    expect(referenceAmplitude(compiled, params.sliders)).toBe(2);
  });

  it('初始位移都是 0 时按 1 算', () => {
    const params = { masses: [1], springs: [1, 1], initial: [0], dt: 0.01 };
    const compiled = compile(params);
    if (typeof compiled === 'string') throw new Error(compiled);
    expect(referenceAmplitude(compiled, [])).toBe(1);
  });

  it('相邻两个物块反向、都偏到参考振幅时不叠在一起（手机到宽屏，1 到 8 个物块）', () => {
    for (const width of [320, 375, 560, 768, 1100]) {
      for (let n = 1; n <= 8; n++) {
        const amplitude = 1.7;
        const { gap, bw, scale } = mechanismLayout(width, n, amplitude);
        // 左边的往右偏、右边的往左偏，各偏一个参考振幅
        const closest = gap - 2 * amplitude * scale;
        expect(closest).toBeGreaterThan(bw);
      }
    }
  });
});
