// 独立验算 math.calculus.local-extrema 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.local-extrema.ts

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { derivativeAt, roundTo } from './math.calculus._calc.ts';

/**
 * 按本节的定义（不严格的不等式）判断 x0 是不是极大值点或极小值点：
 * δ 取 10⁻¹ … 10⁻⁶，在 |x − x0| < δ 里取 2 万个点；有一个 δ 使这些点上都 f(x) ≤ f(x0)（或都 ≥）就算。
 */
function extremumKind(f: (x: number) => number, x0: number): 'max' | 'min' | null {
  const v = f(x0);
  for (let k = 1; k <= 6; k++) {
    const delta = 10 ** -k;
    let allLe = true;
    let allGe = true;
    for (let i = 0; i < 10000; i++) {
      const d = (delta * (i + 0.37)) / 10000;
      for (const x of [x0 - d, x0 + d]) {
        const w = f(x);
        if (w > v) allLe = false;
        if (w < v) allGe = false;
      }
    }
    if (allLe) return 'max';
    if (allGe) return 'min';
  }
  return null;
}

export const verification: Verification = {
  lesson: 'math.calculus.local-extrema',
  notes: {
    p1: '导数按定义外推，在 [−10, 10] 上对数值导数求根。',
    p2: '按本节「极值点」的定义（有一个邻域，里面都 f(x) ≤ f(0) 或都 ≥ f(0)，不要求严格）逐个检查五个函数，邻域半径取 10⁻¹ 到 10⁻⁶。',
    p3: '数值导数在 [−10, 10] 上求根得驻点，用邻域取样判断哪个是极大值点，取那里的函数值。',
    p4: '条件「f(2) = −4、f′(2) = 0」对 (a, b) 是一次的：在三组 (a, b) 上数值求出两个条件的值，解二元一次方程组；再用邻域取样确认 x = 2 确实是极值点。',
  },
  compute() {
    const f1 = (x: number): number => x ** 3 - 9 * x * x + 24 * x - 5;
    const p1 = rootsOf((x) => derivativeAt(f1, x), -10, 10, 2001).map((r) => roundTo(r, 9));

    const fs: ((x: number) => number)[] = [(x) => x ** 4, (x) => x ** 3 + x, (x) => Math.abs(x) + x, (x) => 1 / (1 + x * x), (x) => x * x - 2 * x];
    const p2 = fs.flatMap((f, i) => (extremumKind(f, 0) !== null ? [i + 1] : []));

    const f3 = (x: number): number => x * x * (x - 3) ** 2;
    const crit3 = rootsOf((x) => derivativeAt(f3, x), -10, 10, 2001).map((r) => roundTo(r, 9));
    const maxima = crit3.filter((x) => extremumKind(f3, x) === 'max');
    if (maxima.length !== 1) throw new Error('p3：极大值点不是恰好一个');
    const p3 = f3(maxima[0]);

    const f4 = (a: number, b: number) => (x: number): number => x ** 3 + a * x * x + b * x;
    const cond = (a: number, b: number): [number, number] => [f4(a, b)(2) + 4, derivativeAt(f4(a, b), 2)];
    const c0 = cond(0, 0);
    const ca = cond(1, 0).map((v, i) => v - c0[i]);
    const cb = cond(0, 1).map((v, i) => v - c0[i]);
    const det = ca[0] * cb[1] - ca[1] * cb[0];
    const a = roundTo((-c0[0] * cb[1] + c0[1] * cb[0]) / det, 9);
    const b = roundTo((-ca[0] * c0[1] + ca[1] * c0[0]) / det, 9);
    if (extremumKind(f4(a, b), 2) === null) throw new Error('p4：x = 2 不是极值点');
    const p4 = [a, b];

    return {
      p1: { type: 'set', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
