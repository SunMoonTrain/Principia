// 复分析验算脚本共用的工具（批次 22 加的；文件名第三段以下划线开头，npm run verify 不把它当小节脚本）。
// 复数算术和初等函数（主值、各分支），多项式求根（同时迭代，不用求根公式、棣莫弗公式），
// 按定义求复积分（折线上的和，再理查森外推），小圆上的柯西积分求导数，沿各方向的差商（看一点处是否复可导），
// 柯西-黎曼方程的残差，沿线段积出调和共轭，累计辐角求绕数，像曲线的切向（量夹角、伸缩），过三点的圆。
// 批次 23 补的：圆周上的梯形公式和柯西积分，泰勒系数（圆周采样）和收敛半径（系数比外推），Muller 法求零点，
// 拉普拉斯算子、圆周和圆盘上的平均，上半平面和单位圆盘的泊松积分，狄利克雷问题候选解的核对，区域里格点上的最大值，
// 沿路径连续地取辐角和对数，扩充复平面上的分式线性变换（复合、逆、由三对点求出、不动点、圆和直线的像）。
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

// ---- 批次 23：圆周积分、柯西积分、泰勒系数、收敛半径、求零点 ----

/**
 * ∮_{|z−c|=r} g(z) dz（逆时针）：θ 上等分 N 点的梯形公式 (2πr/N)·i·∑ g(c + re^{iθ_k})e^{iθ_k}。
 * g 在圆周附近全纯时按指数收敛，圆里面可以有奇点，只要离圆周不太近。再用 N/2 点算一次核对，差得多就报错。
 * 和 contourIntegral（折线上的和，不用 z′(t)）是两条路，可以互相核对。
 */
export function circleIntegral(g: (z: Complex) => Complex, c: Complex | number, r: number, N = 1024): Complex {
  const C0 = Complex.of(c);
  const at = (n: number) => {
    let s = ZERO;
    for (let k = 0; k < n; k++) {
      const e = Complex.fromPolar(1, (2 * Math.PI * k) / n);
      s = s.add(g(C0.add(e.scale(r))).mul(e));
    }
    return s.mul(new Complex(0, (2 * Math.PI * r) / n));
  };
  const a = at(N);
  const b = at(N / 2);
  if (!a.isClose(b, 1e-9)) throw new Error(`|z − ${C0.toString(6)}| = ${r} 上 ${N} 点和 ${N / 2} 点的梯形公式不一致：被积函数在圆周附近有奇点，或者 N 取小了`);
  return a;
}

/** 柯西积分 (1/2πi)∫_C f(ζ)/(ζ − z0) dζ，按定义积（contourIntegral，几段曲线就分段相加）；曲线不能经过 z0。 */
export function cauchyIntegral(f: (z: Complex) => Complex, pieces: Path | Path[], z0: Complex | number): Complex {
  const Z0 = Complex.of(z0);
  const list = Array.isArray(pieces) ? pieces : [pieces];
  const r = contourIntegralPieces((z) => f(z).div(z.sub(Z0)), list);
  if (!r.converged) throw new Error('柯西积分没有收敛：曲线经过或很靠近 z0，或者 f 在曲线上不连续');
  return r.value.div(new Complex(0, 2 * Math.PI));
}

/**
 * f 在 c 处泰勒展开的系数 a_0, …, a_nMax：圆周 |z − c| = r 上等分 N 点，a_n ≈ (1/(N rⁿ))∑ f(c + re^{iθ_k})e^{−inθ_k}
 * （混叠误差约 (r/R)^{N−n}，R 是 c 到最近的不全纯点的距离），N 要大于 2·nMax。
 * 低阶（n ≤ 5）再用半径 r/2 核对：闭圆盘 |z − c| ≤ r 里有 f 不全纯的点时对不上，报错。
 * 高阶系数的绝对误差约 10⁻¹⁶·max|f|/rⁿ，要用高阶系数就把 r 取得靠近 R。
 */
export function taylorCoefficients(f: (z: Complex) => Complex, c: Complex | number, nMax: number, r = 0.5, N = 1024): Complex[] {
  if (N <= 2 * nMax) throw new Error(`N = ${N} 太小，要大于 2·nMax = ${2 * nMax}`);
  const C0 = Complex.of(c);
  const sample = (rad: number) => Array.from({ length: N }, (_, k) => f(C0.add(Complex.fromPolar(rad, (2 * Math.PI * k) / N))));
  const coeffs = (vals: Complex[], rad: number, upTo: number) => {
    const out: Complex[] = [];
    for (let n = 0; n <= upTo; n++) {
      let s = ZERO;
      for (let k = 0; k < N; k++) s = s.add(vals[k].mul(Complex.fromPolar(1, (-2 * Math.PI * n * k) / N)));
      out.push(s.scale(1 / (N * rad ** n)));
    }
    return out;
  };
  const vr = sample(r);
  const M = Math.max(...vr.map((v) => v.abs()));
  const a = coeffs(vr, r, nMax);
  const low = Math.min(5, nMax);
  const b = coeffs(sample(r / 2), r / 2, low);
  for (let n = 0; n <= low; n++) {
    if (a[n].sub(b[n]).abs() > 1e-9 * (a[n].abs() + M / r ** n)) throw new Error(`半径 ${r} 和 ${r / 2} 算出的 a_${n} 不一致：圆盘里有 f 不全纯的点，把 r 取小`);
  }
  return a;
}

/**
 * 收敛半径：系数比 (|a_n|/|a_{n+s}|)^{1/s} 在 n = n0·2^k 上按 1/n 外推。
 * a_n 形如 C·n^p·R^{−n}·(1 + c₁/n + …) 时，比值是 R·(1 + d₁/n + …)，这样外推收敛；
 * logAbs(n) 给 ln|a_n|（阶乘、高次幂直接取对数，免得溢出）；只有偶次项这类情形把步长 s 取 2。
 * 比值在最后两个 n 上已经不动了（系数按几何级数收敛，比如只有极点时），就直接取最后一个，不外推：
 * 那时按 1/n 外推反而会把开头几项的误差带进来。
 * 只看系数，不用「到最近的不全纯点的距离」。系数里有 0 时比值没有意义，converged 为 false。
 */
export function radiusByRatio(logAbs: (n: number) => number, step = 1, n0 = 16, levels = 6): { value: number; converged: boolean } {
  const ratio = (n: number) => Math.exp((logAbs(n) - logAbs(n + step)) / step);
  const nLast = n0 * 2 ** (levels - 1);
  const last = ratio(nLast);
  const prev = ratio(nLast / 2);
  if (Number.isFinite(last) && Math.abs(last - prev) <= 1e-10 * Math.abs(last)) return { value: last, converged: true };
  return extrapolate((h) => ratio(Math.round(1 / h)), 1 / n0, levels);
}

/**
 * f 的一个零点：从 z0 附近出发的 Muller 法（过最近三点的二次插值，取离当前点近的那个根），不用导数，复根、重根都能找。
 * 步长小于 10⁻¹⁵·max(1, |z|) 时停；找到的是不是零点、是不是想要的那个，调用处自己核对。
 */
export function mullerRoot(f: (z: Complex) => Complex, z0: Complex | number, h = 0.1, maxIter = 200): Complex {
  const Z0 = Complex.of(z0);
  let x0 = Z0.sub(h);
  let x1 = Z0.add(new Complex(0, h));
  let x2 = Z0;
  let f0 = f(x0);
  let f1 = f(x1);
  let f2 = f(x2);
  for (let iter = 0; iter < maxIter; iter++) {
    if (f2.abs() === 0) return x2;
    const h1 = x1.sub(x0);
    const h2 = x2.sub(x1);
    const d1 = f1.sub(f0).div(h1);
    const d2 = f2.sub(f1).div(h2);
    const a = d2.sub(d1).div(h2.add(h1));
    const b = a.mul(h2).add(d2);
    const disc = csqrt(b.mul(b).sub(a.mul(f2).scale(4)));
    const p = b.add(disc);
    const m = b.sub(disc);
    const den = p.abs() >= m.abs() ? p : m;
    const dx = den.abs() === 0 ? new Complex(h, 0) : f2.scale(-2).div(den);
    x0 = x1;
    f0 = f1;
    x1 = x2;
    f1 = f2;
    x2 = x2.add(dx);
    f2 = f(x2);
    if (dx.abs() <= 1e-15 * Math.max(1, x2.abs())) return x2;
  }
  return x2;
}

// ---- 批次 23：调和函数、平均值、泊松积分、最大值 ----

/** ∇²u = u_xx + u_yy：五点差分 (u(x ± h, y) + u(x, y ± h) − 4u(x, y))/h²，误差只含 h 的偶次幂，按 h² 外推。 */
export function laplacian(u: (x: number, y: number) => number, x: number, y: number): number {
  const u0 = u(x, y);
  return extrapolate(
    (t) => {
      const h = Math.sqrt(t);
      return (u(x + h, y) + u(x - h, y) + u(x, y + h) + u(x, y - h) - 4 * u0) / t;
    },
    1 / 256,
    5,
  ).value;
}

function circleMeanRaw(u: (x: number, y: number) => number, x0: number, y0: number, r: number, N: number): number {
  let s = 0;
  for (let k = 0; k < N; k++) {
    const th = (2 * Math.PI * k) / N;
    s += u(x0 + r * Math.cos(th), y0 + r * Math.sin(th));
  }
  return s / N;
}

/** u 在圆周上的平均值 (1/2π)∫₀^{2π} u(x0 + r cos θ, y0 + r sin θ) dθ：N 点梯形公式（光滑周期函数按指数收敛），再用 N/2 点核对。 */
export function circleMean(u: (x: number, y: number) => number, x0: number, y0: number, r: number, N = 1024): number {
  const a = circleMeanRaw(u, x0, y0, r, N);
  const b = circleMeanRaw(u, x0, y0, r, N / 2);
  if (Math.abs(a - b) > 1e-10 * Math.max(1, Math.abs(a))) throw new Error(`圆周平均 ${N} 点和 ${N / 2} 点不一致：u 在圆周附近不光滑，或者 N 取小了`);
  return a;
}

/** u 在圆盘上的面积平均 (1/πr²)∬u dA = (2/r²)∫₀^r ρ·(半径 ρ 的圆周平均) dρ。 */
export function discMean(u: (x: number, y: number) => number, x0: number, y0: number, r: number, N = 512): number {
  return (2 / (r * r)) * integrate((rho) => rho * circleMeanRaw(u, x0, y0, rho, N), 0, r);
}

/**
 * 上半平面的狄利克雷问题：实轴上有界、分段连续的边界值 h(t) 的泊松积分
 * u(x, y) = (y/π)∫ h(t)/((t − x)² + y²) dt = (1/π)∫_{−π/2}^{π/2} h(x + y tan φ) dφ（y > 0）。
 * breaks 是 h 的间断点，换成 φ 的分点分段积，每段用双指数求积。
 */
export function poissonHalfPlane(h: (t: number) => number, x: number, y: number, breaks: number[] = []): number {
  if (!(y > 0)) throw new Error('poissonHalfPlane 要 y > 0');
  const phis = [-Math.PI / 2, ...breaks.map((b) => Math.atan((b - x) / y)), Math.PI / 2].sort((p, q) => p - q);
  let s = 0;
  for (let i = 0; i + 1 < phis.length; i++) {
    if (phis[i + 1] > phis[i]) s += integrate((phi) => h(x + y * Math.tan(phi)), phis[i], phis[i + 1]);
  }
  return s / Math.PI;
}

/**
 * 单位圆盘的狄利克雷问题：以 2π 为周期、分段连续的边界值 h(φ) 的泊松积分
 * u(re^{iθ}) = (1/2π)∫_{θ−π}^{θ+π} (1 − r²)/(1 − 2r cos(θ − φ) + r²)·h(φ) dφ（0 ≤ r < 1）。
 * breaks 是 h 的间断点（角度，差 2π 的整数倍都行），连同 θ 本身（r 接近 1 时核在那里很尖）一起作分点。
 */
export function poissonDisc(h: (phi: number) => number, r: number, theta: number, breaks: number[] = []): number {
  if (!(r >= 0 && r < 1)) throw new Error('poissonDisc 要 0 ≤ r < 1');
  const lo = theta - Math.PI;
  const hi = theta + Math.PI;
  const norm = (b: number) => lo + ((((b - lo) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
  const pts = [lo, theta, hi, ...breaks.map(norm)].sort((p, q) => p - q);
  const kernel = (phi: number) => (1 - r * r) / (1 - 2 * r * Math.cos(theta - phi) + r * r);
  let s = 0;
  for (let i = 0; i + 1 < pts.length; i++) {
    if (pts[i + 1] > pts[i]) s += integrate((phi) => kernel(phi) * h(phi), pts[i], pts[i + 1]);
  }
  return s / (2 * Math.PI);
}

/**
 * 狄利克雷问题候选解的核对：interior 各点上 |∇²u| 的最大值，boundary 各点（[x, y, 边界值]）上 |u − 边界值| 的最大值。
 * 两者都近于 0、u 在有界区域上连续到边界时，由最大值原理它就是解；区域无界时还要看无穷远处的条件，调用处自己写明。
 */
export function checkDirichlet(u: (x: number, y: number) => number, interior: [number, number][], boundary: [number, number, number][]): { laplace: number; boundary: number } {
  const lap = Math.max(0, ...interior.map(([x, y]) => Math.abs(laplacian(u, x, y))));
  const bd = Math.max(0, ...boundary.map(([x, y, v]) => Math.abs(u(x, y) - v)));
  return { laplace: lap, boundary: bd };
}

/** g 在区域里的最大值（粗找）：方框 [xmin, xmax] × [ymin, ymax] 上 (n + 1)² 个格点中满足 inside 的点上取值，给最大值和位置。边界上细找用 maxModulusOnPath。 */
export function maxOnGrid(g: (z: Complex) => number, inside: (z: Complex) => boolean, box: [number, number, number, number], n = 400): { value: number; at: Complex } {
  const [x0, x1, y0, y1] = box;
  let best = -Infinity;
  let at = ZERO;
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      const z = new Complex(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * j) / n);
      if (!inside(z)) continue;
      const v = g(z);
      if (v > best) {
        best = v;
        at = z;
      }
    }
  }
  return { value: best, at };
}

// ---- 批次 23：沿路径连续地取辐角、对数 ----

/** 沿曲线连续地取 z 的辐角：起点取 arg0（不给就取辐角主值），累计每一小段的辐角增量，给终点处的值。曲线不能经过 0。 */
export function argAlongPath(p: Path, arg0?: number, n = 20000): number {
  let total = arg0 ?? p.z(p.t0).arg();
  walk(() => ZERO, p, n, (z0, z1) => {
    total += z1.div(z0).arg();
  });
  return total;
}

/** 沿曲线把 log z 从起点的值（虚部取 arg0，不给就取主值）连续地延拓到终点：ln|z(t1)| + i·argAlongPath(p, arg0)。 */
export function logAlongPath(p: Path, arg0?: number, n = 20000): Complex {
  return new Complex(Math.log(p.z(p.t1).abs()), argAlongPath(p, arg0, n));
}

// ---- 批次 23：扩充复平面和分式线性变换 ----

/** 扩充复平面里的 ∞。 */
export const INF = 'inf' as const;
export type Ext = Complex | typeof INF;
/** 传参时有限点也可以直接写实数。 */
export type ExtIn = Ext | number;
export const isInf = (z: ExtIn): z is typeof INF => z === INF;
const toExt = (z: ExtIn): Ext => (typeof z === 'number' ? Complex.of(z) : z);

/** 分式线性变换 z ↦ (az + b)/(cz + d)，ad − bc ≠ 0；在扩充复平面上作用：−d/c ↦ ∞，∞ ↦ a/c（c = 0 时 ∞ ↦ ∞）。 */
export class Mobius {
  readonly a: Complex;
  readonly b: Complex;
  readonly c: Complex;
  readonly d: Complex;

  constructor(a: Complex | number, b: Complex | number, c: Complex | number, d: Complex | number) {
    this.a = Complex.of(a);
    this.b = Complex.of(b);
    this.c = Complex.of(c);
    this.d = Complex.of(d);
    const scale = Math.max(this.a.abs(), this.b.abs(), this.c.abs(), this.d.abs());
    if (!(scale > 0) || this.det().abs() <= 1e-12 * scale * scale) throw new Error('ad − bc = 0，不是分式线性变换');
  }

  det(): Complex {
    return this.a.mul(this.d).sub(this.b.mul(this.c));
  }

  apply(zIn: ExtIn): Ext {
    const z = toExt(zIn);
    if (isInf(z)) return this.c.abs() === 0 ? INF : this.a.div(this.c);
    const num = this.a.mul(z).add(this.b);
    const den = this.c.mul(z).add(this.d);
    if (den.abs() <= 1e-13 * (this.c.abs() * z.abs() + this.d.abs())) return INF;
    return num.div(den);
  }

  /** 复合 this ∘ m：先作用 m、再作用 this，系数矩阵相乘。 */
  compose(m: Mobius): Mobius {
    return new Mobius(
      this.a.mul(m.a).add(this.b.mul(m.c)),
      this.a.mul(m.b).add(this.b.mul(m.d)),
      this.c.mul(m.a).add(this.d.mul(m.c)),
      this.c.mul(m.b).add(this.d.mul(m.d)),
    );
  }

  /** 逆变换 z ↦ (dz − b)/(−cz + a)。 */
  inverse(): Mobius {
    return new Mobius(this.d, this.b.neg(), this.c.neg(), this.a);
  }

  /** 系数除以 √(ad − bc)（差一个 ± 号的系数是同一个变换）。 */
  normalized(): [Complex, Complex, Complex, Complex] {
    const s = csqrt(this.det());
    return [this.a.div(s), this.b.div(s), this.c.div(s), this.d.div(s)];
  }

  /** 和 m 是不是同一个变换：归一化以后的系数相同或差一个 ± 号。 */
  sameAs(m: Mobius, tol = 1e-9): boolean {
    const p = this.normalized();
    const q = m.normalized();
    return p.every((x, i) => x.isClose(q[i], tol)) || p.every((x, i) => x.isClose(q[i].neg(), tol));
  }
}

/** 扩充复平面上两点是否相同：都是 ∞，或者都有限且相差不超过 tol·max(1, |w|)。 */
export function sameExt(zIn: ExtIn, wIn: ExtIn, tol = 1e-9): boolean {
  const z = toExt(zIn);
  const w = toExt(wIn);
  return isInf(z) || isInf(w) ? z === w : z.isClose(w, tol);
}

/**
 * 把 z1, z2, z3 依次映到 w1, w2, w3 的分式线性变换（三点各自不同，可以有 ∞）。
 * 系数 (a, b, c, d) 满足三个齐次线性方程 a·z + b − w·(c·z + d) = 0（z 是 ∞ 时为 a − w·c = 0，w 是 ∞ 时为 c·z + d = 0，
 * 都是 ∞ 时为 c = 0）；解是这个 3×4 矩阵的零空间，第 j 个分量取 (−1)^j 乘去掉第 j 列的 3 阶行列式。不用交比的公式。
 * 求出以后把三点代回去核对。
 */
export function mobiusFromPoints(zsIn: [ExtIn, ExtIn, ExtIn], wsIn: [ExtIn, ExtIn, ExtIn]): Mobius {
  const zs = zsIn.map(toExt);
  const ws = wsIn.map(toExt);
  const rows: Complex[][] = zs.map((z, k) => {
    const w = ws[k];
    if (!isInf(z) && !isInf(w)) return [z, ONE, w.mul(z).neg(), w.neg()];
    if (isInf(z) && !isInf(w)) return [ONE, ZERO, w.neg(), ZERO];
    if (!isInf(z) && isInf(w)) return [ZERO, ZERO, z, ONE];
    return [ZERO, ZERO, ONE, ZERO];
  });
  const det3 = (m: Complex[][]) =>
    m[0][0]
      .mul(m[1][1].mul(m[2][2]).sub(m[1][2].mul(m[2][1])))
      .sub(m[0][1].mul(m[1][0].mul(m[2][2]).sub(m[1][2].mul(m[2][0]))))
      .add(m[0][2].mul(m[1][0].mul(m[2][1]).sub(m[1][1].mul(m[2][0]))));
  const v = [0, 1, 2, 3].map((j) => {
    const minor = det3(rows.map((row) => row.filter((_, i) => i !== j)));
    return j % 2 === 0 ? minor : minor.neg();
  });
  const m = new Mobius(v[0], v[1], v[2], v[3]);
  zs.forEach((z, k) => {
    if (!sameExt(m.apply(z), ws[k], 1e-8)) throw new Error('mobiusFromPoints：代回去对不上（三点有重合的？）');
  });
  return m;
}

/** 不动点：c ≠ 0 时是 cz² + (d − a)z − b = 0 的两个根（可能重合）；c = 0 时 ∞ 是不动点，a ≠ d 时另一个是 b/(d − a)。恒等变换给 null。 */
export function fixedPoints(m: Mobius): Ext[] | null {
  const { a, b, c, d } = m;
  const scale = Math.max(a.abs(), b.abs(), c.abs(), d.abs());
  if (c.abs() <= 1e-14 * scale) {
    if (d.sub(a).abs() <= 1e-14 * scale) return b.abs() <= 1e-14 * scale ? null : [INF];
    return [INF, b.div(d.sub(a))];
  }
  return polyRoots([c, d.sub(a), b.neg()]);
}

/**
 * 过三点 p1、p2、p3 的圆或直线（直线可以写成过 ∞）在 m 下的像：三点的像不共线时是圆（圆心、半径），
 * 共线或有一个是 ∞ 时是直线（一点和单位方向）。
 */
export function imageOfCircleLine(m: Mobius, p1: ExtIn, p2: ExtIn, p3: ExtIn): { kind: 'circle'; center: Complex; radius: number } | { kind: 'line'; point: Complex; direction: Complex } {
  const finite = [m.apply(p1), m.apply(p2), m.apply(p3)].filter((z): z is Complex => !isInf(z));
  const line = (u: Complex, v: Complex) => {
    const dir = v.sub(u);
    return { kind: 'line' as const, point: u, direction: dir.scale(1 / dir.abs()) };
  };
  if (finite.length < 3) return line(finite[0], finite[1]);
  const circ = circleThrough(finite[0], finite[1], finite[2]);
  return circ ? { kind: 'circle', center: circ.center, radius: circ.radius } : line(finite[0], finite[1]);
}
