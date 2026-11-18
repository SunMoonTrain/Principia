// 独立验算 physics.newtonian-mechanics.bernoulli 的 p1–p4（简单题、中等题）。
// 两套算法：一是连续性方程、伯努利方程的公式；二是 p1 用体积流量 Q = πr²v 两边相等，p3 用 RK4 积分射出的水的平抛运动
// （初速度由伯努利方程定），p4 用「压力做的功等于一小块水机械能的增加」逐项算。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.bernoulli.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;
const rho = 1.0e3;
/** 伯努利方程：已知点 1 的 p、v、z，求点 2 的压强。 */
const bernoulliP2 = (p1: number, v1: number, z1: number, v2: number, z2: number, r = rho) => p1 + 0.5 * r * (v1 * v1 - v2 * v2) + r * g * (z1 - z2);

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.bernoulli',
  notes: {
    p1: 'v2 = v1(d1/d2)²；和体积流量 π(0.02)²×1.5 除以 π(0.01)² 核对。',
    p2: '逐条用例子：A 文丘里管 S1 = 20 cm²、S2 = 5 cm²，定常流动，两处流速 1 m/s 和 4 m/s 不同（错）；B 截面相同的竖直管，由连续性方程上下流速相同（错）；C 同一根管，流速相同，往下 2 m 压强增加 ρg·2 m = 19600 Pa（对）；D 水和水银（13600）从水面下 0.5 m 的小孔流出，伯努利方程给出的流速都是 √(2g·0.5)（对）；E 截面相同的水平管，轴线上各点流速、高度都相同，压强相同（对；题干说「各处」，指沿管子各处，不考虑同一截面上下的那一点静压差）。',
    p3: '水平射程 √(2gh)·√(2H/g) = 2√(hH)；和用 RK4 积分平抛运动、在落地时停下核对。',
    p4: 'p2 = p1 + ½ρ(v1² − v2²) − ρg·12，v2 = 2v1；和逐项算「一小块体积 ΔV 的水：压力做的功 (p1 − p2)ΔV = 动能增加 + 重力势能增加」核对。',
  },
  compute() {
    // p1（m/s）
    const v1 = 1.5;
    const Q = Math.PI * 0.02 ** 2 * v1;
    const p1 = agree(Q / (Math.PI * 0.01 ** 2), v1 * (4.0 / 2.0) ** 2, 'p1 细处流速', 1e-12);

    // p2
    // A：文丘里管
    const vA1 = 1;
    const vA2 = (20 / 5) * vA1;
    const optA = vA1 === vA2;
    // B：截面相同 ⇒ 流速相同
    const optB = (1.0 * 2.0) / 1.0 > 2.0; // S1v1/S2，S1 = S2 = 1
    // C：同一根竖直管，往下 2 m
    const pTop = 2.0e5;
    const pBottom = bernoulliP2(pTop, 2.0, 2, 2.0, 0);
    check(Math.abs(pBottom - pTop - 19600) < 1e-6, 'p2 C 压强增加 19600 Pa');
    const optC = pBottom > pTop;
    // D：小孔流速和密度无关
    const exitSpeed = (r: number) => Math.sqrt((2 * (bernoulliP2(1.0e5, 0, 0.5, 0, 0, r) - 1.0e5)) / r);
    const optD = Math.abs(exitSpeed(1000) - exitSpeed(13600)) < 1e-12 && Math.abs(exitSpeed(1000) - Math.sqrt(2 * g * 0.5)) < 1e-12;
    // E：水平管、截面相同，轴线上相距 3 m 的两点
    const optE = Math.abs(bernoulliP2(1.5e5, 2.0, 0, 2.0, 0) - 1.5e5) < 1e-9;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m）
    const h = 0.45;
    const H = 0.8;
    const v0 = Math.sqrt(2 * g * h);
    const land = rk4Until((_t, s) => [s[2], s[3], 0, -g], [0, H, v0, 0], 0, 1e-4, 1e7, (_t, s) => -s[1]);
    const p3 = agree(land.y[0], 2 * Math.sqrt(h * H), 'p3 水平射程', 1e-9);

    // p4（Pa）
    const pA = 3.0e5;
    const vA = 1.0;
    const vB = 2 * vA; // 截面减半
    const dV = 1e-6;
    const work = (pB: number) => (pA - pB) * dV;
    const dE = 0.5 * rho * dV * (vB * vB - vA * vA) + rho * dV * g * 12;
    const pBfromWork = pA - dE / dV;
    check(Math.abs(work(pBfromWork) - dE) < 1e-12, 'p4 功能关系');
    const p4 = agree(pBfromWork, bernoulliP2(pA, vA, 0, vB, 12), 'p4 五楼的压强', 1e-12);

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
