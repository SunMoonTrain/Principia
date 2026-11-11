// 独立验算 physics.special-relativity.relativistic-action 的 p1–p4（简单题、中等题）。
// 拉格朗日量另由作用量的定义算：L dt = −mc² dτ，dτ/dt 取光钟读数比（clockRate）；动量用数值求导 ∂L/∂u，
// 能量用 E = up − L，速率由动量对 u 二分。都和讲解里的公式（γ_u m u、γ_u mc²）核对。
// 单独运行：npx tsx tools/verify/physics.special-relativity.relativistic-action.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, clockRate, gamma } from './physics.special-relativity._relativity.ts';

/** c = m = 1：L(u) = −dτ/dt，dτ/dt 由光钟给出。 */
const L = (u: number): number => -clockRate(u, 1);
/** 中心差分再做一次理查森外推。 */
const dL = (u: number): number => {
  const d = (h: number): number => (L(u + h) - L(u - h)) / (2 * h);
  return (4 * d(5e-4) - d(1e-3)) / 3;
};

export const verification: Verification = {
  lesson: 'physics.special-relativity.relativistic-action',
  notes: {
    p1: 'L = −mc²·dτ/dt，dτ/dt 取 0.8c 光钟的读数比；和 −√(1 − 0.64) 核对。',
    p2: 'A：𝒮 = −mc²∫dτ 正比于固有时；B：同一粒子在两个惯性系里速度不同，L 取值不同（反例）；C：数值求导 ∂L/∂u 和 γ_u m u 一致；D：L + mc² − ½mu² 在 u = 0.01、0.02 时按 u⁴ 缩小，常数项对求导没有贡献；E：作用量反号后数值求导得 −γ_u m u（反例）。',
    p3: '数值求导得 p = ∂L/∂u，再算 up − L；和 γ_u mc² = 25/7 核对。',
    p4: '对 u 二分，使数值求导的 ∂L/∂u = 3；再算 up − L；和 √(p²c² + m²c⁴) = √10 核对。',
  },
  compute() {
    // p1
    const p1 = agree(L(0.8), -Math.sqrt(1 - 0.64), 'p1', 1e-12);

    // p2
    const A2 = true;
    const B2 = Math.abs(L(0.3) - L(0.7)) < 1e-9;
    const C2 = [0.2, 0.5, 0.9].every((u) => Math.abs(dL(u) - gamma(u) * u) < 1e-7);
    const rem = (u: number): number => L(u) + 1 - 0.5 * u * u;
    check(Math.abs(rem(0.02) / rem(0.01) - 16) < 0.05, 'p2 D：余项按 u⁴ 缩小');
    const D2 = true;
    const flipped = (u: number): number => -L(u);
    const E2 = Math.abs((flipped(0.5 + 1e-4) - flipped(0.5 - 1e-4)) / 2e-4 - gamma(0.5) * 0.5) < 1e-6;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const u3 = 0.96;
    const p3 = agree(u3 * dL(u3) - L(u3), 25 / 7, 'p3', 1e-8);

    // p4
    const u4 = bisect((u) => dL(u) - 3, 0.5, 0.99);
    const p4 = agree(u4 * dL(u4) - L(u4), Math.sqrt(10), 'p4', 1e-8);

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
