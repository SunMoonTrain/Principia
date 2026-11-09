// 独立验算 physics.analytical-mechanics.constraints 的 p1–p4（简单题、中等题）。
// 自由度用约束的雅可比矩阵在一个一般位置上的秩来数（n = 坐标个数 − 秩），和「3N − 独立约束数」核对；
// 完整与否：坐标之间的等式本身就是完整约束，速度之间的约束用弗罗贝尼乌斯条件 a ∧ da = 0 数值检验能否积分。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.constraints.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, jacobian, random, rank, type Vec } from './physics.analytical-mechanics._mech.ts';

const rnd = random(20261109);
const point = (dim: number): Vec => Array.from({ length: dim }, () => 2 * rnd() - 1);
const dist2 = (a: Vec, b: Vec): number => a.reduce((s, ai, i) => s + (ai - b[i]) ** 2, 0);

/** 质点坐标排成长向量 x，约束是若干个「两点距离不变」：在 x 处数自由度。 */
function dofOfRods(x: Vec, dim: number, rods: [number, number][], fixed: Vec[] = []): number {
  const pt = (y: Vec, i: number): Vec => (i < 0 ? fixed[-i - 1] : y.slice(i * dim, (i + 1) * dim));
  const lengths = rods.map(([i, j]) => dist2(pt(x, i), pt(x, j)));
  const g = (y: Vec): Vec => rods.map(([i, j], k) => dist2(pt(y, i), pt(y, j)) - lengths[k]);
  return x.length - rank(jacobian(g, x));
}

/** 单个速度约束 Σ a_i(q) q̇_i = 0 的弗罗贝尼乌斯条件：对所有 i<j<k，a_i(∂_j a_k − ∂_k a_j) + 轮换 = 0。返回最大偏差。 */
function frobeniusDefect(a: (q: Vec) => Vec, q: Vec): number {
  const A = a(q);
  const D = jacobian(a, q); // D[i][j] = ∂a_i/∂q_j
  const curl = (i: number, j: number): number => D[j][i] - D[i][j]; // ∂_i a_j − ∂_j a_i
  let worst = 0;
  for (let i = 0; i < A.length; i++)
    for (let j = i + 1; j < A.length; j++)
      for (let k = j + 1; k < A.length; k++)
        worst = Math.max(worst, Math.abs(A[i] * curl(j, k) + A[j] * curl(k, i) + A[k] * curl(i, j)));
  return worst;
}

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.constraints',
  notes: {
    p1: '两个质点 6 个坐标、杆长 1 个约束，在随机位置上求约束雅可比矩阵的秩：6 − 1 = 5，和 3N − k 一致。',
    p2: '球面、转动铁丝本来就是坐标（和时间）之间的等式；纯滚动 dx − R dφ 只有两个变量，弗罗贝尼乌斯条件自动成立，能积分；冰刀 sinθ dx − cosθ dy 在随机点上 a·(∇×a) ≠ 0，积不出来。',
    p3: '三个质点 9 个坐标，悬点—球 1、球 1—球 2、球 2—球 3 三个距离约束，雅可比矩阵的秩是 3：9 − 3 = 6。',
    p4: '平面上 5 个质点 10 个坐标、6 根杆，在随机的五边形上雅可比矩阵的秩是 6（6 个约束相互独立）：10 − 6 = 4。',
  },
  compute() {
    // p1：三维空间里的哑铃
    const p1 = agree(dofOfRods(point(6), 3, [[0, 1]]), 3 * 2 - 1, 'p1 自由度');

    // p2：哪些是完整约束（A 球面、D 转动铁丝本来就是坐标之间的等式）
    const rollingDefect = Math.max(...Array.from({ length: 5 }, () => frobeniusDefect(() => [1, -0.7], point(2))));
    const skateDefect = Math.min(
      ...Array.from({ length: 5 }, () => frobeniusDefect((q) => [Math.sin(q[2]), -Math.cos(q[2]), 0], point(3).map((c) => 3 * c))),
    );
    const p2 = chosen([true, rollingDefect < 1e-9, skateDefect < 1e-9, true]);

    // p3：三节链，上端固定在原点（编号 −1 表示固定点）
    const p3 = agree(dofOfRods(point(9), 3, [[-1, 0], [0, 1], [1, 2]], [[0, 0, 0]]), 3 * 3 - 3, 'p3 自由度');

    // p4：平面五边形加一根对角线 1—3
    const p4 = agree(
      dofOfRods(point(10), 2, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2]]),
      2 * 5 - 6,
      'p4 自由度',
    );

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
