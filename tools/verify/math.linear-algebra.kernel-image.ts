// 独立验算 math.linear-algebra.kernel-image 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.kernel-image.ts
// 多项式按系数表示，映射逐个作用在 1, x, x², … 上排成矩阵；维数用施密特正交化、正交补数个数，不用维数公式。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import {
  orthogonalComplement,
  polyAdd,
  polyDeriv,
  polyEval,
  polyMul,
  polyPad,
  polyScale,
  rng,
  scale,
  spanDim,
  transpose,
  type Mat,
  type Vec,
} from './math.linear-algebra._la.ts';

const monomial = (k: number): number[] => Array.from({ length: k + 1 }, (_, i) => (i === k ? 1 : 0));

export const verification: Verification = {
  lesson: 'math.linear-algebra.kernel-image',
  notes: {
    p1: '随机造 3 个秩为 3 的 3×5 矩阵（满射），核是 R⁵ 里和各行都正交的向量：用正交补数个数，核对 3 次相同。',
    p2: '每个映射随机取 200 组 p、q 和数 c，检验 T(p + q) = T(p) + T(q)、T(cp) = cT(p)；多项式按系数算，两条都过的才算线性映射。',
    p3: '把 T 作用在 1、x、x²、x³ 上，系数排成矩阵，各列做施密特正交化数剩下几个。',
    p4: 'T(1)、T(x)、T(x²) 排成 2×3 矩阵，核是各行的正交补：核对只有一维，把 x² 的系数缩放成 1；再核对 T 把它送到 (0, 0)。',
  },
  compute() {
    const rand = rng(11);

    // p1
    let p1 = -1;
    for (let trial = 0; trial < 3; trial++) {
      const A: Mat = Array.from({ length: 3 }, () => Array.from({ length: 5 }, () => rand() * 4 - 2));
      if (spanDim(transpose(A)) !== 3) throw new Error('p1：不是满射');
      const k = orthogonalComplement(A, 5).length;
      if (p1 >= 0 && k !== p1) throw new Error('p1：不同的矩阵结果不同');
      p1 = k;
    }

    // p2：每个选项给出「取一个元素」和映射本身，映射的值统一写成一组数
    type Option = { sample: () => Vec; map: (p: Vec) => Vec };
    const randPoly = (): Vec => Array.from({ length: 3 }, () => rand() * 4 - 2);
    const options: Option[] = [
      { sample: randPoly, map: (p) => polyPad(polyMul([0, 1], p), 4) },
      { sample: randPoly, map: (p) => [polyEval(p, 0) * polyEval(p, 1)] },
      { sample: randPoly, map: (p) => [polyEval(p, 2) - polyEval(p, -2)] },
      { sample: () => [rand() * 4 - 2, rand() * 4 - 2], map: ([x, y]) => [x * y, 0] },
      { sample: randPoly, map: (p) => [polyEval(polyDeriv(p), 0), polyEval(p, 1)] },
    ];
    const close = (u: Vec, v: Vec): boolean => u.every((x, i) => Math.abs(x - v[i]) < 1e-9);
    const p2 = options.flatMap((o, i) => {
      for (let trial = 0; trial < 200; trial++) {
        const p = o.sample();
        const q = o.sample();
        const c = rand() * 6 - 3;
        const sum = polyAdd(p, q);
        if (!close(o.map(sum), polyAdd(o.map(p), o.map(q))) || !close(o.map(polyScale(c, p)), scale(c, o.map(p)))) return [];
      }
      return [i + 1];
    });

    // p3
    const T3 = (p: number[]): number[] => polyAdd(polyMul([0, 1], polyDeriv(p)), polyScale(-1, p));
    const images3 = [0, 1, 2, 3].map((k) => polyPad(T3(monomial(k)), 4));
    const p3 = spanDim(images3);

    // p4
    const T4 = (p: number[]): Vec => [polyEval(p, 1), polyEval(polyDeriv(p), 0)];
    const M4 = transpose([0, 1, 2].map((k) => T4(monomial(k))));
    const ker = orthogonalComplement(M4, 3);
    if (ker.length !== 1) throw new Error('p4：核不是一维');
    const g = scale(1 / ker[0][2], ker[0]);
    if (T4(g).some((x) => Math.abs(x) > 1e-12)) throw new Error('p4：不在核里');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [g[0], g[1]] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
