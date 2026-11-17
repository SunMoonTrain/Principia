// 独立验算 math.calculus.mean-value-theorem 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.mean-value-theorem.ts

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { bisect, derivativeAt, integrate, roundTo } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.mean-value-theorem',
  notes: {
    p1: '弦的斜率 (√9 − √1)/8；√x 的数值导数在 (1, 9) 内递减，二分解 f′(ξ) = 弦的斜率。',
    p2: '数值导数在 (−2, 2) 内求根。',
    p3: '弦的斜率 (ln e − ln 1)/(e − 1)；ln x 的数值导数在 (1, e) 内递减，二分解 f′(ξ) = 弦的斜率。',
    p4: '极值题分两半：界 f(2) = f(0) + ∫₀² f′，|f′| ≤ 3 时积分在 [−6, 6] 里（数值积分 ±3 得界）；再拿 f = 1 + 3x、f = 1 − 3x 核对界取得到。另取 f′ = 3sin(ωx + φ) 等 200 个满足条件的函数，确认 f(2) 都不出界。',
  },
  compute() {
    const slope1 = (Math.sqrt(9) - Math.sqrt(1)) / 8;
    const p1 = bisect((x) => derivativeAt(Math.sqrt, x) - slope1, 1.001, 8.999, 80);

    const f2 = (x: number): number => x ** 3 - 4 * x;
    const p2 = rootsOf((x) => derivativeAt(f2, x), -1.999, 1.999, 2001).map((r) => roundTo(r, 9));

    const slope3 = (Math.log(Math.E) - Math.log(1)) / (Math.E - 1);
    const p3 = bisect((x) => derivativeAt(Math.log, x) - slope3, 1.001, Math.E - 0.001, 80);

    const hi = 1 + integrate(() => 3, 0, 2);
    const lo = 1 + integrate(() => -3, 0, 2);
    const fHi = (x: number): number => 1 + 3 * x;
    const fLo = (x: number): number => 1 - 3 * x;
    const attained = Math.abs(fHi(2) - hi) < 1e-9 && Math.abs(fLo(2) - lo) < 1e-9 && Math.abs(derivativeAt(fHi, 1)) <= 3 + 1e-9 && Math.abs(derivativeAt(fLo, 1)) <= 3 + 1e-9;
    if (!attained) throw new Error('p4：界取不到');
    for (let i = 0; i < 200; i++) {
      const w = 0.1 + i * 0.37;
      const phi = i * 1.7;
      const v = 1 + integrate((x) => 3 * Math.sin(w * x + phi), 0, 2);
      if (v > hi + 1e-9 || v < lo - 1e-9) throw new Error('p4：有满足条件的函数出界');
    }
    const p4 = [hi, lo];

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'set', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
