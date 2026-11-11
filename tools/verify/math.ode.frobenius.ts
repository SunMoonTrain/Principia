// 独立验算 math.ode.frobenius 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.frobenius.ts
// 指标方程不套公式 r(r − 1) + p₀r + q₀：把 x^r 代进算子，取最低次幂的系数，当作 r 的函数找零点。
// 系数用 seriesCoefficients 按次幂逐个令系数为零求出，不先手推递推公式。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { argMax, seriesCoefficients } from './math.ode._numeric.ts';

type Term = { c: number[]; d: number };

/** 把 x^r 代进 Σ c(x)y^{(d)}，最低次幂（次数变化最小的那些项）的系数。 */
function lowest(terms: Term[], r: number): number {
  const shift = Math.min(...terms.map(({ c, d }) => c.findIndex((v) => v !== 0) - d));
  let s = 0;
  for (const { c, d } of terms)
    for (let j = 0; j < c.length; j++) {
      if (c[j] === 0 || j - d !== shift) continue;
      let fall = 1;
      for (let i = 0; i < d; i++) fall *= r - i;
      s += c[j] * fall;
    }
  return s;
}

export const verification: Verification = {
  lesson: 'math.ode.frobenius',
  notes: {
    p1: '算子 x²y″ + xy′ + (x² − 1/4)y，x^r 的最低次幂系数作为 r 的函数，在 [−10, 10]（格点错开）上找零点。',
    p2: '算子 x²y″ + 3xy′ + y，最低次幂系数作为 r 的函数恒不小于 0，只在一点碰到 0（二重根），用黄金分割求它的最小值点。',
    p3: '算子 x²y″ + xy′ + (x² − 4)y，r = 2、a₀ = 1，按次幂逐个令系数为零求到 a₂。',
    p4: '算子 2xy″ + y′ + y，r = 1/2、a₀ = 1，求出 a₁。',
  },
  compute() {
    const T1: Term[] = [
      { c: [0, 0, 1], d: 2 },
      { c: [0, 1], d: 1 },
      { c: [-0.25, 0, 1], d: 0 },
    ];
    const p1 = rootsOf((r) => lowest(T1, r), -10.0123, 9.9871, 4000);
    const T2: Term[] = [
      { c: [0, 0, 1], d: 2 },
      { c: [0, 3], d: 1 },
      { c: [1], d: 0 },
    ];
    if (lowest(T2, -3) < 0 || lowest(T2, 2) < 0) throw new Error('p2：最低次幂系数有负值，不是只碰到 0');
    const p2 = argMax((r) => -lowest(T2, r), -5, 5);
    const T3: Term[] = [
      { c: [0, 0, 1], d: 2 },
      { c: [0, 1], d: 1 },
      { c: [-4, 0, 1], d: 0 },
    ];
    const p3 = seriesCoefficients(T3, 2, 2)[2];
    const T4: Term[] = [
      { c: [0, 2], d: 2 },
      { c: [1], d: 1 },
      { c: [1], d: 0 },
    ];
    const a4 = seriesCoefficients(T4, 0.5, 1);
    return {
      p1: { type: 'set', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: a4[1] / a4[0] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
