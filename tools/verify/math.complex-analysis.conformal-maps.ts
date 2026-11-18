// 独立验算 math.complex-analysis.conformal-maps 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.conformal-maps.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { angleBetween, Complex, csin, cx, I, imageDirection, imageTangent } from './math.complex-analysis._complex.ts';

const cube = (z: Complex) => z.mul(z).mul(z);

export const verification: Verification = {
  lesson: 'math.complex-analysis.conformal-maps',
  notes: {
    p1: '沿方向 d 的像曲线在 z0 处的切向（imageTangent，差商外推）除以 d：看三个方向给出同一个复数，取它的模和辐角，不用 f′ = 3z²。',
    p2: '在 0 处取两个方向（夹角 π/3），用 imageDirection 看像的方向（导数为 0 的点也能看），像的夹角仍是 π/3（大小和转向都不变）才算保角。',
    p3: '直接算 z³ 在扇形边界附近的值：|z| → 2 时 |z³| 的上确界，arg z → π/6 时 arg z³ 的上确界（在网格上取，再看边上的极限），不用定理里的公式。',
    p4: '两条射线的像在 f(1) 处出发的方向用 imageDirection（f′(1) = 0，差商的方向仍有极限），取夹角的绝对值。',
  },
  compute() {
    const z0 = cx(1, 1);
    const ratios = [cx(1), I, Complex.fromPolar(1, 2.2)].map((d) => imageTangent(cube, z0, d).value.div(d));
    if (!ratios.every((q) => q.isClose(ratios[0], 1e-8))) throw new Error('p1：各方向的切向之比不一致');
    const p1 = [ratios[0].abs(), ratios[0].arg()];

    const fs: ((z: Complex) => Complex)[] = [(z) => z.mul(z).add(z), csin, cube, (z) => z.conj()];
    const d1 = cx(1);
    const d2 = Complex.fromPolar(1, Math.PI / 3);
    const p2 = fs
      .map((f, i) => {
        const a = angleBetween(imageDirection(f, 0, d1).value, imageDirection(f, 0, d2).value);
        return Math.abs(a - Math.PI / 3) < 1e-8 ? i + 1 : 0;
      })
      .filter((i) => i > 0);

    let R = 0;
    let alpha = 0;
    for (let i = 1; i <= 400; i++) {
      for (let j = 1; j <= 400; j++) {
        const r = (2 * i) / 401;
        const th = (Math.PI / 6) * (j / 401);
        const w = cube(Complex.fromPolar(r, th));
        R = Math.max(R, w.abs());
        alpha = Math.max(alpha, w.arg());
      }
    }
    const Rlim = cube(Complex.fromPolar(2 - 1e-12, 0.3)).abs();
    const alim = cube(Complex.fromPolar(1, Math.PI / 6 - 1e-12)).arg();
    if (Rlim < R || alim < alpha) throw new Error('p3：边上的极限比内部的值小');

    const f4 = (z: Complex) => z.mul(z).sub(z.scale(2));
    const a4 = Math.abs(angleBetween(imageDirection(f4, 1, 1).value, imageDirection(f4, 1, I).value));
    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [Rlim, alim] },
      p4: { type: 'number', value: a4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
