// 独立验算 math.linear-algebra.gram-schmidt 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.gram-schmidt.ts
// 施密特正交化照定义写成通用的函数（内积作参数）；坐标解方程组求，不用「坐标就是内积」；函数的内积用辛普森公式。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { dot, fromColumns, matMul, scale, simpson, solve, sub, transpose, type Vec } from './math.linear-algebra._la.ts';

/** 施密特正交化（不单位化）：u_j = a_j − Σ_{i<j} ⟨a_j,u_i⟩/⟨u_i,u_i⟩ u_i。 */
function gramSchmidt(ip: (a: Vec, b: Vec) => number, as: Vec[]): Vec[] {
  const us: Vec[] = [];
  for (const a of as) us.push(us.reduce((w, u) => sub(w, scale(ip(a, u) / ip(u, u), u)), a));
  return us;
}

export const verification: Verification = {
  lesson: 'math.linear-algebra.gram-schmidt',
  notes: {
    p1: '核对 q₁、q₂ 正交规范，再解方程组 c₁q₁ + c₂q₂ = v 求坐标。',
    p2: '照定义写的施密特正交化（点积），取 u₂。',
    p3: '各列做施密特正交化再单位化得 Q，R = QᵀA；核对 QR = A、QᵀQ = I、R 的左下角为 0、对角元为正。',
    p4: '多项式按系数表示，C[0,1] 的内积用辛普森公式；对 1、x 做施密特正交化，a² = 1/‖u₂‖²，并核对 u₂ = x − 1/2。',
  },
  compute() {
    // p1
    const q1 = [3 / 5, 4 / 5];
    const q2 = [-4 / 5, 3 / 5];
    if (Math.abs(dot(q1, q2)) > 1e-12 || Math.abs(dot(q1, q1) - 1) > 1e-12 || Math.abs(dot(q2, q2) - 1) > 1e-12) throw new Error('p1：不是正交规范基');
    const p1 = solve(fromColumns([q1, q2]), [2, 1]);

    // p2
    const p2 = gramSchmidt(dot, [
      [1, 0, 1],
      [2, 1, 0],
    ])[1];

    // p3
    const A = [
      [3, 1],
      [4, 2],
    ];
    const cols = transpose(A);
    const qs = gramSchmidt(dot, cols).map((u) => scale(1 / Math.sqrt(dot(u, u)), u));
    const Q = fromColumns(qs);
    const R = matMul(transpose(Q), A);
    const QR = matMul(Q, R);
    const QtQ = matMul(transpose(Q), Q);
    if (QR.some((row, i) => row.some((x, j) => Math.abs(x - A[i][j]) > 1e-12))) throw new Error('p3：QR ≠ A');
    if (QtQ.some((row, i) => row.some((x, j) => Math.abs(x - (i === j ? 1 : 0)) > 1e-12))) throw new Error('p3：Q 的列不正交规范');
    if (Math.abs(R[1][0]) > 1e-12 || R[0][0] <= 0 || R[1][1] <= 0) throw new Error('p3：R 的形状不对');

    // p4
    const poly = (p: Vec) => (x: number) => p.reduce((s, a, i) => s + a * x ** i, 0);
    const ip = (p: Vec, q: Vec): number => simpson((x) => poly(p)(x) * poly(q)(x), 0, 1);
    const [, u2] = gramSchmidt(ip, [
      [1, 0],
      [0, 1],
    ]);
    if (Math.abs(u2[0] + 0.5) > 1e-12 || Math.abs(u2[1] - 1) > 1e-12) throw new Error('p4：u₂ 不是 x − 1/2');
    const p4 = 1 / ip(u2, u2);

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'tuple', value: [R[0][0], R[0][1], R[1][1]] },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
