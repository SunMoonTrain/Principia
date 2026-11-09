// 独立验算 math.analysis.limit-properties 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.limit-properties.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

const M = 1_000_000;

/** 前 M 项里最后一个「不满足」的 n（都满足时为 0）；后一半里还有不满足的就报错，说明尾部还没稳定。 */
function lastFailure(fails: (n: number) => boolean): number {
  let last = 0;
  for (let n = 1; n <= M; n++) if (fails(n)) last = n;
  if (last > M / 2) throw new Error('后一半里还有不满足的项，增大 M');
  return last;
}

/** Richardson 外推：a_n = L + c₁/n + c₂/n² + … 时，用 a(n₀)、a(2n₀)、a(4n₀)… 逐级消去 1/n 的各次项。 */
function richardson(a: (n: number) => number, n0 = 1000, levels = 5): number {
  let row = Array.from({ length: levels }, (_, i) => a(n0 * 2 ** i));
  for (let k = 1; k < levels; k++) {
    const f = 2 ** k;
    row = row.slice(1).map((v, i) => (f * v - row[i]) / (f - 1));
  }
  return row[0];
}

/** 尾部振幅：n ∈ [m, 2m] 上 a_n 的最大值减最小值。 */
function spread(a: (n: number) => number, m: number): number {
  let max = -Infinity;
  let min = Infinity;
  for (let n = m; n <= 2 * m; n++) {
    const v = a(n);
    if (v > max) max = v;
    if (v < min) min = v;
  }
  return max - min;
}

/** 收敛时返回极限（取到 10⁻⁴），不收敛返回 null。收敛的判法：m 从 10³ 到 10⁶，尾部振幅一路缩小（或一直是 0）到 10⁻² 以下。 */
function limitOf(a: (n: number) => number): number | null {
  const s = [1e3, 1e4, 1e5, 1e6].map((m) => spread(a, m));
  if (!(s.every((v, i) => i === 0 || v < s[i - 1] || v === 0) && s[s.length - 1] < 1e-2)) return null;
  return Math.round(a(1e8) * 1e4) / 1e4 + 0; // + 0 把 −0 变成 0
}

/** 有界：前 10⁶ 项的 |a_n| 最大值，比前 10³ 项的最大值大不到一倍。 */
function bounded(a: (n: number) => number): boolean {
  let small = 0;
  let large = 0;
  for (let n = 1; n <= 1e6; n++) {
    const v = Math.abs(a(n));
    if (n <= 1e3) small = Math.max(small, v);
    large = Math.max(large, v);
  }
  return large <= 2 * small;
}

const sign = (n: number): number => (n % 2 === 0 ? 1 : -1);

export const verification: Verification = {
  lesson: 'math.analysis.limit-properties',
  notes: {
    p1: '在 10 条检验数列（1/n、−1/n、(−1)ⁿ、(−1)ⁿ/n、n、1+1/n、−1+1/n、−2+(−1)ⁿ/n、sin n、常数 3）里逐条找反例，找不到反例的说法算对。',
    p2: '逐项用整数精确比较 2n − 9 > n（即 a_n > 1），取前 100 万项里最后一个不满足的 n。',
    p3: '算前 100 万项的 |a_n| 最大值，确认它出现在最前面，而且后面的项都在 (−1, 1) 里、单调增向 1。',
    p4: '对上下两个界分别做 Richardson 外推求极限，两者相等，a_n 被夹在中间，所以极限就是它。',
  },
  compute() {
    // p1：四种说法，各自在检验数列里找反例
    const sequences: ((n: number) => number)[] = [
      (n) => 1 / n,
      (n) => -1 / n,
      sign,
      (n) => sign(n) / n,
      (n) => n,
      (n) => 1 + 1 / n,
      (n) => -1 + 1 / n,
      (n) => -2 + sign(n) / n,
      (n) => Math.sin(n),
      () => 3,
    ];
    const samples = sequences.map((a) => {
      let allPositive = true;
      let lastNonNegative = 0;
      for (let n = 1; n <= 1e5; n++) {
        if (!(a(n) > 0)) allPositive = false;
        if (!(a(n) < 0)) lastNonNegative = n;
      }
      return { limit: limitOf(a), bounded: bounded(a), allPositive, eventuallyNegative: lastNonNegative <= 1e4 };
    });
    const claims: ((s: (typeof samples)[number]) => boolean)[] = [
      (s) => !s.bounded || s.limit !== null, // A：有界 ⇒ 收敛
      (s) => s.limit === null || s.bounded, // B：收敛 ⇒ 有界
      (s) => !(s.allPositive && s.limit !== null) || s.limit > 0, // C：各项为正且收敛 ⇒ 极限为正
      (s) => !(s.limit !== null && s.limit < 0) || s.eventuallyNegative, // D：极限为负 ⇒ 从某项起为负
    ];
    const p1 = claims.flatMap((c, i) => (samples.every(c) ? [i + 1] : []));

    // p2：a_n = 2 − 9/n，从哪一项以后都 > 1
    const p2 = lastFailure((n) => !(2 * n - 9 > n));

    // p3：a_n = (n² − 6n)/(n² + 1)，求 sup |a_n|
    const a3 = (n: number): number => (n * n - 6 * n) / (n * n + 1);
    let max3 = -Infinity;
    let argmax3 = 0;
    for (let n = 1; n <= M; n++) {
      const v = Math.abs(a3(n));
      if (v > max3) [max3, argmax3] = [v, n];
    }
    if (argmax3 > 100) throw new Error('最大值不在最前面，要另想办法');
    for (let n = 7; n < M; n++) {
      if (!(a3(n) > -1 && a3(n) < 1 && a3(n + 1) > a3(n))) throw new Error(`第 ${n} 项以后不再单调地落在 (−1, 1) 里`);
    }

    // p4：(3n² − 1)/(n² + n) ≤ a_n ≤ (3n + 2)/n
    const lower = richardson((n) => (3 * n * n - 1) / (n * n + n));
    const upper = richardson((n) => (3 * n + 2) / n);
    if (Math.abs(lower - upper) > 1e-9) throw new Error('上下界的极限不相等，夹不出来');

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: max3 },
      p4: { type: 'number', value: (lower + upper) / 2 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
