// 独立验算 math.vector-calculus.cylindrical-spherical 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.cylindrical-spherical.ts
// 不用柱坐标、球坐标：全部在直角坐标里写成累次积分，用嵌套的双指数求积数值地算；p3 的被积函数在球心有尖点，三个变量都在 0 处拆开。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { integrate, integrate2 } from './math.vector-calculus._vc.ts';

const root = (t: number): number => Math.sqrt(Math.max(0, t));

/** 圆盘 x² + y² ≤ R² 上的二重积分。 */
const disk = (g: (x: number, y: number) => number, R: number): number => integrate2(g, -R, R, (x) => -root(R * R - x * x), (x) => root(R * R - x * x));

/** 单位球上的三重积分；split 为真时 x、y、z 都在 0 处拆开。 */
function ball(g: (x: number, y: number, z: number) => number, split: boolean): number {
  const h = 1 / 16;
  const inner = (x: number, y: number): number => {
    const t = root(1 - x * x - y * y);
    return split ? integrate((z) => g(x, y, z), -t, 0, h) + integrate((z) => g(x, y, z), 0, t, h) : integrate((z) => g(x, y, z), -t, t, h);
  };
  const middle = (x: number): number => {
    const s = root(1 - x * x);
    return split ? integrate((y) => inner(x, y), -s, 0, h) + integrate((y) => inner(x, y), 0, s, h) : integrate((y) => inner(x, y), -s, s, h);
  };
  return split ? integrate(middle, -1, 0, h) + integrate(middle, 0, 1, h) : integrate(middle, -1, 1, h);
}

export const verification: Verification = {
  lesson: 'math.vector-calculus.cylindrical-spherical',
  notes: {
    p1: '直角坐标：在圆盘 x² + y² ≤ 4 上积分高度 3。',
    p2: '直角坐标里在单位球上三层嵌套数值积分 x² + y² + z²。',
    p3: '直角坐标里在单位球上三层嵌套数值积分 1 + √(x² + y² + z²)，三个变量都在 0 处拆开。',
    p4: '直角坐标：在单位圆盘上积分 2 − x² − y²。',
  },
  compute() {
    const p1 = disk(() => 3, 2);
    const p2 = ball((x, y, z) => x * x + y * y + z * z, false);
    const p3 = ball((x, y, z) => 1 + Math.hypot(x, y, z), true);
    const p4 = disk((x, y) => 2 - x * x - y * y, 1);
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
