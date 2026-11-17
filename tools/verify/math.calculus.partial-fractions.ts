// 独立验算 math.calculus.partial-fractions 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.partial-fractions.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { integrate, limitAt } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.partial-fractions',
  notes: {
    p1: '直接数值积分 ∫₀¹ dx/(x² + 3x + 2)，不拆分。',
    p2: '依次填 A、B：A = lim_{x→1} (x − 1)·f(x)，B = lim_{x→−1} (x + 1)·f(x)，用数值极限算；再在 7 个点上检查 f(x) = A/(x − 1) + B/(x + 1)。',
    p3: '直接数值积分 ∫₀¹ x³/(x² + 1) dx。',
    p4: '直接数值积分 ∫₀¹ dx/(x² + 2x + 2)。',
  },
  compute() {
    const p1 = integrate((x) => 1 / (x * x + 3 * x + 2), 0, 1);

    const f = (x: number) => (3 * x + 1) / ((x - 1) * (x + 1));
    const A = limitAt((x) => (x - 1) * f(x), 1);
    const B = limitAt((x) => (x + 1) * f(x), -1);
    if (A === null || B === null) throw new Error('p2：数值极限不存在');
    for (const x of [-3, -0.5, 0, 0.3, 2, 5, 10]) {
      if (Math.abs(f(x) - (A / (x - 1) + B / (x + 1))) > 1e-9 * Math.max(1, Math.abs(f(x)))) throw new Error(`p2：在 x = ${x} 处拆分不成立`);
    }

    const p3 = integrate((x) => x ** 3 / (x * x + 1), 0, 1);
    const p4 = integrate((x) => 1 / (x * x + 2 * x + 2), 0, 1);
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: [A, B] },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
