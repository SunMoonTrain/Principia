// 独立验算 physics.newtonian-mechanics.kinematics-vectors 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（运动的分解、轨迹方程、平抛落地时间）；
// 二是不用这些式子：把 a = (0, −g) 交给四阶龙格-库塔法积分平面运动，在「落地」「落到斜坡上」「到达篮筐的水平距离」处二分；
// p3 再在出手速率上二分，让到达 x = 6 m 时的高度正好是 1 m。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.kinematics-vectors.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, chosen, deg, planar, rk4, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;
const free = planar(() => [0, -g]);

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.kinematics-vectors',
  notes: {
    p1: 'x = v₀√(2h/g)；和积分核对：从 (0, 1.25) 以 (3, 0) 出发积分到 y = 0。',
    p2: '逐条用例子（积分）：A 速度 (2, 0) 和 (0, 3) 的两个匀速分运动，合速度一直是 (2, 3)，直线（对）；B 一个方向「匀速」的速度为 0、另一个方向 a = 2 时，轨迹是直线 x = 1，不是抛物线（错，见报告）；C 以 (5, 8) 抛出，0–1 s 和 2–3 s 里速度改变量都是 (0, −9.8)（对）；D 同一抛体，速度和加速度的夹角从 148° 一路减小到 32°（错）；E 同从 5 m 高水平抛出，初速 2、10 m/s 落地角 78.3°、44.7°（错）。',
    p3: 'y = x tanθ − gx²/(2v²cos²θ) 解出 v；和积分核对：在速率上二分，积分到 x = 6 m 时的高度正好 1 m。',
    p4: 't = 2v₀tan30°/g；和积分核对：从坡顶以 (10, 0) 出发，积分到 y + x tan30° = 0。',
  },
  compute() {
    // p1
    const formula1 = 3 * Math.sqrt((2 * 1.25) / g);
    const land = rk4Until(free, [0, 1.25, 3, 0], 0, 1e-3, 1e6, (_t, s) => -s[1]);
    const p1 = agree(land.y[0], formula1, 'p1 水平距离', 1e-9);

    // p2
    const sA = rk4(planar(() => [0, 0]), [0, 0, 2, 3], 0, 4, 400);
    const optA = Math.abs(sA[2] - 2) < 1e-12 && Math.abs(sA[3] - 3) < 1e-12 && Math.abs(sA[1] / sA[0] - 1.5) < 1e-12;
    // B：x 方向「匀速」的速度取 0（匀速运动的特例），y 方向匀加速：轨迹是竖直线
    const sB = rk4(planar(() => [0, 2]), [1, 0, 0, 0], 0, 3, 300);
    const optB = Math.abs(sB[0] - 1) > 1e-12; // 轨迹不是直线才可能是抛物线
    const vAt = (t: number) => rk4(free, [0, 0, 5, 8], 0, t, 1000);
    const dv1 = [vAt(1)[2] - vAt(0)[2], vAt(1)[3] - vAt(0)[3]];
    const dv2 = [vAt(3)[2] - vAt(2)[2], vAt(3)[3] - vAt(2)[3]];
    const optC = Math.abs(dv1[0] - dv2[0]) < 1e-9 && Math.abs(dv1[1] - dv2[1]) < 1e-9;
    const angles: number[] = [];
    for (let t = 0; t <= 1.63; t += 0.1) {
      const s = vAt(t);
      angles.push(Math.acos((-s[3] * g) / (Math.hypot(s[2], s[3]) * g)) / deg);
    }
    const optD = angles.every((a, i) => i === 0 || a > angles[i - 1]);
    const landAngle = (v0: number) => {
      const e = rk4Until(free, [0, 5, v0, 0], 0, 1e-3, 1e6, (_t, s) => -s[1]);
      return Math.atan2(-e.y[3], e.y[2]) / deg;
    };
    const optE = Math.abs(landAngle(2) - landAngle(10)) < 1e-6;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m/s）
    const th = 50 * deg;
    const formula3 = Math.sqrt((g * 36) / (2 * Math.cos(th) ** 2 * (6 * Math.tan(th) - 1)));
    const heightAt6 = (v: number) => rk4Until(free, [0, 0, v * Math.cos(th), v * Math.sin(th)], 0, 1e-3, 1e6, (_t, s) => s[0] - 6).y[1];
    const p3 = agree(bisect((v) => heightAt6(v) - 1, 6, 12), formula3, 'p3 出手速率', 1e-7);

    // p4（s）
    const formula4 = (2 * 10 * Math.tan(30 * deg)) / g;
    const hit = rk4Until(free, [0, 0, 10, 0], 0, 1e-3, 1e6, (t, s) => (t > 1e-6 ? -(s[1] + s[0] * Math.tan(30 * deg)) : -1));
    const p4 = agree(hit.t, formula4, 'p4 飞行时间', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
