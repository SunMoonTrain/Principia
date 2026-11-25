// 独立验算 math.logic-sets.maximal-elements 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.maximal-elements.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

// ---- 偏序集的几个概念，照定义逐个元素检查（le(a, b) 表示 a ⪯ b） ----

type Le<T> = (a: T, b: T) => boolean;

/** 是不是偏序：自反、反对称、传递。same 用来判断两个元素是不是同一个。 */
function isPartialOrder<T>(p: T[], le: Le<T>, same: (a: T, b: T) => boolean): boolean {
  for (const a of p) if (!le(a, a)) return false;
  for (const a of p) for (const b of p) if (le(a, b) && le(b, a) && !same(a, b)) return false;
  for (const a of p) for (const b of p) if (le(a, b)) for (const c of p) if (le(b, c) && !le(a, c)) return false;
  return true;
}

/** 极大元：m ∈ S，并且 S 里满足 m ⪯ x 的 x 只有 m 自己。 */
function maximalOf<T>(s: T[], le: Le<T>): T[] {
  return s.filter((m) => s.every((x) => !le(m, x) || x === m));
}
/** 极小元：m ∈ S，并且 S 里满足 x ⪯ m 的 x 只有 m 自己。 */
function minimalOf<T>(s: T[], le: Le<T>): T[] {
  return s.filter((m) => s.every((x) => !le(x, m) || x === m));
}
/** 最大元：g ∈ S，并且 S 的每个 x 都有 x ⪯ g（照定义找，数出有几个）。 */
function greatestOf<T>(s: T[], le: Le<T>): T[] {
  return s.filter((g) => s.every((x) => le(x, g)));
}
/** 最小元：l ∈ S，并且 S 的每个 x 都有 l ⪯ x。 */
function leastOf<T>(s: T[], le: Le<T>): T[] {
  return s.filter((l) => s.every((x) => le(l, x)));
}
/** S 在 P 里的上界：P 的元素 u，S 的每个 x 都有 x ⪯ u。 */
function upperBoundsOf<T>(p: T[], s: T[], le: Le<T>): T[] {
  return p.filter((u) => s.every((x) => le(x, u)));
}
/** S 在 P 里的上确界：上界组成的集合的最小元；没有就返回 null。 */
function supOf<T>(p: T[], s: T[], le: Le<T>): T | null {
  const least = leastOf(upperBoundsOf(p, s, le), le);
  return least.length === 0 ? null : least[0];
}

const divides: Le<number> = (a, b) => b % a === 0;

/** 选项序号（从 1 开始）里判为真的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

// ---- p4：在 {0, …, n−1} 上枚举全部偏序（n ≤ 5），up[a] 的第 b 位为 1 表示 a ⪯ b ----

function* allPosets(n: number): Generator<number[]> {
  // 每一对 a < b（按编号）有三种：不可比、a ≺ b、b ≺ a；自反性直接放进去，反对称性由这个写法保证，再查传递性
  const pairs: [number, number][] = [];
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) pairs.push([a, b]);
  const total = 3 ** pairs.length;
  for (let code = 0; code < total; code++) {
    const up = Array.from({ length: n }, (_, a) => 1 << a);
    let c = code;
    for (const [a, b] of pairs) {
      const t = c % 3;
      c = (c - t) / 3;
      if (t === 1) up[a] |= 1 << b;
      if (t === 2) up[b] |= 1 << a;
    }
    let ok = true;
    for (let a = 0; a < n && ok; a++)
      for (let b = 0; b < n && ok; b++) if ((up[a] >> b) & 1 && (up[b] & ~up[a]) !== 0) ok = false; // a ⪯ b 时 b 上面的都要在 a 上面
    if (ok) yield up;
  }
}

/** 已知的带标号偏序个数（n = 0..5）：1, 1, 3, 19, 219, 4231，用来核对枚举没有漏。 */
const LABELED_POSETS = [1, 1, 3, 19, 219, 4231];

type SubsetInfo = { mask: number; max: number[]; greatest: number | null; sup: number | null };

function subsetInfos(n: number, up: number[]): SubsetInfo[] {
  const le: Le<number> = (a, b) => ((up[a] >> b) & 1) === 1;
  const P = Array.from({ length: n }, (_, i) => i);
  const out: SubsetInfo[] = [];
  for (let mask = 1; mask < 1 << n; mask++) {
    const s = P.filter((i) => (mask >> i) & 1);
    const g = greatestOf(s, le);
    if (g.length > 1) throw new Error('p4：最大元不唯一');
    out.push({ mask, max: maximalOf(s, le), greatest: g.length ? g[0] : null, sup: supOf(P, s, le) });
  }
  return out;
}

export const verification: Verification = {
  lesson: 'math.logic-sets.maximal-elements',
  notes: {
    p1:
      '照定义在 9 个数里逐个查：m 是极大元指集合里被 m 整除的只有 m 自己，极小元指集合里整除 m 的只有 m 自己；先核对整除在这 9 个数上确实自反、反对称、传递。' +
      '极大元是 12、30，极小元是 2、3、5。',
    p2:
      '照定义：在 1..20000 里找 12、18、30 的全部上界（被三个数都整除的数），上确界是上界里整除其他所有上界的那一个；下界（三个数的公因数）都不超过 12，下确界是其中被其他所有下界整除的那一个。' +
      '另用辗转相除算出的最小公倍数、最大公因数核对。窗口以外的上界 n 除以 180 的余数也是公倍数、又小于 180，只能是 0，所以 180 整除每个上界。',
    p3:
      '枚举 {1,…,6} 的 63 个非空子集（用二进制掩码），留下元素之和不超过 8 的，照定义逐个查它是不是其中的极大元（真包含它的都不在里面）。' +
      '另换一种数法核对：极大等价于添上任何一个不在里面的数和就超过 8，只要看最小的缺数。极大元是 {2,6}、{3,5}、{1,6}、{1,3,4}、{1,2,4}、{1,2,5}、{1,2,3}。',
    p4:
      '枚举 1 到 5 个元素的全部带标号偏序（1、3、19、219、4231 个，个数和已知的一致），在每个偏序集里对全部非空子集 S、T 照定义逐条找反例。' +
      '没有反例的 A、B、D 对任意偏序集可以直接证：A 若 m ⪯ x，极大性给 x = m，于是每个与 m 可比的 x 都有 x ⪯ m；B 上确界是上界，属于 S 就是最大元；D S 的上界都是 T 的上界，所以 sup S 是 T 的上界，sup T ⪯ sup S。' +
      'C 的反例：两个不可比的元素，S = {a}、T = {b}。E 在有限偏序集里找不到反例（非空有限偏序集都有极大元），要用无限的：S = ℕ ∪ {∞}（∞ 比每个自然数都大）有最大元 ∞，T = ℕ 的每个 n 都小于 T 里的 n + 1，没有极大元；' +
      '[0, 1] 和 [0, 1) 也是一例。T = ∅ 在题里已排除。',
  },
  compute() {
    // p1
    const A1 = [2, 3, 4, 5, 6, 10, 12, 15, 30];
    const same = (a: number, b: number): boolean => a === b;
    if (!isPartialOrder(A1, divides, same)) throw new Error('p1 整除在这 9 个数上应是偏序');
    const max1 = maximalOf(A1, divides);
    const min1 = minimalOf(A1, divides);
    if (max1.join(',') !== '12,30' || min1.join(',') !== '2,3,5')
      throw new Error(`p1 极大元 ${max1.join(',')}，极小元 ${min1.join(',')}`);
    const p1: [number, number] = [max1.length, min1.length];

    // p2
    const S2 = [12, 18, 30];
    const WINDOW = Array.from({ length: 20000 }, (_, i) => i + 1);
    const uppers = WINDOW.filter((u) => S2.every((x) => divides(x, u)));
    const lowers = WINDOW.filter((l) => S2.every((x) => divides(l, x)));
    const sups = leastOf(uppers, divides);
    const infs = greatestOf(lowers, divides);
    if (sups.length !== 1 || infs.length !== 1) throw new Error('p2 上确界、下确界应各恰有一个');
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;
    if (sups[0] !== S2.reduce(lcm) || infs[0] !== S2.reduce(gcd)) throw new Error('p2 和最小公倍数、最大公因数不一致');
    const p2: [number, number] = [sups[0], infs[0]];

    // p3
    const N3 = 6;
    const elems = (mask: number): number[] => Array.from({ length: N3 }, (_, i) => i + 1).filter((x) => (mask >> (x - 1)) & 1);
    const sum = (mask: number): number => elems(mask).reduce((u, v) => u + v, 0);
    const family: number[] = [];
    for (let mask = 1; mask < 1 << N3; mask++) if (sum(mask) <= 8) family.push(mask);
    const subset: Le<number> = (a, b) => (a & ~b) === 0;
    if (!isPartialOrder(family, subset, same)) throw new Error('p3 ⊆ 应是偏序');
    const max3 = maximalOf(family, subset);
    // 另一种数法：添上最小的缺数就超过 8
    const alt3 = family.filter((m) => {
      const missing = Array.from({ length: N3 }, (_, i) => i + 1).filter((x) => !((m >> (x - 1)) & 1));
      return missing.length === 0 || sum(m) + missing[0] > 8;
    });
    if (max3.join(',') !== alt3.join(',')) throw new Error('p3 两种数法不一致');
    const shown3 = max3.map((m) => '{' + elems(m).join(',') + '}').sort().join(' ');
    if (shown3 !== '{1,2,3} {1,2,4} {1,2,5} {1,3,4} {1,6} {2,6} {3,5}') throw new Error(`p3 极大元是 ${shown3}`);
    const p3 = max3.length;

    // p4
    const alive = [true, true, true, true, true]; // A..E 还没找到反例
    for (let n = 1; n <= 5; n++) {
      let count = 0;
      for (const up of allPosets(n)) {
        count++;
        const le: Le<number> = (a, b) => ((up[a] >> b) & 1) === 1;
        const infos = subsetInfos(n, up);
        const byMask = new Map(infos.map((s) => [s.mask, s]));
        for (const S of infos) {
          const els = Array.from({ length: n }, (_, i) => i).filter((i) => (S.mask >> i) & 1);
          // A：m 是 S 的极大元、S 的每个元素都与 m 可比 ⇒ m 是最大元
          for (const m of S.max) if (els.every((x) => le(x, m) || le(m, x)) && S.greatest !== m) alive[0] = false;
          // B：sup S 存在且属于 S ⇒ 是最大元
          if (S.sup !== null && (S.mask >> S.sup) & 1 && S.greatest !== S.sup) alive[1] = false;
          for (const T of infos) {
            // C：S、T 都有最大元 ⇒ S ∪ T 有最大元
            if (S.greatest !== null && T.greatest !== null && byMask.get(S.mask | T.mask)!.greatest === null) alive[2] = false;
            if ((T.mask & ~S.mask) === 0) {
              // D：T ⊆ S、两个上确界都存在 ⇒ sup T ⪯ sup S
              if (S.sup !== null && T.sup !== null && !le(T.sup, S.sup)) alive[3] = false;
              // E：S 有最大元、T ⊆ S ⇒ T 有极大元（有限时总成立，见下面的无限反例）
              if (S.greatest !== null && T.max.length === 0) alive[4] = false;
            }
          }
        }
      }
      if (count !== LABELED_POSETS[n]) throw new Error(`p4：${n} 个元素的偏序数出 ${count} 个`);
    }
    // C 的具体反例：两个不可比的元素 0、1（up[0] = {0}，up[1] = {1}），S = {0}、T = {1} 都有最大元，S ∪ T 没有
    const antichain = subsetInfos(2, [0b01, 0b10]);
    const [c0, c1, c01] = [0b01, 0b10, 0b11].map((mask) => antichain.find((s) => s.mask === mask)!);
    if (!(c0.greatest === 0 && c1.greatest === 1 && c01.greatest === null)) throw new Error('p4 C 的反例没起作用');
    if (!alive[4]) throw new Error('p4 E 在有限偏序集里不应有反例');
    // E 的无限反例：P = ℕ ∪ {∞}，用 Infinity 表示 ∞；S = P，T = ℕ
    const le4: Le<number> = (a, b) => a <= b;
    const sample = [...Array.from({ length: 2000 }, (_, i) => i), Infinity];
    if (!sample.every((x) => le4(x, Infinity))) throw new Error('p4 E：∞ 应是 S 的最大元');
    // T 的每个 n 都有 T 里比它大的 n + 1（所以没有一个是极大元）
    if (!sample.filter((x) => x !== Infinity).every((n) => le4(n, n + 1) && n + 1 !== n && n + 1 !== Infinity))
      throw new Error('p4 E：ℕ 的每个数都应小于下一个数');
    alive[4] = false;
    const p4 = trueOptions(alive);

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
