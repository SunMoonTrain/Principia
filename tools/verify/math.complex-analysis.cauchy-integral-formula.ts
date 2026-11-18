// 独立验算 math.complex-analysis.cauchy-integral-formula 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.cauchy-integral-formula.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { ccos, cexp, circle, circleIntegral, Complex, contourIntegral, csin, cx, integrate } from './math.complex-analysis._complex.ts';

const twoPiI = cx(0, 2 * Math.PI);

/** 按定义积（折线和外推），再用圆周梯形公式核对。 */
function onCircle(g: (z: Complex) => Complex, c: number, r: number): Complex {
  const a = contourIntegral(g, circle(c, r)).value;
  const b = circleIntegral(g, c, r);
  if (!a.isClose(b, 1e-8)) throw new Error('两种算法的复积分不一致');
  return a;
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.cauchy-integral-formula',
  notes: {
    p1: '按定义求 ∮ e^z/(z − 1) dz（折线和外推，圆周梯形公式核对），再除以 2πi，不用柯西积分公式。',
    p2: '四个积分都按定义算，和 2πi 相差不到 10⁻⁸ 的选出来。',
    p3: '同 p1，被积函数 e^z/(z(z − 1))，不拆开。',
    p4: '直接在 [0, 2π] 上数值积实函数 e^{1+cos t} cos(sin t)（双指数求积），不用平均值公式。',
  },
  compute() {
    const p1 = onCircle((z) => cexp(z).div(z.sub(1)), 0, 2).div(twoPiI);
    const vals = [
      onCircle((z) => cexp(z).div(z.sub(2)), 0, 1),
      onCircle((z) => csin(z).div(z.sub(Math.PI)), 0, 3),
      onCircle((z) => z.mul(z).div(z.sub(0.5)), 0, 1),
      onCircle((z) => ccos(z).div(z), 0, 2),
    ];
    const p2 = vals.map((v, i) => (v.isClose(twoPiI, 1e-8) ? i + 1 : 0)).filter((i) => i > 0);
    const p3 = onCircle((z) => cexp(z).div(z.mul(z.sub(1))), 0, 2).div(twoPiI);
    const p4 = integrate((t) => Math.exp(1 + Math.cos(t)) * Math.cos(Math.sin(t)), 0, 2 * Math.PI);
    if (Math.abs(p1.im) > 1e-10 || Math.abs(p3.im) > 1e-10) throw new Error('p1、p3 的结果应是实数');
    return {
      p1: { type: 'number', value: p1.re },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3.re },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
