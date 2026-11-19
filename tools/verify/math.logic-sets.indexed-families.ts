// 独立验算 math.logic-sets.indexed-families 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.indexed-families.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

// ---- 有理数：分子、分母都是整数（分母为正），比较大小全用整数乘法，不用浮点 ----

interface Rat {
  p: number;
  q: number;
}

function rat(p: number, q = 1): Rat {
  if (q <= 0) throw new Error('分母要为正');
  return { p, q };
}

/** a < b */
function lt(a: Rat, b: Rat): boolean {
  return a.p * b.q < b.p * a.q;
}

/** a ≤ b */
function le(a: Rat, b: Rat): boolean {
  return a.p * b.q <= b.p * a.q;
}

function show(a: Rat): string {
  return a.q === 1 ? String(a.p) : `${a.p}/${a.q}`;
}

// ---- 实数轴上的区间：两个端点加上各自开、闭 ----

interface Interval {
  lo: Rat;
  hi: Rat;
  loClosed: boolean;
  hiClosed: boolean;
}

function contains(I: Interval, x: Rat): boolean {
  const left = I.loClosed ? le(I.lo, x) : lt(I.lo, x);
  const right = I.hiClosed ? le(x, I.hi) : lt(x, I.hi);
  return left && right;
}

/** 两个区间有没有公共点：左端点取较大的、右端点取较小的，比较时把开闭考虑进去。 */
function intervalsMeet(A: Interval, B: Interval): boolean {
  // 交集的左端点：取较大的那个；两个左端点相等时，两边都闭才算闭
  let lo: Rat;
  let loClosed: boolean;
  if (lt(A.lo, B.lo)) [lo, loClosed] = [B.lo, B.loClosed];
  else if (lt(B.lo, A.lo)) [lo, loClosed] = [A.lo, A.loClosed];
  else [lo, loClosed] = [A.lo, A.loClosed && B.loClosed];
  let hi: Rat;
  let hiClosed: boolean;
  if (lt(A.hi, B.hi)) [hi, hiClosed] = [A.hi, A.hiClosed];
  else if (lt(B.hi, A.hi)) [hi, hiClosed] = [B.hi, B.hiClosed];
  else [hi, hiClosed] = [A.hi, A.hiClosed && B.hiClosed];
  if (lt(lo, hi)) return true;
  // 左右端点重合：只有两头都闭时才剩下这一个点
  if (le(lo, hi) && le(hi, lo)) return loClosed && hiClosed;
  return false;
}

/** 有限整数集合的交集是否为空 */
function finiteMeet(a: number[], b: number[]): boolean {
  const s = new Set(a);
  return b.some((x) => s.has(x));
}

/** 一族集合（指标在给定的有限窗口里）是否两两不相交：对每一对不同的指标 i ≠ j，查 A_i ∩ A_j 是否为空。 */
function pairwiseDisjoint<T>(indices: number[], member: (i: number) => T, meet: (a: T, b: T) => boolean): { ok: boolean; witness?: string } {
  for (const i of indices) {
    for (const j of indices) {
      if (i === j) continue;
      if (meet(member(i), member(j))) return { ok: false, witness: `i=${i}, j=${j}` };
    }
  }
  return { ok: true };
}

export const verification: Verification = {
  lesson: 'math.logic-sets.indexed-families',
  notes: {
    p1:
      '对 0 到 3 之间分母 1–200 的全部既约有理数 x（36697 个），用整数乘法精确判断 x 是否属于 n = 1, 2, …, 20000 的每一个 [1, 1+1/n)' +
      '（x = p/q > 1 时 x − 1 ≥ 1/q，到 n = q ≤ 200 时一定已经出界，所以 2 万个 n 足够判出「不属于」）；再把四个选项的集合在同一组点上逐点比对，' +
      '只留下处处一致的选项。x = 1 属于每一个，x = 1 + 1/200 在 n = 200 时出界。',
    p2: '对 k = 1, …, 10 逐个列出 A_k = {k, …, 2k}；并集把所有元素放进集合去重再数个数，交集逐个查 1 到 20 的整数是否属于每一个 A_k。',
    p3:
      '五个集族各取指标窗口（ℤ 取 −30 到 30，ℕ 取 0 到 60），对每一对不同的指标 i ≠ j 查 A_i ∩ A_j 是否为空：区间用有理端点加开闭标记精确判断有没有公共点，' +
      '有限集直接求交集。B 在 n = 0、1 时交于 1；D 在 n = 0、1 时交于 1；E 在 n = 1、−1 时两个指标不同、集合都是 {1, −1}，交集不空。' +
      'A、C 在窗口里没有相交的一对（区间 [n, n+1) 两两错开、{2n, 2n+1} 互不重叠，平移不变，窗口外同理）。',
    p4:
      '对整数 x ∈ [−10, 10] 判断是否存在 t ∈ [0, 1] 使 x² ≤ 20t(1−t)：在 t = k/M（M = 10000，k = 0, …, M）上用整数比较 x²M² ≤ 20k(M−k)；' +
      '网格含 t = 1/2，那里 20t(1−t) = 5，另用 20t(1−t) = 5 − 20(t − 1/2)² ≤ 5 核对网格最大值就是全体 t 上的最大值，所以网格不会漏掉也不会多判。' +
      '|x| ≥ 3 时 x² ≥ 9 > 5，都不在并里。（第 1 轮修订把题改成问并有几个元素，复核时改成返回并里整数的个数。）',
  },
  compute() {
    // ---- p1：⋂_{n≥1} [1, 1 + 1/n) ----
    const N1 = 20000;
    const inAll = (x: Rat): boolean => {
      for (let n = 1; n <= N1; n++) {
        const I: Interval = { lo: rat(1), hi: rat(n + 1, n), loClosed: true, hiClosed: false };
        if (!contains(I, x)) return false;
      }
      return true;
    };
    const points: Rat[] = [];
    const seen = new Set<string>();
    for (let q = 1; q <= 200; q++) {
      for (let p = 0; p <= 3 * q; p++) {
        // 只保留既约分数，免得同一个数算很多遍
        let a = p;
        let b = q;
        while (b) [a, b] = [b, a % b];
        if (a !== 1 && !(p === 0 && q === 1)) continue;
        const key = `${p}/${q}`;
        if (seen.has(key)) continue;
        seen.add(key);
        points.push(rat(p, q));
      }
    }
    const truth = points.map(inAll);
    const options1: ((x: Rat) => boolean)[] = [
      () => false, // A. ∅
      (x) => contains({ lo: rat(1), hi: rat(2), loClosed: true, hiClosed: false }, x), // B. [1, 2)
      (x) => contains({ lo: rat(1), hi: rat(2), loClosed: false, hiClosed: false }, x), // C. (1, 2)
      (x) => le(x, rat(1)) && le(rat(1), x), // D. {1}
    ];
    const p1 = options1.flatMap((f, i) => (points.every((x, k) => f(x) === truth[k]) ? [i + 1] : []));
    const inside = points.filter((_, k) => truth[k]).map(show);
    if (inside.length !== 1 || inside[0] !== '1') throw new Error(`p1 的交集在检验点上不是只有 1：${inside.join(', ')}`);
    if (inAll(rat(201, 200))) throw new Error('p1：1 + 1/200 不应属于交集');

    // ---- p2：A_k = {k, …, 2k}，k = 1, …, 10 ----
    const families2: number[][] = [];
    for (let k = 1; k <= 10; k++) {
      const A: number[] = [];
      for (let m = k; m <= 2 * k; m++) A.push(m);
      families2.push(A);
    }
    const union2 = new Set<number>();
    for (const A of families2) for (const m of A) union2.add(m);
    const inter2: number[] = [];
    for (let m = 1; m <= 20; m++) if (families2.every((A) => A.includes(m))) inter2.push(m);
    const p2 = [union2.size, inter2.length];

    // ---- p3：哪些集族两两不相交 ----
    const Zwin: number[] = [];
    for (let n = -30; n <= 30; n++) Zwin.push(n);
    const Nwin: number[] = [];
    for (let n = 0; n <= 60; n++) Nwin.push(n);
    const half = (n: number): Interval => ({ lo: rat(n), hi: rat(n + 1), loClosed: true, hiClosed: false });
    const closed = (n: number): Interval => ({ lo: rat(n), hi: rat(n + 1), loClosed: true, hiClosed: true });
    const checks3 = [
      pairwiseDisjoint(Zwin, half, intervalsMeet), // A. {[n, n+1)}_{n∈ℤ}
      pairwiseDisjoint(Zwin, closed, intervalsMeet), // B. {[n, n+1]}_{n∈ℤ}
      pairwiseDisjoint(Nwin, (n) => [2 * n, 2 * n + 1], finiteMeet), // C. {{2n, 2n+1}}_{n∈ℕ}
      pairwiseDisjoint(Nwin, (n) => [n, n + 1], finiteMeet), // D. {{n, n+1}}_{n∈ℕ}
      pairwiseDisjoint(Zwin, (n) => [n, -n], finiteMeet), // E. {{n, −n}}_{n∈ℤ}
    ];
    const p3 = checks3.flatMap((c, i) => (c.ok ? [i + 1] : []));
    // 反例要和 notes 里写的一致
    if (checks3[1].ok || checks3[3].ok || checks3[4].ok) throw new Error('p3：B、D、E 应当各有一对相交');

    // ---- p4：⋃_{t∈[0,1]} {x ∈ ℤ : x² ≤ 20t(1−t)} ----
    const M = 10000;
    let gridMaxNum = -1; // 20k(M−k) 的最大值，对应 20t(1−t) = gridMaxNum / M²
    for (let k = 0; k <= M; k++) gridMaxNum = Math.max(gridMaxNum, 20 * k * (M - k));
    if (gridMaxNum !== 5 * M * M) throw new Error('p4：网格上的最大值应是 5（t = 1/2）');
    // 上界：20t(1−t) = 5 − 20(t − 1/2)² ≤ 5，对网格外的 t 也成立；在网格点上逐个核对这个恒等式
    for (let k = 0; k <= M; k++) {
      const lhs = 20 * k * (M - k); // 20t(1−t)·M²
      const rhs = 5 * M * M - 20 * (2 * k - M) * (2 * k - M) / 4; // (5 − 20(t−1/2)²)·M²
      if (lhs !== rhs) throw new Error('p4：恒等式核对失败');
    }
    const union4: number[] = [];
    for (let x = -10; x <= 10; x++) {
      let found = false;
      for (let k = 0; k <= M && !found; k++) if (x * x * M * M <= 20 * k * (M - k)) found = true;
      if (found) union4.push(x);
    }
    const p4 = union4.length;

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'choice', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
