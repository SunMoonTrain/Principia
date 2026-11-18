// 独立验算 math.complex-analysis.holomorphic 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.holomorphic.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cauchyRiemann, ccos, cexp, Complex, complexDifferentiableAt, csin, cx, derivativeC, I } from './math.complex-analysis._complex.ts';

/** 平面上一组检查点：网格加上 ±i 这类特殊点。 */
const samples: Complex[] = [cx(0), I, I.neg(), cx(1, 2), cx(-1.5, 0.3), cx(2, -1), cx(0.4, 0.9), cx(-0.7, -1.2)];

export const verification: Verification = {
  lesson: 'math.complex-analysis.holomorphic',
  notes: {
    p1: '按定义：12 个方向的差商极限在 1 + i 处都相同才取（complexDifferentiableAt）；再在几点上数值核对柯西-黎曼方程的残差为 0。',
    p2: '每个函数在 8 个检查点（含 ±i）上看是否有定义（有限）、是否 12 个方向的差商极限都相同，处处通过的算整函数。',
    p3: '柯西-黎曼方程的残差（数值偏导数）对 a、b 是线性的：在两点上取 (a, b) = (0,0)、(1,0)、(0,1) 求出系数，四个方程用最小二乘解 a、b；再用差商核对解出的函数处处复可导。',
    p4: '小圆上的柯西积分求导数（derivativeC），不用 (cos z)′ = −sin z。',
  },
  compute() {
    const f1 = (z: Complex) => cx(z.re * z.re - z.im * z.im, 2 * z.re * z.im);
    const d1 = complexDifferentiableAt(f1, cx(1, 1));
    if (!d1.differentiable) throw new Error('p1：各方向的差商极限不一致');
    for (const [x, y] of [
      [0.3, -0.8],
      [-1.2, 0.5],
    ]) {
      const cr = cauchyRiemann((a, b) => a * a - b * b, (a, b) => 2 * a * b, x, y);
      if (Math.abs(cr.r1) > 1e-8 || Math.abs(cr.r2) > 1e-8) throw new Error('p1：柯西-黎曼方程不成立');
    }

    const fs: ((z: Complex) => Complex)[] = [(z) => z.conj(), (z) => cx(1).div(z.mul(z).add(1)), (z) => z.mul(z).mul(z).add(cexp(z)), (z) => csin(z).mul(ccos(z))];
    const p2 = fs
      .map((f, i) => {
        for (const s of samples) {
          const v = f(s);
          if (!Number.isFinite(v.re) || !Number.isFinite(v.im)) return 0;
          if (!complexDifferentiableAt(f, s).differentiable) return 0;
        }
        return i + 1;
      })
      .filter((i) => i > 0);

    // f = (x² + a y²) + i b x y
    const residual = (a: number, b: number, x: number, y: number) => {
      const cr = cauchyRiemann((p, q) => p * p + a * q * q, (p, q) => b * p * q, x, y);
      return [cr.r1, cr.r2];
    };
    const rows: number[][] = [];
    const rhs: number[] = [];
    for (const [x, y] of [
      [0.7, -0.3],
      [1.1, 0.4],
    ]) {
      const r0 = residual(0, 0, x, y);
      const ra = residual(1, 0, x, y).map((v, k) => v - r0[k]);
      const rb = residual(0, 1, x, y).map((v, k) => v - r0[k]);
      for (let k = 0; k < 2; k++) {
        rows.push([ra[k], rb[k]]);
        rhs.push(-r0[k]);
      }
    }
    // 正规方程 (AᵀA)x = Aᵀb
    const ata = [0, 0, 0, 0];
    const atb = [0, 0];
    rows.forEach((r, k) => {
      ata[0] += r[0] * r[0];
      ata[1] += r[0] * r[1];
      ata[3] += r[1] * r[1];
      atb[0] += r[0] * rhs[k];
      atb[1] += r[1] * rhs[k];
    });
    ata[2] = ata[1];
    const det = ata[0] * ata[3] - ata[1] * ata[2];
    const a = (atb[0] * ata[3] - ata[1] * atb[1]) / det;
    const b = (ata[0] * atb[1] - ata[2] * atb[0]) / det;
    const f3 = (z: Complex) => cx(z.re * z.re + a * z.im * z.im, b * z.re * z.im);
    for (const s of samples) if (!complexDifferentiableAt(f3, s).differentiable) throw new Error('p3：解出的函数不是处处复可导');

    const p4 = derivativeC(ccos, I);
    return {
      p1: { type: 'tuple', value: [d1.derivative.re, d1.derivative.im] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [a, b] },
      p4: { type: 'tuple', value: [p4.re, p4.im] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
