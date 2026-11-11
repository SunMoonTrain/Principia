// 独立验算 math.linear-algebra.determinant 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.determinant.ts
// 面积、体积不用行列式：平行四边形用 |u||v| sin θ，三角形用海伦公式，平行六面体用底面积乘高；行列式按排列展开，用消元核对。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { argMin, det, dot, norm, orthonormalize, permDet, scale, sub, type Vec } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.determinant',
  notes: {
    p1: '面积 = |u||v| sin θ = √(|u|²|v|² − (u·v)²)，只用点积和长度。',
    p2: '按排列展开（6 项），再用消元算的行列式核对。',
    p3: '三条边长由距离算出，用海伦公式求面积。',
    p4: '体积 = 底面积 × 高：底是后两条棱的平行四边形（面积用点积算），高是第一条棱减去在底面上的投影后的长度。对 k 用黄金分割法求体积的最小值点，核对那里体积为零，并且消元算的行列式只在这一点为零。',
  },
  compute() {
    // p1
    const u = [2, 1];
    const v = [-3, 5];
    const p1 = Math.sqrt(dot(u, u) * dot(v, v) - dot(u, v) ** 2);

    // p2
    const A2 = [
      [1, 2, 0],
      [0, 3, 1],
      [2, 0, 1],
    ];
    const p2 = permDet(A2);
    if (Math.abs(p2 - det(A2)) > 1e-9) throw new Error('p2：两种算法不一致');

    // p3
    const P = [1, 1];
    const Q = [4, 2];
    const R = [2, 5];
    const a = norm(sub(Q, R));
    const b = norm(sub(P, R));
    const c = norm(sub(P, Q));
    const s = (a + b + c) / 2;
    const p3 = Math.sqrt(s * (s - a) * (s - b) * (s - c));

    // p4
    const volume = (k: number): number => {
      const e1 = [1, 2, 3];
      const e2 = [0, 1, k];
      const e3 = [2, 1, 1];
      const base = Math.sqrt(dot(e2, e2) * dot(e3, e3) - dot(e2, e3) ** 2);
      const height = norm(orthonormalize([e2, e3]).reduce((w: Vec, q) => sub(w, scale(dot(w, q), q)), e1));
      return base * height;
    };
    const kMin = argMin(volume, -10, 10);
    if (volume(kMin) > 1e-6) throw new Error('p4：最小的体积不是零');
    const ks = rootsOf(
      (k) =>
        det([
          [1, 0, 2],
          [2, 1, 1],
          [3, k, 1],
        ]),
      -10.0123,
      9.9871,
      4000,
    );
    if (ks.length !== 1 || Math.abs(ks[0] - kMin) > 1e-6) throw new Error('p4：行列式的零点对不上');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: ks[0] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
