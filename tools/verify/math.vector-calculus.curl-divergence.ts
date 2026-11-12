// 独立验算 math.vector-calculus.curl-divergence 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.curl-divergence.ts
// 不用偏导数的公式：散度按「穿过小立方体的通量除以体积」，旋度按「沿小圆的环量除以面积」数值地算；
// p4 不算旋度，看两条不同路径上的功是否相等，差是 k 的一次函数，解出差为 0 的 k。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { circulationDensity, dot, fluxDensity, polylineSum, richardson, type Vec } from './math.vector-calculus._vc.ts';

export const verification: Verification = {
  lesson: 'math.vector-calculus.curl-divergence',
  notes: {
    p1: '以 (1,2,3) 为中心、边长 2×10⁻³ 的小立方体，六个面上各取 400 个中点算往外的通量，除以体积。',
    p2: '以 (1,2,3) 为圆心、半径 10⁻³ 的小圆分别垂直于 x、y、z 轴，沿圆逆时针的环量除以面积，得旋度的三个分量。',
    p3: '同 p1 算 a = 0 和 a = 1 两个场在 (0.4, −0.3, 0.7) 处的散度，散度是 a 的一次函数，解出它为 0 的 a。',
    p4: '从 (0,0,0) 到 (1,1,1)：沿直线和沿 x、y、z 依次走的折线各算一次功（折线求和加理查森外推），差是 k 的一次函数，解出差为 0 的 k。',
  },
  compute() {
    // p1
    const F1 = ([x, y, z]: Vec): Vec => [x * x * y, y * z * z, x * z];
    const p1 = fluxDensity(F1, [1, 2, 3]);

    // p2
    const F2 = ([x, y, z]: Vec): Vec => [y * y, z * z, x * x];
    const p2 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map((n) => circulationDensity(F2, [1, 2, 3], n));

    // p3
    const F3 = (a: number) => ([x, y, z]: Vec): Vec => [a * x + 3 * y, 2 * x - 4 * y + z, y + 5 * z];
    const d0 = fluxDensity(F3(0), [0.4, -0.3, 0.7]);
    const d1 = fluxDensity(F3(1), [0.4, -0.3, 0.7]);
    const p3 = -d0 / (d1 - d0);

    // p4
    const F4 = (k: number) => ([x, y, z]: Vec): Vec => [y * z, k * x * z, x * y];
    const work = (F: (p: Vec) => Vec, r: (t: number) => Vec): number => richardson((n) => polylineSum(r, 0, 1, n, (p, d) => dot(F(p), d)), 400);
    const legs = (F: (p: Vec) => Vec): number =>
      work(F, (t) => [t, 0, 0]) + work(F, (t) => [1, t, 0]) + work(F, (t) => [1, 1, t]);
    const diff = (k: number): number => work(F4(k), (t) => [t, t, t]) - legs(F4(k));
    const p4 = -diff(0) / (diff(1) - diff(0));

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
