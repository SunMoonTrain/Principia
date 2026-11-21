// 独立验算 physics.quantum-mechanics.hydrogen-spectrum 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（里德伯公式 1/λ = R_H(1/n₁² − 1/n₂²)，线系限 n₁²/R_H，光子能量 hc/λ）；
// 二是不用这些式子的写法：p1 让 n₂ 取 10³、10⁶、10⁹ 直接代进里德伯公式，看波长单调变短、逼近同一个数；
// p3 在 n₁ ≤ 30、n₂ ≤ 400 的全部整数对里找波长最接近 2166.1 nm 的一对，并核对次接近的差得远；
// p4 用「每条谱线的 1/λ 是两项之差」（组合原则）把两条谱线的 1/λ 相加，再和分别由两条谱线反推的 R_H 代回里德伯公式核对；
// 光子能量用 CODATA 的 h、c、e（都是定义值）算 hc/λ，再和 E(1→2) + E(2→4) 核对。
// 选择题用具体的谱线逐条核对。
// 单独运行：npx tsx tools/verify/physics.quantum-mechanics.hydrogen-spectrum.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen } from './physics.electromagnetism._es.ts';

/** 题面给的氢的里德伯常量（m⁻¹）。 */
const RH = 1.09678e7;
/** CODATA：h、c、e 都是定义值；hc/e 以 eV·nm 为单位。 */
const H = 6.62607015e-34;
const C = 299792458;
const QE = 1.602176634e-19;
const HC_EV_NM = ((H * C) / QE) * 1e9;

/** 里德伯公式给出的真空波长（nm）。 */
const lambdaNm = (n1: number, n2: number, R = RH) => 1e9 / (R * (1 / (n1 * n1) - 1 / (n2 * n2)));

export const verification: Verification = {
  lesson: 'physics.quantum-mechanics.hydrogen-spectrum',
  notes: {
    p1: '帕邢系 n₁ = 3，线系限 9/R_H = 820.58 nm；和直接代入核对：n₂ = 10³、10⁶、10⁹ 时波长 820.59、820.5838…、820.5838… nm，单调变短，逼近同一个数。',
    p2: '逐条用具体谱线（R_H = 1.096 78 × 10⁷ m⁻¹）：A 里德伯公式里只有 R_H 和两个整数，没有温度，加热前后算出的 n₂ = 3…10 各条波长逐条相同（错）；B 巴耳末系 n₂ = 7 的谱线 397.1 nm、线系限 364.7 nm，都短于 400 nm（错）；C λ(2,4)/λ(2,3) = (16/3)/(36/5) = 20/27，逐位核对（对）；D 巴耳末系 n₂ = 7、8 两条 397.1、389.0 nm 只差 8.1 nm，n₂ = 20、21 只差 0.35 nm（错）；E n₁ = 4 的谱线在 16/R_H = 1458.8 nm 到 400/(9R_H) = 4052.3 nm 之间，n₂ = 5…10⁴ 逐条都长于 700 nm（对）。',
    p3: '在 n₁ ≤ 30、n₂ ≤ 400 的全部整数对里找波长最接近 2166.1 nm 的：(4, 7) 算得 2166.12 nm，相对差 9 × 10⁻⁶；次接近的（n₁ = 5、n₂ 很大，2279.8 nm）相对差 5 × 10⁻²，所以 n₁ = 4、n₂ = 7。',
    p4: '组合原则：1/λ(1→4) = 1/λ(1→2) + 1/λ(2→4)，λ = 1/(1/121.57 + 1/486.27) = 97.2556 nm；和分别由两条谱线反推 R_H（1.096 76 × 10⁷、1.096 78 × 10⁷ m⁻¹）再代回里德伯公式核对（相对差 < 3 × 10⁻⁵）。光子能量 hc/λ，hc 用 CODATA 定义值 1239.842 eV·nm，得 12.7483 eV；和 E(1→2) + E(2→4) 核对。用 1240 eV·nm 得 12.7499 eV，四位有效数字同为 12.75。',
  },
  compute() {
    // p1：帕邢系的线系限
    const limit = 9 / RH * 1e9;
    const approach = [1e3, 1e6, 1e9].map((n2) => lambdaNm(3, n2));
    check(approach[0] > approach[1] && approach[1] >= approach[2], 'p1：n₂ 越大波长越短');
    const p1 = agree(approach[2], limit, 'p1 帕邢系线系限', 1e-12);
    check(Math.abs(limit - 820.5838) < 1e-3, 'p1：820.58 nm');

    // p2
    // A：公式里没有温度：同一组 (n₁, n₂) 在「加热前后」算出的波长逐条相同
    const before = [3, 4, 5, 6, 7, 8, 9, 10].map((n2) => lambdaNm(2, n2));
    const after = [3, 4, 5, 6, 7, 8, 9, 10].map((n2) => lambdaNm(2, n2));
    const optA = after.every((l, i) => l < before[i]);
    // B：巴耳末系 n₂ = 3…10⁴ 有没有落到 400–700 nm 之外的
    const balmer = Array.from({ length: 10000 - 2 }, (_, i) => lambdaNm(2, i + 3));
    const outside = balmer.findIndex((l) => l < 400 || l > 700);
    check(outside === 4 && Math.abs(balmer[4] - 397.1) < 0.05, 'B：n₂ = 7 是 397.1 nm');
    check(Math.abs(4 / RH * 1e9 - 364.7) < 0.1, 'B：线系限 364.7 nm');
    const optB = outside < 0;
    // C：Hβ / Hα
    const ratio = lambdaNm(2, 4) / lambdaNm(2, 3);
    const optC = Math.abs(ratio - 20 / 27) < 1e-12;
    // D：相邻两条的波长差
    const diffs = balmer.slice(1).map((l, i) => balmer[i] - l);
    check(Math.abs(diffs[4] - 8.1) < 0.05, 'D：n₂ = 7、8 差 8.1 nm');
    check(Math.abs(diffs[17] - 0.35) < 0.005, 'D：n₂ = 20、21 差 0.35 nm');
    const optD = diffs.every((d) => d > 10);
    // E：n₁ = 4 的那一组
    const brackett = Array.from({ length: 10000 - 4 }, (_, i) => lambdaNm(4, i + 5));
    check(Math.abs(brackett[0] - 4052.3) < 0.1 && Math.abs(16 / RH * 1e9 - 1458.8) < 0.1, 'E：1458.8 到 4052.3 nm');
    const optE = brackett.every((l) => l > 700) && 16 / RH * 1e9 > 700;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3：在整数对里搜索
    const target = 2166.1;
    const cands: { n1: number; n2: number; rel: number }[] = [];
    for (let n1 = 1; n1 <= 30; n1++) {
      for (let n2 = n1 + 1; n2 <= 400; n2++) cands.push({ n1, n2, rel: Math.abs(lambdaNm(n1, n2) - target) / target });
    }
    cands.sort((a, b) => a.rel - b.rel);
    check(cands[0].rel < 1e-4, 'p3：最接近的一对相对差小于 10⁻⁴');
    check(cands[1].rel > 100 * cands[0].rel && cands[1].rel > 1e-3, 'p3：次接近的差得远');
    const p3 = [cands[0].n1, cands[0].n2];

    // p4：组合原则
    const la = 121.57;
    const lb = 486.27;
    const lam = 1 / (1 / la + 1 / lb);
    const Ra = 1e9 / (la * (1 - 1 / 4));
    const Rb = 1e9 / (lb * (1 / 4 - 1 / 16));
    agree(lambdaNm(1, 4, Ra), lam, 'p4 用莱曼 α 反推的 R_H 代回', 3e-5);
    agree(lambdaNm(1, 4, Rb), lam, 'p4 用 Hβ 反推的 R_H 代回', 3e-5);
    const E = HC_EV_NM / lam;
    agree(HC_EV_NM / la + HC_EV_NM / lb, E, 'p4 光子能量 E(1→2) + E(2→4)', 1e-12);
    check(Math.abs(1240 / lam - 12.7499) < 1e-4, 'p4：用 1240 eV·nm 得 12.7499');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'tuple', value: [lam, E] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
