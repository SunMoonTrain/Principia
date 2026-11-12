// 独立验算 physics.electromagnetism.skin-effect 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里良导体的近似式（δ = √(2/(ωμσ))、交流电阻 ≈ 直流电阻·a/(2δ)、τ = ε/σ）；
// 二是不用这些近似：由完整的复波数 k̃² = μεω² − iμσω（ε 取 ε₀，复数开方）求 δ = 1/|Im k̃|；
// p4 用龙格-库塔法积分 dρ/dt = −(σ/ε)ρ，二分出衰减到 1/e 的时刻。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.skin-effect.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, rk4Until } from './physics.electromagnetism._es.ts';

const MU0_GIVEN = 4 * Math.PI * 1e-7;
const EPS0_GIVEN = 8.854e-12;

/** 复数开方（主值）。 */
function csqrt(re: number, im: number): [number, number] {
  const r = Math.hypot(re, im);
  const a = Math.sqrt((r + re) / 2);
  const b = Math.sign(im || 1) * Math.sqrt((r - re) / 2);
  return [a, b];
}

/** 完整的复波数 k̃ = k − iκ：k̃² = μεω² − iμσω。 */
function kTilde(w: number, sigma: number, mu = MU0_GIVEN, eps = EPS0_GIVEN): { k: number; kappa: number } {
  const [a, b] = csqrt(mu * eps * w * w, -mu * sigma * w);
  return { k: Math.abs(a), kappa: Math.abs(b) };
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.skin-effect',
  notes: {
    p1: 'δ = √(2/(ωμσ))；和完整的复波数核对：k̃² = μ₀ε₀ω² − iμ₀σω 开方，δ = 1/κ（50 Hz 时位移电流的影响约 10⁻¹⁷）。',
    p2: '逐条用例子（铜，1 kHz 到 1 GHz）：A δ 随频率减小（对）；B δ ∝ 1/√σ，电导率加倍 δ 变小（错）；C 由复波数 2π/k 和 2πδ 相等（良导体，对）；D H 落后 E 45°（arg(k̃/(ωμ)) = −45°，错）；E 磁场和电场能量密度之比 σ/(εω) ≫ 1（对）。',
    p3: '交流电阻/直流电阻 = πa²/(2πaδ) = a/(2δ)；和完整复波数核对：δ 由 1/κ 算，再代 a/(2δ)。',
    p4: 'τ = ε/σ；和龙格-库塔法核对：积分 dρ/dt = −(σ/ε)ρ，二分出 ρ 降到 1/e 的时刻。',
  },
  compute() {
    // p1
    const w1 = 2 * Math.PI * 50;
    const s1 = 3.77e7;
    const p1 = agree((1 / kTilde(w1, s1).kappa) * 1e3, Math.sqrt(2 / (w1 * MU0_GIVEN * s1)) * 1e3, 'p1', 1e-9);

    // p2
    const sCu = 5.96e7;
    const deltas = [1e3, 1e6, 1e9].map((f) => 1 / kTilde(2 * Math.PI * f, sCu).kappa);
    const A = deltas[0] > deltas[1] && deltas[1] > deltas[2];
    const B = 1 / kTilde(2 * Math.PI * 1e6, 2 * sCu).kappa > deltas[1];
    const kt = kTilde(2 * Math.PI * 1e6, sCu);
    const C = Math.abs((2 * Math.PI) / kt.k / (2 * Math.PI * (1 / kt.kappa)) - 1) < 1e-6;
    // H̃ = (k̃/(ωμ))Ẽ：k̃ = k − iκ，k ≈ κ，辐角 −45°，磁场落后
    const D = Math.abs(Math.atan2(-kt.kappa, kt.k)) < 1e-6;
    const E = sCu / (EPS0_GIVEN * 2 * Math.PI * 1e6) > 1e6;
    check(A && !B && C && !D && E, 'p2');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const a3 = 1.0e-3;
    const d3 = 1 / kTilde(2 * Math.PI * 1.0e6, sCu).kappa;
    const p3 = agree(a3 / (2 * d3), a3 / (2 * Math.sqrt(2 / (2 * Math.PI * 1.0e6 * MU0_GIVEN * sCu))), 'p3', 1e-9);

    // p4
    const sig = 4.0;
    const eps = 80 * EPS0_GIVEN;
    const hit = rk4Until((_t, y) => [(-sig / eps) * y[0]], [1], 0, 1e-13, 1e8, (_t, y) => Math.exp(-1) - y[0]);
    const p4 = agree(hit.t * 1e9, (eps / sig) * 1e9, 'p4', 1e-8);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
