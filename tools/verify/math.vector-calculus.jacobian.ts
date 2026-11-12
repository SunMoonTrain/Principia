// 独立验算 math.vector-calculus.jacobian 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.jacobian.ts
// 雅可比矩阵按定义逐个偏导数做中心差分；p3 不用矩阵乘积，把复合函数整个代出来对 t 求导。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { derivative, det2, jacobian, type Vec } from './math.vector-calculus._vc.ts';

export const verification: Verification = {
  lesson: 'math.vector-calculus.jacobian',
  notes: {
    p1: '中心差分求各分量对各变量的偏导数，在 (1,2) 处按行排开。',
    p2: '中心差分求 2×3 雅可比矩阵，取第 2 行第 3 列。',
    p3: '把 g(t) 代进 f 得 t ↦ (t⁵, t² + t³)，对两个分量分别在 t = 1 处中心差分求导。',
    p4: '核对 f(1,1) = 0，中心差分求雅可比矩阵，再算二阶行列式。',
  },
  compute() {
    // p1
    const F1 = ([x, y]: Vec): Vec => [x * x * y, x + 3 * y];
    const p1 = jacobian(F1, [1, 2]).flat();

    // p2
    const F2 = ([x, y, z]: Vec): Vec => [x * y, y * z];
    const p2 = jacobian(F2, [1, 2, 3])[1][2];

    // p3
    const g = (t: number): Vec => [t * t, t ** 3];
    const f = ([x, y]: Vec): Vec => [x * y, x + y];
    const p3 = [0, 1].map((i) => derivative((t) => f(g(t))[i], 1));

    // p4
    const F4 = ([x, y]: Vec): Vec => [x - x * y, -y + x * y];
    if (F4([1, 1]).some((v) => Math.abs(v) > 1e-15)) throw new Error('p4：(1,1) 不是零点');
    const p4 = det2(jacobian(F4, [1, 1]));

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
