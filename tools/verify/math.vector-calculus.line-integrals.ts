// 独立验算 math.vector-calculus.line-integrals 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.line-integrals.ts
// 不把曲线积分化成定积分：把曲线切成内接折线，每段取中点，累加 f·(这一段的长度) 或 F·(这一段的位移)，再做理查森外推。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { dot, norm, polylineSum, richardson, type Vec } from './math.vector-calculus._vc.ts';

/** ∫_C f ds：折线上累加 f(中点)·段长。 */
const scalar = (f: (p: Vec) => number, r: (t: number) => Vec, t0: number, t1: number): number =>
  richardson((n) => polylineSum(r, t0, t1, n, (p, d) => f(p) * norm(d)), 2000);
/** ∫_C F·dr：折线上累加 F(中点)·位移。 */
const work = (F: (p: Vec) => Vec, r: (t: number) => Vec, t0: number, t1: number): number =>
  richardson((n) => polylineSum(r, t0, t1, n, (p, d) => dot(F(p), d)), 2000);

export const verification: Verification = {
  lesson: 'math.vector-calculus.line-integrals',
  notes: {
    p1: '线段 (3t, 4t) 切成折线，累加 (x + y)·段长。',
    p2: '曲线 (t, t²) 切成折线，累加 F(中点)·位移。',
    p3: '单位圆 (cos t, sin t) 逆时针切成折线，累加 F(中点)·位移。',
    p4: '曲线 (t, t³) 切成折线，累加 y·Δx + x²·Δy（即 F = (y, x²)）。',
  },
  compute() {
    const p1 = scalar(([x, y]) => x + y, (t) => [3 * t, 4 * t], 0, 1);
    const p2 = work(([x, y]) => [y * y, x], (t) => [t, t * t], 0, 1);
    const p3 = work(([x, y]) => [-3 * y, x * x], (t) => [Math.cos(t), Math.sin(t)], 0, 2 * Math.PI);
    const p4 = work(([x, y]) => [y, x * x], (t) => [t, t ** 3], 0, 1);
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
