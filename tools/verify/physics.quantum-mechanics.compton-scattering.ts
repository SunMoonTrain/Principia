// 独立验算 physics.quantum-mechanics.compton-scattering 的 p1–p4（简单题、中等题）。
// 三套互相独立的算法先互相核对：
// 一是康普顿公式 Δλ = λ_C(1 − cos θ)，λ_C = h/(m_e c)，以及由它得到的 E′ = E/(1 + (E/m_ec²)(1 − cos θ))；
// 二是直接解守恒方程（c = 1 的单位制）：入射光子沿 x 轴，散射光子沿 (cos θ, sin θ)，电子的动量 = 入射光子动量 − 散射光子动量
//   （矢量），电子的能量 = E + m_ec² − E′，对 E′ 二分，使 E_e² = p_e² + (m_ec²)²。这一套里不写康普顿公式；
// 三是零动量系里光子只改方向、不改能量：零动量系相对实验室的速度 β = E/(E + m_ec²)，入射光子在零动量系里的频率是
//   实验室的 γ(1 − β) 倍，散射后回到实验室再除以 γ(1 − β cos θ)（相对论多普勒公式两次），得 E′/E = (1 − β)/(1 − β cos θ)。
// 常量用 CODATA 2022（h、c、e 是定义值，m_e = 9.109 383 7139 × 10⁻³¹ kg）；题面给了 m_ec² = 0.511 MeV 的（p3）按题面算。
// 单独运行：npx tsx tools/verify/physics.quantum-mechanics.compton-scattering.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen } from './physics.special-relativity._relativity.ts';

// CODATA 2022
const h = 6.62607015e-34; // J·s，定义值
const c = 299792458; // m/s，定义值
const eCharge = 1.602176634e-19; // C，定义值
const me = 9.1093837139e-31; // kg
const lambdaCpm = (h / (me * c)) * 1e12; // 电子的康普顿波长，pm
const hcKeVpm = (h * c) / eCharge / 1e3 / 1e-12; // hc，keV·pm（数值上等于 eV·nm，约 1239.84）
const mec2keV = (me * c * c) / eCharge / 1e3; // m_ec²，keV（约 510.999）

const deg = Math.PI / 180;

/** 第一套：康普顿公式。能量单位任意（和 mc2 同单位）。 */
const byFormula = (E: number, theta: number, mc2: number): number => E / (1 + (E / mc2) * (1 - Math.cos(theta)));

/** 第三套：零动量系里光子只改方向，实验室和零动量系之间各用一次多普勒公式。 */
const byZeroMomentumFrame = (E: number, theta: number, mc2: number): number => {
  const beta = E / (E + mc2);
  const gamma = 1 / Math.sqrt(1 - beta * beta);
  const Estar = E * gamma * (1 - beta); // 零动量系里入射光子的能量，散射后不变
  return Estar / (gamma * (1 - beta * Math.cos(theta)));
};

/**
 * 第二套：直接解守恒方程。入射光子能量 E 沿 x 轴，散射光子沿 (cos θ, sin θ)。
 * 返回散射光子能量 E′、电子动量矢量（和 E 同单位）、电子动能。
 */
function byConservation(E: number, theta: number, mc2: number): { Ep: number; pe: [number, number]; K: number } {
  const momentum = (Ep: number): [number, number] => [E - Ep * Math.cos(theta), -Ep * Math.sin(theta)];
  const residual = (Ep: number): number => {
    const [px, py] = momentum(Ep);
    const Ee = E + mc2 - Ep;
    return Ee * Ee - (px * px + py * py) - mc2 * mc2;
  };
  // E′ → 0 时余量是 2E·mc2 > 0；E′ = E 时余量是 −2E²(1 − cos θ) < 0（θ ≠ 0），中间有唯一的根。
  const Ep = theta === 0 ? E : bisect(residual, 1e-12 * E, E);
  return { Ep, pe: momentum(Ep), K: E - Ep };
}

/** 三套算法互相核对散射光子的能量，返回守恒方程那一套的结果。 */
function scatter(E: number, theta: number, mc2: number, what: string): { Ep: number; pe: [number, number]; K: number } {
  const out = byConservation(E, theta, mc2);
  agree(out.Ep, byFormula(E, theta, mc2), `${what}：守恒方程和康普顿公式`, 1e-9);
  agree(out.Ep, byZeroMomentumFrame(E, theta, mc2), `${what}：守恒方程和零动量系`, 1e-9);
  return out;
}

export const verification: Verification = {
  lesson: 'physics.quantum-mechanics.compton-scattering',
  notes: {
    p1: 'λ_C = h/(m_ec)（CODATA 2022，2.426 310 235 38 pm），Δλ = λ_C(1 − cos 135°)；再取钼 Kα 的 70.93 pm 和 20 pm、1 pm 三个入射波长，三套算法（守恒方程二分、康普顿公式、零动量系里两次多普勒）算出 E′、换成波长相减，波长差都相同、等于公式值。',
    p2: 'A：Δλ(60°)/Δλ(120°) = 0.5/1.5，并在 1 keV、100 keV 两种入射光子上用守恒方程核对；B：强度加倍是光子数加倍，每个光子各自散射，取 17.5 keV、θ = 90° 的一个光子和两个光子，每个的 Δλ 都不变（反例）；再核对 Δλ 和入射能量无关；C：θ = 180° 时在 1 keV、100 keV、1.33 MeV、10 MeV 上解守恒方程，|p_e| = p + p′ > p；D：θ = 90° 时同样四种能量，电子方向和入射方向的夹角 arctan(p′/p) 都在 45° 以内，不是 90°（反例）。',
    p3: 'm_ec² 取题面的 0.511 MeV。在 θ = 0°–180° 上每 0.1° 解一次守恒方程，电子动能 K = E − E′ 随 θ 单调增，最大值落在 180°（界），180° 是允许的散射角（取得到）；和 E·2ε/(1 + 2ε)（ε = E/m_ec²）核对。',
    p4: 'E = hc/λ（λ = 1.00 pm，hc 由定义值算），θ = 90°：λ′ = λ + λ_C，E′ = hc/λ′；电子方向 arctan(p′/p) = arctan(λ/λ′)。三套算法算 E′，守恒方程那一套给出电子动量矢量 (p, −p′)，量它和 x 轴的夹角核对。',
  },
  compute() {
    check(Math.abs(lambdaCpm - 2.42631023538) < 1e-10, 'λ_C 和 CODATA 2022 的 2.426 310 235 38 pm 一致');
    check(Math.abs(hcKeVpm / mec2keV - lambdaCpm) < 1e-12, 'hc/(m_ec²) = h/(m_ec)');

    // p1
    const theta1 = 135 * deg;
    const p1 = lambdaCpm * (1 - Math.cos(theta1));
    for (const lam of [70.93, 20, 1]) {
      const E = hcKeVpm / lam;
      const { Ep } = scatter(E, theta1, mec2keV, `p1（入射 ${lam} pm）`);
      agree(hcKeVpm / Ep - lam, p1, `p1：入射 ${lam} pm 时的波长差`, 1e-8);
    }

    // p2
    const shift = (E: number, th: number, what: string): number => hcKeVpm / scatter(E, th, mec2keV, what).Ep - hcKeVpm / E;
    const A2 = [1, 100].every((E) => Math.abs(shift(E, 60 * deg, 'p2 A') / shift(E, 120 * deg, 'p2 A') - 1 / 3) < 1e-9);
    check(Math.abs((1 - Math.cos(60 * deg)) / (1 - Math.cos(120 * deg)) - 1 / 3) < 1e-12, 'p2 A：公式给 1/3');
    const E17 = 17.5;
    const one = shift(E17, 90 * deg, 'p2 B');
    const twoPhotons = [shift(E17, 90 * deg, 'p2 B'), shift(E17, 90 * deg, 'p2 B')];
    const B2 = twoPhotons.every((d) => Math.abs(d - 2 * one) < 1e-9 * one);
    check(Math.abs(shift(2 * E17, 90 * deg, 'p2 B') - one) < 1e-8 * one, 'p2 B：Δλ 和入射光子能量无关');
    const energies = [1, 100, 1330, 10000]; // keV
    const C2 = energies.every((E) => {
      const { Ep, pe } = scatter(E, Math.PI, mec2keV, `p2 C（${E} keV）`);
      agree(Math.hypot(pe[0], pe[1]), E + Ep, `p2 C：${E} keV 时 p_e = p + p′`, 1e-9);
      return Math.hypot(pe[0], pe[1]) > E;
    });
    const D2 = energies.every((E) => {
      const { Ep, pe } = scatter(E, 90 * deg, mec2keV, `p2 D（${E} keV）`);
      const ang = Math.abs(Math.atan2(pe[1], pe[0])) / deg;
      agree(ang, Math.atan(Ep / E) / deg, `p2 D：${E} keV 时电子方向`, 1e-9);
      check(ang < 45, 'p2 D：夹角在 45° 以内');
      return Math.abs(ang - 90) < 1e-6;
    });
    const p2 = chosen([A2, B2, C2, D2]);

    // p3
    const E3 = 1330; // keV
    const m3 = 511; // keV，题面的 0.511 MeV
    const K = Array.from({ length: 1801 }, (_, i) => scatter(E3, (i / 10) * deg, m3, 'p3').K);
    check(
      K.every((k, i) => i === 0 || k >= K[i - 1]),
      'p3：反冲动能随散射角单调增',
    );
    check(
      K.every((k) => k <= K[1800]),
      'p3：最大值在 180°',
    );
    const eps = E3 / m3;
    agree(K[1800], (E3 * 2 * eps) / (1 + 2 * eps), 'p3：E·2ε/(1 + 2ε)', 1e-9);
    const p3 = K[1800] / 1000; // MeV

    // p4
    const lam4 = 1.0; // pm
    const lam4p = lam4 + lambdaCpm * (1 - Math.cos(90 * deg));
    const E4 = hcKeVpm / lam4;
    const sol4 = scatter(E4, 90 * deg, mec2keV, 'p4');
    const Ep4 = agree(sol4.Ep, hcKeVpm / lam4p, 'p4：E′ = hc/λ′', 1e-9);
    const ang4 = agree(Math.abs(Math.atan2(sol4.pe[1], sol4.pe[0])) / deg, Math.atan(lam4 / lam4p) / deg, 'p4：电子方向', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [Ep4, ang4] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
