// 独立验算 physics.special-relativity.length-contraction 的 p1–p4（简单题、中等题）。
// S′ 里静止的杆在 S 里多长，不用 L/γ：用 _relativity.ts 的 restPoint，按雷达法（只用光信号和爱因斯坦对钟）
// 找出杆另一端在 S 的同一时刻 t = 0 的位置，再和 L/γ 核对。
// 单独运行：npx tsx tools/verify/physics.special-relativity.length-contraction.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, clockRate, gamma, restPoint } from './physics.special-relativity._relativity.ts';

export const verification: Verification = {
  lesson: 'physics.special-relativity.length-contraction',
  notes: {
    p1: '杆在 S′ 里从 0 到 5，雷达法求另一端在 S 的 t = 0 时刻的位置；和 5/γ 核对。',
    p2: 'A：长 1 的杆取 0° 到 90° 的 10 个方向、0.1c 到 0.95c 的 5 个速度，雷达法量出的长度都不超过 1；B：两端不同时记（相差 δ）量出的长度随 δ 变，所以必须同时记；C：跑道在地面静止，从飞船看地面以 −0.8c 运动，量得 60 m；D：飞船在自己的参考系里静止，长度就是固有长度，不变；E：飞船量地面上的尺子也是缩短（C 的算法），不是变长。',
    p3: '对 v 二分：飞船的钟（光钟）测得的时间 = (90 m / v) × 读数比 = 0.4 μs；和 βγ = 90/(c·0.4 μs) 解出的 β 核对。',
    p4: '杆在 S′ 里从原点到 (cos 60°, sin 60°)，雷达法求另一端在 S 的 t = 0 时刻的位置（y 不变），求长度；和 √((0.5/γ)² + 0.75) 核对。',
  },
  compute() {
    // p1（c = 1）
    const p1 = agree(restPoint(0.6, 1, 5).x, 5 / gamma(0.6), 'p1');

    // p2
    const angles = Array.from({ length: 10 }, (_, i) => (i * Math.PI) / 18);
    const speeds = [0.1, 0.3, 0.6, 0.8, 0.95];
    const A2 = speeds.every((v) =>
      angles.every((a) => {
        const end = restPoint(v, 1, Math.cos(a), Math.sin(a));
        return Math.hypot(end.x, end.y) <= 1 + 1e-12;
      }),
    );
    // B：S′ 里静止的杆（S 里两端以 v 运动），前端在 t = 0 记、后端在 t = δ 记
    const v2 = 0.6;
    const front = restPoint(v2, 1, 1).x;
    const marked = (delta: number): number => front - v2 * delta;
    const B2 = Math.abs(marked(0.3) - marked(0)) > 1e-3 && Math.abs(marked(-0.3) - marked(0)) > 1e-3;
    const C2 = Math.abs(restPoint(-0.8, 1, 100).x - 60) < 1e-9;
    const D2 = false;
    const E2 = restPoint(-0.8, 1, 100).x > 100;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const c = 3e8;
    const shipTime = (v: number): number => (90 / v) * clockRate(v / c, 1);
    const v3 = bisect((v) => shipTime(v) - 0.4e-6, 0.01 * c, 0.999 * c);
    const bg = 90 / (c * 0.4e-6);
    const p3 = agree(v3 / c, bg / Math.sqrt(1 + bg * bg), 'p3');

    // p4
    const end4 = restPoint(0.8, 1, Math.cos(Math.PI / 3), Math.sin(Math.PI / 3));
    check(end4.y === Math.sin(Math.PI / 3), 'p4 横向坐标不变');
    const p4 = agree(Math.hypot(end4.x, end4.y), Math.hypot(0.5 / gamma(0.8), Math.sqrt(3) / 2), 'p4');

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
