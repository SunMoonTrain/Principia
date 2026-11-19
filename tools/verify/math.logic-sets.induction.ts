// 独立验算 math.logic-sets.induction 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.induction.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** 在 1..M 的正整数上检验（M 取得比题里出现的数都大得多）。 */
const M = 2000;

/**
 * 一组条件 =「哪些数直接成立」加上「由 P(k) 推出哪些 P(m)」。
 * 满足这组条件的最小集合 S（从直接成立的数出发，沿推出关系反复扩充，直到不再变）本身就是一个满足全部条件的 P：
 * S 是 {1..M} 的全部时，任何满足条件的 P 都包含 S（每一步扩充都是条件逼出来的），条件就保证了 P 处处成立；
 * S 漏了某个数时，「n ∈ S」就是一个反例。推出关系只在 1..M 里看，往下推的（选项 B）也照样算。
 */
function leastClosedSet(base: number[], step: (k: number) => number[]): Set<number> {
  const s = new Set<number>(base.filter((n) => n >= 1 && n <= M));
  let changed = true;
  while (changed) {
    changed = false;
    for (let k = 1; k <= M; k++) {
      if (!s.has(k)) continue;
      for (const m of step(k)) {
        if (m >= 1 && m <= M && !s.has(m)) {
          s.add(m);
          changed = true;
        }
      }
    }
  }
  return s;
}

/** 检查一个具体的谓词 P 是否满足「base 都成立、对每个 k 由 P(k) 推出 step(k) 里的 P(m)」。 */
function satisfies(p: (n: number) => boolean, base: number[], step: (k: number) => number[]): boolean {
  if (!base.every((n) => p(n))) return false;
  for (let k = 1; k <= M; k++) {
    if (!p(k)) continue;
    for (const m of step(k)) if (m >= 1 && m <= M && !p(m)) return false;
  }
  return true;
}

/** 有理数 a/b（BigInt），约分。 */
function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
}

export const verification: Verification = {
  lesson: 'math.logic-sets.induction',
  notes: {
    p1:
      '对每组条件，在 1..2000 上从直接成立的数出发、沿「由 P(k) 推出」的关系反复扩充，求满足条件的最小集合 S；S 是全部 1..2000 才算能保证。' +
      '另把三个反例代进去核对确实满足条件却不处处成立：A 取 P(n)=「n≥100」，B 取 P(n)=「n=1」（由 P(k+1) 推 P(k) 时前件对 k≥1 都假），D 取 P(n)=「n 是奇数」。',
    p2: '用 BigInt 分数逐项精确相加 1/(k(k+1))，k = 1..99，约分后化成小数。',
    p3: '用 BigInt 对 n = 1..2000 比较 3ⁿ 和 n³，找出不满足的最大 n（得 3，因为 27 = 27），N 取它加 1；再数值核对 n ≥ 4 时 (1+1/n)³ ≤ (5/4)³ < 3，保证 2000 以后也成立。',
    p4: '对 1..2000 做动态规划：n 能写成 3a+5b（a、b ≥ 0 不全为 0）当且仅当 n ∈ {3,5} 或 n−3、n−5 能写；取不能写的最大数，并确认它后面连续 3 个数都能写（此后加 3 就都能写）。',
  },
  compute() {
    // p1：五组条件
    type Option = { base: number[]; step: (k: number) => number[]; counter?: (n: number) => boolean };
    const options: Option[] = [
      { base: [100], step: (k) => [k + 1], counter: (n) => n >= 100 }, // A
      { base: [1], step: (k) => [k - 1].filter((m) => m >= 1), counter: (n) => n === 1 }, // B：由 P(k+1) 推 P(k)，即从 m=k+1 推到 m-1
      { base: [1], step: (k) => [2 * k, 2 * k + 1] }, // C
      { base: [1], step: (k) => [k + 2], counter: (n) => n % 2 === 1 }, // D
      { base: [1, 2], step: (k) => [k + 2] }, // E
    ];
    const p1: number[] = [];
    options.forEach((o, i) => {
      const s = leastClosedSet(o.base, o.step);
      const guaranteed = s.size === M;
      if (guaranteed) p1.push(i + 1);
      if (o.counter) {
        if (guaranteed) throw new Error(`p1 选项 ${i + 1} 写了反例，可最小集合却是全部`);
        if (!satisfies(o.counter, o.base, o.step)) throw new Error(`p1 选项 ${i + 1} 的反例不满足条件`);
        if ([...Array(M).keys()].every((j) => o.counter!(j + 1))) throw new Error(`p1 选项 ${i + 1} 的反例处处成立`);
      }
    });

    // p2：Σ 1/(k(k+1))，k = 1..99
    let num = 0n;
    let den = 1n;
    for (let k = 1n; k <= 99n; k++) {
      const d = k * (k + 1n);
      num = num * d + den;
      den = den * d;
      const g = gcd(num, den);
      num /= g;
      den /= g;
    }
    const p2 = Number(num) / Number(den);

    // p3：最小的 N，使 n ≥ N 时都有 3ⁿ > n³
    let lastFail = 0;
    let pow3 = 1n;
    for (let n = 1; n <= M; n++) {
      pow3 *= 3n;
      const cube = BigInt(n) ** 3n;
      if (!(pow3 > cube)) lastFail = n;
    }
    for (let n = 4; n <= M; n++) if (!((1 + 1 / n) ** 3 < 3)) throw new Error('p3 的递推比值检查失败');
    const p3 = lastFail + 1;

    // p4：不能写成若干个 3 与若干个 5 之和（个数不全为 0）的最大正整数
    const can: boolean[] = new Array(M + 1).fill(false);
    for (let n = 1; n <= M; n++) {
      can[n] = n === 3 || n === 5 || (n > 3 && can[n - 3]) || (n > 5 && can[n - 5]);
    }
    let p4 = 0;
    for (let n = 1; n <= M; n++) if (!can[n]) p4 = n;
    if (!(can[p4 + 1] && can[p4 + 2] && can[p4 + 3])) throw new Error('p4 最大不能写的数之后没有连续三个能写的');

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
