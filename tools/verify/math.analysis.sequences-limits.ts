// 独立验算 math.analysis.sequences-limits 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.sequences-limits.ts

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

// p2 用：在几条已知收敛与否的数列上检验一种说法。窗口：「存在 N」在 N ≤ 10⁴ 里找，「n > N 时都…」查到 n = 10⁵。
const EPS = [0.5, 0.1, 0.01, 0.001];
const N_MAX = 10_000;
const TAIL = 100_000;

/** 窗口里最后一个不满足 |a_n − L| < ε 的 n。 */
function lastOutside(a: (n: number) => number, L: number, eps: number): number {
  let last = 0;
  for (let n = 1; n <= TAIL; n++) if (!(Math.abs(a(n) - L) < eps)) last = n;
  return last;
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
  lesson: 'math.analysis.sequences-limits',
  notes: {
    p1: '逐项用整数精确比较 100·|2n − 2(n+1)| < n+1（即 |a_n − 2| < 1/100），取前 100 万项里最后一个不满足的 n。',
    p2: '把四种说法放到 7 条已知收敛与否的数列上检验（1/n、0、(−1)ⁿ、1+1/n 配 L=0 和 L=1、(−1)ⁿ/n、sin n），和「lim a_n = L」处处一致的才算等价。',
    p3: 'L：分子有理化后在 n = 10³⁰ 处算（约 5×10⁻¹⁶），取到 10⁻⁹ 得 0；N：前 100 万项里最后一个 |a_n − L| ≥ 0.1 的 n。',
    p4: '看 n ∈ [m, 2m] 上的振幅，m 从 10³ 到 10⁶ 一路缩小到 10⁻² 以下的算收敛。',
  },
  compute() {
    // p1：a_n = 2n/(n+1)，ε = 0.01
    const p1 = lastFailure((n) => !(100 * Math.abs(2 * n - 2 * (n + 1)) < n + 1));

    // p2：每条检验数列配一个 L，truth 是「lim a_n = L」的真假（按数列本身判断）
    const cases: { a: (n: number) => number; L: number; truth: boolean }[] = [
      { a: (n) => 1 / n, L: 0, truth: true },
      { a: () => 0, L: 0, truth: true },
      { a: sign, L: 1, truth: false },
      { a: (n) => 1 + 1 / n, L: 0, truth: false },
      { a: (n) => 1 + 1 / n, L: 1, truth: true },
      { a: (n) => sign(n) / n, L: 0, truth: true },
      { a: (n) => Math.sin(n), L: 0, truth: false },
    ];
    const statements: ((a: (n: number) => number, L: number) => boolean)[] = [
      // A：任给 ε 都有 N
      (a, L) => EPS.every((eps) => lastOutside(a, L, eps) <= N_MAX),
      // B：一个 N 对所有 ε 都行，等价于 n > N 时 a_n = L（|x| < ε 对所有 ε > 0 成立当且仅当 x = 0）
      (a, L) => {
        let last = 0;
        for (let n = 1; n <= TAIL; n++) if (a(n) !== L) last = n;
        return last <= N_MAX;
      },
      // C：任给 ε 都有无穷多个 n 落在里面：用「窗口后一半里还有」近似「无穷多」
      (a, L) =>
        EPS.every((eps) => {
          for (let n = TAIL / 2 + 1; n <= TAIL; n++) if (Math.abs(a(n) - L) < eps) return true;
          return false;
        }),
      // D：把 ε 换成 2ε
      (a, L) => EPS.every((eps) => lastOutside(a, L, 2 * eps) <= N_MAX),
    ];
    const p2 = statements.flatMap((s, i) => (cases.every((c) => s(c.a, c.L) === c.truth) ? [i + 1] : []));

    // p3：a_n = √(n+1) − √n，ε = 0.1
    const big = 1e30;
    const L3 = Math.round((1 / (Math.sqrt(big + 1) + Math.sqrt(big))) * 1e9) / 1e9;
    const N3 = lastFailure((n) => !(Math.abs(Math.sqrt(n + 1) - Math.sqrt(n) - L3) < 0.1));

    // p4：四个数列哪些收敛
    const seqs: ((n: number) => number)[] = [
      (n) => sign(n) / n,
      (n) => Math.sin((n * Math.PI) / 2),
      (n) => (1 + sign(n)) / Math.sqrt(n),
      (n) => n ** sign(n),
    ];
    const p4 = seqs.flatMap((a, i) => (converges(a) ? [i + 1] : []));

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [L3, N3] },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
