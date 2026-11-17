// 独立验算 math.calculus.curve-sketching 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.curve-sketching.ts
import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { atInfinity, derivativeAt, extremumKind, oneSided, roundTo, sideIs } from './math.calculus._calc.ts';
import { Jet } from './math.calculus._jet.ts';

function finite(s: ReturnType<typeof oneSided>, name: string): number {
  if (s.kind !== 'finite') throw new Error(`${name}：极限不是有限数`);
  return s.value;
}

export const verification: Verification = {
  lesson: 'math.calculus.curve-sketching',
  notes: {
    p1: 'k = lim f(x)/x、b = lim (f(x) − kx)，在 x → +∞ 和 x → −∞ 两个方向都数值求一遍，两边一致才取（不做多项式除法）。',
    p2: '用 Jet 算 e^{−x²} 的二阶导数，在 [−5, 5] 上求根，并确认每个根两侧二阶导数变号。',
    p3: 'A：x → ±1 时单侧极限都是无穷，且分母只在 ±1 为零；B：x → ±∞ 的极限数值求出是 1；C：用邻域取样判断 0 处是极大还是极小（得到的是极小，C 错）；D：f(±2) = 0，且 [−10, 10] 上 f 的零点只有这两个。',
    p4: '数值导数在 [0.1, 10] 上求根（x < 0 时 f′ = 1 − 8/x³ > 0，没有驻点），用邻域取样确认是极小值点，取函数值；题目里「写出渐近线」不判分。',
  },
  compute() {
    const f1 = (x: number) => (2 * x * x + 3 * x) / (x + 1);
    const ks = [1, -1].map((s) => finite(atInfinity((x) => f1(x) / x, s as 1 | -1), 'p1 k'));
    const k = roundTo(ks[0], 9);
    if (Math.abs(ks[1] - k) > 1e-6) throw new Error('p1：两个方向的 k 不同');
    const bs = [1, -1].map((s) => finite(atInfinity((x) => f1(x) - k * x, s as 1 | -1), 'p1 b'));
    if (Math.abs(bs[0] - bs[1]) > 1e-6) throw new Error('p1：两个方向的 b 不同');

    const g2 = (x0: number) => Jet.variable(x0, 2).mul(Jet.variable(x0, 2)).neg().exp().derivative(2);
    const r2 = rootsOf(g2, -5, 5, 2001);
    for (const r of r2) if (!(g2(r - 1e-3) * g2(r + 1e-3) < 0)) throw new Error('p2：二阶导数在根两侧不变号');

    const f3 = (x: number) => (x * x - 4) / (x * x - 1);
    const A = [1, -1].every((a) => oneSided(f3, a, 1).kind === 'infinite' && oneSided(f3, a, -1).kind === 'infinite') &&
      rootsOf((x) => x * x - 1, -10, 10, 2001).map((r) => roundTo(r, 9)).join() === '-1,1';
    const B = sideIs(atInfinity(f3, 1), 1) && sideIs(atInfinity(f3, -1), 1);
    const C = extremumKind(f3, 0) === 'max';
    const zeros = rootsOf((x) => (Math.abs(x * x - 1) < 1e-9 ? null : f3(x)), -10, 10, 20001).filter((x) => Math.abs(f3(x)) < 1e-6);
    const D = Math.abs(f3(2)) < 1e-12 && Math.abs(f3(-2)) < 1e-12 && zeros.map((r) => roundTo(r, 6)).join() === '-2,2';
    const p3 = [A, B, C, D].flatMap((ok, i) => (ok ? [i + 1] : []));

    const f4 = (x: number) => x + 4 / (x * x);
    const crit = rootsOf((x) => derivativeAt(f4, x), 0.1, 10, 2001);
    const mins = crit.filter((x) => extremumKind(f4, x) === 'min');
    if (mins.length !== 1) throw new Error('p4：极小值点不是恰好一个');

    return {
      p1: { type: 'tuple', value: [k, bs[0]] },
      p2: { type: 'set', value: r2 },
      p3: { type: 'choice', value: p3 },
      p4: { type: 'number', value: f4(mins[0]) },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
