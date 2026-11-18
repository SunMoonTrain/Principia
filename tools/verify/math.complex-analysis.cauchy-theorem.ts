// 独立验算 math.complex-analysis.cauchy-theorem 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.cauchy-theorem.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { ccos, cexp, circle, Complex, contourIntegral, cx, segment } from './math.complex-analysis._complex.ts';

const inv = (a: Complex | number) => (z: Complex) => cx(1).div(z.sub(a));

export const verification: Verification = {
  lesson: 'math.complex-analysis.cauchy-theorem',
  notes: {
    p1: '按定义求复积分：折线上的和再外推（contourIntegral），不用柯西积分定理。',
    p2: '四个积分都按定义算，值为 0（差不到 10⁻⁹）的选出来。',
    p3: '同 p1，沿 |z| = 3 直接积，不拆部分分式。',
    p4: '沿两条不同的路（线段，和先走到 0.3 再拐到 i/2 的折线）按定义积 e^{πz}，两者一致才取。',
  },
  compute() {
    const p1 = contourIntegral(inv(0), circle(2, 1)).value;
    const vals = [
      contourIntegral(inv(1), circle(0, 2)).value,
      contourIntegral(inv(3), circle(0, 2)).value,
      contourIntegral((z) => ccos(z).div(z.mul(z).add(4)), circle(0, 1)).value,
      contourIntegral((z) => z.conj(), circle(0, 1)).value,
    ];
    const p2 = vals.map((v, i) => (v.abs() < 1e-9 ? i + 1 : 0)).filter((i) => i > 0);
    const p3 = contourIntegral((z) => z.scale(2).add(1).div(z.mul(z.sub(2))), circle(0, 3)).value;
    const f4 = (z: Complex) => cexp(z.scale(Math.PI));
    const a = contourIntegral(f4, segment(0, cx(0, 0.5))).value;
    const b = contourIntegral(f4, segment(0, 0.3)).value.add(contourIntegral(f4, segment(0.3, cx(0, 0.5))).value);
    if (!a.isClose(b, 1e-10)) throw new Error('p4：两条路的积分不一致');
    return {
      p1: { type: 'tuple', value: [p1.re, p1.im] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [p3.re, p3.im] },
      p4: { type: 'tuple', value: [a.re, a.im] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
