// 分析力学各节验算脚本共用的数值工具：线性代数、数值求导、由各质点直角坐标出发的动力学。
// 文件名第三段以下划线开头，npm run verify 不把它当成小节的验算脚本（见 index.ts 的文件名规则）。
//
// 动力学一律从惯性系里各质点的直角坐标出发数值地解：用广义坐标时按达朗贝尔原理
// Σ m_i r̈_i·∂r_i/∂q_j = Q_j 解出 q̈（accelerations），要约束力时在直角坐标里配拉格朗日乘子（constrained）。
// 不用讲解或题目里推好的运动方程，所以和手推的公式是两种互相独立的算法，验算脚本里两者先互相核对。

import { RK4, type Derivative } from '../../packages/anim/src/ode.ts';

export type Vec = number[];
export type Mat = number[][];

// ---------- 线性代数 ----------

/** 列主元高斯消元解 A x = b；主元相对最大元素小于 tol（矩阵奇异）时返回 null。 */
export function solve(A: Mat, b: Vec, tol = 1e-10): Vec | null {
  const n = b.length;
  const m = A.map((row, i) => [...row, b[i]]);
  const scale = Math.max(1e-300, ...A.flat().map(Math.abs));
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(m[r][c]) > Math.abs(m[p][c])) p = r;
    if (Math.abs(m[p][c]) < tol * scale) return null;
    [m[c], m[p]] = [m[p], m[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = m[r][c] / m[c][c];
      for (let k = c; k <= n; k++) m[r][k] -= f * m[c][k];
    }
  }
  return m.map((row, i) => row[n] / row[i]);
}

/** 矩阵的秩：高斯消元，主元相对最大元素小于 tol 的算零。 */
export function rank(A: Mat, tol = 1e-7): number {
  const m = A.map((row) => [...row]);
  const rows = m.length;
  const cols = rows ? m[0].length : 0;
  const scale = Math.max(1e-300, ...A.flat().map(Math.abs));
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let p = r;
    for (let i = r + 1; i < rows; i++) if (Math.abs(m[i][c]) > Math.abs(m[p][c])) p = i;
    if (Math.abs(m[p][c]) < tol * scale) continue;
    [m[r], m[p]] = [m[p], m[r]];
    for (let i = r + 1; i < rows; i++) {
      const f = m[i][c] / m[r][c];
      for (let k = c; k < cols; k++) m[i][k] -= f * m[r][k];
    }
    r++;
  }
  return r;
}

export const dot = (a: Vec, b: Vec): number => a.reduce((s, ai, i) => s + ai * b[i], 0);

// ---------- 数值求导（中心差分再做一次理查森外推，误差约 1e-9） ----------

const H1 = 1e-3;
const H2 = 1e-3;

/** f'(s)。 */
export function derivative(f: (s: number) => number, s: number, h = H1): number {
  const d = (k: number): number => (f(s + k) - f(s - k)) / (2 * k);
  return (4 * d(h / 2) - d(h)) / 3;
}

/** f''(s)。 */
export function secondDerivative(f: (s: number) => number, s: number, h = H2): number {
  const d = (k: number): number => (f(s + k) - 2 * f(s) + f(s - k)) / (k * k);
  return (4 * d(h / 2) - d(h)) / 3;
}

/** 向量值函数逐个分量求导。 */
function derivativeVec(f: (s: number) => Vec, s: number, h = H1): Vec {
  const d = (k: number): Vec => {
    const a = f(s + k);
    const b = f(s - k);
    return a.map((ai, i) => (ai - b[i]) / (2 * k));
  };
  const coarse = d(h);
  return d(h / 2).map((x, i) => (4 * x - coarse[i]) / 3);
}

function secondDerivativeVec(f: (s: number) => Vec, s: number, h = H2): Vec {
  const d = (k: number): Vec => {
    const a = f(s + k);
    const c = f(s);
    const b = f(s - k);
    return a.map((ai, i) => (ai - 2 * c[i] + b[i]) / (k * k));
  };
  const coarse = d(h);
  return d(h / 2).map((x, i) => (4 * x - coarse[i]) / 3);
}

/** x 沿方向 v 走 s：x + s v。 */
export const along = (x: Vec, v: Vec, s: number): Vec => x.map((xi, i) => xi + s * v[i]);

/** 第 k 个分量的偏导数。 */
export function partial(f: (x: Vec) => number, x: Vec, k: number): number {
  const e = x.map((_, i) => (i === k ? 1 : 0));
  return derivative((s) => f(along(x, e, s)), 0);
}

export function gradient(f: (x: Vec) => number, x: Vec): Vec {
  return x.map((_, k) => partial(f, x, k));
}

/** f: Rⁿ → Rᵐ 的雅可比矩阵，m 行 n 列。 */
export function jacobian(f: (x: Vec) => Vec, x: Vec): Mat {
  const cols = x.map((_, k) => {
    const e = x.map((__, i) => (i === k ? 1 : 0));
    return derivativeVec((s) => f(along(x, e, s)), 0);
  });
  return cols[0].map((_, i) => cols.map((col) => col[i]));
}

// ---------- 用广义坐标描述的系统：由各质点的直角坐标按达朗贝尔原理求运动 ----------

export interface System {
  /** 各质点的质量。 */
  masses: number[];
  /** 由广义坐标和时间给出各质点在惯性系里的直角坐标（每个质点 1 到 3 个分量）。 */
  positions(q: Vec, t: number): Vec[];
  /** 主动力的势能，可省略。 */
  potential?(q: Vec, t: number): number;
}

const flatPositions = (sys: System, q: Vec, t: number): Vec => sys.positions(q, t).flat();

const componentMasses = (sys: System, q: Vec, t: number): Vec =>
  sys.positions(q, t).flatMap((r, i) => r.map(() => sys.masses[i]));

/** 惯性系里各质点的速度，排成一个长向量：沿 (q + s q̇, t + s) 对 s 求导。 */
export function velocities(sys: System, q: Vec, qd: Vec, t: number): Vec {
  return derivativeVec((s) => flatPositions(sys, along(q, qd, s), t + s), 0);
}

export function kinetic(sys: System, q: Vec, qd: Vec, t: number): number {
  const v = velocities(sys, q, qd, t);
  const m = componentMasses(sys, q, t);
  return v.reduce((s, vi, i) => s + 0.5 * m[i] * vi * vi, 0);
}

export function lagrangian(sys: System, q: Vec, qd: Vec, t: number): number {
  return kinetic(sys, q, qd, t) - (sys.potential ? sys.potential(q, t) : 0);
}

/**
 * 达朗贝尔原理 Σ_i m_i r̈_i·∂r_i/∂q_j = Q_j 解出 q̈。r̈_i = J_i q̈ + b_i，
 * J_i = ∂r_i/∂q，b_i 是 q̈ = 0 时的加速度（沿 (q + s q̇, t + s) 的二阶导数）；Q_j = −∂V/∂q_j。
 */
export function accelerations(sys: System, q: Vec, qd: Vec, t: number): Vec {
  const J = jacobian((x) => flatPositions(sys, x, t), q);
  const b = secondDerivativeVec((s) => flatPositions(sys, along(q, qd, s), t + s), 0);
  const m = componentMasses(sys, q, t);
  const n = q.length;
  const M = Array.from({ length: n }, (_, j) =>
    Array.from({ length: n }, (__, k) => J.reduce((s, row, i) => s + m[i] * row[j] * row[k], 0)),
  );
  const potential = sys.potential;
  const Q = potential ? gradient((x) => potential(x, t), q).map((g) => -g) : q.map(() => 0);
  const rhs = Q.map((Qj, j) => Qj - J.reduce((s, row, i) => s + m[i] * row[j] * b[i], 0));
  const a = solve(M, rhs);
  if (!a) throw new Error('质量矩阵奇异：广义坐标不独立');
  return a;
}

/** 状态 y = [q, q̇] 的导数，交给 RK4。 */
export function systemDerivative(sys: System): Derivative {
  return (t, y, out) => {
    const n = y.length / 2;
    const q = Array.from(y.subarray(0, n));
    const qd = Array.from(y.subarray(n));
    const a = accelerations(sys, q, qd, t);
    for (let i = 0; i < n; i++) {
      out[i] = qd[i];
      out[n + i] = a[i];
    }
  };
}

/**
 * 直接给出拉格朗日量 L(q, q̇, t) 时，数值地写出拉格朗日方程并解出 q̈：
 * Σ_k ∂²L/∂q̇_j∂q̇_k q̈_k = ∂L/∂q_j − Σ_k ∂²L/∂q̇_j∂q_k q̇_k − ∂²L/∂q̇_j∂t。
 */
export function eulerLagrange(L: (q: Vec, qd: Vec, t: number) => number, q: Vec, qd: Vec, t: number): Vec {
  const n = q.length;
  const unit = (k: number): Vec => q.map((_, i) => (i === k ? 1 : 0));
  // ∂L/∂q̇_j 作为 (q, q̇, t) 的函数
  const p = (j: number, x: Vec, xd: Vec, tt: number): number => derivative((s) => L(x, along(xd, unit(j), s), tt), 0);
  const M = Array.from({ length: n }, (_, j) =>
    Array.from({ length: n }, (__, k) => derivative((s) => p(j, q, along(qd, unit(k), s), t), 0)),
  );
  const rhs = Array.from({ length: n }, (_, j) => {
    const dLdq = derivative((s) => L(along(q, unit(j), s), qd, t), 0);
    const dpdt = derivative((s) => p(j, along(q, qd, s), qd, t + s), 0); // Σ_k ∂p_j/∂q_k q̇_k + ∂p_j/∂t
    return dLdq - dpdt;
  });
  const a = solve(M, rhs);
  if (!a) throw new Error('∂²L/∂q̇² 奇异');
  return a;
}

// ---------- 直角坐标里配拉格朗日乘子：求约束力 ----------

export interface ConstrainedSystem {
  /** 每个坐标分量的质量。 */
  masses: Vec;
  /** 主动力（按坐标分量）。 */
  force(x: Vec, v: Vec, t: number): Vec;
  /** 完整约束 g_k(x, t) = 0。 */
  constraints: ((x: Vec, t: number) => number)[];
}

export interface ConstrainedResult {
  a: Vec;
  lambda: Vec;
  /** 各约束的约束力 λ_k ∇g_k。 */
  constraintForces: Vec[];
}

/**
 * 解 M a = F + Σ λ_k ∇g_k，同时要求 d²g_k/dt² = ∇g_k·a + γ_k = 0（γ_k 是 a = 0 时沿运动的二阶导数）。
 * 约束的梯度线性相关或为零时方程奇异，返回 null。
 */
export function constrained(sys: ConstrainedSystem, x: Vec, v: Vec, t: number): ConstrainedResult | null {
  const n = x.length;
  const c = sys.constraints.length;
  const G = sys.constraints.map((g) => gradient((y) => g(y, t), x));
  const gamma = sys.constraints.map((g) => secondDerivative((s) => g(along(x, v, s), t + s), 0));
  const F = sys.force(x, v, t);
  const A: Mat = [];
  const rhs: Vec = [];
  for (let i = 0; i < n; i++) {
    const row = new Array<number>(n + c).fill(0);
    row[i] = sys.masses[i];
    for (let k = 0; k < c; k++) row[n + k] = -G[k][i];
    A.push(row);
    rhs.push(F[i]);
  }
  for (let k = 0; k < c; k++) {
    const row = new Array<number>(n + c).fill(0);
    for (let i = 0; i < n; i++) row[i] = G[k][i];
    A.push(row);
    rhs.push(-gamma[k]);
  }
  const sol = solve(A, rhs);
  if (!sol) return null;
  const lambda = sol.slice(n);
  return { a: sol.slice(0, n), lambda, constraintForces: lambda.map((l, k) => G[k].map((gi) => l * gi)) };
}

export function constrainedDerivative(sys: ConstrainedSystem): Derivative {
  return (t, y, out) => {
    const n = y.length / 2;
    const x = Array.from(y.subarray(0, n));
    const v = Array.from(y.subarray(n));
    const r = constrained(sys, x, v, t);
    if (!r) throw new Error('约束方程奇异');
    for (let i = 0; i < n; i++) {
      out[i] = v[i];
      out[n + i] = r.a[i];
    }
  };
}

// ---------- 积分 ----------

/** 用 RK4 固定步长积分到 t1（步数取整，最后一步正好落在 t1）。 */
export function integrateTo(f: Derivative, y0: Vec, t0: number, t1: number, dt: number): Float64Array {
  const steps = Math.max(1, Math.ceil((t1 - t0) / dt));
  const h = (t1 - t0) / steps;
  const rk = new RK4(y0.length);
  const y = Float64Array.from(y0);
  for (let i = 0; i < steps; i++) rk.step(f, t0 + i * h, y, h);
  return y;
}

/**
 * 用 RK4 积分，直到 event(t, y) 变号（从 0 出发时，等它离开 0 以后再算变号）；
 * 变号的那一步里对步长二分，定出变号的时刻。到 tMax 还没变号时返回 null。
 */
export function integrateUntil(
  f: Derivative,
  y0: Vec,
  t0: number,
  dt: number,
  tMax: number,
  event: (t: number, y: Float64Array) => number,
): { t: number; y: Float64Array } | null {
  const rk = new RK4(y0.length);
  let y = Float64Array.from(y0);
  let t = t0;
  let e = event(t, y);
  while (t < tMax) {
    const next = Float64Array.from(y);
    rk.step(f, t, next, dt);
    const en = event(t + dt, next);
    if (e !== 0 && en !== 0 && Math.sign(en) !== Math.sign(e)) {
      let lo = 0;
      let hi = dt;
      for (let k = 0; k < 60; k++) {
        const mid = (lo + hi) / 2;
        const trial = Float64Array.from(y);
        rk.step(f, t, trial, mid);
        if (Math.sign(event(t + mid, trial)) === Math.sign(e)) lo = mid;
        else hi = mid;
      }
      const end = Float64Array.from(y);
      rk.step(f, t, end, (lo + hi) / 2);
      return { t: t + (lo + hi) / 2, y: end };
    }
    y = next;
    t += dt;
    e = en;
  }
  return null;
}

/** 一元函数在 [lo, hi] 上的零点（要求两端异号），二分。 */
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

/** 复合辛普森公式求 ∫_a^b f。 */
export function simpson(f: (t: number) => number, a: number, b: number, n = 2000): number {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

/** 两种算法的结果先互相核对：相差超过 1e-6（相对，至少按 1 算）就报错。返回第二个（手推公式的精确值）。 */
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

/** 固定种子的伪随机数（mulberry32），让「随机取点」每次一样。 */
export function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
