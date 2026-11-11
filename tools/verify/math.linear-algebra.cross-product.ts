// 独立验算 math.linear-algebra.cross-product 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.cross-product.ts
// 面积用 √(|u|²|v|² − (u·v)²) 算，不用叉积；正交向量解齐次方程组求；体积用行列式。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cross, det, dot, norm, rref, scale } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.cross-product',
  notes: {
    p1: '按列维-奇维塔符号逐项求和 w_i = Σ ε_ijk u_j v_k；再核对 w 与两个因子的点积都是 0。',
    p2: '面积 = |u||v| sin θ = √(|u|²|v|² − (u·v)²)，只用点积和长度。',
    p3: '解齐次方程组 x + y + z = 0、x + 2y + 3z = 0（简化行阶梯形），自由变量取 1 得一个非零解，除以长度，取第一个分量为正的那个。',
    p4: '体积 = 以 u、v、w 为列的 3×3 矩阵的行列式的绝对值（消元算行列式）。',
  },
  compute() {
    // p1
    const u1 = [2, -1, 0];
    const v1 = [1, 3, 1];
    const p1 = cross(u1, v1);
    if (Math.abs(dot(p1, u1)) > 1e-12 || Math.abs(dot(p1, v1)) > 1e-12) throw new Error('p1：不正交');

    // p2
    const u2 = [2, 1, 0];
    const v2 = [0, 1, 2];
    const p2 = Math.sqrt(dot(u2, u2) * dot(v2, v2) - dot(u2, v2) ** 2);

    // p3
    const { R, pivots } = rref([
      [1, 1, 1],
      [1, 2, 3],
    ]);
    if (pivots.join() !== '0,1') throw new Error('p3：主元位置意外');
    const free = [-R[0][2], -R[1][2], 1];
    let p3 = scale(1 / norm(free), free);
    if (p3[0] < 0) p3 = scale(-1, p3);

    // p4
    const p4 = Math.abs(
      det([
        [1, 0, 2],
        [2, 1, 0],
        [0, 3, 1],
      ]),
    );

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
