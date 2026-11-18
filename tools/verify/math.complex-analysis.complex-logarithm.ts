// 独立验算 math.complex-analysis.complex-logarithm 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.complex-logarithm.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cexp, Complex, cx, I, mullerRoot } from './math.complex-analysis._complex.ts';

/** e^w = z 的一个解：Muller 法从 ln|z| 出发解出，再把虚部挪进 (−π, π]，得到对数主值（不用 atan2 现成的辐角）。 */
function principalLog(z: Complex): Complex {
  const w = mullerRoot((t) => cexp(t).sub(z), cx(Math.log(z.abs()), 0.3));
  if (!cexp(w).isClose(z, 1e-12)) throw new Error('没有解出 e^w = z');
  let im = w.im;
  while (im > Math.PI) im -= 2 * Math.PI;
  while (im <= -Math.PI) im += 2 * Math.PI;
  return cx(w.re, im);
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.complex-logarithm',
  notes: {
    p1: '解 e^w = −2i（Muller 法），把虚部挪进 (−π, π] 取主值。',
    p2: '逐条数值核对：A 解 e^w = −1 取主值看是不是 −πi；B 在 8 个点上算主值再取指数；C 先算 e^{3πi} 再取主值；D 从 40 个起点解 e^w = 1，看解是不是都是 2kπi，再看 2kπi 都是解。',
    p3: '先解 e^w = i 取主值 w，再算 e^{iw}，不用 i^i = e^{−π/2} 的现成结果。',
    p4: '同 p3：解 e^w = 2 取主值，再算 e^{iw}。',
  },
  compute() {
    const p1 = principalLog(cx(0, -2));

    const samples = [cx(1, 1), cx(-2, 0.5), cx(-3, -0.01), cx(0.2, -4), cx(-1, 0), cx(5, 0), cx(0, 1), cx(-0.5, -0.5)];
    const A = principalLog(cx(-1)).isClose(cx(0, -Math.PI), 1e-12);
    const B = samples.every((z) => cexp(principalLog(z)).isClose(z, 1e-12));
    const C = principalLog(cexp(cx(0, 3 * Math.PI))).isClose(cx(0, 3 * Math.PI), 1e-12);
    let D = true;
    for (let k = 0; k < 40; k++) {
      const w = mullerRoot((t) => cexp(t).sub(1), cx(Math.cos(k) * 3, k - 20));
      if (!cexp(w).isClose(1, 1e-10)) continue;
      const m = w.im / (2 * Math.PI);
      if (Math.abs(w.re) > 1e-9 || Math.abs(m - Math.round(m)) > 1e-9) D = false;
    }
    for (let k = -5; k <= 5; k++) if (!cexp(cx(0, 2 * k * Math.PI)).isClose(1, 1e-12)) D = false;
    const p2 = [A, B, C, D].map((ok, i) => (ok ? i + 1 : 0)).filter((i) => i > 0);

    const p3 = cexp(I.mul(principalLog(I)));
    if (Math.abs(p3.im) > 1e-14) throw new Error('p3：i^i 的主值应是实数');
    const p4 = cexp(I.mul(principalLog(cx(2))));
    return {
      p1: { type: 'tuple', value: [p1.re, p1.im] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3.re },
      p4: { type: 'tuple', value: [p4.re, p4.im] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
