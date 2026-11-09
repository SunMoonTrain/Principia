// 独立验算 math.analysis.power-series-theory 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.power-series-theory.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { converges, partialSums, richardson } from './math.analysis._numeric.ts';

export const verification: Verification = {
  lesson: 'math.analysis.power-series-theory',
  notes: {
    p1: '比值 |aₙ/aₙ₊₁| 对 n = 1000·2ⁱ 做 Richardson 外推得收敛半径；再核对 n = 10⁶ 时 |aₙ|^{1/n} 和它的倒数相差不到 10⁻⁴。',
    p2:
      '在四个点上算前 2×10⁶ 个部分和，按批次 1 的收敛判据（[m, 2m] 上的振幅一路不增、最后小于 10⁻²）判断；' +
      '部分和溢出成无穷或 NaN 的直接算发散。',
    p3: '根值判别：|aₙ|^{1/n} 在 n ∈ [m, 2m] 上的最大值（m = 10、100、1000、10⁴，取对数算，免得溢出）都一样，就是上极限，收敛半径是它的倒数。',
    p4:
      '直接把 n²/2ⁿ 加到第 200 项；另用逐项求导核对：G(x) = Σxⁿ（加到第 400 项），Σn²xⁿ = xG′(x) + x²G″(x)，' +
      'G′、G″ 在 1/2 处用对称差商外推，和直接相加的结果相差不到 10⁻⁶。',
  },
  compute() {
    // p1：aₙ = n/5ⁿ，取对数算，免得 5ⁿ 溢出
    const logA1 = (n: number): number => Math.log(n) - n * Math.log(5);
    const R1 = richardson((n) => Math.exp(logA1(n) - logA1(n + 1)), 1000, 5);
    if (Math.abs(Math.exp(-logA1(1e6) / 1e6) - R1) > 1e-4) throw new Error('p1：根值和比值给的半径不一致');

    // p2：Σ (−1)ⁿxⁿ/√n 在四个点
    const points = [-1, 1, -0.5, 1.5];
    const p2: number[] = [];
    points.forEach((x, i) => {
      const S = partialSums(2_000_001, (n) => ((-1) ** n * x ** n) / Math.sqrt(n));
      if (S.slice(1).every(Number.isFinite) && converges(S)) p2.push(i + 1);
    });

    // p3：aₙ = (3 + (−1)ⁿ)ⁿ，ln|aₙ|/n
    const rootA3 = (n: number): number => Math.exp((n * Math.log(3 + (-1) ** n)) / n);
    const blockMax = [10, 100, 1000, 10_000].map((m) => {
      let best = 0;
      for (let n = m; n <= 2 * m; n++) best = Math.max(best, rootA3(n));
      return best;
    });
    if (Math.max(...blockMax) - Math.min(...blockMax) > 1e-12) throw new Error('p3：各段的最大值不一样');
    const R3 = 1 / blockMax[blockMax.length - 1];

    // p4：Σ n²/2ⁿ
    let direct = 0;
    for (let n = 1; n <= 200; n++) direct += (n * n) / 2 ** n;
    const G = (x: number): number => {
      let s = 0;
      let t = 1;
      for (let n = 0; n <= 400; n++) {
        s += t;
        t *= x;
      }
      return s;
    };
    const Gprime = richardson((k) => (G(0.5 + 1 / k) - G(0.5 - 1 / k)) * (k / 2), 100, 4);
    const Gsecond = richardson((k) => (G(0.5 + 1 / k) - 2 * G(0.5) + G(0.5 - 1 / k)) * k * k, 50, 4);
    if (Math.abs(0.5 * Gprime + 0.25 * Gsecond - direct) > 1e-6) throw new Error('p4：逐项求导和直接相加不一致');

    return {
      p1: { type: 'number', value: R1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: R3 },
      p4: { type: 'number', value: direct },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
