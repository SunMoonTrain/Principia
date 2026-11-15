// 独立验算 math.calculus.limit-laws 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.limit-laws.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { limitAt } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.limit-laws',
  notes: {
    p1: '在 −1 的两侧外推 (x² + 3x)/(2x − 5) 的单侧极限。',
    p2: '取两组满足条件的具体函数：a = 0.7，f = 3 + sin(x − a)、g = −2 + (x − a)²；a = −1.3，f = 3 + 5(x − a)³、g = −2 − |x − a|。数值求 (f² − g)/(f + 2g) 在 a 处的极限，两组一致。',
    p3: '在 5 的两侧外推 (√(x + 4) − 3)/(x − 5) 的单侧极限。',
    p4: '在 1 的两侧外推 1/(x − 1) − 2/(x² − 1) 的单侧极限（直接按原式算，不先通分）。',
  },
  compute() {
    const p1 = limitAt((x) => (x * x + 3 * x) / (2 * x - 5), -1)!;

    const pairs: { a: number; f: (x: number) => number; g: (x: number) => number }[] = [
      { a: 0.7, f: (x) => 3 + Math.sin(x - 0.7), g: (x) => -2 + (x - 0.7) ** 2 },
      { a: -1.3, f: (x) => 3 + 5 * (x + 1.3) ** 3, g: (x) => -2 - Math.abs(x + 1.3) },
    ];
    const values = pairs.map(({ a, f, g }) => limitAt((x) => (f(x) ** 2 - g(x)) / (f(x) + 2 * g(x)), a));
    if (values.some((v) => v === null) || Math.abs(values[0]! - values[1]!) > 1e-6) throw new Error('p2：两组函数算出的极限不一致');
    const p2 = values[0]!;

    const p3 = limitAt((x) => (Math.sqrt(x + 4) - 3) / (x - 5), 5)!;
    const p4 = limitAt((x) => 1 / (x - 1) - 2 / (x * x - 1), 1)!;

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
