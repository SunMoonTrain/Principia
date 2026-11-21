// 独立验算 math.complex-analysis.jordan-lemma 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.jordan-lemma.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { circleIntegral, Complex, cexp, cx, I, integrate, integrateC, maxModulusOnPath, arc, polyEval, polyRoots } from './math.complex-analysis._complex.ts';

/**
 * ∫_0^{+∞} g(x) sin x dx，g 光滑、像 1/x 那样衰减（积分只条件收敛）。纯实分析的算法，不用留数：
 * 在 [kπ, (k+1)π]（k = 0, …, N−1）上逐段用 integrate（双指数求积）积，尾项 ∫_{Nπ}^{+∞} 用两次分部积分得到的
 * 渐近式 (−1)^N (g(A) − g″(A))，A = Nπ（g″ 用中心差商；余项是 ∫ g⁗ sin 那一项，A 几千时小于 10⁻¹⁶）。
 */
function sinIntegralHalfLine(g: (x: number) => number, N: number): number {
  let sum = 0;
  let comp = 0;
  for (let k = 0; k < N; k++) {
    const piece = integrate((x) => g(x) * Math.sin(x), k * Math.PI, (k + 1) * Math.PI);
    const y = piece - comp;
    const t = sum + y;
    comp = t - sum - y;
    sum = t;
  }
  const A = N * Math.PI;
  const h = 1;
  const g2 = (g(A + h) - 2 * g(A) + g(A - h)) / (h * h);
  return sum + (N % 2 === 0 ? 1 : -1) * (g(A) - g2);
}

/** 取两个 N 各算一次，要求一致到 10⁻⁹，返回 N 大的那个值。 */
function sinIntegralChecked(g: (x: number) => number, label: string): number {
  const a = sinIntegralHalfLine(g, 1000);
  const b = sinIntegralHalfLine(g, 2000);
  if (Math.abs(a - b) > 1e-9 * Math.max(1, Math.abs(b))) throw new Error(`${label}：N = 1000、2000 两次结果不一致（${a}，${b}）`);
  return b;
}

/**
 * 另一条路（核对用）：∫_{−∞}^{+∞} (P/Q)(x) e^{ix} dx = 2πi·∑_{上半平面} Res((P/Q)e^{iz})，
 * 留数用绕每个极点的小圆周积分（circleIntegral）求，不用公式；极点用 polyRoots 求出、把挨得很近的（重根）并成一个。
 */
function residueSumUpper(P: number[], Q: number[]): Complex {
  const roots = polyRoots(Q).filter((z) => z.im > 1e-6);
  const centers: Complex[] = [];
  for (const z of roots) if (!centers.some((c) => c.sub(z).abs() < 1e-4)) centers.push(z);
  const all = polyRoots(Q);
  const F = (z: Complex) => polyEval(P, z).div(polyEval(Q, z)).mul(cexp(I.mul(z)));
  let total = cx(0);
  for (const c of centers) {
    const others = all.filter((z) => z.sub(c).abs() > 1e-4).map((z) => z.sub(c).abs());
    const r = 0.4 * Math.min(1, ...others);
    total = total.add(circleIntegral(F, c, r, 2048));
  }
  return total; // 已经是 2πi·∑Res
}

/** p2 用：(P/Q)e^{iλz} 在上半圆周 C_R 上的积分，t 从 0 到 π 分成 400 段，每段用 integrateC。 */
function arcIntegral(P: number[], Q: number[], lambda: number, R: number): Complex {
  const g = (t: number) => {
    const z = Complex.fromPolar(R, t);
    return polyEval(P, z).div(polyEval(Q, z)).mul(cexp(I.mul(z).scale(lambda))).mul(I.mul(z));
  };
  let s = cx(0);
  const M = 400;
  for (let k = 0; k < M; k++) s = s.add(integrateC(g, (k * Math.PI) / M, ((k + 1) * Math.PI) / M));
  return s;
}

/** ML 不等式给 C_R 上积分的界：长度 πR 乘 |P/Q| 在 C_R 上的最大值（|e^{iλz}| ≤ 1 那一部分按 1 算）。 */
function mlBound(P: number[], Q: number[], R: number): number {
  const m = maxModulusOnPath((z) => polyEval(P, z).div(polyEval(Q, z)), arc(0, R, 0, Math.PI), 4000).value;
  return Math.PI * R * m;
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.jordan-lemma',
  notes: {
    p1: '被积函数是偶函数，算 2∫_0^∞ x sin x/(x²+4) dx：[kπ,(k+1)π] 上逐段双指数求积到 Nπ（N = 1000、2000 两次核对），尾项用分部积分的渐近式 (−1)^N(g − g″)；再用「2πi·上半平面留数和」的虚部（留数用小圆周积分求）核对。',
    p2: '对每个选项：Q 没有实根（题设可用）；ML 界 πR·max_{C_R}|P/Q| 在 R = 10²、10³、10⁴ 处的值，趋于 0 的只用 ML 就够，趋于非零常数的（分母只比分子高 1 次）要若尔当引理；另外直接积 C_R 上的 (P/Q)e^{iλz}（R = 20、40、80），确认四个都趋于 0。',
    p3: '偶函数，2∫_0^∞ x³ sin x/(x⁴+1) dx，同 p1 的实积分算法；留数和（e^{iπ/4}、e^{3iπ/4} 两个单极点，小圆周积分）核对。',
    p4: '直接算 ∫_0^∞ x³ sin x/(x²+1)² dx，同 p1 的实积分算法；再用 i 处二阶极点的小圆周积分得 ∫_{−∞}^{∞} 的值，取一半（被积函数是偶函数）核对。',
  },
  compute() {
    // p1
    const g1 = (x: number) => x / (x * x + 4);
    const p1 = 2 * sinIntegralChecked(g1, 'p1');
    const p1Res = residueSumUpper([1, 0], [1, 0, 4]).im;
    if (Math.abs(p1 - p1Res) > 1e-8) throw new Error(`p1：实积分 ${p1} 和留数 ${p1Res} 对不上`);

    // p2
    const opts: { P: number[]; Q: number[]; lambda: number }[] = [
      { P: [1, 0], Q: [1, 0, 2], lambda: 3 }, // A  x cos3x/(x²+2)
      { P: [1, 0, 0, 0], Q: [1, 0, 0, 0, 5], lambda: 2 }, // B  x³ sin2x/(x⁴+5)
      { P: [1], Q: [1, 1, 1], lambda: 1 }, // C  sin x/(x²+x+1)
      { P: [1, 0], Q: [1, 0, 0, 0, 1], lambda: 1 }, // D  x e^{ix}/(x⁴+1)
    ];
    const p2: number[] = [];
    opts.forEach((o, i) => {
      if (polyRoots(o.Q).some((z) => Math.abs(z.im) < 1e-9)) throw new Error(`p2 选项 ${i + 1}：分母有实根，题设不成立`);
      const bounds = [1e2, 1e3, 1e4].map((R) => mlBound(o.P, o.Q, R));
      const arcs = [20, 40, 80].map((R) => arcIntegral(o.P, o.Q, o.lambda, R).abs());
      if (!(arcs[2] < arcs[0] && arcs[2] < 0.2)) throw new Error(`p2 选项 ${i + 1}：C_R 上的积分看不出趋于 0（${arcs.join('，')}）`);
      const mlEnough = bounds[2] < 1e-2 && bounds[2] < bounds[1] && bounds[1] < bounds[0];
      // 不够的那几个，ML 界要停在一个正数上（这里是 π），而不是还在慢慢变小
      if (!mlEnough && !(Math.abs(bounds[2] - bounds[1]) < 1e-3 && bounds[2] > 1)) throw new Error(`p2 选项 ${i + 1}：ML 界既不趋于 0 也不稳定（${bounds.join('，')}）`);
      if (!mlEnough) p2.push(i + 1);
    });

    // p3
    const g3 = (x: number) => (x ** 3) / (x ** 4 + 1);
    const p3 = 2 * sinIntegralChecked(g3, 'p3');
    const p3Res = residueSumUpper([1, 0, 0, 0], [1, 0, 0, 0, 1]).im;
    if (Math.abs(p3 - p3Res) > 1e-8) throw new Error(`p3：实积分 ${p3} 和留数 ${p3Res} 对不上`);

    // p4
    const g4 = (x: number) => (x ** 3) / (x * x + 1) ** 2;
    const p4 = sinIntegralChecked(g4, 'p4');
    const p4Res = residueSumUpper([1, 0, 0, 0], [1, 0, 2, 0, 1]).im / 2;
    if (Math.abs(p4 - p4Res) > 1e-8) throw new Error(`p4：实积分 ${p4} 和留数 ${p4Res} 对不上`);

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
