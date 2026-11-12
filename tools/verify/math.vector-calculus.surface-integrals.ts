// 独立验算 math.vector-calculus.surface-integrals 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.surface-integrals.ts
// 不用 ∬f|r_u × r_v| du dv 这类公式：把曲面剖分成小三角形，累加 f(重心)·面积或 F(重心)·有向面积向量，再做理查森外推。
// 有向面积向量的朝向由参数的先后决定，每题都核对过朝外（朝上）。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { dot, norm, richardson, triangleSum, type Vec } from './math.vector-calculus._vc.ts';

export const verification: Verification = {
  lesson: 'math.vector-calculus.surface-integrals',
  notes: {
    p1: '三角形用 A + u(B − A) + uv(C − B) 参数化，剖分成小三角形累加 z·面积（平面上剖分是精确的）。',
    p2: '圆盘 (s cos φ, s sin φ, 1)，参数先 s 后 φ 时有向面积朝上；累加 F·有向面积再外推。',
    p3: '侧面 (cos φ, sin φ, z)，参数先 φ 后 z 时朝外；累加 F·有向面积再外推。',
    p4: '半径 3 的上半球面 (θ, φ)，参数先 θ 后 φ 时朝外；累加 F·有向面积再外推。',
  },
  compute() {
    const A = [1, 0, 0];
    const B = [0, 1, 0];
    const C = [0, 0, 1];
    const tri = (u: number, v: number): Vec => A.map((a, i) => a + u * (B[i] - a) + u * v * (C[i] - B[i]));
    const p1 = richardson((n) => triangleSum(tri, 0, 1, 0, 1, n, (p, a) => p[2] * norm(a)), 100);

    const flux = (F: (p: Vec) => Vec, r: (u: number, v: number) => Vec, u0: number, u1: number, v0: number, v1: number): number =>
      richardson((n) => triangleSum(r, u0, u1, v0, v1, n, (p, a) => dot(F(p), a)), 200);

    const disk = (s: number, phi: number): Vec => [s * Math.cos(phi), s * Math.sin(phi), 1];
    if (triangleSum(disk, 0, 2, 0, 2 * Math.PI, 4, (_p, a) => a[2]) <= 0) throw new Error('p2：圆盘的朝向不是朝上');
    const p2 = flux(() => [0, 0, 3], disk, 0, 2, 0, 2 * Math.PI);

    const side = (phi: number, z: number): Vec => [Math.cos(phi), Math.sin(phi), z];
    if (triangleSum(side, 0, 0.1, 0, 0.1, 1, (p, a) => dot(p.slice(0, 2).concat(0), a)) <= 0) throw new Error('p3：侧面的朝向不是朝外');
    const p3 = flux(([x, y]) => [x, y, 0], side, 0, 2 * Math.PI, 0, 2);

    const hemi = (th: number, phi: number): Vec => [3 * Math.sin(th) * Math.cos(phi), 3 * Math.sin(th) * Math.sin(phi), 3 * Math.cos(th)];
    if (triangleSum(hemi, 0.5, 0.6, 0, 0.1, 1, (p, a) => dot(p, a)) <= 0) throw new Error('p4：半球面的朝向不是朝外');
    const p4 = flux(() => [0, 0, 1], hemi, 0, Math.PI / 2, 0, 2 * Math.PI);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
