// 独立验算 math.calculus.implicit-differentiation 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.implicit-differentiation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect, derivativeAt } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.implicit-differentiation',
  notes: {
    p1: '对 x 附近的每个值，在 y ∈ [1, 3] 上二分解 x² + xy + y² = 7，得到过 (1, 2) 的那一支 y(x)；再按定义外推 y(x) 在 x = 1 处的差商（不对方程求导）。',
    p2: '按定义外推 x·arctan x 的差商在 x = 1 处的极限。',
    p3: '按定义外推 xˣ 的差商在 x = 2 处的极限。',
    p4: 'f 严格递增：在 [−10, 10] 上二分解 f(x) = y 得反函数 g(y)；g(3) 直接算，g′(3) 按定义外推 g 的差商。',
  },
  compute() {
    const yOf = (x: number): number => bisect((y) => x * x + x * y + y * y - 7, 1, 3);
    if (Math.abs(yOf(1) - 2) > 1e-12) throw new Error('p1：这一支不过 (1, 2)');
    const p1 = derivativeAt(yOf, 1);

    const p2 = derivativeAt((x) => x * Math.atan(x), 1);
    const p3 = derivativeAt((x) => x ** x, 2);

    const g = (y: number): number => bisect((x) => x ** 3 + x + 1 - y, -10, 10);
    const p4 = [g(3), derivativeAt(g, 3)];

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
