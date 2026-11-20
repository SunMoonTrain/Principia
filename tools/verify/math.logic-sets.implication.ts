// 独立验算 math.logic-sets.implication 的 p1–p4（简单题、中等题）。
// 只按题意逐条列真值表、在整数和实数的检验集上找反例，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.implication.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

const BOOLS = [true, false] as const;

/** 蕴含的真值：只有前件真、后件假时为假。 */
const imp = (p: boolean, q: boolean): boolean => !p || q;

/** 两个由 P、Q 组成的复合命题在 4 种真值组合下是否处处同真同假。 */
function equivalent2(f: (p: boolean, q: boolean) => boolean, g: (p: boolean, q: boolean) => boolean): boolean {
  return BOOLS.every((p) => BOOLS.every((q) => f(p, q) === g(p, q)));
}

/** 整数检验集：-1000 到 1000，覆盖负数、0、1、2 和各种倍数。 */
const INTS: number[] = Array.from({ length: 2001 }, (_, i) => i - 1000);

/** 素数按中学的定义：大于 1、除了 1 和它本身没有别的正因数的正整数；负数、0、1 都不是素数。 */
function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

const isOdd = (n: number): boolean => Math.abs(n % 2) === 1;
const divides = (d: number, n: number): boolean => n % d === 0;

/** 「对每个整数 n，cond(n) ⇒ concl(n)」在检验集上是否成立；不成立时返回第一个反例。 */
function forAllInts(cond: (n: number) => boolean, concl: (n: number) => boolean): { holds: boolean; counterexample?: number } {
  for (const n of INTS) if (cond(n) && !concl(n)) return { holds: false, counterexample: n };
  return { holds: true };
}

/** 实数检验集：±2、0、±1、±3、±0.5、±√2、±4、2 附近的 1.999 和 2.001，再加 -10 到 10 步长 0.1 的点。 */
const REALS: number[] = [2, -2, 0, 1, -1, 3, -3, 0.5, -0.5, Math.SQRT2, -Math.SQRT2, 4, -4, 1.999, 2.001, ...Array.from({ length: 200 }, (_, i) => -10 + 0.1 * i)];

export const verification: Verification = {
  lesson: 'math.logic-sets.implication',
  notes: {
    p1: '把 A–E 都看成 P、Q 的复合命题（A：¬Q⇒¬P，B：Q⇒P，C：¬P∨Q，D：¬P⇒¬Q，E：P∧¬Q），在 P、Q 的 4 种真值组合下逐一和 P⇒Q 比真值，处处相同的就逻辑等价。另在整数 -1000..1000 上按 P「6∣n」、Q「3∣n」的实际意思核对：处处为真的恰好也是 A、C（B、D 的反例 n=3，E 处处为假）。',
    p2: '在实数检验集（含 ±2、0、±1、±√2 和 -10 到 10 步长 0.1 的点）上查：x=2 ⇒ x²=4 处处成立（必要）；x²=4 ⇒ x=2 有反例 x=-2（不充分），所以选「必要不充分」。',
    p3: '（第 1 轮修订换了 B、E，复核时重写）「X 是 Y 的充分条件」写成 X⇒Y，「X 是 Y 的必要条件」写成 Y⇒X，「只要 X 就 Y」写成 X⇒Y，「只有 X 才 Y」写成 Y⇒X；在整数 -1000..1000 上逐条找反例。A：n²>0⇒n>0，反例 n=-1；B：4∣n²⇒4∣n，反例 n=2；C：12∣n⇒4∣n 无反例；D：n 奇⇒n² 奇 无反例；E：n 素数⇒n>1 无反例（素数按中学定义，只算大于 1 的正整数）。另把「只要」「只有」读反（B 读成 4∣n⇒4∣n²，E 读成 n>1⇒n 素数）再判一遍，B、E 的真假都和照本节读法相反（E 的反例 n=4），确认这两项真正考方向。',
    p4: '枚举 P、Q、R 的 8 种真值组合，按「前件真、后件假才假」算两个式子的真值，分别数为真的组合数。',
  },
  compute() {
    // p1：哪些和 P⇒Q 逻辑等价（按复合命题的真值表）
    const forms: ((p: boolean, q: boolean) => boolean)[] = [
      (p, q) => imp(!q, !p), // A 若非 Q 则非 P
      (p, q) => imp(q, p), // B 若 Q 则 P
      (p, q) => !p || q, // C 非 P 或 Q
      (p, q) => imp(!p, !q), // D 若非 P 则非 Q
      (p, q) => p && !q, // E P 且非 Q
    ];
    const p1 = forms.flatMap((f, i) => (equivalent2(f, imp) ? [i + 1] : []));
    // 旁证：按 6∣n、3∣n 的实际意思，在整数上处处为真的也应是同一组
    const P = (n: number): boolean => divides(6, n);
    const Q = (n: number): boolean => divides(3, n);
    const p1Actual = forms.flatMap((f, i) => (INTS.every((n) => f(P(n), Q(n))) ? [i + 1] : []));
    if (p1Actual.join(',') !== p1.join(',')) throw new Error(`p1 两种读法不一致：真值表 ${p1}，整数上 ${p1Actual}`);

    // p2：「x²=4」是「x=2」的什么条件
    const xIs2 = (x: number): boolean => x === 2;
    const sq4 = (x: number): boolean => x * x === 4;
    const sufficient = REALS.every((x) => imp(sq4(x), xIs2(x))); // x²=4 ⇒ x=2 ?
    const necessary = REALS.every((x) => imp(xIs2(x), sq4(x))); // x=2 ⇒ x²=4 ?
    const p2 = sufficient && necessary ? 3 : sufficient ? 1 : necessary ? 2 : 4;

    // p3：逐条在整数上找反例
    const claims = [
      forAllInts((n) => n * n > 0, (n) => n > 0), // A：「n>0」是「n²>0」的必要条件：n²>0 ⇒ n>0
      forAllInts((n) => divides(4, n * n), (n) => divides(4, n)), // B：只要 n² 是 4 的倍数，n 就是 4 的倍数
      forAllInts((n) => divides(12, n), (n) => divides(4, n)), // C：12∣n 是 4∣n 的充分条件
      forAllInts(isOdd, (n) => isOdd(n * n)), // D：「n² 奇」是「n 奇」的必要条件：n 奇 ⇒ n² 奇
      forAllInts(isPrime, (n) => n > 1), // E：只有 n>1，n 才是素数：n 素数 ⇒ n>1
    ];
    const p3 = claims.flatMap((c, i) => (c.holds ? [i + 1] : []));
    // 旁证：把 B、E 的「只要」「只有」读反，真假应当正好相反，这两项才真正考方向
    const bReversed = forAllInts((n) => divides(4, n), (n) => divides(4, n * n)).holds;
    const eReversed = forAllInts((n) => n > 1, isPrime).holds;
    if (bReversed === claims[1].holds || eReversed === claims[4].holds) throw new Error('p3 的 B、E 读反方向后真假没有变，考不出方向');

    // p4：8 种组合里分别有几种使两式为真
    let first = 0;
    let second = 0;
    for (const p of BOOLS)
      for (const q of BOOLS)
        for (const r of BOOLS) {
          if (imp(imp(p, q), r)) first++;
          if (imp(p, imp(q, r))) second++;
        }

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'choice', value: [p2] },
      p3: { type: 'choice', value: p3 },
      p4: { type: 'tuple', value: [first, second] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
