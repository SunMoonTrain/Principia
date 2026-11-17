// 牛顿力学验算脚本的公用部分（文件名以下划线开头，npm run verify 不把它当成小节脚本）。
// 第二套算法的主要办法：不用讲解里解出来的式子，把运动方程（加速度或力）交给四阶龙格-库塔法一步步积分，
// 用 rk4Until 在「落地」「掉头」「到达对岸」这类事件处二分出时刻；受力平衡用线性方程组直接解各个力。
// agree、check、chosen、bisect、argmax、rk4、rk4Until、solveLinear、cross、integrate 等借用电磁学的辅助文件。
// 批次 19（动量与能量）加了两种碰撞模拟：一维的两个物体之间夹一根很硬的弹簧（弹性碰撞积到分开，完全非弹性碰撞
// 在压缩最多、两者速度相等的那一刻锁住）；二维的两个光滑圆盘，靠得比两个半径之和还近时沿连心线互相推开。

import { rk4Step, rk4Until } from './physics.electromagnetism._es.ts';

export { agree, argmax, bisect, check, chosen, cross, dot, integrate, norm, rk4, rk4Step, rk4Until, solveLinear, sub, add, scale, type V3 } from './physics.electromagnetism._es.ts';

export const deg = Math.PI / 180;

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
