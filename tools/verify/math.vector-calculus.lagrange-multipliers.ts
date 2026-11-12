// 独立验算 math.vector-calculus.lagrange-multipliers 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.lagrange-multipliers.ts
// 不用拉格朗日乘数：把约束曲线参数化，或用约束消去一个变量，再直接搜最大值、最小值（粗扫加黄金分割法细化）。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { argMin } from './math.vector-calculus._vc.ts';

/** g 在 [a, b] 上的最小值：先每隔 (b−a)/n 取一点，再在最好的那一点两侧用黄金分割法细化。 */
function minimum(g: (t: number) => number, a: number, b: number, n = 3600): number {
  const step = (b - a) / n;
  let k = 0;
  for (let i = 1; i <= n; i++) if (g(a + i * step) < g(a + k * step)) k = i;
  return g(argMin(g, Math.max(a, a + (k - 1) * step), Math.min(b, a + (k + 1) * step)));
}

export const verification: Verification = {
  lesson: 'math.vector-calculus.lagrange-multipliers',
  notes: {
    p1: '约束参数化为 x = √2 cos θ、y = √2 sin θ，在 [0, 2π] 上搜 x + y 的最大值。',
    p2: '用约束消去 y = 4 − x，在 x ∈ [−10, 10] 上搜 x² + y² 的最小值。',
    p3: '消去高 = 12 − 长 − 宽，对长在 (0,12) 上搜：对每个长，再对宽搜体积的最大值。',
    p4: '约束参数化为 x = 2√2 cos t、y = √2 sin t，在 [0, 2π] 上搜 xy 的最大值、最小值。',
  },
  compute() {
    const p1 = -minimum((th) => -(Math.SQRT2 * Math.cos(th) + Math.SQRT2 * Math.sin(th)), 0, 2 * Math.PI);
    const p2 = minimum((x) => x * x + (4 - x) ** 2, -10, 10);
    const bestWidth = (l: number): number => -minimum((w) => -(l * w * (12 - l - w)), 0, 12 - l, 600);
    const p3 = -minimum((l) => -bestWidth(l), 0, 12, 600);
    const xy = (t: number): number => 2 * Math.SQRT2 * Math.cos(t) * Math.SQRT2 * Math.sin(t);
    const p4 = [-minimum((t) => -xy(t), 0, 2 * Math.PI), minimum(xy, 0, 2 * Math.PI)];
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
