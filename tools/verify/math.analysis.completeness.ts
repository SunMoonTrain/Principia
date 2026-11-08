// 独立验算 math.analysis.completeness 的 p1–p4（简单题、中等题）。
// 只按题意用数值方法计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.completeness.ts

import { fileURLToPath } from 'node:url';
import { infOfPredicate, rootsOf, runVerification, supOfPredicate, type Verification } from './lib.ts';

const N = 1_000_000;

/** 数列 a_1..a_N 的最大值、最小值，以及它们出现在第几项。 */
function extremes(a: (n: number) => number): { max: number; argmax: number; min: number; argmin: number } {
  let max = -Infinity;
  let min = Infinity;
  let argmax = 0;
  let argmin = 0;
  for (let n = 1; n <= N; n++) {
    const v = a(n);
    if (v > max) [max, argmax] = [v, n];
    if (v < min) [min, argmin] = [v, n];
  }
  return { max, argmax, min, argmin };
}

/**
 * 由数列前 N 项估计上确界：如果最大值在很靠后的项才出现（说明还在增长），
 * 就看相邻的 N/2、N 两段的最大值差，确认它已经收敛到一个数，并把那个数取整到 1e-5。
 */
function supOfSequence(a: (n: number) => number): { sup: number; attained: boolean } {
  const all = extremes(a);
  if (all.argmax < N / 100) return { sup: all.max, attained: true };
  const half = extremes((n) => a(Math.floor(n / 2) || 1));
  if (Math.abs(all.max - half.max) > 1e-5) throw new Error('数列的最大值还没稳定，增大 N');
  const limit = Math.round(all.max * 1e5) / 1e5;
  return { sup: limit, attained: false };
}

export const verification: Verification = {
  lesson: 'math.analysis.completeness',
  notes: {
    p1: '在 [-100, 100] 上粗扫 x² < 3 的点，再对最右端二分，得到上确界的数值。',
    p2: '四个集合分别用区间端点判断或取数列前 100 万项，算出上确界，再看它是否被集合取到。',
    p3: '取数列前 100 万项求最大、最小值，确认它们稳定地逼近 ±1 而取不到，得到 (inf, sup)。',
    p4: '对 c 在 [-10, 10] 上扫描：每个 c 用二分求 x² − cx < 0 的上、下确界，再找 sup − inf − 3 的零点。',
  },
  compute() {
    // p1：A = {x ∈ R : x² < 3}，求 sup A
    const p1 = supOfPredicate((x) => x * x < 3)!;

    // p2：哪些集合有最大元（上确界属于集合）
    const sets: { name: string; sup: () => { sup: number; attained: boolean } }[] = [
      {
        name: '[0,1]',
        sup: () => {
          const s = supOfPredicate((x) => x >= 0 && x <= 1)!;
          const rounded = Math.round(s * 1e6) / 1e6;
          return { sup: rounded, attained: rounded >= 0 && rounded <= 1 };
        },
      },
      {
        name: '[0,1)',
        sup: () => {
          const s = supOfPredicate((x) => x >= 0 && x < 1)!;
          const rounded = Math.round(s * 1e6) / 1e6;
          return { sup: rounded, attained: rounded >= 0 && rounded < 1 };
        },
      },
      { name: '{1 - 1/n}', sup: () => supOfSequence((n) => 1 - 1 / n) },
      { name: '{1/n}', sup: () => supOfSequence((n) => 1 / n) },
    ];
    const p2 = sets.flatMap((s, i) => (s.sup().attained ? [i + 1] : []));

    // p3：A = {(-1)^n (1 - 1/n)}，按 (inf A, sup A) 的顺序
    const term = (n: number): number => (n % 2 === 0 ? 1 : -1) * (1 - 1 / n);
    const sup3 = supOfSequence(term);
    const inf3 = supOfSequence((n) => -term(n));
    const p3 = [-inf3.sup, sup3.sup];

    // p4：A_c = {x : x² − cx < 0}，求所有使 sup A_c − inf A_c = 3 的 c
    const width = (c: number): number | null => {
      const pred = (x: number): boolean => x * x - c * x < 0;
      const s = supOfPredicate(pred, -20, 20, 4000);
      const i = infOfPredicate(pred, -20, 20, 4000);
      return s === null || i === null ? null : s - i;
    };
    const p4 = rootsOf((c) => {
      const w = width(c);
      return w === null ? null : w - 3;
    }, -10, 10, 400).map((r) => Math.round(r * 1e6) / 1e6);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'set', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
