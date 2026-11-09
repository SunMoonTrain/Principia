// 独立验算 math.analysis.subsequences 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.subsequences.ts

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

const sign = (n: number): number => (n % 2 === 0 ? 1 : -1);

export const verification: Verification = {
  lesson: 'math.analysis.subsequences',
  notes: {
    p1: '把偶数项、奇数项各自看成 k 的数列 a_{2k}、a_{2k−1}，分别做 Richardson 外推。',
    p2: '写出每个选项的下标 n_k（k ≤ 1000），严格递增的才是子列。',
    p3: '取 n ∈ [10⁷, 10⁷ + 3×10⁴] 的项排序，按间隔大于 0.01 分成几簇（每簇是一个收敛子列的项），每簇取平均，取到 10⁻⁶。',
    p4: '按题目的规则二分 3 次；「含无穷多项」用「有第 10⁵ 到 10⁶ 项里的项落在里面」判断。',
  },
  compute() {
    // p1：a_n = (−1)ⁿ + 1/n
    const a1 = (n: number): number => sign(n) + 1 / n;
    const even = richardson((k) => a1(2 * k));
    const odd = richardson((k) => a1(2 * k - 1));

    // p2：每个选项的第 k 项是 a 的第几项
    const indices: ((k: number) => number)[] = [
      (k) => k * k,
      (k) => (k % 2 === 1 ? k + 1 : k - 1),
      (k) => 2 * k,
      (k) => Math.ceil(k / 2),
    ];
    const p2 = indices.flatMap((idx, i) => {
      for (let k = 1; k < 1000; k++) if (!(idx(k + 1) > idx(k))) return [];
      return [i + 1];
    });

    // p3：a_n = n/(n+1)·cos(2nπ/3)，收敛子列的极限
    const a3 = (n: number): number => (n / (n + 1)) * Math.cos((2 * n * Math.PI) / 3);
    const tail: number[] = [];
    for (let n = 1e7; n <= 1e7 + 3e4; n++) tail.push(a3(n));
    tail.sort((x, y) => x - y);
    const clusters: number[][] = [[tail[0]]];
    for (let i = 1; i < tail.length; i++) {
      if (tail[i] - tail[i - 1] > 0.01) clusters.push([]);
      clusters[clusters.length - 1].push(tail[i]);
    }
    const p3 = clusters.map((c) => Math.round((c.reduce((s, x) => s + x, 0) / c.length) * 1e6) / 1e6);

    // p4：a_n = (−1)ⁿ(1 + 1/n)，I₁ = [−2, 2]，两半都含无穷多项时留右半
    const a4 = (n: number): number => sign(n) * (1 + 1 / n);
    const infinitelyMany = (l: number, r: number): boolean => {
      for (let n = 1e5; n <= 1e6; n++) if (l <= a4(n) && a4(n) <= r) return true;
      return false;
    };
    let I: [number, number] = [-2, 2];
    for (let k = 1; k < 4; k++) {
      const m = (I[0] + I[1]) / 2;
      I = infinitelyMany(m, I[1]) ? [m, I[1]] : [I[0], m];
      if (!infinitelyMany(I[0], I[1])) throw new Error('两半都只含有限多项，不可能');
    }

    return {
      p1: { type: 'tuple', value: [even, odd] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'set', value: p3 },
      p4: { type: 'tuple', value: I },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
