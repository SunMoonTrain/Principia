// 独立验算 physics.oscillations-waves.gas-sound-speed 的 p1–p4（简单题、中等题）。
// 两套算法：一是闭式（理想气体 v = sqrt(γRT/M)，准静态绝热时 T ∝ p^((γ−1)/γ)）；
// 二是不用这些闭式：每摩尔气体从 (T0, V0) 出发，把准静态绝热过程的热力学第一定律 C_{V,m} dT = −p dV（p = RT/V，
// C_{V,m} = R/(γ − 1)）交给四阶龙格-库塔法一步步积分得到 p(V)，对积出的 p(V) 做中心差分（再做理查森外推）得到
// 绝热体积模量 K = −V dp/dV，密度 ρ = M/V0，声速取 sqrt(K/ρ)（sound-waves 的结论）；等温的 K 同样对 p = RT/V 差分。
// p1 另做一次动力学模拟：一维气柱切成厚 1 mm 的薄层（4001 个结点、两端固定），层间气体按准静态绝热 p ∝ ℓ^(−γ)
// （先在几个点上和 RK4 积出的绝热线核对），蛙跳法积分，初始放一个高斯形的小位移，量往右走的那一半（ξ² 加权的重心）
// 在 1.5 ms 和 5 ms 之间走了多远，得到声速；离散链的色散让它比连续介质小约 1e-4，核对时容差取 1e-3。
// 题面给了 R = 8.314 J/(mol·K) 的按题面算；p2 没给，只比比值，R 取 8.314，结论和 R 无关。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.gas-sound-speed.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, rk4 } from './physics.oscillations-waves._ow.ts';

const R = 8.314;
const P_ATM = 101325;

/** 每摩尔理想气体沿准静态绝热过程，从 (T0, V0) 积到 V：dT/dV = −(R/C_{V,m})·T/V = −(γ − 1)·T/V。只用第一定律和状态方程。 */
function adiabatT(gamma: number, T0: number, V0: number, V: number, steps = 2000): number {
  return rk4((VV, y) => [(-(gamma - 1) * y[0]) / VV], [T0], V0, V, steps)[0];
}

/** 对 p(V) 在 V0 处做中心差分，步长 h、h/2 两次再理查森外推，返回 −V0·dp/dV。 */
function modulusFrom(p: (V: number) => number, V0: number): number {
  const d = (h: number) => (p(V0 + h) - p(V0 - h)) / (2 * h);
  const h = 1e-3 * V0;
  return -V0 * ((4 * d(h / 2) - d(h)) / 3);
}

/** 1 mol 理想气体在 (T0, p0) 时的绝热体积模量（对 RK4 积出的绝热线差分）。 */
function kAdiabatic(gamma: number, T0: number, p0 = P_ATM): number {
  const V0 = (R * T0) / p0;
  return modulusFrom((V) => (R * adiabatT(gamma, T0, V0, V)) / V, V0);
}

/** 1 mol 理想气体在 (T0, p0) 时的等温体积模量（对 p = RT0/V 差分）。 */
function kIsothermal(T0: number, p0 = P_ATM): number {
  const V0 = (R * T0) / p0;
  return modulusFrom((V) => (R * T0) / V, V0);
}

/** 第二套算法的声速：sqrt(K/ρ)，ρ = M/V0（1 mol 占体积 V0）。 */
function speedNumeric(gamma: number, M: number, T0: number, p0 = P_ATM, isothermal = false): number {
  const V0 = (R * T0) / p0;
  const K = isothermal ? kIsothermal(T0, p0) : kAdiabatic(gamma, T0, p0);
  return Math.sqrt(K / (M / V0));
}

/** 闭式声速。 */
const speedClosed = (gamma: number, M: number, T: number) => Math.sqrt((gamma * R * T) / M);

/**
 * 一维气柱的薄层链：结点 j 在 x_j = j·a，质量 ρ0·a（截面积取 1），相邻结点之间的气体按准静态绝热 p = p0·(a/ℓ)^γ；
 * 结点受力 p_{j−1} − p_j，两端固定。初始位移 A·exp(−((x − x0)/w)²)、速度为零，分成左右两个脉冲；
 * 返回右行脉冲（只看 x > x0 + 0.1 m 的结点）ξ² 加权的重心在 t1、t2 之间的平均速度。
 */
function chainPulseSpeed(gamma: number, M: number, T0: number, p0 = P_ATM): number {
  const rho0 = (p0 * M) / (R * T0);
  const a = 1e-3;
  const N = 4001;
  const x0 = 1.5;
  const w = 0.04;
  const A = 1e-7;
  const m = rho0 * a;
  const dt = 1e-6;
  const t1 = 1.5e-3;
  const t2 = 5e-3;
  const xi = new Float64Array(N);
  const u = new Float64Array(N);
  const F = new Float64Array(N);
  for (let j = 0; j < N; j++) xi[j] = A * Math.exp(-(((j * a - x0) / w) ** 2));
  xi[0] = 0;
  xi[N - 1] = 0;
  const forces = () => {
    let pPrev = p0 * (a / (a + xi[1] - xi[0])) ** gamma;
    for (let j = 1; j < N - 1; j++) {
      const pNext = p0 * (a / (a + xi[j + 1] - xi[j])) ** gamma;
      F[j] = pPrev - pNext;
      pPrev = pNext;
    }
  };
  const centroid = () => {
    let s = 0;
    let sx = 0;
    for (let j = 0; j < N; j++) {
      const x = j * a;
      if (x <= x0 + 0.1) continue;
      s += xi[j] * xi[j];
      sx += x * xi[j] * xi[j];
    }
    return sx / s;
  };
  forces();
  let t = 0;
  let c1 = Number.NaN;
  const n1 = Math.round(t1 / dt);
  const n2 = Math.round(t2 / dt);
  for (let step = 1; step <= n2; step++) {
    for (let j = 1; j < N - 1; j++) u[j] += (0.5 * dt * F[j]) / m;
    for (let j = 1; j < N - 1; j++) xi[j] += dt * u[j];
    forces();
    for (let j = 1; j < N - 1; j++) u[j] += (0.5 * dt * F[j]) / m;
    t = step * dt;
    if (step === n1) c1 = centroid();
  }
  const c2 = centroid();
  return (c2 - c1) / (t - n1 * dt);
}

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.gas-sound-speed',
  notes: {
    p1: 'v = sqrt(1.29 × 8.314 × 293.15 / 0.0440) ≈ 267.3 m/s。第二套：RK4 积出 CO₂（γ = 1.29）的绝热线、差分得 K，sqrt(K/ρ)，在 1 atm 和 2×10⁵ Pa 两种压强下算（和压强无关）；再在 1 atm 下模拟 1 mm 厚的薄层链，量高斯脉冲的速度（容差 1e-3）。',
    p2: '逐条用第二套算法（RK4 绝热线差分出的 K，sqrt(K/ρ)）量：A 氢气、氧气在 250 K、300 K、400 K 时声速之比都是 4.029，约 4 倍（对，偏离 4 不到 1%）；B 空气（γ = 1.40）从 300 K、1 atm 准静态绝热压缩到一半体积，RK4 积出末温 395.9 K、末压强 2.64 atm，末态声速是原来的 1.149 倍（错）；C 单原子（γ = 5/3）在 300 K、1 atm 下等温 K 和绝热 K 差分出的声速之比 0.7746 = sqrt(3/5)，另在 200 K、5×10⁴ Pa 下同样（对）；D 定容加热 300 K → 400 K，ρ 不变、p 变为 4/3 倍，声速变为 1.155 倍（错）；E 摄氏温度 10 → 20、20 → 40、100 → 200 °C（按 273.15 换算）时声速之比 1.018、1.034、1.122，都不是 1.414（错；一般要 273.15 + 2t = 2(273.15 + t)，不可能）。',
    p3: 'M = γRT/v² = (5/3) × 8.314 × 293.15 / 319² ≈ 39.92 g/mol。第二套：对第二套声速（γ = 5/3、293.15 K、1 atm）关于 M 二分，使它等于 319 m/s。',
    p4: '准静态绝热：dT/dp = ((γ − 1)/γ)·T/p（由第一定律 C_{V,m} dT = −p dV 和 pV = RT 消去 dV 得 (C_{V,m} + R) dT = RT dp/p），ΔT ≈ 293.15 × (0.4/1.4) × 1.0/101300 ≈ 0.8268 mK。第二套：以 p 为自变量把这条第一定律 RK4 积到 p0 ± 1.0 Pa，取 (T₊ − T₋)/2；另以 V 为自变量积 dT/dV = −(γ − 1)T/V，二分出压强为 p0 ± 1.0 Pa 时的体积和温度，两者一致。',
  },
  compute() {
    // 先核对：RK4 积出的绝热线就是 pV^γ 不变（链里用的 p ∝ ℓ^(−γ)）
    for (const g of [1.29, 1.4, 5 / 3]) {
      const T0 = 300;
      const V0 = (R * T0) / P_ATM;
      for (const k of [0.97, 0.999, 1.001, 1.05]) {
        const p = (R * adiabatT(g, T0, V0, k * V0)) / (k * V0);
        agree(p, P_ATM * k ** -g, `绝热线 p ∝ V^(−γ)（γ = ${g}，V = ${k}V0）`, 1e-10);
      }
    }

    // p1（m/s）
    const T20 = 273.15 + 20;
    const p1Closed = speedClosed(1.29, 0.044, T20);
    agree(speedNumeric(1.29, 0.044, T20), p1Closed, 'p1 RK4 绝热线差分（1 atm）', 1e-9);
    agree(speedNumeric(1.29, 0.044, T20, 2e5), p1Closed, 'p1 RK4 绝热线差分（2×10⁵ Pa）', 1e-9);
    const vChain = chainPulseSpeed(1.29, 0.044, T20);
    agree(vChain, p1Closed, 'p1 薄层链里脉冲的速度', 1e-3);
    const p1 = p1Closed;

    // p2
    // A：同温下氢气、氧气声速之比约 4
    const ratiosA = [250, 300, 400].map((T) => speedNumeric(1.41, 0.002, T) / speedNumeric(1.39, 0.032, T));
    ratiosA.forEach((r) => agree(r, Math.sqrt((1.41 / 1.39) * (32 / 2)), 'p2 A 声速之比', 1e-9));
    const optA = ratiosA.every((r) => Math.abs(r / 4 - 1) < 0.01);
    // B：准静态绝热压缩到一半体积以后声速不变？
    const VB = (R * 300) / P_ATM;
    const TB = adiabatT(1.4, 300, VB, VB / 2);
    const pB = (R * TB) / (VB / 2);
    const vBefore = speedNumeric(1.4, 0.029, 300, P_ATM);
    const vAfter = speedNumeric(1.4, 0.029, TB, pB);
    agree(vAfter / vBefore, 2 ** 0.2, 'p2 B 压缩后声速之比', 1e-9);
    check(Math.abs(TB - 300 * 2 ** 0.4) < 1e-6 && Math.abs(pB / P_ATM - 2 ** 1.4) < 1e-9, 'p2 B 末态 T、p');
    const optB = Math.abs(vAfter / vBefore - 1) < 1e-6;
    // C：单原子气体，等温算出的声速是实际（绝热）的 sqrt(3/5) 倍？
    const ratiosC = [
      [300, P_ATM],
      [200, 5e4],
    ].map(([T, p]) => speedNumeric(5 / 3, 0.004, T, p, true) / speedNumeric(5 / 3, 0.004, T, p));
    const optC = ratiosC.every((r) => Math.abs(r - Math.sqrt(3 / 5)) < 1e-9);
    // D：定容加热，声速不变？体积不变 → ρ 不变，p ∝ T
    const vD1 = speedNumeric(1.4, 0.029, 300, P_ATM);
    const vD2 = speedNumeric(1.4, 0.029, 400, (P_ATM * 400) / 300);
    agree(vD2 / vD1, Math.sqrt(4 / 3), 'p2 D 定容加热后声速之比', 1e-9);
    const optD = Math.abs(vD2 / vD1 - 1) < 1e-6;
    // E：摄氏温度加倍，声速变为 sqrt2 倍？
    const ratiosE = [
      [10, 20],
      [20, 40],
      [100, 200],
    ].map(([c1, c2]) => speedNumeric(1.4, 0.029, 273.15 + c2) / speedNumeric(1.4, 0.029, 273.15 + c1));
    const optE = ratiosE.every((r) => Math.abs(r - Math.SQRT2) < 1e-3);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（g/mol）
    const p3Closed = ((5 / 3) * R * T20) / 319 ** 2 * 1000;
    const p3Num = bisect((M) => speedNumeric(5 / 3, M, T20) - 319, 0.005, 0.2) * 1000;
    const p3 = agree(p3Num, p3Closed, 'p3 二分摩尔质量', 1e-9);

    // p4（mK）
    const p0 = 1.013e5;
    const dp = 1.0;
    const g4 = 1.4;
    const p4Closed = T20 * ((g4 - 1) / g4) * (dp / p0) * 1000;
    // 第二套 (1)：以 p 为自变量积第一定律 (C_{V,m} + R) dT = RT dp/p
    const cv = R / (g4 - 1);
    const Tp = (p: number) => rk4((pp, y) => [(R * y[0]) / ((cv + R) * pp)], [T20], p0, p, 200)[0];
    const amp1 = ((Tp(p0 + dp) - Tp(p0 - dp)) / 2) * 1000;
    // 第二套 (2)：以 V 为自变量积 dT/dV = −(γ − 1)T/V，二分出压强为 p0 ± dp 时的状态
    const V4 = (R * T20) / p0;
    const pOfV = (V: number) => (R * adiabatT(g4, T20, V4, V, 200)) / V;
    const Vplus = bisect((V) => pOfV(V) - (p0 + dp), 0.99 * V4, V4);
    const Vminus = bisect((V) => pOfV(V) - (p0 - dp), V4, 1.01 * V4);
    const amp2 = ((adiabatT(g4, T20, V4, Vplus, 200) - adiabatT(g4, T20, V4, Vminus, 200)) / 2) * 1000;
    agree(amp1, p4Closed, 'p4 以 p 为自变量积第一定律', 1e-6);
    agree(amp2, p4Closed, 'p4 以 V 为自变量积、二分压强', 1e-6);
    const p4 = p4Closed;

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
