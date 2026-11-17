// 独立验算 math.calculus.monotonicity 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.monotonicity.ts
import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { derivativeAt, extremumKind, roundTo } from './math.calculus._calc.ts';

/** 在 [lo, hi] 的格点上，相邻两点的函数值是否都严格增大（步长 step）。 */
function strictlyIncreasingOnGrid(f: (x: number) => number, lo: number, hi: number, step: number): boolean {
  let prev = f(lo);
  for (let x = lo + step; x <= hi; x += step) {
    const v = f(x);
    if (!(v > prev)) return false;
    prev = v;
  }
  return true;
}

export const verification: Verification = {
  lesson: 'math.calculus.monotonicity',
  notes: {
    p1: '数值导数在 [−10, 10] 上求根，得到两个分界点；在两点之间的格点上检查 f 严格减小，在两点外侧各 0.5 的范围里检查 f 增大（所以区间不能再往外扩）。',
    p2: '数值导数在 [−10, 10] 上求根得驻点，用邻域取样判断是不是极小值点，取那里的函数值。',
    p3: '在 [−20, 20] 上步长 10⁻³ 的格点上逐对检查函数值严格增大（x + sin x 在 π 的奇数倍处导数为 0，相邻两点的差约是 h³/6，仍为正）；B 在 [−1, −1/2]、C 在 [−1, 0] 上减小，是反例。',
    p4: '条件「f(2) = −10、f′(2) = 0」对 (a, b) 是一次的：在三组 (a, b) 上数值求出两个条件的值，解方程组；再用邻域取样判断 x = 2 是极小值点（题目要判断的类型，脚本里确认了，答案只比 (a, b)）。',
  },
  compute() {
    const f1 = (x: number) => 2 * x ** 3 - 3 * x * x - 12 * x + 5;
    const r1 = rootsOf((x) => derivativeAt(f1, x), -10, 10, 2001).map((r) => roundTo(r, 9));
    if (r1.length !== 2) throw new Error(`p1：导数的零点不是两个：${r1}`);
    const [a1, b1] = r1;
    if (!(strictlyIncreasingOnGrid((x) => -f1(x), a1, b1, 1e-3))) throw new Error('p1：两零点之间 f 不是严格递减');
    if (!(f1(a1 - 0.5) < f1(a1) && f1(b1 + 0.5) > f1(b1))) throw new Error('p1：区间外侧 f 不增大');

    const f2 = (x: number) => x * Math.exp(x);
    const r2 = rootsOf((x) => derivativeAt(f2, x), -10, 10, 2001);
    const mins = r2.filter((x) => extremumKind(f2, x) === 'min');
    if (mins.length !== 1) throw new Error('p2：极小值点不是恰好一个');
    const p2 = f2(mins[0]);

    const fs3: ((x: number) => number)[] = [(x) => x + Math.sin(x), (x) => x * x + x, (x) => Math.exp(x) - x, (x) => x ** 5 + x ** 3 + x];
    const p3 = fs3.flatMap((f, i) => (strictlyIncreasingOnGrid(f, -20, 20, 1e-3) ? [i + 1] : []));

    const f4 = (a: number, b: number) => (x: number) => x ** 3 + a * x * x + b * x;
    const cond = (a: number, b: number): [number, number] => [f4(a, b)(2) + 10, derivativeAt(f4(a, b), 2)];
    const c0 = cond(0, 0);
    const ca = cond(1, 0).map((v, i) => v - c0[i]);
    const cb = cond(0, 1).map((v, i) => v - c0[i]);
    const det = ca[0] * cb[1] - ca[1] * cb[0];
    const a = roundTo((-c0[0] * cb[1] + c0[1] * cb[0]) / det, 9);
    const b = roundTo((-ca[0] * c0[1] + ca[1] * c0[0]) / det, 9);
    if (extremumKind(f4(a, b), 2) !== 'min') throw new Error('p4：x = 2 不是极小值点');

    return {
      p1: { type: 'tuple', value: [a1, b1] },
      p2: { type: 'number', value: p2 },
      p3: { type: 'choice', value: p3 },
      p4: { type: 'tuple', value: [a, b] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
