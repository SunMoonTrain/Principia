// 独立验算 math.logic-sets.set-operations 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.set-operations.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

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

const EMPTY = set();

/** x ∈ A。 */
function member(x: Elem, a: FinSet): boolean {
  const k = key(x);
  return a.elems.some((e) => key(e) === k);
}

/** 两个集合相等：规范写法相同（等价于互相包含）。 */
function equal(a: FinSet, b: FinSet): boolean {
  return key(a) === key(b);
}

/** 并集、交集、差集都照定义逐元素判断。 */
function union(a: FinSet, b: FinSet): FinSet {
  return set(...a.elems, ...b.elems);
}
function intersection(a: FinSet, b: FinSet): FinSet {
  return set(...a.elems.filter((x) => member(x, b)));
}
function difference(a: FinSet, b: FinSet): FinSet {
  return set(...a.elems.filter((x) => !member(x, b)));
}
/** 相对全集 U 的补集：U ∖ A。 */
function complement(u: FinSet, a: FinSet): FinSet {
  return difference(u, a);
}

/** 一个有限集合的全部子集（按二进制掩码枚举）。 */
function subsetsOf(u: FinSet): FinSet[] {
  const n = u.elems.length;
  const out: FinSet[] = [];
  for (let mask = 0; mask < 1 << n; mask++) out.push(set(...u.elems.filter((_, i) => (mask >> i) & 1)));
  return out;
}

/** 选项序号（从 1 开始）里判为恒成立的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

// ---- p2：对任何全集 U 和 U 的任何子集 A 都成立的等式 ----

/** 检验用的全集：空集、一两三个整数，以及元素里有空集的 {∅, 1}（看 D 的 {∅} 会不会偶然对上）。 */
const P2_UNIVERSES: FinSet[] = [EMPTY, set(1), set(1, 2), set(1, 2, 3), set(EMPTY, 1)];

const P2_OPTIONS: ((u: FinSet, a: FinSet) => boolean)[] = [
  (_u, a) => equal(difference(a, EMPTY), EMPTY), // A. A ∖ ∅ = ∅
  (u, a) => equal(union(a, complement(u, a)), u), // B. A ∪ Aᶜ = U
  (_u, a) => equal(intersection(a, EMPTY), a), // C. A ∩ ∅ = A
  (_u, a) => equal(difference(a, a), set(EMPTY)), // D. A ∖ A = {∅}
  (u, a) => equal(complement(u, complement(u, a)), a), // E. (Aᶜ)ᶜ = A
];

// ---- p3：对任何集合 A、B、C 都成立的等式 ----

const P3_OPTIONS: ((a: FinSet, b: FinSet, c: FinSet) => boolean)[] = [
  (a, b, c) => equal(difference(a, union(b, c)), intersection(difference(a, b), difference(a, c))), // A
  (a, b) => equal(difference(a, difference(a, b)), intersection(a, b)), // B
  (a, b) => equal(union(difference(a, b), b), a), // C
  (a, b, c) => equal(intersection(a, difference(b, c)), difference(intersection(a, b), c)), // D
  (a, b, c) => equal(union(a, difference(b, c)), difference(union(a, b), c)), // E
];

// ---- p4：区间用端点和开闭判断，整数的属于关系是精确的 ----

/** A = [−3, 2)：−3 ≤ x < 2。 */
function inA4(x: number): boolean {
  return -3 <= x && x < 2;
}
/** B = (0, 5]：0 < x ≤ 5。 */
function inB4(x: number): boolean {
  return 0 < x && x <= 5;
}
/** (A ∖ B) ∪ (B ∖ A)：照题面的式子先算两个差集，再取并。 */
function inSymDiff4(x: number): boolean {
  const aMinusB = inA4(x) && !inB4(x);
  const bMinusA = inB4(x) && !inA4(x);
  return aMinusB || bMinusA;
}

export const verification: Verification = {
  lesson: 'math.logic-sets.set-operations',
  notes: {
    p1:
      '把 U = {1,…,20}、A（2 的倍数）、B（3 的倍数）存成有限集合，按定义算 A ∪ B 和它在 U 里的补集 U ∖ (A ∪ B)，数元素个数；' +
      '另用容斥核对：|A| = 10、|B| = 6、|A ∩ B| = 3（6 的倍数），20 − (10 + 6 − 3) = 7，补集是 {1,5,7,11,13,17,19}。',
    p2:
      '在 5 个全集 U = ∅、{1}、{1,2}、{1,2,3}、{∅,1} 上枚举 U 的每个子集 A（共 1+2+4+8+4 = 19 组），五个等式逐组按定义算两边、比较是否相等，组组都成立的才算。' +
      '反例：A 取 A = {1}（A ∖ ∅ = {1} ≠ ∅），C 取 A = {1}（A ∩ ∅ = ∅ ≠ {1}），D 任何 A 都不成立（A ∖ A = ∅，而 {∅} 有一个元素 ∅）；' +
      'A、C 只在 A = ∅ 时成立（U = ∅ 时 A 只能是 ∅），所以要用非空的 A 才找得到反例。',
    p3:
      '取 U = {1,2,3}，枚举 A、B、C 的全部 8×8×8 = 512 组子集，五个等式逐组按定义算两边比较。这类只用 ∪、∩、∖ 的等式逐元素判断，' +
      '每个元素属于 A、B、C 的 8 种情形在 512 组里都出现，组组成立就是恒成立。' +
      '反例：C 取 A = ∅、B = {1}（左边 {1}，右边 ∅；一般左边是 A ∪ B）；E 取 A = {1}、B = ∅、C = {1}（左边 {1}，右边 ∅）。',
    p4:
      'A = [−3,2) 写成 −3 ≤ x < 2，B = (0,5] 写成 0 < x ≤ 5，照题面先算 A ∖ B、B ∖ A 再取并；对 −50 到 50 的整数逐个判断属于关系（整数比较是精确的），数属于的个数。' +
      '另在 [−6,8] 上按 1/1000 的步长取点，核对这个集合就是 [−3,0] ∪ [2,5]（端点 0、2 属于，开端点不进来），其中整数 −3,−2,−1,0,2,3,4,5 共 8 个。',
  },
  compute() {
    // p1
    const U1 = set(...Array.from({ length: 20 }, (_, i) => i + 1));
    const A1 = set(...U1.elems.filter((x) => (x as number) % 2 === 0));
    const B1 = set(...U1.elems.filter((x) => (x as number) % 3 === 0));
    const comp1 = complement(U1, union(A1, B1));
    const p1 = comp1.elems.length;
    const byInclusionExclusion = U1.elems.length - (A1.elems.length + B1.elems.length - intersection(A1, B1).elems.length);
    if (p1 !== byInclusionExclusion) throw new Error('p1 逐元素数出的个数和容斥算的不一致');
    if (key(comp1) !== key(set(1, 5, 7, 11, 13, 17, 19))) throw new Error('p1 的补集和手算的不一致');

    // p2
    const p2Results = P2_OPTIONS.map((opt) => P2_UNIVERSES.every((u) => subsetsOf(u).every((a) => opt(u, a))));
    // 反例核对：A、C 在 A = {1} 时不成立，D 对 A = ∅ 也不成立
    if (P2_OPTIONS[0](set(1), set(1))) throw new Error('p2 A 的反例没起作用');
    if (P2_OPTIONS[2](set(1), set(1))) throw new Error('p2 C 的反例没起作用');
    if (P2_OPTIONS[3](EMPTY, EMPTY)) throw new Error('p2 D 的反例没起作用');
    const p2 = trueOptions(p2Results);

    // p3
    const U3 = set(1, 2, 3);
    const subs3 = subsetsOf(U3);
    const p3Results = P3_OPTIONS.map((opt) => subs3.every((a) => subs3.every((b) => subs3.every((c) => opt(a, b, c)))));
    if (P3_OPTIONS[2](EMPTY, set(1), EMPTY)) throw new Error('p3 C 的反例没起作用');
    if (P3_OPTIONS[4](set(1), EMPTY, set(1))) throw new Error('p3 E 的反例没起作用');
    const p3 = trueOptions(p3Results);

    // p4
    let p4 = 0;
    const ints: number[] = [];
    for (let k = -50; k <= 50; k++) {
      if (inSymDiff4(k)) {
        p4++;
        ints.push(k);
      }
    }
    if (ints.join(',') !== '-3,-2,-1,0,2,3,4,5') throw new Error(`p4 数出的整数是 ${ints.join(',')}`);
    // 核对集合的形状：[−3,0] ∪ [2,5]，用整数步长 /1000 避免浮点误差
    for (let m = -6000; m <= 8000; m++) {
      const x = m / 1000;
      const expected = (m >= -3000 && m <= 0) || (m >= 2000 && m <= 5000);
      if (inSymDiff4(x) !== expected) throw new Error(`p4 在 x = ${x} 处和 [−3,0] ∪ [2,5] 不一致`);
    }

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'choice', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
