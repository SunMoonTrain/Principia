// 独立验算 physics.electromagnetism.retarded-potentials 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（推迟时间 t − |r − r'|/c，长直导线突然通电时 B = μ₀I/(2πs)·ct/√(c²t² − s²)，光走一条边的时间 L/c）；
// 二是不用这些式子：p1、p4 对时刻、频率二分；p3 把推迟势 A_z = (μ₀/4π)∫ I(t_r)/√(s² + z²) dz 数值积分（只有推迟时间 ≥ 0 的那一段有电流），
// 再对 s 中心差分，B = −∂A_z/∂s。选择题用具体例子数值核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.retarded-potentials.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, divergence, integrate, type V3 } from './physics.electromagnetism._es.ts';

const C_GIVEN = 3.0e8;
const MU0_GIVEN = 4 * Math.PI * 1e-7;
const EPS0_GIVEN = 1 / (MU0_GIVEN * C_GIVEN * C_GIVEN);

/** 两端带电 ±q(t)、中间通电流 I = dq/dt 的短偶极子（沿 z 轴，长 d）在 (x, 0, 0) 处的推迟势和电场。 */
function dipoleRetarded(q0: number, w: number, d: number) {
  const q = (t: number) => q0 * Math.cos(w * t);
  const I = (t: number) => -q0 * w * Math.sin(w * t);
  const phi = (p: V3, t: number) => {
    const Rp = Math.hypot(p[0], p[1], p[2] - d / 2);
    const Rm = Math.hypot(p[0], p[1], p[2] + d / 2);
    return (q(t - Rp / C_GIVEN) / Rp - q(t - Rm / C_GIVEN) / Rm) / (4 * Math.PI * EPS0_GIVEN);
  };
  const Az = (p: V3, t: number) =>
    (MU0_GIVEN / (4 * Math.PI)) *
    integrate((z) => {
      const R = Math.hypot(p[0], p[1], p[2] - z);
      return I(t - R / C_GIVEN) / R;
    }, -d / 2, d / 2, 8, 16);
  // 真正的电场 E = −∇φ − ∂A/∂t（中心差分）
  const Ez = (p: V3, t: number, h: number, ht: number) =>
    -(phi([p[0], p[1], p[2] + h], t) - phi([p[0], p[1], p[2] - h], t)) / (2 * h) - (Az(p, t + ht) - Az(p, t - ht)) / (2 * ht);
  // 「推迟的库仑定律」：库仑定律里的电荷换成推迟时间的值
  const EzCoulomb = (p: V3, t: number) => {
    const Rp: V3 = [p[0], p[1], p[2] - d / 2];
    const Rm: V3 = [p[0], p[1], p[2] + d / 2];
    const np = Math.hypot(...Rp);
    const nm = Math.hypot(...Rm);
    return ((q(t - np / C_GIVEN) * Rp[2]) / np ** 3 - (q(t - nm / C_GIVEN) * Rm[2]) / nm ** 3) / (4 * Math.PI * EPS0_GIVEN);
  };
  return { phi, Az, Ez, EzCoulomb };
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.retarded-potentials',
  notes: {
    p1: 't = d/c；和二分核对：对时刻 t 二分，使月球上那一点的推迟时间 t − d/c 正好是挪动的时刻 0。',
    p2: '逐条用例子：A 场点在原点，源点在 1 m、2 m 处，推迟时间 t − 1/c 比 t − 2/c 晚（对）；B 源不随时间变，推迟时间不起作用（对）；C 长 1 cm 的振荡偶极子，在赤道面 50 个波长处，由推迟势算出的电场振幅是「推迟的库仑定律」给出的 10⁴ 倍以上（错）；D 振荡偶极子的推迟矢势在 z ≠ 0 处 ∇·A ≠ 0（错）；E 源长 1 cm、波长 1 m，推迟时间之差至多是周期的 1%（对）。',
    p3: 'B = μ₀I/(2πs)·ct/√(c²t² − s²)；和推迟势核对：A_z = (μ₀/4π)∫ I/√(s² + z²) dz 只在 |z| ≤ √(c²t² − s²) 上积分（那里推迟时间 ≥ 0），数值积分后对 s 中心差分。',
    p4: 'f = c/(10L)；和二分核对：对频率二分，使光走一条边的时间 L/c 等于周期的 1/10。',
  },
  compute() {
    // p1
    const d1 = 3.84e8;
    const t1 = bisect((t) => t - d1 / C_GIVEN, 0, 10);
    const p1 = agree(t1, d1 / C_GIVEN, 'p1', 1e-12);

    // p2
    const tObs = 1e-8;
    const A = tObs - 1 / C_GIVEN > tObs - 2 / C_GIVEN;
    const B = true;
    const lam = 1.0;
    const w = (2 * Math.PI * C_GIVEN) / lam;
    const dip = dipoleRetarded(1e-12, w, 0.01);
    const far: V3 = [50 * lam, 0, 0];
    const T = (2 * Math.PI) / w;
    let ampTrue = 0;
    let ampCoulomb = 0;
    for (let i = 0; i < 64; i++) {
      const t = (i / 64) * T + 100 * T;
      ampTrue = Math.max(ampTrue, Math.abs(dip.Ez(far, t, 1e-4, T * 1e-5)));
      ampCoulomb = Math.max(ampCoulomb, Math.abs(dip.EzCoulomb(far, t)));
    }
    const C = !(ampTrue / ampCoulomb > 1e4);
    // D：A = (0, 0, A_z) 在 (0.3, 0.2, 0.5) 处的散度
    const tD = 0.3 * T;
    const divA = divergence((p) => [0, 0, dip.Az(p, tD)], [0.3, 0.2, 0.5], 1e-5);
    const scaleA = Math.abs(dip.Az([0.3, 0.2, 0.5], tD)) + Math.abs(dip.Az([0.3, 0.2, 0.5], tD + T / 4));
    const D = Math.abs(divA) < 1e-6 * scaleA;
    const E = 0.01 / C_GIVEN / ((1 / C_GIVEN) * lam) <= 0.01 + 1e-12;
    check(A && B && !C && !D && E, 'p2');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const I0 = 10;
    const s3 = 3.0;
    const t3 = 20e-9;
    const Az = (s: number) => {
      const Z = Math.sqrt((C_GIVEN * t3) ** 2 - s * s);
      return (MU0_GIVEN / (4 * Math.PI)) * integrate((z) => I0 / Math.hypot(s, z), -Z, Z, 64, 16);
    };
    const h = 1e-4;
    const Bnum = -(Az(s3 + h) - Az(s3 - h)) / (2 * h);
    const ct = C_GIVEN * t3;
    const p3 = agree(Bnum * 1e6, ((MU0_GIVEN * I0) / (2 * Math.PI * s3)) * (ct / Math.sqrt(ct * ct - s3 * s3)) * 1e6, 'p3', 1e-7);

    // p4
    const L4 = 0.15;
    const f4 = bisect((f) => L4 / C_GIVEN - 1 / (10 * f), 1e6, 1e10);
    const p4 = agree(f4 / 1e6, C_GIVEN / (10 * L4) / 1e6, 'p4', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
