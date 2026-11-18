// 独立验算 math.complex-analysis.mobius 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.mobius.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { Complex, cx, I, imageOfCircleLine, INF, isInf, Mobius, mobiusFromPoints } from './math.complex-analysis._complex.ts';

export const verification: Verification = {
  lesson: 'math.complex-analysis.mobius',
  notes: {
    p1: '直接做复数除法 (1 − i)/(1 + i)。',
    p2: '对每个函数，用三个点的像拟合一个分式线性变换（mobiusFromPoints，解线性方程组；三点的像重合时拟合不出来），再在另外 5 个点上核对和原函数一致才算。',
    p3: '圆上取三点 1、3、2 + i，求它们在 1/z 下的像，过三个像点作圆（imageOfCircleLine），不用圆心、半径的公式。',
    p4: '由三对点 0 ↦ i、1 ↦ 1、∞ ↦ −1 解出系数（mobiusFromPoints，不用交比），再代入 −1。',
  },
  compute() {
    const p1 = cx(1, -1).div(cx(1, 1));

    const fs: ((z: Complex) => Complex)[] = [(z) => z.scale(2).add(1).div(z.add(3)), (z) => z.add(1).div(z.scale(2).add(2)), (z) => cx(1).div(z), (z) => z.mul(z)];
    const fitPts = [cx(0.3, 0.1), cx(-1.7, 0.4), cx(2.2, -0.9)];
    const checkPts = [cx(0.5, 2), cx(-0.4, -1.3), cx(4, 1), cx(-2.5, 0.2), cx(0.1, -0.1)];
    const p2 = fs
      .map((f, i) => {
        let m: Mobius;
        try {
          m = mobiusFromPoints(fitPts as [Complex, Complex, Complex], fitPts.map(f) as [Complex, Complex, Complex]);
        } catch {
          return 0;
        }
        return checkPts.every((z) => {
          const w = m.apply(z);
          return !isInf(w) && w.isClose(f(z), 1e-9);
        })
          ? i + 1
          : 0;
      })
      .filter((i) => i > 0);

    const img = imageOfCircleLine(new Mobius(0, 1, 1, 0), cx(1), cx(3), cx(2, 1));
    if (img.kind !== 'circle') throw new Error('p3：像应是圆');
    if (Math.abs(img.center.im) > 1e-12) throw new Error('p3：圆心应是实数');

    const T = mobiusFromPoints([cx(0), cx(1), INF], [I, cx(1), cx(-1)]);
    const p4 = T.apply(cx(-1));
    if (isInf(p4)) throw new Error('p4：T(−1) 不应是 ∞');
    return {
      p1: { type: 'tuple', value: [p1.re, p1.im] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [img.center.re, img.radius] },
      p4: { type: 'tuple', value: [p4.re, p4.im] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
