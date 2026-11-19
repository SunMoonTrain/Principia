// 独立验算 math.logic-sets.direct-proof 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.direct-proof.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

/** 三个原子命题的全部 8 种真值组合。 */
const assignments: [boolean, boolean, boolean][] = [];
for (let i = 0; i < 8; i++) assignments.push([(i & 4) !== 0, (i & 2) !== 0, (i & 1) !== 0]);

type Formula = (p: boolean, a: boolean, b: boolean) => boolean;
const implies = (x: boolean, y: boolean): boolean => !x || y;
/** 两个式子在 8 种真值组合下处处同真同假。 */
const equivalent = (f: Formula, g: Formula): boolean => assignments.every(([p, a, b]) => f(p, a, b) === g(p, a, b));

/** 整数 m 除以正整数 d 的余数，取 0 ≤ r < d（负数也这样取）。 */
const mod = (m: bigint, d: bigint): bigint => ((m % d) + d) % d;

export const verification: Verification = {
  lesson: 'math.logic-sets.direct-proof',
  notes: {
    p1:
      '反例要同时满足两条：在取值范围里（是正整数），并且使「2^n > n^2」不成立。逐个选项用 BigInt 算 2^n 和 n^2：' +
      'n = 1 时 2 > 1 成立，不是反例；n = 2、3、4 时 4 ≤ 4、8 ≤ 9、16 ≤ 16，不成立，是反例；n = −1 时 2^n = 1/2 < 1，式子也不成立，' +
      '但 −1 不是正整数，不在命题说的范围里，不算反例（用有理数 1/2 与 1 比较，不用浮点）。另在 n = 1..2000 上扫一遍：不成立的正整数恰好是 2、3、4。',
    p2:
      '记 P =「a + b 是无理数」，A =「a 是无理数」，B =「b 是无理数」（a、b 是实数，「不是无理数」就是「是有理数」）。原命题是 P ⇒ (A ∨ B)，' +
      '它的逆否命题是 ¬(A ∨ B) ⇒ ¬P。四个选项译成 (¬A ∨ ¬B) ⇒ ¬P、¬P ⇒ (¬A ∧ ¬B)、(¬A ∧ ¬B) ⇒ ¬P、(A ∨ B) ⇒ P，' +
      '在 P、A、B 的 8 种真值组合下逐个比：前提和 ¬(A ∨ B) 同真同假、结论和 ¬P 同真同假的只有 C；整体和原命题逻辑等价的也只有 C。' +
      '（手算另核对 A、B、D 本身是假命题：a = 0、b = √2 否定 A；a = √2、b = −√2 否定 B 和 D。）',
    p3:
      '对 n = −10000..10000 逐个算 n² 除以 8 的余数（BigInt，余数取 0..7），收集出现过的值，得 {0, 1, 4}。' +
      '余数只由 n 除以 8 的余数决定（(n + 8k)² = n² + 16kn + 64k²），所以扫一个完整周期就够，扫这么多只是核对。',
    p4:
      'n² > 20n + 100 等价于 (n − 10)² > 200。在 n = 1..10^6 上逐个检查，记下不满足的最大正整数（24：576 < 580）；' +
      '当 n ≥ 25 时 n − 10 ≥ 15，(n − 10)² ≥ 225 > 200，而且 n ≥ 10 时 (n − 10)² 随 n 增大，所以 24 以后全部满足。' +
      '于是 N = 24 满足要求；N ≤ 23 时 n = 24 > N 不满足，不行。最小的 N 是 24（是正整数）。',
  },
  compute() {
    // p1：对所有正整数 n，2^n > n^2
    const options1 = [1, 2, 3, 4, -1];
    const holds = (n: number): boolean => {
      // 2^n > n^2；n 为负数时 2^n = 1/2^{-n}，比较 1 > n^2·2^{-n}
      if (n >= 0) return 2n ** BigInt(n) > BigInt(n) ** 2n;
      return 1n > BigInt(n) ** 2n * 2n ** BigInt(-n);
    };
    const inDomain = (n: number): boolean => Number.isInteger(n) && n >= 1;
    const p1 = options1.map((n, i) => (inDomain(n) && !holds(n) ? i + 1 : 0)).filter((i) => i > 0);
    if (holds(-1)) throw new Error('p1：n = −1 时式子应不成立（只是不在取值范围里）');
    const failing: number[] = [];
    for (let n = 1; n <= 2000; n++) if (!holds(n)) failing.push(n);
    if (failing.join(',') !== '2,3,4') throw new Error(`p1：正整数里的反例应恰为 2、3、4，算得 ${failing.join('、')}`);

    // p2：逆否命题
    const original: Formula = (p, a, b) => implies(p, a || b);
    const options2: { premise: Formula; conclusion: Formula }[] = [
      { premise: (_p, a, b) => !a || !b, conclusion: (p) => !p }, // A：至少一个有理数 ⇒ a+b 有理数
      { premise: (p) => !p, conclusion: (_p, a, b) => !a && !b }, // B：a+b 有理数 ⇒ 都是有理数
      { premise: (_p, a, b) => !a && !b, conclusion: (p) => !p }, // C：都是有理数 ⇒ a+b 有理数
      { premise: (_p, a, b) => a || b, conclusion: (p) => p }, // D：至少一个无理数 ⇒ a+b 无理数
    ];
    const contraPremise: Formula = (_p, a, b) => !(a || b);
    const contraConclusion: Formula = (p) => !p;
    const isContrapositive = options2.map((o) => equivalent(o.premise, contraPremise) && equivalent(o.conclusion, contraConclusion));
    const isEquivalent = options2.map((o) => equivalent((p, a, b) => implies(o.premise(p, a, b), o.conclusion(p, a, b)), original));
    if (isContrapositive.join() !== isEquivalent.join()) throw new Error('p2：逆否命题与逻辑等价的选项应是同一个');
    const p2 = isContrapositive.map((x, i) => (x ? i + 1 : 0)).filter((i) => i > 0);

    // p3：整数的平方除以 8 的余数
    const rem = new Set<number>();
    for (let n = -10000n; n <= 10000n; n++) rem.add(Number(mod(n * n, 8n)));
    const p3 = [...rem].sort((x, y) => x - y);

    // p4：最小的正整数 N，使所有 n > N 都有 n^2 > 20n + 100
    const ok4 = (n: bigint): boolean => n * n > 20n * n + 100n;
    let lastFail = 0n;
    for (let n = 1n; n <= 1_000_000n; n++) if (!ok4(n)) lastFail = n;
    // n ≥ 25 时 (n − 10)² ≥ 225 > 200，且递增：之后全部满足
    for (let n = 25n; n <= 40n; n++) if (!ok4(n)) throw new Error('p4：n ≥ 25 应全部满足');
    const N4 = Number(lastFail);
    if (N4 < 1) throw new Error('p4：N 应是正整数');
    if (ok4(BigInt(N4))) throw new Error('p4：N 本身应不满足，否则 N − 1 也行');

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'set', value: p3 },
      p4: { type: 'number', value: N4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
