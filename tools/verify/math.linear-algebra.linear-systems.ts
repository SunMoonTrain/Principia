// 独立验算 math.linear-algebra.linear-systems 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.linear-systems.ts
// 解的情况按秩判断：系数矩阵的秩、增广矩阵的秩、未知数个数三者比较，不用正文的三种情况定理。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { det, matVec, rref, solve } from './math.linear-algebra._la.ts';

const rank = (M: number[][]): number => rref(M).pivots.length;

export const verification: Verification = {
  lesson: 'math.linear-algebra.linear-systems',
  notes: {
    p1: '化 (A | b) 的简化行阶梯形解出，再代回两个方程核对。',
    p2: '按秩分类：增广矩阵的秩大于系数矩阵的秩是无解，相等且等于未知数个数是唯一解，相等且小于是无穷多解。选项依次是无解、唯一、无穷多。',
    p3: '化 (A | b) 的简化行阶梯形解出，再代回三个方程核对。',
    p4: '先对 h 找系数矩阵行列式的零点（只有一个），再在这个 h 下对 k 找「增广矩阵的秩等于系数矩阵的秩」的 k：用增广矩阵去掉第 3 列后的 3×3 子式的行列式对 k 求零点；最后核对这时两个秩都是 2、小于 3。',
  },
  compute() {
    // p1
    const A1 = [
      [1, 3],
      [2, -1],
    ];
    const p1 = solve(A1, [5, 3]);
    if (matVec(A1, p1).some((v, i) => Math.abs(v - [5, 3][i]) > 1e-12)) throw new Error('p1：代回不成立');

    // p2
    const aug = [
      [1, -3, 2, 4],
      [0, 2, -1, 1],
      [0, 0, 0, 0],
    ];
    const rA = rank(aug.map((r) => r.slice(0, 3)));
    const rAb = rank(aug);
    const kind = rAb > rA ? 1 : rA === 3 ? 2 : 3;

    // p3
    const A3 = [
      [1, 1, 1],
      [2, -1, 1],
      [1, 2, -1],
    ];
    const p3 = solve(A3, [6, 3, 2]);
    if (matVec(A3, p3).some((v, i) => Math.abs(v - [6, 3, 2][i]) > 1e-12)) throw new Error('p3：代回不成立');

    // p4
    const coef = (h: number): number[][] => [
      [1, 1, 1],
      [1, 2, 2],
      [1, 2, h],
    ];
    const hs = rootsOf((h) => det(coef(h)), -10.0123, 9.9871, 4000);
    if (hs.length !== 1) throw new Error('p4：h 不唯一');
    const h = hs[0];
    const minor = (k: number): number =>
      det([
        [1, 1, 1],
        [1, 2, 2],
        [1, 2, k],
      ]);
    const ks = rootsOf(minor, -10.0123, 9.9871, 4000);
    if (ks.length !== 1) throw new Error('p4：k 不唯一');
    const k = ks[0];
    const augK = coef(h).map((r, i) => [...r, [1, 2, k][i]]);
    if (rank(coef(h)) !== 2 || rank(augK) !== 2) throw new Error('p4：秩不对');

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'choice', value: [kind] },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'tuple', value: [h, k] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
