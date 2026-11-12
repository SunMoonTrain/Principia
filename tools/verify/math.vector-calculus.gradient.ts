// 独立验算 math.vector-calculus.gradient 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.gradient.ts
// 方向导数按定义沿直线差分，不用「梯度点乘方向」；最大方向导数在各个方向上搜；切线由解出的隐函数差分得到。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { argMin, bisect, derivative, grad, type Fn } from './math.vector-calculus._vc.ts';

/** 按定义求方向导数：沿 a + t u 对 t 中心差分。 */
const directional = (f: Fn, a: number[], u: number[]): number => derivative((t) => f([a[0] + t * u[0], a[1] + t * u[1]]), 0);

export const verification: Verification = {
  lesson: 'math.vector-calculus.gradient',
  notes: {
    p1: '中心差分求两个偏导数，在 (2,1) 处。',
    p2: '按定义沿 (2,1) + t(3/5, 4/5) 对 t 求导。',
    p3: '方向角每 0.1° 取一个单位向量，按定义求方向导数，取最大的再用黄金分割法细化。',
    p4: '对 x = 1 ± h 用二分法解出曲线上 y 的值，中心差分得斜率 k，m = 2 − k。',
  },
  compute() {
    // p1
    const f1: Fn = ([x, y]) => x * x * y - 3 * y * y;
    const p1 = grad(f1, [2, 1]);

    // p2
    const f2: Fn = ([x, y]) => x * y * y;
    const p2 = directional(f2, [2, 1], [3 / 5, 4 / 5]);

    // p3
    const f3: Fn = ([x, y]) => Math.log(x * x + y * y);
    const along = (th: number): number => directional(f3, [3, 4], [Math.cos(th), Math.sin(th)]);
    const steps = 3600;
    let best = 0;
    for (let k = 1; k < steps; k++) if (along((2 * Math.PI * k) / steps) > along((2 * Math.PI * best) / steps)) best = k;
    const h = (2 * Math.PI) / steps;
    const p3 = along(argMin((th) => -along(th), best * h - h, best * h + h));

    // p4
    const F = (x: number, y: number): number => x ** 3 + y ** 3 - 9;
    const yOf = (x: number): number => bisect((y) => F(x, y), 1.5, 2.5);
    if (Math.abs(yOf(1) - 2) > 1e-12) throw new Error('p4：曲线不过 (1,2)');
    const k = derivative(yOf, 1);
    const p4 = [k, 2 - k];

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
