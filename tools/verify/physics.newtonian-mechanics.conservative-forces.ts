// 独立验算 physics.newtonian-mechanics.conservative-forces 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（F = −∇U、旋度判别、W = U(A) − U(B)）；二是不用这些式子：
// p1、p4 对势能做数值求导；p2 沿几个小正方形、圆数值算环流，不为零就不保守；p3 沿两条不同的路径数值算曲线积分。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.conservative-forces.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, deriv, integrate } from './physics.newtonian-mechanics._nm.ts';

type F2 = (x: number, y: number) => [number, number];

/** 沿参数曲线 r(s)（s 从 0 到 1）的曲线积分 ∫F·dr，dr 用数值求导。 */
function lineIntegral(F: F2, r: (s: number) => [number, number]): number {
  return integrate((s) => {
    const [x, y] = r(s);
    const dx = deriv((q) => r(q)[0], s, 1e-6);
    const dy = deriv((q) => r(q)[1], s, 1e-6);
    const [fx, fy] = F(x, y);
    return fx * dx + fy * dy;
  }, 0, 1);
}

/** 以 (cx, cy) 为圆心、半径 a 的圆，逆时针一圈的环流。 */
const circulation = (F: F2, cx: number, cy: number, a: number) =>
  lineIntegral(F, (s) => [cx + a * Math.cos(2 * Math.PI * s), cy + a * Math.sin(2 * Math.PI * s)]);

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.conservative-forces',
  notes: {
    p1: 'F = −U′(x) = −(6x − 6x²)，x = 2 时 12 N；和数值求导核对。',
    p2: '旋度判别 ∂F_y/∂x = ∂F_x/∂y：在 (0.3, −1.2)、(2, 0.5)、(−1.5, 2.5) 三点数值求偏导，A、C、E 处处相等；和环流核对：以 (0, 0)、(1, −2)、(3, 1) 为圆心、半径 0.5、2 的圆各走一圈，A、C、E 的环流都是 0，B 是 −2πa²，D 在 (1, −2) 处半径 0.5 的圆上是 −2.36（不保守）。',
    p3: '势函数 f = x³y + y²，W = f(2, 1) − f(1, 0) = 9 J；和曲线积分核对：沿直线段和沿 y = (x − 1)² 两条路径数值积分，都是 9。',
    p4: '|F| = |∇U| = |(6x + 2y, 2x + 2y)| = |(8, 4)|；和数值求偏导核对。',
  },
  compute() {
    // p1（N）
    const U1 = (x: number) => 3 * x * x - 2 * x ** 3;
    const p1 = agree(-deriv(U1, 2), -(6 * 2 - 6 * 4), 'p1 力', 1e-8);

    // p2
    const fields: F2[] = [
      (x, y) => [y, x],
      (x, y) => [y, -x],
      (x, y) => [x * x, y * y],
      (x, y) => [x * y, x * y],
      (x, y) => [2 * x + y, x + 2 * y],
    ];
    // 旋度判别：在几个点上数值算 ∂F_y/∂x − ∂F_x/∂y，处处为零才算
    const pts = [[0.3, -1.2], [2, 0.5], [-1.5, 2.5]];
    const curlZero = fields.map((F) => pts.every(([x, y]) => Math.abs(deriv((q) => F(q, y)[1], x) - deriv((q) => F(x, q)[0], y)) < 1e-7));
    const byLoops = fields.map((F) => {
      const loops = [[0, 0, 0.5], [0, 0, 2], [1, -2, 0.5], [3, 1, 2]].map(([cx, cy, a]) => circulation(F, cx, cy, a));
      return loops.every((c) => Math.abs(c) < 1e-8);
    });
    for (let i = 0; i < 5; i++) check(byLoops[i] === curlZero[i], `p2 选项 ${'ABCDE'[i]} 两种判断一致`);
    const p2 = chosen(byLoops);

    // p3（J）
    const F3: F2 = (x, y) => [3 * x * x * y, x ** 3 + 2 * y];
    const straight = lineIntegral(F3, (s) => [1 + s, s]);
    const curved = lineIntegral(F3, (s) => [1 + s, s * s]);
    agree(curved, straight, 'p3 两条路径', 1e-9);
    const f = (x: number, y: number) => x ** 3 * y + y * y;
    const p3 = agree(straight, f(2, 1) - f(1, 0), 'p3 功', 1e-9);

    // p4（N）
    const U4 = (x: number, y: number) => 3 * x * x + 2 * x * y + y * y;
    const gx = deriv((x) => U4(x, 1), 1);
    const gy = deriv((y) => U4(1, y), 1);
    const p4 = agree(Math.hypot(gx, gy), Math.hypot(6 + 2, 2 + 2), 'p4 力的大小', 1e-8);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
