// 独立验算 math.calculus.definite-integral 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.definite-integral.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { extrapolate, integrate } from './math.calculus._calc.ts';

/** f 在 [a, b] 上等分成 n 段、取右端点的黎曼和。 */
function rightSum(f: (x: number) => number, a: number, b: number, n: number): number {
  const dx = (b - a) / n;
  let s = 0;
  for (let k = 1; k <= n; k++) s += f(a + k * dx) * dx;
  return s;
}

export const verification: Verification = {
  lesson: 'math.calculus.definite-integral',
  notes: {
    p1: '直接加：Δx = 0.5，右端点 0.5、1、1.5、2 处 x² 的值乘 Δx 再相加。',
    p2: '在拐点 x = 1 处分成两段，数值积分 |x − 1|（几何上是两个三角形，面积 1/2 和 9/2）。',
    p3: '直接算 n = 32·2^k 段（到 4096 段）的右端点黎曼和，按 h = 1/n 外推到 n → ∞；和数值积分 ∫₀¹x³ dx 核对。不用题里给的立方和公式。',
    p4: '在整数点 1、2 处分成三段，每段上 x − ⌊x⌋ 是一条斜率 1 的线段，逐段数值积分再相加。',
  },
  compute() {
    const p1 = rightSum((x) => x * x, 0, 2, 4);
    const p2 = integrate((x) => Math.abs(x - 1), 0, 1) + integrate((x) => Math.abs(x - 1), 1, 4);
    const ext = extrapolate((h) => rightSum((x) => x ** 3, 0, 1, Math.round(1 / h)));
    const direct = integrate((x) => x ** 3, 0, 1);
    if (!ext.converged || Math.abs(ext.value - direct) > 1e-9) throw new Error(`p3：黎曼和外推 ${ext.value} 和数值积分 ${direct} 不一致`);
    const frac = (x: number) => x - Math.floor(x);
    const p4 = integrate(frac, 0, 1) + integrate(frac, 1, 2) + integrate(frac, 2, 3);
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: ext.value },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
