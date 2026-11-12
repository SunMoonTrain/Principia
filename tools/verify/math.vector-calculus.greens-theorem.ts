// 独立验算 math.vector-calculus.greens-theorem 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.greens-theorem.ts
// 不用格林公式：沿边界逐段直接算曲线积分（折线求和加理查森外推），不化成区域上的二重积分。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { dot, integrate, polylineSum, richardson, type Vec } from './math.vector-calculus._vc.ts';

const work = (F: (p: Vec) => Vec, r: (t: number) => Vec, t0 = 0, t1 = 1): number =>
  richardson((n) => polylineSum(r, t0, t1, n, (p, d) => dot(F(p), d)), 2000);
/** 依次走过的顶点围成的多边形边界上的 ∮F·dr。 */
const polygon = (F: (p: Vec) => Vec, vs: Vec[]): number =>
  vs.reduce((s, a, i) => {
    const b = vs[(i + 1) % vs.length];
    return s + work(F, (t) => a.map((ai, k) => ai + t * (b[k] - ai)));
  }, 0);

export const verification: Verification = {
  lesson: 'math.vector-calculus.greens-theorem',
  notes: {
    p1: '沿矩形的四条边逆时针直接算 ∮x dy（F = (0, x)）。',
    p2: '半径 2 的圆 (2cos t, 2sin t) 切成折线，直接累加 −y Δx + 3x Δy。',
    p3: '沿三角形三条边逆时针直接算 ∮xy dx + x² dy。',
    p4: '四条边上各用外法向，对 F·n 沿边做一元数值积分再相加。',
  },
  compute() {
    const p1 = polygon(([x]) => [0, x], [[0, 0], [2, 0], [2, 3], [0, 3]]);
    const p2 = work(([x, y]) => [-y, 3 * x], (t) => [2 * Math.cos(t), 2 * Math.sin(t)], 0, 2 * Math.PI);
    const p3 = polygon(([x, y]) => [x * y, x * x], [[0, 0], [1, 0], [0, 1]]);
    const F4 = ([x, y]: Vec): Vec => [x * y * y, x * x * y];
    const p4 =
      integrate((y) => dot(F4([1, y]), [1, 0]), 0, 1) +
      integrate((y) => dot(F4([0, y]), [-1, 0]), 0, 1) +
      integrate((x) => dot(F4([x, 1]), [0, 1]), 0, 1) +
      integrate((x) => dot(F4([x, 0]), [0, -1]), 0, 1);
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
