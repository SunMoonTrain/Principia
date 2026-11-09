// 独立验算 math.analysis.mean-value-proofs 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.mean-value-proofs.ts

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { grid, modulus, richardson } from './math.analysis._numeric.ts';

/** 数值导数：对称差商 (f(x + h) − f(x − h))/(2h) 在 h → 0 时的极限，Richardson 外推（只用在光滑处）。 */
function d(f: (x: number) => number, x: number): number {
  return richardson((n) => (f(x + 1 / n) - f(x - 1 / n)) * (n / 2), 1000, 4);
}

/** 在 [a, b] 上连续：格点上的连续模 ω(h)（h = 10⁻³、10⁻⁵、10⁻⁷）一路缩小，最后小于 10⁻²。 */
function continuousOn(f: (x: number) => number, a: number, b: number): boolean {
  const xs = grid(a, b, 200_000);
  const om = [1e-3, 1e-5, 1e-7].map((h) => modulus(f, xs, h, b));
  return om.every((v, i) => i === 0 || v <= om[i - 1] + 1e-15) && om[om.length - 1] < 1e-2;
}

/**
 * 在开区间 (a, b) 内处处可导：在 (a, b) 的 2000 等分格点上（含区间正中），取 r = 到两端的距离的一半，
 * 看两侧差商 (f(x + h) − f(x))/h 的振幅：h 取 ±r·10⁻ᵏ·j/10（j = 1…10），k = 1、2、3 时振幅一路缩小、最后小于 10⁻²。
 * 最小的 |h| 是 r·10⁻⁴，差商的舍入误差还远小于 10⁻⁶；振幅低于 10⁻⁶ 的算作已经收敛。
 */
function differentiableOn(f: (x: number) => number, a: number, b: number): boolean {
  return grid(a, b, 2000)
    .slice(1, -1)
    .every((x) => {
      const r = Math.min(x - a, b - x) / 2;
      const amps = [1e-1, 1e-2, 1e-3].map((s) => {
        let lo = Infinity;
        let hi = -Infinity;
        for (let j = 1; j <= 10; j++) {
          for (const h of [(r * s * j) / 10, (-r * s * j) / 10]) {
            const q = (f(x + h) - f(x)) / h;
            lo = Math.min(lo, q);
            hi = Math.max(hi, q);
          }
        }
        return hi - lo;
      });
      return amps.every((v, i) => i === 0 || v <= Math.max(amps[i - 1], 1e-6)) && amps[amps.length - 1] < 1e-2;
    });
}

export const verification: Verification = {
  lesson: 'math.analysis.mean-value-proofs',
  notes: {
    p1: '用数值导数（对称差商加 Richardson 外推）解 f\'(ξ) = (f(3) − f(0))/3，在 (0, 3) 里找变号求根；只有一个根。',
    p2:
      '逐个检查罗尔定理的三个条件：闭区间上连续（格点上的连续模缩小到 10⁻² 以下）；开区间内处处可导（2000 等分格点上，两侧差商的振幅缩小到 10⁻² 以下）；两端函数值相等。',
    p3: '用数值导数解 f\'(ξ)(g(2) − g(1)) − g\'(ξ)(f(2) − f(1)) = 0，在 (1, 2) 里找变号求根；只有一个根。',
    p4:
      '把 f 离散成 [0, 4] 上 4000 段的折线，每段斜率 ≤ 3。f(1) = f(4) − Σ_{[1,4]} 斜率×段长，[1, 4] 上斜率都取 3 时最小，同时 [0, 1] 上的斜率要凑出 f(1) − f(0)。' +
      '再拿一个处处可导的例子核对这个最小值取得到：x ≤ 1 时 f = 4x² − 5x，x ≥ 1 时 f = 3x − 4（检查 f(0)、f(4)、各处导数 ≤ 3、在 1 处可导）。',
  },
  compute() {
    // p1：x³ 在 [0, 3] 上
    const f1 = (x: number): number => x ** 3;
    const slope1 = (f1(3) - f1(0)) / 3;
    const r1 = rootsOf((x) => d(f1, x) - slope1, 1e-9, 3 - 1e-9, 3000);
    if (r1.length !== 1) throw new Error(`p1：根不止一个：${r1.join(', ')}`);

    // p2：罗尔定理的条件
    const cases: { f: (x: number) => number; a: number; b: number }[] = [
      { f: (x) => Math.abs(x), a: -1, b: 1 },
      { f: (x) => x ** 3 - x, a: -1, b: 1 },
      { f: (x) => (x < 1 ? x : 0), a: 0, b: 1 },
      { f: (x) => Math.sqrt(Math.max(0, 1 - x * x)), a: -1, b: 1 },
    ];
    const p2 = cases.flatMap(({ f, a, b }, i) =>
      continuousOn(f, a, b) && differentiableOn(f, a, b) && Math.abs(f(a) - f(b)) < 1e-12 ? [i + 1] : [],
    );

    // p3：f = x³，g = x²，[1, 2]
    const f3 = (x: number): number => x ** 3;
    const g3 = (x: number): number => x * x;
    const r3 = rootsOf((x) => d(f3, x) * (g3(2) - g3(1)) - d(g3, x) * (f3(2) - f3(1)), 1 + 1e-9, 2 - 1e-9, 3000);
    if (r3.length !== 1) throw new Error(`p3：根不止一个：${r3.join(', ')}`);

    // p4：折线模型里 f(1) 的最小值
    const N = 4000;
    const h = 4 / N;
    const slopes = new Float64Array(N);
    const iOne = N / 4; // 第 iOne 个分点是 x = 1
    for (let i = iOne; i < N; i++) slopes[i] = 3; // [1, 4] 上都取最大斜率
    const fAt1 = 8 - Array.from(slopes.subarray(iOne)).reduce((s, v) => s + v * h, 0);
    for (let i = 0; i < iOne; i++) slopes[i] = (fAt1 - 0) / 1; // [0, 1] 上用常数斜率凑出 f(1) − f(0)
    if (Math.max(...slopes) > 3 + 1e-12) throw new Error('p4：折线的斜率超过 3');
    // 处处可导的例子
    const ex = (x: number): number => (x <= 1 ? 4 * x * x - 5 * x : 3 * x - 4);
    const okEx =
      Math.abs(ex(0)) < 1e-12 &&
      Math.abs(ex(4) - 8) < 1e-12 &&
      grid(0, 4, 4000).every((x) => (Math.abs(x - 1) < 1e-9 ? true : d(ex, x) <= 3 + 1e-6)) &&
      Math.abs(d((x) => ex(x), 1 - 1e-7) - 3) < 1e-3 &&
      Math.abs((ex(1 + 1e-7) - ex(1)) / 1e-7 - 3) < 1e-5 &&
      Math.abs((ex(1) - ex(1 - 1e-7)) / 1e-7 - 3) < 1e-5;
    if (!okEx || Math.abs(ex(1) - fAt1) > 1e-9) throw new Error('p4：可导的例子没有取到折线模型的最小值');

    return {
      p1: { type: 'number', value: r1[0] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: r3[0] },
      p4: { type: 'number', value: fAt1 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
