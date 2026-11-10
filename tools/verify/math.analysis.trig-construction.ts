// 独立验算 math.analysis.trig-construction 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.trig-construction.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { goldenMax, grid } from './math.analysis._numeric.ts';

/** 正弦、余弦的幂级数系数（前 count 项，下标是 x 的次数）。 */
function sinCoefficients(count: number): number[] {
  const c = new Array<number>(count).fill(0);
  let t = 1;
  for (let n = 1; n < count; n++) {
    t /= n;
    if (n % 2 === 1) c[n] = ((n - 1) / 2) % 2 === 0 ? t : -t;
  }
  return c;
}
function cosCoefficients(count: number): number[] {
  const c = new Array<number>(count).fill(0);
  let t = 1;
  c[0] = 1;
  for (let n = 1; n < count; n++) {
    t /= n;
    if (n % 2 === 0) c[n] = (n / 2) % 2 === 0 ? t : -t;
  }
  return c;
}
const evaluate = (c: number[], x: number): number => c.reduceRight((acc, a) => acc * x + a, 0);
const S = (x: number): number => evaluate(sinCoefficients(60), x);
const C = (x: number): number => evaluate(cosCoefficients(60), x);

export const verification: Verification = {
  lesson: 'math.analysis.trig-construction',
  notes: {
    p1: '取正弦、余弦幂级数的前 20 个系数，按柯西乘积相乘，读出 x³ 的系数。',
    p2: '正弦、余弦都按幂级数算。正弦在 [0, 1.5] 上递增，二分求出 S(a) = 3/5、S(b) = 5/13 的 a、b，核对 C(a) = 4/5、C(b) = 12/13，再算 C(a + b)。',
    p3: '在 [0, 2π]（周期取 2π 是题外常识，这里只用来定取样范围）上取 2×10⁴ 个点，再在最大的点附近用黄金分割细找。',
    p4: '直接把级数加到第 30 项（余下的可以忽略）。',
  },
  compute() {
    // p1：sin x cos x 的 x³ 系数
    const s = sinCoefficients(20);
    const c = cosCoefficients(20);
    let p1 = 0;
    for (let k = 0; k <= 3; k++) p1 += s[k] * c[3 - k];

    // p2
    const solveS = (target: number): number => {
      let lo = 0;
      let hi = 1.5;
      for (let k = 0; k < 200; k++) {
        const m = (lo + hi) / 2;
        if (S(m) < target) lo = m;
        else hi = m;
      }
      return (lo + hi) / 2;
    };
    const a = solveS(3 / 5);
    const b = solveS(5 / 13);
    if (Math.abs(C(a) - 4 / 5) > 1e-12 || Math.abs(C(b) - 12 / 13) > 1e-12) throw new Error('p2：余弦和题目给的不一致');
    const p2 = C(a + b);

    // p3：2 sin x − 3 cos x 的最大值
    const f = (x: number): number => 2 * S(x) - 3 * C(x);
    const xs = grid(0, 2 * Math.PI, 20_000);
    let best = 0;
    for (let i = 1; i < xs.length; i++) if (f(xs[i]) > f(xs[best])) best = i;
    const p3 = f(goldenMax(f, xs[Math.max(0, best - 1)], xs[Math.min(xs.length - 1, best + 1)]));

    // p4：Σ (−1)ⁿ π²ⁿ / (4ⁿ (2n + 1)!)
    let p4 = 0;
    let t = 1; // (−1)ⁿ (π/2)²ⁿ / (2n + 1)!
    for (let n = 0; n <= 30; n++) {
      if (n > 0) t *= -(Math.PI * Math.PI) / 4 / ((2 * n) * (2 * n + 1));
      p4 += t;
    }

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
