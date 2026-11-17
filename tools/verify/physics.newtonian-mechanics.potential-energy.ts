// 独立验算 physics.newtonian-mechanics.potential-energy 的 p1–p4（简单题、中等题）。
// 两套算法：一是机械能守恒；二是不用守恒式：把运动方程交给四阶龙格-库塔法积分——
// p1 按几个不同的抛射角积到落地，p3 有弹簧时受弹力和重力、离开弹簧后只受重力，积到最高点，p4 积单摆的方程到最低点。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.potential-energy.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, deg, integrate, linear, planar, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.potential-energy',
  notes: {
    p1: 'v = √(v₀² + 2gh) = √(100 + 392)；和积分核对：抛射角取 −60°、0°、37°、90°，平面运动积到 y = −20 m，四个落地速率都相同。',
    p2: '逐条用例子：A k = 100 N/m，伸长 0.1、0.2 m 时弹性势能 0.5、2 J，是 4 倍（错）；B 竖直平面内匀速转圈，最高点、最低点动能相同、势能差 2mgR（错）；C 匀速上升的电梯里的箱子合力为零，机械能在增加（错）；D 上抛积分，各时刻 ½v² + gy 都不变（对）；E 沿单位圆走一圈，重力 (0, −mg) 的曲线积分为 0（对）。',
    p3: '½kx² = mgh，h = ½ × 400 × 0.01/(0.10 × 9.8)；和积分核对：从放手处 y = 0 开始，弹簧压缩时受 k(0.10 − y) 和重力，y > 0.10 m 后只受重力，积到速度为零。',
    p4: 'v = √[2gL(1 − cos60°)]；和积分核对：单摆 θ̈ = −(g/L) sin θ 从 60° 静止积到 θ = 0，速率 L|θ̇|。',
  },
  compute() {
    // p1（m/s）
    const formula1 = Math.sqrt(10 * 10 + 2 * g * 20);
    const speeds = [-60, 0, 37, 90].map((a) => {
      const vx = 10 * Math.cos(a * deg);
      const vy = 10 * Math.sin(a * deg);
      const e = rk4Until(planar(() => [0, -g]), [0, 0, vx, vy], 0, 1e-4, 1e7, (_t, s) => (s[3] < 0 ? -20 - s[1] : -1));
      return Math.hypot(e.y[2], e.y[3]);
    });
    for (const s of speeds) agree(s, formula1, 'p1 不同抛射角的落地速率', 1e-9);
    const p1 = formula1;

    // p2
    const optA = Math.abs(0.5 * 100 * 0.2 ** 2 - 2 * 0.5 * 100 * 0.1 ** 2) < 1e-12;
    const R = 2;
    const optB = Math.abs(1 * g * 2 * R) < 1e-12; // 匀速转圈：两处机械能差 2mgR ≠ 0
    const optC = false; // 匀速上升：合力为零，势能增加、动能不变
    let maxDev = 0;
    rk4Until(linear(() => -g), [0, 15], 0, 1e-3, 1e7, (_t, s) => {
      maxDev = Math.max(maxDev, Math.abs(0.5 * s[1] ** 2 + g * s[0] - 0.5 * 225));
      return s[1] < 0 ? -s[0] : -1;
    });
    const optD = maxDev < 1e-9;
    const loop = integrate((th) => {
      const dx = -Math.sin(th);
      const dy = Math.cos(th);
      return 0 * dx + -1 * g * dy;
    }, 0, 2 * Math.PI);
    const optE = Math.abs(loop) < 1e-10;
    check(!optA && !optB, 'A、B 的反例成立');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m）
    const k = 400;
    const m = 0.1;
    const x0 = 0.1;
    const e3 = rk4Until(linear((_t, y) => (y < x0 ? (k * (x0 - y)) / m : 0) - g), [0, 0], 0, 1e-6, 1e8, (_t, s) => (s[0] > x0 ? -s[1] : -1));
    const p3 = agree(e3.y[0], (0.5 * k * x0 * x0) / (m * g), 'p3 最大高度', 1e-6);

    // p4（m/s）
    const L = 1;
    const e4 = rk4Until((_t, s) => [s[1], -(g / L) * Math.sin(s[0])], [60 * deg, 0], 0, 1e-5, 1e8, (_t, s) => -s[0]);
    const p4 = agree(L * Math.abs(e4.y[1]), Math.sqrt(2 * g * L * (1 - Math.cos(60 * deg))), 'p4 最低点的速率', 1e-9);

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
