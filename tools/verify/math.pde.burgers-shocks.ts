// 独立验算 math.pde.burgers-shocks 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.pde.burgers-shocks.ts
// 两样独立的工具：
// 1. 特征线：从 x0 出发的是 X_t(x0) = x0 + t φ(x0)；破裂时间按定义取「X_t 不再单调」的最早时刻，
//    由数值求导找 1 + t φ′ 的最小值何时到 0，再在网格上核对前后特征线是否相交。
// 2. 守恒型的戈杜诺夫（Godunov）有限体积格式：只用守恒律本身（流量 q(u) = u²/2 的精确黎曼解），
//    不用兰金-于戈尼奥公式，用来核对激波的位置和速度、总量守恒。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

const q = (u: number): number => (u * u) / 2;

/** 凸流量 q(u) = u²/2 的戈杜诺夫数值流量（精确黎曼解在 x/t = 0 处的流量）。 */
function godunovFlux(uL: number, uR: number): number {
  if (uL <= uR) {
    if (uL > 0) return q(uL);
    if (uR < 0) return q(uR);
    return 0;
  }
  return Math.max(q(uL), q(uR));
}

/** 在 [lo, hi] 上用 n 个格子从初值 phi 推到时刻 T，返回格子中心和格子平均值。两端用常数外推（边界外的值不变）。 */
function godunov(phi: (x: number) => number, lo: number, hi: number, n: number, T: number): { xs: number[]; us: number[]; dx: number; mass: number[] } {
  const dx = (hi - lo) / n;
  const xs = Array.from({ length: n }, (_, i) => lo + (i + 0.5) * dx);
  // 格子平均：每格取 8 点中点求积
  let us = xs.map((x) => {
    let s = 0;
    for (let k = 0; k < 8; k++) s += phi(x - dx / 2 + ((k + 0.5) * dx) / 8);
    return s / 8;
  });
  const mass: number[] = [us.reduce((a, b) => a + b, 0) * dx];
  let t = 0;
  while (t < T - 1e-14) {
    const umax = Math.max(...us.map(Math.abs), 1e-12);
    const dt = Math.min(0.45 * (dx / umax), T - t);
    const F = new Array<number>(n + 1);
    F[0] = godunovFlux(us[0], us[0]);
    F[n] = godunovFlux(us[n - 1], us[n - 1]);
    for (let i = 1; i < n; i++) F[i] = godunovFlux(us[i - 1], us[i]);
    us = us.map((u, i) => u - (dt / dx) * (F[i + 1] - F[i]));
    t += dt;
    mass.push(us.reduce((a, b) => a + b, 0) * dx);
  }
  return { xs, us, dx, mass };
}

/** 数值解里 u 从大于 level 变到小于 level 的位置（向下的跳跃），线性插值。 */
function downCrossing(xs: number[], us: number[], level: number): number[] {
  const out: number[] = [];
  for (let i = 0; i + 1 < xs.length; i++) {
    if (us[i] > level && us[i + 1] <= level) out.push(xs[i] + ((us[i] - level) / (us[i] - us[i + 1])) * (xs[i + 1] - xs[i]));
  }
  return out;
}

/** 中心差分加理查森外推的导数。 */
function deriv(f: (x: number) => number, x: number, h = 1e-3): number {
  const d = (k: number): number => (f(x + k) - f(x - k)) / (2 * k);
  return (4 * d(h / 2) - d(h)) / 3;
}

/** 黄金分割法求 f 在 [a, b] 上的最大值点（要求单峰）。 */
function argmax(f: (x: number) => number, a: number, b: number): number {
  const g = (Math.sqrt(5) - 1) / 2;
  let c = b - g * (b - a);
  let d = a + g * (b - a);
  for (let k = 0; k < 200; k++) {
    if (f(c) > f(d)) b = d;
    else a = c;
    c = b - g * (b - a);
    d = a + g * (b - a);
  }
  return (a + b) / 2;
}

/** 过 (x, t) 的特征线：解 u = φ(x − u t)。1 + tφ′ > 0 时 u ↦ u − φ(x − u t) 严格递增，二分。 */
function implicitU(phi: (x: number) => number, x: number, t: number, lo = -50, hi = 50): number {
  const g = (u: number): number => u - phi(x - u * t);
  let a = lo;
  let b = hi;
  if (g(a) > 0 || g(b) < 0) throw new Error('implicitU：区间没有包住根');
  for (let k = 0; k < 200; k++) {
    const m = (a + b) / 2;
    if (g(m) < 0) a = m;
    else b = m;
  }
  return (a + b) / 2;
}

/** 由一个解 u(x, t) 用差分算方程的残差 v_t + v v_x 在若干点上的最大绝对值。 */
function residual(v: (x: number, t: number) => number, pts: [number, number][]): number {
  let worst = 0;
  for (const [x, t] of pts) {
    const vt = deriv((s) => v(x, s), t, 1e-3);
    const vx = deriv((s) => v(s, t), x, 1e-3);
    worst = Math.max(worst, Math.abs(vt + v(x, t) * vx));
  }
  return worst;
}

export const verification: Verification = {
  lesson: 'math.pde.burgers-shocks',
  notes: {
    p1: '特征线 X_t(x0) = x0 + tφ(x0)，φ = 1/(1+x²)。数值求导，用黄金分割法找 −φ′ 的最大值 m，t* = 1/m；再在 [−20, 20] 上取 40 万个点核对 0.999t* 时 X_t 仍严格递增、1.001t* 时已有相邻的两条特征线相交。手算 −φ′ = 2x/(1+x²)²，在 1/√3 处最大，t* = 8√3/9 ≈ 1.5396，两者核对。',
    p2: 'A、E：取两个可微解 u = x/(1+t) 和 u = arctan(x − ut)（隐式方程二分求解），在 6 个点上用差分算 v_t + v v_x：A 的 v = u(x − ct, t) + c（c = 2、−1.5）残差为 0；E 的 v = u(2x, t) 残差远离 0（u = x/(1+t) 时等于 2x/(1+t)²）。B：戈杜诺夫格式解 u− = 4、u+ = −2 的黎曼问题，t = 1 时跳跃在 x ≈ 1。C：反例 φ(0) = 0、φ(1) = 1，特征线 x = 0、x = 1 + t 不平行，交点 t = −1 < 0。D：初值 φ = x（0 ≤ x ≤ 1）、其余为 0，戈杜诺夫格式算到 t = 3（t = 0 就有激波），总量始终是 1/2；另取有激波形成的鼓包 max(0, 1 − x²) 核对总量不变。所以选 A、B、D。',
    p3: '斜坡上 −φ′ = 2，从 [0, 1] 出发的特征线 x = x0 + (3 − 2x0)t 在 t = 1/2 同时到达 x = 3/2。之后左 3、右 1，用守恒（区间 [a, b] 里的总量每单位时间增加 q(3) − q(1) = 4）解出 s(t) = 1/2 + 2t，t = 2 时 s = 9/2；戈杜诺夫格式（dx = 0.0025）算到 t = 2，跳跃中点（u = 2）在 4.5 附近，相差小于 0.01。',
    p4: '二分解 u = arctan(x − ut)（φ′ > 0，一直不破裂，根唯一），在 t = 1 附近差分求 u_t；手算 x0 = 1、u = π/4、u_x = (1/2)/(1 + 1/2) = 1/3，u_t = −u u_x = −π/12，两者核对。',
  },
  compute() {
    // p1
    const phi1 = (x: number): number => 1 / (1 + x * x);
    const negDphi1 = (x: number): number => -deriv(phi1, x, 1e-3);
    const eta = argmax(negDphi1, 0, 3);
    const tStar = 1 / negDphi1(eta);
    const handTStar = (8 * Math.sqrt(3)) / 9;
    if (Math.abs(tStar - handTStar) > 1e-8) throw new Error(`p1：数值 ${tStar} 和手算 ${handTStar} 不符`);
    const monotone = (t: number): boolean => {
      const n = 400_000;
      let prev = -Infinity;
      for (let i = 0; i <= n; i++) {
        const x0 = -20 + (40 * i) / n;
        const X = x0 + t * phi1(x0);
        if (X <= prev) return false;
        prev = X;
      }
      return true;
    };
    if (!monotone(0.999 * tStar) || monotone(1.001 * tStar)) throw new Error('p1：特征线相交的时刻和 t* 对不上');

    // p2
    const p2: number[] = [];
    const uLin = (x: number, t: number): number => x / (1 + t);
    const uAtan = (x: number, t: number): number => implicitU(Math.atan, x, t);
    const pts: [number, number][] = [
      [-1.3, 0.4],
      [0.2, 0.9],
      [0.8, 1.5],
      [2.1, 0.6],
      [-0.5, 2.2],
      [1.7, 3.1],
    ];
    if (residual(uLin, pts) > 1e-7 || residual(uAtan, pts) > 1e-6) throw new Error('p2：所取的解本身不满足方程');
    // A
    let aOk = true;
    for (const c of [2, -1.5]) {
      for (const u of [uLin, uAtan]) if (residual((x, t) => u(x - c * t, t) + c, pts) > 1e-6) aOk = false;
    }
    if (aOk) p2.push(1);
    // B：黎曼问题 u− = 4、u+ = −2，跳跃放在 x = 0，算到 t = 1
    const riemann = godunov((x) => (x < 0 ? 4 : -2), -6, 6, 4800, 1);
    const jumpB = downCrossing(riemann.xs, riemann.us, 1);
    if (jumpB.length !== 1) throw new Error('p2 B：跳跃个数不是 1');
    if (Math.abs(jumpB[0] - 1) < 0.01) p2.push(2);
    else if (Math.abs(jumpB[0] - 1) < 0.2) throw new Error('p2 B：跳跃位置分不清');
    // C：找一对不平行、在 t > 0 不相交的特征线
    const phiC = (x: number): number => x; // φ(0) = 0、φ(1) = 1
    const tCross = (1 - 0) / (phiC(0) - phiC(1));
    const cHasCounterexample = phiC(0) !== phiC(1) && tCross < 0;
    if (!cHasCounterexample) p2.push(3);
    // D：两个有激波的、初值有紧支集的例子，总量是否不变
    const tri = godunov((x) => (x >= 0 && x <= 1 ? x : 0), -2, 6, 3200, 3);
    const bump = godunov((x) => Math.max(0, 1 - x * x), -3, 5, 3200, 3);
    const drift = (m: number[]): number => Math.max(...m.map((v) => Math.abs(v - m[0])));
    // 精确解（三角形）：0 < x < √(1+t) 时 u = x/(1+t)，总量 (1+t)/(2(1+t)) = 1/2
    const triExactMass = 0.5;
    const triFinalPeak = downCrossing(tri.xs, tri.us, 0.5 / Math.sqrt(4)); // 激波两侧 u− = s/(1+t) = 1/2、u+ = 0
    if (drift(tri.mass) < 1e-10 && drift(bump.mass) < 1e-10 && Math.abs(tri.mass[0] - triExactMass) < 1e-3) {
      if (triFinalPeak.length < 1 || Math.abs(triFinalPeak[triFinalPeak.length - 1] - 2) > 0.02) throw new Error('p2 D：三角形的激波位置和 √(1+t) 对不上');
      p2.push(4);
    }
    // E
    if (residual((x, t) => uLin(2 * x, t), pts) < 1e-6 && residual((x, t) => uAtan(2 * x, t), pts) < 1e-6) p2.push(5);

    // p3
    const phi3 = (x: number): number => (x < 0 ? 3 : x <= 1 ? 3 - 2 * x : 1);
    // 斜坡上的特征线同时相交的时刻和位置
    const hits = [0, 0.25, 0.5, 0.75, 1].map((x0) => ({ x0, t: 1 / 2, x: x0 + phi3(x0) / 2 }));
    if (hits.some((h) => Math.abs(h.x - 1.5) > 1e-12)) throw new Error('p3：斜坡上的特征线不在同一点相交');
    // 之后：[a, b] 里的总量 = 初始总量 + t (q(3) − q(1))；左边 3、右边 1 时总量 = 3(s − a) + (b − s)
    const a3 = -10;
    const b3 = 20;
    const initialMass = 3 * (0 - a3) + 2 /* ∫_0^1 (3 − 2x) dx */ + 1 * (b3 - 1);
    const shockAt = (t: number): number => (initialMass + t * (q(3) - q(1)) - (-3 * a3 + b3)) / 2;
    const p3 = shockAt(2);
    const sim3 = godunov(phi3, -2, 8, 4000, 2);
    const jump3 = downCrossing(sim3.xs, sim3.us, 2);
    if (jump3.length !== 1 || Math.abs(jump3[0] - p3) > 0.01) throw new Error(`p3：数值解的跳跃在 ${jump3.join(', ')}，和 ${p3} 不符`);

    // p4
    const x4 = 1 + Math.PI / 4;
    const ut = deriv((t) => uAtan(x4, t), 1, 1e-3);
    if (Math.abs(ut - -Math.PI / 12) > 1e-7) throw new Error(`p4：数值 ${ut} 和手算 −π/12 不符`);

    return {
      p1: { type: 'number', value: tStar },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: ut },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
