// 独立验算 physics.special-relativity.mass-energy 的 p1–p4（简单题、中等题）。
// 速率由动能二分求（γ_u 取光钟读数比的倒数）；反应能另用「在零动量系里两个产物飞开」算一遍：
// 由能量守恒对产物的动量二分，产物的动能之和就是反应能。都和讲解里的公式核对。
// 单独运行：npx tsx tools/verify/physics.special-relativity.mass-energy.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, clockRate } from './physics.special-relativity._relativity.ts';

const gammaOp = (u: number): number => 1 / clockRate(u, 1);

export const verification: Verification = {
  lesson: 'physics.special-relativity.mass-energy',
  notes: {
    p1: 'E = mc²，c 取精确值；另用总能量减动能：u = 10⁻⁴c 时 γ_u mc² − (γ_u − 1)mc²（γ_u 由光钟给出）。',
    p2: 'A：电子 m_ec² = 0.51099895 MeV；B：E = K + mc² 是动能的定义；C：用例题的数算 2m_p + 2m_n − m_α ≈ 28.3 MeV，不相等（反例）；D：吸收能量 ΔE > 0，质量增加 ΔE/c²；E：u = 0.6c 时 (γ_u − 1)mc² = 0.25mc²，½γ_umu² = 0.225mc²（反例）。',
    p3: '对 u 二分，使 (γ_u − 1)·0.511 = 1（γ_u 取光钟读数比的倒数）；和 √(1 − (0.511/1.511)²) 核对。',
    p4: '两个氘核在零动量系里静止相撞，产物 ³He 和 n 背向飞开：对动量 p 二分使 √(p² + m_h²) + √(p² + m_n²) = 2m_d，两个动能之和；和 (2m_d − m_h − m_n)c² 核对。',
  },
  compute() {
    // p1
    const c = 2.99792458e8;
    const m = 1e-3;
    const u = 1e-4;
    const total = gammaOp(u) * m * c * c;
    const kinetic = (gammaOp(u) - 1) * m * c * c;
    const p1 = agree(total - kinetic, m * c * c, 'p1', 1e-9);

    // p2
    const A2 = Math.abs(0.51099895 - 0.511) < 1e-3;
    const B2 = true;
    const C2 = Math.abs(2 * 938.272 + 2 * 939.565 - 3727.379) < 1e-6;
    check(2 * 938.272 + 2 * 939.565 - 3727.379 > 28, 'p2 C：氦-4 的质量亏损约 28.3 MeV');
    const D2 = true;
    const g = gammaOp(0.6);
    const E2 = Math.abs((g - 1) - 0.5 * g * 0.36) < 1e-9;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3（MeV）
    const me = 0.511;
    const u3 = bisect((v) => (gammaOp(v) - 1) * me - 1, 0, 0.999999);
    const p3 = agree(u3, Math.sqrt(1 - (me / (1 + me)) ** 2), 'p3');

    // p4（MeV）
    const md = 1875.613;
    const mh = 2808.392;
    const mn = 939.565;
    const p = bisect((q) => Math.hypot(q, mh) + Math.hypot(q, mn) - 2 * md, 0, 1000);
    const kinetics = Math.hypot(p, mh) - mh + (Math.hypot(p, mn) - mn);
    const p4 = agree(kinetics, 2 * md - mh - mn, 'p4', 1e-9);

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
