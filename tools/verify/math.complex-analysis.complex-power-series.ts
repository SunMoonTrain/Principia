// 独立验算 math.complex-analysis.complex-power-series 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.complex-power-series.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { Complex, cx, partialSumsC, radiusByRatio } from './math.complex-analysis._complex.ts';

function logFactorial(n: number): number {
  let s = 0;
  for (let k = 2; k <= n; k++) s += Math.log(k);
  return s;
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.complex-power-series',
  notes: {
    p1: '系数 a_n = 3^{−n}：系数比在 n = 16·2^k 上外推（radiusByRatio），不用柯西-阿达马公式。',
    p2: '在圆周上 12 个点取 z，算 ∑|z^n/n²| 的部分和（N = 10³…10⁶），看它们和 N 无关地收敛（差小于尾项界 1/N）；再看 ∑z^n/n² 本身在这些点的部分和也收敛。各项取模都收敛，选「处处绝对收敛」。',
    p3: '直接把 ∑ n z^n 在 z = i/2 处加到 n = 200（尾项小于 10⁻⁵⁰），不用和函数 z/(1 − z)²。',
    p4: '系数 a_n = n!/n^n，ln|a_n| 用 ln n! − n ln n 算，系数比外推。',
  },
  compute() {
    const p1 = radiusByRatio((n) => -n * Math.log(3)).value;

    const Ns = [1e3, 1e4, 1e5, 1e6];
    const pts = Array.from({ length: 12 }, (_, k) => Complex.fromPolar(1, (2 * Math.PI * k) / 12 + 0.05));
    let absConv = true;
    let conv = true;
    for (const z of pts) {
      const abs = partialSumsC((n) => cx(1 / (n * n)), Ns, 1);
      for (let j = 1; j < Ns.length; j++) if (Math.abs(abs[j].re - abs[j - 1].re) > 1 / Ns[j - 1]) absConv = false;
      let zn = cx(1);
      const terms: Complex[] = [];
      const sums = partialSumsC(
        (n) => {
          while (terms.length < n) {
            zn = zn.mul(z);
            terms.push(zn);
          }
          return terms[n - 1].scale(1 / (n * n));
        },
        Ns.slice(0, 3),
        1,
      );
      for (let j = 1; j < 3; j++) if (sums[j].sub(sums[j - 1]).abs() > 1 / Ns[j - 1]) conv = false;
    }
    // 逐条对照：12 个点都不是 ±1。A「处处发散」、B「只在 1 处收敛」、D「只在 −1 处收敛」在这些点上收敛就不成立；C 要各项取模也收敛
    const A = !conv;
    const B = !conv;
    const C = absConv;
    const D = !conv;
    const p2 = [A, B, C, D].map((ok, i) => (ok ? i + 1 : 0)).filter((i) => i > 0);

    const z3 = cx(0, 0.5);
    const p3 = partialSumsC((n) => cx(n).mul(powC(z3, n)), [200], 1)[0];

    const p4 = radiusByRatio((n) => logFactorial(n) - n * Math.log(n), 1, 16, 7).value;
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [p3.re, p3.im] },
      p4: { type: 'number', value: p4 },
    };
  },
};

function powC(z: Complex, n: number): Complex {
  let r = cx(1);
  for (let k = 0; k < n; k++) r = r.mul(z);
  return r;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
