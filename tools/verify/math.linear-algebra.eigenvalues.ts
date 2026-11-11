// 独立验算 math.linear-algebra.eigenvalues 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.eigenvalues.ts
// 特征值用莱布尼茨公式算 det(A − λI) 再找零点；特征向量用正交补；p2 不用根与系数的关系，造两个迹、行列式符合题意的矩阵直接求。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { charPoly, identity, matVec, orthogonalComplement, permDet, scale, trace, type Mat } from './math.linear-algebra._la.ts';

/** det(A − λI) 在 [−10, 10] 上的全部零点（莱布尼茨公式逐点算）。 */
const eigenvaluesOf = (A: Mat): number[] =>
  rootsOf((l) => permDet(A.map((row, i) => row.map((a, j) => a - (i === j ? l : 0)))), -10.0123, 9.9871, 4000);

export const verification: Verification = {
  lesson: 'math.linear-algebra.eigenvalues',
  notes: {
    p1: '用莱布尼茨公式逐点算 det(A − λI)，在 [−10, 10] 上找零点，核对恰有两个。',
    p2: '造两个迹为 −1、行列式为 −6 的矩阵 (0 6; 1 −1) 和 (1 2; 2 −2)，分别求 det(A − λI) 的零点，核对两个矩阵结果相同。',
    p3: '属于 3 的特征向量是 A − 3I 各行的正交补：核对只有一维，把第一个分量缩放成 1，再核对 Av = 3v。',
    p4: '对每个 k 由法捷耶夫-勒维耶递推求特征多项式 λ² + c₁λ + c₀，找判别式 c₁² − 4c₀ 的零点，核对只有一个；再核对 k 大一点时有两个不同的实特征值、小一点时没有实特征值。',
  },
  compute() {
    // p1
    const p1 = eigenvaluesOf([
      [5, 2],
      [2, 2],
    ]);
    if (p1.length !== 2) throw new Error('p1：特征值个数不对');

    // p2
    const candidates: Mat[] = [
      [
        [0, 6],
        [1, -1],
      ],
      [
        [1, 2],
        [2, -2],
      ],
    ];
    for (const M of candidates) if (trace(M) !== -1 || permDet(M) !== -6) throw new Error('p2：造的矩阵不合题意');
    const [p2, other] = candidates.map(eigenvaluesOf);
    if (p2.length !== 2 || p2.some((x, i) => Math.abs(x - other[i]) > 1e-9)) throw new Error('p2：两个矩阵的特征值不同');

    // p3
    const A3 = [
      [1, 2, 0],
      [0, 3, 0],
      [2, -4, 2],
    ];
    const ker = orthogonalComplement(
      A3.map((row, i) => row.map((a, j) => a - 3 * identity(3)[i][j])),
      3,
    );
    if (ker.length !== 1) throw new Error('p3：特征空间不是一维');
    const v = scale(1 / ker[0][0], ker[0]);
    if (matVec(A3, v).some((x, i) => Math.abs(x - 3 * v[i]) > 1e-9)) throw new Error('p3：不是特征向量');

    // p4
    const disc = (k: number): number => {
      const [c0, c1] = charPoly([
        [1, k],
        [2, 3],
      ]);
      return c1 * c1 - 4 * c0;
    };
    const ks = rootsOf(disc, -10.0123, 9.9871, 4000);
    if (ks.length !== 1) throw new Error('p4：k 不唯一');
    const ev = (k: number): number[] =>
      eigenvaluesOf([
        [1, k],
        [2, 3],
      ]);
    if (ev(ks[0] + 0.1).length !== 2 || ev(ks[0] - 0.1).length !== 0) throw new Error('p4：k 两侧的情形不对');

    return {
      p1: { type: 'set', value: p1 },
      p2: { type: 'set', value: p2 },
      p3: { type: 'tuple', value: v },
      p4: { type: 'number', value: ks[0] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
