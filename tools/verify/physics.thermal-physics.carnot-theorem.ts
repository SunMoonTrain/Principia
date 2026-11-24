// 独立验算 physics.thermal-physics.carnot-theorem 的 p1–p4（简单题、中等题）。
// 算法一（闭式）：可逆热机、可逆制冷机都有 Q_L/Q_H = T_L/T_H（热力学温标的定义），能量守恒 W = Q_H − Q_L。
// 算法二（不用上面的比例式）：拿四种工作物质各走一遍可逆的卡诺循环，只用第一定律。给出压强 p(V, T)、
//   内能的两个偏导数 (∂U/∂V)_T、(∂U/∂T)_V，自变量取 s = ln V：
//   等温段 δQ = [p + (∂U/∂V)_T]·dV，用高斯-勒让德积分；
//   绝热段 (∂U/∂T)_V dT = −[p + (∂U/∂V)_T]·dV，用四阶龙格-库塔法积到温度等于另一个热库的温度（事件二分停下）。
//   一圈的功另按 ∮p dV 加一遍，和 Q_H − Q_L 核对；走完一圈核对回到出发点。
//   四种物质：单原子理想气体；C_{V,m} 随温度变的理想气体；范德瓦耳斯气体（氨的 a、b，内能含 −a/V）；空腔里的辐射
//   （p = αT⁴/3，U = αT⁴V）。后两种明显不是理想气体。
//   对照（说明检验有鉴别力）：压强照范德瓦耳斯、内能却不含 −a/V 的「物质」违反第二定律，它的 Q_L/Q_H 不等于 T_L/T_H。
// 选择题逐条用具体的数造例子或反例（数写在 notes 里）。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.carnot-theorem.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, integrate, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const R = 6.022_140_76e23 * 1.380_649e-23;

/** 一种工作物质：压强、内能对体积和温度的偏导数，都是 (V, T) 的函数；V0 是起点的体积，grow 是等温段膨胀的倍数。 */
interface Substance {
  name: string;
  p(V: number, T: number): number;
  uV(V: number, T: number): number;
  uT(V: number, T: number): number;
  V0: number;
  grow: number;
}

const mono: Substance = { name: '单原子理想气体', p: (V, T) => (R * T) / V, uV: () => 0, uT: () => 1.5 * R, V0: 1e-3, grow: 2 };
const hot: Substance = { name: 'C_V,m 随温度变的理想气体', p: (V, T) => (R * T) / V, uV: () => 0, uT: (_V, T) => R * (2.5 + T / 800), V0: 2e-3, grow: 1.7 };
// 氨的范德瓦耳斯常量约 a = 0.4225 Pa·m⁶/mol²、b = 3.71e-5 m³/mol；C_{V,m} 取 3R
const A_NH3 = 0.4225;
const B_NH3 = 3.71e-5;
const vdw: Substance = {
  name: '范德瓦耳斯气体（氨）',
  p: (V, T) => (R * T) / (V - B_NH3) - A_NH3 / (V * V),
  uV: (V) => A_NH3 / (V * V),
  uT: () => 3 * R,
  V0: 2e-4,
  grow: 1.5,
};
const ALPHA = 7.565_73e-16; // 辐射常量，J/(m³·K⁴)；只影响大小，不影响比值
const photon: Substance = { name: '空腔里的辐射', p: (_V, T) => (ALPHA * T ** 4) / 3, uV: (_V, T) => ALPHA * T ** 4, uT: (V, T) => 4 * ALPHA * T ** 3 * V, V0: 1, grow: 3 };
/** 对照：压强含 −a/V²，内能却不含 −a/V，不满足第二定律要求的关系。 */
const fake: Substance = { ...vdw, name: '违反第二定律的假想物质', uV: () => 0 };

const REAL = [mono, hot, vdw, photon];

/** 等温段：体积从 V1 到 V2，返回吸的热和气体做的功。 */
function isotherm(m: Substance, T: number, V1: number, V2: number): { Q: number; W: number } {
  const a = Math.log(V1);
  const b = Math.log(V2);
  return {
    Q: integrate((s) => (m.p(Math.exp(s), T) + m.uV(Math.exp(s), T)) * Math.exp(s), a, b, 64),
    W: integrate((s) => m.p(Math.exp(s), T) * Math.exp(s), a, b, 64),
  };
}

/** 绝热段：从 (V1, T1) 出发准静态绝热地变到温度 T2，返回终点体积和这一段做的功。 */
function adiabat(m: Substance, V1: number, T1: number, T2: number): { V: number; W: number } {
  if (T1 === T2) return { V: V1, W: 0 };
  const dir = T2 < T1 ? 1 : -1; // 降温 ⇔ 膨胀（这四种物质 p + (∂U/∂V)_T > 0）
  const rhs = (sig: number, y: number[]) => {
    const V = V1 * Math.exp(dir * sig);
    const T = y[0];
    return [(dir * -V * (m.p(V, T) + m.uV(V, T))) / m.uT(V, T), dir * m.p(V, T) * V];
  };
  const hit = rk4Until(rhs, [T1, 0], 0, 2e-4, 400_000, (_sig, y) => (dir > 0 ? T2 - y[0] : y[0] - T2));
  return { V: V1 * Math.exp(dir * hit.t), W: hit.y[1] };
}

interface Cycle {
  QH: number;
  QL: number;
  W: number;
}

/** 可逆的卡诺循环，从 (V0, T_H) 出发；QH、QL 取正值。 */
function cycle(m: Substance, TH: number, TL: number): Cycle {
  const VA = m.V0;
  const VB = VA * m.grow;
  const AB = isotherm(m, TH, VA, VB);
  const BC = adiabat(m, VB, TH, TL);
  const AD = adiabat(m, VA, TH, TL);
  const CD = isotherm(m, TL, BC.V, AD.V);
  const DA = adiabat(m, AD.V, TL, TH);
  agree(DA.V, VA, `${m.name}：走完一圈回到出发点`, 1e-7);
  const QH = AB.Q;
  const QL = -CD.Q;
  const W = AB.W + BC.W + CD.W + DA.W;
  agree(QH - QL, W, `${m.name}：一个循环 ΔU = 0，Q_H − Q_L = ∮p dV`, 1e-6);
  check(QH > 0 && QL > 0 && W > 0, `${m.name}：正着走吸热、放热、净功都为正`);
  return { QH, QL, W };
}

const ratio = (m: Substance, TH: number, TL: number): number => {
  const c = cycle(m, TH, TL);
  return c.QL / c.QH;
};

export const verification: Verification = {
  lesson: 'physics.thermal-physics.carnot-theorem',
  notes: {
    p1: '可逆热机 Q_L/Q_H = T_L/T_H，待测热库在高温一边（它放出的热多），T = 273.16 × 2.40/0.900 ≈ 728.4267 K。第二套：四种工作物质（单原子理想气体、C_V,m 随温度变的理想气体、范德瓦耳斯气体、空腔里的辐射）各走一遍卡诺循环，对高温热库的温度二分，使 Q_L/Q_H = 0.9/2.4，四种都得同一个温度。',
    p2: 'A：四种工作物质在 600 K、300 K 之间的可逆热机效率都是 0.5（按循环积出来），效率 0.4 的就不可逆；另给一个真有 40% 的例子：热从 600 K 的热库隔着温差传给 500 K 的工作物质，再走 500 K、300 K 的卡诺循环，效率 0.4，里面有一步有限温差传热，不可逆。对。B：设另有效率 0.51、0.6、0.9 的热机（600 K、300 K），每吸 100 J 时拿它做的功去倒着开可逆热机（四种物质的循环都试，向 600 K 还回 100 J），合起来高温热库不变、只从 300 K 的热库吸热、全部变成功（例如 0.6 那台：多出 10 J），违反开尔文表述，错；四种物质的可逆效率也都等于 0.5，没有更高的。C：拿 273.16 K、500 K、200 K 三个热库分别当参考，由循环算出的 Q 比定出 600 K、350 K 两个热库的温度比，都是 12/7，错。D：Q_L/Q_H = 0.6，对高温热库 500 K 二分低温热库温度，四种物质都得 300 K = 0.6 × 500 K，对。E：把冰点 273.15 K 定为零、以 1 K 为一度（即摄氏温标），373.15 K 和 273.15 K 的「温度」比是无穷大，可冰点和 373.15 K 之间的可逆热机 Q_L/Q_H = 0.732，也不是 0；再取 373.15 K 和 323.15 K，读数比 50/100 = 0.5，热量比 0.866，对不上，错。所以选 A、D。',
    p3: '制冷机只和两个热库交换热量，可逆时 Q_L/Q_H = 250/295，W = Q_L(T_H/T_L − 1) = 1800 × 0.18 = 324 W（每秒）。第二套：氨当范德瓦耳斯气体，卡诺循环正着走得 Q_H、Q_L、W，倒过来各反号，按比例放大到每秒从冷库取 1800 J；另外三种物质也走一遍。',
    p4: '两台效率相等：1 − T_中/720 = 1 − 320/T_中，T_中 = √(720 × 320) = 480 K，各 1/3；合起来吸 Q_H、放 Q_L，W 总 = Q_H − Q_L，Q_L/Q_H = (480/720)(320/480) = 320/720，效率 5/9。第二套：甲用范德瓦耳斯气体、乙用空腔辐射，对 T_中 二分使两台由循环算出的效率相等；再让乙每个循环吸的热等于甲放的热（按比例放大），总功除以甲吸的热。',
  },
  compute() {
    // ---------- 检验有鉴别力：四种真实物质都满足 Q_L/Q_H = T_L/T_H，违反第二定律的那一种不满足 ----------
    for (const m of REAL) agree(ratio(m, 600, 300), 0.5, `${m.name} 在 600 K、300 K 之间`, 1e-6);
    check(Math.abs(ratio(fake, 600, 300) - 0.5) > 1e-3, '对照：内能不含 −a/V 的假想物质，Q_L/Q_H 不等于 T_L/T_H');

    // ---------- p1（K）----------
    const p1 = (273.16 * 2.4) / 0.9;
    for (const m of REAL) {
      const T = bisect((TH) => ratio(m, TH, 273.16) - 0.9 / 2.4, 400, 1500);
      agree(T, p1, `p1 ${m.name}`, 1e-6);
    }
    // 待测热库放出的热（2.40 kJ）多于三相点的水得到的热（0.900 kJ），热机正着走，待测热库在高温一边
    check(p1 > 273.16, 'p1：待测热库比三相点热');

    // ---------- p2 ----------
    // A
    const eta = REAL.map((m) => {
      const c = cycle(m, 600, 300);
      return c.W / c.QH;
    });
    const optA = eta.every((e) => Math.abs(e - 0.5) < 1e-6) && Math.abs(0.4 - 0.5) > 0.05;
    {
      // 真有 40% 的例子：里面是 500 K、300 K 的卡诺循环，热从 600 K 传给 500 K 的工作物质
      const c = cycle(mono, 500, 300);
      agree(c.W / c.QH, 0.4, 'A：内部 500 K、300 K 的卡诺循环效率 0.4', 1e-6);
    }
    // B：假设有一台效率更高的热机，拿它带着可逆热机（用循环算出的 Q_H、Q_L、W，放大到向高温热库放 100 J）倒着走
    for (const m of REAL) {
      const c = cycle(m, 600, 300);
      const k = 100 / c.QH;
      for (const etaBetter of [0.51, 0.6, 0.9]) {
        const netFromHot = 100 - c.QH * k;
        const netFromCold = c.QL * k - 100 * (1 - etaBetter);
        const netWork = 100 * etaBetter - c.W * k;
        check(Math.abs(netFromHot) < 1e-9 && netFromCold > 0.5 && Math.abs(netWork - netFromCold) < 1e-3, `B：${m.name}，合起来只从一个热库吸热、全部变成功`);
      }
    }
    const optB = eta.some((e) => e > 0.5 + 1e-6);
    // C
    const refs = [273.16, 500, 200];
    const ratios = refs.map((r) => {
      // 用参考热库 r 定出 600 K、350 K 的温度值，只用循环算出的热量比；参考热库自己取任意固定值（这里取 1）
      const val = (T: number): number => (T > r ? 1 / ratio(vdw, T, r) : ratio(vdw, r, T));
      return val(600) / val(350);
    });
    for (const x of ratios) agree(x, 600 / 350, 'C：两个热库的温度之比', 1e-6);
    const optC = !ratios.every((x) => Math.abs(x - ratios[0]) < 1e-6);
    // D
    const TLs = REAL.map((m) => bisect((TL) => ratio(m, 500, TL) - 0.6, 200, 480));
    for (const t of TLs) agree(t, 300, 'D：低温热库', 1e-6);
    const optD = TLs.every((t) => Math.abs(t / 500 - 0.6) < 1e-6);
    // E：摄氏温标那样另选零点
    const rIce = ratio(mono, 373.15, 273.15);
    const rMid = ratio(mono, 373.15, 323.15);
    check(rIce > 0.5 && rMid > 0.8, 'E：可逆热机的热量比不为 0');
    const optE = Math.abs(rIce - (273.15 - 273.15) / (373.15 - 273.15)) < 1e-6 && Math.abs(rMid - (323.15 - 273.15) / (373.15 - 273.15)) < 1e-6;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3（W）----------
    const QL3 = 1800;
    const p3 = QL3 * (295 / 250 - 1);
    for (const m of REAL) {
      const c = cycle(m, 295, 250); // 倒着走：从 250 K 吸 Q_L，向 295 K 放 Q_H，外界做功 W
      const s = QL3 / c.QL;
      agree(c.W * s, p3, `p3 ${m.name}`, 1e-6);
    }

    // ---------- p4 ----------
    const Tm = Math.sqrt(720 * 320);
    const etaTotal = 1 - 320 / 720;
    {
      const eff = (m: Substance, TH: number, TL: number): number => {
        const c = cycle(m, TH, TL);
        return c.W / c.QH;
      };
      const t = bisect((T) => eff(vdw, 720, T) - eff(photon, T, 320), 400, 600);
      agree(t, Tm, 'p4 中间热库的温度', 1e-6);
      const a = cycle(vdw, 720, t);
      const b = cycle(photon, t, 320);
      const s = a.QL / b.QH; // 乙放大到每个循环吸的热等于甲放的热
      agree((a.W + b.W * s) / a.QH, etaTotal, 'p4 合起来的效率', 1e-6);
      agree(eff(vdw, 720, t), 1 / 3, 'p4 每台的效率', 1e-6);
    }

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [Tm, etaTotal] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
