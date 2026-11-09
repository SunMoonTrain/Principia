// 变分法各节验算脚本共用的数值工具：数值求导、高斯-勒让德积分、线性方程组、一元方程和一元极小，
// 以及两种互相独立的求极值办法：
//   一是把泛函离散成有限个未知数的函数（节点上的值，导数用差分），直接求这个多元函数的驻点，不用欧拉-拉格朗日方程；
//   二是由被积函数数值地写出欧拉-拉格朗日方程（偏导数都数值地求），用 RK4 打靶。
// 文件名第三段以下划线开头，npm run verify 不把它当成小节的验算脚本（见 index.ts 的文件名规则）。

import { RK4, type Derivative } from '../../packages/anim/src/ode.ts';

export type Vec = number[];
export type Mat = number[][];

// ---------- 数值求导（中心差分再做一次理查森外推） ----------

/** f'(x)。 */
export function derivative(f: (x: number) => number, x: number, h = 1e-3): number {
  const d = (k: number): number => (f(x + k) - f(x - k)) / (2 * k);
  return (4 * d(h / 2) - d(h)) / 3;
}

/** f''(x)。 */
export function secondDerivative(f: (x: number) => number, x: number, h = 1e-3): number {
  const d = (k: number): number => (f(x + k) - 2 * f(x) + f(x - k)) / (k * k);
  return (4 * d(h / 2) - d(h)) / 3;
}

// ---------- 积分 ----------

const GL5: [number, number][] = [
  [0, 128 / 225],
  [-Math.sqrt(5 - 2 * Math.sqrt(10 / 7)) / 3, (322 + 13 * Math.sqrt(70)) / 900],
  [Math.sqrt(5 - 2 * Math.sqrt(10 / 7)) / 3, (322 + 13 * Math.sqrt(70)) / 900],
  [-Math.sqrt(5 + 2 * Math.sqrt(10 / 7)) / 3, (322 - 13 * Math.sqrt(70)) / 900],
  [Math.sqrt(5 + 2 * Math.sqrt(10 / 7)) / 3, (322 - 13 * Math.sqrt(70)) / 900],
];

/** ∫_a^b f：分成 n 段，每段用 5 点高斯-勒让德公式（不在端点取值，端点处可积的奇点也能算）。 */
export function integrate(f: (x: number) => number, a: number, b: number, n = 64): number {
  const h = (b - a) / n;
  let s = 0;
  for (let i = 0; i < n; i++) {
    const mid = a + (i + 0.5) * h;
    for (const [u, w] of GL5) s += ((w * h) / 2) * f(mid + (u * h) / 2);
  }
  return s;
}

/** ∬ f 在矩形 [a, b] × [c, d] 上，每一维分成 n 段、每段 5 点。 */
export function integrate2(f: (x: number, y: number) => number, a: number, b: number, c: number, d: number, n = 16): number {
  return integrate((x) => integrate((y) => f(x, y), c, d, n), a, b, n);
}

// ---------- 线性代数、方程、极小 ----------

/** 列主元高斯消元解 A x = b。 */
export function solve(A: Mat, b: Vec): Vec {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-300) throw new Error('方程组奇异');
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) {
      const k = M[r][c] / M[c][c];
      if (k !== 0) for (let j = c; j <= n; j++) M[r][j] -= k * M[c][j];
    }
  }
  const x = new Array<number>(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let s = M[r][n];
    for (let j = r + 1; j < n; j++) s -= M[r][j] * x[j];
    x[r] = s / M[r][r];
  }
  return x;
}

/** 三对角方程组：下对角 lo[i]（第 i 行、第 i−1 列）、对角 di、上对角 up[i]（第 i 行、第 i+1 列）。 */
export function solveTridiagonal(lo: Vec, di: Vec, up: Vec, rhs: Vec): Vec {
  const n = di.length;
  const c = new Array<number>(n).fill(0);
  const d = new Array<number>(n).fill(0);
  c[0] = up[0] / di[0];
  d[0] = rhs[0] / di[0];
  for (let i = 1; i < n; i++) {
    const m = di[i] - lo[i] * c[i - 1];
    c[i] = i < n - 1 ? up[i] / m : 0;
    d[i] = (rhs[i] - lo[i] * d[i - 1]) / m;
  }
  const x = new Array<number>(n).fill(0);
  x[n - 1] = d[n - 1];
  for (let i = n - 2; i >= 0; i--) x[i] = d[i] - c[i] * x[i + 1];
  return x;
}

/** 一元方程在 [lo, hi] 上的根（两端异号），二分。 */
export function bisect(f: (x: number) => number, lo: number, hi: number): number {
  let flo = f(lo);
  if (flo * f(hi) > 0) throw new Error(`[${lo}, ${hi}] 两端同号，找不到零点`);
  for (let k = 0; k < 200 && hi - lo > 1e-15 * Math.max(1, Math.abs(lo)); k++) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (fm === 0) return mid;
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else hi = mid;
  }
  return (lo + hi) / 2;
}

/** 单峰函数在 [lo, hi] 上的极小点，黄金分割。 */
export function goldenMin(f: (x: number) => number, lo: number, hi: number): number {
  const r = (Math.sqrt(5) - 1) / 2;
  let a = lo;
  let b = hi;
  let x1 = b - r * (b - a);
  let x2 = a + r * (b - a);
  let f1 = f(x1);
  let f2 = f(x2);
  for (let k = 0; k < 200 && b - a > 1e-12 * Math.max(1, Math.abs(a)); k++) {
    if (f1 < f2) {
      b = x2;
      x2 = x1;
      f2 = f1;
      x1 = b - r * (b - a);
      f1 = f(x1);
    } else {
      a = x1;
      x1 = x2;
      f1 = f2;
      x2 = a + r * (b - a);
      f2 = f(x2);
    }
  }
  return (a + b) / 2;
}

/**
 * n 个未知数的二次函数 J（加常数）的驻点，可以带线性约束 c_k(x) = 0。
 * 二次函数的差分没有截断误差，用步长 1 求梯度和黑塞矩阵；约束的系数同样由差分得到，用拉格朗日乘子并进线性方程组。
 * 不要求黑塞矩阵正定（多个未知函数的泛函可能只有鞍点）。
 */
export function quadraticStationary(J: (x: Vec) => number, n: number, constraints: ((x: Vec) => number)[] = []): Vec {
  const zero = new Array<number>(n).fill(0);
  const unit = (i: number, s = 1): Vec => zero.map((_, k) => (k === i ? s : 0));
  const J0 = J(zero);
  const Ji = zero.map((_, i) => J(unit(i)));
  const Jm = zero.map((_, i) => J(unit(i, -1)));
  const g = zero.map((_, i) => (Ji[i] - Jm[i]) / 2);
  const H: Mat = zero.map(() => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) {
    H[i][i] = Ji[i] - 2 * J0 + Jm[i];
    for (let j = i + 1; j < n; j++) {
      const e = zero.map((_, k) => (k === i || k === j ? 1 : 0));
      H[i][j] = H[j][i] = J(e) - Ji[i] - Ji[j] + J0;
    }
  }
  const m = constraints.length;
  const A: Mat = [];
  const rhs: Vec = [];
  for (let i = 0; i < n; i++) A.push([...H[i], ...new Array<number>(m).fill(0)]), rhs.push(-g[i]);
  constraints.forEach((c, k) => {
    const c0 = c(zero);
    const row = zero.map((_, i) => c(unit(i)) - c0);
    row.forEach((v, i) => (A[i][n + k] = v));
    A.push([...row, ...new Array<number>(m).fill(0)]);
    rhs.push(-c0);
  });
  return solve(A, rhs).slice(0, n);
}

/** 误差按 h² 变小的两个近似值（h 和 h/2），外推到 h → 0。 */
export const richardson = (coarse: number, fine: number): number => (4 * fine - coarse) / 3;

/**
 * 把 ∫_a^b F(x, y, y′) dx 离散成节点值的函数：[a, b] 等分成 N 段，每段取中点，y 取两端的平均、y′ 取差商（二阶精度）。
 * left、right 是两端给定的值，null 表示那一端自由，它的值也成为未知数。
 */
export function discretize(F: Integrand, a: number, b: number, N: number, left: number | null, right: number | null) {
  const h = (b - a) / N;
  const count = N - 1 + (left === null ? 1 : 0) + (right === null ? 1 : 0);
  const nodes = (u: Vec): Vec => {
    let k = 0;
    const y = [left ?? u[k++]];
    for (let i = 1; i < N; i++) y.push(u[k++]);
    y.push(right ?? u[k++]);
    return y;
  };
  const J = (u: Vec): number => {
    const y = nodes(u);
    let s = 0;
    for (let i = 0; i < N; i++) s += h * F(a + (i + 0.5) * h, (y[i] + y[i + 1]) / 2, (y[i + 1] - y[i]) / h);
    return s;
  };
  return { J, nodes, count, h };
}

/** 离散以后的极值曲线（二次的 J），返回各节点的值；N 取 n 和 2n，节点 i·(b − a)/n 处的值做理查森外推。 */
export function discreteExtremal(F: Integrand, a: number, b: number, n: number, left: number | null, right: number | null): (x: number) => number {
  const solveFor = (N: number): Vec => {
    const d = discretize(F, a, b, N, left, right);
    return d.nodes(quadraticStationary(d.J, d.count));
  };
  const coarse = solveFor(n);
  const fine = solveFor(2 * n);
  return (x: number): number => {
    const i = Math.round(((x - a) / (b - a)) * n);
    if (Math.abs(a + (i * (b - a)) / n - x) > 1e-12) throw new Error(`${x} 不是节点`);
    return richardson(coarse[i], fine[2 * i]);
  };
}

// ---------- 由被积函数数值地写出欧拉-拉格朗日方程 ----------

export type Integrand = (x: number, y: number, p: number) => number;

/** F_y − d/dx F_{y'} = 0 解出 y''：y'' = (F_y − F_{y'x} − F_{y'y} y') / F_{y'y'}，偏导数都数值地求。 */
export function eulerLagrangeAccel(F: Integrand, x: number, y: number, p: number): number {
  const Fp = (xx: number, yy: number, pp: number): number => derivative((s) => F(xx, yy, pp + s), 0);
  const Fy = derivative((s) => F(x, y + s, p), 0);
  const Fpx = derivative((s) => Fp(x + s, y, p), 0);
  const Fpy = derivative((s) => Fp(x, y + s, p), 0);
  const Fpp = derivative((s) => Fp(x, y, p + s), 0);
  return (Fy - Fpx - Fpy * p) / Fpp;
}

/** 状态 [y, y′, ∫F dx] 的导数：沿极值曲线同时积分出 J。 */
export function extremalFlow(F: Integrand): Derivative {
  return (x, s, out) => {
    out[0] = s[1];
    out[1] = eulerLagrangeAccel(F, x, s[0], s[1]);
    out[2] = F(x, s[0], s[1]);
  };
}

/** 用 RK4 固定步长积分到 t1（步数取整，最后一步正好落在 t1）。 */
export function integrateTo(f: Derivative, y0: Vec, t0: number, t1: number, dt: number): Float64Array {
  const steps = Math.max(1, Math.ceil(Math.abs(t1 - t0) / dt));
  const h = (t1 - t0) / steps;
  const rk = new RK4(y0.length);
  const y = Float64Array.from(y0);
  for (let i = 0; i < steps; i++) rk.step(f, t0 + i * h, y, h);
  return y;
}


// ---------- 核对 ----------

/** 两种算法的结果先互相核对：相差超过 tol（相对，至少按 1 算）就报错。返回第二个（手推公式的精确值）。 */
export function agree(numeric: number, exact: number, what: string, tol = 1e-6): number {
  if (Math.abs(numeric - exact) > tol * Math.max(1, Math.abs(exact))) {
    throw new Error(`${what}：数值解 ${numeric} 和手推公式 ${exact} 不一致`);
  }
  return exact;
}

/** 选择题：按选项序号列出判为「对」的那些（从 1 开始）。 */
export function chosen(flags: boolean[]): number[] {
  return flags.flatMap((ok, i) => (ok ? [i + 1] : []));
}
