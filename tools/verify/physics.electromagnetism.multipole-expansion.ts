// 独立验算 physics.electromagnetism.multipole-expansion 的 p1–p4（简单题、中等题）。
// 两套算法：一是由电荷分布直接算各阶矩（总电荷、电偶极矩、Q_ij）；二是从精确的电势出发，在很远处把 1/r 的各次幂的系数分离出来，
// 或者用 Σqᵢrᵢ²P₂(cosγᵢ) 这种勒让德形式代替 Q_ij 的写法。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.multipole-expansion.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { K8988, K_EXACT, agree, check, chosen, integrate, legendre, potentialAt, type Charge, type V3 } from './physics.electromagnetism._es.ts';

/** 点电荷系的电四极矩 Q_ij = Σq(3x_ix_j − r²δ_ij)。 */
function quadrupole(cs: Charge[]): number[][] {
  const Qm = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (const c of cs) {
    const r2 = c.r[0] ** 2 + c.r[1] ** 2 + c.r[2] ** 2;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) Qm[i][j] += c.q * (3 * c.r[i] * c.r[j] - (i === j ? r2 : 0));
  }
  return Qm;
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.multipole-expansion',
  notes: {
    p1: '总电荷 Q = q，电偶极矩 p = 2q·0.02 + (−q)(−0.02) = 0.06q m，偶极项比单极项 = p/(Qr)；和从轴上精确电势分离 1/z² 的系数核对（z = 10⁶ m 处 z²(φ/k − Q/z)）。',
    p2: 'A：±d/2 处两个 q 的 Σqz = 0（对）；B：(0.3, 0.2, 0.1) 处的点电荷 Q_xx ≠ 0（反例）；C：均匀球面（圆环积分）在 r = 2、3 处的电势正好是 kQ/r，没有更高的项（对）；D：+q、−2q、+q 的直线四极子 φ·r² 随 r 增大趋于零，按 1/r³ 衰减（反例）；E：同一个四极子 p = 0 而 Q_zz = 4qd²（反例）。',
    p3: 'Q_zz = ∫(3z′² − z′²)λdz′ = λL³/6，四极项/单极项 = Q_zz/(2Qr²)；和从轴上精确电势 kλ ln((z + L/2)/(z − L/2)) 分离 1/z³ 的系数核对（z = 10³L）。',
    p4: 'Q = 0、p = 0，Q_xx = 6qa²，x 轴上四极项 kQ_xx/(2r³)；和勒让德形式 (k/r³)Σqᵢrᵢ²P₂(cosγᵢ) 核对，再检验它和精确电势只差 a²/r² 量级（k = 8.988×10⁹）。',
  },
  compute() {
    // p1
    const q = 1;
    const cs1: Charge[] = [
      { q: 2 * q, r: [0, 0, 0.02] },
      { q: -q, r: [0, 0, -0.02] },
    ];
    const Q1 = cs1.reduce((s, c) => s + c.q, 0);
    const pz = cs1.reduce((s, c) => s + c.q * c.r[2], 0);
    const z = 1e6;
    const c1 = z * z * (potentialAt(cs1, [0, 0, z], 1) - Q1 / z);
    const p1 = agree(c1 / (Q1 * 1), pz / (Q1 * 1), 'p1', 1e-6);

    // p2
    const A2 = Math.abs(1 * 0.5 + 1 * -0.5) < 1e-15;
    const QB = quadrupole([{ q: 1, r: [0.3, 0.2, 0.1] }]);
    const B2 = QB.every((row) => row.every((v) => Math.abs(v) < 1e-12));
    const shellPotential = (r: number) =>
      integrate((th) => (K_EXACT * 0.5 * Math.sin(th)) / Math.sqrt(r * r + 1 - 2 * r * Math.cos(th)), 0, Math.PI, 64, 16);
    const C2 = [2, 3].every((r) => Math.abs(shellPotential(r) - K_EXACT / r) < 1e-12 * (K_EXACT / r));
    const quad: Charge[] = [
      { q: 1, r: [0, 0, 0.1] },
      { q: -2, r: [0, 0, 0] },
      { q: 1, r: [0, 0, -0.1] },
    ];
    const decay = [10, 100, 1000].map((r) => potentialAt(quad, [r * 0.6, 0, r * 0.8], 1) * r * r);
    const D2 = !(decay[2] < decay[1] / 5 && decay[1] < decay[0] / 5); // φr² 趋于零，就不是按 1/r² 衰减
    const pQuad = quad.reduce((s, c) => s + c.q * c.r[2], 0);
    const E2 = !(Math.abs(pQuad) < 1e-15 && Math.abs(quadrupole(quad)[2][2]) > 1e-6);
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3（L 取 1，λ 取 1）
    const L = 1;
    const Qzz = integrate((zp) => 3 * zp * zp - zp * zp, -L / 2, L / 2, 8, 16);
    const zz = 1e3 * L;
    const exactOverK = Math.log1p(L / (zz - L / 2)); // ln((z + L/2)/(z − L/2))
    const c3 = (exactOverK - L / zz) * zz ** 3; // 1/z³ 的系数，应为 λL³/12
    const p3 = agree(c3 / (L * (2 * L) ** 2), Qzz / (2 * L * (2 * L) ** 2), 'p3', 1e-6);

    // p4
    const qq = 1.0e-9;
    const a = 0.01;
    const cs4: Charge[] = [
      { q: qq, r: [a, 0, 0] },
      { q: qq, r: [-a, 0, 0] },
      { q: -qq, r: [0, a, 0] },
      { q: -qq, r: [0, -a, 0] },
    ];
    check(Math.abs(cs4.reduce((s, c) => s + c.q, 0)) < 1e-20, 'p4：总电荷为零');
    const r4 = 1.0;
    const xhat: V3 = [1, 0, 0];
    const fromQ = (K8988 * quadrupole(cs4)[0][0]) / (2 * r4 ** 3);
    const fromP2 = (K8988 / r4 ** 3) * cs4.reduce((s, c) => s + c.q * (c.r[0] ** 2 + c.r[1] ** 2) * legendre(2, (c.r[0] * xhat[0] + c.r[1] * xhat[1]) / Math.hypot(c.r[0], c.r[1])), 0);
    const p4 = agree(fromP2, fromQ, 'p4', 1e-12);
    check(Math.abs(potentialAt(cs4, [r4, 0, 0], K8988) - p4) < 2e-4 * p4, 'p4：和精确电势只差 a²/r² 量级');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
