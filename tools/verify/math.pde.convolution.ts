// 独立验算 math.pde.convolution 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.pde.convolution.ts
// 约定照本领域：(f*g)(x) = ∫_{−∞}^{+∞} f(y) g(x−y) dy，f̂(ξ) = ∫_{−∞}^{+∞} f(x) e^{−iξx} dx。
// 卷积、变换一律直接按定义数值积分（分段高斯-勒让德，每段 20 个节点；被积函数的跳跃点、尖点放进分段点），
// 不用讲解里的公式（卷积定理、高斯卷高斯）；公式只当对照。无穷区间截到被积函数的尾巴小于 1e−17 的地方。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { gaussLegendre, gaussLegendreRule } from './math.analysis._numeric.ts';

type F1 = (x: number) => number;

const RULE = gaussLegendreRule(20);

/** [lo, hi] 按段宽不超过 h 分段，再并上 breaks（被积函数不光滑的点），排好序去重。 */
function panels(lo: number, hi: number, h: number, breaks: number[] = []): number[] {
  const n = Math.max(1, Math.ceil((hi - lo) / h));
  const pts = Array.from({ length: n + 1 }, (_, k) => lo + ((hi - lo) * k) / n);
  for (const b of breaks) if (b > lo && b < hi) pts.push(b);
  return [...new Set(pts)].sort((p, q) => p - q);
}

function integrate(f: F1, lo: number, hi: number, breaks: number[] = [], h = 0.05): number {
  return gaussLegendre(f, panels(lo, hi, h, breaks), RULE);
}

/** 一个检验函数：值、在它以外为 0 的区间 [lo, hi]（截断区间）、不光滑的点。 */
interface Fn {
  name: string;
  f: F1;
  lo: number;
  hi: number;
  breaks: number[];
}

const box = (a: number, b: number, name = `1_[${a},${b}]`): Fn => ({ name, f: (x) => (x >= a && x <= b ? 1 : 0), lo: a, hi: b, breaks: [a, b] });
const expHalf: Fn = { name: 'e^{−x}（x≥0）', f: (x) => (x >= 0 ? Math.exp(-x) : 0), lo: 0, hi: 45, breaks: [0] };

/** 按定义算卷积 (f*g)(x) = ∫ f(y) g(x−y) dy：y 的范围取 f 的区间和 x − (g 的区间) 的交，两者的断点都分段。 */
function conv(F: Fn, G: Fn, x: number, h = 0.05): number {
  const lo = Math.max(F.lo, x - G.hi);
  const hi = Math.min(F.hi, x - G.lo);
  if (hi <= lo) return 0;
  return integrate((y) => F.f(y) * G.f(x - y), lo, hi, [...F.breaks, ...G.breaks.map((b) => x - b)], h);
}

/** 平移：x ↦ f(x − a)。 */
const shift = (F: Fn, a: number): Fn => ({ name: `${F.name} 右移 ${a}`, f: (x) => F.f(x - a), lo: F.lo + a, hi: F.hi + a, breaks: F.breaks.map((b) => b + a) });

/** 选项为真：所有例子上差都小于 1e−9；为假：至少一个例子差大于 1e−3。两头都不沾就报错。 */
function verdict(gap: number, label: string): boolean {
  if (gap < 1e-9) return true;
  if (gap > 1e-3) return false;
  throw new Error(`${label}：最大差 ${gap}，既不像对也不像错`);
}

const grid = (lo: number, hi: number, step: number, offset = 0.0037): number[] =>
  Array.from({ length: Math.floor((hi - lo) / step) + 1 }, (_, k) => lo + k * step + offset);

export const checks: Record<string, string> = {};

export const verification: Verification = {
  lesson: 'math.pde.convolution',
  notes: {
    p1:
      'f = e^{−x}（x≥0）、g = 1_[0,1]，按定义数值积分 (f*g)(2) = ∫ f(y) g(2−y) dy（y 在 [1, 2] 上，断点分段）；' +
      '再按另一个次序 ∫ f(2−y) g(y) dy 算一遍核对交换律，两者差 < 1e−14；对照 ∫_1^2 e^{−y} dy = e^{−1} − e^{−2}。',
    p2:
      'A：两组例子 (1_[0,1], e^{−x}（x≥0）)、(e^{−(x−0.3)²}, (1+x)·1_[−1,2])，x 取 [−3, 7] 上 0.1 间隔的点，平移后两函数的卷积和 (f*g)(x−1) 差到 O(1)，' +
      '和 (f*g)(x−2) 差 < 1e−9（向右移了 2），假。' +
      'B：三组偶函数 (e^{−x²}(1+x²), 1_[−1,1])、(e^{−|x|}, max(0, 1−x²))、(1_[−2,2], e^{−|x|}cos x)，(f*g)(−x) 和 (f*g)(x) 在 [−4, 4] 上差 < 1e−9；' +
      '对照组把第一组的 f 换成不对称的 e^{−(x−0.5)²}，差到 O(1)，说明检验分得出来，真。' +
      'C：f = 1_[0,1]、g = 1_[0,2]，(f*g)(2.5) 按定义算得 0.5；另一组 f = x(1−x)、g = sin(πx/2) 在 [2, 3) 上也不为 0（[0, 2] 以外最大值 > 0.1），假。' +
      'D：f = 1_[−1/2,1/2]、g = 1_[−3/2,3/2]，在 [−3, 3] 上 0.01 间隔（错开 0.0037）的点按定义算卷积，用二阶差分找折点：恰 4 处，' +
      '凸、凹、凹、凸，折点外为 0、两内折点之间为常数 1 且长度约 2 > 0（不是三角形），各段线性，所以图像是梯形，真。' +
      'E：f = g = e^{−x}（x≥0），x = 0.3、1、2.7、5 处按定义算 (f*g)(x)，和 x e^{−x} 差 < 1e−9，真。',
    p3:
      'g = e^{−x²}，(h*g)(0) = ∫ h(y) g(−y) dy，h(y) = ∫ g(z) g(y−z) dz，两层都在 [−9, 9] 上分段数值积分（段宽 0.25，尾巴 < e^{−81}），不用高斯卷高斯的公式；' +
      '对照：∫g = √π，三重卷积是方差 3/2 的高斯，在 0 处为 π^{3/2}/√(3π) = π/√3。',
    p4:
      'h(x) = ∫_{−1}^{1} e^{−|x−y|} dy 按定义数值积分（y = x 处分段），再对 h(x)e^{−iξx} 在 [−45, 45] 上数值积分（±1 处分段），ξ = π/2，不用卷积定理；' +
      '虚部算出 0（h 是偶函数）。对照：卷积定理 ĝf̂ = (2 sin ξ/ξ)(2/(1+ξ²)) = 32/(π(4+π²))。',
  },
  compute() {
    // p1
    const g1 = box(0, 1);
    const r1 = conv(expHalf, g1, 2);
    const r1b = conv(g1, expHalf, 2);
    if (Math.abs(r1 - r1b) > 1e-14) throw new Error(`p1 两个次序差 ${r1 - r1b}`);
    if (Math.abs(r1 - (Math.exp(-1) - Math.exp(-2))) > 1e-14) throw new Error('p1 与 e^{−1} − e^{−2} 不符');

    // p2
    // A
    const pairsA: [Fn, Fn][] = [
      [box(0, 1), expHalf],
      [
        { name: 'e^{−(x−0.3)²}', f: (x) => Math.exp(-((x - 0.3) ** 2)), lo: -9, hi: 9.6, breaks: [] },
        { name: '(1+x)·1_[−1,2]', f: (x) => (x >= -1 && x <= 2 ? 1 + x : 0), lo: -1, hi: 2, breaks: [-1, 2] },
      ],
    ];
    let Awrong = 0;
    let Aright = 0;
    for (const [F, G] of pairsA) {
      for (const x of grid(-3, 7, 0.1)) {
        const lhs = conv(shift(F, 1), shift(G, 1), x);
        Awrong = Math.max(Awrong, Math.abs(lhs - conv(F, G, x - 1)));
        Aright = Math.max(Aright, Math.abs(lhs - conv(F, G, x - 2)));
      }
    }
    if (Aright > 1e-9) throw new Error(`A 的对照（右移 2）差 ${Aright}`);
    checks.A = `和 (f*g)(x−1) 最大差 ${Awrong.toExponential(2)}，和 (f*g)(x−2) 最大差 ${Aright.toExponential(2)}`;
    // B
    const pairsB: [Fn, Fn][] = [
      [
        { name: 'e^{−x²}(1+x²)', f: (x) => Math.exp(-x * x) * (1 + x * x), lo: -9, hi: 9, breaks: [] },
        box(-1, 1),
      ],
      [
        { name: 'e^{−|x|}', f: (x) => Math.exp(-Math.abs(x)), lo: -45, hi: 45, breaks: [0] },
        { name: 'max(0, 1−x²)', f: (x) => Math.max(0, 1 - x * x), lo: -1, hi: 1, breaks: [-1, 1] },
      ],
      [box(-2, 2), { name: 'e^{−|x|}cos x', f: (x) => Math.exp(-Math.abs(x)) * Math.cos(x), lo: -45, hi: 45, breaks: [0] }],
    ];
    const evenGap = (F: Fn, G: Fn): number => {
      let worst = 0;
      for (const x of grid(0, 4, 0.1)) worst = Math.max(worst, Math.abs(conv(F, G, x) - conv(F, G, -x)));
      return worst;
    };
    let Bgap = 0;
    for (const [F, G] of pairsB) Bgap = Math.max(Bgap, evenGap(F, G));
    const Bcontrol = evenGap({ name: 'e^{−(x−0.5)²}', f: (x) => Math.exp(-((x - 0.5) ** 2)), lo: -9, hi: 10, breaks: [] }, box(-1, 1));
    if (Bcontrol < 1e-3) throw new Error(`B 的对照组没分出不对称：${Bcontrol}`);
    checks.B = `偶函数三组最大差 ${Bgap.toExponential(2)}；对照组（不对称的 f）差 ${Bcontrol.toExponential(2)}`;
    // C
    const C1 = conv(box(0, 1), box(0, 2), 2.5);
    const fC: Fn = { name: 'x(1−x)', f: (x) => (x >= 0 && x <= 1 ? x * (1 - x) : 0), lo: 0, hi: 1, breaks: [0, 1] };
    const gC: Fn = { name: 'sin(πx/2)', f: (x) => (x >= 0 && x <= 2 ? Math.sin((Math.PI * x) / 2) : 0), lo: 0, hi: 2, breaks: [0, 2] };
    let C2 = 0;
    for (const x of [...grid(-1, 0, 0.05, -0.0037), ...grid(2, 3, 0.05)]) if (x < 0 || x > 2) C2 = Math.max(C2, Math.abs(conv(fC, gC, x)));
    checks.C = `1_[0,1]*1_[0,2] 在 2.5 处 = ${C1.toFixed(12)}；x(1−x)*sin(πx/2) 在 [0, 2] 以外最大 ${C2.toFixed(6)}`;
    const Cgap = Math.max(Math.abs(C1), C2);
    // D
    const fD = box(-0.5, 0.5);
    const gD = box(-1.5, 1.5);
    const xsD = grid(-3, 3, 0.01);
    const cD = xsD.map((x) => conv(fD, gD, x));
    const kinks: { at: number; sign: number }[] = [];
    for (let i = 1; i + 1 < xsD.length; i++) {
      const d2 = cD[i + 1] - 2 * cD[i] + cD[i - 1];
      if (Math.abs(d2) > 1e-9) {
        const last = kinks[kinks.length - 1];
        if (last && xsD[i] - last.at < 0.015) continue; // 折点落在两格之间时相邻两点都有二阶差分，算一处
        kinks.push({ at: xsD[i], sign: Math.sign(d2) });
      }
    }
    const signs = kinks.map((k) => k.sign).join(',');
    let Dtrap = kinks.length === 4 && signs === '1,-1,-1,1';
    if (Dtrap) {
      const [a, b, c, d] = kinks.map((k) => k.at);
      const top = cD[xsD.findIndex((x) => x > (b + c) / 2)];
      xsD.forEach((x, i) => {
        if ((x < a - 0.02 || x > d + 0.02) && Math.abs(cD[i]) > 1e-12) Dtrap = false; // 外面为 0
        if (x > b + 0.02 && x < c - 0.02 && Math.abs(cD[i] - top) > 1e-12) Dtrap = false; // 顶上平
      });
      if (!(c - b > 1 && top > 0.5)) Dtrap = false; // 顶有长度，不是三角形
      checks.D = `折点约在 ${[a, b, c, d].map((v) => v.toFixed(2)).join('、')}，顶高 ${top.toFixed(12)}，顶长约 ${(c - b).toFixed(2)}`;
    } else checks.D = `折点 ${kinks.length} 处，凹凸 ${signs}`;
    // E
    let Egap = 0;
    for (const x of [0.3, 1, 2.7, 5]) Egap = Math.max(Egap, Math.abs(conv(expHalf, expHalf, x) - x * Math.exp(-x)));
    checks.E = `和 x e^{−x} 最大差 ${Egap.toExponential(2)}`;
    // C 的「差」是 f*g 在 [0, 2] 以外的最大绝对值：小于 1e−9 才说明选项在例子上成立
    const truth = [verdict(Awrong, 'A'), verdict(Bgap, 'B'), verdict(Cgap, 'C'), Dtrap, verdict(Egap, 'E')];
    const p2 = truth.flatMap((ok, i) => (ok ? [i + 1] : []));

    // p3
    const g = (x: number): number => Math.exp(-x * x);
    const pts3 = panels(-9, 9, 0.25);
    const h3 = (y: number): number => gaussLegendre((z) => g(z) * g(y - z), pts3, RULE);
    const r3 = gaussLegendre((y) => h3(y) * g(-y), pts3, RULE);
    const ref3 = Math.PI / Math.sqrt(3);
    if (Math.abs(r3 - ref3) > 1e-12) throw new Error(`p3 与 π/√3 差 ${r3 - ref3}`);

    // p4
    const xi = Math.PI / 2;
    const h4 = (x: number): number => integrate((y) => Math.exp(-Math.abs(x - y)), -1, 1, [x], 0.25);
    const pts4 = panels(-45, 45, 0.25, [-1, 1]);
    const re4 = gaussLegendre((x) => h4(x) * Math.cos(xi * x), pts4, RULE);
    const im4 = -gaussLegendre((x) => h4(x) * Math.sin(xi * x), pts4, RULE);
    if (Math.abs(im4) > 1e-12) throw new Error(`p4 虚部 ${im4}`);
    const ref4 = 32 / (Math.PI * (4 + Math.PI ** 2));
    if (Math.abs(re4 - ref4) > 1e-12) throw new Error(`p4 与卷积定理 ${ref4} 差 ${re4 - ref4}`);
    checks.p3 = `数值 ${r3.toPrecision(15)}，π/√3 = ${ref3.toPrecision(15)}`;
    checks.p4 = `数值 ${re4.toPrecision(15)}（虚部 ${im4.toExponential(1)}），32/(π(4+π²)) = ${ref4.toPrecision(15)}`;

    return {
      p1: { type: 'number', value: r1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: r3 },
      p4: { type: 'number', value: re4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
  console.log('\n核对数据：');
  for (const [k, v] of Object.entries(checks)) console.log(`  ${k}: ${v}`);
}
