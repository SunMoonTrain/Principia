// 独立验算 math.linear-algebra.orthogonal-projection 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.orthogonal-projection.ts
// 投影一律解「v − Σc_j w_j 和每个 w_i 正交」的方程组，不靠基正交；再核对投影确实最近：随机挪动系数，距离只会变大。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { add, dot, norm, orthogonalComplement, rng, scale, simpson, solve, sub, type Vec } from './math.linear-algebra._la.ts';

/** 在 w_1…w_k 张成的子空间上的投影的系数：解 Σ_j c_j⟨w_j,w_i⟩ = ⟨v,w_i⟩。 */
function projectionCoefficients(ip: (a: Vec, b: Vec) => number, ws: Vec[], v: Vec): Vec {
  const G = ws.map((wi) => ws.map((wj) => ip(wj, wi)));
  return solve(
    G,
    ws.map((wi) => ip(v, wi)),
  );
}

const combine = (ws: Vec[], c: Vec): Vec => ws.reduce((s, w, j) => add(s, scale(c[j], w)), ws[0].map(() => 0));

export const verification: Verification = {
  lesson: 'math.linear-algebra.orthogonal-projection',
  notes: {
    p1: '解两个未知数的方程组求投影（不用两向量正交这一点），核对 v − p 和 u₁、u₂ 都正交。',
    p2: '随机取 3 组 R⁵ 里两个线性无关的向量，求和它们都正交的向量组成的子空间（正交补）的维数，核对 3 次相同。',
    p3: '解方程组求投影 p，距离的平方是 |v − p|²；再随机挪动 200 次系数，核对距离都不更小。',
    p4: '在 C[−1,1] 上用辛普森公式算内积，解 1、x 的方程组求 x³ 的投影 ax + b；再随机挪动 200 次 (a, b)，核对积分都不更小。',
  },
  compute() {
    const rand = rng(23);

    // p1
    const u1 = [1, 1, 1];
    const u2 = [1, -1, 0];
    const v1 = [1, 2, 0];
    const p1 = combine([u1, u2], projectionCoefficients(dot, [u1, u2], v1));
    if (Math.abs(dot(sub(v1, p1), u1)) > 1e-12 || Math.abs(dot(sub(v1, p1), u2)) > 1e-12) throw new Error('p1：残差不正交');

    // p2
    let p2 = NaN;
    for (let trial = 0; trial < 3; trial++) {
      const a = Array.from({ length: 5 }, () => rand() * 4 - 2);
      const b = Array.from({ length: 5 }, () => rand() * 4 - 2);
      const d = orthogonalComplement([a, b], 5).length;
      if (!Number.isNaN(p2) && d !== p2) throw new Error('p2：不同的例子结果不同');
      p2 = d;
    }

    // p3
    const w = [
      [1, 0, 1],
      [0, 1, 1],
    ];
    const v3 = [3, 1, 0];
    const c3 = projectionCoefficients(dot, w, v3);
    const dist2 = (c: Vec): number => norm(sub(v3, combine(w, c))) ** 2;
    const p3 = dist2(c3);
    for (let t = 0; t < 200; t++) {
      const c = c3.map((x) => x + (rand() - 0.5) * 2);
      if (dist2(c) < p3 - 1e-12) throw new Error('p3：找到更近的点');
    }

    // p4：多项式用系数表示，内积数值积分
    const poly = (p: Vec) => (x: number) => p.reduce((s, a, i) => s + a * x ** i, 0);
    const ip = (p: Vec, q: Vec): number => simpson((x) => poly(p)(x) * poly(q)(x), -1, 1);
    const basis = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
    ];
    const cube = [0, 0, 0, 1];
    const [b4, a4] = projectionCoefficients(ip, basis, cube);
    const err = (a: number, b: number): number => simpson((x) => (x ** 3 - a * x - b) ** 2, -1, 1);
    for (let t = 0; t < 200; t++) {
      if (err(a4 + (rand() - 0.5), b4 + (rand() - 0.5)) < err(a4, b4) - 1e-12) throw new Error('p4：找到误差更小的一次函数');
    }

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: a4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
