// 牛顿力学验算脚本的公用部分（文件名以下划线开头，npm run verify 不把它当成小节脚本）。
// 第二套算法的主要办法：不用讲解里解出来的式子，把运动方程（加速度或力）交给四阶龙格-库塔法一步步积分，
// 用 rk4Until 在「落地」「掉头」「到达对岸」这类事件处二分出时刻；受力平衡用线性方程组直接解各个力。
// agree、check、chosen、bisect、argmax、rk4、rk4Until、solveLinear、cross 等借用电磁学的辅助文件。

export { agree, argmax, bisect, check, chosen, cross, dot, norm, rk4, rk4Step, rk4Until, solveLinear, sub, add, scale, type V3 } from './physics.electromagnetism._es.ts';

export const deg = Math.PI / 180;

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
