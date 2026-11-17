// 独立验算 math.calculus.substitution 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.substitution.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { integrate } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.substitution',
  notes: {
    p1: '直接数值积分 ∫₀^π sin(x/2) dx，不换元。',
    p2: '直接数值积分 ∫₀¹ x/√(1 + x²) dx。',
    p3: '直接数值积分 ∫₁^e (ln x)²/x dx。',
    p4: '直接数值积分 ∫₀³ x/√(x + 1) dx。',
  },
  compute() {
    return {
      p1: { type: 'number', value: integrate((x) => Math.sin(x / 2), 0, Math.PI) },
      p2: { type: 'number', value: integrate((x) => x / Math.sqrt(1 + x * x), 0, 1) },
      p3: { type: 'number', value: integrate((x) => Math.log(x) ** 2 / x, 1, Math.E) },
      p4: { type: 'number', value: integrate((x) => x / Math.sqrt(x + 1), 0, 3) },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
