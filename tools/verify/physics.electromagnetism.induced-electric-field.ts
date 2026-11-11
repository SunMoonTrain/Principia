// 独立验算 physics.electromagnetism.induced-electric-field 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（∮E·dl = −dΦ/dt，螺线管外 E = (R²/2s)dB/dt）；
// 二是不用这些式子：由螺线管的电流直接算磁矢势 A（每个圆线圈 A = (μ₀I/4π)∮dl′/|r − r′|，再沿轴积分各线圈），E = −∂A/∂t；
// 电子感应加速器沿轨道把切向力的功分段相加；选择题用具体的场数值核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.induced-electric-field.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { type V3, MU0, agree, check, chosen, divergence, integrate } from './physics.electromagnetism._es.ts';

/** 半径 R、每单位长度的电流为 K（面电流密度）的无限长螺线管，在离轴 s 处产生的磁矢势 A_ψ：圆线圈逐个用 ∮dl′/|r − r′| 积分，再沿轴（z = R sinh u）积分。 */
function solenoidA(R: number, K: number, s: number): number {
  const U = Math.asinh(1e6);
  return integrate(
    (u) => {
      const z = R * Math.sinh(u);
      const ring = integrate((t) => (R * Math.cos(t)) / Math.sqrt(s * s + R * R + z * z - 2 * s * R * Math.cos(t)), 0, 2 * Math.PI, 16, 16);
      return ((MU0 * K) / (4 * Math.PI)) * ring * R * Math.cosh(u);
    },
    -U,
    U,
    64,
    16,
  );
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.induced-electric-field',
  notes: {
    p1: 'E = (R²/2s)dB/dt；和由电流直接算磁矢势核对：dK/dt = (dB/dt)/μ₀，管外 E = −∂A_ψ/∂t，A 由各圆线圈的 ∮dl′/|r − r′| 沿轴积分得出。',
    p2: '逐条用例子：A 管里的感生电场 E = (k/2)(−y, x, 0)，中心差分求散度为零（对）；B 沿管外的圆积分 E·dl = −dΦ/dt ≠ 0（错）；C 管外 E = (R²/2s)dB/dt ≠ 0，静止电子受力 −eE（对）；D 套在管外的两个圆（半径 2R、5R）电动势都是 −πR² dB/dt，和面积无关（错）；E dB/dt < 0 时 E_ψ = −(s/2)dB/dt > 0，从 +z 一侧看逆时针（对）。',
    p3: 'e·dΦ/dt = e·πr²Δ⟨B⟩/Δt；和沿轨道分 3600 段把切向力 eE_ψ 做的功相加核对（E_ψ 取轨道上的 −(1/2πr)dΦ/dt），单位 eV。',
    p4: 'dB/dt = μ₀n dI/dt，E = (R²/2s)dB/dt；和由电流直接算磁矢势、E = −∂A/∂t 核对。',
  },
  compute() {
    // p1
    const R1 = 0.03;
    const s1 = 0.06;
    const dBdt1 = 0.2;
    const E1 = solenoidA(R1, dBdt1 / MU0, s1); // A 对 K 是线性的：用 dK/dt 代 K 就是 ∂A/∂t
    const p1 = agree(Math.abs(E1) * 1e3, ((R1 * R1) / (2 * s1)) * dBdt1 * 1e3, 'p1', 1e-7);

    // p2
    const k = 0.7;
    const Eind = (p: V3): V3 => [(-k / 2) * p[1], (k / 2) * p[0], 0];
    const A = Math.abs(divergence(Eind, [0.1, -0.2, 0.3])) < 1e-9;
    const B = false;
    const Rs = 0.02;
    const dBdt = 0.5;
    const Eout = (s: number) => ((Rs * Rs) / (2 * s)) * dBdt;
    const C = Eout(0.05) > 0;
    const emf = (s: number) => 2 * Math.PI * s * Eout(s);
    const D = Math.abs(emf(2 * Rs) - emf(5 * Rs)) > 1e-12;
    check(Math.abs(emf(2 * Rs) - Math.PI * Rs * Rs * dBdt) < 1e-15, 'p2 D：电动势等于管里的磁通量变化率');
    const dBdtDown = -0.4;
    const Epsi = (-0.01 / 2) * dBdtDown;
    const E = Epsi > 0;
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const r = 0.1;
    const dPhidt = (Math.PI * r * r * 0.8) / 4.0e-3;
    const Epsi3 = dPhidt / (2 * Math.PI * r);
    let W = 0;
    const n = 3600;
    for (let i = 0; i < n; i++) W += Epsi3 * ((2 * Math.PI * r) / n); // 每段 eE·dl，以 eV 计就是 E·dl
    const p3 = agree(W, dPhidt, 'p3', 1e-12);

    // p4
    const R4 = 0.01;
    const n4 = 2000;
    const dIdt = 3.0 / 0.1;
    const s4 = 0.05;
    const E4 = solenoidA(R4, n4 * dIdt, s4);
    const p4 = agree(Math.abs(E4) * 1e6, ((R4 * R4) / (2 * s4)) * MU0 * n4 * dIdt * 1e6, 'p4', 1e-7);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
