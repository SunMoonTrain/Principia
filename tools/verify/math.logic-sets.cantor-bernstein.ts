// 独立验算 math.logic-sets.cantor-bernstein 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.cantor-bernstein.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** 选项序号（从 1 开始）里判为真的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

function ints(lo: number, hi: number): number[] {
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
}

// ---- 有限集：把 {0..m-1} 到 {0..n-1} 的映射全部写出来 ----

function* allMaps(m: number, n: number): Generator<number[]> {
  if (m === 0) {
    yield [];
    return;
  }
  for (let code = 0; code < n ** m; code++) {
    const out: number[] = [];
    let c = code;
    for (let i = 0; i < m; i++) {
      out.push(c % n);
      c = Math.floor(c / n);
    }
    yield out;
  }
}

const isInjective = (f: number[]): boolean => new Set(f).size === f.length;
const isSurjective = (f: number[], n: number): boolean => new Set(f).size === n;
const hasInjection = (m: number, n: number): boolean => [...allMaps(m, n)].some(isInjective);
const hasBijection = (m: number, n: number): boolean => [...allMaps(m, n)].some((f) => isInjective(f) && isSurjective(f, n));

// ---- 自然数上的单射：N → N，连同「找原像」的办法，照定义造 C 和 h ----

interface Injection {
  name: string;
  /** 映射本身。 */
  at(n: number): number;
  /** y 的原像，没有就是 null（每个例子单独写，用 at 回代核对）。 */
  pre(y: number): number | null;
}

/**
 * C 是包含 A∖g(B)、并且 g(f(X)) ⊆ X 的那些 X ⊆ A 的交。在 A = N 的窗口 [0, size) 上自下而上：
 * 从 A∖g(B) 出发反复添 g(f(x))，直到不再添。x ≤ g(f(x)) 时窗口里的成员和整个 N 上的一致
 * （g∘f 不把窗口外的点送回窗口里），下面逐个例子核对这一条。
 */
function smallestClosed(f: Injection, g: Injection, size: number): Set<number> {
  const inC = new Set(ints(0, size - 1).filter((a) => g.pre(a) === null));
  let frontier = [...inC];
  while (frontier.length > 0) {
    const next: number[] = [];
    for (const x of frontier) {
      const y = g.at(f.at(x));
      if (y < size && !inC.has(y)) {
        inC.add(y);
        next.push(y);
      }
    }
    frontier = next;
  }
  return inC;
}

/** 另一种算法：从 a 往回追溯 a ← g⁻¹ ← f⁻¹ ← …，停在 A 里（没有 g 的原像）就在 C 里，停在 B 里或永不停就不在。 */
function tracesBackToA(f: Injection, g: Injection, a: number): boolean {
  let x = a;
  for (let steps = 0; steps < 10_000; steps++) {
    const b = g.pre(x);
    if (b === null) return true; // 停在 A∖g(B)
    const x2 = f.pre(b);
    if (x2 === null) return false; // 停在 B∖f(A)
    if (x2 === a) return false; // 绕成了一圈
    x = x2;
  }
  throw new Error(`${f.name}、${g.name}：从 ${a} 往回追溯没有停`);
}

/** 照证明造 h：C 上取 f，C 以外取 g 的原像。 */
function buildH(f: Injection, g: Injection, inC: (a: number) => boolean): (a: number) => number {
  return (a) => {
    if (inC(a)) return f.at(a);
    const b = g.pre(a);
    if (b === null) throw new Error(`${a} 不在 C 里，却没有 g 的原像`);
    return b;
  };
}

/** h 在窗口上是不是双射：窗口 [0, size) 上两两不同，并且 [0, cover) 的每个数都取到。 */
function checkBijection(h: (a: number) => number, size: number, cover: number): boolean {
  const values = ints(0, size - 1).map(h);
  const seen = new Set(values);
  return seen.size === values.length && ints(0, cover - 1).every((b) => seen.has(b));
}

const shift = (k: number): Injection => ({ name: `n+${k}`, at: (n) => n + k, pre: (y) => (y >= k ? y - k : null) });
const times = (k: number, c = 0): Injection => ({
  name: `${k}n+${c}`,
  at: (n) => k * n + c,
  pre: (y) => (y >= c && (y - c) % k === 0 ? (y - c) / k : null),
});
/** n ↦ n²（单射，像是平方数）。 */
const square: Injection = {
  name: 'n²',
  at: (n) => n * n,
  pre: (y) => {
    const r = Math.round(Math.sqrt(y));
    return r * r === y ? r : null;
  },
};
/** 交换 2k 和 2k+1（双射），再加 1。 */
const swapThenShift: Injection = {
  name: '交换 2k、2k+1 再加 1',
  at: (n) => (n ^ 1) + 1,
  pre: (y) => (y >= 1 ? (y - 1) ^ 1 : null),
};

/** 单射对照：at、pre 互相回代。 */
function checkInjection(f: Injection): void {
  const values = ints(0, 2000).map((n) => f.at(n));
  if (new Set(values).size !== values.length) throw new Error(`${f.name} 不是单射`);
  for (const n of ints(0, 2000)) if (f.pre(f.at(n)) !== n) throw new Error(`${f.name} 的原像写错了`);
  for (const y of ints(0, 2000)) {
    const n = f.pre(y);
    if (n !== null && f.at(n) !== y) throw new Error(`${f.name} 的原像写错了`);
  }
}

// ---- p4 ----

type Point = [number, number];

/** 一组样点上两两不同（写成定长小数当键）。 */
function distinct(values: number[]): boolean {
  return new Set(values.map((v) => v.toFixed(12))).size === values.length;
}

/** A：圆周 ↔ 实数的两个单射：上半圆（y ≥ 0）送到 x，下半圆（y < 0）送到 x + 3，值在 [−1, 4) 里。 */
function circleToReal([x, y]: Point): number {
  return y >= 0 ? x : x + 3;
}
/** (0, 1) → 圆周：t ↦ (t, √(1−t²))，第一个坐标就是 t，所以是单射。 */
function realToCircle(t: number): Point {
  return [t, Math.sqrt(1 - t * t)];
}

/** 有理数 p/q 的精确比较用整数算：x ≤ x² ≤ x³ ≤ 1（x = p/q，q > 0，通分到 q³）。 */
function inD(p: bigint, q: bigint): boolean {
  const x = p * q * q;
  const x2 = p * p * q;
  const x3 = p * p * p;
  return x <= x2 && x2 <= x3 && x3 <= q * q * q;
}
/** x = p/q、y = r/q：x² + y² ≤ 2x − 1，通分到 q²。 */
function inE(p: bigint, r: bigint, q: bigint): boolean {
  return p * p + r * r <= 2n * p * q - q * q;
}

export const verification: Verification = {
  lesson: 'math.logic-sets.cantor-bernstein',
  notes: {
    p1:
      '在元素个数不超过 4 的有限集上把映射全部写出来，逐个条件查「条件成立而不等势」的反例：A、B 在 A = {1}、B = {1, 2} 上就有反例（1 ↦ 1）。' +
      'A、B 也不能推出不等势：A = B = N、n ↦ n + 1 满足条件而等势。C、D、E 在有限集上没有反例；一般的情形各给出两个方向的单射：' +
      'C 用包含映射 A → B；D 的「B 到 A 的子集的双射」换个陪域就是 B → A 的单射；E 由传递性 |A| ≤ |M| ≤ |B| 得 |A| ≤ |B|。' +
      '无限集上另拿 8 对 N → N 的单射照证明造 h，在窗口里查它两两不同、取遍小的数。',
    p2:
      'C 自下而上算（从 A∖g(B) 出发反复添 g(f(x))），另用「往回追溯停在 A 里」核对，再在 12 个元素的窗口上把全部 4096 个子集里满足两个条件的求交核对，三种算法都是 3 的倍数。' +
      'h 在 C 上取 f、C 以外取 g 的原像；h 在窗口里两两不同、取遍每个数。',
    p3: '同 p2 的前两种算法，数小于 100 的；另写出两条链 0→2→6→14→30→62→126 和 1→4→10→22→46→94→190 核对。',
    p4:
      'A：上半圆（y ≥ 0）的点送到 x、下半圆（y < 0）的点送到 x + 3 是圆周到实数的单射，t ↦ (t, √(1−t²)) 是 (0,1) 到圆周的单射；B：包含 (0,1)，又能用 x ↦ (x+1)/5 单射到 (0,1)；' +
      'C：包含 (0,1)，又是 R 的子集，R 用 x ↦ (1 + x/(1+|x|))/2 单射到 (0,1)；三个都在样点上核对了单射。' +
      'D：各式的符号只在 0、1 处变，在 (−∞,0)、(0,1)、(1,+∞) 各取一点、再加 0 和 1，只有 0、1 满足；另在分母不超过 60、绝对值不超过 3 的有理数上精确核对。' +
      'E：x² + y² − 2x + 1 = (x−1)² + y²，只有 (1,0)；在有理格点上精确核对。D 有 2 个元素、E 有 1 个元素，都是有限集。',
  },
  compute() {
    // ---- p1 ----
    const N = 4;
    let badA: [number, number] | null = null;
    let badB: [number, number] | null = null;
    let badC: [number, number] | null = null;
    let badD: [number, number] | null = null;
    let badE: [number, number] | null = null;
    for (const a of ints(0, N))
      for (const b of ints(0, N)) {
        const equinumerous = hasBijection(a, b);
        // A：有单射 A → B，它不是满射
        const condA = [...allMaps(a, b)].some((f) => isInjective(f) && !isSurjective(f, b));
        if (condA && !equinumerous && a > 0) badA ??= [a, b];
        // B：有 A 到 B 的某个真子集 T 的双射（把 A → T 看成 A → B 的映射，像集正好是 T ≠ B）
        const condB = [...allMaps(a, b)].some((f) => isInjective(f) && new Set(f).size < b);
        if (condB && !equinumerous && a > 0) badB ??= [a, b];
        // C：A ⊆ B（有限集里就是把 A 当成 B 的前 a 个元素），有单射 B → A
        const condC = a <= b && hasInjection(b, a);
        if (condC && !equinumerous) badC ??= [a, b];
        // D：有单射 A → B，又有 B 到 A 的某个子集 S 的双射
        const condD = hasInjection(a, b) && [...allMaps(b, a)].some((g) => isInjective(g));
        if (condD && !equinumerous) badD ??= [a, b];
        // E：有 M 使 |A| ≤ |M|、|M| ≤ |B|、|B| ≤ |A|
        const condE = ints(0, N).some((m) => hasInjection(a, m) && hasInjection(m, b) && hasInjection(b, a));
        if (condE && !equinumerous) badE ??= [a, b];
      }
    if (!badA || !badB) throw new Error('p1 A、B 应找到反例');
    if (badA.join() !== '1,2' || badB.join() !== '1,2') throw new Error('p1 A、B 最小的非空反例应是 |A| = 1、|B| = 2');
    if (badC || badD || badE) throw new Error('p1 C、D、E 在有限集上不该有反例');
    console.log(`    p1 有限反例：A |A| = ${badA[0]}、|B| = ${badA[1]}；B |A| = ${badB[0]}、|B| = ${badB[1]}`);

    // 无限集：照证明造 h。每一对都满足 g(f(x)) ≥ x，窗口里的 C 和整个 N 上的一致。
    const pairs: [Injection, Injection][] = [
      [shift(2), shift(1)],
      [times(2), shift(2)],
      [shift(1), shift(1)],
      [times(2), times(2, 1)],
      [times(3, 2), times(2)],
      [square, shift(3)],
      [shift(5), square],
      [swapThenShift, times(2, 1)],
    ];
    for (const [f, g] of pairs) {
      checkInjection(f);
      checkInjection(g);
      const size = 3000;
      for (const n of ints(0, size)) if (g.at(f.at(n)) < n) throw new Error(`${f.name}、${g.name}：g(f(${n})) < ${n}`);
      const c = smallestClosed(f, g, size);
      for (const a of ints(0, size - 1)) if (c.has(a) !== tracesBackToA(f, g, a)) throw new Error(`${f.name}、${g.name}：两种算法对 ${a} 不一致`);
      const h = buildH(f, g, (a) => c.has(a));
      if (!checkBijection(h, size, 30)) throw new Error(`${f.name}、${g.name}：h 在窗口里不是双射`);
    }
    const p1 = trueOptions([badA === null, badB === null, badC === null, badD === null, badE === null]);

    // ---- p2 ----
    const f2 = shift(2);
    const g2 = shift(1);
    const c2 = smallestClosed(f2, g2, 300);
    for (const a of ints(0, 299)) {
      if (c2.has(a) !== (a % 3 === 0)) throw new Error('p2 题面说 C 由 3 的倍数组成，这里对不上');
      if (c2.has(a) !== tracesBackToA(f2, g2, a)) throw new Error('p2 两种算法不一致');
    }
    // 第三种：窗口 {0..11} 上把满足两个条件的子集全部求交（x + 3 超出窗口的不管）
    const W = 12;
    let meet = (1 << W) - 1;
    let closedCount = 0;
    for (let mask = 0; mask < 1 << W; mask++) {
      const has = (x: number): boolean => ((mask >> x) & 1) === 1;
      const containsStart = ints(0, W - 1).every((a) => g2.pre(a) !== null || has(a));
      const closed = ints(0, W - 1).every((x) => !has(x) || g2.at(f2.at(x)) >= W || has(g2.at(f2.at(x))));
      if (containsStart && closed) {
        meet &= mask;
        closedCount++;
      }
    }
    if (closedCount < 2) throw new Error('p2 窗口上满足两个条件的子集应不止一个');
    for (const a of ints(0, W - 1)) if (((meet >> a) & 1) === 1 !== c2.has(a)) throw new Error('p2 求交的结果不一致');
    const h2 = buildH(f2, g2, (a) => a % 3 === 0);
    if (!checkBijection(h2, 299, 250)) throw new Error('p2 的 h 在窗口里不是双射');
    const p2: [number, number] = [h2(9), h2(10)];

    // ---- p3 ----
    const f3 = times(2);
    const g3 = shift(2);
    const c3 = smallestClosed(f3, g3, 100);
    const c3Big = smallestClosed(f3, g3, 5000);
    for (const a of ints(0, 99)) {
      if (c3.has(a) !== c3Big.has(a)) throw new Error('p3 窗口大小影响了 C');
      if (c3.has(a) !== tracesBackToA(f3, g3, a)) throw new Error('p3 两种算法不一致');
    }
    const chains = new Set<number>();
    for (const start of [0, 1]) for (let x = start; x < 100; x = g3.at(f3.at(x))) chains.add(x);
    if (chains.size !== c3.size || [...chains].some((x) => !c3.has(x))) throw new Error('p3 两条链和 C 不一致');
    console.log(`    p3 小于 100 的：${[...c3].sort((x, y) => x - y).join(', ')}`);

    // ---- p4 ----
    const ts = ints(1, 1999).map((k) => k / 2000); // (0, 1) 的样点
    const angles = ints(0, 3999).map((k) => (2 * Math.PI * (k + 0.37)) / 4000);
    const circle = angles.map((t): Point => [Math.cos(t), Math.sin(t)]);
    const circleOk =
      distinct(circle.map(circleToReal)) &&
      // 上半圆的值在 [−1, 1]、下半圆的在 (2, 4)，两段不相交；同一段里 x 相同、y 同号（或 y = 0）推出 y 相同
      circle.every((p) => (p[1] >= 0 ? circleToReal(p) <= 1 : circleToReal(p) > 2)) &&
      ts.every((t) => Math.abs(realToCircle(t)[0] ** 2 + realToCircle(t)[1] ** 2 - 1) < 1e-12) &&
      distinct(ts.map((t) => realToCircle(t)[0]));
    const two = [...ints(0, 1000).map((k) => k / 1000), ...ints(0, 1000).map((k) => 2 + k / 1000)]; // [0,1] ∪ [2,3]
    const intoUnit = (x: number): number => (x + 1) / 5;
    const twoOk = distinct(two.map(intoUnit)) && two.every((x) => intoUnit(x) > 0 && intoUnit(x) < 1) && ts.every((t) => t >= 0 && t <= 1);
    const squash = (x: number): number => (1 + x / (1 + Math.abs(x))) / 2;
    const reals = ints(-4000, 4000).map((k) => k / 7 + 0.013);
    const nonIntegers = reals.filter((x) => !Number.isInteger(x));
    const cOk =
      distinct(nonIntegers.map(squash)) && nonIntegers.every((x) => squash(x) > 0 && squash(x) < 1) && ts.every((t) => !Number.isInteger(t));
    // D：x² − x = x(x−1)、x³ − x² = x²(x−1)、1 − x³ 的零点只有 0、1，开区间里符号不变，各取一点
    const dProbe: [bigint, bigint, string][] = [
      [-1n, 1n, '(−∞,0) 里的 −1'],
      [0n, 1n, '0'],
      [1n, 2n, '(0,1) 里的 1/2'],
      [1n, 1n, '1'],
      [2n, 1n, '(1,+∞) 里的 2'],
    ];
    const dIn = dProbe.filter(([p, q]) => inD(p, q)).map(([, , name]) => name);
    const dGrid = new Set<string>();
    for (let q = 1n; q <= 60n; q++)
      for (let p = -3n * q; p <= 3n * q; p++)
        if (inD(p, q)) dGrid.add((Number(p) / Number(q)).toFixed(9));
    if (dIn.join(';') !== '0;1' || [...dGrid].sort().join(';') !== '0.000000000;1.000000000') throw new Error('p4 D 应只有 0 和 1');
    const eGrid = new Set<string>();
    for (let q = 1n; q <= 24n; q++)
      for (let p = -2n * q; p <= 3n * q; p++)
        for (let r = -2n * q; r <= 2n * q; r++) {
          if (inE(p, r, q)) eGrid.add(`${(Number(p) / Number(q)).toFixed(9)},${(Number(r) / Number(q)).toFixed(9)}`);
          // x² + y² − (2x − 1) = (x − 1)² + y²
          if (p * p + r * r - (2n * p * q - q * q) !== (p - q) * (p - q) + r * r) throw new Error('p4 E 的配方不对');
        }
    if ([...eGrid].join(';') !== '1.000000000,0.000000000') throw new Error('p4 E 应只有 (1, 0)');
    const p4 = trueOptions([circleOk, twoOk, cOk, dGrid.size > 2, eGrid.size > 1]);

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'number', value: c3.size },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
