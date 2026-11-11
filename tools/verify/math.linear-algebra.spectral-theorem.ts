// 独立验算 math.linear-algebra.spectral-theorem 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.spectral-theorem.ts
// p1 不用「对称就行」这条定理，直接找一对互相垂直的单位向量，看能不能都是特征向量。
// p2、p3 设 A = (a b; b c)，由已知的特征向量和迹列方程组解出 A，不用「不同特征值的特征向量正交」。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { argMin, charPoly, dot, fromColumns, matMul, matVec, orthogonalComplement, orthonormalize, polyRoots, rng, scale, solve, sub, transpose, type Mat, type Vec } from './math.linear-algebra._la.ts';

/** 2 阶：在 [0, π) 上找 t，使 (cos t, sin t) 和 (−sin t, cos t) 都是特征向量（Av 和 v 共线）。 */
function hasOrthonormalEigenbasis(A: Mat): boolean {
  const off = (v: Vec): number => {
    const w = matVec(A, v);
    return Math.abs(w[0] * v[1] - w[1] * v[0]);
  };
  const f = (t: number): number => off([Math.cos(t), Math.sin(t)]) + off([-Math.sin(t), Math.cos(t)]);
  const steps = 18000;
  const h = Math.PI / steps;
  let best = 0;
  for (let k = 1; k < steps; k++) if (f(k * h) < f(best * h)) best = k;
  return f(argMin(f, best * h - h, best * h + h)) < 1e-9 || f(best * h) < 1e-9;
}

const realRoots = (A: Mat): number[] =>
  polyRoots(charPoly(A))
    .map(([re, im]) => {
      if (Math.abs(im) > 1e-6) throw new Error('有复特征值');
      return re;
    })
    .sort((x, y) => x - y);

export const verification: Verification = {
  lesson: 'math.linear-algebra.spectral-theorem',
  notes: {
    p1: '每个矩阵：在 [0, π) 上扫 t，看能不能让一对互相垂直的单位向量 (cos t, sin t)、(−sin t, cos t) 同时是特征向量（Av 与 v 共线），能找到才写得成 QDQᵀ。',
    p2: '设 A = (a b; b c)，由 A(1,2) = 3(1,2) 和迹 a + c = 3 + (−1) 解出 A，核对特征值是 3、−1；再求 A + I 各行的正交补，把第一个分量缩放成 2。',
    p3: '同 p2：由 A(1,1) = (1,1) 和迹 a + c = 4 解出 A，核对特征值是 1、3。',
    p4: '在和 (1,1,1) 垂直的平面里随机取 3 组正交规范基，拼成 Q，乘出 A = Q diag(5,2,2) Qᵀ，核对 3 次的第 1 行第 2 列相同、A 对称、特征值是 2、2、5。',
  },
  compute() {
    // p1
    const options: Mat[] = [
      [
        [1, 2],
        [2, 1],
      ],
      [
        [1, 2],
        [0, 3],
      ],
      [
        [0, -1],
        [1, 0],
      ],
      [
        [5, 0],
        [0, 5],
      ],
      [
        [2, -3],
        [-3, 0],
      ],
    ];
    const p1 = options.flatMap((A, k) => (hasOrthonormalEigenbasis(A) ? [k + 1] : []));

    // p2：未知数 (a, b, c)
    const [a2, b2, c2] = solve(
      [
        [1, 2, 0],
        [0, 1, 2],
        [1, 0, 1],
      ],
      [3, 6, 2],
    );
    const A2 = [
      [a2, b2],
      [b2, c2],
    ];
    const ev2 = realRoots(A2);
    if (Math.abs(ev2[0] + 1) > 1e-9 || Math.abs(ev2[1] - 3) > 1e-9) throw new Error('p2：特征值不对');
    const [e] = orthogonalComplement(
      A2.map((row, i) => row.map((x, j) => x + (i === j ? 1 : 0))),
      2,
    );
    const p2 = (e[1] / e[0]) * 2;

    // p3
    const [a3, b3, c3] = solve(
      [
        [1, 1, 0],
        [0, 1, 1],
        [1, 0, 1],
      ],
      [1, 1, 4],
    );
    const A3 = [
      [a3, b3],
      [b3, c3],
    ];
    const ev3 = realRoots(A3);
    if (Math.abs(ev3[0] - 1) > 1e-9 || Math.abs(ev3[1] - 3) > 1e-9) throw new Error('p3：特征值不对');

    // p4
    const rand = rng(53);
    const n = scale(1 / Math.sqrt(3), [1, 1, 1]);
    let p4 = NaN;
    for (let trial = 0; trial < 3; trial++) {
      const r1 = [rand(), rand(), rand()].map((x) => x * 4 - 2);
      const r2 = [rand(), rand(), rand()].map((x) => x * 4 - 2);
      const [, q2, q3] = orthonormalize([n, sub(r1, scale(dot(r1, n), n)), r2]);
      const Q = fromColumns([n, q2, q3]);
      const D = [
        [5, 0, 0],
        [0, 2, 0],
        [0, 0, 2],
      ];
      const A = matMul(Q, matMul(D, transpose(Q)));
      if (A.some((row, i) => row.some((x, j) => Math.abs(x - A[j][i]) > 1e-12))) throw new Error('p4：不对称');
      const ev = realRoots(A);
      if ([2, 2, 5].some((l, i) => Math.abs(ev[i] - l) > 1e-6)) throw new Error('p4：特征值不对');
      if (!Number.isNaN(p4) && Math.abs(A[0][1] - p4) > 1e-12) throw new Error('p4：不同的 Q 结果不同');
      p4 = A[0][1];
    }

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: A3.flat() },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
