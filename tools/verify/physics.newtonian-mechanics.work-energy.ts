// 独立验算 physics.newtonian-mechanics.work-energy 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（W = F·Δr、∫F dx、动能定理、P = F·v）；二是不用这些式子：
// p1 让雪橇按一个不均匀的 x(t) 走，把功率 F·v 对时间数值积分；p3 把运动方程交给四阶龙格-库塔法积到 x = 3；
// p4 把钢索做的总功按「动能的增加 + 重力势能的增加」写成时间的函数，再数值求导得功率。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.work-energy.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, deg, deriv, integrate, linear, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.work-energy',
  notes: {
    p1: 'W = F d cos30° = 80 × 10 × cos30°；和积分核对：雪橇按 x(t) = 10 sin(πt/2)（0 ≤ t ≤ 1 s）走 10 m，功率 F·v = 80 cos30° · ẋ 对时间求积。',
    p2: '逐条用例子：A 推力 10 N、摩擦力 4 N 推箱子走 1 m，摩擦力做 −4 J，动能却增加 6 J（错）；B 匀速圆周运动，合力做功 0，速度方向变了（错）；C 竖直上抛回到原处，动能相同，模拟里重力做的功为 0（对）；D P = Fv、P 不变，v 从 10 到 20 m/s 时 F 从 P/10 降到 P/20（对）；E 上抛回到原处，重力 mg 走过路程 2h，做功却是 0（错）。',
    p3: 'W = ∫₁³ 3x² dx = 26 J，v = √(2W/m)；和积分核对：2.0 ẍ = 3x² 从 x = 1、v = 0 积到 x = 3。',
    p4: 'T = m(g + a)，P = T·at；和求导核对：钢索做的总功 W(t) = ½m(at)² + mg·½at²，在 t = 3 s 数值求导。',
  },
  compute() {
    // p1（J）
    const F = 80;
    const th = 30 * deg;
    const W1 = integrate((t) => F * Math.cos(th) * 10 * (Math.PI / 2) * Math.cos((Math.PI * t) / 2), 0, 1);
    const p1 = agree(W1, F * 10 * Math.cos(th), 'p1 拉力的功', 1e-12);

    // p2
    const optA = 10 * 1 - 4 * 1 < 0; // 合力做 6 J，动能增加
    const optB = false; // 匀速圆周运动：合力做功 0，速度方向在变
    const up = rk4Until(linear(() => -g), [0, 12], 0, 1e-3, 1e7, (_t, s) => (s[1] < 0 ? -s[0] : -1));
    const Wg = -1 * g * (up.y[0] - 0); // 回到原处，重力的功 −mgΔh = 0
    const optC = Math.abs(0.5 * up.y[1] ** 2 - 0.5 * 12 ** 2) < 1e-6 && Math.abs(Wg) < 1e-9;
    const P = 6e4;
    const optD = P / 20 < P / 10;
    const pathLen = 2 * (12 * 12) / (2 * g);
    const optE = Math.abs(1 * g * pathLen - 0) < 1e-9;
    check(pathLen > 1, 'E 的路程不为零');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m/s）
    const m = 2;
    const e = rk4Until(linear((_t, x) => (3 * x * x) / m), [1, 0], 0, 1e-4, 1e7, (_t, s) => s[0] - 3);
    const W3 = 3 ** 3 - 1 ** 3;
    const p3 = agree(e.y[1], Math.sqrt((2 * W3) / m), 'p3 速率', 1e-9);

    // p4（W）
    const M = 500;
    const a = 0.5;
    const t = 3;
    const T = M * (g + a);
    const formula4 = T * a * t;
    const Wt = (s: number) => 0.5 * M * (a * s) ** 2 + M * g * 0.5 * a * s * s;
    const p4 = agree(deriv(Wt, t), formula4, 'p4 功率', 1e-8);

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
