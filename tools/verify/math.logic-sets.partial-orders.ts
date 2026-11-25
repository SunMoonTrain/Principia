// 独立验算 math.logic-sets.partial-orders 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.partial-orders.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

// ---- 有限集合上的关系：三条性质照定义逐个（逐对、逐三元组）检查 ----

type Rel<T> = (a: T, b: T) => boolean;

/** 自反：每个 a 都有 a ⪯ a；不成立时返回反例。 */
function reflexiveFails<T>(xs: T[], r: Rel<T>): T | null {
  for (const a of xs) if (!r(a, a)) return a;
  return null;
}
/** 反对称：a ⪯ b 且 b ⪯ a 推出 a = b；不成立时返回反例 (a, b)。 */
function antisymmetricFails<T>(xs: T[], r: Rel<T>): [T, T] | null {
  for (const a of xs) for (const b of xs) if (a !== b && r(a, b) && r(b, a)) return [a, b];
  return null;
}
/** 传递：a ⪯ b 且 b ⪯ c 推出 a ⪯ c；不成立时返回反例 (a, b, c)。 */
function transitiveFails<T>(xs: T[], r: Rel<T>): [T, T, T] | null {
  for (const a of xs) for (const b of xs) if (r(a, b)) for (const c of xs) if (r(b, c) && !r(a, c)) return [a, b, c];
  return null;
}
function isPartialOrderOn<T>(xs: T[], r: Rel<T>): boolean {
  return reflexiveFails(xs, r) === null && antisymmetricFails(xs, r) === null && transitiveFails(xs, r) === null;
}
/** 全序：偏序，并且任意两个元素可以比较。 */
function isTotalOrderOn<T>(xs: T[], r: Rel<T>): boolean {
  return isPartialOrderOn(xs, r) && xs.every((a) => xs.every((b) => r(a, b) || r(b, a)));
}

/** 选项序号（从 1 开始）里判为「是」的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

/** a | b（a、b 是正整数）。 */
function divides(a: number, b: number): boolean {
  return b % a === 0;
}

// ---- p1：五个关系 ----

/** B 的集合（整个集合）。 */
const P1_B: number[] = [2, 3, 5, 6, 10, 15, 30];
const P1_NAT: number[] = Array.from({ length: 300 }, (_, i) => i + 1); // 1..300
/** n 的不同的素因数，从小到大试除（1 没有素因数，得空表）。 */
function primeFactors(n: number): number[] {
  const out: number[] = [];
  let m = n;
  for (let d = 2; m > 1; d++) {
    if (m % d !== 0) continue;
    out.push(d);
    while (m % d === 0) m /= d;
  }
  return out;
}
/** 1..300 的素因数表，免得在三重循环里重算。 */
const P1_FACTORS: number[][] = [[], ...P1_NAT.map(primeFactors)];
/** {1,2,3} 的子集写成 0..7 的二进制掩码。 */
const P1_SUBSETS: number[] = Array.from({ length: 8 }, (_, m) => m);

function bitCount(m: number): number {
  let c = 0;
  for (let x = m; x > 0; x >>= 1) c += x & 1;
  return c;
}
/** 掩码 x 表示的集合 ⊆ 掩码 y 表示的集合。 */
function subset(x: number, y: number): boolean {
  return (x & ~y) === 0;
}
/** 使 b = a^k 的正整数 k（a = 1 时 k 不唯一，只在 b = 1 时给出 1）；没有这样的 k 时返回 null。从 a 起逐次乘 a。 */
function exponent(a: number, b: number): number | null {
  if (a === 1) return b === 1 ? 1 : null;
  let k = 1;
  for (let p = a; p <= b; p *= a, k++) if (p === b) return k;
  return null;
}

const relA: Rel<number> = (a, b) => P1_FACTORS[a].every((p) => divides(p, b)); // 在 ℕ⁺ 上（样本 1..300）
const relB: Rel<number> = relA; // 同样的规定，在 {2,3,5,6,10,15,30} 上
const relC: Rel<number> = (a, b) => exponent(a, b) !== null; // 在 ℕ⁺ 上
const relD: Rel<number> = (a, b) => divides(a * a, b); // 在 ℕ⁺ 上
const relE: Rel<number> = (x, y) => subset(x, y) && bitCount(y & ~x) <= 1; // 在 𝒫({1,2,3}) 上

// ---- p2：哈斯图的线数 ----

/** 照「紧接」的定义数：a ≺ b，中间没有别的 c 使 a ≺ c ≺ b。返回所有的线 (a, b)。 */
function coverPairs<T>(xs: T[], le: Rel<T>): [T, T][] {
  const lt: Rel<T> = (a, b) => a !== b && le(a, b);
  const out: [T, T][] = [];
  for (const a of xs) for (const b of xs) if (lt(a, b) && !xs.some((c) => lt(a, c) && lt(c, b))) out.push([a, b]);
  return out;
}

/** 从一组线出发求「沿线往上走（可以不走）能到达」的关系，用来核对哈斯图能把偏序还原出来。 */
function reachable<T>(xs: T[], lines: [T, T][]): Rel<T> {
  const up = new Map<T, Set<T>>();
  for (const x of xs) {
    const seen = new Set<T>([x]);
    const stack = [x];
    while (stack.length > 0) {
      const y = stack.pop() as T;
      for (const [a, b] of lines) if (a === y && !seen.has(b)) (seen.add(b), stack.push(b));
    }
    up.set(x, seen);
  }
  return (a, b) => (up.get(a) as Set<T>).has(b);
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

// ---- p3：𝒫({1,2,3,4}) 的 2^16 个子族里，哪些是链（任意两个可以比较） ----

function longestChains(n: number): { length: number; count: number; example: number[] } {
  const subsets = Array.from({ length: 1 << n }, (_, m) => m);
  const total = subsets.length; // n = 4 时 16 个
  // comparable[i]：和第 i 个子集可以比较的子集（含自己）组成的掩码
  const comparable = subsets.map((x) =>
    subsets.reduce((acc, y) => (subset(x, y) || subset(y, x) ? acc | (1 << y) : acc), 0),
  );
  let length = 0;
  let count = 0;
  let example: number[] = [];
  for (let fam = 0; fam < 2 ** total; fam++) {
    let chain = true;
    for (let i = 0; i < total && chain; i++) if ((fam >> i) & 1 && (fam & ~comparable[i]) !== 0) chain = false;
    if (!chain) continue;
    const size = bitCount(fam);
    if (size > length) {
      length = size;
      count = 1;
      example = subsets.filter((i) => (fam >> i) & 1);
    } else if (size === length) count++;
  }
  return { length, count, example };
}

// ---- p4：n 元集上的全部关系（2^(n²) 个）逐个查 ----

function countOrders(n: number): { partial: number; total: number; byPairs: Map<number, number> } {
  const xs = Array.from({ length: n }, (_, i) => i);
  let partial = 0;
  let total = 0;
  const byPairs = new Map<number, number>(); // 按 a ≺ b 的对数分类
  for (let mask = 0; mask < 2 ** (n * n); mask++) {
    const r: Rel<number> = (a, b) => ((mask >> (a * n + b)) & 1) === 1;
    if (!isPartialOrderOn(xs, r)) continue;
    partial++;
    const strict = bitCount(mask) - n;
    byPairs.set(strict, (byPairs.get(strict) ?? 0) + 1);
    if (isTotalOrderOn(xs, r)) total++;
  }
  return { partial, total, byPairs };
}

export const verification: Verification = {
  lesson: 'math.logic-sets.partial-orders',
  notes: {
    p1:
      '五个关系照定义逐个、逐对、逐三元组查自反、反对称、传递：A 在 1..300 上（素因数用试除求），B 在 {2,3,5,6,10,15,30} 这 7 个数上、E 在 {1,2,3} 的 8 个子集上（有限集合，就是全部），' +
      'C、D 在 1..300 上（C 用整数连乘判「有正整数 k 使 b = a^k」）。' +
      '判「是」的两个另核对：B 逐对和整除比过，是同一个关系，七个数都不含平方因数；C 的结论对整个 ℕ⁺ 成立，反对称来自 a^k ≥ a（两个方向都成立就 a ≤ b ≤ a），传递来自指数相乘，样本里逐个核对了 a ≤ a^k 和指数 km。' +
      '判「否」的反例：A 有 2 ⪯ 4、4 ⪯ 2 而 2 ≠ 4（A 自反、传递，只坏在反对称；互相有关系的恰是素因数完全相同的两个数）；D 有 2² = 4 不整除 2，不自反；E 有 ∅ ⪯ {1} ⪯ {1,2} 而 ∅ 不 ⪯ {1,2}（多出两个元素）。' +
      '（批次 26 第 1 轮修订换了 A、B，这一题的脚本由复核重写。）',
    p2:
      '照紧接的定义（a 严格整除 b，且中间没有别的 c）对 1..8 逐对数线；再用「b/a 是素数」数一遍（1..8 对取因数封闭），两个数一致；' +
      '并核对「沿线往上走能到达」正好还原整除关系、去掉任何一条线就还原不出来。',
    p3:
      '{1,2,3,4} 的 16 个子集，枚举 2^16 = 65536 个子族，照「任意两个可以比较」判是不是链，求元素最多的链的大小和条数。' +
      '界：链里不同的集合元素个数也不同，而元素个数只有 0..4 五种，所以至多 5 个；5 个取得到（样例由枚举给出并逐对核对）；条数和 4! 对照。另对 n = 1, 2, 3 核对是 n + 1 和 n!。',
    p4:
      '{1,2,3} 上的 2^9 = 512 个关系逐个照定义查自反、反对称、传递，数偏序；再查任意两个可以比较，数全序。' +
      '按严格关系 a ≺ b 的对数分类核对：0 对 1 个，1 对 6 个，2 对 6 个（一个在下两个在上 3 个、两个在下一个在上 3 个），3 对 6 个，共 19；' +
      '同一程序对 n = 1, 2, 4 给出 1, 3, 219，和已知的 1, 3, 19, 219 一致，全序 1, 2, 24 = n!。',
  },
  compute() {
    // p1
    const p1Results = [
      isPartialOrderOn(P1_NAT, relA),
      isPartialOrderOn(P1_B, relB),
      isPartialOrderOn(P1_NAT, relC),
      isPartialOrderOn(P1_NAT, relD),
      isPartialOrderOn(P1_SUBSETS, relE),
    ];
    // 判「是」的两个对整个集合成立的理由
    for (const a of P1_B) {
      for (const b of P1_B) if (relB(a, b) !== divides(a, b)) throw new Error('p1 B 不是整除');
      if (P1_FACTORS[a].some((p) => divides(p * p, a))) throw new Error(`p1 B 里的 ${a} 含平方因数`);
    }
    for (const a of P1_NAT)
      for (const b of P1_NAT) {
        const k = exponent(a, b);
        if (k === null) continue;
        // C 的反对称：b = a^k ≥ a，所以两个方向都成立只能 a = b
        if (a > b) throw new Error('p1 C：a^k < a');
        if (relC(b, a) && a !== b) throw new Error('p1 C 应反对称');
        // C 的传递：b = a^k、c = b^m 时 c = a^(km)（a ≥ 2 时指数唯一，逐个核对）
        for (const c of P1_NAT) {
          const m = exponent(b, c);
          if (m !== null && a >= 2 && exponent(a, c) !== k * m) throw new Error('p1 C：指数没有相乘');
        }
      }
    // 判「否」的三个：具体反例
    if (!(relA(2, 4) && relA(4, 2))) throw new Error('p1 A 的反例没起作用');
    if (antisymmetricFails(P1_NAT, relA) === null) throw new Error('p1 A 应不反对称');
    if (reflexiveFails(P1_NAT, relA) !== null || transitiveFails(P1_NAT, relA) !== null) throw new Error('p1 A 应自反、传递');
    // A 里互相有关系，就是素因数完全相同；B 的七个数里没有这样的两个（第 2 级提示、解答里说的）
    for (const a of P1_NAT)
      for (const b of P1_NAT)
        if ((relA(a, b) && relA(b, a)) !== (P1_FACTORS[a].join() === P1_FACTORS[b].join())) throw new Error('p1 A：互相有关系应当就是素因数完全相同');
    if (new Set(P1_B.map((a) => P1_FACTORS[a].join())).size !== P1_B.length) throw new Error('p1 B：有两个数的素因数完全相同');
    if (relD(2, 2) || reflexiveFails(P1_NAT, relD) !== 2) throw new Error('p1 D 的反例没起作用');
    if (!relD(1, 1)) throw new Error('p1 D：1 处应成立');
    // D 只坏在自反：反对称、传递都成立
    if (antisymmetricFails(P1_NAT, relD) !== null || transitiveFails(P1_NAT, relD) !== null) throw new Error('p1 D 应反对称、传递');
    if (!(relE(0, 1) && relE(1, 3) && !relE(0, 3))) throw new Error('p1 E 的反例没起作用'); // ∅、{1}、{1,2}
    if (reflexiveFails(P1_SUBSETS, relE) !== null || antisymmetricFails(P1_SUBSETS, relE) !== null)
      throw new Error('p1 E 应自反、反对称');
    const p1 = trueOptions(p1Results);

    // p2
    const xs2 = Array.from({ length: 8 }, (_, i) => i + 1);
    if (!isPartialOrderOn(xs2, divides)) throw new Error('p2 整除应是偏序');
    const lines2 = coverPairs(xs2, divides);
    const byPrime = xs2.flatMap((b) => xs2.filter((a) => divides(a, b) && isPrime(b / a)).map((a) => [a, b] as [number, number]));
    const show = (ls: [number, number][]) =>
      ls
        .map(([a, b]) => `${a}-${b}`)
        .sort()
        .join(' ');
    if (show(lines2) !== show(byPrime)) throw new Error(`p2 两种数法不一致：${show(lines2)} 与 ${show(byPrime)}`);
    const back = reachable(xs2, lines2);
    for (const a of xs2) for (const b of xs2) if (back(a, b) !== divides(a, b)) throw new Error('p2 哈斯图没有还原整除');
    for (let i = 0; i < lines2.length; i++) {
      const fewer = reachable(xs2, lines2.filter((_, j) => j !== i));
      if (xs2.every((a) => xs2.every((b) => fewer(a, b) === divides(a, b)))) throw new Error('p2 有多余的线');
    }
    const p2 = lines2.length;

    // p3
    const chains = longestChains(4);
    for (const x of chains.example)
      for (const y of chains.example) if (!subset(x, y) && !subset(y, x)) throw new Error('p3 样例不是链');
    if (chains.example.length !== chains.length) throw new Error('p3 样例长度不对');
    for (const [n, fact] of [
      [1, 1],
      [2, 2],
      [3, 6],
      [4, 24],
    ]) {
      const c = longestChains(n);
      if (c.length !== n + 1 || c.count !== fact) throw new Error(`p3 n = ${n}：${c.length} 个元素、${c.count} 条`);
    }
    const p3 = [chains.length, chains.count];

    // p4
    const o3 = countOrders(3);
    const shapes = [...o3.byPairs.entries()].sort((a, b) => a[0] - b[0]).map(([k, v]) => `${k}:${v}`).join(' ');
    if (shapes !== '0:1 1:6 2:6 3:6') throw new Error(`p4 按对数分类：${shapes}`);
    for (const [n, partial, total] of [
      [1, 1, 1],
      [2, 3, 2],
      [4, 219, 24],
    ]) {
      const o = countOrders(n);
      if (o.partial !== partial || o.total !== total) throw new Error(`p4 n = ${n}：${o.partial} 个偏序、${o.total} 个全序`);
    }
    const p4 = [o3.partial, o3.total];

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
