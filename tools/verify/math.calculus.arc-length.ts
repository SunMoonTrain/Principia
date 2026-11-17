// 独立验算 math.calculus.arc-length 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.arc-length.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { curveLength, revolvedSurfaceArea } from './math.calculus._calc.ts';

function done(r: { value: number; converged: boolean }, what: string): number {
  if (!r.converged) throw new Error(`${what}：外推没有收敛`);
  return r.value;
}

export const verification: Verification = {
  lesson: 'math.calculus.arc-length',
  notes: {
    p1: '按定义算：内接折线长度，段数加倍、理查森外推（curveLength），不用弧长公式。曲线在 x = 0 处切线不竖直，直接用 x 作参数。',
    p2: '把线段分成小段，每段转成圆台，侧面积 π(y₁ + y₂)·段长求和再外推（revolvedSurfaceArea），不用旋转曲面公式。',
    p3: '内接折线长度外推（curveLength），x 作参数。',
    p4: 'y = √x 在 0 处切线竖直，改用参数 x = t²、y = t（0 ≤ t ≤ √2），再用圆台求和外推（revolvedSurfaceArea）。',
  },
  compute() {
    const p1 = done(curveLength((t) => t, (t) => (2 / 3) * t ** 1.5, 0, 3), 'p1');
    const p2 = done(revolvedSurfaceArea((t) => t, (t) => t, 0, 1), 'p2');
    const p3 = done(curveLength((t) => t, (t) => (t * t) / 8 - Math.log(t), 1, Math.E), 'p3');
    const p4 = done(revolvedSurfaceArea((t) => t * t, (t) => t, 0, Math.SQRT2), 'p4');
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
