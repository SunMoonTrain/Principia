// 独立验算 physics.newtonian-mechanics.gravitation 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（g = GM/R²、v = √(GM/r)、T = 2π√(r³/GM)）；二是不用这些式子：
// p1 在月面上方 1 cm 处由静止释放，按 −GM/r² 积分到落回月面，由 h = ½gt² 反算 g；
// p2、p4 用平方反比引力积分轨道（_nm.ts 的 keplerHalf），二分出圆轨道的速率、量出周期；p4 由周期和半径定出
// 卫星的速率（匀速圆周运动的运动学），再二分出让这个速率正好走圆轨道的 GM；p3 二分出 g 减半的高度。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.gravitation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, bisectN, check, chosen, circularPeriod, circularSpeed, keplerHalf, linear, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const G = 6.67e-11;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.gravitation',
  notes: {
    p1: 'g = GM/R²；和积分核对：从月面上方 1 cm 由静止释放，r″ = −GM/r² 积到 r = R，g = 2h/t²（1 cm 内 g 的变化约 10⁻⁸）。',
    p2: '逐条用例子（GM 取 1）：A 二分出 r = 4、1 的圆轨道速率，之比 0.5（对）；B 引力除以卫星质量得到的加速度，m = 1 和 1000 kg 相同，圆轨道速率与质量无关（错）；C 积分量出 r = 4、1 的圆轨道周期，之比 8（对）；D 同一颗卫星在 r = 2 处受的引力是 r = 1 处的 1/4，更小（错）；E 同 D（对）。',
    p3: '(R/(R + h))² = 1/2，h = (√2 − 1)R；和二分核对：GM/(R + h)² − GM/(2R²) 的零点。',
    p4: 'M = 4π²r³/(GT²)；和轨道积分核对：卫星的速率 v = 2πr/T，二分出让它从 (r, 0) 以 v 出发、转过半圈时仍在 r 处的 GM。',
  },
  compute() {
    // p1（m/s²）
    const M1 = 7.35e22;
    const R1 = 1.74e6;
    const drop = 0.01;
    const fall = rk4Until(linear((_t, r) => (-G * M1) / (r * r)), [R1 + drop, 0], 0, 1e-4, 1e7, (_t, y) => R1 - y[0]);
    const p1 = agree((2 * drop) / (fall.t * fall.t), (G * M1) / (R1 * R1), 'p1 月面的重力加速度', 1e-6);

    // p2
    const vRatio = circularSpeed(1, 4) / circularSpeed(1, 1);
    const optA = Math.abs(vRatio - 0.5) < 1e-9;
    const accel = (m: number) => (G * 5.97e24 * m) / (7e6 * 7e6) / m;
    const optB = Math.abs(accel(1000) - accel(1)) > 1e-12 * accel(1);
    check(!optB, 'p2 B 加速度与卫星质量无关');
    const tRatio = circularPeriod(1, 4) / circularPeriod(1, 1);
    const optC = Math.abs(tRatio - 8) < 1e-8;
    const F = (r: number) => 1 / (r * r);
    const optD = F(2) > F(1);
    const optE = Math.abs(F(2) / F(1) - 0.25) < 1e-15;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（km）
    const R = 6.37e6;
    const hNum = bisect((h) => 1 / ((R + h) * (R + h)) - 1 / (2 * R * R), 0, 10 * R);
    const p3 = agree(hNum / 1000, ((Math.SQRT2 - 1) * R) / 1000, 'p3 g 减半的高度', 1e-9);

    // p4（kg）
    const r4 = 9.38e6;
    const T4 = 7.65 * 3600;
    const v4 = (2 * Math.PI * r4) / T4;
    const guess = (v4 * v4 * r4) / G;
    const GMnum = bisectN((gm) => keplerHalf(gm, r4, v4, 4000).r - r4, 0.7 * G * guess, 1.4 * G * guess);
    const half = keplerHalf(GMnum, r4, v4);
    check(Math.abs(2 * half.t - T4) < 1e-6 * T4, 'p4 二分出的 GM 下积出的周期就是 7.65 h');
    const p4 = agree(GMnum / G, (4 * Math.PI * Math.PI * r4 ** 3) / (G * T4 * T4), 'p4 火星的质量', 1e-8);

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
