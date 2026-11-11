// 独立验算 math.ode.laplace-ivp 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.laplace-ivp.ts
// 不做变换和部分分式：初值问题直接数值积分；p1 的 Y(1) 按定义 ∫₀^∞ e^{−t}y(t)dt，把这个积分并进方程组一起积。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { rk4VecAccurate } from './math.ode._numeric.ts';

export const verification: Verification = {
  lesson: 'math.ode.laplace-ivp',
  notes: {
    p1: '方程组 y′ = −2y、z′ = e^{−t}y，从 (0; 3, 0) 积到 t = 40，z(40) 就是 Y(1)（再往后的部分小于 e^{−100}）。',
    p2: '四阶龙格-库塔法积 y″ = y，从 (0; 0, 2) 积到 ln 2。',
    p3: '四阶龙格-库塔法积 y″ = −2y′ − 5y，从 (0; 1, −1) 积到 π/2。',
    p4: '四阶龙格-库塔法积 y″ = 2 − 3y′ − 2y，从 (0; 0, 0) 积到 ln 2。',
  },
  compute() {
    const p1 = rk4VecAccurate((t, [y]) => [-2 * y, Math.exp(-t) * y], 0, [3, 0], 40, 40_000)[1];
    const p2 = rk4VecAccurate((_, [y, v]) => [v, y], 0, [0, 2], Math.log(2))[0];
    const p3 = rk4VecAccurate((_, [y, v]) => [v, -2 * v - 5 * y], 0, [1, -1], Math.PI / 2)[0];
    const p4 = rk4VecAccurate((_, [y, v]) => [v, 2 - 3 * v - 2 * y], 0, [0, 0], Math.log(2))[0];
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
