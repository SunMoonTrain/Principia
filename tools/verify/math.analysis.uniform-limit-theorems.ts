// 独立验算 math.analysis.uniform-limit-theorems 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.uniform-limit-theorems.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { grid, richardson, simpson, supAbs } from './math.analysis._numeric.ts';

const BIG = 1e15;

/** p2 用的检验函数列：区间、通项，以及每个 fₙ 自己的性质（这些是初等函数，性质直接写出）。 */
interface Example {
  name: string;
  a: number;
  b: number;
  f: (n: number, x: number) => number;
  continuous: boolean;
  differentiable: boolean;
  integrable: boolean;
}

const examples: Example[] = [
  { name: 'xⁿ，[0, 1]', a: 0, b: 1, f: (n, x) => x ** n, continuous: true, differentiable: true, integrable: true },
  { name: '√(x² + 1/n²)，[−1, 1]', a: -1, b: 1, f: (n, x) => Math.sqrt(x * x + 1 / (n * n)), continuous: true, differentiable: true, integrable: true },
  { name: 'sin(nx)/n，[0, 1]', a: 0, b: 1, f: (n, x) => Math.sin(n * x) / n, continuous: true, differentiable: true, integrable: true },
  { name: 'nx(1 − x²)ⁿ，[0, 1]', a: 0, b: 1, f: (n, x) => n * x * (1 - x * x) ** n, continuous: true, differentiable: true, integrable: true },
  { name: '[x ≥ 1/2] + x/n，[0, 1]', a: 0, b: 1, f: (n, x) => (x >= 0.5 ? 1 : 0) + x / n, continuous: false, differentiable: false, integrable: true },
  { name: 'xⁿ/n，[0, 1]', a: 0, b: 1, f: (n, x) => x ** n / n, continuous: true, differentiable: true, integrable: true },
];

/** 一个检验函数列的数值性质：一致收敛？极限函数连续？可导？积分收敛到极限函数的积分？ */
function analyse(e: Example): { uniform: boolean; limitContinuous: boolean; limitDifferentiable: boolean; integralsConverge: boolean } {
  const xs = grid(e.a, e.b, 200_000);
  const lim = (x: number): number => e.f(BIG, x);
  for (const x of xs) {
    if (Math.abs(e.f(BIG, x) - e.f(10 * BIG, x)) > 1e-6) throw new Error(`p2：${e.name} 在 x = ${x} 处 N = 10¹⁵ 还没收敛`);
  }
  const ns = [10, 100, 1000, 10_000, 100_000];
  const sups = ns.map((n) => supAbs((x) => e.f(n, x) - lim(x), xs));
  const uniform = sups.every((v, k) => k === 0 || v <= sups[k - 1] * 1.0001 + 1e-12) && sups[sups.length - 1] < 1e-2;

  // 极限函数连续：相邻取样点的最大落差随取样加密变小、最后小于 10⁻²
  const jumps = [1000, 10_000, 100_000].map((K) => {
    const g = grid(e.a, e.b, K);
    let m = 0;
    for (let i = 1; i < g.length; i++) m = Math.max(m, Math.abs(lim(g[i]) - lim(g[i - 1])));
    return m;
  });
  const limitContinuous = jumps.every((v, k) => k === 0 || v <= jumps[k - 1] + 1e-12) && jumps[jumps.length - 1] < 1e-2;

  // 极限函数可导：在 201 个点上看差商（端点只看一侧），h = ±10⁻³、±10⁻⁴、±10⁻⁵ 的差商相差都不到 10⁻²
  const limitDifferentiable = grid(e.a, e.b, 200).every((x) => {
    const qs: number[] = [];
    for (const h of [1e-3, 1e-4, 1e-5]) {
      if (x + h <= e.b) qs.push((lim(x + h) - lim(x)) / h);
      if (x - h >= e.a) qs.push((lim(x) - lim(x - h)) / h);
    }
    return Math.max(...qs) - Math.min(...qs) < 1e-2;
  });

  // ∫fₙ → ∫f：辛普森 10⁶ 段，n = 10³、10⁴、10⁵ 时的差一路变小、最后小于 10⁻³
  const If = simpson(lim, e.a, e.b, 1_000_000);
  const gaps = [1000, 10_000, 100_000].map((n) => Math.abs(simpson((x) => e.f(n, x), e.a, e.b, 1_000_000) - If));
  const integralsConverge = gaps.every((v, k) => k === 0 || v <= gaps[k - 1] + 1e-9) && gaps[gaps.length - 1] < 1e-3;

  return { uniform, limitContinuous, limitDifferentiable, integralsConverge };
}

export const verification: Verification = {
  lesson: 'math.analysis.uniform-limit-theorems',
  notes: {
    p1: '辛普森公式（每个周期至少 40 段）算 n = 10⁴、10⁵ 时的积分，两者相差不到 10⁻⁶，取 n = 10⁵ 的值。',
    p2:
      '在 6 个检验函数列上逐条找反例：xⁿ、√(x² + 1/n²)（[−1, 1]）、sin(nx)/n、nx(1 − x²)ⁿ、[x ≥ 1/2] + x/n、xⁿ/n（未注明的都在 [0, 1] 上）。' +
      '逐点极限取 N = 10¹⁵；一致收敛看 n = 10…10⁵ 时 sup|fₙ − f| 一路不增、最后小于 10⁻²；极限连续看相邻取样点的落差随取样加密变小；' +
      '极限可导看 201 个点上 h = ±10⁻³…±10⁻⁵ 的差商是否一致；积分看 n = 10³…10⁵ 时 |∫fₙ − ∫f| 一路变小、最后小于 10⁻³。满足条件、结论不成立的就是反例；没找到反例的说法算对。',
    p3: '∫₀¹fₙ 用辛普森公式（2×10⁵ 段）算 n = 1000·2ⁱ，再做 Richardson 外推；逐点极限取 N = 10¹⁵，在取样点上都是 0，再用辛普森公式积分。',
    p4: 'fₙ′(1) 用左差商 (fₙ(1) − fₙ(1 − h))/h 对 h = 1/(1000n·2ⁱ) 做 Richardson 外推，n = 10、100、1000 都一样，取极限；f 取 N = 10¹⁵ 时的 f_N，同样算左导数（h = 1/(1000·2ⁱ)）。',
  },
  compute() {
    // p1
    const I = (n: number): number => simpson((x) => x * x + Math.sin(n * x) / n, 0, 2, Math.max(200_000, Math.ceil((40 * n * 2) / (2 * Math.PI)) * 2));
    const I4 = I(10_000);
    const I5 = I(100_000);
    if (Math.abs(I4 - I5) > 1e-6) throw new Error('p1：n = 10⁴、10⁵ 时的积分相差太大');

    // p2
    const facts = examples.map(analyse);
    const statements = [
      // A：连续 + 一致收敛 ⇒ 极限连续
      (e: Example, r: ReturnType<typeof analyse>) => !(e.continuous && r.uniform) || r.limitContinuous,
      // B：连续 + 逐点收敛 ⇒ 极限连续（6 个例子都逐点收敛，analyse 里已核对）
      (e: Example, r: ReturnType<typeof analyse>) => !e.continuous || r.limitContinuous,
      // C：可导 + 一致收敛 ⇒ 极限可导
      (e: Example, r: ReturnType<typeof analyse>) => !(e.differentiable && r.uniform) || r.limitDifferentiable,
      // D：可积 + 一致收敛 ⇒ 积分收敛
      (e: Example, r: ReturnType<typeof analyse>) => !(e.integrable && r.uniform) || r.integralsConverge,
    ];
    const p2: number[] = [];
    statements.forEach((holds, i) => {
      if (examples.every((e, k) => holds(e, facts[k]))) p2.push(i + 1);
    });

    // p3：fₙ(x) = nx(1 − x²)ⁿ
    const f3 = (n: number, x: number): number => n * x * (1 - x * x) ** n;
    const lhs = richardson((n) => simpson((x) => f3(n, x), 0, 1, 200_000), 1000, 5);
    for (const x of grid(0, 1, 100_000)) {
      if (Math.abs(f3(BIG, x)) > 1e-12 || Math.abs(f3(10 * BIG, x)) > 1e-12) throw new Error(`p3：x = ${x} 处逐点极限不是 0`);
    }
    const rhs = simpson((x) => f3(BIG, x), 0, 1, 100_000);

    // p4：fₙ(x) = xⁿ/n
    // h 要比 1/n 小得多才进入 Richardson 外推管用的范围，所以 h 从 1/(1000n) 起取
    const leftDerivative = (g: (x: number) => number, k0: number): number => richardson((k) => (g(1) - g(1 - 1 / k)) * k, k0, 5);
    const derivs = [10, 100, 1000].map((n) => leftDerivative((x) => x ** n / n, 1000 * n));
    if (Math.max(...derivs) - Math.min(...derivs) > 1e-6) throw new Error('p4：fₙ′(1) 随 n 变化');
    const fPrime = leftDerivative((x) => x ** BIG / BIG, 1000);

    return {
      p1: { type: 'number', value: I5 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [lhs, rhs] },
      p4: { type: 'tuple', value: [derivs[2], fPrime] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
