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
