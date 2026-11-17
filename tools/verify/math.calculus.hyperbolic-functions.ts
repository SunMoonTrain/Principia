// 独立验算 math.calculus.hyperbolic-functions 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.hyperbolic-functions.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect, derivativeAt } from './math.calculus._calc.ts';

// 双曲函数按指数函数的定义算，不用 Math.sinh 这类现成函数。
const sinh = (x: number): number => (Math.exp(x) - Math.exp(-x)) / 2;
const cosh = (x: number): number => (Math.exp(x) + Math.exp(-x)) / 2;
const tanh = (x: number): number => sinh(x) / cosh(x);

export const verification: Verification = {
  lesson: 'math.calculus.hyperbolic-functions',
  notes: {
    p1: '按定义 (eˣ + e⁻ˣ)/2 直接算。',
    p2: 'tanh = sinh/cosh 按定义算，导数按定义外推差商在 ln 3 处的极限。',
    p3: 'sinh 在 [0, 5] 上递增，二分解 sinh x = 4/3，再算 cosh x。',
    p4: 'y = 2cosh(x/2) 的导数按定义外推；导数在 [0, 10] 上递增，二分解 y′ = 12/5，再算 y。',
  },
  compute() {
    const p1 = cosh(Math.log(2));
    const p2 = derivativeAt(tanh, Math.log(3));
    const x3 = bisect((x) => sinh(x) - 4 / 3, 0, 5);
    const p3 = [x3, cosh(x3)];
    const y = (x: number): number => 2 * cosh(x / 2);
    const x4 = bisect((x) => derivativeAt(y, x) - 12 / 5, 0, 10, 80);
    const p4 = [x4, y(x4)];
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
