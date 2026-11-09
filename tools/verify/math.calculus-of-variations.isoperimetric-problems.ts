// 独立验算 math.calculus-of-variations.isoperimetric-problems 的 p1–p4（简单题、中等题）。
// 不用乘子法则：把泛函和积分约束都离散成节点值的函数，直接在约束下求极值（线性约束配拉格朗日乘子解线性方程组；
// 长度约束用牛顿法解离散的极值条件），N 和 2N 外推；另用里茨法或圆弧的几何关系各算一遍。
// 单独运行：npx tsx tools/verify/math.calculus-of-variations.isoperimetric-problems.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import {
  agree,
  bisect,
  chosen,
  derivative,
  discretize,
  integrate,
  quadraticStationary,
  richardson,
  solve,
  type Vec,
} from './math.calculus-of-variations._variational.ts';

/** ∫₀¹ y′² 在 y(0) = y(1) = 0 和若干线性积分约束 ∫G_k y dx = c_k 下的极小（离散，N 段）。 */
function constrainedMin(N: number, weights: ((x: number) => number)[], values: number[]): number {
  const d = discretize((_x, _y, p) => p * p, 0, 1, N, 0, 0);
  const constraint = (k: number) => (u: Vec): number => {
    const y = d.nodes(u);
    let s = 0;
    for (let i = 0; i < N; i++) s += d.h * weights[k]((i + 0.5) * d.h) * ((y[i] + y[i + 1]) / 2);
    return s - values[k];
  };
  const u = quadraticStationary(d.J, d.count, weights.map((_, k) => constraint(k)));
  return d.J(u);
}

/** 里茨法：y = x(1 − x)·（多项式），在同样的约束下求 ∫ y′² 的极小。 */
function ritzMin(terms: number, weights: ((x: number) => number)[], values: number[]): number {
  const shape = (c: Vec) => (x: number): number => x * (1 - x) * c.reduce((s, ck, k) => s + ck * x ** k, 0);
  const J = (c: Vec): number => integrate((x) => derivative(shape(c), x) ** 2, 0, 1, 16);
  const cons = weights.map((w, k) => (c: Vec): number => integrate((x) => w(x) * shape(c)(x), 0, 1, 16) - values[k]);
  return J(quadraticStationary(J, terms, cons));
}

/** 绳长 ℓ、两端在 (±1, 0) 时围成的最大面积：离散成 N 段折线，牛顿法解「面积的梯度 = λ·长度的梯度、长度 = ℓ」。 */
function maxArea(N: number, ell: number): number {
  const h = 2 / N;
  const nodes = (y: Vec): Vec => [0, ...y, 0];
  const area = (y: Vec): number => nodes(y).reduce((s, v) => s + h * v, 0);
  const length = (y: Vec): number => {
    const v = nodes(y);
    let s = 0;
    for (let i = 0; i < N; i++) s += Math.hypot(h, v[i + 1] - v[i]);
    return s;
  };
  const grad = (f: (y: Vec) => number, y: Vec): Vec => y.map((_, k) => derivative((e) => f(y.map((v, i) => (i === k ? v + e : v))), 0, 1e-5));
  const residual = (z: Vec): Vec => {
    const y = z.slice(0, N - 1);
    const lam = z[N - 1];
    const gA = grad(area, y);
    const gL = grad(length, y);
    return [...gA.map((v, k) => v - lam * gL[k]), length(y) - ell];
  };
  let z = [...Array.from({ length: N - 1 }, (_, i) => 0.4 * (1 - (-1 + (i + 1) * h) ** 2)), 1];
  for (let it = 0; it < 40; it++) {
    const r = residual(z);
    if (Math.max(...r.map(Math.abs)) < 1e-12) break;
    const Jm = z.map((_, k) => {
      const e = 1e-6;
      const rp = residual(z.map((v, i) => (i === k ? v + e : v)));
      const rm = residual(z.map((v, i) => (i === k ? v - e : v)));
      return rp.map((v, i) => (v - rm[i]) / (2 * e));
    });
    const step = solve(
      r.map((_, i) => Jm.map((col) => col[i])),
      r.map((v) => -v),
    );
    z = z.map((v, i) => v + step[i]);
  }
  return area(z.slice(0, N - 1));
}

export const verification: Verification = {
  lesson: 'math.calculus-of-variations.isoperimetric-problems',
  notes: {
    p1: '一是离散成节点值的二次函数，约束 ∫y = 1 也离散，配乘子解线性方程组（40 段、80 段外推）；二是里茨法，在 x(1 − x)·（二次多项式）里带约束求极小。两者核对；和 y = 6x(1 − x)、J = 12 核对。',
    p2: '按定义逐条看约束：A、C、E 是「一个积分等于给定的值」（∫y²、π∫y²、∫xy）；B 是某一点的值，D 是处处成立的不等式，都不是积分约束。',
    p3: '一是把绳子换成 N 段折线，牛顿法解离散的极值条件（N = 40、80，外推）；二是圆弧：二分解 2α/sinα = ℓ 得 α，面积是扇形减三角形。两者核对；和 α = π/4、半径 √2、面积 π/2 − 1 核对。',
    p4: '同 p1 的两种算法（离散取 80 段、160 段外推），两个线性约束各配一个乘子；里茨法在 x(1 − x)·（一次多项式）里求极小。和 y = −60x(2x − 1)(x − 1)、J = 720 核对。',
  },
  compute() {
    // p1：∫y = 1
    const w1 = [(_x: number) => 1];
    const p1 = agree(agree(richardson(constrainedMin(40, w1, [1]), constrainedMin(80, w1, [1])), ritzMin(3, w1, [1]), 'p1 两种算法', 1e-6), 12, 'p1 最小值');

    // p2：按约束的类型判断
    const kinds = ['integral', 'pointwise', 'integral', 'inequality', 'integral'];
    const p2 = chosen(kinds.map((k) => k === 'integral'));

    // p3：ℓ = π/√2
    const ell = Math.PI / Math.SQRT2;
    const discrete3 = richardson(maxArea(40, ell), maxArea(80, ell));
    const alpha = bisect((a) => (2 * a) / Math.sin(a) - ell, 0.1, Math.PI / 2);
    const R = 1 / Math.sin(alpha);
    const arc = (R * R * (2 * alpha - Math.sin(2 * alpha))) / 2;
    const p3 = agree(agree(discrete3, arc, 'p3 两种算法', 1e-5), Math.PI / 2 - 1, 'p3 最大面积');

    // p4：∫y = 0，∫xy = 1
    const w4 = [(_x: number) => 1, (x: number) => x];
    const p4 = agree(agree(richardson(constrainedMin(80, w4, [0, 1]), constrainedMin(160, w4, [0, 1])), ritzMin(2, w4, [0, 1]), 'p4 两种算法', 1e-6), 720, 'p4 最小值');

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
