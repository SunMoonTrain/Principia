// 独立验算 physics.newtonian-mechanics.center-of-mass-frame 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（K′ = m₁m₂|v₁ − v₂|²/[2(m₁ + m₂)]、v′ = 2v_C − v、等质量斜碰后两者垂直）；
// 二是不用这些式子：p1 先求质心速度、再把各自相对质心的动能加起来；p3 用一维弹簧碰撞的模拟；
// p4 用两个光滑圆盘的二维模拟（_nm.ts 的 disks2D），二分出让撞上去的球碰后速率是 3.0 m/s 的瞄准距离，读出被撞的球的速率。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.center-of-mass-frame.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, bisect, check, chosen, collide1D, disks2D } from './physics.newtonian-mechanics._nm.ts';

const K = (m: number, v: number) => 0.5 * m * v * v;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.center-of-mass-frame',
  notes: {
    p1: 'K′ = m₁m₂|v₁ − v₂|²/[2(m₁ + m₂)] = 2 × 1 × 36/6；和直接算核对：v_C = (2 × 3 − 1 × 3)/3 = 1 m/s，K′ = ½ × 2 × 2² + ½ × 1 × 4²。',
    p2: '逐条用例子（2 kg 以 3 m/s、1 kg 以 −3 m/s）：A 在以 w 运动的参考系里动能 K(w)，w 从 −10 扫到 10，最小值在 w = v_C 处（对）；B 质心系里速度 2、−4，大小之比 1 : 2 = m₂ : m₁（对）；C 质心系里总动能 12 J ≠ 0（错）；D 锁住后的动能损失，原参考系和质心系里都是 12 J（错）；E 质心系的速度就是 v_C = P/M = 1 m/s，扫描找到的最小点也在这里（对）。',
    p3: 'v₁′ = 2v_C − v₁ = 2 × 3 − 5；和一维弹簧碰撞的模拟核对。',
    p4: 'v₂′ = √(v₁² − v₁′²) = √(25 − 9)；和圆盘模拟核对：二分出瞄准距离 b，使撞上去的圆盘碰后速率为 3.0，读出被撞圆盘的速率，并核对两者的速度垂直。',
  },
  compute() {
    // p1（J）
    const m1 = 2;
    const m2 = 1;
    const v1 = 3;
    const v2 = -3;
    const vC = (m1 * v1 + m2 * v2) / (m1 + m2);
    const direct = K(m1, v1 - vC) + K(m2, v2 - vC);
    const p1 = agree(direct, (m1 * m2 * (v1 - v2) ** 2) / (2 * (m1 + m2)), 'p1 质心系里的动能', 1e-12);

    // p2
    const Kw = (w: number) => K(m1, v1 - w) + K(m2, v2 - w);
    const wMin = argmax((w) => -Kw(w), -10, 10);
    const optA = Math.abs(wMin - vC) < 1e-6 && Kw(5) > Kw(vC) && Kw(-5) > Kw(vC);
    const optB = Math.abs(Math.abs(v1 - vC) / Math.abs(v2 - vC) - m2 / m1) < 1e-12;
    const optC = direct === 0;
    const [l1] = collide1D(m1, m2, v1, v2, true);
    const lossLab = K(m1, v1) + K(m2, v2) - K(m1 + m2, l1);
    const lossCM = K(m1, v1 - vC) + K(m2, v2 - vC) - K(m1 + m2, l1 - vC);
    const optD = lossLab > lossCM + 1e-6;
    const optE = Math.abs(wMin - (m1 * v1 + m2 * v2) / (m1 + m2)) < 1e-6;
    check(Math.abs(lossLab - lossCM) < 1e-6, 'D 两个参考系里的损失相同');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m/s）
    const [u1] = collide1D(3, 2, 5, 0);
    const vC3 = (3 * 5) / 5;
    const p3 = agree(u1, 2 * vC3 - 5, 'p3 3 kg 小球的末速度', 1e-6);

    // p4（m/s）
    const speed1 = (b: number) => Math.hypot(...(disks2D(5, b).slice(0, 2) as [number, number]));
    const b = bisect((x) => speed1(x) - 3, 0.05, 1.95);
    const out = disks2D(5, b);
    check(Math.abs(out[0] * out[2] + out[1] * out[3]) < 1e-4, 'p4 碰后两个速度垂直');
    const p4 = agree(Math.hypot(out[2], out[3]), Math.sqrt(25 - 9), 'p4 被撞的球的速率', 1e-5);

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
