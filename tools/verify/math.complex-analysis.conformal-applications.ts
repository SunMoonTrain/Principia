// 独立验算 math.complex-analysis.conformal-applications 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.conformal-applications.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cexp, clog, Complex, cx, I, mullerRoot, poissonDisc, poissonHalfPlane } from './math.complex-analysis._complex.ts';

const inStrip = (z: Complex) => z.im > 1e-9 && z.im < Math.PI - 1e-9;

export const verification: Verification = {
  lesson: 'math.complex-analysis.conformal-applications',
  notes: {
    p1: '上半平面的泊松积分：边界值负实轴上 100、正实轴上 0，在 (1, 1) 处积出来（poissonHalfPlane），不用 Arg 的公式。',
    p2: '对每个映射：带形里 13×10 个格点的像是不是都在上半平面；再取上半平面里 4 个目标点（含 4i、−3 + 0.1i），从带形里 49 个起点用 Muller 法解 f(z) = w，看带形里是不是恰好一个解。两条都过的才是一一映满。',
    p3: '同 p1，边界值 |x| < 1 处 100、别处 0，在 (0, √3) 处积。',
    p4: '单位圆盘的泊松积分：上半圆周 100、下半圆周 0，在 r = 1/2、θ = π/2 处积（poissonDisc），不经过映射。',
  },
  compute() {
    const p1 = poissonHalfPlane((t) => (t < 0 ? 100 : 0), 1, 1, [0]);

    const maps: ((z: Complex) => Complex)[] = [(z) => z.mul(z), (z) => z.sub(I).div(z.add(I)), cexp, clog];
    const grid: Complex[] = [];
    for (let i = 0; i <= 12; i++) for (let j = 1; j <= 10; j++) grid.push(cx(-3 + 0.5 * i, (Math.PI * j) / 11));
    const starts: Complex[] = [];
    for (let i = 0; i < 7; i++) for (let j = 1; j <= 7; j++) starts.push(cx(-3 + i, (Math.PI * j) / 8));
    const targets = [cx(0, 4), cx(-3, 0.1), cx(2, 5), cx(0.5, 0.5)];
    const p2 = maps
      .map((f, idx) => {
        if (!grid.every((z) => f(z).im > 0)) return 0;
        for (const w of targets) {
          const roots: Complex[] = [];
          for (const s of starts) {
            let r: Complex;
            try {
              r = mullerRoot((z) => f(z).sub(w), s);
            } catch {
              continue;
            }
            if (!Number.isFinite(r.re) || !inStrip(r) || !f(r).isClose(w, 1e-10)) continue;
            if (!roots.some((q) => q.isClose(r, 1e-8))) roots.push(r);
          }
          if (roots.length !== 1) return 0;
        }
        return idx + 1;
      })
      .filter((i) => i > 0);

    const p3 = poissonHalfPlane((t) => (Math.abs(t) < 1 ? 100 : 0), 0, Math.sqrt(3), [-1, 1]);
    const p4 = poissonDisc((phi) => (Math.sin(phi) > 0 ? 100 : 0), 0.5, Math.PI / 2, [0, Math.PI]);
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
