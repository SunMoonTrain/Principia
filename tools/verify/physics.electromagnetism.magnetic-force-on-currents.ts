// 独立验算 physics.electromagnetism.magnetic-force-on-currents 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的公式 F = ILB sinθ、τ = NIAB sinθ、霍尔电势差 IB/(nqt)、转动的功 2NIAB；
// 二是不用这些式子：沿导线对 dF = I dl × B、dτ = r × dF 数值积分；霍尔效应由漂移速度和横向电场平衡算，换两种宽度看结果不变；
// 转动的功对数值积出的力矩再按转角积分。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.magnetic-force-on-currents.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { E_CHARGE, type V3, agree, integrate, loopForceTorque, norm } from './physics.electromagnetism._es.ts';

export const verification: Verification = {
  lesson: 'physics.electromagnetism.magnetic-force-on-currents',
  notes: {
    p1: 'ILB sin60°；和沿导线（x 轴上 0.20 m）对 I dl × B 数值积分、B = 0.30(cos60°, sin60°, 0) 核对。',
    p2: 'NIπR²B（线圈平面和磁场平行，磁矩和磁场垂直）；和沿圆线圈对 r × (I dl × B) 数值积分再乘 N 核对；顺带核对合力为零。',
    p3: 'IB/(net)；和数值核对：取宽度 5 mm、2 cm 两种，漂移速度 v = I/(newt)，横向电场 vB 平衡磁力，V = vB·w，两种宽度结果相同。e 取 CODATA 值。',
    p4: '2NIAB；和数值核对：线圈当成面积 4.0 cm² 的圆，转角 θ 时沿线圈数值积分出力矩，再对 θ 从 0 积到 π。',
  },
  compute() {
    // p1
    const I1 = 5.0;
    const L1 = 0.2;
    const B1 = 0.3;
    const th = Math.PI / 3;
    const Bvec1: V3 = [B1 * Math.cos(th), B1 * Math.sin(th), 0];
    const seg = loopForceTorque(
      (t) => [t, 0, 0],
      () => [1, 0, 0],
      0,
      L1,
      I1,
      () => Bvec1,
    );
    const p1 = agree(norm(seg.F), I1 * L1 * B1 * Math.sin(th), 'p1');

    // p2
    const N2 = 100;
    const R2 = 0.02;
    const I2 = 0.5;
    const B2 = 0.2;
    const ring = loopForceTorque(
      (t) => [R2 * Math.cos(t), R2 * Math.sin(t), 0],
      (t) => [-R2 * Math.sin(t), R2 * Math.cos(t), 0],
      0,
      2 * Math.PI,
      I2,
      () => [B2, 0, 0],
    );
    if (norm(ring.F) > 1e-15) throw new Error('p2：匀强磁场里闭合线圈的合力应为零');
    const p2 = agree(N2 * norm(ring.tau), N2 * I2 * Math.PI * R2 * R2 * B2, 'p2');

    // p3
    const I3 = 10;
    const B3 = 1.0;
    const t3 = 0.1e-3;
    const n3 = 8.5e28;
    const hall = (w: number) => {
      const vd = I3 / (n3 * E_CHARGE * w * t3);
      return vd * B3 * w;
    };
    agree(hall(5e-3), hall(2e-2), 'p3 两种宽度', 1e-12);
    const p3 = agree(hall(5e-3) * 1e6, ((I3 * B3) / (n3 * E_CHARGE * t3)) * 1e6, 'p3');

    // p4：线圈在 xz 平面里转动，磁场沿 z；θ 是磁矩和磁场的夹角
    const N4 = 50;
    const A4 = 4.0e-4;
    const I4 = 2.0;
    const B4 = 0.5;
    const R4 = Math.sqrt(A4 / Math.PI);
    const torqueAt = (theta: number) => {
      // 磁矩方向 (sinθ, 0, cosθ)；线圈平面由 u = (cosθ, 0, −sinθ) 和 y 轴张成
      const u: V3 = [Math.cos(theta), 0, -Math.sin(theta)];
      const res = loopForceTorque(
        (t) => [R4 * (Math.cos(t) * u[0]), R4 * Math.sin(t), R4 * (Math.cos(t) * u[2])],
        (t) => [-R4 * Math.sin(t) * u[0], R4 * Math.cos(t), -R4 * Math.sin(t) * u[2]],
        0,
        2 * Math.PI,
        N4 * I4,
        () => [0, 0, B4],
      );
      return norm(res.tau);
    };
    const W = integrate(torqueAt, 0, Math.PI, 16, 8);
    const p4 = agree(W, 2 * N4 * I4 * A4 * B4, 'p4', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
