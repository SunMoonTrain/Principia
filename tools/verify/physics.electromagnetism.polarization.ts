// 独立验算 physics.electromagnetism.polarization 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 σ_b = P·n̂、ρ_b = −∇·P、p = αE；二是矢量点积、中心差分求散度、原子单位，以及把所有电荷看成大平面、逐层叠加电场再积分。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.polarization.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { A0, EPS0, E_CHARGE, HARTREE_J, agree, divergence, dot, integrate, type Field, type V3 } from './physics.electromagnetism._es.ts';

export const verification: Verification = {
  lesson: 'physics.electromagnetism.polarization',
  notes: {
    p1: 'σ_b = P cos 60°；和 P = (2.0×10⁻⁶, 0, 0) 与单位法线 (cos 60°, sin 60°, 0) 的点积核对。',
    p2: 'ρ_b = −dP_x/dx = −2kx；和中心差分求 −∇·P 核对。',
    p3: 'p = αE = ed，d/a₀ = 4.5·4πε₀a₀²E/e；和原子单位核对：电场的原子单位 E_h/(ea₀)（CODATA 2022 的哈特里能量），d/a₀ = 4.5E/(E_h/(ea₀))。',
    p4: '空隙里 σ_f/ε₀、电介质里 (σ_f − P)/ε₀，各乘 1.0 mm 相加；和逐层叠加四个带电大平面（±σ_f 的极板、∓P 的电介质表面）的电场 σ/(2ε₀)、沿两板之间数值积分核对。',
  },
  compute() {
    // p1
    const P1 = 2.0e-6;
    const n: V3 = [Math.cos(Math.PI / 3), Math.sin(Math.PI / 3), 0];
    const p1 = agree(dot([P1, 0, 0], n), P1 * 0.5, 'p1', 1e-12);

    // p2
    const k = 3.0e-5;
    const P2: Field = ([x]) => [k * x * x, 0, 0];
    const p2 = agree(-divergence(P2, [0.1, 0.3, -0.2], 1e-6), -2 * k * 0.1, 'p2', 1e-7);

    // p3
    const E3 = 1.0e6;
    const si = (4.5 * 4 * Math.PI * EPS0 * A0 * A0 * E3) / E_CHARGE;
    const au = (4.5 * E3) / (HARTREE_J / (E_CHARGE * A0));
    const p3 = agree(au, si, 'p3', 1e-8);

    // p4：极板在 x = 0（+σ_f）和 x = d（−σ_f），电介质板占 [0.5, 1.5] mm
    const sf = 3.0e-6;
    const P = 1.0e-6;
    const d = 2.0e-3;
    const planes = [
      { x: 0, s: sf },
      { x: d, s: -sf },
      { x: 0.5e-3, s: -P },
      { x: 1.5e-3, s: P },
    ];
    const Ex = (x: number) => planes.reduce((s, p) => s + (p.s / (2 * EPS0)) * Math.sign(x - p.x), 0);
    const numeric = integrate(Ex, 0, 0.5e-3, 4, 8) + integrate(Ex, 0.5e-3, 1.5e-3, 4, 8) + integrate(Ex, 1.5e-3, d, 4, 8);
    const p4 = agree(numeric, (sf * 1.0e-3 + (sf - P) * 1.0e-3) / EPS0, 'p4', 1e-12);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
