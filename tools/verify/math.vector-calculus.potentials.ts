// 独立验算 math.vector-calculus.potentials 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.potentials.ts
// 标量势一律按定义 U(P) = −∫_0^P F·dr 沿折线累加，再换一条弯的路核对路径无关；
// 旋度用小圆环量除以面积；p4 按讲解的构造逐点数值积分出 A₁，χ 由 ∫(A₁ − A₂)·dr 沿两条路核对。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { circulationDensity, cross, dot, integrate, jacobian, polylineSum, richardson, type Vec } from './math.vector-calculus._vc.ts';

const work = (F: (p: Vec) => Vec, r: (t: number) => Vec, t0 = 0, t1 = 1): number =>
  richardson((n) => polylineSum(r, t0, t1, n, (p, d) => dot(F(p), d)), 2000);
/** 从原点到 P：线段和一条弯的路各算一次 ∫F·dr，核对相等，返回线段上的值。 */
function lineIntegralChecked(F: (p: Vec) => Vec, P: Vec, label: string): number {
  const straight = work(F, (t) => P.map((v) => v * t));
  const curved = work(F, (t) => [P[0] * t, P[1] * t * t, P[2] * t ** 3]);
  if (Math.abs(straight - curved) > 1e-8) throw new Error(label + '：两条路的积分不同');
  return straight;
}

export const verification: Verification = {
  lesson: 'math.vector-calculus.potentials',
  notes: {
    p1: 'U(1, 2, 2) = −∫F·dr，从原点沿线段和沿 (t, 2t², 2t³) 各算一次核对。',
    p2: '在 (1, 2, 3) 处用绕 x、y、z 轴的小圆环量除以面积。',
    p3: '先在两点用中心差分核对旋度为零；U(1, 2, 3) = −∫F·dr，沿线段和沿 (t, 2t², 3t³) 各算一次核对。',
    p4: 'A₁ 按讲解的式子（x₀ = y₀ = 0）逐点数值积分，核对 ∇ × A₁ = G；χ = ∫(A₁ − A₂)·dr 沿两条路核对。',
  },
  compute() {
    // p1
    const F1 = ([x, y, z]: Vec): Vec => [2 * x, 2 * y, 2 * z];
    const p1 = -lineIntegralChecked(F1, [1, 2, 2], 'p1');

    // p2
    const A2f = ([x, , z]: Vec): Vec => [0, x * z, 0];
    const P2: Vec = [1, 2, 3];
    const p2: Vec = [
      circulationDensity(A2f, P2, [1, 0, 0]),
      circulationDensity(A2f, P2, [0, 1, 0]),
      circulationDensity(A2f, P2, [0, 0, 1]),
    ];

    // p3
    const F3 = ([x, y, z]: Vec): Vec => [y + z, x + z, x + y];
    for (const q of [
      [0.3, -1.2, 2.1],
      [1.7, 0.4, -0.6],
    ]) {
      const J = jacobian(F3, q);
      const c = [J[2][1] - J[1][2], J[0][2] - J[2][0], J[1][0] - J[0][1]];
      if (Math.hypot(...c) > 1e-8) throw new Error('p3：旋度不为零');
    }
    const p3 = -lineIntegralChecked(F3, [1, 2, 3], 'p3');

    // p4
    const G = ([, ,]: Vec): Vec => [0, 0, 2];
    const A1 = ([x, y, z]: Vec): Vec => [
      0,
      integrate((t) => G([t, y, z])[2], 0, x),
      -integrate((t) => G([t, y, z])[1], 0, x) + integrate((s) => G([0, s, z])[0], 0, y),
    ];
    const Jc = jacobian(A1, [0.7, -0.4, 1.3]);
    const curlA1 = [Jc[2][1] - Jc[1][2], Jc[0][2] - Jc[2][0], Jc[1][0] - Jc[0][1]];
    if (Math.hypot(...curlA1.map((v, i) => v - G([0.7, -0.4, 1.3])[i])) > 1e-6) throw new Error('p4：A₁ 的旋度不等于 G');
    const A2 = (p: Vec): Vec => cross(G(p), p).map((v) => v / 2);
    const D = (p: Vec): Vec => A1(p).map((v, i) => v - A2(p)[i]);
    const p4 = lineIntegralChecked(D, [2, 3, 1], 'p4');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
