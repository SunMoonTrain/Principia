// 独立验算 math.analysis.rearrangement 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.rearrangement.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { converges } from './math.analysis._numeric.ts';

/**
 * 按「先取 p 个正项、再取 q 个负项」反复重排 Σ a(n)（正项、负项各按原来的顺序取），
 * 返回第 1 到第 count 段末尾的部分和（下标 0 不用）。positive(n) 说第 n 项是不是正项
 * （单独给出，免得很小的项算成 0 以后分不出正负）。
 */
function blockSums(a: (n: number) => number, positive: (n: number) => boolean, p: number, q: number, count: number): Float64Array {
  const out = new Float64Array(count + 1);
  let nextPos = 1;
  let nextNeg = 1;
  const takePos = (): number => {
    while (!positive(nextPos)) nextPos++;
    return a(nextPos++);
  };
  const takeNeg = (): number => {
    while (positive(nextNeg)) nextNeg++;
    return a(nextNeg++);
  };
  let s = 0;
  for (let k = 1; k <= count; k++) {
    for (let i = 0; i < p; i++) s += takePos();
    for (let i = 0; i < q; i++) s += takeNeg();
    out[k] = s;
  }
  return out;
}

export const verification: Verification = {
  lesson: 'math.analysis.rearrangement',
  notes: {
    p1: '按「两正一负」的规则从正项 1, 1/3, 1/5, … 和负项 −1/2, −1/4, … 里依次取，前 6 项逐项相加。',
    p2:
      '在两种重排上找反例：「两正一负」「一正两负」（正项、负项各按原来的顺序取）。各算 2×10⁶ 段，段末的部分和按批次 1 的判据看收不收敛' +
      '（项趋于 0，段末部分和收敛就是整个重排收敛），收敛时和原级数的和（第 2×10⁶、2×10⁶+1 个部分和的平均）比，差超过 10⁻⁴ 就算和变了。' +
      '两种重排都不改变和的才选；这只是在两个例子上没找到反例，B、C 绝对收敛、和不变由定理保证，另外手推过。',
    p3: '照题目说的办法模拟：正项一直取到部分和第一次大于 1.3，负项一直取到第一次小于 1.3，记下每一段正项的个数。',
    p4: 'cₙ = Σ_{k=0}^{n} aₖ b_{n−k} 直接算；Σcₙ 加到 n = 200（cₙ 按 (1/2)ⁿ 的速度变小，余下的可以忽略）。',
  },
  compute() {
    // p1：交错调和级数「两正一负」，前 6 项
    const pos = (k: number): number => 1 / (2 * k - 1);
    const neg = (k: number): number => -1 / (2 * k);
    const seq: number[] = [];
    let ip = 1;
    let ineg = 1;
    while (seq.length < 6) {
      seq.push(pos(ip++));
      if (seq.length < 6) seq.push(pos(ip++));
      if (seq.length < 6) seq.push(neg(ineg++));
    }
    const T6 = seq.reduce((s, v) => s + v, 0);

    // p2：哪些级数不论怎样重排和都不变
    const candidates = [
      (n: number) => (-1) ** (n + 1) / (2 * n - 1),
      (n: number) => (-1) ** (n + 1) / 2 ** n,
      (n: number) => (-1) ** (n + 1) / n ** 3,
      (n: number) => (-1) ** (n + 1) / Math.sqrt(n),
    ];
    const p2: number[] = [];
    candidates.forEach((a, i) => {
      let s = 0;
      let previous = 0;
      const N = 2_000_000;
      for (let n = 1; n <= N + 1; n++) {
        previous = s;
        s += a(n);
      }
      const original = (s + previous) / 2;
      const keeps = [
        [2, 1],
        [1, 2],
      ].every(([p, q]) => {
        // 四个级数都是奇数项为正、偶数项为负
        const T = blockSums(a, (n) => n % 2 === 1, p, q, 2_000_001);
        return converges(T) && Math.abs(T[T.length - 1] - original) < 1e-4;
      });
      if (keeps) p2.push(i + 1);
    });

    // p3：重排成和为 1.3
    const target = 1.3;
    let s = 0;
    let nextPos = 1;
    let nextNeg = 1;
    const runs: number[] = [];
    while (runs.length < 2) {
      let count = 0;
      while (!(s > target)) {
        s += pos(nextPos++);
        count++;
      }
      runs.push(count);
      while (!(s < target)) s += neg(nextNeg++);
    }

    // p4：Σ 1/2ⁿ 与 Σ 1/3ⁿ 的柯西乘积
    const a = (k: number): number => 1 / 2 ** k;
    const b = (k: number): number => 1 / 3 ** k;
    const c = (n: number): number => {
      let t = 0;
      for (let k = 0; k <= n; k++) t += a(k) * b(n - k);
      return t;
    };
    let total = 0;
    for (let n = 0; n <= 200; n++) total += c(n);

    return {
      p1: { type: 'number', value: T6 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: runs },
      p4: { type: 'tuple', value: [c(2), total] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
