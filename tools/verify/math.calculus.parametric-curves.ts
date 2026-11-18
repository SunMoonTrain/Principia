// 独立验算 math.calculus.parametric-curves 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.parametric-curves.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { asFunctionOfX, bisect, curveLength, derivativeAt } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.parametric-curves',
  notes: {
    p1: '不套 y′(t)/x′(t)：在 t = 2 附近二分解 x(t) = X，把曲线写成 y 关于 x 的函数（asFunctionOfX），再对 x 数值求导。',
    p2: '内接折线长按 t 等分加密、外推（curveLength），不用弧长积分。',
    p3: '同 p2，折线逼近（curveLength）。',
    p4: '二分解 x(t) = 2 得两个 t，核对 y = 0；在两处各把曲线写成 y 关于 x 的函数，数值求导，斜率相乘。',
  },
  compute() {
    const x1 = (t: number) => t * t + 1;
    const y1 = (t: number) => t ** 3 - t;
    const p1 = derivativeAt(asFunctionOfX(x1, y1, 2), x1(2));

    const p2 = curveLength((t) => 2 * Math.cos(t), (t) => 2 * Math.sin(t), 0, Math.PI / 2);
    if (!p2.converged) throw new Error('p2：外推不收敛');
    const p3 = curveLength((t) => t ** 3 / 3, (t) => (t * t) / 2, 0, Math.sqrt(3));
    if (!p3.converged) throw new Error('p3：外推不收敛');

    const x4 = (t: number) => t * t - 1;
    const y4 = (t: number) => t ** 3 - 3 * t;
    const ts = [bisect((t) => x4(t) - 2, 1, 2), bisect((t) => x4(t) - 2, -2, -1)];
    for (const t of ts) if (Math.abs(y4(t)) > 1e-12) throw new Error(`p4：t = ${t} 处 y 不是 0`);
    const slopes = ts.map((t) => derivativeAt(asFunctionOfX(x4, y4, t), 2));
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2.value },
      p3: { type: 'number', value: p3.value },
      p4: { type: 'number', value: slopes[0] * slopes[1] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
