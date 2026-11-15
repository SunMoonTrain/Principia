// 独立验算 math.calculus.infinitesimal-orders 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.infinitesimal-orders.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { extrapolate, limitAt, roundTo } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.infinitesimal-orders',
  notes: {
    p1: '在 0 的两侧外推 ln(1 + 4x)/sin 3x 的单侧极限（按原式算，不用等价替换）。',
    p2: '比 x 高阶即 f(x)/x → 0：六个函数逐个求 f(x)/x 在 0 处的两侧极限，存在且为 0 的入选（√|x|/x 两侧趋于 ±∞，不入选）。',
    p3: '在 0 的两侧外推原式的单侧极限（按原式算）。',
    p4: '阶数 k = lim log₂(f(2h)/f(h))，h → 0⁺ 外推，得到的数离整数不到 1e-6 才取整；再外推 f(x)/x^k 在 0 处的两侧极限得 c。',
  },
  compute() {
    const p1 = limitAt((x) => Math.log(1 + 4 * x) / Math.sin(3 * x), 0)!;

    const fs: ((x: number) => number)[] = [
      (x) => x * Math.sin(x),
      (x) => Math.sqrt(1 + x * x) - 1,
      (x) => Math.tan(2 * x),
      (x) => Math.sqrt(Math.abs(x)),
      (x) => Math.log(1 + x * x),
      (x) => x + x * x,
    ];
    const p2 = fs.flatMap((f, i) => {
      const L = limitAt((x) => f(x) / x, 0);
      return L !== null && Math.abs(L) < 1e-9 ? [i + 1] : [];
    });

    const p3 = limitAt((x) => ((Math.exp(2 * x) - 1) * Math.tan(x) ** 2) / (x * (1 - Math.cos(x))), 0)!;

    const f4 = (x: number): number => 1 - Math.cos(x) * Math.cos(2 * x);
    const kRaw = extrapolate((h) => Math.log2(f4(2 * h) / f4(h)));
    if (!kRaw.converged || Math.abs(kRaw.value - Math.round(kRaw.value)) > 1e-6) throw new Error('p4：阶数不是整数');
    const k = Math.round(kRaw.value);
    const c = limitAt((x) => f4(x) / x ** k, 0)!;
    const p4 = [roundTo(c, 12), k];

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
