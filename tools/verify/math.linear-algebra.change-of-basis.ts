// 独立验算 math.linear-algebra.change-of-basis 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.change-of-basis.ts
// 坐标一律按定义（解 Σ c_i b_i = v）求，基变换矩阵逐列求出，不用 P_C⁻¹ P_B 这类公式；多项式用在几个点上取值的办法。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { add, fromColumns, matVec, rng, scale, solve } from './math.linear-algebra._la.ts';

const evalPoly = (p: number[], x: number): number => p.reduce((s, a, i) => s + a * x ** i, 0);

export const verification: Verification = {
  lesson: 'math.linear-algebra.change-of-basis',
  notes: {
    p1: '按定义解 a(1, 0) + b(1, 2) = (3, 1)。',
    p2: 'P_B 的两列就是两个基向量，v = 3 b1 − b2 直接组合出来。',
    p3: '逐列求：第 j 列是 b_j 在 C 下的坐标（解 c·c1 + d·c2 = b_j）。再随机取 20 个向量核对 [v]_C = P [v]_B。',
    p4: '在 x = 0、1、2 三点取值，解出 x² = c1 + c2(x + 1) + c3(x + 1)²；再在 x = −2、3、0.7 核对两边相等。',
  },
  compute() {
    // p1
    const p1 = solve(
      fromColumns([
        [1, 0],
        [1, 2],
      ]),
      [3, 1],
    );

    // p2
    const p2 = add(scale(3, [2, 1]), scale(-1, [1, 1]));

    // p3
    const B = [
      [1, 0],
      [1, 1],
    ];
    const C = [
      [2, 1],
      [1, 1],
    ];
    const coordC = (v: number[]): number[] => solve(fromColumns(C), v);
    const coordB = (v: number[]): number[] => solve(fromColumns(B), v);
    const P = fromColumns(B.map(coordC));
    const rand = rng(40);
    for (let trial = 0; trial < 20; trial++) {
      const v = [rand() * 6 - 3, rand() * 6 - 3];
      if (matVec(P, coordB(v)).some((x, i) => Math.abs(x - coordC(v)[i]) > 1e-9)) throw new Error('p3：P 换不对坐标');
    }

    // p4
    const basis = [[1], [1, 1], [1, 2, 1]];
    const target = [0, 0, 1];
    const xs = [0, 1, 2];
    const p4 = solve(
      xs.map((x) => basis.map((q) => evalPoly(q, x))),
      xs.map((x) => evalPoly(target, x)),
    );
    for (const x of [-2, 3, 0.7]) {
      if (Math.abs(basis.reduce((s, q, i) => s + p4[i] * evalPoly(q, x), 0) - evalPoly(target, x)) > 1e-9) throw new Error('p4：不是恒等式');
    }

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'tuple', value: P.flat() },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
