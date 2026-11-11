// 独立验算 math.linear-algebra.orthogonal-matrices 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.orthogonal-matrices.ts
// 正交矩阵按定义 QᵀQ = I 判断；逆用消元求；p3 在单位圆上找和第一列正交、行列式为 −1 的向量；p4 找 Q 的不动方向。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { argMin, dot, inverse, matMul, matVec, orthogonalComplement, transpose, type Mat, type Vec } from './math.linear-algebra._la.ts';

const isOrthogonal = (Q: Mat): boolean => matMul(transpose(Q), Q).every((row, i) => row.every((x, j) => Math.abs(x - (i === j ? 1 : 0)) < 1e-12));

export const verification: Verification = {
  lesson: 'math.linear-algebra.orthogonal-matrices',
  notes: {
    p1: '逐个乘出 QᵀQ，看是不是单位矩阵。',
    p2: '用 (Q | I) 消元求逆，不用「逆是转置」。',
    p3: '第二列 w = (cos t, sin t)：在 [0, 2π) 上扫 t，找使 |c₁·w| + |det(c₁ w) + 1| 最小的 t，再细化；核对结果正交、行列式为 −1。',
    p4: 'Q − I 各行的正交补就是不动的方向，取它的角度（化到 0° 到 180°）；核对和它垂直的向量被 Q 变成相反向量。',
  },
  compute() {
    // p1
    const s = 1 / Math.sqrt(2);
    const options: Mat[] = [
      [
        [0, 1],
        [1, 0],
      ],
      [
        [1, 1],
        [-1, 1],
      ],
      [
        [s, s],
        [-s, s],
      ],
      [
        [1, 0],
        [0, -1],
      ],
      [
        [0.6, 0.8],
        [0.8, 0.6],
      ],
    ];
    const p1 = options.flatMap((Q, k) => (isOrthogonal(Q) ? [k + 1] : []));

    // p2
    const p2 = inverse([
      [3 / 5, -4 / 5],
      [4 / 5, 3 / 5],
    ]).flat();

    // p3
    const c1 = [5 / 13, 12 / 13];
    const badness = (t: number): number => {
      const w = [Math.cos(t), Math.sin(t)];
      return Math.abs(dot(c1, w)) + Math.abs(c1[0] * w[1] - c1[1] * w[0] + 1);
    };
    const steps = 36000;
    let best = 0;
    for (let k = 1; k < steps; k++) if (badness((2 * Math.PI * k) / steps) < badness((2 * Math.PI * best) / steps)) best = k;
    const h = (2 * Math.PI) / steps;
    const t3 = argMin(badness, best * h - h, best * h + h);
    const p3 = [Math.cos(t3), Math.sin(t3)];
    if (badness(t3) > 1e-9) throw new Error('p3：没找到满足条件的第二列');
    if (!isOrthogonal([
      [c1[0], p3[0]],
      [c1[1], p3[1]],
    ])) throw new Error('p3：不是正交矩阵');

    // p4
    const r3 = Math.sqrt(3) / 2;
    const Q4 = [
      [-0.5, r3],
      [r3, 0.5],
    ];
    const minusI = Q4.map((row, i) => row.map((x, j) => x - (i === j ? 1 : 0)));
    const fixed = orthogonalComplement(minusI, 2);
    if (fixed.length !== 1) throw new Error('p4：不动的方向不是一条直线');
    const [d] = fixed;
    let angle = (Math.atan2(d[1], d[0]) * 180) / Math.PI;
    angle = ((angle % 180) + 180) % 180;
    const perp: Vec = [-d[1], d[0]];
    const image = matVec(Q4, perp);
    if (Math.abs(image[0] + perp[0]) > 1e-12 || Math.abs(image[1] + perp[1]) > 1e-12) throw new Error('p4：垂直方向没有反向');

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: angle },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
