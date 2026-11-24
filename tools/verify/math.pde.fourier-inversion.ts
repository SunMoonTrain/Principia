// 独立验算 math.pde.fourier-inversion 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.pde.fourier-inversion.ts
// 约定照讲解的定义：f̂(ξ) = ∫_{−∞}^{+∞} f(x) e^{−iξx} dx，反演 f(x) = lim_{R→∞} (1/2π) ∫_{−R}^{R} f̂(ξ) e^{iξx} dξ（对称极限）。
// 数值积分一律用分段高斯-勒让德（每段 20 个节点），函数的尖点、跳跃点放进分段点；
// 正变换的无穷区间截到被积函数的尾巴小于 1e−17 的地方。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { gaussLegendre, gaussLegendreRule, richardson } from './math.analysis._numeric.ts';

type C = [number, number];
type CFun = (x: number) => C;

const RULE = gaussLegendreRule(20);

/** [lo, hi] 按段宽不超过 h 分段，再并上 breaks（函数不光滑的点），排好序去重。 */
function panels(lo: number, hi: number, h: number, breaks: number[] = []): number[] {
  const n = Math.ceil((hi - lo) / h);
  const pts = Array.from({ length: n + 1 }, (_, k) => lo + ((hi - lo) * k) / n);
  for (const b of breaks) if (b > lo && b < hi) pts.push(b);
  return [...new Set(pts)].sort((p, q) => p - q);
}

/** 复值函数 f 的傅里叶变换在 ξ 处的值：∫ f(x) e^{−iξx} dx，积分区间 [lo, hi]（直接按定义数值积分）。 */
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

/** 反演积分 (1/2π) ∫_{−R}^{R} F(ξ) e^{iξx} dξ（F 是给出的变换，复值）；段宽 0.05，R 有限。 */
function inverseOn(F: CFun, x: number, R: number, h = 0.05): C {
  const pts = panels(-R, R, h);
  // (Fr + i Fi)(cos ξx + i sin ξx) = (Fr cos − Fi sin) + i (Fr sin + Fi cos)
  const re = gaussLegendre((xi) => {
    const [Fr, Fi] = F(xi);
    return Fr * Math.cos(xi * x) - Fi * Math.sin(xi * x);
  }, pts, RULE);
  const im = gaussLegendre((xi) => {
    const [Fr, Fi] = F(xi);
    return Fr * Math.sin(xi * x) + Fi * Math.cos(xi * x);
  }, pts, RULE);
  return [re / (2 * Math.PI), im / (2 * Math.PI)];
}

/**
 * 对称极限 lim_{R→∞} (1/2π) ∫_{−R}^{R} F(ξ) e^{iξx} dξ，F 只按 1/ξ² 衰减时用：
 * 取 R = 50·2^k（k = 0…4），再用 Richardson 外推逐级消去 1/R 的各次项。
 * 被积函数没有振荡（x = 0）时才用它；R 有限时的值另外打印出来看收敛。
 */
function symmetricLimitAt0(F: CFun): { limit: C; atR: number[] } {
  const atR: number[] = [];
  const re = richardson((R) => {
    const v = inverseOn(F, 0, R, 0.5)[0];
    atR.push(v);
    return v;
  }, 50, 5);
  const im = inverseOn(F, 0, 800, 0.5)[1];
  return { limit: [re, im], atR };
}

const real = (f: (x: number) => number): CFun => (x) => [f(x), 0];
const dist = (a: C, b: C): number => Math.hypot(a[0] - b[0], a[1] - b[1]);
const cdiv = (a: C, b: C): C => {
  const d = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
};

// 检验用的频率：[−12, 12] 上 41 个点，避开整齐的数。
const XIS = Array.from({ length: 41 }, (_, k) => -12 + 0.6 * k + 0.017);

/** 正变换按定义数值积分，和审查自己由指数函数积出来的闭式比，返回最大差。 */
function closedFormGap(f: CFun, lo: number, hi: number, breaks: number[], closed: CFun): number {
  let worst = 0;
  for (const xi of XIS) worst = Math.max(worst, dist(transform(f, xi, lo, hi, breaks), closed(xi)));
  return worst;
}

export const checks: Record<string, number | string> = {};

export const verification: Verification = {
  lesson: 'math.pde.fourier-inversion',
  notes: {
    p1:
      'f = 3e^{−2x}（x>0）、e^{x}（x≤0）。先按定义数值积分出 f̂（[−45, 45]，0 处分段），和审查自己积出的 3/(2+iξ) + 1/(1−iξ) 在 41 个 ξ 上核对（差 < 1e−12）；' +
      '再对这个 f̂ 在 [−R, R] 上数值积分，R = 50、100、…、800 用 Richardson 外推 R→∞（虚部是奇函数，对称积分为 0）。得 2 =（3+1）/2，不是 f(0) = 1。',
    p2:
      'A：f = e^{−(x−1)²} 按定义数值积分，|f̂(ξ)| 在 [−12, 12] 的 41 个点和 ξ = 0 上比，ξ≠0 处都严格小于 |f̂(0)| = √π（f ≥ 0 时 |f̂(ξ)| ≤ ∫f = f̂(0)），真。' +
      'B：f = e^{−x²}cos 5x，数值积分得 f̂(0) ≈ 0.0034 < f̂(5) ≈ 0.886，假。' +
      'C：f = e^{−|x|}，数值变换和 2/(1+ξ²) 核对后，对称积分外推得 (1/2π)∫f̂ → 1 = f(0)，真。' +
      'D：反例 f = i x e^{−x²} 和 f = i·sgn(x)e^{−|x|}，数值变换的虚部在 41 个点上都 < 1e−12（f̂ 取实数值），f 却不取实数值，假。' +
      'E：是反演定理的推论（f̂ ≡ 0 ⇒ f(x) = lim(1/2π)∫f̂e^{iξx} = 0）；数值上在两个满足条件、不对称、带尖角的检验函数（max(0,1−|x−0.4|)·(1+x)、e^{−|x|}(2+sin x)）上，' +
      '在 x = −0.3、0.7、1.1 处把 R 有限时的反演积分（按 Fubini 写成 ∫f(y)sin(R(x−y))/(π(x−y))dy）算到 R = 400、1600、6400，误差逐级变小、最后 < 1e−5，说明这些条件下 f 由 f̂ 决定，真。',
    p3:
      'f̂(ξ) = iξe^{−ξ²}，直接数值积分 f(1) = (1/2π)∫_{−12}^{12} iξe^{−ξ²}e^{iξ}dξ（尾巴 < 1e−60）。' +
      '对照：候选 f(x) = −x e^{−x²/4}/(4√π) 按定义数值变换，在 41 个 ξ 上等于 iξe^{−ξ²}（差 < 1e−12），由唯一性就是它。',
    p4:
      'f̂(ξ) = e^{−ξ²}cos 2ξ，直接数值积分 f(2) = (1/2π)∫_{−12}^{12} e^{−ξ²}cos 2ξ·e^{2iξ}dξ。' +
      '对照：候选 f(x) = [e^{−(x−2)²/4} + e^{−(x+2)²/4}]/(4√π) 按定义数值变换，在 41 个 ξ 上等于 e^{−ξ²}cos 2ξ（差 < 1e−12）。',
  },
  compute() {
    // p1
    const f1 = real((x) => (x > 0 ? 3 * Math.exp(-2 * x) : Math.exp(x)));
    const F1: CFun = (xi) => {
      const a = cdiv([3, 0], [2, xi]);
      const b = cdiv([1, 0], [1, -xi]);
      return [a[0] + b[0], a[1] + b[1]];
    };
    const gap1 = closedFormGap(f1, -45, 45, [0], F1);
    if (gap1 > 1e-12) throw new Error(`p1 闭式和数值变换差 ${gap1}`);
    const s1 = symmetricLimitAt0(F1);
    if (Math.abs(s1.limit[1]) > 1e-12) throw new Error('p1 虚部不为 0');
    checks.p1_gap = gap1;
    checks.p1_atR = s1.atR.map((v) => v.toFixed(6)).join(', ');

    // p2
    const XI_FINE = [...XIS, -0.3, -0.1, -0.01, 0.01, 0.1, 0.3];
    // A
    const fA = real((x) => Math.exp(-((x - 1) ** 2)));
    const A0 = Math.hypot(...transform(fA, 0, -12, 14));
    let Amax = 0;
    for (const xi of XI_FINE) Amax = Math.max(Amax, Math.hypot(...transform(fA, xi, -12, 14)));
    const A = Amax < A0 && Math.abs(A0 - Math.sqrt(Math.PI)) < 1e-12;
    checks.A = `|f̂(0)| = ${A0.toFixed(9)}，ξ≠0 处最大 ${Amax.toFixed(9)}`;
    // B
    const fB = real((x) => Math.exp(-x * x) * Math.cos(5 * x));
    const B0 = transform(fB, 0, -12, 12);
    let Bmax = -Infinity;
    let BmaxAt = 0;
    for (const xi of [...XI_FINE, 4.9, 5, 5.1]) {
      const v = transform(fB, xi, -12, 12);
      if (Math.abs(v[1]) > 1e-12) throw new Error('B 的变换不是实数');
      if (v[0] > Bmax) {
        Bmax = v[0];
        BmaxAt = xi;
      }
    }
    const B = Bmax <= B0[0];
    checks.B = `f̂(0) = ${B0[0].toExponential(4)}，最大 f̂(${BmaxAt}) = ${Bmax.toFixed(6)}`;
    // C
    const fC = real((x) => Math.exp(-Math.abs(x)));
    const FC: CFun = (xi) => [2 / (1 + xi * xi), 0];
    const gapC = closedFormGap(fC, -45, 45, [0], FC);
    if (gapC > 1e-12) throw new Error(`C 闭式和数值变换差 ${gapC}`);
    const sC = symmetricLimitAt0(FC);
    const C = Math.abs(sC.limit[0] - 1) < 1e-9;
    checks.C = `外推得 ${sC.limit[0]}；R 有限时 ${sC.atR.map((v) => v.toFixed(6)).join(', ')}`;
    // D：两个反例
    const D1: CFun = (x) => [0, x * Math.exp(-x * x)];
    const D2: CFun = (x) => [0, Math.sign(x) * Math.exp(-Math.abs(x))];
    let Dim = 0;
    for (const xi of XIS) {
      Dim = Math.max(Dim, Math.abs(transform(D1, xi, -12, 12)[1]), Math.abs(transform(D2, xi, -45, 45, [0])[1]));
    }
    const fhatIsReal = Dim < 1e-12;
    const fIsReal = Math.abs(D1(1)[1]) < 1e-12 && Math.abs(D2(1)[1]) < 1e-12;
    const D = !(fhatIsReal && !fIsReal);
    checks.D = `反例的 f̂ 虚部最大 ${Dim.toExponential(2)}，f(1) 的虚部 ${D1(1)[1].toFixed(4)}、${D2(1)[1].toFixed(4)}`;
    // E：反演在满足条件的检验函数上给回 f。R 有限时的反演积分 (1/2π)∫_{−R}^{R} f̂ e^{iξx} dξ
    // 按 Fubini（[−R, R] 有限、f 绝对可积）等于 ∫ f(y) sin(R(x−y))/(π(x−y)) dy，在 x 处直接数值积分这个式子，
    // R = 400、1600、6400，看误差随 R 变小、R = 6400 时小于 1e−5（尖角处的误差按 1/R 量级、别处按 1/R² 量级振荡着变小，不外推）。
    const tri = (x: number): number => Math.max(0, 1 - Math.abs(x - 0.4)) * (1 + x);
    const gE = (x: number): number => Math.exp(-Math.abs(x)) * (2 + Math.sin(x));
    const Eerr: number[] = [0, 0, 0];
    const RS = [400, 1600, 6400];
    for (const [g, lo, hi, br] of [
      [tri, -0.6, 1.4, [0.4]],
      [gE, -40, 40, [0]],
    ] as [(x: number) => number, number, number, number[]][]) {
      for (const x0 of [-0.3, 0.7, 1.1]) {
        RS.forEach((R, j) => {
          const pts = panels(lo, hi, Math.min(0.05, 1 / R), [...br, x0]);
          // 分段点和 x0 浮点上差 1e−15 时会有极窄的一段，节点落在 x0 上：那里 sin(Ru)/(πu) 取极限 R/π
          const v = gaussLegendre((y) => {
            const u = x0 - y;
            return Math.abs(u) < 1e-12 ? (g(y) * R) / Math.PI : (g(y) * Math.sin(R * u)) / (Math.PI * u);
          }, pts, RULE);
          Eerr[j] = Math.max(Eerr[j], Math.abs(v - g(x0)));
        });
      }
    }
    const E = Eerr[2] < 1e-5 && Eerr[2] < Eerr[1] && Eerr[1] < Eerr[0];
    checks.E = `反演积分和 f(x) 的最大差：R = ${RS.join('、')} 时 ${Eerr.map((v) => v.toExponential(2)).join('、')}`;
    const truth = [A, B, C, D, E];
    const p2 = truth.flatMap((ok, i) => (ok ? [i + 1] : []));

    // p3
    const F3: CFun = (xi) => [0, xi * Math.exp(-xi * xi)];
    const r3 = inverseOn(F3, 1, 12);
    if (Math.abs(r3[1]) > 1e-12) throw new Error('p3 反演的虚部不为 0');
    const cand3 = real((x) => (-x * Math.exp(-x * x / 4)) / (4 * Math.sqrt(Math.PI)));
    const gap3 = closedFormGap(cand3, -40, 40, [], F3);
    if (gap3 > 1e-12) throw new Error(`p3 候选函数的变换差 ${gap3}`);
    if (Math.abs(cand3(1)[0] - r3[0]) > 1e-12) throw new Error('p3 候选函数和反演积分不一致');
    checks.p3_gap = gap3;

    // p4
    const F4: CFun = (xi) => [Math.exp(-xi * xi) * Math.cos(2 * xi), 0];
    const r4 = inverseOn(F4, 2, 12);
    if (Math.abs(r4[1]) > 1e-12) throw new Error('p4 反演的虚部不为 0');
    const g4 = (x: number): number => Math.exp(-x * x / 4) / (2 * Math.sqrt(Math.PI));
    const cand4 = real((x) => (g4(x - 2) + g4(x + 2)) / 2);
    const gap4 = closedFormGap(cand4, -42, 42, [], F4);
    if (gap4 > 1e-12) throw new Error(`p4 候选函数的变换差 ${gap4}`);
    if (Math.abs(cand4(2)[0] - r4[0]) > 1e-12) throw new Error('p4 候选函数和反演积分不一致');
    checks.p4_gap = gap4;

    return {
      p1: { type: 'number', value: s1.limit[0] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: r3[0] },
      p4: { type: 'number', value: r4[0] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
  console.log('\n核对数据：');
  for (const [k, v] of Object.entries(checks)) console.log(`  ${k}: ${typeof v === 'number' ? v.toExponential(2) : v}`);
}
