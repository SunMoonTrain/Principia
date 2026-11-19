// 独立验算 math.logic-sets.functions 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.functions.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** 选项序号（从 1 开始）里判为真的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

// ---- p1：照定义查「定义域的每个元素在陪域里恰好对应一个元素」 ----
// 每个对应写成：定义域里的一批检验元素，和「这个元素按对应法则得到的、落在陪域里的全部结果」。
// 结果个数不是 1 的元素就是反例：0 个缺「至少一个」，2 个以上缺「至多一个」。

interface Correspondence {
  /** 定义域里的检验元素（用字符串记，便于把同一个有理数的不同写法归到一起）。 */
  sample: string[];
  /** 这个元素对应的、落在陪域里的全部结果（已去重）。 */
  results: (x: string) => Set<string>;
}

function firstCounterexample(c: Correspondence): { x: string; count: number } | null {
  for (const x of c.sample) {
    const n = c.results(x).size;
    if (n !== 1) return { x, count: n };
  }
  return null;
}

/** A：Q → Z，「p/q（p、q 是整数，q > 0）对应到 p」。同一个有理数有好几种 p/q 的写法，逐一列出每种写法给出的 p。 */
function optionA(): Correspondence {
  const N = 12;
  const byValue = new Map<string, Set<string>>(); // 既约形式 "p0/q0" → 各种写法给出的 p
  for (let q = 1; q <= N; q++)
    for (let p = -N; p <= N; p++) {
      const g = gcd(p, q) || 1;
      const key = `${p / g}/${q / g}`;
      if (!byValue.has(key)) byValue.set(key, new Set());
      byValue.get(key)!.add(String(p)); // p 是整数，一定落在陪域 Z 里
    }
  return { sample: [...byValue.keys()], results: (x) => byValue.get(x)! };
}

/** B：Z → Z，n ↦ n/2；结果不是整数就不在陪域里。 */
function optionB(): Correspondence {
  const sample = Array.from({ length: 21 }, (_, i) => String(i - 10));
  return {
    sample,
    results: (x) => {
      const y = Number(x) / 2;
      return Number.isInteger(y) ? new Set([String(y)]) : new Set();
    },
  };
}

/** 一批实数检验元素：负数、0、正数，整数和非整数都有。 */
const REAL_SAMPLE = [-7.5, -3, -2, -1, -0.5, -0.01, 0, 0.01, 0.5, 1, 2, 3, 7.5, Math.PI, -Math.SQRT2];

/** C：R → R，x ↦ |x|。 */
function optionC(): Correspondence {
  return { sample: REAL_SAMPLE.map(String), results: (x) => new Set([String(Math.abs(Number(x)))]) };
}

/** D：N → N，n ↦ n²（N 含 0）；结果要是自然数才在陪域里。 */
function optionD(): Correspondence {
  const sample = Array.from({ length: 30 }, (_, i) => String(i));
  return {
    sample,
    results: (x) => {
      const y = Number(x) ** 2;
      return Number.isInteger(y) && y >= 0 ? new Set([String(y)]) : new Set();
    },
  };
}

/** E：R → R，x ↦ √x：实数 y 满足 y ≥ 0 且 y² = x 才是 √x；x < 0 时没有这样的实数。 */
function optionE(): Correspondence {
  return {
    sample: REAL_SAMPLE.map(String),
    results: (x) => {
      const v = Number(x);
      return v >= 0 ? new Set([String(Math.sqrt(v))]) : new Set();
    },
  };
}

// ---- p4：映射相等 = 定义域相同、陪域相同、定义域里每一点的像相同 ----

type NumSet = { kind: 'interval'; lo: number; hi: number } | { kind: 'finite'; elems: number[] };

const R: NumSet = { kind: 'interval', lo: -Infinity, hi: Infinity };

function sameSet(a: NumSet, b: NumSet): boolean {
  if (a.kind === 'interval' && b.kind === 'interval') return a.lo === b.lo && a.hi === b.hi;
  if (a.kind === 'finite' && b.kind === 'finite') {
    const sa = [...new Set(a.elems)].sort((x, y) => x - y);
    const sb = [...new Set(b.elems)].sort((x, y) => x - y);
    return sa.length === sb.length && sa.every((x, i) => x === sb[i]);
  }
  return false; // 这几题里有限集和区间不会相等
}

/** 定义域里的检验点：有限集取全部元素；区间取端点、内部均匀的点和一批随机点（R 取 [−50, 50] 里的点）。 */
function samplePoints(s: NumSet): number[] {
  if (s.kind === 'finite') return s.elems;
  const lo = Number.isFinite(s.lo) ? s.lo : -50;
  const hi = Number.isFinite(s.hi) ? s.hi : 50;
  const pts: number[] = [];
  for (let i = 0; i <= 400; i++) pts.push(lo + ((hi - lo) * i) / 400);
  let seed = 12345;
  for (let i = 0; i < 400; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    pts.push(lo + ((hi - lo) * seed) / 2147483648);
  }
  return pts;
}

interface MapDef {
  domain: NumSet;
  codomain: NumSet;
  rule: (x: number) => number;
}

/** 返回 [是否相等, 理由]。 */
function mapsEqual(f: MapDef, g: MapDef): [boolean, string] {
  if (!sameSet(f.domain, g.domain)) return [false, '定义域不同'];
  if (!sameSet(f.codomain, g.codomain)) return [false, '陪域不同'];
  for (const x of samplePoints(f.domain)) {
    const a = f.rule(x);
    const b = g.rule(x);
    if (Math.abs(a - b) > 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))) return [false, `x = ${x} 处 ${a} ≠ ${b}`];
  }
  return [true, '三样都相同（检验点上像都相等）'];
}

const P4_PAIRS: [MapDef, MapDef][] = [
  // A. R → R：√(x²) 与 |x|
  [
    { domain: R, codomain: R, rule: (x) => Math.sqrt(x * x) },
    { domain: R, codomain: R, rule: (x) => Math.abs(x) },
  ],
  // B. {0,1} → R：x² 与 x
  [
    { domain: { kind: 'finite', elems: [0, 1] }, codomain: R, rule: (x) => x * x },
    { domain: { kind: 'finite', elems: [0, 1] }, codomain: R, rule: (x) => x },
  ],
  // C. R → R：x³ 与 x
  [
    { domain: R, codomain: R, rule: (x) => x ** 3 },
    { domain: R, codomain: R, rule: (x) => x },
  ],
  // D. [0,1] → R 与 [0,2] → R，都是 x ↦ x
  [
    { domain: { kind: 'interval', lo: 0, hi: 1 }, codomain: R, rule: (x) => x },
    { domain: { kind: 'interval', lo: 0, hi: 2 }, codomain: R, rule: (x) => x },
  ],
  // E. R → R：(x+1)² − x² 与 2x + 1
  [
    { domain: R, codomain: R, rule: (x) => (x + 1) ** 2 - x ** 2 },
    { domain: R, codomain: R, rule: (x) => 2 * x + 1 },
  ],
];

export const verification: Verification = {
  lesson: 'math.logic-sets.functions',
  notes: {
    p1:
      '五个对应各取一批定义域里的检验元素，逐个列出按对应法则得到的、落在陪域里的全部结果，个数不是 1 的就是反例。' +
      'A 把 |p| ≤ 12、1 ≤ q ≤ 12 的写法 p/q 按既约形式归到同一个有理数，收集各写法给出的 p：1/2 有 1/2、2/4、3/6 等写法，对应到 1、2、3……（不止一个）；只有 0 的各种写法都给 p = 0。' +
      'B 在 −10 到 10 的整数上查：奇数 n 的 n/2 不是整数，不在陪域 Z 里（0 个）。C 在含负数、0、无理数的 15 个实数上查，每个恰好一个 |x|。' +
      'D 在 0 到 29 上查，n² 都是自然数。E 按「√x 是满足 y ≥ 0、y² = x 的实数 y」查，x = −7.5 等负数没有这样的 y（0 个）。所以只有 C、D 是映射。',
    p2:
      '先算界：x ∈ [−1, 3] 时 −2 ≤ x − 1 ≤ 2，所以 0 ≤ |x − 1| ≤ 2。再核对取得到、并且中间的值都取得到：在 [0, 2] 上取 2001 个 y，令 x = 1 + y ∈ [1, 3]，逐个验 x 在定义域里、f(x) = y；' +
      '又在 [−1, 3] 上取 40001 个点（含两端）算 f 的最小值、最大值，得 0（x = 1）和 2（x = −1、x = 3）。像集是 [0, 2]，填 (0, 2)。',
    p3:
      '把 {1,2,3,4} 到 {1,2,3} 的映射写成像的四元组，枚举全部 3⁴ = 81 个，逐个求像集，数恰好是 {1,2,3} 的个数。' +
      '另用容斥核对：3⁴ − 3·2⁴ + 3·1⁴ = 81 − 48 + 3 = 36；也等于把 4 个元素分成 3 个非空组的 6 种分法乘以 3! = 6 种把组分给像的方式。',
    p4:
      '照定义逐组比三样：定义域、陪域都相同时，再在定义域里取检验点比像（R 取 [−50, 50] 上 401 个等距点加 400 个随机点，有限集取全部元素）。' +
      'A：√(x²) = |x| 对一切实数成立，检验点上都相等；B：0² = 0、1² = 1；C：x = 2 时 8 ≠ 2，检验点里有反例；D：定义域 [0,1] 与 [0,2] 不同；E：(x+1)² − x² = 2x + 1 是恒等式。所以 A、B、E 相等。',
  },
  compute() {
    // p1
    const options = [optionA(), optionB(), optionC(), optionD(), optionE()];
    const p1Results = options.map((c) => firstCounterexample(c) === null);
    // 反例核对：A 的 1/2 对应到多个整数，B 的 1 没有像，E 的 −1 没有像
    if (optionA().results('1/2').size < 2) throw new Error('p1 A：1/2 应对应到不止一个整数');
    if (optionA().results('0/1').size !== 1) throw new Error('p1 A：0 的写法应只给出 p = 0');
    if (optionB().results('1').size !== 0) throw new Error('p1 B：1/2 不是整数，应没有像');
    if (optionE().results('-1').size !== 0) throw new Error('p1 E：−1 没有实数平方根');
    const p1 = trueOptions(p1Results);

    // p2
    const f2 = (x: number): number => Math.abs(x - 1);
    let lo2 = Infinity;
    let hi2 = -Infinity;
    for (let i = 0; i <= 40000; i++) {
      const x = -1 + (4 * i) / 40000;
      lo2 = Math.min(lo2, f2(x));
      hi2 = Math.max(hi2, f2(x));
    }
    for (let i = 0; i <= 2000; i++) {
      const y = (2 * i) / 2000;
      const x = 1 + y;
      if (x < -1 || x > 3 || Math.abs(f2(x) - y) > 1e-12) throw new Error(`p2 y = ${y} 没有取到`);
    }
    if (f2(1) !== 0 || f2(-1) !== 2 || f2(3) !== 2) throw new Error('p2 端点值不对');
    const p2: [number, number] = [lo2, hi2];

    // p3
    let p3 = 0;
    for (let code = 0; code < 3 ** 4; code++) {
      const images = new Set<number>();
      let c = code;
      for (let k = 0; k < 4; k++) {
        images.add((c % 3) + 1);
        c = Math.floor(c / 3);
      }
      if (images.size === 3) p3++;
    }
    if (p3 !== 3 ** 4 - 3 * 2 ** 4 + 3 * 1 ** 4) throw new Error('p3 枚举和容斥不一致');
    if (p3 !== 6 * 6) throw new Error('p3 枚举和 S(4,3)·3! 不一致');

    // p4
    const p4Results = P4_PAIRS.map(([f, g]) => mapsEqual(f, g)[0]);
    if (mapsEqual(...P4_PAIRS[3])[1] !== '定义域不同') throw new Error('p4 D 应因定义域不同而不相等');
    if (P4_PAIRS[2][0].rule(2) === P4_PAIRS[2][1].rule(2)) throw new Error('p4 C 的反例 x = 2 没起作用');
    const p4 = trueOptions(p4Results);

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
