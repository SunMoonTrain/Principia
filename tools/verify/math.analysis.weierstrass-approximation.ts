// 独立验算 math.analysis.weierstrass-approximation 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.weierstrass-approximation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { chebyshevInterpolant, grid, logGrid, supAbs } from './math.analysis._numeric.ts';

/** 二项式系数 C(n, k)。 */
function binomial(n: number, k: number): number {
  let c = 1;
  for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i;
  return c;
}

/** 第 n 个伯恩斯坦多项式在 x 处的值：Σ f(k/n) C(n, k) xᵏ(1 − x)ⁿ⁻ᵏ。 */
function bernstein(f: (x: number) => number, n: number, x: number): number {
  let s = 0;
  for (let k = 0; k <= n; k++) s += f(k / n) * binomial(n, k) * x ** k * (1 - x) ** (n - k);
  return s;
}

export const verification: Verification = {
  lesson: 'math.analysis.weierstrass-approximation',
  notes: {
    p1: '按伯恩斯坦多项式的定义 Σ f(k/n) C(n, k) xᵏ(1 − x)ⁿ⁻ᵏ 直接算。',
    p2:
      '在那个集合的闭包上做 k 次切比雪夫插值（k = 10、40、160、640），在集合里取样（2×10⁴ 等分，再在 0 附近按对数取到 10⁻¹²）量最大误差；' +
      'k = 160 时已小于 10⁻²、k = 640 时不再变大的算能逼近（1/(1 − x) 在 1 附近、sin(1/x) 在 0 附近按对数取到 10⁻¹²）。' +
      '不能逼近的两个，误差随取样点靠近 1 无限变大（1/(1 − x)），或在 0 附近停在 1 左右（sin(1/x)）；' +
      '这只说明这几个多项式不行，不能逼近的理由（多项式在 [0, 1] 上有界、一致极限连续）另外手推过。',
    p3: '按伯恩斯坦多项式的定义 Σ f(k/n) C(n, k) xᵏ(1 − x)ⁿ⁻ᵏ 直接算。',
    p4: '对 n = 1, 2, … 判断 M/(2nδ²) < 0.05；δ = 1/10 时 1/δ² = 100，用整数比较 100M·20 < 2n，免得 0.1² 的舍入误差把 n = 1000 判成满足。',
  },
  compute() {
    // p1：|x − 1/2| 的第 2 个伯恩斯坦多项式在 1/2 处
    const B1 = bernstein((x) => Math.abs(x - 0.5), 2, 0.5);

    // p2：哪些能被多项式一致逼近
    const tiny = logGrid(1e-12, 1e-3, 2000);
    const cases = [
      { f: (x: number) => Math.sqrt(x), a: 0, b: 1, xs: [...tiny, ...grid(0, 1, 20_000)].sort((p, q) => p - q) },
      { f: (x: number) => 1 / (1 - x), a: 0, b: 1, xs: [...grid(0, 1, 20_000).slice(0, -1), ...tiny.map((t) => 1 - t)].sort((p, q) => p - q) },
      { f: (x: number) => (x === 0 ? 0 : Math.sin(1 / x)), a: 0, b: 1, xs: [...tiny, ...grid(0, 1, 20_000)].sort((p, q) => p - q) },
      { f: (x: number) => Math.sin(x), a: 0, b: 100, xs: grid(0, 100, 20_000) },
    ];
    const p2: number[] = [];
    cases.forEach((c, i) => {
      const errors = [10, 40, 160, 640].map((k) => {
        const p = chebyshevInterpolant(c.f, c.a, c.b, k);
        return supAbs((x) => p(x) - c.f(x), c.xs);
      });
      if (errors[2] < 1e-2 && errors[3] <= errors[2] + 1e-9) p2.push(i + 1);
    });

    // p3：f(x) = x³，B₅f(1/2)
    const d3 = bernstein((x) => x ** 3, 5, 0.5);

    // p4：M = 1，δ = 1/10，M/(2nδ²) < 0.05
    const M = 1;
    const invDelta2 = 100;
    let n4 = 1;
    while (!(M * invDelta2 * 20 < 2 * n4)) n4++;

    return {
      p1: { type: 'number', value: B1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: d3 },
      p4: { type: 'number', value: n4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
