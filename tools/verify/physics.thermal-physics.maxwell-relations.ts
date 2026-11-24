// 独立验算 physics.thermal-physics.maxwell-relations 的 p1–p4（简单题、中等题）。
// 题面的数（α、κ_T、V、摩尔体积、温度换算 273.15、1 标准大气压 101325 Pa）全照题面的值；题里用不到 R，只有检验例子里用。
// 算法一（闭式）：p1 用 α/κ_T，p3 用 ΔS = −∫αV dp、Q = TΔS，p4（第 1 轮修订换的题）用 αΔT/κ_T 和 (C_p − TVα²/κ_T)ΔT。
// 算法二（不用麦克斯韦关系、不用三个偏导数的循环关系，也不用 C_p − C_V 的一般式）：
//   造几种只给亥姆霍兹自由能 F(T, V) 的物质，压强、熵、内能全部由 F 数值求导（p = −∂F/∂V，S = −∂F/∂T，U = F + TS），
//   体积由 p(T, V) = p 数值解出，偏导数一律用五点差分，热量按第一定律 δQ = dU + p dV 一小步一小步累加：
//   理想气体（C_V = 3nR/2、5nR/2）、范德瓦耳斯气体（氩的 a、b，同样两种 C_V）、
//   「α、κ_T 都是常数」的凝聚体 V = V0·exp[α(T − T0) − κ_T(p − p0)]（水银、水、铜各一套数，C_V 另取随温度变的）。
//   p1 末尾另拿循环关系核对一次；p3 另拿真实的水（IAPWS-IF97 区域 1）看「当作不变」差多少，标准答案仍按题面算。
// 选择题逐条在上面这些物质和一个液膜模型上量（例子写在 notes 里）。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.maxwell-relations.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen } from './physics.electromagnetism._es.ts';

const R = 6.022_140_76e23 * 1.380_649e-23; // J/(mol·K)

/** 五点差分。 */
const d5 = (f: (x: number) => number, x: number, h: number): number =>
  (f(x - 2 * h) - 8 * f(x - h) + 8 * f(x + h) - f(x + 2 * h)) / (12 * h);

/** 一种物质：只给亥姆霍兹自由能 F(T, V)，另给解体积时的搜索范围和差分步长。 */
interface Matter {
  name: string;
  F: (T: number, V: number) => number;
  Vrange: [number, number];
  hT: number;
  hV: number;
}

const pressure = (m: Matter, T: number, V: number): number => -d5((v) => m.F(T, v), V, m.hV);
const entropy = (m: Matter, T: number, V: number): number => -d5((t) => m.F(t, V), T, m.hT);
const energy = (m: Matter, T: number, V: number): number => m.F(T, V) + T * entropy(m, T, V);
/** 给定 T、p 解体积（p 随 V 单调下降的那一段）。 */
const volume = (m: Matter, T: number, p: number): number => bisect((v) => pressure(m, T, v) - p, m.Vrange[0], m.Vrange[1]);

/** C_V = (∂U/∂T)_V、C_p = (∂H/∂T)_p，都由能量求，不用熵。 */
const cv = (m: Matter, T: number, V: number, h: number): number => d5((t) => energy(m, t, V), T, h);
const cp = (m: Matter, T: number, p: number, h: number): number =>
  d5(
    (t) => {
      const v = volume(m, t, p);
      return energy(m, t, v) + p * v;
    },
    T,
    h,
  );

/** 理想气体：c = C_V/(nR)。 */
const idealGas = (n: number, c: number): Matter => ({
  name: `理想气体（C_V = ${c}nR）`,
  F: (T, V) => -n * R * T * Math.log(V) - c * n * R * T * Math.log(T) + c * n * R * T,
  Vrange: [1e-4, 1],
  hT: 0.05,
  hV: 2e-6,
});

/** 范德瓦耳斯气体（氩的 a、b）。 */
const vdw = (n: number, c: number): Matter => {
  const a = 0.1355;
  const b = 3.2e-5;
  return {
    name: `范德瓦耳斯气体（C_V = ${c}nR）`,
    F: (T, V) => -n * R * T * Math.log(V - n * b) - (a * n * n) / V - c * n * R * T * Math.log(T) + c * n * R * T,
    Vrange: [5e-4, 1],
    hT: 0.05,
    hV: 2e-6,
  };
};

/**
 * α、κ_T 都是常数的凝聚体：p = p0 + [α(T − T0) − ln(V/V0)]/κ，F = −∫p dV + f(T)。
 * f 取 C_V = −T f″ = c0·T/(T + 100)（随温度变），f = −∫∫(C_V/T) 的解析式：f′ = −c0 ln(T + 100)。
 */
const condensed = (name: string, alpha: number, kappa: number, V0: number, T0: number, p0: number, c0: number): Matter => ({
  name,
  F: (T, V) => {
    const x = V / V0;
    const elastic = (V0 / kappa) * (x * Math.log(x) - x + 1) - ((alpha * (T - T0)) / kappa) * (V - V0) - p0 * (V - V0);
    const thermal = -c0 * ((T + 100) * Math.log((T + 100) / (T0 + 100)) - (T - T0));
    return elastic + thermal;
  },
  Vrange: [V0 * 0.9, V0 * 1.1],
  hT: 0.05,
  hV: V0 * 1e-4,
});

/** 和 condensed 一样，只是 C_V 取常数 c：f = −c[T ln(T/T0) − T + T0]。p4 的「上面这些量都当作不变」用它。 */
const condensedConstCv = (name: string, alpha: number, kappa: number, V0: number, T0: number, p0: number, c: number): Matter => ({
  ...condensed(name, alpha, kappa, V0, T0, p0, 0),
  F: (T, V) => {
    const x = V / V0;
    const elastic = (V0 / kappa) * (x * Math.log(x) - x + 1) - ((alpha * (T - T0)) / kappa) * (V - V0) - p0 * (V - V0);
    return elastic - c * (T * Math.log(T / T0) - T + T0);
  },
});

/** 液膜：F(T, A) = ∫σ dA + f(T)，σ = σ0(1 − T/Tc)^1.2·(1 + k(T)·(A − A0))。 */
const film = (k: number) => {
  const sigma0 = 0.12;
  const Tc = 640;
  const A0 = 1e-2;
  const f = (T: number) => -0.02 * T * Math.log(T / 300);
  return {
    F: (T: number, A: number) => {
      const s = sigma0 * Math.pow(1 - T / Tc, 1.2);
      const kk = k * (1 + T / 1000);
      return f(T) + s * ((A - A0) + (kk * (A - A0) ** 2) / 2);
    },
    A0,
  };
};

/**
 * 真实的水：IAPWS-IF97 区域 1 的吉布斯自由能 γ(π, τ)（系数照公开的表），只用来看 p3 的「α 当作不变」离实际多远。
 * 先用公布的核对值（300 K、3 MPa 和 80 MPa）确认系数没抄错。
 */
const IF97_I = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 8, 8, 21, 23, 29, 30, 31, 32];
const IF97_J = [
  -2, -1, 0, 1, 2, 3, 4, 5, -9, -7, -1, 0, 1, 3, -3, 0, 1, 3, 17, -4, 0, 6, -5, -2, 10, -8, -11, -6, -29, -31, -38, -39, -40, -41,
];
const IF97_N = [
  0.146_329_712_131_67, -0.845_481_871_691_14, -0.375_636_036_720_40e1, 0.338_551_691_683_85e1, -0.957_919_633_878_72, 0.157_720_385_132_28,
  -0.166_164_171_995_01e-1, 0.812_146_299_835_68e-3, 0.283_190_801_238_04e-3, -0.607_063_015_658_74e-3, -0.189_900_682_184_19e-1,
  -0.325_297_487_705_05e-1, -0.218_417_171_754_14e-1, -0.528_383_579_699_30e-4, -0.471_843_210_732_67e-3, -0.300_017_807_930_26e-3,
  0.476_613_939_069_87e-4, -0.441_418_453_308_46e-5, -0.726_949_962_975_94e-15, -0.316_796_448_450_54e-4, -0.282_707_979_853_12e-5,
  -0.852_051_281_201_03e-9, -0.224_252_819_080_00e-5, -0.651_712_228_956_01e-6, -0.143_417_299_379_24e-12, -0.405_169_968_601_17e-6,
  -0.127_343_017_416_41e-8, -0.174_248_712_306_34e-9, -0.687_621_312_955_31e-18, 0.144_783_078_285_21e-19, 0.263_357_816_627_95e-22,
  -0.119_476_226_400_71e-22, 0.182_280_945_814_04e-23, -0.935_370_872_924_58e-25,
];
const waterGibbs = (T: number, p: number): number => {
  const a = 7.1 - p / 16.53e6;
  const b = 1386 / T - 1.222;
  return 461.526 * T * IF97_N.reduce((sum, n, k) => sum + n * a ** IF97_I[k] * b ** IF97_J[k], 0); // J/kg
};
const waterS = (T: number, p: number): number => -d5((t) => waterGibbs(t, p), T, 0.05);
const waterV = (T: number, p: number): number => d5((x) => waterGibbs(T, x), p, 2e4);

export const verification: Verification = {
  lesson: 'physics.thermal-physics.maxwell-relations',
  notes: {
    p1: 'α/κ_T = 1.81e-4 ÷ 4.0e-11 = 4.525e6 Pa/K。第二套：造「α、κ_T 为常数」的水银（V0 = 1e-4 m³，293.15 K、1 标准大气压），体积固定在 V0，由 F 数值求 p(T, V0)，温度升高 1 K，压强升高 4.525e6 Pa；另用线性的 V = V0[1 + αΔT − κΔp] 令 ΔV = 0 解 Δp，也一致。',
    p2: 'A：两个液膜模型（σ 只随温度变；σ 还随面积变），S = −∂F/∂T、σ = ∂F/∂A 数值求导，(∂S/∂A)_T + (∂σ/∂T)_A 在 10⁻⁶ 以内为零，且等温拉大面积时吸热 TΔS = ΔU − ∫σ dA（按第一定律逐步累加），对。B：理想气体、范德瓦耳斯气体、凝聚体上 (∂S/∂p)_T 都等于 −(∂V/∂T)_p，符号反了，例如 1 mol 理想气体 300 K、10⁵ Pa 是 −8.3145e-5 和 +8.3145e-5 m³/K，错。C：两种 C_V 的理想气体、两种 C_V 的范德瓦耳斯气体，p(T, V) 数值相同，C_V 差 nR；300 K 从 2.4e-2 等温到 4.8e-2 m³，ΔS 由「ΔU + ∫p dV 除以 T」算（内能、压强都由 F 求导），两种气体相同；对。D：理想气体 (∂V/∂T)_p(∂T/∂V)_S = −(γ − 1)，单原子 −2/3、双原子 −2/5（绝热线由 S(T, V) = 常数数值解出），错。E：理想气体三个偏导数各自数值求，乘积 −1.000000，对。选 A、C、E。',
    p3: '闭式 ΔS = −αVΔp = −2.07e-4 × 1.0e-3 × 199 × 101325 = −4.173881 J/K，Q = 293.15 × ΔS = −1223.573 J。第二套：物质取 G(T, p) = g(T) + V0[1 + α(T − T0)](p − p0)（T0 = 293.15 K 处 V、α 都不随压强变，正是题面的条件），S = −∂G/∂T、U = G + TS − pV 数值求，等温分 2000 步加压，逐步按 δQ = dU + p dV 累加热量，和闭式一致。另用可压缩的水（κ_T = 4.6e-10、α 不变）估体积变化的影响：热量少约 0.5%；真实的水（IAPWS-IF97）在 200 标准大气压时 α 已升到约 2.36e-4，熵变约 −4.45 J/K，比题面按「当作不变」算的多约 6.7%，标准答案仍按题面算。',
    p4: '（第 1 轮修订换的题）闭式：压强升高 αΔT/κ_T = 4.95e-5 × 1.40e11 × 10 = 6.93e7 Pa；C_p − C_V = TVα²/κ_T = 300 × 7.11e-6 × (4.95e-5)² × 1.40e11 = 0.731694 J/(mol·K)，每摩尔吸热 (24.4 − 0.731694) × 10 = 236.683 J。第二套：造「α、κ_T、C_V 为常数」的铜（摩尔体积 7.11e-6 m³），C_p = (∂H/∂T)_p 由 F 的数值导数求（体积由 p(T, V) = p0 解出），二分定出使 300 K 时 C_p = 24.4 的 C_V；体积固定，由 F 数值求 300 K → 310 K 的压强差和内能差（不做功，内能差就是吸的热），两个数和闭式在 10⁻⁴ 以内一致。另让 C_p 不变、C_V 随温度变（差值按 T 的一次式从 300 K 积到 310 K），吸热约 236.56 J，和标准答案差 5e-4，在容差 5e-3 以内；误用 C_p 得 244 J（差 3%）、误把线膨胀系数当体膨胀系数得 2.31e7 Pa，都判错。',
  },
  compute() {
    const atm = 101_325;

    // ---------- p1（Pa/K）----------
    const aHg = 1.81e-4;
    const kHg = 4.0e-11;
    const p1 = aHg / kHg;
    {
      const T0 = 293.15;
      const V0 = 1e-4;
      const hg = condensed('水银', aHg, kHg, V0, T0, atm, 30);
      const dp = pressure(hg, T0 + 1, V0) - pressure(hg, T0, V0);
      agree(dp, p1, 'p1 定容升温 1 K 的压强增加（由 F 数值求）', 1e-6);
      // 线性的体积：V0[1 + αΔT − κΔp] = V0
      const dpLin = bisect((x) => 1 + aHg * 1 - kHg * x - 1, 0, 1e8);
      agree(dpLin, p1, 'p1 线性模型', 1e-9);
      // 循环关系核对：−(∂p/∂V)_T (∂V/∂T)_p
      const dpdV = d5((v) => pressure(hg, T0, v), V0, V0 * 5e-4);
      const dVdT = d5((t) => volume(hg, t, atm), T0, 0.2);
      agree(-dpdV * dVdT, p1, 'p1 循环关系', 1e-5);
    }

    // ---------- p2 ----------
    const gases = [idealGas(1, 1.5), idealGas(1, 2.5), vdw(1, 1.5), vdw(1, 2.5)];
    // A
    let optA = true;
    for (const k of [0, 7]) {
      const m = film(k);
      for (const [T, A] of [
        [300, 1.3e-2],
        [350, 2.0e-2],
      ] as const) {
        const S = (t: number, a: number): number => -d5((x) => m.F(x, a), t, 0.05);
        const sig = (t: number, a: number): number => d5((x) => m.F(t, x), a, 1e-5);
        const dSdA = d5((a) => S(T, a), A, 1e-4);
        const dsdT = d5((t) => sig(t, A), T, 0.5);
        if (Math.abs(dSdA + dsdT) > 1e-6 * Math.abs(dsdT)) optA = false;
        // 等温拉大面积：逐步按第一定律 δQ = dU − σ dA 累加
        const A2 = A * 1.5;
        const N = 400;
        let Q = 0;
        const U = (a: number): number => m.F(T, a) + T * S(T, a);
        for (let i = 0; i < N; i++) {
          const a0 = A + ((A2 - A) * i) / N;
          const a1 = A + ((A2 - A) * (i + 1)) / N;
          Q += U(a1) - U(a0) - sig(T, (a0 + a1) / 2) * (a1 - a0);
        }
        agree(Q, T * (S(T, A2) - S(T, A)), 'p2 A：等温拉膜吸的热 = TΔS', 1e-4);
        check(Q > 0, 'p2 A：σ 随温度下降时，等温拉大液膜吸热');
      }
    }
    // B
    let optB = true;
    let bSample = [0, 0];
    const solids = [
      condensed('水银', aHg, kHg, 1e-4, 293.15, atm, 30),
      condensed('水', 2.07e-4, 4.6e-10, 1e-3, 293.15, atm, 4200),
      condensed('铜', 4.95e-5, 1 / 1.4e11, 7.11e-6, 300, atm, 24),
    ];
    for (const [m, T, p] of [
      [gases[0], 300, 1e5],
      [gases[1], 300, 1e5],
      [gases[2], 300, 2e6],
      [gases[3], 250, 1e6],
      [solids[0], 293.15, atm],
      [solids[1], 293.15, 50 * atm],
      [solids[2], 300, atm],
    ] as const) {
      const hp = m.name.includes('气体') ? p * 2e-3 : 2e6;
      const dSdp = d5((x) => entropy(m, T, volume(m, T, x)), p, hp);
      const dVdT = d5((t) => volume(m, t, p), T, 0.5);
      agree(dSdp, -dVdT, `p2 B ${m.name}：(∂S/∂p)_T = −(∂V/∂T)_p`, 2e-3);
      if (Math.abs(dSdp - dVdT) > 0.5 * Math.abs(dVdT)) optB = false;
      if (m === gases[0]) bSample = [dSdp, dVdT];
    }
    agree(bSample[1], R / 1e5, 'p2 B：1 mol 理想气体 (∂V/∂T)_p = R/p', 1e-5);
    // C
    let optC = true;
    for (const [m1, m2] of [
      [gases[0], gases[1]],
      [gases[2], gases[3]],
    ] as const) {
      const T = 300;
      const Va = 2.4e-2;
      const Vb = 4.8e-2;
      // 状态方程相同
      for (const t of [200, 300, 450]) for (const v of [Va, 3.3e-2, Vb]) agree(pressure(m1, t, v), pressure(m2, t, v), 'p2 C：p(T, V) 相同', 1e-6);
      const c1 = cv(m1, T, Va, 2);
      const c2 = cv(m2, T, Va, 2);
      check(Math.abs(c1 - c2) > 0.5 * R, 'p2 C：定容热容不同');
      // 等温可逆膨胀：ΔS = (ΔU + ∫p dV)/T
      const dSof = (m: Matter): number => {
        const N = 4000;
        let W = 0;
        for (let i = 0; i < N; i++) {
          const v = Va + ((Vb - Va) * (i + 0.5)) / N;
          W += (pressure(m, T, v) * (Vb - Va)) / N;
        }
        return (energy(m, T, Vb) - energy(m, T, Va) + W) / T;
      };
      const s1 = dSof(m1);
      const s2 = dSof(m2);
      if (Math.abs(s1 - s2) > 1e-4 * Math.abs(s1)) optC = false;
      if (m1 === gases[0]) agree(s1, R * Math.log(2), 'p2 C：理想气体 ΔS = nR ln 2', 1e-5);
    }
    // D
    let optD = true;
    for (const [m, c] of [
      [gases[0], 1.5],
      [gases[1], 2.5],
    ] as const) {
      const T = 300;
      const V = (R * T) / 1e5;
      const p = pressure(m, T, V);
      const dVdTp = d5((t) => volume(m, t, p), T, 0.5);
      const S0 = entropy(m, T, V);
      // 绝热线：给 V 解 T 使 S 不变
      const Tad = (v: number): number => bisect((t) => entropy(m, t, v) - S0, 100, 900);
      const dTdVs = d5(Tad, V, V * 2e-3);
      const product = dVdTp * dTdVs;
      agree(product, -1 / c, `p2 D ${m.name}：乘积是 −(γ − 1)`, 1e-3);
      if (Math.abs(product - 1) > 1e-2) optD = false;
    }
    // E
    let optE = true;
    for (const m of [gases[0], gases[1]]) {
      const T = 300;
      const p = 1e5;
      const V = volume(m, T, p);
      const a = d5((v) => pressure(m, T, v), V, V * 1e-3);
      const b = d5((t) => volume(m, t, p), T, 0.5);
      const c = d5((x) => bisect((t) => pressure(m, t, V) - x, 50, 1500), p, 100);
      if (Math.abs(a * b * c + 1) > 1e-5) optE = false;
    }
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3（J/K，J）----------
    const aW = 2.07e-4;
    const VW = 1.0e-3;
    const TW = 20 + 273.15;
    const pa = 1 * atm;
    const pb = 200 * atm;
    const dS3 = -aW * VW * (pb - pa);
    const Q3 = TW * dS3;
    {
      const g = (T: number): number => -4200 * (T * Math.log(T / TW) - T + TW);
      const G = (T: number, p: number): number => g(T) + VW * (1 + aW * (T - TW)) * (p - pa);
      const S = (T: number, p: number): number => -d5((t) => G(t, p), T, 0.5);
      const V = (T: number, p: number): number => d5((x) => G(T, x), p, 1e4);
      const U = (T: number, p: number): number => G(T, p) + T * S(T, p) - p * V(T, p);
      agree(V(TW, 0.5 * (pa + pb)), VW, 'p3 模型的体积不随压强变', 1e-6);
      agree(d5((t) => V(t, 100 * atm), TW, 0.5) / VW, aW, 'p3 模型的体膨胀系数', 1e-5);
      agree(S(TW, pb) - S(TW, pa), dS3, 'p3 熵变', 1e-6);
      const N = 2000;
      let Q = 0;
      for (let i = 0; i < N; i++) {
        const x0 = pa + ((pb - pa) * i) / N;
        const x1 = pa + ((pb - pa) * (i + 1)) / N;
        Q += U(TW, x1) - U(TW, x0) + ((x0 + x1) / 2) * (V(TW, x1) - V(TW, x0));
      }
      agree(Q, Q3, 'p3 逐步累加的热量', 1e-4);
      // 可压缩的水（κ_T = 4.6e-10）：体积每一步都在缩小，热量略少
      const w = condensed('水', aW, 4.6e-10, VW, TW, atm, 4200);
      const real = entropy(w, TW, volume(w, TW, pb)) - entropy(w, TW, volume(w, TW, pa));
      check(Math.abs(real / dS3 - 1) < 0.01 && Math.abs(real / dS3 - 1) > 0.002, 'p3 体积变化的影响约 0.5%');
      // 真实的水：先核对 IF97 的公布值，再看 1 → 200 标准大气压的熵变
      agree(waterV(300, 3e6), 1.002_151_68e-3, 'IF97 300 K、3 MPa 的比体积', 1e-6);
      agree(waterS(300, 3e6), 392.294_792, 'IF97 300 K、3 MPa 的比熵', 1e-6);
      agree(waterV(300, 80e6), 9.711_808_94e-4, 'IF97 300 K、80 MPa 的比体积', 1e-6);
      const alphaAt = (p: number): number => d5((t) => waterV(t, p), TW, 0.2) / waterV(TW, p);
      agree(alphaAt(pa), aW, '真实的水 1 标准大气压下的 α 和题面的值', 5e-3);
      agree(alphaAt(pb), 2.36e-4, '真实的水 200 标准大气压下的 α', 5e-3);
      agree(waterS(TW, pb) - waterS(TW, pa), -4.453, '真实的水的熵变（1 kg）', 1e-3);
    }

    // ---------- p4（Pa，J/mol）：第 1 轮修订换的题，体积卡住的铜从 300 K 加热到 310 K ----------
    const aCu = 3 * 1.65e-5;
    const kCu = 1 / 1.4e11;
    const VCu = 7.11e-6;
    const TCu = 300;
    const dTCu = 310 - 300;
    const cpCu = 24.4;
    const gap = (TCu * VCu * aCu * aCu) / kCu;
    const p4 = [(aCu / kCu) * dTCu, (cpCu - gap) * dTCu];
    {
      // C_V 随温度变的铜：只核对 C_p − C_V
      const cu = condensed('铜', aCu, kCu, VCu, TCu, atm, 24);
      const v = volume(cu, TCu, atm);
      agree(v, VCu, 'p4 模型的体积', 1e-6);
      agree(cp(cu, TCu, atm, 2) - cv(cu, TCu, v, 2), gap, 'p4 C_p − C_V（由 F 数值求）', 1e-4);
      // C_V 为常数的铜：由「300 K 时 C_p = 24.4」二分定 C_V，再让它定容升温，压强差、内能差都由 F 数值求
      const copper = (c: number): Matter => condensedConstCv('铜', aCu, kCu, VCu, TCu, atm, c);
      const c = bisect((x) => cp(copper(x), TCu, atm, 2) - cpCu, 20, 25);
      const m = copper(c);
      agree(pressure(m, TCu + dTCu, VCu) - pressure(m, TCu, VCu), p4[0], 'p4 定容升温 10 K 的压强增加', 1e-5);
      agree(energy(m, TCu + dTCu, VCu) - energy(m, TCu, VCu), p4[1], 'p4 定容升温 10 K 的内能增加（等于吸的热）', 1e-4);
      // 换一种理解：C_p 不变、C_p − C_V 随 T 成正比，吸热和标准答案差在容差（5e-3）以内
      const other = cpCu * dTCu - ((gap / TCu) * (310 ** 2 - 300 ** 2)) / 2;
      check(Math.abs(other / p4[1] - 1) < 1e-3, 'p4 差值随温度变时吸热和标准答案差不到 0.1%');
      // 常见的错法都在容差外：用 C_p 算吸热；没把线膨胀系数乘 3
      check(Math.abs((cpCu * dTCu) / p4[1] - 1) > 2e-2, 'p4 误用 C_p 判错');
      check(Math.abs((1.65e-5 * 1.4e11 * 10) / p4[0] - 1) > 0.5, 'p4 误用线膨胀系数判错');
    }

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [dS3, Q3] },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
