// 独立验算 math.analysis.continuity 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.continuity.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { grid, maxDelta } from './math.analysis._numeric.ts';

/** 在 a 处连续：|x − a| < δ 的格点上 |f(x) − f(a)| 的最大值，δ 取 10⁻²、10⁻⁴、10⁻⁶ 时一路缩小，最后小于 10⁻²。 */
function continuousAt(f: (x: number) => number, a: number): boolean {
  const sups = [1e-2, 1e-4, 1e-6].map((delta) => {
    let best = 0;
    for (const x of grid(a - delta, a + delta, 200_000)) if (Math.abs(x - a) < delta) best = Math.max(best, Math.abs(f(x) - f(a)));
    return best;
  });
  return sups.every((v, i) => i === 0 || v <= sups[i - 1] + 1e-15) && sups[sups.length - 1] < 1e-2;
}

export const verification: Verification = {
  lesson: 'math.analysis.continuity',
  notes: {
    p1: '连续要求 c 等于 x → 3 时的极限：算 f(3 ± h)（h = 10⁻³…10⁻⁶），两侧的值一路靠拢，取 h = 10⁻⁶ 时两侧的平均。',
    p2: '对每个函数，在 |x| < δ 的 2×10⁵ 个格点（含 0）上取 |f(x) − f(0)| 的最大值，δ = 10⁻²、10⁻⁴、10⁻⁶，看是否缩小到 10⁻² 以下。',
    p3: '坏点是 x ≥ 0 且 |√x − 2| ≥ 0.1 的 x；在 4 的两边用格点加二分找最近的坏点，δ 最大取到 4 到坏点集合的距离。',
    p4: '有理点、无理点在任何区间里都有，f 在 a 处连续当且仅当两支 x² 和 2x − 1 在 a 处的值相等（两支各自连续）；在 [−10, 10] 上用格点加三分法找 |x² − (2x − 1)| 等于 0 的点。',
  },
  compute() {
    // p1：f(x) = (x² − 9)/(x − 3)
    const f1 = (x: number): number => (x * x - 9) / (x - 3);
    const gaps = [1e-3, 1e-4, 1e-5, 1e-6].map((h) => Math.abs(f1(3 + h) - f1(3 - h)));
    if (!gaps.every((g, i) => i === 0 || g < gaps[i - 1])) throw new Error('p1：两侧的值没有靠拢');
    const p1 = (f1(3 + 1e-6) + f1(3 - 1e-6)) / 2;

    // p2：哪些函数在 0 处连续
    const sinInv = (x: number): number => (x === 0 ? 0 : Math.sin(1 / x));
    const fs: ((x: number) => number)[] = [(x) => (x === 0 ? 0 : x * Math.sin(1 / x)), sinInv, (x) => Math.abs(x), (x) => Math.sign(x)];
    const p2 = fs.flatMap((f, i) => (continuousAt(f, 0) ? [i + 1] : []));

    // p3：√x 在 4 处，ε = 0.1
    const p3 = maxDelta(4, (x) => x >= 0 && Math.abs(Math.sqrt(x) - 2) >= 0.1, 4, 4);

    // p4：两支的差 |x² − (2x − 1)|
    const gap = (x: number): number => Math.abs(x * x - (2 * x - 1));
    const xs = grid(-10, 10, 200_000);
    const candidates: number[] = [];
    for (let i = 1; i < xs.length - 1; i++) {
      if (gap(xs[i]) <= gap(xs[i - 1]) && gap(xs[i]) <= gap(xs[i + 1])) {
        // 在相邻两格之间三分，找局部最小
        let l = xs[i - 1];
        let r = xs[i + 1];
        for (let k = 0; k < 200; k++) {
          const m1 = l + (r - l) / 3;
          const m2 = r - (r - l) / 3;
          if (gap(m1) < gap(m2)) r = m2;
          else l = m1;
        }
        const x = (l + r) / 2;
        if (gap(x) < 1e-12) candidates.push(x);
      }
    }
    const p4 = candidates.filter((x, i) => i === 0 || Math.abs(x - candidates[i - 1]) > 1e-6);
    if (p4.length !== 1) throw new Error(`p4：两支相等的点不止一个：${p4.join(', ')}`);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4[0] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
