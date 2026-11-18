// 独立验算 physics.oscillations-waves.wave-equation 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 v = √(T/μ)、f(x ∓ vt) 是行波；二是不用波速公式，把弦细分成一串小球、对每个小球列牛顿
// 第二定律，用斯图姆序列求最低简正频率再外推到连续极限，由 v = ω1L/π 得到波速；函数是否满足波动方程用中心差分
// 直接算 y_tt − 4y_xx；波形移动的速度由两个时刻同一个零点的位置差量出。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.wave-equation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, bisect, check, chosen, stringLowestOmega, waveResidual } from './physics.oscillations-waves._ow.ts';

/** 由细分的链求出的波速：长 L 的弦最低简正角频率 ω1 = πv/L。 */
const chainSpeed = (T: number, mu: number, L = 1) => (stringLowestOmega(T, mu, L) * L) / Math.PI;

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.wave-equation',
  notes: {
    p1: 'v = √(50/0.002)；和细分的链外推出的最低频率换算的波速核对。',
    p2: '在 5 个点上用中心差分算 y_tt − 4y_xx，和 y_tt 的大小比：A sin(x − 2t) 为零（对）；B e^{−(x−t)²} 是波速 1 的行波，不为零（错）；C x² − 4t² 处处是 −8 − 8 = −16（错）；D cos(3x + 6t) = cos 3(x + 2t) 为零（对）；E (x + 2t)³ 为零（对）。',
    p3: 'μ = 0.010/2.5，v = √(64/μ)，t = 2.5/v；波速和细分的链外推的结果核对。',
    p4: '最大横向速率 Aω = 2 m/s，波速 ω/k = 20 m/s，比值 Ak = 0.1；和数值求 |y_t| 的最大值（黄金分割）、由 t = 0 和 t = 0.001 s 时同一个零点的位置差量波速核对。',
  },
  compute() {
    // p1（m/s）
    const p1 = agree(chainSpeed(50, 0.002), Math.sqrt(50 / 0.002), 'p1 波速', 1e-9);

    // p2
    const fs = [(x: number, t: number) => Math.sin(x - 2 * t), (x: number, t: number) => Math.exp(-((x - t) ** 2)), (x: number, t: number) => x * x - 4 * t * t, (x: number, t: number) => Math.cos(3 * x + 6 * t), (x: number, t: number) => (x + 2 * t) ** 3];
    const pts = [[0.3, 0.1], [-0.7, 0.4], [1.2, -0.3], [0.05, 0.9], [-1.5, -0.6]];
    const rel = fs.map((u) => Math.max(...pts.map(([x, t]) => Math.abs(waveResidual(u, 2, x, t)) / (Math.abs((u(x, t + 1e-3) - 2 * u(x, t) + u(x, t - 1e-3)) / 1e-6) + 1))));
    check(rel.every((r) => r < 1e-5 || r > 0.1), 'p2 每个函数都判得清楚');
    check(Math.abs(waveResidual(fs[2], 2, 0.3, 0.1) + 16) < 1e-6, 'p2 C 的 y_tt − 4y_xx 是 −16');
    const p2 = chosen(rel.map((r) => r < 1e-5));

    // p3（ms）
    const mu3 = 0.01 / 2.5;
    const p3 = agree((2.5 / chainSpeed(64, mu3, 2.5)) * 1000, (2.5 / Math.sqrt(64 / mu3)) * 1000, 'p3 脉冲跑完全长的时间', 1e-9);

    // p4
    const y = (x: number, t: number) => 0.02 * Math.sin(5 * x - 100 * t);
    const yt = (t: number) => Math.abs((y(0.4, t + 1e-6) - y(0.4, t - 1e-6)) / 2e-6);
    const vmaxNum = yt(argmax(yt, 0.01, 0.03)); // x = 0.4 处 |y_t| 在 t = 0.02 s 附近的峰
    check(Array.from({ length: 2000 }, (_, i) => yt((i * 2 * Math.PI) / 100 / 2000)).every((s) => s <= vmaxNum * (1 + 1e-9)), 'p4 那个峰是一个周期里的最大值');
    const z0 = bisect((x) => y(x, 0), -0.1, 0.1);
    const z1 = bisect((x) => y(x, 0.001), -0.1, 0.12);
    const vNum = (z1 - z0) / 0.001;
    check(Math.abs(vNum - 20) < 1e-9, 'p4 零点移动的速度是 20 m/s');
    const p4 = agree(vmaxNum / vNum, 0.02 * 5, 'p4 最大横向速率与波速之比', 1e-6);

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
