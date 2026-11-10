// 独立验算 math.ode.linear-first-order 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.linear-first-order.ts
// 不用积分因子的公式，直接对方程做数值积分。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect, rk4Accurate } from './math.ode._numeric.ts';

export const verification: Verification = {
  lesson: 'math.ode.linear-first-order',
  notes: {
    p1: '四阶龙格-库塔法积 y′ = 6 − 3y，从 x = 0 到 1。',
    p2: '四阶龙格-库塔法积 y′ = y + e^{2x}，从 x = 0 到 ln 2。',
    p3:
      '按题意列盐量 S 的变化率：流进 5 升/分 × 2 克/升，流出 5 升/分 × S/100 克/升（箱里一直是 100 升）。' +
      '对 t 二分，每次用龙格-库塔法积到 t，找 S(t) = 100 的时刻。',
    p4: '四阶龙格-库塔法积 y′ = x² − y/x，从 x = 1 到 2。',
  },
  compute() {
    const p1 = rk4Accurate((_, y) => 6 - 3 * y, 0, 0, 1);
    const p2 = rk4Accurate((x, y) => y + Math.exp(2 * x), 0, 2, Math.log(2));
    const salt = (t: number): number => rk4Accurate((_, S) => 5 * 2 - 5 * (S / 100), 0, 0, t, 4000);
    const p3 = bisect((t) => salt(t) - 100, 0.1, 200);
    const p4 = rk4Accurate((x, y) => x * x - y / x, 1, 1, 2);
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
