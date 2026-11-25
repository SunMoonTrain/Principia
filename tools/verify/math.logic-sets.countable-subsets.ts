// 独立验算 math.logic-sets.countable-subsets 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.countable-subsets.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** 选项序号（从 1 开始）里判为真的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

// ---- p1：计数映射 φ(a) = A 中比 a 小的数的个数 ----

/** 由谓词取出 0..M 里属于 A 的数，从小到大。 */
function members(inA: (n: number) => boolean, M: number): number[] {
  const out: number[] = [];
  for (let n = 0; n <= M; n++) if (inA(n)) out.push(n);
  return out;
}

/** φ(a)：直接数 A 中比 a 小的数。 */
function phi(inA: (n: number) => boolean, a: number): number {
  let count = 0;
  for (let n = 0; n < a; n++) if (inA(n)) count++;
  return count;
}

// ---- p2：每个集合要么数完（有限），要么给出到 N 的单射的核对和一列互不相同的元素（可数） ----

/** 一个单射的抽样核对：编码两两不同。 */
function injectiveOn<T>(sample: T[], code: (x: T) => string): boolean {
  return new Set(sample.map(code)).size === sample.length;
}

/** 最简分数 p/q（q > 0），|p| ≤ P、q ≤ Q。 */
function reducedFractions(P: number, Q: number): [number, number][] {
  const out: [number, number][] = [];
  for (let q = 1; q <= Q; q++) for (let p = -P; p <= P; p++) if (gcd(p, q) === 1) out.push([p, q]);
  return out;
}

/** 把若干个自然数编成一个自然数：2^a·3^b·5^c·…（素因数分解唯一，所以是单射）。 */
function primePowers(exponents: number[]): bigint {
  const primes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n];
  return exponents.reduce((acc, e, i) => acc * primes[i] ** BigInt(e), 1n);
}

/** 有理数编成三个自然数：符号、分子的绝对值、分母。 */
function rationalCode([p, q]: [number, number]): number[] {
  return [p < 0 ? 1 : 0, Math.abs(p), q];
}

/** A：圆心 (x, y)、半径 r 都是有理数的圆，圆由 (x, y, r) 定。 */
function optionA(): boolean {
  const xs = reducedFractions(2, 3);
  const rs = reducedFractions(3, 3).filter(([p]) => p > 0);
  const sample = xs.flatMap((x) => xs.flatMap((y) => rs.map((r) => ({ x, y, r }))));
  const injective = injectiveOn(sample, (c) => primePowers([...rationalCode(c.x), ...rationalCode(c.y), ...rationalCode(c.r)]).toString());
  // 无限：圆心在原点、半径为 1、2、3、… 的圆互不相同
  const many = Array.from({ length: 1000 }, (_, i) => `0,0,${i + 1}`);
  return injective && new Set(many).size === many.length;
}

/** B：既是平方数又是立方数的正整数。 */
function optionB(): boolean {
  const M = 20_000_000;
  const isSquare = (n: number): boolean => Math.round(Math.sqrt(n)) ** 2 === n;
  const isCube = (n: number): boolean => Math.round(Math.cbrt(n)) ** 3 === n;
  const found: number[] = [];
  for (let k = 1; k * k <= M; k++) if (isCube(k * k)) found.push(k * k);
  for (let k = 1; k ** 3 <= M; k++) if (isSquare(k ** 3) && !found.includes(k ** 3)) throw new Error('p2 B：两种找法不一致');
  const sixth = Array.from({ length: found.length }, (_, i) => (i + 1) ** 6);
  if (!found.every((n, i) => n === sixth[i])) throw new Error('p2 B：不是六次方数');
  // N 的子集，没有最大的数：任给 m，(m + 1)^6 > m 也在其中
  for (let m = 0; m <= 1000; m++) if (!((m + 1) ** 6 > m)) return false;
  return true;
}

/** C：分子、分母都不超过 100 的正分数表示的数；数得完就是有限集。 */
function optionC(): { countable: boolean; size: number } {
  const keys = new Set<string>();
  for (let p = 1; p <= 100; p++)
    for (let q = 1; q <= 100; q++) {
      const g = gcd(p, q);
      keys.add(`${p / g}/${q / g}`);
    }
  return { countable: false, size: keys.size };
}

/** D：平方是有理数的实数；x 由 (x², x 的符号) 定出。 */
function optionD(): boolean {
  const sample: { sq: [number, number]; sign: number }[] = [];
  for (const sq of reducedFractions(30, 30)) {
    if (sq[0] < 0) continue;
    if (sq[0] === 0) sample.push({ sq, sign: 0 });
    else for (const sign of [-1, 1]) sample.push({ sq, sign });
  }
  const value = (s: { sq: [number, number]; sign: number }): number => s.sign * Math.sqrt(s.sq[0] / s.sq[1]);
  // (x², 符号) 不同的 x 确实不同：排序后相邻的差不为 0（分母不超过 30 的数平方相差至少 1/900）
  const xs = sample.map(value).sort((a, b) => a - b);
  const distinct = xs.every((x, i) => i === 0 || x - xs[i - 1] > 1e-6);
  const injective = injectiveOn(sample, (s) => primePowers([s.sign + 1, s.sq[0], s.sq[1]]).toString());
  return distinct && injective; // 无限：含全体自然数
}

/** E：十进制各位数字互不相同的正整数；逐位添数字数完。 */
function optionE(): { countable: boolean; size: number; max: number } {
  let size = 0;
  let max = 0;
  const extend = (value: number, used: number): void => {
    size++;
    if (value > max) max = value;
    for (let d = 0; d <= 9; d++) if (!(used & (1 << d))) extend(value * 10 + d, used | (1 << d));
  };
  for (let d = 1; d <= 9; d++) extend(d, 1 << d);
  return { countable: false, size, max };
}

// ---- p4：只和三块 A∖B、A∩B、B∖A 的大小有关，逐种大小枚举 ----

/** 集合的大小：0、1、2、3 表示有限个，'w' 表示可数，'c' 表示和 R 等势（不可数）。 */
type Size = number | 'w' | 'c';
const SIZES: Size[] = [0, 1, 2, 3, 'w', 'c'];
const isInfinite = (s: Size): boolean => s === 'w' || s === 'c';
const rank = (s: Size): number => (s === 'c' ? 2 : s === 'w' ? 1 : 0);
const maxSize = (a: Size, b: Size): Size => (rank(a) >= rank(b) ? a : b);
/** 不相交的并：有限的相加，有一个无限就取大的。 */
const add = (a: Size, b: Size): Size => (typeof a === 'number' && typeof b === 'number' ? a + b : maxSize(a, b));
/** 笛卡儿积：有一个空就空，有限的相乘，否则取大的。 */
const mul = (a: Size, b: Size): Size => (a === 0 || b === 0 ? 0 : typeof a === 'number' && typeof b === 'number' ? a * b : maxSize(a, b));
/** 有没有从 A 到 B 的满射：B 空时 A 也要空；B 不空时要 B 不比 A 多。 */
const surjects = (a: Size, b: Size): boolean => {
  if (b === 0) return a === 0;
  if (typeof a === 'number' && typeof b === 'number') return a >= b;
  return rank(a) >= rank(b);
};
const countable = (s: Size): boolean => s === 'w';
const atMostCountable = (s: Size): boolean => s !== 'c';

interface Pair {
  onlyA: Size;
  both: Size;
  onlyB: Size;
}

const P4: ((p: Pair) => boolean)[] = [
  // A. A、B 可数 ⇒ A∖B 可数
  ({ onlyA, both, onlyB }) => !(countable(add(onlyA, both)) && countable(add(both, onlyB))) || countable(onlyA),
  // B. A∪B 可数 ⇒ A、B 都可数
  ({ onlyA, both, onlyB }) => !countable(add(add(onlyA, both), onlyB)) || (countable(add(onlyA, both)) && countable(add(both, onlyB))),
  // C. A 可数、B 无限、有 A → B 的满射 ⇒ B 可数
  ({ onlyA, both, onlyB }) => {
    const a = add(onlyA, both);
    const b = add(both, onlyB);
    return !(countable(a) && isInfinite(b) && surjects(a, b)) || countable(b);
  },
  // D. A×B 可数 ⇒ A、B 至少一个可数
  ({ onlyA, both, onlyB }) => {
    const a = add(onlyA, both);
    const b = add(both, onlyB);
    return !countable(mul(a, b)) || countable(a) || countable(b);
  },
  // E. 有从 A 到可数集 B 的满射 ⇒ A 至多可数
  ({ onlyA, both, onlyB }) => {
    const a = add(onlyA, both);
    const b = add(both, onlyB);
    return !(countable(b) && surjects(a, b)) || atMostCountable(a);
  },
];

function counterexamples(test: (p: Pair) => boolean): Pair[] {
  const out: Pair[] = [];
  for (const onlyA of SIZES) for (const both of SIZES) for (const onlyB of SIZES) if (!test({ onlyA, both, onlyB })) out.push({ onlyA, both, onlyB });
  return out;
}

export const verification: Verification = {
  lesson: 'math.logic-sets.countable-subsets',
  notes: {
    p1:
      'φ(a) 照讲解取 A 中比 a 小的数的个数，在 0..3000 上逐个数：φ(45) 直接数 0..44 里是 3 或 5 的倍数的数；再从 A 里逐个试出 φ(a) = 30 的 a，核对只有一个（φ 严格递增）。' +
      '另按每 15 个数里恰有 0、3、5、6、9、10、12 这 7 个核对：φ(15k) = 7k，所以 φ(45) = 21，30 = 4·7 + 2 落在 60 那一段的第三个数 65。',
    p2:
      'A：圆由 (x, y, r) 定，把三个有理数编成素数幂的积，在 |p| ≤ 2（半径 ≤ 3）、q ≤ 3 的最简分数上核对编码两两不同，并有半径 1、2、3、… 的无穷多个圆。' +
      'B：在 2×10⁷ 以内既是平方数又是立方数的恰是六次方数 1、64、729、…，N 的子集，没有最大的数。C：10000 个分数约分后只有有限个不同的数（另用 2·Σφ(k) − 1 核对）。' +
      'D：x 由 (x², 符号) 定，最简分数 |p|、q ≤ 30 上核对编码两两不同、数值也两两不同，且含全体自然数。E：逐位添互不相同的数字全部数完，最多十位，最大 9876543210。',
    p3:
      '按 p + q 从小到大、同和时按 p 从小到大列出全部最简分数，找 4/5 的位置；另用「p + q = s 的最简分数有 φ(s) 个」（φ 为欧拉函数）核对前面各组的个数之和加组内的位置。',
    p4:
      '五句话都只和 A∖B、A∩B、B∖A 三块的大小有关：每块取 0、1、2、3 个元素、可数、与 R 等势六种，枚举 6³ = 216 种情形找反例。' +
      '满射 A → B 存在当且仅当 B 空时 A 空、B 不空时 B 不比 A 多；积的大小按有一块空则空、有限的相乘、否则取大的。' +
      'A 的反例 A = B = N（差集空）；B 的反例 A = N、B = ∅；E 的反例 A = R、B = Z、x ↦ ⌊x⌋；C、D 没有反例（C 用每个元素取最小原像得单射，D 固定一个坐标得单射，两块都有限时积有限）。',
  },
  compute() {
    // p1
    const inA = (n: number): boolean => n % 3 === 0 || n % 5 === 0;
    const M = 3000;
    const A = members(inA, M);
    const phi45 = phi(inA, 45);
    const at30 = A.filter((a) => phi(inA, a) === 30);
    if (at30.length !== 1) throw new Error('p1：φ(a) = 30 的 a 应恰有一个');
    // φ 严格递增并且一个不跳：第 k 个元素（k 从 0 起）的 φ 值就是 k
    if (!A.every((a, k) => phi(inA, a) === k)) throw new Error('p1：φ 不是依次取 0、1、2、…');
    if (phi(inA, 15 * 7) !== 49 || phi45 !== 3 * 7 || at30[0] !== 4 * 15 + 5) throw new Error('p1 和按周期 15 的算法不一致');

    // p2
    const c = optionC();
    const e = optionE();
    let totients = 0;
    for (let k = 1; k <= 100; k++) for (let j = 1; j <= k; j++) if (gcd(j, k) === 1) totients++;
    if (c.size !== 2 * totients - 1) throw new Error('p2 C：个数和欧拉函数之和不一致');
    let byLength = 0;
    for (let len = 1, ways = 9; len <= 10; len++, ways *= 11 - len) byLength += ways;
    if (e.size !== byLength || e.max !== 9876543210) throw new Error(`p2 E：个数 ${e.size} 和逐位相乘的 ${byLength} 不一致`);
    const p2 = trueOptions([optionA(), optionB(), c.countable, optionD(), e.countable]);

    // p3
    let position = 0;
    let p3 = 0;
    for (let s = 2; s <= 20 && p3 === 0; s++)
      for (let p = 1; p < s; p++) {
        const q = s - p;
        if (gcd(p, q) !== 1) continue;
        position++;
        if (p === 4 && q === 5) {
          p3 = position;
          break;
        }
      }
    const euler = (n: number): number => Array.from({ length: n }, (_, i) => i + 1).filter((j) => gcd(j, n) === 1).length;
    const before = [2, 3, 4, 5, 6, 7, 8].reduce((acc, s) => acc + euler(s), 0);
    const inGroup = [1, 2, 3, 4].filter((p) => gcd(p, 9 - p) === 1).length;
    if (before + inGroup !== p3) throw new Error('p3 两种数法不一致');
    // 题面列出的前几项
    const listed = ['1/1', '1/2', '2/1', '1/3', '3/1', '1/4'];
    const mine: string[] = [];
    for (let s = 2; mine.length < listed.length; s++) for (let p = 1; p < s; p++) if (gcd(p, s - p) === 1) mine.push(`${p}/${s - p}`);
    if (!listed.every((x, i) => x === mine[i])) throw new Error('p3 的排法和题面列出的不一致');

    // p4
    const p4Counter = P4.map(counterexamples);
    const has = (i: number, p: Pair): boolean => p4Counter[i].some((q) => q.onlyA === p.onlyA && q.both === p.both && q.onlyB === p.onlyB);
    if (!has(0, { onlyA: 0, both: 'w', onlyB: 0 })) throw new Error('p4 A：A = B = N 应是反例');
    if (!has(1, { onlyA: 'w', both: 0, onlyB: 0 })) throw new Error('p4 B：B = ∅ 应是反例');
    if (!has(4, { onlyA: 'c', both: 'w', onlyB: 0 })) throw new Error('p4 E：A = R、B = Z 应是反例');
    const p4 = trueOptions(p4Counter.map((list) => list.length === 0));

    return {
      p1: { type: 'tuple', value: [phi45, at30[0]] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
