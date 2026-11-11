// 独立验算 physics.electromagnetism.electric-displacement 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 C = ε_rC₀、P = ε₀χ_eE、并联与串联；二是从 D 和 E 出发：D 由自由电荷定、E = D/ε，沿电场线数值积分出电势差，
// 或者由切向电场连续求两半极板上的自由电荷。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.electric-displacement.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { EPS0, agree, integrate } from './physics.electromagnetism._es.ts';

export const verification: Verification = {
  lesson: 'physics.electromagnetism.electric-displacement',
  notes: {
    p1: 'C = ε_rC₀；和同样的自由电荷下 D = σ_f、E = D/(ε_rε₀)、Δφ = Ed 算出的 Q/Δφ 与真空时之比核对。',
    p2: 'P = ε₀χ_eE；和 P = D − ε₀E、D = ε₀(1 + χ_e)E 核对。',
    p3: '两半并联：ε₀(A/2)/d·(1 + ε_r)；和切向电场连续、两半里 E = Δφ/d，极板上的自由电荷 σ = D = εE 分两半相加求 Q/Δφ 核对。',
    p4: '两层球形电容器串联：1/C = (1/(4πε₀))[(1/a − 1/c)/ε_{r1} + (1/c − 1/b)/ε_{r2}]；和 D = Q/(4πr²)、E = D/(ε₀ε_r(r)) 从 a 到 b 数值积分出 Δφ 核对。',
  },
  compute() {
    // p1（C₀ = 50 pF，取 A/d 使 ε₀A/d = C₀）
    const C0 = 50e-12;
    const Ad = C0 / EPS0;
    const Q = 1e-9;
    const er1 = 4.0;
    const D = Q; // 每单位面积：取 A = 1，σ_f = Q
    const dphi = (D / (er1 * EPS0)) * (1 / Ad);
    const p1 = agree(Q / dphi / 1e-12, (er1 * C0) / 1e-12, 'p1', 1e-12);

    // p2
    const chi = 1.5;
    const E2 = 2.0e4;
    const p2 = agree(EPS0 * (1 + chi) * E2 - EPS0 * E2, EPS0 * chi * E2, 'p2', 1e-12);

    // p3
    const A3 = 1.0e-2;
    const d3 = 1.0e-3;
    const er3 = 3.0;
    const V = 1;
    const Eboth = V / d3;
    const Qfree = EPS0 * Eboth * (A3 / 2) + er3 * EPS0 * Eboth * (A3 / 2);
    const p3 = agree(Qfree / V / 1e-12, ((EPS0 * (A3 / 2)) / d3) * (1 + er3) / 1e-12, 'p3', 1e-12);

    // p4
    const a = 0.02;
    const c = 0.03;
    const b = 0.04;
    const Q4 = 1e-9;
    const Er = (r: number) => Q4 / (4 * Math.PI * r * r) / (EPS0 * (r < c ? 2.0 : 4.0));
    const dphi4 = integrate(Er, a, c, 64, 16) + integrate(Er, c, b, 64, 16);
    const inv = (1 / (4 * Math.PI * EPS0)) * ((1 / a - 1 / c) / 2.0 + (1 / c - 1 / b) / 4.0);
    const p4 = agree(Q4 / dphi4 / 1e-12, 1 / inv / 1e-12, 'p4', 1e-12);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
