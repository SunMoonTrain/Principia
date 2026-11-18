// 独立验算 math.complex-analysis.power-series 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.power-series.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cexp, circle, circleIntegral, Complex, contourIntegral, csin, cx, radiusByRatio, taylorCoefficients } from './math.complex-analysis._complex.ts';

/** 收敛半径只从系数算：圆周上采样求泰勒系数（半径 r 取在收敛半径里面、靠近它），再按系数比外推。 */
function radiusFromFunction(f: (z: Complex) => Complex, c: number, r: number, step: number, offset = 0): number {
  const a = taylorCoefficients(f, c, 300, r, 2048);
  const res = radiusByRatio((n) => Math.log(a[n + offset].abs()), step, 8, 5);
  if (!res.converged) throw new Error('系数比没有收敛');
  return res.value;
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.power-series',
  notes: {
    p1: '在半径 1.9 的圆周上采样求 1/(z² + 4) 的泰勒系数，偶次项按步长 2 求系数比外推，不找分母的零点。',
    p2: '以 1 为中心、半径 1.9 采样求 e^z/(z − 3) 的系数，系数比外推出收敛半径，再看是哪个选项。',
    p3: '按定义求 ∮ e^{2z}/z⁴ dz（折线和外推，圆周梯形公式核对），再除以 2πi。',
    p4: '在半径 3 的圆周上采样求 z/sin z 的系数（圆上碰不到 0），偶次项按步长 2 外推。',
  },
  compute() {
    const p1 = radiusFromFunction((z) => cx(1).div(z.mul(z).add(4)), 0, 1.9, 2);
    const R2 = radiusFromFunction((z) => cexp(z).div(z.sub(3)), 1, 1.9, 1);
    const options = [1, 2, 3, Infinity];
    const p2 = options.map((v, i) => (Math.abs(v - R2) < 1e-6 ? i + 1 : 0)).filter((i) => i > 0);
    const g = (z: Complex) => cexp(z.scale(2)).div(z.mul(z).mul(z).mul(z));
    const a = contourIntegral(g, circle(0, 1)).value;
    if (!a.isClose(circleIntegral(g, 0, 1), 1e-8)) throw new Error('p3：两种算法不一致');
    const p3 = a.div(cx(0, 2 * Math.PI));
    if (Math.abs(p3.im) > 1e-10) throw new Error('p3 应是实数');
    const p4 = radiusFromFunction((z) => (z.abs() === 0 ? cx(1) : z.div(csin(z))), 0, 3, 2);
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3.re },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
