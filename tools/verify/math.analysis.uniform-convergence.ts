// 独立验算 math.analysis.uniform-convergence 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.uniform-convergence.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { grid, logGrid, supAbs } from './math.analysis._numeric.ts';

/** [0, 1] 上的取样点：2×10⁵ 等分，再在 0 和 1 附近按对数加密。 */
function unitSamples(): number[] {
  const near0 = logGrid(1e-7, 1, 4000);
  const near1 = logGrid(1e-10, 1, 4000).map((d) => 1 - d);
  return [...new Set([...grid(0, 1, 200_000), ...near0, ...near1])].sort((p, q) => p - q);
}

export const verification: Verification = {
  lesson: 'math.analysis.uniform-convergence',
  notes: {
    p1: '对 n = 1, 2, … 在 [0, 0.9] 上取样并细找 |xⁿ| 的上确界，第一个小于 0.01 的 n。',
    p2:
      '逐点极限取 N = 10¹⁵ 时的 f_N(x)（核对它和 f_{10N} 相差不到 10⁻⁶）；对 n = 10, 10², …, 10⁵ 算 sup|fₙ − f|：' +
      '[0, 1] 上 2×10⁵ 等分，再在 0、1 附近按对数加密，取样后细找。上确界一路不增、最后小于 10⁻² 的算一致收敛。',
    p3: '在 [−L, L] 上取样并细找 |f₂₅| 的上确界，L = 10、100、1000 结果相同（远处 |f₂₅(x)| ≤ 1/(25|x|)）。',
    p4:
      '对 n = 1…3000 在 [0.1, 1] 上取样并细找 gₙ 的上确界 s(n)，找最后一个 s(n) ≥ 0.05 的 n，N 就是它加 1；' +
      '再核对 n 从 N 到 3000、以及按对数取到 10⁷ 的 n，s(n) 都小于 0.05。',
  },
  compute() {
    // p1：xⁿ 在 [0, 0.9] 上
    const xs1 = grid(0, 0.9, 20_000);
    let n1 = 1;
    while (!(supAbs((x) => x ** n1, xs1) < 0.01)) n1++;

    // p2：哪些函数列在 [0, 1] 上一致收敛
    const families = [
      (n: number, x: number) => (n * x) / (1 + n * x),
      (n: number, x: number) => Math.sin(n * x) / Math.sqrt(n),
      (n: number, x: number) => (n * n * x) / (1 + n ** 3 * x * x),
      (n: number, x: number) => x ** n * (1 - x),
    ];
    const xs2 = unitSamples();
    const BIG = 1e15;
    const p2: number[] = [];
    families.forEach((f, i) => {
      for (const x of xs2) {
        if (Math.abs(f(BIG, x) - f(10 * BIG, x)) > 1e-6) throw new Error(`p2：第 ${i + 1} 个在 x = ${x} 处 N = 10¹⁵ 还没收敛`);
      }
      const sups = [10, 100, 1000, 10_000, 100_000].map((n) => supAbs((x) => f(n, x) - f(BIG, x), xs2));
      const uniform = sups.every((v, k) => k === 0 || v <= sups[k - 1] * 1.0001 + 1e-12) && sups[sups.length - 1] < 1e-2;
      if (uniform) p2.push(i + 1);
    });

    // p3：x/(4 + 25x²) 在 ℝ 上
    const f3 = (x: number): number => x / (4 + 25 * x * x);
    const sups3 = [10, 100, 1000].map((L) => supAbs(f3, grid(-L, L, 400_000)));
    if (Math.max(...sups3) - Math.min(...sups3) > 1e-12) throw new Error('p3：上确界随范围变化');

    // p4：gₙ(x) = nx/(1 + n²x²) 在 [0.1, 1] 上
    const xs4 = grid(0.1, 1, 9000);
    const s = (n: number): number => supAbs((x) => (n * x) / (1 + n * n * x * x), xs4);
    let lastBad = 0;
    for (let n = 1; n <= 3000; n++) if (s(n) >= 0.05) lastBad = n;
    const N4 = lastBad + 1;
    for (const n of logGrid(N4, 1e7, 200).map(Math.round)) {
      if (!(s(n) < 0.05)) throw new Error(`p4：n = ${n} 时上确界不小于 0.05`);
    }

    return {
      p1: { type: 'number', value: n1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: sups3[0] },
      p4: { type: 'number', value: N4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
