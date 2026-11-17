// 独立验算 math.calculus.antiderivatives 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.antiderivatives.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { integrate } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.antiderivatives',
  notes: {
    p1: '不求原函数的式子：F(2) = F(0) + ∫₀² f(x) dx，积分用双指数数值积分（_calc.ts 的 integrate）。',
    p2: 'F(4) = F(0) + ∫₀⁴ √x dx，数值积分（端点处导数无界，双指数求积照样收敛）。',
    p3: 'F(e) = F(1) + ∫₁ᵉ (1 + x)²/x dx，数值积分。',
    p4: '切线斜率就是 F′(x) = 2ˣ：F(1) = F(0) + ∫₀¹ 2ˣ dx，数值积分。',
  },
  compute() {
    const p1 = 1 + integrate((x) => 3 * x * x + 2 * x - 5, 0, 2);
    const p2 = integrate(Math.sqrt, 0, 4);
    const p3 = integrate((x) => (1 + x) ** 2 / x, 1, Math.E);
    const p4 = 1 + integrate((x) => 2 ** x, 0, 1);
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
