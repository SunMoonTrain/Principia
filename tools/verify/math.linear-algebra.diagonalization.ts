// 独立验算 math.linear-algebra.diagonalization 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.diagonalization.ts
// 矩阵乘法、求逆直接算；特征向量用正交补；能不能对角化按「特征向量够不够」数正交补的维数，不用重数定理。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { argMin, charPoly, inverse, matMul, orthogonalComplement, permDet, rng, scale, spanDim, type Mat, type Vec } from './math.linear-algebra._la.ts';

const minus = (A: Mat, l: number): Mat => A.map((row, i) => row.map((a, j) => a - (i === j ? l : 0)));

/** 实特征值互不相同或特征向量够数时可以对角化：把各特征值的特征空间（正交补）拼起来数维数。 */
function diagonalizable(A: Mat): boolean {
  const [c0, c1] = charPoly(A);
  const disc = c1 * c1 - 4 * c0;
  if (disc < -1e-12) return false;
  const root = Math.sqrt(Math.max(disc, 0));
  const lambdas = disc > 1e-12 ? [(-c1 + root) / 2, (-c1 - root) / 2] : [-c1 / 2];
  const vectors = lambdas.flatMap((l) => orthogonalComplement(minus(A, l), 2));
  return spanDim(vectors) === 2;
}

export const verification: Verification = {
  lesson: 'math.linear-algebra.diagonalization',
  notes: {
    p1: '随机造 3 个可逆的 P，A = PDP⁻¹ 直接乘出来，用莱布尼茨公式算 det A，核对 3 次相同。',
    p2: '用 (P | I) 消元求 P⁻¹，再连乘；核对 AP = PD。',
    p3: '属于 1、3 的特征向量分别是 A − I、A − 3I 各行的正交补：把第一个分量缩放成 1 排成 P，再核对 PDP⁻¹ 正是 A。',
    p4: '对每个 a 求特征多项式，判别式的最小值点就是两个特征值相同的地方（黄金分割法，在 [−10, 10] 上）；这时数特征空间（正交补）的维数，核对只有 1 维、不能对角化，并在 [−10, 10] 上每隔 0.01 取 a、去掉这一点附近，核对别的 a 都能对角化。',
  },
  compute() {
    const rand = rng(41);

    // p1
    const D1 = [
      [1, 0, 0],
      [0, 2, 0],
      [0, 0, 4],
    ];
    let p1 = NaN;
    for (let trial = 0; trial < 3; trial++) {
      const P: Mat = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => rand() * 4 - 2));
      if (Math.abs(permDet(P)) < 0.1) continue;
      const d = permDet(matMul(P, matMul(D1, inverse(P))));
      if (!Number.isNaN(p1) && Math.abs(d - p1) > 1e-9) throw new Error('p1：不同的 P 结果不同');
      p1 = d;
    }

    // p2
    const P2 = [
      [1, 1],
      [0, 1],
    ];
    const D2 = [
      [2, 0],
      [0, 3],
    ];
    const A2 = matMul(P2, matMul(D2, inverse(P2)));
    const lhs = matMul(A2, P2);
    const rhs = matMul(P2, D2);
    if (lhs.flat().some((x, i) => Math.abs(x - rhs.flat()[i]) > 1e-12)) throw new Error('p2：AP ≠ PD');

    // p3
    const A3 = [
      [5, -2],
      [4, -1],
    ];
    const eigvec = (l: number): Vec => {
      const ker = orthogonalComplement(minus(A3, l), 2);
      if (ker.length !== 1) throw new Error('p3：特征空间不是一维');
      return scale(1 / ker[0][0], ker[0]);
    };
    const [u, w] = [eigvec(1), eigvec(3)];
    const P3 = [
      [u[0], w[0]],
      [u[1], w[1]],
    ];
    const back = matMul(P3, matMul([[1, 0], [0, 3]], inverse(P3)));
    if (back.flat().some((x, i) => Math.abs(x - A3.flat()[i]) > 1e-9)) throw new Error('p3：PDP⁻¹ ≠ A');

    // p4
    const A4 = (a: number): Mat => [
      [a, 1],
      [0, 2],
    ];
    const discOf = (a: number): number => {
      const [c0, c1] = charPoly(A4(a));
      return c1 * c1 - 4 * c0;
    };
    const a4 = argMin(discOf, -10.0123, 9.9871);
    if (Math.abs(discOf(a4)) > 1e-9) throw new Error('p4：两个特征值不相同');
    if (diagonalizable(A4(a4)) || orthogonalComplement(minus(A4(a4), -charPoly(A4(a4))[1] / 2), 2).length !== 1) throw new Error('p4：这一点能对角化');
    for (let a = -10; a <= 10; a += 0.01) {
      if (Math.abs(a - a4) > 0.02 && !diagonalizable(A4(a))) throw new Error(`p4：a = ${a} 也不能对角化`);
    }

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: A2.flat() },
      p3: { type: 'tuple', value: [u[1], w[1]] },
      p4: { type: 'number', value: a4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
