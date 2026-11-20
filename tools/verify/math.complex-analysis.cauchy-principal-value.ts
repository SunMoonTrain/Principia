// 独立验算 math.complex-analysis.cauchy-principal-value 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 主路一律是实变量（或沿题给曲线）的直接数值计算，按柯西主值的定义「两侧对称地挖去 ε、令 ε → 0⁺」做；
// 留数（绕奇点的小圆周积分除以 2πi，不用公式）只当另一条路核对。
// 单独运行：npx tsx tools/verify/math.complex-analysis.cauchy-principal-value.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { arc, circleIntegral, Complex, cexp, contourIntegral, cx, extrapolateC, I, integrate } from './math.complex-analysis._complex.ts';

/** [lo, hi]（0 < lo < hi）上的积分：按 lo·10^k 分成几何级数的几段，每段用双指数求积，lo 很小时也不丢精度。 */
function integrateGeometric(f: (t: number) => number, lo: number, hi: number): number {
  let s = 0;
  let a = lo;
  while (a < hi) {
    const b = Math.min(a * 10, hi);
    s += integrate(f, a, b);
    a = b;
  }
  return s;
}

/**
 * 按定义算主值的截断：∫_a^{c−ε} f + ∫_{c+ε}^b f。两侧对称的那一段折成 ∫_ε^m (f(c+t) + f(c−t)) dt（m = min(c−a, b−c)），
 * 和定义逐字相同，只是先把两侧对称的点配对相加，免得两边各自很大时相减丢掉有效数字；剩下不对称的一截照常积。
 */
function truncatedPV(f: (x: number) => number, a: number, b: number, c: number, eps: number): number {
  const m = Math.min(c - a, b - c);
  let s = integrateGeometric((t) => f(c + t) + f(c - t), eps, m);
  if (b - c > m) s += integrate(f, c + m, b);
  if (c - a > m) s += integrate(f, a, c - m);
  return s;
}

/** 不配对、两侧分开积的截断（只在 ε 不太小时用，核对 truncatedPV 的配对没有改变意思）。 */
function truncatedRaw(f: (x: number) => number, a: number, b: number, c: number, eps: number): number {
  return integrateGeometric((t) => f(c - t), eps, c - a) + integrateGeometric((t) => f(c + t), eps, b - c);
}

/**
 * ∫_0^{+∞} g(u) sin u du（g 光滑地衰减，g(u) sin u 在 0 附近有界）：[kπ, (k+1)π] 上逐段双指数求积到 Nπ，
 * 尾项用两次分部积分的渐近式 (−1)^N (g(A) − g″(A))，A = Nπ（g″ 用中心差商）。
 */
function sinHalfLine(g: (u: number) => number, N: number): number {
  let sum = 0;
  let comp = 0;
  for (let k = 0; k < N; k++) {
    const piece = integrate((u) => g(u) * Math.sin(u), k * Math.PI, (k + 1) * Math.PI);
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

/** ∫_{x0}^{+∞} g(x) cos x dx，x0 ≤ π：[x0, π] 和 [kπ, (k+1)π] 逐段积到 Nπ，尾项 (−1)^N (−g′(A) + g‴(A))（sin Nπ = 0）。 */
function cosTail(g: (x: number) => number, x0: number, N: number): number {
  let sum = integrate((x) => g(x) * Math.cos(x), x0, Math.PI);
  for (let k = 1; k < N; k++) sum += integrate((x) => g(x) * Math.cos(x), k * Math.PI, (k + 1) * Math.PI);
  const A = N * Math.PI;
  const h = 0.5;
  const g1 = (g(A + h) - g(A - h)) / (2 * h);
  const g3 = (g(A + 2 * h) - 2 * g(A + h) + 2 * g(A - h) - g(A - 2 * h)) / (2 * h ** 3);
  return sum + (N % 2 === 0 ? 1 : -1) * (-g1 + g3);
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.cauchy-principal-value',
  notes: {
    p1: '按定义沿题给曲线积：γ_ε 取 z = 1 + εe^{it}，t 从 π 减到 0（起点 1 − ε、经过上方 1 + iε、终点 1 + ε，确是顺时针），contourIntegral 求 ∫(z+3)/(z²−1)dz，ε = 1/32·2^{−k} 上理查森外推到 ε → 0⁺；另用 |z−1| = 0.5 的整圆周积分除以 2 再取负（顺时针半圈）核对。',
    p2: '四个选项都按定义算截断 I(ε) = ∫_a^{−ε} + ∫_ε^b（奇点在 0），两侧对称的部分配对成 ∫_ε^m (f(t)+f(−t))dt，ε = 10⁻³…10⁻⁸ 看是否稳定；ε = 10⁻²、10⁻³ 时再不配对地两侧分开积核对。另看配对和 s(t) = f(t)+f(−t)：有界则主值存在，t·s(t) 趋于非零常数（不变号）则不存在，两种判法要一致。例子：A cos x/x² 在 [−1,1]（s = 2cos t/t²）；B 1/x³ 在 [−1,2]（s ≡ 0，剩 ∫_1^2）；C 1/|x| 在 [−1,1]（s = 2/t）；D e^x/x 在 [−1,1]（s = 2sinh t/t）。',
    p3: '偶函数，主值 = 2[∫_0^{1/2} f + ∫_0^{1/2}(f(1+t)+f(1−t))dt + ∫_{3/2}^{+∞} f]，配对和照 x² − 1 = (x−1)(x+1) 写成 (cos(1+t)/(2+t) − cos(1−t)/(2−t))/t 免得 t 很小时丢有效数字（在 t = 0.1、0.25、0.4 处和直接相加的写法核对）；最后一段在 [kπ,(k+1)π] 上逐段积到 Nπ（N = 1000、2000 两次核对）加分部积分的尾项；再用「e^{iz}/(z²−1) 在 ±1 处的小圆周积分之和的一半」（两个半圈）的实部核对。',
    p4: '换元 u = 2x 得 ∫_0^∞ 4 sin u/(u(u²+4)) du，[kπ,(k+1)π] 上逐段双指数求积到 Nπ（N = 1000、2000）加尾项 (−1)^N(g − g″)；再用 e^{2iz}/(z(z²+1)) 在 i 处整圈、在 0 处半圈的小圆周积分（主值 = 2πi·Res_i + πi·Res_0）取虚部的一半核对。',
  },
  compute() {
    // p1：沿题给的顺时针上半圆周按定义积，再外推 ε → 0⁺。
    const f1 = (z: Complex) => z.add(3).div(z.mul(z).sub(1));
    const g1 = (eps: number) => {
      const r = contourIntegral(f1, arc(1, eps, Math.PI, 0));
      if (!r.converged) throw new Error(`p1：ε = ${eps} 时曲线积分没有收敛`);
      return r.value;
    };
    const path = arc(1, 0.01, Math.PI, 0);
    const start = path.z(path.t0);
    const mid = path.z((path.t0 + path.t1) / 2);
    const end = path.z(path.t1);
    if (!(start.isClose(cx(0.99)) && end.isClose(cx(1.01)) && mid.im > 0)) throw new Error('p1：曲线的起点、终点或经过的位置和题意不符');
    const p1lim = extrapolateC(g1, 1 / 32, 6);
    if (!p1lim.converged) throw new Error('p1：ε → 0⁺ 的外推没有收敛');
    const p1 = p1lim.value;
    const p1check = circleIntegral(f1, 1, 0.5).scale(-0.5);
    if (!p1.isClose(p1check, 1e-8)) throw new Error(`p1：直接积分 ${p1} 和半圈留数 ${p1check} 对不上`);
    console.log(`    p1：ε = 0.1、0.01 时 ${g1(0.1).toString(8)}，${g1(0.01).toString(8)}；外推 ${p1.toString(10)}`);

    // p2：按定义看截断是否稳定。
    const opts: { name: string; f: (x: number) => number; a: number; b: number }[] = [
      { name: 'A', f: (x) => Math.cos(x) / (x * x), a: -1, b: 1 },
      { name: 'B', f: (x) => 1 / (x * x * x), a: -1, b: 2 },
      { name: 'C', f: (x) => 1 / Math.abs(x), a: -1, b: 1 },
      { name: 'D', f: (x) => Math.exp(x) / x, a: -1, b: 1 },
    ];
    const p2: number[] = [];
    opts.forEach((o, i) => {
      const epsList = [1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8];
      const vals = epsList.map((e) => truncatedPV(o.f, o.a, o.b, 0, e));
      for (const e of [1e-2, 1e-3]) {
        const folded = truncatedPV(o.f, o.a, o.b, 0, e);
        const raw = truncatedRaw(o.f, o.a, o.b, 0, e);
        if (Math.abs(folded - raw) > 1e-8 * Math.max(1, Math.abs(raw))) throw new Error(`p2 ${o.name}：ε = ${e} 时配对与不配对的截断不一致（${folded}，${raw}）`);
      }
      const diffs = vals.slice(1).map((v, k) => Math.abs(v - vals[k]));
      const numericExists = diffs[diffs.length - 1] < 1e-6 && diffs[diffs.length - 1] <= diffs[0] + 1e-12;
      const s = (t: number) => o.f(t) + o.f(-t);
      const sVals = [1e-2, 1e-4, 1e-6, 1e-8].map(s);
      const bounded = sVals.every((v) => Math.abs(v) < 10);
      const tsVals = [1e-4, 1e-6, 1e-8].map((t) => t * s(t));
      const blowsUp = tsVals.every((v) => v > 0.5) || tsVals.every((v) => v < -0.5);
      if (bounded === blowsUp) throw new Error(`p2 ${o.name}：s(t) 的两种判法没有给出结论（${sVals.join('，')}；${tsVals.join('，')}）`);
      if (bounded !== numericExists) throw new Error(`p2 ${o.name}：截断的数值和 s(t) 的判法不一致`);
      console.log(`    p2 ${o.name}：I(ε) 在 ε = 10⁻³…10⁻⁸ 为 ${vals.map((v) => v.toPrecision(8)).join('，')}；s(t) ${sVals.map((v) => v.toPrecision(4)).join('，')} → ${numericExists ? '存在' : '不存在'}`);
      if (numericExists) p2.push(i + 1);
    });

    // p3：偶函数，配对挖去 x = 1 两侧。配对和写成 (cos(1+t)/(2+t) − cos(1−t)/(2−t))/t，就是把 x² − 1 拆成 (x−1)(x+1)、
    // x − 1 = ±t 直接代进去：直接算 (1+t)² − 1 在 t 很小时丢有效数字，双指数求积在端点附近取的点又极密，会积错。
    const f3 = (x: number) => Math.cos(x) / (x * x - 1);
    const fold3 = (t: number) => (Math.cos(1 + t) / (2 + t) - Math.cos(1 - t) / (2 - t)) / t;
    for (const t of [0.1, 0.25, 0.4]) {
      if (Math.abs(fold3(t) - (f3(1 + t) + f3(1 - t))) > 1e-12) throw new Error(`p3：配对和的两种写法在 t = ${t} 处不一致`);
    }
    const p3half = (N: number) => integrate(f3, 0, 0.5) + integrate(fold3, 0, 0.5) + cosTail((x) => 1 / (x * x - 1), 1.5, N);
    const p3a = 2 * p3half(1000);
    const p3b = 2 * p3half(2000);
    if (Math.abs(p3a - p3b) > 1e-9) throw new Error(`p3：N = 1000、2000 两次结果不一致（${p3a}，${p3b}）`);
    const p3 = p3b;
    const F3 = (z: Complex) => cexp(I.mul(z)).div(z.mul(z).sub(1));
    const p3res = circleIntegral(F3, 1, 0.5).add(circleIntegral(F3, -1, 0.5)).scale(0.5);
    if (Math.abs(p3 - p3res.re) > 1e-8 || Math.abs(p3res.im) > 1e-10) throw new Error(`p3：实积分 ${p3} 和半圈留数 ${p3res} 对不上`);
    console.log(`    p3 = ${p3}（半圈留数 ${p3res.toString(10)}；−π sin 1 = ${-Math.PI * Math.sin(1)}）`);

    // p4：u = 2x。
    const g4 = (u: number) => 4 / (u * (u * u + 4));
    const p4a = sinHalfLine(g4, 1000);
    const p4b = sinHalfLine(g4, 2000);
    if (Math.abs(p4a - p4b) > 1e-9) throw new Error(`p4：N = 1000、2000 两次结果不一致（${p4a}，${p4b}）`);
    const p4 = p4b;
    const direct = integrate((x) => Math.sin(2 * x) / (x * (x * x + 1)), 0, 3);
    const viaU = integrate((u) => g4(u) * Math.sin(u), 0, 6);
    if (Math.abs(direct - viaU) > 1e-10) throw new Error(`p4：换元前后 [0,3] 上的积分不一致（${direct}，${viaU}）`);
    const F4 = (z: Complex) => cexp(I.mul(z).scale(2)).div(z.mul(z.mul(z).add(1)));
    const pv4 = circleIntegral(F4, cx(0, 1), 0.5).add(circleIntegral(F4, 0, 0.5).scale(0.5));
    const p4res = pv4.im / 2;
    if (Math.abs(p4 - p4res) > 1e-8 || Math.abs(pv4.re) > 1e-10) throw new Error(`p4：实积分 ${p4} 和留数 ${p4res} 对不上（主值 ${pv4}）`);
    console.log(`    p4 = ${p4}（留数 ${p4res}；π(1 − e^{−2})/2 = ${(Math.PI * (1 - Math.exp(-2))) / 2}）`);

    return {
      p1: { type: 'tuple', value: [p1.re, p1.im] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
