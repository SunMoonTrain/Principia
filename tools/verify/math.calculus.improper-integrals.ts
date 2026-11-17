// 独立验算 math.calculus.improper-integrals 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.improper-integrals.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { convergesByIncrements, integrateToInfinity, partialIntegrals } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.improper-integrals',
  notes: {
    p1: '把 [0, +∞) 换到 [0, 1) 上做 tanh-sinh 数值积分（integrateToInfinity），不用原函数。',
    p2: '四个被积函数各算部分积分 ∫₁^b，b = 10, 10², …, 10⁶，看增量每过一个数量级平均缩成几分之一（r）：r < 0.6 判收敛（convergesByIncrements）。先拿已知的 x^(−3/2)（收敛）、1/x（发散）检验判法。',
    p3: '数值积分 ∫₀^{+∞} x·e^(−x²) dx（integrateToInfinity）。',
    p4: '数值积分 ∫₁^{+∞} dx/(x(x + 1))（integrateToInfinity）。',
  },
  compute() {
    const p1 = integrateToInfinity((x) => Math.exp(-2 * x), 0);

    const known: [string, (x: number) => number, boolean][] = [
      ['x^(-3/2)', (x) => x ** -1.5, true],
      ['1/x', (x) => 1 / x, false],
    ];
    for (const [name, f, want] of known) {
      if (convergesByIncrements(partialIntegrals(f, 1)).converges !== want) throw new Error(`p2：判法在已知例子 ${name} 上判错`);
    }
    const options: ((x: number) => number)[] = [
      (x) => 1 / Math.sqrt(x),
      (x) => 1 / (x * Math.sqrt(x)),
      (x) => Math.log(x) / x,
      (x) => 1 / (x * x + x),
    ];
    const p2 = options.map((f, i) => (convergesByIncrements(partialIntegrals(f, 1)).converges ? i + 1 : 0)).filter((i) => i > 0);

    const p3 = integrateToInfinity((x) => x * Math.exp(-x * x), 0);
    const p4 = integrateToInfinity((x) => 1 / (x * (x + 1)), 1);
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
