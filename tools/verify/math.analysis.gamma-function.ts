// 独立验算 math.analysis.gamma-function 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.gamma-function.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { adaptiveSimpson } from './math.analysis._numeric.ts';

export const verification: Verification = {
  lesson: 'math.analysis.gamma-function',
  notes: {
    p1: '自适应辛普森公式积分到 x = 120（余下的小于 10⁻³⁸）。',
    p2: '按定义 Γ(9/2) = ∫₀^∞ x^{7/2} e^{−x} dx，自适应辛普森公式积分到 x = 120。',
    p3: '换元 x = u²（去掉 √x 在 0 处的奇性）得 ∫₀^∞ 2u² e^{−2u²} du，自适应辛普森公式积分到 u = 12。',
    p4: '直接在 [10⁻¹², 1] 上用自适应辛普森公式积分（[0, 10⁻¹²] 上的部分小于 10⁻³²）。',
  },
  compute() {
    const p1 = adaptiveSimpson((x) => x ** 5 * Math.exp(-x), 0, 120, 1e-12);
    const p2 = adaptiveSimpson((x) => x ** 3.5 * Math.exp(-x), 0, 120, 1e-12);
    const p3 = adaptiveSimpson((u) => 2 * u * u * Math.exp(-2 * u * u), 0, 12, 1e-14);
    const p4 = adaptiveSimpson((x) => x * x * Math.log(x) ** 2, 1e-12, 1, 1e-14);
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
