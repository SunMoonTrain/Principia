// 狭义相对论各节验算脚本共用的工具。
// 文件名第三段以下划线开头，npm run verify 不把它当成小节的验算脚本（见 index.ts 的文件名规则）。
//
// 两套互相独立的算法，验算脚本里两者先互相核对：
// 一是讲解里的公式：γ、洛伦兹变换 Λ(β)、速度变换（gamma、boost、composeVelocity、transformVelocity）。
// 二是「操作性」的算法（clockRate、radar、restPoint、radarVelocity）：只用「光在 S 里沿任何方向都以 c 传播」、
//   光钟的定义和爱因斯坦对钟的定义，在 S 里用二分法追光信号，算出运动的钟走多快、一个事件在 S′ 里的坐标、
//   S′ 里静止的点在 S 里的位置。这一套里不写 γ、洛伦兹变换和速度变换的式子；横向坐标用「横向长度不变」（y′ = y）。

export type Vec = number[];

/** f 在 [lo, hi] 上的零点：二分到机器精度。f(lo)、f(hi) 必须异号（或有一个为零）。 */
export function bisect(f: (x: number) => number, lo: number, hi: number): number {
  let a = lo;
  let b = hi;
  let fa = f(a);
  const fb = f(b);
  if (fa === 0) return a;
  if (fb === 0) return b;
  if (fa * fb > 0) throw new Error(`bisect：[${lo}, ${hi}] 两端没有变号`);
  for (let k = 0; k < 2000; k++) {
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

/** 两种算法的结果互相核对：相对误差超过 tol 就报错。返回第二个（公式的值）。 */
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
export function chosen(flags: boolean[]): number[] {
  return flags.flatMap((ok, i) => (ok ? [i + 1] : []));
}

// ---------- 一、公式 ----------

export const gamma = (beta: number): number => 1 / Math.sqrt(1 - beta * beta);

/** Λ(β) 作用在 (ct, x) 上：返回 (ct′, x′)。 */
export function boost(beta: number, ct: number, x: number): [number, number] {
  const g = gamma(beta);
  return [g * (ct - beta * x), g * (x - beta * ct)];
}

/** Λ(β) 的矩阵。 */
export function lambdaMatrix(beta: number): number[][] {
  const g = gamma(beta);
  return [
    [g, -g * beta],
    [-g * beta, g],
  ];
}

/** 沿同一直线合成速度（以 c 为单位）：相对 S′ 的 u′，S′ 相对 S 的 v，返回相对 S 的速度。 */
export const composeVelocity = (u: number, v: number): number => (u + v) / (1 + u * v);

/** 速度变换（以 c 为单位）：S 里的 (u_x, u_y)，S′ 以 v 沿 x 轴运动，返回 S′ 里的 (u′_x, u′_y)。 */
export function transformVelocity(ux: number, uy: number, v: number): [number, number] {
  const d = 1 - ux * v;
  return [(ux - v) / d, uy / (gamma(v) * d)];
}

// ---------- 二、只用光信号的操作性算法 ----------

/**
 * 光钟随 S′ 以速度 v 沿 x 轴运动：两面镜子在 (vt, 0)、(vt, d)。在 S 里追光一个来回（光速 c），
 * 返回「钟自己的读数 / S 的时间」（钟走一下记 2d/c）。
 */
export function clockRate(v: number, c: number): number {
  const d = 1;
  const reach = (2 * d) / (c - Math.abs(v));
  // 去程：从 (0, 0) 出发，t1 时碰到上面的镜子 (v t1, d)
  const t1 = bisect((t) => c * t - Math.hypot(v * t, d), 0, reach);
  // 回程：从 (v t1, d) 出发，t2 时碰到下面的镜子 (v t2, 0)
  const t2 = bisect((t) => c * (t - t1) - Math.hypot(v * (t - t1), d), t1, t1 + reach);
  return (2 * d) / c / t2;
}

/**
 * 低速时 1 − clockRate 会被舍入误差淹没：在 β = 0.01、0.02 两处用光钟算 q(β) = (1 − rate)/β²，
 * 按 q = a + bβ² 定出 a、b，再算 aβ² + bβ⁴（下一项相对小 β⁴ 量级）。
 */
export function slowClockLag(v: number, c: number): number {
  const q = (b: number): number => (1 - clockRate(b * c, c)) / (b * b);
  const q1 = q(0.01);
  const q2 = q(0.02);
  const b4 = (q2 - q1) / (0.02 ** 2 - 0.01 ** 2);
  const a = q1 - b4 * 0.01 ** 2;
  const beta = v / c;
  return a * beta * beta + b4 * beta ** 4;
}

export interface Ev {
  t: number;
  x: number;
  y?: number;
}

/**
 * 事件在 S′ 里的坐标 (t′, x′, y′)；S′ 相对 S 以 v 沿 x 轴运动，标准位形（t = 0 时 S′ 原点的钟读 0）。
 * 雷达法：S′ 原点的钟读 τ_e 时发光，光在事件处反射，原点读 τ_r 时收到；
 * 按爱因斯坦对钟，t′ = (τ_e + τ_r)/2，事件到原点的距离是 c(τ_r − τ_e)/2。
 * 原点的钟走多快由 clockRate 给出；y′ = y（横向长度不变），x′ 的正负看事件发生时它在原点的前方还是后方。
 */
export function radar(v: number, c: number, ev: Ev): { t: number; x: number; y: number } {
  const rate = clockRate(v, c);
  const y = ev.y ?? 0;
  const sep = Math.abs(ev.x - v * ev.t) + Math.abs(y);
  if (sep === 0) return { t: rate * ev.t, x: 0, y: 0 };
  const span = (2 * sep) / (c - Math.abs(v));
  const te = bisect((s) => c * (ev.t - s) - Math.hypot(ev.x - v * s, y), ev.t - span, ev.t);
  const tr = bisect((s) => c * (s - ev.t) - Math.hypot(v * s - ev.x, y), ev.t, ev.t + span);
  const tauE = rate * te;
  const tauR = rate * tr;
  const r = (c * (tauR - tauE)) / 2;
  const x = Math.sign(ev.x - v * ev.t) * Math.sqrt(Math.max(0, r * r - y * y));
  return { t: (tauE + tauR) / 2, x, y };
}

/**
 * S′ 里静止、坐标为 (x′, y′) 的点，在 S 的 t = 0 时刻位于哪里：y = y′，对 x 二分使雷达坐标的 x′ 对上。
 * 用来量 S′ 里静止的杆在 S 里多长（S 里同一时刻 t = 0 记两端）。
 */
export function restPoint(v: number, c: number, xp: number, yp = 0): { x: number; y: number } {
  if (xp === 0) return { x: 0, y: yp };
  const R = 2 * Math.abs(xp) + 1;
  const x = bisect((s) => radar(v, c, { t: 0, x: s, y: yp }).x - xp, -R, R);
  return { x, y: yp };
}

/** 质点在 S 里以 (u_x, u_y) 匀速运动，取它世界线上的两个事件，换成 S′ 的雷达坐标，相除得 S′ 里的速度。 */
export function radarVelocity(v: number, c: number, ux: number, uy = 0): [number, number] {
  const T = 1 / c;
  const a = radar(v, c, { t: 0, x: 0, y: 0 });
  const b = radar(v, c, { t: T, x: ux * T, y: uy * T });
  return [(b.x - a.x) / (b.t - a.t), (b.y - a.y) / (b.t - a.t)];
}
