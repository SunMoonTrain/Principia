// 独立验算 math.linear-algebra.determinant-properties 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.determinant-properties.ts
// 行列式一律按排列展开（莱布尼茨公式）直接算，不用三角形、展开定理、乘积公式这些要验的性质；消元算的只作核对。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { det, inverse, matMul, permDet, rng, scale, transpose, type Mat } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.determinant-properties',
  notes: {
    p1: '按排列展开（24 项），再用消元核对。',
    p2: '随机取 5 个行列式为 3 的三阶矩阵（随机矩阵第一行乘上 3 / det，再按排列展开核对确实是 3），对每个 A 直接算 2A、Aᵀ、A⁻¹（消元求逆）、A·A 的行列式，核对 5 次结果相同。',
    p3: '按排列展开（24 项），再用消元核对。',
    p4: '按排列展开（6 项），不用按行展开；再用消元核对。',
  },
  compute() {
    const check = (A: Mat, name: string): number => {
      const d = permDet(A);
      if (Math.abs(d - det(A)) > 1e-9) throw new Error(`${name}：两种算法不一致`);
      return d;
    };

    // p1
    const p1 = check(
      [
        [2, 7, -1, 4],
        [0, -1, 3, 8],
        [0, 0, 3, 6],
        [0, 0, 0, 5],
      ],
      'p1',
    );

    // p2
    const rand = rng(20);
    let p2: number[] | null = null;
    for (let trial = 0; trial < 5; trial++) {
      const B = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => rand() * 4 - 2));
      const f = 3 / permDet(B);
      const A = [scale(f, B[0]), B[1], B[2]];
      if (Math.abs(permDet(A) - 3) > 1e-9) throw new Error('p2：没造出行列式为 3 的矩阵');
      const values = [permDet(A.map((row) => scale(2, row))), permDet(transpose(A)), permDet(inverse(A)), permDet(matMul(A, A))];
      if (p2 && values.some((x, i) => Math.abs(x - (p2 as number[])[i]) > 1e-8)) throw new Error('p2：不同的 A 结果不同');
      p2 = values;
    }

    // p3
    const p3 = check(
      [
        [1, 1, 2, 1],
        [2, 3, 5, 2],
        [1, 2, 6, 3],
        [3, 3, 6, 5],
      ],
      'p3',
    );

    // p4
    const p4 = check(
      [
        [2, 1, 3],
        [0, 4, 1],
        [5, 2, 6],
      ],
      'p4',
    );

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: p2 as number[] },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
