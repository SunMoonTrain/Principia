// 独立验算 math.linear-algebra.dual-space 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.dual-space.ts
// 线性函数在 R^n 上写成系数 (a_1, …, a_n)，由它在一组基上的值解方程组定出来；多项式按系数表示。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { dot, matVec, polyDeriv, polyEval, rng, solve, transpose, type Vec } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.dual-space',
  notes: {
    p1: 'f₁ = ax + by 要满足 f₁(b₁) = 1、f₁(b₂) = 0：解这个方程组，再核对 f₂ 同理解出后 f_i(b_j) 正好是 1 或 0。',
    p2: '按线性展开：f(2, −1, 3) = 2f(e₁) − f(e₂) + 3f(e₃)。',
    p3: '对偶基 f_i 取 x^i 的系数，所以 a、b、c 就是 f 在 1、x、x² 上的值；再随机取 20 个多项式核对 f(p) = a·p₀ + b·p₁ + c·p₂。',
    p4: '由 f(b₁) = 2、f(b₂) = −1 解出 f 在标准坐标下的系数，再算 f(c₁)、f(c₂)。',
  },
  compute() {
    // p1
    const B1 = [
      [1, 0],
      [2, 1],
    ];
    const f1 = solve(B1, [1, 0]);
    const f2 = solve(B1, [0, 1]);
    B1.forEach((b, j) => {
      if (Math.abs(dot(f1, b) - (j === 0 ? 1 : 0)) > 1e-12 || Math.abs(dot(f2, b) - (j === 1 ? 1 : 0)) > 1e-12) throw new Error('p1：不是对偶基');
    });

    // p2
    const values = [4, 1, -2];
    const p2 = [2, -1, 3].reduce((s, x, i) => s + x * values[i], 0);

    // p3
    const f = (p: number[]): number => polyEval(p, 1) + polyEval(polyDeriv(p), 0);
    const p3 = [[1], [0, 1], [0, 0, 1]].map(f);
    const rand = rng(21);
    for (let trial = 0; trial < 20; trial++) {
      const p = [rand() * 4 - 2, rand() * 4 - 2, rand() * 4 - 2];
      if (Math.abs(f(p) - dot(p3, p)) > 1e-9) throw new Error('p3：展开不对');
    }

    // p4
    const B4 = [
      [1, 0],
      [1, 1],
    ];
    const coef: Vec = solve(B4, [2, -1]);
    const C4 = [
      [1, 1],
      [0, 1],
    ];
    const p4 = matVec(C4, coef);
    // 换一种算法核对：c_k 在 B 下的坐标排成 P_{B←C}，行 [f]_B 乘它
    const P = transpose(C4.map((c) => solve(transpose(B4), c)));
    const viaP = [0, 1].map((k) => [2, -1].reduce((s, x, j) => s + x * P[j][k], 0));
    if (viaP.some((x, i) => Math.abs(x - p4[i]) > 1e-12)) throw new Error('p4：两种算法不一致');

    return {
      p1: { type: 'tuple', value: f1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
