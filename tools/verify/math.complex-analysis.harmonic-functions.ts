// 独立验算 math.complex-analysis.harmonic-functions 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.harmonic-functions.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { harmonicConjugateIncrement, laplacian } from './math.complex-analysis._complex.ts';

/** 二分法求 [a, b] 里 g 的零点（两端异号）。 */
function bisect(g: (t: number) => number, a: number, b: number): number {
  let lo = a;
  let hi = b;
  let glo = g(lo);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const gm = g(mid);
    if (gm === 0) return mid;
    if (Math.sign(gm) === Math.sign(glo)) {
      lo = mid;
      glo = gm;
    } else hi = mid;
  }
  return (lo + hi) / 2;
}

/** 单位圆上 F(cos θ, sin θ) = 0 的方向 θ ∈ [0, π)：细分区间找变号点再二分。 */
function zeroDirections(F: (x: number, y: number) => number): number[] {
  const g = (t: number) => F(Math.cos(t), Math.sin(t));
  const out: number[] = [];
  const n = 3600;
  for (let k = 0; k < n; k++) {
    const a = (Math.PI * k) / n + 1e-7;
    const b = (Math.PI * (k + 1)) / n + 1e-7;
    if (Math.sign(g(a)) !== Math.sign(g(b))) out.push(bisect(g, a, b) % Math.PI);
  }
  return out;
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.harmonic-functions',
  notes: {
    p1: '共轭调和函数沿线段积出来：v(1, π/2) − v(0, 0) = ∫(−u_y dx + u_x dy)（偏导数数值求，harmonicConjugateIncrement），不先猜全纯函数。',
    p2: '在 6 个点（避开原点）上数值求 ∇²（五点差分外推），处处为 0 才算调和。',
    p3: '同 p1，沿 (0, 0) 到 (1, 1) 的线段积。',
    p4: '在单位圆上找 u = 0、v = 0 的方向（细分加二分），两两求方向差（模 π，取到 [0, π/2]），取最小值。',
  },
  compute() {
    const p1 = harmonicConjugateIncrement((x, y) => Math.exp(x) * Math.cos(y), [0, 0], [1, Math.PI / 2]);

    const fs: ((x: number, y: number) => number)[] = [(x, y) => x * x + y * y, (x, y) => Math.exp(x) * Math.sin(y), (x, y) => Math.log(x * x + y * y), (x, y) => x ** 3 - y ** 3];
    const pts: [number, number][] = [
      [0.3, 0.8],
      [-1.2, 0.5],
      [2, -1],
      [0.7, -0.4],
      [-0.6, -1.5],
      [1.1, 1.3],
    ];
    const p2 = fs.map((u, i) => (pts.every(([x, y]) => Math.abs(laplacian(u, x, y)) < 1e-6) ? i + 1 : 0)).filter((i) => i > 0);

    const p3 = harmonicConjugateIncrement((x, y) => x * x - y * y + 3 * y, [0, 0], [1, 1]);

    const du = zeroDirections((x, y) => x ** 3 - 3 * x * y * y);
    const dv = zeroDirections((x, y) => 3 * x * x * y - y ** 3);
    if (du.length !== 3 || dv.length !== 3) throw new Error(`p4：应各有三个方向（找到 ${du.length}、${dv.length} 个）`);
    let p4 = Infinity;
    for (const a of du) {
      for (const b of dv) {
        let d = Math.abs(a - b) % Math.PI;
        if (d > Math.PI / 2) d = Math.PI - d;
        p4 = Math.min(p4, d);
      }
    }
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
