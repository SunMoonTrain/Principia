// 独立验算 math.analysis.differentiability 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.differentiability.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { grid, richardson } from './math.analysis._numeric.ts';

/** 差商 (f(a + h) − f(a))/h 在 h → 0 时的极限：Richardson 外推（只适用于光滑的函数）。side = −1 时只看左侧。 */
function derivative(f: (x: number) => number, a: number, side: 1 | -1 = 1): number {
  return richardson((n) => (f(a + side / n) - f(a)) * (n * side), 1000);
}

/**
 * 在 a 处可导：差商 (f(a + h) − f(a))/h 在 0 < |h| < δ 的格点上的振幅（最大减最小），
 * δ 取 10⁻²、10⁻⁴、10⁻⁶ 时一路缩小、最后小于 10⁻²（差商的极限存在的柯西准则）。
 */
function differentiableAt(f: (x: number) => number, a: number): boolean {
  const amps = [1e-2, 1e-4, 1e-6].map((delta) => {
    let lo = Infinity;
    let hi = -Infinity;
    for (const h of grid(-delta, delta, 200_001)) {
      if (h === 0) continue;
      const q = (f(a + h) - f(a)) / h;
      lo = Math.min(lo, q);
      hi = Math.max(hi, q);
    }
    return hi - lo;
  });
  return amps.every((v, i) => i === 0 || v <= amps[i - 1] + 1e-12) && amps[amps.length - 1] < 1e-2;
}

export const verification: Verification = {
  lesson: 'math.analysis.differentiability',
  notes: {
    p1: '差商在 h → 0 时的极限用 Richardson 外推求出 A；再直接算 r(0.1)/0.1 = (f(1.1) − f(1) − 0.1A)/0.1。',
    p2: '对每个函数，在 0 < |h| < δ 的 2×10⁵ 个格点上看差商的振幅，δ = 10⁻²、10⁻⁴、10⁻⁶ 时是否缩小到 10⁻² 以下。',
    p3: '数值求出左侧那一段在 1 处的值和左导数；连续要求右边那一段在 1 处的极限等于 f(1)，可导要求斜率 a 等于左导数，由此定出 a、b，再用 p2 的办法核对拼起来的函数在 1 处确实可导。',
    p4: '取 5 个在 a 处导数为 3 的函数（3x、3x + x²、sin 3x、e^{3x} − 1、3x + x³，a = 0 或 1），对 (f(a + 2h) − f(a − h))/h 做 Richardson 外推，5 个结果都一样才取它。',
  },
  compute() {
    // p1：f(x) = x³ − x，a = 1
    const f1 = (x: number): number => x ** 3 - x;
    const A = derivative(f1, 1);
    const ratio = (f1(1.1) - f1(1) - 0.1 * A) / 0.1;

    // p2：哪些在 0 处可导
    const fs: ((x: number) => number)[] = [
      (x) => Math.abs(x),
      (x) => x * Math.abs(x),
      (x) => Math.cbrt(x),
      (x) => (x === 0 ? 0 : x * x * Math.sin(1 / x)),
    ];
    const p2 = fs.flatMap((f, i) => (differentiableAt(f, 0) ? [i + 1] : []));

    // p3：x ≤ 1 时 x²，x > 1 时 ax + b
    const left = (x: number): number => x * x;
    const slope = derivative(left, 1, -1);
    const a3 = slope;
    const b3 = left(1) - a3;
    const glued = (x: number): number => (x <= 1 ? left(x) : a3 * x + b3);
    if (!differentiableAt(glued, 1)) throw new Error('p3：定出的 a、b 拼起来在 1 处不可导');

    // p4：f'(a) = 3 时 lim (f(a + 2h) − f(a − h))/h
    const cases: [(x: number) => number, number][] = [
      [(x) => 3 * x, 0],
      [(x) => 3 * x + x * x, 0],
      [(x) => Math.sin(3 * x), 0],
      [(x) => Math.exp(3 * x) - 1, 0],
      [(x) => 3 * x + (x - 1) ** 3, 1],
    ];
    const limits = cases.map(([f, a]) => {
      if (Math.abs(derivative(f, a) - 3) > 1e-8) throw new Error('p4：检验函数在 a 处的导数不是 3');
      return richardson((n) => (f(a + 2 / n) - f(a - 1 / n)) * n, 1000);
    });
    if (limits.some((v) => Math.abs(v - limits[0]) > 1e-7)) throw new Error(`p4：不同函数给出的极限不一样：${limits.join(', ')}`);

    return {
      p1: { type: 'tuple', value: [A, ratio] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [a3, b3] },
      p4: { type: 'number', value: limits[0] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
