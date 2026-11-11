// 独立验算 physics.electromagnetism.rl-circuits 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的指数解（时间常数 L/R、I = (ℰ/R)(1 − e^{−Rt/L})、戴维南等效）；
// 二是不用指数解：按基尔霍夫定律写出线圈电流的微分方程，用四阶龙格-库塔法积分，二分出到达某个值的时刻。
// 时间常数按定义取：衰减到 1/e、增长到终值的 1 − 1/e 所用的时间。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.rl-circuits.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, rk4, rk4Until } from './physics.electromagnetism._es.ts';

export const verification: Verification = {
  lesson: 'physics.electromagnetism.rl-circuits',
  notes: {
    p1: 'τ = L/R；和龙格-库塔法积分 L dI/dt = −IR、二分出 I 降到 I₀/e 的时刻核对。',
    p2: '(ℰ/R)(1 − e^{−Rt/L})；和龙格-库塔法积分 L dI/dt = ℰ − IR 到 t = 0.20 s 核对。',
    p3: '戴维南等效：τ = L/(R₁R₂/(R₁ + R₂))，终值 ℰ/R₁（线圈把 R₂ 短路）；和龙格-库塔法积分核对：节点电势 φ = (ℰ/R₁ − I_L)/(1/R₁ + 1/R₂)，L dI_L/dt = φ，积到 60 倍时间读终值，再二分出到终值 1 − 1/e 的时刻。',
    p4: '能量 ∝ I²，t = (L/2R) ln 10；和龙格-库塔法积分 L dI/dt = −IR、二分出 I² 降到 I₀² 的 10% 的时刻核对。',
  },
  compute() {
    // p1
    const L1 = 0.3;
    const R1 = 15;
    const hit1 = rk4Until((_t, y) => [(-y[0] * R1) / L1], [1], 0, 1e-6, 1e8, (_t, y) => Math.exp(-1) - y[0]);
    const p1 = agree(hit1.t * 1e3, (L1 / R1) * 1e3, 'p1', 1e-9);

    // p2
    const emf = 6.0;
    const R2 = 3.0;
    const L2 = 0.6;
    const I2 = rk4((_t, y) => [(emf - y[0] * R2) / L2], [0], 0, 0.2, 20000)[0];
    const p2 = agree(I2, (emf / R2) * (1 - Math.exp((-R2 * 0.2) / L2)), 'p2', 1e-10);

    // p3
    const e3 = 12;
    const Ra = 4.0;
    const Rb = 12;
    const L3 = 2.0;
    const rhs3 = (_t: number, y: number[]) => [(e3 / Ra - y[0]) / (1 / Ra + 1 / Rb) / L3];
    const Rth = (Ra * Rb) / (Ra + Rb);
    const Iend = rk4(rhs3, [0], 0, 60 * (L3 / Rth), 600000)[0];
    const hit3 = rk4Until(rhs3, [0], 0, 1e-5, 1e8, (_t, y) => y[0] - (1 - Math.exp(-1)) * Iend);
    const tau3 = agree(hit3.t, L3 / Rth, 'p3 时间常数', 1e-8);
    const fin3 = agree(Iend, e3 / Ra, 'p3 终值', 1e-10);

    // p4
    const L4 = 0.8;
    const R4 = 5.0;
    const hit4 = rk4Until((_t, y) => [(-y[0] * R4) / L4], [2.0], 0, 1e-6, 1e8, (_t, y) => 0.1 * 4.0 - y[0] * y[0]);
    const p4 = agree(hit4.t, (L4 / (2 * R4)) * Math.log(10), 'p4', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: [tau3, fin3] },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
