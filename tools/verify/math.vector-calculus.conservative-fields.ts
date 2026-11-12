// 独立验算 math.vector-calculus.conservative-fields 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.conservative-fields.ts
// 不用「势函数在终点、起点的差」：功一律沿曲线切成折线直接累加（理查森外推），并且换一条路径再算一次核对；
// p2 不用交叉偏导数相等的判别法，看沿闭曲线的环量是否为 0。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { dot, polylineSum, richardson, type Vec } from './math.vector-calculus._vc.ts';

const work = (F: (p: Vec) => Vec, r: (t: number) => Vec, t0 = 0, t1 = 1): number =>
  richardson((n) => polylineSum(r, t0, t1, n, (p, d) => dot(F(p), d)), 2000);

export const verification: Verification = {
  lesson: 'math.vector-calculus.conservative-fields',
  notes: {
    p1: '沿线段 (2t, −t) 和沿曲线 (2t, −t² + sin πt) 各算一次功，核对相等，取前者。',
    p2: '沿以 (0.3, −0.2) 为圆心、半径 1 的圆逆时针算环量；对 k = 0、1 各算一次，环量是 k 的一次函数，解出为 0 的 k。',
    p3: '从原点沿线段到 (1,1,2) 算功；再沿 (t, t², 2t³) 算一次核对。',
    p4: '沿题给曲线切成折线直接累加 F·Δr。',
  },
  compute() {
    // p1
    const F1 = ([x, y]: Vec): Vec => [2 * x * y, x * x + 3 * y * y];
    const p1 = work(F1, (t) => [2 * t, -t]);
    if (Math.abs(work(F1, (t) => [2 * t, -t * t + Math.sin(Math.PI * t)]) - p1) > 1e-8) throw new Error('p1：两条路径的功不同');

    // p2
    const circ = (k: number): number =>
      work(([x, y]) => [3 * x * x + k * y, 2 * x + 4 * y], (t) => [0.3 + Math.cos(t), -0.2 + Math.sin(t)], 0, 2 * Math.PI);
    const p2 = -circ(0) / (circ(1) - circ(0));

    // p3
    const F3 = ([x, y, z]: Vec): Vec => [y * z, x * z, x * y + 2 * z];
    const p3 = work(F3, (t) => [t, t, 2 * t]);
    if (Math.abs(work(F3, (t) => [t, t * t, 2 * t ** 3]) - p3) > 1e-8) throw new Error('p3：两条路径的功不同');

    // p4
    const p4 = work(([, y, z]) => [1, z, y], (t) => [t * Math.cos(Math.PI * t), t * t, Math.exp(t) - 1]);

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
