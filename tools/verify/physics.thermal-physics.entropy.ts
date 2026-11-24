// 独立验算 physics.thermal-physics.entropy 的 p1–p4（简单题、中等题）。
// 算法一（闭式）：熵变 = ∫δQ可逆/T；等温时 Q/T；理想气体 ΔS = n(C_{V,m} ln(T2/T1) + R ln(V2/V1))；
// 循环 Σ Q_i/T_i ≤ 0（T_i 是热库的温度）。
// 算法二（不用上面的闭式）：把理想气体的可逆路径 (T(s), V(s)) 一小段一小段走，δQ = nC_{V,m} dT + p dV、p = nRT/V，
// 用复合高斯-勒让德把 δQ/T 加起来；同样两个端点之间换几条不同的路径，核对吸的热各不相同、∫δQ/T 都相同。
// p4 的最小值分两半：界——给每个热库配一台工作在 T0 和 T_i 之间的可逆热机，把净效果化成「只从一个热库 T0 吸热、全部做功」，
//   功是 T0·Σ Q_i/T_i，大于零就违反开尔文表述；放热比 625 J 少时这个功大于零（扫一遍，T0 换几个值）。
//   取得到——真的走两个理想气体卡诺循环（600 K/250 K 吸 900 J，400 K/250 K 吸 400 J），四段都数值积分，放的热加起来正好 625 J。
// 题面没给摩尔气体常量，按 CODATA：R = N_A·k_B；单原子理想气体 C_{V,m} = 3R/2（链上 heat-capacity 由 kinetic-theory 得出）。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.entropy.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, integrate, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const R = 6.022_140_76e23 * 1.380_649e-23;
const LITRE = 1e-3; // m³

/** 一段可逆路径：参数 s 从 0 到 1，给出 (T, V) 和对 s 的导数。 */
interface Path {
  T: (s: number) => number;
  V: (s: number) => number;
  dT: (s: number) => number;
  dV: (s: number) => number;
}

/** 沿一段路径吸的热和 ∫δQ/T（理想气体，n mol，定容摩尔热容 cv）。 */
function along(n: number, cv: number, p: Path): { Q: number; S: number; W: number } {
  const dQ = (s: number) => n * cv * p.dT(s) + ((n * R * p.T(s)) / p.V(s)) * p.dV(s);
  return {
    Q: integrate(dQ, 0, 1, 64, 16),
    S: integrate((s) => dQ(s) / p.T(s), 0, 1, 64, 16),
    W: integrate((s) => ((n * R * p.T(s)) / p.V(s)) * p.dV(s), 0, 1, 64, 16),
  };
}

const total = (parts: { Q: number; S: number; W: number }[]) =>
  parts.reduce((a, b) => ({ Q: a.Q + b.Q, S: a.S + b.S, W: a.W + b.W }), { Q: 0, S: 0, W: 0 });

/** 等温、等容、等压，以及 (T, V) 平面上的直线和一条弯的路径。 */
const isotherm = (T: number, V1: number, V2: number): Path => ({ T: () => T, V: (s) => V1 + s * (V2 - V1), dT: () => 0, dV: () => V2 - V1 });
const isochore = (V: number, T1: number, T2: number): Path => ({ T: (s) => T1 + s * (T2 - T1), V: () => V, dT: () => T2 - T1, dV: () => 0 });
const isobar = (T1: number, V1: number, V2: number): Path => ({
  T: (s) => (T1 / V1) * (V1 + s * (V2 - V1)),
  V: (s) => V1 + s * (V2 - V1),
  dT: () => (T1 / V1) * (V2 - V1),
  dV: () => V2 - V1,
});
const straight = (T1: number, V1: number, T2: number, V2: number): Path => ({
  T: (s) => T1 + s * (T2 - T1),
  V: (s) => V1 + s * (V2 - V1),
  dT: () => T2 - T1,
  dV: () => V2 - V1,
});
const bent = (T1: number, V1: number, T2: number, V2: number): Path => ({
  T: (s) => T1 + s * (T2 - T1) + 0.3 * T1 * Math.sin(Math.PI * s),
  V: (s) => V1 + s * s * (V2 - V1),
  dT: (s) => T2 - T1 + 0.3 * T1 * Math.PI * Math.cos(Math.PI * s),
  dV: (s) => 2 * s * (V2 - V1),
});

/** 准静态绝热段：自变量 σ = ±ln(V/V0)，dT/d ln V = −(R/cv)·T，积到温度变为 Tend；返回终点体积。 */
function adiabatVolume(cv: number, V0: number, T0: number, Tend: number): number {
  const sign = Tend < T0 ? 1 : -1;
  const hit = rk4Until((_x, y) => [(-sign * R * y[0]) / cv], [T0], 0, 1e-4, 2_000_000, (_x, y) => sign * (Tend - y[0]));
  return V0 * Math.exp(sign * hit.t);
}

/** 理想气体卡诺循环：两个等温段用积分，两个绝热段用 RK4 定出体积，核对闭合。 */
function carnot(n: number, cv: number, TH: number, TL: number, VA: number, VB: number) {
  const VC = adiabatVolume(cv, VB, TH, TL);
  const VD = adiabatVolume(cv, VA, TH, TL);
  const ab = along(n, cv, isotherm(TH, VA, VB));
  const cd = along(n, cv, isotherm(TL, VC, VD));
  agree(adiabatVolume(cv, VD, TL, TH), VA, '卡诺循环回到出发点', 1e-8);
  // 绝热段 δQ = 0：功等于内能的减少，来回抵消
  const W = ab.W + n * cv * (TH - TL) + cd.W + n * cv * (TL - TH);
  return { QH: ab.Q, QL: -cd.Q, W, sum: ab.Q / TH + cd.Q / TL };
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.entropy',
  notes: {
    p1: 'ΔS = Q/T = 2100/350 = 6.00 J/K。第二套：取 V1 = 20 L，由 Q = ∫p dV = 2.10 kJ 二分出末态体积，把等温路径的 δQ/T 一小段一小段加起来；另用 C_{V,m} = 3R/2、5R/2 各算一遍，结果和气体的种类无关。',
    p2: 'A 反例一：1 mol 理想气体从 10 L 自由膨胀到 20 L，Q = 0，各小段 δQ/T 之和是 0，可由等温可逆路径算出熵变 R ln2 ≈ 5.76 J/K；反例二（系统时时有温度）：叶轮搅拌绝热刚性容器里的 1 mol 单原子气体，300 K → 360 K，δQ = 0，熵变 1.5R ln1.2 ≈ 2.27 J/K，错。B：自由膨胀（10 L → 20 L）后再可逆等温压回 10 L（300 K），是不可逆循环，Σ Q/T = −R ln2 < 0，而熵变由 S(T,V) 差是 0，对。C：1 mol 单原子气体从 (300 K, 10 L) 到 (450 K, 25 L) 取五条可逆路径（先等容后等温、先等温后等容、先等压后等容、直线、弯的），吸的热两两不同，∫δQ/T 相差 < 1e-9，对。D：600 K/300 K 卡诺循环净吸热 = 净功 > 0，错。E：可逆等温压缩 300 K、20 L → 10 L，Q < 0、ΔS = −R ln2 < 0，错。所以选 B、C。',
    p3: 'ΔS = nR(1.5 ln(450/300) + ln(25/10)) ≈ 25.35 J/K（R 取 CODATA）；R 取 8.31、8.314 时 25.34、25.35，都在默认容差 1e-3 以内。第二套：五条可逆路径数值积分 ∫δQ/T 都一致，吸的热各不相同（熵是状态函数，实际走什么过程不要紧）。',
    p4: '900/600 + 400/400 − Q/250 ≤ 0 ⇒ Q ≥ 625 J，W = 1300 − Q ≤ 675 J。界：扫放热 500–624.9 J，配上 T0 = 700、1000、1500 K 的可逆热机后净效果都是从单一热库吸热全部做功（功 > 0），违反开尔文表述；625 J 时功正好是 0。取得到：两个理想气体卡诺循环（600/250 吸 900 J、400/250 吸 400 J）数值走一遍，放热 375 J + 250 J = 625 J，功 525 J + 150 J = 675 J。',
  },
  compute() {
    const cvMono = 1.5 * R;
    const cvDi = 2.5 * R;

    // ---------- p1（J/K）----------
    const n1 = 1.5;
    const T1 = 350;
    const Q1 = 2100;
    const p1 = Q1 / T1;
    {
      const V1 = 20 * LITRE;
      let lo = V1;
      let hi = 10 * V1;
      for (let k = 0; k < 200; k++) {
        const mid = (lo + hi) / 2;
        if (along(n1, cvMono, isotherm(T1, V1, mid)).Q < Q1) lo = mid;
        else hi = mid;
      }
      const V2 = (lo + hi) / 2;
      for (const cv of [cvMono, cvDi]) {
        const r = along(n1, cv, isotherm(T1, V1, V2));
        agree(r.Q, Q1, 'p1 吸热 2.10 kJ', 1e-9);
        agree(r.S, p1, 'p1 ∫δQ/T', 1e-9);
        check(V2 > V1, 'p1 确实膨胀');
      }
    }

    // ---------- p2 ----------
    const S = (n: number, cv: number, T: number, V: number) => n * cv * Math.log(T) + n * R * Math.log(V);
    // A
    const freeS = S(1, cvMono, 300, 20 * LITRE) - S(1, cvMono, 300, 10 * LITRE);
    agree(along(1, cvMono, isotherm(300, 10 * LITRE, 20 * LITRE)).S, freeS, 'A 反例一：沿可逆等温路径', 1e-9);
    const stirS = S(1, cvMono, 360, 10 * LITRE) - S(1, cvMono, 300, 10 * LITRE);
    agree(along(1, cvMono, isochore(10 * LITRE, 300, 360)).S, stirS, 'A 反例二：沿可逆等容路径', 1e-9);
    const sumFree = 0; // 自由膨胀、搅拌都绝热，δQ = 0
    const optA = Math.abs(freeS - sumFree) < 1e-9 && Math.abs(stirS - sumFree) < 1e-9;
    check(freeS > 5.7 && stirS > 2.2, 'A 的两个反例熵变都大于零');
    // B：自由膨胀 + 可逆等温压回
    const back = along(1, cvMono, isotherm(300, 20 * LITRE, 10 * LITRE));
    const clausius = 0 + back.Q / 300;
    check(clausius < 0, 'B：循环不可逆（Σ Q/T < 0）');
    const cycleDS = freeS + back.S;
    const optB = Math.abs(cycleDS) < 1e-9;
    // C：五条可逆路径
    const ends = { T1: 300, V1: 10 * LITRE, T2: 450, V2: 25 * LITRE };
    const five = (n: number, cv: number) => [
      total([along(n, cv, isochore(ends.V1, ends.T1, ends.T2)), along(n, cv, isotherm(ends.T2, ends.V1, ends.V2))]),
      total([along(n, cv, isotherm(ends.T1, ends.V1, ends.V2)), along(n, cv, isochore(ends.V2, ends.T1, ends.T2))]),
      total([along(n, cv, isobar(ends.T1, ends.V1, ends.V2)), along(n, cv, isochore(ends.V2, (ends.T1 / ends.V1) * ends.V2, ends.T2))]),
      along(n, cv, straight(ends.T1, ends.V1, ends.T2, ends.V2)),
      along(n, cv, bent(ends.T1, ends.V1, ends.T2, ends.V2)),
    ];
    const pathsC = five(1, cvMono);
    let heatsDiffer = true;
    for (let i = 0; i < pathsC.length; i++) {
      for (let j = i + 1; j < pathsC.length; j++) {
        if (Math.abs(pathsC[i].Q - pathsC[j].Q) < 1) heatsDiffer = false;
      }
    }
    const sameS = pathsC.every((r) => Math.abs(r.S - pathsC[0].S) < 1e-9 * Math.abs(pathsC[0].S));
    const optC = heatsDiffer && sameS;
    // D
    const cD = carnot(1, cvMono, 600, 300, 1 * LITRE, 2 * LITRE);
    const netHeat = cD.QH - cD.QL;
    agree(netHeat, cD.W, 'D：一圈 ΔU = 0，净热等于净功', 1e-8);
    agree(cD.QH / 600, cD.QL / 300, 'D：可逆循环 Σ Q/T = 0', 1e-8);
    const optD = Math.abs(netHeat) < 1e-6;
    check(netHeat > 100, 'D 的反例：净吸热大于零');
    // E
    const squeeze = along(1, cvMono, isotherm(300, 20 * LITRE, 10 * LITRE));
    check(squeeze.Q < 0, 'E：可逆放热');
    const optE = squeeze.S > 0;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3（J/K）----------
    const n3 = 2;
    const p3 = n3 * R * (1.5 * Math.log(450 / 300) + Math.log(25 / 10));
    for (const r of five(n3, cvMono)) agree(r.S, p3, 'p3 ∫δQ/T', 1e-9);
    for (const Rr of [8.31, 8.314, 8.3145]) {
      check(Math.abs((p3 * Rr) / R - p3) < 1e-3 * p3, 'p3 R 的常见取值都在默认容差内');
    }

    // ---------- p4（J）----------
    const QL4 = 250 * (900 / 600 + 400 / 400);
    const W4 = 900 + 400 - QL4;
    for (const T0 of [700, 1000, 1500]) {
      // 每个热库配一台工作在 T0 和 T_i 之间的可逆热机：从 T0 吸 (T0/T_i)·Q_i，把 Q_i 送还热库 T_i
      const net = (Q: number) => T0 * (900 / 600 + 400 / 400 - Q / 250);
      for (let Q = 500; Q < 624.95; Q += 0.1) check(net(Q) > 0, 'p4 放热不到 625 J 就违反开尔文表述');
      check(Math.abs(net(QL4)) < 1e-9, 'p4 625 J 时净功为零');
      check(net(626) < 0, 'p4 多放一些是允许的（不可逆）');
      // 第一定律核对：系统的功 + 各台可逆热机的功 = 从 T0 吸的净热
      const engines = [
        [600, 900],
        [400, 400],
        [250, -QL4],
      ].map(([Ti, Qi]) => (T0 / Ti) * Qi - Qi);
      agree(900 + 400 - QL4 + engines.reduce((a, b) => a + b, 0) + 1, net(QL4) + 1, 'p4 合起来的功', 1e-9);
    }
    const c1 = carnot(1, cvMono, 600, 250, 1 * LITRE, 2 * LITRE);
    const c2 = carnot(0.5, cvDi, 400, 250, 1 * LITRE, 3 * LITRE);
    const s1 = 900 / c1.QH;
    const s2 = 400 / c2.QH;
    agree(c1.QL * s1, 375, 'p4 600/250 的卡诺循环放热', 1e-7);
    agree(c2.QL * s2, 250, 'p4 400/250 的卡诺循环放热', 1e-7);
    agree(c1.QL * s1 + c2.QL * s2, QL4, 'p4 放热取得到', 1e-7);
    agree(c1.W * s1 + c2.W * s2, W4, 'p4 功取得到', 1e-7);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [QL4, W4] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
