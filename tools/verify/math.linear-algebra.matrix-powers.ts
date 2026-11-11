// 独立验算 math.linear-algebra.matrix-powers 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.matrix-powers.ts
// 不用 A^k = PD^kP⁻¹ 和通项公式：幂直接连乘，数列直接按递推算，长期分布反复乘 M 迭代。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { inverse, matMul, matVec, solve } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.matrix-powers',
  notes: {
    p1: '先乘出 A = PDP⁻¹，再算 A·A。',
    p2: '按递推一项项算到 F₂₀。',
    p3: '从 (1, 0)、(0, 1)、(0.3, 0.7) 三种分布出发各乘 M 2000 次，算城区所占比例，核对三者相同。',
    p4: '按递推算出 a₀ 到 a₂₀，用 a₇、a₈ 两项解出 α、β，再核对 a₀ 到 a₂₀ 每一项都等于 α·2^k + β·3^k。',
  },
  compute() {
    // p1
    const P = [
      [1, 1],
      [0, 1],
    ];
    const A = matMul(P, matMul([[3, 0], [0, -1]], inverse(P)));
    const p1 = matMul(A, A).flat();

    // p2
    const F = [0, 1];
    while (F.length <= 20) F.push(F[F.length - 1] + F[F.length - 2]);
    const p2 = F[20];

    // p3
    const M = [
      [0.8, 0.3],
      [0.2, 0.7],
    ];
    const shares = [
      [1, 0],
      [0, 1],
      [0.3, 0.7],
    ].map((x0) => {
      let x = x0;
      for (let k = 0; k < 2000; k++) x = matVec(M, x);
      return x[0] / (x[0] + x[1]);
    });
    if (shares.some((s) => Math.abs(s - shares[0]) > 1e-12)) throw new Error('p3：结果和出发的分布有关');
    const p3 = shares[0];

    // p4
    const a = [0, 1];
    while (a.length <= 20) a.push(5 * a[a.length - 1] - 6 * a[a.length - 2]);
    const [alpha, beta] = solve(
      [
        [2 ** 7, 3 ** 7],
        [2 ** 8, 3 ** 8],
      ],
      [a[7], a[8]],
    );
    a.forEach((x, k) => {
      if (Math.abs(alpha * 2 ** k + beta * 3 ** k - x) > 1e-6 * Math.max(1, Math.abs(x))) throw new Error(`p4：第 ${k} 项对不上`);
    });

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [alpha, beta] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
