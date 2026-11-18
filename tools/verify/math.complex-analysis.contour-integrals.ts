// 独立验算 math.complex-analysis.contour-integrals 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.contour-integrals.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { arc, circle, Complex, contourIntegral, cx, segment } from './math.complex-analysis._complex.ts';

export const verification: Verification = {
  lesson: 'math.complex-analysis.contour-integrals',
  notes: {
    p1: '按定义求复积分：折线上的和再外推（contourIntegral），不用原函数、不用 z′(t)。',
    p2: '同上，沿半径 2 的圆顺时针积 1/z，和四个选项的数比。',
    p3: '同上，沿上半单位圆积 z̄。',
    p4: '同上，沿抛物线 z(t) = t + it²（0 ≤ t ≤ 2）积 z²，不用「和路径无关」。',
  },
  compute() {
    const p1 = contourIntegral((z) => z, segment(0, cx(1, 2)));
    const v2 = contourIntegral((z) => cx(1).div(z), circle(0, 2, -1)).value;
    const opts = [cx(0, 2 * Math.PI), cx(0, -2 * Math.PI), cx(0), cx(0, 4 * Math.PI)];
    const p2 = opts.map((o, i) => (v2.isClose(o, 1e-9) ? i + 1 : 0)).filter((i) => i > 0);
    const p3 = contourIntegral((z) => z.conj(), arc(0, 1, 0, Math.PI));
    const p4 = contourIntegral((z) => z.mul(z), { z: (t: number) => cx(t, t * t), t0: 0, t1: 2 });
    for (const [name, r] of [['p1', p1], ['p3', p3], ['p4', p4]] as [string, { converged: boolean }][]) if (!r.converged) throw new Error(`${name}：外推不收敛`);
    const pair = (z: Complex) => [z.re, z.im];
    return {
      p1: { type: 'tuple', value: pair(p1.value) },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: pair(p3.value) },
      p4: { type: 'tuple', value: pair(p4.value) },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
