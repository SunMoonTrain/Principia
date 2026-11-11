// 独立验算 math.linear-algebra.matrices 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.matrices.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { add, fromColumns, matMul, matVec, scale } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.matrices',
  notes: {
    p1: '按列组合：x₁(2, 1) + x₂(−1, 3) + x₃(0, 2)。',
    p2: '按定义：AB 的第 j 列是 A 乘 B 的第 j 列（按列组合算），再按行读出。',
    p3: '由线性：A(3, −2) = 3Ae₁ − 2Ae₂；再用两列拼成 A 按行算一次核对。',
    p4: 'A 连乘 5 次，取右上角。',
  },
  compute() {
    // p1
    const cols1 = [
      [2, 1],
      [-1, 3],
      [0, 2],
    ];
    const x1 = [1, 2, -1];
    const p1 = cols1.reduce((s, c, j) => add(s, scale(x1[j], c)), [0, 0]);

    // p2
    const A2 = [
      [1, 2],
      [0, -1],
    ];
    const Bcols = [
      [3, 1],
      [0, 2],
    ];
    const ABcols = Bcols.map((b) => [A2[0][0] * b[0] + A2[0][1] * b[1], A2[1][0] * b[0] + A2[1][1] * b[1]]);
    const p2 = fromColumns(ABcols).flat();

    // p3
    const Ae1 = [2, 1];
    const Ae2 = [-1, 3];
    const p3 = add(scale(3, Ae1), scale(-2, Ae2));
    const check = matVec(fromColumns([Ae1, Ae2]), [3, -2]);
    if (check.some((v, i) => Math.abs(v - p3[i]) > 1e-12)) throw new Error('p3：两种算法不一致');

    // p4
    let P = [
      [1, 0],
      [0, 1],
    ];
    for (let k = 0; k < 5; k++)
      P = matMul(P, [
        [1, 2],
        [0, 1],
      ]);

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: P[0][1] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
