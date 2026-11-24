// 独立验算 math.pde.pde-basics 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.pde.pde-basics.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { rng } from './math.vector-calculus._vc.ts';

/**
 * 两个自变量 (p, q) 的函数在一点的「喷射」：u 和它到三阶的各个偏导数。
 * 下标 1 表示对第一个自变量（x）求导，2 表示对第二个自变量（y 或 t）求导。
 */
const JET_KEYS = ['u', 'u1', 'u2', 'u11', 'u12', 'u22', 'u111', 'u112', 'u122', 'u222'] as const;
type Jet = Record<(typeof JET_KEYS)[number], number>;

/** 方程写成 F(p, q, 喷射) = 0。 */
type Equation = (p: number, q: number, J: Jet) => number;

const jetFrom = (v: number[]): Jet => Object.fromEntries(JET_KEYS.map((k, i) => [k, v[i]])) as Jet;
const combine = (a: number, A: number[], b: number, B: number[], c: number, C: number[]): number[] => A.map((_, i) => a * A[i] + b * B[i] + c * C[i]);

/**
 * 线性的定义：方程能写成 L[u] = f，L 是 u 和各阶偏导数乘只依赖自变量的系数再相加。
 * 等价于：在每个固定的点上，F 是喷射的仿射函数。检验：随机取点、三个随机喷射和权重 a + b + c = 1，
 * 看 F(aJ₁ + bJ₂ + cJ₃) 是否等于 aF(J₁) + bF(J₂) + cF(J₃)（权重可以取到区间外，仿射才处处成立）。
 */
function isAffineInJet(F: Equation, trials = 400, seed = 7): boolean {
  const r = rng(seed);
  const rand = (lo: number, hi: number): number => lo + (hi - lo) * r();
  for (let k = 0; k < trials; k++) {
    const p = rand(-3, 3);
    const q = rand(-3, 3);
    const J = [0, 1, 2].map(() => JET_KEYS.map(() => rand(-2, 2)));
    const a = rand(-2, 3);
    const b = rand(-2, 3);
    const c = 1 - a - b;
    const lhs = F(p, q, jetFrom(combine(a, J[0], b, J[1], c, J[2])));
    const rhs = a * F(p, q, jetFrom(J[0])) + b * F(p, q, jetFrom(J[1])) + c * F(p, q, jetFrom(J[2]));
    if (Math.abs(lhs - rhs) > 1e-9 * (1 + Math.abs(lhs) + Math.abs(rhs))) return false;
  }
  return true;
}

/** F 是否真的含偏导数（否则不是偏微分方程）：只改某个偏导数，F 变不变。 */
function containsDerivative(F: Equation): boolean {
  const base = jetFrom([0.3, -0.7, 1.1, 0.4, -0.9, 0.6, 0.8, -0.5, 0.2, 1.3]);
  return JET_KEYS.slice(1).some((k) => Math.abs(F(0.37, -0.61, { ...base, [k]: base[k] + 0.29 }) - F(0.37, -0.61, base)) > 1e-12);
}

/** 嵌套的五点差分（每层误差是 h⁴ 量级）求 g 在 (p, q) 处的偏导数，dirs 依次是对哪个自变量求导（0 是 p，1 是 q）。 */
function mixed(g: (p: number, q: number) => number, p: number, q: number, dirs: number[], h: number): number {
  if (dirs.length === 0) return g(p, q);
  const [d, ...rest] = dirs;
  const f = (s: number): number => (d === 0 ? mixed(g, p + s, q, rest, h) : mixed(g, p, q + s, rest, h));
  return (-f(2 * h) + 8 * f(h) - 8 * f(-h) + f(-2 * h)) / (12 * h);
}

/** 用差分算出 g 在一点的喷射（不用求导公式）；三阶偏导数的步长取大一些，免得舍入误差放大。 */
function numericJet(g: (p: number, q: number) => number, p: number, q: number): Jet {
  const dirsOf: Record<(typeof JET_KEYS)[number], number[]> = {
    u: [], u1: [0], u2: [1], u11: [0, 0], u12: [0, 1], u22: [1, 1], u111: [0, 0, 0], u112: [0, 0, 1], u122: [0, 1, 1], u222: [1, 1, 1],
  };
  return Object.fromEntries(JET_KEYS.map((k) => [k, mixed(g, p, q, dirsOf[k], dirsOf[k].length >= 3 ? 1e-2 : 1e-3)])) as Jet;
}

/** g 代进方程后在几个点上的最大残差。 */
const maxResidual = (F: Equation, g: (p: number, q: number) => number, pts: [number, number][]): number =>
  Math.max(...pts.map(([p, q]) => Math.abs(F(p, q, numericJet(g, p, q)))));

/**
 * 二阶部分 A u_xx + 2B u_xy + C u_yy 的系数：在一点把喷射取成只有一个二阶偏导数为 1、其余为 0，
 * 减去全 0 喷射处的值读出系数（方程是线性的才这样读；读之前先核对仿射）。u_xy 的系数是 2B。
 */
function principalCoefficients(F: Equation, p: number, q: number): { A: number; B: number; C: number } {
  const zero = jetFrom(JET_KEYS.map(() => 0));
  const f0 = F(p, q, zero);
  const coef = (k: (typeof JET_KEYS)[number]): number => F(p, q, { ...zero, [k]: 1 }) - f0;
  for (const k of ['u111', 'u112', 'u122', 'u222'] as const) if (Math.abs(coef(k)) > 1e-12) throw new Error('方程不是二阶的');
  return { A: coef('u11'), B: coef('u12') / 2, C: coef('u22') };
}

/** 对称矩阵 [[A, B], [B, C]] 的两个特征值（另一种判别：同号椭圆、异号双曲、有一个为 0 抛物）。 */
function eigenvalues2(A: number, B: number, C: number): [number, number] {
  const m = (A + C) / 2;
  const d = Math.hypot((A - C) / 2, B);
  return [m - d, m + d];
}

type Kind = 'E' | 'P' | 'H';
function classify(F: Equation, p: number, q: number): Kind {
  const { A, B, C } = principalCoefficients(F, p, q);
  if (A === 0 && B === 0 && C === 0) throw new Error('二阶部分的系数全为 0');
  const disc = B * B - A * C;
  const kindByDisc: Kind = Math.abs(disc) < 1e-12 ? 'P' : disc < 0 ? 'E' : 'H';
  const [l1, l2] = eigenvalues2(A, B, C);
  const tol = 1e-12 * (1 + Math.abs(l1) + Math.abs(l2));
  const kindByEig: Kind = Math.abs(l1) < tol || Math.abs(l2) < tol ? 'P' : l1 * l2 > 0 ? 'E' : 'H';
  if (kindByDisc !== kindByEig) throw new Error(`(${p}, ${q}) 处两种判法不一致`);
  return kindByDisc;
}

/**
 * 周期区间 [0, 2π) 上 u_t = u_xx + 1 的直线法：N 个格点的二阶中心差分，四阶龙格-库塔推进到 tEnd，返回 x = 0 处的值。
 * 只用差分和时间推进，不用分离变量或叠加原理。
 */
function heatWithSourceFD(phi: (x: number) => number, N: number, tEnd: number, steps: number): number {
  const h = (2 * Math.PI) / N;
  const dt = tEnd / steps;
  let u = Array.from({ length: N }, (_, j) => phi(j * h));
  const rhs = (v: number[]): number[] => v.map((vj, j) => (v[(j + 1) % N] - 2 * vj + v[(j - 1 + N) % N]) / (h * h) + 1);
  for (let s = 0; s < steps; s++) {
    const k1 = rhs(u);
    const k2 = rhs(u.map((v, j) => v + (dt / 2) * k1[j]));
    const k3 = rhs(u.map((v, j) => v + (dt / 2) * k2[j]));
    const k4 = rhs(u.map((v, j) => v + dt * k3[j]));
    u = u.map((v, j) => v + (dt / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
  }
  return u[0];
}

/** [0, 2π] 上的梯形公式（周期函数时是谱精度）。 */
function periodicIntegral(g: (x: number) => number, m = 4096): number {
  const h = (2 * Math.PI) / m;
  let s = 0;
  for (let j = 0; j < m; j++) s += g(j * h);
  return s * h;
}

export const verification: Verification = {
  lesson: 'math.pde.pde-basics',
  notes: {
    p1:
      '把每个方程写成 F(自变量, 喷射) = 0，喷射是 u 和到三阶的各个偏导数。按定义，线性等价于每个点上 F 是喷射的仿射函数：' +
      '随机取 400 组（点、三个喷射、和为 1 的权重，权重可出区间），看 F 的值是否按同一组权重组合；另核对每个 F 确实含偏导数。' +
      '非线性的再各举一对具体的解（导数用嵌套差分算）：B 里 u = π 是解、π/2 不是；C 里 x + y 是解、2(x + y) 不是；E 里 −3/(x − t) 是解、它的 2 倍不是。',
    p2:
      '在 [−3, 3]² 的 49 个格点上，把喷射取成只有一个二阶偏导数为 1，读出 A、2B、C，算 B² − AC；' +
      '另用矩阵 [[A, B], [B, C]] 的特征值的符号（同号、异号、有零）再判一次，两种判法一致。看 49 个点是否同一型。',
    p3: '同 p2 的办法，在 (1, 2)、(0, −3)、(5, 0) 三点读出 A、B、C，按 B² − AC 和特征值的符号各判一次。',
    p4:
      '初值在 [0, 2π] 上对 cos kx（k = 1…6）求系数 c_k = (1/π)∫φ cos kx dx（梯形公式），得 c₁ = 2、c₃ = −1、其余为 0；' +
      '组合成 u = t + Σ c_k e^{−k²t} cos kx，在 25 个随机点用差分核对 u_t − u_xx − 1 = 0、t = 0 时等于初值，再代 x = 0、t = ln 2。' +
      '另用直线法独立核对：周期区间上二阶中心差分（N = 200、400）、四阶龙格-库塔推进到 ln 2，两套网格按 h² 理查森外推，和上面的值相差小于 10⁻⁷。',
  },
  compute() {
    // ---- p1 ----（第一个自变量是 x，第二个是 t 或 y）
    const options: Equation[] = [
      (x, t, J) => J.u22 - (1 + x * x) * J.u11 - Math.sin(t), // A：u_tt = (1 + x²)u_xx + sin t
      (_x, _t, J) => J.u22 - J.u11 + Math.sin(J.u), // B：u_tt = u_xx − sin u
      (_x, _y, J) => J.u1 * J.u2 - 1, // C：u_x u_y = 1
      (x, y, J) => J.u1 + J.u2 - Math.cos(x * y) * J.u, // D：u_x + u_y = cos(xy) u
      (_x, _t, J) => J.u112 + J.u * J.u11, // E：u_xxt + u u_xx = 0
    ];
    if (!options.every(containsDerivative)) throw new Error('p1：有选项不含偏导数');
    const p1 = options.map((F, i) => (isAffineInJet(F) ? i + 1 : 0)).filter((i) => i > 0);
    // 非线性的选项各举一个「解的倍数不再是解」的例子
    const pts: [number, number][] = [[0.4, -1.3], [1.7, -0.2], [-0.8, 1.9], [2.3, -1.1]];
    const counter: [Equation, (p: number, q: number) => number, number][] = [
      [options[1], () => Math.PI, 0.5], // B
      [options[2], (x, y) => x + y, 2], // C
      [options[4], (x, t) => -3 / (x - t), 2], // E：pts 上 |x − t| 都不小于 1.7，离奇点远
    ];
    for (const [F, g, k] of counter) {
      if (maxResidual(F, g, pts) > 1e-5) throw new Error('p1：举的例子本身不是解');
      if (maxResidual(F, (p, q) => k * g(p, q), pts) < 1e-2) throw new Error('p1：倍数仍是解，举的例子不说明非线性');
    }

    // ---- p2 ----
    const eq2: Equation = (_x, _y, J) => J.u11 - 6 * J.u12 + 9 * J.u22 + J.u1;
    if (!isAffineInJet(eq2)) throw new Error('p2：方程应是线性的');
    const kinds2 = new Set<Kind>();
    for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) kinds2.add(classify(eq2, i, j));
    const choice2: Record<string, number> = { E: 1, H: 2, P: 3 };
    const p2 = kinds2.size === 1 ? choice2[[...kinds2][0]] : 4;

    // ---- p3 ----
    const tricomi: Equation = (_x, y, J) => y * J.u11 + J.u22;
    if (!isAffineInJet(tricomi)) throw new Error('p3：方程应是线性的');
    const p3 = ([[1, 2], [0, -3], [5, 0]] as [number, number][]).map(([x, y]) => classify(tricomi, x, y));

    // ---- p4 ----
    const phi = (x: number): number => 2 * Math.cos(x) - Math.cos(3 * x);
    const c = Array.from({ length: 7 }, (_, k) => (k === 0 ? 0 : periodicIntegral((x) => phi(x) * Math.cos(k * x)) / Math.PI));
    const mean = periodicIntegral(phi) / (2 * Math.PI);
    if (Math.abs(mean) > 1e-12) throw new Error('p4：初值的平均值应为 0（常数项不用 cos 0x 补）');
    const u4 = (x: number, t: number): number => t + c.reduce((s, ck, k) => s + ck * Math.exp(-k * k * t) * Math.cos(k * x), 0);
    const heatSrc: Equation = (_x, _t, J) => J.u2 - J.u11 - 1;
    const r = rng(11);
    const pts4: [number, number][] = Array.from({ length: 25 }, () => [-3 + 6 * r(), 0.05 + 2 * r()]);
    if (maxResidual(heatSrc, u4, pts4) > 1e-5) throw new Error('p4：组合出的 u 不满足 u_t = u_xx + 1');
    for (let k = 0; k <= 20; k++) {
      const x = -3 + 0.3 * k;
      if (Math.abs(u4(x, 0) - phi(x)) > 1e-12) throw new Error('p4：初值对不上');
    }
    const p4 = u4(0, Math.log(2));
    const fd200 = heatWithSourceFD(phi, 200, Math.log(2), 4000);
    const fd400 = heatWithSourceFD(phi, 400, Math.log(2), 16000);
    const fdExtrapolated = (4 * fd400 - fd200) / 3;
    if (Math.abs(fdExtrapolated - p4) > 1e-7) throw new Error(`p4：直线法 ${fdExtrapolated} 和叠加的 ${p4} 对不上`);

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'choice', value: [p2] },
      p3: { type: 'sequence', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
