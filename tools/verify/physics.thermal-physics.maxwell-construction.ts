// 独立验算 physics.thermal-physics.maxwell-construction 的 p1–p4（简单题、中等题）。
// 算法一（闭式）：p1 用体积按物质的量分摊；p3 令对比态等温线的斜率为零；p4 用原函数。
// 算法二（不用等面积法则，也不用上面的闭式）：
//   p1：造两个不同形状的、两个坑分别落在 18.8 mL、30.14 L 的 f(v)，对「两部分各取多少摩尔、各占多大体积」数值求总 F 的最小，读出液体的份额；
//   p2：范德瓦耳斯流体在 19 个温度上用三种互相独立的办法定共存状态，逐条对真值：
//     （a）公切线：数值雅可比的牛顿法解「两处斜率相等、切线重合」；T_r = 0.9 时另从随机出发点做坐标下降，直接求总 F 的最小（选项 E）；
//     （b）把 F(V) 的离散点从下面绷成凸的折线（单调链），找跨度最大的那一段；
//     （c）二分水平线的高度使两块面积相等（数值积分）；
//     三者互相核对；化学势按定义 (∂F/∂n)_{T,V} 对完整的 F(T, V, n) 数值求导；
//   p3：对每个 T 数值求等温线在 V_r > 1 一侧的最高点，二分 T 使最高点落在 2；再用「一半大一点、一半小一点」的总 F 的变化
//     （二阶差分）核对 2 的两侧一边回得来、一边回不来；
//   p4：交点由数值求根得到，面积用高斯-勒让德和多边形（鞋带公式）两套。
// 题面没给常量；p1 的数照题面。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.maxwell-construction.ts

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { agree, argmax, bisect, check, chosen, integrate } from './physics.newtonian-mechanics._nm.ts';

// ---------- 对比态的范德瓦耳斯流体（能量以 p_c·V_c 为单位，体积以 V_c 为单位，都是「临界体积为 V_c 的那么多物质」）----------
const pr = (v: number, T: number): number => (8 * T) / (3 * v - 1) - 3 / (v * v);
/** 等温时的亥姆霍兹自由能，差一个只和温度有关的常数。 */
const fr = (v: number, T: number): number => -((8 * T) / 3) * Math.log(3 * v - 1) - 3 / v;

/** 固定种子的伪随机数（mulberry32），[0, 1)。 */
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

/** 等温线的两个极值点（回折的最低点、最高点），只靠数值：在 (1/3, 1) 上找 p 的最小、在 (1, 大) 上找 p 的最大。 */
function turning(T: number): { low: number; high: number } {
  // 用 ln(v) 当自变量，免得高端太宽
  const low = argmax((v) => -pr(v, T), 0.334, 1);
  const s = argmax((u) => pr(Math.exp(u), T), 0, Math.log(400));
  return { low, high: Math.exp(s) };
}

interface Coexist {
  vL: number;
  vG: number;
  p: number;
}

/** （a）公切线：F 在 vL、vG 处的斜率相等，切线重合。对 (ln vL, ln vG) 用数值雅可比的牛顿法，带阻尼。 */
function byTangent(T: number, start: Coexist): Coexist {
  let x = Math.log(start.vL - 1 / 3);
  let y = Math.log(start.vG);
  const eq = (a: number, b: number): [number, number] => {
    const vL = 1 / 3 + Math.exp(a);
    const vG = Math.exp(b);
    const pL = pr(vL, T);
    const pG = pr(vG, T);
    return [pL - pG, fr(vL, T) + pL * vL - fr(vG, T) - pG * vG];
  };
  for (let k = 0; k < 200; k++) {
    const [e1, e2] = eq(x, y);
    const h = 1e-6;
    const [a1, a2] = eq(x + h, y);
    const [b1, b2] = eq(x - h, y);
    const [c1, c2] = eq(x, y + h);
    const [d1, d2] = eq(x, y - h);
    const j11 = (a1 - b1) / (2 * h);
    const j21 = (a2 - b2) / (2 * h);
    const j12 = (c1 - d1) / (2 * h);
    const j22 = (c2 - d2) / (2 * h);
    const det = j11 * j22 - j12 * j21;
    let dx = (-e1 * j22 + e2 * j12) / det;
    let dy = (-j11 * e2 + j21 * e1) / det;
    const big = Math.max(Math.abs(dx), Math.abs(dy));
    if (big > 0.05) {
      dx *= 0.05 / big;
      dy *= 0.05 / big;
    }
    x += dx;
    y += dy;
    if (big < 1e-13) break;
  }
  const vL = 1 / 3 + Math.exp(x);
  const vG = Math.exp(y);
  return { vL, vG, p: pr(vL, T) };
}

/** （c）等面积：二分水平线的高度，面积差用数值积分，交点用二分。 */
function byArea(T: number): Coexist {
  const { low, high } = turning(T);
  const pLow = pr(low, T);
  const pHigh = pr(high, T);
  const ends = (p: number): { vL: number; vG: number } => {
    const vL = bisect((v) => pr(v, T) - p, 1 / 3 + 1e-9, low);
    let far = 2 * high;
    while (pr(far, T) > p) far *= 2;
    const vG = bisect((v) => pr(v, T) - p, high, far);
    return { vL, vG };
  };
  const diff = (p: number): number => {
    const { vL, vG } = ends(p);
    // 自变量换成 ln(v − 1/3)，两端的陡坡、长尾都照顾到
    const g = (u: number): number => (pr(1 / 3 + Math.exp(u), T) - p) * Math.exp(u);
    return integrate(g, Math.log(vL - 1 / 3), Math.log(vG - 1 / 3), 64, 16);
  };
  const lo = Math.max(pLow, 0) + 1e-9 * Math.max(1, pHigh);
  const hi = pHigh - 1e-9 * pHigh;
  // pLow ≤ 0 时从很低的正压强开始（这时上方的一块大），找变号
  let a = pLow > 0 ? lo : 1e-12;
  let b = hi;
  check(diff(a) > 0 && diff(b) < 0, `T_r = ${T}：面积差在两头异号`);
  for (let k = 0; k < 200; k++) {
    const m = Math.sqrt(a) * Math.sqrt(b);
    const mid = b / a > 1.5 ? m : (a + b) / 2;
    if (diff(mid) > 0) a = mid;
    else b = mid;
    if (b - a < 1e-15 * b) break;
  }
  const p = (a + b) / 2;
  return { ...ends(p), p };
}

/** （b）把 F 的离散点从下面绷成凸的折线，返回跨度最大的那一段的两端。 */
function byEnvelope(T: number, n = 60_000): { vL: number; vG: number; slope: number } {
  // 自变量按 ln(v − 1/3) 均匀取点
  const u0 = Math.log(1e-3);
  const u1 = Math.log(1e3);
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= n; i++) {
    const v = 1 / 3 + Math.exp(u0 + ((u1 - u0) * i) / n);
    xs.push(v);
    ys.push(fr(v, T));
  }
  const hull: number[] = [];
  for (let i = 0; i <= n; i++) {
    while (hull.length >= 2) {
      const a = hull[hull.length - 2];
      const b = hull[hull.length - 1];
      const turn = (xs[b] - xs[a]) * (ys[i] - ys[a]) - (ys[b] - ys[a]) * (xs[i] - xs[a]);
      if (turn <= 0) hull.pop();
      else break;
    }
    hull.push(i);
  }
  let best = 0;
  let at = 0;
  for (let k = 0; k + 1 < hull.length; k++) {
    const gap = hull[k + 1] - hull[k];
    if (gap > best) {
      best = gap;
      at = k;
    }
  }
  const a = hull[at];
  const b = hull[at + 1];
  return { vL: xs[a], vG: xs[b], slope: (ys[b] - ys[a]) / (xs[b] - xs[a]) };
}

/** 完整的 F(T, V, n)（n 可变），对比单位：临界态取 n = 1、V = 1。nb = n/3，an² = 3n²，nRT = (8/3)nT。 */
const freeFull = (T: number, V: number, n: number): number => {
  const nRT = (8 / 3) * n * T;
  return -nRT * (Math.log((V - n / 3) / n) + 1) - (3 * n * n) / V;
};
const d5 = (f: (x: number) => number, x: number, h: number): number =>
  (f(x - 2 * h) - 8 * f(x - h) + 8 * f(x + h) - f(x + 2 * h)) / (12 * h);

/** 总 F 的最小：n 摩尔物质分成两部分，各占 v1、v2（每摩尔），总体积是 V。从很多个出发点做坐标下降。 */
function minimizeSplit(
  f: (v: number) => number,
  V: number,
  range: [number, number],
  seed: number,
  starts = 60,
): { x1: number; v1: number; v2: number; total: number } {
  const rand = rng(seed);
  const total = (v1: number, v2: number): number => {
    const x1 = (v2 - V) / (v2 - v1);
    return x1 * f(v1) + (1 - x1) * f(v2);
  };
  const lnLo = Math.log(range[0]);
  const lnHi = Math.log(range[1]);
  const lnV = Math.log(V);
  let best = { x1: 1, v1: V, v2: V, total: f(V) };
  for (let s = 0; s < starts; s++) {
    let a = lnLo + (lnV - lnLo) * rand();
    let b = lnV + (lnHi - lnV) * rand();
    let step = 0.5;
    let cur = total(Math.exp(a), Math.exp(b));
    while (step > 1e-12) {
      let moved = false;
      for (const [da, db] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, -1],
        [1, -1],
        [-1, 1],
      ]) {
        const na = Math.min(lnV - 1e-9, Math.max(lnLo, a + da * step));
        const nb = Math.max(lnV + 1e-9, Math.min(lnHi, b + db * step));
        const val = total(Math.exp(na), Math.exp(nb));
        if (val < cur) {
          cur = val;
          a = na;
          b = nb;
          moved = true;
        }
      }
      if (!moved) step /= 2;
    }
    if (cur < best.total) {
      const v1 = Math.exp(a);
      const v2 = Math.exp(b);
      best = { x1: (v2 - V) / (v2 - v1), v1, v2, total: cur };
    }
  }
  return best;
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.maxwell-construction',
  notes: {
    p1: '液体的份额 x 满足 0.0188x + 30.14(1 − x) = 3.00，x = (30.14 − 3.00)/(30.14 − 0.0188) = 0.90103。第二套：取两个形状不同、最低点都在 18.8 mL 和 30.14 L 的函数 W(v)，f(v) = W(v) − 101.3 v，1 mol 物质分成两部分，对两部分的每摩尔体积、份额数值求总 F 的最小（60 个随机出发点的坐标下降），液体的份额都是 0.9010；均匀的一相（v = 3.00 L）的 F 比这大。',
    p2: '范德瓦耳斯流体，T_r = 0.30、0.35、…、0.95、0.97、0.98、0.99、0.995、0.999 共 19 个温度，共存状态用三种办法定（公切线的牛顿法、F 的离散点从下面绷成的凸折线、数值等面积），互相核对；凸折线只在 0.5–0.99 用（再低气体的体积超出离散点的范围，再高离散点分不开）。A：中间的交点作为均匀态，F 比同一体积下分成两相的大（不是平衡态），而且体积等于它时按体积分摊液体的份额也不是 1/2（T_r = 0.9 时约 0.72，各温度都 > 0.5），错。B：化学势按定义 (∂F/∂n)_{T,V} 数值求导，液、气两相在 1e-6 以内相等（对）。C：F_液 − F_气 = p(V_气 − V_液)，T_r = 0.9 时约 1.13 p_cV_c，19 个温度都 > 0，错。D：19 个温度上共存压强随温度严格递增，0.5–0.99 上 dp/dT（中心差分）和 (S_气 − S_液)/(V_气 − V_液) 一致、都 > 0，对。E：T_r = 0.9，总体积在 0.65–2.3 取 12 个值，总 F 最小时气体部分的每摩尔体积都是 2.349（密度不变），液体变少，错。所以选 B、D。',
    p3: '斜率为零：T_r = (3V_r − 1)²/(4V_r³) = 25/32 = 0.78125，p_r = 8T_r/5 − 3/4 = 0.5。第二套：二分 T 使等温线在 V_r > 1 一侧的最高点（黄金分割求）落在 2；核对最低点在 V_r < 1；V_r = 2.05 处「一半大一点、一半小一点」总 F 变大（回得来），V_r = 1.95 处总 F 变小（不稳定）；而且这个状态的压强比这一温度的共存压强高（确实是过冷蒸气一侧的端点）。',
    p4: '交点用扫描加二分求根，正好是 2/3、1、2；上方（1 到 2）的一块 (5/2)ln(5/2) − 9/4 = 0.0407268，下方（2/3 到 1）的一块 7/4 − (5/2)ln2 = 0.0171320，高斯-勒让德和多边形面积两套都一致。',
  },
  compute() {
    // ---------- p1 ----------
    const vLw = 0.0188;
    const vGw = 30.14;
    const Vw = 3.0;
    const p1 = (vGw - Vw) / (vGw - vLw);
    const psat = 101.3; // kPa；kPa·L = J
    const wells: ((v: number) => number)[] = [
      (v) => 40 * Math.log(v / vLw) ** 2 * Math.log(v / vGw) ** 2,
      (v) => 3000 * (1 - Math.exp(-((Math.log(v / vLw) * Math.log(v / vGw)) ** 2) / 6)),
    ];
    for (const [k, W] of wells.entries()) {
      const f = (v: number): number => W(v) - psat * v;
      const r = minimizeSplit(f, Vw, [0.01, 100], 7 + k);
      agree(r.x1, p1, `p1 总 F 最小时液体的份额（第 ${k + 1} 个函数）`, 1e-5);
      agree(r.v1, vLw, 'p1 液体的每摩尔体积', 1e-4);
      agree(r.v2, vGw, 'p1 气体的每摩尔体积', 1e-4);
      check(f(Vw) > r.total + 1, 'p1 均匀的一相 F 更大');
    }
    check(p1 * vLw + (1 - p1) * vGw - Vw < 1e-12, 'p1 体积凑得上');

    // ---------- p2 ----------
    const temps = [0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 0.97, 0.98, 0.99, 0.995, 0.999];
    const coex = temps.map((T) => {
      const area = byArea(T);
      const tan = byTangent(T, area);
      agree(area.p, tan.p, `T_r = ${T}：等面积和公切线的压强`, 1e-6);
      agree(area.vL, tan.vL, `T_r = ${T}：液体体积`, 1e-5);
      agree(area.vG, tan.vG, `T_r = ${T}：气体体积`, 1e-5);
      if (T >= 0.5 && T <= 0.99) {
        // 太低的温度气体体积很大，超出离散点的范围；太靠近临界点时离散点分不开
        const env = byEnvelope(T);
        agree(env.vL, tan.vL, `T_r = ${T}：凸折线的液体端`, 5e-3);
        agree(env.vG, tan.vG, `T_r = ${T}：凸折线的气体端`, 5e-3);
        agree(-env.slope, tan.p, `T_r = ${T}：凸折线的斜率`, 1e-4);
      }
      return { T, ...tan };
    });
    check(Math.abs(coex.find((c) => c.T === 0.9)!.p - 0.647) < 5e-4, 'T_r = 0.9 的共存压强约 0.647');

    // A：中间的交点
    let optA = true;
    for (const c of coex) {
      const { low, high } = turning(c.T);
      const vM = bisect((v) => pr(v, c.T) - c.p, low, high);
      const x = (c.vG - vM) / (c.vG - c.vL);
      const split = x * fr(c.vL, c.T) + (1 - x) * fr(c.vG, c.T);
      if (fr(vM, c.T) > split) optA = false; // 中间的交点作为均匀态，不是平衡的共存状态
      check(x > 0.5, `T_r = ${c.T}：体积等于中间交点时液体的份额大于 1/2（${x.toFixed(4)}）`);
      if (c.T === 0.9) check(Math.abs(x - 0.72) < 0.01, `T_r = 0.9 时约 0.72（${x.toFixed(4)}）`);
    }
    // 份额只用来说明「连按体积分摊也不是各半」：越靠近临界点越接近 1/2，可哪个温度都比 1/2 大
    check(!optA, 'A：每个温度上中间的交点都不是平衡的共存状态');

    // B：每个分子的吉布斯自由能（化学势按定义求导）
    let optB = true;
    for (const c of coex) {
      const nL = 1 / c.vL; // V = 1 里装的物质的量（对比单位）
      const nG = 1 / c.vG;
      const muL = d5((n) => freeFull(c.T, 1, n), nL, 1e-4 * Math.min(nL, 3 - nL));
      const muG = d5((n) => freeFull(c.T, 1, n), nG, 1e-4 * nG);
      if (Math.abs(muL - muG) > 1e-6 * (Math.abs(muL) + Math.abs(muG))) optB = false;
    }

    // C：同样多的物质，F_液 和 F_气
    let optC = true;
    for (const c of coex) {
      const dF = fr(c.vL, c.T) - fr(c.vG, c.T);
      agree(dF, c.p * (c.vG - c.vL), `T_r = ${c.T}：F_液 − F_气 = pΔV`, 2e-5);
      if (Math.abs(dF) > 1e-6) optC = false;
      check(dF > 0, 'C：F_液 比 F_气 大');
      if (c.T === 0.9) check(Math.abs(dF - 1.13) < 0.01, `T_r = 0.9 时约 1.13（${dF.toFixed(4)}）`);
    }

    // D：共存压强随温度升高
    let optD = true;
    for (let i = 0; i + 1 < coex.length; i++) if (!(coex[i + 1].p > coex[i].p)) optD = false;
    for (const c of coex) {
      if (c.T < 0.5 || c.T > 0.99) continue;
      const h = 1e-4;
      const up = byArea(c.T + h);
      const dn = byArea(c.T - h);
      const slope = (up.p - dn.p) / (2 * h);
      const dS = (8 / 3) * Math.log((3 * c.vG - 1) / (3 * c.vL - 1));
      agree(slope, dS / (c.vG - c.vL), `T_r = ${c.T}：克拉珀龙方程`, 1e-4);
      if (!(slope > 0)) optD = false;
    }

    // E：共存时气体的密度
    let optE = true;
    {
      const T = 0.9;
      const ref = coex.find((c) => c.T === T)!;
      let prevX = 2;
      for (let k = 0; k < 12; k++) {
        const V = 0.65 + (1.65 * k) / 11;
        const r = minimizeSplit((v) => fr(v, T), V, [0.36, 20], 100 + k, 24);
        agree(r.v1, ref.vL, `E：V = ${V.toFixed(2)} 的液体`, 1e-4);
        agree(r.v2, ref.vG, `E：V = ${V.toFixed(2)} 的气体`, 1e-4);
        check(r.x1 < prevX, 'E：液体越来越少');
        prevX = r.x1;
        if (Math.abs(r.v2 / ref.vG - 1) < 1e-4) optE = false; // 密度没有减小
      }
    }
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3 ----------
    const T3 = (3 * 2 - 1) ** 2 / (4 * 2 ** 3);
    const P3 = (8 * T3) / (3 * 2 - 1) - 3 / 4;
    const T3num = bisect((T) => turning(T).high - 2, 0.7, 0.9);
    agree(T3num, T3, 'p3 最高点落在 2 的温度', 1e-6);
    agree(pr(2, T3num), P3, 'p3 压强', 1e-6);
    {
      const t = turning(T3);
      check(t.low < 1 && Math.abs(t.high - 2) < 1e-6, 'p3 2 是气体一侧的最高点');
      const bend = (v: number): number => fr(v + 0.01, T3) + fr(v - 0.01, T3) - 2 * fr(v, T3);
      check(bend(2.05) > 0, 'p3 2 的右边：小的扰动后回得来');
      check(bend(1.95) < 0, 'p3 2 的左边：不稳定');
      const c = byArea(T3);
      check(P3 > c.p && c.vG > 2, 'p3 压强高于共存压强、体积小于共存的气体：是过冷蒸气的端点');
    }

    // ---------- p4 ----------
    const T4 = 15 / 16;
    const h4 = 3 / 4;
    const roots = rootsOf((v) => pr(v, T4) - h4, 0.4, 6, 20000);
    check(roots.length === 3, `p4 三个交点（${roots.join('、')}）`);
    agree(roots[0], 2 / 3, 'p4 左边的交点', 1e-9);
    agree(roots[1], 1, 'p4 中间的交点', 1e-9);
    agree(roots[2], 2, 'p4 右边的交点', 1e-9);
    const G = (v: number): number => 2.5 * Math.log(3 * v - 1) + 3 / v - 0.75 * v;
    const up4 = G(2) - G(1);
    const dn4 = -(G(1) - G(2 / 3));
    agree(up4, 2.5 * Math.log(2.5) - 2.25, 'p4 上方闭式', 1e-12);
    agree(dn4, 1.75 - 2.5 * Math.log(2), 'p4 下方闭式', 1e-12);
    agree(integrate((v) => pr(v, T4) - h4, 1, 2, 32, 16), up4, 'p4 上方（高斯-勒让德）', 1e-9);
    agree(-integrate((v) => pr(v, T4) - h4, 2 / 3, 1, 32, 16), dn4, 'p4 下方（高斯-勒让德）', 1e-9);
    const shoelace = (a: number, b: number): number => {
      const pts: [number, number][] = [];
      const N = 200_000;
      for (let i = 0; i <= N; i++) {
        const v = a + ((b - a) * i) / N;
        pts.push([v, pr(v, T4)]);
      }
      let s = 0;
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[(i + 1) % pts.length];
        s += x1 * y2 - x2 * y1;
      }
      return Math.abs(s) / 2;
    };
    agree(shoelace(1, 2), up4, 'p4 上方（多边形）', 1e-7);
    agree(shoelace(2 / 3, 1), dn4, 'p4 下方（多边形）', 1e-7);
    check(pr(1.5, T4) > h4 && pr(0.8, T4) < h4, 'p4 哪一块在线上方');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [T3, P3] },
      p4: { type: 'tuple', value: [up4, dn4] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
