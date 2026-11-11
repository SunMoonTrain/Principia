// 独立验算 math.linear-algebra.similarity 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.similarity.ts
// 按定义算：算子作用在每个基向量上，再解方程组求像在这组基下的坐标，排成各列；p4 不用换基公式，直接算 T(e₁)、T(e₂)。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { add, fromColumns, inverse, matMul, matVec, polyAdd, polyDeriv, polyMul, polyPad, polyScale, scale, solve, transpose, type Mat, type Vec } from './math.linear-algebra._la.ts';

/** 把 x 换成 x + 1：Σ a_k (x + 1)^k。 */
function shift(p: number[]): number[] {
  let result: number[] = [0];
  let power: number[] = [1];
  for (const a of p) {
    result = polyAdd(result, polyScale(a, power));
    power = polyMul(power, [1, 1]);
  }
  return result;
}

/** 一组多项式基下的坐标：解「基的系数排成各列」的方程组。 */
const coordsIn = (basis: number[][], p: number[], n: number): Vec => solve(transpose(basis.map((b) => polyPad(b, n))), polyPad(p, n));

const flat = (M: Mat): number[] => M.flat();

export const verification: Verification = {
  lesson: 'math.linear-algebra.similarity',
  notes: {
    p1: '把 x 换成 x + 1 作用在 1、x 上，像在 1、x 下的坐标排成各列。',
    p2: '用 (P | I) 消元求 P⁻¹，再连乘。',
    p3: '基 1、x + 1、(x + 1)² 按系数写出，T 作用后解方程组求像在这组基下的坐标，排成各列；再核对 [T]_C 乘任意坐标、换回多项式，和直接作用 T 一样。',
    p4: 'e₁、e₂ 先解方程组写成 c₁、c₂ 的组合，用 [T]_C 乘坐标，再换回标准坐标，排成各列；再核对 T(c₁)、T(c₂) 正是 [T]_C 各列说的组合。',
  },
  compute() {
    // p1
    const basis1 = [[1], [0, 1]];
    const p1 = flat(fromColumns(basis1.map((b) => coordsIn(basis1, shift(b), 2))));

    // p2
    const A2 = [
      [1, 0],
      [0, 2],
    ];
    const P2 = [
      [1, 1],
      [0, 1],
    ];
    const p2 = flat(matMul(inverse(P2), matMul(A2, P2)));

    // p3
    const T3 = (p: number[]): number[] => polyMul([1, 1], polyDeriv(p));
    const C3 = [[1], [1, 1], [1, 2, 1]];
    const M3 = fromColumns(C3.map((b) => coordsIn(C3, T3(b), 3)));
    const toPoly = (c: Vec): number[] => C3.reduce((s, b, i) => polyAdd(s, polyScale(c[i], b)), [0]);
    for (const c of [
      [2, -1, 3],
      [0.5, 4, -2],
    ]) {
      const direct = polyPad(T3(toPoly(c)), 3);
      const viaMatrix = polyPad(toPoly(matVec(M3, c)), 3);
      if (direct.some((x, i) => Math.abs(x - viaMatrix[i]) > 1e-9)) throw new Error('p3：矩阵不对');
    }

    // p4
    const c4 = [
      [1, 0],
      [1, 1],
    ];
    const TC = [
      [1, 2],
      [0, 3],
    ];
    const Pc = fromColumns(c4);
    const T = (v: Vec): Vec => matVec(Pc, matVec(TC, solve(Pc, v)));
    const std = fromColumns([T([1, 0]), T([0, 1])]);
    c4.forEach((c, k) => {
      const expected = c4.reduce((s, cj, j) => add(s, scale(TC[j][k], cj)), [0, 0]);
      if (matVec(std, c).some((x, i) => Math.abs(x - expected[i]) > 1e-12)) throw new Error('p4：T(c_k) 不对');
    });

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'tuple', value: flat(M3) },
      p4: { type: 'tuple', value: flat(std) },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
