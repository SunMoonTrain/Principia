// 独立验算 math.logic-sets.rational-construction 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.rational-construction.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** 选项序号（从 1 开始）里判为「是」的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

// ---- 整数对 (a, b)，b ≠ 0；等价关系 (a, b) ~ (c, d) ⇔ ad = bc，只用整数的加、减、乘 ----

type Pair = [number, number];

function valid(p: Pair): boolean {
  return Number.isSafeInteger(p[0]) && Number.isSafeInteger(p[1]) && p[1] !== 0;
}
function equiv(p: Pair, q: Pair): boolean {
  if (!valid(p) || !valid(q)) throw new Error(`第二个分量是 0 的不是有理数的代表元：${showPair(p)} ${showPair(q)}`);
  return p[0] * q[1] === p[1] * q[0];
}
/** 有理数加法的规定，在代表元上算：(ad + bc, bd)。 */
function plus(p: Pair, q: Pair): Pair {
  return [p[0] * q[1] + p[1] * q[0], p[1] * q[1]];
}
/** 把代表元的第二个分量换成正的：(a, b) ~ (−a, −b)。 */
function positive(p: Pair): Pair {
  return p[1] > 0 ? p : [-p[0] + 0, -p[1]];
}
/** 大小：先换成第二个分量为正的代表元，再看 ad < bc。 */
function less(p: Pair, q: Pair): boolean {
  const [a, b] = positive(p);
  const [c, d] = positive(q);
  return a * d < b * c;
}
function gcd(x: number, y: number): number {
  let a = Math.abs(x);
  let b = Math.abs(y);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}
/** 另一种算法：约成既约分数、分母取正，作为类的名字。 */
function reducedName(p: Pair): string {
  const [a, b] = positive(p);
  const g = gcd(a, b);
  return `${a / g + 0}/${b / g}`;
}
function showPair(p: Pair): string {
  return `(${p[0]},${p[1]})`;
}

// ---- p3：换代表元，结果变不变 ----

const N3 = 8;
const PAIRS: Pair[] = [];
for (let a = -N3; a <= N3; a++) for (let b = -N3; b <= N3; b++) if (b !== 0) PAIRS.push([a, b]);

/** 样本里所有等价的两对逐一比较结果；不相同就返回这两对。 */
function fails<T>(f: (p: Pair) => T, same: (x: T, y: T) => boolean): [Pair, Pair] | null {
  for (const p of PAIRS) for (const q of PAIRS) if (equiv(p, q) && !same(f(p), f(q))) return [p, q];
  return null;
}

const optA = (p: Pair): Pair => [p[0] + p[1], p[1]];
const optB = (p: Pair): Pair => [p[0] + 1, p[1]];
const optC = (p: Pair): Pair => [p[0] * p[1], p[0] * p[0] + p[1] * p[1]];
const optD = (p: Pair): Pair => [Math.abs(p[0]), p[1]];
/** ab 除以 2 的余数，取 0 或 1（避开 JS 的 % 对负数给负余数）。 */
const optE = (p: Pair): number => (((p[0] * p[1]) % 2) + 2) % 2;

// ---- p4：40 个有序对 ----

const P4: Pair[] = [];
for (const a of [-2, -1, 0, 1, 2]) for (const b of [-4, -3, -2, -1, 1, 2, 3, 4]) P4.push([a, b]);

/** 照等价关系把有序对分成类：每一对放进和它等价的第一个已有类，没有就新开一类。 */
function classesOf(ps: Pair[]): Pair[][] {
  const classes: Pair[][] = [];
  for (const p of ps) {
    const c = classes.find((cl) => equiv(cl[0], p));
    if (c) c.push(p);
    else classes.push([p]);
  }
  return classes;
}

export const verification: Verification = {
  lesson: 'math.logic-sets.rational-construction',
  notes: {
    p1:
      '照 (a,b)~(c,d) ⇔ ad=bc，对 n = −1000..1000 逐个判 (6,−4)~(n,10)，恰好一个 n；另把 (6,−4) 约成既约、分母为正的 (−3,2)，乘到分母 10 核对。',
    p2:
      '照加法的规定在代表元上算 (ad+bc, bd)；另把两个加数的代表元在 −12..12 里各换一遍，和的类都不变，并和既约分数 2/3 − 5/4 = −7/12 核对（答案是没约分的那一对）。',
    p3:
      '样本取 −8..8 的全部整数对（第二个分量不为 0），对每一对等价的代表元比较结果。判「是」的另核对结果只依赖比值：' +
      'A 的值是 x+1，C 的值是 x/(x²+1)（第二个分量 a²+b² 因 b≠0 总不是 0），所以对所有整数对成立。' +
      '判「否」的反例：B 取 (0,1)~(0,2)，得 (1,1) 和 (1,2)；D 取 (1,1)~(−1,−1)，得 (1,1) 和 (1,−1)；E 取 (1,1)~(2,2)，得 1 和 0。',
    p4:
      '照定义把 40 个有序对分成等价类数个数，另用既约分数的名字去重核对；再换成第二个分量为正的代表元、用 ad < bc 数小于 [(1,2)] 的类，' +
      '每一类的全部代表元都判一遍（结果要一致），另用浮点比值核对。',
  },
  compute() {
    // p1
    const p1Hits: number[] = [];
    for (let n = -1000; n <= 1000; n++) if (equiv([6, -4], [n, 10])) p1Hits.push(n);
    if (p1Hits.length !== 1) throw new Error(`p1 满足条件的 n 有 ${p1Hits.length} 个`);
    const p1 = p1Hits[0];
    if (reducedName([6, -4]) !== '-3/2' || p1 !== -3 * 5) throw new Error('p1 的两种算法不一致');

    // p2
    const sum = plus([2, 3], [5, -4]);
    if (!valid(sum)) throw new Error('p2 的和不是合法的代表元');
    if (reducedName(sum) !== '-7/12') throw new Error(`p2 的和约分后是 ${reducedName(sum)}`);
    for (let a = -12; a <= 12; a++)
      for (let b = -12; b <= 12; b++)
        if (b !== 0 && equiv([a, b], [2, 3]))
          for (let c = -12; c <= 12; c++)
            for (let d = -12; d <= 12; d++)
              if (d !== 0 && equiv([c, d], [5, -4]) && !equiv(plus([a, b], [c, d]), sum)) throw new Error('p2 换代表元后和的类变了');
    const p2: Pair = sum;

    // p3
    const results = [
      fails(optA, equiv),
      fails(optB, equiv),
      fails(optC, equiv),
      fails(optD, equiv),
      fails(optE, (x, y) => x === y),
    ];
    const p3 = trueOptions(results.map((f) => f === null));
    // 五条规定的值都合法（第二个分量不为 0；E 只取 0、1）
    for (const p of PAIRS) {
      for (const f of [optA, optB, optC, optD]) if (!valid(f(p))) throw new Error(`p3 在 ${showPair(p)} 处的值不合法`);
      if (optE(p) !== 0 && optE(p) !== 1) throw new Error('p3 E 的值应是 0 或 1');
    }
    // 判「是」的只依赖比值
    for (const p of PAIRS) {
      const x = p[0] / p[1];
      if (Math.abs(optA(p)[0] / optA(p)[1] - (x + 1)) > 1e-12) throw new Error('p3 A 的值不是 x+1');
      if (Math.abs(optC(p)[0] / optC(p)[1] - x / (x * x + 1)) > 1e-12) throw new Error('p3 C 的值不是 x/(x²+1)');
    }
    // 判「否」的具体反例
    const counter: [string, Pair, Pair][] = [
      ['B', [0, 1], [0, 2]],
      ['D', [1, 1], [-1, -1]],
      ['E', [1, 1], [2, 2]],
    ];
    for (const [name, p, q] of counter) {
      if (!equiv(p, q)) throw new Error(`p3 ${name} 的反例两个代表元应等价`);
      if (name === 'B' && equiv(optB(p), optB(q))) throw new Error('p3 B 的反例没起作用');
      if (name === 'D' && equiv(optD(p), optD(q))) throw new Error('p3 D 的反例没起作用');
      if (name === 'E' && optE(p) === optE(q)) throw new Error('p3 E 的反例没起作用');
    }

    // p4
    if (P4.length !== 40) throw new Error(`p4 有 ${P4.length} 个有序对`);
    const classes = classesOf(P4);
    const names = new Set(P4.map(reducedName));
    if (names.size !== classes.length) throw new Error(`p4 分类 ${classes.length} 个，既约分数 ${names.size} 个`);
    const half: Pair = [1, 2];
    let below = 0;
    for (const cl of classes) {
      const verdicts = cl.map((p) => less(p, half));
      if (new Set(verdicts).size !== 1) throw new Error('p4 同一类的代表元比大小的结果不一致');
      if (verdicts[0] !== cl[0][0] / cl[0][1] < 0.5) throw new Error('p4 和浮点比值不一致');
      if (verdicts[0]) below++;
    }
    const p4 = [classes.length, below];

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'choice', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
