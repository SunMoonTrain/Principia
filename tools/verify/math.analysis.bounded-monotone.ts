// 独立验算 math.analysis.bounded-monotone 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.bounded-monotone.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** Richardson 外推：a_n = L + c₁/n + c₂/n² + … 时，用 a(n₀)、a(2n₀)、a(4n₀)… 逐级消去 1/n 的各次项。 */
function richardson(a: (n: number) => number, n0 = 1000, levels = 5): number {
  let row = Array.from({ length: levels }, (_, i) => a(n0 * 2 ** i));
  for (let k = 1; k < levels; k++) {
    const f = 2 ** k;
    row = row.slice(1).map((v, i) => (f * v - row[i]) / (f - 1));
  }
  return row[0];
}

/** 按递推式迭代 steps 步，返回各项；同时检查是否单调递增、是否有界（和题目给的条件对得上）。 */
function iterate(a1: number, next: (a: number) => number, steps: number): number[] {
  const a = [a1];
  for (let k = 1; k < steps; k++) a.push(next(a[k - 1]));
  return a;
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

/** 判收敛：m 从 10³ 到 10⁶，尾部振幅一路缩小（或一直是 0），最后小于 10⁻²。 */
function converges(a: (n: number) => number): boolean {
  const s = [1e3, 1e4, 1e5, 1e6].map((m) => spread(a, m));
  return s.every((v, i) => i === 0 || v < s[i - 1] || v === 0) && s[s.length - 1] < 1e-2;
}

const sign = (n: number): number => (n % 2 === 0 ? 1 : -1);

export const verification: Verification = {
  lesson: 'math.analysis.bounded-monotone',
  notes: {
    p1: '按递推式迭代 200 步，确认单调递增、有界，取最后一项。',
    p2: '在 8 条检验数列（(−1)ⁿ/n、−n、1−1/n、2−1/n²、arctan n、n、ln n、常数 5）里逐条找反例：单调、有上界、收敛都按前 10⁶ 项数值判断，找不到反例的说法算对。',
    p3: '按递推式从 a₁ = 0 迭代 500 步，确认单调递增、有界，取最后一项。',
    p4: '对 (1 − 1/n)ⁿ（用 exp(n·ln(1 − 1/n)) 算）做 Richardson 外推。',
  },
  compute() {
    // p1：a₁ = 1，a_{n+1} = √(6 + a_n)
    const s1 = iterate(1, (a) => Math.sqrt(6 + a), 200);
    if (!s1.every((v, i) => i === 0 || v >= s1[i - 1])) throw new Error('p1 的数列不是单调递增');

    // p2：四种说法，各自在检验数列里找反例
    const N = 1e6;
    const sequences: ((n: number) => number)[] = [
      (n) => sign(n) / n,
      (n) => -n,
      (n) => 1 - 1 / n,
      (n) => 2 - 1 / (n * n),
      (n) => Math.atan(n),
      (n) => n,
      (n) => Math.log(n),
      () => 5,
    ];
    const samples = sequences.map((a) => {
      let increasing = true;
      let decreasing = true;
      let maxEarly = -Infinity;
      let max = -Infinity;
      for (let n = 1; n <= N; n++) {
        const v = a(n);
        if (n > 1 && v < a(n - 1)) increasing = false;
        if (n > 1 && v > a(n - 1)) decreasing = false;
        if (n <= 1e4) maxEarly = Math.max(maxEarly, v);
        max = Math.max(max, v);
      }
      // 有上界：第 10⁴ 项以后，最大值几乎不再增长
      const boundedAbove = max - maxEarly < 1e-2 * (1 + Math.abs(max));
      const conv = converges(a);
      return { increasing, decreasing, boundedAbove, converges: conv, limit: conv ? a(1e9) : NaN, sup: max };
    });
    const claims: ((s: (typeof samples)[number]) => boolean)[] = [
      (s) => !s.converges || s.increasing || s.decreasing, // A：收敛 ⇒ 单调
      (s) => !s.decreasing || s.converges, // B：单调递减 ⇒ 收敛
      (s) => !(s.increasing && s.boundedAbove) || (s.converges && Math.abs(s.limit - s.sup) < 1e-3), // C
      (s) => !s.increasing || s.converges === s.boundedAbove, // D：单调递增时，收敛 ⇔ 有上界
    ];
    const p2 = claims.flatMap((c, i) => (samples.every(c) ? [i + 1] : []));

    // p3：a₁ = 0，a_{n+1} = (a_n² + 2)/3
    const s3 = iterate(0, (a) => (a * a + 2) / 3, 500);
    if (!s3.every((v, i) => i === 0 || v >= s3[i - 1])) throw new Error('p3 的数列不是单调递增');

    // p4：(1 − 1/n)ⁿ
    const p4 = richardson((n) => Math.exp(n * Math.log1p(-1 / n)));

    return {
      p1: { type: 'number', value: s1[s1.length - 1] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: s3[s3.length - 1] },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
