// 独立验算 math.vector-calculus.stokes-theorem 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.stokes-theorem.ts
// 不用斯托克斯公式：问旋度通量的题，旋度用中心差分求，再在题给的曲面上直接积通量；问环量的题，沿曲线切成折线直接累加。
// 边界的走向在一点上判断：法向量叉乘走向要指向曲面里面，不预设顺时针还是逆时针。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cross, dot, jacobian, polylineSum, richardson, surfaceFlux, type Vec } from './math.vector-calculus._vc.ts';

/** 中心差分求旋度：雅可比矩阵第 i 行第 j 列是 ∂F_i/∂x_j。 */
const curl =
  (F: (p: Vec) => Vec) =>
  (p: Vec): Vec => {
    const J = jacobian(F, p);
    return [J[2][1] - J[1][2], J[0][2] - J[2][0], J[1][0] - J[0][1]];
  };
const work = (F: (p: Vec) => Vec, r: (t: number) => Vec, t0 = 0, t1 = 1): number =>
  richardson((n) => polylineSum(r, t0, t1, n, (p, d) => dot(F(p), d)), 2000);
/** 参数曲面在 (u, v) 处的 r_u × r_v（中心差分）。 */
const normalAt = (r: (u: number, v: number) => Vec, u: number, v: number): Vec => {
  const h = 1e-6;
  const ru = r(u + h, v).map((x, i) => (x - r(u - h, v)[i]) / (2 * h));
  const rv = r(u, v + h).map((x, i) => (x - r(u, v - h)[i]) / (2 * h));
  return cross(ru, rv);
};

export const verification: Verification = {
  lesson: 'math.vector-calculus.stokes-theorem',
  notes: {
    p1: '旋度用中心差分求；半球面 (2 sin θ cos φ, 2 sin θ sin φ, 2 cos θ) 上直接积 (∇×F)·(r_θ × r_φ)，先核对朝外。',
    p2: '上面那一圈 (cos t, sin t, 3) 切成折线累加；走向按「外法向 × 走向指向曲面里面（−z 方向）」在 (1, 0, 3) 处定。',
    p3: '沿三角形三条边切成折线直接累加 F·Δr。',
    p4: '旋度用中心差分求；圆锥面 (s cos φ, s sin φ, 1 − s) 上直接积通量，先核对朝上。',
  },
  compute() {
    // p1
    const F1 = ([x, y, z]: Vec): Vec => [-2 * y, 3 * x, z];
    const hemi = (th: number, ph: number): Vec => [2 * Math.sin(th) * Math.cos(ph), 2 * Math.sin(th) * Math.sin(ph), 2 * Math.cos(th)];
    if (dot(normalAt(hemi, 0.7, 0.3), hemi(0.7, 0.3)) <= 0) throw new Error('p1：半球面的朝向不是朝外');
    const p1 = surfaceFlux(curl(F1), hemi, 0, Math.PI / 2, 0, 2 * Math.PI);

    // p2
    const F2 = ([x, y]: Vec): Vec => [-y, x, 0];
    const top = (t: number): Vec => [Math.cos(t), Math.sin(t), 3];
    const n0: Vec = [1, 0, 0]; // (1, 0, 3) 处的外法向
    const T0: Vec = [0, 1, 0]; // 参数 t 增大的走向
    const intoSurface: Vec = [0, 0, -1]; // 从上沿往曲面里面
    const sign = dot(cross(n0, T0), intoSurface) > 0 ? 1 : -1;
    const p2 = sign * work(F2, top, 0, 2 * Math.PI);

    // p3
    const F3 = ([x, y, z]: Vec): Vec => [z * z, x * x, y * y];
    const vs: Vec[] = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    const p3 = vs.reduce((s, a, i) => {
      const b = vs[(i + 1) % vs.length];
      return s + work(F3, (t) => a.map((ai, k) => ai + t * (b[k] - ai)));
    }, 0);

    // p4
    const F4 = ([x, y, z]: Vec): Vec => [-3 * y + z * Math.sin(x), x + z ** 3, x * y * z];
    const cone = (s: number, ph: number): Vec => [s * Math.cos(ph), s * Math.sin(ph), 1 - s];
    if (normalAt(cone, 0.5, 0.4)[2] <= 0) throw new Error('p4：圆锥面的朝向不是朝上');
    const p4 = surfaceFlux(curl(F4), cone, 0, 1, 0, 2 * Math.PI);

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
