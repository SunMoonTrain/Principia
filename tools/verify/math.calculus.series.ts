// 独立验算 math.calculus.series 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.series.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { positiveSeriesConverges, seriesSum } from './math.calculus._calc.ts';

/** 级数收敛与否：通项在 n = 10⁶ 处不趋于 0 的判发散；通项趋于 0 的（这几个选项里都是正项）看部分和的增量（positiveSeriesConverges）。 */
function converges(a: (n: number) => number): boolean {
  if (!(Math.abs(a(1e6)) < 1e-9 && Math.abs(a(1e6 + 1)) < 1e-9)) return false;
  return positiveSeriesConverges((n) => Math.abs(a(n))).converges;
}

export const verification: Verification = {
  lesson: 'math.calculus.series',
  notes: {
    p1: '部分和直接加到 2²⁰ 项（seriesSum，项按几何级数衰减，部分和早已稳定），不用求和公式。',
    p2: '先拿 ∑1/n²（收敛）、∑1/n（发散）检验判法；四个选项：通项在 n = 10⁶ 处不趋于 0 的判发散，其余看部分和每过一个数量级的增量（positiveSeriesConverges）。',
    p3: '部分和加到 2¹³…2²⁰ 项，按 1/N 理查森外推（seriesSum），不拆项。',
    p4: '通项写成 0.2ⁿ + 0.5ⁿ（免得 10ⁿ 上溢），部分和直接加（seriesSum）。',
  },
  compute() {
    const p1 = seriesSum((n) => 2 / 3 ** n);
    if (!p1.converged) throw new Error('p1：部分和没有稳定');

    if (!converges((n) => 1 / (n * n)) || converges((n) => 1 / n)) throw new Error('p2：判法在已知例子上判错');
    const options: ((n: number) => number)[] = [
      (n) => 1.01 ** n,
      (n) => (2 / 3) ** n,
      (n) => n / (2 * n + 1),
      (n) => 1 / 2 ** n + 1 / 3 ** n,
    ];
    const p2 = options.map((a, i) => (converges(a) ? i + 1 : 0)).filter((i) => i > 0);

    const p3 = seriesSum((n) => 1 / (n * n + 3 * n + 2));
    if (!p3.converged) throw new Error('p3：外推不收敛');
    const p4 = seriesSum((n) => 0.2 ** n + 0.5 ** n);
    if (!p4.converged) throw new Error('p4：部分和没有稳定');
    return {
      p1: { type: 'number', value: p1.value },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3.value },
      p4: { type: 'number', value: p4.value },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
