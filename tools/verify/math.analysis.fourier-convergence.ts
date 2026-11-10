// 独立验算 math.analysis.fourier-convergence 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.fourier-convergence.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { gaussLegendre, grid, richardson } from './math.analysis._numeric.ts';

/** f 在 [−π, π] 上的傅里叶系数 a₀…a_N、b₁…b_N（分段高斯-勒让德求积，breaks 处分段）。 */
function coefficients(f: (x: number) => number, N: number, breaks: number[] = []): { a: number[]; b: number[] } {
  const a: number[] = [];
  const b: number[] = [0];
  for (let n = 0; n <= N; n++) {
    const pts = [...new Set([...grid(-Math.PI, Math.PI, n + 10), ...breaks])].sort((p, q) => p - q);
    a.push(gaussLegendre((x) => f(x) * Math.cos(n * x), pts) / Math.PI);
    if (n > 0) b.push(gaussLegendre((x) => f(x) * Math.sin(n * x), pts) / Math.PI);
  }
  return { a, b };
}

/** 傅里叶级数的第 N 个部分和在 x 处的值。 */
function partialSum(c: { a: number[]; b: number[] }, N: number, x: number): number {
  let s = c.a[0] / 2;
  for (let n = 1; n <= N; n++) s += c.a[n] * Math.cos(n * x) + c.b[n] * Math.sin(n * x);
  return s;
}

export const verification: Verification = {
  lesson: 'math.analysis.fourier-convergence',
  notes: {
    p1:
      '按定义求积算出 eˣ 的傅里叶系数（到 n = 2000），算部分和 S_N(π)，对 N = 125·2ⁱ 做 Richardson 外推。' +
      '题目问的是级数的和，这里直接算部分和的极限，没有用收敛定理。',
    p2: '同上，f 在 (−π, 0) 上是 0，x = 0 处分段；三个点各自对 N = 128·2ⁱ 外推（N 取 4 的倍数，免得 π/2 处 sin(nπ/2) 的周期带来振荡）。',
    p3:
      '题目要的数是 Σ1/n²：部分和对 N = 1000·2ⁱ 做 Richardson 外推。另按题目的办法核对：x² 的傅里叶系数求积算出，' +
      '部分和 S_N(π) 外推到 π²，由此解出的 Σ1/n² 与前者相差不到 10⁻⁸。',
    p4: '直接把 1/(2k − 1)² 的部分和对 k 外推；另核对 |x| 的傅里叶级数在 0 处外推到 0，解出的值与前者一致。',
  },
  compute() {
    const P = Math.PI;
    // p1：eˣ，在 x = π 处
    const c1 = coefficients(Math.exp, 2000);
    const p1 = richardson((N) => partialSum(c1, N, P), 125, 5);

    // p2：x < 0 时 0，x ≥ 0 时 x
    const c2 = coefficients((x) => (x < 0 ? 0 : x), 2048, [0]);
    const at = (x: number): number => richardson((N) => partialSum(c2, N, x), 128, 5);
    const p2 = [at(0), at(P / 2), at(P)];

    // p3：Σ1/n²
    const sumInv = (p: number, oddOnly: boolean) => (K: number): number => {
      let s = 0;
      for (let k = 1; k <= K; k++) s += 1 / (oddOnly ? 2 * k - 1 : k) ** p;
      return s;
    };
    const p3 = richardson(sumInv(2, false), 1000, 5);
    const c3 = coefficients((x) => x * x, 2000);
    const atPi = richardson((N) => partialSum(c3, N, P), 125, 5);
    if (Math.abs((atPi - c3.a[0] / 2) / 4 - p3) > 1e-8) throw new Error('p3：用傅里叶级数解出的 Σ1/n² 和直接相加的不一致');

    // p4：Σ1/(2k − 1)²
    const p4 = richardson(sumInv(2, true), 1000, 5);
    const c4 = coefficients(Math.abs, 2000, [0]);
    const at0 = richardson((N) => partialSum(c4, N, 0), 125, 5);
    // 先核对求积算出的系数：偶数 n ≥ 2 时是 0，奇数 n 时是 −4/(πn²)；再由 S(0) = 0 解出 Σ 1/(2k−1)²，和前面直接加的比
    for (let n = 1; n <= 2000; n++) {
      const want = n % 2 === 0 ? 0 : -4 / (P * n * n);
      if (Math.abs(c4.a[n] - want) > 1e-12) throw new Error(`p4：|x| 的系数 a${n} 不是预期的值`);
    }
    if (Math.abs(at0) > 1e-6) throw new Error('p4：|x| 的傅里叶级数在 0 处没有收敛到 0');
    const fromSeries = (c4.a[0] / 2) * (P / 4);
    if (Math.abs(fromSeries - p4) > 1e-6) throw new Error('p4：用傅里叶级数解出的值和直接相加的不一致');

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
