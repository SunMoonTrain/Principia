// 独立验算 physics.newtonian-mechanics.collisions 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的末速度公式和动能损失公式；二是不用这些式子：两个物体之间夹一根很硬的弹簧，
// 把碰撞过程交给四阶龙格-库塔法积分（_nm.ts 的 collide1D）：弹性碰撞积到分开，完全非弹性碰撞在相对速度为零时锁住。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.collisions.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, collide1D } from './physics.newtonian-mechanics._nm.ts';

const K = (m: number, v: number) => 0.5 * m * v * v;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.collisions',
  notes: {
    p1: 'ΔK = m₁m₂(v₁ − v₂)²/[2(m₁ + m₂)] = 2 × 1 × 9/6；和模拟核对：弹簧碰撞在压缩最多（两车速度相等）时锁住，ΔK = 碰前动能 − 锁住时的动能。',
    p2: '逐条用例子：A 2 kg 以 3 m/s 撞静止的 1 kg 并锁住，模拟前后总动量都是 6（错）；B 同一例子锁住时的速度 2 m/s 等于质心速度 6/3（对）；C m₁ = 1 撞静止的 m₂ = 1.5、5，模拟里碰后 v₁′ 都为负（对）；D 1000 kg × 10 m/s 和 2000 kg × 5 m/s 迎面锁住，模拟的共同速度为 0（对）；E 同 A 的例子，锁住后两车都向前（错）。',
    p3: 'v₂′ = [(m₂ − m₁)v₂ + 2m₁v₁]/(m₁ + m₂)，v₁ = 4、v₂ = −1；和弹簧碰撞的模拟核对。',
    p4: '氦核得到的动能比例 4m₁m₂/(m₁ + m₂)² = 16/25；和弹簧碰撞的模拟核对（m₁ = 1、m₂ = 4）。',
  },
  compute() {
    // p1（J）
    const [a1, b1] = collide1D(2, 1, 3, 0, true);
    check(Math.abs(a1 - b1) < 1e-6, 'p1 锁住时两车速度相等');
    const lossSim = K(2, 3) - K(3, (a1 + b1) / 2);
    const p1 = agree(lossSim, (2 * 1 * 9) / (2 * 3), 'p1 动能损失', 1e-6);

    // p2
    const optA = Math.abs(2 * a1 + 1 * b1 - 6) > 1e-6;
    const optB = Math.abs(a1 - 6 / 3) < 1e-6;
    const optC = collide1D(1, 1.5, 2, 0)[0] < 0 && collide1D(1, 5, 2, 0)[0] < 0;
    const [d1, d2] = collide1D(1000, 2000, 10, -5, true);
    const optD = Math.abs(d1) < 1e-6 && Math.abs(d2) < 1e-6;
    const optE = !(a1 > 0 && b1 > 0);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m/s）
    const [, v2] = collide1D(2, 3, 4, -1);
    const formula3 = ((3 - 2) * -1 + 2 * 2 * 4) / (2 + 3);
    const p3 = agree(v2, formula3, 'p3 3 kg 小球的末速度', 1e-6);

    // p4（%）
    const [, vHe] = collide1D(1, 4, 1, 0);
    const formula4 = (100 * 4 * 1 * 4) / (1 + 4) ** 2;
    const p4 = agree((100 * K(4, vHe)) / K(1, 1), formula4, 'p4 交给氦核的比例', 1e-6);

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
