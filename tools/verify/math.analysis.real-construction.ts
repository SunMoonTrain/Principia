// 独立验算 math.analysis.real-construction 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.real-construction.ts
// 有理数都写成 a/b（a、b 是整数，b > 0），集合的成员关系都用整数精确判断，不用浮点数。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** 有理数集，按「a/b 属不属于它」给出（b > 0）；用 BigInt 精确判断，分子分母再大也不丢精度。 */
type RationalSet = (a: bigint, b: bigint) => boolean;

/** a/b < c/d（b、d > 0）。 */
const less = ([a, b]: [bigint, bigint], [c, d]: [bigint, bigint]): boolean => a * d < c * b;

/**
 * 按定义检查是不是戴德金分割（在分母不超过 Q、绝对值不超过 R 的有理数上找反例）：
 * 非空、不是全体有理数、往下封闭（q 在里面、p < q 则 p 在里面）、没有最大元（每个成员都有更大的成员）。
 */
function isCut(alpha: RationalSet, Q = 60, R = 6): boolean {
  const samples: [bigint, bigint][] = [];
  for (let b = 1; b <= Q; b++) for (let a = -R * b; a <= R * b; a++) samples.push([BigInt(a), BigInt(b)]);
  const inside = samples.filter(([a, b]) => alpha(a, b));
  const outside = samples.filter(([a, b]) => !alpha(a, b));
  if (inside.length === 0 || outside.length === 0) return false;
  // 往下封闭 ⟺ 取样里没有「外面的 p < 里面的 q」⟺ 外面的最小值不小于里面的最大值
  const maxIn = inside.reduce((m, p) => (less(m, p) ? p : m));
  const minOut = outside.reduce((m, p) => (less(p, m) ? p : m));
  if (less(minOut, maxIn)) return false;
  // 没有最大元：每个成员 p 右边都有成员（在 p + k/10ʲ 上找，j 到 8）
  for (const [pa, pb] of inside) {
    let found = false;
    for (let m = 10n; m <= 100_000_000n && !found; m *= 10n) {
      for (let k = 1n; k <= 9n && !found; k++) {
        // p + k/m = (m·pa + k·pb)/(m·pb)
        if (alpha(m * pa + k * pb, m * pb)) found = true;
      }
    }
    if (!found) return false;
  }
  return true;
}

export const verification: Verification = {
  lesson: 'math.analysis.real-construction',
  notes: {
    p1:
      '按定义逐条检查：在分母不超过 60、绝对值不超过 6 的有理数上，核对非空、不是全体、往下封闭；' +
      '每个成员 p 再在 p + k/10ʲ（j ≤ 8）里找更大的成员，找不到就说明有最大元。成员关系都用 BigInt 精确判断。',
    p2: '对 k = 100, 99, … 判断 k/10 属不属于 α（p² < 5 写成 k² < 500），第一个属于的就是最大的。',
    p3:
      'α + β 按定义是 {p + q : p ∈ α, q ∈ β}：r 属于它，当且仅当有 p ∈ α 使 r − p ∈ β。' +
      '对每个选项，在分母为 10⁴ 的有理数 p 里找这样的 p（精确的整数比较）。',
    p4: 'γ = sup A 是 A 里所有分割的并：k/100 属于 γ，当且仅当有满足 r² < 3 的有理数 r > k/100；在分母为 10⁶ 的 r 里找，k 从 300 往下找第一个属于的。',
  },
  compute() {
    // p1
    const candidates: RationalSet[] = [
      (a, b) => a < -2n * b,
      (a, b) => a <= 0n || a * a <= 4n * b * b,
      (a, b) => a * a < 3n * b * b,
      (a, b) => a * a * a < 5n * b * b * b,
    ];
    const p1: number[] = [];
    candidates.forEach((alpha, i) => {
      if (isCut(alpha)) p1.push(i + 1);
    });

    // p2：α = {p < 0} ∪ {p² < 5}
    let k2 = 100;
    while (!(k2 < 0 || k2 * k2 < 500)) k2--;

    // p3：α = {p < 0} ∪ {p² < 2}，β = {p < 1}
    const D = 10_000;
    const inAlpha = (a: number): boolean => a < 0 || a * a < 2 * D * D; // p = a/D
    const inSum = (num: number, den: number): boolean => {
      // r = num/den；找 p = a/D ∈ α，使 r − p < 1，即 num·D − a·den < den·D
      for (let a = -3 * D; a <= 3 * D; a++) if (inAlpha(a) && num * D - a * den < den * D) return true;
      return false;
    };
    const options: [number, number][] = [
      [24, 10],
      [241, 100],
      [242, 100],
      [25, 10],
    ];
    const p3: number[] = [];
    options.forEach(([n, d], i) => {
      if (inSum(n, d)) p3.push(i + 1);
    });

    // p4：k/100 ∈ γ ⟺ 有有理数 r > k/100，r² < 3
    const R = 1_000_000;
    const inGamma = (k: number): boolean => {
      for (let a = (k * R) / 100 + 1; a <= 2 * R; a++) {
        if (a * a < 3 * R * R) return true;
        if (a > 0 && a * a >= 3 * R * R) break;
      }
      return false;
    };
    let k4 = 300;
    while (!inGamma(k4)) k4--;

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'number', value: k2 / 10 },
      p3: { type: 'choice', value: p3 },
      p4: { type: 'number', value: k4 / 100 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
