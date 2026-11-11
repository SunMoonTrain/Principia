// 独立验算 physics.electromagnetism.electric-field 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的公式；二是把点电荷摆在坐标上逐个算电场再按矢量相加、用龙格-库塔法积分运动，
// 第 1 题另走原子单位（哈特里能量 / (e a₀)）这条路。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.electric-field.ts

import { fileURLToPath } from 'node:url';
import { RK4, type Derivative } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import { A0, E_CHARGE, HARTREE_J, K8988, K_EXACT, M_E, agree, check, chosen, dot, fieldAt, norm, scale } from './physics.electromagnetism._es.ts';

export const verification: Verification = {
  lesson: 'physics.electromagnetism.electric-field',
  notes: {
    p1: '质子放在原点，按矢量形式的点电荷电场在 (a₀, 0, 0) 处算；另走原子单位：电场的原子单位 E_h/(e a₀)，E_h 是哈特里能量（CODATA 2022），两条路相差不到 10⁻⁹。',
    p2: 'A：1 nC 受 2×10⁻⁶ N、2 nC 受 4×10⁻⁶ N，F/q 一样（反例）；B：两个 1 nC 放在 (±1, 0, 0)，原点电场为零；C：E(2 m)/E(1 m) = 1/4（反例）；D：负电荷受的力 qE 和 E 的点积为负；E：等量异号时中点电场不为零（反例）。',
    p3: '四个点电荷放在 (±0.1, ±0.1)，逐个算电场按矢量相加；和 4√2 kq/a² 核对。',
    p4: '用龙格-库塔法积分电子在板间的运动（水平匀速，竖直加速度 eE/m），积到水平走完 5.0 cm，读竖直位移；和 ½(eE/m)(L/v)² 核对。',
  },
  compute() {
    // p1
    const Ea = norm(fieldAt([{ q: E_CHARGE, r: [0, 0, 0] }], [A0, 0, 0]));
    const p1 = agree(HARTREE_J / (E_CHARGE * A0), Ea, 'p1', 1e-9);

    // p2
    const A2 = 4e-6 / 2e-9 === 2 * (2e-6 / 1e-9);
    check(4e-6 / 2e-9 === 2e-6 / 1e-9, 'p2 A：F/q 不变');
    const B2 = norm(fieldAt([{ q: 1e-9, r: [-1, 0, 0] }, { q: 1e-9, r: [1, 0, 0] }], [0, 0, 0])) < 1e-12;
    const one = (d: number) => norm(fieldAt([{ q: 1e-9, r: [0, 0, 0] }], [d, 0, 0]));
    const C2 = Math.abs(one(2) / one(1) - 0.5) < 1e-9;
    const Ept = fieldAt([{ q: 1e-9, r: [0, 0, 0] }], [0.3, -0.2, 0.5]);
    const D2 = dot(scale(-2e-9, Ept), Ept) < 0;
    const E2 = norm(fieldAt([{ q: 1e-9, r: [-1, 0, 0] }, { q: -1e-9, r: [1, 0, 0] }], [0, 0, 0])) < 1e-12;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3（上面两个 +2.0 nC，下面两个 −2.0 nC，边长 0.20 m）
    const h = 0.1;
    const q = 2.0e-9;
    const E3 = fieldAt(
      [
        { q, r: [-h, h, 0] },
        { q, r: [h, h, 0] },
        { q: -q, r: [-h, -h, 0] },
        { q: -q, r: [h, -h, 0] },
      ],
      [0, 0, 0],
      K8988,
    );
    const p3 = agree(norm(E3), (4 * Math.SQRT2 * K8988 * q) / (0.2 * 0.2), 'p3', 1e-12);

    // p4
    const v0 = 2.0e7;
    const E = 1.0e4;
    const L = 0.05;
    const acc = (E_CHARGE * E) / M_E;
    const f: Derivative = (_t, y, out) => {
      out[0] = y[2];
      out[1] = y[3];
      out[2] = 0;
      out[3] = acc;
    };
    const rk = new RK4(4);
    const y = new Float64Array([0, 0, v0, 0]);
    const dt = L / v0 / 2000;
    let t = 0;
    while (y[0] < L - 1e-15) {
      rk.step(f, t, y, Math.min(dt, (L - y[0]) / v0));
      t += dt;
    }
    const p4 = agree(y[1], 0.5 * acc * (L / v0) ** 2, 'p4', 1e-9);
    check(Math.abs(K_EXACT - 8.988e9) / 8.988e9 < 1e-4, '常量');

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
