// 独立验算 math.calculus.fundamental-theorem 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.fundamental-theorem.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect, derivativeAt, integrate } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.fundamental-theorem',
  notes: {
    p1: '直接数值积分 √x + 1/x 在 [1, 4] 上（不用原函数）。',
    p2: 'G(x) 用数值积分逐点算出来，再按导数的定义（差商两侧外推）求 G′(2)。',
    p3: 'H(x) = ∫_x^{x²} ln t dt 用数值积分逐点算，再按定义求 H′(2)（不用链式法则的公式）。',
    p4: 'F(c) = ∫₀^c (x² − 2x) dx 用数值积分算，在 [2, 5] 上二分求它的正零点（F(2) < 0 < F(5)）。',
  },
  compute() {
    const p1 = integrate((x) => Math.sqrt(x) + 1 / x, 1, 4);
    const G = (x: number) => integrate((t) => Math.sqrt(1 + t ** 3), 0, x);
    const p2 = derivativeAt(G, 2);
    const H = (x: number) => integrate((t) => Math.log(t), x, x * x);
    const p3 = derivativeAt(H, 2);
    const F = (c: number) => integrate((x) => x * x - 2 * x, 0, c);
    const p4 = bisect(F, 2, 5, 100);
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
