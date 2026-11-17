// 独立验算 math.calculus.differentials 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.differentials.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { derivativeAt } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.differentials',
  notes: {
    p1: '线性近似 L(x) = f(9) + f′(9)(x − 9)，f′(9) 按定义外推，代入 x = 9.06。',
    p2: 'dy = f′(2)·Δx（f′ 按定义外推），Δy = f(2.1) − f(2) 直接算。',
    p3: 'V = a³，dV = V′(5)·0.02（V′ 按定义外推），相对误差 dV/V(5)。',
    p4: '1/x 在 1 处的线性近似 L(x) = 1 + f′(1)(x − 1)（f′ 按定义外推），误差 = L(x) − 1/x，x 取 1.1、1.01。',
  },
  compute() {
    const L1 = Math.sqrt(9) + derivativeAt(Math.sqrt, 9) * (9.06 - 9);

    const cube = (x: number): number => x ** 3;
    const p2 = [derivativeAt(cube, 2) * 0.1, cube(2.1) - cube(2)];

    const dV = derivativeAt(cube, 5) * 0.02;
    const p3 = [dV, dV / cube(5)];

    const inv = (x: number): number => 1 / x;
    const k = derivativeAt(inv, 1);
    const L = (x: number): number => inv(1) + k * (x - 1);
    const p4 = [L(1.1) - inv(1.1), L(1.01) - inv(1.01)];

    return {
      p1: { type: 'number', value: L1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
