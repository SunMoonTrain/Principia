// 独立验算 math.vector-calculus.polar-double-integrals 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.polar-double-integrals.ts
// 不用极坐标：全部在直角坐标里写成累次积分，用嵌套的双指数求积数值地算；圆环的下边界在 x = 1 处有折点，在那里拆开。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { integrate2 } from './math.vector-calculus._vc.ts';

/** 第一象限里 1 ≤ x² + y² ≤ 4 的部分上的积分：x 在 [0,1] 和 [1,2] 两段分开算。 */
const quarterAnnulus = (g: (x: number, y: number) => number): number =>
  integrate2(g, 0, 1, (x) => Math.sqrt(1 - x * x), (x) => Math.sqrt(4 - x * x)) + integrate2(g, 1, 2, () => 0, (x) => Math.sqrt(4 - x * x));

/** 圆盘 x² + y² ≤ R² 上的积分。 */
const disk = (g: (x: number, y: number) => number, R: number): number =>
  integrate2(g, -R, R, (x) => -Math.sqrt(Math.max(0, R * R - x * x)), (x) => Math.sqrt(Math.max(0, R * R - x * x)));

export const verification: Verification = {
  lesson: 'math.vector-calculus.polar-double-integrals',
  notes: {
    p1: '直角坐标：x 从 −1 到 1，y 从 −√(1−x²) 到 √(1−x²)，数值积分 x² + y²。',
    p2: '直角坐标：x 在 [0,1] 时 y 从 √(1−x²) 到 √(4−x²)，x 在 [1,2] 时 y 从 0 到 √(4−x²)，被积函数取 1。',
    p3: '直角坐标里在圆盘 x² + y² ≤ 4 上数值积分 e^{−x²−y²}。',
    p4: '同 p2 的区域，被积函数 √(x² + y²)。',
  },
  compute() {
    const p1 = disk((x, y) => x * x + y * y, 1);
    const p2 = quarterAnnulus(() => 1);
    const p3 = disk((x, y) => Math.exp(-(x * x + y * y)), 2);
    const p4 = quarterAnnulus((x, y) => Math.hypot(x, y));
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
