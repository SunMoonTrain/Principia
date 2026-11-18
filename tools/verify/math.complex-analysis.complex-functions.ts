// 独立验算 math.complex-analysis.complex-functions 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.complex-functions.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cexp, Complex, cx, I } from './math.complex-analysis._complex.ts';

const cosDef = (z: Complex) => cexp(I.mul(z)).add(cexp(I.mul(z).neg())).scale(0.5);
const sinDef = (z: Complex) => cexp(I.mul(z)).sub(cexp(I.mul(z).neg())).div(cx(0, 2));

export const verification: Verification = {
  lesson: 'math.complex-analysis.complex-functions',
  notes: {
    p1: '直接相乘 (1 + 2i)(1 + 2i)。',
    p2: '单位圆上取 24 个点，算出 1/z，逐个选项检查这些像是否都满足选项说的方程（D 还要求像都相同）。',
    p3: '按定义 cos z = (e^{iz} + e^{−iz})/2 代入 z = i ln 2，不用 cosh。',
    p4: '按定义 sin z = (e^{iz} − e^{−iz})/(2i) 算出复数再取模，不用 |sin z|² = sin²x + sinh²y。',
  },
  compute() {
    const p1 = cx(1, 2).mul(cx(1, 2));

    const images = Array.from({ length: 24 }, (_, k) => cx(1).div(Complex.fromPolar(1, (2 * Math.PI * k) / 24 + 0.05)));
    const tests: ((w: Complex) => boolean)[] = [(w) => Math.abs(w.re - 1) < 1e-12, (w) => Math.abs(w.abs() - 2) < 1e-12, (w) => Math.abs(w.abs() - 1) < 1e-12, (w) => w.isClose(cx(1), 1e-12)];
    const p2 = tests.map((t, i) => (images.every(t) ? i + 1 : 0)).filter((i) => i > 0);

    const c = cosDef(cx(0, Math.log(2)));
    if (Math.abs(c.im) > 1e-14) throw new Error('p3：结果不是实数');
    const p4 = sinDef(cx(Math.PI / 2, 1)).abs();
    return {
      p1: { type: 'tuple', value: [p1.re, p1.im] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: c.re },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
