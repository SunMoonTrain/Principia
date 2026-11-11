// 电磁学静电场各节（批次 9）验算脚本共用的工具。
// 文件名第三段以下划线开头，npm run verify 不把它当成小节的验算脚本。
//
// 两套互相独立的算法，验算脚本里两者互相核对：
// 一是讲解里的公式（库仑定律、对称时的高斯定律、偶极子的近似式等）；
// 二是「直接算」：把带电体分成许多点电荷，按库仑定律把电场、电势一块块加起来；电通量对曲面数值积分；
//   运动用四阶龙格-库塔法积分；需要极限的（理想偶极子、无限长、无穷大）就取足够小或足够大的参数逼近。

export type V3 = [number, number, number];

// ---------- 常量（CODATA 2022） ----------

export const E_CHARGE = 1.602176634e-19;
export const EPS0 = 8.8541878188e-12;
/** 1/(4πε₀) 的精确值（由 ε₀ 算出）。 */
export const K_EXACT = 1 / (4 * Math.PI * EPS0);
/** 题目里常取的 1/(4πε₀) 近似值。 */
export const K8988 = 8.988e9;
export const M_E = 9.1093837139e-31;
export const M_P = 1.67262192595e-27;
export const G_NEWTON = 6.6743e-11;
export const A0 = 5.29177210544e-11;
/** 精细结构常数、ħc（MeV·fm）、哈特里能量（J）：用来走「原子单位」这条独立的路。 */
export const ALPHA = 7.2973525643e-3;
export const HBARC_MEV_FM = 197.3269804;
export const HARTREE_J = 4.3597447222060e-18;

// ---------- 矢量 ----------

export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (k: number, a: V3): V3 => [k * a[0], k * a[1], k * a[2]];
export const dot = (a: V3, b: V3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a: V3): number => Math.hypot(a[0], a[1], a[2]);

// ---------- 点电荷 ----------

export interface Charge {
  q: number;
  r: V3;
}

/** 一组点电荷在 r 处的电场（k 是 1/(4πε₀)）。 */
export function fieldAt(charges: Charge[], r: V3, k = K_EXACT): V3 {
  let E: V3 = [0, 0, 0];
  for (const c of charges) {
    const d = sub(r, c.r);
    const len = norm(d);
    E = add(E, scale((k * c.q) / (len * len * len), d));
  }
  return E;
}

/** 一组点电荷在 r 处的电势（无穷远为零）。 */
export function potentialAt(charges: Charge[], r: V3, k = K_EXACT): number {
  return charges.reduce((s, c) => s + (k * c.q) / norm(sub(r, c.r)), 0);
}

/** q1 对 q2 的库仑力（矢量形式，不用「大小 + 方向」的写法）。 */
export const coulombForce = (c1: Charge, c2: Charge, k = K_EXACT): V3 => scale(c2.q, fieldAt([c1], c2.r, k));

// ---------- 数值积分 ----------

const glCache = new Map<number, { x: number[]; w: number[] }>();
/** n 点高斯-勒让德求积的节点和权重（[-1, 1] 上，牛顿法求勒让德多项式的零点）。 */
export function gaussLegendre(n: number): { x: number[]; w: number[] } {
  const cached = glCache.get(n);
  if (cached) return cached;
  const x: number[] = [];
  const w: number[] = [];
  for (let i = 1; i <= n; i++) {
    let z = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5));
    let dp = 0;
    for (let it = 0; it < 100; it++) {
      let p0 = 1;
      let p1 = z;
      for (let k = 2; k <= n; k++) {
        const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k;
        p0 = p1;
        p1 = p2;
      }
      dp = (n * (z * p1 - p0)) / (z * z - 1);
      const dz = p1 / dp;
      z -= dz;
      if (Math.abs(dz) < 1e-16) break;
    }
    x.push(z);
    w.push(2 / ((1 - z * z) * dp * dp));
  }
  const out = { x, w };
  glCache.set(n, out);
  return out;
}

/** 复合高斯-勒让德：[a, b] 分成 panels 段，每段 n 点。 */
export function integrate(f: (x: number) => number, a: number, b: number, panels = 64, n = 16): number {
  const { x, w } = gaussLegendre(n);
  const h = (b - a) / panels;
  let s = 0;
  for (let p = 0; p < panels; p++) {
    const lo = a + p * h;
    for (let i = 0; i < n; i++) s += w[i] * f(lo + (h / 2) * (x[i] + 1));
  }
  return (s * h) / 2;
}

/** 二重积分：[a1, b1] × [a2, b2]，两个方向都用复合高斯-勒让德。 */
export function integrate2(f: (x: number, y: number) => number, a1: number, b1: number, a2: number, b2: number, panels = 16, n = 16): number {
  return integrate((x) => integrate((y) => f(x, y), a2, b2, panels, n), a1, b1, panels, n);
}

// ---------- 其他 ----------

/** f 在 [lo, hi] 上的零点：二分到机器精度，两端要异号。 */
export function bisect(f: (x: number) => number, lo: number, hi: number): number {
  let a = lo;
  let b = hi;
  let fa = f(a);
  if (fa === 0) return a;
  if (f(b) === 0) return b;
  if (fa * f(b) > 0) throw new Error(`bisect：[${lo}, ${hi}] 两端没有变号`);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (m === a || m === b) break;
    const fm = f(m);
    if (fm === 0) return m;
    if (fa * fm < 0) b = m;
    else {
      a = m;
      fa = fm;
    }
  }
  return (a + b) / 2;
}

/** 单峰函数在 [lo, hi] 上的最大值点：黄金分割搜索。 */
export function argmax(f: (x: number) => number, lo: number, hi: number): number {
  const g = (Math.sqrt(5) - 1) / 2;
  let a = lo;
  let b = hi;
  let c = b - g * (b - a);
  let d = a + g * (b - a);
  let fc = f(c);
  let fd = f(d);
  for (let i = 0; i < 300 && b - a > 1e-15 * Math.max(1, Math.abs(a)); i++) {
    if (fc > fd) {
      b = d;
      d = c;
      fd = fc;
      c = b - g * (b - a);
      fc = f(c);
    } else {
      a = c;
      c = d;
      fc = fd;
      d = a + g * (b - a);
      fd = f(d);
    }
  }
  return (a + b) / 2;
}

/** 两种算法的结果互相核对：相对误差超过 tol 就报错，返回第二个（公式的值）。 */
export function agree(numeric: number, exact: number, what: string, tol = 1e-9): number {
  if (Math.abs(numeric - exact) > tol * Math.max(Math.abs(numeric), Math.abs(exact)) + 1e-300) {
    throw new Error(`${what}：两种算法不一致：${numeric} 和 ${exact}`);
  }
  return exact;
}

/** 断言一个判断成立（选择题的检验例子用）。 */
export function check(ok: boolean, what: string): void {
  if (!ok) throw new Error(`检验没通过：${what}`);
}

/** 选择题：按选项序号列出判为「对」的那些（从 1 开始）。 */
export const chosen = (flags: boolean[]): number[] => flags.flatMap((ok, i) => (ok ? [i + 1] : []));

/** 均匀带电细圆环（圆心在原点、在 xy 平面里）分成 n 个点电荷。 */
export function ringCharges(Q: number, R: number, n: number, from = 0, to = 2 * Math.PI): Charge[] {
  const out: Charge[] = [];
  const dphi = (to - from) / n;
  for (let i = 0; i < n; i++) {
    const phi = from + (i + 0.5) * dphi;
    out.push({ q: Q / n, r: [R * Math.cos(phi), R * Math.sin(phi), 0] });
  }
  return out;
}
