// 独立验算 math.analysis.series-cauchy 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.series-cauchy.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { converges, partialSums, richardson } from './math.analysis._numeric.ts';

export const verification: Verification = {
  lesson: 'math.analysis.series-cauchy',
  notes: {
    p1: 'S₈ 逐项相加；S 对部分和 S_N 取 N = 1000·2ⁱ 做 Richardson 外推。',
    p2: '对 Σ|aₙ| 算出前 2×10⁶ 个部分和，按批次 1 的收敛判据（[m, 2m] 上的振幅一路不增、最后小于 10⁻²）判断收敛。',
    p3:
      '各项为正，固定 m 时 a_{m+1}+…+a_n 随 n 增大、趋于尾和 Σ_{k>m} a_k（取不到），所以条件 ⟺ 对所有 m ≥ N，尾和 ≤ 0.001。' +
      '尾和用 400 项算（余下的小于 2⁻⁴⁰⁰），m 从 N 查到 N + 200；再找出 N − 1 时一个具体的 m、n，和确实超过 0.001。',
    p4:
      '极值分两半。界：n 从 5 扫到 2×10⁶，取 |a₅+…+aₙ| 的最大值；n 更大时，交错级数的余项不超过下一项的绝对值，' +
      '|a₅+…+aₙ| ≤ |极限| + 1/(2×10⁶)，脚本核对这个数小于扫到的最大值。取得到：最大值出现在 n = 5。',
  },
  compute() {
    // p1：aₙ = 1/(n(n+2))
    const a1 = (n: number): number => 1 / (n * (n + 2));
    let s8 = 0;
    for (let n = 1; n <= 8; n++) s8 += a1(n);
    const partial = (N: number): number => {
      let s = 0;
      for (let n = 1; n <= N; n++) s += a1(n);
      return s;
    };
    const S1 = richardson(partial, 1000, 5);

    // p2：哪些绝对收敛
    const series = [
      (n: number) => (-1) ** n / (2 * n + 1),
      (n: number) => (-1) ** n / (n * (n + 1)),
      (n: number) => Math.cos(n) / 2 ** n,
      (n: number) => (-1) ** n * (n / (n + 1)),
    ];
    const p2: number[] = [];
    series.forEach((a, i) => {
      if (converges(partialSums(2_000_001, (n) => Math.abs(a(n))))) p2.push(i + 1);
    });

    // p3：Σ 1/2ⁿ，最小的 N
    const a3 = (k: number): number => 1 / 2 ** k;
    const tail = (m: number): number => {
      let s = 0;
      for (let k = m + 1; k <= m + 400; k++) s += a3(k);
      return s;
    };
    const ok = (N: number): boolean => {
      for (let m = N; m <= N + 200; m++) if (!(tail(m) <= 0.001)) return false;
      return true;
    };
    let N3 = 1;
    while (!ok(N3)) N3++;
    // N − 1 时找一个具体的 m、n，和超过 0.001
    let witness = false;
    for (let n = N3; n <= N3 + 60 && !witness; n++) {
      let s = 0;
      for (let k = N3; k <= n; k++) s += a3(k);
      if (s >= 0.001) witness = true;
    }
    if (!witness) throw new Error('p3：N − 1 时没找到超过 0.001 的和');

    // p4：aₖ = (−1)^{k+1}/(2k − 1)，n ≥ 5 时 |a₅+…+aₙ| 的最大值
    const a4 = (k: number): number => (-1) ** (k + 1) / (2 * k - 1);
    let block = 0;
    let best = 0;
    let bestAt = 0;
    const last = 2_000_000;
    let previous = 0;
    for (let n = 5; n <= last + 1; n++) {
      previous = block;
      block += a4(n);
      if (n <= last && Math.abs(block) > best) {
        best = Math.abs(block);
        bestAt = n;
      }
    }
    const limit = (block + previous) / 2;
    if (!(Math.abs(limit) + 1 / last < best)) throw new Error('p4：n 很大时的界没有小于扫到的最大值');
    if (bestAt !== 5) throw new Error(`p4：最大值不在 n = 5，而在 n = ${bestAt}`);

    return {
      p1: { type: 'tuple', value: [s8, S1] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: N3 },
      p4: { type: 'number', value: best },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
