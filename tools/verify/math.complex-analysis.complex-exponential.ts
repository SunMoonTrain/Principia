// 独立验算 math.complex-analysis.complex-exponential 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.complex-exponential.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { Complex, cx, derivativeT, integrateC, partialSumsC } from './math.complex-analysis._complex.ts';

/** e^z 直接用级数 ∑zⁿ/n! 算（加到 120 项，项递推），不用 e^x(cos y + i sin y)。 */
function expSeries(z: Complex): Complex {
  let term = cx(1);
  return partialSumsC(
    (n) => {
      if (n > 0) term = term.mul(z).scale(1 / n);
      return term;
    },
    [120],
    0,
  )[0];
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.complex-exponential',
  notes: {
    p1: '级数 ∑zⁿ/n! 直接加到 120 项（项递推），不用 e^x(cos y + i sin y)。',
    p2: '四个等式两边都用级数算，差不到 10⁻¹⁰ 的算成立；C 在 z = 0.7 − 1.3i 处比。',
    p3: '实部、虚部分别做数值积分（integrateC），不用原函数。',
    p4: '数值求 y = e^{(−1+2i)t} 在 t = 0 处的一阶、二阶导数（derivativeT 套两层），y″ + ay′ + by = 0 的实部、虚部是关于 a、b 的两个实方程，解出 a、b；再在 t = 0.8 处核对。',
  },
  compute() {
    const p1 = expSeries(cx(2, Math.PI / 3));

    const z = cx(0.7, -1.3);
    const checks = [
      expSeries(cx(1, 2 * Math.PI)).isClose(cx(Math.E + 1), 1e-10),
      expSeries(cx(0, Math.PI / 2)).isClose(cx(0, 1), 1e-10),
      expSeries(z).conj().isClose(expSeries(z.neg()), 1e-10),
      expSeries(cx(Math.log(2), Math.PI)).isClose(cx(-2), 1e-10),
    ];
    const p2 = checks.map((ok, i) => (ok ? i + 1 : 0)).filter((i) => i > 0);

    const p3 = integrateC((t) => expSeries(cx(0, t)), 0, Math.PI / 2);

    const lam = cx(-1, 2);
    const y = (t: number) => expSeries(lam.scale(t));
    const dy = (t: number) => derivativeT(y, t).value;
    const solveAt = (t: number) => {
      const y0 = y(t);
      const y1 = dy(t);
      const y2 = derivativeT(dy, t).value;
      // y2 + a y1 + b y0 = 0：实部 a·y1.re + b·y0.re = −y2.re，虚部 a·y1.im + b·y0.im = −y2.im
      const det = y1.re * y0.im - y0.re * y1.im;
      return [(-y2.re * y0.im + y0.re * y2.im) / det, (-y1.re * y2.im + y2.re * y1.im) / det];
    };
    const p4 = solveAt(0);
    const check = solveAt(0.8);
    if (Math.abs(check[0] - p4[0]) > 1e-6 || Math.abs(check[1] - p4[1]) > 1e-6) throw new Error('p4：换一个 t 解出的 a、b 不一样');
    return {
      p1: { type: 'tuple', value: [p1.re, p1.im] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [p3.re, p3.im] },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
