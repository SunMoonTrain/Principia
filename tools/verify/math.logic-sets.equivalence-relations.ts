// 独立验算 math.logic-sets.equivalence-relations 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.equivalence-relations.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

// ---- 有限集合上的关系：三条性质照定义逐个（逐对、逐三元组）检查 ----

type Rel<T> = (a: T, b: T) => boolean;

/** 自反：每个 a 都有 a ~ a；不成立时返回反例。 */
function reflexiveFails<T>(xs: T[], r: Rel<T>): T | null {
  for (const a of xs) if (!r(a, a)) return a;
  return null;
}
/** 对称：a ~ b 推出 b ~ a；不成立时返回反例 (a, b)。 */
function symmetricFails<T>(xs: T[], r: Rel<T>): [T, T] | null {
  for (const a of xs) for (const b of xs) if (r(a, b) && !r(b, a)) return [a, b];
  return null;
}
/** 传递：a ~ b 且 b ~ c 推出 a ~ c；不成立时返回反例 (a, b, c)。 */
function transitiveFails<T>(xs: T[], r: Rel<T>): [T, T, T] | null {
  for (const a of xs) for (const b of xs) if (r(a, b)) for (const c of xs) if (r(b, c) && !r(a, c)) return [a, b, c];
  return null;
}
function isEquivalenceOn<T>(xs: T[], r: Rel<T>): boolean {
  return reflexiveFails(xs, r) === null && symmetricFails(xs, r) === null && transitiveFails(xs, r) === null;
}

/** 选项序号（从 1 开始）里判为「是」的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

/** 数学上的模：结果在 0..m−1（JS 的 % 对负数给负余数）。 */
function mod(a: number, m: number): number {
  return ((a % m) + m) % m;
}

/** a | b：存在整数 k 使 b = k·a（所以 0 | 0 成立，0 | b 对 b ≠ 0 不成立）。 */
function divides(a: number, b: number): boolean {
  if (a === 0) return b === 0;
  return b % a === 0;
}

// ---- p1：五个关系，在检验用的有限样本上照定义查三条性质，再用具体反例核对判「否」的 ----

/** 非零的样本：正负都有，含分数（浮点乘积只用来判符号，不会因舍入变号）。 */
const P1_NONZERO: number[] = [-7, -3, -1, -0.5, -1 / 3, 1 / 4, 0.5, 1, 2, 5];
const P1_REALS: number[] = [0, ...P1_NONZERO];
const P1_INTS: number[] = Array.from({ length: 21 }, (_, i) => i - 10); // −10..10，含 0
const P1_PLANE: [number, number][] = [];
for (const x of [-1, 0, 1, 2]) for (const y of [-1, 0, 1, 2]) P1_PLANE.push([x, y]);

const relA: Rel<number> = (x, y) => x * y > 0; // 在 ℝ∖{0} 上
const relB: Rel<number> = (a, b) => divides(a, b); // 在 ℤ 上
const relC: Rel<[number, number]> = (p, q) => p[0] === q[0] || p[1] === q[1]; // 在 ℝ² 上
const relD: Rel<number> = (a, b) => a * a === b * b; // 在 ℤ 上
const relE: Rel<number> = (x, y) => x * y > 0; // 在 ℝ 上（含 0）

// ---- p3：{1,2,3,4} 上的全部关系（2^16 个）逐个查三条性质 ----

function countEquivalenceRelations(n: number): number {
  const pairs = n * n;
  let count = 0;
  for (let mask = 0; mask < 1 << pairs; mask++) {
    const r = (a: number, b: number) => ((mask >> (a * n + b)) & 1) === 1;
    let ok = true;
    for (let a = 0; a < n && ok; a++) if (!r(a, a)) ok = false;
    for (let a = 0; a < n && ok; a++) for (let b = 0; b < n && ok; b++) if (r(a, b) && !r(b, a)) ok = false;
    for (let a = 0; a < n && ok; a++)
      for (let b = 0; b < n && ok; b++)
        if (r(a, b)) for (let c = 0; c < n && ok; c++) if (r(b, c) && !r(a, c)) ok = false;
    if (ok) count++;
  }
  return count;
}

/** 贝尔数（集合划分的个数）：B(n+1) = Σ C(n,k) B(k)，用来和逐个数出的等价关系个数对照。 */
function bell(n: number): number {
  const b = [1];
  for (let m = 0; m < n; m++) {
    let s = 0;
    let c = 1; // C(m, k)
    for (let k = 0; k <= m; k++) {
      s += c * b[k];
      c = (c * (m - k)) / (k + 1);
    }
    b.push(s);
  }
  return b[n];
}

// ---- p4：最大奇因数 ----

function largestOddDivisor(n: number): number {
  let m = n;
  while (m % 2 === 0) m /= 2;
  return m;
}
/** 另一种算法：从 n 往下找第一个能整除 n 的奇数，和上面除尽 2 的结果对照。 */
function largestOddDivisorBySearch(n: number): number {
  for (let d = n; d >= 1; d--) if (d % 2 === 1 && n % d === 0) return d;
  throw new Error('找不到奇因数');
}

/** 照定义把集合分成等价类：每个元素放进和它等价的第一个已有类，没有就新开一类。 */
function classesOf<T>(xs: T[], r: Rel<T>): T[][] {
  const classes: T[][] = [];
  for (const x of xs) {
    const c = classes.find((cl) => r(cl[0], x));
    if (c) c.push(x);
    else classes.push([x]);
  }
  return classes;
}

export const verification: Verification = {
  lesson: 'math.logic-sets.equivalence-relations',
  notes: {
    p1:
      '五个关系在有限样本上照定义逐对、逐三元组查自反、对称、传递：A 在 10 个非零实数（正负都有、含分数）上，B、D 在 −10..10 的整数上，' +
      'C 在 {−1,0,1,2}² 的 16 个点上，E 在那 10 个非零实数加 0 上；整除照「存在整数 k 使 b = ka」判（所以 0 | 0）。' +
      '判「是」的 A、D 另核对它们就是「函数值相同」：A 是 x、y 同号（符号函数相同），D 是 |a| = |b|，这样的关系对整个 ℝ∖{0}、ℤ 都是等价关系，不只在样本上。' +
      '判「否」的反例：B 不对称（1 | 2 而 2 ∤ 1）；C 不传递（(0,0) ~ (0,1)、(0,1) ~ (1,1)，可 (0,0) 与 (1,1) 两个坐标都不同）；E 不自反（0·0 = 0 不大于 0）。',
    p2:
      '对 −20..20 的每个整数 n 照定义判 6 | (n − 4)（用结果在 0..5 的模，避开 JS 对负数的余数），数个数；' +
      '另手算核对：n = 4 + 6k，−20 ≤ 4 + 6k ≤ 20 给出 k = −4..2，即 −20、−14、−8、−2、4、10、16 共 7 个（端点 −20 恰好在里面）。',
    p3:
      '把 {1,2,3,4} 上的关系看成 4×4 = 16 个有序对的子集，逐个枚举 2^16 = 65536 个，照定义查自反、对称、传递，数出满足三条的个数；' +
      '再用贝尔数递推 B(n+1) = Σ C(n,k)B(k) 算 4 元集的划分个数核对（等价关系和划分一一对应）。另核对 n = 1, 2, 3 时逐个数和贝尔数 1, 2, 5 一致。',
    p4:
      '对 1..12 用两种办法求最大奇因数（反复除以 2；从 n 往下找第一个整除 n 的奇数），两者一致；在这 12 个数上照定义查等价关系的三条性质，' +
      '再把它们照定义分成等价类、数类的个数：{1,2,4,8}、{3,6,12}、{5,10}、{7}、{9}、{11}，共 6 类（就是 1..12 里奇数的个数）。',
  },
  compute() {
    // p1
    const p1Results = [
      isEquivalenceOn(P1_NONZERO, relA),
      isEquivalenceOn(P1_INTS, relB),
      isEquivalenceOn(P1_PLANE, relC),
      isEquivalenceOn(P1_INTS, relD),
      isEquivalenceOn(P1_REALS, relE),
    ];
    // 判「是」的两个：关系等于「某个函数的值相同」，对整个集合都成立
    for (const x of P1_NONZERO)
      for (const y of P1_NONZERO) if (relA(x, y) !== (Math.sign(x) === Math.sign(y))) throw new Error('p1 A 不是「同号」');
    for (const a of P1_INTS)
      for (const b of P1_INTS) if (relD(a, b) !== (Math.abs(a) === Math.abs(b))) throw new Error('p1 D 不是「绝对值相同」');
    // 判「否」的三个：具体反例
    if (!(relB(1, 2) && !relB(2, 1))) throw new Error('p1 B 的反例没起作用');
    if (symmetricFails(P1_INTS, relB) === null) throw new Error('p1 B 应不对称');
    if (!(relC([0, 0], [0, 1]) && relC([0, 1], [1, 1]) && !relC([0, 0], [1, 1]))) throw new Error('p1 C 的反例没起作用');
    if (transitiveFails(P1_PLANE, relC) === null) throw new Error('p1 C 应不传递');
    if (reflexiveFails(P1_PLANE, relC) !== null || symmetricFails(P1_PLANE, relC) !== null) throw new Error('p1 C 应自反、对称');
    if (relE(0, 0)) throw new Error('p1 E 的反例没起作用');
    if (reflexiveFails(P1_REALS, relE) !== 0) throw new Error('p1 E 不自反的点应是 0');
    if (symmetricFails(P1_REALS, relE) !== null || transitiveFails(P1_REALS, relE) !== null) throw new Error('p1 E 应对称、传递');
    // B 在 ℤ 上自反（0 | 0 也成立）、传递，只坏在对称
    if (reflexiveFails(P1_INTS, relB) !== null || transitiveFails(P1_INTS, relB) !== null) throw new Error('p1 B 应自反、传递');
    const p1 = trueOptions(p1Results);

    // p2
    let p2 = 0;
    const members: number[] = [];
    for (let n = -20; n <= 20; n++) {
      if (mod(n - 4, 6) === 0) {
        p2++;
        members.push(n);
      }
    }
    if (members.join(',') !== '-20,-14,-8,-2,4,10,16') throw new Error(`p2 数出的是 ${members.join(',')}`);

    // p3
    const p3 = countEquivalenceRelations(4);
    if (p3 !== bell(4)) throw new Error(`p3 逐个数出 ${p3}，贝尔数是 ${bell(4)}`);
    for (const n of [1, 2, 3]) if (countEquivalenceRelations(n) !== bell(n)) throw new Error(`n = ${n} 时和贝尔数不一致`);
    if ([bell(1), bell(2), bell(3)].join(',') !== '1,2,5') throw new Error('贝尔数递推有误');

    // p4
    const xs4 = Array.from({ length: 12 }, (_, i) => i + 1);
    for (const n of xs4)
      if (largestOddDivisor(n) !== largestOddDivisorBySearch(n)) throw new Error(`p4 ${n} 的最大奇因数两种算法不一致`);
    if (largestOddDivisor(12) !== 3) throw new Error('p4 题面的例子 12 → 3 对不上');
    const rel4: Rel<number> = (a, b) => largestOddDivisor(a) === largestOddDivisor(b);
    if (!isEquivalenceOn(xs4, rel4)) throw new Error('p4 不是等价关系');
    const classes4 = classesOf(xs4, rel4);
    const shown = classes4.map((c) => '{' + c.join(',') + '}').join(' ');
    if (shown !== '{1,2,4,8} {3,6,12} {5,10} {7} {9} {11}') throw new Error(`p4 分出的类是 ${shown}`);
    const p4 = classes4.length;

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
