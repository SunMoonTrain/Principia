// 独立验算 math.logic-sets.axiom-of-choice 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.axiom-of-choice.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** 选项序号（从 1 开始）里判为「是」的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

/** 可重复的伪随机数（线性同余），只用来造检验用的样本。 */
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function shuffled<T>(xs: T[], rng: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- p1：规则要写得出来，而且证得出对族里每个集合都挑出恰好一个元素 ----

/** B：由整数组成的非空集合，取绝对值最小的；n 和 −n 都最小时取正的。 */
function pickInteger(xs: number[]): number[] {
  let m = Infinity;
  for (const x of xs) m = Math.min(m, Math.abs(x));
  const least = xs.filter((x) => Math.abs(x) === m);
  return least.includes(m) ? [m] : least; // 两个都最小时取正的
}

/** C：三个不同的实数，取中间的（最小的、最大的也行）。 */
function pickMiddle(xs: number[]): number[] {
  return xs.filter((x) => xs.some((y) => y < x) && xs.some((y) => y > x));
}

/** E：两个不同的映射 N→N，取第一处取值不同的地方值较小的那个。映射在样本里用前若干项的数组表示。 */
function pickSequence(xs: number[][]): number[][] {
  const [f, g] = xs;
  for (let n = 0; n < Math.min(f.length, g.length); n++) if (f[n] !== g[n]) return f[n] < g[n] ? [f] : [g];
  return [];
}

// ---- p3：有限的布尔格里逐条链查上界；无限的给出一条没有上界的链 ----

/** {0,…,n−1} 的子集里元素个数不超过 k 的，用位掩码表示。 */
function smallSubsets(n: number, k: number): number[] {
  const out: number[] = [];
  for (let m = 0; m < 1 << n; m++) {
    let c = 0;
    for (let i = 0; i < n; i++) c += (m >> i) & 1;
    if (c <= k) out.push(m);
  }
  return out;
}

const isSubset = (a: number, b: number): boolean => (a & ~b) === 0;

/** 列出有限偏序集的全部非空链，逐条查有没有上界；返回（链的条数，没有上界的链的条数）。 */
function chainsWithoutBound(elems: number[], le: (a: number, b: number) => boolean): [number, number] {
  let total = 0;
  let bad = 0;
  // 链按从小到大列出：每次接上一个严格大于末尾元素的元素，这样每条链恰好出现一次
  const extend = (chain: number[]): void => {
    total++;
    if (!elems.some((u) => chain.every((c) => le(c, u)))) bad++;
    const last = chain[chain.length - 1];
    for (const x of elems) if (x !== last && le(last, x)) extend([...chain, x]);
  };
  for (const x of elems) extend([x]);
  return [total, bad];
}

// ---- p4：部分选择函数的偏序集，照定义列出来数 ----

interface Partial_ {
  /** 定义域 J 里的指标和取的值；没有定义的指标不出现。 */
  map: Map<number, string>;
}

/** (J, f) ⪯ (K, g)：J ⊆ K，并且 f、g 在 J 上取值相同。 */
function extendedBy(a: Partial_, b: Partial_): boolean {
  for (const [i, v] of a.map) if (b.map.get(i) !== v) return false;
  return true;
}

/** 列出 (J, f)：J 是指标集的非空子集，f 在每个 i ∈ J 处取 A_i 的一个元素。 */
function partialChoices(family: string[][]): Partial_[] {
  const out: Partial_[] = [];
  const n = family.length;
  for (let mask = 1; mask < 1 << n; mask++) {
    const J = Array.from({ length: n }, (_, i) => i).filter((i) => (mask >> i) & 1);
    let maps: Map<number, string>[] = [new Map()];
    for (const i of J) maps = maps.flatMap((m) => family[i].map((a) => new Map(m).set(i, a)));
    for (const m of maps) out.push({ map: m });
  }
  return out;
}

function countPoset(family: string[][]): [number, number, number] {
  const P = partialChoices(family);
  // 照定义验三条：自反、反对称、传递
  for (const a of P) if (!extendedBy(a, a)) throw new Error('p4 不自反');
  for (const a of P) for (const b of P) if (a !== b && extendedBy(a, b) && extendedBy(b, a)) throw new Error('p4 不反对称');
  for (const a of P)
    for (const b of P) if (extendedBy(a, b)) for (const c of P) if (extendedBy(b, c) && !extendedBy(a, c)) throw new Error('p4 不传递');
  const minimal = P.filter((m) => !P.some((x) => x !== m && extendedBy(x, m)));
  const maximal = P.filter((m) => !P.some((x) => x !== m && extendedBy(m, x)));
  return [P.length, minimal.length, maximal.length];
}

export const verification: Verification = {
  lesson: 'math.logic-sets.axiom-of-choice',
  notes: {
    p1:
      '判「写得出」的 B、C、E 各写出一条规则，在随机造的集合上跑，查每次恰好挑出一个元素、挑的是集合里的元素、和列元素的先后无关：' +
      'B 取绝对值最小的（n 和 −n 都在时取正的；每个非空整数集都有绝对值最小的数，是良序原理），C 取三个实数里中间的，E 取第一处取值不同处值较小的映射（两个映射不同，取值不同的 n 组成非空集合，有最小的）。' +
      '判「写不出」的 A、D 先看现成的规则坏在哪：A 照 E 的办法要「最小的取值不同处」，f = 0 和 g = 区间 (0,1) 的指示函数取值不同处是 (0,1)，没有最小的数；' +
      'D 把子集写成 0、1 数列按字典序取最小的，集合 {{n, n+1, …} : n ∈ N} 里每一个后面都有字典序更小的，没有最小的。' +
      '没有别的规则是力迫法的定理：往任一可数模型里加两组两两不同的科恩实数 (a_n)、(b_n)，X = {a_n}、Y = {b_n}，交换两组（再各自错开有限个下标）的自同构把 {X, Y} 变成自己而交换 X、Y，' +
      '所以没有不带参数的公式能从 {X, Y} 里定出一个，指示函数 1_X、1_Y 就是 A 的一族；同样的自同构说明从 {a_n : n} 里定不出一个，这是 D 的一族。',
    p2:
      '把并集 {1,…,6} 上的全部映射 {1,2,3} → {1,…,6}（6³ = 216 个）逐个列出，数满足 f(1) ∈ A_1、f(2) ∈ A_2、f(3) ∈ A_3 的个数；另用 3·4·2 = 24 核对。' +
      '也核对了值可以重复（f(1) = f(2) 的也算），不要求单射。',
    p3:
      'A：对 {0,…,5} 的元素个数 ≤ 5 的子集（63 个）列出全部非空链，逐条查上界；另对 {0,…,6}、≤ 3 再查一遍；一般的 N：链里元素个数不同的才互相真包含，个数 ≤ 5，所以非空链里元素个数最多的那个包含其余的，就是上界。' +
      'B：链 {0} ⊂ {0,1} ⊂ … 对每个有限集 F ⊆ {0,…,9} 都有一项不含在 F 里。C：同一条链，N 的真子集都含在某个 N∖{k} 里，而 {0,…,k} 不含在 N∖{k} 里（查 k < 200）。' +
      'D：链 1 | 2 | 4 | …，对每个 u ≤ 2000 有 2^m ∤ u（2^m > u 时）。E：1 整除每个正整数，1 是最大元，所以每条链（连同整个 N^+）都以 1 为上界。',
    p4:
      '取 A_1 = {a1,a2}、A_2 = {b1,b2,b3}、A_3 = {c1,c2}，列出全部 (J, f)（J 是 {1,2,3} 的非空子集），照定义查「J ⊆ K 并且 f、g 在 J 上处处相同」规定的 (J, f) ⪯ (K, g) 是偏序，再照定义数极小元（没有别的元素 ⪯ 它）和极大元（它 ⪯ 的只有自己）。' +
      '另核对：元素个数 (2+1)(3+1)(2+1) − 1 = 35，极小元是 J 只有一个指标的 2+3+2 = 7 个，极大元是 J = I 的 2·3·2 = 12 个。三个集合有公共元素时（A_1 = {a,b}、A_2 = {a,b,c}、A_3 = {b,c}）再数一遍，三个数不变。',
  },
  compute() {
    // p1
    const rng = makeRng(20261125);
    for (let t = 0; t < 2000; t++) {
      const k = 1 + Math.floor(rng() * 8);
      const s = new Set<number>();
      while (s.size < k) s.add(Math.floor(rng() * 41) - 20);
      const xs = [...s];
      const p = pickInteger(xs);
      const q = pickInteger(shuffled(xs, rng));
      if (p.length !== 1 || !xs.includes(p[0]) || q.length !== 1 || q[0] !== p[0]) throw new Error('p1 B 的规则不管用');
    }
    if (pickInteger([-3, 3])[0] !== 3 || pickInteger([-3, 5])[0] !== -3) throw new Error('p1 B 的规则在 ±n 处不对');
    for (let t = 0; t < 2000; t++) {
      const xs = [rng() * 20 - 10, rng() * 20 - 10, rng() * 20 - 10];
      if (new Set(xs).size < 3) continue;
      const p = pickMiddle(xs);
      const q = pickMiddle(shuffled(xs, rng));
      if (p.length !== 1 || q.length !== 1 || p[0] !== q[0]) throw new Error('p1 C 的规则不管用');
    }
    for (let t = 0; t < 2000; t++) {
      const f = Array.from({ length: 30 }, () => Math.floor(rng() * 3));
      const g = [...f];
      const at = Math.floor(rng() * 30);
      g[at] = f[at] + 1 + Math.floor(rng() * 3); // 第一处不同在 at
      for (let i = at + 1; i < 30; i++) g[i] = Math.floor(rng() * 3);
      const p = pickSequence([f, g]);
      const q = pickSequence([g, f]);
      if (p.length !== 1 || q.length !== 1 || p[0] !== q[0] || p[0] !== f) throw new Error('p1 E 的规则不管用');
    }
    // A 的现成规则坏在没有「第一处」：0 和 (0,1) 的指示函数，取值不同处 (0,1) 里每个 x 都有更小的 x/2
    const indicator = (x: number): number => (x > 0 && x < 1 ? 1 : 0);
    for (const x of [0.9, 0.5, 1e-3, 1e-9]) if (!(indicator(x) !== 0 && indicator(x / 2) !== 0)) throw new Error('p1 A 的例子没起作用');
    // D 的现成规则坏在没有「字典序最小」：{n, n+1, …} 的 0、1 数列是 n 个 0 后面全是 1，n 越大字典序越小
    const lexLess = (a: number[], b: number[]): boolean => {
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i];
      return false;
    };
    const tail = (n: number): number[] => Array.from({ length: 40 }, (_, i) => (i >= n ? 1 : 0));
    for (let n = 0; n < 38; n++) if (!lexLess(tail(n + 1), tail(n))) throw new Error('p1 D 的例子没起作用');
    const p1 = trueOptions([false, true, true, false, true]);

    // p2
    const sets2 = [
      [1, 2, 3],
      [1, 2, 3, 4],
      [5, 6],
    ];
    let p2 = 0;
    let repeated = 0;
    for (let a = 1; a <= 6; a++)
      for (let b = 1; b <= 6; b++)
        for (let c = 1; c <= 6; c++)
          if (sets2[0].includes(a) && sets2[1].includes(b) && sets2[2].includes(c)) {
            p2++;
            if (a === b) repeated++;
          }
    if (p2 !== 3 * 4 * 2) throw new Error(`p2 逐个数出 ${p2}`);
    if (repeated === 0) throw new Error('p2 应有 f(1) = f(2) 的选择函数');

    // p3
    const [tA, badA] = chainsWithoutBound(smallSubsets(6, 5), isSubset);
    const [tA2, badA2] = chainsWithoutBound(smallSubsets(7, 3), isSubset);
    if (tA < 1000 || tA2 < 500) throw new Error('p3 A 列出的链太少');
    const optionA = badA === 0 && badA2 === 0;
    // B：每个有限集 F 都不是 {0} ⊂ {0,1} ⊂ … 的上界
    let boundB = false;
    for (let F = 0; F < 1 << 10; F++) {
      let isBound = true;
      for (let n = 0; n <= 10; n++) if (!isSubset((1 << (n + 1)) - 1, F)) isBound = false;
      if (isBound) boundB = true;
    }
    const optionB = boundB; // 有上界才算满足；这条链没有上界
    // C：极大的真子集是 N∖{k}，都不是这条链的上界
    let boundC = false;
    for (let k = 0; k < 200; k++) {
      const contains = (x: number): boolean => x !== k; // X = N∖{k}
      let isBound = true;
      for (let n = 0; n <= 200; n++) for (let x = 0; x <= n; x++) if (!contains(x)) isBound = false;
      if (isBound) boundC = true;
    }
    const optionC = boundC;
    // D：1 | 2 | 4 | …，每个 u 都不是上界
    let boundD = false;
    for (let u = 1; u <= 2000; u++) {
      let isBound = true;
      for (let m = 0; m <= 20; m++) if (u % 2 ** m !== 0) isBound = false;
      if (isBound) boundD = true;
    }
    const optionD = boundD;
    // E：a ⪯ 1 就是 1 | a，对每个 a 都成立，1 是每条链的上界
    let optionE = true;
    for (let a = 1; a <= 2000; a++) if (a % 1 !== 0) optionE = false;
    // 在 {1,…,12} 上把非空链列出来再查一遍（a ⪯ b 就是 b | a）
    const [, badE] = chainsWithoutBound(Array.from({ length: 12 }, (_, i) => i + 1), (a, b) => a % b === 0);
    if (badE !== 0) optionE = false;
    const p3 = trueOptions([optionA, optionB, optionC, optionD, optionE]);

    // p4
    const disjoint = [['a1', 'a2'], ['b1', 'b2', 'b3'], ['c1', 'c2']];
    const overlapping = [['a', 'b'], ['a', 'b', 'c'], ['b', 'c']];
    const p4 = countPoset(disjoint);
    const p4b = countPoset(overlapping);
    if (p4.join() !== p4b.join()) throw new Error('p4 有公共元素时三个数变了');
    const formula = [3 * 4 * 3 - 1, 2 + 3 + 2, 2 * 3 * 2];
    if (p4.join() !== formula.join()) throw new Error(`p4 列出来是 ${p4.join()}，公式是 ${formula.join()}`);

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'choice', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
