// 独立验算 math.analysis.intermediate-value 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.intermediate-value.ts

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { grid, modulus } from './math.analysis._numeric.ts';

/** 在 [a, b] 上连续：格点（K = 2×10⁵，含两端）上的连续模 ω(h)，h = 10⁻³、10⁻⁵、10⁻⁷ 时一路缩小，最后小于 10⁻²。 */
function continuousOn(f: (x: number) => number, a: number, b: number): boolean {
  const xs = grid(a, b, 200_000);
  const om = [1e-3, 1e-5, 1e-7].map((h) => modulus(f, xs, h, b));
  return om.every((v, i) => i === 0 || v <= om[i - 1] + 1e-15) && om[om.length - 1] < 1e-2;
}

/** 在 [a, b] 上有零点：格点上恰好为 0，或者相邻格点变号。 */
function hasRoot(f: (x: number) => number, a: number, b: number): boolean {
  const xs = grid(a, b, 200_000);
  return xs.some((x, i) => f(x) === 0 || (i > 0 && f(xs[i - 1]) * f(x) < 0));
}

export const verification: Verification = {
  lesson: 'math.analysis.intermediate-value',
  notes: {
    p1: '数相邻已知点之间的变号次数（每个变号的区间里由零点定理至少有一个根，区间互不重叠）；再用经过这四点的折线核对这个数取得到（折线恰好这么多个根）。',
    p2: '逐个检查零点定理的两个条件：在闭区间上连续（格点上的连续模缩小到 10⁻² 以下），两端函数值异号。',
    p3: '在 [−5, 5] 上找变号求根（三次方程的根都满足 |x| ≤ 1 + max|系数| = 5）。',
    p4:
      '逐条在例子上找反例：A 用 x² − 1/4 在 [−1, 1]、(x − 0.3)(x − 0.7) 在 [0, 1]；B 用 9 个 [0, 1] 到自身的连续函数找不动点；' +
      'C 用 4 个在 (0, 1) 上连续、取到 0 和 1 的函数找取值 1/2 的点；D 用 f(0) = 0、f(1) = 1、中间 f(x) = 1 − x（取遍 [0, 1]，在 0 处不连续）。都找不到反例的才选。',
  },
  compute() {
    // p1：f(0) = 2，f(1) = −1，f(2) = 1，f(3) = −2
    const known = [2, -1, 1, -2];
    let changes = 0;
    for (let i = 1; i < known.length; i++) if (known[i - 1] * known[i] < 0) changes++;
    const piecewise = (x: number): number => {
      const i = Math.min(Math.floor(x), 2);
      return known[i] + (known[i + 1] - known[i]) * (x - i);
    };
    if (rootsOf(piecewise, 0, 3, 3001).length !== changes) throw new Error('p1：折线的根数和变号次数对不上');

    // p2：零点定理的条件
    const fs: { f: (x: number) => number; a: number; b: number }[] = [
      { f: (x) => (x === 0 ? 0 : 1 / x), a: -1, b: 1 },
      { f: (x) => x ** 3 - x - 1, a: 1, b: 2 },
      { f: (x) => x * x - 1, a: -2, b: 2 },
      { f: (x) => Math.sqrt(Math.max(x, 0)) - 0.5, a: 0, b: 1 },
    ];
    const p2 = fs.flatMap(({ f, a, b }, i) => (continuousOn(f, a, b) && f(a) * f(b) < 0 ? [i + 1] : []));

    // p3：x³ − 4x + 2 = 0 的实根个数
    const p3 = rootsOf((x) => x ** 3 - 4 * x + 2, -5, 5, 10_000).length;

    // p4
    const p4: number[] = [];
    // A：f 连续、f(a)f(b) > 0，却有零点的例子
    const A = [
      { f: (x: number) => x * x - 0.25, a: -1, b: 1 },
      { f: (x: number) => (x - 0.3) * (x - 0.7), a: 0, b: 1 },
    ];
    const counterA = A.some(({ f, a, b }) => continuousOn(f, a, b) && f(a) * f(b) > 0 && hasRoot(f, a, b));
    if (!counterA) p4.push(1);
    // B：[0, 1] 到自身的连续函数都有不动点吗
    const selfMaps: ((x: number) => number)[] = [
      (x) => x * x,
      (x) => 1 - x,
      (x) => Math.sqrt(x),
      () => 0.3,
      (x) => 0.5 + 0.5 * Math.sin(10 * x),
      (x) => 0.9 * Math.cos(x),
      (x) => 4 * x * (1 - x),
      (x) => Math.abs(Math.sin(20 * x)),
      (x) => (x < 0.5 ? 1 - 2 * x : 2 * x - 1),
    ];
    const counterB = selfMaps.some((f) => {
      const inRange = grid(0, 1, 100_000).every((x) => f(x) >= 0 && f(x) <= 1);
      if (!inRange || !continuousOn(f, 0, 1)) throw new Error('p4 B：检验函数不是 [0, 1] 到自身的连续函数');
      return !hasRoot((x) => f(x) - x, 0, 1);
    });
    if (!counterB) p4.push(2);
    // C：(0, 1) 上连续、某处取 0、某处取 1 的函数，都取到 1/2 吗（只在 (0, 1) 里找）。每个函数带上取 0、取 1 的点 p、q
    const openMaps: { f: (x: number) => number; p: number; q: number }[] = [
      { f: (x) => 3 * x - 1, p: 1 / 3, q: 2 / 3 },
      { f: (x) => Math.sin(1 / x), p: 1 / Math.PI, q: 2 / Math.PI },
      { f: (x) => Math.tan(Math.PI * (x - 0.5)), p: 0.5, q: 0.75 },
      { f: (x) => 1 / x - 2, p: 0.5, q: 1 / 3 },
    ];
    const inner = 1e-6;
    const counterC = openMaps.some(({ f, p, q }) => {
      if (!(Math.abs(f(p)) < 1e-12 && Math.abs(f(q) - 1) < 1e-12 && p > 0 && p < 1 && q > 0 && q < 1)) throw new Error('p4 C：检验函数没取到 0 或 1');
      // 这几个函数在 (0, 1) 的每一点连续是看得出来的；靠近端点时变得很陡，格点上的连续模看不出来，所以只在 p、q 之间核一下
      if (!continuousOn(f, Math.min(p, q), Math.max(p, q))) throw new Error('p4 C：检验函数在 p、q 之间不连续');
      return !hasRoot((x) => f(x) - 0.5, inner, 1 - inner);
    });
    if (!counterC) p4.push(3);
    // D：f(0) = 0，f(1) = 1，中间 f(x) = 1 − x
    const fD = (x: number): number => (x === 0 ? 0 : x === 1 ? 1 : 1 - x);
    const onto = grid(0, 1, 1000).every((y) => [0, 1, 1 - y].some((x) => x >= 0 && x <= 1 && Math.abs(fD(x) - y) < 1e-12));
    const counterD = onto && fD(0) === 0 && fD(1) === 1 && !continuousOn(fD, 0, 1);
    if (!counterD) p4.push(4);

    return {
      p1: { type: 'number', value: changes },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
