// 独立验算 math.calculus.power-series-calculus 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.power-series-calculus.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { partialSums, radiusOfConvergence, seriesSum } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.power-series-calculus',
  notes: {
    p1: '直接把级数加到 2²⁰ 项（seriesSum，项按几何级数衰减），不用逐项求导的公式。',
    p2: '把 ∑xⁿ/n 的系数 1/n 逐项求导，得 ∑ b_m x^m，b_m = (m + 1)·1/(m + 1)；R 用 ln|b_m|/m 求（radiusOfConvergence），两端代进去看通项是否趋于 0。',
    p3: '直接把级数加到第 200 项。',
    p4: '直接把级数加到第 60 项，不认出是 arctan。',
  },
  compute() {
    const p1 = seriesSum((n) => n / 4 ** (n - 1));
    if (!p1.converged) throw new Error('p1：部分和没有稳定');

    const b = (m: number) => (m + 1) * (1 / (m + 1)); // 逐项求导后 x^m 的系数，m 从 0 起
    const R = radiusOfConvergence((m) => Math.log(b(m)));
    if (R === null || !Number.isFinite(R)) throw new Error('p2：收敛半径没算出来');
    const termToZero = (x: number) => Math.abs(b(1e6) * x ** 1e6) < 1e-3;
    const left = termToZero(-R);
    const right = termToZero(R);
    // 通项不趋于 0 的端点必发散；两端都不趋于 0，收敛域就是开区间
    if (left || right) throw new Error('p2：端点处通项趋于 0，要再细判');
    const p2 = [1];

    const p3 = partialSums((n) => ((-1) ** (n + 1) * n) / 2 ** n, [200])[0];
    const p4 = partialSums((n) => (-1) ** n / ((2 * n + 1) * 3 ** n), [60], 0)[0];
    return {
      p1: { type: 'number', value: p1.value },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
