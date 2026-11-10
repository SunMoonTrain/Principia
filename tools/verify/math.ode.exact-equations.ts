// 独立验算 math.ode.exact-equations 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.exact-equations.ts
// 「恰当」不用判别法 M_y = N_x 判断，而用它的定义的推论：M dx + N dy 沿任何闭合曲线的积分是 0。
// 解初值问题不求势函数，直接对 y′ = −M/N 做数值积分。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { rk4Accurate } from './math.ode._numeric.ts';

type Form = { M: (x: number, y: number) => number; N: (x: number, y: number) => number };

/** M dx + N dy 沿圆 (cx + r cos θ, cy + r sin θ) 逆时针积一圈（周期函数用等距求和，收敛极快）。 */
function circulation({ M, N }: Form, cx: number, cy: number, r: number, n = 4000): number {
  let s = 0;
  for (let i = 0; i < n; i++) {
    const t = (2 * Math.PI * i) / n;
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    s += M(x, y) * (-r * Math.sin(t)) + N(x, y) * (r * Math.cos(t));
  }
  return (s * 2 * Math.PI) / n;
}

const circles: [number, number, number][] = [
  [0.5, 0.3, 1],
  [-2, 1.5, 0.7],
  [3, -1, 2],
  [-0.4, -2.2, 1.3],
];

export const verification: Verification = {
  lesson: 'math.ode.exact-equations',
  notes: {
    p1: '恰当时 M dx + N dy 沿闭合曲线积分为 0。算它沿圆心 (0.5, 0.3)、半径 1 的圆的积分（对 a 是线性的），找使它为 0 的 a；再核对另外三个圆上也是 0。',
    p2: '四阶龙格-库塔法积 y′ = −(2x + y)/(x + 2y)，从 x = 1 往回积到 0（沿途 x + 2y 不为 0）。',
    p3: '四阶龙格-库塔法积 y′ = −(3xy + y²)/(x² + xy)，从 x = 1 积到 2；不用题目说的积分因子。',
    p4: '整个平面上恰当 ⟺ 沿任何闭合曲线的积分为 0。在 4 个不同的圆上算积分，全是 0 的才选；不是 0 的那些，积分值远大于误差。',
  },
  compute() {
    // p1
    const form1 = (a: number): Form => ({ M: (x, y) => a * x * y + 1, N: (x, y) => x * x + y });
    const p1Roots = rootsOf((a) => circulation(form1(a), 0.5, 0.3, 1), -10, 10, 400);
    if (p1Roots.length !== 1) throw new Error('p1：零点个数不是 1');
    const p1 = p1Roots[0];
    for (const [cx, cy, r] of circles) if (Math.abs(circulation(form1(p1), cx, cy, r)) > 1e-8) throw new Error('p1：别的圆上积分不为 0');

    // p2、p3
    const p2 = rk4Accurate((x, y) => -(2 * x + y) / (x + 2 * y), 1, 1, 0);
    const p3 = rk4Accurate((x, y) => -(3 * x * y + y * y) / (x * x + x * y), 1, 1, 2);

    // p4
    const options: Form[] = [
      { M: (x, y) => y * Math.cos(x) + 2 * x, N: (x) => Math.sin(x) },
      { M: (x, y) => x * x * y, N: (x, y) => x * y * y },
      { M: (_, y) => Math.exp(y), N: (x, y) => x * Math.exp(y) + 2 * y },
      { M: (_, y) => 1 + 2 * y, N: (x) => x + 1 },
    ];
    const p4: number[] = [];
    options.forEach((form, i) => {
      const values = circles.map(([cx, cy, r]) => Math.abs(circulation(form, cx, cy, r)));
      if (values.every((v) => v < 1e-8)) p4.push(i + 1);
      else if (values.every((v) => v < 1e-3)) throw new Error(`p4：选项 ${i + 1} 的积分很小却不为 0，分不清`);
    });

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
