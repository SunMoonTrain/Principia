// 独立验算 math.linear-algebra.quadratic-forms 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.quadratic-forms.ts
// p1 用二次型在 e_i、e_i + e_j 上的值反推矩阵；p2、p3 在单位圆上求二次型的最小值、最大值；
// p4 用对称消元（配方）数主元的正负号，再拿特征值的正负号核对。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { charPoly, circleMinMax, matVec, dot, polyRoots, type Mat, type Vec } from './math.linear-algebra._la.ts';

const form = (A: Mat) => (x: Vec): number => dot(x, matVec(A, x));

/** 对称消元（不换行）：依次取主元 d_k，从后面的行列减去，相当于逐个配方。返回各主元。 */
function pivots(A: Mat): number[] {
  const M = A.map((row) => [...row]);
  const n = M.length;
  const d: number[] = [];
  for (let k = 0; k < n; k++) {
    if (Math.abs(M[k][k]) < 1e-12) throw new Error('主元为 0');
    d.push(M[k][k]);
    for (let i = k + 1; i < n; i++) for (let j = k + 1; j < n; j++) M[i][j] -= (M[i][k] * M[k][j]) / M[k][k];
  }
  return d;
}

export const verification: Verification = {
  lesson: 'math.linear-algebra.quadratic-forms',
  notes: {
    p1: 'a_ii = Q(e_i)，a_12 = [Q(e₁ + e₂) − Q(e₁) − Q(e₂)]/2，只用二次型的值。',
    p2: '每个矩阵在单位圆上粗扫再细化求 xᵀAx 的最小值，最小值大于 0 才正定。',
    p3: '单位圆上 6x² + 4xy + 3y² 的最小值、最大值就是 λ₁、λ₂；再和特征多项式的根核对。',
    p4: '写出对称矩阵，对称消元（逐个配方）得主元，数正负；再求特征多项式的根，核对正、负特征值的个数相同。',
  },
  compute() {
    // p1
    const Q1 = (x: number, y: number): number => 3 * x * x - 6 * x * y + 2 * y * y;
    const a12 = (Q1(1, 1) - Q1(1, 0) - Q1(0, 1)) / 2;
    const p1 = [Q1(1, 0), a12, a12, Q1(0, 1)];

    // p2
    const options: Mat[] = [
      [
        [2, 1],
        [1, 3],
      ],
      [
        [2, 3],
        [3, 4],
      ],
      [
        [-1, 0],
        [0, -2],
      ],
      [
        [4, -2],
        [-2, 2],
      ],
      [
        [1, 1],
        [1, 1],
      ],
    ];
    const p2 = options.flatMap((A, k) => (circleMinMax(form(A))[0] > 1e-7 ? [k + 1] : []));

    // p3
    const A3 = [
      [6, 2],
      [2, 3],
    ];
    const p3 = circleMinMax(form(A3));
    const roots3 = polyRoots(charPoly(A3))
      .map(([re]) => re)
      .sort((a, b) => a - b);
    if (Math.abs(roots3[0] - p3[0]) > 1e-8 || Math.abs(roots3[1] - p3[1]) > 1e-8) throw new Error('p3：和特征值对不上');

    // p4：Q = x1² + 2x1x2 + 2x2² + 4x2x3 + x3²
    const A4 = [
      [1, 1, 0],
      [1, 2, 2],
      [0, 2, 1],
    ];
    const d = pivots(A4);
    const p4 = [d.filter((x) => x > 0).length, d.filter((x) => x < 0).length];
    const ev = polyRoots(charPoly(A4)).map(([re, im]) => {
      if (Math.abs(im) > 1e-9) throw new Error('p4：有复特征值');
      return re;
    });
    if (ev.filter((x) => x > 0).length !== p4[0] || ev.filter((x) => x < 0).length !== p4[1]) throw new Error('p4：和特征值的正负个数不同');
    // 核对矩阵写对了：随机几个点上 xᵀAx 等于原式
    for (const x of [
      [1, 2, 3],
      [-1, 0.5, 2],
      [0.3, -2, 1],
    ]) {
      const direct = x[0] ** 2 + 2 * x[0] * x[1] + 2 * x[1] ** 2 + 4 * x[1] * x[2] + x[2] ** 2;
      if (Math.abs(form(A4)(x) - direct) > 1e-12) throw new Error('p4：矩阵写错');
    }

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
