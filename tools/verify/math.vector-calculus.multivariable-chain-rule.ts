// 独立验算 math.vector-calculus.multivariable-chain-rule 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.multivariable-chain-rule.ts
// 不用链式法则：先把复合函数整个代出来，再对它数值求导；隐函数用二分法逐点解出 y(x) 再差分。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect, derivative } from './math.vector-calculus._vc.ts';

export const verification: Verification = {
  lesson: 'math.vector-calculus.multivariable-chain-rule',
  notes: {
    p1: '把 x = 2t、y = t² 代进 z，得 t 的一元函数，在 t = 1 处中心差分求导。',
    p2: '把 x = s + t、y = s − t 代进 z，固定 t = 0，对 s 在 s = 1 处中心差分求导。',
    p3: '对 x = 1 ± h 用二分法在 1 附近解出曲线上的 y，再做中心差分。',
    p4: '把 x = r cos θ、y = r sin θ 代进 z，固定 r = 2，对 θ 在 π/6 处中心差分求导。',
  },
  compute() {
    // p1
    const z1 = (t: number): number => {
      const x = 2 * t;
      const y = t * t;
      return x * x + 3 * x * y;
    };
    const p1 = derivative(z1, 1);

    // p2
    const z2 = (s: number, t: number): number => Math.exp((s + t) * (s - t));
    const p2 = derivative((s) => z2(s, 0), 1);

    // p3
    const F = (x: number, y: number): number => x * x + x * y + y ** 3 - 3;
    const yOf = (x: number): number => bisect((y) => F(x, y), 0.5, 1.5);
    if (Math.abs(yOf(1) - 1) > 1e-12) throw new Error('p3：曲线不过 (1,1)');
    const p3 = derivative(yOf, 1, 1e-5);

    // p4
    const z4 = (r: number, th: number): number => (r * Math.cos(th)) ** 2 - (r * Math.sin(th)) ** 2;
    const p4 = derivative((th) => z4(2, th), Math.PI / 6);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
