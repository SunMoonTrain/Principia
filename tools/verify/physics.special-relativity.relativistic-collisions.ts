// 独立验算 physics.special-relativity.relativistic-collisions 的 p1–p4（简单题、中等题）。
// 不变质量直接把四维动量相加再求「长度」，并推进到别的惯性系核对不变；两体衰变对动量二分（能量守恒）；
// 阈能对入射能量二分（零动量系里的总能量刚好够产物静止）。都和讲解里的公式核对。
// 单独运行：npx tsx tools/verify/physics.special-relativity.relativistic-collisions.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, boostAlong, check, chosen, dot4, type Four } from './physics.special-relativity._relativity.ts';

/** 一组四维动量（单位 MeV，c = 1）的不变质量。 */
const invariantMass = (list: Four[]): number => {
  const P = list.reduce((s, q) => s.map((v, i) => v + q[i]) as Four, [0, 0, 0, 0] as Four);
  return Math.sqrt(dot4(P, P));
};

/** 质量 m、沿方向 (cos θ, sin θ) 动量为 p 的粒子的四维动量。 */
const particle = (m: number, p: number, theta = 0): Four => [Math.hypot(m, p), p * Math.cos(theta), p * Math.sin(theta), 0];

export const verification: Verification = {
  lesson: 'physics.special-relativity.relativistic-collisions',
  notes: {
    p1: '两个光子的四维动量相加求「长度」，再推进到两个别的惯性系核对不变；和 √(2E₁E₂(1 − cos 60°)) 核对。',
    p2: 'A：p1 的不变质量推进后不变；B：p1 的两个光子质量都是 0，不变质量 300 MeV（反例）；C：K⁺ → π⁺π⁰ 对动量二分只有一个解；D：p + p → p + p + p + p̄ 的阈能是 7m_pc²，比新粒子静止能量之和大（反例）；E：p1 就是例子。',
    p3: '对 π⁺ 的动量 p 二分，使 √(p² + m_π⁺²) + √(p² + m_π⁰²) = m_K；和 √[(M² − (m₁+m₂)²)(M² − (m₁−m₂)²)]/(2M) 核对。',
    p4: '对入射质子的能量 E 二分，使两个质子的不变质量 √(2m_p² + 2m_pE) 正好等于 2m_p + m_π⁰；阈动能 E − m_p；和 2m_π + m_π²/(2m_p) 核对。',
  },
  compute() {
    // p1
    const photons: Four[] = [particle(0, 300, 0), particle(0, 300, Math.PI / 3)];
    const M1 = invariantMass(photons);
    for (const [phi, n] of [
      [0.6, [1, 0, 0]],
      [1.4, [0.2, -1, 0.7]],
    ] as [number, [number, number, number]][]) {
      agree(invariantMass(photons.map((q) => boostAlong(phi, n, q))), M1, 'p1 推进后不变');
    }
    const p1 = agree(M1, Math.sqrt(2 * 300 * 300 * (1 - Math.cos(Math.PI / 3))), 'p1');

    // p2
    const A2 = true;
    const B2 = Math.abs(M1 - 0) < 1e-9;
    const MK = 493.677;
    const m1 = 139.57;
    const m2 = 134.977;
    const f = (p: number): number => Math.hypot(p, m1) + Math.hypot(p, m2) - MK;
    const grid = Array.from({ length: 1000 }, (_, i) => i * 0.5);
    const signChanges = grid.slice(1).filter((p, i) => f(p) * f(grid[i]) < 0).length;
    const C2 = signChanges === 1;
    const mp = 938.272;
    const threshold = (Mf: number, ma: number, mb: number): number => (Mf * Mf - ma * ma - mb * mb) / (2 * mb);
    const D2 = Math.abs(threshold(4 * mp, mp, mp) - 2 * mp) < 1;
    check(Math.abs(threshold(4 * mp, mp, mp) - 7 * mp) < 1e-9, 'p2 D：阈能 7m_pc²');
    const E2 = M1 > 0;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const p = bisect(f, 0, 500);
    const formula = Math.sqrt((MK ** 2 - (m1 + m2) ** 2) * (MK ** 2 - (m1 - m2) ** 2)) / (2 * MK);
    const p3 = agree(p, formula, 'p3');

    // p4
    const mpi = 134.977;
    const E = bisect((e) => invariantMass([particle(mp, Math.sqrt(e * e - mp * mp)), particle(mp, 0)]) - (2 * mp + mpi), mp + 1e-6, 10 * mp);
    const p4 = agree(E - mp, 2 * mpi + (mpi * mpi) / (2 * mp), 'p4', 1e-8);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
