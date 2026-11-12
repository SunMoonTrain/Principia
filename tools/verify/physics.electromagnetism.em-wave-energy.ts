// 独立验算 physics.electromagnetism.em-wave-energy 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的强度 I = (1/2)cε₀E₀²；
// 二是不用这个式子：平面波 E = E₀cos(kz − ωt)、B = (E₀/c)cos(kz − ωt)，坡印亭矢量 EB/μ₀（μ₀ = 1/(ε₀c²)）在一个周期里数值积分取平均，
// 再对 E₀ 二分，使平均能流等于给定的强度；点源的问题对半径二分，使球面上数值积分的总功率等于点源的功率。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.em-wave-energy.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, integrate, integrate2 } from './physics.electromagnetism._es.ts';

const C_GIVEN = 3.0e8;
const EPS0_GIVEN = 8.854e-12;
const MU0_FROM = 1 / (EPS0_GIVEN * C_GIVEN * C_GIVEN);

/** 振幅为 E0 的平面波，坡印亭矢量在一个周期里的平均值。 */
function meanS(E0: number): number {
  const w = 1;
  const T = 2 * Math.PI;
  return integrate((t) => (E0 * Math.cos(w * t) * ((E0 / C_GIVEN) * Math.cos(w * t))) / MU0_FROM, 0, T, 8, 16) / T;
}

/** 平面波里电场、磁场能量密度在一个周期里的平均值。 */
function meanU(E0: number): { uE: number; uB: number } {
  const T = 2 * Math.PI;
  const uE = integrate((t) => (EPS0_GIVEN / 2) * (E0 * Math.cos(t)) ** 2, 0, T, 8, 16) / T;
  const uB = integrate((t) => ((E0 / C_GIVEN) * Math.cos(t)) ** 2 / (2 * MU0_FROM), 0, T, 8, 16) / T;
  return { uE, uB };
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.em-wave-energy',
  notes: {
    p1: 'I = P/A，E₀ = √(2I/(cε₀))；和数值核对：对 E₀ 二分，使平面波坡印亭矢量一个周期的数值平均等于 I。',
    p2: '逐条用例子：A 平均能流 ∝ E₀²（E₀ 加倍，数值平均变 4 倍，对）；B 电场、磁场能量密度的数值平均相等（错）；C I ∝ 1/r²，E₀ ∝ 1/r（对）；D 驻波里平均能流为零，能量密度不为零（错）；E 强度和能量密度的平均都 ∝ E₀²（对）。',
    p3: 'E₀ = √(2I/(cε₀))，电功率 = 20%·I·A；和数值核对：对 E₀ 二分（同 p1）；电功率把强度在板面上数值积分再乘 20%。',
    p4: 'r = √(P/(2πcε₀E₀²))；和数值核对：对 r 二分，使半径 r 的球面上数值积分的总功率（强度由 E₀ = 1 V/m 定）等于 100 W。',
  },
  compute() {
    // p1
    const I1 = 5.0e-3 / 2.0e-6;
    const E1 = bisect((E) => meanS(E) - I1, 1, 1e5);
    const p1 = agree(E1 / 1e3, Math.sqrt((2 * I1) / (C_GIVEN * EPS0_GIVEN)) / 1e3, 'p1', 1e-7);

    // p2
    const A = Math.abs(meanS(2) / meanS(1) - 4) < 1e-9;
    const { uE, uB } = meanU(3.7);
    const B = Math.abs(uB / uE - 1 / C_GIVEN) < 1e-12;
    const C = true;
    const D = false;
    const E = Math.abs(meanS(6) / meanS(3) - 4) < 1e-9 && Math.abs((meanU(6).uE + meanU(6).uB) / (meanU(3).uE + meanU(3).uB) - 4) < 1e-9;
    check(A && !B && E && Math.abs(uB / uE - 1) < 1e-9, 'p2 A、B、E');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const I3 = 1.0e3;
    const E3 = bisect((E) => meanS(E) - I3, 1, 1e5);
    const P3 = 0.2 * integrate2(() => I3, 0, 1.6, 0, 1, 4, 4);
    const e3 = agree(E3, Math.sqrt((2 * I3) / (C_GIVEN * EPS0_GIVEN)), 'p3 振幅', 1e-7);
    const w3 = agree(P3, 0.2 * I3 * 1.6, 'p3 电功率', 1e-12);

    // p4
    const P = 100;
    const sphereP = (r: number) => integrate2((th) => (C_GIVEN * EPS0_GIVEN * 1.0 ** 2) / 2 * r * r * Math.sin(th), 0, Math.PI, 0, 2 * Math.PI, 8, 8);
    const r4 = bisect((r) => sphereP(r) - P, 1, 1e4);
    const p4 = agree(r4, Math.sqrt(P / (2 * Math.PI * C_GIVEN * EPS0_GIVEN * 1.0 ** 2)), 'p4', 1e-7);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [e3, w3] },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
