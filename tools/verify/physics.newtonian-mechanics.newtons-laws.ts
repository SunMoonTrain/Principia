// 独立验算 physics.newtonian-mechanics.newtons-laws 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（a = F/m、质量之比是加速度之比的反比、两次求原函数）；
// 二是不用这些式子：把力交给四阶龙格-库塔法积分运动，从位移反推加速度，或者在「掉头」（速度变号）处二分。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.newtons-laws.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, linear, planar, rk4, rk4Until } from './physics.newtonian-mechanics._nm.ts';

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.newtons-laws',
  notes: {
    p1: '|F|/m = 5/1.5；和积分核对：从静止积分 2 s，加速度 = 2|Δr|/t²。',
    p2: '逐条用例子（积分）：A 惯性系里静止的质点，在加速度 (1, 0) 的参考系里 x′ = −t²/2，不是匀速（错）；B 竖直上抛到最高点 v = 0 时合力仍是 mg（错）；C 同样 6 N 作用在 2 kg、3 kg 上，加速度 3、2 m/s²（对）；D 第三定律，两个力相加为零（错）；E 匀速圆周运动积分得加速度 ω²r ≠ 0，合力不为零（对）。',
    p3: 'm_B = m_A·a_A/a_B，m_C = m_B·a_B′/a_C；和动量核对：同一根弹簧推开时两边 m·a 相等，按 A–B、B–C 两对各列一次方程解出 m_B、m_C。',
    p4: 'v = 2 − 1.2t² 为零时 x = 2t − 0.4t³；和积分核对：a = F/m 积分到 v 变号。',
  },
  compute() {
    // p1
    const formula1 = Math.hypot(3, 4) / 1.5;
    const s1 = rk4(planar(() => [3 / 1.5, 4 / 1.5]), [0, 0, 0, 0], 0, 2, 200);
    const p1 = agree((2 * Math.hypot(s1[0], s1[1])) / 4, formula1, 'p1 加速度', 1e-12);

    // p2
    const xPrime = (t: number) => 0 - 0.5 * 1 * t * t;
    const optA = Math.abs(xPrime(2) - 2 * xPrime(1)) < 1e-12; // 匀速才满足 x′(2) = 2x′(1)
    const top = rk4Until(linear(() => -9.8), [0, 10], 0, 1e-3, 1e6, (_t, s) => -s[1]);
    const optB = Math.abs(1 * -9.8) < 1e-12 && Math.abs(top.y[1]) < 1e-9;
    const optC = 6 / 3 < 6 / 2;
    const fAB = 5;
    const fBA = -5;
    const optD = Math.abs(fAB) > Math.abs(fBA);
    const circ = (t: number) => [2 * Math.cos(3 * t), 2 * Math.sin(3 * t)];
    const h = 1e-4;
    const accE = [(circ(0.4 + h)[0] - 2 * circ(0.4)[0] + circ(0.4 - h)[0]) / (h * h), (circ(0.4 + h)[1] - 2 * circ(0.4)[1] + circ(0.4 - h)[1]) / (h * h)];
    const optE = Math.hypot(accE[0], accE[1]) > 1;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（kg）
    const mA = 0.5;
    const formula3 = ((mA * 1.8) / 0.6) * (1.2 / 0.8);
    // 弹簧推开两车：两车受的力等大反向，m_A a_A = m_B a_B，m_B a_B′ = m_C a_C
    const mB = (mA * 1.8) / 0.6;
    const mC = (mB * 1.2) / 0.8;
    const p3 = agree(mC, formula3, 'p3 C 的质量', 1e-12);

    // p4（m）
    const t4 = Math.sqrt(2 / 1.2);
    const formula4 = 2 * t4 - 0.4 * t4 ** 3;
    const turn = rk4Until(linear((t) => (-1.2 * t) / 0.5), [0, 2], 0, 1e-3, 1e6, (_t, s) => -s[1]);
    const p4 = agree(turn.y[0], formula4, 'p4 掉头时离原点的距离', 1e-9);

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
