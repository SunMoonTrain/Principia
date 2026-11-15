// 独立验算 math.calculus.derivative 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.derivative.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { derivativeAt, limitAt } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.derivative',
  notes: {
    p1: '按定义：差商 (f(2 + h) − f(2))/h 在 h → 0 时两侧外推。',
    p2: '平均速度直接算 (s(2.1) − s(2))/0.1；瞬时速度按定义外推差商在 t = 2 处的极限。',
    p3: '斜率按定义外推差商在 x = 2 处的极限，截距 = y(2) − 2·斜率。',
    p4: '取三个在 a 处导数为 3 的检验函数：a = 1，f = 3(x − 1) + (x − 1)² + 5；a = 0.4，f = 3 sin(x − 0.4) − 2；a = −2，f = eˣ·3e²（f′(−2) = 3）。数值求 (f(a + 2h) − f(a − h))/h 在 h → 0 时的两侧极限，三个一致。',
  },
  compute() {
    const p1 = derivativeAt((x) => 3 * x * x - x, 2);

    const s = (t: number): number => t * t + t;
    const p2 = [(s(2.1) - s(2)) / 0.1, derivativeAt(s, 2)];

    const y = (x: number): number => x ** 3 - 3 * x;
    const k3 = derivativeAt(y, 2);
    const p3 = [k3, y(2) - 2 * k3];

    const tests: { a: number; f: (x: number) => number }[] = [
      { a: 1, f: (x) => 3 * (x - 1) + (x - 1) ** 2 + 5 },
      { a: 0.4, f: (x) => 3 * Math.sin(x - 0.4) - 2 },
      { a: -2, f: (x) => Math.exp(x) * 3 * Math.exp(2) },
    ];
    for (const { a, f } of tests) if (Math.abs(derivativeAt(f, a) - 3) > 1e-6) throw new Error('p4：检验函数在 a 处的导数不是 3');
    const values = tests.map(({ a, f }) => limitAt((h) => (f(a + 2 * h) - f(a - h)) / h, 0));
    if (values.some((v) => v === null || Math.abs(v - values[0]!) > 1e-6)) throw new Error('p4：三个检验函数结果不一致');
    const p4 = values[0]!;

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
