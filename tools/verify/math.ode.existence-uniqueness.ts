// 独立验算 math.ode.existence-uniqueness 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.existence-uniqueness.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { argMax, maxOnGrid, simpson } from './math.ode._numeric.ts';

/** 皮卡迭代的第 n 个函数：φ₀ ≡ y0，φ_{k+1}(x) = y0 + ∫ f(s, φ_k(s)) ds，积分用辛普森公式（嵌套计算）。 */
function picard(f: (x: number, y: number) => number, x0: number, y0: number, n: number): (x: number) => number {
  if (n === 0) return () => y0;
  const previous = picard(f, x0, y0, n - 1);
  return (x) => y0 + simpson((s) => f(s, previous(s)), x0, x, 200);
}

/** f 在以 (x0, y0) 为中心、半径 r 的正方形里对 y 的差商 |f(x, y1) − f(x, y2)|/|y1 − y2| 的最大值，y 取 y0 ± 10^{−k}（k ≤ kMax）和等距格点。 */
function lipschitzEstimate(f: (x: number, y: number) => number, x0: number, y0: number, r: number, kMax: number): number {
  const ys = [y0];
  for (let k = 1; k <= kMax; k++) ys.push(y0 - r * 10 ** -k, y0 + r * 10 ** -k);
  for (let i = 0; i <= 20; i++) ys.push(y0 - r + (2 * r * i) / 20);
  let best = 0;
  for (let i = 0; i <= 20; i++) {
    const x = x0 - r + (2 * r * i) / 20;
    for (const y1 of ys)
      for (const y2 of ys) {
        if (y1 === y2) continue;
        best = Math.max(best, Math.abs(f(x, y1) - f(x, y2)) / Math.abs(y1 - y2));
      }
  }
  return best;
}

export const verification: Verification = {
  lesson: 'math.ode.existence-uniqueness',
  notes: {
    p1:
      '最小的 L 就是差商 |f(x, y₁) − f(x, y₂)|/|y₁ − y₂| 在带形上的上确界。x 取 [−2, 2] 上 401 个格点（含两端），y₁ 取 [−π, π] 上的格点，' +
      'y₂ = y₁ + δ，δ = 10⁻¹、10⁻³、10⁻⁵；取到的最大值随 δ 变小逼近上确界，并核对没有一个差商超过它。',
    p2: '按定义迭代两次：φ₀ ≡ 0，每次的积分用辛普森公式（200 段，嵌套着算），求 φ₂(1)。',
    p3:
      '矩形上 |f| 的最大值 M(b) 在 |y − 1| ≤ b 上取格点数值求（不用公式），a 可以取得很大，所以 h = b/M(b)；' +
      '对 b ∈ (0, 20] 用黄金分割求 b/M(b) 的最大值。',
    p4:
      '定理要求 f 在初始点周围的矩形上连续、对 y 满足利普希茨条件。在半径 0.5 的正方形上算对 y 的差商的最大值，' +
      'y 取到离初始点 10⁻⁶ 和 10⁻¹² 两种精细程度：两次结果一样（有界）的满足条件；越细越大的（在 y = 0 附近无界）不满足。四个右边都连续。',
  },
  compute() {
    // p1
    const f1 = (x: number, y: number): number => x * Math.sin(y);
    let p1 = 0;
    let lastForDelta = 0;
    for (const delta of [1e-1, 1e-3, 1e-5]) {
      let best = 0;
      for (let i = 0; i <= 400; i++) {
        const x = -2 + (4 * i) / 400;
        for (let j = 0; j <= 2000; j++) {
          const y = -Math.PI + (2 * Math.PI * j) / 2000;
          best = Math.max(best, Math.abs(f1(x, y + delta) - f1(x, y)) / delta);
        }
      }
      if (best < lastForDelta - 1e-12) throw new Error('p1：δ 变小时差商的最大值反而变小');
      lastForDelta = best;
      p1 = Math.max(p1, best);
    }

    // p2
    const p2 = picard((x, y) => x + y * y, 0, 0, 2)(1);

    // p3
    const M = (b: number): number => maxOnGrid((y) => Math.abs(y * y), 1 - b, 1 + b, 2000);
    const bBest = argMax((b) => b / M(b), 1e-6, 20);
    const p3 = bBest / M(bBest);

    // p4
    const options: { f: (x: number, y: number) => number; x0: number; y0: number }[] = [
      { f: (_, y) => Math.sqrt(Math.abs(y)), x0: 0, y0: 0 },
      { f: (_, y) => Math.abs(y), x0: 0, y0: 0 },
      { f: (x, y) => Math.exp(x * y), x0: 0, y0: 0 },
      { f: (_, y) => Math.cbrt(y), x0: 1, y0: 0 },
    ];
    const p4: number[] = [];
    options.forEach(({ f, x0, y0 }, i) => {
      const coarse = lipschitzEstimate(f, x0, y0, 0.5, 6);
      const fine = lipschitzEstimate(f, x0, y0, 0.5, 12);
      if (fine <= coarse * (1 + 1e-9)) p4.push(i + 1);
      else if (fine < 10 * coarse) throw new Error(`p4：选项 ${i + 1} 的差商在加细后变大得不多，分不清`);
    });

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
