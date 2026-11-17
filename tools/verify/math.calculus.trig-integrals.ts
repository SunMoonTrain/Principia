// 独立验算 math.calculus.trig-integrals 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.trig-integrals.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { integrate } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.trig-integrals',
  notes: {
    p1: '直接数值积分 ∫₀^(π/2) sin³x cos²x dx，不凑微分。',
    p2: '直接数值积分 ∫₀^(π/3) cos²x dx，不降幂。',
    p3: '直接数值积分 ∫₀^(π/2) sin 3x cos x dx，不积化和差。',
    p4: '直接数值积分 ∫₀^(π/2) dx/(2 + sin x)，不用万能代换。',
  },
  compute() {
    return {
      p1: { type: 'number', value: integrate((x) => Math.sin(x) ** 3 * Math.cos(x) ** 2, 0, Math.PI / 2) },
      p2: { type: 'number', value: integrate((x) => Math.cos(x) ** 2, 0, Math.PI / 3) },
      p3: { type: 'number', value: integrate((x) => Math.sin(3 * x) * Math.cos(x), 0, Math.PI / 2) },
      p4: { type: 'number', value: integrate((x) => 1 / (2 + Math.sin(x)), 0, Math.PI / 2) },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
