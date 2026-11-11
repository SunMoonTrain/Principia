// 独立验算 math.ode.matrix-exponential 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.matrix-exponential.ts
// 矩阵指数都按定义的级数直接求和，不用若尔当形的公式；p3 对方程组数值积分。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { expmSeries, rk4VecAccurate } from './math.ode._numeric.ts';

const scale = (A: number[][], t: number): number[][] => A.map((r) => r.map((x) => t * x));

export const verification: Verification = {
  lesson: 'math.ode.matrix-exponential',
  notes: {
    p1: '级数 Σ (tA)^k / k! 直接求和，t = ln 3，取右下角。',
    p2: '级数 Σ N^k / k! 直接求和。',
    p3: '四阶龙格-库塔法积 x₁′ = 2x₁ + x₂、x₂′ = −x₁，从 (0; 1, 0) 积到 1/2；再用级数算 e^{A/2}(1, 0) 核对。',
    p4: '级数 Σ (2A)^k / k! 直接求和，取右上角。',
  },
  compute() {
    // p1
    const p1 = expmSeries(scale([[1, 0], [0, -2]], Math.log(3)))[1][1];

    // p2
    const p2 = expmSeries([
      [2, -4],
      [1, -2],
    ]).flat();

    // p3
    const A3 = [
      [2, 1],
      [-1, 0],
    ];
    const p3 = rk4VecAccurate((_, [a, b]) => [2 * a + b, -a], 0, [1, 0], 0.5)[0];
    if (Math.abs(expmSeries(scale(A3, 0.5))[0][0] - p3) > 1e-9) throw new Error('p3：积分和级数对不上');

    // p4
    const A4 = [
      [-1, 1, 0],
      [0, -1, 1],
      [0, 0, -1],
    ];
    const p4 = expmSeries(scale(A4, 2))[0][2];

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
