// 独立验算 math.analysis.function-series 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.function-series.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { grid, supAbs } from './math.analysis._numeric.ts';

export const verification: Verification = {
  lesson: 'math.analysis.function-series',
  notes: {
    p1: 'S₄ 逐项相加，S 用题目给的 1/(1 − x)；在 [−1/3, 1/3] 上取样并细找 |S − S₄| 的上确界。',
    p2:
      '魏尔斯特拉斯判别法能用 ⟺ Mₙ = sup_ℝ|uₙ| 有限且 ΣMₙ 收敛（Mₙ 是能取的最小的界）。Mₙ 在 [−20, 20] 上取样（4×10⁴ 等分）并细找；' +
      '每段第一个 n 再在 [−200, 200] 上算一次，大了 5 倍以上就算 Mₙ 无穷。ΣMₙ 的收敛看 n ∈ [m, 2m] 上 Mₙ 的和（m = 10、100、1000）：一路变小、最后小于 10⁻² 算收敛。',
    p3: 'S 加到第 400 项（|x/3| ≤ 2/3，余下的可以忽略）；对 N = 1, 2, … 在 [−2, 2] 上取样并细找 |S − S_N| 的上确界，第一个小于 0.01 的 N，再核对 N 更大时都小于 0.01。',
    p4: '在 [−L, L] 上取样并细找 |u₄| 的上确界，L = 10、100、1000 结果相同（远处 |u₄(x)| ≤ 1/(16|x|)）。',
  },
  compute() {
    // p1
    const S4 = (x: number): number => {
      let s = 0;
      for (let k = 0; k <= 4; k++) s += x ** k;
      return s;
    };
    const d1 = supAbs((x) => 1 / (1 - x) - S4(x), grid(-1 / 3, 1 / 3, 20_000));

    // p2：哪些能用魏尔斯特拉斯判别法证明在 ℝ 上一致收敛
    const series = [
      (n: number, x: number) => Math.cos(n * x) / (n * n + 1),
      (n: number, x: number) => Math.cos(n * x) / n,
      (n: number, x: number) => 1 / (n * n + x * x),
      (n: number, x: number) => x / n ** 2,
    ];
    const near = grid(-20, 20, 40_000);
    const far = grid(-200, 200, 40_000);
    const p2: number[] = [];
    series.forEach((u, i) => {
      let finite = true;
      const blocks = [10, 100, 1000].map((m) => {
        if (supAbs((x) => u(m, x), far) > 5 * supAbs((x) => u(m, x), near)) finite = false;
        let t = 0;
        for (let n = m; n <= 2 * m; n++) t += supAbs((x) => u(n, x), near);
        return t;
      });
      const summable = blocks.every((v, k) => k === 0 || v < blocks[k - 1]) && blocks[blocks.length - 1] < 1e-2;
      if (finite && summable) p2.push(i + 1);
    });

    // p3：Σ (x/3)ⁿ 在 [−2, 2] 上
    const partial = (N: number, x: number): number => {
      let s = 0;
      let t = 1;
      for (let n = 1; n <= N; n++) {
        t *= x / 3;
        s += t;
      }
      return s;
    };
    const xs3 = grid(-2, 2, 8000);
    const d3 = (N: number): number => supAbs((x) => partial(400, x) - partial(N, x), xs3);
    let N3 = 1;
    while (!(d3(N3) < 0.01)) N3++;
    for (let N = N3; N <= N3 + 40; N++) if (!(d3(N) < 0.01)) throw new Error(`p3：N = ${N} 时又不小于 0.01`);

    // p4：u₄(x) = x/(4(1 + 4x²)) 在 ℝ 上
    const u4 = (x: number): number => x / (4 * (1 + 4 * x * x));
    const sups4 = [10, 100, 1000].map((L) => supAbs(u4, grid(-L, L, 400_000)));
    if (Math.max(...sups4) - Math.min(...sups4) > 1e-12) throw new Error('p4：上确界随范围变化');

    return {
      p1: { type: 'number', value: d1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: N3 },
      p4: { type: 'number', value: sups4[0] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
