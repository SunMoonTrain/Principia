// 独立验算 math.linear-algebra.basis-dimension 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.basis-dimension.ts
// 维数用施密特正交化数个数，解集的维数用「和各行都正交的向量」的正交基数个数，都不用消元、不数主元。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { dot, fromColumns, orthogonalComplement, solve, spanDim, triple } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.basis-dimension',
  notes: {
    p1: '三个向量做施密特正交化，数剩下几个。',
    p2: '两个基向量互相正交，坐标就是 v·b_i / |b_i|²；再解方程组 a b1 + b b2 = v 核对。',
    p3: '解集就是 R⁴ 里和两个系数行都正交的向量：把标准基向量减去在两行上的投影后再正交化，数剩下几个。',
    p4: '不是基 ⟺ 三个向量共面 ⟺ 混合积为零：对 k 找零点，核对只有一个，并且这时正交化后只剩 2 个向量。',
  },
  compute() {
    // p1
    const p1 = spanDim([
      [1, -1, 0],
      [2, -2, 0],
      [0, 1, 1],
    ]);

    // p2
    const b1 = [1, 1];
    const b2 = [1, -1];
    const v = [5, 1];
    if (Math.abs(dot(b1, b2)) > 1e-12) throw new Error('p2：基不正交');
    const p2 = [dot(v, b1) / dot(b1, b1), dot(v, b2) / dot(b2, b2)];
    const viaSolve = solve(fromColumns([b1, b2]), v);
    if (viaSolve.some((x, i) => Math.abs(x - p2[i]) > 1e-12)) throw new Error('p2：两种算法不一致');

    // p3
    const p3 = orthogonalComplement(
      [
        [1, 1, 1, 1],
        [1, -1, 1, -1],
      ],
      4,
    ).length;

    // p4
    const ks = rootsOf((k) => triple([1, 2, 0], [0, 1, k], [1, 0, 1]), -10.0123, 9.9871, 4000);
    if (ks.length !== 1) throw new Error('p4：k 不唯一');
    if (spanDim([
      [1, 2, 0],
      [0, 1, ks[0]],
      [1, 0, 1],
    ]) !== 2) throw new Error('p4：没有共面');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: ks[0] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
