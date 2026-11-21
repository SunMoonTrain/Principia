// 独立验算 math.logic-sets.nested-quantifiers 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.nested-quantifiers.ts
//
// 量词的取值范围是无穷集时没法穷举，做法分两种：
// - 判断真假（p1）：「∀x ∃y」为真就给出见证 y = w(x)，在一组检验点上逐个核对；为假就给出反例 x₀，
//   说明对每个 y 都不成立（对 y 的一组检验点核对，并在 notes 里写出代数理由）。「∃y ∀x」反过来。
// - 判断两个命题是否「同真同假」或「是否是否定」（p2、p4）：把具体的谓词换成一族不同的谓词
//   （p2 换阈值和取值范围，p4 换 S(p) 代表的整数集合），每一族里逐个求真值，和原命题（或它的否定）比；
//   有一个不一致就排除，全部一致的再用等值变形核对一遍（写在 notes 里）。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

// ---------- p1 ----------

/** 实数检验点：整数、分数、很小和很大的数，正负都有，含 0。 */
const REALS: number[] = (() => {
  const xs = new Set<number>([0, 1e-9, -1e-9, 1e-3, -1e-3, 1e6, -1e6, Math.PI, -Math.E, Math.SQRT2]);
  for (let k = -50; k <= 50; k++) {
    xs.add(k);
    xs.add(k / 7);
    xs.add(k * 37.5);
  }
  return [...xs];
})();

/** 自然数检验点（含 0）。 */
const NATS: number[] = Array.from({ length: 200 }, (_, k) => k);

type Judged = { truth: boolean; why: string };

/** ∀x∈xs ∃y：用见证 w(x) 核对；w 返回 null 表示这个 x 找不到 y（这时在 ys 上核对确实没有）。 */
function forallExists(xs: number[], ys: number[], phi: (x: number, y: number) => boolean, w: (x: number) => number | null): Judged {
  for (const x of xs) {
    const y = w(x);
    if (y === null) {
      if (ys.some((yy) => phi(x, yy))) throw new Error(`x = ${x}：以为没有 y，检验点里却找到了`);
      return { truth: false, why: `反例 x = ${x}` };
    }
    if (!phi(x, y)) throw new Error(`x = ${x}：见证 y = ${y} 不满足`);
  }
  return { truth: true, why: '见证对每个检验点都成立' };
}

/** ∃y∈ys ∀x：给出候选 y₀ 就核对它对所有 x 成立；给 null 就对每个 y 用 c(y) 找出不成立的 x。 */
function existsForall(xs: number[], ys: number[], phi: (x: number, y: number) => boolean, y0: number | null, c: (y: number) => number): Judged {
  if (y0 !== null) {
    if (!xs.every((x) => phi(x, y0))) throw new Error(`y₀ = ${y0} 不是见证`);
    return { truth: true, why: `见证 y = ${y0}` };
  }
  for (const y of ys) if (phi(c(y), y)) throw new Error(`y = ${y}：c(y) 不是反例`);
  return { truth: false, why: '每个 y 都有 x = c(y) 使它不成立' };
}

// ---------- p2 ----------

/** p2 的一族检验：取值范围换成整数的有限子集 D，阈值 0 换成 c。 */
function p2Cases(): { D: number[]; c: number }[] {
  const out: { D: number[]; c: number }[] = [];
  const base = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  // 所有非空子集里取一部分（按位枚举，跳着取），阈值 −3..5
  for (let mask = 1; mask < 1 << base.length; mask += 7) {
    const D = base.filter((_, i) => mask & (1 << i));
    for (let c = -3; c <= 5; c++) out.push({ D, c });
  }
  return out;
}

// ---------- p4 ----------

/**
 * S(p) 换成「p 属于集合 T」。T 在 |p| > 60 以外按周期不超过 6 的规律重复（或者从某处起全真、全假），
 * 所以 n 查到 N、p 查到 ±P（P 比 N 大得多）就能定下真值：
 * 外层「对每个正整数 n」查 n = 1..N；「存在整数 p」「对所有整数 p」查 p = −P..P；
 * E 里夹在 p 后面的「对所有正整数 n，p > n」查 n = 1..P+1（不然窗口外的 p 会冒充「比所有 n 都大」）。
 */
const N = 200;
const P = 2000;

const isPrime = (p: number): boolean => {
  if (p < 2) return false;
  for (let d = 2; d * d <= p; d++) if (p % d === 0) return false;
  return true;
};

const SETS: { name: string; S: (p: number) => boolean }[] = [
  { name: '空集', S: () => false },
  { name: '全体整数', S: () => true },
  { name: '素数', S: isPrime },
  { name: '偶数', S: (p) => p % 2 === 0 },
  { name: '负整数', S: (p) => p < 0 },
  { name: 'p ≤ 10', S: (p) => p <= 10 },
  { name: 'p ≥ −5', S: (p) => p >= -5 },
  { name: '{3}', S: (p) => p === 3 },
  { name: '{−7, 0, 50}', S: (p) => p === -7 || p === 0 || p === 50 },
  { name: '7 的倍数', S: (p) => p % 7 === 0 },
  { name: '模 4 余 1 且大于 20', S: (p) => ((p % 4) + 4) % 4 === 1 && p > 20 },
  { name: '负数或 100', S: (p) => p < 0 || p === 100 },
];

const range = (a: number, b: number): number[] => Array.from({ length: b - a + 1 }, (_, k) => a + k);
const NS = range(1, N);
const PS = range(-P, P);
const NS_INNER = range(1, P + 1);

/** 题干的说法：对每个正整数 n，都有比 n 大的整数 p 使 S(p) 成立。 */
const original = (S: (p: number) => boolean): boolean => NS.every((n) => PS.some((p) => p > n && S(p)));

const p4Options: ((S: (p: number) => boolean) => boolean)[] = [
  // A：∀n∈N⁺, ∃p (S(p) ∧ p > n)
  (S) => NS.every((n) => PS.some((p) => S(p) && p > n)),
  // B：¬(∃n∈N⁺, ∀p (S(p) ⇒ p ≤ n))
  (S) => !NS.some((n) => PS.every((p) => !S(p) || p <= n)),
  // C：∀n∈N⁺, ∃p (S(p) ⇒ p > n)
  (S) => NS.every((n) => PS.some((p) => !S(p) || p > n)),
  // D：∀n∈N⁺, ∃m > n, S(m)（m 是整数）
  (S) => NS.every((n) => range(n + 1, P).some((m) => S(m))),
  // E：∃p (S(p) ∧ ∀n∈N⁺, p > n)
  (S) => PS.some((p) => S(p) && NS_INNER.every((n) => p > n)),
];

export const verification: Verification = {
  lesson: 'math.logic-sets.nested-quantifiers',
  notes: {
    p1:
      '逐条找见证或反例，检验点是 −50..50 的整数、k/7、37.5k、±10⁻⁹、±10⁻³、±10⁶、π 等。' +
      'A：x ≠ 0 时 y = 1/x，x = 0 时 0·y = 0 ≠ 1 对一切 y 成立，反例 x = 0，假。' +
      'B：任给 y，取 x = |y| + 1，x² ≥ |y| + 1 > y，假。C：y = ∛x，真。' +
      'D：x = 0 时自然数里没有比 0 小的 y，假。E：x = 0 使 xy = 0 对一切 y 成立，真。',
    p2:
      '把取值范围 ℝ 换成 {−4..4} 的一组非空子集 D、阈值 0 换成 c = −3..5（共几百组），' +
      '求原命题 ∀x∈D ∃y∈D (x + y² > c) 的真值，找出每一组都和它真值相反的选项：只有「∃x ∀y, x + y² ≤ c」。' +
      '在 ℝ、c = 0 上原命题真（y = |x| + 1），A、B、D 都假，只靠真值分不出，所以换谓词比形式。',
    p3: '对 m = 1, 2, … 逐个查 {1..m} 里有没有 y 被 1..6 都整除，第一个有的 m 就是答案（即 1..6 的最小公倍数）。',
    p4:
      '把 S(p) 换成「p 属于 T」，T 取 12 个集合（空集、全体整数、素数、偶数、负整数、p ≤ 10、p ≥ −5、{3}、{−7, 0, 50}、7 的倍数、模 4 余 1 且大于 20、负数或 100），' +
      'n 查 1..200，p 查 −2000..2000，求原说法和五个选项的真值，每个 T 都一致的选项才算。' +
      '等值核对：A 只换了合取的次序；B 由逐层否定 ¬∃n∀p(S⇒p≤n) ⟺ ∀n∃p(S∧p>n)；D 只把约束变量 p 改名为 m；' +
      'C 对每个 n 取 p = n + 1 就恒真（T 为负整数时原说法假）；E 要一个比所有正整数都大的整数，恒假（T 为素数时原说法真）。',
  },
  compute() {
    // p1
    const opts1: Judged[] = [
      // A：∀x∈R ∃y∈R, xy = 1
      forallExists(REALS, REALS, (x, y) => Math.abs(x * y - 1) < 1e-12, (x) => (x === 0 ? null : 1 / x)),
      // B：∃y∈R ∀x∈R, x² < y
      existsForall(REALS, REALS, (x, y) => x * x < y, null, (y) => Math.abs(y) + 1),
      // C：∀x∈R ∃y∈R, y³ = x
      forallExists(REALS, REALS, (x, y) => Math.abs(y * y * y - x) <= 1e-9 * Math.max(1, Math.abs(x)), (x) => Math.cbrt(x)),
      // D：∀x∈N ∃y∈N, y < x
      forallExists(NATS, NATS, (x, y) => y < x, (x) => (x === 0 ? null : 0)),
      // E：∃x∈R ∀y∈R, xy = 0（existsForall 的第一个参数是里层的变量，这里是 y；外层存在的是 x，见证 x = 0）
      existsForall(REALS, REALS, (y, x) => x * y === 0, 0, () => 1),
    ];
    const p1 = opts1.flatMap((j, i) => (j.truth ? [i + 1] : []));

    // p2
    const cases = p2Cases();
    const orig2 = ({ D, c }: { D: number[]; c: number }): boolean => D.every((x) => D.some((y) => x + y * y > c));
    const opts2: ((t: { D: number[]; c: number }) => boolean)[] = [
      ({ D, c }) => D.every((x) => D.some((y) => x + y * y <= c)), // A
      ({ D, c }) => D.some((x) => D.every((y) => x + y * y <= c)), // B
      ({ D, c }) => D.some((x) => D.some((y) => x + y * y <= c)), // C
      ({ D, c }) => D.some((x) => D.every((y) => x + y * y < c)), // D
    ];
    const p2 = opts2.flatMap((f, i) => (cases.every((t) => f(t) === !orig2(t)) ? [i + 1] : []));
    // 顺带核对 ℝ 上原命题为真：见证 y = |x| + 1
    for (const x of REALS) if (!(x + (Math.abs(x) + 1) ** 2 > 0)) throw new Error('p2：见证不对');

    // p3
    let p3 = 0;
    for (let m = 1; m <= 10_000 && p3 === 0; m++) {
      if (range(1, m).some((y) => range(1, 6).every((x) => y % x === 0))) p3 = m;
    }

    // p4
    const truths = SETS.map(({ S }) => original(S));
    if (!truths.includes(true) || !truths.includes(false)) throw new Error('p4：检验集合应当真假都有');
    const p4 = p4Options.flatMap((f, i) => (SETS.every(({ S }, k) => f(S) === truths[k]) ? [i + 1] : []));

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
