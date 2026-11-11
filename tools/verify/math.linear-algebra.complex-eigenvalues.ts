// 独立验算 math.linear-algebra.complex-eigenvalues 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.complex-eigenvalues.ts
// 特征多项式用法捷耶夫-勒维耶递推，复根用杜朗-克尔纳迭代（不用求根公式）；特征向量用复数运算解方程组再代回。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cabs, charPoly, cdiv, cmul, csub, matMul, matVec, norm, polyRoots, rng, transpose, type Cx, type Mat } from './math.linear-algebra._la.ts';

/** 虚部为正的那个复特征值；核对另一个是它的共轭。 */
function upperEigenvalue(A: Mat): Cx {
  const roots = polyRoots(charPoly(A));
  const up = roots.find((z) => z[1] > 1e-9);
  const down = roots.find((z) => z[1] < -1e-9);
  if (!up || !down || cabs(csub(up, [down[0], -down[1]])) > 1e-9) throw new Error('不是一对共轭复根');
  return up;
}

export const verification: Verification = {
  lesson: 'math.linear-algebra.complex-eigenvalues',
  notes: {
    p1: '法捷耶夫-勒维耶递推求特征多项式，杜朗-克尔纳迭代求复根，取虚部为正的那个，核对另一个是它的共轭。',
    p2: '核对 AᵀA 是单位矩阵的倍数（A 保持夹角），倍数开方就是 r；再随机取 20 个向量核对 |Ax|/|x| 都等于 r。',
    p3: '同 p1。',
    p4: '复数运算：由 (A − λI)v = 0 的第一行解出 v = (1, y)，再核对第二行也成立、Av = λv 两个分量都对。',
  },
  compute() {
    // p1
    const p1 = upperEigenvalue([
      [3, -4],
      [4, 3],
    ]);

    // p2
    const s = Math.sqrt(3);
    const A2 = [
      [1, -s],
      [s, 1],
    ];
    const G = matMul(transpose(A2), A2);
    if (Math.abs(G[0][1]) > 1e-12 || Math.abs(G[1][0]) > 1e-12 || Math.abs(G[0][0] - G[1][1]) > 1e-12) throw new Error('p2：不是旋转加伸缩');
    const p2 = Math.sqrt(G[0][0]);
    const rand = rng(71);
    for (let trial = 0; trial < 20; trial++) {
      const x = [rand() * 4 - 2, rand() * 4 - 2];
      if (Math.abs(norm(matVec(A2, x)) / norm(x) - p2) > 1e-9) throw new Error('p2：伸缩倍数不一致');
    }

    // p3
    const p3 = upperEigenvalue([
      [2, -5],
      [1, 0],
    ]);

    // p4
    const A4 = [
      [3, -2],
      [4, -1],
    ];
    const lambda: Cx = [1, 2];
    if (cabs(csub(upperEigenvalue(A4), lambda)) > 1e-9) throw new Error('p4：1 + 2i 不是特征值');
    // 第一行：(a11 − λ)·1 + a12·y = 0
    const y = cdiv(csub([0, 0], csub([A4[0][0], 0], lambda)), [A4[0][1], 0]);
    const v: Cx[] = [[1, 0], y];
    const Av = A4.map((row) => cmul([row[0], 0], v[0]).map((x, k) => x + cmul([row[1], 0], v[1])[k]) as Cx);
    const lv = v.map((z) => cmul(lambda, z));
    if (Av.some((z, i) => cabs(csub(z, lv[i])) > 1e-12)) throw new Error('p4：Av ≠ λv');

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'tuple', value: y },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
