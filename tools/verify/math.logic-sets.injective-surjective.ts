// 独立验算 math.logic-sets.injective-surjective 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.injective-surjective.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** 选项序号（从 1 开始）里判为真的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

// ---- p1：照定义查「不同的元素像不同」 ----
// 每个映射取一批检验元素，像写成字符串；两个不同的元素像相同就是反例。
// 有限的定义域取全部元素，判断是精确的；无限的定义域查不出反例时，再在 notes 里给出理由。

interface SampledMap {
  /** 检验元素（写成字符串，彼此不同）和它的像（规范写法）。 */
  entries: [string, string][];
  /** 检验元素就是整个定义域时为 true。 */
  exhaustive: boolean;
}

function collision(m: SampledMap): [string, string] | null {
  const seen = new Map<string, string>();
  for (const [x, y] of m.entries) {
    const other = seen.get(y);
    if (other !== undefined && other !== x) return [other, x];
    seen.set(y, x);
  }
  return null;
}

function ints(lo: number, hi: number): number[] {
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
}

/** A：Z → Z×Z，n ↦ (n², n³)。 */
function p1A(): SampledMap {
  return { entries: ints(-300, 300).map((n) => [String(n), `${n ** 2},${n ** 3}`]), exhaustive: false };
}
/** B：R → R，x ↦ x + |x|。检验元素取八分之一的整数倍，二进制里是精确的。 */
function p1B(): SampledMap {
  return { entries: ints(-80, 80).map((k) => [String(k / 8), String(k / 8 + Math.abs(k / 8))]), exhaustive: false };
}
/** C：Z×Z → Z，(m, n) ↦ 2m + 4n。 */
function p1C(): SampledMap {
  const entries: [string, string][] = [];
  for (const m of ints(-10, 10)) for (const n of ints(-10, 10)) entries.push([`${m},${n}`, String(2 * m + 4 * n)]);
  return { entries, exhaustive: false };
}
/** D：{0,1,2,3,4} 到自身，n ↦ 3n 除以 5 的余数。 */
function p1D(): SampledMap {
  return { entries: ints(0, 4).map((n) => [String(n), String((3 * n) % 5)]), exhaustive: true };
}
/** E：P({1,2,3}) → N，S ↦ S 的元素之和。 */
function p1E(): SampledMap {
  const entries: [string, string][] = [];
  for (let mask = 0; mask < 8; mask++) {
    const s = [1, 2, 3].filter((_, i) => (mask >> i) & 1);
    entries.push([`{${s.join(',')}}`, String(s.reduce((a, b) => a + b, 0))]);
  }
  return { entries, exhaustive: true };
}

// ---- p2、p4：有限集之间的映射写成像的数组，逐个枚举 ----

/** 从 {0,…,m−1} 到 {0,…,n−1} 的全部映射（m = 0 时恰有一个空映射；m > 0、n = 0 时没有）。 */
function allMaps(m: number, n: number): number[][] {
  let out: number[][] = [[]];
  for (let k = 0; k < m; k++) out = out.flatMap((f) => ints(0, n - 1).map((y) => [...f, y]));
  return out;
}

function injectiveOn(f: number[], s: number[]): boolean {
  return s.every((x, i) => s.every((y, j) => i === j || f[x] !== f[y]));
}
function surjectiveOn(f: number[], s: number[], n: number): boolean {
  return ints(0, n - 1).every((b) => s.some((x) => f[x] === b));
}

interface Case4 {
  f: number[];
  n: number;
  s: number[];
  rest: number[];
}

/** 条件成立时结论也成立。 */
function implies(p: boolean, q: boolean): boolean {
  return !p || q;
}

const P4_OPTIONS: ((c: Case4) => boolean)[] = [
  // A. f 满 ⇒ f|S 满
  ({ f, n, s, rest }) => implies(surjectiveOn(f, [...s, ...rest], n), surjectiveOn(f, s, n)),
  // B. 两个限制都单、两边的像没有公共的 ⇒ f 单
  ({ f, s, rest }) =>
    implies(
      injectiveOn(f, s) && injectiveOn(f, rest) && s.every((x) => rest.every((y) => f[x] !== f[y])),
      injectiveOn(f, [...s, ...rest]),
    ),
  // C. 两个限制都不满 ⇒ f 不满
  ({ f, n, s, rest }) => implies(!surjectiveOn(f, s, n) && !surjectiveOn(f, rest, n), !surjectiveOn(f, [...s, ...rest], n)),
  // D. f 单 ⇒ f|S 单
  ({ f, s, rest }) => implies(injectiveOn(f, [...s, ...rest]), injectiveOn(f, s)),
  // E. f|S 满 ⇒ f 满
  ({ f, n, s, rest }) => implies(surjectiveOn(f, s, n), surjectiveOn(f, [...s, ...rest], n)),
];

/** 定义域 0–4 个元素、陪域 0–4 个元素、S 取遍子集（含空集和整个定义域），逐项找第一个反例。 */
function firstCounterexamples(): (Case4 | null)[] {
  const found: (Case4 | null)[] = P4_OPTIONS.map(() => null);
  for (const m of ints(0, 4))
    for (const n of ints(0, 4))
      for (const f of allMaps(m, n))
        for (let mask = 0; mask < 1 << m; mask++) {
          const s = ints(0, m - 1).filter((x) => (mask >> x) & 1);
          const rest = ints(0, m - 1).filter((x) => !((mask >> x) & 1));
          const c: Case4 = { f, n, s, rest };
          P4_OPTIONS.forEach((holds, i) => {
            if (!found[i] && !holds(c)) found[i] = c;
          });
        }
  return found;
}

// ---- p3：对每个 y 精确地数方程 f(x) = y 的解 ----

/** 方程 f(x) = y 的解数。x ≤ 1 的一段 x = y − a；x > 1 的一段 x = (y + 5)/3。y 取半整数，用两倍记成整数，比较时不除。 */
function solutionCount(a: number, twiceY: number): number {
  let count = 0;
  if (twiceY - 2 * a <= 2) count++; // x = y − a ≤ 1
  if (twiceY + 10 > 6) count++; // x = (y + 5)/3 > 1，即 2y + 10 > 6
  return count;
}

/** 回代核对：解代回 f 得到 y（浮点，只作旁证）。 */
function f3(a: number, x: number): number {
  return x <= 1 ? x + a : 3 * x - 5;
}

export const verification: Verification = {
  lesson: 'math.logic-sets.injective-surjective',
  notes: {
    p1:
      '照定义找两个不同的元素像相同。A 在 −300 到 300 的整数上没有相同的像；(n+1)³ − n³ = 3n² + 3n + 1 = 3(n + 1/2)² + 1/4 > 0，第二个分量严格增，所以不同的 n 像不同。' +
      'B 有 −2、−1 都到 0；C 有 (2, 0)、(0, 1) 都到 4；D 把五个元素全算出来是 0、3、1、4、2，两两不同；E 把 8 个子集全算出来，{3} 和 {1, 2} 都到 3。所以只有 A、D 是单射。',
    p2:
      '把 {1,2,3} 到 {1,2,3,4,5} 的映射写成像的三元组，枚举全部 5³ = 125 个，数三个像两两不同的；另用依次选取核对：5 × 4 × 3 = 60。',
    p3:
      '对每个整数 a（−5 到 5）和每个 y 精确地数方程 f(x) = y 的解：x ≤ 1 的一段解是 x = y − a，要 y ≤ 1 + a；x > 1 的一段解是 x = (y + 5)/3，要 y > −2。' +
      '解数作为 y 的函数只在 −2 和 1 + a（都是整数）处变，y 取 −20 到 20 的全部整数和半整数就查遍了各段和分界点。对每个 y 至多一个解就是单射，至少一个解就是满射。' +
      '得到单射的 a：−5、−4、−3；满射的 a：−3 到 5；两者都是的只有 −3。另把每个解代回 f 核对。',
    p4:
      '定义域 0–4 个元素、陪域 0–4 个元素、S 取遍子集（含空集、整个定义域），枚举全部映射，逐个选项找反例。' +
      '选项 A 的反例：一个元素的集合到自身的恒等映射，S = ∅；选项 C 的反例：{0, 1} 到自身的恒等映射，S = {0}，两个限制各只取到一个元素，f 却是满射。' +
      '选项 B、D、E 没有反例；对任意集合照定义也成立：选项 B，两个不同的元素要么同在一边（用那一边的限制是单射），要么各在一边（用两边的像不相等）；' +
      '选项 D，S 中不同的元素也是定义域中不同的元素；选项 E，陪域的每个元素已经是 S 中某个元素的像。所以选 B、D、E。',
  },
  compute() {
    // p1
    const maps = [p1A(), p1B(), p1C(), p1D(), p1E()];
    const hits = maps.map(collision);
    // 反例都核对一遍；没有反例的，有限的已经查遍，无限的只有 A（理由写在 notes 里）
    if (hits[1] === null || hits[2] === null || hits[4] === null) throw new Error('p1 的 B、C、E 应找到反例');
    const value = (m: SampledMap, x: string): string | undefined => m.entries.find(([e]) => e === x)?.[1];
    if (value(maps[1], '-2') !== '0' || value(maps[1], '-1') !== '0') throw new Error('p1 B 的反例不对');
    if (value(maps[2], '2,0') !== '4' || value(maps[2], '0,1') !== '4') throw new Error('p1 C 的反例不对');
    if (value(maps[4], '{3}') !== '3' || value(maps[4], '{1,2}') !== '3') throw new Error('p1 E 的反例不对');
    if (maps[3].entries.map(([, y]) => y).join() !== '0,3,1,4,2') throw new Error('p1 D 的像不对');
    if (!maps[3].exhaustive || !maps[4].exhaustive) throw new Error('p1 D、E 应查遍整个定义域');
    for (const n of ints(-300, 299)) if ((n + 1) ** 3 <= n ** 3) throw new Error('p1 A：n³ 不是严格增');
    const p1 = trueOptions(hits.map((h) => h === null));

    // p2
    const p2 = allMaps(3, 5).filter((f) => injectiveOn(f, [0, 1, 2])).length;
    if (allMaps(3, 5).length !== 125 || p2 !== 5 * 4 * 3) throw new Error('p2 枚举和依次选取不一致');

    // p3
    const injective: number[] = [];
    const surjective: number[] = [];
    for (const a of ints(-5, 5)) {
      const counts = ints(-40, 40).map((twiceY) => solutionCount(a, twiceY));
      if (counts.every((c) => c <= 1)) injective.push(a);
      if (counts.every((c) => c >= 1)) surjective.push(a);
      for (const twiceY of ints(-40, 40)) {
        const y = twiceY / 2;
        const sols = [y - a, (y + 5) / 3].filter((x, i) => (i === 0 ? x <= 1 : x > 1));
        if (sols.length !== solutionCount(a, twiceY)) throw new Error(`p3 a = ${a}、y = ${y} 的解数不一致`);
        if (sols.some((x) => Math.abs(f3(a, x) - y) > 1e-12)) throw new Error(`p3 a = ${a}、y = ${y} 回代不对`);
      }
    }
    if (injective.join() !== '-5,-4,-3') throw new Error(`p3 单射的 a：${injective.join()}`);
    if (surjective.join() !== ints(-3, 5).join()) throw new Error(`p3 满射的 a：${surjective.join()}`);
    const p3: [number, number] = [injective.length, surjective.length];

    // p4
    const found = firstCounterexamples();
    if (!found[0] || !found[2]) throw new Error('p4 的选项 A、C 应找到反例');
    // notes 里写的两个反例单独核对
    const a4: Case4 = { f: [0], n: 1, s: [], rest: [0] };
    const c4: Case4 = { f: [0, 1], n: 2, s: [0], rest: [1] };
    if (P4_OPTIONS[0](a4) || P4_OPTIONS[2](c4)) throw new Error('p4 notes 里写的反例不成立');
    const p4 = trueOptions(found.map((c) => c === null));

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
