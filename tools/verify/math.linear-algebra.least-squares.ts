// 独立验算 math.linear-algebra.least-squares 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.least-squares.ts
// 解法方程 AᵀAx = Aᵀb；再直接按定义核对：随机挪动解，误差的平方和都不更小，残差和各列正交。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { argMin, dot, matMul, matVec, norm, rng, solve, sub, transpose, type Mat, type Vec } from './math.linear-algebra._la.ts';

/** 解法方程，再核对它确实让 |Ax − b| 最小、残差和各列正交。 */
function leastSquares(A: Mat, b: Vec, rand: () => number): Vec {
  const At = transpose(A);
  const x = solve(matMul(At, A), matVec(At, b));
  const sse = (y: Vec): number => norm(sub(matVec(A, y), b)) ** 2;
  for (let t = 0; t < 200; t++) {
    const y = x.map((xi) => xi + (rand() - 0.5) * 2);
    if (sse(y) < sse(x) - 1e-12) throw new Error('找到误差更小的解');
  }
  const r = sub(b, matVec(A, x));
  for (const col of At) if (Math.abs(dot(col, r)) > 1e-10) throw new Error('残差和某一列不正交');
  return x;
}

export const verification: Verification = {
  lesson: 'math.linear-algebra.least-squares',
  notes: {
    p1: '直接把 (c − 2)² + (c − 3)² + (c − 7)² 当作 c 的函数，用黄金分割法在 [−10, 10] 上求最小值点。',
    p2: '矩阵乘法算 AᵀA。',
    p3: 'A 的两列是 1 和 t_i，解法方程；再随机挪动 200 次 (c₀, c₁)，核对误差的平方和都不更小，残差和两列都正交。',
    p4: '同 p3：解法方程，核对没有更好的解、残差和两列正交。',
  },
  compute() {
    const rand = rng(31);

    // p1
    const p1 = argMin((c) => (c - 2) ** 2 + (c - 3) ** 2 + (c - 7) ** 2, -10, 10);

    // p2
    const A2 = [
      [1, 1],
      [1, 2],
      [1, 3],
    ];
    const p2 = matMul(transpose(A2), A2).flat();

    // p3
    const data = [
      [0, 0],
      [1, 1],
      [2, 1],
    ];
    const p3 = leastSquares(
      data.map(([t]) => [1, t]),
      data.map(([, y]) => y),
      rand,
    );

    // p4
    const p4 = leastSquares(
      [
        [1, 1],
        [1, -1],
        [2, 1],
      ],
      [2, 0, 4],
      rand,
    );

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
