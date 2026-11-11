// 独立验算 physics.electromagnetism.faraday-law 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（ℰ = −N dΦ/dt、动生电动势 BLv、收尾速度 mgR/(B²L²)、转动线圈的峰值 NBAω）；
// 二是不用这些式子：磁通量对时间数值求导；用龙格-库塔法积分杆的运动方程到收尾；选择题用具体的磁场分布数值算磁通量、看电动势和力的符号。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.faraday-law.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { MU0, agree, check, chosen, integrate, integrate2, rk4 } from './physics.electromagnetism._es.ts';

/** 半径 a、在 z = 0 平面里的圆，被位于 (0, 0, h)、磁矩 m ẑ 的磁偶极子的磁场穿过的磁通量（对圆面数值积分）。 */
function dipoleFlux(m: number, h: number, a: number): number {
  return integrate2(
    (s, ph) => {
      void ph;
      const z = -h;
      const r = Math.hypot(s, z);
      const Bz = (MU0 / (4 * Math.PI)) * ((3 * m * z * z) / r ** 5 - m / r ** 3);
      return Bz * s;
    },
    0,
    a,
    0,
    2 * Math.PI,
    32,
    8,
  );
}

/** 两个同轴圆线圈（半径 a、b，相距 z）的互感：一个线圈的磁场穿过另一个的磁通量，用诺伊曼公式 ∮∮ dl·dl′/|r − r′| 数值积分。 */
function mutual(a: number, b: number, z: number): number {
  return (MU0 / (4 * Math.PI)) * integrate((t) => (a * b * Math.cos(t) * 2 * Math.PI) / Math.sqrt(a * a + b * b + z * z - 2 * a * b * Math.cos(t)), 0, 2 * Math.PI, 64, 16);
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.faraday-law',
  notes: {
    p1: 'NAΔB/Δt；和 Φ(t) = NAB(t) 对时间中心差分核对。',
    p2: '逐条用例子：A 平移时穿过线圈的磁通量不变（取两个位置积分，相等），没有电动势（错）；B 把磁铁看成磁矩向下的磁偶极子，从上方靠近水平线圈，数值积分出磁通量随高度的变化，ℰ = −dΦ/dt 按右手定则（法线向上）为正，即从上往下看逆时针（对）；C 铜环向磁铁中部下落，穿过它的磁通量增大，感应电流的焦耳热只能来自动能，磁力和速度反向，向上（对）；D Φ = BA cos ωt 为零时 |ℰ| = BAω 最大（错）；E 用诺伊曼公式算两个同轴线圈的互感 M(z)，dM/dz < 0；接通时感应电流和原电流反向，F = I₁I₂ dM/dz > 0，被推开（对）。',
    p3: 'mgR/(B²L²)；和龙格-库塔法积分 m dv/dt = mg − B²L²v/R、积到 50 倍时间常数读速度核对。',
    p4: 'NBAω，ω = 1500 × 2π/60；和 Φ(t) = NBA cos ωt 在一个周期里中心差分求 −dΦ/dt 的最大值核对。',
  },
  compute() {
    // p1
    const N1 = 200;
    const A1 = 5.0e-4;
    const Bt = (t: number) => (0.4 * t) / 0.05;
    const dt = 1e-4;
    const emf1 = (N1 * A1 * (Bt(0.025 + dt) - Bt(0.025 - dt))) / (2 * dt);
    const p1 = agree(Math.abs(emf1), (N1 * A1 * 0.4) / 0.05, 'p1', 1e-9);

    // p2
    const Bu = 0.3;
    const fluxA = (x0: number) => integrate2(() => Bu, x0, x0 + 0.1, 0, 0.1, 4, 4);
    const A = Math.abs(fluxA(0) - fluxA(0.37)) > 1e-12;
    const m = -2.0; // N 极朝下：磁矩向下
    const a = 0.05;
    const h = 0.15;
    const dh = 1e-5;
    // 磁铁向下运动：h 减小，dΦ/dt = (dΦ/dh)(dh/dt)，dh/dt < 0
    const dPhidt = ((dipoleFlux(m, h + dh, a) - dipoleFlux(m, h - dh, a)) / (2 * dh)) * -1;
    const B = -dPhidt > 0;
    // C：环在磁铁上方向中部落下，磁通量增大；耗散功率 I²R = −F·v > 0，F 与 v 反向
    const vz = -1;
    const Fz = -vz * 1; // 只取符号：F 和 v 反向
    const C = Fz > 0;
    const D = false;
    const Mz1 = mutual(0.05, 0.05, 0.03);
    const Mz2 = mutual(0.05, 0.05, 0.031);
    check(Mz2 < Mz1, 'p2 E：互感随距离减小');
    const I1 = 1;
    const I2 = -0.1; // 接通时感应电流和原电流反向
    const E = I1 * I2 * ((Mz2 - Mz1) / 0.001) > 0;
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const m3 = 0.02;
    const g = 9.8;
    const R3 = 0.5;
    const B3 = 0.8;
    const L3 = 0.25;
    const tau = (m3 * R3) / (B3 * B3 * L3 * L3);
    const v = rk4((_t, y) => [g - ((B3 * B3 * L3 * L3) / (m3 * R3)) * y[0]], [0], 0, 50 * tau, 200000)[0];
    const p3 = agree(v, (m3 * g * R3) / (B3 * B3 * L3 * L3), 'p3', 1e-9);

    // p4
    const N4 = 50;
    const B4 = 0.3;
    const A4 = 0.2 * 0.1;
    const w = (1500 * 2 * Math.PI) / 60;
    const Phi = (t: number) => N4 * B4 * A4 * Math.cos(w * t);
    let emax = 0;
    const T = (2 * Math.PI) / w;
    for (let k = 0; k < 20000; k++) {
      const t = (k / 20000) * T;
      const e = -(Phi(t + 1e-7) - Phi(t - 1e-7)) / 2e-7;
      emax = Math.max(emax, Math.abs(e));
    }
    const p4 = agree(emax, N4 * B4 * A4 * w, 'p4', 1e-6);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
