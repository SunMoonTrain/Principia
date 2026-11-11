// 独立验算 math.ode.undetermined-coefficients 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.undetermined-coefficients.ts
// 把题目给的试探解代进方程，导数用差分算，残差对待定系数是线性的，在几个点上令残差为零解出系数，再在别的点核对。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { d1, d2, solveLinear } from './math.ode._numeric.ts';

/** 试探解 y = Σ c_k φ_k 代入 y″ + a y′ + b y − g，在点 xs 上令残差为零，解出 c。 */
function fit(basis: ((x: number) => number)[], a: number, b: number, g: (x: number) => number, xs: number[], check: number[]): number[] {
  const L = (y: (x: number) => number, x: number): number => d2(y, x, 1e-3) + a * d1(y, x, 1e-3) + b * y(x);
  const A = xs.map((x) => basis.map((phi) => L(phi, x)));
  const c = solveLinear(
    A,
    xs.map((x) => g(x)),
  );
  const y = (x: number): number => basis.reduce((s, phi, k) => s + c[k] * phi(x), 0);
  for (const x of check) if (Math.abs(L(y, x) - g(x)) > 1e-6 * Math.max(1, Math.abs(g(x)))) throw new Error('试探解在别的点上不满足方程');
  return c;
}

export const verification: Verification = {
  lesson: 'math.ode.undetermined-coefficients',
  notes: {
    p1: '试探解 A，代入 y″ − 3y′ + 2y = 4，在 x = 0.3 处解出 A，再核对 x = −1、2 处也满足。',
    p2: '试探解 Ae^x，代入 y″ + 2y = e^x，在 x = 0.3 处解出 A，再核对别处。',
    p3: '试探解 Axe^x，代入 y″ − y = e^x，在 x = 0.3 处解出 A，再核对别处。',
    p4: '试探解 Ax² + Bx + C，代入 y″ + 4y = 8x²，在 x = −1、0.5、2 处解出 A、B、C，再核对 x = 3.7 处。',
  },
  compute() {
    const p1 = fit([() => 1], -3, 2, () => 4, [0.3], [-1, 2])[0];
    const p2 = fit([(x) => Math.exp(x)], 0, 2, (x) => Math.exp(x), [0.3], [-1, 2])[0];
    const p3 = fit([(x) => x * Math.exp(x)], 0, -1, (x) => Math.exp(x), [0.3], [-1, 2])[0];
    const p4 = fit([(x) => x * x, (x) => x, () => 1], 0, 4, (x) => 8 * x * x, [-1, 0.5, 2], [3.7]);
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
