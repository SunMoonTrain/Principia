// 独立验算 math.vector-calculus.differentiability 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.differentiability.ts
// 偏导数用中心差分数值求；再核对线性近似的误差确实比位移小得多（误差和位移平方同阶）。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { partial, type Fn } from './math.vector-calculus._vc.ts';

export const verification: Verification = {
  lesson: 'math.vector-calculus.differentiability',
  notes: {
    p1: '中心差分求 (1,2) 处的两个偏导数，dz = z_x·dx + z_y·dy；核对和真实改变量相差的量级是位移的平方。',
    p2: '中心差分求 (1,1) 处的偏导数作 A、B，C = f(1,1) − A − B；核对切平面在 (1,1) 附近和曲面的高度差比位移小得多。',
    p3: '把 √(x² + y²) 在 (3,4) 处线性近似：中心差分求偏导数，代入 dx = 0.02、dy = −0.03。',
    p4: '中心差分求 (2,3) 处的偏导数，误差上界 = |z_x|·0.01 + |z_y|·0.02；再在误差框的四个角上算真实改变量，核对最大的那个和它只差二阶小量。',
  },
  compute() {
    // p1
    const f1: Fn = ([x, y]) => x * x * y + 3 * y;
    const a1 = [1, 2];
    const dz = partial(f1, a1, 0) * 0.1 + partial(f1, a1, 1) * -0.2;
    const actual1 = f1([1.1, 1.8]) - f1(a1);
    if (Math.abs(actual1 - dz) > 0.1) throw new Error('p1：近似太差');

    // p2
    const f2: Fn = ([x, y]) => x * x + 2 * y * y;
    const A = partial(f2, [1, 1], 0);
    const B = partial(f2, [1, 1], 1);
    const C = f2([1, 1]) - A - B;
    for (const d of [1e-2, 1e-3]) {
      const gap = Math.abs(f2([1 + d, 1 - d]) - (A * (1 + d) + B * (1 - d) + C));
      if (gap > 10 * d * d) throw new Error('p2：切平面不贴近曲面');
    }

    // p3
    const f3: Fn = ([x, y]) => Math.hypot(x, y);
    const p3 = f3([3, 4]) + partial(f3, [3, 4], 0) * 0.02 + partial(f3, [3, 4], 1) * -0.03;

    // p4
    const f4: Fn = ([x, y]) => x * y * y;
    const p4 = Math.abs(partial(f4, [2, 3], 0)) * 0.01 + Math.abs(partial(f4, [2, 3], 1)) * 0.02;
    const corners = [
      [0.01, 0.02],
      [0.01, -0.02],
      [-0.01, 0.02],
      [-0.01, -0.02],
    ].map(([dx, dy]) => Math.abs(f4([2 + dx, 3 + dy]) - f4([2, 3])));
    if (Math.abs(Math.max(...corners) - p4) > 0.01) throw new Error('p4：和真实的最大改变量差得太多');

    return {
      p1: { type: 'number', value: dz },
      p2: { type: 'tuple', value: [A, B, C] },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
