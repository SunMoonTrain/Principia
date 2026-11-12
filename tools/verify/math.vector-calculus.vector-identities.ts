// 独立验算 math.vector-calculus.vector-identities 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.vector-identities.ts
// 不用乘积法则这类恒等式：拉普拉斯算子按「小球面（平面上是小圆）上的平均值比中心多多少」算，
// 散度按「穿过小立方体的通量除以体积」算，乘积、叉积都先逐点乘出来再求。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cross, fluxDensity, sphereMean, type Vec } from './math.vector-calculus._vc.ts';

/** 平面上以 p 为圆心、半径 eps 的圆上 f 的平均值（m 个等分点）。 */
const circleMean = (f: (x: number, y: number) => number, p: number[], eps: number, m = 360): number =>
  Array.from({ length: m }, (_, k) => f(p[0] + eps * Math.cos((2 * Math.PI * k) / m), p[1] + eps * Math.sin((2 * Math.PI * k) / m))).reduce((s, v) => s + v, 0) / m;

export const verification: Verification = {
  lesson: 'math.vector-calculus.vector-identities',
  notes: {
    p1: '6(球面平均 − 中心值)/ε²，ε = 10⁻²、5×10⁻³ 两次再做理查森外推；球面平均用 θ 方向高斯点、φ 方向等分。',
    p2: '先逐点乘出 fF = (x²yz, xy²z, xyz²)，再按小立方体的通量求散度。',
    p3: '平面上 4(圆周平均 − 中心值)/ε² 给出拉普拉斯算子；对 a = 0、1 在 (1,1) 处各算一次，它是 a 的一次函数，解出为 0 的 a。',
    p4: '逐点算叉积 F × G，再按小立方体的通量求散度。',
  },
  compute() {
    // p1
    const f1 = ([x, y, z]: Vec): number => x * x * y * y + z ** 4;
    const lap = (eps: number): number => (6 * (sphereMean(f1, [1, 1, 1], eps) - f1([1, 1, 1]))) / (eps * eps);
    const p1 = (4 * lap(5e-3) - lap(1e-2)) / 3;

    // p2
    const G2 = ([x, y, z]: Vec): Vec => [x, y, z].map((c) => x * y * z * c);
    const p2 = fluxDensity(G2, [1, 1, 2]);

    // p3
    const lap2 = (a: number): number => {
      const f = (x: number, y: number): number => x ** 3 + a * x * y * y;
      const eps = 1e-2;
      return (4 * (circleMean(f, [1, 1], eps) - f(1, 1))) / (eps * eps);
    };
    const p3 = -lap2(0) / (lap2(1) - lap2(0));

    // p4
    const H = (p: Vec): Vec => cross([p[2], p[0], p[1]], p);
    const p4 = fluxDensity(H, [1, 2, 3]);

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
