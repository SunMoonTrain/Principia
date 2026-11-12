// 多变量微积分验算脚本共用的小工具：数值偏导数、梯度、黑塞矩阵、雅可比矩阵，一元求根、求最值，
// 双指数求积和嵌套的二重积分，牛顿法解方程组，龙格-库塔解 x' = F(x)，
// 折线、三角剖分上的直接求和（配理查森外推），小圆环量、小立方体通量、小球面平均，参数曲面的通量积分。
// 都只做数值计算，不含任何一道题的答案。

export type Vec = number[];
export type Fn = (x: Vec) => number;

/** 一元函数的中心差分导数。 */
export const derivative = (g: (t: number) => number, t: number, h = 1e-5): number => (g(t + h) - g(t - h)) / (2 * h);

/** 第 i 个偏导数（中心差分）。 */
export function partial(f: Fn, x: Vec, i: number, h = 1e-5): number {
  const xp = [...x];
  const xm = [...x];
  xp[i] += h;
  xm[i] -= h;
  return (f(xp) - f(xm)) / (2 * h);
}

/** 二阶偏导数 ∂²f/∂x_i∂x_j（中心差分）。 */
export function second(f: Fn, x: Vec, i: number, j: number, h = 1e-4): number {
  const at = (di: number, dj: number): number => {
    const y = [...x];
    y[i] += di;
    y[j] += dj;
    return f(y);
  };
  if (i === j) return (at(h, 0) - 2 * f(x) + at(-h, 0)) / (h * h);
  return (at(h, h) - at(h, -h) - at(-h, h) + at(-h, -h)) / (4 * h * h);
}

export const grad = (f: Fn, x: Vec): Vec => x.map((_, i) => partial(f, x, i));
export const hessian = (f: Fn, x: Vec): Vec[] => x.map((_, i) => x.map((__, j) => second(f, x, i, j)));

/** 向量值函数的雅可比矩阵：第 i 行第 j 列是 ∂F_i/∂x_j。 */
export function jacobian(F: (x: Vec) => Vec, x: Vec, h = 1e-5): Vec[] {
  const m = F(x).length;
  return Array.from({ length: m }, (_, i) => x.map((__, j) => partial((y) => F(y)[i], x, j, h)));
}

/** 黄金分割法求单峰函数 g 在 [a, b] 上的最小值点。 */
export function argMin(g: (x: number) => number, a: number, b: number, iterations = 200): number {
  const r = (Math.sqrt(5) - 1) / 2;
  let x1 = b - r * (b - a);
  let x2 = a + r * (b - a);
  let g1 = g(x1);
  let g2 = g(x2);
  for (let i = 0; i < iterations; i++) {
    if (g1 > g2) {
      a = x1;
      x1 = x2;
      g1 = g2;
      x2 = a + r * (b - a);
      g2 = g(x2);
    } else {
      b = x2;
      x2 = x1;
      g2 = g1;
      x1 = b - r * (b - a);
      g1 = g(x1);
    }
  }
  return (a + b) / 2;
}

/** 二分法：g 在 [a, b] 两端异号时求一个零点。 */
export function bisect(g: (x: number) => number, a: number, b: number, iterations = 200): number {
  let ga = g(a);
  if (ga * g(b) > 0) throw new Error('二分法：两端同号');
  for (let i = 0; i < iterations; i++) {
    const m = (a + b) / 2;
    const gm = g(m);
    if (ga * gm <= 0) b = m;
    else {
      a = m;
      ga = gm;
    }
  }
  return (a + b) / 2;
}

/** 在以 c 为圆心、半径 rho 的圆上取 n 个点，返回 f 在这些点上的值。 */
export const onCircle = (f: Fn, c: Vec, rho: number, n = 3600): number[] =>
  Array.from({ length: n }, (_, k) => f([c[0] + rho * Math.cos((2 * Math.PI * k) / n), c[1] + rho * Math.sin((2 * Math.PI * k) / n)]));

/** 可重复的伪随机数（线性同余）。 */
export function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

export const det2 = (A: Vec[]): number => A[0][0] * A[1][1] - A[0][1] * A[1][0];

/**
 * 双指数（tanh-sinh）求积：∫_a^b g(x) dx。端点处的根号、导数无界都不影响精度；
 * 区间内部有折点时，调用方在折点处拆开。
 */
export function integrate(g: (x: number) => number, a: number, b: number, h = 1 / 32, tMax = 3.2): number {
  if (a === b) return 0;
  const c = (a + b) / 2;
  const r = (b - a) / 2;
  let sum = 0;
  for (let k = -Math.round(tMax / h); k <= Math.round(tMax / h); k++) {
    const t = k * h;
    const u = (Math.PI / 2) * Math.sinh(t);
    const x = c + r * Math.tanh(u);
    if (x <= Math.min(a, b) || x >= Math.max(a, b)) continue;
    const w = (Math.PI / 2) * Math.cosh(t) / Math.cosh(u) ** 2;
    sum += w * g(x);
  }
  return r * h * sum;
}

/** 在折点处拆开再求积：points 是 [a, …, b] 里从小到大的分点。 */
export const integratePieces = (g: (x: number) => number, points: number[]): number =>
  points.slice(1).reduce((s, b, i) => s + integrate(g, points[i], b), 0);

/** 二重积分 ∫_a^b ∫_{lo(x)}^{hi(x)} g(x, y) dy dx（内层也用双指数求积）。 */
export const integrate2 = (g: (x: number, y: number) => number, a: number, b: number, lo: (x: number) => number, hi: (x: number) => number, h = 1 / 16): number =>
  integrate((x) => integrate((y) => g(x, y), lo(x), hi(x), h), a, b, h);

/** 解 n 元方程组 F(x) = 0：牛顿法，雅可比矩阵用中心差分。 */
export function newton(F: (x: Vec) => Vec, x0: Vec, iterations = 50): Vec {
  let x = [...x0];
  for (let it = 0; it < iterations; it++) {
    const Fx = F(x);
    if (Math.max(...Fx.map(Math.abs)) < 1e-14) break;
    const d = solve(jacobian(F, x, 1e-6), Fx);
    x = x.map((xi, i) => xi - d[i]);
  }
  return x;
}

/** 高斯消元解 A x = b（列主元）。 */
export function solve(A: Vec[], b: Vec): Vec {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    let p = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[p][col])) p = r;
    [M[col], M[p]] = [M[p], M[col]];
    for (let r = col + 1; r < n; r++) {
      const f = M[r][col] / M[col][col];
      for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c];
    }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let s = M[r][n];
    for (let c = r + 1; c < n; c++) s -= M[r][c] * x[c];
    x[r] = s / M[r][r];
  }
  return x;
}

/** 四阶龙格-库塔：沿 x' = F(x) 从 x0 走 steps 步、每步 dt，返回终点。 */
export function rk4(F: (x: Vec) => Vec, x0: Vec, dt: number, steps: number): Vec {
  let x = [...x0];
  const add = (u: Vec, v: Vec, s: number): Vec => u.map((ui, i) => ui + s * v[i]);
  for (let k = 0; k < steps; k++) {
    const k1 = F(x);
    const k2 = F(add(x, k1, dt / 2));
    const k3 = F(add(x, k2, dt / 2));
    const k4 = F(add(x, k3, dt));
    x = x.map((xi, i) => xi + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  }
  return x;
}

export const dot = (a: Vec, b: Vec): number => a.reduce((s, ai, i) => s + ai * b[i], 0);
export const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a: Vec): number => Math.sqrt(dot(a, a));
const sub = (a: Vec, b: Vec): Vec => a.map((ai, i) => ai - b[i]);

/** 理查森外推：g(n) 的误差按 1/n² 走时，用 n 和 2n 两次的结果消掉主项。 */
export const richardson = (g: (n: number) => number, n: number): number => (4 * g(2 * n) - g(n)) / 3;

/** 折线上的和：曲线 r 在 [t0, t1] 上分成 n 段，每段取中点，累加 h(中点, 这一段的位移向量)。 */
export function polylineSum(r: (t: number) => Vec, t0: number, t1: number, n: number, h: (p: Vec, d: Vec) => number): number {
  let s = 0;
  for (let k = 0; k < n; k++) {
    const a = r(t0 + ((t1 - t0) * k) / n);
    const b = r(t0 + ((t1 - t0) * (k + 1)) / n);
    s += h(r(t0 + ((t1 - t0) * (k + 0.5)) / n), sub(b, a));
  }
  return s;
}

/**
 * 三角剖分上的和：参数曲面 r 在 [u0,u1]×[v0,v1] 上分成 n×n 格，每格切成两个三角形，
 * 累加 h(三角形重心, 三角形的有向面积向量 ½(b−a)×(c−a))。
 */
export function triangleSum(r: (u: number, v: number) => Vec, u0: number, u1: number, v0: number, v1: number, n: number, h: (p: Vec, area: Vec) => number): number {
  const P = (i: number, j: number): Vec => r(u0 + ((u1 - u0) * i) / n, v0 + ((v1 - v0) * j) / n);
  let s = 0;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const a = P(i, j);
      const b = P(i + 1, j);
      const c = P(i + 1, j + 1);
      const d = P(i, j + 1);
      for (const [x, y, z] of [[a, b, c], [a, c, d]]) {
        const centroid = x.map((xi, k) => (xi + y[k] + z[k]) / 3);
        s += h(centroid, cross(sub(y, x), sub(z, x)).map((v) => v / 2));
      }
    }
  return s;
}

/** 参数曲面上的通量 ∬ F(r)·(r_u × r_v) du dv：偏导数用中心差分，积分用嵌套的双指数求积。 */
export function surfaceFlux(F: (p: Vec) => Vec, r: (u: number, v: number) => Vec, u0: number, u1: number, v0: number, v1: number): number {
  return integrate2(
    (u, v) => {
      const h = 1e-6;
      const ru = sub(r(u + h, v), r(u - h, v)).map((x) => x / (2 * h));
      const rv = sub(r(u, v + h), r(u, v - h)).map((x) => x / (2 * h));
      return dot(F(r(u, v)), cross(ru, rv));
    },
    u0,
    u1,
    () => v0,
    () => v1,
  );
}

/**
 * 沿以 p 为圆心、半径 eps、垂直于单位向量 n 的小圆（绕 n 逆时针）的环量除以面积：趋于旋度在 n 上的分量。
 * 圆用内接 m 边形代替，除以的是这个多边形的面积，场是一次式时正好相等。
 */
export function circulationDensity(F: (p: Vec) => Vec, p: Vec, n: Vec, eps = 1e-3, m = 720): number {
  const e1 = norm(cross(n, [1, 0, 0])) > 0.5 ? cross(n, [1, 0, 0]) : cross(n, [0, 1, 0]);
  const a = e1.map((x) => x / norm(e1));
  const b = cross(n, a);
  const at = (k: number): Vec => p.map((pi, i) => pi + eps * (Math.cos((2 * Math.PI * k) / m) * a[i] + Math.sin((2 * Math.PI * k) / m) * b[i]));
  let s = 0;
  for (let k = 0; k < m; k++) {
    const u = at(k);
    const w = at(k + 1);
    s += dot(F(u.map((ui, i) => (ui + w[i]) / 2)), sub(w, u));
  }
  return s / ((m / 2) * eps * eps * Math.sin((2 * Math.PI) / m));
}

/** 穿过以 p 为中心、边长 2·eps 的小立方体表面往外的通量除以体积：趋于散度。每个面上用 g×g 个格点的中点和。 */
export function fluxDensity(F: (p: Vec) => Vec, p: Vec, eps = 1e-3, g = 20): number {
  let s = 0;
  for (let axis = 0; axis < 3; axis++)
    for (const side of [-1, 1]) {
      const [i1, i2] = [0, 1, 2].filter((k) => k !== axis);
      for (let a = 0; a < g; a++)
        for (let b = 0; b < g; b++) {
          const q = [...p];
          q[axis] += side * eps;
          q[i1] += eps * (-1 + (2 * (a + 0.5)) / g);
          q[i2] += eps * (-1 + (2 * (b + 0.5)) / g);
          s += side * F(q)[axis] * ((2 * eps) / g) ** 2;
        }
    }
  return s / (2 * eps) ** 3;
}

/** [-1, 1] 上 m 个点的高斯-勒让德求积：返回节点和权重（牛顿法求勒让德多项式的根）。 */
export function gaussLegendre(m: number): { x: number[]; w: number[] } {
  const xs: number[] = [];
  const ws: number[] = [];
  for (let i = 1; i <= m; i++) {
    let x = Math.cos((Math.PI * (i - 0.25)) / (m + 0.5));
    let dp = 0;
    for (let it = 0; it < 100; it++) {
      let p0 = 1;
      let p1 = x;
      for (let k = 2; k <= m; k++) [p0, p1] = [p1, ((2 * k - 1) * x * p1 - (k - 1) * p0) / k];
      dp = (m * (x * p1 - p0)) / (x * x - 1);
      const dx = p1 / dp;
      x -= dx;
      if (Math.abs(dx) < 1e-16) break;
    }
    xs.push(x);
    ws.push(2 / ((1 - x * x) * dp * dp));
  }
  return { x: xs, w: ws };
}

/** 以 p 为中心、半径 eps 的球面上 f 的平均值（θ 方向高斯点，φ 方向等分）。f 光滑时 6(平均 − f(p))/eps² 趋于拉普拉斯算子。 */
export function sphereMean(f: (p: Vec) => number, p: Vec, eps: number, m = 24): number {
  // [-1,1] 上 m 个高斯-勒让德点：牛顿法求勒让德多项式的根
  let s = 0;
  for (let i = 1; i <= m; i++) {
    let x = Math.cos((Math.PI * (i - 0.25)) / (m + 0.5));
    let dp = 0;
    for (let it = 0; it < 100; it++) {
      let p0 = 1;
      let p1 = x;
      for (let k = 2; k <= m; k++) [p0, p1] = [p1, ((2 * k - 1) * x * p1 - (k - 1) * p0) / k];
      dp = (m * (x * p1 - p0)) / (x * x - 1);
      const dx = p1 / dp;
      x -= dx;
      if (Math.abs(dx) < 1e-16) break;
    }
    const w = 2 / ((1 - x * x) * dp * dp);
    const ring = 2 * m;
    for (let k = 0; k < ring; k++) {
      const phi = (2 * Math.PI * k) / ring;
      const st = Math.sqrt(1 - x * x);
      s += (w / ring) * f([p[0] + eps * st * Math.cos(phi), p[1] + eps * st * Math.sin(phi), p[2] + eps * x]);
    }
  }
  return s / 2;
}
