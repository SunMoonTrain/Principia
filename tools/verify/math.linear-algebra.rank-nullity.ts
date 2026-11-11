// 独立验算 math.linear-algebra.rank-nullity 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.rank-nullity.ts
// 秩用施密特正交化数个数，零空间的维数用正交补数个数，不用秩-零化度定理；「一定成立」随机造矩阵逐条检验。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { dot, matMul, norm, orthogonalComplement, orthonormalize, rng, scale, spanDim, sub, transpose, triple, type Mat, type Vec } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.rank-nullity',
  notes: {
    p1: '三行做施密特正交化数剩下几个，再对三列做一遍核对。',
    p2: '随机造 5 个 4×7 矩阵（4×3 乘 3×7），先核对秩是 3；零空间是 R⁷ 里和各行都正交的向量，用正交补数个数，核对 5 次相同。',
    p3: '三行的混合积为零时秩小于 3：对 k 找零点，核对只有一个，并且这时正交化后剩 2 个、k 偏一点剩 3 个。',
    p4: '随机造 50 个 5×3 矩阵，核对秩是 3，逐条检验：A 看零空间（正交补）是否只有零向量；B 随机取 b，看减去在列空间上的投影后是否为零；C 看各行正交化后剩几个；D 看三列正交化后是否一个不丢；E 看列空间是不是 5 维。对所有矩阵都成立的才算。',
  },
  compute() {
    const rand = rng(50);
    const randMat = (m: number, n: number): Mat => Array.from({ length: m }, () => Array.from({ length: n }, () => rand() * 4 - 2));

    // p1
    const A1 = [
      [1, 2, 3],
      [2, 4, 6],
      [1, 1, 1],
    ];
    const p1 = spanDim(A1);
    if (spanDim(transpose(A1)) !== p1) throw new Error('p1：行、列算出的不一样');

    // p2
    let p2 = -1;
    for (let trial = 0; trial < 5; trial++) {
      const A = matMul(randMat(4, 3), randMat(3, 7));
      if (spanDim(A) !== 3) throw new Error('p2：秩不是 3');
      const nullity = orthogonalComplement(A, 7).length;
      if (p2 >= 0 && nullity !== p2) throw new Error('p2：不同的矩阵结果不同');
      p2 = nullity;
    }

    // p3
    const rows = (k: number): Mat => [
      [1, 1, 1],
      [1, 2, k],
      [2, 3, 4],
    ];
    const ks = rootsOf((k) => triple(...(rows(k) as [Vec, Vec, Vec])), -10.0123, 9.9871, 4000);
    if (ks.length !== 1) throw new Error('p3：k 不唯一');
    if (spanDim(rows(ks[0])) !== 2 || spanDim(rows(ks[0] + 0.5)) !== 3) throw new Error('p3：秩不对');

    // p4
    const holds = [true, true, true, true, true];
    for (let trial = 0; trial < 50; trial++) {
      const A = randMat(5, 3);
      const cols = transpose(A);
      if (spanDim(cols) !== 3) throw new Error('p4：秩不是 3');
      const q = orthonormalize(cols);
      const b = Array.from({ length: 5 }, () => rand() * 4 - 2);
      const residue = q.reduce((r: Vec, u) => sub(r, scale(dot(r, u), u)), b);
      const statements = [
        orthogonalComplement(A, 3).length === 0,
        norm(residue) < 1e-9,
        spanDim(A) <= 3,
        spanDim(cols) === cols.length,
        spanDim(cols) === 5,
      ];
      statements.forEach((ok, i) => {
        if (!ok) holds[i] = false;
      });
    }
    const p4 = holds.flatMap((ok, i) => (ok ? [i + 1] : []));

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: ks[0] },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
