// 独立验算 math.analysis.uniform-continuity 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.uniform-continuity.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { firstReach, grid, logGrid, modulus } from './math.analysis._numeric.ts';

/**
 * 「|x − y| < δ 时 |f(x) − f(y)| < ε 对区间里所有 x、y 成立」的最大的 δ。
 * 记 ω(t) 为相距恰好 t 的两点函数值之差的最大值（在格点 xs 上取）。ω 单调不减时，
 * δ 合格 ⟺ 所有 t < δ 都有 ω(t) < ε，所以最大的 δ 就是 ω 第一次达到 ε 的 t。先在一串 t 上核对 ω 确实单调不减。
 */
function largestDelta(f: (x: number) => number, xs: number[], hi: number, eps: number, tMax: number): number {
  // 区间右端是有限的数时，另加上右端那一对点 (hi − t, hi)，不受格点疏密影响
  const omega = (t: number): number => Math.max(modulus(f, xs, t, hi), Number.isFinite(hi) ? Math.abs(f(hi) - f(hi - t)) : 0);
  const om = grid(tMax / 100, tMax, 100).map(omega);
  if (om.some((v, i) => i > 0 && v < om[i - 1] - 1e-12)) throw new Error('ω 不是单调不减的');
  return firstReach(omega, eps, 1e-12, tMax);
}

/** 一致连续：ω(t) 在 t = 10⁻²、10⁻⁴、10⁻⁶ 时一路缩小，最后小于 10⁻²。 */
function uniformlyContinuous(f: (x: number) => number, xs: number[], hi: number): boolean {
  const om = [1e-2, 1e-4, 1e-6].map((t) => modulus(f, xs, t, hi));
  return om.every((v, i) => i === 0 || v <= om[i - 1] + 1e-15) && om[om.length - 1] < 1e-2;
}

export const verification: Verification = {
  lesson: 'math.analysis.uniform-continuity',
  notes: {
    p1: 'ω(t) = 相距 t 的两点函数值之差的最大值（x 取 [−100, 100] 的格点）；ω 单调不减，最大的 δ 是 ω 第一次达到 ε 的 t，用二分求。',
    p2:
      '在各区间的格点上算 ω(t)，t = 10⁻²、10⁻⁴、10⁻⁶，看是否缩小到 10⁻² 以下。无界的区间取到 x = 10⁸（对数均匀取点），' +
      '开区间 (0, 1) 从 x = 10⁻¹² 取起，都另加均匀格点。',
    p3: '同 p1，x 取 [0, 3] 的 2×10⁵ 等分格点（含两端），只取 x + t ≤ 3 的点对。',
    p4: '同 p1，x 取 [0, 100] 的均匀格点加 [10⁻¹², 100] 的对数格点，再加上 0。',
  },
  compute() {
    // p1：f(x) = 3x，ε = 0.3
    const p1 = largestDelta((x) => 3 * x, grid(-100, 100, 2000), Infinity, 0.3, 1);

    // p2：哪些函数在所给区间上一致连续
    const cases: { f: (x: number) => number; xs: number[]; hi: number }[] = [
      { f: (x) => x * x, xs: grid(0, 10, 100_000), hi: 10 },
      { f: (x) => x * x, xs: [...grid(0, 10, 10_000), ...logGrid(1e-3, 1e8, 10_000)], hi: Infinity },
      { f: (x) => 1 / x, xs: [...grid(1, 10, 10_000), ...logGrid(1, 1e8, 10_000)], hi: Infinity },
      { f: (x) => 1 / x, xs: [...grid(0.001, 1, 10_000), ...logGrid(1e-12, 1, 10_000)].filter((x) => x > 0 && x < 1), hi: 1 - 1e-12 },
    ];
    const p2 = cases.flatMap(({ f, xs, hi }, i) => (uniformlyContinuous(f, xs, hi) ? [i + 1] : []));

    // p3：x² 在 [0, 3] 上，ε = 0.59
    const p3 = largestDelta((x) => x * x, grid(0, 3, 200_000), 3, 0.59, 1);

    // p4：√x 在 [0, +∞) 上，ε = 0.1
    const p4 = largestDelta((x) => Math.sqrt(x), [0, ...grid(0, 100, 100_000), ...logGrid(1e-12, 100, 10_000)], Infinity, 0.1, 1);

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
