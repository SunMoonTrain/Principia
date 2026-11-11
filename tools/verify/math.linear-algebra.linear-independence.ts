// 独立验算 math.linear-algebra.linear-independence 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.linear-independence.ts
// 线性无关用施密特正交化判断（一个都不丢就是无关），不用消元；三个向量相关看混合积。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { add, dot, scale, solve, spanDim, sub, triple } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.linear-independence',
  notes: {
    p1: '(2, k) 在和 (1, 3) 垂直的方向 (−3, 1) 上的分量为零时两者平行：对 k 找零点，核对只有一个，并且正交化后只剩 1 个向量。',
    p2: '每组向量做施密特正交化，一个都没丢的就是线性无关。',
    p3: '最小二乘：由法方程解出使 |a v1 + b v2 − v3| 最小的 a、b，再核对剩下的为零。',
    p4: '三个向量相关 ⟺ 混合积为零：对 h 找零点，核对只有一个，并且正交化后只剩 2 个向量。',
  },
  compute() {
    // p1
    const ks = rootsOf((k) => dot([2, k], [-3, 1]), -10.0123, 9.9871, 4000);
    if (ks.length !== 1) throw new Error('p1：k 不唯一');
    if (spanDim([
      [1, 3],
      [2, ks[0]],
    ]) !== 1) throw new Error('p1：不平行');

    // p2
    const groups = [
      [
        [1, 2],
        [3, 4],
      ],
      [
        [1, 0, 1],
        [2, 0, 2],
      ],
      [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 1],
        [1, 0, 1],
      ],
      [
        [1, 2],
        [2, 1],
        [1, 1],
      ],
    ];
    const p2 = groups.flatMap((g, i) => (spanDim(g) === g.length ? [i + 1] : []));

    // p3
    const v1 = [1, 1, 2];
    const v2 = [2, -1, 1];
    const v3 = [4, 1, 5];
    const [a, b] = solve(
      [
        [dot(v1, v1), dot(v1, v2)],
        [dot(v2, v1), dot(v2, v2)],
      ],
      [dot(v1, v3), dot(v2, v3)],
    );
    if (sub(add(scale(a, v1), scale(b, v2)), v3).some((x) => Math.abs(x) > 1e-12)) throw new Error('p3：v3 不在 v1、v2 张成的平面里');

    // p4
    const hs = rootsOf((h) => triple([1, 2, 1], [2, h, 0], [0, 1, 1]), -10.0123, 9.9871, 4000);
    if (hs.length !== 1) throw new Error('p4：h 不唯一');
    if (spanDim([
      [1, 2, 1],
      [2, hs[0], 0],
      [0, 1, 1],
    ]) !== 2) throw new Error('p4：不相关');

    return {
      p1: { type: 'number', value: ks[0] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [a, b] },
      p4: { type: 'number', value: hs[0] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
