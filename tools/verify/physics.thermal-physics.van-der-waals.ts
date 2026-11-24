// 独立验算 physics.thermal-physics.van-der-waals 的 p1–p4（简单题、中等题）。
// 算法一（闭式）：p = nRT/(V − nb) − an²/V²；V_c = 3nb，p_c = a/(27b²)，T_c = 8a/(27Rb)。
// 算法二（不用临界常量的式子，也不用解析的导数）：只给状态方程 p(T, V)，按回折的意思直接找临界点——
//   给定 T，对 V 中心差分得等温线的斜率，在 (1.5nb, 5nb) 里用黄金分割找斜率的最大值 s(T)；
//   s(T) > 0 时等温线有一段体积变大、压强反而升高（有回折），s(T) < 0 时一路下降；
//   二分 s(T) = 0 得临界温度，那里斜率最大的点就是临界点，读出 V_c、p_c。
// 算法三（只用代数）：交点的 V 满足 pV³ − (pnb + nRT)V² + an²V − abn³ = 0，临界点处它等于 p(V − V_c)³，比较三个系数。
// p3 另用两条路核对：对隐式方程 (p + an²/V²)(V − nb) = nRT 二分解 p；对 F(V) = −nRT ln(V − nb) − an²/V 中心差分取 −∂F/∂V。
//   理想气体那个数另用 p = N k_B T/V（先数分子）核对。
// p4 另一条路：把 (a, b) 当未知数，对算法二数值求出的 (T_c, p_c) 用牛顿法（对数坐标、差分雅可比）反解。
// 选择题逐条在几种气体、几个温度上找反例、对照真值（写明用了哪些例子）。
// 题面没给摩尔气体常量，按 CODATA：R = N_A·k_B（都是定义值）。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.van-der-waals.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, bisect, check, chosen } from './physics.newtonian-mechanics._nm.ts';

const NA = 6.022_140_76e23; // mol^-1
const KB = 1.380_649e-23; // J/K
const R = NA * KB; // J/(mol·K)

interface Gas {
  name: string;
  a: number; // Pa·m^6/mol²
  b: number; // m³/mol
}

/** 范德瓦耳斯方程解出的压强（n mol，温度 T，体积 V > nb）。 */
const pressure = (g: Gas, n: number, T: number, V: number): number => (n * R * T) / (V - n * g.b) - (g.a * n * n) / (V * V);

/** 等温线的斜率 ∂p/∂V：只用 pressure 的中心差分。 */
function slope(g: Gas, n: number, T: number, V: number): number {
  const h = 1e-4 * n * g.b;
  return (pressure(g, n, T, V + h) - pressure(g, n, T, V - h)) / (2 * h);
}

interface Critical {
  T: number;
  V: number;
  p: number;
}

/** 算法二：按「回折刚好消失」找临界点（n mol）。 */
function criticalNumeric(g: Gas, n: number): Critical {
  // 斜率最大的点：T 在临界温度附近时，斜率在 (1.5nb, 5nb) 里先升后降
  const steepest = (T: number): number => argmax((V) => slope(g, n, T, V), 1.5 * n * g.b, 5 * n * g.b);
  const s = (T: number): number => slope(g, n, T, steepest(T));
  // 二分的范围：只按量纲 a/(Rb) 取得很宽
  const unit = g.a / (R * g.b);
  const T = bisect(s, 0.2 * unit, 0.45 * unit);
  const V = steepest(T);
  return { T, V, p: pressure(g, n, T, V) };
}

/** 闭式。 */
const criticalClosed = (g: Gas, n: number): Critical => ({ T: (8 * g.a) / (27 * R * g.b), V: 3 * n * g.b, p: g.a / (27 * g.b * g.b) });

/** 给定 T、p，数 V > nb 上满足状态方程的体积（在 x = V/(nb) 的对数网格上数变号，再二分）。 */
function volumes(g: Gas, n: number, T: number, p: number): number[] {
  const f = (V: number): number => pressure(g, n, T, V) - p;
  const out: number[] = [];
  const steps = 40_000;
  // 从 V = nb(1 + 1e-6) 到 V = 1e6 nb
  const at = (i: number): number => n * g.b * (1 + 10 ** (-6 + (12 * i) / steps));
  for (let i = 0; i < steps; i++) {
    const lo = at(i);
    const hi = at(i + 1);
    if (f(lo) * f(hi) < 0) out.push(bisect(f, lo, hi));
  }
  return out;
}

const methane: Gas = { name: '甲烷', a: 0.2303, b: 4.31e-5 };
const carbonDioxide: Gas = { name: '二氧化碳', a: 0.364, b: 4.267e-5 };
const argon: Gas = { name: '氩', a: 0.1355, b: 3.2e-5 };
const made: Gas = { name: '随手取的气体', a: 1.7, b: 1.1e-4 };
const gases = [methane, carbonDioxide, argon, made];

export const verification: Verification = {
  lesson: 'physics.thermal-physics.van-der-waals',
  notes: {
    p1: 'p_c = a/(27b²) = 0.2303/(27 × (4.31e-5)²) ≈ 4.5917e6 Pa，和摩尔气体常量无关。第二套：只给 p(T, V)，对 V 中心差分得等温线的斜率，二分「斜率的最大值 = 0」（回折刚好消失）的温度，读出那一点的压强；第三套：三次方程 pV³ − (pnb + nRT)V² + an²V − abn³ 在这一点等于 p(V − V_c)³，比较系数。n 取 0.3、1、2.5 mol 压强相同。',
    p2: '用甲烷、二氧化碳、氩和随手取的一种气体（a = 1.7、b = 1.1e-4）。A：V 取 1.5nb、3nb、40nb，T 取 5 个等距的值，p 的二阶差分都是 0、一阶差分不是 0（斜率 nR/(V − nb)），对；B：临界等温线上 V_c 左边 p 大于 p_c、右边小于 p_c（偏离 1%、5%、20%），切线水平可是没有极值，错；C：V = nb(1 + 10^-k)，k = 1…9，T 取 0.3T_c、T_c、3T_c，p 从 k = 2 起一直增大、到 k = 9 时都超过 1e8 p_c，对；D：T = 0.7、0.9、0.99T_c，p = 2p_c 时只有一个体积（和「每一个正的压强」矛盾；0.9T_c 时 p = 0.65p_c 才有三个，0.01p_c 也只有一个），错；E：a 相同、b 加倍，用算法二数值求的临界温度减半，错。选 A、C。',
    p3: '理想气体 nRT/V ≈ 4.98868e6 Pa（另用 N k_B T/V 核对）；范德瓦耳斯 nRT/(V − nb) − an²/V² ≈ 3.99813e6 Pa，另用隐式方程二分解 p、用 −∂F/∂V 中心差分核对。R 取 8.31、8.314 时都写成 4.99e6、4.00e6。',
    p4: 'b = RT_c/(8p_c)，a = 27R²T_c²/(64p_c) = 27b²p_c，得 a ≈ 0.55359、b ≈ 3.04867e-5。第二套：对算法二数值求出的 (T_c, p_c) 用牛顿法反解 (a, b)。R 取 8.31 时 a ≈ 0.5530、b ≈ 3.0470e-5，相对差 1.1e-3、5.4e-4，都在 5e-3 以内。',
  },
  compute() {
    // ---------- 算法一、二、三在四种气体上互相核对 ----------
    for (const g of gases) {
      for (const n of [0.3, 1, 2.5]) {
        const c = criticalClosed(g, n);
        const m = criticalNumeric(g, n);
        agree(m.T, c.T, `${g.name} n = ${n}：临界温度`, 2e-7);
        agree(m.p, c.p, `${g.name} n = ${n}：临界压强`, 2e-7);
        agree(m.V, c.V, `${g.name} n = ${n}：临界体积`, 1e-4); // 斜率在最大值附近很平，位置只能到 1e-5 左右
        // 算法三：pV³ − (pnb + nRT)V² + an²V − abn³ ≡ p(V − V_c)³
        agree((c.p * n * g.b + n * R * c.T) / c.p, 3 * c.V, `${g.name}：V² 的系数`, 1e-12);
        agree((g.a * n * n) / c.p, 3 * c.V * c.V, `${g.name}：V 的系数`, 1e-12);
        agree((g.a * g.b * n ** 3) / c.p, c.V ** 3, `${g.name}：常数项`, 1e-12);
        agree((c.p * c.V) / (n * R * c.T), 3 / 8, `${g.name}：p_c V_c/(nRT_c) = 3/8`, 1e-12);
      }
    }

    // ---------- p1（Pa）----------
    const p1 = criticalClosed(methane, 1).p;
    agree(criticalNumeric(methane, 1).p, p1, 'p1 临界压强', 2e-7);
    console.log(`  p1：p_c = ${p1.toPrecision(8)} Pa`);

    // ---------- p2 ----------
    // A：V 不变，p 是 T 的一次函数
    const optA = gases.every((g) =>
      [1.5, 3, 40].every((x) => {
        const n = 0.7;
        const V = x * n * g.b;
        const Tc = criticalClosed(g, n).T;
        const ps = [0.4, 0.8, 1.2, 1.6, 2.0].map((r) => pressure(g, n, r * Tc, V));
        const d1 = ps.slice(1).map((v, i) => v - ps[i]);
        const second = d1.slice(1).map((v, i) => v - d1[i]);
        return d1.every((d) => d > 0) && second.every((d) => Math.abs(d) < 1e-9 * Math.abs(d1[0]));
      }),
    );
    // B：临界点处切线水平（对），压强取极值（不对）
    const horizontal = gases.every((g) => {
      const c = criticalClosed(g, 1);
      return Math.abs(slope(g, 1, c.T, c.V)) < 1e-6 * (c.p / c.V);
    });
    check(horizontal, 'p2 B：临界点处切线水平');
    const extremum = gases.some((g) => {
      const c = criticalClosed(g, 1);
      return [0.01, 0.05, 0.2].some((e) => {
        const left = pressure(g, 1, c.T, c.V * (1 - e)) - c.p;
        const right = pressure(g, 1, c.T, c.V * (1 + e)) - c.p;
        check(left > 0 && right < 0, 'p2 B：临界点左边压强高、右边压强低');
        return left * right > 0;
      });
    });
    const optB = horizontal && extremum;
    // C：V → nb+ 时 p → +∞
    const optC = gases.every((g) =>
      [0.3, 1, 3].every((r) => {
        const c = criticalClosed(g, 1);
        const ps = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => pressure(g, 1, r * c.T, g.b * (1 + 10 ** -k)));
        const increasing = ps.slice(2).every((v, i) => v > ps[i + 1]);
        return increasing && ps[8] > 1e8 * c.p;
      }),
    );
    // D：T < T_c 时，每一个正的压强都对应三个不同的体积？
    const counts = gases.map((g) => {
      const c = criticalClosed(g, 1);
      return [0.7, 0.9, 0.99].map((r) => [0.01, 0.65, 2].map((q) => volumes(g, 1, r * c.T, q * c.p).length));
    });
    const optD = counts.every((bt) => bt.every((bp) => bp.every((k) => k === 3)));
    check(
      counts.every((bt) => bt.every((bp) => bp[2] === 1)),
      'p2 D：p = 2p_c 时只有一个体积',
    );
    check(
      counts.every((bt) => bt[1][1] === 3),
      'p2 D 对照：0.9T_c、0.65p_c 时有三个体积',
    );
    console.log(`  p2 D：T = 0.7、0.9、0.99T_c，p = 0.01、0.65、2p_c 时的体积个数（${gases[0].name}）：${JSON.stringify(counts[0])}`);
    // E：a 相同，b 大的临界温度高？
    const bigB: Gas = { name: 'b 加倍', a: argon.a, b: 2 * argon.b };
    const tSmall = criticalNumeric(argon, 1).T;
    const tBig = criticalNumeric(bigB, 1).T;
    agree(tBig / tSmall, 0.5, 'p2 E：b 加倍，临界温度减半', 1e-6);
    const optE = tBig > tSmall;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3（Pa）----------
    const n3 = 1.0;
    const V3 = 0.5e-3;
    const T3 = 300;
    const ideal = (n3 * R * T3) / V3;
    agree((n3 * NA * KB * T3) / V3, ideal, 'p3 理想气体：先数分子', 1e-12);
    const vdw = pressure(carbonDioxide, n3, T3, V3);
    const implicit = bisect((p) => (p + (carbonDioxide.a * n3 * n3) / (V3 * V3)) * (V3 - n3 * carbonDioxide.b) - n3 * R * T3, 0, 1e8);
    agree(implicit, vdw, 'p3 隐式方程二分', 1e-9);
    const F = (V: number): number => -n3 * R * T3 * Math.log(V - n3 * carbonDioxide.b) - (carbonDioxide.a * n3 * n3) / V;
    const h3 = 1e-8;
    agree(-(F(V3 + h3) - F(V3 - h3)) / (2 * h3), vdw, 'p3 −∂F/∂V', 1e-6);
    for (const r of [8.31, 8.314]) {
      const i = (n3 * r * T3) / V3;
      const v = (n3 * r * T3) / (V3 - n3 * carbonDioxide.b) - (carbonDioxide.a * n3 * n3) / (V3 * V3);
      check(Math.abs(i / ideal - 1) < 5e-3 && Math.abs(v / vdw - 1) < 5e-3, `p3 R 取 ${r} 时在 5e-3 以内`);
      console.log(`  p3：R 取 ${r} 得 ${i.toPrecision(5)}、${v.toPrecision(5)} Pa`);
    }

    // ---------- p4 ----------
    const Tc4 = 647.1;
    const pc4 = 22.06e6;
    const b4 = (R * Tc4) / (8 * pc4);
    const a4 = 27 * b4 * b4 * pc4;
    agree((27 * R * R * Tc4 * Tc4) / (64 * pc4), a4, 'p4 a 的两种写法', 1e-12);
    // 牛顿法：未知数 (ln a, ln b)，目标 (ln T_c, ln p_c)，从随手取的起点出发
    let u = [Math.log(0.2), Math.log(5e-5)];
    for (let it = 0; it < 12; it++) {
      const eq = (w: number[]): number[] => {
        const c = criticalNumeric({ name: '水', a: Math.exp(w[0]), b: Math.exp(w[1]) }, 1);
        return [Math.log(c.T / Tc4), Math.log(c.p / pc4)];
      };
      const f0 = eq(u);
      const d = 1e-3;
      const fa = eq([u[0] + d, u[1]]);
      const fb = eq([u[0], u[1] + d]);
      const J = [
        [(fa[0] - f0[0]) / d, (fb[0] - f0[0]) / d],
        [(fa[1] - f0[1]) / d, (fb[1] - f0[1]) / d],
      ];
      const det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
      u = [u[0] - (f0[0] * J[1][1] - f0[1] * J[0][1]) / det, u[1] - (J[0][0] * f0[1] - J[1][0] * f0[0]) / det];
      if (Math.hypot(...f0) < 1e-10) break;
    }
    agree(Math.exp(u[0]), a4, 'p4 牛顿法反解 a', 1e-6);
    agree(Math.exp(u[1]), b4, 'p4 牛顿法反解 b', 1e-6);
    for (const r of [8.31, 8.314]) {
      const b = (r * Tc4) / (8 * pc4);
      const a = 27 * b * b * pc4;
      check(Math.abs(a / a4 - 1) < 5e-3 && Math.abs(b / b4 - 1) < 5e-3, `p4 R 取 ${r} 时在 5e-3 以内`);
      console.log(`  p4：R 取 ${r} 得 a = ${a.toPrecision(5)}、b = ${b.toPrecision(5)}（相对差 ${(a / a4 - 1).toExponential(1)}、${(b / b4 - 1).toExponential(1)}）`);
    }

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [ideal, vdw] },
      p4: { type: 'tuple', value: [a4, b4] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
