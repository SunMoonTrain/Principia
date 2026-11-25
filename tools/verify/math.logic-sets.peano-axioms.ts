// 独立验算 math.logic-sets.peano-axioms 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.peano-axioms.ts
// 公理的编号照这一节讲解里的：(1) 0 ∈ N；(2) S 是 N → N；(3) S(n) ≠ 0；(4) S(m) = S(n) 推出 m = n；(5) 归纳公理。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

// ---- p1：五个系统，在检验用的有限窗口上照五条公理逐条查 ----

interface System {
  /** 是不是集合的元素。 */
  inSet: (n: number) => boolean;
  start: number;
  next: (n: number) => number;
}

/** 窗口：|n| ≤ W 的元素都查到。各系统的 S 都是一两段一次式，违反 (3)、(4) 的例子都在起点附近，窗口取得很大。 */
const W = 2000;

const isInt = (n: number): boolean => Number.isInteger(n);
const isNat = (n: number): boolean => Number.isInteger(n) && n >= 0;

const SYSTEMS: System[] = [
  // A：Z，从 0 起，S(n) = n + 1
  { inSet: isInt, start: 0, next: (n) => n + 1 },
  // B：N，从 0 起，S(n) = 2n + 1
  { inSet: isNat, start: 0, next: (n) => 2 * n + 1 },
  // C：N，从 1 起，n 是奇数时 S(n) = n − 1，n 是偶数时 S(n) = n + 3
  { inSet: isNat, start: 1, next: (n) => (n % 2 === 1 ? n - 1 : n + 3) },
  // D：Z，从 0 起，S(n) = |n| + 1
  { inSet: isInt, start: 0, next: (n) => Math.abs(n) + 1 },
  // E：Z，从 0 起，n > 0 时 S(n) = −n，n ≤ 0 时 S(n) = 1 − n
  { inSet: isInt, start: 0, next: (n) => (n > 0 ? -n : 1 - n) },
];

function windowOf(sys: System): number[] {
  const out: number[] = [];
  for (let n = -W; n <= W; n++) if (sys.inSet(n)) out.push(n);
  return out;
}

/** 违反的公理的编号（升序）；空数组就是五条都成立。 */
function violated(sys: System): number[] {
  const bad: number[] = [];
  const els = windowOf(sys);
  if (!sys.inSet(sys.start)) bad.push(1);
  if (els.some((n) => !sys.inSet(sys.next(n)))) bad.push(2);
  if (els.some((n) => sys.next(n) === sys.start)) bad.push(3);
  if (new Set(els.map((n) => sys.next(n))).size !== els.length) bad.push(4);
  // (5)：含起点、对 S 封闭的子集里最小的是从起点出发的轨道，轨道是全部 ⇔ (5) 成立。
  // 走 6W 步，看窗口里的元素是不是都走到了；有没走到的，要求轨道严格增并且已经超出窗口，这样以后也不会再走回来。
  const orbit: number[] = [sys.start];
  for (let k = 1; k < 6 * W && Math.abs(orbit[k - 1]) < 1e15; k++) orbit.push(sys.next(orbit[k - 1]));
  const seen = new Set(orbit);
  if (els.some((n) => !seen.has(n))) {
    const increasing = orbit.slice(1).every((v, i) => v > orbit[i]);
    if (!(increasing && orbit[orbit.length - 1] > W)) throw new Error('判不出 (5)：有没走到的元素，可轨道不是严格增');
    bad.push(5);
  }
  return bad;
}

/** 子集（用谓词给出）含起点、对 S 封闭，却漏了 missing：违反 (5) 的具体例子。 */
function breaksInduction(sys: System, inSubset: (n: number) => boolean, missing: number): boolean {
  return (
    inSubset(sys.start) &&
    windowOf(sys).every((n) => !inSubset(n) || inSubset(sys.next(n))) &&
    sys.inSet(missing) &&
    !inSubset(missing)
  );
}

function walk(sys: System, k: number): string {
  const out = [sys.start];
  while (out.length < k) out.push(sys.next(out[out.length - 1]));
  return out.join(',');
}

// ---- p4：{0,1,2,3} 上全部 256 个 S，逐个查 (5)、(4)。(1)、(2) 由题面保证 ----

function enumerateMaps(size: number): number[][] {
  let maps: number[][] = [[]];
  for (let i = 0; i < size; i++) maps = maps.flatMap((m) => Array.from({ length: size }, (_, v) => [...m, v]));
  return maps;
}

/** (5)：全部 2^size 个子集 A 里，含 0、对 S 封闭的只有全集。照公理的字面查，不用轨道。 */
function inductionHolds(s: number[]): boolean {
  const full = (1 << s.length) - 1;
  for (let mask = 0; mask <= full; mask++) {
    const has = (i: number): boolean => ((mask >> i) & 1) === 1;
    if (!has(0)) continue;
    if (s.every((v, i) => !has(i) || has(v)) && mask !== full) return false;
  }
  return true;
}

/** (4)：对所有 m、n，S(m) = S(n) 推出 m = n。 */
function cancelHolds(s: number[]): boolean {
  return s.every((a, m) => s.every((b, n) => a !== b || m === n));
}

export const verification: Verification = {
  lesson: 'math.logic-sets.peano-axioms',
  notes: {
    p1:
      '五个系统都在 |n| ≤ 2000 的窗口上照五条公理逐条查：(2) 看 S(n) 在不在集合里，(3) 看 S(n) 是不是起点，(4) 看有没有两个元素的后继相同，' +
      '(5) 从起点走 12000 步，看窗口里的元素是否都走到（含起点、对 S 封闭的最小子集就是这条轨道；没走到的另核轨道严格增，以后也走不到）。' +
      '判「否」的另拿具体反例核对：A 的 S(−1)=0、子集 N 漏了 −1；B 的子集「0 和全体正奇数」漏了 2；D 的 S(1)=S(−1)=2、子集 N 漏了 −1。' +
      '判「是」的核对走法：C 是 1,0,3,2,5,4,7,6，E 是 0,1,−1,2,−2,3,−3。',
    p2: '从 h(0)=3 起照递推式走 6 步，另用 h(n)=2^(n+1)+1（h(n)−1 每步翻倍）核对。',
    p3: '先照 a_{n+2}=a_{n+1}+2a_n 直接算 a_5、a_6，再取 g(x,y)=(y,y+2x)、c=(1,1) 走 5 步；两种算法、以及 a_n=(2^(n+1)+(−1)^n)/3 都要一致。',
    p4: '枚举 {0,1,2,3} 上全部 256 个 S；(5) 照字面枚举 16 个子集 A，含 0、对 S 封闭的只有全集才算满足；再从里面数满足 (4)（任取 m、n 照字面查）的。',
  },
  compute() {
    // p1
    const [A, B, C, D, E] = SYSTEMS;
    const bad = SYSTEMS.map(violated);
    const p1 = bad.flatMap((b, i) => (b.length === 0 ? [i + 1] : []));
    if (bad[0].join() !== '3,5' || bad[1].join() !== '5' || bad[3].join() !== '4,5') throw new Error(`p1 违反的公理：${bad.join(' / ')}`);
    if (!(A.next(-1) === 0 && breaksInduction(A, (n) => n >= 0, -1))) throw new Error('p1 A 的反例不对');
    if (!breaksInduction(B, (n) => n === 0 || n % 2 === 1, 2)) throw new Error('p1 B 的反例不对');
    if (!(D.next(1) === 2 && D.next(-1) === 2 && breaksInduction(D, (n) => n >= 0, -1))) throw new Error('p1 D 的反例不对');
    if (walk(C, 8) !== '1,0,3,2,5,4,7,6' || walk(E, 7) !== '0,1,-1,2,-2,3,-3') throw new Error('p1 C、E 的走法不对');

    // p2
    let h = 3;
    for (let k = 0; k < 6; k++) h = 2 * h - 1;
    if (h !== 2 ** 7 + 1) throw new Error('p2 两种算法不一致');

    // p3
    const a = [1, 1];
    for (let n = 0; n < 8; n++) a.push(a[n + 1] + 2 * a[n]);
    let pair: [number, number] = [1, 1];
    for (let k = 0; k < 5; k++) pair = [pair[1], pair[1] + 2 * pair[0]];
    const closed = (n: number): number => (2 ** (n + 1) + (n % 2 === 0 ? 1 : -1)) / 3;
    if (pair[0] !== a[5] || pair[1] !== a[6] || closed(5) !== a[5] || closed(6) !== a[6]) throw new Error('p3 几种算法不一致');

    // p4
    const maps = enumerateMaps(4);
    if (maps.length !== 4 ** 4) throw new Error('p4 应该有 256 个 S');
    const ind = maps.filter(inductionHolds);
    const both = ind.filter(cancelHolds);

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'number', value: h },
      p3: { type: 'tuple', value: [pair[0], pair[1]] },
      p4: { type: 'tuple', value: [ind.length, both.length] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
