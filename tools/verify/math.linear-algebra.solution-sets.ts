// 独立验算 math.linear-algebra.solution-sets 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.solution-sets.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { add, matVec, rng, rref, scale, solve, sub } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.solution-sets',
  notes: {
    p1: '自由变量个数 = 未知数个数 − 系数部分的主元个数（对系数部分重新化简化行阶梯形数主元）。',
    p2: '由 x₃ = t 解出 t，代回通解。',
    p3: '把条件 x₁ − x₂ = 0 当作第三个方程，解 3×3 方程组；再核对它满足原来两个方程。',
    p4:
      '随机造 200 个以 p、q 为解的方程组（1 到 3 个方程、系数矩阵的每一行都和 q − p 正交、常数项由 Ap 定出，常数项一般不为零），' +
      '逐个检查每个选项是不是对应齐次方程组的解；对所有方程组都是解的选项才选。',
  },
  compute() {
    // p1
    const coefPart = [
      [1, 0, 2, 0],
      [0, 1, -1, 0],
      [0, 0, 0, 1],
    ];
    const p1 = 4 - rref(coefPart).pivots.length;

    // p2
    const p = [1, 2, 0];
    const d = [3, -1, 1];
    const t = (2 - p[2]) / d[2];
    const p2 = add(p, scale(t, d));

    // p3
    const A3 = [
      [1, 2, 1],
      [2, 4, 3],
      [1, -1, 0],
    ];
    const p3 = solve(A3, [4, 9, 0]);
    if (Math.abs(matVec([A3[0]], p3)[0] - 4) > 1e-12 || Math.abs(matVec([A3[1]], p3)[0] - 9) > 1e-12) throw new Error('p3：不满足原方程');

    // p4
    const P = [1, 2, 3];
    const Q = [2, 1, 4];
    const diff = sub(Q, P);
    const options = [
      [1, -1, 1],
      [3, 3, 7],
      [-2, 2, -2],
      [2, 4, 6],
    ];
    const always = options.map(() => true);
    const rand = rng(20261111);
    for (let trial = 0; trial < 200; trial++) {
      const m = 1 + Math.floor(rand() * 3);
      const rows: number[][] = [];
      for (let i = 0; i < m; i++) {
        // 随机向量减去它在 q − p 方向上的部分，保证和 q − p 正交
        const r = [rand() * 4 - 2, rand() * 4 - 2, rand() * 4 - 2];
        const c = (r[0] * diff[0] + r[1] * diff[1] + r[2] * diff[2]) / (diff[0] ** 2 + diff[1] ** 2 + diff[2] ** 2);
        rows.push(sub(r, scale(c, diff)));
      }
      const b = matVec(rows, P);
      if (matVec(rows, Q).some((v, i) => Math.abs(v - b[i]) > 1e-9)) throw new Error('p4：q 不是解');
      options.forEach((o, k) => {
        if (matVec(rows, o).some((v) => Math.abs(v) > 1e-9)) always[k] = false;
      });
    }
    const p4 = always.flatMap((ok, k) => (ok ? [k + 1] : []));

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
