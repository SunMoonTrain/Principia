// 独立验算 physics.newtonian-mechanics.momentum-impulse 的 p1–p4（简单题、中等题）。
// 两套算法：一是动量定理 J = Δp；二是不用动量定理：给出随时间变化的力，把 dv/dt = F/m 交给四阶龙格-库塔法积分，
// 冲量另用高斯-勒让德求积算 ∫F dt。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.momentum-impulse.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, integrate, rk4 } from './physics.newtonian-mechanics._nm.ts';

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.momentum-impulse',
  notes: {
    p1: 'J = m(v′ − v) = 0.15 × (40 + 30)；和积分核对：球棒的力取 A sin²(πt/T)、T = 1 ms，积分 dv/dt = F/m，二分出让球从 −30 m/s 变成 40 m/s 的 A，再对 F 求积得冲量。',
    p2: '逐条用例子：A m = 2 kg 时动量从 2 变 4，速度从 1 变 2（对）；B 匀速圆周运动 F = −mω²r，一周的冲量两个分量数值积分都是 0（对）；C 以 2 m/s 撞墙原速弹回，冲量 −8 N·s 不为零（错）；D 静止物体受 1 N·s 冲量，动量 1，比原来以 10 kg·m/s 运动、受 0.5 N·s 冲量的物体小（错）；E p = 1、冲量 −3 时末动量 −2，速率变大（错）。',
    p3: 'v′ = (2F₀T/π − mv)/m；和积分核对：取击回的方向为正，dv/dt = F₀ sin(πt/T)/m 从 v = −15 积到 t = T。',
    p4: 'F = (Δm/Δt)·v = 12 × 25；和流量核对：水流截面积 A 取 12/(ρv)、ρ = 1000 kg/m³，单位时间到达墙的动量 ρAv·v。',
  },
  compute() {
    // p1（N·s）
    const m1 = 0.15;
    const T1 = 1e-3;
    const pulse = (A: number) => (t: number) => A * Math.sin((Math.PI * t) / T1) ** 2;
    const vEnd = (A: number) => rk4((t) => [pulse(A)(t) / m1], [-30], 0, T1, 2000)[0];
    const A = bisect((a) => vEnd(a) - 40, 0, 1e5);
    const J1 = integrate(pulse(A), 0, T1);
    const p1 = agree(J1, m1 * (40 - -30), 'p1 冲量', 1e-9);

    // p2
    const optA = 4 / 2 !== 2 / 2; // 质量 2 kg：动量 2 → 4，速度 1 → 2
    const w = 2;
    const r = 1.5;
    const mm = 1;
    const Jx = integrate((t) => -mm * w * w * r * Math.cos(w * t), 0, (2 * Math.PI) / w);
    const Jy = integrate((t) => -mm * w * w * r * Math.sin(w * t), 0, (2 * Math.PI) / w);
    const optB = Math.abs(Jx) < 1e-10 && Math.abs(Jy) < 1e-10;
    const optC = Math.abs(2 * (-2) - 2 * 2) < 1e-12; // 原速弹回：冲量 −8，不为零
    const optD = 0 + 1 > 10 - 0.5; // 冲量大的那个，动量反而小
    const optE = Math.abs(1 + -3) < Math.abs(1); // 末速率 2 > 1
    check(!optC && !optD && !optE, 'C、D、E 的反例成立');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m/s）
    const F0 = 900;
    const T = 4e-3;
    const m = 0.058;
    const formula3 = ((2 * F0 * T) / Math.PI - m * 15) / m;
    const v3 = rk4((t) => [(F0 * Math.sin((Math.PI * t) / T)) / m], [-15], 0, T, 4000)[0];
    const p3 = agree(v3, formula3, 'p3 击回的速率', 1e-9);

    // p4（N）
    const rho = 1000;
    const area = 12 / (rho * 25);
    const p4 = agree(rho * area * 25 * 25, 12 * 25, 'p4 平均作用力', 1e-12);

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
