// 独立验算 physics.newtonian-mechanics.two-body-problem 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（μ = m₁m₂/(m₁ + m₂)、T² = 4π²a³/[G(m₁ + m₂)]）；二是不用这些式子：
// 两个质点各自按牛顿第二定律积分（_nm.ts 的 twoBodyHalf），二分出让两者的距离保持不变的相对速率（圆轨道），
// 周期是连线转过半圈用的时间的两倍；约化质量由「引力 ÷ 相对加速度」得到。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.two-body-problem.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisectN, check, chosen, twoBodyHalf } from './physics.newtonian-mechanics._nm.ts';

const G = 6.67e-11;

/** 两个质点相距 d、只受彼此的引力时，引力的大小除以两者的相对加速度（各自 a = F/m，方向相反）。 */
const forceOverRelAccel = (g: number, m1: number, m2: number, d: number) => {
  const F = (g * m1 * m2) / (d * d);
  return F / (F / m1 + F / m2);
};
/** 二分出让两者距离保持 d 的相对速率（转过半圈时距离仍是 d）。 */
const circularVrel = (g: number, m1: number, m2: number, d: number) => {
  const guess = Math.sqrt((g * (m1 + m2)) / d);
  return bisectN((v) => twoBodyHalf(g, m1, m2, d, v, 4000).d - d, 0.7 * guess, 1.3 * guess, 55);
};

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.two-body-problem',
  notes: {
    p1: 'μ/m_月 = m_地/(m_地 + m_月)；和数值核对：引力 ÷ 两者的相对加速度，再除以月球的质量。',
    p2: '逐条用例子（G = 1）：A、E 质量 2 和 1 的两个质点，二分出圆轨道后积分，转过半圈时到质心的距离 1/3、2/3，质量大的离质心近、绕质心的速率小（A 对、E 错）；B 质量 1、4 时引力 ÷ 相对加速度 = 0.8（对）；C G 加倍、引力加倍时这个比值不变（错）；D 太阳质量 1、行星 0.001 和 0.1，相对距离都是 1 的圆轨道，积出的周期 6.280、5.991，行星重的周期短（对）。',
    p3: 'm₁ + m₂ = 4π²d³/(GT²)；和数值核对：相对速率 2πd/T，二分出让两颗星（质量对半分；另试 4:1）保持相距 d 的总质量。',
    p4: 'T = 2π√(d³/[G(m₁ + m₂)])；和数值核对：两个质点各自积分，二分出圆轨道的相对速率，周期是连线转过半圈用的时间的两倍。',
  },
  compute() {
    // p1
    const mE = 5.97e24;
    const mM = 7.35e22;
    const p1 = agree(forceOverRelAccel(G, mE, mM, 3.84e8) / mM, mE / (mE + mM), 'p1 约化质量和月球质量之比', 1e-12);

    // p2
    const v21 = circularVrel(1, 2, 1, 1);
    const h21 = twoBodyHalf(1, 2, 1, 1, v21);
    const T21 = 2 * h21.t;
    const speed1 = (2 * Math.PI * h21.r1) / T21;
    const speed2 = (2 * Math.PI * h21.r2) / T21;
    const optA = speed1 < speed2;
    const optE = h21.r1 > h21.r2;
    const optB = Math.abs(forceOverRelAccel(1, 1, 4, 1) - 0.8) < 1e-12;
    const optC = Math.abs(forceOverRelAccel(2, 1, 4, 1) - 2 * forceOverRelAccel(1, 1, 4, 1)) < 1e-12;
    const period = (m: number) => 2 * twoBodyHalf(1, 1, m, 1, circularVrel(1, 1, m, 1)).t;
    const optD = period(0.1) < period(0.001);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（kg）
    const d3 = 2.0e11;
    const T3 = 2.0 * 3.16e7;
    const v3 = (2 * Math.PI * d3) / T3;
    const guess = (v3 * v3 * d3) / G;
    const massFor = (share: number) => bisectN((M) => twoBodyHalf(G, share * M, (1 - share) * M, d3, v3, 4000).d - d3, 0.7 * guess, 1.4 * guess, 55);
    const Ma = massFor(0.5);
    const Mb = massFor(0.8);
    agree(Ma, Mb, 'p3 两种质量分配', 1e-9);
    const p3 = agree(Ma, (4 * Math.PI * Math.PI * d3 ** 3) / (G * T3 * T3), 'p3 总质量', 1e-8);

    // p4（天）
    const mP = 1.3e22;
    const mC = 1.59e21;
    const d4 = 1.96e7;
    const v4 = circularVrel(G, mP, mC, d4);
    const half4 = twoBodyHalf(G, mP, mC, d4, v4);
    check(Math.abs(half4.d - d4) < 1e-9 * d4, 'p4 圆轨道');
    const p4 = agree((2 * half4.t) / 86400, (2 * Math.PI * Math.sqrt(d4 ** 3 / (G * (mP + mC)))) / 86400, 'p4 卡戎的周期', 1e-8);

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
