// 独立验算 physics.thermal-physics.phase-transitions 的 p1–p4（简单题、中等题）。
// 题面没给 R，按 CODATA 取精确值 R = N_A·k_B（两个定义值的乘积，8.314 462 618…）。
// 算法一（闭式）：dp/dT = L/(TΔV)，蒸气当理想气体、凝聚相的体积不计时 ΔV_m = RT/p。
// 算法二（不套克拉珀龙方程）：给每一相各造一个完整的化学势 μ(T, p)。气相是理想气体，定压热容任取；凝聚相的热容、体积任取。
//   只要求在题给的点 (T0, p0) 上两相的 μ 相等、焓差正好是题给的潜热；再在邻近的温度（或压强）上数值解 μ_甲 = μ_乙，
//   由解出的曲线差分得斜率。热容取几组不同的值，核对斜率和热容无关。
// 算法三（小卡诺循环）：用算法二的两相模型，取 1 mol 在 T0 全部汽化，再绝热降到 T0 − δ、凝结、绝热升回 T0，
//   数值积出循环的功，核对功 ÷ T0 时吸的热 = δ/T0（可逆循环）；功又等于压强差乘体积差，由此反推斜率。
// 选择题逐条造例子或反例（数都写在 notes 里）。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.phase-transitions.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen } from './physics.electromagnetism._es.ts';

const R = 6.022_140_76e23 * 1.380_649e-23; // J/(mol·K)
const ATM = 101_325;

/** 一相的模型：每摩尔（或每千克）的熵 S、体积 V、化学势 μ，都是 (T, p) 的函数。 */
interface Phase {
  S: (T: number, p: number) => number;
  V: (T: number, p: number) => number;
  mu: (T: number, p: number) => number;
}

/** 凝聚相：定压热容 c 是常数，体积 v 不随 T、p 变；参考点 (T0, p0) 上熵为 s0、化学势为 m0。 */
function condensed(T0: number, p0: number, s0: number, c: number, v: number, m0: number): Phase {
  const S = (T: number): number => s0 + c * Math.log(T / T0);
  return {
    S,
    V: () => v,
    // μ(T, p) = m0 − ∫S dT + v(p − p0)；∫(s0 + c ln(T/T0)) dT = s0(T − T0) + c[T ln(T/T0) − (T − T0)]
    mu: (T, p) => m0 - (s0 * (T - T0) + c * (T * Math.log(T / T0) - (T - T0))) + v * (p - p0),
  };
}

/** 理想气体：每摩尔的熵 s0 + c_p ln(T/T0) − R ln(p/p0)，μ = h − Ts。参考点上化学势 m0。 */
function idealVapor(T0: number, p0: number, s0: number, cp: number, m0: number): Phase {
  const S = (T: number, p: number): number => s0 + cp * Math.log(T / T0) - R * Math.log(p / p0);
  return {
    S,
    V: (T, p) => (R * T) / p,
    mu: (T, p) =>
      m0 - (s0 * (T - T0) + cp * (T * Math.log(T / T0) - (T - T0))) + R * T * Math.log(p / p0),
  };
}

/** 给定温度，数值解两相化学势相等的压强（在 [lo, hi] 里）。 */
const coexistP = (a: Phase, b: Phase, T: number, lo: number, hi: number): number =>
  bisect((p) => a.mu(T, p) - b.mu(T, p), lo, hi);

/** 给定压强，数值解两相化学势相等的温度。 */
const coexistT = (a: Phase, b: Phase, p: number, lo: number, hi: number): number =>
  bisect((T) => a.mu(T, p) - b.mu(T, p), lo, hi);

/** 五点差分。 */
const d5 = (f: (x: number) => number, x: number, h: number): number =>
  (f(x - 2 * h) - 8 * f(x - h) + 8 * f(x + h) - f(x + 2 * h)) / (12 * h);

/**
 * 题给 (T0, p0) 和摩尔潜热 L 的凝聚相和理想气体：凝聚相热容 c1、体积 v，气相热容 cp，返回两相。
 * 熵差取 L/T0（两相在 T0、p0 平衡共存，等压等温吸热 L），参考化学势都取 0。
 */
function pairAt(T0: number, p0: number, L: number, c1: number, v: number, cp: number): [Phase, Phase] {
  return [condensed(T0, p0, 70, c1, v, 0), idealVapor(T0, p0, 70 + L / T0, cp, 0)];
}

/**
 * 小卡诺循环（1 mol 在两相区里）：T0 时全部由凝聚相变成气相（等温等压，体积从 v 变到 V_g），
 * 再可逆绝热膨胀到 T0 − δ（途中有一部分凝结），在 T0 − δ 等温放热凝结到熵回到起点，再绝热压缩回 T0。
 * 返回循环对外做的功（沿四段数值积分 p dV）和 T0 时吸的热（按 ΔU + W 算，不用 TΔS）。
 */
function smallCarnot(c: Phase, g: Phase, T0: number, p0: number, delta: number, n = 400): { W: number; Q: number; dV: number; dp: number } {
  const pSat = (T: number): number => (T === T0 ? p0 : coexistP(c, g, T, p0 * 0.2, p0 * 3));
  // 两相区里熵 = (1 − x)S_c + x S_g，体积同理
  const at = (T: number): { p: number; sc: number; sg: number; vc: number; vg: number } => {
    const p = pSat(T);
    return { p, sc: c.S(T, p), sg: g.S(T, p), vc: c.V(T, p), vg: g.V(T, p) };
  };
  const xAt = (T: number, S: number): number => {
    const a = at(T);
    return (S - a.sc) / (a.sg - a.sc);
  };
  const volAt = (T: number, S: number): number => {
    const a = at(T);
    const x = (S - a.sc) / (a.sg - a.sc);
    return a.vc + x * (a.vg - a.vc);
  };
  const hot = at(T0);
  const S0 = hot.sc; // 起点：全部是凝聚相
  const S1 = hot.sg; // 全部是气相
  const cold = at(T0 - delta);
  // 等温段：p 不变
  const W1 = hot.p * (volAt(T0, S1) - volAt(T0, S0));
  const W3 = cold.p * (volAt(T0 - delta, S0) - volAt(T0 - delta, S1));
  // 绝热段：S 不变，T 从 T0 到 T0 − δ，用梯形法积 p dV（随 T 走）
  const adiabat = (S: number, from: number, to: number): number => {
    let w = 0;
    let Vp = volAt(from, S);
    let pp = at(from).p;
    for (let i = 1; i <= n; i++) {
      const T = from + ((to - from) * i) / n;
      const V = volAt(T, S);
      const p = at(T).p;
      w += 0.5 * (p + pp) * (V - Vp);
      Vp = V;
      pp = p;
    }
    return w;
  };
  const W2 = adiabat(S1, T0, T0 - delta);
  const W4 = adiabat(S0, T0 - delta, T0);
  const W = W1 + W2 + W3 + W4;
  // 内能 U = μ + TS − pV（每摩尔），Q = ΔU + W1
  const U = (ph: Phase, T: number, p: number): number => ph.mu(T, p) + T * ph.S(T, p) - p * ph.V(T, p);
  const Q = U(g, T0, p0) - U(c, T0, p0) + W1;
  check(Math.abs(xAt(T0, S0)) < 1e-12 && Math.abs(xAt(T0, S1) - 1) < 1e-12, '小卡诺循环的起点、终点在两相区的两端');
  return { W, Q, dV: hot.vg - hot.vc, dp: hot.p - cold.p };
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.phase-transitions',
  notes: {
    p1: '闭式 dp/dT = L p/(RT²) = 38600×101325/(R×351.4²) = 3809.48… Pa/K。算法二：乙醇液体（热容 112、60、200 J/(mol·K)，体积 0）和理想气体（c_p = 65、40、100）的 μ 数值相等得出 p(T)，五点差分的斜率和闭式在 10⁻⁷ 以内一致，和热容无关；液体体积换成 6.3×10⁻⁵ m³/mol 时斜率只变 0.2%。算法三：小卡诺循环（δ = 0.02 K）的功 ÷ 热 = δ/T0，功 ÷ (δ·ΔV) 的极限就是斜率，δ → 0 外推。',
    p2: 'A：−10 °C 的冰，由三相点（273.16 K、611.66 Pa）和升华的焓 51.06 kJ/mol 积出冰面上的平衡蒸气压约 260 Pa；空气里水汽分压取 100、150、200 Pa（低于它），让质量按 (p_冰 − p_空气) 的比例流走，冰一直减少到没有；分压为 260 Pa 时才不变，所以「不会再变干」错。B：CO₂ 的数（三相点 216.59 K、518 kPa）和 4000 组随机参数（三相的熵 S_固 < S_液 < S_气、固液热容相等、体积 V_液 大于或小于 V_固、三相点压强 1.02 到 40 atm），在 101325 Pa 下从低温扫到高温，处处 μ 最小的相依次是固、气，液从不出现：对。C：水和冰（冰 1/917、水 1/999.8 m³/kg，熵差 334/273.15 = 1.22 kJ/(kg·K)，水的熵大而体积小），反例，错。D：由 T = 273.16 K、611.66 Pa 出发按 L(T) = 45.05 − 0.0427(T − 273.16) kJ/mol 积到 293.15 K，饱和蒸气压约 2.34 kPa，比三相点压强高（液态水存在），外界压强低到它以下就沸腾：对。E：随机造 200 组两相模型（凝聚-凝聚、凝聚-气），数值求相平衡曲线的斜率，T·Δ(1/ρ)·斜率和 T·ΔS（就是潜热）在 2×10⁻⁵ 以内一致；另用水 100 °C 的实测数（ρ_气 = 0.5977、ρ_液 = 958.35 kg/m³，斜率 3.616 kPa/K）得 2.256×10⁶ J/kg：对。所以选 B、D、E。',
    p3: 'dp/dT = L p/(RT²) = 25200×101325/(R×194.7²) = 8101 Pa/K，ΔT = −5000/(dp/dT) = −0.6171… K。算法二：固体和理想气体的 μ 数值相等得出 p(T)，差分的斜率一致。对照：不取直线、按 ln p 随 1/T 线性（L 为常数）算出 −0.631 K，和直线的差 2.2%，超过 0.5% 的容差，所以题面写「当作直线」是必要的。',
    p4: 'ΔV = 1/6095 − 1/5910 < 0（每千克），dT/dp = TΔV/L，ΔT = 302.9×ΔV/(8.01e4)×1e7 = −0.194212… K。算法二：固、液两相各用常数熵、常数体积的 μ，数值解 10⁷ Pa 以后的共存温度：固液熵差恒为 L/T0 时正好是这个值；熵差随温度按热容差 ±200 J/(kg·K) 变时只差 0.1% 以内。',
  },
  compute() {
    // ---------- p1 ----------
    const T1 = 351.4;
    const L1 = 38_600;
    const slope1 = (L1 * ATM) / (R * T1 * T1);
    for (const [c1, cp] of [
      [112, 65],
      [60, 40],
      [200, 100],
    ] as const) {
      const [liq, vap] = pairAt(T1, ATM, L1, c1, 0, cp);
      agree(liq.mu(T1, ATM) + 1, vap.mu(T1, ATM) + 1, 'p1 参考点两相化学势相等', 1e-12);
      const num = d5((T) => coexistP(liq, vap, T, ATM * 0.5, ATM * 2), T1, 0.05);
      agree(num, slope1, `p1 数值斜率（液体热容 ${c1}，蒸气 c_p ${cp}）`, 1e-7);
      // 小卡诺循环：功 ÷ 热 = δ/T0；功 ÷ (δ·ΔV) → 斜率
      const r1 = smallCarnot(liq, vap, T1, ATM, 0.02);
      agree(r1.W / r1.Q, 0.02 / T1, `p1 小卡诺循环的效率（液体热容 ${c1}）`, 2e-6);
      const r2 = smallCarnot(liq, vap, T1, ATM, 0.01);
      const s1 = r1.W / (0.02 * r1.dV);
      const s2 = r2.W / (0.01 * r2.dV);
      agree(2 * s2 - s1, slope1, 'p1 小卡诺循环的功推回斜率', 1e-4);
    }
    {
      const [liq, vap] = pairAt(T1, ATM, L1, 112, 6.3e-5, 65);
      const num = d5((T) => coexistP(liq, vap, T, ATM * 0.5, ATM * 2), T1, 0.05);
      check(Math.abs(num / slope1 - 1) < 0.003, 'p1 液体体积不计的误差');
      console.log(`  p1：液体体积取 63 cm³/mol 时斜率 ${num.toFixed(2)} Pa/K，比不计时差 ${((num / slope1 - 1) * 100).toFixed(2)}%`);
    }
    const p1 = slope1;

    // ---------- p2 ----------
    // A：冰在 −10 °C 会不会升华
    const pIce = (T: number): number => 611.66 * Math.exp((-51_060 / R) * (1 / T - 1 / 273.16));
    const pIceCold = pIce(263.15);
    check(pIceCold > 255 && pIceCold < 265, `p2 A：−10 °C 冰面上的平衡蒸气压 ${pIceCold.toFixed(1)} Pa`);
    let optA = true; // 选项说「不会再变干」
    for (const pAir of [100, 150, 200]) {
      let ice = 1; // 衣服里的冰（任意单位）
      const k = 1e-4; // 每步流走的质量和压强差成比例
      for (let step = 0; step < 200_000 && ice > 0; step++) ice -= k * (pIceCold - pAir);
      if (ice <= 0) optA = false;
      check(ice <= 0, `p2 A：水汽分压 ${pAir} Pa 时冰全部升华`);
    }
    {
      // 分压和平衡蒸气压相等时，才不再变干
      let ice = 1;
      for (let step = 0; step < 10_000; step++) ice -= 1e-4 * (pIceCold - pIceCold);
      check(ice === 1, 'p2 A：水汽分压等于冰面平衡蒸气压时不变');
    }

    // B：三相点压强高于 1 atm 的物质，1 atm 下加热固体
    const stable = (phases: [Phase, Phase, Phase], T: number, p: number): number => {
      const m = phases.map((ph) => ph.mu(T, p));
      let best = 0;
      for (let i = 1; i < 3; i++) if (m[i] < m[best] - 1e-12) best = i;
      return best; // 0 固、1 液、2 气
    };
    let seed = 20261124;
    const rnd = (): number => {
      seed = (seed * 1_103_515_245 + 12_345) % 2_147_483_648;
      return seed / 2_147_483_648;
    };
    let optB = true;
    const tryB = (Tt: number, pt: number, sS: number, dSl: number, dSg: number, vS: number, vL: number): void => {
      const phases: [Phase, Phase, Phase] = [
        condensed(Tt, pt, sS, 60, vS, 0),
        condensed(Tt, pt, sS + dSl, 60, vL, 0), // 固、液热容取成相等，液的熵才在整个范围里大于固的
        idealVapor(Tt, pt, sS + dSl + dSg, 40, 0),
      ];
      const seq: number[] = [];
      for (let i = 0; i <= 600; i++) {
        const T = Tt * (0.4 + (1.2 * i) / 600);
        const s = stable(phases, T, ATM);
        if (seq[seq.length - 1] !== s) seq.push(s);
      }
      // 期望：只有固（0）、气（2）两个，顺序是先固后气
      if (seq.length !== 2 || seq[0] !== 0 || seq[1] !== 2) optB = false;
    };
    tryB(216.59, 517_950, 60, 8_650 / 216.59, 15_330 / 216.59, 2.9e-5, 3.74e-5); // CO₂：熔化 8.65、汽化 15.3 kJ/mol
    for (let k = 0; k < 4000; k++) {
      const Tt = 150 + 600 * rnd();
      const pt = ATM * (1.02 + 39 * rnd());
      const dSl = 5 + 60 * rnd();
      const dSg = 60 + 80 * rnd();
      const vS = 2e-5 + 8e-5 * rnd();
      const vL = vS * (0.85 + 0.4 * rnd());
      tryB(Tt, pt, 40 + 60 * rnd(), dSl, dSg, vS, vL);
    }

    // C：水和冰
    const vIce = 1 / 917;
    const vWater = 1 / 999.8;
    const dsMelt = 334_000 / 273.15; // 水 − 冰
    const optC = !(vIce > vWater && dsMelt > 0); // 有反例（冰体积大、熵小）就不成立
    check(!optC, 'p2 C：冰和水给出反例');
    // 同样用固-气、液-气核对：那里确实体积大的熵也大
    check((R * 293.15) / 2339 > 1.8e-5, 'p2 C：液-气的体积差');

    // D：室温下水的饱和蒸气压
    const Lw = (T: number): number => 45_050 - 42.7 * (T - 273.16); // J/mol，0 ℃ 附近 45.05 kJ/mol，100 ℃ 约 40.7
    let lnp = Math.log(611.66);
    const nD = 4000;
    for (let i = 0; i < nD; i++) {
      const Ta = 273.16 + ((293.15 - 273.16) * (i + 0.5)) / nD;
      lnp += ((Lw(Ta) / (R * Ta * Ta)) * (293.15 - 273.16)) / nD;
    }
    const pRoom = Math.exp(lnp);
    check(pRoom > 2280 && pRoom < 2400, `p2 D：20 °C 饱和蒸气压 ${pRoom.toFixed(0)} Pa`);
    const optD = pRoom > 611.66 && pRoom < ATM; // 液态水在这样低的压强下仍存在（三相点以上），压强再低就沸腾
    console.log(`  p2：−10 °C 冰面平衡蒸气压 ${pIceCold.toFixed(1)} Pa；20 °C 水的饱和蒸气压 ${pRoom.toFixed(0)} Pa`);

    // E：由斜率和密度反算潜热
    let optE = true;
    for (let k = 0; k < 200; k++) {
      const Tt = 100 + 900 * rnd();
      const gas = rnd() < 0.5;
      const pt = 1e3 * 10 ** (3 * rnd()) * (gas ? 1 : 100); // 气相的体积要比凝聚相大得多，压强不取太高
      const L = (2 + 40 * rnd()) * 1e3 * (rnd() < 0.5 ? 1 : 0.2); // J/mol
      const vA = 2e-5 + 6e-5 * rnd();
      const vB = vA * (0.8 + 0.5 * rnd());
      if (!gas && Math.abs(vB / vA - 1) < 0.02) continue; // 体积差太小时斜率趋于无穷大，跳过
      const a = condensed(Tt, pt, 50, 60, vA, 0);
      const b = gas ? idealVapor(Tt, pt, 50 + L / Tt, 40, 0) : condensed(Tt, pt, 50 + L / Tt, 70, vB, 0);
      // 沿 T 方向解 p，或沿 p 方向解 T，看哪个好解
      let slope: number;
      if (gas) {
        slope = d5((T) => coexistP(a, b, T, pt * 0.3, pt * 3), Tt, Tt * 1e-4);
      } else {
        const dv = vB - vA;
        const dpdt0 = L / Tt / dv;
        const h = Math.min(Tt * 1e-5, 1e-3);
        const span = Math.abs(dpdt0) * h * 6 + 1;
        slope = d5((T) => coexistP(a, b, T, pt - span * 4, pt + span * 4), Tt, h);
      }
      const dv = b.V(Tt, pt) - a.V(Tt, pt);
      const back = Tt * dv * slope;
      const latent = Tt * (b.S(Tt, pt) - a.S(Tt, pt));
      if (Math.abs(back - latent) > 2e-5 * latent) optE = false;
    }
    {
      // 水 100 °C 的实测数（ρ_气、ρ_液、斜率）
      const Lcalc = 373.124 * (1 / 0.5977 - 1 / 958.35) * 3616;
      check(Math.abs(Lcalc / 2.2564e6 - 1) < 0.002, `p2 E：水 100 °C 由斜率算出 ${Lcalc.toExponential(4)} J/kg`);
      console.log(`  p2 E：水 100 °C 由斜率、密度算出 ${Lcalc.toExponential(4)} J/kg`);
    }
    console.log(`  p2 各选项：A ${optA} B ${optB} C ${optC} D ${optD} E ${optE}`);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3 ----------
    const T3 = 194.7;
    const L3 = 25_200;
    const slope3 = (L3 * ATM) / (R * T3 * T3);
    for (const [c1, cp] of [
      [55, 33],
      [30, 25],
      [90, 45],
    ] as const) {
      const [sol, vap] = pairAt(T3, ATM, L3, c1, 0, cp);
      const num = d5((T) => coexistP(sol, vap, T, ATM * 0.5, ATM * 2), T3, 0.02);
      agree(num, slope3, `p3 数值斜率（固体热容 ${c1}，蒸气 c_p ${cp}）`, 1e-7);
    }
    const p3 = -5000 / slope3;
    {
      // 对照：不取直线、L 为常数时
      const exact = 1 / (1 / T3 - (R / L3) * Math.log((ATM - 5000) / ATM)) - T3;
      console.log(`  p3：直线 ${p3.toFixed(5)} K；按 ln p 随 1/T 线性（L 为常数）${exact.toFixed(5)} K，差 ${((exact / p3 - 1) * 100).toFixed(2)}%`);
      check(Math.abs(exact / p3 - 1) > 5e-3, 'p3 直线近似和积分结果的差超过容差，题面必须写「当作直线」');
    }

    // ---------- p4 ----------
    const T4 = 302.9;
    const L4 = 8.01e4; // J/kg
    const vs = 1 / 5.91e3;
    const vl = 1 / 6.095e3;
    const p4 = ((T4 * (vl - vs)) / L4) * 1e7;
    {
      // 常数熵差、常数体积的两相：μ_s = −s_s(T − T4) + v_s(p − p0)，μ_l = −s_l(T − T4) + v_l(p − p0)
      const mk = (s0: number, c: number, v: number): Phase => condensed(T4, ATM, s0, c, v, 0);
      const solid = mk(500, 0, vs);
      const liquid = mk(500 + L4 / T4, 0, vl);
      const T = coexistT(solid, liquid, ATM + 1e7, T4 - 5, T4 + 5);
      agree(T - T4, p4, 'p4 数值解固液化学势相等的温度', 1e-6);
      for (const dc of [200, -200]) {
        const liq2 = mk(500 + L4 / T4, dc, vl);
        const T2 = coexistT(solid, liq2, ATM + 1e7, T4 - 5, T4 + 5);
        check(Math.abs((T2 - T4) / p4 - 1) < 1e-3, `p4 固液热容差 ${dc} J/(kg·K) 时只差 0.1% 以内`);
      }
    }

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
