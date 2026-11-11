// 独立验算 math.ode.nonlinear-systems 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.nonlinear-systems.ts
// 雅可比矩阵都用中心差分算；平衡点用牛顿法从格点出发找。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { eig2, jacobianFD, rk4Vec, solveLinear } from './math.ode._numeric.ts';

/** 从格点 [−3, 3]² 出发做牛顿迭代，收集 F = 0 的不同的解。 */
const equilibria = (F: (x: number[]) => number[]): number[][] => {
  const found: number[][] = [];
  for (let i = 0; i <= 24; i++)
    for (let j = 0; j <= 24; j++) {
      let x = [-3 + 0.25 * i + 0.013, -3 + 0.25 * j - 0.007];
      for (let k = 0; k < 60; k++) {
        const J = jacobianFD(F, x);
        const step = solveLinear(J, F(x));
        if (!step.every(Number.isFinite)) break;
        x = x.map((v, m) => v - step[m]);
      }
      if (F(x).every((v) => Math.abs(v) < 1e-12) && !found.some((p) => Math.hypot(p[0] - x[0], p[1] - x[1]) < 1e-6)) found.push(x);
    }
  return found;
};

export const verification: Verification = {
  lesson: 'math.ode.nonlinear-systems',
  notes: {
    p1: '从 [−3, 3]² 上 625 个格点出发做牛顿迭代，数 F = 0 的不同的解。',
    p2: '在 (1, 1) 处对右边做中心差分，得雅可比矩阵。',
    p3: '对 p2 的矩阵解 det(J − λI) = 0。',
    p4: '在 (1, 0) 处中心差分求雅可比矩阵，解 det(J − λI) = 0 得 ±iω；再从 (1.001, 0) 积分量小振动的周期 P，核对 2π/P 和 ω 只差振幅带来的 10⁻⁵ 量级。',
  },
  compute() {
    // p1
    const p1 = equilibria(([x, y]) => [x - x ** 3, -y]).length;

    // p2、p3
    const J = jacobianFD(([x, y]) => [x * x - y, x - y], [1, 1]);
    const ev = eig2(J);
    if (ev.some((e) => e.im !== 0)) throw new Error('p3：特征值不是实数');

    // p4
    const J4 = jacobianFD(([x, v]) => [v, x - x ** 3], [1, 0]);
    const ev4 = eig2(J4);
    const omega = Math.abs(ev4[0].im);
    if (Math.abs(ev4[0].re) > 1e-8) throw new Error('p4：特征值不是纯虚数');
    {
      // 小振动的周期：v 由负变正的两次时刻之差
      const F = (_: number, [x, v]: number[]): number[] => [v, x - x ** 3];
      const h = 1e-3;
      let Y = [1.001, 0];
      const ups: number[] = [];
      for (let k = 1; ups.length < 2 && k < 100_000; k++) {
        const Y0 = Y;
        Y = rk4Vec(F, 0, Y0, h, 1);
        if (Y0[1] < 0 && Y[1] >= 0) ups.push((k - 1) * h + (h * -Y0[1]) / (Y[1] - Y0[1]));
      }
      const P = ups[1] - ups[0];
      if (Math.abs((2 * Math.PI) / P - omega) > 1e-4) throw new Error('p4：小振动的周期和 ω 对不上');
    }

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: J.flat() },
      p3: { type: 'set', value: ev.map((e) => e.re) },
      p4: { type: 'number', value: omega },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
