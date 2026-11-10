// 独立验算 physics.special-relativity.postulates 的 p1–p4（简单题、中等题）。
// 这一节的计算都按伽利略变换或以太理论做：公式一遍；再在 S 里逐点算出光和仪器的位置，
// 用二分法找光碰到镜子的时刻（以太系里光速是 c、速度按伽利略变换合成），不写展开式。
// 单独运行：npx tsx tools/verify/physics.special-relativity.postulates.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, composeVelocity } from './physics.special-relativity._relativity.ts';

/** 伽利略变换下，S 里的世界线 x(t)、y(t) 在 S′ 里的速度（S′ 以 v 沿 x 轴运动）：取两个时刻的位置相减。 */
function galileanVelocity(path: (t: number) => [number, number], v: number): [number, number] {
  const t1 = 0.3;
  const t2 = 1.7;
  const [x1, y1] = path(t1);
  const [x2, y2] = path(t2);
  const xp1 = x1 - v * t1;
  const xp2 = x2 - v * t2;
  return [(xp2 - xp1) / (t2 - t1), (y2 - y1) / (t2 - t1)];
}

/**
 * 以太理论：仪器以 v 沿 x 轴运动，分束镜从 (0, 0) 出发，一条长 L 的臂上的光往返一次所需的时间。
 * along = true 时臂沿运动方向，否则垂直于运动方向。光在以太系里以 c 走直线，用二分法找碰到镜子的时刻。
 */
function roundTrip(L: number, v: number, c: number, along: boolean): number {
  const reach = (4 * L) / (c - v);
  if (along) {
    const t1 = bisect((t) => c * t - (L + v * t), 0, reach);
    return bisect((t) => c * (t - t1) - (L + v * t1 - v * t), t1, t1 + reach);
  }
  const t1 = bisect((t) => c * t - Math.hypot(v * t, L), 0, reach);
  return bisect((t) => c * (t - t1) - Math.hypot(v * (t - t1), L), t1, t1 + reach);
}

/** 两臂长 L1、L2，开始臂 1 沿运动方向，转 90° 后臂 2 沿运动方向：条纹移动 = 时间差的改变 × 频率 c/λ。 */
function fringeShift(L1: number, L2: number, lambda: number, v: number, c: number): number {
  const before = roundTrip(L1, v, c, true) - roundTrip(L2, v, c, false);
  const after = roundTrip(L1, v, c, false) - roundTrip(L2, v, c, true);
  return ((before - after) * c) / lambda;
}

export const verification: Verification = {
  lesson: 'physics.special-relativity.postulates',
  notes: {
    p1: '光沿 -x 以 c 传播、飞船沿 +x 以 0.6c 运动；逐点算光的位置，按伽利略变换 x′ = x − vt 换到飞船系再求速率，和 |−c − v| 核对。',
    p2: 'A 是光速不变原理本身；B、E 是相对性原理；C 用速度合成算出 c 而不是 1.5c；D 对一组光源速度（-0.9c 到 0.9c）合成光速，都是 c。',
    p3: '以太系里用二分法算两臂往返时间（不展开），条纹移动除以 β² 后在 β = 0.001、0.002 两处外推到 β → 0，得最低阶系数，再乘题设的 β²；和 (L1 + L2)v²/(λc²) 核对。',
    p4: '光在 S 里沿 60° 方向，逐点按伽利略变换换到 S′ 求速率，和 √((c/2 − v)² + 3c²/4) 核对。',
  },
  compute() {
    const c = 1;

    // p1
    const v1 = 0.6;
    const [vx1, vy1] = galileanVelocity((t) => [5 - c * t, 0], v1);
    const p1 = agree(Math.hypot(vx1, vy1), Math.abs(-c - v1), 'p1');

    // p2
    const A2 = true;
    const B2 = true;
    const C2 = Math.abs(composeVelocity(1, 0.5) - 1.5) < 1e-9;
    check(Math.abs(composeVelocity(1, 0.5) - 1) < 1e-12, 'p2 C：向前发出的光相对地面仍是 c');
    const sourceSpeeds = Array.from({ length: 19 }, (_, i) => -0.9 + 0.1 * i);
    const D2 = !sourceSpeeds.every((vs) => Math.abs(composeVelocity(1, vs) - 1) < 1e-12);
    const E2 = true;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3（SI 单位）
    const cSI = 3e8;
    const lambda = 5.0e-7;
    const L1 = 10;
    const L2 = 15;
    const coeff = (beta: number): number => fringeShift(L1, L2, lambda, beta * cSI, cSI) / (beta * beta);
    const k1 = coeff(0.001);
    const k2 = coeff(0.002);
    const lowest = (4 * k1 - k2) / 3;
    const beta3 = 3e4 / cSI;
    const p3 = agree(lowest * beta3 * beta3, ((L1 + L2) * beta3 * beta3) / lambda, 'p3', 1e-7);

    // p4
    const v4 = 0.5;
    const ang = Math.PI / 3;
    const [vx4, vy4] = galileanVelocity((t) => [c * Math.cos(ang) * t, c * Math.sin(ang) * t], v4);
    const p4 = agree(Math.hypot(vx4, vy4), Math.hypot(c / 2 - v4, (Math.sqrt(3) / 2) * c), 'p4');

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
