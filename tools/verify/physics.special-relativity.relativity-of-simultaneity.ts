// 独立验算 physics.special-relativity.relativity-of-simultaneity 的 p1–p4（简单题、中等题）。
// 计算题在站台系里逐点追光：车厢两端、乘客以 v 运动，光以 c 传播，用二分法找光碰到它们的时刻，
// 和讲解里的 ℓ/(2(c ± v)) 一类公式核对。选择题用 _relativity.ts 里只用光信号的雷达坐标判断同时与否。
// 单独运行：npx tsx tools/verify/physics.special-relativity.relativity-of-simultaneity.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, radar } from './physics.special-relativity._relativity.ts';

/** 从 (0, x0) 发出、沿 dir（±1）传播的光，什么时候碰到沿 x = xs + vt 运动的点。 */
function meet(x0: number, dir: 1 | -1, xs: number, v: number, c: number): number {
  const reach = (4 * Math.abs(xs - x0)) / (c - Math.abs(v)) + 1e-30;
  return bisect((t) => dir * (x0 + dir * c * t - (xs + v * t)), 0, reach);
}

export const verification: Verification = {
  lesson: 'physics.special-relativity.relativity-of-simultaneity',
  notes: {
    p1: '站台系里车尾在 x = −120 + vt，光从 x = 0 向后以 c 传播，二分求相遇时刻；和 ℓ/(2(c + v)) 核对。',
    p2: 'A：同一个事件的雷达坐标相同；B、C：S 里同时、沿 x 相隔 1e-9 和 1 光秒的两对事件，在 S′ 里 Δt′ 都不为零（反例）；D：设单程光速 c/(1∓κ)（往返平均仍是 c），按 t_B = (t_A + t′_A)/2 对出的钟偏差 κL/c，只有 κ = 0（来回用时相同）才对；E：S 里同步的两只钟读 0 的两个事件，在 S′ 里不同时，所以 S′ 看它们不同步。',
    p3: '站台系里车厢长取 1，二分求光从车尾追上车头、从车头回到车尾的时刻，两段相除；和 (c + v)/(c − v) 核对。',
    p4: '站台系里乘客在 x = vt，两道光从 ±300 m 出发，二分求各自碰到乘客的时刻再相减；和 300/(c − v) − 300/(c + v) 核对。',
  },
  compute() {
    // p1
    const c = 3e8;
    const v1 = 0.6 * c;
    const tRear = meet(0, -1, -120, v1, c);
    const p1 = agree(tRear * 1e6, (240 / (2 * (c + v1))) * 1e6, 'p1');

    // p2（c = 1，S′ 以 0.6c 运动）
    const v = 0.6;
    const e0 = radar(v, 1, { t: 0, x: 0 });
    const eSame = radar(v, 1, { t: 0, x: 0 });
    const A2 = e0.t === eSame.t;
    const near = radar(v, 1, { t: 0, x: 1e-9 });
    const B2 = Math.abs(near.t - e0.t) < 1e-30;
    check(Math.abs(near.t - e0.t) > 1e-10, 'p2 B：相隔很近也不同时');
    const far = radar(v, 1, { t: 0, x: 1 });
    const C2 = Math.abs(far.t - e0.t) < 1e-12;
    // D：单程光速各向异性的模型里，按对钟规则对出的 B 钟偏差 = 真实到达时刻 − (t_A + t′_A)/2
    const L = 1;
    const offset = (kappa: number): number => {
      const go = (L * (1 - kappa)) / 1;
      const back = (L * (1 + kappa)) / 1;
      return go - (go + back) / 2;
    };
    const D2 = offset(0) === 0 && [0.1, -0.2, 0.3].every((k) => Math.abs(offset(k)) > 1e-3);
    // E：S 里 x = 0、x = 1 两只同步的钟都读 0 的两个事件
    const E2 = Math.abs(radar(v, 1, { t: 0, x: 1 }).t - radar(v, 1, { t: 0, x: 0 }).t) < 1e-12;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3（c = 1）
    const v3 = 0.5;
    const ell = 1;
    const tFront = meet(-ell / 2, 1, ell / 2, v3, 1);
    // 回程：从车头在 tFront 的位置出发向后，碰到车尾 x = −ℓ/2 + v t
    const xFront = ell / 2 + v3 * tFront;
    const back = bisect((t) => -(xFront - (t - tFront) - (-ell / 2 + v3 * t)), tFront, tFront + 10);
    const p3 = agree(tFront / (back - tFront), (1 + v3) / (1 - v3), 'p3');

    // p4
    const v4 = 0.6 * c;
    const fromB = meet(300, -1, 0, v4, c);
    const fromA = meet(-300, 1, 0, v4, c);
    const p4 = agree((fromA - fromB) * 1e6, (300 / (c - v4) - 300 / (c + v4)) * 1e6, 'p4');

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
