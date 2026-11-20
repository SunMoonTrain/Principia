// 独立验算 physics.thermal-physics.heat-conduction-diffusion 的 p1–p4（简单题、中等题）。
// 讲解里的式子：傅里叶定律 q = −κ·dT/dz；估算式 κ ≈ ⅓ρ·c_V·v_rms·λ = m·c_V·v_rms/(3√2·σ)，D ≈ ⅓v_rms·λ = v_rms·k_BT/(3√2·σ·p)，
// η ≈ ⅓ρ·v_rms·λ（气体的黏性）；ρ = (N/V)m，λ ≈ 1/(√2·σ·N/V) = k_BT/(√2·σ·p)，σ = πd²，v_rms = √(3RT/M) = √(3k_BT/m)，
// 单原子分子 C_{V,m} = 3R/2，c_V = C_{V,m}/M。
// 每题两套算法互相核对：p1 一是直接代傅里叶定律，二是把保温层分成 100 层、两面温度固定，按「相邻两层之间的热流 = κA·温差/层厚」
// 反复松弛到每层净吸热为零（雅可比迭代），再由最外面两层的温差算穿过的热流（顺带核对稳定以后温度沿厚度是直线）；
// p3、p4 一是由压强出发算 ρ = pM/(RT)、λ = k_BT/(√2σp)、v_rms，代 ⅓ρc_Vv_rmsλ、⅓v_rmsλ，二是用标度关系
// κ ∝ √T/(√M·d²)、D ∝ T^{3/2}/(p·√M·d²) 或第二种写法 m·c_V·v_rms/(3√2σ)。选择题用具体的数逐条核对。
// 常量取精确值：k_B = 1.380649e-23 J/K，N_A = 6.02214076e23 /mol，R = N_A·k_B（题面没给常量）。
// 另外核对讲解、例题里的数：例 1 的 c_V ≈ 3.12e3、κ ≈ 0.062、实测约是它的 2.5 倍、约是空气的 6 倍；
// 例 2 的 D ≈ 1.2e-5、t ≈ L²/D、约 9 天、1 cm 约十秒；空气核对的 c_V ≈ 7.2e2、ρD/η ≈ 1.3、κ/(c_Vη) ≈ 2.0；
// 「t ≈ L²/D」的数量级用随机游走的蒙特卡罗核对（步长 λ、每步 λ/v 的时间，z 方向方均位移和 ⅓vλ·t 同量级）。
// 难题、思考题提示和参考解答里写出的数也核对一遍（不和标准答案比对）：p5 用打靶法解 d/dz(κ(T)dT/dz) = 0 看中点温度；
// p6 把保温层分成 2 万层薄壳、按平板串联热阻求和；p7、p8 的估算数；p4 解答里的 3.2 倍、1/2.7、8.8。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.heat-conduction-diffusion.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen } from './physics.electromagnetism._es.ts';

const KB = 1.380649e-23;
const NA = 6.02214076e23;
const R = NA * KB;

const sigmaOf = (d: number): number => Math.PI * d * d;

/** 一种单原子（或给定 C_{V,m} 的）理想气体在 (T, p) 下的三个输运系数，按讲解的第一种写法、由压强出发算。 */
function transportFromPressure(p: number, T: number, M: number, d: number, cvm = 1.5 * R): { eta: number; kappa: number; D: number; rho: number; cV: number; lambda: number; vrms: number } {
  const rho = (p * M) / (R * T);
  const lambda = (KB * T) / (Math.SQRT2 * sigmaOf(d) * p);
  const m = M / NA;
  const vrms = Math.sqrt((3 * KB * T) / m);
  const cV = cvm / M;
  return {
    eta: (rho * vrms * lambda) / 3,
    kappa: (rho * cV * vrms * lambda) / 3,
    D: (vrms * lambda) / 3,
    rho,
    cV,
    lambda,
    vrms,
  };
}

/** 同上，由数密度出发（λ = 1/(√2σN/V)，ρ = (N/V)m）。 */
function transportFromDensity(n: number, T: number, M: number, d: number, cvm = 1.5 * R): { eta: number; kappa: number; D: number } {
  const m = M / NA;
  const rho = n * m;
  const lambda = 1 / (Math.SQRT2 * sigmaOf(d) * n);
  const vrms = Math.sqrt((3 * R * T) / M);
  const cV = cvm / M;
  return { eta: (rho * vrms * lambda) / 3, kappa: (rho * cV * vrms * lambda) / 3, D: (vrms * lambda) / 3 };
}

/** 第二种写法：κ ≈ m·c_V·v_rms/(3√2·σ)（单原子 m·c_V = 3k_B/2）。 */
function kappaFromMass(T: number, M: number, d: number): number {
  const m = M / NA;
  const cV = (1.5 * R) / M;
  const vrms = Math.sqrt((3 * R * T) / M);
  return (m * cV * vrms) / (3 * Math.SQRT2 * sigmaOf(d));
}

/**
 * 保温层分成 n 层（层厚 h/n），两面温度固定为 T0、T1；每层和上下两层之间按 κA·温差/层厚交换热量。
 * 从中间各层都等于 T0 开始反复让每层的净吸热趋于零（雅可比迭代），稳定后返回穿过最外面一层的热流和温度偏离直线的最大值。
 */
function relaxedHeatFlow(kappa: number, A: number, T0: number, T1: number, h: number, n: number): { power: number; maxDev: number } {
  const dz = h / n;
  let T = new Array<number>(n + 1).fill(T0);
  T[n] = T1;
  for (let iter = 0; iter < 200_000; iter++) {
    const next = T.slice();
    let change = 0;
    for (let i = 1; i < n; i++) {
      next[i] = (T[i - 1] + T[i + 1]) / 2;
      change = Math.max(change, Math.abs(next[i] - T[i]));
    }
    T = next;
    if (change < 1e-14) break;
  }
  let maxDev = 0;
  for (let i = 0; i <= n; i++) maxDev = Math.max(maxDev, Math.abs(T[i] - (T0 + ((T1 - T0) * i) / n)));
  // 外面一层流向紧贴它的那一层（再流进冰箱）的热流
  return { power: (kappa * A * (T[n] - T[n - 1])) / dz, maxDev };
}

/** 量纲：[kg, m, s, K] 的指数。 */
type Dim = [number, number, number, number];
const mul = (a: Dim, b: Dim): Dim => [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];
const div = (a: Dim, b: Dim): Dim => [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]];
const KG: Dim = [1, 0, 0, 0];
const METER: Dim = [0, 1, 0, 0];
const SECOND: Dim = [0, 0, 1, 0];
const KELVIN: Dim = [0, 0, 0, 1];
const JOULE: Dim = div(mul(KG, mul(METER, METER)), mul(SECOND, SECOND));
const WATT: Dim = div(JOULE, SECOND);

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

/**
 * 三维随机游走：每步走 λ、方向各向同性，走 steps 步；返回 z 方向的方均位移 ⟨z²⟩ 与 steps·λ² 之比（理论值 ⅓）。
 * 由此 ⟨z²⟩ = ⅓λ²·(t/τ) = ⅓vλ·t（τ = λ/v）。一维扩散 ⟨z²⟩ = 2Dt，这个步长固定的模型给出 D = ⅙vλ，
 * 和讲解的 ⅓vλ 只差一个 2 倍的系数（自由程按指数分布时 ⟨ℓ²⟩ = 2λ²，正好是 ⅓vλ），所以 t ≈ L²/D 作数量级估计是对的。
 */
function randomWalkZ2(walkers: number, steps: number, seed: number): number {
  const u = rng(seed);
  let sum = 0;
  for (let w = 0; w < walkers; w++) {
    let z = 0;
    for (let s = 0; s < steps; s++) z += 2 * u() - 1; // 各向同性时 cosθ 在 [−1, 1] 上均匀
    sum += z * z;
  }
  return sum / walkers / steps;
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.heat-conduction-diffusion',
  notes: {
    p1: 'P = κA·ΔT/h = 0.025 × 0.60 × (24 − 4)/0.050 W，乘 1 s（温差 20 °C 就是 20 K）；和 100 层保温层两面温度固定、松弛到稳定后由最外面两层的温差算出的热流核对（稳定后温度沿厚度是直线）。',
    p2: '逐条用具体的数：A 量纲 W/(m·K) = kg·m²·s⁻³/(m·K) = kg·m·s⁻³·K⁻¹（对）；B 氮气（M = 28 g/mol、d = 3.7e-10 m）300 K 下 N 不变、V 减半，N/V 变 2 倍，D = ⅓v_rmsλ 变为 1/2，不是 2 倍（错）；C 氮气、氩气 300 K 下压强取 1e5、5e4、2e3 Pa，ρD/η 都等于 1、不随压强变（对）；D 300 K 下氦（4.003）、氖（20.18）、氩（39.95 g/mol），κ/η = c_V = 3R/(2M) 各不相同（错）。',
    p3: '氩 M = 39.95 g/mol，d 任取 3.6e-10 m（再取 2.0e-10 m 核对结果和 d 无关）；由压强出发分别算 (300 K, 1.0e5 Pa)、(450 K, 5.0e4 Pa) 的 κ = ⅓ρc_Vv_rmsλ、D = ⅓v_rmsλ，求比值；和 κ ∝ √T 给出的 √1.5、D ∝ T^{3/2}/p 给出的 2·1.5^{3/2} 核对。',
    p4: '两种气体同温度（300 K，再取 500 K 核对和温度无关；各取不同压强 1e5、3e4 Pa 核对和压强无关），由压强出发算 κ = ⅓ρc_Vv_rmsλ（c_V = 3R/(2M)）求比值；和第二种写法 m·c_V·v_rms/(3√2πd²) 的比值、标度关系 √(M_Ar/M_He)·(d_Ar/d_He)² 核对。',
  },
  compute() {
    // ---- 讲解、例题里的数 ----
    // 例 1：300 K 氦，η = 2.0e-5 Pa·s，M = 4.003 g/mol
    const cVHe = (1.5 * R) / 0.004003;
    const kappaEx1 = cVHe * 2.0e-5;
    check(Math.abs(cVHe - 3.12e3) < 0.01e3, `例 1 c_V ≈ 3.12e3 J/(kg·K)（算得 ${cVHe}）`);
    check(Math.abs(kappaEx1 - 0.062) < 0.001, `例 1 κ ≈ 0.062 W/(m·K)（算得 ${kappaEx1}）`);
    check(Math.abs(0.155 / kappaEx1 - 2.5) < 0.05, `例 1 实测约是它的 2.5 倍（算得 ${0.155 / kappaEx1}）`);
    check(Math.abs(0.155 / 0.026 - 6) < 0.1, `例 1 氦约是空气的 6 倍（算得 ${0.155 / 0.026}）`);
    // 例 2：平均自由程例 1 的氮气（300 K、1.013e5 Pa、d = 3.7e-10 m），λ ≈ 6.71e-8 m、v_rms ≈ 517 m/s
    const n2 = transportFromPressure(1.013e5, 300, 0.028, 3.7e-10, 2.5 * R);
    // 平均自由程例 1 用取整后的 σ ≈ 4.30e-19、N/V ≈ 2.45e25 算得 6.71e-8，不取整是 6.72e-8
    check(Math.abs(n2.lambda - 6.71e-8) < 0.02e-8, `例 2 λ ≈ 6.71e-8 m（算得 ${n2.lambda}）`);
    check(Math.abs(n2.vrms - 517) < 0.5, `例 2 v_rms ≈ 517 m/s（算得 ${n2.vrms}）`);
    const Dex2 = (517 * 6.71e-8) / 3;
    check(Math.abs(Dex2 - 1.2e-5) < 0.05e-5, `例 2 D ≈ 1.2e-5 m²/s（算得 ${Dex2}）`);
    // 例 2 的时间：用未取整的 D（1.156e-5）得 7.78e5 s ≈ 9.0 天；讲解写的 7.5e5 s 是用取整后的 1.2e-5 算的（8.7 天），都约 9 天
    const tEx2 = 3.0 ** 2 / Dex2;
    const tEx2Rounded = 3.0 ** 2 / 1.2e-5;
    check(Math.abs(tEx2 - 7.8e5) < 0.05e5, `例 2 t ≈ 7.8e5 s（算得 ${tEx2}）`);
    check(Math.abs(tEx2Rounded / 86400 - 9) < 0.5 && Math.abs(tEx2 / 86400 - 9) < 0.5, '例 2 约 9 天');
    const t1cm = 0.01 ** 2 / Dex2;
    check(t1cm > 5 && t1cm < 15, `例 2 走 1 cm 十秒左右（算得 ${t1cm} s）`);
    // 空气核对：ρ ≈ 1.2、η ≈ 1.8e-5、κ ≈ 0.026、D ≈ 2e-5，C_{V,m} = 20.8、M = 29 g/mol
    const cVAir = 20.8 / 0.029;
    check(Math.abs(cVAir - 7.2e2) < 0.05e2, `空气 c_V ≈ 7.2e2（算得 ${cVAir}）`);
    check(Math.abs((1.2 * 2e-5) / 1.8e-5 - 1.3) < 0.05, `空气 ρD/η ≈ 1.3（算得 ${(1.2 * 2e-5) / 1.8e-5}）`);
    check(Math.abs(0.026 / (cVAir * 1.8e-5) - 2.0) < 0.05, `空气 κ/(c_Vη) ≈ 2.0（算得 ${0.026 / (cVAir * 1.8e-5)}）`);
    // 20 °C、101325 Pa 空气的密度约 1.2
    const rhoAir = (101325 * 0.029) / (R * 293.15);
    check(Math.abs(rhoAir - 1.2) < 0.03, `空气 ρ ≈ 1.2 kg/m³（算得 ${rhoAir}）`);
    // 估算式两两相除：η = ρD、κ = c_Vη，两种出发点一致
    const ar = transportFromPressure(1e5, 300, 0.03995, 3.6e-10);
    const arN = transportFromDensity(1e5 / (KB * 300), 300, 0.03995, 3.6e-10);
    agree(arN.kappa, ar.kappa, '两种出发点的 κ', 1e-12);
    agree(arN.D, ar.D, '两种出发点的 D', 1e-12);
    agree(ar.rho * ar.D, ar.eta, 'η = ρD', 1e-12);
    agree(ar.cV * ar.eta, ar.kappa, 'κ = c_Vη', 1e-12);
    agree(kappaFromMass(300, 0.03995, 3.6e-10), ar.kappa, 'κ 的第二种写法', 1e-12);
    agree(ar.D, (ar.vrms * KB * 300) / (3 * Math.SQRT2 * sigmaOf(3.6e-10) * 1e5), 'D 的第二种写法', 1e-12);
    // t ≈ L²/D 的量级：随机游走 ⟨z²⟩/(Nλ²) = ⅓
    const z2 = randomWalkZ2(4000, 400, 20261119);
    check(Math.abs(z2 - 1 / 3) < 0.02, `随机游走 ⟨z²⟩/(Nλ²) ≈ ⅓（算得 ${z2}）`);

    // ---- 难题、思考题提示和参考解答里的数（不比对标准答案，只核对写出的数）----
    // p5：κ = κ₀√(T/T₀)，T(0) = 300 K、T(h) = 600 K。打靶：dT/dz = −q/κ(T) 用 RK4 积分，二分 q 使 T(h) = 600，看中点温度。
    {
      const k0 = 1;
      const T0 = 300;
      const h = 1;
      const kap = (T: number): number => k0 * Math.sqrt(T / T0);
      const shoot = (q: number, zEnd: number): number => {
        const n = 4000;
        const dz = zEnd / n;
        let T = 300;
        const f = (t: number): number => -q / kap(t);
        for (let i = 0; i < n; i++) {
          const a = f(T);
          const b = f(T + (dz * a) / 2);
          const c = f(T + (dz * b) / 2);
          const d = f(T + dz * c);
          T += (dz * (a + 2 * b + 2 * c + d)) / 6;
        }
        return T;
      };
      let lo = -2000;
      let hi = 0;
      for (let k = 0; k < 200; k++) {
        const mid = (lo + hi) / 2;
        if (shoot(mid, h) > 600) lo = mid;
        else hi = mid;
      }
      const q = (lo + hi) / 2;
      const qFormula = (-2 * k0 * (600 ** 1.5 - 300 ** 1.5)) / (3 * Math.sqrt(T0) * h);
      agree(q, qFormula, 'p5 q 的公式', 1e-8);
      const tMid = shoot(q, h / 2);
      const tMidFormula = ((300 ** 1.5 + 600 ** 1.5) / 2) ** (2 / 3);
      agree(tMid, tMidFormula, 'p5 中点温度', 1e-8);
      check(Math.abs((300 ** 1.5 + 600 ** 1.5) / 2 - 9.95e3) < 0.01e3, 'p5 T^{3/2} ≈ 9.95e3');
      check(Math.abs(tMidFormula - 462.5) < 0.05, `p5 中点约 462.5 K（算得 ${tMidFormula}）`);
    }
    // p6：圆筒保温层，分成很多薄壳，每层按平板算热阻 Δr/(κ·2πr_中L)，串联求和，和 ln(r₂/r₁)/(2πκL) 核对。
    {
      const shellPhi = (kappa: number, r1: number, r2: number, dT: number, n: number): number => {
        let res = 0;
        const dr = (r2 - r1) / n;
        for (let i = 0; i < n; i++) res += dr / (kappa * 2 * Math.PI * (r1 + (i + 0.5) * dr));
        return dT / res;
      };
      const logPhi = (kappa: number, r1: number, r2: number, dT: number): number => (2 * Math.PI * kappa * dT) / Math.log(r2 / r1);
      for (const [r2, want] of [
        [0.08, 53.5],
        [0.11, 31.9],
        [0.14, 24.4],
      ] as const) {
        const phi = agree(shellPhi(0.04, 0.05, r2, 100, 20000), logPhi(0.04, 0.05, r2, 100), `p6 r₂ = ${r2} 的每米散热`, 1e-6);
        check(Math.abs(phi - want) < 0.05, `p6 r₂ = ${r2} m 时约 ${want} W/m（算得 ${phi}）`);
      }
      // 薄层极限：r₂ = r₁(1 + 1e-4) 时和平板公式一致
      const r1 = 0.05;
      const r2 = r1 * (1 + 1e-4);
      check(Math.abs(logPhi(0.04, r1, r2, 100) / ((0.04 * 2 * Math.PI * r1 * 100) / (r2 - r1)) - 1) < 1e-4, 'p6 薄层时回到平板公式');
    }
    // p7：抽到 1/100 时 λ；λ 等于夹层厚 5 mm 时的压强；氩与空气的热导率之比
    {
      const lam100 = 6.7e-8 * 100;
      check(Math.abs(lam100 / 5e-3 - 1e-3) < 0.5e-3, `p7 λ 约是夹层厚度的千分之一（算得 ${lam100 / 5e-3}）`);
      const pGap = (1.013e5 * 6.7e-8) / 5e-3;
      check(Math.abs(pGap - 1.4) < 0.05, `p7 约 1.4 Pa（算得 ${pGap}）`);
      const ratio = (3 / 5) * Math.sqrt(29 / 40);
      check(Math.abs(Math.sqrt(29 / 40) - 0.85) < 0.005 && Math.abs(ratio - 0.51) < 0.005, `p7 粗估 0.51（算得 ${ratio}）`);
      check(Math.abs(0.0177 / 0.026 - 0.68) < 0.005, `p7 实测 0.68（算得 ${0.0177 / 0.026}）`);
    }
    // p8：硬球的查普曼-恩斯库格一级近似 ρD/η = 6/5；欧肯修正 2.5×0.6 + 1.3×0.4 ≈ 2.0；水的 ρD/η
    {
      const m = 0.028 / NA;
      const T = 300;
      const n = 1e5 / (KB * T);
      const d = 3.7e-10;
      const etaCE = (5 / (16 * d * d)) * Math.sqrt((m * KB * T) / Math.PI);
      const dCE = (3 / (8 * n * d * d)) * Math.sqrt((KB * T) / (Math.PI * m));
      agree((n * m * dCE) / etaCE, 6 / 5, 'p8 硬球 ρD/η', 1e-12);
      check(Math.abs(2.5 * 0.6 + 1.3 * 0.4 - 2.0) < 0.05, 'p8 欧肯修正约 2.0');
      check(Math.abs((998 * 2.0e-9) / 1.0e-3 - 2e-3) < 0.1e-3, 'p8 水的 ρD/η ≈ 2e-3');
    }
    // p4 解答里的数：方均根速率约 3.2 倍，截面约 1/2.7，实测比约 8.8
    check(Math.abs(Math.sqrt(39.95 / 4.003) - 3.2) < 0.05, 'p4 v_rms 约 3.2 倍');
    check(Math.abs((3.6 / 2.2) ** 2 - 2.7) < 0.05, 'p4 截面约 1/2.7');
    check(Math.abs(0.155 / 0.0177 - 8.8) < 0.05, `p4 实测约 8.8（算得 ${0.155 / 0.0177}）`);

    // ---- p1（J）----
    const relaxed = relaxedHeatFlow(0.025, 0.6, 4, 24, 0.05, 100);
    check(relaxed.maxDev < 1e-9, `p1 稳定后温度沿厚度是直线（偏离 ${relaxed.maxDev}）`);
    const p1 = agree(relaxed.power * 1, ((0.025 * 0.6 * (24 - 4)) / 0.05) * 1, 'p1 每秒传进的热量', 1e-9);

    // ---- p2 ----
    // A：量纲
    const optA = JSON.stringify(div(WATT, mul(METER, KELVIN))) === JSON.stringify(div(mul(KG, METER), mul(mul(SECOND, mul(SECOND, SECOND)), KELVIN)));
    // B：温度不变，N 不变、V 减半
    const nB = 1e5 / (KB * 300);
    const ratioB = transportFromDensity(2 * nB, 300, 0.028, 3.7e-10, 2.5 * R).D / transportFromDensity(nB, 300, 0.028, 3.7e-10, 2.5 * R).D;
    check(Math.abs(ratioB - 0.5) < 1e-12, 'p2 B：D 变为 1/2');
    agree(transportFromPressure(2e5, 300, 0.028, 3.7e-10).D / transportFromPressure(1e5, 300, 0.028, 3.7e-10).D, ratioB, 'p2 B 由压强出发', 1e-12);
    const optB = Math.abs(ratioB - 2) < 1e-12;
    // C：ρD/η 随压强不变
    const rdOverEta = (p: number, M: number, d: number): number => {
      const t = transportFromPressure(p, 300, M, d);
      return (t.rho * t.D) / t.eta;
    };
    const cVals = [1e5, 5e4, 2e3].flatMap((p) => [rdOverEta(p, 0.028, 3.7e-10), rdOverEta(p, 0.03995, 3.6e-10)]);
    const optC = cVals.every((x) => Math.abs(x - cVals[0]) < 1e-12);
    // D：单原子气体的 κ/η
    const kOverEta = (M: number, d: number): number => {
      const t = transportFromPressure(1e5, 300, M, d);
      return t.kappa / t.eta;
    };
    const dVals = [kOverEta(0.004003, 2.2e-10), kOverEta(0.02018, 2.6e-10), kOverEta(0.03995, 3.6e-10)];
    check(Math.abs(dVals[0] / dVals[2] - 39.95 / 4.003) < 1e-9, 'p2 D：κ/η = c_V ∝ 1/M');
    const optD = dVals.every((x) => Math.abs(x - dVals[0]) < 1e-12 * dVals[0]);
    const p2 = chosen([optA, optB, optC, optD]);

    // ---- p3 ----
    const ar1 = transportFromPressure(1.0e5, 300, 0.03995, 3.6e-10);
    const ar2 = transportFromPressure(5.0e4, 450, 0.03995, 3.6e-10);
    const ar1b = transportFromPressure(1.0e5, 300, 0.03995, 2.0e-10);
    const ar2b = transportFromPressure(5.0e4, 450, 0.03995, 2.0e-10);
    agree(ar2b.kappa / ar1b.kappa, ar2.kappa / ar1.kappa, 'p3 κ 的倍数和 d 无关', 1e-12);
    agree(ar2b.D / ar1b.D, ar2.D / ar1.D, 'p3 D 的倍数和 d 无关', 1e-12);
    const p3k = agree(ar2.kappa / ar1.kappa, Math.sqrt(450 / 300), 'p3 热导率的倍数', 1e-12);
    const p3d = agree(ar2.D / ar1.D, (450 / 300) ** 1.5 * (1.0e5 / 5.0e4), 'p3 扩散系数的倍数', 1e-12);

    // ---- p4 ----
    const he = transportFromPressure(1e5, 300, 0.004003, 2.2e-10);
    const arg = transportFromPressure(3e4, 300, 0.03995, 3.6e-10);
    const he500 = transportFromPressure(2e5, 500, 0.004003, 2.2e-10);
    const ar500 = transportFromPressure(1e5, 500, 0.03995, 3.6e-10);
    agree(he500.kappa / ar500.kappa, he.kappa / arg.kappa, 'p4 比值和温度、压强无关', 1e-12);
    agree(kappaFromMass(300, 0.004003, 2.2e-10) / kappaFromMass(300, 0.03995, 3.6e-10), he.kappa / arg.kappa, 'p4 第二种写法', 1e-12);
    const p4 = agree(he.kappa / arg.kappa, Math.sqrt(39.95 / 4.003) * (3.6 / 2.2) ** 2, 'p4 氦与氩热导率之比', 1e-12);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [p3k, p3d] },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
