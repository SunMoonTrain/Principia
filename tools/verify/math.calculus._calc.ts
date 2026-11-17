// 单变量微积分验算脚本共用的数值工具（文件名第三段以下划线开头，npm run verify 不把它当小节脚本）。
// 极限分两步看：先在越来越小的去心邻域里取一串不落在特殊点上的格点，看函数值的振幅和最小绝对值
// （判断极限存不存在、是不是无穷）；极限存在时，再在 h = h0/2^k 处取值做理查森外推，得到精确的极限值。

/** 理查森外推 g(h) 在 h → 0⁺ 时的值：假定 g(h) = L + c₁h + c₂h² + …，在 h0/2^k（k = 0..levels−1）处取值，逐级消去 h 的各次项。 */
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

/** 有限的单侧极限带一个误差估计 err：外推收敛时是 1e-9 量级，否则是最小邻域里的振幅。 */
export type OneSided = { kind: 'finite'; value: number; err: number } | { kind: 'infinite'; sign: number } | { kind: 'none' };

/**
 * f(x) 在 x → a⁺（side = 1）或 x → a⁻（side = −1）时的单侧极限。
 * 在 δ/10 ≤ side·(x − a) ≤ δ（δ = 10⁻²、10⁻³、10⁻⁴）里各取 2000 个格点（偏移 0.37 格，避开 1/2^k 这类特殊点；
 * 不取到 10⁻⁵ 以内，免得 1 − cos x 这类式子在浮点数里抵消成 0）。
 * 振幅一路缩小、两个数量级里缩到 1/20 以下算有限极限；最小绝对值一路增大到 10³ 以上且同号算无穷；都不是算不存在。
 * 有限时用理查森外推求精确值；外推不收敛（函数在 a 处不能按幂展开）就取最小邻域里函数值的中点。
 */
export function oneSided(f: (x: number) => number, a: number, side: 1 | -1): OneSided {
  const amps: number[] = [];
  const mids: number[] = [];
  const mins: number[] = [];
  const signs: number[] = [];
  for (const delta of [1e-2, 1e-3, 1e-4]) {
    let lo = Infinity;
    let hi = -Infinity;
    let minAbs = Infinity;
    for (let i = 0; i < 2000; i++) {
      const v = f(a + side * delta * (0.1 + (0.9 * (i + 0.37)) / 2000));
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
      minAbs = Math.min(minAbs, Math.abs(v));
    }
    amps.push(hi - lo);
    mids.push((hi + lo) / 2);
    mins.push(minAbs);
    signs.push(lo > 0 ? 1 : hi < 0 ? -1 : 0);
  }
  if (mins[0] < mins[1] && mins[1] < mins[2] && mins[2] > 1e3 && signs[2] !== 0) return { kind: 'infinite', sign: signs[2] };
  const shrinking = amps[1] <= amps[0] * 1.01 + 1e-12 && amps[2] <= amps[1] * 1.01 + 1e-12;
  if (shrinking && (amps[2] <= amps[0] / 20 || amps[2] <= 1e-9 * Math.max(1, Math.abs(mids[2])))) {
    const r = extrapolate((h) => f(a + side * h));
    const ok = r.converged && Math.abs(r.value - mids[2]) <= amps[2] + 1e-9;
    return ok ? { kind: 'finite', value: r.value, err: 1e-9 * Math.max(1, Math.abs(r.value)) } : { kind: 'finite', value: mids[2], err: amps[2] / 2 + 1e-12 };
  }
  return { kind: 'none' };
}

/** 单侧极限有限并且（在误差估计内）等于 L。 */
export function sideIs(s: OneSided, L: number): boolean {
  return s.kind === 'finite' && Math.abs(s.value - L) <= s.err + 1e-9;
}

/** 两侧极限都有限且相等时返回极限值，否则返回 null。 */
export function limitAt(f: (x: number) => number, a: number): number | null {
  const l = oneSided(f, a, -1);
  const r = oneSided(f, a, 1);
  if (l.kind !== 'finite' || r.kind !== 'finite') return null;
  const tol = Math.max(l.err + r.err, 1e-6 * Math.max(1, Math.abs(r.value)));
  return Math.abs(l.value - r.value) <= tol ? (l.value + r.value) / 2 : null;
}

/** x → +∞（sign = 1）或 x → −∞（sign = −1）时的极限：换成 t = sign/x，看 t → 0⁺。 */
export function atInfinity(f: (x: number) => number, sign: 1 | -1): OneSided {
  return oneSided((t) => f(sign / t), 0, 1);
}

/** 数列 a(n) 的极限：在 n ∈ [N, 2N]（N = 10³、10⁴、10⁵）的整数上看振幅缩小，再在 n = 32·2^k 这些整数上外推。 */
export function sequenceLimit(a: (n: number) => number): number | null {
  const amps: number[] = [];
  for (const N of [1e3, 1e4, 1e5]) {
    let lo = Infinity;
    let hi = -Infinity;
    for (let i = 0; i <= 2000; i++) {
      const v = a(N + Math.round((N * i) / 2000));
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    }
    amps.push(hi - lo);
  }
  if (!(amps[1] <= amps[0] && amps[2] <= amps[1] && amps[2] < 1e-3)) return null;
  const r = extrapolate((h) => a(Math.round(1 / h)));
  return r.converged ? r.value : null;
}

/** 按定义求导数：差商 (f(x0 + h) − f(x0))/h 在 h → 0 时两侧外推，两侧一致才返回。 */
export function derivativeAt(f: (x: number) => number, x0: number): number {
  const right = extrapolate((h) => (f(x0 + h) - f(x0)) / h);
  const left = extrapolate((h) => (f(x0 - h) - f(x0)) / -h);
  const ok = right.converged && left.converged && Math.abs(right.value - left.value) <= 1e-6 * Math.max(1, Math.abs(right.value));
  if (!ok) throw new Error(`x = ${x0} 处差商的两侧极限不一致或不收敛`);
  return (right.value + left.value) / 2;
}

/** 四舍五入到 digits 位小数（消去外推留下的 1e-12 量级误差，便于判断整数、比较）。 */
export function roundTo(x: number, digits: number): number {
  const s = 10 ** digits;
  return Math.round(x * s) / s;
}

/** 二分法求 f 在 [lo, hi] 里的零点，要求两端异号（批次 18 加的）。 */
export function bisect(f: (x: number) => number, lo: number, hi: number, iters = 200): number {
  let a = lo;
  let b = hi;
  let fa = f(a);
  if (fa === 0) return a;
  if (fa * f(b) > 0) throw new Error(`[${lo}, ${hi}] 两端同号，二分法用不上`);
  for (let k = 0; k < iters; k++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (fm === 0) return m;
    if (fa * fm < 0) b = m;
    else [a, fa] = [m, fm];
  }
  return (a + b) / 2;
}

/**
 * 数值积分 ∫_a^b f(x) dx（批次 18 加的）：双指数（tanh-sinh）求积，端点处导数无界（如 √x 在 0 处）也收敛得快。
 * x = (a+b)/2 + (b−a)/2·tanh(π/2·sinh t)，步长每次减半直到相邻两次相差不到 1e-13。端点附近用到端点的距离直接算 x，免得舍入。
 */
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

/**
 * 按不严格不等式的极值定义判断 x0 是极大值点还是极小值点（批次 19 加的，和 local-extrema 脚本里的办法相同）：
 * δ 取 10⁻¹ … 10⁻⁶，在 0 < |x − x0| < δ 里两侧各取 1 万个点；有一个 δ 使这些点上都 f(x) ≤ f(x0)（或都 ≥）就算。
 */
export function extremumKind(f: (x: number) => number, x0: number): 'max' | 'min' | null {
  const v = f(x0);
  for (let k = 1; k <= 6; k++) {
    const delta = 10 ** -k;
    let allLe = true;
    let allGe = true;
    for (let i = 0; i < 10000; i++) {
      const d = (delta * (i + 0.37)) / 10000;
      for (const x of [x0 - d, x0 + d]) {
        const w = f(x);
        if (w > v) allLe = false;
        if (w < v) allGe = false;
      }
    }
    if (allLe) return 'max';
    if (allGe) return 'min';
  }
  return null;
}

/**
 * 找 f 在 [a, b] 上不凸的反例（批次 19 加的）：在 n + 1 个等距点里任取两点 x1 < x2，检查中点处
 * f((x1 + x2)/2) ≤ (f(x1) + f(x2))/2（连续函数中点凸和凸是一回事），容差取函数值的 1e-12 倍。
 * 返回第一对不满足的 (x1, x2)，都满足就返回 null。
 */
export function convexityCounterexample(f: (x: number) => number, a: number, b: number, n = 400): [number, number] | null {
  const xs = Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);
  const ys = xs.map(f);
  for (let i = 0; i <= n; i++) {
    for (let j = i + 2; j <= n; j += 2) {
      const mid = ys[(i + j) / 2];
      const chord = (ys[i] + ys[j]) / 2;
      if (mid > chord + 1e-12 * Math.max(1, Math.abs(chord))) return [xs[i], xs[j]];
    }
  }
  return null;
}

/**
 * f 在 [a, b] 上的最大值（批次 19 加的）：先在 n 等分的格点上找函数值最大的格点，
 * 再在它左右各一格的范围里用黄金分割细化（最大值点在端点时会停在端点）。
 */
export function maxOn(f: (x: number) => number, a: number, b: number, n = 20000): { x: number; value: number } {
  const h = (b - a) / n;
  let best = a;
  let bestV = f(a);
  for (let i = 1; i <= n; i++) {
    const x = a + i * h;
    const v = f(x);
    if (v > bestV) {
      best = x;
      bestV = v;
    }
  }
  let lo = Math.max(a, best - h);
  let hi = Math.min(b, best + h);
  const r = (Math.sqrt(5) - 1) / 2;
  let x1 = hi - r * (hi - lo);
  let x2 = lo + r * (hi - lo);
  let f1 = f(x1);
  let f2 = f(x2);
  for (let k = 0; k < 200; k++) {
    if (f1 < f2) {
      lo = x1;
      x1 = x2;
      f1 = f2;
      x2 = lo + r * (hi - lo);
      f2 = f(x2);
    } else {
      hi = x2;
      x2 = x1;
      f2 = f1;
      x1 = hi - r * (hi - lo);
      f1 = f(x1);
    }
  }
  const candidates: [number, number][] = [[best, bestV], [x1, f1], [x2, f2], [a, f(a)], [b, f(b)]];
  candidates.sort((p, q) => q[1] - p[1]);
  return { x: candidates[0][0], value: candidates[0][1] };
}

/**
 * 和 integrate 一样的 tanh-sinh 积分（批次 20 加的），只是被积函数多收两个参数：到左、右端点的距离 dl、dr。
 * 离端点极近的取样点上，x 本身已经舍入到端点，而 dl、dr 是直接算出来的、不丢精度，所以端点处的奇点
 * （如 ∫₀¹dx/√(1 − x²) 写成 1/√(dr·(2 − dr))）可以用距离来写，算到 10⁻¹⁵ 的精度。
 */
export function integrateEndpoints(g: (x: number, dl: number, dr: number) => number, a: number, b: number): number {
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
      const v = t >= 0 ? g(b - delta, b - a - delta, delta) : g(a + delta, delta, b - a - delta);
      if (Number.isFinite(v)) sum += w * v;
    }
    const est = half * h * sum;
    if (Math.abs(est - prev) <= 1e-13 * Math.max(1, Math.abs(est))) return est;
    prev = est;
  }
  return prev;
}

/**
 * 反常积分 ∫_a^{+∞} f(x) dx（批次 20 加的）：换元 x = a + t/(1 − t)，dx = dt/(1 − t)²，把 [a, +∞) 变成 [0, 1)，
 * 用 integrateEndpoints 积分（1 − t 直接取到右端点的距离，x 可以大到 10³⁷）。只管算值：被积函数要在远处单调地
 * 趋于 0，并且至少像 x^{−1−ε} 那样衰减；像 1/(x ln²x) 这样只按对数衰减的，10³⁷ 以外的尾巴还有百分之一，
 * 要另外处理。收敛不收敛先用 partialIntegrals 看。
 */
export function integrateToInfinity(f: (x: number) => number, a: number): number {
  return integrateEndpoints((_x, t, s) => f(a + t / s) / (s * s), 0, 1);
}

/** ∫_{−∞}^b f(x) dx（批次 20 加的）：令 x = −y，化成 ∫_{−b}^{+∞} f(−y) dy。 */
export function integrateFromMinusInfinity(f: (x: number) => number, b: number): number {
  return integrateToInfinity((y) => f(-y), -b);
}

/** ∫_{−∞}^{+∞} f(x) dx（批次 20 加的）：在 c 处拆成两个反常积分相加，两个都收敛才有意义。 */
export function integrateWholeLine(f: (x: number) => number, c = 0): number {
  return integrateFromMinusInfinity(f, c) + integrateToInfinity(f, c);
}

/** 把 [lo, hi]（0 < lo < hi）按几何级数分成 pieces 段，逐段 tanh-sinh 积分再相加，长区间上也稳。 */
function integrateGeometric(f: (x: number) => number, lo: number, hi: number, pieces = 20): number {
  let s = 0;
  const r = (hi / lo) ** (1 / pieces);
  let a = lo;
  for (let i = 1; i <= pieces; i++) {
    const b = i === pieces ? hi : a * r;
    s += integrate(f, a, b);
    a = b;
  }
  return s;
}

/**
 * 部分积分 ∫_a^b f(x) dx 在 b = 10, 10², …, 10⁶ 处的值（批次 20 加的），用来看 x → +∞ 的反常积分收敛还是发散：
 * 收敛时这串数越来越稳定，发散时一直变大（如 ∫dx/x 每次约加 ln10）。要求 a < 10。
 */
export function partialIntegrals(f: (x: number) => number, a: number, bs = [1e1, 1e2, 1e3, 1e4, 1e5, 1e6]): number[] {
  const out: number[] = [];
  let acc = integrate(f, a, bs[0]);
  out.push(acc);
  for (let k = 1; k < bs.length; k++) {
    acc += integrateGeometric(f, bs[k - 1], bs[k]);
    out.push(acc);
  }
  return out;
}

/**
 * 被积函数在左端点 a 附近无界时，部分积分 ∫_{a+δ}^b f(x) dx 在 δ = 10⁻², 10⁻⁴, …, 10⁻¹² 处的值（批次 20 加的）：
 * 收敛时越来越稳定，发散时一直变大。右端点无界时，把 f(x) 换成 f(a + b − x) 再用。要求 a + 10⁻² < b。
 */
export function partialIntegralsNearLeft(f: (x: number) => number, a: number, b: number, deltas = [1e-2, 1e-4, 1e-6, 1e-8, 1e-10, 1e-12]): number[] {
  const g = (u: number) => f(a + u);
  const out: number[] = [];
  let acc = integrate(g, deltas[0], b - a);
  out.push(acc);
  for (let k = 1; k < deltas.length; k++) {
    acc += integrateGeometric(g, deltas[k], deltas[k - 1]);
    out.push(acc);
  }
  return out;
}

/** 按 t 把 [t0, t1] 等分成 n 段，依次取曲线上的点，交给 visit 处理相邻两点。 */
function walkCurve(x: (t: number) => number, y: (t: number) => number, t0: number, t1: number, n: number, visit: (px: number, py: number, qx: number, qy: number) => number): number {
  let s = 0;
  let px = x(t0);
  let py = y(t0);
  for (let i = 1; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n;
    const qx = x(t);
    const qy = y(t);
    s += visit(px, py, qx, qy);
    px = qx;
    py = qy;
  }
  return s;
}

/**
 * 参数曲线 (x(t), y(t))，t ∈ [t0, t1] 的长度（批次 20 加的）：按 t 等分成 n 段的内接折线长，n = 32·2^k，
 * 再按 h = 1/n 理查森外推。不用导数，就是「折线逼近」的定义。端点处切线竖直的曲线（如 y = √x 在 0 处）
 * 误差不按 h 的幂展开、外推不收敛，换一个参数（如 x = t²）再算。图像 y = f(x) 用 x(t) = t、y(t) = f(t)。
 */
export function curveLength(x: (t: number) => number, y: (t: number) => number, t0: number, t1: number): { value: number; converged: boolean } {
  return extrapolate((h) => walkCurve(x, y, t0, t1, Math.round(1 / h), (px, py, qx, qy) => Math.hypot(qx - px, qy - py)));
}

/**
 * 曲线 (x(t), y(t))（y ≥ 0）绕 x 轴旋转所得曲面的面积（批次 20 加的）：每一段折线转成一个圆台，侧面积是
 * π(y₁ + y₂)·段长，求和后按 h = 1/n 外推。绕 y 轴转时，把 x、y 两个函数对调着传进来。
 */
export function revolvedSurfaceArea(x: (t: number) => number, y: (t: number) => number, t0: number, t1: number): { value: number; converged: boolean } {
  return extrapolate((h) => walkCurve(x, y, t0, t1, Math.round(1 / h), (px, py, qx, qy) => Math.PI * (py + qy) * Math.hypot(qx - px, qy - py)));
}

/**
 * 从原点出发的向径沿曲线 (x(t), y(t))，t ∈ [t0, t1] 扫过的有向面积（批次 20 加的）：内接折线和原点连成的
 * 一串三角形，面积 ½(x₁y₂ − x₂y₁) 相加，再外推；逆时针为正。极坐标曲线 r = r(θ) 取 x = r cos θ、y = r sin θ，
 * 得到的就是 ½∫r² dθ；绕原点一圈的闭曲线，得到的是它围成的面积。
 */
export function sweptArea(x: (t: number) => number, y: (t: number) => number, t0: number, t1: number): { value: number; converged: boolean } {
  return extrapolate((h) => walkCurve(x, y, t0, t1, Math.round(1 / h), (px, py, qx, qy) => (px * qy - qx * py) / 2));
}

/**
 * 由一串部分积分（partialIntegrals 或 partialIntegralsNearLeft 的结果）判断反常积分收敛还是发散（批次 20 加的）。
 * 相邻两项的增量 d₁, …, d₅ 里，取 r = (|d₅|/|d₁|)^{1/4}，即每一步增量平均缩成原来的几分之一：
 * r < 0.6 判为收敛，否则判为发散。按 x^{−p} 型估：partialIntegrals 每步跨一个数量级，p > 1 时 r = 10^{1−p}
 * （p = 3/2 时约 0.32）；partialIntegralsNearLeft 每步 δ 缩小 100 倍，p < 1 时 r = 100^{p−1}（p = 2/3 时约 0.22）；
 * 1/x 型增量不变，r = 1。p 离 1 太近（如 p = 0.9 的瑕积分，r ≈ 0.63）时这个判法不可靠，用之前先看 p。
 */
export function convergesByIncrements(partials: number[]): { converges: boolean; ratio: number } {
  const d = partials.slice(1).map((v, i) => Math.abs(v - partials[i]));
  const ratio = (d[d.length - 1] / d[0]) ** (1 / (d.length - 1));
  return { converges: ratio < 0.6, ratio };
}
