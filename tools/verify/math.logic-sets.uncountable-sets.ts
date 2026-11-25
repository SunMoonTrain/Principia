// 独立验算 math.logic-sets.uncountable-sets 的 p1–p4（简单题、中等题）。
// 只按题意（p1 另按讲解里写明的规则）计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.uncountable-sets.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** 选项序号（从 1 开始）里判为真的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

function ints(lo: number, hi: number): number[] {
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
}

// ---- p1：有理数用整数精确算，不用浮点数 ----

type Fraction = readonly [bigint, bigint];

/** p/q（0 ≤ p < q）的小数点后各位，长除法；余数重复时停下，返回不循环部分和循环节。 */
function longDivision([p, q]: Fraction): { head: number[]; cycle: number[] } {
  const digits: number[] = [];
  const seenAt = new Map<bigint, number>();
  let r = p;
  while (!seenAt.has(r)) {
    seenAt.set(r, digits.length);
    digits.push(Number((10n * r) / q));
    r = (10n * r) % q;
  }
  const start = seenAt.get(r) ?? 0;
  return { head: digits.slice(0, start), cycle: digits.slice(start) };
}

/**
 * 是不是某个只含 4、5 的无限小数；是的话给出取第 n 位（n 从 1 起）的函数。
 * 有限小数另有一种写法，末尾全是 9，也含 4、5 以外的数字；所以只要看长除法这一种写法。
 */
function onlyFourFive(x: Fraction): ((n: number) => number) | null {
  const { head, cycle } = longDivision(x);
  if (![...head, ...cycle].every((d) => d === 4 || d === 5)) return null;
  return (n) => (n <= head.length ? head[n - 1] : cycle[(n - 1 - head.length) % cycle.length]);
}

/** 照定义另核一遍：只含 4、5 的无限小数逐位确定时，数一直夹在 [4…4 4/9, 5…5 5/9] 这样的区间里；取不到就不是。 */
function onlyFourFiveByIntervals([p, q]: Fraction, depth: number): number[] | null {
  // 余下的部分 t ∈ [4/9, 5/9] 才可能是只含 4、5 的无限小数；第一位取 4 时 10t − 4、取 5 时 10t − 5 还在里面
  const digits: number[] = [];
  let [a, b]: [bigint, bigint] = [p, q];
  for (let k = 0; k < depth; k++) {
    const inside = [4n, 5n].filter((d) => {
      const num = 10n * a - d * b; // 10t − d 的分子，分母 b
      return 9n * num >= 4n * b && 9n * num <= 5n * b;
    });
    if (inside.length === 0) return null;
    if (inside.length > 1) throw new Error('p1：同一个数有两种只含 4、5 的写法');
    digits.push(Number(inside[0]));
    a = 10n * a - inside[0] * b;
  }
  return digits;
}

// ---- p2：有限的数出元素个数，可数的写出排法，不可数的照对角线论证造出漏掉的元素 ----

/** 排法 list 不重复，并且窗口里的 expected 都出现。 */
function listsOnce(list: string[], expected: string[]): boolean {
  const seen = new Set(list);
  return seen.size === list.length && expected.every((x) => seen.has(x));
}

/** A：[m, m + n]，m ∈ Z、n ∈ N⁺，按 |m| + n = 1, 2, 3, … 一批一批排，每批有限个。 */
function listA(total: number): string[] {
  const out: string[] = [];
  for (let s = 1; s <= total; s++)
    for (const m of ints(-(s - 1), s - 1)) out.push(`[${m},${m + (s - Math.abs(m))}]`);
  return out;
}

/** B：P(P({1,2,3})) 的元素逐个写出来。 */
function powerSet<T>(xs: T[]): T[][] {
  return xs.reduce<T[][]>((acc, x) => [...acc, ...acc.map((s) => [...s, x])], [[]]);
}

/** C：长 L 的 0、1 串里后一项不小于前一项的，全部枚举。 */
function monotonePrefixes(L: number): string[] {
  return ints(0, 2 ** L - 1)
    .map((m) => m.toString(2).padStart(L, '0'))
    .filter((s) => ints(1, L - 1).every((i) => s[i] >= s[i - 1]));
}

/** D 的一列元素用左端点表示，左端点写成小数位（第 k 位，k ≥ 1，整数部分任意）。 */
type Digits = (k: number) => number;

/** 照讲解的规则造 x（这里的列都直接给出小数位）：第 n 项只含 4、5 时换一下，否则取 4。kind 说明第 n 项是不是只含 4、5。 */
function diagonalReal(list: (n: number) => { digits: Digits; fourFive: boolean; integerPart: number }): Digits {
  return (n) => {
    const item = list(n);
    if (item.integerPart !== 0 || !item.fourFive) return 4;
    return item.digits(n) === 4 ? 5 : 4;
  };
}

// ---- p3 ----

function nonemptySubsets(n: number): number[] {
  return ints(1, 2 ** n - 1);
}

// ---- p4：规则 = 每个 d_k 从表的哪一格来（换一下），或固定的数字 ----

type Table = (i: number, j: number) => number; // a_{ij}，i、j ≥ 1，值是 4 或 5
type Rule = (k: number) => { cell: [number, number] } | { fixed: number };

const swap = (d: number): number => 9 - d;

function buildX(rule: Rule, t: Table): Digits {
  return (k) => {
    const r = rule(k);
    return 'fixed' in r ? r.fixed : swap(t(r.cell[0], r.cell[1]));
  };
}

/** k = 2^m(2n − 1) 里的 n。 */
function oddPartIndex(k: number): number {
  let odd = k;
  while (odd % 2 === 0) odd /= 2;
  return (odd + 1) / 2;
}

const RULES: Record<'A' | 'B' | 'C' | 'D' | 'E', Rule> = {
  A: (k) => (k % 2 === 0 ? { cell: [k / 2, k] } : { fixed: 4 }),
  B: (k) => ({ cell: [k, k + 1] }),
  C: (k) => ({ cell: [2 * k, k] }),
  D: (k) => ({ cell: [oddPartIndex(k), k] }),
  E: (k) => (k === 1 ? { fixed: 4 } : { cell: [k, k] }),
};

/** 第 n 项被保证躲开：有某一位 k，d_k 正是由第 n 项自己的第 k 位换来的。 */
function dodgedAt(rule: Rule, n: number, kMax: number): number | null {
  for (const k of ints(1, kMax)) {
    const r = rule(k);
    if ('cell' in r && r.cell[0] === n && r.cell[1] === k) return k;
  }
  return null;
}

/** 用一个小的线性同余发生器做出来的随机表（值只取 4、5），不同的 seed 是不同的表。 */
function randomTable(seed: number): Table {
  const memo = new Map<string, number>();
  let s = seed >>> 0;
  return (i, j) => {
    const key = `${i},${j}`;
    let v = memo.get(key);
    if (v === undefined) {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      v = s & 0x10000 ? 4 : 5;
      memo.set(key, v);
    }
    return v;
  };
}

/** B、C、E 的反例：一张表和一行 n，使造出的 x 就是第 n 行。 */
const COUNTER: Record<'B' | 'C' | 'E', { table: Table; row: number }> = {
  // x_1 = 0.4555…，别的都是 0.444…
  B: { table: (i, j) => (i === 1 ? (j === 1 ? 4 : 5) : 4), row: 1 },
  // x_1 = 0.555…，别的都是 0.444…
  C: { table: (i) => (i === 1 ? 5 : 4), row: 1 },
  // x_1 = 0.4555…，别的都是 0.444…
  E: { table: (i, j) => (i === 1 ? (j === 1 ? 4 : 5) : 4), row: 1 },
};

export const verification: Verification = {
  lesson: 'math.logic-sets.uncountable-sets',
  notes: {
    p1:
      '规则照讲解：x_n 等于某个只含 4、5 的无限小数时，d_n 取 4、5 中不等于它第 n 位的那个，否则 d_n = 4。四个数写成分数（x_3 = 0.4545… = 5/11），用整数长除法求各位，' +
      '再用「余下的部分要在 [4/9, 5/9] 里」逐位定数字的办法核对。1/2 的两种写法 0.5000…、0.4999… 都含别的数字；第一位取 4 的至多 0.4555… = 41/90，取 5 的至少 0.5444… = 49/90，1/2 = 45/90 在中间。',
    p2:
      'A 按 |m| + n = 1、2、3、… 一批一批排，每批有限个，在 |m| ≤ 20、n ≤ 20 的窗口里查不重复、不遗漏，可数。B 逐个写出来，256 个元素，有限。' +
      'C 在长 L ≤ 14 的前段上枚举，恰有 L + 1 个，由第一个 1 在第几位（或没有 1）决定，排成「没有 1，第 1 位起是 1，第 2 位起是 1，…」，可数。' +
      'D 的元素和左端点 r 一一对应；任给一列，照讲解的规则造一个实数，和每一项的左端点不同（在常数列、周期列、随机列、含别的数字的列上核对前 400 项）。' +
      'E：任给一列 S_1, S_2, …，{0} ∪ {n ≥ 1 : n ∉ S_n} 也含 0，和第 n 个在 n 处不同（在几列具体的子集上核对前 400 项）。',
    p3: '枚举 f(1)、f(2)、f(3) 在 {1,2,3} 的 7 个非空子集里的全部 343 个取法，逐个算 D = {x : x ∉ f(x)}，数 |D| = 2 的；顺带核对 D 从不是某个 f(a)。再按「不含 x 的非空子集 3 个、含 x 的 4 个」算 3·3²·4 核对，四种大小合计 343。',
    p4:
      '把每种造法写成「d_k 由表的哪一格换来，或者固定取 4」。A、D 对 n ≤ 300 都找得到一位 k，d_k 正由 a_{n,k} 换来（A 是 k = 2n，D 是 k = 2n − 1），另在 40 张随机表和几张特殊表上核对前 60 项都躲开。' +
      'B、C、E 各举一张具体的表，造出的 x 就是其中一项（查前 2000 位）：B、E 用 x_1 = 0.4555…、其余 0.444…，C 用 x_1 = 0.555…、其余 0.444…。',
  },
  compute() {
    // p1
    const xs: Fraction[] = [
      [4n, 9n],
      [1n, 2n],
      [5n, 11n],
      [5n, 9n],
    ];
    if (longDivision(xs[2]).cycle.join('') !== '45' || longDivision(xs[2]).head.length !== 0) throw new Error('p1：0.4545… 应是 5/11');
    const p1 = xs.map((x, i) => {
      const n = i + 1;
      const digit = onlyFourFive(x);
      const other = onlyFourFiveByIntervals(x, 40);
      if ((digit === null) !== (other === null)) throw new Error(`p1：x_${n} 的两种判法不一致`);
      if (digit === null || other === null) return 4;
      if (!other.every((d, k) => d === digit(k + 1))) throw new Error(`p1：x_${n} 的两种算法数字不一致`);
      return digit(n) === 4 ? 5 : 4;
    });

    // p2
    const aList = listA(60);
    const aWindow = ints(-20, 20).flatMap((m) => ints(1, 20).map((n) => `[${m},${m + n}]`));
    const aCountable = listsOnce(aList, aWindow);
    const bElements = powerSet(powerSet([1, 2, 3])).map((s) => s.map((t) => `{${t.join(',')}}`).sort().join(' '));
    if (new Set(bElements).size !== 256) throw new Error('p2 B 应有 256 个元素');
    const bFinite = Number.isFinite(new Set(bElements).size);
    const cCountable = ints(1, 14).every((L) => {
      const got = monotonePrefixes(L);
      const listed = [...ints(1, L).map((first) => '0'.repeat(first - 1) + '1'.repeat(L - first + 1)), '0'.repeat(L)];
      return got.length === L + 1 && listsOnce(listed, got);
    });
    // D：几列左端点
    const lists: ((n: number) => { digits: Digits; fourFive: boolean; integerPart: number })[] = [
      () => ({ digits: () => 4, fourFive: true, integerPart: 0 }),
      () => ({ digits: () => 5, fourFive: true, integerPart: 0 }),
      (n) => ({ digits: (k) => (k % (n + 1) === 0 ? 5 : 4), fourFive: true, integerPart: 0 }),
      (n) => ({ digits: (k) => ((k * k + n) % 3 === 0 ? 5 : 4), fourFive: true, integerPart: n % 4 === 0 ? 1 : 0 }),
      (n) => (n % 2 === 0 ? { digits: (k) => (k === n ? 7 : 4), fourFive: false, integerPart: 0 } : { digits: (k) => ((k + n) % 2 === 0 ? 4 : 5), fourFive: true, integerPart: 0 }),
    ];
    const rnd = randomTable(20261125);
    lists.push((n) => ({ digits: (k) => rnd(n, k), fourFive: true, integerPart: 0 }));
    const dEscapes = lists.every((list) => {
      const x = diagonalReal(list);
      return ints(1, 400).every((n) => {
        const item = list(n);
        // x 是整数部分为 0、只含 4、5 的小数：第 n 项不是这样的小数时自然不同，是的话要有一位不同
        return !item.fourFive || item.integerPart !== 0 || x(n) !== item.digits(n);
      });
    });
    const setLists: ((n: number) => (k: number) => boolean)[] = [
      () => (k) => k === 0,
      () => () => true,
      (n) => (k) => k === 0 || k % n === 0,
      (n) => (k) => k <= n,
      (n) => (k) => k === 0 || ((k ^ n) & 1) === 0,
      (n) => (k) => k === 0 || Number.isInteger(Math.sqrt(k + n)),
    ];
    const eEscapes = setLists.every((list) => {
      if (!ints(1, 400).every((n) => list(n)(0))) throw new Error('p2 E 的检验列要都含 0');
      const d = (k: number): boolean => k === 0 || !list(k)(k);
      return d(0) && ints(1, 400).every((n) => d(n) !== list(n)(n));
    });
    const p2 = trueOptions([!aCountable, !bFinite, !cCountable, dEscapes, eEscapes]);

    // p3
    const subsets = nonemptySubsets(3);
    const has = (mask: number, x: number): boolean => ((mask >> (x - 1)) & 1) === 1;
    const bySize = [0, 0, 0, 0];
    for (const f1 of subsets)
      for (const f2 of subsets)
        for (const f3 of subsets) {
          const f = [f1, f2, f3];
          const d = ints(1, 3).filter((x) => !has(f[x - 1], x));
          const mask = d.reduce((m, x) => m | (1 << (x - 1)), 0);
          if (f.includes(mask)) throw new Error('p3：D 不应是某个 f(a)');
          bySize[d.length]++;
        }
    if (bySize[2] !== 3 * 3 ** 2 * 4) throw new Error('p3 两种算法不一致');
    if (bySize.reduce((u, v) => u + v, 0) !== 343) throw new Error('p3 合计应是 343');

    // p4
    const names = ['A', 'B', 'C', 'D', 'E'] as const;
    const verdicts = names.map((name) => {
      const rule = RULES[name];
      const allDodged = ints(1, 300).every((n) => dodgedAt(rule, n, 2 * n + 2) !== null);
      if (name === 'B' || name === 'C' || name === 'E') {
        const { table, row } = COUNTER[name];
        const x = buildX(rule, table);
        if (!ints(1, 2000).every((k) => x(k) === table(row, k))) throw new Error(`p4 ${name} 的反例不对`);
        if (allDodged) throw new Error(`p4 ${name} 不应每一项都躲开`);
        return false;
      }
      if (!allDodged) throw new Error(`p4 ${name} 有一项没有躲开`);
      const tables: Table[] = [
        () => 4,
        () => 5,
        (i, j) => ((i + j) % 2 === 0 ? 4 : 5),
        (_i, j) => (j % 2 === 0 ? 5 : 4),
        COUNTER.B.table,
        COUNTER.C.table,
        ...ints(1, 40).map((s) => randomTable(s * 7919)),
      ];
      for (const t of tables) {
        const x = buildX(rule, t);
        for (const n of ints(1, 60)) if (ints(1, 130).every((k) => x(k) === t(n, k))) throw new Error(`p4 ${name} 没有躲开第 ${n} 项`);
      }
      return true;
    });
    // D 里 k = 2^m(2n − 1) 的写法：每个正整数恰有一种
    for (const k of ints(1, 4000)) {
      const ways = ints(0, 12).flatMap((m) => (k % 2 ** m === 0 && (k / 2 ** m) % 2 === 1 ? [[m, (k / 2 ** m + 1) / 2]] : []));
      if (ways.length !== 1 || ways[0][1] !== oddPartIndex(k)) throw new Error('p4 D 的写法应恰有一种');
    }

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: bySize[2] },
      p4: { type: 'choice', value: trueOptions(verdicts) },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
