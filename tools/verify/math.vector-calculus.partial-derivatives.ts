// 独立验算 math.vector-calculus.partial-derivatives 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.partial-derivatives.ts
// 偏导数都用中心差分数值求，不手推公式；p3 先对 x、再对 y 两步差分，核对和另一个次序一致。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { partial, second, type Fn } from './math.vector-calculus._vc.ts';

export const verification: Verification = {
  lesson: 'math.vector-calculus.partial-derivatives',
  notes: {
    p1: '中心差分求 ∂f/∂x，在 (1,2) 处。',
    p2: '中心差分求两个偏导数，在 (1,1) 处。',
    p3: '先用中心差分得 f_x，再对 y 差分得 f_xy；另用对称的四点公式核对，两者相差小于 1e-6。',
    p4: 'Δu = u_xx + u_yy 对 a 是一次的：数值算 a = 0、a = 1 时在 (1.3, −0.7) 处的 Δu，解出使它为 0 的 a；再在另外 5 个点核对 Δu = 0。',
  },
  compute() {
    // p1
    const f1: Fn = ([x, y]) => x ** 3 * y - 2 * x * y * y + y;
    const p1 = partial(f1, [1, 2], 0);

    // p2
    const f2: Fn = ([x, y]) => Math.log(x * x + 3 * y);
    const p2 = [partial(f2, [1, 1], 0), partial(f2, [1, 1], 1)];

    // p3：f_xy = (f_x)_y
    const f3: Fn = ([x, y]) => Math.sin(x * y) + x * x * y ** 3;
    const fx: Fn = (p) => partial(f3, p, 0, 1e-4);
    const p3 = partial(fx, [Math.PI, 1], 1, 1e-4);
    if (Math.abs(p3 - second(f3, [Math.PI, 1], 0, 1)) > 1e-6) throw new Error('p3：两种差分不一致');

    // p4
    const lap = (a: number, x: number, y: number): number => {
      const u: Fn = ([s, t]) => s ** 3 + a * s * t * t;
      return second(u, [x, y], 0, 0) + second(u, [x, y], 1, 1);
    };
    const l0 = lap(0, 1.3, -0.7);
    const l1 = lap(1, 1.3, -0.7);
    const p4 = -l0 / (l1 - l0);
    for (const [x, y] of [
      [0.5, 2],
      [-1, 1],
      [2, -3],
      [0.1, 0.1],
      [-2.5, 0.4],
    ]) {
      if (Math.abs(lap(p4, x, y)) > 1e-4) throw new Error('p4：别的点上不调和');
    }

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
