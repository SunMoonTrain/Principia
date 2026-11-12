// 独立验算 math.vector-calculus.legendre-transform 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.legendre-transform.ts
// 不解 f'(x) = p：用 f*(p) = max_x (px − f(x)) 这个刻画，在 x 的范围里用黄金分割法求最大值；再核对最大值点处 f' = p。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { argMin, derivative } from './math.vector-calculus._vc.ts';

/** f*(p) = max_x (px − f(x))，x 在 [a, b] 里；并核对最大值点不在区间端点、那里 f' = p。 */
function legendre(f: (x: number) => number, p: number, a: number, b: number): number {
  const x = argMin((s) => -(p * s - f(s)), a, b);
  if (Math.abs(x - a) < 1e-6 || Math.abs(x - b) < 1e-6) throw new Error('最大值点在区间端点上');
  if (Math.abs(derivative(f, x) - p) > 1e-5) throw new Error("最大值点处 f' ≠ p");
  return p * x - f(x);
}

export const verification: Verification = {
  lesson: 'math.vector-calculus.legendre-transform',
  notes: {
    p1: '在 [−100, 100] 上用黄金分割法求 6x − x² 的最大值；核对最大值点处 f′ = 6。',
    p2: '同上，求 8x − (3x² + 2x) 的最大值。',
    p3: '在 (0, 100] 上求 8x − x⁴/4 的最大值。',
    p4: '在 (0, 100] 上求 −x/2 + ln x 的最大值。',
  },
  compute() {
    const p1 = legendre((x) => x * x, 6, -100, 100);
    const p2 = legendre((x) => 3 * x * x + 2 * x, 8, -100, 100);
    const p3 = legendre((x) => x ** 4 / 4, 8, 1e-9, 100);
    const p4 = legendre((x) => -Math.log(x), -0.5, 1e-9, 100);
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
