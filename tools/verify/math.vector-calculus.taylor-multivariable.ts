// 独立验算 math.vector-calculus.taylor-multivariable 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.taylor-multivariable.ts
// 二阶偏导数用中心差分；p4 不用黑塞矩阵判别，直接在原点周围的小圆上看函数值是否都大于原点处的值。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { grad, hessian, onCircle, type Fn } from './math.vector-calculus._vc.ts';

export const verification: Verification = {
  lesson: 'math.vector-calculus.taylor-multivariable',
  notes: {
    p1: '中心差分求 (1,1) 处的四个二阶偏导数，按行排开。',
    p2: '泰勒多项式的 xy 项系数是 ½·2f_xy = f_xy：中心差分求 (0,0) 处的 f_xy。',
    p3: '中心差分求 (0,0) 处的梯度和黑塞矩阵，拼出二阶泰勒多项式，代入 (0.1, 0.05)。',
    p4: '每个函数在半径 10⁻²、10⁻³ 的圆上各取 3600 个点，看是否都比原点处的值大；两个半径上都大才算严格局部极小。',
  },
  compute() {
    // p1
    const f1: Fn = ([x, y]) => x ** 3 * y + 2 * y * y;
    const p1 = hessian(f1, [1, 1]).flat();

    // p2
    const f2: Fn = ([x, y]) => Math.cos(x + 2 * y);
    const p2 = hessian(f2, [0, 0])[0][1];

    // p3
    const f3: Fn = ([x, y]) => Math.log(1 + x + 2 * y);
    const g3 = grad(f3, [0, 0]);
    const H3 = hessian(f3, [0, 0]);
    const h = [0.1, 0.05];
    const p3 = f3([0, 0]) + g3[0] * h[0] + g3[1] * h[1] + 0.5 * (H3[0][0] * h[0] * h[0] + 2 * H3[0][1] * h[0] * h[1] + H3[1][1] * h[1] * h[1]);

    // p4
    const options: Fn[] = [
      ([x, y]) => 2 * x * x + 2 * x * y + y * y,
      ([x, y]) => x * x + 4 * x * y + 3 * y * y,
      ([x, y]) => 3 * x * x - 2 * x * y + y * y + x ** 3,
      ([x, y]) => -x * x - y * y,
      ([x, y]) => x * x + y ** 4,
    ];
    const p4 = options.flatMap((f, k) => {
      const f0 = f([0, 0]);
      const isMin = [1e-2, 1e-3].every((rho) => onCircle(f, [0, 0], rho).every((v) => v > f0));
      return isMin ? [k + 1] : [];
    });

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
