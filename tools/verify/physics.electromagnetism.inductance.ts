// 独立验算 physics.electromagnetism.inductance 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（L = NΦ/I：长螺线管 μ₀N²A/l、矩形截面螺绕环 μ₀N²h ln(b/a)/(2π)）；
// 二是从能量算：磁场的能量密度 B²/(2μ₀) 对体积数值积分得 W，L = 2W/I²。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.inductance.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { MU0, agree, chosen, integrate } from './physics.electromagnetism._es.ts';

export const verification: Verification = {
  lesson: 'physics.electromagnetism.inductance',
  notes: {
    p1: 'μ₀N²πR²/l；和能量核对：取 I = 1 A，管内 B = μ₀NI/l，W = B²/(2μ₀)·πR²l，L = 2W/I²。',
    p2: '逐条用例子（取 N = 400、l = 0.3 m、R = 1 cm 的长螺线管）：A 电流加倍，L = NΦ/I 不变（错）；B dI/dt 不变，ℰ = −L dI/dt 不变（对）；C l 加倍，μ₀N²A/l 减半（对）；D 恒定电流时能量 ½LI² ≠ 0（错）；E 能量是 ½LI²，不是 LI²（错）。',
    p3: 'μ₀N²h ln(b/a)/(2π)；和能量核对：环里 B = μ₀NI/(2πs)，对矩形截面数值积分 B²/(2μ₀)·2πs·h ds，L = 2W/I²。',
    p4: '磁链：N = Bl/(μ₀I)，Φ = BπR²，L = NΦ/I；和能量核对：W = B²/(2μ₀)·πR²l，L = 2W/I²。',
  },
  compute() {
    // p1
    const N1 = 500;
    const l1 = 0.25;
    const R1 = 0.01;
    const Bin = (MU0 * N1 * 1) / l1;
    const W1 = ((Bin * Bin) / (2 * MU0)) * Math.PI * R1 * R1 * l1;
    const p1 = agree(2 * W1 * 1e3, ((MU0 * N1 * N1 * Math.PI * R1 * R1) / l1) * 1e3, 'p1', 1e-12);

    // p2
    const N = 400;
    const l = 0.3;
    const Ar = Math.PI * 0.01 ** 2;
    const Lsol = (len: number) => (MU0 * N * N * Ar) / len;
    const LfromFlux = (I: number) => (N * ((MU0 * N * I) / l) * Ar) / I;
    const A = Math.abs(LfromFlux(2) / LfromFlux(1) - 2) < 1e-12;
    const dIdt = 3;
    const emf = (t: number) => -Lsol(l) * dIdt + 0 * t;
    const B = Math.abs(emf(0.1) - emf(0.7)) < 1e-15;
    const C = Math.abs(Lsol(2 * l) / Lsol(l) - 0.5) < 1e-12;
    const D = 0.5 * Lsol(l) * 2 * 2 === 0;
    const E = false; // 能量是 ½LI²
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const N3 = 1000;
    const a = 0.05;
    const b = 0.08;
    const h = 0.02;
    const I3 = 1;
    const W3 = integrate((s) => (((MU0 * N3 * I3) / (2 * Math.PI * s)) ** 2 / (2 * MU0)) * 2 * Math.PI * s * h, a, b, 64, 16);
    const p3 = agree((2 * W3) / (I3 * I3) * 1e3, ((MU0 * N3 * N3 * h) / (2 * Math.PI)) * Math.log(b / a) * 1e3, 'p3', 1e-12);

    // p4
    const B4 = 1.5;
    const l4 = 2.0;
    const R4 = 0.4;
    const I4 = 450;
    const N4 = (B4 * l4) / (MU0 * I4);
    const Lflux = (N4 * B4 * Math.PI * R4 * R4) / I4;
    const W4 = ((B4 * B4) / (2 * MU0)) * Math.PI * R4 * R4 * l4;
    const p4 = agree((2 * W4) / (I4 * I4), Lflux, 'p4', 1e-12);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
