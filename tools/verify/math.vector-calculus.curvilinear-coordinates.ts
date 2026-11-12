// 独立验算 math.vector-calculus.curvilinear-coordinates 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.curvilinear-coordinates.ts
// 不用柱坐标、球坐标下的公式：先把函数、场换成直角坐标，
// 梯度用中心差分，散度用小立方体的通量，旋度用小圆的环量，拉普拉斯算子用小球面上的平均（配理查森外推）；
// 坐标方向的单位向量用 ∂r/∂θ 的方向（中心差分再归一化）求。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { circulationDensity, dot, fluxDensity, grad, norm, sphereMean, type Vec } from './math.vector-calculus._vc.ts';

/** 球坐标 (r, θ, φ) 对应的点。 */
const sph = (r: number, th: number, ph: number): Vec => [r * Math.sin(th) * Math.cos(ph), r * Math.sin(th) * Math.sin(ph), r * Math.cos(th)];
/** f 在 p 处的拉普拉斯算子：6(球面平均 − 中心值)/ε²，ε 取 1e-2 和 5e-3 外推。 */
const lap = (f: (p: Vec) => number, p: Vec): number => {
  const L = (eps: number): number => (6 * (sphereMean(f, p, eps) - f(p))) / (eps * eps);
  return (4 * L(5e-3) - L(1e-2)) / 3;
};

export const verification: Verification = {
  lesson: 'math.vector-calculus.curvilinear-coordinates',
  notes: {
    p1: 'f = r² cos θ 换成 z·|r|；在 (r, θ, φ) = (2, π/3, 0) 处中心差分求梯度，点乘 ∂r/∂θ 方向的单位向量。',
    p2: 'r² r̂ 换成 |r|·(x, y, z)；在 r = 3 的点 (1, 2, 2) 上用小立方体的通量除以体积。',
    p3: 's² φ̂ 换成 s·(−y, x, 0)；在 s = 2 的点 (1.2, 1.6, 0.7) 上用绕 z 轴的小圆环量除以面积。',
    p4: 's³ cos φ 换成 (x² + y²)x；在 (1, 0, 0.3) 处用小球面平均求拉普拉斯算子。',
  },
  compute() {
    // p1
    const f1 = ([x, y, z]: Vec): number => z * Math.hypot(x, y, z);
    const [r, th, ph] = [2, Math.PI / 3, 0];
    const h = 1e-6;
    const dth = sph(r, th + h, ph).map((v, i) => (v - sph(r, th - h, ph)[i]) / (2 * h));
    const thetaHat = dth.map((v) => v / norm(dth));
    const p1 = dot(grad(f1, sph(r, th, ph)), thetaHat);

    // p2
    const F2 = (p: Vec): Vec => p.map((v) => norm(p) * v);
    const p2 = fluxDensity(F2, [1, 2, 2]);

    // p3
    const F3 = ([x, y]: Vec): Vec => [-Math.hypot(x, y) * y, Math.hypot(x, y) * x, 0];
    const p3 = circulationDensity(F3, [1.2, 1.6, 0.7], [0, 0, 1]);

    // p4
    const f4 = ([x, y]: Vec): number => (x * x + y * y) * x;
    const p4 = lap(f4, [1, 0, 0.3]);

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
