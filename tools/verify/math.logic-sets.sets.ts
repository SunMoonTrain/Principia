// 独立验算 math.logic-sets.sets 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.sets.ts

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';

// ---- 有限集合（元素可以是整数，也可以是集合）的一个小模型 ----

/** 一个元素：整数，或者一个有限集合。 */
type Elem = number | FinSet;

/** 有限集合：用排好序、去了重的元素表示，这样「相等」就是规范写法相同。 */
interface FinSet {
  kind: 'set';
  elems: Elem[];
}

/** 元素的规范写法：整数写成数字，集合写成花括号里排好序、去重的元素。 */
function key(e: Elem): string {
  if (typeof e === 'number') return String(e);
  return '{' + e.elems.map(key).join(',') + '}';
}

/** 按列举法造一个集合：不计顺序、不计重复。 */
function set(...elems: Elem[]): FinSet {
  const byKey = new Map<string, Elem>();
  for (const e of elems) byKey.set(key(e), e);
  const sorted = [...byKey.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([, e]) => e);
  return { kind: 'set', elems: sorted };
}

/** x ∈ A：A 的某个元素和 x 相等（规范写法相同）。 */
function member(x: Elem, a: FinSet): boolean {
  const k = key(x);
  return a.elems.some((e) => key(e) === k);
}

/** B ⊆ A：B 的每个元素都属于 A（B 是空集时没有要查的元素，空真）。 */
function subset(b: FinSet, a: FinSet): boolean {
  return b.elems.every((e) => member(e, a));
}

/** 一个有限集合的元素个数。 */
function size(a: FinSet): number {
  return a.elems.length;
}

// ---- p4 用的精确判断 ----

/** 实数 x = num/den 是否满足 x² − 3x + 2 = 0：两边乘 den²，全用整数算。 */
function satisfiesQuadratic(num: number, den: number): boolean {
  return num * num - 3 * num * den + 2 * den * den === 0;
}

export const verification: Verification = {
  lesson: 'math.logic-sets.sets',
  notes: {
    p1:
      '把集合存成去重、排序后的元素表（元素可以是整数或集合），相等就是规范写法相同；∈ 查 A 的元素里有没有它，⊆ 逐个查左边的每个元素是否属于 A，' +
      '五个选项照字面逐条判。（第 1 轮修订换了集合和选项次序，复核时重写）A 的元素是 1、{2}、{1,2}：数 2 不是 A 的元素，所以 {1,2} 是 A 的元素却不是子集；{1,{2}} 的元素 1、{2} 都在 A 里；∅ 不是 A 的元素。',
    p2: '对 k = −3, −2, …, 3 逐个算 k² − k（12, 6, 2, 0, 0, 2, 6），放进集合去掉重复，再数元素个数。',
    p3: '把 {1,…,6} 的 64 个子集用 6 位二进制数枚举，逐个查 {1,2} ⊊ X（包含且不相等）和 X ⊊ {1,…,6}，数满足两条的个数。',
    p4:
      'A 用 rootsOf 在 [−10, 10] 上数值求 x² − 3x + 2 的零点，再四舍五入成整数、代回原式用整数核对（得 {1, 2}）。' +
      '对 a 扫遍分母 1–24、|a| ≤ 10 的全部有理数（含 0）：a = 0 时 0·x = 2 无解，B 是空集；a ≠ 0 时 B = {2/a}，用整数精确判断 2/a 是否属于 A。' +
      '只有使 B ⊆ A 成立的 a 留下；a ≠ 0 时 2/a 必须是 A 的元素，所以网格外不会有别的解，网格只是再核一遍。' +
      '（第 1 轮修订把题改成问这样的 a 有几个，复核时改成返回留下的 a 的个数。）',
  },
  compute() {
    // p1：A = {1, {2}, {1,2}}
    const A1 = set(1, set(2), set(1, 2));
    if (size(A1) !== 3) throw new Error('p1 的 A 应有 3 个元素');
    const options1: boolean[] = [
      member(set(1, 2), A1), // A. {1,2} ∈ A
      member(set(), A1), // B. ∅ ∈ A
      subset(set(1, 2), A1), // C. {1,2} ⊆ A
      subset(set(1, set(2)), A1), // D. {1,{2}} ⊆ A
      subset(set(set(1, 2)), A1), // E. {{1,2}} ⊆ A
    ];
    const p1 = options1.flatMap((t, i) => (t ? [i + 1] : []));

    // p2：{k² − k : k ∈ Z, −3 ≤ k ≤ 3} 的元素个数
    const values: number[] = [];
    for (let k = -3; k <= 3; k++) values.push(k * k - k);
    const p2 = size(set(...values));

    // p3：满足 {1,2} ⊊ X ⊊ {1,…,6} 的 X 的个数
    const U = set(1, 2, 3, 4, 5, 6);
    const S = set(1, 2);
    let p3 = 0;
    for (let mask = 0; mask < 1 << 6; mask++) {
      const X = set(...[1, 2, 3, 4, 5, 6].filter((_, i) => (mask >> i) & 1));
      const properSuper = subset(S, X) && key(S) !== key(X);
      const properSub = subset(X, U) && key(X) !== key(U);
      if (properSuper && properSub) p3++;
    }

    // p4：A = {x ∈ R : x² − 3x + 2 = 0}，B = {x ∈ R : ax = 2}，使 B ⊆ A 的实数 a 有几个
    const rootsA = rootsOf((x) => x * x - 3 * x + 2, -10, 10, 4001).map((r) => Math.round(r));
    for (const r of rootsA) if (!satisfiesQuadratic(r, 1)) throw new Error(`数值根 ${r} 代回不满足方程`);
    const A4 = [...new Set(rootsA)].sort((a, b) => a - b);
    if (A4.length !== 2) throw new Error('A 的元素个数不对');

    const found = new Map<string, number>();
    const maxDen = 24;
    for (let q = 1; q <= maxDen; q++) {
      for (let p = -10 * q; p <= 10 * q; p++) {
        // a = p/q
        let bSubsetA: boolean;
        if (p === 0) {
          // 0·x = 2 对任何实数 x 都不成立：B 是空集，空集是任何集合的子集
          bSubsetA = true;
        } else {
          // B = {2/a} = {2q/p}，判断 2q/p 是否满足 x² − 3x + 2 = 0
          bSubsetA = satisfiesQuadratic(2 * q, p);
        }
        if (bSubsetA) {
          const a = p / q;
          found.set(a.toFixed(12), a);
        }
      }
    }
    const p4 = found.size;
    // 网格外的 a ≠ 0 若满足，2/a 就是 A 的元素，a 只能是 2/1 或 2/2，都在网格里
    for (const r of A4) if (![...found.values()].some((a) => Math.abs(a - 2 / r) < 1e-12)) throw new Error('漏了 2/r');

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
