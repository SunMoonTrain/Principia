// 独立验算 math.calculus.taylor-polynomial 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.taylor-polynomial.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { extrapolate } from './math.calculus._calc.ts';
import { Jet } from './math.calculus._jet.ts';

export const verification: Verification = {
  lesson: 'math.calculus.taylor-polynomial',
  notes: {
    p1: '用 Jet（按 exp 的递推算各阶导数，不套展开式）求 e^{2x} 在 0 处的三阶导数，除以 3!；再从 h = 0.1 起外推 (e^{2h} − T₂(h))/h³，核对极限就是这个系数（h 太小分子会被舍入误差淹没）。',
    p2: '用 Jet 求 ln x 在 1 处的 0–3 阶导数，按定义拼出 T₃，代入 x = 1.1。',
    p3: '用 Jet 求 (1 + x)^{1/3} 在 0 处的一、二阶导数，系数是 f′(0)、f″(0)/2；再从 h = 0.1 起外推 (∛(1+h) − 1 − a₁h)/h²，核对极限是 a₂。',
    p4: '用 Jet 求 e^{−x²} 在 0 处的六阶导数，除以 6!。',
  },
  compute() {
    const e2 = Jet.variable(0, 3).mul(2).exp();
    const p1 = e2.derivative(3) / 6;
    const t2 = (x: number) => 1 + e2.derivative(1) * x + (e2.derivative(2) / 2) * x * x;
    // x 太小时分子被舍入误差淹没，所以从 h = 0.1 起只外推 6 级（到 h ≈ 0.003）
    const lim1 = extrapolate((h) => (Math.exp(2 * h) - t2(h)) / h ** 3, 0.1, 6);
    if (!lim1.converged || Math.abs(lim1.value - p1) > 1e-6) throw new Error(`p1：数值极限 ${lim1.value} 和系数 ${p1} 不一致`);

    const ln = Jet.variable(1, 3).log();
    const p2 = [0, 1, 2, 3].reduce((s, k) => s + (ln.derivative(k) / [1, 1, 2, 6][k]) * 0.1 ** k, 0);

    const cr = Jet.variable(0, 2).add(1).pow(1 / 3);
    const a1 = cr.derivative(1);
    const a2 = cr.derivative(2) / 2;
    const lim3 = extrapolate((h) => (Math.cbrt(1 + h) - 1 - a1 * h) / (h * h), 0.1, 6);
    if (!lim3.converged || Math.abs(lim3.value - a2) > 1e-6) throw new Error(`p3：数值极限 ${lim3.value} 和 a₂ = ${a2} 不一致`);

    const x6 = Jet.variable(0, 6);
    const p4 = x6.mul(x6).neg().exp().derivative(6) / 720;

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: [a1, a2] },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
