// 独立验算 math.pde.fourier-transform 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.pde.fourier-transform.ts
// 约定照讲解的定义：f̂(ξ) = ∫_{−∞}^{+∞} f(x) e^{−iξx} dx。
// 变换一律直接按定义数值积分（分段高斯-勒让德，每段 20 个节点，段宽 0.05，函数的尖点、跳跃点放进分段点），
// 不用讲解里的公式；无穷区间截到 [−R, R]，R 取到被积函数的尾巴小于 1e−17。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { gaussLegendre, gaussLegendreRule } from './math.analysis._numeric.ts';

type C = [number, number];
type CFun = (x: number) => C;

const RULE = gaussLegendreRule(20);

/** [lo, hi] 按段宽 h 分段，再并上 breaks（函数不光滑的点），排好序去重。 */
function panels(lo: number, hi: number, h: number, breaks: number[] = []): number[] {
  const n = Math.ceil((hi - lo) / h);
  const pts = Array.from({ length: n + 1 }, (_, k) => lo + ((hi - lo) * k) / n);
  for (const b of breaks) if (b > lo && b < hi) pts.push(b);
  return [...new Set(pts)].sort((p, q) => p - q);
}

/** 复值函数 f 的傅里叶变换在 ξ 处的值：∫ f(x) e^{−iξx} dx，积分区间 [lo, hi]。 */
function transform(f: CFun, xi: number, lo: number, hi: number, breaks: number[] = []): C {
  const pts = panels(lo, hi, 0.05, breaks);
  // (fr + i fi)(cos ξx − i sin ξx) = (fr cos + fi sin) + i (fi cos − fr sin)
  const re = gaussLegendre((x) => {
    const [fr, fi] = f(x);
    return fr * Math.cos(xi * x) + fi * Math.sin(xi * x);
  }, pts, RULE);
  const im = gaussLegendre((x) => {
    const [fr, fi] = f(x);
    return fi * Math.cos(xi * x) - fr * Math.sin(xi * x);
  }, pts, RULE);
  return [re, im];
}

const real = (f: (x: number) => number): CFun => (x) => [f(x), 0];
const mul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cis = (t: number): C => [Math.cos(t), Math.sin(t)];
const dist = (a: C, b: C): number => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** 一个检验函数：值、导数（不可导的点上随便取）、积分区间和不光滑的点。 */
interface TestFn {
  name: string;
  f: (x: number) => number;
  df: (x: number) => number;
  lo: number;
  hi: number;
  breaks: number[];
}

// p2 用的检验函数：都绝对可积、取实数值；前三个连续、除有限个点外可导、导数连续、导数也绝对可积。
const tri = (x: number): number => Math.max(0, 1 - Math.abs(x - 0.3));
const TESTS: TestFn[] = [
  {
    name: 'e^{−(x−0.5)²}(1+x)',
    f: (x) => Math.exp(-((x - 0.5) ** 2)) * (1 + x),
    df: (x) => Math.exp(-((x - 0.5) ** 2)) * (1 - 2 * (x - 0.5) * (1 + x)),
    lo: -12,
    hi: 13,
    breaks: [],
  },
  {
    name: '(1+x)·max(0, 1−|x−0.3|)',
    f: (x) => (1 + x) * tri(x),
    df: (x) => (Math.abs(x - 0.3) >= 1 ? 0 : tri(x) + (1 + x) * (x < 0.3 ? 1 : -1)),
    lo: -0.7,
    hi: 1.3,
    breaks: [0.3],
  },
  {
    name: 'e^{−|x|}(2+sin x)',
    f: (x) => Math.exp(-Math.abs(x)) * (2 + Math.sin(x)),
    df: (x) => (x > 0 ? Math.exp(-x) * (Math.cos(x) - 2 - Math.sin(x)) : Math.exp(x) * (2 + Math.sin(x) + Math.cos(x))),
    lo: -45,
    hi: 45,
    breaks: [0],
  },
];

// A 项用的奇函数（取实数值、绝对可积；第二个在 0 处跳跃）。
const ODD: TestFn[] = [
  { name: 'x e^{−x²}', f: (x) => x * Math.exp(-x * x), df: () => 0, lo: -12, hi: 12, breaks: [] },
  { name: 'sgn(x) e^{−|x|}', f: (x) => Math.sign(x) * Math.exp(-Math.abs(x)), df: () => 0, lo: -45, hi: 45, breaks: [0] },
  { name: 'sin(x) e^{−x²/4}(1+x²)', f: (x) => Math.sin(x) * Math.exp(-x * x / 4) * (1 + x * x), df: () => 0, lo: -16, hi: 16, breaks: [] },
];

// 检验的频率：[−5, 5] 上 27 个点，避开整齐的数。
const XIS = Array.from({ length: 27 }, (_, k) => -5 + 0.37 * k + 0.013);

/** 在全部检验函数、全部 ξ 上，左边（按定义算的变换）和右边（选项给的式子）最大差多少。 */
function maxGap(tests: TestFn[], lhs: (t: TestFn, xi: number) => C, rhs: (t: TestFn, xi: number) => C): number {
  let worst = 0;
  for (const t of tests) for (const xi of XIS) worst = Math.max(worst, dist(lhs(t, xi), rhs(t, xi)));
  return worst;
}

const fhat = (t: TestFn, xi: number): C => transform(real(t.f), xi, t.lo, t.hi, t.breaks);

/** 选项为真：所有例子上差都小于 1e−9；为假：至少一个例子差大于 1e−3。两头都不沾就报错。 */
function verdict(gap: number, label: string): boolean {
  if (gap < 1e-9) return true;
  if (gap > 1e-3) return false;
  throw new Error(`${label}：最大差 ${gap}，既不像对也不像错`);
}

export const gaps: Record<string, number> = {};

export const verification: Verification = {
  lesson: 'math.pde.fourier-transform',
  notes: {
    p1: '矩形 f = 1（|x|<3）按定义在 [−3, 3] 上数值积分 ∫ e^{−iξx} dx，ξ = π/6；虚部算出 0，取实部（与 2sin(3ξ)/ξ = 12/π 对照）。',
    p2:
      '在 3 个检验函数 e^{−(x−0.5)²}(1+x)、(1+x)·max(0,1−|x−0.3|)、e^{−|x|}(2+sin x)（都不对称、连续、分段光滑，导数也绝对可积）和 ξ ∈ [−5, 5] 的 27 个点上，' +
      '把选项左边的变换按定义数值积分，和右边的式子比：B 差 < 1e−9；C 与 f̂(ξ+3) 差到 O(1)（与 f̂(ξ−3) 一致）；D 与 −iξf̂ 差到 O(1)（与 +iξf̂ 一致）；E 与 2f̂(2ξ) 差到 O(1)（与 ½f̂(ξ/2) 一致）。' +
      'A 另用 3 个实的奇函数 x e^{−x²}、sgn(x)e^{−|x|}、sin x·e^{−x²/4}(1+x²)：f̂(−ξ) = −f̂(ξ) 且实部为 0，差 < 1e−9，找不到反例。',
    p3: 'f = e^{−|x|}cos 3x 按定义在 [−45, 45] 上数值积分（0 处分段），ξ = 3；虚部算出 0（与 ½[2/(1+0²)+2/(1+6²)] = 38/37 对照）。',
    p4: '三角形 1−|x| 按定义在 [−1, 1] 上数值积分（0 处分段），ξ = π；虚部算出 0（与 (2−2cos ξ)/ξ² = 4/π² 对照）。',
  },
  compute() {
    // p1
    const r1 = transform(real((x) => (Math.abs(x) < 3 ? 1 : 0)), Math.PI / 6, -3, 3);
    if (Math.abs(r1[1]) > 1e-12) throw new Error('p1 虚部不为 0');
    if (Math.abs(r1[0] - 12 / Math.PI) > 1e-12) throw new Error('p1 与 12/π 不符');

    // p2
    const A1 = maxGap(ODD, (t, xi) => fhat(t, -xi), (t, xi) => {
      const v = fhat(t, xi);
      return [-v[0], -v[1]];
    });
    const A2 = maxGap(ODD, (t, xi) => [fhat(t, xi)[0], 0], () => [0, 0]);
    const B = maxGap(TESTS, (t, xi) => transform(real((x) => t.f(x - 2)), xi, t.lo + 2, t.hi + 2, t.breaks.map((b) => b + 2)), (t, xi) => mul(cis(-2 * xi), fhat(t, xi)));
    const Cl = (t: TestFn, xi: number): C => transform((x) => mul(cis(3 * x), [t.f(x), 0]), xi, t.lo, t.hi, t.breaks);
    const Cwrong = maxGap(TESTS, Cl, (t, xi) => fhat(t, xi + 3));
    const Cright = maxGap(TESTS, Cl, (t, xi) => fhat(t, xi - 3));
    const Dl = (t: TestFn, xi: number): C => transform(real(t.df), xi, t.lo, t.hi, t.breaks);
    const Dwrong = maxGap(TESTS, Dl, (t, xi) => mul([0, -xi], fhat(t, xi)));
    const Dright = maxGap(TESTS, Dl, (t, xi) => mul([0, xi], fhat(t, xi)));
    const El = (t: TestFn, xi: number): C => transform(real((x) => t.f(2 * x)), xi, t.lo / 2, t.hi / 2, t.breaks.map((b) => b / 2));
    const Ewrong = maxGap(TESTS, El, (t, xi) => {
      const v = fhat(t, 2 * xi);
      return [2 * v[0], 2 * v[1]];
    });
    const Eright = maxGap(TESTS, El, (t, xi) => {
      const v = fhat(t, xi / 2);
      return [v[0] / 2, v[1] / 2];
    });
    Object.assign(gaps, { A1, A2, B, Cwrong, Cright, Dwrong, Dright, Ewrong, Eright });
    // 对照组（正确的式子）必须对上，说明数值积分本身没问题
    for (const [k, v] of Object.entries({ B, Cright, Dright, Eright })) if (v > 1e-9) throw new Error(`对照 ${k} 差 ${v}`);
    const truth = [
      verdict(Math.max(A1, A2), 'A'),
      verdict(B, 'B'),
      verdict(Cwrong, 'C'),
      verdict(Dwrong, 'D'),
      verdict(Ewrong, 'E'),
    ];
    const p2 = truth.flatMap((ok, i) => (ok ? [i + 1] : []));

    // p3
    const r3 = transform(real((x) => Math.exp(-Math.abs(x)) * Math.cos(3 * x)), 3, -45, 45, [0]);
    if (Math.abs(r3[1]) > 1e-12) throw new Error('p3 虚部不为 0');
    if (Math.abs(r3[0] - 38 / 37) > 1e-12) throw new Error('p3 与 38/37 不符');

    // p4
    const r4 = transform(real((x) => Math.max(0, 1 - Math.abs(x))), Math.PI, -1, 1, [0]);
    if (Math.abs(r4[1]) > 1e-12) throw new Error('p4 虚部不为 0');
    if (Math.abs(r4[0] - 4 / Math.PI ** 2) > 1e-12) throw new Error('p4 与 4/π² 不符');

    return {
      p1: { type: 'number', value: r1[0] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: r3[0] },
      p4: { type: 'number', value: r4[0] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
  console.log('\np2 各项的最大差：', Object.fromEntries(Object.entries(gaps).map(([k, v]) => [k, v.toExponential(2)])));
}
