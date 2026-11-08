import { describe, expect, it } from 'vitest';
import { compile, referenceAmplitude } from './Oscillator.tsx';

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
});
