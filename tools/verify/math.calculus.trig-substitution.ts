// 独立验算 math.calculus.trig-substitution 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.trig-substitution.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { integrate } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.trig-substitution',
  notes: {
    p1: '直接数值积分 ∫₀^√2 √(4 − x²) dx，不代换。',
    p2: '对每个代换，在 t ∈ (0, 1.2) 上取 40 个点，检查代换后 √(x² + 9) 是否等于 3cos t、3/cos t、3|tan t| 这类去掉根号的式子之一；能去掉的再检查整个被积式 f(x(t))x′(t) 是否等于不含根号的 cos t/(9 sin²t)。u = x² + 9 要把 dx 写成 du/(2x)，剩下 1/(2x³√u) = 1/(2(u − 9)^(3/2)√u)，根号去不掉（在 u 上取点核对这个等式）。',
    p3: '直接数值积分 ∫₀¹ x²/√(4 − x²) dx。',
    p4: '直接数值积分 ∫₀⁴ dx/√(x² + 9)。',
  },
  compute() {
    const p1 = integrate((x) => Math.sqrt(4 - x * x), 0, Math.SQRT2);

    const ts = Array.from({ length: 40 }, (_, i) => 0.05 + (i * 1.15) / 39);
    const forms = [(t: number) => 3 * Math.cos(t), (t: number) => 3 / Math.cos(t), (t: number) => 3 * Math.abs(Math.tan(t))];
    const removesRoot = (x: (t: number) => number) =>
      forms.some((g) => ts.every((t) => Math.abs(Math.sqrt(x(t) ** 2 + 9) - g(t)) < 1e-12 * Math.max(1, g(t))));
    const subs: { x: (t: number) => number; dx: (t: number) => number }[] = [
      { x: (t) => 3 * Math.sin(t), dx: (t) => 3 * Math.cos(t) },
      { x: (t) => 3 * Math.tan(t), dx: (t) => 3 / Math.cos(t) ** 2 },
      { x: (t) => 3 / Math.cos(t), dx: (t) => (3 * Math.sin(t)) / Math.cos(t) ** 2 },
    ];
    const f = (x: number) => 1 / (x * x * Math.sqrt(x * x + 9));
    const good = subs.map((s) => removesRoot(s.x) && ts.every((t) => Math.abs(f(s.x(t)) * s.dx(t) - Math.cos(t) / (9 * Math.sin(t) ** 2)) < 1e-10 * Math.max(1, Math.cos(t) / (9 * Math.sin(t) ** 2))));
    // u = x² + 9：x = √(u − 9)，dx = du/(2x)，被积式变成 1/(2(u − 9)^(3/2)√u)，仍有根号
    for (const u of [10, 12, 20, 50]) {
      const x = Math.sqrt(u - 9);
      const lhs = f(x) / (2 * x);
      const rhs = 1 / (2 * (u - 9) ** 1.5 * Math.sqrt(u));
      if (Math.abs(lhs - rhs) > 1e-12 * rhs) throw new Error('p2：u = x² + 9 的换算核对不上');
    }
    good.push(false);
    const p2 = good.map((ok, i) => (ok ? i + 1 : 0)).filter((i) => i > 0);
    if (p2.length !== 1) throw new Error(`p2：能去掉根号的代换不是恰好一个：${p2.join(',')}`);

    const p3 = integrate((x) => (x * x) / Math.sqrt(4 - x * x), 0, 1);
    const p4 = integrate((x) => 1 / Math.sqrt(x * x + 9), 0, 4);
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
