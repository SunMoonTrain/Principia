// 独立验算 math.calculus.taylor-series 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.taylor-series.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { lgamma, partialSums } from './math.calculus._calc.ts';
import { Jet } from './math.calculus._jet.ts';

export const verification: Verification = {
  lesson: 'math.calculus.taylor-series',
  notes: {
    p1: '泰勒展开式算术（_jet.ts）在 0 处算 e^{2x} 的 3 阶系数 f‴(0)/3!，不用 2ⁿ/n! 的公式。',
    p2: '四个级数在 x = 1.5 处各加 200、201 项，部分和稳定且等于函数值（差不到 10⁻¹⁰）的算成立。',
    p3: '直接把级数加到第 30 项（项用对数算），不认出是哪个函数。',
    p4: '直接把级数加到第 80 项，不认出是哪个函数。',
  },
  compute() {
    const p1 = Jet.variable(0, 3).mul(2).exp().c[3];

    const x = 1.5;
    const series: [(n: number) => number, number, number][] = [
      [(n) => Math.exp(n * Math.log(x) - lgamma(n + 1)), 0, Math.exp(x)],
      [(n) => (-1) ** n * Math.exp(2 * n * Math.log(x) - lgamma(2 * n + 1)), 0, Math.cos(x)],
      [(n) => ((-1) ** (n + 1) * x ** n) / n, 1, Math.log(1 + x)],
      [(n) => x ** n, 0, 1 / (1 - x)],
    ];
    const p2 = series
      .map(([t, n0, f], i) => {
        const [s1, s2] = partialSums(t, [n0 + 199, n0 + 200], n0);
        return Math.abs(s1 - f) < 1e-10 && Math.abs(s2 - f) < 1e-10 ? i + 1 : 0;
      })
      .filter((i) => i > 0);

    const p3 = partialSums((n) => (-1) ** n * Math.exp((2 * n + 1) * Math.log(Math.PI / 2) - lgamma(2 * n + 2)), [30], 0)[0];
    const p4 = partialSums((n) => 1 / (n * 2 ** n), [80])[0];
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
