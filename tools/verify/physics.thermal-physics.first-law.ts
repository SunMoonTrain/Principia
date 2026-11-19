// 独立验算 physics.thermal-physics.first-law 的 p1–p4（简单题、中等题）。
// 两套算法：一是本节的 Q = ΔU + W（W 是气体对外做的功）；二是换一条路：
// p1 用高中课本的 ΔU = Q + W'（W' 是外界做的功），再在 p-V 图上造一条直线过程，让 Q、W' 正好取题给的值，
// 用状态函数 U = (3/2)pV 直接算 ΔU；p3 沿等压过程把 δQ = dU + p dV 对体积数值积分，并换两个物质的量核对与 n 无关；
// p4 用「循环一周 ΔU = 0，净功等于净吸热」。选择题逐条用具体的数造例子（反例或正例）核对。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.first-law.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, integrate } from './physics.newtonian-mechanics._nm.ts';

const R = 8.314462618;

/** 理想气体 p-V 图上从 (p1, V1) 到 (p2, V2) 的直线过程：内能取 U = (f/2)pV，返回 ΔU、气体对外做的功、吸收的热量（数值积分）。 */
function linePath(f: number, p1: number, V1: number, p2: number, V2: number): { dU: number; W: number; Q: number } {
  const p = (V: number) => p1 + ((p2 - p1) * (V - V1)) / (V2 - V1);
  const U = (V: number) => (f / 2) * p(V) * V;
  const W = integrate(p, V1, V2);
  // δQ = dU + p dV，沿路径对 V 积分；dU/dV 用解析的导数 (f/2)(p'V + p)
  const slope = (p2 - p1) / (V2 - V1);
  const Q = integrate((V) => (f / 2) * (slope * V + p(V)) + p(V), V1, V2);
  return { dU: U(V2) - U(V1), W, Q };
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.first-law',
  notes: {
    p1: '本节约定 Q = ΔU + W，W 是气体对外做的功 = −170 J，ΔU = 360 − (−170)；和高中课本的 ΔU = Q + W′（W′ = 170 J 是外界做的功）核对；再在 p-V 图上从 (1.0×10⁵ Pa, 2.0 L) 出发造一条直线准静态过程（单原子 U = (3/2)pV），二分定出终点使外界做功恰为 170 J、吸热恰为 360 J，用状态函数直接算 ΔU。',
    p2: '逐条用例子：A 单原子理想气体沿 p-V 直线从 (1×10⁵ Pa, 2 L) 压到 (5×10⁵ Pa, 0.5 L)，ΔU = +75 J 而 Q = −375 J（错）；B 1×10⁵ Pa 下从 1 L 等压膨胀到 2 L，外界做的功 W′ = −100 J < 0（错）；C 1×10⁵ Pa 下从 2 L 等压压缩到 1 L，外界做功 100 J，单原子放热 250 J、双原子放热 350 J，都大于 100 J（对）；D 1 mol、300 K 从 1 L 自由膨胀到 2 L，Q = W = 0，而同样始末状态的等温过程（定义要求准静态）W = Q = RT ln2 ≈ 1729 J，两者不是同一个过程，自由膨胀中间不是平衡态，不算等温过程（错）；E 1 mol 单原子 300 K、1 L，用恒定外压（初压的 2 倍）突然压缩到新的平衡，外界做功为正，T 升到 420 K；准静态绝热（pV^γ 不变）从 2 L 压到 1 L，T 升到 300×2^(2/3) K（对）。',
    p3: 'W = pΔV = 1.2×10⁵ × 3.0×10⁻³ = 360 J，ΔU = (3/2)Δ(pV) = 540 J，Q = 900 J；和数值积分核对：δQ/dV = (3/2)p + p 对 V 从 10.0 L 积到 13.0 L；再取 n = 0.5 mol 和 n = 2 mol 分别由 T = pV/(nR) 算 ΔU = (3/2)nRΔT，确认与 n 无关。',
    p4: '逐段：1→2 W = 1200 − 400 = 800 J；2→3 Q = 0，ΔU = −300 J；循环 ΔU 总和为 0，3→1 的 ΔU = −100 J，W = −700 − (−100) = −600 J，外界做功 600 J；和「净功 = 净吸热」核对：净功 = 1200 + 0 − 700 = 500 J，W₃₁ = 500 − 800 − 300。',
  },
  compute() {
    // ---------- p1（J）----------
    const Q1 = 360;
    const Won1 = 170; // 外界对气体做的功
    const W1 = -Won1; // 本节的 W：气体对外做的功
    const dU1 = Q1 - W1;
    const dU1HighSchool = Q1 + Won1;
    agree(dU1HighSchool, dU1, 'p1 两种符号约定', 1e-12);
    // 造一条直线过程：起点 (1e5 Pa, 2e-3 m³)，终点体积 V2 < V1。先对给定 V2 二分出 p2 使外界做功 = 170 J，再对 V2 二分使吸热 = 360 J。
    const pA = 1e5;
    const VA = 2e-3;
    const p2For = (V2: number) => {
      // 外界做功 = −W = −(pA + p2)/2 (V2 − VA) = 170 ⇒ p2 = 2·170/(VA − V2) − pA
      return (2 * Won1) / (VA - V2) - pA;
    };
    const heatFor = (V2: number) => linePath(3, pA, VA, p2For(V2), V2).Q - Q1;
    const V2 = bisect(heatFor, 0.2e-3, 1.9e-3);
    const path1 = linePath(3, pA, VA, p2For(V2), V2);
    check(Math.abs(-path1.W - Won1) < 1e-9 && Math.abs(path1.Q - Q1) < 1e-8, 'p1 造出的过程满足题给的热量和功');
    const p1 = agree(path1.dU, dU1, 'p1 用状态函数直接算 ΔU', 1e-9);

    // ---------- p2 ----------
    // A：内能增加却放热
    const a = linePath(3, 1e5, 2e-3, 5e5, 0.5e-3);
    check(a.dU > 0 && a.Q < 0, 'A 的反例：ΔU > 0 而 Q < 0');
    const optA = false;
    // B：高中课本的 W 是外界做的功，等压膨胀时为负
    const WonB = -1e5 * (2e-3 - 1e-3);
    check(WonB < 0, 'B：等压膨胀时外界做的功为负');
    const optB = WonB > 0;
    // C：等压压缩时放出的热量 = 外界做的功 + 内能的减少量
    const cCase = (f: number) => {
      const p = 1e5;
      const Va = 2e-3;
      const Vb = 1e-3;
      const Won = p * (Va - Vb);
      const dU = (f / 2) * p * (Vb - Va);
      const Q = dU + p * (Vb - Va); // Q = ΔU + W
      return { released: -Q, Won };
    };
    const c3 = cCase(3);
    const c5 = cCase(5);
    const optC = c3.released > c3.Won && c5.released > c5.Won;
    // D：自由膨胀始末温度相同，可中间不是平衡态；同样始末状态的等温过程（准静态）要做功、吸热
    const nD = 1;
    const TD = 300;
    const WfreeD = 0;
    const QfreeD = 0;
    const WisoD = integrate((V) => (nD * R * TD) / V, 1e-3, 2e-3);
    agree(WisoD, nD * R * TD * Math.log(2), 'D 等温过程的功', 1e-12);
    check(WisoD > 1000 && WfreeD === 0 && QfreeD === 0, 'D：自由膨胀和等温过程的功、热量不同');
    const optD = false;
    // E：绝热压缩，外界做功为正，内能增加，理想气体温度升高
    const n = 1;
    const T0 = 300;
    const V0 = 1e-3;
    const p0 = (n * R * T0) / V0;
    const pExt = 2 * p0;
    // 末态 pExt·Vf = nRTf，(3/2)nR(Tf − T0) = pExt(V0 − Vf) ⇒ (3/2)nR(Tf − T0) = pExt V0 − nRTf
    const Tf = (1.5 * n * R * T0 + pExt * V0) / (2.5 * n * R);
    agree(Tf, 420, 'E 突然压缩后的温度', 1e-12);
    const Vf = (n * R * Tf) / pExt;
    check(Vf < V0, 'E：确实被压缩');
    const gamma = 5 / 3;
    const Tadiabatic = T0 * Math.pow(2e-3 / 1e-3, gamma - 1);
    const optE = Tf > T0 && Tadiabatic > T0;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3（J）----------
    const p = 1.2e5;
    const Va = 10.0e-3;
    const Vb = 13.0e-3;
    const W3 = p * (Vb - Va);
    const dU3 = 1.5 * p * (Vb - Va);
    const Q3 = dU3 + W3;
    const Q3num = integrate(() => 1.5 * p + p, Va, Vb);
    for (const nn of [0.5, 2]) {
      const Ta = (p * Va) / (nn * R);
      const Tb = (p * Vb) / (nn * R);
      agree(1.5 * nn * R * (Tb - Ta) + W3, Q3, `p3 取 n = ${nn} mol`, 1e-12);
    }
    const p3 = agree(Q3num, Q3, 'p3 数值积分', 1e-12);

    // ---------- p4（J）----------
    const Q12 = 1200;
    const dU12 = 400;
    const W12 = Q12 - dU12;
    const Q23 = 0;
    const W23 = 300;
    const dU23 = Q23 - W23;
    const Q31 = -700;
    const dU31 = -(dU12 + dU23);
    const W31 = Q31 - dU31;
    const Wnet = Q12 + Q23 + Q31;
    agree(Wnet - W12 - W23, W31, 'p4 净功 = 净吸热', 1e-12);
    const p4 = -W31; // 外界对气体做的功

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
