// 独立验算 math.analysis.exp-log-construction 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.exp-log-construction.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { richardson } from './math.analysis._numeric.ts';

/** 按幂级数定义的指数函数 Σ xⁿ/n!，加到项小于 10⁻¹⁸ 倍的部分和为止。 */
function E(x: number): number {
  let s = 1;
  let t = 1;
  for (let n = 1; n < 400; n++) {
    t *= x / n;
    s += t;
    if (Math.abs(t) < 1e-18 * Math.abs(s)) break;
  }
  return s;
}

/** E 的反函数（只用于正数）：E 严格递增，二分 200 次。 */
function L(y: number): number {
  let lo = -50;
  let hi = 50;
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    if (E(m) < y) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

export const verification: Verification = {
  lesson: 'math.analysis.exp-log-construction',
  notes: {
    p1: '指数函数按幂级数 Σxⁿ/n! 算；E 严格递增，二分求出 E(a) = 3 的 a，再算 E(−a/2)。',
    p2: 'xˣ = E(x·L(x))，E 是幂级数，L 是 E 的反函数（二分求）；在 x = E(1) 处用对称差商对 h = 1/(100·2ⁱ) 做 Richardson 外推。',
    p3: 'e − S_N 用余项 Σ_{n>N} 1/n! 直接加（免得两个很接近的数相减）；N 从 1 往上找第一个余项小于 10⁻⁶ 的。',
    p4: '直接把 1/(2n)! 加到第 30 项（余下的小于 10⁻⁸⁰）。',
  },
  compute() {
    // p1
    const a = L(3);
    const p1 = E(-a / 2);

    // p2：xˣ 在 x = e 处的导数
    const e = E(1);
    const f = (x: number): number => E(x * L(x));
    const p2 = richardson((k) => (f(e + 1 / k) - f(e - 1 / k)) * (k / 2), 100, 4);

    // p3：最小的 N 使 e − S_N < 10⁻⁶
    const tail = (N: number): number => {
      let s = 0;
      let t = 1;
      for (let n = 1; n <= N; n++) t /= n;
      for (let n = N + 1; n <= N + 40; n++) {
        t /= n;
        s += t;
      }
      return s;
    };
    let N3 = 1;
    while (!(tail(N3) < 1e-6)) N3++;

    // p4：Σ 1/(2n)!
    let p4 = 0;
    let fact = 1;
    for (let n = 0; n <= 30; n++) {
      if (n > 0) fact *= 2 * n * (2 * n - 1);
      p4 += 1 / fact;
    }

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: N3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
