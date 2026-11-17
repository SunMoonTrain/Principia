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
