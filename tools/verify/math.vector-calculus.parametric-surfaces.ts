// 独立验算 math.vector-calculus.parametric-surfaces 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.parametric-surfaces.ts
// 面积不用 ∬|r_u × r_v| 的公式：把曲面剖分成小三角形（参数网格每格切成两个），累加三角形面积，再做理查森外推。
// p3 问的就是 r_s × r_φ，用中心差分求两个偏导数再叉乘。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cross, norm, richardson, triangleSum, type Vec } from './math.vector-calculus._vc.ts';

const area = (r: (u: number, v: number) => Vec, u0: number, u1: number, v0: number, v1: number): number =>
  richardson((n) => triangleSum(r, u0, u1, v0, v1, n, (_p, a) => norm(a)), 200);

export const verification: Verification = {
  lesson: 'math.vector-calculus.parametric-surfaces',
  notes: {
    p1: '参数网格 200×200、400×400 剖分成三角形，累加面积再外推（平面，剖分本身就是精确的）。',
    p2: '圆柱面同样剖分成三角形，累加面积再外推。',
    p3: '在 (s, φ) = (2, 0) 处中心差分求 r_s、r_φ，再叉乘。',
    p4: '圆锥面用 (s cos φ, s sin φ, s)，0 ≤ s ≤ 2，剖分成三角形累加面积再外推。',
  },
  compute() {
    const p1 = area((u, v) => [u + v, u - v, 2 * u], 0, 1, 0, 1);
    const p2 = area((phi, z) => [2 * Math.cos(phi), 2 * Math.sin(phi), z], 0, 2 * Math.PI, 0, 3);

    const cone = (s: number, phi: number): Vec => [s * Math.cos(phi), s * Math.sin(phi), s];
    const h = 1e-6;
    const rs = cone(2 + h, 0).map((x, i) => (x - cone(2 - h, 0)[i]) / (2 * h));
    const rphi = cone(2, h).map((x, i) => (x - cone(2, -h)[i]) / (2 * h));
    const p3 = cross(rs, rphi);

    const p4 = area(cone, 0, 2, 0, 2 * Math.PI);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
