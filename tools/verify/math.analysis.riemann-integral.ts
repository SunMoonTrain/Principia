// 独立验算 math.analysis.riemann-integral 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.riemann-integral.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { darboux, richardson } from './math.analysis._numeric.ts';

export const verification: Verification = {
  lesson: 'math.analysis.riemann-integral',
  notes: {
    p1: '按定义算：每一段上 f 的上确界、下确界在 2000 个格点（含两端）上取，乘段长相加。',
    p2: '同 p1；f 只在 1/2 这一点和别处不同，所以每一段的取样点里另加上落在这一段里的 1/2。',
    p3: '对 k = 1, 2, … 逐个算 U − L：x² 在 [0, 1] 上递增（格点上核对过），第 i 段的上、下确界是右、左端点的值，U − L = Σ(i² − (i − 1)²)/k³，用整数精确比较 100·Σ < k³，第一个满足的 k 就是答案。',
    p4:
      '有理点、无理点在每一段里都有，所以每一段的上确界取「x（有理点）和 0（无理点）」两种值的最大，下确界取最小；n 等分时算出上和、下和，' +
      'n = 1000·2ⁱ 做 Richardson 外推得上积分（上和的下确界），下和每次都是 0。',
  },
  compute() {
    // p1：f(x) = x，[0, 2] 四等分
    const p1 = darboux((x) => [x], [0, 0.5, 1, 1.5, 2]);

    // p2：f(1/2) = 5，别处 1；P = {0, 0.4, 0.6, 1}
    const p2 = darboux((x) => [x === 0.5 ? 5 : 1], [0, 0.4, 0.6, 1], [0.5]);

    // p3：x² 在 [0, 1] 上 k 等分，U − L < 0.01 的最小 k
    const sq = (x: number): number => x * x;
    for (let i = 1; i <= 1000; i++) if (!(sq(i / 1000) > sq((i - 1) / 1000))) throw new Error('p3：x² 不是递增的');
    let k = 1;
    for (; ; k++) {
      let s = 0;
      for (let i = 1; i <= k; i++) s += i * i - (i - 1) * (i - 1);
      if (100 * s < k * k * k) break;
    }

    // p4：x 是有理数时 f = x，无理数时 f = 0
    const values = (x: number): number[] => [x, 0];
    const upper = richardson((n) => darboux(values, Array.from({ length: n + 1 }, (_, i) => i / n), [], 2)[0], 1000);
    const lowerSums = [1000, 4000, 16000].map((n) => darboux(values, Array.from({ length: n + 1 }, (_, i) => i / n), [], 2)[1]);
    if (lowerSums.some((v) => v !== 0)) throw new Error('p4：下和不是 0');

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'number', value: k },
      p4: { type: 'tuple', value: [upper, 0] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
