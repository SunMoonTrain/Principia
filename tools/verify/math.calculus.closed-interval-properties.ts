// 独立验算 math.calculus.closed-interval-properties 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.closed-interval-properties.ts

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';

export const verification: Verification = {
  lesson: 'math.calculus.closed-interval-properties',
  notes: {
    p1: '零点定理能断定有根，要求区间两端的函数值异号：逐个区间算端点值。另用求根核对这个三次方程的三个实根确实各落在选出的区间里。',
    p2: '照题意做两步二分：算中点的函数值，留下两端异号的那一半。',
    p3: '「能断定」要对所有满足条件的连续函数成立：取四个检验函数 2 − 2x、2 − 2x ± 5 sin(πx/3)、2 − 2x + 3 sin(2πx/3)（都满足 f(0) = 2、f(3) = −4），对 [−20, 20] 里每个整数 c 在开区间 (0, 3) 内求 f(x) = c 的根，数出四个函数都有根的 c；它们都在 (−4, 2) 里，介值定理保证 (−4, 2) 里的 c 对任何这样的 f 都有解。',
    p4: '在 [−3, 3] 上取 600001 个格点求最小、最大值；最小值在 [−2, 1] 上取到，最大值在端点取到，格点包含这些点。',
  },
  compute() {
    const f1 = (x: number): number => x ** 3 - 4 * x + 1;
    const intervals: [number, number][] = [[-3, -2], [-2, -1], [-1, 0], [0, 1], [1, 2]];
    const p1 = intervals.flatMap(([a, b], i) => (f1(a) * f1(b) < 0 ? [i + 1] : []));
    const roots = rootsOf(f1, -10, 10, 4001);
    if (roots.length !== 3 || !roots.every((r) => p1.some((i) => intervals[i - 1][0] < r && r < intervals[i - 1][1]))) throw new Error('p1：根和区间对不上');

    const g = (x: number): number => x * x - 3;
    let [lo, hi] = [1, 2];
    for (let step = 0; step < 2; step++) {
      const m = (lo + hi) / 2;
      if (g(lo) * g(m) < 0) hi = m;
      else lo = m;
    }
    const p2 = [lo, hi];

    const tests: ((x: number) => number)[] = [
      (x) => 2 - 2 * x,
      (x) => 2 - 2 * x + 5 * Math.sin((Math.PI * x) / 3),
      (x) => 2 - 2 * x - 5 * Math.sin((Math.PI * x) / 3),
      (x) => 2 - 2 * x + 3 * Math.sin((2 * Math.PI * x) / 3),
    ];
    for (const f of tests) if (Math.abs(f(0) - 2) > 1e-12 || Math.abs(f(3) + 4) > 1e-12) throw new Error('p3：检验函数端点值不对');
    const hasSolution = (f: (x: number) => number, c: number): boolean => rootsOf((x) => f(x) - c, 1e-9, 3 - 1e-9, 30000).length > 0;
    const sure: number[] = [];
    for (let c = -20; c <= 20; c++) if (tests.every((f) => hasSolution(f, c))) sure.push(c);
    if (!sure.every((c) => c > -4 && c < 2)) throw new Error('p3：有 c 不在 (−4, 2) 里');
    const p3 = sure.length;

    const f4 = (x: number): number => Math.abs(x - 1) + Math.abs(x + 2);
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i <= 600000; i++) {
      const v = f4(-3 + i * 1e-5);
      min = Math.min(min, v);
      max = Math.max(max, v);
    }
    const p4 = [min, max];

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
