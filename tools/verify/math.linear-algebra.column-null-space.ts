// 独立验算 math.linear-algebra.column-null-space 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.column-null-space.ts
// 零空间是和各行都正交的向量，用正交补或两行的叉积求；列空间用施密特正交化和投影判断，不用消元、不找主元列。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { cross, dot, matVec, norm, orthogonalComplement, orthonormalize, scale, solve, spanDim, sub, transpose, type Mat, type Vec } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.column-null-space',
  notes: {
    p1: '零空间就是和 A 的各行都正交的向量：把标准基向量减去在各行上的投影后再正交化，数剩下几个。',
    p2: '两列张成的平面的法向量是两列的叉积，(1, k, 3) 在列空间里 ⟺ 和法向量正交：对 k 找零点，核对只有一个；再解出组合系数核对。',
    p3: '两行不平行时，零空间由两行的叉积张成；缩放使第三个分量为 1，再核对 Ax = 0。',
    p4: '对每个选项：所选的列正交化后一个都不丢（线性无关），并且 A 的每一列减去在所选列张成的空间上的投影后为零（张成 C(A)），两条都满足才是基。',
  },
  compute() {
    // p1
    const p1 = orthogonalComplement(
      [
        [1, 2, 3],
        [2, 4, 6],
      ],
      3,
    ).length;

    // p2
    const a1 = [1, 1, 1];
    const a2 = [0, 1, 2];
    const n = cross(a1, a2);
    const ks = rootsOf((k) => dot([1, k, 3], n), -10.0123, 9.9871, 4000);
    if (ks.length !== 1) throw new Error('p2：k 不唯一');
    const w = [1, ks[0], 3];
    const [x1, x2] = solve(
      [
        [a1[0], a2[0]],
        [a1[1], a2[1]],
      ],
      [w[0], w[1]],
    );
    if (Math.abs(x1 * a1[2] + x2 * a2[2] - w[2]) > 1e-9) throw new Error('p2：不在列空间里');

    // p3
    const A3 = [
      [1, 1, -1],
      [2, 3, 1],
    ];
    const c = cross(A3[0], A3[1]);
    if (norm(c) < 1e-12) throw new Error('p3：两行平行');
    const p3 = scale(1 / c[2], c);
    if (matVec(A3, p3).some((x) => Math.abs(x) > 1e-12)) throw new Error('p3：不在零空间里');

    // p4
    const A4: Mat = [
      [1, 2, 1, 1],
      [0, 0, 1, 2],
      [1, 2, 2, 3],
    ];
    const cols = transpose(A4);
    const choices = [
      [0, 1],
      [0, 2],
      [1, 3],
      [0, 1, 2],
      [2, 3],
    ];
    const p4 = choices.flatMap((idx, i) => {
      const chosen = idx.map((j) => cols[j]);
      const independent = spanDim(chosen) === chosen.length;
      const q = orthonormalize(chosen);
      const spans = cols.every((col) => norm(q.reduce((r: Vec, u) => sub(r, scale(dot(r, u), u)), col)) < 1e-9);
      return independent && spans ? [i + 1] : [];
    });

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: ks[0] },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
