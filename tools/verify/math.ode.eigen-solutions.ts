// 独立验算 math.ode.eigen-solutions 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.eigen-solutions.ts
// 不用特征值写通解：p1 直接把 e^{λt}(1, 1) 代进方程找 λ，p3 数值积分，p4 对 det(A − λI) 数值求根。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { d1, det, rk4VecAccurate, solveLinear } from './math.ode._numeric.ts';

export const verification: Verification = {
  lesson: 'math.ode.eigen-solutions',
  notes: {
    p1: '把 x = e^{λt}(1, 1) 代进 x′ − Ax，导数用五点差分，在 t = 0.3 处取第一个分量的残差除以 e^{λt}，对 λ 找零点（格点错开整数），再核对第二个分量也为零。',
    p2: '解 c₁(1, 1) + c₂(1, −2) = (2, −1)，代进通解的第一个分量，t = ln 2。',
    p3: '四阶龙格-库塔法积 x₁′ = −3x₁ + x₂、x₂′ = x₁ − 3x₂，从 (0; 2, 0) 积到 1。',
    p4: '用高斯消元算 det(A − λI)，在 [−10, 10] 上粗扫变号再二分，求出全部实根（三个，正好是三阶多项式的全部根）。',
  },
  compute() {
    // p1
    const A1 = [
      [4, 1],
      [2, 3],
    ];
    const residual = (lam: number, i: number): number => {
      const x = (t: number): number[] => [Math.exp(lam * t), Math.exp(lam * t)];
      const t = 0.3;
      const Ax = A1.map((row) => row[0] * x(t)[0] + row[1] * x(t)[1]);
      return (d1((u) => x(u)[i], t, 1e-3) - Ax[i]) / Math.exp(lam * t);
    };
    const roots1 = rootsOf((l) => residual(l, 0), -10.0123, 9.9871, 4000);
    if (roots1.length !== 1 || Math.abs(residual(roots1[0], 1)) > 1e-6) throw new Error('p1：λ 不唯一或第二个分量不满足');

    // p2
    const [c1, c2] = solveLinear(
      [
        [1, 1],
        [1, -2],
      ],
      [2, -1],
    );
    const t2 = Math.log(2);
    const p2 = c1 * Math.exp(t2) + c2 * Math.exp(-2 * t2);

    // p3
    const p3 = rk4VecAccurate((_, [a, b]) => [-3 * a + b, a - 3 * b], 0, [2, 0], 1)[0];

    // p4
    const A4 = [
      [0, 1, 0],
      [0, 0, 1],
      [6, -11, 6],
    ];
    const charPoly = (l: number): number => det(A4.map((row, i) => row.map((a, j) => (i === j ? a - l : a))));
    const p4 = rootsOf(charPoly, -10.0123, 9.9871, 4000);
    if (p4.length !== 3) throw new Error('p4：实根不是三个');

    return {
      p1: { type: 'number', value: roots1[0] },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'set', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
