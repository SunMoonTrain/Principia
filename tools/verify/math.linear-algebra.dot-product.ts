// 独立验算 math.linear-algebra.dot-product 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.dot-product.ts
// 夹角不用 cos 公式，用两个向量各自的方向角相减；分解不用投影公式，对系数求 |u − cv|² 的最小值。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { argMin, dot, norm, scale, sub } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.dot-product',
  notes: {
    p1: '长度 = 各分量平方和的平方根。',
    p2: '对 k 找 u·v(k) 的零点（[−10, 10] 上细扫再二分，格点错开整数），核对只有一个。',
    p3: '两个向量的方向角用 atan2 各自算出，相减取绝对值（落在 [0, π]）。',
    p4: '|u − cv|² 是 c 的二次函数，在 c = −1、0、1 取值定出抛物线，顶点就是最小值点（再用黄金分割法搜一遍核对）；剩下的 u − cv 就是与 v 正交的部分，再核对它和 v 的点积为零。',
  },
  compute() {
    // p1
    const p1 = norm([2, -6, 3]);

    // p2
    const roots = rootsOf((k) => dot([k, 2, -1], [3, k, 4]), -10.0123, 9.9871, 4000);
    if (roots.length !== 1) throw new Error('p2：零点不唯一');

    // p3
    let p3 = Math.abs(Math.atan2(2, 1) - Math.atan2(1, 3));
    if (p3 > Math.PI) p3 = 2 * Math.PI - p3;

    // p4
    const u = [3, 1, 2];
    const v = [1, 1, 1];
    // |u − cv|² 是 c 的二次函数：在 c = −1、0、1 取三个值定出抛物线，顶点就是最小值点（比数值搜索准）
    const f = (t: number): number => dot(sub(u, scale(t, v)), sub(u, scale(t, v)));
    const qa = (f(1) + f(-1) - 2 * f(0)) / 2;
    const qb = (f(1) - f(-1)) / 2;
    const c = -qb / (2 * qa);
    if (Math.abs(argMin((t) => norm(sub(u, scale(t, v))), -10, 10) - c) > 1e-6) throw new Error('p4：两种求最小值的办法不一致');
    const perp = sub(u, scale(c, v));
    if (Math.abs(dot(perp, v)) > 1e-12) throw new Error('p4：剩下的部分和 v 不正交');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: roots[0] },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: perp },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
