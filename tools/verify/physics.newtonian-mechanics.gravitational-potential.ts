// 独立验算 physics.newtonian-mechanics.gravitational-potential 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（U = −GMm/r、v₂ = √(2GM/R)、机械能守恒）；二是不用这些式子：
// 逃逸速度由数值积分引力从 r 到很远处（r·e⁴⁰）做的功得到，½v² 等于它（换元 s = r eᵘ，高斯-勒让德）；
// 竖直发射按 r″ = −GM/r² 积分到速度变号，二分出能到达指定高度的发射速率；圆轨道的速率由轨道积分二分出来
// （_nm.ts 的 circularSpeed）。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.gravitational-potential.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisectN, chosen, circularSpeed, integrate, linear, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const G = 6.67e-11;

/** 每单位质量：引力从 r 移到 r·e⁴⁰ 时克服的功，即 ∫ GM/s² ds，换元 s = r eᵘ。 */
const workToInfinity = (GM: number, r: number) => integrate((u) => (GM / (r * Math.exp(u)) ** 2) * r * Math.exp(u), 0, 40, 64, 16);
/** 逃逸速率：½v² 等于上面的功。 */
const escapeSpeed = (GM: number, r: number) => Math.sqrt(2 * workToInfinity(GM, r));
/** 竖直向上发射，积分到速度变成零，返回最高处到地心的距离。 */
const rMax = (GM: number, R: number, v0: number) => rk4Until(linear((_t, r) => -GM / (r * r)), [R, v0], 0, 0.05, 1e8, (_t, y) => -y[1]).y[0];

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.gravitational-potential',
  notes: {
    p1: 'v₂ = √(2GM/R)；和数值积分核对：引力从月面移到 R·e⁴⁰ 做的功（每千克），½v² 等于它。',
    p2: '逐条用例子（地球取 g = 9.8、R = 6.37×10⁶ m）：A 数值积分算逃逸速率，半径减半后是原来的 √2 倍，不是 2 倍（错）；B 数值积分的势能（−功），距离加倍后比值 0.5（对）；C 数值积分的是每千克的功，m = 1、1000 kg 算出的逃逸速率相同（对）；D 以 10 km/s 竖直发射，积分到速度变号，在约 5.0R 处掉头（对）；E 势能在 2R 处比在 R 处大，靠近地球时势能减小（错）。',
    p3: '½v² = gR²(1/R − 1/(R + h))；和积分核对：二分出竖直发射后最高处正好离地面 1000 km 的发射速率。',
    p4: 'Δv = (√2 − 1)√(gR²/r)，r = R + 400 km；和数值核对：圆轨道的速率由轨道积分二分出来，逃逸速率由数值积分的功算出。',
  },
  compute() {
    // p1（km/s）
    const GM1 = G * 7.35e22;
    const R1 = 1.74e6;
    const p1 = agree(escapeSpeed(GM1, R1) / 1000, Math.sqrt((2 * GM1) / R1) / 1000, 'p1 月球的逃逸速度', 1e-9);

    // p2
    const g = 9.8;
    const R = 6.37e6;
    const GM = g * R * R;
    const optA = Math.abs(escapeSpeed(GM, R / 2) / escapeSpeed(GM, R) - 2) < 1e-6;
    const U = (r: number) => -workToInfinity(GM, r);
    const optB = Math.abs(U(2 * R) / U(R) - 0.5) < 1e-9;
    const perKg = (m: number) => Math.sqrt((2 * integrate((u) => ((GM * m) / (R * Math.exp(u)) ** 2) * R * Math.exp(u), 0, 40, 64, 16)) / m);
    const optC = Math.abs(perKg(1000) - perKg(1)) < 1e-9 * perKg(1);
    const turn = rMax(GM, R, 10e3);
    const optD = Number.isFinite(turn) && turn < 6 * R;
    const optE = U(R) > U(2 * R);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（km/s）
    const h3 = 1.0e6;
    const v3 = bisectN((v) => rMax(GM, R, v) - (R + h3), 3000, 6000, 50);
    const p3 = agree(v3 / 1000, Math.sqrt(2 * GM * (1 / R - 1 / (R + h3))) / 1000, 'p3 发射速率', 1e-8);

    // p4（km/s）
    const r4 = R + 4.0e5;
    const dv = escapeSpeed(GM, r4) - circularSpeed(GM, r4);
    const p4 = agree(dv / 1000, ((Math.SQRT2 - 1) * Math.sqrt(GM / r4)) / 1000, 'p4 至少要增加的速率', 1e-8);

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
