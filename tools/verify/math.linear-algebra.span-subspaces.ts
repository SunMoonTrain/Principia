// 独立验算 math.linear-algebra.span-subspaces 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.span-subspaces.ts
// 在不在两个向量张成的平面里，看和法向量（叉积）的点积；三个向量生成不了 R³ 看混合积；子空间随机取点检验三条。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { add, cross, dot, fromColumns, matVec, norm, rng, scale, solve, spanDim, triple, type Vec } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.span-subspaces',
  notes: {
    p1: '(1, k, 5) 在 span{u, v} 里 ⟺ 它和法向量 u × v 正交：对 k 找点积的零点，核对只有一个；再解前两个分量、代第三个分量，核对真能写成 au + bv。',
    p2: '每个集合随机取 200 组点和数，检验含零向量、和在集合里、数乘在集合里，三条都过的才算子空间。',
    p3: '解 (v1 v2 v3) x = b，再代回核对。',
    p4: '生成不了 R³ ⟺ 三个向量共面 ⟺ 混合积 a · (b × c) 为零：对 h 找零点，核对只有一个；再核对这时正交化后只剩 2 个向量，h 偏一点就是 3 个。',
  },
  compute() {
    // p1
    const u = [1, 1, 1];
    const v = [1, 2, 3];
    const n = cross(u, v);
    if (norm(n) < 1e-12) throw new Error('p1：u、v 平行');
    const ks = rootsOf((k) => dot([1, k, 5], n), -10.0123, 9.9871, 4000);
    if (ks.length !== 1) throw new Error('p1：k 不唯一');
    const w = [1, ks[0], 5];
    const [a, b] = solve(
      [
        [u[0], v[0]],
        [u[1], v[1]],
      ],
      [w[0], w[1]],
    );
    if (Math.abs(a * u[2] + b * v[2] - w[2]) > 1e-9) throw new Error('p1：写不成 au + bv');

    // p2
    type Option = { has: (p: Vec) => boolean; sample: (r: () => number) => Vec };
    const options: Option[] = [
      {
        has: ([x, y]) => Math.abs(2 * x - y) < 1e-9,
        sample: (r) => {
          const t = r() * 10 - 5;
          return [t, 2 * t];
        },
      },
      {
        has: ([x, y]) => Math.abs(2 * x - y - 3) < 1e-9,
        sample: (r) => {
          const t = r() * 10 - 5;
          return [t, 2 * t - 3];
        },
      },
      { has: ([, y]) => y >= -1e-12, sample: (r) => [r() * 10 - 5, r() * 5] },
      {
        has: ([x, y]) => Math.abs(y - x * x) < 1e-9 * Math.max(1, x * x),
        sample: (r) => {
          const t = r() * 4 - 2;
          return [t, t * t];
        },
      },
      // x² + y² = 0 的实数解只有原点
      { has: ([x, y]) => x * x + y * y < 1e-24, sample: () => [0, 0] },
    ];
    const rand = rng(10);
    const p2: number[] = [];
    options.forEach((o, i) => {
      let ok = o.has([0, 0]);
      for (let trial = 0; trial < 200 && ok; trial++) {
        const p = o.sample(rand);
        const q = o.sample(rand);
        const c = rand() * 6 - 3;
        if (!o.has(p) || !o.has(q)) throw new Error('p2：取的点不在集合里');
        if (!o.has(add(p, q)) || !o.has(scale(c, p))) ok = false;
      }
      if (ok) p2.push(i + 1);
    });

    // p3
    const V = fromColumns([
      [1, 0, 1],
      [1, 1, 0],
      [0, 1, 1],
    ]);
    const bb = [3, 1, 4];
    const p3 = solve(V, bb);
    if (matVec(V, p3).some((x, i) => Math.abs(x - bb[i]) > 1e-12)) throw new Error('p3：代回不对');

    // p4
    const c1 = [1, 0, 2];
    const c3 = [0, 1, 1];
    const hs = rootsOf((h) => triple(c1, [2, 1, h], c3), -10.0123, 9.9871, 4000);
    if (hs.length !== 1) throw new Error('p4：h 不唯一');
    if (spanDim([c1, [2, 1, hs[0]], c3]) !== 2 || spanDim([c1, [2, 1, hs[0] + 0.5], c3]) !== 3) throw new Error('p4：维数不对');

    return {
      p1: { type: 'number', value: ks[0] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: hs[0] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
