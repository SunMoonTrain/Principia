// 独立验算 math.analysis.function-limits 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.function-limits.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { grid, maxDelta } from './math.analysis._numeric.ts';

/**
 * x → a 时的极限：在去心邻域 0 < |x − a| < δ 的格点上看函数值的振幅（最大减最小），δ 取 10⁻²、10⁻⁴、10⁻⁶。
 * 振幅一路缩小、最后小于 10⁻² 就算有极限，极限取最小那个邻域里函数值的中点；否则返回 null。
 * values(x) 返回 x 处可能的函数值：分有理点、无理点定义的函数，两种值都放进去（有理点、无理点在任何邻域里都有）。
 */
function limitAt(values: (x: number) => number[], a: number): number | null {
  const amps: number[] = [];
  let mid = Number.NaN;
  for (const delta of [1e-2, 1e-4, 1e-6]) {
    let lo = Infinity;
    let hi = -Infinity;
    for (const x of grid(a - delta, a + delta, 200_001)) {
      if (x === a || Math.abs(x - a) >= delta) continue;
      for (const v of values(x)) {
        lo = Math.min(lo, v);
        hi = Math.max(hi, v);
      }
    }
    amps.push(hi - lo);
    mid = (hi + lo) / 2;
  }
  const ok = amps.every((v, i) => i === 0 || v <= amps[i - 1] + 1e-15) && amps[amps.length - 1] < 1e-2;
  return ok ? mid : null;
}

export const verification: Verification = {
  lesson: 'math.analysis.function-limits',
  notes: {
    p1: '坏点是 x ≠ 1 且 |(3x − 1) − 2| ≥ 0.03 的 x；在 1 的两边各用格点加二分找最近的坏点，δ 最大取到 1 到坏点集合的距离。',
    p2: '在 x = 1 的去心邻域里算振幅和极限（得 2），逐条对照：A、B 比极限值；C 看极限存不存在；D 把 g(1) 换成 −3、0、100，或去掉这一点，重算极限看变不变。',
    p3: '坏点是 x ≠ 2 且 |x² − 4| ≥ 0.41 的 x；在 2 的两边找最近的坏点，取距离。',
    p4: '对四个函数在 0 的去心邻域（δ = 10⁻²、10⁻⁴、10⁻⁶，各 2×10⁵ 个格点）上看振幅是否缩小到 10⁻² 以下；D 在每个点同时放进有理点的值 x² 和无理点的值 0。',
  },
  compute() {
    // p1：lim_{x→1}(3x − 1) = 2，ε = 0.03
    const p1 = maxDelta(1, (x) => x !== 1 && Math.abs(3 * x - 1 - 2) >= 0.03, 1, 1);

    // p2：g(x) = x + 1（x ≠ 1），g(1) = 5
    const variants: ((x: number) => number[])[] = [5, -3, 0, 100, Number.NaN].map((g1) => (x) => (x === 1 ? (Number.isNaN(g1) ? [] : [g1]) : [x + 1]));
    const limits = variants.map((g) => limitAt(g, 1));
    const L = limits[0];
    const p2: number[] = [];
    if (L !== null && Math.abs(L - 5) < 1e-6) p2.push(1);
    if (L !== null && Math.abs(L - 2) < 1e-6) p2.push(2);
    if (L === null) p2.push(3);
    if (limits.every((v) => v !== null && L !== null && Math.abs(v - L) < 1e-9)) p2.push(4);

    // p3：lim_{x→2} x² = 4，ε = 0.41
    const p3 = maxDelta(2, (x) => x !== 2 && Math.abs(x * x - 4) >= 0.41, 2, 2);

    // p4：哪些函数在 x → 0 时有极限
    const fs: ((x: number) => number[])[] = [
      (x) => [x * Math.sin(1 / x)],
      (x) => [Math.sin(1 / x)],
      (x) => [Math.abs(x) / x],
      (x) => [x * x, 0],
    ];
    const p4 = fs.flatMap((f, i) => (limitAt(f, 0) !== null ? [i + 1] : []));

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
