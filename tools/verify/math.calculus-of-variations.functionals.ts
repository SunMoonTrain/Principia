// 独立验算 math.calculus-of-variations.functionals 的 p1–p4（简单题、中等题）。
// 泛函的值用高斯-勒让德公式数值积分，导数数值地求；最快轨道那题另外直接模拟小球沿斜面滑下；再和手推的结果核对。
// 单独运行：npx tsx tools/verify/math.calculus-of-variations.functionals.ts

import { fileURLToPath } from 'node:url';
import type { Derivative } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, chosen, derivative, integrate, integrateTo } from './math.calculus-of-variations._variational.ts';

const g = 9.8;

export const verification: Verification = {
  lesson: 'math.calculus-of-variations.functionals',
  notes: {
    p1: '对 y = x² 直接数值积分 ∫₀¹ (y′² + xy) dx（y′ 数值求导）；和 4/3 + 1/4 核对。',
    p2: '取一个具体的 y（sin 2x + x），把五条规则各作用一次，看结果是一个数还是一个函数：A、B、D 得到数，C、E 得到 x 的函数。',
    p3: '一是对直线 y = x/2 数值积分讲解里的 T[y]（令 x = s² 去掉起点处的反常）；二是直接模拟小球沿斜面无摩擦地由静止滑下，到 B 的时刻用二分定出。两者核对；和 √(10/g) 核对。',
    p4: '对每个 ε 数值积分 Φ(ε) = 2π∫ y√(1 + y′²) dx（y′ 数值求导），再对 ε 在 0 处数值求导；和 2π∫cos(πx/2) dx = 8 核对。',
  },
  compute() {
    // p1
    const y1 = (x: number): number => x * x;
    const J1 = integrate((x) => derivative(y1, x) ** 2 + x * y1(x), 0, 1);
    const p1 = agree(J1, 4 / 3 + 1 / 4, 'p1 J[x²]');

    // p2：结果是数（number）还是函数
    const y = (x: number): number => Math.sin(2 * x) + x;
    const rules: (() => unknown)[] = [
      () => integrate((x) => Math.sin(y(x)), 0, 1),
      () => y(1) - y(0),
      () => (x: number) => y(x) ** 2,
      () => integrate(y, 0, 1) * integrate((x) => derivative(y, x), 0, 1),
      () => (x: number) => integrate(y, 0, x),
    ];
    const p2 = chosen(rules.map((r) => typeof r() === 'number'));

    // p3：直线 y = x/2 从 (0, 0) 到 (2, 1)
    const line = (x: number): number => x / 2;
    const T = integrate((s) => {
      const x = s * s;
      return (Math.sqrt((1 + derivative(line, x) ** 2) / line(x)) * 2 * s) / Math.sqrt(2 * g);
    }, 0, Math.SQRT2);
    const L = Math.hypot(2, 1);
    const slide: Derivative = (_t, st, out) => {
      out[0] = st[1];
      out[1] = (g * 1) / L; // 沿斜面的加速度 g sinα
    };
    const tSim = bisect((t) => integrateTo(slide, [0, 0], 0, t, t / 1000)[0] - L, 0.1, 3);
    const p3 = agree(agree(T, tSim, 'p3 两种算法', 1e-8), Math.sqrt(10 / g), 'p3 时间');

    // p4
    const Phi = (eps: number): number => {
      const shape = (x: number): number => 1 + eps * Math.cos((Math.PI * x) / 2);
      return 2 * Math.PI * integrate((x) => shape(x) * Math.sqrt(1 + derivative(shape, x) ** 2), -1, 1);
    };
    const p4 = agree(derivative(Phi, 0), 2 * Math.PI * integrate((x) => Math.cos((Math.PI * x) / 2), -1, 1), 'p4 Φ′(0)');
    if (Math.abs(p4 - 8) > 1e-9) throw new Error('p4 2π∫cos(πx/2) dx 不是 8');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
