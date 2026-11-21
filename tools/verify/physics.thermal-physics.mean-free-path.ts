// 独立验算 physics.thermal-physics.mean-free-path 的 p1–p4（简单题、中等题）。
// 题面都写「按讲解里的估算式」：λ ≈ 1/(√2·σ·N/V) = k_B·T/(√2·σ·p)，碰撞频率 1/τ ≈ √2·σ·(N/V)·v_rms，σ = πd²，v_rms = √(3RT/M)。
// 两套算法：一是由数密度 N/V 出发；二是由压强 p 出发（λ = k_BT/(√2σp)、v_rms = √(3k_BT/m)、1/τ = v_rms/λ），
// 状态变化的题按 pV = Nk_BT 逐步算出每个状态的 p、V、T 再代公式。选择题用具体的数逐条核对。
// 另外用蒙特卡罗抽样核对讲解里的两处说法：相对速度的方均值是 2⟨v²⟩（√2 的来历）；按麦克斯韦分布 ⟨|v₁−v₂|⟩ = √2⟨v⟩（λ 的式子不变）、⟨v⟩ 比 v_rms 约小 8%。
// 常量取精确值：k_B = 1.380649e-23 J/K，N_A = 6.02214076e23 /mol，R = N_A·k_B（题面没给常量）。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.mean-free-path.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen } from './physics.electromagnetism._es.ts';

const KB = 1.380649e-23;
const NA = 6.02214076e23;
const R = NA * KB;

const sigmaOf = (d: number): number => Math.PI * d * d;

/** 讲解的估算式，由数密度出发。 */
const lambdaFromN = (n: number, d: number): number => 1 / (Math.SQRT2 * sigmaOf(d) * n);
const freqFromN = (n: number, d: number, T: number, M: number): number => Math.SQRT2 * sigmaOf(d) * n * Math.sqrt((3 * R * T) / M);

/** 讲解的估算式，由压强出发（第二个等号），速率用单个分子的质量。 */
const lambdaFromP = (p: number, T: number, d: number): number => (KB * T) / (Math.SQRT2 * sigmaOf(d) * p);
const vrmsFromMass = (T: number, M: number): number => Math.sqrt((3 * KB * T) / (M / NA));

/** 带种子的伪随机数（mulberry32），结果可重复。 */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 按麦克斯韦分布（各分量独立的正态分布，方差 1）抽一个速度。 */
function gaussianVelocity(u: () => number): [number, number, number] {
  const g = (): number => {
    const r = Math.sqrt(-2 * Math.log(1 - u()));
    return r * Math.cos(2 * Math.PI * u());
  };
  return [g(), g(), g()];
}

/** 抽 n 对分子，返回 ⟨|v₁−v₂|²⟩/⟨v²⟩、⟨|v₁−v₂|⟩/⟨v⟩、⟨v⟩/v_rms。 */
function relativeSpeedRatios(nPairs: number, seed: number): { msRatio: number; meanRatio: number; meanOverRms: number } {
  const u = rng(seed);
  let sumV2 = 0;
  let sumV = 0;
  let sumRel2 = 0;
  let sumRel = 0;
  for (let i = 0; i < nPairs; i++) {
    const a = gaussianVelocity(u);
    const b = gaussianVelocity(u);
    const va2 = a[0] ** 2 + a[1] ** 2 + a[2] ** 2;
    const rel2 = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
    sumV2 += va2;
    sumV += Math.sqrt(va2);
    sumRel2 += rel2;
    sumRel += Math.sqrt(rel2);
  }
  const ms = sumV2 / nPairs;
  const mean = sumV / nPairs;
  return { msRatio: sumRel2 / nPairs / ms, meanRatio: sumRel / nPairs / mean, meanOverRms: mean / Math.sqrt(ms) };
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.mean-free-path',
  notes: {
    p1: 'λ = 1/(√2·πd²·N/V)，N/V = 2.5e25 m⁻³、d = 2.2e-10 m，换成 nm；和由 p = (N/V)k_BT（任取 T = 273 K）出发的 k_BT/(√2σp) 核对。',
    p2: '逐条用具体的数（d = 3e-10 m，300 K，1e5 Pa 的氮气）：A 等温抽走一半，N/V 减半，λ 变为 2 倍（错）；B 刚性密闭容器升温，N/V 不变，λ 不变（对）；C 等温压强变 2 倍，N/V 变 2 倍、v_rms 不变，碰撞频率变 2 倍（对）；D 同数密度、直径 2 倍，σ 是 4 倍，λ 是 1/4，不是一半（错）；E 等压升温（300 K → 600 K），N/V = p/(k_BT) 变小，λ 变长（对）。',
    p3: '1/τ = √2·πd²·(p/(k_BT))·√(3RT/M)，400 K、2.0e4 Pa、d = 3.6e-10 m、M = 32.0 g/mol，k_B、R 取精确值；和 λ = k_BT/(√2σp)、v_rms = √(3k_BT/m)（m = M/N_A）、1/τ = v_rms/λ 核对。',
    p4: '按 pV = Nk_BT 逐步算出三个状态（300 K、V₀ → 300 K、V₀/4 → 600 K、V₀/4）的压强，代 λ = k_BT/(√2σp)、τ = λ/v_rms；和标度关系 λ ∝ V/N、τ ∝ (V/N)/√T 给出的 1/4、1/(4√2) 核对。',
  },
  compute() {
    // 讲解里两处说法：蒙特卡罗核对（相对误差 1% 以内）
    const mc = relativeSpeedRatios(400_000, 20261119);
    check(Math.abs(mc.msRatio - 2) < 0.02, `⟨|v₁−v₂|²⟩ = 2⟨v²⟩（抽样得 ${mc.msRatio}）`);
    check(Math.abs(mc.meanRatio - Math.SQRT2) < 0.015, `⟨|v₁−v₂|⟩ = √2⟨v⟩（抽样得 ${mc.meanRatio}）`);
    check(Math.abs(mc.meanOverRms - Math.sqrt(8 / (3 * Math.PI))) < 0.01, `⟨v⟩/v_rms = √(8/3π) ≈ 0.921（抽样得 ${mc.meanOverRms}）`);

    // p1（nm）
    const n1 = 2.5e25;
    const d1 = 2.2e-10;
    const T1 = 273;
    const p1 = agree(lambdaFromP(n1 * KB * T1, T1, d1), lambdaFromN(n1, d1), 'p1 平均自由程', 1e-12) * 1e9;

    // p2：以 300 K、1e5 Pa、d = 3e-10 m、M = 28 g/mol 的气体为起点
    const d = 3e-10;
    const M = 0.028;
    const T0 = 300;
    const P0 = 1e5;
    const n0 = P0 / (KB * T0);
    const lam0 = lambdaFromN(n0, d);
    // A：等温，V 不变，N 减半
    const optA = Math.abs(lambdaFromN(n0 / 2, d) / lam0 - 0.5) < 1e-12;
    check(Math.abs(lambdaFromN(n0 / 2, d) / lam0 - 2) < 1e-12, 'p2 A：λ 变为 2 倍');
    // B：N、V 不变，T 升到 600 K（压强随之加倍）
    const nB = (2 * P0) / (KB * 600);
    const optB = Math.abs(lambdaFromP(2 * P0, 600, d) / lam0 - 1) < 1e-12 && Math.abs(nB / n0 - 1) < 1e-12;
    // C：等温，p 变 2 倍
    const optC = Math.abs(freqFromN((2 * P0) / (KB * T0), d, T0, M) / freqFromN(n0, d, T0, M) - 2) < 1e-12;
    // D：同数密度，甲的直径是乙的 2 倍
    const ratioD = lambdaFromN(n0, 2 * d) / lambdaFromN(n0, d);
    check(Math.abs(ratioD - 0.25) < 1e-12, 'p2 D：λ 甲/λ 乙 = 1/4');
    const optD = Math.abs(ratioD - 0.5) < 1e-12;
    // E：等压，300 K → 600 K
    const optE = lambdaFromP(P0, 600, d) > lambdaFromP(P0, T0, d);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（以 1e9 s⁻¹ 为单位）
    const T3 = 400;
    const P3 = 2.0e4;
    const d3 = 3.6e-10;
    const M3 = 0.032;
    const viaN = freqFromN(P3 / (KB * T3), d3, T3, M3);
    const viaP = vrmsFromMass(T3, M3) / lambdaFromP(P3, T3, d3);
    const p3 = agree(viaP, viaN, 'p3 碰撞频率', 1e-12) / 1e9;

    // p4：N 个分子，V₀ 任取
    const N = 1e22;
    const V0 = 1e-3;
    const Ti = 300;
    const Pi = (N * KB * Ti) / V0;
    const V1 = V0 / 4;
    const P1 = (N * KB * Ti) / V1; // 等温压缩
    const T2 = 600;
    const P2 = (N * KB * T2) / V1; // 等容加热
    check(Math.abs(P1 / Pi - 4) < 1e-12 && Math.abs(P2 / Pi - 8) < 1e-12, 'p4 压强依次是 1、4、8 倍');
    const lamI = lambdaFromP(Pi, Ti, d);
    const lamF = lambdaFromP(P2, T2, d);
    const tauI = lamI / vrmsFromMass(Ti, M);
    const tauF = lamF / vrmsFromMass(T2, M);
    const rLam = agree(lamF / lamI, 1 / 4, 'p4 λ 的倍数', 1e-12);
    const rTau = agree(tauF / tauI, 1 / (4 * Math.SQRT2), 'p4 τ 的倍数', 1e-12);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [rLam, rTau] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
