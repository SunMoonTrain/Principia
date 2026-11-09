// 独立验算 math.analysis.nested-intervals 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.nested-intervals.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/**
 * 按题目的规则二分：从 [a, b] 出发，keepRight(m) 为真时留下 [m, b]，否则留下 [a, m]。
 * 返回第 1 到第 count 个区间。端点都是二进制小数，浮点数算起来没有误差。
 */
function bisect(a: number, b: number, keepRight: (m: number) => boolean, count: number): [number, number][] {
  const intervals: [number, number][] = [[a, b]];
  while (intervals.length < count) {
    const [l, r] = intervals[intervals.length - 1];
    const m = (l + r) / 2;
    intervals.push(keepRight(m) ? [m, r] : [l, m]);
  }
  return intervals;
}

interface Family {
  left: (n: number) => number;
  right: (n: number) => number;
  closed: boolean;
}

/** 区间族里所有区间的公共点：恰好一个时返回 1，没有时返回 0，不止一个时返回 2。只查 n ≤ 10⁶ 的区间。 */
function commonPoints(f: Family): 0 | 1 | 2 {
  const N = 1_000_000;
  const inside = (x: number, n: number): boolean =>
    f.closed ? f.left(n) <= x && x <= f.right(n) : f.left(n) < x && x < f.right(n);
  const inAll = (x: number): boolean => {
    for (let n = 1; n <= N; n++) if (!inside(x, n)) return false;
    return true;
  };
  // 左端点的上确界 L、右端点的下确界 R：在 n = 10⁹ 处算，取到 10⁻⁶
  const L = Math.round(f.left(1e9) * 1e6) / 1e6 + 0;
  const R = Math.round(f.right(1e9) * 1e6) / 1e6 + 0;
  if (R - L > 1e-6) {
    // 公共点只能在 [L, R] 里；L < R 时看它中间的两个点是不是都在所有区间里
    return inAll(L + (R - L) / 3) && inAll(L + (2 * (R - L)) / 3) ? 2 : 0;
  }
  // L = R：公共点最多一个，就是它
  return inAll(L) ? 1 : 0;
}

export const verification: Verification = {
  lesson: 'math.analysis.nested-intervals',
  notes: {
    p1: '按题目的规则（m² ≤ 3 留右半）从 [1, 2] 二分 3 次，取第 4 个区间。',
    p2: '对每个区间族，算出左端点的上确界 L 和右端点的下确界 R：L = R 时检查这一点是否在前 10⁶ 个区间里，L < R 时检查中间的点。',
    p3: '按题目的规则（f(m) < 0 留右半）从 [0, 1] 二分 4 次，取第 5 个区间。',
    p4: '从 [1, 2] 起对 √2 实际二分（m² ≤ 2 留右半），中点到区间里最远的点的距离是区间长度的一半，找第一个小于 10⁻⁶ 的 n。',
  },
  compute() {
    // p1：二分逼近 √3
    const p1 = bisect(1, 2, (m) => m * m <= 3, 4)[3];

    // p2：四个区间族，哪些的公共点恰好一个
    const families: Family[] = [
      { left: (n) => -1 / n, right: (n) => 1 / n, closed: true },
      { left: () => 0, right: (n) => 1 / n, closed: false },
      { left: () => 0, right: (n) => 1 + 1 / n, closed: true },
      { left: (n) => 1 - 1 / n, right: (n) => 1 + 1 / (n * n), closed: true },
    ];
    const p2 = families.flatMap((f, i) => (commonPoints(f) === 1 ? [i + 1] : []));

    // p3：f(x) = x³ + x − 1 的二分
    const f = (x: number): number => x ** 3 + x - 1;
    const p3 = bisect(0, 1, (m) => f(m) < 0, 5)[4];

    // p4：二分逼近 √2，只知道 √2 在区间里时，|c_n − √2| 最坏是区间长度的一半
    const intervals = bisect(1, 2, (m) => m * m <= 2, 40);
    const p4 = intervals.findIndex(([l, r]) => (r - l) / 2 < 1e-6) + 1;
    // 题目说第 n 个区间的长度是 1/2^(n−1)，核对一下
    if (!intervals.every(([l, r], i) => r - l === 1 / 2 ** i)) throw new Error('区间长度和题目说的不一样');

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
