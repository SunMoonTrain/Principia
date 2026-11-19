// 独立验算 physics.thermal-physics.heat-engines 的 p1–p4（简单题、中等题）。
// 算法一（闭式）：一个循环 ΔU = 0，所以 W = Q_H − Q_L；热机效率 η = W/Q_H；卡诺热机 η = 1 − T_L/T_H，
// 卡诺制冷机的制冷系数 Q_L/W = T_L/(T_H − T_L)。
// 算法二（不用上面两个卡诺式子）：把理想气体的卡诺循环一小步一小步真的走一遍。自变量取 s = ln V：
//   等温段 δQ = δW = nRT ds（ΔU = 0），用高斯-勒让德积分；
//   绝热段 nC_{V,m} dT = −p dV ⇒ dT/ds = −(R/C_{V,m})·T，功 dW/ds = nRT，用四阶龙格-库塔法积到温度等于另一个热库的温度
//   （事件二分停下）。走完一圈核对回到出发点、Q_H − Q_L = W，再按比例放大到题给的功或热量；倒过来走就是卡诺制冷机。
//   工作物质换单原子（C_{V,m} = 3R/2）、双原子（5R/2）两种，循环大小也换两组，核对比值和它们无关。
// 选择题逐条用具体的数造例子或反例（数都写在 notes 里）。
// 题面给了「摄氏温度加 273 K」，p3、p4 按 273 换算。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.heat-engines.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, integrate, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const R = 6.022_140_76e23 * 1.380_649e-23; // 只用来把 n、T 换成 pV，各个比值和 R 的取值无关

/** 等温段：n mol 理想气体在温度 T 下从 V1 变到 V2，气体对外做的功（= 吸的热）。自变量 s = ln V。 */
function isothermWork(n: number, T: number, V1: number, V2: number): number {
  return integrate(() => n * R * T, Math.log(V1), Math.log(V2), 64);
}

/** 绝热段：从 (V0, T0) 出发准静态绝热地变到温度 Tend；返回终点体积和这一段气体对外做的功。 */
function adiabatToT(n: number, cvOverR: number, V0: number, T0: number, Tend: number): { V: number; W: number } {
  const expand = Tend < T0; // 降温 ⇔ 膨胀
  const sign = expand ? 1 : -1; // σ = sign·(ln V − ln V0) 总往正方向积
  const rhs = (_sig: number, y: number[]) => [sign * (-y[0] / cvOverR), sign * (n * R * y[0])];
  const hit = rk4Until(rhs, [T0, 0], 0, 1e-5, 20_000_000, (_sig, y) => (expand ? Tend - y[0] : y[0] - Tend));
  return { V: V0 * Math.exp(sign * hit.t), W: hit.y[1] };
}

interface Cycle {
  QH: number;
  QL: number;
  W: number;
}

/** 理想气体卡诺循环：A→B 在 T_H 下等温膨胀，B→C 绝热膨胀到 T_L，C→D 在 T_L 下等温压缩，D→A 绝热压缩回 A。 */
function carnotCycle(n: number, cvOverR: number, TH: number, TL: number, VA: number, VB: number): Cycle {
  const WAB = isothermWork(n, TH, VA, VB);
  const BC = adiabatToT(n, cvOverR, VB, TH, TL);
  agree(BC.W, n * cvOverR * R * (TH - TL), '绝热膨胀做的功等于内能的减少', 1e-7);
  const AD = adiabatToT(n, cvOverR, VA, TH, TL); // 过 A 的绝热线和 T_L 等温线交于 D
  const WCD = isothermWork(n, TL, BC.V, AD.V);
  const DA = adiabatToT(n, cvOverR, AD.V, TL, TH);
  agree(DA.V, VA, '绝热压缩回到出发点', 1e-7);
  const W = WAB + BC.W + WCD + DA.W;
  const QH = WAB;
  const QL = -WCD;
  check(QH > 0 && QL > 0 && W > 0, '正向走：吸热、放热、净功都为正');
  agree(QH - QL, W, '一个循环 ΔU = 0：Q_H − Q_L = W', 1e-7);
  return { QH, QL, W };
}

/** 卡诺热机效率：两种气体、两组大小各走一遍，核对一致。 */
function etaCarnot(TH: number, TL: number): number {
  const a = carnotCycle(1, 1.5, TH, TL, 1e-3, 2e-3);
  const b = carnotCycle(0.3, 2.5, TH, TL, 5e-3, 1.1e-2);
  const e = agree(a.W / a.QH, b.W / b.QH, `卡诺热机效率与工作物质、循环大小无关（${TH} K/${TL} K）`, 1e-7);
  agree(e, 1 - TL / TH, `卡诺热机效率的闭式（${TH} K/${TL} K）`, 1e-7);
  return e;
}

/** 卡诺制冷机的制冷系数：同一个循环倒过来走，从低温热库吸 Q_L、外界做功 W（大小同正向的净功），系数 Q_L/W。 */
function copCarnot(TH: number, TL: number): number {
  const a = carnotCycle(1, 1.5, TH, TL, 1e-3, 2e-3);
  const b = carnotCycle(2, 2.5, TH, TL, 3e-3, 3.5e-3);
  const c = agree(a.QL / a.W, b.QL / b.W, `制冷系数与工作物质、循环大小无关（${TH} K/${TL} K）`, 1e-7);
  agree(c, TL / (TH - TL), `制冷系数的闭式（${TH} K/${TL} K）`, 1e-7);
  return c;
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.heat-engines',
  notes: {
    p1: '一个循环 ΔU = 0，W = Q_H − Q_L = 0.8 kJ，η = W/Q_H = 0.8/3.2 = 0.25；再拿 T_L/T_H = 0.75 的卡诺循环（真的走一遍，Q_L/Q_H = 0.75）放大到 Q_H = 3.2 kJ 核对。',
    p2: 'A 反例：两台卡诺热机都用 1 mol 单原子气体，600 K/300 K、等温段 1 L→1.1 L（η = 0.5，W ≈ 238 J）和 400 K/300 K、1 L→5 L（η = 0.25，W ≈ 1338 J）——效率高的做功反而少，错。B：500/300 时 0.4，T_H 升到 600 K 得 0.5（+0.1），T_L 降到 200 K 得 0.6（+0.2），错。C：500/300 之间制冷系数 1.5，热机效率的倒数 2.5 = 1 + 1.5，错（倒数是热泵向高温热库放的热和功之比）。D：450/300 和 900/600 都是 1/3，对。E：冷藏室 255 K、取走 1000 J，厨房 310、300、290、280、260 K 时倒着走卡诺循环要的功依次变少；再在 256–420 K 每隔 1 K 用 W = Q_L(T_H/T_L − 1) 扫一遍单调，对。所以选 D、E。',
    p3: 'T_H = 427 + 273 = 700 K，T_L = 300 K，η = 4/7，Q_H = W/η = 2.1 kJ，Q_L = Q_H − W = 0.9 kJ；两种气体各走一遍卡诺循环，按比例放大到 W = 1.2 kJ 核对。',
    p4: 'T_L = 273 K，T_H = 300 K，制冷系数 273/27，W = Q_L·27/273 = 3.34×10⁵ × 27/273 ≈ 3.303×10⁴ J；把卡诺循环倒过来走一遍，按比例放大到 Q_L = 3.34×10⁵ J 核对。',
  },
  compute() {
    // ---------- p1（kJ）----------
    const QH1 = 3.2;
    const QL1 = 2.4;
    const W1 = QH1 - QL1;
    const eta1 = W1 / QH1;
    {
      const c = carnotCycle(1, 1.5, 400, 300, 1e-3, 2e-3); // T_L/T_H = 0.75
      const s = QH1 / c.QH;
      agree(c.QL * s, QL1, 'p1：T_L/T_H = 0.75 的卡诺循环放大后放热 2.4 kJ', 1e-7);
      agree((c.W * s) / QH1, eta1, 'p1：走循环算的效率', 1e-7);
    }

    // ---------- p2 ----------
    // A：效率高的那台未必每个循环做功多
    const hi = carnotCycle(1, 1.5, 600, 300, 1e-3, 1.1e-3);
    const lo = carnotCycle(1, 1.5, 400, 300, 1e-3, 5e-3);
    check(hi.W / hi.QH > lo.W / lo.QH && hi.W < lo.W, 'A 的反例：效率高的做功少');
    const optA = false;
    // B
    const e0 = etaCarnot(500, 300);
    const eUp = etaCarnot(600, 300);
    const eDown = etaCarnot(500, 200);
    const optB = Math.abs(eUp - e0 - (eDown - e0)) < 1e-9;
    check(!optB && eDown - e0 > eUp - e0, 'B：降低 T_L 提高得更多');
    // C
    const cop = copCarnot(500, 300);
    const optC = Math.abs(cop - 1 / e0) < 1e-9;
    agree(1 / e0, 1 + cop, 'C：效率的倒数等于 1 + 制冷系数', 1e-7);
    // D
    const eD1 = etaCarnot(450, 300);
    const eD2 = etaCarnot(900, 600);
    const optD = Math.abs(eD1 - eD2) < 1e-7;
    // E：冷藏室温度不变，厨房降温
    const TLE = 255;
    const QLE = 1000;
    const work = [310, 300, 290, 280, 260].map((TH) => QLE / copCarnot(TH, TLE));
    let decreasing = work.every((w, i) => i === 0 || w < work[i - 1]);
    let prev = Infinity;
    for (let TH = 420; TH >= 256; TH--) {
      const w = QLE * (TH / TLE - 1);
      if (!(w < prev)) decreasing = false;
      prev = w;
    }
    const optE = decreasing;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3（kJ）----------
    const TH3 = 427 + 273;
    const TL3 = 27 + 273;
    const W3 = 1.2;
    const QH3 = W3 / (1 - TL3 / TH3);
    const QL3 = QH3 - W3;
    for (const c of [carnotCycle(1, 1.5, TH3, TL3, 1e-3, 2e-3), carnotCycle(0.3, 2.5, TH3, TL3, 5e-3, 1.1e-2)]) {
      const s = W3 / c.W;
      agree(c.QH * s, QH3, 'p3：走循环算 Q_H', 1e-7);
      agree(c.QL * s, QL3, 'p3：走循环算 Q_L', 1e-7);
    }

    // ---------- p4（J）----------
    const QL4 = 3.34e5;
    const TL4 = 0 + 273;
    const TH4 = 27 + 273;
    const W4 = QL4 / (TL4 / (TH4 - TL4));
    for (const c of [carnotCycle(1, 1.5, TH4, TL4, 1e-3, 2e-3), carnotCycle(2, 2.5, TH4, TL4, 3e-3, 3.5e-3)]) {
      const s = QL4 / c.QL; // 倒过来走：从冷的一边吸 Q_L，外界做功 W
      agree(c.W * s, W4, 'p4：倒着走循环算功', 1e-7);
    }

    return {
      p1: { type: 'number', value: eta1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [QH3, QL3] },
      p4: { type: 'number', value: W4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
