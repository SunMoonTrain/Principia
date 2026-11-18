// 独立验算 math.complex-analysis.goursat 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.goursat.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cexp, Complex, contourIntegral, contourIntegralPieces, cx, extrapolateC, segment } from './math.complex-analysis._complex.ts';

export const verification: Verification = {
  lesson: 'math.complex-analysis.goursat',
  notes: {
    p1: '沿三角形三条边按定义求复积分再相加（contourIntegralPieces），不用格林公式。',
    p2: '概念题，按两个定理的条件写成集合比较：格林公式版的柯西积分定理要「全纯、f′ 连续、简单闭曲线连同内部在开集里」，古尔萨定理要「全纯、三角形连同内部在开集里」，取前者多出来的条件。',
    p3: '沿线段 [0, i] 按定义积 2ζ + 1，不用原函数。',
    p4: 'F(h) 沿线段 [0, h] 按定义积出来（f(0) = 1 单独给），在三个方向上求 (F(h) − F(0))/h 在 h → 0 时的极限，三者一致才取。',
  },
  compute() {
    const tri = [segment(0, 2), segment(2, cx(0, 2)), segment(cx(0, 2), 0)];
    const p1 = contourIntegralPieces((z) => cx(z.re), tri).value;

    const cauchyGreen = new Set(['全纯', 'f′ 连续', '曲线连同内部在开集里']);
    const goursat = new Set(['全纯', '曲线连同内部在开集里']);
    const dropped = [...cauchyGreen].filter((c) => !goursat.has(c));
    const optionText = ['f′ 连续', 'f 在三角形的边界上连续', 'f 在三角形连同内部全纯', '三角形的边界取逆时针方向'];
    const p2 = optionText.map((t, i) => (dropped.includes(t) ? i + 1 : 0)).filter((i) => i > 0);

    const p3 = contourIntegral((z) => z.scale(2).add(1), segment(0, cx(0, 1))).value;

    const f = (z: Complex) => (z.abs() === 0 ? cx(1) : cexp(z).sub(1).div(z));
    const F = (z: Complex) => (z.abs() === 0 ? cx(0) : contourIntegral(f, segment(0, z)).value);
    const dirs = [cx(1), cx(0, 1), Complex.fromPolar(1, 2.3)];
    const qs = dirs.map((d) => extrapolateC((h) => F(d.scale(h)).div(d.scale(h)), 1 / 8, 6).value);
    if (!qs.every((q) => q.isClose(qs[0], 1e-8))) throw new Error('p4：各方向的差商极限不一致');
    return {
      p1: { type: 'tuple', value: [p1.re, p1.im] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [p3.re, p3.im] },
      p4: { type: 'tuple', value: [qs[0].re, qs[0].im] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
