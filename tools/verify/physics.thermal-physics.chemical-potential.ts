// 独立验算 physics.thermal-physics.chemical-potential 的 p1–p4（简单题、中等题）。
// 题面没给 R，按 CODATA 取精确值 R = N_A·k_B（两个定义值的乘积，8.314 462 618…）。
// 只从「熵对 U、V、n 的函数」出发，不套 G = μN、ΔS = Δμ·ΔN/T 这些讲解里的结论：
//   理想气体 S(U, V, n) = nR[ln(V/n) + c·ln(U/(ncR)) + s₀]（c = C_{V,m}/R，s₀ 任取，取两个值核对结果和它无关）；
//   范德瓦耳斯气体 F(T, V, n) = F_理想(T, V − nb, n) − an²/V，当「不是理想气体」的检验例子。
// 化学势一律按定义用数值求导得出：μ = −T(∂S/∂n)_{U,V} 或 (∂F/∂n)_{T,V}（五点差分）。
// 平衡态一律数值求总熵的最大（或恒温时总自由能的最小），再和分压、指数的闭式核对。
// 选择题逐条用具体的数造例子或反例（数都写在 notes 里）。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.chemical-potential.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, bisect, check, chosen } from './physics.electromagnetism._es.ts';

const R = 6.022_140_76e23 * 1.380_649e-23; // J/(mol·K)

/** 理想气体的熵（n 用 mol）。 */
const entropyIdeal = (U: number, V: number, n: number, c: number, s0: number): number =>
  n * R * (Math.log(V / n) + c * Math.log(U / (n * c * R)) + s0);

/** 两个状态的熵差 S(U+du, V, n+dn) − S(U, V, n)，用 log1p 写，避免大数相减丢精度。 */
function entropyChange(U: number, V: number, n: number, du: number, dn: number, c: number, s0: number): number {
  // S = nR[ln V + c ln U − (1 + c) ln n − c ln(cR) + s0]
  const bracket = Math.log(V / n) + c * Math.log(U / (n * c * R)) + s0;
  const change = c * Math.log1p(du / U) - (1 + c) * Math.log1p(dn / n);
  return R * (dn * bracket + (n + dn) * change);
}

/** 五点差分。 */
const d5 = (f: (x: number) => number, x: number, h: number): number =>
  (f(x - 2 * h) - 8 * f(x - h) + 8 * f(x + h) - f(x + 2 * h)) / (12 * h);

/** 理想气体每摩尔的化学势，按定义 −T(∂S/∂n)_{U,V} 数值求导；T 由 U = ncRT 给出。 */
function muIdeal(T: number, V: number, n: number, c: number, s0: number): number {
  const U = n * c * R * T;
  return -T * d5((x) => entropyIdeal(U, V, x, c, s0), n, 1e-3 * n);
}

/** 亥姆霍兹自由能 F = U − TS（理想气体）。 */
const freeIdeal = (T: number, V: number, n: number, c: number, s0: number): number => {
  const U = n * c * R * T;
  return U - T * entropyIdeal(U, V, n, c, s0);
};

/** 范德瓦耳斯气体的亥姆霍兹自由能（a、b 用氩的数）。 */
const aVdw = 0.1355;
const bVdw = 3.2e-5;
const freeVdw = (T: number, V: number, n: number): number => freeIdeal(T, V - n * bVdw, n, 1.5, 3) - (aVdw * n * n) / V;
const pVdw = (T: number, V: number, n: number): number => (n * R * T) / (V - n * bVdw) - (aVdw * n * n) / (V * V);

export const verification: Verification = {
  lesson: 'physics.thermal-physics.chemical-potential',
  notes: {
    p1: '两个很大的理想气体部分（各 10⁴、10⁶、10⁸ mol），300 K，体积取得使每摩尔化学势（按 −T∂S/∂n 数值求导）正好差 500 J/mol；把 0.20 mol 从甲搬到乙（体积不变，总内能不变），直接算总熵的变化，随两部分变大趋于 1/3 J/K；这 0.20 mol 带走的能量取 0、cRT·0.2、1000 J、−500 J 四种，极限都一样（两边温度相等，搬能量不改总熵）；气体换单原子（c = 3/2）、双原子（c = 5/2）。标准值 500×0.20/300 = 1/3。',
    p2: 'A：理想气体（300 K、10⁵ Pa）和范德瓦耳斯氩（150 K、2×10⁶ Pa 以及 300 K、10⁷ Pa）各取 1 mol、2 mol，化学势按定义数值求导，相同（对）。B：同样的状态数值求 (∂G/∂n)_{T,V}，比 (∂F/∂n)_{T,V} 大 V(∂p/∂n)_{T,V}（理想气体正好大 RT ≈ 2494 J/mol），错。C：300 K、两边容积 1 m³ 和 2 m³，总共 3 mol，总熵最大时是 1 mol 和 2 mol，此时两边化学势相等、粒子数不等，错；粒子数相等（各 1.5 mol）时总熵还没到最大，还会继续流。D：水分子能穿过液面进出（不饱和时净蒸发，饱和后进出仍在进行），按「能和外界交换粒子的系统」是开放系统，用一个蒸发-凝结的小模拟核对液态水的粒子数在变，对。E：理想气体 1 mol 的 F 和 μn 差 −pV（≈ −2494 J），范德瓦耳斯氩同样差 −pV，错；G − μn 则在 10⁻⁷ 以内为零。所以选 A、D。',
    p3: '闭式 exp(−Mgz/RT)，M = 0.029、g = 9.8、z = 5000、T = 280、R 取精确值，得 0.543143…（R 取 8.314、8.31 时三位有效数字都是 0.543）。和两条路核对：一是静力学平衡 dp/dz = −pMg/(RT) 用 RK4 从 0 积到 5 km；二是把气柱分成 51 层（每层高 100 m，T 固定），每层的化学势按定义数值求导，让粒子在相邻层之间按「化学势 + Mgz」的差一小步一小步流动，直到不再流，读出顶层和底层的压强之比。',
    p4: '左右各 1 m³、300 K：总自由能（左边氮 + 右边氮 + 右边别的气体，按各成分互不影响的理想混合）对左边氮的物质的量求最小（先数值求最小，再解导数为零的方程），得两边氮的分压都是 89 kPa，左 89、右 89 + 22 = 111；另用「按化学势差流动」模拟到平衡核对。',
  },
  compute() {
    // ---------- p1（J/K）----------
    const T1 = 300;
    const dMu = 500;
    const moved = 0.2;
    for (const c of [1.5, 2.5]) {
      for (const s0 of [0, 7]) {
        let last = Number.NaN;
        for (const size of [1e4, 1e6, 1e8]) {
          const nA = size;
          const nB = size;
          // 甲：体积 VA；乙：体积 VB，解出使每摩尔化学势差正好是 500 J/mol 的 VB
          const VA = size * 0.02;
          const muA = muIdeal(T1, VA, nA, c, s0);
          const VB = bisect((v) => muA - muIdeal(T1, v, nB, c, s0) - dMu, VA, VA * 10);
          const UA = nA * c * R * T1;
          const UB = nB * c * R * T1;
          for (const carried of [0, c * R * T1 * moved, 1000, -500]) {
            const dS =
              entropyChange(UA, VA, nA, -carried, -moved, c, s0) + entropyChange(UB, VB, nB, carried, moved, c, s0);
            if (size === 1e8) {
              agree(dS, (dMu * moved) / T1, `p1 总熵增加（c = ${c}，带走能量 ${carried.toFixed(0)} J，${size} mol）`, 1e-5);
            }
            last = dS;
          }
        }
        check(Number.isFinite(last), 'p1 数值有限');
      }
    }
    const p1 = (dMu * moved) / T1;

    // ---------- p2 ----------
    // A：温度、压强都相同的 1 mol、2 mol 同一种气体
    let optA = true;
    for (const [c, s0] of [
      [1.5, 0],
      [2.5, 7],
    ] as const) {
      const V = (R * 300) / 1e5; // 1 mol、300 K、10⁵ Pa
      const m1 = muIdeal(300, V, 1, c, s0);
      const m2 = muIdeal(300, 2 * V, 2, c, s0);
      if (Math.abs(m1 - m2) > 1e-6 * Math.abs(m1)) optA = false;
    }
    for (const [T, p] of [
      [150, 2e6],
      [300, 1e7],
    ] as const) {
      // 1 mol 在 (T, p) 的体积（取最大的根，气态）
      const V1 = bisect((v) => pVdw(T, v, 1) - p, (R * T) / p / 3 > bVdw * 1.2 ? (R * T) / p / 3 : bVdw * 1.2, ((R * T) / p) * 2);
      check(Math.abs(pVdw(T, 2 * V1, 2) - p) < 1e-6 * p, 'p2 A：2 mol 占两倍体积时压强相同');
      const mu1 = d5((x) => freeVdw(T, V1, x), 1, 1e-3);
      const mu2 = d5((x) => freeVdw(T, 2 * V1, x), 2, 2e-3);
      if (Math.abs(mu1 - mu2) > 1e-6 * Math.abs(mu1)) optA = false;
    }
    // B：(∂G/∂n)_{T,V} 和 μ
    let optB = true;
    let bDiff = 0;
    {
      const T = 300;
      const V = (R * T) / 1e5;
      const G = (n: number): number => freeIdeal(T, V, n, 1.5, 3) + ((n * R * T) / V) * V;
      const mu = d5((x) => freeIdeal(T, V, x, 1.5, 3), 1, 1e-3);
      agree(mu, muIdeal(T, V, 1, 1.5, 3), 'p2 B：两种定义的 μ 一致', 1e-7);
      const dG = d5(G, 1, 1e-3);
      bDiff = dG - mu;
      if (Math.abs(bDiff) > 1) optB = false;
      agree(bDiff, R * T, 'p2 B：理想气体差 RT', 1e-7);
      const Tv = 300;
      const Vv = 1e-3;
      const Gv = (n: number): number => freeVdw(Tv, Vv, n) + pVdw(Tv, Vv, n) * Vv;
      const muv = d5((x) => freeVdw(Tv, Vv, x), 1, 1e-3);
      const dGv = d5(Gv, 1, 1e-3);
      if (Math.abs(dGv - muv) > 1) optB = false;
    }
    // C：壁固定、温度相同，容积 1 m³ 和 2 m³，共 3 mol；总熵最大（总内能一定、温度处处 300 K）
    const totalS = (nA: number): number => {
      const c = 1.5;
      const n = 3;
      // 能量按温度相等分配（两边温度相同）
      return (
        entropyIdeal(nA * c * R * 300, 1, nA, c, 3) + entropyIdeal((n - nA) * c * R * 300, 2, n - nA, c, 3)
      );
    };
    const nStar = argmax(totalS, 0.01, 2.99);
    agree(nStar, 1, 'p2 C：平衡时小容器里 1 mol', 1e-6);
    const muLeft = muIdeal(300, 1, nStar, 1.5, 3);
    const muRight = muIdeal(300, 2, 3 - nStar, 1.5, 3);
    agree(muLeft, muRight, 'p2 C：平衡时化学势相等', 1e-6);
    const optC = Math.abs(nStar - (3 - nStar)) < 1e-6; // 「流到粒子数相等为止」
    check(totalS(1) > totalS(1.5) + 1e-3, 'p2 C：粒子数相等时总熵还没有最大');
    // D：液态水和水蒸气之间的蒸发、凝结
    let liquid = 1e6;
    let vapor = 0;
    let crossings = 0;
    for (let step = 0; step < 4000; step++) {
      const evap = 100; // 每步蒸发的分子数只由温度定
      const cond = vapor * 0.05; // 每步凝结的分子数正比于蒸气的分子数
      liquid += cond - evap;
      vapor += evap - cond;
      crossings += evap + cond;
    }
    const optD = Math.abs(liquid - 1e6) > 100 && crossings > 0; // 粒子数变过，到平衡以后进出还在继续
    check(Math.abs(vapor - 2000) < 1e-6 * 2000, 'p2 D：蒸气到饱和');
    // E：F 和 μn
    let optE = true;
    {
      const T = 300;
      const V = (R * T) / 1e5;
      const n = 1;
      const mu = d5((x) => freeIdeal(T, V, x, 1.5, 3), n, 1e-3);
      const F = freeIdeal(T, V, n, 1.5, 3);
      const p = (n * R * T) / V;
      if (Math.abs(F - mu * n) > 1) optE = false;
      agree(F + p * V - mu * n + 1, 1, 'p2 E：理想气体 G = μn', 1e-5);
      agree(F - mu * n, -p * V, 'p2 E：F − μn = −pV', 1e-6);
      const Fv = freeVdw(T, 1e-3, 1);
      const muv = d5((x) => freeVdw(T, 1e-3, x), 1, 1e-3);
      if (Math.abs(Fv - muv) > 1) optE = false;
      agree(Fv - muv, -pVdw(T, 1e-3, 1) * 1e-3, 'p2 E：范德瓦耳斯气体 F − μn = −pV', 1e-6);
    }
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3 ----------
    const M = 0.029;
    const g = 9.8;
    const z3 = 5000;
    const T3 = 280;
    const p3 = Math.exp((-M * g * z3) / (R * T3));
    {
      let p = 1;
      const N = 5000;
      const h = z3 / N;
      const f = (q: number): number => (-q * M * g) / (R * T3);
      for (let i = 0; i < N; i++) {
        const k1 = f(p);
        const k2 = f(p + (h / 2) * k1);
        const k3 = f(p + (h / 2) * k2);
        const k4 = f(p + h * k3);
        p += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
      }
      agree(p, p3, 'p3 静力学平衡积分', 1e-9);
      // 分层：每层 1 m² × 100 m 的固定体积，T 固定；先由「化学势（数值求导）+ Mgz 处处相等」反解各层的物质的量
      const layers = 51;
      const Vlayer = 100;
      const n0 = 4000; // 底层的物质的量
      const base = muIdeal(T3, Vlayer, n0, 2.5, 3);
      const nTop = bisect(
        (x) => muIdeal(T3, Vlayer, x, 2.5, 3) + M * g * z3 - base,
        1e-3 * n0,
        n0,
      );
      agree(nTop / n0, p3, 'p3 分层：化学势 + Mgz 相等反解', 1e-6);
      // 流动模拟：相邻两层之间的流量正比于 (μ + Mgz) 之差（乘以两层物质的量的几何平均），小步长显式走
      const n: number[] = Array.from({ length: layers }, () => 3000);
      const total0 = n.reduce((s, x) => s + x, 0);
      const muClosed = (k: number): number => R * T3 * Math.log(n[k]) + M * g * 100 * k; // 只差与 k 无关的常数
      // 先核对 muClosed 和按定义求导的 μ 只差常数
      const d1 = muIdeal(T3, Vlayer, 3000, 2.5, 3) - R * T3 * Math.log(3000);
      const d2 = muIdeal(T3, Vlayer, 1000, 2.5, 3) - R * T3 * Math.log(1000);
      agree(d1, d2, 'p3 分层：μ − RT ln n 与 n 无关', 1e-7);
      for (let step = 0; step < 60000; step++) {
        const flow: number[] = [];
        for (let k = 0; k + 1 < layers; k++) {
          const drive = muClosed(k) - muClosed(k + 1);
          flow.push(0.2 * Math.sqrt(n[k] * n[k + 1]) * (drive / (R * T3)));
        }
        for (let k = 0; k + 1 < layers; k++) {
          n[k] -= flow[k];
          n[k + 1] += flow[k];
        }
      }
      const total1 = n.reduce((s, x) => s + x, 0);
      agree(total1, total0, 'p3 流动模拟：总物质的量守恒', 1e-9);
      agree(n[layers - 1] / n[0], p3, 'p3 流动模拟：顶层和底层的压强之比', 1e-6);
      console.log(
        `  p3：R 取精确值 ${p3.toPrecision(8)}，取 8.314 得 ${Math.exp((-M * g * z3) / (8.314 * T3)).toPrecision(8)}，取 8.31 得 ${Math.exp((-M * g * z3) / (8.31 * T3)).toPrecision(8)}，流动模拟 ${(n[layers - 1] / n[0]).toPrecision(8)}`,
      );
    }

    // ---------- p4（kPa）----------
    const T4 = 300;
    const Vbox = 1;
    const nL0 = (100e3 * Vbox) / (R * T4);
    const nR0 = (78e3 * Vbox) / (R * T4);
    const other = (22e3 * Vbox) / (R * T4);
    const nTot = nL0 + nR0;
    const totalF = (nl: number): number =>
      freeIdeal(T4, Vbox, nl, 2.5, 3) + freeIdeal(T4, Vbox, nTot - nl, 2.5, 3) + freeIdeal(T4, Vbox, other, 1.5, 9);
    const nlMin = argmax((x) => -totalF(x), 0.01 * nTot, 0.99 * nTot);
    // 自由能在最小值附近很平，先用黄金分割估计，再用导数为零精确求根
    const nlRoot = bisect((x) => muIdeal(T4, Vbox, x, 2.5, 3) - muIdeal(T4, Vbox, nTot - x, 2.5, 3), 0.05 * nTot, 0.95 * nTot);
    agree(nlMin, nlRoot, 'p4 自由能最小的位置', 1e-5);
    const pL = (nlRoot * R * T4) / Vbox / 1e3;
    const pR = ((nTot - nlRoot) * R * T4) / Vbox / 1e3 + 22;
    agree(pL, 89, 'p4 左边', 1e-7);
    agree(pR, 111, 'p4 右边', 1e-7);
    // 流动模拟
    let a = nL0;
    let b = nR0;
    for (let step = 0; step < 20000; step++) {
      const drive = R * T4 * Math.log(a / b); // 理想气体 μ 差（T、V 相同）
      const df = 0.05 * Math.sqrt(a * b) * (drive / (R * T4));
      a -= df;
      b += df;
    }
    agree((a * R * T4) / 1e3, 89, 'p4 流动模拟', 1e-9);
    console.log(`  p4：左 ${pL.toPrecision(8)} kPa，右 ${pR.toPrecision(8)} kPa；流过的氮 ${((nL0 - a) / nL0 * 100).toFixed(2)}%`);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [89, 111] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
