// 独立验算 math.linear-algebra.tensor-product 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.tensor-product.ts
// 张量的系数排成矩阵，v ⊗ w 的系数是 x_i y_j；p4 不用换基公式 T' = QTQᵀ，先把 e₁、e₂ 用新基展开，再按双线性乘开。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { fromColumns, rng, solve, spanDim, type Mat, type Vec } from './math.linear-algebra._la.ts';

/** v ⊗ w 的系数矩阵：第 i 行第 j 列是 v_i w_j。 */
const outer = (v: Vec, w: Vec): Mat => v.map((x) => w.map((y) => x * y));

export const verification: Verification = {
  lesson: 'math.linear-algebra.tensor-product',
  notes: {
    p1: 'P₂ 的基取 1、x、x² 和另一组 1、1 + x、(1 + x)²，R² 取标准基；各对基向量的 v ⊗ w 系数摊平成向量，做施密特正交化数个数，核对两组基结果相同。',
    p2: '按定义 t_ij = x_i y_j。',
    p3: 'F 在 e_i ⊗ e_j 上的值是 f(e_i, e_j)，按 T 的系数线性相加；再随机取 20 对 u、v 核对 F(u ⊗ v) = f(u, v)。',
    p4: '解方程组把 e₁、e₂ 写成 b₁′、b₂′ 的组合，e₁ ⊗ e₂ 按双线性乘开得 t′_kl；再把 Σ t′_kl b′_k ⊗ b′_l 换回标准系数，核对正是 e₁ ⊗ e₂。',
  },
  compute() {
    // p1
    const e2 = [
      [1, 0],
      [0, 1],
    ];
    const dimOf = (basisP2: Vec[]): number => spanDim(basisP2.flatMap((b) => e2.map((c) => outer(b, c).flat())));
    const p1 = dimOf([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]);
    if (
      dimOf([
        [1, 0, 0],
        [1, 1, 0],
        [1, 2, 1],
      ]) !== p1
    )
      throw new Error('p1：换一组基结果不同');

    // p2
    const p2 = outer([2, -1], [1, 3]).flat();

    // p3
    const f = (u: Vec, v: Vec): number => 2 * u[0] * v[0] + u[0] * v[1] - 3 * u[1] * v[1];
    const F = (t: Mat): number => t.reduce((s, row, i) => s + row.reduce((s2, tij, j) => s2 + tij * f(e2[i], e2[j]), 0), 0);
    const T3 = [
      [0, 1],
      [2, -1],
    ];
    const p3 = F(T3);
    const rand = rng(61);
    for (let trial = 0; trial < 20; trial++) {
      const u = [rand() * 4 - 2, rand() * 4 - 2];
      const v = [rand() * 4 - 2, rand() * 4 - 2];
      if (Math.abs(F(outer(u, v)) - f(u, v)) > 1e-9) throw new Error('p3：F(u ⊗ v) ≠ f(u, v)');
    }

    // p4
    const B = fromColumns([
      [1, 1],
      [0, 1],
    ]);
    const a = solve(B, [1, 0]);
    const c = solve(B, [0, 1]);
    const tNew = outer(a, c);
    const newBasis = [
      [1, 1],
      [0, 1],
    ];
    const back = [0, 1].map((i) => [0, 1].map((j) => tNew.reduce((s, row, k) => s + row.reduce((s2, t, l) => s2 + t * outer(newBasis[k], newBasis[l])[i][j], 0), 0)));
    if (back.flat().some((x, i) => Math.abs(x - [0, 1, 0, 0][i]) > 1e-12)) throw new Error('p4：换回去不是 e₁ ⊗ e₂');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: tNew.flat() },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
