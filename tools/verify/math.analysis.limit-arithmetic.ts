// 独立验算 math.analysis.limit-arithmetic 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.limit-arithmetic.ts

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

export const verification: Verification = {
  lesson: 'math.analysis.limit-arithmetic',
  notes: {
    p1: '对 a_n 做 Richardson 外推（n = 1000、2000、…、16000）。',
    p2: '取两组满足条件的数列（a_n = 3 + 1/n、b_n = −2 + 2/n − 1/n²；a_n = 3 − 5/n、b_n = −2 + 1/n），分别外推，两组结果相同。',
    p3: '逐项累加 1² + … + n² 再除以 n³（不用求和公式），对它做 Richardson 外推。',
    p4: '这个数列带振荡、不能外推：在 n = 10³、10⁶、10⁹、10¹² 处直接算，确认和上一个的差一路缩小，取最后一个。',
  },
  compute() {
    // p1
    const p1 = richardson((n) => (2 * n * n + 3 * n) / (5 * n * n - 1));

    // p2：表达式 (a² − 2b)/(a + b)，a_n → 3，b_n → −2
    const g = (a: number, b: number): number => (a * a - 2 * b) / (a + b);
    const p2a = richardson((n) => g(3 + 1 / n, -2 + 2 / n - 1 / (n * n)));
    const p2b = richardson((n) => g(3 - 5 / n, -2 + 1 / n));
    if (Math.abs(p2a - p2b) > 1e-9) throw new Error('两组数列算出的极限不一样');

    // p3：(1² + 2² + … + n²)/n³
    const p3 = richardson((n) => {
      let s = 0;
      for (let k = 1; k <= n; k++) s += k * k;
      return s / n ** 3;
    });

    // p4：(n + sin n)/(2n + cos n)
    const a4 = (n: number): number => (n + Math.sin(n)) / (2 * n + Math.cos(n));
    const values = [1e3, 1e6, 1e9, 1e12].map(a4);
    const diffs = values.slice(1).map((v, i) => Math.abs(v - values[i]));
    if (!diffs.every((d, i) => i === 0 || d < diffs[i - 1] / 100)) throw new Error('p4 的数列看不出在收敛');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2a },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: values[values.length - 1] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
