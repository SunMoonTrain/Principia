// 独立验算 math.calculus.limits-at-infinity 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.limits-at-infinity.ts

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { atInfinity, oneSided, roundTo, sequenceLimit, type OneSided } from './math.calculus._calc.ts';

const finite = (s: OneSided, what: string): number => {
  if (s.kind !== 'finite') throw new Error(`${what}：极限不是有限数`);
  return s.value;
};

export const verification: Verification = {
  lesson: 'math.calculus.limits-at-infinity',
  notes: {
    p1: '换成 t = ±1/x，在 t → 0⁺ 时看振幅并外推；x → +∞、x → −∞ 两个方向都算，结果一致。',
    p2: '只取整数 n：在 [10³, 2·10³]、[10⁴, 2·10⁴]、[10⁵, 2·10⁵] 的整数上看振幅缩小，再在 n = 32·2^k 上外推。',
    p3: '换成 t = −1/x，在 t → 0⁺ 时外推 √(x² + 6x) + x（直接按原式算，不先有理化）。',
    p4: '在 [−100, 100] 上求分母 x + 4 的零点，确认那里两侧的单侧极限是无穷（分子 √401 不为零）；再分别求 x → +∞、x → −∞ 的极限。',
  },
  compute() {
    const f1 = (x: number): number => (9 * x ** 3 - x + 2) / (2 * x ** 3 + 7 * x * x);
    const plus = finite(atInfinity(f1, 1), 'p1 +∞');
    const minus = finite(atInfinity(f1, -1), 'p1 −∞');
    if (Math.abs(plus - minus) > 1e-6) throw new Error('p1：两个方向的极限不同');
    const p1 = plus;

    const p2 = sequenceLimit((n) => ((n + 1) * (2 * n - 3)) / (5 * n * n + n));
    if (p2 === null) throw new Error('p2：数列不收敛');

    const p3 = finite(atInfinity((x) => Math.sqrt(x * x + 6 * x) + x, -1), 'p3');

    const f4 = (x: number): number => Math.sqrt(25 * x * x + 1) / (x + 4);
    const poles = rootsOf((x) => x + 4, -100, 100, 4001).map((r) => roundTo(r, 9));
    const vertical = poles.filter((c) => oneSided(f4, c, -1).kind === 'infinite' && oneSided(f4, c, 1).kind === 'infinite');
    if (vertical.length !== 1) throw new Error('p4：竖直渐近线不是恰好一条');
    const p4 = [vertical[0], finite(atInfinity(f4, 1), 'p4 +∞'), finite(atInfinity(f4, -1), 'p4 −∞')];

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
