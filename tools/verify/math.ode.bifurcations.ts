// 独立验算 math.ode.bifurcations 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.bifurcations.ts
// 分岔值不用 f = 0、f_y = 0 联立求，而是直接数平衡点：右边对 y 的最大（或最小）值穿过 0 时，零点成对出现或消失。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { attractsBothSides, bisect, maxOnGrid } from './math.ode._numeric.ts';

/** 参数取 mu 时，f(·, mu) 在 [−30, 30] 上有几个变号的零点。 */
const count = (f: (y: number, mu: number) => number, mu: number): number => rootsOf((y) => f(y, mu), -30, 30, 60_000).length;

export const verification: Verification = {
  lesson: 'math.ode.bifurcations',
  notes: {
    p1: 'f = y² − 4y + μ 对 y 的最小值 m(μ) 在 [−30, 30] 上数值求（格点加黄金分割），二分找 m(μ) = 0 的 μ；再数 μ₀ ∓ 0.01 处的零点，核对是 2 个和 0 个。',
    p2: 'f = y(1 − y) − h 对 y 的最大值数值求，二分找它等于 0 的 h；再数 h_c ∓ 0.01 处的零点，核对是 2 个和 0 个。',
    p3: 'f = μ − y − e^{−y} 对 y 的最大值数值求，二分找它等于 0 的 μ；再数 μ₀ ± 0.01 处的零点（一边 2 个、一边 0 个），确认那里平衡点的个数确实变了。',
    p4: '找出 8y − 2y³ 的零点，从每个零点两侧各偏 10⁻³ 出发积到 t = 50，两侧都回来的才算稳定。',
  },
  compute() {
    // p1
    const f1 = (y: number, mu: number): number => y * y - 4 * y + mu;
    const min1 = (mu: number): number => -maxOnGrid((y) => -f1(y, mu), -30, 30);
    const p1 = bisect(min1, -100, 100);
    if (count(f1, p1 - 0.01) !== 2 || count(f1, p1 + 0.01) !== 0) throw new Error('p1：平衡点个数没有从 2 变成 0');

    // p2
    const f2 = (y: number, h: number): number => y * (1 - y) - h;
    const max2 = (h: number): number => maxOnGrid((y) => f2(y, h), -30, 30);
    const p2 = bisect(max2, 0, 10);
    if (count(f2, p2 - 0.01) !== 2 || count(f2, p2 + 0.01) !== 0) throw new Error('p2：平衡点个数没有从 2 变成 0');

    // p3
    const f3 = (y: number, mu: number): number => mu - y - Math.exp(-y);
    const max3 = (mu: number): number => maxOnGrid((y) => f3(y, mu), -30, 30);
    const p3 = bisect(max3, -10, 10);
    if (count(f3, p3 + 0.01) !== 2 || count(f3, p3 - 0.01) !== 0) throw new Error('p3：平衡点个数在这里没有变');

    // p4
    const f4 = (y: number): number => 8 * y - 2 * y ** 3;
    const p4 = rootsOf(f4, -10, 10).filter((y) => attractsBothSides(f4, y));

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'set', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
