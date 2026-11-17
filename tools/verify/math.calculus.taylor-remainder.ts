// 独立验算 math.calculus.taylor-remainder 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.taylor-remainder.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect } from './math.calculus._calc.ts';
import { Jet } from './math.calculus._jet.ts';

/** 在 0 和 x 之间（开区间）能不能找到 ξ，使 g(ξ) = target：扫 4000 个点找变号或恰好相等。 */
function hasXi(g: (xi: number) => number, x: number, target: number): boolean {
  let prev = g(x * 1e-6) - target;
  for (let i = 1; i <= 4000; i++) {
    const v = g((x * i) / 4001) - target;
    if (v === 0 || v * prev < 0) return true;
    prev = v;
  }
  return false;
}

export const verification: Verification = {
  lesson: 'math.calculus.taylor-remainder',
  notes: {
    p1: '真正的余项 R₂(x) = cos x − (1 − x²/2) 直接算出来；对 x = ±0.5、±1、±2、±3 逐个检查每个选项能不能在 0 和 x 之间找到 ξ 使它等于 R₂(x)。只有 A 对所有 x 都找得到；B 的符号总和 R₂ 相反，C 是 T₁ 的余项（x = 1 时取值在 −1/2 和 −0.27 之间，R₂(1) ≈ 0.04），D 和 R₂ 在 x = 1 处就不相等。',
    p2: '从 n = 0 起逐个算上界 2·0.5^{n+1}/(n+1)!，取第一个小于 10⁻³ 的 n；再确认这时真实误差 |e^{0.5} − T_n(0.5)| 也小于 10⁻³。',
    p3: '用 Jet 求 √(1+t) 的三阶导数，在 ξ ∈ [0, 0.1] 上取 |f‴(ξ)|/3! 的最大值（在 ξ = 0 处）作 C；再在 (0, 0.1] 的格点上确认真实误差 R₂(x)/x³ 都不超过 C，且 x → 0 时趋于 C（界取得到）。',
    p4: '在 [0, 1] 上二分解 x³/6 = 0.001。',
  },
  compute() {
    const R2 = (x: number) => Math.cos(x) - (1 - (x * x) / 2);
    const options: ((xi: number, x: number) => number)[] = [
      (xi, x) => (Math.sin(xi) / 6) * x ** 3,
      (xi, x) => (-Math.sin(xi) / 6) * x ** 3,
      (xi, x) => (-Math.cos(xi) / 2) * x * x,
      (_xi, x) => (Math.sin(x) / 6) * x ** 3,
    ];
    const xs = [0.5, -0.5, 1, -1, 2, -2, 3, -3];
    const p1 = options.flatMap((opt, i) => (xs.every((x) => hasXi((xi) => opt(xi, x), x, R2(x))) ? [i + 1] : []));

    let n = 0;
    while (!((2 * 0.5 ** (n + 1)) / factorial(n + 1) < 1e-3)) n++;
    let tn = 0;
    for (let k = 0; k <= n; k++) tn += 0.5 ** k / factorial(k);
    if (!(Math.abs(Math.exp(0.5) - tn) < 1e-3)) throw new Error('p2：真实误差没有小于 10⁻³');

    const third = (xi: number) => Math.abs(Jet.variable(xi, 3).add(1).pow(0.5).derivative(3)) / 6;
    let C = 0;
    for (let i = 0; i <= 1000; i++) C = Math.max(C, third((0.1 * i) / 1000));
    const R = (x: number) => Math.sqrt(1 + x) - (1 + x / 2 - (x * x) / 8);
    for (let i = 1; i <= 1000; i++) {
      const x = (0.1 * i) / 1000;
      if (R(x) / x ** 3 > C * (1 + 1e-9)) throw new Error('p3：真实误差超过了 Cx³');
    }
    if (Math.abs(R(1e-3) / 1e-9 - C) > 1e-4) throw new Error('p3：x → 0 时 R₂/x³ 不趋于 C');

    const p4 = bisect((x) => x ** 3 / 6 - 0.001, 0, 1, 100);

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'number', value: n },
      p3: { type: 'number', value: C },
      p4: { type: 'number', value: p4 },
    };
  },
};

function factorial(k: number): number {
  let f = 1;
  for (let i = 2; i <= k; i++) f *= i;
  return f;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
