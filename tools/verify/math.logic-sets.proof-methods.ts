// 独立验算 math.logic-sets.proof-methods 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.proof-methods.ts

import { fileURLToPath } from 'node:url';
import { infOfPredicate, runVerification, type Verification } from './lib.ts';

// ---------- p1：反证法第一步假设什么（判断选项和「原命题的否定」是否逻辑等价） ----------

/** √(n²+1) 在一个「可能世界」里的三种情形：整数、不是整数的有理数、无理数。 */
type Kind = 'int' | 'ratNonInt' | 'irr';
const KINDS: Kind[] = ['int', 'ratNonInt', 'irr'];

/** 定义域取 {1,…,k}，每个 n 的情形任意指定，列出所有可能世界（k = 1…4，共 3+9+27+81 个）。 */
function worlds(maxK: number): Kind[][] {
  const out: Kind[][] = [];
  for (let k = 1; k <= maxK; k++) {
    let layer: Kind[][] = [[]];
    for (let i = 0; i < k; i++) layer = layer.flatMap((w) => KINDS.map((t) => [...w, t]));
    out.push(...layer);
  }
  return out;
}

/** 原命题：对每个 n，√(n²+1) 都不是整数。反证法第一步假设的是它的否定。 */
const original = (w: Kind[]): boolean => w.every((t) => t !== 'int');
const p1Options: ((w: Kind[]) => boolean)[] = [
  (w) => w.some((t) => t === 'int'), // A 存在 n，使 √(n²+1) 是整数
  (w) => w.every((t) => t === 'int'), // B 对每个 n，√(n²+1) 都是整数
  (w) => w.some((t) => t !== 'int'), // C 存在 n，使 √(n²+1) 不是整数
  (w) => w.every((t) => t === 'irr'), // D 对每个 n，√(n²+1) 都是无理数
];

/** 返回和「原命题的否定」在所有可能世界里真值都相同的选项；不同的打印一个反例世界。 */
function p1Solve(): number[] {
  const ws = worlds(4);
  const answer: number[] = [];
  p1Options.forEach((opt, i) => {
    const bad = ws.find((w) => opt(w) !== !original(w));
    if (bad === undefined) answer.push(i + 1);
    else console.log(`    p1 选项 ${'ABCD'[i]} 的反例世界：[${bad.join(', ')}]，原命题的否定为 ${!original(bad)}，选项为 ${opt(bad)}`);
  });
  // 真实世界里原命题确实成立：n² < n²+1 < (n+1)²，n = 1…10⁶ 逐个查 n²+1 不是完全平方数
  for (let n = 1; n <= 1_000_000; n++) {
    const m = n * n + 1;
    const r = Math.round(Math.sqrt(m));
    if (r * r === m) throw new Error(`p1：n = ${n} 时 n²+1 是完全平方数`);
  }
  return answer;
}

// ---------- p2、p3：使「|x−c|<δ ⇒ cond(x)」对所有 x 成立的最大 δ ----------

/**
 * 记 d* = inf{|x−c| : cond(x) 不成立}。|x−c|<δ ≤ d* 的 x 都满足 cond（否则 |x−c| ≥ d*），
 * δ > d* 时在 [c−δ, c+δ] 里有不满足的点，所以最大的 δ 就是 d*（δ = d* 本身取得到）。
 * 数值上：对 r ≥ 0 看 c+r、c−r 两点里有没有不满足的，用 infOfPredicate 求这样的 r 的下确界。
 */
function maxDelta(cond: (x: number) => boolean, c: number, hi: number): number {
  const fails = (r: number): boolean => r >= 0 && (!cond(c + r) || !cond(c - r));
  const d = infOfPredicate(fails, 0, hi, 200_000);
  if (d === null) throw new Error('在 [0, hi] 里没有不满足条件的点');
  return d;
}

/** 核对：δ = d 时在 (c−d, c+d) 里密集取点（含贴近两端的点）都满足；δ = d(1+10⁻⁹) 时找得到不满足的点。 */
function checkDelta(cond: (x: number) => boolean, c: number, d: number, label: string): void {
  const inside: number[] = [];
  for (let i = -100_000; i <= 100_000; i++) inside.push(c + (i / 100_001) * d);
  for (const e of [1e-6, 1e-9, 1e-12]) inside.push(c + d * (1 - e), c - d * (1 - e));
  const bad = inside.find((x) => !cond(x));
  if (bad !== undefined) throw new Error(`${label}：δ = ${d} 时 x = ${bad} 不满足`);
  const big = d * (1 + 1e-9);
  const witness = [c + d * (1 + 1e-10), c - d * (1 + 1e-10)].find((x) => Math.abs(x - c) < big && !cond(x));
  if (witness === undefined) throw new Error(`${label}：δ 比 ${d} 大一点时没找到不满足的点，d 不是最大`);
}

// ---------- p4：30031 的最小素因数 ----------

function smallestPrimeFactor(n: number): number {
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return p;
  return n;
}

export const verification: Verification = {
  lesson: 'math.logic-sets.proof-methods',
  notes: {
    p1:
      '反证法第一步假设原命题的否定。把「√(n²+1) 是整数／不是整数的有理数／无理数」当成每个 n 可以任意指定的情形，' +
      '定义域取 {1,…,k}（k = 1…4，共 120 个可能世界），逐个世界比较各选项和「原命题的否定」的真值，全部相同的才是答案；' +
      '不同的打印第一个反例世界（B 在 [int, ratNonInt] 里为假而否定为真；C、D 在 [int] 里为假而否定为真，在 [irr] 里又为真而否定为假）。' +
      '另查 n = 1…10⁶ 时 n²+1 都不是完全平方数，原命题在真实世界里成立（所以 C、D 在真实世界里也为真，只看真实世界分不出来，要比逻辑形式）。',
    p2:
      'd* = inf{|x| : |5x| ≥ 0.03}，用 r 从 0 到 1 粗扫再二分求出；最大的 δ 就是 d*（理由见 maxDelta 的注释）。' +
      '再核对 δ = d* 时 (−d*, d*) 里 20 万个点和贴近两端的点都满足 |5x| < 0.03，δ 稍大时 x = ±d*(1+10⁻¹⁰) 不满足。',
    p3:
      'd* = inf{|x−2| : |x²−4| ≥ 1}，r 从 0 到 3 粗扫再二分（右边在 x = √5 处先失效，左边在 x = √3 处，取近的那个）；' +
      '核对 δ = d* 时 (2−d*, 2+d*) 里 20 万个点和贴近两端的点都满足 |x²−4| < 1，δ 稍大时找得到不满足的点。',
    p4: '先核对 2·3·5·7·11·13+1 = 30031，再从 2 起试除到 √30031 ≈ 173，第一个整除的数就是最小素因数；顺带查出 30031 = 59 × 509、509 是素数。',
  },
  compute() {
    const p1 = p1Solve();

    const cond2 = (x: number): boolean => Math.abs(5 * x) < 0.03;
    const p2 = maxDelta(cond2, 0, 1);
    checkDelta(cond2, 0, p2, 'p2');

    const cond3 = (x: number): boolean => Math.abs(x * x - 4) < 1;
    const p3 = maxDelta(cond3, 2, 3);
    checkDelta(cond3, 2, p3, 'p3');
    // 两边各自的失效距离，打印出来看取的是哪一边
    console.log(`    p3 右边 √5−2 = ${Math.sqrt(5) - 2}，左边 2−√3 = ${2 - Math.sqrt(3)}，数值求得 ${p3}`);

    const N = 2 * 3 * 5 * 7 * 11 * 13 + 1;
    if (N !== 30031) throw new Error(`p4：乘积加 1 是 ${N}，不是 30031`);
    const p4 = smallestPrimeFactor(N);
    const other = N / p4;
    if (smallestPrimeFactor(other) !== other) throw new Error('p4：另一个因数不是素数');
    console.log(`    p4 ${N} = ${p4} × ${other}`);

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
