// 独立验算 physics.newtonian-mechanics.kinematics-1d 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（求导得速度、加速度，匀变速公式，原函数加初始条件）；
// 二是不用这些式子：对 x(t) 数值求导、二分出速度的零点；把加速度交给四阶龙格-库塔法积分，在「停下」等事件处二分。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.kinematics-1d.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, bisect, check, chosen, deriv, linear, rk4, rk4Until } from './physics.newtonian-mechanics._nm.ts';

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.kinematics-1d',
  notes: {
    p1: 'v = 6t² − 18t + 12 = 6(t − 1)(t − 2)，t = 1 时 a = 12t − 18；和数值核对：对 x(t) 中心差分求 v，从 0 往后扫到第一次变号再二分，再对 v 数值求导。',
    p2: '逐条用例子：A v₀ = 1、a = 1/(1 + t)（为正、在减小），积分 5 s 后速度变成 2.79，在增大（错）；B x = t³ 在 [0, 2]、x = sin t 在 [0, 3] 上，都二分出瞬时速度等于平均速度的时刻（对）；C a = 2 时 x(2) − x(1) = 3 ≠ x(1) − x(0) = 1（错）；D 加速度、初速度相同，初位置 0 和 1 的两次积分，位置一直差 1（错）；E v₀ = 5、a = −2，2.5 s 掉头，t = 4 时积分得 v² − v₀² = −16 = 2aΔx（对）。',
    p3: '20 × 0.6 + 20²/(2 × 5)；和积分核对：前 0.6 s 匀速，之后 a = −5 积分到 v = 0。',
    p4: 'a = 0 时 t = 2/3，x = t³ − 2t² + 2t + 1 = 47/27；和积分核对：从初始条件积分，黄金分割找速度最小的时刻和那时的位置。',
  },
  compute() {
    // p1
    const x1 = (t: number) => 2 * t ** 3 - 9 * t ** 2 + 12 * t;
    const v1 = (t: number) => deriv(x1, t, 1e-4);
    let t1 = NaN;
    for (let t = 0.01; t < 5; t += 0.01) if (v1(t - 0.01) > 0 && v1(t) <= 0) { t1 = bisect(v1, t - 0.01, t); break; }
    check(Math.abs(t1 - 1) < 1e-6, 'p1 t = 1');
    const p1 = agree(deriv(v1, t1, 1e-3), 12 * 1 - 18, 'p1 加速度', 1e-5);

    // p2
    const sA = rk4(linear((t) => 1 / (1 + t)), [0, 1], 0, 5, 5000);
    check(Math.abs(sA[1] - (1 + Math.log(6))) < 1e-9, 'A：v = 1 + ln6');
    const optA = Math.abs(sA[1]) < 1;
    const mvt = (x: (t: number) => number, a: number, b: number) => {
      const avg = (x(b) - x(a)) / (b - a);
      return bisect((t) => deriv(x, t) - avg, a + 1e-6, b - 1e-6);
    };
    const cB1 = mvt((t) => t ** 3, 0, 2);
    const cB2 = mvt(Math.sin, 0, 3);
    const optB = cB1 > 0 && cB1 < 2 && cB2 > 0 && cB2 < 3;
    const xC = (t: number) => t * t;
    const optC = Math.abs(xC(2) - xC(1) - (xC(1) - xC(0))) < 1e-12;
    const d1 = rk4(linear(() => 2), [0, 3], 0, 2, 200);
    const d2 = rk4(linear(() => 2), [1, 3], 0, 2, 200);
    const optD = Math.abs(d1[0] - d2[0]) < 1e-12;
    const sE = rk4(linear(() => -2), [0, 5], 0, 4, 4000);
    check(Math.abs(sE[1] + 3) < 1e-9, 'E：t = 4 时 v = −3');
    const optE = Math.abs(sE[1] ** 2 - 25 - 2 * -2 * sE[0]) < 1e-9;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m）
    const v0 = 72 / 3.6;
    const formula3 = v0 * 0.6 + (v0 * v0) / (2 * 5);
    const afterReact = rk4(linear(() => 0), [0, v0], 0, 0.6, 600);
    const stop = rk4Until(linear(() => -5), afterReact, 0.6, 1e-3, 100000, (_t, s) => -s[1]);
    const p3 = agree(stop.y[0], formula3, 'p3 一共走的距离', 1e-9);

    // p4（m）
    const f4 = linear((t) => 6 * t - 4);
    const state = (t: number) => rk4(f4, [1, 2], 0, t, 4000);
    const tMin = argmax((t) => -state(t)[1], 0, 2);
    const formula4 = (2 / 3) ** 3 - 2 * (2 / 3) ** 2 + 2 * (2 / 3) + 1;
    check(Math.abs(formula4 - 47 / 27) < 1e-12, 'p4 47/27');
    const p4 = agree(state(tMin)[0], formula4, 'p4 速度最小时的位置', 1e-6);

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
