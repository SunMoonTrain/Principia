// 独立验算 math.linear-algebra.jordan-form 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.jordan-form.ts
// 维数、秩用正交补和施密特正交化数个数；p4 不用「块数等于秩之差」的公式，把 4 拆成若干块的每种拆法都造出矩阵，逐个比对秩。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { identity, matMul, matVec, orthogonalComplement, rref, spanDim, type Mat } from './math.linear-algebra._la.ts';

/** 若尔当块 J_m(λ)：主对角线上是 λ，紧挨着上方的斜线上是 1。 */
const jordanBlock = (m: number, l: number): Mat =>
  Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => (i === j ? l : j === i + 1 ? 1 : 0)));

/** 几个方阵沿主对角线拼起来。 */
function blockDiag(blocks: Mat[]): Mat {
  const n = blocks.reduce((s, b) => s + b.length, 0);
  const M: Mat = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  let at = 0;
  for (const b of blocks) {
    b.forEach((row, i) => row.forEach((x, j) => (M[at + i][at + j] = x)));
    at += b.length;
  }
  return M;
}

/** n 拆成不增的正整数之和的全部拆法。 */
function partitions(n: number, max = n): number[][] {
  if (n === 0) return [[]];
  const out: number[][] = [];
  for (let first = Math.min(n, max); first >= 1; first--) for (const rest of partitions(n - first, first)) out.push([first, ...rest]);
  return out;
}

export const verification: Verification = {
  lesson: 'math.linear-algebra.jordan-form',
  notes: {
    p1: '按定义造 J₃(5)，特征空间是 J₃(5) − 5I 各行的正交补，数个数。',
    p2: '把 N 一次次乘下去，看第几次成了零矩阵。',
    p3: '把「第一个分量为 0」当作第三个方程，和 (A − 2I)w = v 的两个方程一起化成简化行阶梯形，核对恰有一个解。',
    p4: '4 的每种拆法造出特征值为 0 的若尔当矩阵，算 A、A²、A³ 的秩（各行正交化后数个数），找出秩是 2、1、0 的拆法，核对只有一种，取最大的块。',
  },
  compute() {
    // p1
    const J = jordanBlock(3, 5);
    const p1 = orthogonalComplement(
      J.map((row, i) => row.map((x, j) => x - (i === j ? 5 : 0))),
      3,
    ).length;

    // p2
    const N = [
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ];
    let power = N;
    let p2 = 1;
    while (power.flat().some((x) => x !== 0)) {
      power = matMul(power, N);
      p2++;
      if (p2 > 10) throw new Error('p2：不是幂零的');
    }

    // p3
    const A3 = [
      [3, 1],
      [-1, 1],
    ];
    const B3 = A3.map((row, i) => row.map((x, j) => x - 2 * identity(2)[i][j]));
    const v = [1, -1];
    if (matVec(A3, v).some((x, i) => Math.abs(x - 2 * v[i]) > 1e-12)) throw new Error('p3：v 不是特征向量');
    const { R, pivots } = rref([
      [B3[0][0], B3[0][1], v[0]],
      [B3[1][0], B3[1][1], v[1]],
      [1, 0, 0],
    ]);
    if (pivots.length !== 2 || pivots.includes(2)) throw new Error('p3：解不唯一或无解');
    const w = [R[0][2], R[1][2]];

    // p4
    const target = [2, 1, 0];
    const matches = partitions(4).filter((sizes) => {
      const A = blockDiag(sizes.map((m) => jordanBlock(m, 0)));
      let P = A;
      return target.every((r) => {
        const ok = spanDim(P) === r;
        P = matMul(P, A);
        return ok;
      });
    });
    if (matches.length !== 1) throw new Error('p4：符合条件的拆法不止一种');
    const p4 = Math.max(...matches[0]);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: w },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
