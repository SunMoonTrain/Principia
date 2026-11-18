// 复分析验算脚本共用的工具（批次 22 加的；文件名第三段以下划线开头，npm run verify 不把它当小节脚本）。
// 复数算术和初等函数（主值、各分支），多项式求根（同时迭代，不用求根公式、棣莫弗公式），
// 按定义求复积分（折线上的和，再理查森外推），小圆上的柯西积分求导数，沿各方向的差商（看一点处是否复可导），
// 柯西-黎曼方程的残差，沿线段积出调和共轭，累计辐角求绕数，像曲线的切向（量夹角、伸缩），过三点的圆。
// 都只做数值计算，不含任何一道题的答案。照别的领域的辅助文件，不依赖 math.calculus._calc.ts。

export class Complex {
  constructor(
    readonly re: number,
    readonly im = 0,
  ) {}

  static of(z: Complex | number): Complex {
    return typeof z === 'number' ? new Complex(z, 0) : z;
  }

  /** r(cos θ + i sin θ)。 */
  static fromPolar(r: number, theta: number): Complex {
    return new Complex(r * Math.cos(theta), r * Math.sin(theta));
  }

  add(w: Complex | number): Complex {
    const b = Complex.of(w);
    return new Complex(this.re + b.re, this.im + b.im);
  }

  sub(w: Complex | number): Complex {
    const b = Complex.of(w);
    return new Complex(this.re - b.re, this.im - b.im);
  }

  mul(w: Complex | number): Complex {
    const b = Complex.of(w);
    return new Complex(this.re * b.re - this.im * b.im, this.re * b.im + this.im * b.re);
  }

  /** 除法用 Smith 的办法，分母很大、很小时不溢出。 */
  div(w: Complex | number): Complex {
    const b = Complex.of(w);
    if (Math.abs(b.re) >= Math.abs(b.im)) {
      const r = b.im / b.re;
      const den = b.re + b.im * r;
      return new Complex((this.re + this.im * r) / den, (this.im - this.re * r) / den);
    }
    const r = b.re / b.im;
    const den = b.re * r + b.im;
    return new Complex((this.re * r + this.im) / den, (this.im * r - this.re) / den);
  }

  neg(): Complex {
    return new Complex(-this.re, -this.im);
  }

  conj(): Complex {
    return new Complex(this.re, -this.im);
  }

  scale(k: number): Complex {
    return new Complex(this.re * k, this.im * k);
  }

  abs(): number {
    return Math.hypot(this.re, this.im);
  }

  /** 辐角主值，取在 (−π, π]：负实轴上（虚部是 −0 也算）给 π。 */
  arg(): number {
    const a = Math.atan2(this.im, this.re);
    return a === -Math.PI ? Math.PI : a;
  }

  /** 和 w 相差不超过 tol·max(1, |w|)。 */
  isClose(w: Complex | number, tol = 1e-9): boolean {
    const b = Complex.of(w);
    return this.sub(b).abs() <= tol * Math.max(1, b.abs());
  }

  toString(digits = 12): string {
    const im = this.im < 0 || Object.is(this.im, -0) ? `− ${(-this.im).toPrecision(digits)}` : `+ ${this.im.toPrecision(digits)}`;
    return `${this.re.toPrecision(digits)} ${im}i`;
  }
}

export const cx = (re: number, im = 0): Complex => new Complex(re, im);
export const I = new Complex(0, 1);
const ZERO = new Complex(0, 0);
const ONE = new Complex(1, 0);

// ---- 初等函数 ----

export const cexp = (z: Complex): Complex => Complex.fromPolar(Math.exp(z.re), z.im);

/** 对数主值 Log z = ln|z| + i Arg z，Arg 在 (−π, π]。 */
export function clog(z: Complex): Complex {
  if (z.abs() === 0) throw new Error('Log 0 没有定义');
  return new Complex(Math.log(z.abs()), z.arg());
}

/** 第 k 个分支：ln|z| + i(Arg z + 2kπ)。 */
export function logBranch(z: Complex, k: number): Complex {
  return clog(z).add(new Complex(0, 2 * Math.PI * k));
}

/** 幂的主值 z^w = e^{w Log z}；z = 0 时只在 Re w > 0 时给 0。 */
export function cpow(z: Complex, w: Complex | number): Complex {
  const b = Complex.of(w);
  if (z.abs() === 0) {
    if (b.re > 0) return ZERO;
    throw new Error('0 的这个幂没有定义');
  }
  return cexp(b.mul(clog(z)));
}

/** 幂的第 k 个分支 e^{w(Log z + 2kπi)}。 */
export const powBranch = (z: Complex, w: Complex | number, k: number): Complex => cexp(Complex.of(w).mul(logBranch(z, k)));

/** 平方根主值（实部 ≥ 0，负实轴上取 i√|x|），不经过 Log，免得和 cpow 用同一条路。 */
export function csqrt(z: Complex): Complex {
  const r = z.abs();
  if (r === 0) return ZERO;
  const t = Math.sqrt((r + Math.abs(z.re)) / 2);
  if (z.re >= 0) return new Complex(t, z.im / (2 * t));
  return new Complex(Math.abs(z.im) / (2 * t), z.im < 0 ? -t : t);
}

export const csin = (z: Complex): Complex => new Complex(Math.sin(z.re) * Math.cosh(z.im), Math.cos(z.re) * Math.sinh(z.im));
export const ccos = (z: Complex): Complex => new Complex(Math.cos(z.re) * Math.cosh(z.im), -Math.sin(z.re) * Math.sinh(z.im));
export const csinh = (z: Complex): Complex => new Complex(Math.sinh(z.re) * Math.cos(z.im), Math.cosh(z.re) * Math.sin(z.im));
export const ccosh = (z: Complex): Complex => new Complex(Math.cosh(z.re) * Math.cos(z.im), Math.sinh(z.re) * Math.sin(z.im));

// ---- 多项式 ----

/** 秦九韶算法，系数从最高次排起。 */
export function polyEval(coeffs: (Complex | number)[], z: Complex): Complex {
  let s = ZERO;
  for (const a of coeffs) s = s.mul(z).add(a);
  return s;
}

/**
 * 多项式的全部复根（系数从最高次排起，可以是复数）：Aberth–Ehrlich 同时迭代，初值放在半径 |a_n/a_0|^{1/n} 的圆上、
 * 错开一个不规则的角度，收敛后对原多项式再做几步牛顿迭代。单根精确到 10⁻¹⁴ 左右；重根只到 10⁻⁸ 左右。
 */
export function polyRoots(coeffs: (Complex | number)[]): Complex[] {
  let a = coeffs.map(Complex.of);
  while (a.length > 1 && a[0].abs() === 0) a = a.slice(1);
  const n = a.length - 1;
  if (n < 1) return [];
  const lead = a[0];
  const monic = a.map((x) => x.div(lead));
  const deriv = monic.slice(0, n).map((x, i) => x.scale(n - i));
  const rho = Math.max(Math.abs(monic[n].abs()) ** (1 / n), 0.5);
  let z = Array.from({ length: n }, (_, k) => Complex.fromPolar(rho, (2 * Math.PI * k) / n + 0.4));
  for (let iter = 0; iter < 2000; iter++) {
    let maxStep = 0;
    z = z.map((zk, k) => {
      const p = polyEval(monic, zk);
      if (p.abs() === 0) return zk;
      let dp = polyEval(deriv, zk);
      if (dp.abs() === 0) dp = new Complex(1e-12, 0);
      const ratio = p.div(dp);
      let s = ZERO;
      z.forEach((zj, j) => {
        if (j !== k) s = s.add(ONE.div(zk.sub(zj)));
      });
      const step = ratio.div(ONE.sub(ratio.mul(s)));
      maxStep = Math.max(maxStep, step.abs() / Math.max(1, zk.abs()));
      return zk.sub(step);
    });
    if (maxStep < 1e-16) break;
  }
  return z.map((zk) => {
    let r = zk;
    for (let i = 0; i < 4; i++) {
      const dp = polyEval(deriv, r);
      if (dp.abs() === 0) break;
      const next = r.sub(polyEval(monic, r).div(dp));
      if (!Number.isFinite(next.re) || !Number.isFinite(next.im)) break;
      r = next;
    }
    return r;
  });
}

/** 把一组复数按辐角主值从小到大排（辐角相同的按模），方便和集合答案对照。 */
export const sortByArg = (zs: Complex[]): Complex[] => [...zs].sort((p, q) => p.arg() - q.arg() || p.abs() - q.abs());

// ---- 外推和实积分 ----

/** 理查森外推 g(h) 在 h → 0⁺ 时的值：假定 g(h) = L + c₁h + c₂h² + …，在 h0/2^k 处取值逐级消去。 */
export function extrapolate(g: (h: number) => number, h0 = 1 / 32, levels = 8): { value: number; converged: boolean } {
  const rows: number[][] = [];
  for (let k = 0; k < levels; k++) {
    const row = [g(h0 / 2 ** k)];
    for (let j = 1; j <= k; j++) row.push(row[j - 1] + (row[j - 1] - rows[k - 1][j - 1]) / (2 ** j - 1));
    rows.push(row);
  }
  const last = rows[levels - 1][levels - 1];
  const prev = rows[levels - 2][levels - 2];
  return { value: last, converged: Number.isFinite(last) && Math.abs(last - prev) <= 1e-7 * Math.max(1, Math.abs(last)) };
}

/** 复数值的 g(h)：同一组 h 上只算一次，实部、虚部各自外推。 */
export function extrapolateC(g: (h: number) => Complex, h0 = 1 / 32, levels = 8): { value: Complex; converged: boolean } {
  const cache = new Map<number, Complex>();
  const at = (h: number) => {
    let v = cache.get(h);
    if (!v) {
      v = g(h);
      cache.set(h, v);
    }
    return v;
  };
  const re = extrapolate((h) => at(h).re, h0, levels);
  const im = extrapolate((h) => at(h).im, h0, levels);
  return { value: new Complex(re.value, im.value), converged: re.converged && im.converged };
}

/** 实函数在 [a, b] 上的积分：双指数（tanh-sinh）求积，端点处可以有可积的奇点。 */
export function integrate(f: (x: number) => number, a: number, b: number): number {
  const half = (b - a) / 2;
  let prev = Number.NaN;
  for (let level = 1; level <= 9; level++) {
    const h = 2 ** -level;
    const K = Math.ceil(4 / h);
    let sum = 0;
    for (let k = -K; k <= K; k++) {
      const t = k * h;
      const u = (Math.PI / 2) * Math.sinh(t);
      const w = ((Math.PI / 2) * Math.cosh(t)) / Math.cosh(u) ** 2;
      if (!(w > 0) || !Number.isFinite(w)) continue;
      const delta = (b - a) / (1 + Math.exp(2 * Math.abs(u)));
      if (!(delta > 0)) continue;
      const v = f(t >= 0 ? b - delta : a + delta);
      if (Number.isFinite(v)) sum += w * v;
    }
    const est = half * h * sum;
    if (Math.abs(est - prev) <= 1e-13 * Math.max(1, Math.abs(est))) return est;
    prev = est;
  }
  return prev;
}

/** 实变量的复值函数 g(t) 在 t 处的导数：中心差商在 h = 2^{−5−k} 上外推，实部、虚部各自外推。 */
export function derivativeT(g: (t: number) => Complex, t: number): { value: Complex; converged: boolean } {
  return extrapolateC((h) => g(t + h).sub(g(t - h)).scale(1 / (2 * h)), 1 / 32, 6);
}

/** 复数项级数的部分和 ∑_{n=n0}^{N} a(n)，在升序的各个 N 处各给一个值（实部、虚部分别做 Kahan 补偿求和）。 */
export function partialSumsC(a: (n: number) => Complex, Ns: number[], n0 = 0): Complex[] {
  const out: Complex[] = [];
  let sr = 0;
  let si = 0;
  let cr = 0;
  let ci = 0;
  let n = n0;
  for (const N of Ns) {
    for (; n <= N; n++) {
      const t = a(n);
      const yr = t.re - cr;
      const tr = sr + yr;
      cr = tr - sr - yr;
      sr = tr;
      const yi = t.im - ci;
      const ti = si + yi;
      ci = ti - si - yi;
      si = ti;
    }
    out.push(new Complex(sr, si));
  }
  return out;
}

/** 复数值函数 g(t) 在实区间 [a, b] 上的积分，实部、虚部分开积。 */
export function integrateC(g: (t: number) => Complex, a: number, b: number): Complex {
  return new Complex(
    integrate((t) => g(t).re, a, b),
    integrate((t) => g(t).im, a, b),
  );
}

// ---- 路径和复积分 ----

/** 参数曲线 z(t)，t 从 t0 走到 t1。 */
export interface Path {
  z: (t: number) => Complex;
  t0: number;
  t1: number;
}

/** 从 a 到 b 的线段。 */
export function segment(a: Complex | number, b: Complex | number): Path {
  const A = Complex.of(a);
  const B = Complex.of(b);
  return { z: (t) => A.add(B.sub(A).scale(t)), t0: 0, t1: 1 };
}

/** 圆心 c、半径 r 的圆，从 c + r 出发逆时针走 turns 圈（turns 为负就是顺时针）。 */
export function circle(c: Complex | number, r: number, turns = 1): Path {
  const C0 = Complex.of(c);
  return { z: (t) => C0.add(Complex.fromPolar(r, t)), t0: 0, t1: 2 * Math.PI * turns };
}

/** 圆心 c、半径 r 的圆弧，辐角从 θ0 走到 θ1（θ1 < θ0 就是顺时针）。 */
export function arc(c: Complex | number, r: number, theta0: number, theta1: number): Path {
  const C0 = Complex.of(c);
  return { z: (t) => C0.add(Complex.fromPolar(r, t)), t0: theta0, t1: theta1 };
}

/** 同一条曲线反着走。 */
export const reversePath = (p: Path): Path => ({ z: (t) => p.z(p.t0 + p.t1 - t), t0: p.t0, t1: p.t1 });

/** 把 [t0, t1] 等分成 n 段，依次交给 visit(前一点, 后一点, 前一点处的 f, 后一点处的 f)。 */
function walk(f: (z: Complex) => Complex, p: Path, n: number, visit: (z0: Complex, z1: Complex, f0: Complex, f1: Complex) => void): void {
  let z0 = p.z(p.t0);
  let f0 = f(z0);
  for (let k = 1; k <= n; k++) {
    const z1 = p.z(p.t0 + ((p.t1 - p.t0) * k) / n);
    const f1 = f(z1);
    visit(z0, z1, f0, f1);
    z0 = z1;
    f0 = f1;
  }
}

/**
 * 按定义求 ∫_C f(z) dz：把曲线分成 n 段，求和 ∑ ½(f(z_{k−1}) + f(z_k))(z_k − z_{k−1})，n = n0·2^k，再按 h = 1/n 外推。
 * 不用参数的导数 z′(t)。f 在曲线上要连续；曲线有角点时分段算再相加（contourIntegralPieces）。
 */
export function contourIntegral(f: (z: Complex) => Complex, p: Path, n0 = 64, levels = 8): { value: Complex; converged: boolean } {
  return extrapolateC(
    (h) => {
      let re = 0;
      let im = 0;
      walk(f, p, Math.round(1 / h), (z0, z1, f0, f1) => {
        const term = f0.add(f1).scale(0.5).mul(z1.sub(z0));
        re += term.re;
        im += term.im;
      });
      return new Complex(re, im);
    },
    1 / n0,
    levels,
  );
}

/** 几段曲线首尾相接时的复积分：各段分别求，再相加。 */
export function contourIntegralPieces(f: (z: Complex) => Complex, pieces: Path[]): { value: Complex; converged: boolean } {
  let total = ZERO;
  let ok = true;
  for (const p of pieces) {
    const r = contourIntegral(f, p);
    total = total.add(r.value);
    ok &&= r.converged;
  }
  return { value: total, converged: ok };
}

/** 曲线的长度：内接折线长，按 h = 1/n 外推。 */
export function pathLength(p: Path, n0 = 64, levels = 8): { value: number; converged: boolean } {
  return extrapolate(
    (h) => {
      let s = 0;
      walk(() => ZERO, p, Math.round(1 / h), (z0, z1) => {
        s += z1.sub(z0).abs();
      });
      return s;
    },
    1 / n0,
    levels,
  );
}

/** |f| 在曲线上的最大值：先在 n 个点上取值，再在最大的那一点两旁用黄金分割细找。 */
export function maxModulusOnPath(f: (z: Complex) => Complex, p: Path, n = 20000): { value: number; at: Complex } {
  const g = (t: number) => f(p.z(t)).abs();
  let best = -Infinity;
  let bestK = 0;
  for (let k = 0; k <= n; k++) {
    const v = g(p.t0 + ((p.t1 - p.t0) * k) / n);
    if (v > best) {
      best = v;
      bestK = k;
    }
  }
  const dt = (p.t1 - p.t0) / n;
  let lo = p.t0 + (bestK - 1) * dt;
  let hi = p.t0 + (bestK + 1) * dt;
  const lower = Math.min(p.t0, p.t1);
  const upper = Math.max(p.t0, p.t1);
  lo = Math.min(Math.max(lo, lower), upper);
  hi = Math.min(Math.max(hi, lower), upper);
  const phi = (Math.sqrt(5) - 1) / 2;
  for (let i = 0; i < 100; i++) {
    const m1 = hi - phi * (hi - lo);
    const m2 = lo + phi * (hi - lo);
    if (g(m1) < g(m2)) lo = m1;
    else hi = m2;
  }
  const tBest = (lo + hi) / 2;
  const refined = g(tBest);
  return refined >= best ? { value: refined, at: p.z(tBest) } : { value: best, at: p.z(p.t0 + bestK * dt) };
}

/** 曲线绕点 a 的圈数：沿曲线累计 z − a 的辐角增量，除以 2π（不取整，调用处自己看离整数多近）。曲线不能经过 a。 */
export function windingNumber(p: Path, a: Complex | number, n = 20000): number {
  const A = Complex.of(a);
  let total = 0;
  walk(() => ZERO, p, n, (z0, z1) => {
    total += z1.sub(A).div(z0.sub(A)).arg();
  });
  return total / (2 * Math.PI);
}

// ---- 导数 ----

/**
 * f 在 z0 处的 n 阶复导数：小圆 |z − z0| = r 上的柯西积分 f⁽ⁿ⁾(z0) = n!/(2πi)∮ f(z)/(z − z0)^{n+1} dz，
 * 用 N 个等分点的梯形公式（对全纯函数按指数收敛）。再用半径 r/2 算一次核对，差得多就报错：
 * 多半是 r 取大了，圆盘里有奇点。只对全纯函数有意义：z̄ 这类不全纯的函数，两个半径也可能给出一样的数，
 * 判断一点处是否复可导用 complexDifferentiableAt。
 */
export function derivativeC(f: (z: Complex) => Complex, z0: Complex | number, order = 1, r = 0.1, N = 256): Complex {
  const Z0 = Complex.of(z0);
  const at = (rad: number) => {
    let s = ZERO;
    for (let k = 0; k < N; k++) {
      const th = (2 * Math.PI * k) / N;
      s = s.add(f(Z0.add(Complex.fromPolar(rad, th))).mul(Complex.fromPolar(1, -order * th)));
    }
    let fact = 1;
    for (let i = 2; i <= order; i++) fact *= i;
    return s.scale(fact / (N * rad ** order));
  };
  const a = at(r);
  const b = at(r / 2);
  if (!a.isClose(b, 1e-8)) throw new Error(`z0 = ${Z0.toString(6)} 处半径 ${r} 和 ${r / 2} 的柯西积分不一致：f 在圆盘里不全纯，或者半径取大了`);
  return b;
}

/** 沿方向 dir 的差商的极限 lim_{h→0⁺} (f(z0 + hd) − f(z0))/(hd)，d = dir/|dir|，按 h 外推。 */
export function directionalQuotient(f: (z: Complex) => Complex, z0: Complex | number, dir: Complex | number): { value: Complex; converged: boolean } {
  const Z0 = Complex.of(z0);
  const D = Complex.of(dir);
  const d = D.scale(1 / D.abs());
  const f0 = f(Z0);
  return extrapolateC((h) => f(Z0.add(d.scale(h))).sub(f0).div(d.scale(h)), 1 / 32, 8);
}

/**
 * 看 f 在 z0 处是否复可导：12 个方向的差商极限两两相差不超过 tol·max(1, |q₀|) 才算，导数取第一个方向的。
 * 用在 |z|²、z̄ 这类不全纯的函数上，判断「只在哪些点复可导」。
 */
export function complexDifferentiableAt(f: (z: Complex) => Complex, z0: Complex | number, tol = 1e-6): { differentiable: boolean; derivative: Complex; spread: number } {
  const qs = Array.from({ length: 12 }, (_, k) => directionalQuotient(f, z0, Complex.fromPolar(1, (2 * Math.PI * k) / 12 + 0.1)).value);
  const spread = Math.max(...qs.map((q) => q.sub(qs[0]).abs()));
  return { differentiable: spread <= tol * Math.max(1, qs[0].abs()), derivative: qs[0], spread };
}

/** 偏导数 ∂F/∂x、∂F/∂y：中心差商在 h = 2^{−5−k} 上外推。 */
export function partialX(F: (x: number, y: number) => number, x: number, y: number): number {
  return extrapolate((h) => (F(x + h, y) - F(x - h, y)) / (2 * h), 1 / 32, 6).value;
}
export function partialY(F: (x: number, y: number) => number, x: number, y: number): number {
  return extrapolate((h) => (F(x, y + h) - F(x, y - h)) / (2 * h), 1 / 32, 6).value;
}

/** 柯西-黎曼方程在 (x, y) 处的残差 r1 = u_x − v_y、r2 = u_y + v_x，四个偏导数也一并给出（数值求的）。 */
export function cauchyRiemann(u: (x: number, y: number) => number, v: (x: number, y: number) => number, x: number, y: number) {
  const ux = partialX(u, x, y);
  const uy = partialY(u, x, y);
  const vx = partialX(v, x, y);
  const vy = partialY(v, x, y);
  return { ux, uy, vx, vy, r1: ux - vy, r2: uy + vx };
}

/**
 * 调和函数 u 的共轭：v(p1) − v(p0) = ∫ (−u_y dx + u_x dy)，沿从 p0 到 p1 的线段积（偏导数数值求）。
 * 线段要整个落在 u 调和的区域里；不走柯西-黎曼方程的现成解法，就是按定义积出来。
 */
export function harmonicConjugateIncrement(u: (x: number, y: number) => number, p0: [number, number], p1: [number, number]): number {
  const [x0, y0] = p0;
  const dx = p1[0] - x0;
  const dy = p1[1] - y0;
  return integrate((t) => {
    const x = x0 + t * dx;
    const y = y0 + t * dy;
    return -partialY(u, x, y) * dx + partialX(u, x, y) * dy;
  }, 0, 1);
}

// ---- 映射的几何 ----

/** 过 z0、方向 dir 的直线 z0 + t·d 在 f 下的像，在 t = 0 处的切向：lim_{h→0⁺} (f(z0 + hd) − f(z0))/h，d = dir/|dir|。 */
export function imageTangent(f: (z: Complex) => Complex, z0: Complex | number, dir: Complex | number): { value: Complex; converged: boolean } {
  const Z0 = Complex.of(z0);
  const D = Complex.of(dir);
  const d = D.scale(1 / D.abs());
  const f0 = f(Z0);
  return extrapolateC((h) => f(Z0.add(d.scale(h))).sub(f0).scale(1 / h), 1 / 32, 8);
}

/**
 * 同一条直线的像在 f(z0) 处出发的方向（单位复数）：lim_{h→0⁺} Δ/|Δ|，Δ = f(z0 + hd) − f(z0)。
 * 和 imageTangent 不同，导数为零的点（如 z² 在 0 处，Δ 按 h² 趋零）也能看出方向，用来看夹角怎样加倍。
 */
export function imageDirection(f: (z: Complex) => Complex, z0: Complex | number, dir: Complex | number): { value: Complex; converged: boolean } {
  const Z0 = Complex.of(z0);
  const D = Complex.of(dir);
  const d = D.scale(1 / D.abs());
  const f0 = f(Z0);
  return extrapolateC(
    (h) => {
      const delta = f(Z0.add(d.scale(h))).sub(f0);
      return delta.scale(1 / delta.abs());
    },
    1 / 32,
    8,
  );
}

/** 从方向 u 转到方向 v 的角，取在 (−π, π]（逆时针为正）。 */
export const angleBetween = (u: Complex, v: Complex): number => v.div(u).arg();

/** 过三点的圆（不共线时）：圆心和半径；共线时给 null（像是直线）。 */
export function circleThrough(a: Complex, b: Complex, c: Complex): { center: Complex; radius: number } | null {
  const ax = a.re;
  const ay = a.im;
  const bx = b.re;
  const by = b.im;
  const cxx = c.re;
  const cy = c.im;
  const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cxx * (ay - by));
  const scaleRef = Math.max(a.abs(), b.abs(), c.abs(), 1);
  if (Math.abs(d) <= 1e-12 * scaleRef * scaleRef) return null;
  const a2 = ax * ax + ay * ay;
  const b2 = bx * bx + by * by;
  const c2 = cxx * cxx + cy * cy;
  const ux = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d;
  const uy = (a2 * (cxx - bx) + b2 * (ax - cxx) + c2 * (bx - ax)) / d;
  const center = new Complex(ux, uy);
  return { center, radius: center.sub(a).abs() };
}
