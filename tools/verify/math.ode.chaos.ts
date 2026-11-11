// 独立验算 math.ode.chaos 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.chaos.ts
// 迹用雅可比矩阵的中心差分算；平衡点用牛顿法求。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect, jacobianFD, solveLinear } from './math.ode._numeric.ts';

const lorenz =
  (sigma: number, rho: number, beta: number) =>
  ([x, y, z]: number[]): number[] => [sigma * (y - x), x * (rho - z) - y, x * y - beta * z];

/** 牛顿法求 F = 0，从 x0 出发。 */
const newton = (F: (x: number[]) => number[], x0: number[]): number[] => {
  let x = x0;
  for (let k = 0; k < 100; k++) {
    const step = solveLinear(jacobianFD(F, x), F(x));
    x = x.map((v, i) => v - step[i]);
  }
  if (F(x).some((v) => Math.abs(v) > 1e-10)) throw new Error('牛顿法没收敛');
  return x;
};

export const verification: Verification = {
  lesson: 'math.ode.chaos',
  notes: {
    p1: '对 σ = 16、β = 4 的洛伦茨系统中心差分求雅可比矩阵，取迹；在 (1, 2, 3) 和 (−4, 7, 20) 两处、ρ = 28 和 ρ = 5 两种取值下都算，核对一样（题目没给 ρ）。',
    p2: '对给定的 ρ，从 (6, 6, 15) 出发用牛顿法求非零平衡点，取 z；在 ρ ∈ [15, 30] 上对 z(ρ) − 20 二分。再从 (−6, −6, 15) 出发核对 C₋ 的 z 也是 20。',
    p3: 'ρ = 10，从 (5, 5, 8) 出发用牛顿法求平衡点，取 x（为正）。',
    p4: '误差 δ₀e^{0.5t} 长到 1 的时刻对 t 二分求出，δ₀ 分别取 10⁻⁴ 和 10⁻⁸，取差。',
  },
  compute() {
    // p1
    const traces = [28, 5].flatMap((rho) =>
      [
        [1, 2, 3],
        [-4, 7, 20],
      ].map((p) => {
        const J = jacobianFD(lorenz(16, rho, 4), p);
        return J[0][0] + J[1][1] + J[2][2];
      }),
    );
    if (traces.some((t) => Math.abs(t - traces[0]) > 1e-7)) throw new Error('p1：迹随点或 ρ 变化');

    // p2
    const zOf = (rho: number, start: number[]): number => {
      const C = newton(lorenz(10, rho, 8 / 3), start);
      if (Math.hypot(C[0], C[1]) < 1e-6) throw new Error('p2：牛顿法落到了原点');
      return C[2];
    };
    const rho2 = bisect((rho) => zOf(rho, [6, 6, 15]) - 20, 15, 30);
    if (Math.abs(zOf(rho2, [-6, -6, 15]) - 20) > 1e-9) throw new Error('p2：C₋ 的 z 不是 20');

    // p3
    const C3 = newton(lorenz(10, 10, 8 / 3), [5, 5, 8]);
    if (C3[0] <= 0) throw new Error('p3：找到的不是 C₊');

    // p4
    const failTime = (d0: number): number => bisect((t) => d0 * Math.exp(0.5 * t) - 1, 0, 100);
    const p4 = failTime(1e-8) - failTime(1e-4);

    return {
      p1: { type: 'number', value: traces[0] },
      p2: { type: 'number', value: rho2 },
      p3: { type: 'number', value: C3[0] },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
