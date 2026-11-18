// 独立验算 math.calculus.dirac-delta 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.dirac-delta.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect, extrapolate, integrate, peakLimit } from './math.calculus._calc.ts';

/** [p, q] 上 ∫ f(x)δ_ε(x − c) dx：δ_ε 是以 c 为中心、宽 ε、高 1/ε 的矩形，和 [p, q] 的交集上积分再除以 ε。 */
function boxOver(f: (x: number) => number, c: number, p: number, q: number, eps: number): number {
  const lo = Math.max(p, c - eps / 2);
  const hi = Math.min(q, c + eps / 2);
  return hi > lo ? integrate(f, lo, hi) / eps : 0;
}

/** 按定义：矩形尖峰的积分在 ε → 0 时的极限（ε = 2^{−5−k} 上算，再外推）。 */
function sift(f: (x: number) => number, c: number, p = -Infinity, q = Infinity): number {
  const r = extrapolate((eps) => boxOver(f, c, p, q, eps), 1 / 32, 8);
  if (!r.converged) throw new Error('尖峰的积分外推不收敛');
  return r.value;
}

export const verification: Verification = {
  lesson: 'math.calculus.dirac-delta',
  notes: {
    p1: '按定义：矩形尖峰 δ_ε(x + 1) 乘被积函数积分，ε → 0 外推；再用三角形、高斯形尖峰（peakLimit）核对结果和形状无关。',
    p2: '四个积分都按定义算：矩形尖峰和积分区间的交集上积分再除以 ε，ε → 0 外推，取值为 0 的选出来。',
    p3: '不用伸缩公式：δ_ε(3x − 6) 不为 0 的 x 范围由 |3x − 6| ≤ ε/2 二分解出，在上面积分再除以 ε，ε → 0 外推；再用高斯形尖峰 G_ε(3x − 6) 对 x 积分核对。',
    p4: '取 ε = 0.6，在 [0.7, 1.3] 上数值积分 x² 再除以 0.6。',
  },
  compute() {
    const f1 = (x: number) => x * x + 3 * x + 1;
    const p1 = sift(f1, -1);
    for (const shape of ['tri', 'gauss'] as const) {
      if (Math.abs(peakLimit(f1, -1, shape).value - p1) > 1e-8) throw new Error(`p1：${shape} 尖峰的结果不同`);
    }

    const cases: [(x: number) => number, number, number, number][] = [
      [(x) => x ** 3, -2, 1, 5],
      [(x) => x, 0, -Infinity, Infinity],
      [Math.exp, 0, -Infinity, Infinity],
      [Math.sqrt, 4, 0, 5],
    ];
    const p2 = cases.map(([f, c, p, q], i) => (Math.abs(sift(f, c, p, q)) < 1e-12 ? i + 1 : 0)).filter((i) => i > 0);

    const f3 = (x: number) => x ** 3 + 1;
    const r3 = extrapolate((eps) => {
      const lo = bisect((x) => 6 - 3 * x - eps / 2, 1, 2);
      const hi = bisect((x) => 3 * x - 6 - eps / 2, 2, 3);
      return integrate(f3, lo, hi) / eps;
    }, 1 / 32, 8);
    if (!r3.converged) throw new Error('p3：外推不收敛');
    const g3 = extrapolate((eps) => integrate((x) => (f3(x) * Math.exp(-((3 * x - 6) ** 2) / (2 * eps * eps))) / (eps * Math.sqrt(2 * Math.PI)), 2 - 4 * eps, 2 + 4 * eps), 1 / 32, 8);
    if (Math.abs(g3.value - r3.value) > 1e-8) throw new Error('p3：高斯形尖峰的结果不同');

    const p4 = integrate((x) => x * x, 0.7, 1.3) / 0.6;
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: r3.value },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
