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

// ---- 批次 10 加的：散度、拉普拉斯算子、小立方体的通量、勒让德多项式、三重积分 ----

export type Field = (p: V3) => V3;

/** 中心差分求散度。 */
export function divergence(E: Field, p: V3, h = 1e-5): number {
  let s = 0;
  for (let i = 0; i < 3; i++) {
    const a: V3 = [...p];
    const b: V3 = [...p];
    a[i] += h;
    b[i] -= h;
    s += (E(a)[i] - E(b)[i]) / (2 * h);
  }
  return s;
}

/** 中心差分求拉普拉斯算子。 */
export function laplacian(f: (p: V3) => number, p: V3, h = 1e-4): number {
  let s = 0;
  const f0 = f(p);
  for (let i = 0; i < 3; i++) {
    const a: V3 = [...p];
    const b: V3 = [...p];
    a[i] += h;
    b[i] -= h;
    s += (f(a) - 2 * f0 + f(b)) / (h * h);
  }
  return s;
}

/** 以 c 为中心、边长 h 的立方体穿出的通量：六个面上分别数值积分。 */
export function cubeFlux(E: Field, c: V3, h: number, panels = 4, n = 8): number {
  let s = 0;
  for (let i = 0; i < 3; i++) {
    const j = (i + 1) % 3;
    const k = (i + 2) % 3;
    for (const sign of [1, -1]) {
      s +=
        sign *
        integrate2(
          (u, v) => {
            const p: V3 = [0, 0, 0];
            p[i] = c[i] + (sign * h) / 2;
            p[j] = c[j] + u;
            p[k] = c[k] + v;
            return E(p)[i];
          },
          -h / 2,
          h / 2,
          -h / 2,
          h / 2,
          panels,
          n,
        );
    }
  }
  return s;
}

/** 勒让德多项式 P_l(x)，用递推 (l+1)P_{l+1} = (2l+1)xP_l − lP_{l−1}。 */
export function legendre(l: number, x: number): number {
  let p0 = 1;
  if (l === 0) return p0;
  let p1 = x;
  for (let k = 1; k < l; k++) {
    const p2 = ((2 * k + 1) * x * p1 - k * p0) / (k + 1);
    p0 = p1;
    p1 = p2;
  }
  return p1;
}

/** 长方体上的三重积分。 */
export function integrate3(f: (x: number, y: number, z: number) => number, a: V3, b: V3, panels = 8, n = 8): number {
  return integrate((x) => integrate2((y, z) => f(x, y, z), a[1], b[1], a[2], b[2], panels, n), a[0], b[0], panels, n);
}

// ---- 批次 11 加的：毕奥-萨伐尔定律沿导线数值积分、闭合导线的磁矩和受力、龙格-库塔法、线性方程组 ----

/** 题目里取的 μ₀ = 4π×10⁻⁷ N/A²。 */
export const MU0 = 4 * Math.PI * 1e-7;

/** 一段导线 r(t)（t 从 t0 到 t1，电流 I 沿 t 增大的方向）在 p 处的磁场：毕奥-萨伐尔定律沿导线数值积分。 */
export function curveB(r: (t: number) => V3, dr: (t: number) => V3, t0: number, t1: number, I: number, p: V3, panels = 64, n = 16): V3 {
  const comp = (k: number) =>
    integrate(
      (t) => {
        const d = sub(p, r(t));
        const len = norm(d);
        return cross(dr(t), d)[k] / (len * len * len);
      },
      t0,
      t1,
      panels,
      n,
    );
  return scale((MU0 * I) / (4 * Math.PI), [comp(0), comp(1), comp(2)]);
}

/** 直导线段 a→b 在 p 处的磁场（同样是数值积分，不用直导线的封闭公式）。 */
export function segmentB(a: V3, b: V3, I: number, p: V3, panels = 64, n = 16): V3 {
  const dl = sub(b, a);
  return curveB((t) => add(a, scale(t, dl)), () => dl, 0, 1, I, p, panels, n);
}

/** 折线（pts 依次相连；closed 时末点再连回首点）在 p 处的磁场。 */
export function polylineB(pts: V3[], I: number, p: V3, closed = true, panels = 64, n = 16): V3 {
  let B: V3 = [0, 0, 0];
  const m = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < m; i++) B = add(B, segmentB(pts[i], pts[(i + 1) % pts.length], I, p, panels, n));
  return B;
}

/** xy 平面里圆心在原点、半径 R 的圆线圈（逆时针看为正）在 p 处的磁场。 */
export function ringB(R: number, I: number, p: V3, panels = 64, n = 16): V3 {
  return curveB(
    (t) => [R * Math.cos(t), R * Math.sin(t), 0],
    (t) => [-R * Math.sin(t), R * Math.cos(t), 0],
    0,
    2 * Math.PI,
    I,
    p,
    panels,
    n,
  );
}

/** 闭合折线的磁矩 m = (I/2)∮ r × dl：逐段数值积分。 */
export function loopMoment(pts: V3[], I: number): V3 {
  let m: V3 = [0, 0, 0];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const dl = sub(pts[(i + 1) % pts.length], a);
    const comp = (k: number) => integrate((t) => cross(add(a, scale(t, dl)), dl)[k], 0, 1, 4, 8);
    m = add(m, [comp(0), comp(1), comp(2)]);
  }
  return scale(I / 2, m);
}

/** 闭合导线 r(t) 在磁场 B(·) 里受的力和对原点的力矩：dF = I dl × B，dτ = r × dF，沿导线数值积分。 */
export function loopForceTorque(r: (t: number) => V3, dr: (t: number) => V3, t0: number, t1: number, I: number, B: Field): { F: V3; tau: V3 } {
  const dF = (t: number) => scale(I, cross(dr(t), B(r(t))));
  const comp = (g: (t: number) => V3, k: number) => integrate((t) => g(t)[k], t0, t1, 64, 16);
  const dT = (t: number) => cross(r(t), dF(t));
  return { F: [comp(dF, 0), comp(dF, 1), comp(dF, 2)], tau: [comp(dT, 0), comp(dT, 1), comp(dT, 2)] };
}

type Rhs = (t: number, y: number[]) => number[];

/** 四阶龙格-库塔法走一步。 */
export function rk4Step(f: Rhs, t: number, y: number[], h: number): number[] {
  const k1 = f(t, y);
  const k2 = f(t + h / 2, y.map((v, j) => v + (h / 2) * k1[j]));
  const k3 = f(t + h / 2, y.map((v, j) => v + (h / 2) * k2[j]));
  const k4 = f(t + h, y.map((v, j) => v + h * k3[j]));
  return y.map((v, j) => v + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
}

/** 四阶龙格-库塔法：dy/dt = f(t, y)，从 t0 积到 t1，等分 steps 步。 */
export function rk4(f: Rhs, y0: number[], t0: number, t1: number, steps: number): number[] {
  const h = (t1 - t0) / steps;
  let y = [...y0];
  for (let i = 0; i < steps; i++) y = rk4Step(f, t0 + i * h, y, h);
  return y;
}

/** 四阶龙格-库塔法，步长 h，积到 g(t, y) 第一次由负变成非负为止；在最后一步里二分出事件的时刻。 */
export function rk4Until(f: Rhs, y0: number[], t0: number, h: number, maxSteps: number, g: (t: number, y: number[]) => number): { t: number; y: number[] } {
  let t = t0;
  let y = [...y0];
  let gPrev = g(t, y);
  for (let i = 0; i < maxSteps; i++) {
    const yn = rk4Step(f, t, y, h);
    const gn = g(t + h, yn);
    if (gPrev < 0 && gn >= 0) {
      let lo = 0;
      let hi = h;
      for (let k = 0; k < 200; k++) {
        const mid = (lo + hi) / 2;
        if (mid === lo || mid === hi) break;
        if (g(t + mid, rk4Step(f, t, y, mid)) < 0) lo = mid;
        else hi = mid;
      }
      return { t: t + hi, y: rk4Step(f, t, y, hi) };
    }
    t += h;
    y = yn;
    gPrev = gn;
  }
  throw new Error('rk4Until：积到最后也没等到事件');
}

/** 带电粒子在电场 E(·)、磁场 B(·) 里的运动方程，状态 [x, y, z, vx, vy, vz]。 */
export function lorentzRhs(qOverM: number, E: Field, B: Field): (t: number, s: number[]) => number[] {
  return (_t, s) => {
    const r: V3 = [s[0], s[1], s[2]];
    const v: V3 = [s[3], s[4], s[5]];
    const a = scale(qOverM, add(E(r), cross(v, B(r))));
    return [v[0], v[1], v[2], a[0], a[1], a[2]];
  };
}

/** 线性方程组 Ax = b：部分主元高斯消元。 */
export function solveLinear(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) {
      const f = M[r][c] / M[c][c];
      for (let j = c; j <= n; j++) M[r][j] -= f * M[c][j];
    }
  }
  const x = new Array<number>(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let s = M[r][n];
    for (let j = r + 1; j < n; j++) s -= M[r][j] * x[j];
    x[r] = s / M[r][r];
  }
  return x;
}

/**
 * 直流电路的节点法：节点 0 接地，其余节点的电势是未知数；每条支路从节点 a 到节点 b，
 * 由电动势 emf（沿 a→b 方向升高电势）和电阻 R 串联而成，支路电流沿 a→b 为 (φ_a − φ_b + emf)/R。
 * 返回各节点电势和各支路电流。
 */
export function solveCircuit(nodes: number, branches: { a: number; b: number; R: number; emf?: number }[]): { phi: number[]; I: number[] } {
  const n = nodes - 1;
  const A = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  const rhs = new Array<number>(n).fill(0);
  // 每个非接地节点：流出的支路电流之和为零
  for (const br of branches) {
    const g = 1 / br.R;
    const emf = br.emf ?? 0;
    for (const [node, sign] of [
      [br.a, 1],
      [br.b, -1],
    ] as const) {
      if (node === 0) continue;
      // 支路电流（a→b）= g(φa − φb + emf)；从 a 流出记 +，从 b 流出记 −
      if (br.a !== 0) A[node - 1][br.a - 1] += sign * g;
      if (br.b !== 0) A[node - 1][br.b - 1] -= sign * g;
      rhs[node - 1] -= sign * g * emf;
    }
  }
  const x = solveLinear(A, rhs);
  const phi = [0, ...x];
  const I = branches.map((br) => (phi[br.a] - phi[br.b] + (br.emf ?? 0)) / br.R);
  return { phi, I };
}
