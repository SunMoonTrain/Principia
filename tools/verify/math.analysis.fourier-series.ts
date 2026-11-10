// 独立验算 math.analysis.fourier-series 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.fourier-series.ts
// 系数按讲解里的定义：aₙ = (1/L)∫_{−L}^{L} f(t) cos(nπt/L) dt（L = π 时就是 (1/π)∫ f cos nx），级数的常数项是 a₀/2。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { gaussLegendre, grid } from './math.analysis._numeric.ts';

/** 周期 2L 的余弦系数 aₙ，分段高斯-勒让德求积；breaks 是被积函数不光滑的点（分段时加进去）。 */
function cosCoefficient(f: (t: number) => number, L: number, n: number, breaks: number[] = []): number {
  const pts = [...new Set([...grid(-L, L, 8 * (n + 2)), ...breaks])].sort((p, q) => p - q);
  return gaussLegendre((t) => f(t) * Math.cos((n * Math.PI * t) / L), pts) / L;
}

export const verification: Verification = {
  lesson: 'math.analysis.fourier-series',
  notes: {
    p1: '按讲解的定义 a₀ = (1/π)∫_{−π}^{π} f(x) dx，分段高斯-勒让德求积。',
    p2: '同上，a₀、a₄ 按定义求积。',
    p3: '同上，在 x = 0（|x| 的尖点）处分段。',
    p4: '周期 2L = 2，aₙ = ∫_{−1}^{1} f(t) cos(nπt) dt，求积同上。',
  },
  compute() {
    const P = Math.PI;
    const p1 = cosCoefficient((x) => x * x, P, 0);
    const f2 = (x: number): number => 3 + 2 * Math.cos(4 * x) - Math.sin(5 * x);
    const p2 = [cosCoefficient(f2, P, 0), cosCoefficient(f2, P, 4)];
    const p3 = cosCoefficient((x) => Math.abs(x), P, 3, [0]);
    const f4 = (t: number): number => 1 - t * t;
    const p4 = [cosCoefficient(f4, 1, 0), cosCoefficient(f4, 1, 1)];
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
