// 独立验算 math.linear-algebra.linear-maps 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.linear-maps.ts
// 变换都按几何定义写成函数，标准矩阵由基向量的像读出，不用正文的旋转矩阵公式。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { fromColumns, inverse, matMul } from './math.linear-algebra._la.ts';

/** 绕原点逆时针转 θ：用复数乘法 (x + iy)(cos θ + i sin θ)。 */
const rotate =
  (theta: number) =>
  ([x, y]: number[]): number[] => [x * Math.cos(theta) - y * Math.sin(theta), x * Math.sin(theta) + y * Math.cos(theta)];
const matrixOf = (T: (v: number[]) => number[]): number[][] => fromColumns([T([1, 0]), T([0, 1])]);
const clean = (M: number[][]): number[] => M.flat().map((v) => (Math.abs(v) < 1e-12 ? 0 : v));

export const verification: Verification = {
  lesson: 'math.linear-algebra.linear-maps',
  notes: {
    p1: '用复数乘法把 2 + 5i 乘以 cos(π/2) + i sin(π/2)。',
    p2: '把 (x, y) ↦ (−x, y) 作用在 e₁、e₂ 上，像排成列。',
    p3: '先做 (x, y) ↦ (x, −y)、再用复数乘法转 π/2，把复合变换作用在 e₁、e₂ 上，像排成列。',
    p4: '设标准矩阵是 M，M 乘以以 (1, 1)、(1, −1) 为列的矩阵 X 等于以 (3, 1)、(1, 3) 为列的矩阵 Y，所以 M = YX⁻¹（X⁻¹ 用 (X | I) 消元求）。',
  },
  compute() {
    // p1
    const p1 = rotate(Math.PI / 2)([2, 5]).map((v) => (Math.abs(v) < 1e-12 ? 0 : v));

    // p2
    const p2 = clean(matrixOf(([x, y]) => [-x, y]));

    // p3
    const p3 = clean(matrixOf((v) => rotate(Math.PI / 2)([v[0], -v[1]])));

    // p4
    const X = fromColumns([
      [1, 1],
      [1, -1],
    ]);
    const Y = fromColumns([
      [3, 1],
      [1, 3],
    ]);
    const p4 = clean(matMul(Y, inverse(X)));

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
