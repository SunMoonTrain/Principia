// 独立验算 math.analysis.cauchy-sequences 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.cauchy-sequences.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { amplitude, converges, seededRandom, terms } from './math.analysis._numeric.ts';

const COUNT = 2_000_000;

/** 窗口 (N, N + W] 里各项的最大值减最小值：有没有两项相距至少 ε，看它是否 ≥ ε。 */
function spread(values: Float64Array, N: number, W: number): number {
  let lo = Infinity;
  let hi = -Infinity;
  for (let n = N + 1; n <= N + W; n++) {
    if (values[n] < lo) lo = values[n];
    if (values[n] > hi) hi = values[n];
  }
  return hi - lo;
}

/** 窗口 (N, N + W] 里相邻两项之差的最大值。 */
function maxStep(values: Float64Array, N: number, W: number): number {
  let best = 0;
  for (let n = N + 1; n < N + W; n++) best = Math.max(best, Math.abs(values[n + 1] - values[n]));
  return best;
}

/** 窗口 (N, N + W] 里任意两项之差的最小值（m = n 也算，所以总是 0；照题面的量词老老实实算）。 */
function minPairGap(values: Float64Array, N: number, W: number): number {
  let best = Infinity;
  for (let m = N + 1; m <= N + W; m += 997) for (let n = N + 1; n <= N + W; n += 991) best = Math.min(best, Math.abs(values[m] - values[n]));
  return best;
}

export const verification: Verification = {
  lesson: 'math.analysis.cauchy-sequences',
  notes: {
    p1: '对 N = 1, 2, … 逐个找 N < m < n ≤ 10⁶（m ≤ N + 200）里有没有 |1/m − 1/n| ≥ 1/100，用整数比较 100(n − m) ≥ mn；第一个找不到的 N 就是答案。',
    p2:
      '把四个选项的量词在有限窗口里实现（「每个 N」取 10、10²…10⁶，「存在 m, n > N」在 (N, N + 10⁵] 里找，ε 取 1、0.1、0.01、0.001，选项 B 的「每个 ε」再加 10、100），' +
      '在 9 个检验数列上和「不是柯西列」的真值对照：柯西列 1/n、(−1)ⁿ/n、Σ1/k²、常数 1；不是柯西列的 (−1)ⁿ、√n、调和级数部分和 Hₙ、sin n、n。真值用收敛判据（[m, 2m] 上的振幅一路缩小到 10⁻² 以下）算。',
    p3: '从 a₁ = 1 按递推式迭代 200 次，取最后一项。',
    p4:
      'A、B 直接算前 2×10⁶ 项用收敛判据；C、D 是「满足条件的任意数列」，用 aₙ₊₁ = aₙ + sₙbₙ（bₙ = 1/n 或 1/n²）构造检验数列，' +
      'sₙ 取全是 +1、正负交替、随机 ±1、[−1, 1] 里的随机数、sin n 的符号五种，有一个发散就不选，都收敛才选。',
  },
  compute() {
    // p1：aₙ = 1/n。|1/m − 1/n| ≥ 1/100 ⟺ 100|n − m| ≥ mn，全是整数，比较没有误差
    const hasBadPair = (N: number): boolean => {
      for (let m = N + 1; m <= N + 200; m++) for (let n = m + 1; n <= 1_000_000; n++) if (100 * (n - m) >= m * n) return true;
      return false;
    };
    let p1 = 1;
    while (hasBadPair(p1)) p1++;

    // p2：四个选项在检验数列上的真值
    const Ns = [10, 1e2, 1e3, 1e4, 1e5, 1e6];
    const W = 100_000;
    const E = [1, 0.1, 0.01, 0.001];
    const options: ((v: Float64Array) => boolean)[] = [
      // A：存在 ε₀，对每个 N，都有 m, n > N 使 |aₘ − aₙ| ≥ ε₀
      (v) => E.some((e) => Ns.every((N) => spread(v, N, W) >= e)),
      // B：对每个 ε，都有 N 和 m, n > N 使 |aₘ − aₙ| ≥ ε
      (v) => [...E, 10, 100].every((e) => Ns.some((N) => spread(v, N, W) >= e)),
      // C：存在 ε₀ 和 N，使所有 m, n > N 都满足 |aₘ − aₙ| ≥ ε₀
      (v) => E.some((e) => Ns.some((N) => minPairGap(v, N, W) >= e)),
      // D：存在 ε₀，对每个 N，都有 n > N 使 |aₙ₊₁ − aₙ| ≥ ε₀
      (v) => E.some((e) => Ns.every((N) => maxStep(v, N, W) >= e)),
    ];
    const tests: Float64Array[] = [
      terms(COUNT, (n) => 1 / n),
      terms(COUNT, (n) => (n % 2 === 0 ? 1 : -1) / n),
      terms(COUNT, (n, prev) => (n === 1 ? 1 : prev + 1 / (n * n))),
      terms(COUNT, () => 1),
      terms(COUNT, (n) => (n % 2 === 0 ? 1 : -1)),
      terms(COUNT, (n) => Math.sqrt(n)),
      terms(COUNT, (n, prev) => (n === 1 ? 1 : prev + 1 / n)),
      terms(COUNT, (n) => Math.sin(n)),
      terms(COUNT, (n) => n),
    ];
    const notCauchy = tests.map((v) => !converges(v));
    if (notCauchy.join() !== [false, false, false, false, true, true, true, true, true].join()) throw new Error('p2：检验数列的真值和预想的不一样');
    const p2 = options.flatMap((opt, i) => (tests.every((v, j) => opt(v) === notCauchy[j]) ? [i + 1] : []));

    // p3：a₁ = 1，aₙ₊₁ = 1/(2 + aₙ)
    let a = 1;
    for (let n = 1; n < 200; n++) a = 1 / (2 + a);

    // p4
    const p4: number[] = [];
    let partial = 0;
    const A = terms(COUNT, (k) => (k <= 80 ? (partial += Math.sin(k) / 2 ** k) : partial));
    if (converges(A)) p4.push(1);
    const B = terms(COUNT, (n) => Math.sin(Math.sqrt(n)));
    if (converges(B)) p4.push(2);
    const rand = seededRandom(20261109);
    const signs: ((n: number) => number)[] = [
      () => 1,
      (n) => (n % 2 === 0 ? 1 : -1),
      () => (rand() < 0.5 ? -1 : 1),
      () => 2 * rand() - 1,
      (n) => Math.sign(Math.sin(n)),
    ];
    for (const [option, step] of [
      [3, (n: number) => 1 / n],
      [4, (n: number) => 1 / (n * n)],
    ] as const) {
      const all = signs.every((s) => {
        const v = terms(COUNT, (n, prev) => (n === 1 ? 0 : prev + s(n - 1) * step(n - 1)));
        // 累加时有舍入误差（项的大小到 15 左右，误差约 10⁻¹⁵），比较时留 10⁻¹³ 的余量
        for (let n = 1; n < COUNT; n++) if (Math.abs(v[n + 1] - v[n]) > step(n) + 1e-13) throw new Error('p4：检验数列不满足条件');
        return converges(v);
      });
      if (all) p4.push(option);
    }
    // 供核对：调和级数部分和在 [m, 2m] 上的振幅一直约为 ln 2，不缩小
    if (Math.abs(amplitude(terms(COUNT, (n, prev) => (n === 1 ? 1 : prev + 1 / n)), 1e6) - Math.LN2) > 1e-3) throw new Error('p4：调和级数的振幅不对');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: a },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
