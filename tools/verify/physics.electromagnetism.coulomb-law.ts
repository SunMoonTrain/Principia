// 独立验算 physics.electromagnetism.coulomb-law 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的公式；二是按矢量形式的库仑定律逐个算力再相加、数值解平衡，
// 第 1 题另走原子单位（α、ħc）这条路，不经过 e 和 ε₀。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.coulomb-law.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import {
  A0,
  ALPHA,
  E_CHARGE,
  G_NEWTON,
  HBARC_MEV_FM,
  K8988,
  K_EXACT,
  M_E,
  M_P,
  add,
  agree,
  bisect,
  check,
  chosen,
  coulombForce,
  norm,
  type Charge,
} from './physics.electromagnetism._es.ts';

export const verification: Verification = {
  lesson: 'physics.electromagnetism.coulomb-law',
  notes: {
    p1: '按矢量形式的库仑定律和万有引力定律，在 r = a₀ 和 r = 1 m 两处各算一次两个力，比值相同；另走原子单位：e²/(4πε₀) = αħc（α、ħc 取 CODATA 2022），比值 αħc/(Gm_e m_p)，两条路相差不到 10⁻⁸。',
    p2: 'A：电荷都加倍、距离加倍，按库仑定律算力不变；B：2.4×10⁻¹⁹ C ÷ e = 1.498，不是整数（反例）；C：两物体只互相交换 N 个电子，电荷是 −Ne 和 +Ne；D：距离减半，力变成 4 倍不是 2 倍（反例）；E：换成等量异号电荷，力的矢量变成相反数。',
    p3: '三个电荷放在坐标上，按矢量形式的库仑定律分别算两个力再相加；和 2F cos 30° 核对。',
    p4: '对给定的电荷，用二分法找力矩平衡的角度（重力和电场力对悬点的力矩相等，不用 tanθ 的式子），再对电荷二分，使两球相距 0.10 m；和 q = d√(mg tanθ / k) 核对。',
  },
  compute() {
    // p1
    const proton: Charge = { q: E_CHARGE, r: [0, 0, 0] };
    const ratios = [A0, 1].map((r) => {
      const electron: Charge = { q: -E_CHARGE, r: [r, 0, 0] };
      const fe = norm(coulombForce(proton, electron));
      const fg = (G_NEWTON * M_E * M_P) / (r * r);
      return fe / fg;
    });
    agree(ratios[0], ratios[1], 'p1：比值和距离无关', 1e-12);
    const hbarc = HBARC_MEV_FM * 1e6 * E_CHARGE * 1e-15;
    const p1 = agree((ALPHA * hbarc) / (G_NEWTON * M_E * M_P), ratios[0], 'p1', 1e-8);

    // p2
    const F = (q1: number, q2: number, d: number): number => norm(coulombForce({ q: q1, r: [0, 0, 0] }, { q: q2, r: [d, 0, 0] }));
    const A2 = Math.abs(F(2e-9, 2e-9, 2) / F(1e-9, 1e-9, 1) - 1) < 1e-12;
    const n = 2.4e-19 / E_CHARGE;
    const B2 = Math.abs(n - Math.round(n)) < 1e-6;
    const N = 1e10;
    const C2 = -N * E_CHARGE + N * E_CHARGE === 0;
    const D2 = Math.abs(F(1e-9, 1e-9, 0.5) / F(1e-9, 1e-9, 1) - 2) < 1e-9;
    const f1 = coulombForce({ q: 1e-9, r: [0, 0, 0] }, { q: 2e-9, r: [0.3, 0.4, 0] });
    const f2 = coulombForce({ q: -1e-9, r: [0, 0, 0] }, { q: 2e-9, r: [0.3, 0.4, 0] });
    const E2 = norm(add(f1, f2)) < 1e-15 * norm(f1) && Math.abs(norm(f1) - norm(f2)) < 1e-15;
    check(Math.abs(F(1e-9, 1e-9, 0.5) / F(1e-9, 1e-9, 1) - 4) < 1e-12, 'p2 D：距离减半力是 4 倍');
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const a = 0.1;
    const c3: Charge = { q: -1.0e-6, r: [a / 2, (a * Math.sqrt(3)) / 2, 0] };
    const f3 = add(coulombForce({ q: 2e-6, r: [0, 0, 0] }, c3, K8988), coulombForce({ q: 2e-6, r: [a, 0, 0] }, c3, K8988));
    const single = (K8988 * 2e-6 * 1e-6) / (a * a);
    const p3 = agree(norm(f3), 2 * single * Math.cos(Math.PI / 6), 'p3', 1e-12);

    // p4（m = 2.0 g，线长 0.50 m，两球相距 0.10 m）
    const m = 2.0e-3;
    const g = 9.8;
    const L = 0.5;
    const d = 0.1;
    const angleFor = (q: number): number =>
      bisect((th) => {
        const sep = 2 * L * Math.sin(th);
        const Fe = (K8988 * q * q) / (sep * sep);
        // 小球在 (L sinθ, −L cosθ)，对悬点的力矩：重力 (0, −mg)、电场力 (Fe, 0)
        return -m * g * L * Math.sin(th) + Fe * L * Math.cos(th);
      }, 1e-6, Math.PI / 2 - 1e-9);
    const qNum = bisect((q) => 2 * L * Math.sin(angleFor(q)) - d, 1e-9, 1e-6);
    const th = Math.asin(d / 2 / L);
    const p4 = agree(qNum, d * Math.sqrt((m * g * Math.tan(th)) / K8988), 'p4', 1e-9);
    check(Math.abs(K_EXACT - 8.9875517862e9) < 1, '常量：1/(4πε₀)');

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
