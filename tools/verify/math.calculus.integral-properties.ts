// 独立验算 math.calculus.integral-properties 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.integral-properties.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect, integrate } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.integral-properties',
  notes: {
    p1: '取两个满足已知条件的具体函数：分段常数 f（[0,2] 上 1.5、[2,5] 上 4/3）和一次函数 a + bx（由两个已知积分解出 a、b），分别数值积分 ∫₂⁵(2f + 1)dx，两者一致才取。',
    p2: '数值积分 ∫₀⁴(2x + 1)dx 再除以区间长 4。',
    p3: '直接数值积分 x³ + √(9 − x²) 在 [−3, 3] 上。',
    p4: '依次填平均值和 ξ：平均值 = (1/3)∫₀³x²dx（数值积分），再在 [0, 3] 上二分解 ξ² = 平均值。',
  },
  compute() {
    const fStep = (x: number) => (x < 2 ? 1.5 : 4 / 3);
    const a1 = integrate((x) => 2 * fStep(x) + 1, 2, 5);
    // a + bx：2a + 2b = 3，5a + 12.5b = 7
    const b = (7 - 2.5 * 3) / (12.5 - 5);
    const a = 1.5 - b;
    const check0 = integrate((x) => a + b * x, 0, 2);
    const check1 = integrate((x) => a + b * x, 0, 5);
    if (Math.abs(check0 - 3) > 1e-9 || Math.abs(check1 - 7) > 1e-9) throw new Error('p1：一次函数没有满足已知条件');
    const a2 = integrate((x) => 2 * (a + b * x) + 1, 2, 5);
    if (Math.abs(a1 - a2) > 1e-9) throw new Error(`p1：两个检验函数给出不同的结果 ${a1}、${a2}`);
    const p2 = integrate((x) => 2 * x + 1, 0, 4) / 4;
    const p3 = integrate((x) => x ** 3 + Math.sqrt(Math.max(0, 9 - x * x)), -3, 3);
    const avg = integrate((x) => x * x, 0, 3) / 3;
    const xi = bisect((x) => x * x - avg, 0, 3, 100);
    return {
      p1: { type: 'number', value: a1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [avg, xi] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
