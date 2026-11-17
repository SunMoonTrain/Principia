// 独立验算 math.calculus.integration-by-parts 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.integration-by-parts.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { integrate } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.integration-by-parts',
  notes: {
    p1: '直接数值积分 ∫₀¹ x·e^(2x) dx，不分部。',
    p2: '直接数值积分 ∫₁^e ln x / x² dx。',
    p3: '直接数值积分 ∫₀^(π/2) x² cos x dx。',
    p4: '直接数值积分 ∫₀¹ ln(1 + x) dx。',
  },
  compute() {
    return {
      p1: { type: 'number', value: integrate((x) => x * Math.exp(2 * x), 0, 1) },
      p2: { type: 'number', value: integrate((x) => Math.log(x) / (x * x), 1, Math.E) },
      p3: { type: 'number', value: integrate((x) => x * x * Math.cos(x), 0, Math.PI / 2) },
      p4: { type: 'number', value: integrate((x) => Math.log(1 + x), 0, 1) },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
