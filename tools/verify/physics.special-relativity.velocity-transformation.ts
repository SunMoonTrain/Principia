// 独立验算 physics.special-relativity.velocity-transformation 的 p1–p4（简单题、中等题）。
// 速度在另一个惯性系里的值用两种算法：一是速度变换的公式；二是 _relativity.ts 的 radarVelocity：
// 取质点世界线上的两个事件，用雷达法（只用光信号和爱因斯坦对钟）换成另一个惯性系的坐标再相除。
// 已知的是相对运动参考系的速度时，按相对性原理把那个参考系当成「静止」、另一个以 −v 运动来算。
// 单独运行：npx tsx tools/verify/physics.special-relativity.velocity-transformation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, composeVelocity, radarVelocity, transformVelocity } from './physics.special-relativity._relativity.ts';

export const verification: Verification = {
  lesson: 'physics.special-relativity.velocity-transformation',
  notes: {
    p1: '在火箭系里探测器以 0.45c 运动、地球以 −0.75c 运动，雷达法换到地球系；和 (u′ + v)/(1 + u′v/c²) 核对。',
    p2: 'A：飞船系里光以 −c 运动，地面以 −0.9c 运动，雷达法换到地面系，速率 1；B：0.7c、0.7c 合成为 1.4/1.49 c ≈ 0.94c，不是 1.4c；C：u_x = 10⁻⁴c、v = 2×10⁻⁴c 时，精确值和 u_x − v 相对相差约 2×10⁻⁸；D：静止的粒子，雷达法得 −v；E：两个速度在 (−0.99, 0.99) 上每隔 0.01 合成，结果都小于 c。',
    p3: '在 S′ 里粒子以 (0, 0.5c) 运动、S 以 −0.6c 运动，雷达法换到 S，求速率；和公式 u_x = v、u_y = u′_y/γ 核对。',
    p4: '在 A 的参考系（地面以 −0.55c 运动）里看 B：地面系里 B 以 −0.85c 运动，雷达法换到 A 系求速率；和 |(u − v)/(1 − uv/c²)| 核对。',
  },
  compute() {
    // p1（c = 1）
    const p1 = agree(radarVelocity(-0.75, 1, 0.45)[0], composeVelocity(0.45, 0.75), 'p1');

    // p2
    const A2 = Math.abs(Math.abs(radarVelocity(-0.9, 1, -1)[0]) - 1) < 1e-9;
    const B2 = Math.abs(composeVelocity(0.7, 0.7) - 1.4) < 1e-9;
    const exactC = transformVelocity(1e-4, 0, 2e-4)[0];
    const C2 = Math.abs(exactC - (1e-4 - 2e-4)) < 1e-6 * Math.abs(exactC);
    agree(radarVelocity(0.4, 1, 0)[0], -0.4, 'p2 D', 1e-9);
    const D2 = true;
    const grid = Array.from({ length: 199 }, (_, i) => -0.99 + 0.01 * i);
    const E2 = !grid.every((u) => grid.every((v) => Math.abs(composeVelocity(u, v)) < 1));
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const [ux3, uy3] = radarVelocity(-0.6, 1, 0, 0.5);
    const [fx3, fy3] = transformVelocity(0, 0.5, -0.6);
    const p3 = agree(Math.hypot(ux3, uy3), Math.hypot(fx3, fy3), 'p3');

    // p4
    const p4 = agree(Math.abs(radarVelocity(0.55, 1, -0.85)[0]), Math.abs(transformVelocity(-0.85, 0, 0.55)[0]), 'p4');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
