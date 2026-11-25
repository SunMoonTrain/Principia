// 独立验算 math.logic-sets.countable-sets 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.countable-sets.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** 选项序号（从 1 开始）里判为真的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

function ints(lo: number, hi: number): number[] {
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
}

// ---- p1：照题面的排法一项一项写出来 ----

/** 0, 1, −1, 2, −2, …：先写 0，以后每个正整数 k 写 k、−k 两项。 */
function listIntegers(length: number): number[] {
  const out = [0];
  for (let k = 1; out.length < length; k++) out.push(k, -k);
  return out.slice(0, length);
}

// ---- p2：有限集数出元素个数；可数集给出一个排法，在窗口里查「不重复、不遗漏」 ----

/** 排法在前 length 项里不重复，并且 expected 里的每一个都出现过。 */
function listsOnce<T>(list: T[], key: (x: T) => string, expected: T[]): boolean {
  const seen = new Set(list.map(key));
  return seen.size === list.length && expected.every((x) => seen.has(key(x)));
}

/** 既约分数 p/q（q > 0）的写法，用来认 1/n 是不是同一个数。 */
function fraction(p: number, q: number): string {
  let [a, b] = [Math.abs(p), q];
  while (b) [a, b] = [b, a % b];
  return `${p / a}/${q / a}`;
}

/** Z×Z 按方框一圈一圈排：第 r 圈是 max(|a|, |b|) = r 的点。 */
function squareRings(rMax: number): [number, number][] {
  const out: [number, number][] = [];
  for (let r = 0; r <= rMax; r++)
    for (const a of ints(-r, r)) for (const b of ints(-r, r)) if (Math.max(Math.abs(a), Math.abs(b)) === r) out.push([a, b]);
  return out;
}

/** sin 在 (lo, hi) 里的变号处（二分到 1e-12）。 */
function sineZeros(lo: number, hi: number, steps: number): number[] {
  const out: number[] = [];
  const h = (hi - lo) / steps;
  for (let i = 0; i < steps; i++) {
    let a = lo + i * h;
    let b = a + h;
    if (Math.sin(a) * Math.sin(b) > 0) continue;
    for (let k = 0; k < 80; k++) {
      const m = (a + b) / 2;
      if (Math.sin(a) * Math.sin(m) <= 0) b = m;
      else a = m;
    }
    out.push((a + b) / 2);
  }
  return out;
}

// ---- p3：按题面的式子逐个算 ----

function pairCode(m: number, n: number): number {
  return ((m + n) * (m + n + 1)) / 2 + n;
}

// ---- p4：照定义查单射、满射 ----

interface MapCheck {
  /** 窗口里找到的两个像相同的不同元素。 */
  collision: [string, string] | null;
  /** 陪域里没有取到的元素（已对照 notes 里的理由核过，不是窗口太小）。 */
  missed: string | null;
}

/** 定义域的窗口 domain、陪域的窗口 targets；targets 里的元素的原像若存在，必在 domain 里（各选项分别保证）。 */
function check<X, Y>(domain: X[], f: (x: X) => Y, targets: Y[], kx: (x: X) => string, ky: (y: Y) => string): MapCheck {
  const seen = new Map<string, string>();
  let collision: [string, string] | null = null;
  for (const x of domain) {
    const y = ky(f(x));
    const other = seen.get(y);
    if (other !== undefined && other !== kx(x)) collision ??= [other, kx(x)];
    seen.set(y, kx(x));
  }
  const missing = targets.find((y) => !seen.has(ky(y)));
  return { collision, missed: missing === undefined ? null : ky(missing) };
}

const showPair = (p: [number, number]): string => `(${p[0]}, ${p[1]})`;

function grid(max: number): [number, number][] {
  return ints(0, max).flatMap((m) => ints(0, max).map((n): [number, number] => [m, n]));
}

/** A：N → N×{0,1}，n ↦（商，余数）。商 ≤ 500 的目标只可能来自 n ≤ 1001。 */
function p4A(): MapCheck {
  const targets = ints(0, 500).flatMap((q): [number, number][] => [
    [q, 0],
    [q, 1],
  ]);
  return check(ints(0, 1001), (n): [number, number] => [Math.floor(n / 2), n % 2], targets, String, showPair);
}

/** B：Z → N，n ≥ 0 时 2n，n < 0 时 1 − 2n。像 ≤ 400 的只可能来自 |n| ≤ 200。 */
function p4B(): MapCheck {
  return check(ints(-200, 200), (n) => (n >= 0 ? 2 * n : 1 - 2 * n), ints(0, 400), String, String);
}

/** C：N×N → N⁺，(m, n) ↦ 3^m(3n + 1)。像 ≤ 400 的只可能来自 m ≤ 5、n ≤ 133。 */
function p4C(): MapCheck {
  const domain = ints(0, 5).flatMap((m) => ints(0, 133).map((n): [number, number] => [m, n]));
  return check(domain, ([m, n]) => 3 ** m * (3 * n + 1), ints(1, 400), showPair, String);
}

/** D：{(m, n) : m ≤ n} → N×N，(m, n) ↦ (m, n − m)。目标 (a, b) 只可能来自 (a, a + b)，a、b ≤ 40 时都在窗口里。 */
function p4D(): MapCheck {
  const domain = grid(80).filter(([m, n]) => m <= n);
  return check(domain, ([m, n]): [number, number] => [m, n - m], grid(40), showPair, showPair);
}

/** E：P(N) → P(N⁺)，S ↦ {k + 1 : k ∈ S}。子集写成「k 在不在里面」，在前 bits 位上全部枚举。 */
function p4E(bits: number): MapCheck {
  const all = ints(0, (1 << bits) - 1);
  const subset = (mask: number, first: number): string =>
    `{${ints(0, bits - 1)
      .filter((i) => (mask >> i) & 1)
      .map((i) => i + first)
      .join(',')}}`;
  const shift = (mask: number): string =>
    `{${ints(0, bits - 1)
      .filter((i) => (mask >> i) & 1)
      .map((i) => i + 1)
      .join(',')}}`;
  return check(
    all,
    shift,
    all.map((mask) => subset(mask, 1)),
    (mask) => subset(mask, 0),
    (s) => s,
  );
}

/** E 的无限子集旁证：把子集写成 N → {真, 假} 的判别式，移位再移回来，前 1000 位不变。 */
function p4EInfinite(): boolean {
  const samples: ((k: number) => boolean)[] = [
    () => true,
    () => false,
    (k) => k % 2 === 0,
    (k) => k % 2 === 1,
    (k) => Number.isInteger(Math.sqrt(k)),
    (k) => k >= 17,
    (k) => k.toString(2).split('1').length % 2 === 0,
  ];
  return samples.every((s) => {
    const image = (j: number): boolean => j >= 1 && s(j - 1); // j ∈ {k + 1 : k ∈ S}
    if (image(0)) return false; // 像是 N⁺ 的子集
    return ints(0, 999).every((k) => image(k + 1) === s(k));
  });
}

export const verification: Verification = {
  lesson: 'math.logic-sets.countable-sets',
  notes: {
    p1: '照题面的排法写出前 1000 项（先写 0，以后每个正整数 k 写 k、−k 两项），直接找 −37 在第几位、第 50 位是哪个数；另用「k 在第 2k 位、−k 在第 2k + 1 位」核对。',
    p2:
      '本节的可数集指和 N 等势的集合，不含有限集。A 的元素只有 1、−1，E 有 10^100 + 1 个元素（用 BigInt 算），都是有限集。' +
      'B 用 n ↦ 1/n 排（n 从 1 起，前 2000 项写成既约分数两两不同，每个元素按定义都出现）；C 的元素是 kπ，按 0、π、−π、2π、−2π、… 排，' +
      '用二分求 sin 在 (−40π − 1, 40π + 1) 里的全部零点和 kπ 比对；D 按 max(|a|, |b|) = r 的方框一圈一圈排，在 |a|、|b| ≤ 40 的窗口里不重复、不遗漏。',
    p3: '对 0 ≤ m、n ≤ 200 逐个算编号，编号是 50 的只有一个；编号 ≥ m + n，所以窗口外没有别的。另按 m + n = 0、1、2、… 逐条斜线、每条上 n 从小到大数到编号 50 核对。',
    p4:
      '照定义在窗口里查两个不同元素像相同（不是单射）、陪域的元素没有取到（不是满射），陪域的窗口都取得使原像若存在必在定义域的窗口里。' +
      'A、D、E 查不出反例，并且逆映射写得出：A 的 (q, r) ↦ 2q + r，D 的 (a, b) ↦ (a, a + b)，E 的 T ↦ {k − 1 : k ∈ T}。' +
      'B 取不到 1：2n 是偶数，n < 0 时 1 − 2n ≥ 3。C 取不到 2：m = 0 时 3n + 1 除以 3 余 1，m ≥ 1 时是 3 的倍数，2 除以 3 余 2。' +
      'E 在前 12 位上枚举全部 4096 个子集，另拿 7 个无限或空的子集（全体、空集、偶数、奇数、平方数等）移位再移回来。',
  },
  compute() {
    // p1
    const list = listIntegers(1000);
    const position = list.indexOf(-37) + 1;
    const fiftieth = list[49];
    for (const k of ints(1, 499)) {
      if (list[2 * k - 1] !== k) throw new Error(`p1：${k} 应在第 ${2 * k} 位`);
      if (2 * k < list.length && list[2 * k] !== -k) throw new Error(`p1：${-k} 应在第 ${2 * k + 1} 位`);
    }
    if (position !== 2 * 37 + 1 || fiftieth !== 50 / 2) throw new Error('p1 两种算法不一致');

    // p2
    // A、E 是有限集：A 的值只看 n 的奇偶，E 数出 M + 1 个元素（先在小的 M 上数一遍）
    const a2 = new Set(ints(0, 1000).map((n) => (-1) ** n));
    const aFinite = a2.size === 2 && a2.has(1) && a2.has(-1);
    for (const M of [0, 1, 7, 100]) if (ints(0, 500).filter((n) => n <= M).length !== M + 1) throw new Error('p2 E 的计数不对');
    const eSize = 10n ** 100n + 1n; // 0, 1, …, 10^100
    const eFinite = eSize === BigInt('1' + '0'.repeat(99) + '1');
    const b2 = ints(1, 2000);
    const bCountable = listsOnce(b2, (n) => fraction(1, n), b2);
    const zeros = sineZeros(-40 * Math.PI - 1, 40 * Math.PI + 1, 100_003).sort((x, y) => x - y);
    const zigzag = listIntegers(81); // 0, 1, −1, …, 40, −40
    const cCountable =
      zeros.length === 81 &&
      [...zigzag].sort((x, y) => x - y).every((k, i) => Math.abs(zeros[i] - k * Math.PI) < 1e-9) &&
      listsOnce(zigzag, String, ints(-40, 40));
    const rings = squareRings(40);
    const dCountable = listsOnce(rings, showPair, ints(-40, 40).flatMap((a) => ints(-40, 40).map((b): [number, number] => [a, b])));
    if (rings.length !== 81 ** 2) throw new Error('p2 D 的圈数不对');
    if (!aFinite || !eFinite) throw new Error('p2 的 A、E 应是有限集');
    const p2 = trueOptions([!aFinite, bCountable, cCountable, dCountable, !eFinite]);

    // p3
    const hits = grid(200).filter(([m, n]) => pairCode(m, n) === 50);
    if (hits.length !== 1) throw new Error(`p3 编号 50 的应恰有一个，找到 ${hits.length} 个`);
    if (grid(200).some(([m, n]) => pairCode(m, n) < m + n)) throw new Error('p3：编号应不小于 m + n');
    let counter = 0;
    let walked: [number, number] | null = null;
    for (let s = 0; walked === null; s++)
      for (let n = 0; n <= s && walked === null; n++) {
        if (pairCode(s - n, n) !== counter) throw new Error('p3 逐条斜线数的编号和式子不一致');
        if (counter === 50) walked = [s - n, n];
        counter++;
      }
    if (walked[0] !== hits[0][0] || walked[1] !== hits[0][1]) throw new Error('p3 两种算法不一致');

    // p4
    const maps = [p4A(), p4B(), p4C(), p4D(), p4E(12)];
    console.log(
      '    p4 找到的反例：' +
        maps
          .map((m, i) => `${'ABCDE'[i]} ${m.collision ? `像相同 ${m.collision.join('、')}` : m.missed ? `取不到 ${m.missed}` : '没有'}`)
          .join('；'),
    );
    if (maps[1].missed !== '1' || maps[1].collision) throw new Error('p4 B 应是单射、取不到 1');
    if (maps[2].missed !== '2' || maps[2].collision) throw new Error('p4 C 应是单射、取不到 2');
    if (!p4EInfinite()) throw new Error('p4 E 的无限子集旁证不对');
    for (const n of ints(0, 1000)) if (2 * Math.floor(n / 2) + (n % 2) !== n) throw new Error('p4 A 的逆映射不对');
    for (const [a, b] of grid(40)) if (a > a + b || a + b - a !== b) throw new Error('p4 D 的逆映射不对');
    const p4 = trueOptions(maps.map((m) => m.collision === null && m.missed === null));

    return {
      p1: { type: 'tuple', value: [position, fiftieth] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: hits[0] },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
