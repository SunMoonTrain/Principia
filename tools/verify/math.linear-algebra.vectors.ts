// 独立验算 math.linear-algebra.vectors 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.vectors.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { add, fromColumns, norm, rref, scale, sub } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.vectors',
  notes: {
    p1: '逐个分量算 3u − 2v。',
    p2: 'B 的位置向量 = A 的位置向量 + AB。',
    p3: '把 (u v | w) 化成简化行阶梯形：两列都有主元、常数项那一列没有主元，读出 c₁、c₂；再核对 c₁u + c₂v = w。',
    p4: 'ABCD 依次相连，AB 与 DC 是同一个向量，D = C − (B − A)；再核对两条对角线 AC、BD 的中点重合。',
  },
  compute() {
    // p1
    const p1 = sub(scale(3, [2, -1, 4]), scale(2, [1, 3, -2]));

    // p2
    const p2 = add([-1, 3], [4, -5]);

    // p3
    const u = [1, 2, 3];
    const v = [0, 1, 2];
    const w = [1, 4, 7];
    const { R, pivots } = rref(fromColumns([u, v, w]));
    if (pivots.join() !== '0,1') throw new Error('p3：w 不是 u、v 的线性组合，或组合不唯一');
    const c = [R[0][2], R[1][2]];
    if (norm(sub(add(scale(c[0], u), scale(c[1], v)), w)) > 1e-12) throw new Error('p3：组合不对');

    // p4
    const A = [1, 0, 2];
    const B = [3, 1, 0];
    const C = [4, 3, 1];
    const D = sub(C, sub(B, A));
    if (norm(sub(scale(0.5, add(A, C)), scale(0.5, add(B, D)))) > 1e-12) throw new Error('p4：对角线中点不重合');

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'tuple', value: c },
      p4: { type: 'tuple', value: D },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
