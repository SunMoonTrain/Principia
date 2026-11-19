// 独立验算 physics.thermal-physics.viscosity 的 p1–p4（简单题、中等题）。
// 题面「按讲解里的估算式」：η ≈ ⅓·ρ·v_rms·λ，ρ = (N/V)m，λ ≈ 1/(√2·σ·N/V) = k_BT/(√2·σ·p)，σ = πd²，
// 合起来 η ≈ m·v_rms/(3√2·σ)，v_rms = √(3RT/M) = √(3k_BT/m)，m = M/N_A；拖动平板的力 F = η·A·u₀/h（牛顿黏性定律，两板之间流速线性分布）。
// 两套算法互相核对：一是 η ≈ m·v_rms/(3√2σ)（不含压强）；二是先由 p、T 求数密度、密度和 λ，再算 ⅓ρv_rmsλ。
// 拖平板的力另用「分层松弛」核对：两板之间分成 n 层，每层所受上下两侧的黏性力相等时停下，得出的流速分布是直线，上板所受的力等于 ηAu₀/h。
// 选择题用具体的数逐条核对。常量取精确值：k_B = 1.380649e-23 J/K，N_A = 6.02214076e23 /mol，R = N_A·k_B（题面没给常量）。
// 另外核对讲解、例题里的几个数：例 1 的 7.2e-3 N、0.40 N、约 55 倍；例 2 的 m、v_rms、σ、d；
// 「硬球仔细地算约是粗估的 1.4 倍」（查普曼-恩斯科格一级近似 η = (5/16)√(πmk_BT)/(πd²)，再乘高阶修正 1.016）。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.viscosity.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen } from './physics.electromagnetism._es.ts';

const KB = 1.380649e-23;
const NA = 6.02214076e23;
const R = NA * KB;

const sigmaOf = (d: number): number => Math.PI * d * d;
const vrms = (T: number, M: number): number => Math.sqrt((3 * R * T) / M);

/** 讲解定理的第二个式子：η ≈ m·v_rms/(3√2σ)，不含压强。M 以 kg/mol 计。 */
const etaNoPressure = (T: number, M: number, d: number): number => ((M / NA) * vrms(T, M)) / (3 * Math.SQRT2 * sigmaOf(d));

/** 讲解定理的第一个式子：先由 p、T 求数密度 N/V = p/(k_BT)、密度 ρ = (N/V)m、λ = 1/(√2σN/V)，再算 ⅓ρv_rmsλ。 */
function etaFromState(p: number, T: number, M: number, d: number): number {
  const n = p / (KB * T);
  const rho = n * (M / NA);
  const lambda = 1 / (Math.SQRT2 * sigmaOf(d) * n);
  return (rho * vrms(T, M) * lambda) / 3;
}

/** 牛顿黏性定律：两板之间流速线性分布，F = η·A·u₀/h。 */
const plateForce = (eta: number, A: number, u0: number, h: number): number => (eta * A * u0) / h;

/**
 * 分层松弛：两板之间分成 n 层（层厚 h/n），下板 u = 0、上板 u = u₀；每层受上下两侧的黏性力 ηA(u_{k+1}−u_k)/Δz 和 ηA(u_k−u_{k−1})/Δz，
 * 反复把每层的速度调到两侧的力相等（高斯-赛德尔迭代），稳定后返回上板受的力 ηA(u₀−u_{n−1})/Δz（拉力与之平衡）。
 */
function plateForceByRelaxation(eta: number, A: number, u0: number, h: number, n = 50): number {
  const dz = h / n;
  const u = new Array(n + 1).fill(0);
  u[n] = u0;
  for (let sweep = 0; sweep < 200_000; sweep++) {
    let change = 0;
    for (let k = 1; k < n; k++) {
      const next = (u[k - 1] + u[k + 1]) / 2;
      change = Math.max(change, Math.abs(next - u[k]));
      u[k] = next;
    }
    if (change < 1e-15 * u0) break;
  }
  // 流速分布应是直线
  for (let k = 0; k <= n; k++) check(Math.abs(u[k] - (u0 * k) / n) < 1e-9 * u0, `分层松弛：第 ${k} 层流速 ${u[k]} 应为 ${(u0 * k) / n}`);
  return (eta * A * (u[n] - u[n - 1])) / dz;
}

/** 量纲：以 (kg, m, s) 的指数表示。 */
type Dim = [number, number, number];
const mul = (a: Dim, b: Dim): Dim => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const inv = (a: Dim): Dim => [-a[0], -a[1], -a[2]];
const sameDim = (a: Dim, b: Dim): boolean => a.every((x, i) => x === b[i]);

export const verification: Verification = {
  lesson: 'physics.thermal-physics.viscosity',
  notes: {
    p1: 'F = ηAu₀/h，η = 1.8e-5 Pa·s、A = 0.30 m²、u₀ = 1.5 m/s、h = 0.50 mm；和分层松弛（50 层，迭代到每层两侧的黏性力相等，流速分布成直线）算出的上板受力核对。',
    p2: '逐条核对：A 量纲 Pa·s = (kg·m·s⁻²/m²)·s = kg·m⁻¹·s⁻¹（对）；B F = ηAu₀/h，u₀、h 都变 2 倍，F 不变（对；取 η = 1.8e-5、A = 0.3、u₀ = 1.5、h = 5e-4）；C 等温（300 K）、d = 3.7e-10 m、M = 28 g/mol，λ 变 2 倍即数密度减半（p 从 1e5 Pa 降到 5e4 Pa），⅓ρv_rmsλ 不变（错）；D 同温（300 K）、同直径（3.6e-10 m），M = 4 与 40 g/mol，η ∝ √m，质量大的黏度大（对）；E 刚性容器 N/V 不变（2.5e25 m⁻³），300 K → 600 K，η 变为 √2 倍、不是不变（错）。',
    p3: 'η = m·v_rms/(3√2·πd²)，T = 400 K、d = 3.6e-10 m、M = 39.95 g/mol，m = M/N_A，v_rms = √(3RT/M)；和由任取的压强 1e5 Pa、3e3 Pa 出发算 ⅓ρv_rmsλ 的结果核对（与压强无关），换成 1e-5 Pa·s 为单位。',
    p4: '两个状态（300 K、1.0e5 Pa 与 600 K、1.0e4 Pa）各由 N/V = p/(k_BT) 求 ρ、λ，算 ⅓ρv_rmsλ（任取 d = 3.6e-10 m、M = 28 g/mol），间距和速度不变，F 的比就是 η 的比；和 η ∝ √T 给出的 √2 核对。',
  },
  compute() {
    // 讲解、例题里的数
    const ex1Air = plateForce(1.81e-5, 0.2, 2.0, 1.0e-3);
    check(Math.abs(ex1Air - 7.24e-3) < 1e-6, `例 1 空气：F = ${ex1Air}（约 7.2e-3 N）`);
    const ex1Water = plateForce(1.0e-3, 0.2, 2.0, 1.0e-3);
    check(Math.abs(ex1Water - 0.4) < 1e-12, `例 1 水：F = ${ex1Water}（0.40 N）`);
    check(Math.abs(ex1Water / ex1Air - 55) < 0.5, `例 1 水是空气的 ${ex1Water / ex1Air} 倍（约 55）`);
    const a4Weight = 0.21 * 0.297 * 0.08 * 9.8; // 80 g/m² 的 A4 纸
    check(Math.abs(a4Weight / ex1Air - 7) < 0.5, `例 1 A4 纸重力是拉力的 ${a4Weight / ex1Air} 倍（「七分之一左右」）`);
    const mAir = 0.029 / NA;
    check(Math.abs(mAir - 4.82e-26) < 0.005e-26, `例 2 m = ${mAir}`);
    const vAir = vrms(293, 0.029);
    check(Math.abs(vAir - 502) < 0.5, `例 2 v_rms = ${vAir}`);
    const sigmaAir = (mAir * vAir) / (3 * Math.SQRT2 * 1.81e-5);
    check(Math.abs(sigmaAir - 3.1e-19) < 0.05e-19, `例 2 σ = ${sigmaAir}`);
    const dAir = Math.sqrt(sigmaAir / Math.PI);
    check(Math.abs(dAir - 3.2e-10) < 0.05e-10, `例 2 d = ${dAir}`);
    // 「硬球仔细地算，黏度约是这个估算的 1.4 倍」：查普曼-恩斯科格一级近似与讲解的估算之比，与 m、T、d 无关
    const m0 = 4.65e-26;
    const T0 = 300;
    const d0 = 3.7e-10;
    const etaCE1 = ((5 / 16) * Math.sqrt(Math.PI * m0 * KB * T0)) / (Math.PI * d0 * d0);
    const etaRough = (m0 * Math.sqrt((3 * KB * T0) / m0)) / (3 * Math.SQRT2 * sigmaOf(d0));
    const ratioCE = etaCE1 / etaRough;
    check(ratioCE > 1.3 && ratioCE * 1.016 < 1.45, `硬球细算与粗估之比 ${ratioCE}（一级近似），${ratioCE * 1.016}（含高阶修正）`);
    // 用细算的系数反推空气分子的直径（例 2 末段说接近 3.7e-10 m）
    const dFine = Math.sqrt((sigmaAir * ratioCE * 1.016) / Math.PI);
    check(dFine > 3.6e-10 && dFine < 3.8e-10, `细算系数反推的 d = ${dFine}`);

    // p1（N）
    const p1 = agree(plateForceByRelaxation(1.8e-5, 0.3, 1.5, 0.5e-3), plateForce(1.8e-5, 0.3, 1.5, 0.5e-3), 'p1 拉力', 1e-9);

    // p2
    const Pa: Dim = [1, -1, -2];
    const sec: Dim = [0, 0, 1];
    const optA = sameDim(mul(Pa, sec), mul([1, 0, 0], inv([0, 1, 1])));
    const optB = Math.abs(plateForce(1.8e-5, 0.3, 3.0, 1e-3) / plateForce(1.8e-5, 0.3, 1.5, 5e-4) - 1) < 1e-12;
    // C：同一种气体（d = 3.7e-10 m，M = 28 g/mol），300 K；λ 变为 2 倍
    const lamC0 = (KB * 300) / (Math.SQRT2 * sigmaOf(3.7e-10) * 1e5);
    const lamC1 = (KB * 300) / (Math.SQRT2 * sigmaOf(3.7e-10) * 5e4);
    check(Math.abs(lamC1 / lamC0 - 2) < 1e-12, 'p2 C：等温下压强减半，λ 变 2 倍');
    const ratioC = etaFromState(5e4, 300, 0.028, 3.7e-10) / etaFromState(1e5, 300, 0.028, 3.7e-10);
    check(Math.abs(ratioC - 1) < 1e-12, `p2 C：黏度之比 ${ratioC}`);
    const optC = Math.abs(ratioC - 2) < 1e-9;
    // D：同温同直径，M = 4、40 g/mol
    const ratioD = etaNoPressure(300, 0.04, 3.6e-10) / etaNoPressure(300, 0.004, 3.6e-10);
    check(Math.abs(ratioD - Math.sqrt(10)) < 1e-12, `p2 D：黏度之比 ${ratioD}（√10）`);
    const optD = ratioD > 1;
    // E：刚性容器，N/V = 2.5e25 m⁻³ 不变，300 K → 600 K（压强随之加倍）
    const nE = 2.5e25;
    const ratioE = etaFromState(nE * KB * 600, 600, 0.028, 3.7e-10) / etaFromState(nE * KB * 300, 300, 0.028, 3.7e-10);
    check(Math.abs(ratioE - Math.SQRT2) < 1e-12, `p2 E：黏度之比 ${ratioE}（√2）`);
    const optE = Math.abs(ratioE - 1) < 1e-9;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（以 1e-5 Pa·s 为单位）
    const T3 = 400;
    const M3 = 0.03995;
    const d3 = 3.6e-10;
    const viaState = etaFromState(1e5, T3, M3, d3);
    agree(etaFromState(3e3, T3, M3, d3), viaState, 'p3 与压强无关', 1e-12);
    const p3 = agree(viaState, etaNoPressure(T3, M3, d3), 'p3 黏度', 1e-12) / 1e-5;

    // p4：拖动上板所需的力之比 = 黏度之比
    const d4 = 3.6e-10;
    const M4 = 0.028;
    const A4 = 0.1;
    const u4 = 1.0;
    const h4 = 1e-3;
    const F1 = plateForce(etaFromState(1.0e5, 300, M4, d4), A4, u4, h4);
    const F2 = plateForce(etaFromState(1.0e4, 600, M4, d4), A4, u4, h4);
    const p4 = agree(F2 / F1, Math.SQRT2, 'p4 力的倍数', 1e-12);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
