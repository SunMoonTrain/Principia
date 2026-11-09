// 独立验算 math.analysis.limsup-liminf 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.limsup-liminf.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { richardson } from './math.analysis._numeric.ts';

/**
 * 按 n 除以 p 的余数把数列拆成 p 个子列 a(pk + r)，各自用 Richardson 外推求极限。
 * 这 p 个子列合起来就是整个数列，每个都收敛时，上极限、下极限就是这 p 个极限里最大、最小的那个。
 * 每个子列先检查外推结果稳定（从 n₀ = 500 和 n₀ = 1000 出发，结果相差不到 10⁻⁸），确认它真的收敛。
 */
function classLimits(a: (n: number) => number, p: number): number[] {
  return Array.from({ length: p }, (_, r) => {
    const sub = (k: number): number => a(p * k + r);
    const x = richardson(sub, 1000);
    const y = richardson(sub, 500);
    if (Math.abs(x - y) > 1e-8) throw new Error(`余数为 ${r} 的子列看起来不收敛`);
    return x;
  });
}

export const verification: Verification = {
  lesson: 'math.analysis.limsup-liminf',
  notes: {
    p1: '按 n 的奇偶拆成两个子列，各自 Richardson 外推求极限，取最大、最小。',
    p2: '直接在 k ∈ [5, 10⁶] 里取最大项、最小项；k > 10⁶ 的项绝对值都小于 10⁻⁶，比找到的最大项、最小项的绝对值小，不会改变上确界、下确界。',
    p3: '按 n 除以 3 的余数拆成三个子列，(1 + 1/n)ⁿ 用 exp(n·log1p(1/n)) 算，各自 Richardson 外推，取最大、最小。',
    p4: '按 n 除以 4 的余数拆成四个子列（每个都是常数列），分别算 aₙ + bₙ、aₙ、bₙ 的子列极限，各取最大。',
  },
  compute() {
    // p1：aₙ = (−1)ⁿ n/(2n + 1)
    const p1 = classLimits((n) => ((n % 2 === 0 ? 1 : -1) * n) / (2 * n + 1), 2);

    // p2：aₙ = (−1)ⁿ/n，M₅ = sup{aₖ : k ≥ 5}，m₅ = inf{aₖ : k ≥ 5}
    let M5 = -Infinity;
    let m5 = Infinity;
    for (let k = 5; k <= 1e6; k++) {
      const v = (k % 2 === 0 ? 1 : -1) / k;
      M5 = Math.max(M5, v);
      m5 = Math.min(m5, v);
    }
    if (!(M5 > 1e-6 && -m5 > 1e-6)) throw new Error('p2：窗口外的项可能改变确界');

    // p3：aₙ = (1 + 1/n)ⁿ cos(2nπ/3)
    const p3 = classLimits((n) => Math.exp(n * Math.log1p(1 / n)) * Math.cos((2 * n * Math.PI) / 3), 3);

    // p4：aₙ = sin(nπ/2)，bₙ = cos(nπ/2)；每个子列是常数列，取 k ∈ [10³, 10³ + 100] 上的平均当作它的极限
    const sub = (f: (n: number) => number, r: number): number => {
      let s = 0;
      for (let k = 1000; k <= 1100; k++) s += f(4 * k + r);
      return s / 101;
    };
    const a = (n: number): number => Math.sin((n * Math.PI) / 2);
    const b = (n: number): number => Math.cos((n * Math.PI) / 2);
    const limsupOf = (f: (n: number) => number): number => Math.max(...[0, 1, 2, 3].map((r) => sub(f, r)));
    const p4 = [limsupOf((n) => a(n) + b(n)), limsupOf(a) + limsupOf(b)];

    return {
      p1: { type: 'tuple', value: [Math.max(...p1), Math.min(...p1)] },
      p2: { type: 'tuple', value: [M5, m5] },
      p3: { type: 'tuple', value: [Math.max(...p3), Math.min(...p3)] },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
