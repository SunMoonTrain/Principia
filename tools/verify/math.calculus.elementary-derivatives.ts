// 独立验算 math.calculus.elementary-derivatives 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.elementary-derivatives.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect, derivativeAt } from './math.calculus._calc.ts';

/** 凸函数在 [lo, hi] 上的最小值：三分法。 */
function convexMin(g: (x: number) => number, lo: number, hi: number): number {
  let a = lo;
  let b = hi;
  for (let k = 0; k < 300; k++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (g(m1) < g(m2)) b = m2;
    else a = m1;
  }
  return g((a + b) / 2);
}

export const verification: Verification = {
  lesson: 'math.calculus.elementary-derivatives',
  notes: {
    p1: '按定义外推 3ˣ 的差商在 x = 2 处的极限。',
    p2: '按定义外推 ∛(x²) 的差商在 x = 8 处的极限。',
    p3: '按定义外推 sin x/(1 + cos x) 的差商在 x = π/3 处的极限。',
    p4: '相切即 aˣ − x 的最小值恰为 0（aˣ − x 对 x 是凸的）：对每个 a 用三分法在 [−5, 30] 上求最小值，再对 a 在 [1.05, 2] 上二分，找最小值由负变正的那个 a。',
  },
  compute() {
    const p1 = derivativeAt((x) => 3 ** x, 2);
    const p2 = derivativeAt((x) => Math.cbrt(x * x), 8);
    const p3 = derivativeAt((x) => Math.sin(x) / (1 + Math.cos(x)), Math.PI / 3);
    const gap = (a: number): number => convexMin((x) => a ** x - x, -5, 30);
    const p4 = bisect(gap, 1.05, 2);
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
