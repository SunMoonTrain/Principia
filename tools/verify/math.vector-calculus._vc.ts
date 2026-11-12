// 多变量微积分验算脚本共用的小工具：数值偏导数、梯度、黑塞矩阵、雅可比矩阵，一元求根、求最值。
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
