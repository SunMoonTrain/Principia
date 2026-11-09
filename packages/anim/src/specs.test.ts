import { describe, expect, it } from 'vitest';
import { SPECS } from './specs.ts';

/** 结构检查 + 内容检查，返回所有问题的「路径：消息」。 */
function problems(component: string, params: Record<string, unknown>, sliders: string[] = []): string[] {
  const spec = SPECS[component];
  const parsed = spec.schema.safeParse(params);
  if (!parsed.success) return parsed.error.issues.map((i) => `${i.path.join('.')}：${i.message}`);
  return spec.check(parsed.data as never, sliders).map((i) => `${i.path.join('.')}：${i.message}`);
}

describe('第一批组件的参数检查', () => {
  it('function-plot：至少一条曲线或数列；式子的变量是 x 或 n；n 从小写到大', () => {
    const range = { x: [0, 10], y: [0, 1] };
    expect(problems('function-plot', { range, functions: [{ expr: '1 - eps' }], sequences: [{ expr: '1/n', n: [1, 10] }] }, ['eps'])).toEqual([]);
    expect(problems('function-plot', { range })).toEqual(['：functions 和 sequences 至少要有一种']);
    expect(problems('function-plot', { range, functions: [{ expr: 'n^2' }] })).toEqual(['functions.0.expr：不认识的名字「n」']);
    expect(problems('function-plot', { range, sequences: [{ expr: '1/n', n: [10, 1] }] })).toEqual(['sequences.0.n：n 要从小写到大，最多画 5000 项']);
    expect(problems('function-plot', { range, sequences: [{ expr: '1/n', n: [2, 10], step: 2 }] })).toEqual([]);
    expect(problems('function-plot', { range, sequences: [{ expr: '1/n', n: [2, 10], step: 0 }] })[0]).toMatch(/^sequences\.0\.step/);
    expect(problems('function-plot', { range, sequences: [{ expr: '1/n', n: [2, 10], step: 1.5 }] })[0]).toMatch(/^sequences\.0\.step/);
    expect(problems('function-plot', { range: { x: [1, 0], y: [0, 1] }, functions: [{ expr: 'x' }] })).toEqual(['range.x：范围要从小写到大，如 [-3, 3]']);
    expect(problems('function-plot', { range, functions: ['x'] })[0]).toMatch(/^functions\.0/);
    expect(SPECS['function-plot'].reserved({} as never)).toEqual(['x', 'n']);
  });

  it('phase-portrait：恰好两个状态变量，不能叫 t；range 的键和 system 一样；式子能用 t', () => {
    const ok = { system: { q: 'p', p: '-sin(q) + cos(t)' }, range: { q: [-3, 3], p: [-2, 2] }, dt: 0.01 };
    expect(problems('phase-portrait', ok)).toEqual([]);
    expect(problems('phase-portrait', { ...ok, system: { x: 'y', y: 'z', z: 'x' } })).toEqual(['system：system 要恰好两个状态变量，这里是 3 个']);
    expect(problems('phase-portrait', { ...ok, system: { t: 'x', x: 't' }, range: { t: [0, 1], x: [0, 1] } })).toEqual(['system：状态变量不能叫 t（t 是时间）']);
    expect(problems('phase-portrait', { ...ok, range: { x: [-3, 3], y: [-2, 2] } })).toEqual(['range：range 的键要和 system 的一样（q、p）']);
    expect(problems('phase-portrait', { ...ok, dt: 0 })[0]).toMatch(/^dt/);
    expect(SPECS['phase-portrait'].reserved(ok as never)).toEqual(['q', 'p']);
  });

  it('vector-field-2d：分量的变量是 x、y、t 和滑块；粒子数 1–2000', () => {
    const ok = { field: { x: '-y', y: 'x + a' }, range: { x: [-3, 3], y: [-3, 3] }, dt: 0.02 };
    expect(problems('vector-field-2d', ok, ['a'])).toEqual([]);
    expect(problems('vector-field-2d', ok)).toEqual(['field.y：不认识的名字「a」']);
    expect(problems('vector-field-2d', { ...ok, particles: 5000 }, ['a'])[0]).toMatch(/^particles/);
  });

  it('oscillator：弹簧比物块多 1 根，初始位移和物块一样多；质量为正，劲度系数和阻尼不为负', () => {
    const ok = { masses: [1, 'm'], springs: [1, 'k', 0], initial: [1, 0], damping: 0.1, dt: 0.01 };
    expect(problems('oscillator', ok, ['m', 'k'])).toEqual([]);
    expect(problems('oscillator', { ...ok, springs: [1, 1] }, ['m'])).toEqual(['springs：2 个物块要写 3 根弹簧（从左墙到右墙），这里是 2 根']);
    expect(problems('oscillator', { ...ok, initial: [1] }, ['m', 'k'])).toEqual(['initial：2 个物块要写 2 个初始位移，这里是 1 个']);
    expect(problems('oscillator', { ...ok, masses: [0, 1] }, ['k'])).toEqual(['masses.0：质量必须大于 0']);
    expect(problems('oscillator', { ...ok, springs: [1, -1, 0], damping: -1 }, ['m'])).toEqual([
      'springs.1：劲度系数不能是负数（写 0 表示不连）',
      'damping：阻尼系数不能是负数',
    ]);
  });
});
