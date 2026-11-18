// 独立验算 math.complex-analysis.complex-roots 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.complex-roots.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { Complex, cx, polyRoots } from './math.complex-analysis._complex.ts';

/** 整数次幂：一个一个乘，不用棣莫弗公式。 */
function power(z: Complex, n: number): Complex {
  let p = cx(1);
  for (let k = 0; k < n; k++) p = p.mul(z);
  return p;
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.complex-roots',
  notes: {
    p1: '(1 − i) 连乘 6 次，不用棣莫弗公式。',
    p2: '四个选项各自连乘 4 次，和 16 差不到 10⁻¹² 的选出来。',
    p3: '多项式 z² − (−3 + 4i) 用同时迭代求两个根（polyRoots），取实部为正的那个，不用配方、不解实部虚部的方程组。',
    p4: '同时迭代求 z³ − 1 的三个根，取辐角为 2π/3 的那个作 ω，连乘 100 次、200 次再相加。',
  },
  compute() {
    const p1 = power(cx(1, -1), 6);

    const opts = [cx(0, 2), cx(1, 1), cx(-2), cx(Math.SQRT2, Math.SQRT2)];
    const p2 = opts.map((z, i) => (power(z, 4).isClose(cx(16), 1e-12) ? i + 1 : 0)).filter((i) => i > 0);

    const roots = polyRoots([1, 0, cx(3, -4)]);
    const pos = roots.filter((r) => r.re > 0);
    if (pos.length !== 1) throw new Error('p3：实部为正的根不是恰好一个');
    const p3 = pos[0];

    const w = polyRoots([1, 0, 0, -1]).find((r) => Math.abs(r.arg() - (2 * Math.PI) / 3) < 1e-9);
    if (!w) throw new Error('p4：没找到辐角 2π/3 的根');
    const p4 = power(w, 100).add(power(w, 200));
    return {
      p1: { type: 'tuple', value: [p1.re, p1.im] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [p3.re, p3.im] },
      p4: { type: 'tuple', value: [p4.re, p4.im] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
