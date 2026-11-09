// 独立验算 physics.analytical-mechanics.energy-function 的 p1–p4（简单题、中等题）。
// 拉格朗日量由各质点在惯性系里的直角坐标数值地算出，能量函数 h = Σ q̇ ∂L/∂q̇ − L 用数值求导；
// 「守不守恒」直接积分一段运动看 h 变没变；需要运动过程的按达朗贝尔原理数值解、RK4 积分，再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.energy-function.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import {
  agree,
  along,
  chosen,
  derivative,
  integrateTo,
  integrateUntil,
  kinetic,
  lagrangian,
  systemDerivative,
  type System,
  type Vec,
} from './physics.analytical-mechanics._mech.ts';

const g = 9.8;

/** 能量函数 h = Σ q̇_j ∂L/∂q̇_j − L，L 由质点的直角坐标数值地算出。 */
function energyFunction(sys: System, q: Vec, qd: Vec, t: number): number {
  // Σ q̇_j ∂L/∂q̇_j 就是 L(q, (1+s) q̇) 在 s = 0 处对 s 的导数
  return derivative((s) => lagrangian(sys, q, along(qd, qd, s), t), 0) - lagrangian(sys, q, qd, t);
}

/** 积分一段运动，h 的相对变化。 */
function drift(sys: System, q: Vec, qd: Vec): number {
  const n = q.length;
  const end = integrateTo(systemDerivative(sys), [...q, ...qd], 0, 2, 1e-3);
  const h0 = energyFunction(sys, q, qd, 0);
  const h1 = energyFunction(sys, Array.from(end.subarray(0, n)), Array.from(end.subarray(n)), 2);
  return Math.abs(h1 - h0) / Math.max(1, Math.abs(h0));
}

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.energy-function',
  notes: {
    p1: '直接对题中的 L 数值求 ṡ ∂L/∂ṡ − L；再由珠子的直角坐标 (s cos ωt, s sin ωt) 算出 L 求一遍。',
    p2: '四个系统都由质点的直角坐标写出 L，积分 2 秒，看 h 的变化：固定抛物线和匀速转动的斜铁丝不变，摆长变化的单摆和 V(x, t) 的振子在变。',
    p3: '取 R = 1、ω² = 2g，珠子 (sinθ cos ωt, sinθ sin ωt, −cosθ)，从 θ = 10⁻⁴ 静止出发积分，定位 θ̇ 由正变负的时刻，读出最大的 θ。',
    p4: '珠子 (s cos ωt, s sin ωt)，从 s = 0.1 m 相对静止出发积分到 s = 1 m；铁丝做的功等于惯性系里动能的增加。',
  },
  compute() {
    // p1：m = 1、ω = 1、s = 2、ṡ = 3
    const L1 = (s: number, sd: number): number => 0.5 * (sd * sd + s * s);
    const hGiven = derivative((u) => L1(2, 3 * (1 + u)), 0) - L1(2, 3);
    const rod: System = { masses: [1], positions: ([s], t) => [[s * Math.cos(t), s * Math.sin(t)]] };
    const p1 = agree(agree(hGiven, energyFunction(rod, [2], [3], 0.7), 'p1 两种算法'), 0.5 * 9 - 0.5 * 4, 'p1 h');

    // p2：哪些系统的 h 守恒
    const parabola: System = { masses: [1], positions: ([x]) => [[x, 0.8 * x * x]], potential: ([x]) => g * 0.8 * x * x };
    const beta = 0.5;
    const cone: System = {
      masses: [1],
      positions: ([s], t) => [[s * Math.sin(beta) * Math.cos(1.5 * t), s * Math.sin(beta) * Math.sin(1.5 * t), s * Math.cos(beta)]],
      potential: ([s]) => g * s * Math.cos(beta),
    };
    const growing: System = {
      masses: [1],
      positions: ([th], t) => [[(1 + 0.3 * t) * Math.sin(th), -(1 + 0.3 * t) * Math.cos(th)]],
      potential: ([th], t) => -g * (1 + 0.3 * t) * Math.cos(th),
    };
    const pumped: System = {
      masses: [1],
      positions: ([x]) => [[x]],
      potential: ([x], t) => 0.5 * 4 * x * x * Math.cos(1.7 * t) ** 2,
    };
    const p2 = chosen([
      drift(parabola, [0.5], [0.3]) < 1e-8,
      drift(cone, [1.2], [0.4]) < 1e-8,
      drift(growing, [0.6], [0]) < 1e-8,
      drift(pumped, [1], [0]) < 1e-8,
    ]);

    // p3：转动圆环，ω² = 2g/R，从最低点附近静止出发
    const omega = Math.sqrt(2 * g);
    const hoop: System = {
      masses: [1],
      positions: ([th], t) => [[Math.sin(th) * Math.cos(omega * t), Math.sin(th) * Math.sin(omega * t), -Math.cos(th)]],
      potential: ([th]) => -g * Math.cos(th),
    };
    const top = integrateUntil(systemDerivative(hoop), [1e-4, 0], 0, 1e-3, 30, (_t, y) => y[1])!;
    const p3 = agree(top.y[0], Math.PI / 2, 'p3 θmax');

    // p4：ω = 2、m = 0.5，从 s0 = 0.1 相对静止到 s = 1
    const wire: System = { masses: [0.5], positions: ([s], t) => [[s * Math.cos(2 * t), s * Math.sin(2 * t)]] };
    const out = integrateUntil(systemDerivative(wire), [0.1, 0], 0, 1e-3, 10, (_t, y) => y[0] - 1)!;
    const work = kinetic(wire, [out.y[0]], [out.y[1]], out.t) - kinetic(wire, [0.1], [0], 0);
    const p4 = agree(work, 0.5 * 4 * (1 - 0.01), 'p4 功');

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
