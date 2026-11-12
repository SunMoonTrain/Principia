// 独立验算 math.vector-calculus.change-of-variables 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.change-of-variables.ts
// 不换元：p1 用中心差分求雅可比矩阵；p2–p4 都在原来的 x、y 里写成累次积分，用嵌套的双指数求积数值地算，边界的折点处拆开。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { det2, integrate2, integratePieces, jacobian, type Vec } from './math.vector-calculus._vc.ts';

export const verification: Verification = {
  lesson: 'math.vector-calculus.change-of-variables',
  notes: {
    p1: '中心差分求 (u, v) ↦ (2u + v, u − 3v) 的雅可比矩阵，再算行列式。',
    p2: '直角坐标：x 从 −3 到 3，y 从 −2√(1 − x²/9) 到 2√(1 − x²/9)，被积函数取 1。',
    p3: '直角坐标：x 从 1/√3 到 √2，y 从 max(x, 1/x) 到 min(3x, 2/x)；在 x = √(2/3)、1 处拆开，数值积分上下边界之差。',
    p4: '直角坐标：x 从 0 到 1，y 从 0 到 1 − x，数值积分 e^{(x−y)/(x+y)}；步长减半再算一次核对。',
  },
  compute() {
    // p1
    const F = ([u, v]: Vec): Vec => [2 * u + v, u - 3 * v];
    const p1 = det2(jacobian(F, [0.3, -0.7]));

    // p2
    const half = (x: number): number => 2 * Math.sqrt(Math.max(0, 1 - (x * x) / 9));
    const p2 = integrate2(() => 1, -3, 3, (x) => -half(x), half);

    // p3
    const width = (x: number): number => Math.max(0, Math.min(3 * x, 2 / x) - Math.max(x, 1 / x));
    const p3 = integratePieces(width, [1 / Math.sqrt(3), Math.sqrt(2 / 3), 1, Math.sqrt(2)]);

    // p4
    const g = (x: number, y: number): number => Math.exp((x - y) / (x + y));
    const p4 = integrate2(g, 0, 1, () => 0, (x) => 1 - x);
    const p4fine = integrate2(g, 0, 1, () => 0, (x) => 1 - x, 1 / 32);
    if (Math.abs(p4 - p4fine) > 1e-9) throw new Error(`p4：步长减半后结果变了 ${p4} → ${p4fine}`);

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
