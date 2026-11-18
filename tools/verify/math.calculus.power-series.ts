// 独立验算 math.calculus.power-series 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.power-series.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { lgamma, partialSums, positiveSeriesConverges, radiusOfConvergence, ratioLimit } from './math.calculus._calc.ts';

/**
 * 数项级数 ∑t(n) 收敛与否（端点用）：通项在 n = 10⁶ 处不趋于 0 的判发散；各项同号的看部分和的增量（positiveSeriesConverges）；
 * 正负相间的，∑|t| 收敛就收敛，否则要求相邻部分和的平均在 N = 10⁴、10⁵、10⁶ 处稳定（不用交错级数判别法）。
 */
function numericSeriesConverges(t: (n: number) => number): boolean {
  if (!(Math.abs(t(1e6)) < 1e-3 && Math.abs(t(1e6)) < Math.abs(t(1e3)) / 10)) return false;
  const abs = positiveSeriesConverges((n) => Math.abs(t(n))).converges;
  if (abs || t(1e6) * t(1e6 + 1) > 0) return abs;
  const Ns = [1e4, 1e5, 1e6];
  const S = partialSums(t, Ns);
  const avg = S.map((s, i) => s + t(Ns[i] + 1) / 2);
  return Math.abs(avg[1] - avg[0]) < 1e-5 && Math.abs(avg[2] - avg[1]) < 1e-5;
}

export const verification: Verification = {
  lesson: 'math.calculus.power-series',
  notes: {
    p1: 'R = 1/lim |a_n|^{1/n}（radiusOfConvergence，用 ln|a_n|，不用比值公式）。',
    p2: '同 p1 求 R；两个端点代进去成数项级数，同号的看部分和的增量，正负相间的看相邻部分和的平均是否稳定（不用交错级数判别法）。',
    p3: '同 p1，ln a_n = ln(2n)! − 2 ln n!（lgamma）。',
    p4: '把 3x − 1 看成新变量 u：u 的幂级数的 R 取相邻系数之比的极限（根值收敛太慢，端点 0 会差出 10⁻⁹），和根值算的核对到 10⁻⁶；两端是否收敛同 p2；再在 x = a、b 处直接核对级数收敛、在 a − 0.01、b + 0.01 处通项不趋于 0。',
  },
  compute() {
    const p1 = radiusOfConvergence((n) => Math.log(n) - n * Math.log(5));
    if (p1 === null) throw new Error('p1：收敛半径没算出来');

    const logA2 = (n: number) => -Math.log(n) - n * Math.log(4);
    const R2 = radiusOfConvergence(logA2);
    if (R2 === null) throw new Error('p2：收敛半径没算出来');
    const left = numericSeriesConverges((n) => (-1) ** n * Math.exp(logA2(n) + n * Math.log(R2)));
    const right = numericSeriesConverges((n) => Math.exp(logA2(n) + n * Math.log(R2)));
    const p2 = [!left && !right ? 1 : left && !right ? 2 : !left && right ? 3 : 4];

    const p3 = radiusOfConvergence((n) => lgamma(2 * n + 1) - 2 * lgamma(n + 1));
    if (p3 === null) throw new Error('p3：收敛半径没算出来');

    // 根值 n^{−2/n} 按 ln n/n 慢慢趋于 1，外推只准到 10⁻⁸ 左右，端点 a = 0 会差出 10⁻⁹ 量级；
    // 所以 R 取相邻系数之比的极限（误差按 1/n 展开，外推准到 10⁻¹²），再和根值算的核对到 10⁻⁶
    const Rroot = radiusOfConvergence((n) => -2 * Math.log(n));
    const ratio = ratioLimit((n) => -2 * Math.log(n));
    if (Rroot === null || ratio === null) throw new Error('p4：收敛半径没算出来');
    const Ru = 1 / ratio;
    if (Math.abs(Ru - Rroot) > 1e-6) throw new Error('p4：两种算法的收敛半径不一致');
    const tAt = (x: number) => (n: number) => (3 * x - 1) ** n / (n * n);
    const uLeft = numericSeriesConverges((n) => ((-Ru) ** n) / (n * n));
    const uRight = numericSeriesConverges((n) => Ru ** n / (n * n));
    if (!uLeft || !uRight) throw new Error('p4：按题意收敛域是闭区间，这里端点判出了发散');
    const a = (1 - Ru) / 3;
    const b = (1 + Ru) / 3;
    if (!numericSeriesConverges(tAt(a)) || !numericSeriesConverges(tAt(b))) throw new Error('p4：端点处级数不收敛');
    if (Math.abs(tAt(a - 0.01)(1e4)) < 1 || Math.abs(tAt(b + 0.01)(1e4)) < 1) throw new Error('p4：区间外通项没有变大');
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [a, b] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
