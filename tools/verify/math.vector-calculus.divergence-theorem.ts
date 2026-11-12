// 独立验算 math.vector-calculus.divergence-theorem 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.divergence-theorem.ts
// 不用散度定理：逐块写出边界曲面的参数方程，直接算每一块往外的通量 ∬F·(r_u × r_v) du dv 再相加；
// 参数的先后按「r_u × r_v 朝外」排好，每块都在一点核对过朝向。p4 只算上半球面本身，不补底面。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cross, dot, surfaceFlux, type Vec } from './math.vector-calculus._vc.ts';

type Patch = [(u: number, v: number) => Vec, number, number, number, number, Vec];

/** 一组边界曲面块的通量之和；每块附一个「这块内部的点 → 区域外」的参考方向，用来核对朝向。 */
function totalFlux(F: (p: Vec) => Vec, patches: Patch[], inside: Vec): number {
  return patches.reduce((s, [r, u0, u1, v0, v1]) => {
    const u = (u0 + u1) / 2 + 0.01 * (u1 - u0);
    const v = (v0 + v1) / 2 + 0.01 * (v1 - v0);
    const h = 1e-6;
    const ru = r(u + h, v).map((x, i) => (x - r(u - h, v)[i]) / (2 * h));
    const rv = r(u, v + h).map((x, i) => (x - r(u, v - h)[i]) / (2 * h));
    const out = r(u, v).map((x, i) => x - inside[i]);
    if (dot(cross(ru, rv), out) <= 0) throw new Error('有一块的朝向不是朝外');
    return s + surfaceFlux(F, r, u0, u1, v0, v1);
  }, 0);
}

export const verification: Verification = {
  lesson: 'math.vector-calculus.divergence-theorem',
  notes: {
    p1: '立方体的六个面分别参数化，逐面算往外的通量再相加。',
    p2: '圆柱的侧面 (cos φ, sin φ, z)、上底 (s cos φ, s sin φ, 2)、下底 (s sin φ, s cos φ, 0) 三块逐块算通量相加。',
    p3: '上底圆盘 z = 1 和抛物面 (s sin φ, s cos φ, s²) 两块逐块算往外的通量相加。',
    p4: '只算上半球面 (2 sin θ cos φ, 2 sin θ sin φ, 2 cos θ) 本身往外的通量，不补底面、不用散度。',
  },
  compute() {
    // p1
    const cube: Patch[] = [
      [(u, v) => [1, u, v], 0, 1, 0, 1, [1, 0, 0]],
      [(u, v) => [0, v, u], 0, 1, 0, 1, [-1, 0, 0]],
      [(u, v) => [v, 1, u], 0, 1, 0, 1, [0, 1, 0]],
      [(u, v) => [u, 0, v], 0, 1, 0, 1, [0, -1, 0]],
      [(u, v) => [u, v, 1], 0, 1, 0, 1, [0, 0, 1]],
      [(u, v) => [v, u, 0], 0, 1, 0, 1, [0, 0, -1]],
    ];
    const p1 = totalFlux(([x, y, z]) => [2 * x, 3 * y, -z], cube, [0.5, 0.5, 0.5]);

    // p2
    const cyl: Patch[] = [
      [(phi, z) => [Math.cos(phi), Math.sin(phi), z], 0, 2 * Math.PI, 0, 2, [1, 0, 0]],
      [(s, phi) => [s * Math.cos(phi), s * Math.sin(phi), 2], 0, 1, 0, 2 * Math.PI, [0, 0, 1]],
      [(s, phi) => [s * Math.sin(phi), s * Math.cos(phi), 0], 0, 1, 0, 2 * Math.PI, [0, 0, -1]],
    ];
    const p2 = totalFlux((p) => p, cyl, [0.1, 0.1, 1]);

    // p3
    const bowl: Patch[] = [
      [(s, phi) => [s * Math.cos(phi), s * Math.sin(phi), 1], 0, 1, 0, 2 * Math.PI, [0, 0, 1]],
      [(s, phi) => [s * Math.sin(phi), s * Math.cos(phi), s * s], 0, 1, 0, 2 * Math.PI, [0, 0, -1]],
    ];
    const p3 = totalFlux(([x, y, z]) => [x, y, z * z], bowl, [0.05, 0.05, 0.8]);

    // p4
    const hemi: Patch[] = [[(th, phi) => [2 * Math.sin(th) * Math.cos(phi), 2 * Math.sin(th) * Math.sin(phi), 2 * Math.cos(th)], 0, Math.PI / 2, 0, 2 * Math.PI, [0, 0, 1]]];
    const p4 = totalFlux(([, , z]) => [0, 0, z], hemi, [0, 0, 0]);

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
