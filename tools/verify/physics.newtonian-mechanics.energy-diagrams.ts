// 独立验算 physics.newtonian-mechanics.energy-diagrams 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的做法（U′ = 0 求平衡位置、U″ 的正负判稳定性、动能 = E − U）；二是不用这些式子：
// 力取势能的数值导数的负值，把运动方程交给四阶龙格-库塔法积分——p3 从转折点积到原点读速率，
// p4 给稳定平衡处的质点不同的初动能，二分出「跑走」和「折回来」的分界，再各取分界两侧的一个初动能核对。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.energy-diagrams.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, bisect, check, chosen, deriv, linear, rk4Until } from './physics.newtonian-mechanics._nm.ts';

/** 势能 U 里的质点（质量 m）从 x0 以速度 v0 出发：积到 x < −5（跑走）或速度第一次反向（折回来），返回是否跑走。 */
function escapes(U: (x: number) => number, m: number, x0: number, v0: number): boolean {
  const acc = (_t: number, x: number) => -deriv(U, x, 1e-6) / m;
  const e = rk4Until(linear(acc), [x0, v0], 0, 1e-3, 1e7, (_t, s) => (s[0] < -5 ? 1 : s[1] > 0 ? 1 : -1));
  return e.y[0] < -5;
}

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.energy-diagrams',
  notes: {
    p1: 'U′ = 6x − 12 = 0，x = 2；和数值核对：U 在 [−10, 10] 上的最小值点（黄金分割）。',
    p2: '逐条用例子：A U = x² 在 x = 1、3 处斜率 2、6，力 −2、−6 N（对）；B U = x²、E = 4 J 时 x = 0、1、1.5 处动能 4、3、1.75 J，最低处最快（对）；C U = x³ − 3x 的平衡位置 ±1 和 E 无关（错）；D U = x⁴，从 x = 0.1 静止放开，积分出它在 ±0.1 之间来回、不跑开，是稳定平衡（错）；E U 和 U + 5 的数值导数相同（对）。',
    p3: 'E = U(1) = 3 J，原点处 v = √(2E/m)；和积分核对：从转折点 x = 1 静止出发，力 −U′(x)，积到 x = 0。',
    p4: '稳定平衡 x = 3（U″ = 6 > 0），越过 x = 1 处的峰 U(1) = 4 J，至少要 U(1) − U(3) = 4 J；和模拟核对：从 x = 3 以向左的初速出发，二分出跑走和折回来的分界动能，再核对 3.98 J 折回来、4.02 J 跑走。',
  },
  compute() {
    // p1（m）
    const U1 = (x: number) => 3 * x * x - 12 * x + 5;
    const p1 = agree(argmax((x) => -U1(x), -10, 10), 12 / 6, 'p1 平衡位置', 1e-6);

    // p2
    const optA = Math.abs(-deriv((x) => x * x, 3)) > Math.abs(-deriv((x) => x * x, 1));
    const Kat = (x: number) => 4 - x * x;
    const optB = Kat(0) > Kat(1) && Kat(1) > Kat(1.5);
    const eq = (x: number) => 3 * x * x - 3;
    const optC = !(eq(1) === 0 && eq(-1) === 0); // 平衡位置只由 U′ = 0 定，和 E 无关
    let xmax = 0;
    rk4Until(linear((_t, x) => -4 * x ** 3), [0.1, 0], 0, 1e-3, 1e7, (t, s) => {
      xmax = Math.max(xmax, Math.abs(s[0]));
      return t > 200 ? 1 : -1;
    });
    const optD = xmax > 0.1 + 1e-6; // 跑开才算「不是稳定平衡」
    const optE = Math.abs(deriv((x) => x ** 3, 0.7) - deriv((x) => x ** 3 + 5, 0.7)) < 1e-9;
    check(!optC && !optD, 'C、D 的反例成立');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m/s）
    const U3 = (x: number) => 2 * x * x + x ** 4;
    const m3 = 0.5;
    const e3 = rk4Until(linear((_t, x) => -deriv(U3, x, 1e-6) / m3), [1, 0], 0, 1e-5, 1e8, (_t, s) => -s[0]);
    const p3 = agree(Math.abs(e3.y[1]), Math.sqrt((2 * U3(1)) / m3), 'p3 原点处的速率', 1e-7);

    // p4（J）
    const U4 = (x: number) => x ** 3 - 6 * x * x + 9 * x;
    check(deriv((x) => deriv(U4, x), 3) > 0 && deriv((x) => deriv(U4, x), 1) < 0, 'p4 x = 3 稳定、x = 1 不稳定');
    const go = (K: number) => (escapes(U4, 1, 3, -Math.sqrt(2 * K)) ? 1 : -1);
    const Kc = bisect((K) => go(K), 3.5, 4.5);
    check(go(3.98) < 0 && go(4.02) > 0, 'p4 分界两侧');
    const p4 = agree(Kc, U4(1) - U4(3), 'p4 至少要给的动能', 1e-4);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
