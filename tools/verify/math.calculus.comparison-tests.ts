// 独立验算 math.calculus.comparison-tests 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.comparison-tests.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { integrateToInfinity, positiveSeriesConverges, seriesSum } from './math.calculus._calc.ts';

/**
 * 柯西凝聚判别法（讲解里没有，用来独立判 p 接近 1 的级数）：项单调递减时 ∑a_n 和 ∑2^k a_{2^k} 同时收敛或发散。
 * 传 ln a_n；看 ln(2^k a_{2^k}) 在 k = 40 到 60 之间每步的平均变化：小于 −0.01（凝聚后的项按几何级数衰减）判收敛，
 * 不小于 −0.001 判发散，夹在中间的不下结论。
 */
function condensed(logA: (n: number) => number): boolean {
  const lb = (k: number) => k * Math.LN2 + logA(2 ** k);
  const slope = (lb(60) - lb(40)) / 20;
  if (slope < -0.01) return true;
  if (slope >= -0.001) return false;
  throw new Error(`凝聚后每步变化 ${slope}，判不了`);
}

export const verification: Verification = {
  lesson: 'math.calculus.comparison-tests',
  notes: {
    p1: '柯西凝聚判别法（讲解里没有）：看 ln(2^k a_{2^k}) 在 k = 40…60 上每步的平均变化，凝聚后的项按几何级数衰减判收敛、不衰减判发散。先拿 1/n²、1/n^{1.05}（收敛）和 1/n、1/n^{0.95}（发散）检验判法。',
    p2: 'a₁ + ∫₁^{+∞} x⁻³ dx 用数值积分（integrateToInfinity）；再核对这个数确实不小于部分和外推出的 ∑1/n³。',
    p3: 'a 从 1 试到 6，每个 a 看部分和每过一个数量级的增量（positiveSeriesConverges），取第一个收敛的。',
    p4: 'N 从 1 往上试，找第一个使 ln(N + 1) > 5 的 N。',
  },
  compute() {
    const known: [string, (n: number) => number, boolean][] = [
      ['1/n²', (n) => -2 * Math.log(n), true],
      ['1/n^1.05', (n) => -1.05 * Math.log(n), true],
      ['1/n', (n) => -Math.log(n), false],
      ['1/n^0.95', (n) => -0.95 * Math.log(n), false],
    ];
    for (const [name, logA, want] of known) if (condensed(logA) !== want) throw new Error(`p1：判法在已知例子 ${name} 上判错`);
    const options: ((n: number) => number)[] = [
      (n) => -1.1 * Math.log(n),
      (n) => -0.9 * Math.log(n),
      (n) => -(n * Math.log(3) + Math.log1p(n * Math.exp(-n * Math.log(3)))),
      (n) => Math.log(n) - Math.log(n * n + 1),
    ];
    const p1 = options.map((logA, i) => (condensed(logA) ? i + 1 : 0)).filter((i) => i > 0);

    const p2 = 1 + integrateToInfinity((x) => x ** -3, 1);
    const zeta3 = seriesSum((n) => 1 / n ** 3).value;
    if (!(p2 >= zeta3)) throw new Error('p2：上界比级数的和还小');

    let p3 = 0;
    for (let a = 1; a <= 6 && !p3; a++) if (positiveSeriesConverges((n) => (n * n) / (n ** a + 1)).converges) p3 = a;
    if (!p3) throw new Error('p3：1 到 6 都不收敛');

    let p4 = 1;
    while (!(Math.log(p4 + 1) > 5)) p4++;
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
