// 独立验算 math.ode.separable 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.separable.ts
// 不用分离变量的公式，直接对方程做数值积分。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect, rk4Accurate } from './math.ode._numeric.ts';

export const verification: Verification = {
  lesson: 'math.ode.separable',
  notes: {
    p1: '四阶龙格-库塔法从 x = 0 积到 1（2 万步，再和 4 万步的结果外推）。',
    p2: '对每个 k 用龙格-库塔法积 m′ = −km 到 t = 5（m(0) = 1），二分找使 m(5) = 1/2 的 k。',
    p3: '四阶龙格-库塔法从 x = 0 积到 1。',
    p4: '四阶龙格-库塔法从 x = 0 积到 ln 2。',
  },
  compute() {
    const p1 = rk4Accurate((x, y) => 2 * x * y, 0, 3, 1);
    const p2 = bisect((k) => rk4Accurate((_, m) => -k * m, 0, 1, 5, 2000) - 0.5, 0.001, 5);
    const p3 = rk4Accurate((x, y) => x * (1 + y * y), 0, 0, 1);
    const p4 = rk4Accurate((_, y) => 3 * y - y * y, 0, 1, Math.log(2));
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
