// 独立验算 math.vector-calculus.inverse-implicit 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.inverse-implicit.ts
// 不用隐函数、反函数的求导公式：隐函数用二分法逐点解出来再差分；反函数用牛顿法逐点解 f(u,v) = (a,b)，再对 (a,b) 差分。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect, derivative, det2, jacobian, newton, type Vec } from './math.vector-calculus._vc.ts';

export const verification: Verification = {
  lesson: 'math.vector-calculus.inverse-implicit',
  notes: {
    p1: '对 x = 1 ± h，在 y ∈ [0.5, 1.5] 里二分解 x² + xy + y² = 3，再中心差分。',
    p2: '中心差分求 (u, v) ↦ (u + v, uv) 在 (2,1) 处的雅可比矩阵，再算行列式。',
    p3: '对 (1 ± h, 1)、(1, 1 ± h)，在 z ∈ [0.5, 1.5] 里二分解 xyz + z³ = 2，再中心差分。',
    p4: '对 (a, b) 在 (0, 2) 附近取值，从 (1,1) 出发用牛顿法解 u² − v² = a、2uv = b，再对 a、b 中心差分，按行排开。',
  },
  compute() {
    // p1
    const yOf = (x: number): number => bisect((y) => x * x + x * y + y * y - 3, 0.5, 1.5);
    if (Math.abs(yOf(1) - 1) > 1e-12) throw new Error('p1：曲线不过 (1,1)');
    const p1 = derivative(yOf, 1);

    // p2
    const p2 = det2(jacobian(([u, v]: Vec): Vec => [u + v, u * v], [2, 1]));

    // p3
    const zOf = (x: number, y: number): number => bisect((z) => x * y * z + z ** 3 - 2, 0.5, 1.5);
    if (Math.abs(zOf(1, 1) - 1) > 1e-12) throw new Error('p3：曲面不过 (1,1,1)');
    const p3 = [derivative((x) => zOf(x, 1), 1), derivative((y) => zOf(1, y), 1)];

    // p4
    const inverse = ([a, b]: Vec): Vec => newton(([u, v]) => [u * u - v * v - a, 2 * u * v - b], [1, 1]);
    const back = inverse([0, 2]);
    if (Math.hypot(back[0] - 1, back[1] - 1) > 1e-10) throw new Error('p4：f⁻¹(0,2) 不是 (1,1)');
    const p4 = jacobian(inverse, [0, 2], 1e-5).flat();

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
