// 独立验算 math.logic-sets.image-preimage 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.image-preimage.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** 选项序号（从 1 开始）里判为真的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

// ---- 有限定义域上的映射：子集的像、原像都照定义逐元素算 ----

interface FiniteMap {
  domain: number[];
  rule: (x: number) => number;
}

/** f(A) = {y : 有 x ∈ A 使 f(x) = y}。 */
function image(f: FiniteMap, A: Set<number>): Set<number> {
  const out = new Set<number>();
  for (const x of f.domain) if (A.has(x)) out.add(f.rule(x));
  return out;
}

/** f⁻¹(B) = {x ∈ 定义域 : f(x) ∈ B}。 */
function preimage(f: FiniteMap, B: Set<number>): Set<number> {
  const out = new Set<number>();
  for (const x of f.domain) if (B.has(f.rule(x))) out.add(x);
  return out;
}

function difference(a: Set<number>, b: Set<number>): Set<number> {
  return new Set([...a].filter((x) => !b.has(x)));
}

function intersection(a: Set<number>, b: Set<number>): Set<number> {
  return new Set([...a].filter((x) => b.has(x)));
}

function isSubset(a: Set<number>, b: Set<number>): boolean {
  return [...a].every((x) => b.has(x));
}

function equal(a: Set<number>, b: Set<number>): boolean {
  return isSubset(a, b) && isSubset(b, a);
}

/** 一个有限集合的全部子集（按二进制掩码枚举）。 */
function subsetsOf(u: number[]): Set<number>[] {
  const out: Set<number>[] = [];
  for (let mask = 0; mask < 1 << u.length; mask++) out.push(new Set(u.filter((_, i) => (mask >> i) & 1)));
  return out;
}

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

// ---- p2：x⁴ − 4x² = c 的不同实根个数，用施图姆序列精确地数（系数是有理数，用大整数的分数） ----

interface Frac {
  p: bigint;
  q: bigint; // > 0
}

function gcdBig(a: bigint, b: bigint): bigint {
  if (a < 0n) a = -a;
  if (b < 0n) b = -b;
  while (b) [a, b] = [b, a % b];
  return a;
}

function frac(p: bigint, q = 1n): Frac {
  if (q === 0n) throw new Error('分母是 0');
  if (q < 0n) [p, q] = [-p, -q];
  const g = gcdBig(p, q) || 1n;
  return { p: p / g, q: q / g };
}
const sub = (a: Frac, b: Frac): Frac => frac(a.p * b.q - b.p * a.q, a.q * b.q);
const mul = (a: Frac, b: Frac): Frac => frac(a.p * b.p, a.q * b.q);
const div = (a: Frac, b: Frac): Frac => frac(a.p * b.q, a.q * b.p);
const signOf = (a: Frac): number => (a.p > 0n ? 1 : a.p < 0n ? -1 : 0);

/** 多项式：下标是次数；去掉末尾的 0。 */
type Poly = Frac[];

function trim(p: Poly): Poly {
  const out = [...p];
  while (out.length > 0 && out[out.length - 1].p === 0n) out.pop();
  return out;
}

function derivative(p: Poly): Poly {
  return trim(p.slice(1).map((c, k) => mul(c, frac(BigInt(k + 1)))));
}

/** 多项式带余除法的余式。 */
function remainder(a: Poly, b: Poly): Poly {
  let r = trim(a);
  while (r.length >= b.length && r.length > 0) {
    const k = r.length - b.length;
    const c = div(r[r.length - 1], b[b.length - 1]);
    r = trim(r.map((v, i) => (i >= k ? sub(v, mul(c, b[i - k])) : v)));
  }
  return r;
}

/** 不同实根的个数 = 施图姆序列在 −∞ 处的变号数减去在 +∞ 处的变号数（有重根时也数不同的根）。 */
function distinctRealRoots(p: Poly): number {
  const chain: Poly[] = [trim(p), derivative(p)];
  for (;;) {
    const r = remainder(chain[chain.length - 2], chain[chain.length - 1]);
    if (r.length === 0) break;
    chain.push(r.map((c) => frac(-c.p, c.q)));
  }
  const variations = (atMinusInfinity: boolean): number => {
    const signs = chain.map((q) => {
      const deg = q.length - 1;
      const s = signOf(q[deg]);
      return atMinusInfinity && deg % 2 === 1 ? -s : s;
    });
    let count = 0;
    for (let i = 1; i < signs.length; i++) if (signs[i] !== signs[i - 1]) count++;
    return count;
  };
  return variations(true) - variations(false);
}

/** x⁴ − 4x² − c。 */
function quarticMinus(c: bigint): Poly {
  return [frac(-c), frac(0n), frac(-4n), frac(0n), frac(1n)];
}

// ---- p3：对任意映射、任意子集都成立的说法 ----

type Case3 = { f: FiniteMap; A1: Set<number>; A2: Set<number>; B1: Set<number>; B2: Set<number> };

const P3_OPTIONS: ((c: Case3) => boolean)[] = [
  // A. f(A1) ∖ f(A2) ⊆ f(A1 ∖ A2)
  ({ f, A1, A2 }) => isSubset(difference(image(f, A1), image(f, A2)), image(f, difference(A1, A2))),
  // B. f(A1 ∖ A2) ⊆ f(A1) ∖ f(A2)
  ({ f, A1, A2 }) => isSubset(image(f, difference(A1, A2)), difference(image(f, A1), image(f, A2))),
  // C. f⁻¹(B1 ∖ B2) = f⁻¹(B1) ∖ f⁻¹(B2)
  ({ f, B1, B2 }) => equal(preimage(f, difference(B1, B2)), difference(preimage(f, B1), preimage(f, B2))),
  // D. 若 f⁻¹(B1) ⊆ f⁻¹(B2)，则 B1 ⊆ B2
  ({ f, B1, B2 }) => !isSubset(preimage(f, B1), preimage(f, B2)) || isSubset(B1, B2),
  // E. 若 B1 ∩ B2 = ∅，则 f⁻¹(B1) ∩ f⁻¹(B2) = ∅
  ({ f, B1, B2 }) => intersection(B1, B2).size > 0 || intersection(preimage(f, B1), preimage(f, B2)).size === 0,
];

/** X = {1,…,nx}、Y = {1,…,ny} 上的全部映射（nx 可以是 0：那时只有一个空映射；ny = 0 而 nx > 0 时没有映射）。 */
function allMaps(nx: number, ny: number): FiniteMap[] {
  const out: FiniteMap[] = [];
  const total = ny ** nx;
  for (let code = 0; code < total; code++) {
    const values: number[] = [];
    let c = code;
    for (let k = 0; k < nx; k++) {
      values.push((c % ny) + 1);
      c = Math.floor(c / ny);
    }
    out.push({ domain: range(1, nx), rule: (x) => values[x - 1] });
  }
  return out;
}

export const verification: Verification = {
  lesson: 'math.logic-sets.image-preimage',
  notes: {
    p1:
      '把 X = {1,…,20} 逐个代进「除以 6 的余数」，照定义收集 f(A)（A = {1,…,10}）和 f⁻¹({1,4})（X 里余数是 1 或 4 的元素），数个数。' +
      'f(A) = {0,1,2,3,4,5}（余数 0 由 6 给出，10 的余数 4 已经有了），f⁻¹({1,4}) = {1,4,7,10,13,16,19}。' +
      '另按余数类核对：X 里余数 1 的有 1、7、13、19 四个，余数 4 的有 4、10、16 三个。',
    p2:
      'f⁻¹({c}) 的元素就是 x⁴ − 4x² − c 的不同实根。用有理系数的施图姆序列精确地数不同实根的个数（重根只数一次）：c = 0、−4、−5 各得 3、2、0。' +
      '另令 u = x² ≥ 0 手算：u² − 4u − c = 0，u = 2 ± √(4 + c)；c = 0 时 u = 0、4，x = 0、±2；c = −4 时只有 u = 2，x = ±√2；c = −5 时判别式为负，没有 u。' +
      '再在 [−3, 3] 上以 1/1000 为步长扫一遍，f 的最小值是 −4，和 c = −5 无解一致。',
    p3:
      '枚举 |X|、|Y| 各从 0 到 3 的全部映射 f 和全部子集组 (A1, A2)、(B1, B2)，五个说法逐组照定义判，组组成立的才算一定成立。' +
      '有限枚举够用：A、C、E 若在某个映射上不成立，取出那个出问题的点 x（或 y = f(x) 的一个原像）单独留下，X、Y 各剩一个元素，反例还在，所以在一个元素的情形就会出现；B、D 不成立的反例在枚举里找到。' +
      '反例：B 取 X = {1,2}、f 恒为 1、A1 = {1}、A2 = {2}（左边 {1}，右边 ∅）；D 取 X = {1}、Y = {1,2}、f(1) = 1、B1 = {2}、B2 = ∅（两个原像都是 ∅，而 2 不属于 ∅）。',
    p4:
      '枚举 X = {1,…,10} 的全部 2¹⁰ = 1024 个子集 A，照定义先算 f(A)（f(n) 是 n 的正因数个数，逐个试除），再算 f⁻¹(f(A))，数恰好等于 A 的个数。' +
      '另按 {1}、{2}、{3}、{4} 的原像核对：f 的值是 1、2、3、4，这四个集合的原像是 {1}、{2,3,5,7}、{4,9}、{6,8,10}，满足条件的 A 就是其中若干块的并（含 ∅），共 2⁴ 个。',
  },
  compute() {
    // ---- p1 ----
    const X1 = range(1, 20);
    const f1: FiniteMap = { domain: X1, rule: (n) => n % 6 };
    const fA = image(f1, new Set(range(1, 10)));
    const pre1 = preimage(f1, new Set([1, 4]));
    if ([...fA].sort((a, b) => a - b).join(',') !== '0,1,2,3,4,5') throw new Error('p1：f(A) 和手算的不一致');
    if ([...pre1].sort((a, b) => a - b).join(',') !== '1,4,7,10,13,16,19') throw new Error('p1：原像和手算的不一致');
    const class1 = X1.filter((n) => (n - 1) % 6 === 0).length;
    const class4 = X1.filter((n) => n >= 4 && (n - 4) % 6 === 0).length;
    if (class1 !== 4 || class4 !== 3 || pre1.size !== class1 + class4) throw new Error('p1：按余数类数出的个数不一致');
    const p1 = [fA.size, pre1.size];

    // ---- p2 ----
    const p2 = [0n, -4n, -5n].map((c) => distinctRealRoots(quarticMinus(c)));
    // 施图姆序列自检：x² − 1 有两个实根，x² + 1 没有，(x − 1)² 只有一个不同的实根
    const check: [Poly, number][] = [
      [[frac(-1n), frac(0n), frac(1n)], 2],
      [[frac(1n), frac(0n), frac(1n)], 0],
      [[frac(1n), frac(-2n), frac(1n)], 1],
    ];
    for (const [poly, expected] of check) if (distinctRealRoots(poly) !== expected) throw new Error('p2：施图姆序列自检失败');
    // 手算核对：u = x² 的非负解 → x 的个数（u = 0 给一个，u > 0 给两个）
    const byHand = [0, -4, -5].map((c) => {
      const d = 4 + c;
      if (d < 0) return 0;
      const us = d === 0 ? [2] : [2 - Math.sqrt(d), 2 + Math.sqrt(d)];
      return us.reduce((s, u) => s + (u > 0 ? 2 : u === 0 ? 1 : 0), 0);
    });
    if (byHand.join(',') !== p2.join(',')) throw new Error(`p2：两种算法不一致：${byHand.join(',')}、${p2.join(',')}`);
    let min2 = Infinity;
    for (let k = -3000; k <= 3000; k++) {
      const x = k / 1000;
      min2 = Math.min(min2, x ** 4 - 4 * x ** 2);
    }
    if (min2 < -4 - 1e-9 || min2 > -4 + 1e-5) throw new Error('p2：f 的最小值不是 −4');

    // ---- p3 ----
    const verdict = P3_OPTIONS.map(() => true);
    let cases = 0;
    for (let nx = 0; nx <= 3; nx++)
      for (let ny = 0; ny <= 3; ny++) {
        const subsX = subsetsOf(range(1, nx));
        const subsY = subsetsOf(range(1, ny));
        for (const f of allMaps(nx, ny))
          for (const A1 of subsX)
            for (const A2 of subsX)
              for (const B1 of subsY)
                for (const B2 of subsY) {
                  cases++;
                  P3_OPTIONS.forEach((opt, i) => {
                    if (!opt({ f, A1, A2, B1, B2 })) verdict[i] = false;
                  });
                }
      }
    if (cases < 100000) throw new Error('p3：枚举的组数比预期少');
    // notes 里写的反例要真的起作用
    const const1: FiniteMap = { domain: [1, 2], rule: () => 1 };
    const none = new Set<number>();
    if (P3_OPTIONS[1]({ f: const1, A1: new Set([1]), A2: new Set([2]), B1: none, B2: none })) throw new Error('p3：B 的反例没起作用');
    const oneToOne: FiniteMap = { domain: [1], rule: () => 1 };
    if (P3_OPTIONS[3]({ f: oneToOne, A1: none, A2: none, B1: new Set([2]), B2: none })) throw new Error('p3：D 的反例没起作用');
    const p3 = trueOptions(verdict);

    // ---- p4 ----
    const X4 = range(1, 10);
    const divisors = (n: number): number => range(1, n).filter((d) => n % d === 0).length;
    const f4: FiniteMap = { domain: X4, rule: divisors };
    let p4 = 0;
    for (const A of subsetsOf(X4)) if (equal(preimage(f4, image(f4, A)), A)) p4++;
    const values = [...image(f4, new Set(X4))];
    const fibres = values.sort((a, b) => a - b).map((v) => [...preimage(f4, new Set([v]))].join(','));
    if (fibres.join(' | ') !== '1 | 2,3,5,7 | 4,9 | 6,8,10') throw new Error(`p4：{1} 到 {4} 的原像是 ${fibres.join(' | ')}`);
    if (p4 !== 2 ** fibres.length) throw new Error('p4：枚举和按 {1} 到 {4} 的原像算的不一致');

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'choice', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
