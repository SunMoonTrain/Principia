// 独立验算 math.ode.lyapunov-stability 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.lyapunov-stability.ts
// V̇ 都用中心差分求梯度再点乘右边；p2 对每个选项的例子数值积分，按定义判断稳定、渐近稳定。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { rk4Vec } from './math.ode._numeric.ts';

const grad = (V: (x: number[]) => number, x: number[], h = 1e-5): number[] =>
  x.map((_, j) => (V(x.map((v, k) => (k === j ? v + h : v))) - V(x.map((v, k) => (k === j ? v - h : v)))) / (2 * h));
const vdot = (V: (x: number[]) => number, f: (x: number[]) => number[], x: number[]): number => {
  const g = grad(V, x);
  return f(x).reduce((s, fi, i) => s + fi * g[i], 0);
};

/**
 * 按定义判断平衡点 x* 的稳定性：从离它 δ = 10⁻³ 的 8 个方向（一维时 2 个）出发积到 T = 40，
 * 一路上最远不超过 10δ 算稳定，最后离它不到 δ/100 算趋于它。
 */
const classify = (f: (x: number[]) => number[], xs: number[]): { stable: boolean; attracting: boolean } => {
  const d = 1e-3;
  const dirs = xs.length === 1 ? [[1], [-1]] : Array.from({ length: 8 }, (_, k) => [Math.cos((k * Math.PI) / 4 + 0.1), Math.sin((k * Math.PI) / 4 + 0.1)]);
  let stable = true;
  let attracting = true;
  for (const u of dirs) {
    let x = xs.map((v, i) => v + d * u[i]);
    let far = 0;
    for (let k = 0; k < 400; k++) {
      x = rk4Vec((_, y) => f(y), 0, x, 0.1, 20);
      far = Math.max(far, Math.hypot(...x.map((v, i) => v - xs[i])));
    }
    if (!(far <= 10 * d)) stable = false;
    if (!(Math.hypot(...x.map((v, i) => v - xs[i])) < d / 100)) attracting = false;
  }
  return { stable, attracting };
};

export const verification: Verification = {
  lesson: 'math.ode.lyapunov-stability',
  notes: {
    p1: 'V̇ = ∇V·f，梯度用中心差分，在 (1, 2) 处求值。',
    p2:
      '对每个选项给的方程组，按定义数值判断原点（从 δ = 10⁻³ 处 8 个方向出发积到 t = 40，最远不超过 10δ 算稳定，最后不到 δ/100 算趋于它）：' +
      'A 是 x′ = v、v′ = −4x；B 是 x′ = v、v′ = −4x − v；C 是 x′ = y、y′ = x；D 是 x′ = 0、y′ = −y。选「稳定且不趋于它」的选项。',
    p3: 'V̇ 是二次型，xy 项的系数等于 (V̇(1, 1) − V̇(1, −1))/2；对 c 在 (0, 10] 上找它的零点。',
    p4: 'Ė = ∇E·f，梯度用中心差分，b = 1/2，在 (1, 2) 处求值。',
  },
  compute() {
    // p1
    const p1 = vdot(([x, y]) => x * x + y * y, ([x, y]) => [-x + y, -x - y], [1, 2]);

    // p2
    const options: ((x: number[]) => number[])[] = [
      ([x, v]) => [v, -4 * x],
      ([x, v]) => [v, -4 * x - v],
      ([x, y]) => [y, x],
      ([, y]) => [0, -y],
    ];
    const chosen: number[] = [];
    options.forEach((f, k) => {
      const v = classify(f, [0, 0]);
      if (v.stable && !v.attracting) chosen.push(k + 1);
    });

    // p3
    const xyCoef = (c: number): number => {
      const V = ([x, y]: number[]): number => x * x + c * y * y;
      const f = ([x, y]: number[]): number[] => [-x + 2 * y, -x - y];
      return (vdot(V, f, [1, 1]) - vdot(V, f, [1, -1])) / 2;
    };
    const r3 = rootsOf(xyCoef, 0.0123, 10.0057, 4000);
    if (r3.length !== 1) throw new Error('p3：零点不唯一');

    // p4
    const b = 0.5;
    const p4 = vdot(([x, v]) => 0.5 * v * v + 0.25 * x ** 4, ([x, v]) => [v, -b * v - x ** 3], [1, 2]);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: chosen },
      p3: { type: 'number', value: r3[0] },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
