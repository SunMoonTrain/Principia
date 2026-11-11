// 独立验算 math.ode.constant-coefficients 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.constant-coefficients.ts
// 不用特征根写通解：p1 找使 e^{rx} 满足方程的 r，其余直接对方程做数值积分。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { bisect, d1, d2, rk4VecAccurate } from './math.ode._numeric.ts';

export const verification: Verification = {
  lesson: 'math.ode.constant-coefficients',
  notes: {
    p1: '把 y = e^{rx} 代进 y″ − 5y′ + 6y，导数用五点差分算，在 x = 0.4 处把残差除以 e^{rx}，对 r 找零点（格点错开整数）。',
    p2: '四阶龙格-库塔法积 y″ = −4y，从 (0; 1, 2) 积到 π/2。',
    p3: '四阶龙格-库塔法积 y″ = −6y′ − 9y，从 (0; 0, 1) 积到 1。',
    p4: '积 y″ = −2y′ − 5y（(0; 0, 2)），y′ 由正变负的第一个点就是第一个极大值点：先在格点上找变号，再对 x 二分，每次重新积分到 x 读 y′。',
  },
  compute() {
    // p1
    const residual = (r: number): number => {
      const y = (t: number): number => Math.exp(r * t);
      const x = 0.4;
      return (d2(y, x, 1e-3) - 5 * d1(y, x, 1e-3) + 6 * y(x)) / y(x);
    };
    const p1 = rootsOf(residual, -10.0123, 9.9871, 4000);

    // p2–p3
    const p2 = rk4VecAccurate((_, [y, v]) => [v, -4 * y], 0, [1, 2], Math.PI / 2)[0];
    const p3 = rk4VecAccurate((_, [y, v]) => [v, -6 * v - 9 * y], 0, [0, 1], 1)[0];

    // p4
    const F4 = (_: number, [y, v]: number[]): number[] => [v, -2 * v - 5 * y];
    const slope = (x: number): number => rk4VecAccurate(F4, 0, [0, 2], x, 4000)[1];
    let lo = 0.01;
    while (slope(lo + 0.01) > 0) lo += 0.01;
    const p4 = bisect(slope, lo, lo + 0.01);

    return {
      p1: { type: 'set', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
