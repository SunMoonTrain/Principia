// 独立验算 math.ode.limit-cycles 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.limit-cycles.ts
// 极限环的半径不由 r′ = 0 读出，而是从许多初值积分，看轨线最后落到哪里。

import { fileURLToPath } from 'node:url';
import { infOfPredicate, runVerification, type Verification } from './lib.ts';
import { bisect, eig2, rk4, rk4Accurate } from './math.ode._numeric.ts';

/** 从一串初值积分 r′ = g(r) 到 T，收集落到的正的极限（去掉趋于 0 的），四舍五入后去重。 */
const limits = (g: (r: number) => number, starts: number[], T = 60): number[] => {
  const out: number[] = [];
  for (const r0 of starts) {
    const r = rk4((_, r) => g(r), 0, r0, T, 60_000);
    const r2 = rk4((_, r) => g(r), 0, r0, T + 10, 70_000);
    if (!Number.isFinite(r) || r < 1e-3 || Math.abs(r - r2) > 1e-9) continue;
    if (!out.some((v) => Math.abs(v - r) < 1e-6)) out.push(r);
  }
  return out.sort((a, b) => a - b);
};

export const verification: Verification = {
  lesson: 'math.ode.limit-cycles',
  notes: {
    p1: '从 r = 0.05, 0.3, 1.1, 3, 5 积 r′ = r(4 − r²) 到 t = 60，看各条轨线落到的半径（只有一个）。',
    p2: '在 r = 1 上积 θ′ = 3，对 θ(t) − 2π 二分，求转一圈的时间。',
    p3: '从 r = 0.05 到 5 每隔 0.1（错开 0.013）取初值积 r′ = r(r − 1)(r − 2)(3 − r) 到 t = 60，收集轨线落到的不同半径：只有被两侧吸过来的圆才会被落到。',
    p4: '对 μ 求「[[0, 1], [−1, μ]] 的两个特征值都是实数」的下确界（[0, 10] 上细扫再二分）。',
  },
  compute() {
    // p1
    const l1 = limits((r) => r * (4 - r * r), [0.05, 0.3, 1.1, 3, 5]);
    if (l1.length !== 1) throw new Error('p1：落到的半径不止一个');

    // p2
    const theta = (t: number): number => rk4Accurate(() => 3, 0, 0, t, 200);
    const p2 = bisect((t) => theta(t) - 2 * Math.PI, 0.1, 10);

    // p3
    const starts = Array.from({ length: 50 }, (_, i) => 0.05 + 0.1 * i + 0.013);
    const p3 = limits((r) => r * (r - 1) * (r - 2) * (3 - r), starts);

    // p4
    const p4 = infOfPredicate(
      (mu) =>
        eig2([
          [0, 1],
          [-1, mu],
        ]).every((e) => e.im === 0),
      0,
      10,
      200_000,
    );

    return {
      p1: { type: 'number', value: l1[0] },
      p2: { type: 'number', value: p2 },
      p3: { type: 'set', value: p3 },
      p4: { type: 'number', value: p4 ?? NaN },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
