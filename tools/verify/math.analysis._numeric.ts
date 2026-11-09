// math.analysis 验算脚本共用的数值小工具（批次 2 起用）。
// 文件名第三段以下划线开头，npm run verify 不把它当成小节脚本（见 docs/plan.md「每批的流程」第 3 条）。
// 这里只放和具体题目无关的算法：Richardson 外推、数列收不收敛、一点处最大的 δ、连续模。

import { infOfPredicate, supOfPredicate } from './lib.ts';

/** Richardson 外推：a(n) = L + c₁/n + c₂/n² + … 时，用 a(n₀)、a(2n₀)、a(4n₀)… 逐级消去 1/n 的各次项。 */
export function richardson(a: (n: number) => number, n0 = 1000, levels = 5): number {
  let row = Array.from({ length: levels }, (_, i) => a(n0 * 2 ** i));
  for (let k = 1; k < levels; k++) {
    const f = 2 ** k;
    row = row.slice(1).map((v, i) => (f * v - row[i]) / (f - 1));
  }
  return row[0];
}

/** 把数列的第 1 到第 count 项算成数组（下标 0 不用）。term 拿到 n 和前一项，递推、累加的数列也能写。 */
export function terms(count: number, term: (n: number, previous: number) => number): Float64Array {
  const values = new Float64Array(count + 1);
  for (let n = 1; n <= count; n++) values[n] = term(n, n > 1 ? values[n - 1] : Number.NaN);
  return values;
}

/** 数列在 n ∈ [m, 2m] 上的振幅（最大项减最小项）。 */
export function amplitude(values: Float64Array, m: number): number {
  let lo = Infinity;
  let hi = -Infinity;
  for (let n = m; n <= 2 * m; n++) {
    if (values[n] < lo) lo = values[n];
    if (values[n] > hi) hi = values[n];
  }
  return hi - lo;
}

/** 收敛的判据（和批次 1 一样）：m 从 10³ 到 10⁶，[m, 2m] 上的振幅一路不增，最后小于 10⁻²。values 至少要有 2×10⁶ 项。 */
export function converges(values: Float64Array): boolean {
  const amps = [1e3, 1e4, 1e5, 1e6].map((m) => amplitude(values, m));
  return amps.every((v, i) => i === 0 || v <= amps[i - 1] * 1.0001 + 1e-15) && amps[amps.length - 1] < 1e-2;
}

/**
 * 「|x − a| < δ（必要时还要 x ≠ a）时没有坏点」的最大的 δ：a 到坏点集合的距离。
 * bad(x) 为真表示 x 是坏点（|f(x) − L| ≥ ε 之类）；坏点集合在 a 两边各是若干个闭区间时，这个距离就是能取的最大的 δ（取得到）。
 * 只在 [a − left, a + right] 里找；一边找不到坏点时那一边算 Infinity。
 */
export function maxDelta(a: number, bad: (x: number) => boolean, left: number, right: number): number {
  const l = left > 0 ? supOfPredicate((x) => x < a && bad(x), a - left, a) : null;
  const r = right > 0 ? infOfPredicate((x) => x > a && bad(x), a, a + right) : null;
  return Math.min(l === null ? Infinity : a - l, r === null ? Infinity : r - a);
}

/** 连续模 ω(t) = max |f(x + t) − f(x)|，x 取遍 xs 里满足 x + t ≤ hi 的点。 */
export function modulus(f: (x: number) => number, xs: number[], t: number, hi: number): number {
  let best = 0;
  for (const x of xs) {
    if (x + t > hi) continue;
    const d = Math.abs(f(x + t) - f(x));
    if (d > best) best = d;
  }
  return best;
}

/** [lo, hi] 的 K 等分点（含两端）。 */
export function grid(lo: number, hi: number, K: number): number[] {
  return Array.from({ length: K + 1 }, (_, k) => lo + ((hi - lo) * k) / K);
}

/** 从 lo 到 hi 按对数均匀取 K + 1 个点（lo > 0），用来看靠近 0 或很远处的情形。 */
export function logGrid(lo: number, hi: number, K: number): number[] {
  const a = Math.log(lo);
  const b = Math.log(hi);
  return Array.from({ length: K + 1 }, (_, k) => Math.exp(a + ((b - a) * k) / K));
}

/** 单调不减的 g 第一次达到 level 的位置 inf{t ∈ [lo, hi] : g(t) ≥ level}，二分 200 次。要求 g(lo) < level ≤ g(hi)。 */
export function firstReach(g: (t: number) => number, level: number, lo: number, hi: number): number {
  if (!(g(lo) < level && g(hi) >= level)) throw new Error('firstReach：两端不满足 g(lo) < level ≤ g(hi)');
  let a = lo;
  let b = hi;
  for (let k = 0; k < 200; k++) {
    const m = (a + b) / 2;
    if (g(m) >= level) b = m;
    else a = m;
  }
  return (a + b) / 2;
}

/**
 * 达布上和、下和 [U, L]（批次 3 起用）：分点 points 从小到大；每一段上的上确界、下确界在 samples + 1 个等分点（含两端）
 * 和落在这一段里的 special 点上取。values(x) 返回 x 处可能的函数值：分有理点、无理点定义的函数，两种值都放进去
 * （有理点、无理点在每一段里都有）；只在个别点和别处不同的函数，把那些点放进 special。
 */
export function darboux(values: (x: number) => number[], points: number[], special: number[] = [], samples = 2000): [number, number] {
  let U = 0;
  let L = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    let M = -Infinity;
    let m = Infinity;
    const xs = [...grid(a, b, samples), ...special.filter((s) => s >= a && s <= b)];
    for (const x of xs) {
      for (const v of values(x)) {
        if (v > M) M = v;
        if (v < m) m = v;
      }
    }
    U += M * (b - a);
    L += m * (b - a);
  }
  return [U, L];
}

/** 可重复的伪随机数（mulberry32），给「随机符号」一类的检验数列用。 */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
