// 独立验算 math.ode.variation-of-parameters 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.variation-of-parameters.ts
// p1、p2 按常数变易法的定义解 u₁′、u₂′ 满足的二元一次方程组，不用公式 u₁′ = −y₂g/W；p3、p4 直接对方程做数值积分。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { d1, rk4VecAccurate, simpson, solveLinear } from './math.ode._numeric.ts';

/** 在点 x 解 u₁′y₁ + u₂′y₂ = 0、u₁′y₁′ + u₂′y₂′ = g，导数用差分算。 */
function uPrime(y1: (x: number) => number, y2: (x: number) => number, g: (x: number) => number, x: number): number[] {
  return solveLinear(
    [
      [y1(x), y2(x)],
      [d1(y1, x, 1e-3), d1(y2, x, 1e-3)],
    ],
    [0, g(x)],
  );
}

export const verification: Verification = {
  lesson: 'math.ode.variation-of-parameters',
  notes: {
    p1: '在 x = −1、0.3、1.2 处解 u₁′、u₂′ 的方程组（y₁ = cos x、y₂ = sin x、g = sec x），核对 u₂′ 三处相同，取它的值。',
    p2: '同样的办法，y₁ = eˣ、y₂ = e^{−x}、g = 6eˣ，核对 u₁′ 三处相同。',
    p3: '四阶龙格-库塔法积 y″ = −y + sec x，从 (0; 0, 0) 积到 π/4。',
    p4: '对题目给的积分用辛普森公式算 ∫₀^π sin(π − s)·s ds；再用龙格-库塔法积 y″ = −y + x（零初值）到 π 核对。',
  },
  compute() {
    // p1
    const sec = (x: number): number => 1 / Math.cos(x);
    const u1 = [-1, 0.3, 1.2].map((x) => uPrime(Math.cos, Math.sin, sec, x)[1]);
    if (Math.max(...u1) - Math.min(...u1) > 1e-8) throw new Error('p1：u₂′ 不是常数');

    // p2
    const u2 = [-1, 0.3, 1.2].map((x) => uPrime(Math.exp, (t) => Math.exp(-t), (t) => 6 * Math.exp(t), x)[0]);
    if (Math.max(...u2) - Math.min(...u2) > 1e-6) throw new Error('p2：u₁′ 不是常数');

    // p3
    const p3 = rk4VecAccurate((x, [y, v]) => [v, -y + sec(x)], 0, [0, 0], Math.PI / 4)[0];

    // p4
    const p4 = simpson((s) => Math.sin(Math.PI - s) * s, 0, Math.PI, 2000);
    const check = rk4VecAccurate((x, [y, v]) => [v, -y + x], 0, [0, 0], Math.PI)[0];
    if (Math.abs(check - p4) > 1e-8) throw new Error('p4：积分和方程的解对不上');

    return {
      p1: { type: 'number', value: u1[0] },
      p2: { type: 'number', value: u2[0] },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
