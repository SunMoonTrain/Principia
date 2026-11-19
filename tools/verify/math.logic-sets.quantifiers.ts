// 独立验算 math.logic-sets.quantifiers 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.logic-sets.quantifiers.ts
//
// 做法：全称命题在一组检验点上找反例，存在命题在同一组点上找例子；检验点之外的情形另用一句代数理由补上
// （写在 notes 里），能化成有限情形的（整数方程的根、整数 k 的范围）就逐个查完。
// 实数一律取有理数 j/Q（Q = 1000），比较时两边乘 Q²，全程用整数比较，不受浮点舍入影响。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

const Q = 1000;
/** 检验用的实数：[−10, 10] 上间隔 1/Q 的有理数，记成分子 j（x = j/Q）。 */
const GRID: number[] = [];
for (let j = -10 * Q; j <= 10 * Q; j++) GRID.push(j);

/** 选择题：返回为真的选项序号。 */
const truthful = (truths: boolean[]): number[] => truths.flatMap((t, i) => (t ? [i + 1] : []));

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

export const verification: Verification = {
  lesson: 'math.logic-sets.quantifiers',
  notes: {
    p1:
      '五个命题在 [−10, 10] 上间隔 1/1000 的有理数（整数取 0 到 10⁶）上逐条找反例或例子，全用整数比较。' +
      'A 无反例（|x| = max(x, −x) ≥ x）；B 有例子 x = 1/2；C 有反例 x = 1/2；D 无反例（n = 0 时 0 ≥ 0，n ≥ 1 时 n − 1 ≥ 0），注意本站 ℕ 含 0；' +
      'E：x² = 2x + 1 即 (x − 1)² = 2，|x − 1| ≥ 2 时左边 ≥ 4，只剩 x ∈ {0, 1, 2} 要查，都不满足，没有整数解。',
    p2:
      '原命题「∀n ∈ ℕ⁺, n² ≥ an」对 a ∈ {−3, 0, 1/2, 1, 3/2, 2, 3, 10} 逐个判真假（n 查到 1000，n > a 以后不等式不再变），' +
      '四个选项也在同样的 a 上判，和原命题真假处处相反的才是否定。C 在 a = 1 时和原命题同真（n = 1 取等号），只有 D 处处相反。',
    p3:
      '对整数 k ∈ [−50, 50]，在 [k, k + 1] 上取间隔 1/1000 的点（含两端）找 x² − 5x + 4 < 0 的点，整数比较。' +
      '代数核对：x² − 5x + 4 = (x − 1)(x − 4) < 0 ⇔ 1 < x < 4，开区间 (1, 4) 和 [k, k + 1] 相交 ⇔ k + 1 > 1 且 k < 4；k = 0、4 时只碰到端点 1、4，值为 0 不算。',
    p4:
      'A：100 万以内的素数没有 4 的倍数（4 | p 则 2 | p 且 p ≥ 4，不是素数）；' +
      'B：x² + 1 = 0 的判别式 −4 < 0，网格上 x² + 1 ≥ 1，实数解的集合是空集，全称命题空真；' +
      'C：x² = x 的实数解由求根公式得 0、1，都非负；D：3 是 3 的倍数、不是 6 的倍数，是反例；E：x = −1 时 |x| = 1 = −x。',
  },
  compute() {
    // ---------- p1 ----------
    // A：∀x∈ℝ, |x| ≥ x   （x = j/Q，比较 |j| ≥ j）
    const p1A = GRID.every((j) => Math.abs(j) >= j);
    // B：∃x∈ℝ, x² < x   （j²/Q² < j/Q ⇔ j² < jQ）
    const p1B = GRID.some((j) => j * j < j * Q);
    // C：∀x∈ℝ, x² ≥ x
    const p1C = GRID.every((j) => j * j >= j * Q);
    // D：∀n∈ℕ, n² ≥ n（ℕ 含 0）
    let p1D = true;
    for (let n = 0; n <= 1_000_000; n++) if (!(n * n >= n)) p1D = false;
    // E：∃x∈ℤ, x² = 2x + 1：先在 |x| ≤ 10⁶ 上查，再按 (x − 1)² = 2 只剩 x ∈ {0, 1, 2} 的理由复核
    let p1E = false;
    for (let x = -1_000_000; x <= 1_000_000; x++) if (x * x === 2 * x + 1) p1E = true;
    const p1Efinite = [0, 1, 2].some((x) => x * x === 2 * x + 1);
    if (p1E !== p1Efinite) throw new Error('p1 E：两种查法不一致');
    const p1 = truthful([p1A, p1B, p1C, p1D, p1E]);

    // ---------- p2 ----------
    // a 取有理数 aNum/aDen；n² ≥ an ⇔ n²·aDen ≥ aNum·n
    const aValues: [number, number][] = [
      [-3, 1],
      [0, 1],
      [1, 2],
      [1, 1],
      [3, 2],
      [2, 1],
      [3, 1],
      [10, 1],
    ];
    const N2 = 1000;
    const ns = Array.from({ length: N2 }, (_, i) => i + 1);
    const original = ([p, q]: [number, number]) => ns.every((n) => n * n * q >= p * n);
    const options: (([p, q]: [number, number]) => boolean)[] = [
      // A：每个正整数 n 都满足 n² < an
      ([p, q]) => ns.every((n) => n * n * q < p * n),
      // B：存在正整数 n，满足 n² ≥ an
      ([p, q]) => ns.some((n) => n * n * q >= p * n),
      // C：存在正整数 n，满足 n² ≤ an
      ([p, q]) => ns.some((n) => n * n * q <= p * n),
      // D：存在正整数 n，满足 n² < an
      ([p, q]) => ns.some((n) => n * n * q < p * n),
    ];
    const p2 = options.flatMap((opt, i) => (aValues.every((a) => opt(a) === !original(a)) ? [i + 1] : []));

    // ---------- p3 ----------
    // x = k + j/Q（j = 0..Q）；x² − 5x + 4 < 0 两边乘 Q²：X² − 5QX + 4Q² < 0，X = kQ + j
    const p3: number[] = [];
    for (let k = -50; k <= 50; k++) {
      let found = false;
      for (let j = 0; j <= Q && !found; j++) {
        const X = k * Q + j;
        if (X * X - 5 * Q * X + 4 * Q * Q < 0) found = true;
      }
      if (found) p3.push(k);
    }
    // 代数核对：(1, 4) ∩ [k, k + 1] ≠ ∅ ⇔ k + 1 > 1 且 k < 4
    const p3Algebra: number[] = [];
    for (let k = -50; k <= 50; k++) if (k + 1 > 1 && k < 4) p3Algebra.push(k);
    if (p3.join() !== p3Algebra.join()) throw new Error('p3：网格和代数结果不一致');

    // ---------- p4 ----------
    // A：有些素数是 4 的倍数
    let p4A = false;
    for (let p = 2; p <= 1_000_000; p++) if (p % 4 === 0 && isPrime(p)) p4A = true;
    // B：x² + 1 = 0 的每个实数解都大于 100。解集：判别式 b² − 4ac；网格上也查一遍 x² + 1 = 0 无解
    const disc = 0 * 0 - 4 * 1 * 1;
    const realSolutionsB: number[] = disc < 0 ? [] : [(-0 + Math.sqrt(disc)) / 2, (-0 - Math.sqrt(disc)) / 2];
    if (GRID.some((j) => j * j + Q * Q === 0)) throw new Error('p4 B：网格上竟有解');
    const p4B = realSolutionsB.every((x) => x > 100);
    // C：平方等于自身的实数都是非负数。x² − x = 0：判别式 1，根 (1 ± 1)/2
    const discC = 1 - 4 * 1 * 0;
    const rootsC = [(1 + Math.sqrt(discC)) / 2, (1 - Math.sqrt(discC)) / 2];
    const gridRootsC = GRID.filter((j) => j * j === j * Q).map((j) => j / Q);
    if (gridRootsC.sort().join() !== [...rootsC].sort().join()) throw new Error('p4 C：网格上的解和求根公式不一致');
    const p4C = rootsC.every((x) => x >= 0);
    // D：3 的倍数都是 6 的倍数（在 −10⁴..10⁴ 的 3 的倍数里找反例）
    let p4D = true;
    for (let m = -10_000; m <= 10_000; m++) if (m % 3 === 0 && m % 6 !== 0) p4D = false;
    // E：存在实数 x，|x| = −x（网格上找例子；x ≤ 0 的点都满足）
    const p4E = GRID.some((j) => Math.abs(j) === -j);
    const p4 = truthful([p4A, p4B, p4C, p4D, p4E]);

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'set', value: p3 },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
