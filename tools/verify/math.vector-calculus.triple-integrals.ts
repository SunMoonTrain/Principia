// 独立验算 math.vector-calculus.triple-integrals 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.triple-integrals.ts
// 三重积分用三层嵌套的双指数求积数值地算；p2 不用「底面上积高度」，改成按 z 切片、对每个 z 算截面 xy ≥ z 的面积再积分；p4 的积分次序是 x 最内层。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { integrate, integrate2 } from './math.vector-calculus._vc.ts';

/** ∫_a^b ∫_{lo(x)}^{hi(x)} ∫_{zlo(x,y)}^{zhi(x,y)} g dz dy dx */
const integrate3 = (
  g: (x: number, y: number, z: number) => number,
  a: number,
  b: number,
  lo: (x: number) => number,
  hi: (x: number) => number,
  zlo: (x: number, y: number) => number,
  zhi: (x: number, y: number) => number,
): number => integrate2((x, y) => integrate((z) => g(x, y, z), zlo(x, y), zhi(x, y), 1 / 16), a, b, lo, hi);

export const verification: Verification = {
  lesson: 'math.vector-calculus.triple-integrals',
  notes: {
    p1: '在长方体上三层嵌套数值积分 xyz。',
    p2: '按 z 切片：z 从 0 到 2，截面是 [0,1]×[0,2] 里 xy ≥ z 的部分；x 从 z/2 到 1，y 从 z/x 到 2，数值求面积再对 z 积分。',
    p3: '在单位正方体上三层嵌套数值积分 x + y² + z³。',
    p4: '次序 dx dy dz：z 从 0 到 3，y 从 0 到 2(1 − z/3)，x 从 0 到 1 − y/2 − z/3，被积函数 x。',
  },
  compute() {
    // p1
    const p1 = integrate3((x, y, z) => x * y * z, 0, 1, () => 0, () => 2, () => 0, () => 3);

    // p2：体积 = ∫_0^2 面积{(x,y) ∈ [0,1]×[0,2] : xy ≥ z} dz
    const area = (z: number): number => integrate2(() => 1, z / 2, 1, (x) => z / x, () => 2);
    const p2 = integrate(area, 0, 2);

    // p3
    const p3 = integrate3((x, y, z) => x + y * y + z ** 3, 0, 1, () => 0, () => 1, () => 0, () => 1);

    // p4：外层 z，中层 y，内层 x
    const p4 = integrate3((_z, _y, x) => x, 0, 3, () => 0, (z) => 2 * (1 - z / 3), () => 0, (z, y) => 1 - y / 2 - z / 3);

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
