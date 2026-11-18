// 独立验算 math.complex-analysis.higher-derivatives 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.higher-derivatives.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { ccos, cexp, circle, circleIntegral, Complex, complexDifferentiableAt, contourIntegral, csin, cx, derivativeC } from './math.complex-analysis._complex.ts';

const twoPiI = cx(0, 2 * Math.PI);

function onCircle(g: (z: Complex) => Complex, c: number, r: number): Complex {
  const a = contourIntegral(g, circle(c, r)).value;
  const b = circleIntegral(g, c, r);
  if (!a.isClose(b, 1e-8)) throw new Error('两种算法的复积分不一致');
  return a;
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.higher-derivatives',
  notes: {
    p1: '按定义求 ∮ cos z/z³ dz（折线和外推，圆周梯形公式核对），再除以 2πi，不用高阶导数公式。',
    p2: '每个函数在 0、1 和 6 个一般点上，用 12 个方向的差商看是否复可导（complexDifferentiableAt），处处可导的算整函数。',
    p3: '同 p1，被积函数 e^z/(z²(z − 1))。',
    p4: '在半径 0.1、0.05 的小圆上用柯西积分算二阶导数（derivativeC，圆上不碰到 0 这一点），不用 sin z/z 的级数。',
  },
  compute() {
    const p1 = onCircle((z) => ccos(z).div(z.mul(z).mul(z)), 0, 1).div(twoPiI);
    const fs: ((z: Complex) => Complex)[] = [
      (z) => (z.abs() === 0 ? cx(1) : cexp(z).sub(1).div(z)),
      (z) => z.conj(),
      (z) => (z.abs() === 0 ? cx(0) : cx(1).div(z)),
      (z) => (z.sub(1).abs() === 0 ? cx(2) : z.mul(z).sub(1).div(z.sub(1))),
    ];
    const pts = [cx(0), cx(1), cx(0.4, -0.7), cx(-1.3, 0.2), cx(2.1, 1.5), cx(0, 3), cx(-0.9, -2.2), cx(3.3, 0)];
    const p2 = fs.map((f, i) => (pts.every((p) => complexDifferentiableAt(f, p).differentiable) ? i + 1 : 0)).filter((i) => i > 0);
    const p3 = onCircle((z) => cexp(z).div(z.mul(z).mul(z.sub(1))), 0, 2).div(twoPiI);
    const sinc = (z: Complex) => (z.abs() === 0 ? cx(1) : csin(z).div(z));
    const p4 = derivativeC(sinc, 0, 2);
    if (Math.abs(p1.im) > 1e-10 || Math.abs(p3.im) > 1e-10 || Math.abs(p4.im) > 1e-10) throw new Error('p1、p3、p4 的结果应是实数');
    return {
      p1: { type: 'number', value: p1.re },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3.re },
      p4: { type: 'number', value: p4.re },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
