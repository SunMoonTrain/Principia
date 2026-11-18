// 独立验算 math.complex-analysis.complex-numbers 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.complex-numbers.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { Complex, cx } from './math.complex-analysis._complex.ts';

export const verification: Verification = {
  lesson: 'math.complex-analysis.complex-numbers',
  notes: {
    p1: '不用 (ac − bd) + (ad + bc)i 的公式：两个因子各写成模和辐角，乘积的模是模之积、辐角是辐角之和，再换回 a + bi。',
    p2: '用 atan2 求辐角主值（取在 (−π, π]），和四个选项的数比。',
    p3: '分子、分母各自算出复数再相除，取模；再用模的乘除 |3+4i||1−i|/|2+i| 核对。',
    p4: '不用乘 i：把向量 (4,2) − (1,1) 乘以逆时针转 90° 的旋转矩阵 [[0,−1],[1,0]]，再加回 (1,1)。',
  },
  compute() {
    const a = cx(2, 1);
    const b = cx(3, -2);
    const p1 = Complex.fromPolar(a.abs() * b.abs(), a.arg() + b.arg());

    const arg = cx(-Math.sqrt(3), 1).arg();
    const opts = [-Math.PI / 6, Math.PI / 6, (2 * Math.PI) / 3, (5 * Math.PI) / 6];
    const p2 = opts.map((v, i) => (Math.abs(v - arg) < 1e-12 ? i + 1 : 0)).filter((i) => i > 0);

    const q = cx(3, 4).mul(cx(1, -1)).div(cx(2, 1));
    const p3 = q.abs();
    if (Math.abs(p3 - (cx(3, 4).abs() * cx(1, -1).abs()) / cx(2, 1).abs()) > 1e-12) throw new Error('p3：两种算法不一致');

    const [vx, vy] = [4 - 1, 2 - 1];
    const p4 = [0 * vx - 1 * vy + 1, 1 * vx + 0 * vy + 1];
    return {
      p1: { type: 'tuple', value: [p1.re, p1.im] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
