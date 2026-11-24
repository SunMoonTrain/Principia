// 独立验算 physics.thermal-physics.third-law 的 p1–p4（简单题、中等题）。
// 算法一（闭式）：压强不变时 δQ = C dT，dS = C dT/T，取 T → 0 时 S = 0；等温、绝热交替用「绝热可逆时熵不变」。
// 算法二（不用上面的原函数）：
//   p1、p3 把加热过程分成许多小段，每一小段按「热容 × 升高的温度」和「吸的热 ÷ 这一段的温度」一段段加起来（步长减半作理查森外推），
//     p1 的下限取 ε = 4 K × 10⁻¹² … 10⁻² 一串，看熵差随 ε → 0 的极限（外推掉与 ε 成正比的一项）；
//     p1 再从微观走一遍：电子的态密度在费米能附近是常数 g，用费米-狄拉克分布数值积分出内能，数值求导得热容，
//     确认它和 T 成正比，再由 C/T 的数值积分得熵，定出的 g 满足 C = bT 里题给的 b。
//   p4 除了二分解 S(T_{n+1}, X_A) = S(T_n, X_B)，再把绝热改 X 的一步当成一条连续的可逆路径，用四阶龙格-库塔法积
//     dT/dλ = −(∂S/∂λ)/(∂S/∂T)（S = (1 + λ)aT³，λ 从 0 到 1），一步步数到第一次低于 1 mK。
// 选择题拿三类具体的模型（盐取两组参数，共四个）逐条找反例、对照真值（数写在 notes 里）：
//   盐：每摩尔一份自旋 1/2，加上晶格的 T³ 项；自旋之间的相互作用用内场 b 代替（外场 B 换成 √(B² + b²)），所以 T → 0 时熵趋于零。
//   金属：S(T, p) = b(p)T + (a(p)/3)T³，两个压强下 a、b 各不相同。
//   题 4 的系统：S(T, X_A) = 2aT³，S(T, X_B) = aT³。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.third-law.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, integrate, rk4 } from './physics.newtonian-mechanics._nm.ts';

const R = 6.022_140_76e23 * 1.380_649e-23;
const MU_B_OVER_KB = 0.671_713_815; // 玻尔磁子 ÷ 玻尔兹曼常量，K/T（μ_B = 9.274 010 078 3e-24 J/T，k_B = 1.380 649e-23 J/K）

/** 把 [T0, T1] 分成 n 段，逐段累加 f(热容, 段的中点温度, 段长)；再和 2n 段的结果作理查森外推（中点法，误差与段长平方成正比）。 */
function heatInSteps(C: (T: number) => number, f: (c: number, T: number, dT: number) => number, T0: number, T1: number, n: number): number {
  const sum = (m: number) => {
    const h = (T1 - T0) / m;
    let s = 0;
    for (let i = 0; i < m; i++) {
      const T = T0 + (i + 0.5) * h;
      s += f(C(T), T, h);
    }
    return s;
  };
  const a = sum(n);
  const b = sum(2 * n);
  return (4 * b - a) / 3;
}

interface Model {
  name: string;
  /** 熵 S(T, X)；X_A 是绝热改回的那个值，X_B 是等温改到的那个值（熵较小）。 */
  S: (T: number, X: number) => number;
  XA: number;
  XB: number;
  T0: number;
}

/** 自旋 1/2 的顺磁盐：x = μ_B √(B² + b²)/(k_B T)，熵 R[ln(2cosh x) − x tanh x]，再加晶格的 (a/3)T³。 */
function saltEntropy(T: number, B: number, b: number, aLattice: number): number {
  const x = (MU_B_OVER_KB * Math.hypot(B, b)) / T;
  const lnc = x > 30 ? x : Math.log(2 * Math.cosh(x));
  const spin = x > 300 ? 2 * x * Math.exp(-2 * x) : lnc - x * Math.tanh(x);
  return R * Math.max(spin, 0) + (aLattice / 3) * T ** 3;
}

const models: Model[] = [
  { name: '盐（内场 0.01 T，B：0 ↔ 5 T）', S: (T, B) => saltEntropy(T, B, 0.01, 2e-4), XA: 0, XB: 5, T0: 1 },
  { name: '盐（内场 0.05 T，B：0.1 ↔ 2 T）', S: (T, B) => saltEntropy(T, B, 0.05, 2e-4), XA: 0.1, XB: 2, T0: 1 },
  {
    name: '金属（两个压强）',
    S: (T, p) => (p === 0 ? 1.0e-3 * T + (2.0e-4 / 3) * T ** 3 : 0.7e-3 * T + (1.4e-4 / 3) * T ** 3),
    XA: 0,
    XB: 1,
    T0: 4,
  },
  { name: '题 4：2aT³ 与 aT³', S: (T, X) => (X === 0 ? 2 : 1) * 1e-3 * T ** 3, XA: 0, XB: 1, T0: 1 },
];

/**
 * 等温改 X、再绝热改回（extra 是绝热那一步里多产生的熵，可逆时为 0），返回末温。
 * 末态要在 X_A 那条曲线上找熵等于 target 的温度；那条曲线在 T → 0 时的熵（取 T·10⁻¹² 处的值代替）已经不小于 target 时，
 * 找不到 T > 0 的末态，返回 0（就是一步降到绝对零度）。
 */
function coolStep(m: Model, T: number, extra = 0): number {
  const target = m.S(T, m.XB) + extra;
  const lo = T * 1e-12;
  if (m.S(lo, m.XA) >= target) return 0;
  return bisect((u) => m.S(u, m.XA) - target, lo, T);
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.third-law',
  notes: {
    p1: 'dS = C dT/T = b dT，S(4.0 K) = b·4.0 = 2.76×10⁻³；分段累加（吸的热 ÷ 温度）从 ε 加到 4 K，ε → 0 外推核对；微观：费米-狄拉克分布、常数态密度，数值求 C ∝ T，再积 C/T 得熵核对。',
    p2: 'A：四个模型各走 60 步，温度都严格大于零（金属、题 4 的系统再走 400 步），错（第三定律：T → 0 时两条 S-T 曲线汇合）；对照：内场取 0 的自旋模型 S(0 场) = R ln2 不随 T 变，违反第三定律，一步就到 0，这正是错的来处。B：金属的两个压强、盐的两个磁场下，热容 T·∂S/∂T 在 T = 10⁻⁵ K 时都小于 10⁻⁷ J/(mol·K)（10⁻¹ K 时最大的约 2.8 J/(mol·K)，是 0.1 T 下的盐），对。C：每个模型在可逆末态的熵上再加 1%、5%、20% 的「不可逆产生的熵」（限于不超过 X_A 那条曲线在原温度的熵），末温都更高，错（S 随 T 严格增加）。D：金属的两个压强（还有盐的 0 T、5 T）熵差在 T = 10⁻¹、10⁻³、10⁻⁵ K 时逐次变小、趋于 0，对。E：T = 0.5、1、2、4 K，B 从 0 到 1、2、5 T：直接算 Q = TΔS 为负（盐向热库放热），并用 Q = ΔU + ∫M dB（U = −N μ_eff 项的期望值，含和外场的作用能）对上；等温不可逆时由总熵不减 Q ≤ TΔS，放热更多，选项没说可逆也是错。所以选 B、D。',
    p3: 'Q = ∫C dT = (a/4)(5⁴ − 2⁴) + (b/2)(5² − 2²) = 0.04095 J，ΔS = ∫(C/T) dT = (a/3)(5³ − 2³) + b(5 − 2) = 0.0108 J/K；中点法分段累加（理查森外推）核对。',
    p4: '每一步可逆绝热：2aT_{n+1}³ = aT_n³，T_n = 2^{−n/3} K；n > 3 log₂1000 ≈ 29.9，最少 30 步（第 29 步 1.23 mK，第 30 步 1/1024 K ≈ 0.977 mK）；二分解熵相等、RK4 积连续的绝热路径各数一遍。',
  },
  compute() {
    // ---------- p1：S(4.0 K) ----------
    const b1 = 6.9e-4;
    const T1 = 4.0;
    const C1 = (T: number) => b1 * T;
    const exact1 = b1 * T1;
    for (const frac of [1e-2, 1e-4, 1e-6, 1e-8, 1e-10, 1e-12]) {
      const eps = T1 * frac;
      const dS = heatInSteps(C1, (c, T, dT) => (c / T) * dT, eps, T1, 2000);
      agree(dS + b1 * eps, exact1, `p1：从 ε = ${eps} K 分段累加到 4 K，补回 bε`, 1e-9);
    }
    // 微观：费米-狄拉克、常数态密度 g（能量以 k_B·1 K 为单位，费米能 1000 倍于温度尺度），U(T) = g∫E f(E)dE，C = dU/dT
    {
      // 只看费米面附近：E = E_F + T·y（能量用 k_B·1 K 作单位），常数态密度时化学势不动，
      // 内能的改变量 ∝ ∫(E − E_F)[f − θ(E_F − E)]dE = T²∫ y[1/(e^y + 1) − θ(−y)]dy，两边各取 60 个 k_BT
      const uPerG =
        integrate((y) => y * (1 / (Math.exp(y) + 1) - 1), -60, 0, 256, 16) + integrate((y) => y / (Math.exp(y) + 1), 0, 60, 256, 16);
      const u = (T: number) => T * T * uPerG;
      const cNum = (T: number) => (u(T * 1.001) - u(T * 0.999)) / (T * 0.002);
      agree(uPerG * 6, Math.PI ** 2, 'p1：∫ y[f − θ]dy = π²/6', 1e-9);
      const c4 = cNum(4);
      const c2 = cNum(2);
      const c1 = cNum(1);
      agree(c4 / c2, 2, 'p1：微观算的热容和 T 成正比（4 K 对 2 K）', 1e-6);
      agree(c2 / c1, 2, 'p1：微观算的热容和 T 成正比（2 K 对 1 K）', 1e-6);
      const g = (b1 * 4) / c4; // 每摩尔的态密度系数，使 C(4 K) = b·4 K
      const Cm = (T: number) => g * cNum(T);
      const Sm = heatInSteps(Cm, (c, T, dT) => (c / T) * dT, T1 * 1e-6, T1, 400);
      agree(Sm, exact1, 'p1：微观热容积分出的熵', 3e-6);
    }
    const p1 = exact1;

    // ---------- p2 ----------
    // A：等温、绝热交替走许多步
    let optA = false;
    for (const m of models) {
      let T = m.T0;
      let reached = false;
      for (let k = 0; k < 60; k++) {
        const next = coolStep(m, T);
        check(next < T || next === T, `p2 A：${m.name} 每一步都不升温`);
        if (next <= 0) reached = true;
        T = next;
      }
      check(T > 0, `p2 A：${m.name} 60 步后 T = ${T} > 0`);
      if (reached) optA = true;
    }
    for (const m of models.slice(2)) {
      let T = m.T0;
      for (let k = 0; k < 400; k++) T = coolStep(m, T);
      check(T > 0, `p2 A：${m.name} 400 步后 T = ${T} > 0`);
    }
    // 对照：没有内场的自旋（B = 0 时 S ≡ R ln2，和 T 无关，违反第三定律）绝热降到 B = 0 时，一步就到 T = 0：上面的判据分得出两种情形
    const broken: Model = { name: '没有内场的自旋（违反第三定律）', S: (T, B) => saltEntropy(T, B, 0, 0), XA: 0, XB: 5, T0: 1 };
    agree(broken.S(0.01, 0), R * Math.log(2), 'p2 A 的对照：没有内场时 B = 0 处熵恒为 R ln 2', 1e-9);
    check(broken.S(1, 5) < R * Math.log(2), 'p2 A 的对照：B = 5 T、1 K 时熵比 R ln2 小');
    check(coolStep(broken, 1) === 0, 'p2 A 的对照：违反第三定律的系统一步到 T = 0');

    // B：压强（磁场）不变时的热容 T ∂S/∂T
    const cOf = (S: (T: number) => number, T: number) => {
      const h = 1e-4 * T;
      return (T * (S(T + h) - S(T - h))) / (2 * h);
    };
    let optB = true;
    for (const m of models) {
      for (const X of [m.XA, m.XB]) {
        // 金属是 bT：10⁻¹ K 时 10⁻⁴ 量级，到 10⁻⁵ K 时 10⁻⁸ 量级；盐的自旋部分在 T 远小于 μ_B·b/k_B 时按指数消失
        const last = cOf((t) => m.S(t, X), 1e-5);
        if (!(last < 1e-7 && last >= -1e-12)) optB = false;
      }
    }
    // C：绝热那一步不可逆（熵增加 extra），末温反而更高
    let optC = false;
    for (const m of models) {
      const reversible = coolStep(m, m.T0);
      const SAnow = m.S(m.T0, m.XA);
      const SBnow = m.S(m.T0, m.XB);
      check(SAnow > SBnow, `p2 C：${m.name} X_A 那条曲线在上`);
      for (const frac of [0.01, 0.05, 0.2]) {
        const extra = frac * (SAnow - SBnow);
        const t = coolStep(m, m.T0, extra);
        if (t < reversible) optC = true;
        check(t > reversible, `p2 C：${m.name} 多产生 ${frac * 100}% 的熵，末温更高`);
      }
    }
    // D：两个 X 下的熵之差
    let optD = true;
    for (const m of models) {
      const d = [1e-1, 1e-3, 1e-5].map((T) => Math.abs(m.S(T, m.XA) - m.S(T, m.XB)));
      if (!(d[1] < d[0] && d[2] < d[1] + 1e-300 && d[2] < 1e-8)) optD = false;
    }
    // E：等温加强磁场，热库得到的热（盐放热：Q < 0）；Q = TΔS 与 Q = ΔU + ∫M dB（W_on = −∫M dB）对上
    let optE = false;
    for (const T of [0.5, 1, 2, 4]) {
      for (const B1 of [1, 2, 5]) {
        const bInt = 0.01;
        const S0 = saltEntropy(T, 0, bInt, 0);
        const S1 = saltEntropy(T, B1, bInt, 0);
        const qEntropy = T * (S1 - S0);
        // 把内场也并进同一个有效场：U = −R·θ·|B_eff|·tanh(θ|B_eff|/T)，θ = μ_B/k_B，M 的共轭量 ∫ M dB_eff 换成对 B 积分
        const th = MU_B_OVER_KB;
        const Beff = (B: number) => Math.hypot(B, bInt);
        const U = (B: number) => -R * th * Beff(B) * Math.tanh((th * Beff(B)) / T);
        // dU|_S = −M dB，其中 −∂F/∂B = M = R θ (B/B_eff) tanh(θ B_eff/T)
        const M = (B: number) => R * th * (B / Beff(B)) * Math.tanh((th * Beff(B)) / T);
        const workOn = -integrate(M, 0, B1, 256, 16); // 外界对盐做的功（含与外场的作用能），dW = −M dB
        const qEnergy = U(B1) - U(0) - workOn;
        agree(qEnergy, qEntropy, `p2 E：T = ${T} K、B = ${B1} T 时 Q = ΔU − W 与 TΔS 一致`, 1e-7);
        check(qEntropy < 0, `p2 E：T = ${T} K、B 0→${B1} T 时盐放热`);
        if (qEntropy > 0) optE = true;
      }
    }
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3 ----------
    const a3 = 2.0e-4;
    const b3 = 1.0e-3;
    const Ti = 2.0;
    const Tf = 5.0;
    const C3 = (T: number) => a3 * T ** 3 + b3 * T;
    const Qsum = heatInSteps(C3, (c, _T, dT) => c * dT, Ti, Tf, 3000);
    const Ssum = heatInSteps(C3, (c, T, dT) => (c / T) * dT, Ti, Tf, 3000);
    const Q3 = agree(Qsum, (a3 / 4) * (Tf ** 4 - Ti ** 4) + (b3 / 2) * (Tf ** 2 - Ti ** 2), 'p3 吸收的热量', 1e-9);
    const S3 = agree(Ssum, (a3 / 3) * (Tf ** 3 - Ti ** 3) + b3 * (Tf - Ti), 'p3 熵变', 1e-9);
    agree(integrate(C3, Ti, Tf, 32, 16), Q3, 'p3 热量（高斯-勒让德）', 1e-12);

    // ---------- p4 ----------
    const target = 1.0e-3;
    const m4 = models[3];
    // 方法一：每步二分解 S(T_{n+1}, X_A) = S(T_n, X_B)
    let T = 1.0;
    let nBisect = 0;
    while (!(T < target)) {
      T = coolStep(m4, T);
      nBisect += 1;
      agree(T, 2 ** (-nBisect / 3), `p4：第 ${nBisect} 步的温度（闭式 2^(-n/3)）`, 1e-9);
      if (nBisect > 200) throw new Error('p4：没有降到 1 mK 以下');
    }
    // 方法二：绝热那一步是连续的可逆路径，λ 从 0（X_B，熵系数 1）到 1（X_A，熵系数 2）
    const dTdl = (_l: number, y: number[]) => [-(1e-3 * y[0] ** 3) / (3 * (1 + _l) * 1e-3 * y[0] ** 2)];
    let Tr = 1.0;
    let nRk = 0;
    while (!(Tr < target)) {
      Tr = rk4(dTdl, [Tr], 0, 1, 400)[0];
      nRk += 1;
      if (nRk > 200) throw new Error('p4：RK4 没有降到 1 mK 以下');
    }
    agree(Tr, T, 'p4：两种算法在同一步的温度', 1e-8);
    check(nRk === nBisect, 'p4：两种算法数出的步数相同');
    check(2 ** (-29 / 3) > target && 2 ** (-30 / 3) < target, 'p4：第 29 步还不低于 1 mK，第 30 步低于');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [Q3, S3] },
      p4: { type: 'number', value: nBisect },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
