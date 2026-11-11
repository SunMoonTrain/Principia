// 独立验算 math.ode.second-order-linear 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.second-order-linear.ts
// 解初值问题都直接对方程做数值积分；朗斯基行列式由数值解或差分求导算，不用阿贝尔公式。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { d1, rk4VecAccurate } from './math.ode._numeric.ts';

export const verification: Verification = {
  lesson: 'math.ode.second-order-linear',
  notes: {
    p1: '按定义 W = y₁y₂′ − y₁′y₂，导数用五点差分算，在 x = 0.37 处求值，再核对 x = −1.2、2.5 处一样。',
    p2: '四阶龙格-库塔法积 y″ = y，从 (0; 3, 1) 积到 ln 2。',
    p3:
      '数值积出两个解：x = 1 处 (y, y′) 分别取 (1, 0)、(0, 1)，它们在 1 处的朗斯基行列式是 1；' +
      '积到 x = 3 算出那里的行列式，再乘 6（同一个方程的两组解，行列式差一个常数倍：两组解之间是一个常数矩阵）。',
    p4: '四阶龙格-库塔法积 y″ = (xy′ − y)/x²，从 x = 1 处 (0, 1) 积到 e。',
  },
  compute() {
    // p1
    const W1 = (x: number): number => {
      const y1 = (t: number): number => Math.cos(3 * t);
      const y2 = (t: number): number => Math.sin(3 * t);
      return y1(x) * d1(y2, x, 1e-3) - d1(y1, x, 1e-3) * y2(x);
    };
    const p1 = W1(0.37);
    for (const x of [-1.2, 2.5]) if (Math.abs(W1(x) - p1) > 1e-8) throw new Error('p1：行列式不是常数');

    // p2
    const p2 = rk4VecAccurate((_, [y, v]) => [v, y], 0, [3, 1], Math.log(2))[0];

    // p3
    const F3 = (x: number, [y, v]: number[]): number[] => [v, (y - x * v) / (x * x)];
    const [a, ap] = rk4VecAccurate(F3, 1, [1, 0], 3);
    const [b, bp] = rk4VecAccurate(F3, 1, [0, 1], 3);
    const p3 = 6 * (a * bp - ap * b);

    // p4
    const p4 = rk4VecAccurate((x, [y, v]) => [v, (x * v - y) / (x * x)], 1, [0, 1], Math.E)[0];

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
