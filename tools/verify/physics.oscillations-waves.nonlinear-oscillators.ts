// 独立验算 physics.oscillations-waves.nonlinear-oscillators 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的近似式 ω ≈ ω0 + 3εA²/(8ω0)、周期和 A^{1−n/2} 成正比；二是不用这些式子，由势能直接求精确周期
// T = 4∫_0^A dx/√(2(U(A) − U(x))/m)（换元后高斯积分，periodFromPotential），或者用 RK4 积分运动方程量周期。
// 第 1 题题目指定用近似式：另用精确周期在很小的振幅上数值求 dω/d(A²)，核对近似式的系数，并核对它和精确值只差高阶小量。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.nonlinear-oscillators.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, pendulumPeriod, periodFromPotential, periodOf } from './physics.oscillations-waves._ow.ts';

const duffingU = (w0: number, eps: number) => (x: number) => 0.5 * w0 * w0 * x * x + 0.25 * eps * x ** 4;
const omegaExact = (w0: number, eps: number, A: number) => (2 * Math.PI) / periodFromPotential(duffingU(w0, eps), A);

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.nonlinear-oscillators',
  notes: {
    p1: '题目指定用近似式：3εA²/(8ω0²) = 0.75%。另用精确周期在 A = 0.002、0.004 上数值求 (ω − ω0)/A²，外推到 A → 0 得系数 3ε/(8ω0)，核对近似式；A = 0.20 时精确值约 0.747%，只差 ε² 的高阶项。',
    p2: '用精确周期（势能积分）逐条：A ω0 = 1、ε = 1 时振幅 0.5→1 周期由 5.97 变 5.08，频率变高（错）；B 单摆 30°→60° 周期变长（对）；C 线性振子 RK4 量周期，初位移 1 和 2 一样（错）；D U = x⁴ 时 T(2)/T(1) = 0.5（对）；E A = 10⁻⁴ 时 2π/T 和 ω0 只差 10⁻⁸ 量级（对）。',
    p3: 'T ∝ A^{−1/2}，T = 2.0 × 4^{−1/2}；和取 c = 1、m = 1 用势能积分算 T(0.04)/T(0.01) 再乘 2.0 核对。',
    p4: '恒力 F0 下由静止走 A 用时 √(2Am/F0)，周期是 4 倍；和势能积分、RK4 积分（力 −F0 sgn x）三种算法核对。',
  },
  compute() {
    // p1（%）
    const w0 = 10;
    const eps = 50;
    const A = 0.2;
    const approx = ((3 * eps * A * A) / (8 * w0 * w0)) * 100;
    const coef = (a: number) => (omegaExact(w0, eps, a) - w0) / (a * a);
    const cs = [0.01, 0.02, 0.04].map(coef); // (ω − ω0)/A² 的误差是 A² 的幂级数：两次理查森外推
    const r1 = [(4 * cs[0] - cs[1]) / 3, (4 * cs[1] - cs[2]) / 3];
    const coef0 = (16 * r1[0] - r1[1]) / 15;
    const p1 = agree((coef0 * A * A * 100) / w0, approx, 'p1 近似式的百分数', 1e-6);
    const exact = (omegaExact(w0, eps, A) / w0 - 1) * 100;
    check(Math.abs(exact - approx) < 0.01 && exact < approx, 'p1 精确值约 0.747%，比近似式略小');

    // p2
    const Ta = periodFromPotential(duffingU(1, 1), 0.5);
    const Tb = periodFromPotential(duffingU(1, 1), 1);
    const optA = Tb > Ta; // 说法：振幅越大频率越低 ⇔ 周期越长
    const optB = pendulumPeriod(Math.PI / 3, 1, 9.8) > pendulumPeriod(Math.PI / 6, 1, 9.8);
    const lin = (_t: number, s: number[]) => [s[1], -4 * s[0]];
    const optC = Math.abs(periodOf(lin, [2, 0], 0, 1e-3, 5) - 2 * periodOf(lin, [1, 0], 0, 1e-3, 5)) < 1e-9;
    const quartic = (x: number) => x ** 4;
    const optD = Math.abs(periodFromPotential(quartic, 2) / periodFromPotential(quartic, 1) - 0.5) < 1e-10;
    const optE = Math.abs((2 * Math.PI) / periodFromPotential(duffingU(3, 2), 1e-4) - 3) < 1e-6;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（s）
    const cubic = (x: number) => Math.abs(x) ** 3;
    const p3 = agree((2.0 * periodFromPotential(cubic, 0.04)) / periodFromPotential(cubic, 0.01), 2.0 * 4 ** -0.5, 'p3 振幅 4 cm 的周期', 1e-10);

    // p4（s）
    const m = 0.1;
    const F0 = 0.5;
    const A4 = 0.2;
    const Tint = periodFromPotential((x) => F0 * Math.abs(x), A4, m);
    const Tode = periodOf((_t, s) => [s[1], (-F0 * Math.sign(s[0])) / m], [A4, 0], 0, 1e-6, 4);
    check(Math.abs(Tode - Tint) < 1e-5 * Tint, 'p4 RK4 和势能积分一致');
    const p4 = agree(Tint, 4 * Math.sqrt((2 * A4 * m) / F0), 'p4 周期', 1e-10);

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
