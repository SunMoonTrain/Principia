// 独立验算 math.ode.first-order-systems 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.first-order-systems.ts
// 矩阵都由「右边作用在基向量上」读出来，初值问题直接数值积分。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { d1, rk4VecAccurate, solveLinear } from './math.ode._numeric.ts';

/** 线性的右边 f 的矩阵：第 j 列是 f(e_j)。 */
const matrixOf = (f: (x: number[]) => number[], n: number): number[][] => {
  const cols = Array.from({ length: n }, (_, j) => f(Array.from({ length: n }, (_, k) => (k === j ? 1 : 0))));
  return Array.from({ length: n }, (_, i) => cols.map((c) => c[i]));
};

export const verification: Verification = {
  lesson: 'math.ode.first-order-systems',
  notes: {
    p1: '由 y″ = 3y′ − 2y 写出右边 (x₁, x₂) ↦ (x₂, 3x₂ − 2x₁)，作用在两个基向量上读出 A 的两列。',
    p2: '在 (1, 1) 处算出速度 (x₁′, x₂′)，斜率是 x₂′/x₁′。',
    p3: '四阶龙格-库塔法积 x₁′ = x₁ + x₂、x₂′ = 3x₁ − x₂，从 (0; 1, 0) 积到 1。',
    p4: '对两个解在 t = 0.3 处用五点差分求导，得 X′ = AX（X 以两个解为列），按行解线性方程组 Xᵀaᵢ = (X′ 的第 i 行)ᵀ；再在 t = −0.7、1.1 处核对 AX = X′。',
  },
  compute() {
    // p1
    const A1 = matrixOf(([x1, x2]) => [x2, 3 * x2 - 2 * x1], 2);

    // p2
    const [v1, v2] = [1 + 2 * 1, 3 * 1 - 1];
    const p2 = v2 / v1;

    // p3
    const p3 = rk4VecAccurate((_, [a, b]) => [a + b, 3 * a - b], 0, [1, 0], 1)[0];

    // p4
    const sols = [(t: number) => [Math.exp(2 * t), Math.exp(2 * t)], (t: number) => [Math.exp(-t), -2 * Math.exp(-t)]];
    const X = (t: number): number[][] => [0, 1].map((i) => sols.map((s) => s(t)[i]));
    const Xp = (t: number): number[][] => [0, 1].map((i) => sols.map((s) => d1((u) => s(u)[i], t, 1e-3)));
    const t0 = 0.3;
    const XT = [0, 1].map((j) => [0, 1].map((i) => X(t0)[i][j]));
    const A4 = [0, 1].map((i) => solveLinear(XT, Xp(t0)[i]));
    for (const t of [-0.7, 1.1]) {
      const lhs = A4.map((row) => [0, 1].map((j) => row[0] * X(t)[0][j] + row[1] * X(t)[1][j]));
      const rhs = Xp(t);
      if (lhs.some((r, i) => r.some((v, j) => Math.abs(v - rhs[i][j]) > 1e-6))) throw new Error('p4：A 在别的时刻不成立');
    }

    return {
      p1: { type: 'tuple', value: A1.flat() },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: A4.flat() },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
