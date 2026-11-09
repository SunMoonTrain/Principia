// 独立验算 math.analysis.ftc-proof 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.ftc-proof.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { grid, modulus, richardson } from './math.analysis._numeric.ts';

/** 复合辛普森公式，n 段（n 为偶数）。 */
function simpson(f: (x: number) => number, a: number, b: number, n = 200): number {
  if (b === a) return 0;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 === 1 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

/**
 * ∫ₐˣ f：在 breaks（f 的跳跃点、尖点）处切开，每一段内部用辛普森公式（只取段内的点，所以端点上的取值不影响）。
 * 被积函数在每一段里是不超过三次的多项式，辛普森公式是精确的。
 */
function integral(f: (t: number) => number, a: number, x: number, breaks: number[]): number {
  const cuts = [a, ...breaks.filter((c) => c > a && c < x), x];
  let s = 0;
  for (let i = 1; i < cuts.length; i++) {
    const lo = cuts[i - 1];
    const hi = cuts[i];
    const eps = (hi - lo) * 1e-12;
    s += simpson(f, lo + eps, hi - eps) + 0; // 段的两端各让开一点点，不取到跳跃点上的值
  }
  return s;
}

/** 两侧差商 (F(x + h) − F(x))/h 在 0 < |h| < δ 的格点上的振幅，δ = 10⁻²、10⁻³、10⁻⁴；一路缩小到 10⁻² 以下才算可导。 */
function differentiableAt(F: (x: number) => number, x: number): boolean {
  const amps = [1e-2, 1e-3, 1e-4].map((delta) => {
    let lo = Infinity;
    let hi = -Infinity;
    for (const h of grid(-delta, delta, 41)) {
      if (Math.abs(h) < 1e-15) continue;
      const q = (F(x + h) - F(x)) / h;
      lo = Math.min(lo, q);
      hi = Math.max(hi, q);
    }
    return hi - lo;
  });
  return amps.every((v, i) => i === 0 || v <= amps[i - 1] + 1e-9) && amps[amps.length - 1] < 1e-2;
}

export const verification: Verification = {
  lesson: 'math.analysis.ftc-proof',
  notes: {
    p1: 'F 在整数处切开逐段积分（阶梯函数每段是常数）；F\'(1.5) 用对称差商加 Richardson 外推。',
    p2:
      '在例子上逐条找反例。被积函数取 5 个在 [0, 1] 上可积的：sgn(x − 1/2)、⌊3x⌋、在 1/2 处取 7 而别处取 x 的函数、x²、1 − |2x − 1|；F 在跳跃点、尖点处切开逐段积分。' +
      'A 看每个 F 的连续模是否缩小到 0；B 看每个 F 在 (0, 1) 的格点和跳跃点上是否都可导；C 在每个 f 的连续点上看 F 的对称差商是否趋于 f(x₀)；' +
      'D 用 G(x) = x² sin(1/x²)（G(0) = 0）在 [0, 1] 上：G 处处可导，可 G\' 在 0 附近无界，不可积，等式左边没有意义。',
    p3: 'G 用辛普森公式算（积分上限是 x²），G\'(1) 用对称差商加 Richardson 外推。',
    p4: '辛普森公式，在 0 处切开分两段积分（被积函数在 0 处有尖点）。',
  },
  compute() {
    // p1：F(x) = ∫₀ˣ ⌊t⌋ dt
    const F1 = (x: number): number => integral((t) => Math.floor(t), 0, x, [1, 2]);
    const p1a = F1(2.5);
    const p1b = richardson((n) => (F1(1.5 + 1 / n) - F1(1.5 - 1 / n)) * (n / 2), 100, 3);

    // p2：被积函数，它们的间断点 jumps，和积分时要切开的点 breaks（间断点加尖点）
    const fs: { f: (t: number) => number; jumps: number[]; breaks: number[] }[] = [
      { f: (t) => Math.sign(t - 0.5), jumps: [0.5], breaks: [0.5] },
      { f: (t) => Math.floor(3 * t), jumps: [1 / 3, 2 / 3, 1], breaks: [1 / 3, 2 / 3, 1] },
      { f: (t) => (t === 0.5 ? 7 : t), jumps: [0.5], breaks: [0.5] },
      { f: (t) => t * t, jumps: [], breaks: [] },
      { f: (t) => 1 - Math.abs(2 * t - 1), jumps: [], breaks: [0.5] },
    ];
    const Fof = ({ f, breaks }: (typeof fs)[number]) => (x: number): number => integral(f, 0, x, breaks);
    const p2: number[] = [];
    // A：F 都连续
    const allContinuous = fs.every((item) => {
      const F = Fof(item);
      const xs = grid(0, 1, 400);
      const om = [1e-2, 1e-3, 1e-4].map((h) => modulus(F, xs, h, 1));
      return om.every((v, i) => i === 0 || v <= om[i - 1] + 1e-9) && om[om.length - 1] < 1e-2;
    });
    if (allContinuous) p2.push(1);
    // B：F 在 (0, 1) 内处处可导？在 0.05, 0.10, …, 0.95 和各个跳跃点、尖点上查
    const allDifferentiable = fs.every((item) =>
      [...grid(0.05, 0.95, 18), ...item.breaks.filter((c) => c > 0 && c < 1)].every((x) => differentiableAt(Fof(item), x)),
    );
    if (allDifferentiable) p2.push(2);
    // C：f 在 x₀ 处连续时 F'(x₀) = f(x₀)：在 f 的连续点（格点里去掉间断点）上查
    const cHolds = fs.every((item) => {
      const F = Fof(item);
      return grid(0.05, 0.95, 18)
        .filter((x) => item.jumps.every((c) => Math.abs(x - c) > 1e-9))
        .every((x) => Math.abs((F(x + 1e-6) - F(x - 1e-6)) / 2e-6 - item.f(x)) < 1e-4);
    });
    if (cHolds) p2.push(3);
    // D：G(x) = x² sin(1/x²) 在 [0, 1] 上处处可导，G' 在 0 附近无界
    const G = (x: number): number => (x === 0 ? 0 : x * x * Math.sin(1 / (x * x)));
    const dG = (x: number): number => (x === 0 ? 0 : 2 * x * Math.sin(1 / (x * x)) - (2 / x) * Math.cos(1 / (x * x)));
    const hs = [1e-3, 1e-5, 1e-7];
    if (!hs.every((h) => Math.abs(G(h) / h) <= h)) throw new Error('p2 D：G 在 0 处的差商不趋于 0');
    const supNear0 = [1e-1, 1e-2, 1e-3].map((w) => {
      let best = 0;
      for (const x of grid(w / 10, w, 100_000)) best = Math.max(best, Math.abs(dG(x)));
      return best;
    });
    const unbounded = supNear0.every((v, i) => i === 0 || v > supNear0[i - 1] * 5);
    if (!unbounded) p2.push(4); // G' 无界就不黎曼可积，D 的等式左边不存在，D 不成立

    // p3：G(x) = ∫₀^{x²} dt/(1 + t)，求 G'(1)
    const G3 = (x: number): number => simpson((t) => 1 / (1 + t), 0, x * x, 2000);
    const p3 = richardson((n) => (G3(1 + 1 / n) - G3(1 - 1 / n)) * (n / 2), 100, 3);

    // p4：∫_{−1}^{2} 2|x| dx
    const p4 = integral((x) => 2 * Math.abs(x), -1, 2, [0]);

    return {
      p1: { type: 'tuple', value: [p1a, p1b] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
