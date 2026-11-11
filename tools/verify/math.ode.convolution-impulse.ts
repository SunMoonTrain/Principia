// 独立验算 math.ode.convolution-impulse 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.convolution-impulse.ts
// 不用时间平移公式和冲激响应：变换按定义求积；δ 函数换成宽 ε、高 1/ε 的矩形，ε 取两个值外推到 0。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { rk4, rk4VecAccurate, simpson } from './math.ode._numeric.ts';

export const verification: Verification = {
  lesson: 'math.ode.convolution-impulse',
  notes: {
    p1: '按定义 ∫₀^∞ e^{−t}u₂(t)dt：u₂ 在 t < 2 时为 0，所以对 e^{−t} 在 [2, 42] 上辛普森求积。',
    p2: '按卷积的定义 ∫₀¹ τ(1 − τ)dτ，辛普森求积。',
    p3:
      'δ(t − 1) 换成 [1, 1 + ε) 上高 1/ε 的矩形，分三段积 y″ + 4y = 外力（零初值）：[0, 1] 不动、[1, 1 + ε] 受力、[1 + ε, 2] 自由振动。' +
      'ε = 10⁻³、5·10⁻⁴ 两次，误差和 ε 成正比，线性外推到 ε = 0。',
    p4: 'y′ + y = u₁(t)：[0, 1] 上外力为 0（解保持 0），[1, 2] 上外力为 1，分两段用龙格-库塔法积。',
  },
  compute() {
    const p1 = simpson((t) => Math.exp(-t), 2, 42, 20_000);
    const p2 = simpson((tau) => tau * (1 - tau), 0, 1, 200);
    const pulse = (eps: number): number => {
      const atStart = rk4VecAccurate((_, [y, v]) => [v, -4 * y], 0, [0, 0], 1, 2000);
      const afterPulse = rk4VecAccurate((_, [y, v]) => [v, -4 * y + 1 / eps], 1, atStart, 1 + eps, 2000);
      return rk4VecAccurate((_, [y, v]) => [v, -4 * y], 1 + eps, afterPulse, 2, 20_000)[0];
    };
    const e1 = pulse(1e-3);
    const e2 = pulse(5e-4);
    const p3 = 2 * e2 - e1;
    const y1 = rk4((_, y) => -y, 0, 0, 1);
    const p4 = rk4((_, y) => 1 - y, 1, y1, 2);
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
