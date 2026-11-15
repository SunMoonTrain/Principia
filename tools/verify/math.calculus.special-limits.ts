// 独立验算 math.calculus.special-limits 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.special-limits.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { atInfinity, limitAt } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.special-limits',
  notes: {
    p1: '在 0 的两侧外推 sin 5x/(2x) 的单侧极限。',
    p2: '换成 t = ±1/x，外推 (1 + 3/x)^x 在 x → +∞、x → −∞ 时的极限，两个方向一致（不用 e 的已知值，只按原式算幂）。',
    p3: '在 0 的两侧外推 (1 − cos 4x)/(x sin x) 的单侧极限。',
    p4: '在 0 的两侧外推 (1 − 2x)^(3/x) 的单侧极限（按原式算幂）。',
  },
  compute() {
    const p1 = limitAt((x) => Math.sin(5 * x) / (2 * x), 0)!;

    const f2 = (x: number): number => (1 + 3 / x) ** x;
    const plus = atInfinity(f2, 1);
    const minus = atInfinity(f2, -1);
    if (plus.kind !== 'finite' || minus.kind !== 'finite' || Math.abs(plus.value - minus.value) > 1e-6) throw new Error('p2：两个方向不一致');
    const p2 = plus.value;

    const p3 = limitAt((x) => (1 - Math.cos(4 * x)) / (x * Math.sin(x)), 0)!;
    const p4 = limitAt((x) => (1 - 2 * x) ** (3 / x), 0)!;

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
