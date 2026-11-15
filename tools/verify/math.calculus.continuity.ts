// 独立验算 math.calculus.continuity 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.continuity.ts

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { limitAt, oneSided, roundTo } from './math.calculus._calc.ts';

type Kind = 'continuous' | 'removable' | 'jump' | 'infinite' | 'other';

/** 按两侧极限给 a 点分类；value 是 f(a)，没有定义时为 NaN。 */
function classify(f: (x: number) => number, a: number, value: number): Kind {
  const l = oneSided(f, a, -1);
  const r = oneSided(f, a, 1);
  if (l.kind === 'infinite' || r.kind === 'infinite') return 'infinite';
  if (l.kind !== 'finite' || r.kind !== 'finite') return 'other';
  if (Math.abs(l.value - r.value) > 1e-6) return 'jump';
  return Number.isFinite(value) && Math.abs(value - r.value) <= 1e-9 ? 'continuous' : 'removable';
}

export const verification: Verification = {
  lesson: 'math.calculus.continuity',
  notes: {
    p1: '连续要求 k 等于 x → 1 时 (x³ − 1)/(x − 1) 的极限，两侧外推求出。',
    p2: '五个函数在 0 的两侧分别求单侧极限（⌊x⌋² 用 Math.floor 再平方），两侧都有限而不相等的算跳跃间断点。',
    p3: '两个接缝处的条件「左极限 = 右极限 = 函数值」对 (a, b) 是一次的：在 (0,0)、(1,0)、(0,1) 三组取值上数值求出两个条件的值，解二元一次方程组，再代回检查 x = 1、2 处两侧极限都等于函数值。',
    p4: '有理函数在定义域内连续，间断点只可能在分母 x³ − x 的零点：在 [−10, 10] 上求根，再按两侧极限分类，有限的算可去，无穷的算无穷间断点。',
  },
  compute() {
    const p1 = limitAt((x) => (x ** 3 - 1) / (x - 1), 1)!;

    const fs: ((x: number) => number)[] = [
      (x) => x / Math.abs(x) + x,
      (x) => (x * x + x) / x,
      (x) => 1 / (x * x - x),
      (x) => Math.floor(x) ** 2,
      (x) => (Math.abs(x) / x) * x,
    ];
    const p2 = fs.flatMap((f, i) => (classify(f, 0, f(0)) === 'jump' ? [i + 1] : []));

    // p3：conditions(a, b) = [x=1 处左极限 − f(1)，x=2 处右极限 − f(2)]
    const piece = (a: number, b: number) => (x: number): number => (x < 1 ? a * x + b : x <= 2 ? x * x + 1 : b * x + a);
    const conditions = (a: number, b: number): [number, number] => {
      const f = piece(a, b);
      const l1 = oneSided(f, 1, -1);
      const r2 = oneSided(f, 2, 1);
      if (l1.kind !== 'finite' || r2.kind !== 'finite') throw new Error('p3：接缝处极限不存在');
      return [l1.value - f(1), r2.value - f(2)];
    };
    const c0 = conditions(0, 0);
    const ca = conditions(1, 0).map((v, i) => v - c0[i]);
    const cb = conditions(0, 1).map((v, i) => v - c0[i]);
    const det = ca[0] * cb[1] - ca[1] * cb[0];
    const a = roundTo((-c0[0] * cb[1] + c0[1] * cb[0]) / det, 9);
    const b = roundTo((-ca[0] * c0[1] + ca[1] * c0[0]) / det, 9);
    const f3 = piece(a, b);
    if (classify(f3, 1, f3(1)) !== 'continuous' || classify(f3, 2, f3(2)) !== 'continuous') throw new Error('p3：代回后不连续');
    const p3 = [a, b];

    const f4 = (x: number): number => (x * x - 1) / (x ** 3 - x);
    const poles = rootsOf((x) => x ** 3 - x, -10, 10, 4001).map((r) => roundTo(r, 9));
    const kinds = poles.map((x0) => classify(f4, x0, f4(x0)));
    if (kinds.some((k) => k === 'continuous' || k === 'other')) throw new Error('p4：分类意外');
    const p4 = [poles.length, kinds.filter((k) => k === 'removable').length];

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
