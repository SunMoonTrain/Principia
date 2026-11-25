// 独立验算 math.logic-sets.composition-inverse 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.composition-inverse.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

// ---- 有限集之间的映射：{0..m−1} → {0..n−1} 写成长度 m 的数组，第 i 项是 i 的像 ----

type FiniteMap = number[];

/** 枚举 {0..m−1} → {0..n−1} 的全部映射（共 n^m 个；m = 0 时恰有一个空映射，m > 0、n = 0 时一个也没有）。 */
function allMaps(m: number, n: number): FiniteMap[] {
  let maps: FiniteMap[] = [[]];
  for (let i = 0; i < m; i++) {
    const next: FiniteMap[] = [];
    for (const p of maps) for (let v = 0; v < n; v++) next.push([...p, v]);
    maps = next;
  }
  return maps;
}

/** g∘f：先做 f、再做 g，照 (g∘f)(x) = g(f(x)) 逐点算。 */
function compose(g: FiniteMap, f: FiniteMap): FiniteMap {
  return f.map((y) => g[y]);
}

/** 照定义查单射：任取两个不同的自变量，像都不同。 */
function isInjective(f: FiniteMap): boolean {
  for (let i = 0; i < f.length; i++) for (let j = i + 1; j < f.length; j++) if (f[i] === f[j]) return false;
  return true;
}

/** 照定义查满射：陪域 {0..n−1} 的每个元素都是某个自变量的像。 */
function isSurjective(f: FiniteMap, n: number): boolean {
  for (let y = 0; y < n; y++) if (!f.some((v) => v === y)) return false;
  return true;
}

function isIdentity(f: FiniteMap, n: number): boolean {
  return f.length === n && f.every((v, i) => v === i);
}

/** 选项序号（从 1 开始）里判为真的那些。 */
function trueOptions(results: boolean[]): number[] {
  return results.flatMap((t, i) => (t ? [i + 1] : []));
}

// ---- p3：五个「若……则……」，对集合大小 0..4 的全部 (A, B, C, f, g) 逐个查 ----

interface Case {
  a: number;
  b: number;
  c: number;
  f: FiniteMap;
  g: FiniteMap;
}

type Claim = { premise: (k: Case) => boolean; conclusion: (k: Case) => boolean };

const gf = (k: Case): FiniteMap => compose(k.g, k.f);

const P3_CLAIMS: Claim[] = [
  // A. 若 g∘f 是单射，则 g 是单射
  { premise: (k) => isInjective(gf(k)), conclusion: (k) => isInjective(k.g) },
  // B. 若 g∘f 是单射，则 f 是单射
  { premise: (k) => isInjective(gf(k)), conclusion: (k) => isInjective(k.f) },
  // C. 若 g∘f 是满射，则 f 是满射
  { premise: (k) => isSurjective(gf(k), k.c), conclusion: (k) => isSurjective(k.f, k.b) },
  // D. 若 g∘f 是满射，则 g 是满射
  { premise: (k) => isSurjective(gf(k), k.c), conclusion: (k) => isSurjective(k.g, k.c) },
  // E. 若 g∘f 是单射，并且 f 是满射，则 g 是双射
  {
    premise: (k) => isInjective(gf(k)) && isSurjective(k.f, k.b),
    conclusion: (k) => isInjective(k.g) && isSurjective(k.g, k.c),
  },
];

/** 全部检验用的 (A, B, C, f, g)：|A|、|B|、|C| 都取 0..4。 */
function allCases(max: number): Case[] {
  const out: Case[] = [];
  for (let a = 0; a <= max; a++)
    for (let b = 0; b <= max; b++)
      for (let c = 0; c <= max; c++)
        for (const f of allMaps(a, b)) for (const g of allMaps(b, c)) out.push({ a, b, c, f, g });
  return out;
}

/** 找反例：前提成立、结论不成立。 */
function counterexample(claim: Claim, cases: Case[]): Case | null {
  for (const k of cases) if (claim.premise(k) && !claim.conclusion(k)) return k;
  return null;
}

// ---- p2：f(x) = x³ + 2x 的逆映射，按「方程 f(x) = y 的唯一解」求 ----

const f2 = (x: number): number => x ** 3 + 2 * x;

/** 二分法：f2 在 [lo, hi] 上严格递增，求 f2(x) = y 的解。 */
function bisect(y: number): number {
  let lo = -100;
  let hi = 100;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (f2(mid) < y) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** 在整数里找 f2(x) = y 的全部解。 */
function integerPreimages(y: number): number[] {
  const out: number[] = [];
  for (let x = -1000; x <= 1000; x++) if (f2(x) === y) out.push(x);
  return out;
}

export const verification: Verification = {
  lesson: 'math.logic-sets.composition-inverse',
  notes: {
    p1:
      '照 (g∘f)(x) = g(f(x))、(f∘g)(x) = f(g(x)) 逐步代入：f(2) = 3、g(3) = 10；g(2) = 5、f(5) = 9。' +
      '另把两个复合的一般式 (2x−1)² + 1 和 2(x²+1) − 1 在 x = 2 处各算一遍核对，并在 −20..20 上核对一般式和逐步代入处处相同。',
    p2:
      '按「f⁻¹(y) 是方程 f(x) = y 的唯一解」求：在 −1000..1000 的整数里找 x³ + 2x = y 的全部解（各恰好一个），' +
      '再用二分法在 [−100, 100] 上求实数解核对。唯一性另核对：f(x₂) − f(x₁) = (x₂ − x₁)(x₁² + x₁x₂ + x₂² + 2)，第二个因子 ≥ 2 > 0，所以 f 严格递增；在 −50..50、步长 0.01 的点上核对递增。',
    p3:
      '|A|、|B|、|C| 各取 0..4（含空集），枚举全部 f: A → B、g: B → C，照定义逐个查单射、满射（满射对着陪域 B 或 C 查），' +
      '对五个「若……则……」找「前提成立、结论不成立」的反例。A、C、E 有反例：A、C 取 A = C = {0}、B = {0,1}、f(0) = 0、g 把 0、1 都送到 0（g∘f 是双射，g 不单射、f 不满射）；' +
      'E 取 A = B = {0}、C = {0,1}、f(0) = g(0) = 0（g∘f 单射、f 满射，g 不满射）。B、D 没有反例，并且对任意集合成立：' +
      'f(x₁) = f(x₂) 推出 g(f(x₁)) = g(f(x₂))，g∘f 单射时得 x₁ = x₂；g∘f 满射时每个 z ∈ C 写成 g(f(x))，就是 f(x) ∈ B 的像。',
    p4:
      '（1）枚举 {1,…,5} → {1,2,3} 的全部 3⁵ = 243 个映射 g，数 g∘f = id 的个数；另用乘法原理核对：g 在 2、5、1 处被定死，在 3、4 处各有 3 种取法，3² = 9。' +
      '（2）枚举 {1,2,3} → {1,…,6} 的全部 6³ = 216 个映射 h，数 f∘h = id 的个数；另核对：h(y) 要取在 y 的原像里，个数 1·2·3 = 6。' +
      '同时核对 f 确实是单射（第 1 问）、满射（第 2 问），并照定义查每个数出来的 g、h。',
  },
  compute() {
    // p1
    const f1 = (x: number): number => 2 * x - 1;
    const g1 = (x: number): number => x * x + 1;
    const p1: [number, number] = [g1(f1(2)), f1(g1(2))];
    for (let x = -20; x <= 20; x++) {
      if (g1(f1(x)) !== (2 * x - 1) ** 2 + 1) throw new Error(`p1 g∘f 在 x = ${x} 处和一般式不同`);
      if (f1(g1(x)) !== 2 * (x * x + 1) - 1) throw new Error(`p1 f∘g 在 x = ${x} 处和一般式不同`);
    }

    // p2
    const targets = [33, -72];
    const roots = targets.map((y) => {
      const ints = integerPreimages(y);
      if (ints.length !== 1) throw new Error(`p2 y = ${y} 的整数解有 ${ints.length} 个`);
      if (Math.abs(bisect(y) - ints[0]) > 1e-9) throw new Error(`p2 y = ${y} 二分法得到 ${bisect(y)}`);
      if (f2(ints[0]) !== y) throw new Error(`p2 验根失败：f(${ints[0]}) ≠ ${y}`);
      return ints[0];
    });
    for (let i = -5000; i < 5000; i++) if (!(f2(i / 100) < f2((i + 1) / 100))) throw new Error(`p2 f 在 ${i / 100} 附近不递增`);
    const p2: [number, number] = [roots[0], roots[1]];

    // p3
    const cases = allCases(4);
    const found = P3_CLAIMS.map((c) => counterexample(c, cases));
    const p3Results = found.map((k) => k === null);
    // 判「否」的三个：具体反例
    const badAC: Case = { a: 1, b: 2, c: 1, f: [0], g: [0, 0] };
    for (const i of [0, 2]) {
      if (!P3_CLAIMS[i].premise(badAC) || P3_CLAIMS[i].conclusion(badAC)) throw new Error(`p3 第 ${i + 1} 项的反例没起作用`);
    }
    const badE: Case = { a: 1, b: 1, c: 2, f: [0], g: [0] };
    if (!P3_CLAIMS[4].premise(badE) || P3_CLAIMS[4].conclusion(badE)) throw new Error('p3 第 5 项的反例没起作用');
    // E 的前提只推得出 g 是单射：前提成立的每个例子里 g 都是单射
    for (const k of cases) if (P3_CLAIMS[4].premise(k) && !isInjective(k.g)) throw new Error('p3 E 的前提下 g 应是单射');
    const p3 = trueOptions(p3Results);

    // p4
    // （1）自变量 1,2,3 记作 0,1,2；陪域 {1,…,5} 记作 0..4
    const f41: FiniteMap = [2, 5, 1].map((v) => v - 1);
    if (!isInjective(f41)) throw new Error('p4（1）的 f 应是单射');
    const lefts = allMaps(5, 3).filter((g) => isIdentity(compose(g, f41), 3));
    for (const g of lefts) if (g[1] !== 0 || g[4] !== 1 || g[0] !== 2) throw new Error('p4（1）数出的左逆不对');
    if (lefts.length !== 3 ** 2) throw new Error('p4（1）枚举和乘法原理不一致');
    // （2）自变量 1..6 记作 0..5；陪域 {1,2,3} 记作 0..2
    const f42: FiniteMap = [1, 2, 2, 3, 3, 3].map((v) => v - 1);
    if (!isSurjective(f42, 3)) throw new Error('p4（2）的 f 应是满射');
    const rights = allMaps(3, 6).filter((h) => isIdentity(compose(f42, h), 3));
    const fibres = [0, 1, 2].map((y) => f42.filter((v) => v === y).length);
    if (rights.length !== fibres.reduce((s, n) => s * n, 1)) throw new Error('p4（2）枚举和乘法原理不一致');
    const p4: [number, number] = [lefts.length, rights.length];

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'choice', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
