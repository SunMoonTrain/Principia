// 独立验算 math.analysis.extreme-value 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.extreme-value.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { grid, richardson } from './math.analysis._numeric.ts';

/**
 * 最大值取不取得到：在越来越密的格点（都在定义域里）上取最大值。
 * 格点加密以后最大值不再变（差不超过 10⁻¹²），就是某个格点上的函数值，算取到；一直变大，算取不到。
 */
function attainsMax(f: (x: number) => number, points: (K: number) => number[]): boolean {
  const maxes = [1e3, 1e4, 1e5, 1e6].map((K) => maxOf(points(K).map(f)));
  return maxes.every((m) => Math.abs(m - maxes[0]) <= 1e-12);
}

/** 数组的最大值（数组很长时不能用 Math.max(...xs)）。 */
function maxOf(xs: number[]): number {
  let best = -Infinity;
  for (const x of xs) if (x > best) best = x;
  return best;
}

/** [a, b] 上的最大值、最小值：10⁶ 等分的格点上取最值，再在最值点两边的格子里三分细化。 */
function extremes(f: (x: number) => number, a: number, b: number): [number, number] {
  const xs = grid(a, b, 1_000_000);
  const refine = (i: number, sign: 1 | -1): number => {
    let l = xs[Math.max(i - 1, 0)];
    let r = xs[Math.min(i + 1, xs.length - 1)];
    for (let k = 0; k < 200; k++) {
      const m1 = l + (r - l) / 3;
      const m2 = r - (r - l) / 3;
      if (sign * f(m1) > sign * f(m2)) r = m2;
      else l = m1;
    }
    return Math.max(sign * f((l + r) / 2), sign * f(xs[i])) * sign;
  };
  let iMax = 0;
  let iMin = 0;
  xs.forEach((x, i) => {
    if (f(x) > f(xs[iMax])) iMax = i;
    if (f(x) < f(xs[iMin])) iMin = i;
  });
  return [refine(iMax, 1), refine(iMin, -1)];
}

export const verification: Verification = {
  lesson: 'math.analysis.extreme-value',
  notes: {
    p1: '每个函数在定义域里的 K 等分格点上取最大值（K = 10³…10⁶，都是偶数，开区间 (−1, 1) 的格点含 0），格点加密后最大值不变的算取到，一直变大的算取不到。',
    p2: '在 [0, 2] 的 K 等分格点上取最大值，K = 1000·2ⁱ；最大值随 K 按 1/K 的幂次变化，用 Richardson 外推得到上确界。',
    p3: '在 [−2, 3/2] 的 10⁶ 等分格点上取最大值、最小值，再在最值点两边三分细化。',
    p4: '对每个 t，在 [0, 1] 的 10⁵ 等分格点上取 |x² − tx| 的最大值得 g(t)；g 是一族凸函数的最大值，也是凸的，在 t ∈ [−1, 2] 上三分 200 次求最小值。',
  },
  compute() {
    // p1：哪些函数在所给区间上取到最大值
    const halfOpen = (K: number): number[] => grid(0, 1, K).slice(0, -1); // [0, 1)
    const closed = (a: number, b: number) => (K: number) => grid(a, b, K);
    const open = (K: number): number[] => grid(-1, 1, K).slice(1, -1); // (−1, 1)
    const cases: { f: (x: number) => number; points: (K: number) => number[] }[] = [
      { f: (x) => x, points: halfOpen },
      { f: (x) => 1 / x, points: closed(1, 2) },
      { f: (x) => -x * x, points: open },
      { f: (x) => (x < 1 ? x : 0), points: closed(0, 1) },
    ];
    const p1 = cases.flatMap(({ f, points }, i) => (attainsMax(f, points) ? [i + 1] : []));

    // p2：f(x) = x − ⌊x⌋ 在 [0, 2] 上的上确界
    const gridMax = (K: number): number => maxOf(grid(0, 2, K).map((x) => x - Math.floor(x)));
    const p2 = richardson(gridMax, 1000);

    // p3：x³ − 3x 在 [−2, 3/2] 上
    const p3 = extremes((x) => x ** 3 - 3 * x, -2, 1.5);

    // p4：g(t) = max_{x∈[0,1]} |x² − tx|，求 min_t g(t)
    const xs = grid(0, 1, 100_000);
    const g = (t: number): number => {
      let best = 0;
      for (const x of xs) best = Math.max(best, Math.abs(x * x - t * x));
      return best;
    };
    let l = -1;
    let r = 2;
    for (let k = 0; k < 200; k++) {
      const m1 = l + (r - l) / 3;
      const m2 = r - (r - l) / 3;
      if (g(m1) < g(m2)) r = m2;
      else l = m1;
    }
    const p4 = g((l + r) / 2);

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
