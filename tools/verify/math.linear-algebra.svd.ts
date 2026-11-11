// 独立验算 math.linear-algebra.svd 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.svd.ts
// 不用 AᵀA 的特征值：奇异值是 A 把单位圆拉成的椭圆的半轴，即 |Ax|（|x| = 1）的最大值和最小值；再和 AᵀA 的特征值核对。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { charPoly, circleMinMax, matMul, matVec, norm, polyRoots, transpose, type Mat } from './math.linear-algebra._la.ts';

/** 2 阶以下的列数：在单位圆上求 |Ax|² 的最大值、最小值。 */
const stretch2 = (A: Mat): [number, number] => circleMinMax((x) => norm(matVec(A, x)) ** 2);

const eigAtA = (A: Mat): number[] =>
  polyRoots(charPoly(matMul(transpose(A), A)))
    .map(([re]) => re)
    .sort((a, b) => b - a);

export const verification: Verification = {
  lesson: 'math.linear-algebra.svd',
  notes: {
    p1: '单位圆上 |Ax| 的最大值、最小值；再核对平方等于 AᵀA 的特征值。',
    p2: 'R¹ 里的单位向量只有 ±1，|A·1| 就是奇异值；再核对 AᵀA = (25)。',
    p3: '单位圆上 |Ax|² 的最大值、最小值；再和 AᵀA 的特征值核对。',
    p4: '单位圆上 |Ax|² 的最大值；核对最小值是 0（秩为 1），并和 AᵀA 的特征值核对。',
  },
  compute() {
    // p1
    const A1 = [
      [3, 0],
      [0, -2],
    ];
    const [min1, max1] = stretch2(A1);
    const p1 = [Math.sqrt(max1), Math.sqrt(min1)];
    const e1 = eigAtA(A1);
    if (Math.abs(e1[0] - max1) > 1e-8 || Math.abs(e1[1] - min1) > 1e-8) throw new Error('p1：和 AᵀA 的特征值对不上');

    // p2
    const A2 = [[3], [4]];
    const p2 = norm(matVec(A2, [1]));
    if (Math.abs(matMul(transpose(A2), A2)[0][0] - p2 ** 2) > 1e-12) throw new Error('p2：和 AᵀA 对不上');

    // p3
    const A3 = [
      [2, 2],
      [-1, 1],
    ];
    const [min3, max3] = stretch2(A3);
    const e3 = eigAtA(A3);
    if (Math.abs(e3[0] - max3) > 1e-8 || Math.abs(e3[1] - min3) > 1e-8) throw new Error('p3：和 AᵀA 的特征值对不上');

    // p4
    const A4 = [
      [1, 2],
      [3, 6],
    ];
    const [min4, max4] = stretch2(A4);
    if (min4 > 1e-9) throw new Error('p4：最小值不是 0，秩不是 1');
    const e4 = eigAtA(A4);
    if (Math.abs(e4[0] - max4) > 1e-8) throw new Error('p4：和 AᵀA 的特征值对不上');

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: [max3, min3] },
      p4: { type: 'number', value: max4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
