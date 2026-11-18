// 独立验算 physics.newtonian-mechanics.fixed-axis-rotation 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 I = Σmd²、I = ∫d²dm、L_z = Iω；二是 p1 按定义逐个质点算 m(xv_y − yv_x) 再除以 ω，
// p3 把细杆分成很多小段数值求和（不用积分公式），p4 用 RK4 积分圆环和圆盘之间的摩擦力矩，直到两者转得一样快。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.fixed-axis-rotation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, integrate, rk4Until } from './physics.newtonian-mechanics._nm.ts';

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.fixed-axis-rotation',
  notes: {
    p1: '1.0×0.10² + 2.0×0.20² + 3.0×0.30²；和把杆转到 37° 方向、ω = 2.5 rad/s 时逐个质点算角动量的 z 分量再除以 ω 核对。',
    p2: '逐条用例子：A ω = 3 rad/s，离转轴 0.1 m 和 0.2 m 的点向心加速度 0.9 和 1.8（对）；B 离转轴 1 m、方位角 0 和 π 的两点速度方向相反（错）；C 质量 1 kg、半径 1 m 的圆环和圆盘，I 是 1 和 0.5（错）；D I = Σmd² 里没有 ω：同一组质点在 ω = 1 和 ω = 7 时 L_z/ω 相同（对）；E 边长 1 m、质量 1 kg 的正方形薄板，数值二重积分得对中心的 I = 1/6、对角的 I = 2/3（对）。',
    p3: '以轴为原点从 −L/4 积到 3L/4：(7/48)ML²；和把杆分成 200000 小段、取每段中点的 md² 求和核对。',
    p4: '角动量守恒 ½MR²·30 = (½MR² + mR²)ω；和用 RK4 积分恒定摩擦力矩 0.05 N·m（圆盘减速、圆环加速）到两者角速度相等核对。',
  },
  compute() {
    // p1（kg·m²）
    const balls = [
      { m: 1.0, d: 0.1 },
      { m: 2.0, d: 0.2 },
      { m: 3.0, d: 0.3 },
    ];
    const Isum = balls.reduce((s, b) => s + b.m * b.d * b.d, 0);
    const w = 2.5;
    const th = (37 * Math.PI) / 180;
    const Lz = balls.reduce((s, b) => {
      const x = b.d * Math.cos(th);
      const y = b.d * Math.sin(th);
      const vx = -w * y;
      const vy = w * x;
      return s + b.m * (x * vy - y * vx);
    }, 0);
    const p1 = agree(Lz / w, Isum, 'p1 转动惯量', 1e-12);

    // p2
    const optA = 3 ** 2 * 0.2 > 3 ** 2 * 0.1;
    const vel = (phi: number, omega: number, d: number) => [-omega * d * Math.sin(phi), omega * d * Math.cos(phi)];
    const va = vel(0, 2, 1);
    const vb = vel(Math.PI, 2, 1);
    const optB = Math.abs(va[0] - vb[0]) < 1e-12 && Math.abs(va[1] - vb[1]) < 1e-12;
    const ring = 1 * 1 ** 2;
    const disc = integrate((r) => r * r * (1 / (Math.PI * 1)) * 2 * Math.PI * r, 0, 1);
    const optC = Math.abs(ring - disc) < 1e-12;
    const LzAt = (omega: number) => balls.reduce((s, b) => s + b.m * b.d * (omega * b.d), 0);
    const optD = Math.abs(LzAt(1) / 1 - LzAt(7) / 7) < 1e-12;
    const plate = (x0: number, x1: number) => integrate((x) => integrate((y) => x * x + y * y, x0, x1, 8, 8), x0, x1, 8, 8); // 面密度 1
    const Icenter = plate(-0.5, 0.5);
    const Icorner = plate(0, 1);
    check(Math.abs(Icenter - 1 / 6) < 1e-12 && Math.abs(Icorner - 2 / 3) < 1e-12, 'p2 E 正方形薄板的转动惯量');
    const optE = Icenter < Icorner;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（kg·m²）
    const M = 1.2;
    const L = 0.8;
    const N = 200000;
    const dx = L / N;
    let Ibar = 0;
    for (let i = 0; i < N; i++) {
      const x = -L / 4 + (i + 0.5) * dx;
      Ibar += (M / L) * dx * x * x;
    }
    const p3 = agree(Ibar, (7 / 48) * M * L * L, 'p3 细杆的转动惯量', 1e-9);

    // p4（rad/s）
    const Id = 0.5 * 2.0 * 0.1 ** 2;
    const Ir = 1.0 * 0.1 ** 2;
    const tau = 0.05;
    const slip = rk4Until((_t, _s) => [-tau / Id, tau / Ir], [30, 0], 0, 1e-4, 1e7, (_t, s) => s[1] - s[0]);
    const p4 = agree(slip.y[0], (Id * 30) / (Id + Ir), 'p4 共同的角速度', 1e-9);

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
