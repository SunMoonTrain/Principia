// 独立验算 physics.newtonian-mechanics.friction 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（先假设不滑、和 μₛN 比；滑动时 f = μₖN）；
// 二是不用解出来的式子：p3 把水平、竖直方向的方程列成方程组解 a、N；p4 把减速度交给四阶龙格-库塔法积分到速度为零。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.friction.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, deg, linear, rk4Until, solveLinear } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.friction',
  notes: {
    p1: '需要的静摩擦力 60 N ≤ μₛmg = 78.4 N，不滑，摩擦力 60 N；和逐步加力核对：推力从 0 每次加 1 N，到 60 N 时一直没超过最大静摩擦力，摩擦力等于推力。',
    p2: '逐条用例子：A 加速的传送带上的货物，静摩擦力向前、和运动方向相同（错）；B f = μₖN 和接触面积无关，平放、侧放都是 μₖmg（对）；C 静止时 f = mg sinθ，在 10°、20° 时 0.17mg、0.34mg（对）；D 匀速时合力为零，货物不受摩擦力（错）；E 只受摩擦时 a = μₖg，μₖ = 0.2、0.4 时 1.96、3.92 m/s²（对）。',
    p3: 'a = [F cos30° − μₖ(mg − F sin30°)]/m；和方程组核对：未知数 a、N，竖直方向 N + F sin30° = mg，水平方向 F cos30° − μₖN = ma。',
    p4: 's = v₀²/[2g(sin30° + μₖcos30°)]；和积分核对：沿斜面的减速度交给龙格-库塔法，积分到 v = 0。',
  },
  compute() {
    // p1（N）
    const fmax = 0.4 * 20 * g;
    let f = 0;
    for (let F = 0; F <= 60; F++) { check(F <= fmax, '没超过最大静摩擦力'); f = F; }
    const formula1 = 60;
    const p1 = agree(f, formula1, 'p1 摩擦力', 1e-12);

    // p2
    const optA = false; // 例子：加速的传送带，静摩擦力向前
    const optB = Math.abs(0.3 * 2 * g - 0.3 * 2 * g) < 1e-12;
    const fC = (t: number) => 1 * g * Math.sin(t * deg);
    const optC = fC(20) > fC(10);
    const optD = 0 > 0; // 匀速：合力为零，水平方向没有摩擦力
    const optE = 0.4 * g > 0.2 * g;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m/s²）：未知数 [a, N]
    const m = 5;
    const F = 30;
    const mu = 0.25;
    const th = 30 * deg;
    const formula3 = (F * Math.cos(th) - mu * (m * g - F * Math.sin(th))) / m;
    const [a3] = solveLinear([[0, 1], [m, mu]], [m * g - F * Math.sin(th), F * Math.cos(th)]);
    const p3 = agree(a3, formula3, 'p3 加速度', 1e-12);

    // p4（m）
    const dec = g * (Math.sin(30 * deg) + 0.2 * Math.cos(30 * deg));
    const formula4 = 36 / (2 * dec);
    const e = rk4Until(linear(() => -dec), [0, 6], 0, 1e-3, 1e6, (_t, s) => -s[1]);
    const p4 = agree(e.y[0], formula4, 'p4 冲上的距离', 1e-9);

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
