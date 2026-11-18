// 独立验算 math.calculus.ratio-root-tests 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.ratio-root-tests.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { lgamma, partialSums, positiveSeriesConverges, radiusOfConvergence, rootLimit } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.ratio-root-tests',
  notes: {
    p1: '不用比值、根值判别法：通项（用对数算，免得上溢）在 n = 10⁶ 处不趋于 0 的判发散，其余看部分和每过一个数量级的增量（positiveSeriesConverges）。先拿 1/n²、1/n 检验判法。',
    p2: 'ln a_n / n 的极限再取指数（rootLimit，在 n 上外推）。',
    p3: '把 ∑ n!/nⁿ · cⁿ 看成 c 的幂级数，c₀ 就是收敛半径；用 ln|a_n|/n 求（radiusOfConvergence），再核对 c 略小于、略大于 c₀ 时项的走向（衰减、增大）。',
    p4: '在 n = 2…1000 上直接比出 a_{n+1}/a_n 的最大值 q，再算 a₁ + a₂/(1 − q)；核对它不小于部分和。',
  },
  compute() {
    const conv = (logA: (n: number) => number) => {
      if (!(logA(1e6) < -20)) return false;
      // 项衰减得极快（如 2ⁿ/(2n)!）时，部分和加到第 10 项就已到机器精度，增量全是 0，直接判收敛
      const [s10, s1e6] = partialSums((n) => Math.exp(logA(n)), [10, 1e6]);
      if (Math.abs(s1e6 - s10) <= 1e-15 * Math.abs(s1e6)) return true;
      return positiveSeriesConverges((n) => Math.exp(logA(n))).converges;
    };
    if (!conv((n) => -2 * Math.log(n)) || conv((n) => -Math.log(n))) throw new Error('p1：判法在已知例子上判错');
    const options: ((n: number) => number)[] = [
      (n) => n * Math.LN2 - lgamma(2 * n + 1),
      (n) => 3 * Math.log(n) - n * Math.log(3),
      (n) => n * Math.LN2 - 2 * Math.log(n),
      (n) => n * Math.log(n / (n + 1)),
    ];
    const p1 = options.map((logA, i) => (conv(logA) ? i + 1 : 0)).filter((i) => i > 0);

    const p2 = rootLimit((n) => n * Math.log((2 * n + 1) / (3 * n - 1)));
    if (p2 === null) throw new Error('p2：根值的极限没算出来');

    const logA3 = (n: number) => lgamma(n + 1) - n * Math.log(n);
    const p3 = radiusOfConvergence(logA3);
    if (p3 === null || !Number.isFinite(p3)) throw new Error('p3：收敛半径没算出来');
    const term = (c: number, n: number) => logA3(n) + n * Math.log(c);
    if (!(term(p3 * 0.99, 1e5) < term(p3 * 0.99, 1e4) && term(p3 * 1.01, 1e5) > term(p3 * 1.01, 1e4))) throw new Error('p3：c₀ 两侧项的走向不对');

    const a = (n: number) => n / 2 ** n;
    let q = 0;
    for (let n = 2; n <= 1000; n++) q = Math.max(q, a(n + 1) / a(n));
    const p4 = a(1) + a(2) / (1 - q);
    let s = 0;
    for (let n = 1; n <= 1000; n++) s += a(n);
    if (!(p4 >= s)) throw new Error('p4：上界比级数的和还小');
    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
