// 独立验算 physics.oscillations-waves.pendulums 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 T0 = 2π√(l/g)、复摆 T = 2π√(I/(mgd))、T ≈ T0(1 + θ0²/16)；二是直接积分 θ″ = −(g/l) sin θ
// 量周期（pendulumPeriodODE），复摆的转动惯量和质心距离用数值积分求，大振幅的精确周期用算术-几何平均。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.pendulums.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, integrate, pendulumPeriod, pendulumPeriodODE } from './physics.oscillations-waves._ow.ts';

const deg = Math.PI / 180;

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.pendulums',
  notes: {
    p1: 'l = gT²/(4π²)；和二分摆长、使积分 θ″ = −(g/l) sin θ（振幅 10⁻⁶ rad）量出的周期是 2.00 s 核对。',
    p2: '用精确周期（算术-几何平均）逐条比：A 运动方程 mlθ″ = −mg sin θ 里质量消掉，周期不变（错）；B l 由 1.0 m 加到 1.1 m，周期变长（对）；C g 变为 1/6，周期变为 √6 倍（对）；D 匀速上升的电梯里等效的 g 不变，周期不变（错）；E 振幅 5° 到 60°，周期由 1.0005T0 变为 1.0732T0（对）。',
    p3: '数值积分求 I = ∫λx²dx、d = ∫λx dx/m，等效摆长 I/(md) = 2L/3，积分小振幅的运动量周期；和 2π√(2L/(3g)) 核对。',
    p4: '题目指定按 T0θ0²/16 估计；T0 用式子和积分（振幅 10⁻⁶ rad）两种算法核对。另核对估计式就是精确周期级数的前两项：精确值（算术-几何平均、直接积分 20° 的运动两种算法）比估计长 T0 × 11θ0⁴/3072（差 1% 以内，是下一项 173θ0⁶/737280 的量级）。',
  },
  compute() {
    const g = 9.8;

    // p1（m）
    const lNum = bisect((l) => pendulumPeriodODE(1e-6, l, g) - 2.0, 0.5, 1.5);
    const p1 = agree(lNum, (g * 2.0 * 2.0) / (4 * Math.PI * Math.PI), 'p1 摆长', 1e-10);

    // p2
    const th = 5 * deg;
    const base = pendulumPeriod(th, 1.0, g);
    const withMass = (m: number) => pendulumPeriodODE(th, (m * 1.0) / m, (m * g) / m); // 惯性和重力里的 m 相消
    const optA = Math.abs(withMass(2) - withMass(1)) > 1e-12;
    const optB = pendulumPeriod(th, 1.1, g) > base;
    const optC = pendulumPeriod(th, 1.0, g / 6) > base;
    check(Math.abs(pendulumPeriod(th, 1.0, g / 6) / base - Math.sqrt(6)) < 1e-12, 'p2 C 周期变为 √6 倍');
    const aElevator = 0; // 匀速：没有加速度
    const optD = pendulumPeriod(th, 1.0, g + aElevator) !== base;
    const optE = pendulumPeriod(60 * deg, 1.0, g) > base;
    check(Math.abs(pendulumPeriodODE(60 * deg, 1.0, g) / pendulumPeriod(60 * deg, 1.0, g) - 1) < 1e-10, 'p2 E 精确周期两种算法一致');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（s）
    const L = 1.0;
    const lambda = 1.0; // 线密度，取 1 kg/m
    const mRod = integrate(() => lambda, 0, L);
    const I = integrate((x) => lambda * x * x, 0, L);
    const d = integrate((x) => lambda * x, 0, L) / mRod;
    const p3 = agree(pendulumPeriodODE(1e-6, I / (mRod * d), g), 2 * Math.PI * Math.sqrt((2 * L) / (3 * g)), 'p3 细杆的周期', 1e-9);

    // p4（ms）
    const l4 = 2.0;
    const th0 = 20 * deg;
    const T0 = agree(pendulumPeriodODE(1e-6, l4, g), 2 * Math.PI * Math.sqrt(l4 / g), 'p4 T0', 1e-10);
    const est = (T0 * th0 * th0) / 16;
    const exact = agree(pendulumPeriodODE(th0, l4, g), pendulumPeriod(th0, l4, g), 'p4 20° 的精确周期', 1e-10);
    const next = (T0 * 11 * th0 ** 4) / 3072;
    check(Math.abs(exact - T0 - est - next) < 0.01 * next, 'p4 估计式是精确周期级数的前两项');
    const p4 = est * 1000;

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
