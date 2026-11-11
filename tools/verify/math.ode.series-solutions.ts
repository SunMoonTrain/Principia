// 独立验算 math.ode.series-solutions 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.series-solutions.ts
// 级数系数用通用的办法算：把级数代进算子，按次幂逐个令系数为零（seriesCoefficients），不先手推递推公式。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { rk4VecAccurate, seriesCoefficients } from './math.ode._numeric.ts';

/** 多项式（系数从常数项起）的全部复根，Durand–Kerner 迭代；返回每个根的模。 */
function rootModuli(coef: number[]): number[] {
  const n = coef.length - 1;
  const lead = coef[n];
  const c = coef.map((x) => x / lead);
  type C = [number, number];
  const mul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const sub = (a: C, b: C): C => [a[0] - b[0], a[1] - b[1]];
  const div = (a: C, b: C): C => {
    const d = b[0] * b[0] + b[1] * b[1];
    return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
  };
  const evalP = (z: C): C => {
    let v: C = [1, 0];
    for (let k = n - 1; k >= 0; k--) v = [mul(v, z)[0] + c[k], mul(v, z)[1]];
    return v;
  };
  let roots: C[] = Array.from({ length: n }, (_, k) => {
    const t = (2 * Math.PI * k) / n + 0.4;
    return [0.9 * Math.cos(t), 0.9 * Math.sin(t)];
  });
  for (let it = 0; it < 500; it++)
    roots = roots.map((z, i) => {
      let den: C = [1, 0];
      roots.forEach((w, j) => {
        if (j !== i) den = mul(den, sub(z, w));
      });
      return sub(z, div(evalP(z), den));
    });
  return roots.map(([x, y]) => Math.hypot(x, y));
}

export const verification: Verification = {
  lesson: 'math.ode.series-solutions',
  notes: {
    p1: '算子 y″ − 2y，取 a₀ = 1、a₁ = 0，按次幂逐个令系数为零求到 a₄。',
    p2: '本节的定理：R 取到 P、Q 的幂级数的收敛半径。这里 Q = 1/(4 − x²)，用 Durand–Kerner 迭代求出 4 − x² 的全部复根，取离 0 最近的模。',
    p3: '算子 y″ − x²y，a₀ = 1、a₁ = 0，求到 a₈。',
    p4: '算子 y″ + xy′ + y，a₀ = 1、a₁ = 0，求出 60 项，在 x = 1 处求和；再用龙格-库塔法积方程到 1 核对。',
  },
  compute() {
    const p1 = seriesCoefficients([{ c: [1], d: 2 }, { c: [-2], d: 0 }], 0, 4, 1, 0)[4];
    const p2 = Math.min(...rootModuli([4, 0, -1]));
    const p3 = seriesCoefficients([{ c: [1], d: 2 }, { c: [0, 0, -1], d: 0 }], 0, 8, 1, 0)[8];
    const a = seriesCoefficients([{ c: [1], d: 2 }, { c: [0, 1], d: 1 }, { c: [1], d: 0 }], 0, 60, 1, 0);
    const p4 = a.reduce((s, an) => s + an, 0);
    const check = rk4VecAccurate((x, [y, v]) => [v, -x * v - y], 0, [1, 0], 1)[0];
    if (Math.abs(check - p4) > 1e-10) throw new Error('p4：级数的和与数值解对不上');
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
