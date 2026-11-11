// 独立验算 physics.electromagnetism.rc-circuits 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的指数解 q = q₀e^{−t/RC}、充电 Δφ = ℰ(1 − e^{−t/RC})、戴维南等效；
// 二是不用指数解：按基尔霍夫定律写出电容器电荷（或电势差）的微分方程，用四阶龙格-库塔法积分，二分出到达某个值的时刻。
// 时间常数按定义取：放电到初值的 1/e、充电到终值的 1 − 1/e 所用的时间。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.rc-circuits.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, rk4, rk4Until } from './physics.electromagnetism._es.ts';

export const verification: Verification = {
  lesson: 'physics.electromagnetism.rc-circuits',
  notes: {
    p1: 'τ = RC；和龙格-库塔法积分放电方程 R dq/dt = −q/C、二分出 q 降到 q₀/e 的时刻核对。',
    p2: '能量和 q² 成正比，e^{−4}；和龙格-库塔法积分放电 2RC 的时间、算 (q/q₀)² 核对。',
    p3: 't = RC ln(ℰ/(ℰ − 9))；和龙格-库塔法积分充电方程 R dq/dt = ℰ − q/C、二分出 q/C 到 9.0 V 的时刻核对。',
    p4: '戴维南等效：τ = (R₁R₂/(R₁ + R₂))C，终值 ℰR₂/(R₁ + R₂)；和龙格-库塔法积分 C dφ/dt = (ℰ − φ)/R₁ − φ/R₂ 核对：积 40 倍预估时间读终值，再二分出到终值 1 − 1/e 的时刻。',
  },
  compute() {
    // p1
    const R1 = 47e3;
    const C1 = 22e-6;
    const dis1 = (_t: number, y: number[]) => [-y[0] / (R1 * C1)];
    const hit1 = rk4Until(dis1, [1], 0, 1e-4, 1e6, (_t, y) => Math.exp(-1) - y[0]);
    const p1 = agree(hit1.t, R1 * C1, 'p1', 1e-9);

    // p2（取 RC = 1）
    const q2 = rk4((_t, y) => [-y[0]], [1], 0, 2, 20000)[0];
    const p2 = agree(q2 * q2, Math.exp(-4), 'p2', 1e-9);

    // p3
    const emf = 12;
    const R3 = 2.0e3;
    const C3 = 470e-6;
    const chg = (_t: number, y: number[]) => [(emf - y[0] / C3) / R3];
    const hit3 = rk4Until(chg, [0], 0, 1e-4, 1e6, (_t, y) => y[0] / C3 - 9.0);
    const p3 = agree(hit3.t, R3 * C3 * Math.log(emf / (emf - 9.0)), 'p3', 1e-9);

    // p4
    const Ra = 10e3;
    const Rb = 10e3;
    const C4 = 10e-6;
    const rhs4 = (_t: number, y: number[]) => [((emf - y[0]) / Ra - y[0] / Rb) / C4];
    const guess = Ra * C4;
    const vEnd = rk4(rhs4, [0], 0, 40 * guess, 400000)[0];
    const hit4 = rk4Until(rhs4, [0], 0, guess / 20000, 1e7, (_t, y) => y[0] - (1 - Math.exp(-1)) * vEnd);
    const tau4 = agree(hit4.t, ((Ra * Rb) / (Ra + Rb)) * C4, 'p4 时间常数', 1e-9);
    const v4 = agree(vEnd, (emf * Rb) / (Ra + Rb), 'p4 终值', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [tau4, v4] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
