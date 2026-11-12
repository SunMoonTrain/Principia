// 独立验算 math.vector-calculus.vector-fields 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.vector-fields.ts
// 梯度用中心差分；流线不解微分方程，用四阶龙格-库塔从给定的点数值地走一段，再看终点满足什么关系。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { grad, rk4, type Vec } from './math.vector-calculus._vc.ts';

export const verification: Verification = {
  lesson: 'math.vector-calculus.vector-fields',
  notes: {
    p1: '把 (2,3) 代进两个分量。',
    p2: '中心差分求 x²y 在 (1,2) 处的两个偏导数。',
    p3: '从 (2,1) 沿 F = (x, −y) 用龙格-库塔走 1 个单位时间（1000 步），算终点的 xy；再往回走一段核对。',
    p4: '从 (1,1) 沿 F = (x, 3y) 走 0.5 个单位时间，终点 (x, y) 满足 y = x^k，k = ln y / ln x；再取另一个时长核对。',
  },
  compute() {
    // p1
    const F1 = ([x, y]: Vec): Vec => [x + y, x * y];
    const p1 = F1([2, 3]);

    // p2
    const p2 = grad(([x, y]) => x * x * y, [1, 2]);

    // p3
    const F3 = ([x, y]: Vec): Vec => [x, -y];
    const fwd = rk4(F3, [2, 1], 0.001, 1000);
    const bwd = rk4(([x, y]) => F3([x, y]).map((v) => -v), [2, 1], 0.001, 500);
    const p3 = fwd[0] * fwd[1];
    if (Math.abs(bwd[0] * bwd[1] - p3) > 1e-9) throw new Error('p3：往回走得到的 xy 不同');

    // p4
    const F4 = ([x, y]: Vec): Vec => [x, 3 * y];
    const kAt = (T: number): number => {
      const [x, y] = rk4(F4, [1, 1], T / 1000, 1000);
      return Math.log(y) / Math.log(x);
    };
    const p4 = kAt(0.5);
    if (Math.abs(kAt(0.8) - p4) > 1e-9) throw new Error('p4：两段时长得到的 k 不同');

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
