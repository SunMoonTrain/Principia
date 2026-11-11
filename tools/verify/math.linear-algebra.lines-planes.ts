// 独立验算 math.linear-algebra.lines-planes 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.lines-planes.ts
// 距离不用公式，直接求最近点：点到平面在平面的参数表示上求最小值，点到直线对参数求最小值。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { add, argMin, dot, norm, scale, sub } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.lines-planes',
  notes: {
    p1: '对 t 找第三个坐标 3 + t 的零点，代回直线方程。',
    p2: 'd 就是 2x + y − z 在 (1, −2, 3) 处的值。',
    p3: '平面 x + 2y − 2z = 4 写成 (4, 0, 0) + s(−2, 1, 0) + t(2, 0, 1)，到 (2, 1, 3) 的距离平方是 s、t 的二次函数：交替对 s、t 用黄金分割法求最小值（迭代 200 轮），取平方根。',
    p4: '直线上的点 t(1, 2, 2) 到 (1, 1, 1) 的距离对 t 用黄金分割法求最小值。',
  },
  compute() {
    // p1
    const ts = rootsOf((t) => 3 + t, -10.0123, 9.9871, 4000);
    const p1 = add([1, 2, 3], scale(ts[0], [2, -1, 1]));

    // p2
    const p2 = 2 * 1 + -2 - 3;

    // p3
    const P0 = [4, 0, 0];
    const a = [-2, 1, 0];
    const b = [2, 0, 1];
    if ([P0, add(P0, a), add(P0, b)].some((r) => Math.abs(r[0] + 2 * r[1] - 2 * r[2] - 4) > 1e-12)) throw new Error('p3：参数表示不在平面上');
    const Q = [2, 1, 3];
    const dist2 = (s: number, t: number): number => {
      const d = sub(add(P0, add(scale(s, a), scale(t, b))), Q);
      return dot(d, d);
    };
    let s = 0;
    let t = 0;
    for (let k = 0; k < 200; k++) {
      s = argMin((x) => dist2(x, t), -50, 50);
      t = argMin((x) => dist2(s, x), -50, 50);
    }
    const p3 = Math.sqrt(dist2(s, t));

    // p4
    const v = [1, 2, 2];
    const q = [1, 1, 1];
    const tt = argMin((x) => norm(sub(scale(x, v), q)), -10, 10);
    const p4 = norm(sub(scale(tt, v), q));

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
