// 独立验算 physics.oscillations-waves.reflection-transmission 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的阻抗 Z = √(Tμ)、r = (Z1 − Z2)/(Z1 + Z2)、τ = 2Z1/(Z1 + Z2)；二是不用这些式子，把两根弦分成
// 很多小段、对每个节点列牛顿第二定律（连接处的节点各分两边半格的质量），让一个高斯脉冲从弦 1 射来，蛙跳法积分，
// 直接量反射、透射脉冲的高度、位置（pulseAtJunction）；第 4 题二分弦 2 的线密度，使量出的反射脉冲高度是 −0.70。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.reflection-transmission.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, impedance, pulseAtJunction, runString, stringSim } from './physics.oscillations-waves._ow.ts';

const rFormula = (mu1: number, mu2: number) => (impedance(1, mu1) - impedance(1, mu2)) / (impedance(1, mu1) + impedance(1, mu2));
const tauFormula = (mu1: number, mu2: number) => (2 * impedance(1, mu1)) / (impedance(1, mu1) + impedance(1, mu2));

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.reflection-transmission',
  notes: {
    p1: 'Z2/Z1 = 5，r = (1 − 5)/(1 + 5)；和数值模拟：μ2 = 25μ1，脉冲从弦 1 射来，量反射脉冲的高度核对。',
    p2: '数值模拟逐条：A 从 μ1 = 4 射向 μ2 = 1，透射脉冲高 4/3 > 1（对）；B 射来一个高斯包络乘余弦的波包，在两边各取一点量位移的过零间隔，周期相同（对）；C 末端固定时反射脉冲倒过来，和入射的在末端反号（错）；D μ2 = μ1 时弦 1 上几乎不剩反射（对）；E 反例：T = 100、μ = 0.01 的弦 Z = 1、v = 100，T = 1、μ = 0.04 的弦 Z = 0.2、v = 5，阻抗大的波速反而大（错）。',
    p3: 'τ = 2/(1 + 1/5) = 5/3，波长之比 = 波速之比 = 5；和数值模拟：μ2 = μ1/25，量透射脉冲的高度，再量它的峰在两个时刻的位置求速度核对。',
    p4: 'Z2/Z1 = 1.7/0.3，μ2 = 2.0 × (1.7/0.3)² g/m；和二分 μ2：数值模拟量出的反射脉冲高度等于 −0.70。',
  },
  compute() {
    // p1
    const s1 = pulseAtJunction({ mu1: 1, mu2: 25, n: 10000 });
    check(Math.abs(s1.sim.energy() - s1.e0) < 1e-8 * s1.e0 && Math.abs(s1.eLeft + s1.eRight - s1.e0) < 1e-3 * s1.e0, 'p1 模拟的能量守恒');
    const p1 = agree(s1.left, rFormula(1, 25), 'p1 反射系数', 1e-3);

    // p2
    const heavyToLight = pulseAtJunction({ mu1: 4, mu2: 1, L: 3 });
    const optA = heavyToLight.right > 1;
    check(Math.abs(heavyToLight.right - tauFormula(4, 1)) < 1e-3, 'p2 A 透射高度是 4/3');
    // B：波包 exp(−((x − 0.4)/0.12)²)·cos(2π·12(x − 0.4))，向右，在 x = 0.8（弦 1）和 x = 1.3（弦 2）记录位移
    const T = 1;
    const mu2b = 2.25;
    const v1 = 1;
    const env = (x: number) => Math.exp(-(((x - 0.4) / 0.12) ** 2));
    const kk = 2 * Math.PI * 12;
    const yb = (x: number) => env(x) * Math.cos(kk * (x - 0.4));
    const dyb = (x: number) => (yb(x + 1e-7) - yb(x - 1e-7)) / 2e-7;
    const simB = stringSim({ L: 2.5, n: 10000, T, mu: (x) => (x < 1 ? 1 : mu2b), y0: yb, v0: (x) => -v1 * dyb(x) });
    const jA = Math.round(0.8 / (2.5 / 10000));
    const jB = Math.round(1.3 / (2.5 / 10000));
    const recA: [number, number][] = [];
    const recB: [number, number][] = [];
    const dt = simB.dtMax;
    for (let i = 0; simB.t < 1.6; i++) {
      simB.step(dt);
      recA.push([simB.t, simB.y[jA]]);
      recB.push([simB.t, simB.y[jB]]);
    }
    const crossings = (rec: [number, number][], tLo: number, tHi: number) => {
      const out: number[] = [];
      for (let i = 1; i < rec.length; i++) {
        const [t0, y0] = rec[i - 1];
        const [t1, y1] = rec[i];
        if (t0 >= tLo && t1 <= tHi && y0 < 0 && y1 >= 0) out.push(t0 + ((0 - y0) / (y1 - y0)) * (t1 - t0));
      }
      return (out[out.length - 1] - out[0]) / (out.length - 1);
    };
    const periodA = crossings(recA, 0.3, 0.5); // 入射波包经过 x = 0.8
    const periodB = crossings(recB, 0.9, 1.2); // 透射波包经过 x = 1.3（波速 2/3，t ≈ 1.05）
    const optB = Math.abs(periodA - periodB) < 2e-3 * periodA;
    check(Math.abs(periodA - 1 / 12) < 3e-3 / 12, 'p2 B 量出的周期就是 1/12');
    // C：末端固定，脉冲反射回来
    const f = (x: number) => Math.exp(-(((x - 0.5) / 0.05) ** 2));
    const simC = stringSim({ L: 1, n: 4000, T: 1, mu: () => 1, y0: f, v0: (x) => ((2 * (x - 0.5)) / 0.0025) * f(x), right: 'fixed' });
    runString(simC, 0.9);
    let peakC = 0;
    for (const yy of simC.y) if (Math.abs(yy) > Math.abs(peakC)) peakC = yy;
    const optC = peakC > 0; // 说法是「同号」：反射脉冲（此刻在 x ≈ 0.6）该是正的
    check(Math.abs(peakC + 1) < 2e-3, 'p2 C 固定端的反射脉冲是 −1 倍');
    // D：阻抗相等
    // 阻抗相等时弦 1 上只剩数值色散的尾巴（10⁻⁵ 量级）；对照 μ2 = 1.1 时真有反射，|r| ≈ 0.024
    const same = pulseAtJunction({ mu1: 1, mu2: 1 });
    const slight = pulseAtJunction({ mu1: 1, mu2: 1.1 });
    check(Math.abs(Math.abs(slight.left) - Math.abs(rFormula(1, 1.1))) < 1e-3, 'p2 D 对照：稍有失配时量得出反射');
    const optD = Math.abs(same.left) < 1e-3;
    // E：反例
    const strA = { T: 100, mu: 0.01 };
    const strB = { T: 1, mu: 0.04 };
    const Z = (q: { T: number; mu: number }) => impedance(q.T, q.mu);
    const vv = (q: { T: number; mu: number }) => Math.sqrt(q.T / q.mu);
    const optE = !(Z(strA) > Z(strB) && vv(strA) > vv(strB));
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const s3 = pulseAtJunction({ mu1: 1, mu2: 1 / 25, L: 3.5, n: 7000 });
    const xA = s3.xRight;
    runString(s3.sim, s3.sim.t + 0.1);
    let xB = 0;
    let best = 0;
    for (let j = 0; j < s3.sim.x.length; j++) if (s3.sim.x[j] > 1 && Math.abs(s3.sim.y[j]) > best) [best, xB] = [Math.abs(s3.sim.y[j]), s3.sim.x[j]];
    const speedRatio = (xB - xA) / 0.1 / 1;
    const p3: number[] = [agree(s3.right, tauFormula(1, 1 / 25), 'p3 透射振幅之比', 1e-3), agree(speedRatio, Math.sqrt(25), 'p3 波长之比', 5e-3)];

    // p4（g/m）
    const mu2Sim = bisect((m2) => pulseAtJunction({ mu1: 1, mu2: m2, n: 3000, s: 0.06 }).left + 0.7, 2, 100);
    const p4 = agree(2.0 * mu2Sim, 2.0 * (1.7 / 0.3) ** 2, 'p4 弦 2 的线密度', 5e-3);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
