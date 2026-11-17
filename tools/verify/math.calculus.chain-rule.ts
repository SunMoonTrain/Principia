// 独立验算 math.calculus.chain-rule 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.chain-rule.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { derivativeAt } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.chain-rule',
  notes: {
    p1: '按定义外推差商在 x = 1 处的极限（直接对 (3x − 2)⁵ 算，不用链式法则）。',
    p2: '按定义外推 √(x² + 9) 的差商在 x = 4 处的极限。',
    p3: '按定义外推 1/(x² + 1)² 在 x = 1 处的导数得斜率 k，截距 b = y(1) − k。',
    p4: '取两组满足题设的具体函数：f = 2 + 4(x − 1) + (x − 1)²、g = 2 + 3(x − 1) − 2(x − 1)²；再各加上 (x − 1)²(x − 2)² 的倍数（不改 x = 1 处的值、导数和 x = 2 处的导数）。按定义数值求 f(g(x))、g(f(x)) 在 1 处的导数，两组一致。',
  },
  compute() {
    const p1 = derivativeAt((x) => (3 * x - 2) ** 5, 1);
    const p2 = derivativeAt((x) => Math.sqrt(x * x + 9), 4);

    const y3 = (x: number): number => 1 / (x * x + 1) ** 2;
    const k3 = derivativeAt(y3, 1);
    const p3 = [k3, y3(1) - k3];

    const bump = (x: number): number => (x - 1) ** 2 * (x - 2) ** 2;
    const pairs = [0, 1].map((s) => ({
      f: (x: number) => 2 + 4 * (x - 1) + (x - 1) ** 2 + s * bump(x),
      g: (x: number) => 2 + 3 * (x - 1) - 2 * (x - 1) ** 2 + 0.5 * s * bump(x),
    }));
    for (const { f, g } of pairs) {
      const ok =
        Math.abs(f(1) - 2) < 1e-12 &&
        Math.abs(derivativeAt(f, 1) - 4) < 1e-6 &&
        Math.abs(derivativeAt(f, 2) - 6) < 1e-6 &&
        Math.abs(g(1) - 2) < 1e-12 &&
        Math.abs(derivativeAt(g, 1) - 3) < 1e-6 &&
        Math.abs(derivativeAt(g, 2) + 1) < 1e-6;
      if (!ok) throw new Error('p4：检验函数不满足题设');
    }
    const results = pairs.map(({ f, g }) => [derivativeAt((x) => f(g(x)), 1), derivativeAt((x) => g(f(x)), 1)]);
    if (results[0].some((v, i) => Math.abs(v - results[1][i]) > 1e-6)) throw new Error('p4：两组结果不一致');
    const p4 = results[0];

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
