// 独立验算 math.linear-algebra.matrix-inverse 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.matrix-inverse.ts
// 逆矩阵用 (A | I) 消元求，不用二阶公式；不可逆的 k 用消元算的行列式找零点。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { det, identity, inverse, matMul, solve, transpose } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.matrix-inverse',
  notes: {
    p1: '把 (A | I) 化成简化行阶梯形，读出右半边；再核对 A 乘它等于 I。',
    p2: '第 i 行第 j 列取原矩阵的第 j 行第 i 列，按行读出。',
    p3: '直接对 (A | b) 消元解出（不先求逆），再用 p1 那样消元求出的 A⁻¹ 乘 b 核对。',
    p4: '对 k 找行列式（消元时累乘主元）的零点，[−10, 10] 上细扫再二分，核对只有一个。',
  },
  compute() {
    // p1
    const A1 = [
      [3, 1],
      [5, 2],
    ];
    const inv1 = inverse(A1);
    if (matMul(A1, inv1).some((r, i) => r.some((v, j) => Math.abs(v - identity(2)[i][j]) > 1e-12))) throw new Error('p1：乘起来不是 I');

    // p2
    const p2 = transpose([
      [1, 2, 3],
      [4, 5, 6],
    ]).flat();

    // p3
    const A3 = [
      [2, 3],
      [1, 2],
    ];
    const p3 = solve(A3, [1, 4]);
    const viaInv = inverse(A3).map((row) => row[0] * 1 + row[1] * 4);
    if (viaInv.some((v, i) => Math.abs(v - p3[i]) > 1e-12)) throw new Error('p3：两种算法不一致');

    // p4
    const ks = rootsOf(
      (k) =>
        det([
          [1, 2, 0],
          [0, 1, k],
          [1, 0, 2],
        ]),
      -10.0123,
      9.9871,
      4000,
    );
    if (ks.length !== 1) throw new Error('p4：k 不唯一');

    return {
      p1: { type: 'tuple', value: inv1.flat() },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: ks[0] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
