// 牛顿力学验算脚本的公用部分（文件名以下划线开头，npm run verify 不把它当成小节脚本）。
// 第二套算法的主要办法：不用讲解里解出来的式子，把运动方程（加速度或力）交给四阶龙格-库塔法一步步积分，
// 用 rk4Until 在「落地」「掉头」「到达对岸」这类事件处二分出时刻；受力平衡用线性方程组直接解各个力。
// agree、check、chosen、bisect、argmax、rk4、rk4Until、solveLinear、cross、integrate 等借用电磁学的辅助文件。
// 批次 19（动量与能量）加了两种碰撞模拟：一维的两个物体之间夹一根很硬的弹簧（弹性碰撞积到分开，完全非弹性碰撞
// 在压缩最多、两者速度相等的那一刻锁住）；二维的两个光滑圆盘，靠得比两个半径之和还近时沿连心线互相推开。
// 批次 20（引力、有心力）加了：平方反比引力下的轨道积分 keplerHalf（积到转过半圈）、两个质点各自按牛顿第二定律的
// 完整模拟 twoBodyHalf、只算中点的二分 bisectN，以及球对称物体的引力势能 spherePotential（对 (r′, θ) 做二重数值积分，
// 不用球壳定理）。

import { integrate, rk4Step, rk4Until } from './physics.electromagnetism._es.ts';

export { agree, argmax, bisect, check, chosen, cross, dot, integrate, norm, rk4, rk4Step, rk4Until, solveLinear, sub, add, scale, type V3 } from './physics.electromagnetism._es.ts';

export const deg = Math.PI / 180;

/** 二分 n 次，只在区间中点求值（端点处可能没定义，例如轨道不闭合）。f(lo)、f(hi) 要异号，由调用者保证。 */
export function bisectN(f: (x: number) => number, lo: number, hi: number, n = 60): number {
  const sLo = Math.sign(f(lo + (hi - lo) * 1e-9));
  let a = lo;
  let b = hi;
  for (let i = 0; i < n; i++) {
    const m = (a + b) / 2;
    if (Math.sign(f(m)) === sLo) a = m;
    else b = m;
  }
  return (a + b) / 2;
}

/**
 * 平方反比引力下质点的平面运动：力心在原点，加速度 −GM r/r³。从 (r0, 0) 以 (0, v0) 出发（v0 > 0，逆时针转），
 * 积到质点第一次越过 x 轴负半轴（转过半圈）。时间变量换成 s，dt = r ds（Sundman 变换）：近心点附近自动走细，
 * s 等步长相当于偏近点角等步长。返回转过半圈的时刻、那里到力心的距离和速率。
 * 不用轨道方程、能量守恒的式子；从拱点出发时，转过半圈正好到另一个拱点，这一点由积分的结果自己体现
 * （径向速度在那里为零，调用者可以核对）。
 */
export function keplerHalf(GM: number, r0: number, v0: number, steps = 20000): { t: number; r: number; v: number; vr: number } {
  const rhs = (_s: number, y: number[]): number[] => {
    const r = Math.hypot(y[0], y[1]);
    const k = -GM / (r * r * r);
    return [r * y[2], r * y[3], r * k * y[0], r * k * y[1], r];
  };
  // 一圈的 s 是 2π√(a/GM)；按出发点的 r0 估 a，从近心点出发时只会走得更细
  const ds = (2 * Math.PI * Math.sqrt(r0 / GM)) / steps;
  const e = rk4Until(rhs, [r0, 0, 0, v0, 0], 0, ds, 400 * steps, (_s, y) => -y[1]);
  const r = Math.hypot(e.y[0], e.y[1]);
  return { t: e.y[4], r, v: Math.hypot(e.y[2], e.y[3]), vr: (e.y[0] * e.y[2] + e.y[1] * e.y[3]) / r };
}

/** 圆轨道的速率：二分出转过半圈后到力心的距离仍是 r 的出发速率（不用 v = √(GM/r)，它只用来框住二分的范围）。 */
export function circularSpeed(GM: number, r: number): number {
  const guess = Math.sqrt(GM / r);
  return bisectN((v) => keplerHalf(GM, r, v, 4000).r - r, 0.7 * guess, 1.3 * guess, 55);
}

/** 圆轨道的周期：用二分出的圆轨道速率积分，转过半圈用的时间的两倍。 */
export function circularPeriod(GM: number, r: number): number {
  return 2 * keplerHalf(GM, r, circularSpeed(GM, r)).t;
}

/**
 * 两个质点只受彼此的引力，各自按牛顿第二定律积分（状态是两个质点各自的位置、速度，不用约化质量）。
 * 质心在原点、静止：m1 从 (m2 d/M, 0) 出发，m2 从 (−m1 d/M, 0) 出发，速度沿 ±y，相对速度 vrel。
 * 同样用 dt = r ds（r 是两者的距离），积到两者的连线转过半圈。返回那时的时刻、两者的距离和各自到质心的距离。
 */
export function twoBodyHalf(G: number, m1: number, m2: number, d: number, vrel: number, steps = 20000): { t: number; d: number; r1: number; r2: number } {
  const M = m1 + m2;
  const rhs = (_s: number, y: number[]): number[] => {
    const dx = y[0] - y[4];
    const dy = y[1] - y[5];
    const r = Math.hypot(dx, dy);
    const f = (G * m1 * m2) / (r * r * r); // 引力的大小除以 r
    return [r * y[2], r * y[3], (r * -f * dx) / m1, (r * -f * dy) / m1, r * y[6], r * y[7], (r * f * dx) / m2, (r * f * dy) / m2, r];
  };
  const ds = (2 * Math.PI * Math.sqrt(d / (G * M))) / steps;
  const y0 = [(m2 / M) * d, 0, 0, (m2 / M) * vrel, -(m1 / M) * d, 0, 0, -(m1 / M) * vrel, 0];
  const e = rk4Until(rhs, y0, 0, ds, 400 * steps, (_s, y) => -(y[1] - y[5]));
  const y = e.y;
  return { t: y[8], d: Math.hypot(y[0] - y[4], y[1] - y[5]), r1: Math.hypot(y[0], y[1]), r2: Math.hypot(y[4], y[5]) };
}

/**
 * 球对称物体（密度 rho(r′)，外半径 R）在离球心 r 处、每单位质量的引力势能，G 取 1：
 * U(r) = −∫₀^R rho(r′) 2πr′² dr′ ∫₀^π sinθ / √(r² + r′² − 2rr′cosθ) dθ。
 * 两重都用复合高斯-勒让德，r′ 在 r 和 breaks（密度跳变处）断开。被积函数有界（r′ = r、θ → 0 时趋于 1/r）。
 * 只用万有引力定律和叠加，不用球壳定理。
 */
export function spherePotential(rho: (rp: number) => number, R: number, r: number, breaks: number[] = [], panels = 24): number {
  // r′ 接近 r 时被积函数在 θ = 0 附近有一个宽约 |r − r′|/r 的陡坡，θ 在那里另外断开、走细
  const f = (rp: number) => (th: number) => Math.sin(th) / Math.sqrt(r * r + rp * rp - 2 * r * rp * Math.cos(th));
  const inner = (rp: number) => {
    const tc = Math.min(Math.PI / 2, (20 * Math.abs(r - rp)) / Math.max(r, rp, 1e-300) + 1e-6);
    return integrate(f(rp), 0, tc, 8, 16) + integrate(f(rp), tc, Math.PI, panels, 16);
  };
  const cuts = [0, ...breaks.filter((b) => b > 0 && b < R), ...(r > 0 && r < R ? [r] : []), R].sort((a, b) => a - b);
  let s = 0;
  for (let i = 0; i + 1 < cuts.length; i++) {
    if (cuts[i + 1] - cuts[i] < 1e-15) continue;
    s += integrate((rp) => rho(rp) * 2 * Math.PI * rp * rp * inner(rp), cuts[i], cuts[i + 1], panels, 16);
  }
  return -s;
}

/**
 * 由 spherePotential 数值求导得到引力的大小（指向球心为正），G 取 1。
 * side = 0 用中心差分；side = −1 只用 r 里面的点、+1 只用 r 外面的点（二阶单侧差分），用在密度跳变的地方和球面上。
 */
export function sphereField(rho: (rp: number) => number, R: number, r: number, breaks: number[] = [], side: -1 | 0 | 1 = 0, h = 1e-4 * R): number {
  const U = (x: number) => spherePotential(rho, R, x, breaks);
  if (side === 0) return (U(r + h) - U(r - h)) / (2 * h);
  const s = side;
  return (-s * (3 * U(r) - 4 * U(r + s * h) + U(r + 2 * s * h))) / (2 * h);
}

/**
 * 一维碰撞的数值模拟：质量 m1、m2，碰前速度 v1 > v2，物体 1 在左。两者重叠时之间有劲度 k·(约化质量) 的弹簧力。
 * lock = false：积到两者重新分开（弹性碰撞）；lock = true：积到相对速度第一次变成零、在那一刻锁住（完全非弹性碰撞）。
 * 返回碰后（或锁住时）两者的速度。不用动量守恒、动能守恒的式子。
 */
export function collide1D(m1: number, m2: number, v1: number, v2: number, lock = false): [number, number] {
  const mu = (m1 * m2) / (m1 + m2);
  const k = 1e6 * mu; // 碰撞持续约 π/1000 s
  const rhs = (_t: number, s: number[]): number[] => {
    const overlap = s[0] - s[2]; // x1 − x2 > 0 时重叠
    const f = overlap > 0 ? k * overlap : 0;
    return [s[1], -f / m1, s[3], f / m2];
  };
  const h = 1e-6;
  const gap = 1e-3 * (v1 - v2);
  // 先自由飞到接触
  const touch = rk4Until(rhs, [-gap, v1, 0, v2], 0, h, 1e7, (_t, s) => s[0] - s[2]);
  if (lock) {
    const e = rk4Until(rhs, touch.y, touch.t, h, 1e7, (_t, s) => s[3] - s[1]);
    return [e.y[1], e.y[3]];
  }
  const e = rk4Until(rhs, touch.y, touch.t, h, 1e7, (_t, s) => s[2] - s[0] - 1e-15);
  return [e.y[1], e.y[3]];
}

/**
 * 二维：两个质量相等、半径为 1 的光滑圆盘，圆盘 1 以 (v, 0) 撞向静止在原点的圆盘 2，瞄准距离 b（0 ≤ b < 2）。
 * 从刚接触时开始积分，两者靠得比 2 还近时沿连心线互相推开（很硬的弹簧），积到重新分开。
 * 返回碰后两个圆盘的速度 [vx1, vy1, vx2, vy2]。不用动量守恒、动能守恒的式子。
 */
export function disks2D(v: number, b: number): number[] {
  const k = 1e7; // 质量取 1
  const rhs = (_t: number, s: number[]): number[] => {
    const dx = s[4] - s[0];
    const dy = s[5] - s[1];
    const d = Math.hypot(dx, dy);
    const f = d < 2 ? k * (2 - d) : 0;
    const ux = dx / d;
    const uy = dy / d;
    return [s[2], s[3], -f * ux, -f * uy, s[6], s[7], f * ux, f * uy];
  };
  const x0 = -Math.sqrt(4 - b * b);
  const h = 2e-7;
  let s = [x0, b, v, 0, 0, 0, 0, 0];
  let t = 0;
  // 先走一小步进入重叠，再积到重新分开
  s = rk4Step(rhs, t, s, h);
  t += h;
  const e = rk4Until(rhs, s, t, h, 1e7, (_t, y) => Math.hypot(y[4] - y[0], y[5] - y[1]) - 2);
  return e.y.slice(2, 4).concat(e.y.slice(6, 8));
}

/** 质点在平面里的运动：状态 [x, y, vx, vy]，加速度由 acc(t, x, y, vx, vy) 给出。 */
export const planar = (acc: (t: number, x: number, y: number, vx: number, vy: number) => [number, number]) =>
  (t: number, s: number[]): number[] => {
    const [ax, ay] = acc(t, s[0], s[1], s[2], s[3]);
    return [s[2], s[3], ax, ay];
  };

/** 直线运动：状态 [x, v]，加速度由 acc(t, x, v) 给出。 */
export const linear = (acc: (t: number, x: number, v: number) => number) =>
  (t: number, s: number[]): number[] => [s[1], acc(t, s[0], s[1])];

/** 数值求导（中心差分）。 */
export const deriv = (f: (t: number) => number, t: number, h = 1e-5) => (f(t + h) - f(t - h)) / (2 * h);
