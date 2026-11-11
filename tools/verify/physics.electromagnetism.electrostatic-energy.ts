// 独立验算 physics.electromagnetism.electrostatic-energy 的 p1–p4（简单题、中等题）。
// 两套算法：一是按定义对每一对电荷求和、或用球面的静电能公式；二是按 ½Σqᵢφᵢ 用逐点算出的电势、对电场能量密度数值积分、
// 对收缩球面时外力克服的静电压强做功数值积分。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.electrostatic-energy.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { EPS0, K8988, agree, integrate, potentialAt, type Charge } from './physics.electromagnetism._es.ts';

/** 点电荷系的静电能：每一对算一次。 */
function pairSum(cs: Charge[], k: number): number {
  let s = 0;
  for (let i = 0; i < cs.length; i++)
    for (let j = i + 1; j < cs.length; j++) {
      const r = Math.hypot(cs[i].r[0] - cs[j].r[0], cs[i].r[1] - cs[j].r[1], cs[i].r[2] - cs[j].r[2]);
      s += (k * cs[i].q * cs[j].q) / r;
    }
  return s;
}

/** ½Σqᵢφᵢ，φᵢ 是其余电荷在 qᵢ 处的电势。 */
function halfSum(cs: Charge[], k: number): number {
  return 0.5 * cs.reduce((s, c, i) => s + c.q * potentialAt(cs.filter((_, j) => j !== i), c.r, k), 0);
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.electrostatic-energy',
  notes: {
    p1: '三个点电荷放在边长 3.0 cm 的正三角形顶点上，按 Σ_{i<j} kqᵢqⱼ/rᵢⱼ 求和；和 ½Σqᵢφᵢ（φᵢ 由其余两个电荷的电势相加）核对。',
    p2: '能量密度 ½ε₀E² 乘 1 m³；和把这块空气看成两板相距 1 m、面积 1 m² 的平行板电容器里的电场，用 Q²/(2C) 算核对。',
    p3: '球面的静电能 kQ²/(2R)，两个半径的差；和收缩过程中外力克服静电压强 σ²/(2ε₀) 做的功 ∫σ²/(2ε₀)·4πR²dR 数值积分核对（ε₀ 由 k = 8.988×10⁹ 换算）。',
    p4: '四个点电荷放在边长 10 cm 的正方形顶点上，四条边、两条对角线逐对求和；和 ½Σqᵢφᵢ 核对。',
  },
  compute() {
    // p1
    const s1 = 0.03;
    const tri: Charge[] = [
      { q: 2e-9, r: [0, 0, 0] },
      { q: 2e-9, r: [s1, 0, 0] },
      { q: -2e-9, r: [s1 / 2, (s1 * Math.sqrt(3)) / 2, 0] },
    ];
    const p1 = agree(halfSum(tri, K8988), pairSum(tri, K8988), 'p1', 1e-12);

    // p2
    const E = 100;
    const C = (EPS0 * 1) / 1;
    const Qp = EPS0 * E * 1;
    const p2 = agree((Qp * Qp) / (2 * C), 0.5 * EPS0 * E * E * 1, 'p2', 1e-12);

    // p3
    const Q3 = 5e-9;
    const eps = 1 / (4 * Math.PI * K8988);
    const work = integrate((R) => ((Q3 / (4 * Math.PI * R * R)) ** 2 / (2 * eps)) * 4 * Math.PI * R * R, 0.05, 0.1, 64, 16);
    const p3 = agree(work, ((K8988 * Q3 * Q3) / 2) * (1 / 0.05 - 1 / 0.1), 'p3', 1e-10);

    // p4
    const a = 0.1;
    const sq: Charge[] = [
      [0, 0],
      [a, 0],
      [a, a],
      [0, a],
    ].map(([x, y]) => ({ q: 1e-9, r: [x, y, 0] }));
    const p4 = agree(halfSum(sq, K8988), pairSum(sq, K8988), 'p4', 1e-12);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
