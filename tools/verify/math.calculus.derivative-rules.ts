// 独立验算 math.calculus.derivative-rules 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.derivative-rules.ts

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { derivativeAt, roundTo } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.derivative-rules',
  notes: {
    p1: '按定义外推差商在 x = 1 处的极限（不用求导公式）。',
    p2: '按定义外推差商在 x = 5 处的极限。',
    p3: '取两组满足 u(2) = 3、u′(2) = −1、v(2) = 4、v′(2) = 5 的具体函数：u = 3 − (x − 2) + 0.7(x − 2)²、v = 4 + 5(x − 2) − 0.3(x − 2)³；u = 3 − sin(x − 2)、v = 4 + 5(x − 2)eˣ⁻²·(1 + (x − 2)²)。按定义数值求 uv 和 u/v 在 2 处的导数，两组一致。',
    p4: '切线平行于 y = x 即导数为 1：在 [−5, 5] 上对「数值导数 − 1」求根（导数按定义外推）。',
  },
  compute() {
    const p1 = derivativeAt((x) => 2 * x ** 4 - 3 * x * x + 5 * x - 7, 1);
    const p2 = derivativeAt((x) => (x + 1) / (x - 1), 5);

    const pairs: { u: (x: number) => number; v: (x: number) => number }[] = [
      { u: (x) => 3 - (x - 2) + 0.7 * (x - 2) ** 2, v: (x) => 4 + 5 * (x - 2) - 0.3 * (x - 2) ** 3 },
      { u: (x) => 3 - Math.sin(x - 2), v: (x) => 4 + 5 * (x - 2) * Math.exp(x - 2) * (1 + (x - 2) ** 2) },
    ];
    for (const { u, v } of pairs) {
      const ok = Math.abs(u(2) - 3) < 1e-12 && Math.abs(v(2) - 4) < 1e-12 && Math.abs(derivativeAt(u, 2) + 1) < 1e-6 && Math.abs(derivativeAt(v, 2) - 5) < 1e-6;
      if (!ok) throw new Error('p3：检验函数不满足条件');
    }
    const results = pairs.map(({ u, v }) => [derivativeAt((x) => u(x) * v(x), 2), derivativeAt((x) => u(x) / v(x), 2)]);
    if (results[0].some((r, i) => Math.abs(r - results[1][i]) > 1e-6)) throw new Error('p3：两组结果不一致');
    const p3 = results[0];

    const y = (x: number): number => x ** 3 - 2 * x * x + x;
    const p4 = rootsOf((x) => derivativeAt(y, x) - 1, -5, 5, 2001).map((r) => roundTo(r, 9));

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'set', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
