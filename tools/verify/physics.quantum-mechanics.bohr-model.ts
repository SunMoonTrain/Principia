// 独立验算 physics.quantum-mechanics.bohr-model 的 p1–p4（简单题、中等题）。
// 两套算法互相核对：
// 一是玻尔模型的公式：r_n = n²·4πε₀ħ²/(m_e e²)；1/λ = Z²R_M(1/n₁² − 1/n₂²)，R_M = R∞/(1 + m_e/M)。
// 二是不用这些公式、直接解力学：库仑力（核电荷 Ze）提供向心力，电子和原子核绕质心以同一角速度 ω 转，
//   系统对质心的总角动量取 nħ，对两者的间距 d 二分；能量 = 电子动能 + 原子核动能 + 库仑势能。
//   原子核不动时原子核那一份取零。波长由能量差和 hcR∞ = |E₁|（原子核不动的氢基态能量）换算，
//   所以不用里德伯公式，也不用约化质量的式子。
// 选择题 p2 用同一个力学模型算出的能级、动能、绕核周期逐条核对。
// 单独运行：npx tsx tools/verify/physics.quantum-mechanics.bohr-model.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen } from './physics.electromagnetism._es.ts';

// ---------- 常量（CODATA 2022；题面给了近似值的用题面的） ----------

const H = 6.62607015e-34;
const HBAR = H / (2 * Math.PI);
const E_CHARGE = 1.602176634e-19;
const EPS0 = 8.8541878188e-12;
const M_E = 9.1093837139e-31;
const K_COUL = E_CHARGE ** 2 / (4 * Math.PI * EPS0);

/** p3、p4 题面给的 R∞ 和质量比。 */
const RINF_GIVEN = 1.0973732e7;
const MP_OVER_ME = 1836.15;
const MD_OVER_ME = 3670.48;

interface State {
  d: number; // 电子到原子核的距离
  omega: number; // 绕质心的角速度
  kE: number; // 电子的动能
  energy: number; // 总能量（动能之和 + 库仑势能）
  period: number; // 转一圈的时间
}

/**
 * 力学模型：电子质量 m，原子核质量 M（Infinity 表示不动），库仑常量乘积 kZ（库仑力 kZ/d²），角动量量子 hbar。
 * 电子到质心 d·M/(m+M)，原子核到质心 d·m/(m+M)；电子的向心力由库仑力提供，求出 ω；总角动量 = n·hbar，对 d 二分。
 */
function bohrState(n: number, kZ: number, m: number, M: number, hbar: number, dLo: number, dHi: number): State {
  const geometry = (d: number) => {
    const re = Number.isFinite(M) ? (d * M) / (m + M) : d;
    const rN = Number.isFinite(M) ? (d * m) / (m + M) : 0;
    const omega = Math.sqrt(kZ / (m * re * d * d)); // m ω² re = kZ/d²
    const Ltot = m * re * re * omega + (Number.isFinite(M) ? M * rN * rN * omega : 0);
    return { re, rN, omega, Ltot };
  };
  const d = bisect((x) => geometry(x).Ltot - n * hbar, dLo, dHi);
  const g = geometry(d);
  // 原子核受的力也要由同一个库仑力提供：M ω² rN = kZ/d²（原子核不动时不用查）。
  if (Number.isFinite(M)) check(Math.abs((M * g.omega ** 2 * g.rN) / (kZ / (d * d)) - 1) < 1e-9, '原子核的向心力');
  const kE = 0.5 * m * (g.omega * g.re) ** 2;
  const kN = Number.isFinite(M) ? 0.5 * M * (g.omega * g.rN) ** 2 : 0;
  return { d, omega: g.omega, kE, energy: kE + kN - kZ / d, period: (2 * Math.PI) / g.omega };
}

/** SI 单位下的氢原子（原子核不动）。 */
const hydrogenSI = (n: number) => bohrState(n, K_COUL, M_E, Infinity, HBAR, 1e-14, 1e-6);
/** 原子单位（m_e = 1、e²/(4πε₀) = 1、ħ = 1）下的状态，核电荷 Z、原子核质量 M（以 m_e 为单位）。 */
const atomicUnits = (n: number, Z: number, M: number) => bohrState(n, Z, 1, M, 1, 1e-4, 1e4);

const eV = (J: number) => J / E_CHARGE;

export const verification: Verification = {
  lesson: 'physics.quantum-mechanics.bohr-model',
  notes: {
    p1: '公式 r_n = n²·4πε₀ħ²/(m_e e²)，n = 3，CODATA 2022 的常量；和力学模型核对：v = √(k/(m_e r)) 由库仑力等于向心力得出，对 r 二分使 m_e v r = 3ħ。约 0.476 nm。',
    p2: '用力学模型（原子核不动）算能级、动能、周期逐条判：A 从 n=3 往下的路径有 3→1（一个光子）和 3→2→1（两个），对；B 动能 K₂ ≈ 3.40 eV > K₃ ≈ 1.51 eV，跃迁后变大，错；C E₂−E₁ ≈ 10.20 eV、E₃−E₁ ≈ 12.09 eV，没有和 11.0 eV 对上的能级，E₂、E₃ 之间也没有别的定态，错；D 从 n=2 电离要 |E₂| ≈ 3.40 eV < 3.5 eV，对；E 周期 T₁ < T₂ < T₃（∝ n³），量子数越大越长，错。',
    p3: '公式：λ_M = 1/[R∞/(1 + m_e/M)·(1/4 − 1/9)]，Δλ = λ_H − λ_D，用题面的 R∞ 和质量比；和力学模型核对（原子单位）：电子、原子核绕质心转，总角动量 = nħ，算出 E₃ − E₂，1/λ = R∞·(E₃ − E₂)/|E₁(原子核不动)|。约 0.179 nm（λ_H ≈ 656.47 nm，λ_D ≈ 656.29 nm）。',
    p4: '公式：1/λ = Z²R∞(1/9 − 1/16)，Z = 2，原子核不动，用题面的 R∞；和力学模型核对：原子单位里库仑力换成 2/d²，算 E₄ − E₃，1/λ = R∞·(E₄ − E₃)/|E₁(氢，原子核不动)|。约 468.7 nm。',
  },
  compute() {
    // p1：n = 3 的轨道半径（nm）
    const rFormula = (9 * 4 * Math.PI * EPS0 * HBAR ** 2) / (M_E * E_CHARGE ** 2);
    const p1 = agree(hydrogenSI(3).d / 1e-9, rFormula / 1e-9, 'p1', 1e-9);

    // p2：逐条
    const lv = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (n === 0 ? null : hydrogenSI(n)));
    const E = (n: number) => eV(lv[n]!.energy);
    // A：从 3 往下、每一步跳到任意更低的能级，到 1 为止，数每条路径放出几个光子。
    const counts = new Set<number>();
    const walk = (from: number, photons: number) => {
      if (from === 1) {
        counts.add(photons);
        return;
      }
      for (let to = 1; to < from; to++) walk(to, photons + 1);
    };
    walk(3, 0);
    const A = counts.has(1) && counts.has(2);
    check(counts.size === 2, 'p2 A：只有 3→1 和 3→2→1 两种');
    // B：放出光子后动能变小？
    const B = lv[2]!.kE < lv[3]!.kE;
    check(Math.abs(eV(lv[2]!.kE) + E(2)) < 1e-9 && Math.abs(eV(lv[3]!.kE) + E(3)) < 1e-9, 'p2 B：原子核不动时 K = −E');
    // C：基态吸收 11.0 eV 的光子，有没有能级对得上（容差 0.05 eV 已很宽）；E₂、E₃ 之间有没有定态（n 只取整数）。
    const matches = [2, 3, 4, 5, 6, 7, 8].filter((n) => Math.abs(E(n) - E(1) - 11.0) < 0.05);
    const between = [1, 2, 3, 4, 5, 6, 7, 8].filter((n) => E(n) > E(2) + 1e-9 && E(n) < E(3) - 1e-9);
    const C = matches.length > 0 && between.length > 0;
    check(Math.abs(E(2) - E(1) - 10.2) < 0.01 && Math.abs(E(3) - E(1) - 12.09) < 0.01, 'p2 C：10.20 eV、12.09 eV');
    // D：n = 2 吸收 3.5 eV 能不能电离（末态能量 ≥ 0）
    const D = E(2) + 3.5 >= 0;
    // E：量子数越大，周期越短？
    const periods = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => lv[n]!.period);
    const E_opt = periods.every((T, i) => i === 0 || T < periods[i - 1]);
    check(periods.every((T, i) => Math.abs(T / periods[0] - (i + 1) ** 3) < 1e-6), 'p2 E：周期 ∝ n³');
    const p2 = chosen([A, B, C, D, E_opt]);

    // p3：氢、氘 3→2 的真空波长之差（nm）
    const lamFormula = (massRatio: number) => 1 / ((RINF_GIVEN / (1 + 1 / massRatio)) * (1 / 4 - 1 / 9));
    const dLamFormula = (lamFormula(MP_OVER_ME) - lamFormula(MD_OVER_ME)) / 1e-9;
    const ground = Math.abs(atomicUnits(1, 1, Infinity).energy);
    check(Math.abs(ground - 0.5) < 1e-12, 'p3：原子单位里原子核不动的氢基态是 −1/2');
    const lamMech = (massRatio: number) => 1 / (RINF_GIVEN * ((atomicUnits(3, 1, massRatio).energy - atomicUnits(2, 1, massRatio).energy) / ground));
    const dLamMech = (lamMech(MP_OVER_ME) - lamMech(MD_OVER_ME)) / 1e-9;
    const p3 = agree(dLamMech, dLamFormula, 'p3', 1e-7);
    check(Math.abs(lamMech(MP_OVER_ME) / 1e-9 - 656.47) < 0.01, 'p3：λ_H ≈ 656.47 nm');

    // p4：He⁺ 4→3（原子核不动）的真空波长（nm）
    const p4Formula = 1 / (4 * RINF_GIVEN * (1 / 9 - 1 / 16)) / 1e-9;
    const p4Mech = 1 / (RINF_GIVEN * ((atomicUnits(4, 2, Infinity).energy - atomicUnits(3, 2, Infinity).energy) / ground)) / 1e-9;
    const p4 = agree(p4Mech, p4Formula, 'p4', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
