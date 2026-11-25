// 独立验算 math.logic-sets.number-constructions 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.number-constructions.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** 选项序号（从 1 开始）里判为「是」的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

// ---- 自然数对和等价关系：(a, b) ~ (c, d) ⇔ a + d = b + c，只用加法、乘法，不用减法 ----

type Pair = [number, number];

function equiv(p: Pair, q: Pair): boolean {
  return p[0] + q[1] === p[1] + q[0];
}
/** 整数乘法的规定，在代表元上算。 */
function times(p: Pair, q: Pair): Pair {
  return [p[0] * q[0] + p[1] * q[1], p[0] * q[1] + p[1] * q[0]];
}
/** 类的标准代表元：(n, 0) 或 (0, n)，从 (a, b) 两个数同时减 1 减到有一个是 0。 */
function normal(p: Pair): Pair {
  let [a, b] = p;
  while (a > 0 && b > 0) {
    a--;
    b--;
  }
  return [a, b];
}
const showPair = (p: Pair): string => `(${p[0]},${p[1]})`;

// ---- p3：换代表元，结果变不变 ----

const N3 = 12;
const PAIRS: Pair[] = [];
for (let a = 0; a <= N3; a++) for (let b = 0; b <= N3; b++) PAIRS.push([a, b]);

/** 一个变量的规定：样本里所有等价的两对逐一比较结果；不相同就返回这两对。 */
function unaryFails<T>(f: (p: Pair) => T, same: (x: T, y: T) => boolean): [Pair, Pair] | null {
  for (const p of PAIRS) for (const q of PAIRS) if (equiv(p, q) && !same(f(p), f(q))) return [p, q];
  return null;
}
/** 两个变量的规定：样本里两个位置各换代表元，四重循环逐一比较。 */
const SMALL: Pair[] = PAIRS.filter(([a, b]) => a <= 5 && b <= 5);
function binaryFails<T>(f: (p: Pair, q: Pair) => T, same: (x: T, y: T) => boolean): [Pair, Pair, Pair, Pair] | null {
  for (const p of SMALL)
    for (const p2 of SMALL)
      if (equiv(p, p2))
        for (const q of SMALL) for (const q2 of SMALL) if (equiv(q, q2) && !same(f(p, q), f(p2, q2))) return [p, p2, q, q2];
  return null;
}

const optA = (p: Pair): Pair => [p[0] * p[0] + p[1] * p[1], 2 * p[0] * p[1]];
/** B：满足 a = b + k 或 b = a + k 的全部自然数 k（从小到大列到 a + b 为止，更大的 k 两条都不会成立）。 */
function optBAll(p: Pair): number[] {
  const ks: number[] = [];
  for (let k = 0; k <= p[0] + p[1]; k++) if (p[0] === p[1] + k || p[1] === p[0] + k) ks.push(k);
  return ks;
}
const optC = (p: Pair, q: Pair): Pair => [p[0] * q[1], p[1] * q[0]]; // (ad, bc)
const optD = (p: Pair): Pair => [2 * p[0] + p[1], p[0] + p[1]];
const optE = (p: Pair): number => (p[0] + p[1]) % 2;

// ---- p4：逐个枚举 A → A 的映射 ----

const P4_CLASSES = [
  [1, 2, 3],
  [4, 5],
];
/** x 所在的类的序号。 */
function classOf(x: number): number {
  return P4_CLASSES.findIndex((c) => c.includes(x));
}
/** {1,…,5} 到自身的全部映射，g[x-1] 是 x 的像。 */
function* allMaps(): Generator<number[]> {
  const n = 5;
  for (let code = 0; code < n ** n; code++) {
    const g: number[] = [];
    let c = code;
    for (let i = 0; i < n; i++) {
      g.push((c % n) + 1);
      c = Math.floor(c / n);
    }
    yield g;
  }
}

export const verification: Verification = {
  lesson: 'math.logic-sets.number-constructions',
  notes: {
    p1:
      '照 (a,b)~(c,d) ⇔ a+d=b+c（只用加法），对 n = 0..1000 逐个判 (7,12)~(n,9)，恰好一个 n；' +
      '另用 7−12 = n−9 核对。',
    p2:
      '照乘法的规定在代表元上算 (2,5)·(4,1) = (ac+bd, ad+bc)，再对 k = 0..1000 逐个判和 (0,k) 等价，恰好一个 k；' +
      '两个因子的代表元在 0..20 里各换一遍，乘积的类不变；另用 (2−5)(4−1) 核对。',
    p3:
      '样本取 0..12 的全部自然数对，A、B、D、E 对每一对等价的代表元比较结果（C 有两个变量，取 0..5 的全部自然数对，两个位置同时换代表元）。' +
      '判「是」的另核对结果只依赖 a−b，于是对所有自然数对成立：A 的值是 (a−b)²，B 的值是 |a−b| 且 k 存在、恰有一个，E 的值是 a−b 的奇偶。' +
      '判「否」的反例：C 取 (0,0)~(1,1)、(c,d)=(1,0)，得 (0,0) 和 (0,1)，不等价；(a,b) 换成 (a+1,b+1) 时 ad、bc 各添 d、c，c ≠ d 时类一定变，逐个核对过；D 取 (0,0)~(1,1)，得 (0,0) 和 (3,2)，不等价。' +
      '（批次 26 第 1 轮修订换了 C，这一项由复核重写。）',
    p4:
      '枚举 A → A 的全部 5^5 = 3125 个映射，照定义逐对检查：x、y 同类时 g(x) = g(y)（第一问），x、y 同类时 g(x)、g(y) 同类（第二问），数个数；' +
      '另用分类计数核对：第一问 5·5 = 25，第二问 (3³+2³)(3²+2²) = 35·13 = 455。',
  },
  compute() {
    // p1
    const p1Hits: number[] = [];
    for (let n = 0; n <= 1000; n++) if (equiv([7, 12], [n, 9])) p1Hits.push(n);
    if (p1Hits.length !== 1) throw new Error(`p1 满足条件的 n 有 ${p1Hits.length} 个`);
    const p1 = p1Hits[0];
    if (7 - 12 !== p1 - 9) throw new Error('p1 的两种算法不一致');

    // p2
    const prod = times([2, 5], [4, 1]);
    const p2Hits: number[] = [];
    for (let k = 0; k <= 1000; k++) if (equiv(prod, [0, k])) p2Hits.push(k);
    if (p2Hits.length !== 1) throw new Error(`p2 满足条件的 k 有 ${p2Hits.length} 个`);
    const p2 = p2Hits[0];
    if ((2 - 5) * (4 - 1) !== -p2) throw new Error('p2 的两种算法不一致');
    for (let a = 0; a <= 20; a++)
      for (let b = 0; b <= 20; b++)
        if (equiv([a, b], [2, 5]))
          for (let c = 0; c <= 20; c++)
            for (let d = 0; d <= 20; d++)
              if (equiv([c, d], [4, 1]) && !equiv(times([a, b], [c, d]), prod)) throw new Error('p2 换代表元后乘积的类变了');
    if (showPair(normal(prod)) !== `(0,${p2})`) throw new Error('p2 的标准代表元对不上');

    // p3
    const fails = [
      unaryFails(optA, equiv),
      unaryFails((p) => optBAll(p).join(','), (x, y) => x === y),
      binaryFails(optC, equiv),
      unaryFails(optD, equiv),
      unaryFails(optE, (x, y) => x === y),
    ];
    const p3 = trueOptions(fails.map((f) => f === null));
    // B 先要是映射：每个 (a, b) 恰有一个 k
    for (const p of PAIRS) if (optBAll(p).length !== 1) throw new Error(`p3 B 在 ${showPair(p)} 处 k 有 ${optBAll(p).length} 个`);
    // 判「是」的只依赖 a − b
    for (const p of PAIRS) {
      const diff = p[0] - p[1];
      if (optA(p)[0] - optA(p)[1] !== diff * diff) throw new Error('p3 A 的值不是 (a−b)²');
      if (optBAll(p)[0] !== Math.abs(diff)) throw new Error('p3 B 的值不是 |a−b|');
      if (optE(p) !== Math.abs(diff) % 2) throw new Error('p3 E 的值不是 a−b 的奇偶');
      if (optD(p)[0] - optD(p)[1] !== p[0]) throw new Error('p3 D 的值应是 a');
    }
    // 判「否」的具体反例
    if (!equiv([0, 0], [1, 1])) throw new Error('p3 反例的两个代表元应等价');
    if (equiv(optC([0, 0], [1, 0]), optC([1, 1], [1, 0]))) throw new Error('p3 C 的反例没起作用');
    if (showPair(optC([0, 0], [1, 0])) !== '(0,0)' || showPair(optC([1, 1], [1, 0])) !== '(0,1)') throw new Error('p3 C 的反例算出的值不对');
    // 解答里说的：(a, b) 换成 (a + 1, b + 1)，只要 c ≠ d，类就变
    for (const [a, b] of SMALL)
      for (const q of SMALL)
        if (equiv(optC([a, b], q), optC([a + 1, b + 1], q)) !== (q[0] === q[1])) throw new Error('p3 C：c ≠ d 时类应当变');
    if (equiv(optD([0, 0]), optD([1, 1]))) throw new Error('p3 D 的反例没起作用');

    // p4
    let count1 = 0;
    let count2 = 0;
    let total = 0;
    const A = [1, 2, 3, 4, 5];
    for (const g of allMaps()) {
      total++;
      let ok1 = true;
      let ok2 = true;
      for (const x of A)
        for (const y of A)
          if (classOf(x) === classOf(y)) {
            if (g[x - 1] !== g[y - 1]) ok1 = false;
            if (classOf(g[x - 1]) !== classOf(g[y - 1])) ok2 = false;
          }
      if (ok1) count1++;
      if (ok2) count2++;
      if (ok1 && !ok2) throw new Error('p4 第一问满足的应都满足第二问');
    }
    if (total !== 3125) throw new Error(`p4 枚举了 ${total} 个映射`);
    if (count1 !== 25 || count2 !== (27 + 8) * (9 + 4)) throw new Error(`p4 枚举 ${count1}、${count2} 和分类计数不一致`);
    const p4 = [count1, count2];

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'choice', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
