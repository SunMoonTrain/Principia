// 独立验算 math.calculus.alternating-series 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.alternating-series.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { alternatingSum, partialSums, positiveSeriesConverges } from './math.calculus._calc.ts';

/**
 * ∑(−1)^{n+1}b(n) 收敛与否，不用交错级数判别法：通项要趋于 0（b 在 n = 10³ 到 10¹² 之间至少缩小一半）；
 * 相邻两个部分和的平均 (S_N + S_{N+1})/2 在 N = 10⁴、10⁵、10⁶ 处要稳定（相差不到 10⁻⁵）。
 * 只看平均不够：∑(−1)^{n+1} 的部分和在 1、0 之间跳，平均也稳定，所以两条都要。
 */
function alternatingConverges(b: (n: number) => number): boolean {
  if (!(b(1e12) < b(1e3) / 2)) return false;
  const Ns = [1e4, 1e5, 1e6];
  const S = partialSums((n) => (-1) ** (n + 1) * b(n), Ns);
  const avg = S.map((s, i) => s + ((-1) ** (Ns[i] + 2) * b(Ns[i] + 1)) / 2);
  return Math.abs(avg[1] - avg[0]) < 1e-5 && Math.abs(avg[2] - avg[1]) < 1e-5;
}

export const verification: Verification = {
  lesson: 'math.calculus.alternating-series',
  notes: {
    p1: '条件收敛 = 本身收敛而取绝对值后发散。本身收敛：通项趋于 0，且相邻部分和的平均在 N = 10⁴、10⁵、10⁶ 处稳定（不用交错级数判别法）；取绝对值后：部分和每过一个数量级的增量（positiveSeriesConverges）。',
    p2: 'Cohen–Villegas–Zagier 加速求交错级数的和（alternatingSum），再和直接加 60 项的部分和核对。',
    p3: '同 p2，加速求和；再和相邻部分和的平均（N = 10⁶）核对。',
    p4: 'm 从 1 往上试，找第一个使 4/(2m + 1) ≤ 0.01 的 m；再核对 4S_m 和 π 确实相差不到 0.01。',
  },
  compute() {
    const options: ((n: number) => number)[] = [(n) => n ** -0.8, (n) => n ** -1.5, (n) => n / (n + 1), (n) => 1 / Math.log(n + 1)];
    const p1 = options
      .map((b, i) => (alternatingConverges(b) && !positiveSeriesConverges(b).converges ? i + 1 : 0))
      .filter((i) => i > 0);

    const p2 = alternatingSum((k) => 1 / 3 ** (k + 1));
    const p2direct = partialSums((n) => (-1) ** (n + 1) / 3 ** n, [60])[0];
    if (Math.abs(p2 - p2direct) > 1e-14) throw new Error('p2：加速求和和直接相加不一致');

    const b3 = (n: number) => (2 * n + 1) / (n * (n + 1));
    const p3 = alternatingSum((k) => b3(k + 1));
    const N = 1e6;
    const S3 = partialSums((n) => (-1) ** (n + 1) * b3(n), [N])[0];
    if (Math.abs(S3 + ((-1) ** (N + 2) * b3(N + 1)) / 2 - p3) > 1e-9) throw new Error('p3：加速求和和部分和的平均不一致');

    let p4 = 1;
    while (4 / (2 * p4 + 1) > 0.01) p4++;
    const S4 = partialSums((n) => (-1) ** (n + 1) / (2 * n - 1), [p4])[0];
    if (!(Math.abs(4 * S4 - Math.PI) <= 0.01)) throw new Error('p4：实际误差超过 0.01');
    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
