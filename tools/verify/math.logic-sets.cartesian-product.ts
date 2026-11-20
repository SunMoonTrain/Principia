// 独立验算 math.logic-sets.cartesian-product 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.cartesian-product.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

// ---- 有限集合上的有序对和关系的一个小模型 ----

/** 有序对 (a, b)：两个分量都是整数。规范写法 "a,b"，相等就是两个分量分别相等。 */
type Pair = readonly [number, number];

function pairKey([a, b]: Pair): string {
  return `${a},${b}`;
}

/** 笛卡儿积 A × B：第一个分量取自 A、第二个分量取自 B 的全部有序对（照定义两重循环，不用乘法公式）。 */
function product(a: number[], b: number[]): Pair[] {
  const out: Pair[] = [];
  for (const x of a) for (const y of b) out.push([x, y]);
  return out;
}

/** 有序对的集合：按规范写法去重，用来数元素个数、求交。 */
function pairSet(pairs: Pair[]): Set<string> {
  return new Set(pairs.map(pairKey));
}

/** 有限集合 A 上的关系 R（A × A 的子集）是否自反：A 的每个 a 都有 (a, a) ∈ R。 */
function isReflexive(a: number[], r: Set<string>): boolean {
  return a.every((x) => r.has(pairKey([x, x])));
}

/** 有限集合 A 上的关系 R 是否传递：对 A 的任意 x、y、z，(x, y) ∈ R 且 (y, z) ∈ R 就有 (x, z) ∈ R。 */
function isTransitive(a: number[], r: Set<string>): boolean {
  for (const x of a)
    for (const y of a)
      for (const z of a) if (r.has(pairKey([x, y])) && r.has(pairKey([y, z])) && !r.has(pairKey([x, z]))) return false;
  return true;
}

/** 选项序号（从 1 开始）里判为真的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

// ---- p2：Z 上由一个条件规定的关系，逐条在一段整数上找传递性的反例 ----

/** JS 的 % 对负数给负余数，判奇偶用绝对值。 */
function isOdd(n: number): boolean {
  return Math.abs(n) % 2 === 1;
}

const P2_RELATIONS: ((a: number, b: number) => boolean)[] = [
  (a, b) => isOdd(a + b), // A. a + b 是奇数
  (a, b) => !isOdd(a + b), // B. a + b 是偶数
  (a, b) => a * b > 0, // C. ab > 0
  (a, b) => a * b >= 0, // D. ab ≥ 0
  (a, b) => a - b > 0 && !isOdd(a - b), // E. a − b 是正偶数
];

/** 在 [−N, N] 的整数里找 aRb、bRc 而不 aRc 的三元组；找不到返回 null。 */
function transitivityCounterexample(rel: (a: number, b: number) => boolean, n: number): [number, number, number] | null {
  for (let a = -n; a <= n; a++)
    for (let b = -n; b <= n; b++) {
      if (!rel(a, b)) continue;
      for (let c = -n; c <= n; c++) if (rel(b, c) && !rel(a, c)) return [a, b, c];
    }
  return null;
}

// ---- p3、p4：把 A × A 的子集用二进制掩码枚举 ----

/** A × A 的全部有序对，按固定顺序排好，第 i 个对应掩码的第 i 位。 */
function relationsOf(a: number[]): { pairs: Pair[]; fromMask: (mask: number) => Set<string> } {
  const pairs = product(a, a);
  return {
    pairs,
    fromMask: (mask) => pairSet(pairs.filter((_, i) => (mask >> i) & 1)),
  };
}

export const verification: Verification = {
  lesson: 'math.logic-sets.cartesian-product',
  notes: {
    p1:
      '照定义两重循环列出 A × B（3×2 个有序对）和 B × A，把有序对写成规范的 "a,b" 去重后数个数，再逐个查 A × B 的有序对是否也在 B × A 里。' +
      '另用 (A × B) ∩ (B × A) = (A ∩ B) × (B ∩ A) = {1,2} × {1,2} 核对：交集正好是 (1,1)、(1,2)、(2,1)、(2,2)。',
    p2:
      '五个关系在 [−12, 12] 的整数上逐组查 aRb、bRc 时是否 aRc（25³ 组），找到反例的不传递。' +
      '反例：A 取 (0,1)、(1,0)，可 0 + 0 是偶数（不同奇偶「隔一个」就变成同奇偶）；D 取 1·0 ≥ 0、0·(−1) ≥ 0，可 1·(−1) < 0（0 和谁都相关，把正负两边连起来了）。' +
      'B、C、E 在整个 Z 上传递：B 是同奇偶（a + b、b + c 都偶，则 a + c = (a + b) + (b + c) − 2b 偶）；C 是同号且都不为 0；E 两个正偶数之和仍是正偶数。窗口里也没找到反例。',
    p3:
      '把 {1,2,3} × {1,2,3} 的 9 个有序对编成 9 位二进制数，枚举全部 2⁹ = 512 个关系，逐个查是否含 (1,1)、(2,2)、(3,3)，数自反的个数。' +
      '另用计数核对：对角线 3 对必须在，其余 6 对各可要可不要，2⁶ = 64。',
    p4:
      '枚举 {1,…,4} × {1,…,4} 里不在 R 中的 13 个有序对的全部 2¹³ = 8192 种添法，逐个查添完是否既自反又传递，取添的个数的最小值；' +
      '另核对：最小的添法唯一，就是 R 的自反传递闭包减去 R——对角线 4 对加 (1,3)、(2,4)、(1,4)，共 7 对，并且任何既自反又传递、包含 R 的关系都包含这 7 对。',
  },
  compute() {
    // p1：A = {1,2,3}，B = {1,2}
    const A1 = [1, 2, 3];
    const B1 = [1, 2];
    const AxB = pairSet(product(A1, B1));
    const BxA = pairSet(product(B1, A1));
    const inter = new Set([...AxB].filter((k) => BxA.has(k)));
    const expectedInter = pairSet(product([1, 2], [1, 2]));
    if (inter.size !== expectedInter.size || ![...expectedInter].every((k) => inter.has(k)))
      throw new Error(`p1 交集和 {1,2} × {1,2} 不一致：${[...inter].join(' ')}`);
    const p1: [number, number] = [AxB.size, inter.size];

    // p2
    const N = 12;
    const p2Results = P2_RELATIONS.map((rel) => transitivityCounterexample(rel, N) === null);
    // 反例核对
    const relA = P2_RELATIONS[0];
    if (!(relA(0, 1) && relA(1, 0) && !relA(0, 0))) throw new Error('p2 A 的反例没起作用');
    const relD = P2_RELATIONS[3];
    if (!(relD(1, 0) && relD(0, -1) && !relD(1, -1))) throw new Error('p2 D 的反例没起作用');
    // 负数的奇偶判断核对：−3 + 0 是奇数，−3 + (−1) 是偶数，−1 − (−5) = 4 是正偶数
    if (!P2_RELATIONS[0](-3, 0) || !P2_RELATIONS[1](-3, -1) || !P2_RELATIONS[4](-1, -5)) throw new Error('p2 负数的奇偶判断不对');
    const p2 = trueOptions(p2Results);

    // p3：{1,2,3} 上自反的关系
    const A3 = [1, 2, 3];
    const rel3 = relationsOf(A3);
    let p3 = 0;
    for (let mask = 0; mask < 1 << rel3.pairs.length; mask++) if (isReflexive(A3, rel3.fromMask(mask))) p3++;
    if (p3 !== 2 ** (A3.length * A3.length - A3.length)) throw new Error('p3 枚举数出的个数和 2⁶ 不一致');

    // p4：A = {1,2,3,4}，R = {(1,2),(2,3),(3,4)}
    const A4 = [1, 2, 3, 4];
    const R4 = pairSet([
      [1, 2],
      [2, 3],
      [3, 4],
    ]);
    const missing = product(A4, A4).filter((p) => !R4.has(pairKey(p)));
    if (missing.length !== 13) throw new Error('p4 不在 R 里的有序对应有 13 个');
    let best = Infinity;
    const bestAdditions: string[][] = [];
    for (let mask = 0; mask < 1 << missing.length; mask++) {
      const added = missing.filter((_, i) => (mask >> i) & 1);
      const s = new Set([...R4, ...added.map(pairKey)]);
      if (!isReflexive(A4, s) || !isTransitive(A4, s)) continue;
      // 每个合格的关系都要包含自反传递闭包的 7 对新对
      for (const k of ['1,1', '2,2', '3,3', '4,4', '1,3', '2,4', '1,4'])
        if (!s.has(k)) throw new Error(`p4 有一个既自反又传递、包含 R 的关系不含 (${k})`);
      if (added.length < best) {
        best = added.length;
        bestAdditions.length = 0;
      }
      if (added.length === best) bestAdditions.push(added.map(pairKey).sort());
    }
    if (bestAdditions.length !== 1) throw new Error(`p4 最小的添法不唯一：${bestAdditions.length} 种`);
    const closureAdditions = ['1,1', '1,3', '1,4', '2,2', '2,4', '3,3', '4,4'];
    if (bestAdditions[0].join(' ') !== closureAdditions.join(' '))
      throw new Error(`p4 最小的添法是 ${bestAdditions[0].join(' ')}，和自反传递闭包不一致`);
    const p4 = best;

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
