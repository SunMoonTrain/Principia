// 独立验算 physics.thermal-physics.second-law 的 p1–p4（简单题、中等题）。
// 判据用两套：
//   一、按题面的表述造组合机器（只许加上第二定律允许的东西：热量从热的热库传到冷的热库、可逆的卡诺热机），
//       看净效果是不是「单一热库的热全部变成功」（开尔文表述）或「热量从冷的热库到热的热库、此外什么都不变」（克劳修斯表述）；
//   二、不管怎么组合，直接算熵的账：循环工作的机器 ΣQᵢ/Tᵢ > 0 就违反第二定律（热库换几组温度、核对结论不变），
//       一般的过程算总熵变，> 0 是不可逆，= 0 是可逆，< 0 违反第二定律。
// 数值题（p3、p4）把热库的账一步步记下来，再拿效率、制冷系数正好等于题给值的理想气体卡诺循环真的走一遍（龙格-库塔积分绝热段），
// 放大到题给的功核对。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.second-law.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, integrate, rk4, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const R = 6.022_140_76e23 * 1.380_649e-23;

/** 循环工作的机器：从高温热库吸 QH、从低温热库吸 QL（放热取负），每个循环对外做功 W。 */
interface Machine {
  QH: number;
  QL: number;
  W: number;
}

const obeysFirstLaw = (m: Machine) => Math.abs(m.QH + m.QL - m.W) < 1e-9;

/** 熵判据：热库换几组温度，ΣQ/T 的正负都一样才给结论。返回 ΣQ/T > 0（违反第二定律）。 */
function entropyViolates(m: Machine): boolean {
  const signs = [
    [500, 300],
    [1000, 290],
    [310, 300],
  ].map(([TH, TL]) => Math.sign(m.QH / TH + m.QL / TL));
  check(
    signs.every((s) => s === signs[0]),
    '熵判据和热库温度无关',
  );
  return signs[0] > 0;
}

/**
 * 组合判据：在机器旁边再用一根导热的棒让热量 q ≥ 0 从高温热库流到低温热库（允许的自发过程），使低温热库每个循环净变化为零；
 * 返回高温热库净放出的热量和净功。机器从低温热库净吸热（QL > 0）时可以这样做。
 * 净效果是「高温热库放出正的热量、全部变成正的功、低温热库复原」就违反开尔文表述。
 */
function kelvinByConduction(m: Machine): { heat: number; work: number } {
  check(m.QL >= 0, '只有从低温热库净吸热时才能靠导热让它复原');
  const q = m.QL;
  return { heat: m.QH + q, work: m.W };
}

/** 等温段：n mol 理想气体在温度 T 下从 V1 到 V2 对外做的功（= 吸的热），自变量 ln V。 */
const isothermWork = (n: number, T: number, V1: number, V2: number) => integrate(() => n * R * T, Math.log(V1), Math.log(V2), 64);

/** 绝热段：dT/d lnV = −T/(C_V/R)，积到温度等于 Tend；返回终点体积和气体对外做的功。 */
function adiabatToT(n: number, cv: number, V0: number, T0: number, Tend: number): { V: number; W: number } {
  const expand = Tend < T0;
  const sign = expand ? 1 : -1;
  const rhs = (_s: number, y: number[]) => [(sign * -y[0]) / cv, sign * n * R * y[0]];
  const hit = rk4Until(rhs, [T0, 0], 0, 1e-5, 20_000_000, (_s, y) => (expand ? Tend - y[0] : y[0] - Tend));
  return { V: V0 * Math.exp(sign * hit.t), W: hit.y[1] };
}

/** 理想气体卡诺循环走一遍：返回从高温热库吸的热、向低温热库放的热、对外做的净功（都取正）。 */
function carnotCycle(n: number, cv: number, TH: number, TL: number, VA: number, VB: number): { QH: number; QL: number; W: number } {
  const WAB = isothermWork(n, TH, VA, VB);
  const BC = adiabatToT(n, cv, VB, TH, TL);
  const AD = adiabatToT(n, cv, VA, TH, TL);
  const WCD = isothermWork(n, TL, BC.V, AD.V);
  const DA = adiabatToT(n, cv, AD.V, TL, TH);
  agree(DA.V, VA, '卡诺循环闭合', 1e-7);
  const W = WAB + BC.W + WCD + DA.W;
  agree(WAB - -WCD, W, '一个循环 ΔU = 0', 1e-7);
  return { QH: WAB, QL: -WCD, W };
}

/**
 * 外压分 N 级变化（每级外压跳到下一个值、气体重新平衡）：先把 1 mol 气体从 V1 压到 V2，再一级级放回去。
 * 返回一来一回外界净付出的功（等温）或末温与初温之差（绝热）。N → ∞ 时趋于 0 就是可逆。
 */
function isothermalRoundTrip(T: number, r: number, N: number): number {
  const p1 = 1e5;
  const V = (p: number) => (R * T) / p;
  const step = Math.pow(r, 1 / N);
  let net = 0;
  let p = p1;
  for (let i = 0; i < N; i++) {
    const q = p * step; // 外压跳到 q，气体等温地缩到 V(q)
    net += q * (V(p) - V(q));
    p = q;
  }
  for (let i = 0; i < N; i++) {
    const q = p / step; // 外压减到 q，气体等温地胀到 V(q)
    net -= q * (V(q) - V(p));
    p = q;
  }
  return net;
}

function adiabaticRoundTrip(T0: number, r: number, N: number, cv: number): number {
  let p = 1e5;
  let T = T0;
  const step = Math.pow(r, 1 / N);
  const jump = (q: number) => {
    // 绝热、外压恒为 q 的一级：cv·R(T' − T) = −q(V' − V)，V = RT/p，V' = RT'/q
    const V = (R * T) / p;
    T = (cv * R * T + q * V) / (cv * R + R);
    p = q;
  };
  for (let i = 0; i < N; i++) jump(p * step);
  for (let i = 0; i < N; i++) jump(p / step);
  return T - T0;
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.second-law',
  notes: {
    p1: 'A 净吸 200 J 全变成功（第一定律成立），ΣQ/T = 200/T > 0，开尔文表述直接违反：选。B 不吸热却做功 50 J，第一定律就不成立：不选。C 红热的铁（1 kg、450 J/(kg·K)、1100 K）放进 10 kg、293 K 的水：算出末温，能量守恒，总熵变 > 0，是自发过程：不选。D（第 1 轮修订换的）0.25 kg 温水（20、30、40、60 ℃）里 1%、5%、10%、20% 自己结成 0 ℃ 的冰，放出的热全给其余的水：由能量守恒定出其余的水的末温（都比原来高，10% 以内到不了 100 ℃），总熵变都 < 0（例如 40 ℃、10%：其余的水升到约 53 ℃，冰那一份熵变约 −44.9 J/K，其余的水约 +39.2 J/K），违反克劳修斯表述，能量守恒：选。E 1000 + 200 = 1200 第一定律成立；从高温热库往低温热库导 200 J（允许的自发过程），低温热库复原，净效果是高温热库放 1200 J 全变成功，违反开尔文表述；ΣQ/T = 1000/T_H + 200/T_L > 0：选。',
    p2: 'A 等温来回压缩膨胀（1 mol、300 K、压强升到 3 倍再降回）、外压分 N 级，一来一回外界净付出的功在 N = 10、100、1000、10000 时约 301、30.1、3.01、0.301 J，按 1/N 缩小，外推到 N → ∞ 是 0：可逆，不选。B 单摆（阻尼率 0.2 s⁻¹）积 120 s 几乎停下，机械能的减少等于耗散的能量，全部成了 293 K 的周围的内能，总熵变 E/T > 0：选。C 热水（0.25 kg，4186 J/(kg·K)，353 K→293 K）和房间：多慢都隔着有限温差，总熵变 C(x − 1 − ln x) > 0（x = 353/293），和快慢无关：选。D 单原子理想气体绝热压缩、膨胀一个来回，外压分 N 级，温度比原来高出 8.81、0.870、0.0869、0.00869 K，按 1/N 缩小，外推是 0：可逆，不选。E 墨水滴散开（墨水分子稀薄，当作分子从 V₁ 自由膨胀到 V₂）：要收回去至少要付 nRT ln(V₂/V₁) 的等温功，这份功变成热留在周围，总熵变 nR ln(V₂/V₁) > 0：选。',
    p3: '乙每个循环 Q_H = W/η = 450/0.30 = 1500 J，Q_L = Q_H − W = 1050 J；甲送回 x，使低温热库每个循环净变化 1050 − x = 0，二分求出 x = 1050 J；合起来高温热库净放出 1500 − x = 450 J（低温热库复原，功 450 J）；再拿 η = 0.30 的卡诺循环（T_H = 500 K、T_L = 350 K，两种气体）真的走一遍，按 W = 450 J 放大核对 Q_H、Q_L。',
    p4: '丙给的功 |W| = 500 J，制冷机 Q_L = 3.2 × 500 = 1600 J，放进高温热库 Q_H = Q_L + |W| = 2100 J；高温热库净得到 2100 − 500 = 1600 J（低温热库净放出 1600 J）；再拿制冷系数为 3.2 的卡诺制冷机（T_L = 256 K、T_H = 336 K，T_L/(T_H − T_L) = 3.2）把卡诺循环倒着走，按 |W| = 500 J 放大核对。',
  },
  compute() {
    // ---------- p1 ----------
    // A：一个热库。把它当高温热库，净吸热 300 − 100 = 200
    const A: Machine = { QH: 300 - 100, QL: 0, W: 200 };
    const optA = obeysFirstLaw(A) && entropyViolates(A);
    check(kelvinByConduction(A).heat === kelvinByConduction(A).work && A.W > 0, 'A 直接违反开尔文表述');
    // B：不吸热却做功
    const B: Machine = { QH: 0, QL: 0, W: 50 };
    const optB = obeysFirstLaw(B) && entropyViolates(B);
    check(!obeysFirstLaw(B), 'B 违反第一定律');
    // C：红热的铁放进冷水，算末温和总熵变
    const mFe = 1;
    const cFe = 450;
    const TFe = 1100;
    const mW = 10;
    const cW = 4186;
    const TW = 293;
    const Tmix = (mFe * cFe * TFe + mW * cW * TW) / (mFe * cFe + mW * cW);
    check(TFe > Tmix && Tmix > TW, 'C 铁变凉、水变热');
    agree(mFe * cFe * (TFe - Tmix), mW * cW * (Tmix - TW), 'C 能量守恒', 1e-9);
    const dSmix = integrate((T) => (mFe * cFe) / T, TFe, Tmix) + integrate((T) => (mW * cW) / T, TW, Tmix);
    check(dSmix > 0, 'C 总熵变为正，允许');
    const optC = dSmix < 0;
    // D（第 1 轮修订换的）：绝热的杯子里一小部分温水自己结成冰，其余的变得更热，此外什么都不变。
    // 要结冰的那一份先从 T0 凉到 273.15 K 再结冰，放出的热都给了其余的水；由能量守恒定末温，再算总熵变（取几组水温、结冰的份额）。
    const optD = [293.15, 303.15, 313.15, 333.15].every((T0) =>
      [0.01, 0.05, 0.1, 0.2].every((x) => {
        const m = 0.25; // kg
        const c = 4186;
        const Lf = 3.34e5; // J/kg
        const Tm = 273.15;
        const released = x * m * (c * (T0 - Tm) + Lf);
        const rest = (1 - x) * m * c;
        const T1 = T0 + released / rest;
        check(T1 > T0, 'D 其余的水确实变得更热（第一定律允许）');
        if (x <= 0.1) check(T1 < 373.15, 'D 结冰的份额不大时，其余的水还没到沸点');
        const dS = -x * m * (integrate((t) => c / t, Tm, T0) + Lf / Tm) + integrate((t) => rest / t, T0, T1);
        return dS < 0; // 总熵减少，违反第二定律
      }),
    );
    // 一小份热从正在结冰的 273.15 K 传到更热的水，此外什么都不变：就是克劳修斯表述禁止的
    const D: Machine = { QH: -1, QL: 1, W: 0 };
    check(obeysFirstLaw(D) && entropyViolates(D), 'D 正是热量从低温到高温、没有别的变化');
    // E：从两个热库都吸热，全部变成功
    const E: Machine = { QH: 1000, QL: 200, W: 1200 };
    const optE = obeysFirstLaw(E) && entropyViolates(E);
    const netE = kelvinByConduction(E);
    check(netE.heat === netE.work && netE.work === 1200, 'E 加上允许的导热后正是开尔文表述禁止的');
    const p1 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p2 ----------
    // 外压分 N 级时误差 ∝ 1/N，用 N 和 10N 两个值外推到 N → ∞
    const limit = (coarse: number, fine: number) => (10 * fine - coarse) / 9;
    // A：等温一来一回，外压分 N 级，外界净付出的功随 N 增大趋于 0
    const nets = [10, 100, 1000, 10000].map((N) => isothermalRoundTrip(300, 3, N));
    for (let i = 1; i < nets.length; i++) check(nets[i] > 0 && nets[i] < nets[i - 1] / 8, 'A 净付出的功按 1/N 缩小');
    const irrA = Math.abs(limit(nets[2], nets[3])) > 1e-5 * R * 300; // 极限为 0 ⇒ 可逆
    // B：单摆在空气里摆（θ'' = −(g/L) sinθ − bθ'），积到几乎停下；机械能的减少等于阻力耗散的能量，全部成了 T 不变的周围的内能，总熵变 E/T
    const gOverL = 9.8;
    const mLL = 0.1; // mL²，kg·m²
    const energy = (th: number, w: number) => mLL * (0.5 * w * w + gOverL * (1 - Math.cos(th)));
    const Troom = 293;
    const swing = (b: number, time: number) =>
      rk4((_t, y) => [y[1], -gOverL * Math.sin(y[0]) - b * y[1], mLL * b * y[1] * y[1]], [0.3, 0, 0], 0, time, 40_000);
    const damped = swing(0.2, 120);
    const lost = energy(0.3, 0) - energy(damped[0], damped[1]);
    agree(damped[2], lost, 'B 机械能的减少等于耗散的能量', 1e-6);
    check(energy(damped[0], damped[1]) < 1e-6 * energy(0.3, 0), 'B 摆最后停下');
    const irrB = lost / Troom > 0;
    // C：热水变凉
    const cw = 0.25 * 4186;
    const dSwater = integrate((T) => cw / T, 353, 293);
    const dSroom = (cw * (353 - 293)) / 293;
    const x = 353 / 293;
    agree(dSwater + dSroom, cw * (x - 1 - Math.log(x)), 'C 总熵变', 1e-12);
    const irrC = dSwater + dSroom > 0;
    // 冷却得再慢也一样：分成 M 小段，每段水温看作不变，和房间之间的温差有限，熵的账和时间无关
    let acc = 0;
    let T = 353;
    const M = 100000;
    for (let i = 0; i < M; i++) {
      const q = (cw * (353 - 293)) / M;
      acc += q * (1 / 293 - 1 / (T - ((353 - 293) / M) * 0.5));
      T -= (353 - 293) / M;
    }
    agree(acc, dSwater + dSroom, 'C 逐步累计的熵和快慢无关', 1e-6);
    // D：绝热一来一回，外压分 N 级，末温与初温之差随 N 增大趋于 0
    const dTs = [10, 100, 1000, 10000].map((N) => adiabaticRoundTrip(300, 3, N, 1.5));
    for (let i = 1; i < dTs.length; i++) check(dTs[i] > 0 && dTs[i] < dTs[i - 1] / 8, 'D 温度的回升按 1/N 缩小');
    const irrD = Math.abs(limit(dTs[2], dTs[3])) > 1e-5 * 300;
    // E：墨水滴散开：n 摩尔从 V1 散到 V2，收回去至少要的功 nRT ln(V2/V1)
    const nInk = 1e-6;
    const wMin = isothermWork(nInk, Troom, 5e-8, 2e-4);
    agree(wMin, nInk * R * Troom * Math.log(2e-4 / 5e-8), 'E 收回去要的最小功', 1e-9);
    const irrE = wMin > 0;
    const p2 = chosen([irrA, irrB, irrC, irrD, irrE]);

    // ---------- p3（J）----------
    const eta3 = 0.3;
    const W3 = 450;
    const QH3 = W3 / eta3;
    const QL3 = QH3 - W3;
    // 甲送回 x：低温热库每个循环净变化 QL3 − x；用二分求 x
    const sent = bisect((xx) => QL3 - xx, 0, 1e5);
    const netHot = QH3 - sent;
    agree(sent, QL3, 'p3：甲送回的热', 1e-9);
    agree(netHot, W3, 'p3：低温热库复原后高温热库净放出的热等于功', 1e-9);
    for (const [cv, VA, VB, n] of [
      [1.5, 1e-3, 2e-3, 1],
      [2.5, 5e-3, 1.1e-2, 0.3],
    ]) {
      const c = carnotCycle(n, cv, 500, 350, VA, VB); // 效率 1 − 350/500 = 0.30
      const s = W3 / c.W;
      agree(c.QH * s, QH3, 'p3：卡诺循环放大后的 Q_H', 1e-6);
      agree(c.QL * s, QL3, 'p3：卡诺循环放大后的 Q_L', 1e-6);
    }

    // ---------- p4（J）----------
    const W4 = 500;
    const cop = 3.2;
    const QL4 = cop * W4;
    const QH4 = QL4 + W4;
    const net4 = QH4 - W4; // 高温热库净得到：制冷机放进的减去丙取走的 500 J
    for (const [cv, VA, VB, n] of [
      [1.5, 1e-3, 2e-3, 1],
      [2.5, 3e-3, 3.5e-3, 2],
    ]) {
      const c = carnotCycle(n, cv, 336, 256, VA, VB); // 倒着走：T_L/(T_H − T_L) = 256/80 = 3.2
      const s = W4 / c.W;
      agree(c.QL * s, QL4, 'p4：倒着走的卡诺循环从低温热库吸的热', 1e-6);
      agree(c.QH * s, QH4, 'p4：倒着走的卡诺循环向高温热库放的热', 1e-6);
    }

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [sent, netHot] },
      p4: { type: 'tuple', value: [QH4, net4] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
