// 独立验算 physics.oscillations-waves.dispersion-relations 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的色散关系 ω = 2√(T/(ma))|sin(ka/2)|、ω² = v²k² + ω_c²；二是不用这些式子，对每个小球列牛顿第二定律
// 直接算：一圈小球以某个波数的余弦形状放开、RK4 量周期（ringModeOmega），或者把弹性基底上的弦分成小段、
// 斯图姆序列求两端固定时的最低频率并外推到连续极限，再二分弦长。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.dispersion-relations.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chainDispersion, chosen, ringModeOmega, sturmCount } from './physics.oscillations-waves._ow.ts';

/** 弹性基底上两端固定、长 L 的弦，分 n 段，最低角频率（斯图姆序列）；每个小球另受 −κa·y。 */
function foundationLowest(n: number, T: number, mu: number, kappa: number, L: number): number {
  const a = L / n;
  const ks = T / a;
  const m = mu * a;
  const d = Array.from({ length: n - 1 }, () => (2 * ks + kappa * a) / m);
  const e = Array.from({ length: n - 2 }, () => -ks / m);
  return Math.sqrt(bisect((x) => sturmCount(d, e, x) - 0.5, 0, (4 * ks + kappa * a) / m));
}
/** 连续极限：n = 100、200、400 两次理查森外推。 */
function foundationLowestContinuum(T: number, mu: number, kappa: number, L: number): number {
  const w = [100, 200, 400].map((n) => foundationLowest(n, T, mu, kappa, L));
  const r = [(4 * w[1] - w[0]) / 3, (4 * w[2] - w[1]) / 3];
  return (16 * r[1] - r[0]) / 15;
}

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.dispersion-relations',
  notes: {
    p1: 'ω_max = 2√(T/(ma))，f = ω_max/(2π)；和 20 个小球连成一圈、以 ka = π（相邻反向）的形状放开、RK4 量周期核对。',
    p2: '在 k = 1、2、5 三处算 ω/k，是同一个数才不色散：A √(gk)/k 在变（错）；B 是 v（对）；C 在变（错）；D 一维链在变，并用一圈小球的模拟核对（错）；E 是 c/n（对）。',
    p3: '1 − sin(π/10)/(π/10)，化成百分数；和 40 个小球连成一圈、以 λ = 10a 的形状放开量出角频率、ω/k 和 v = a√(T/(ma)) 比核对。',
    p4: 'ω = 2ω_c 时 k = √3 ω_c/v，λ = 2π/k；和二分弦长 L：把弹性基底上两端固定的弦分成小段、斯图姆序列求最低频率（外推到连续极限）等于 2ω_c，这时 λ = 2L。',
  },
  compute() {
    // p1（Hz）
    const m1 = 0.002;
    const a1 = 0.01;
    const T1 = 100;
    const wmaxSim = ringModeOmega(20, T1, m1, a1, 10);
    const p1 = agree(wmaxSim / (2 * Math.PI), (2 * Math.sqrt(T1 / (m1 * a1))) / (2 * Math.PI), 'p1 最高频率', 1e-8);

    // p2
    const ks = [1, 2, 5];
    const g = 9.8;
    const v = 3;
    const wc = 2;
    const n = 1.5;
    const c = 3e8;
    const rels = [(k: number) => Math.sqrt(g * k), (k: number) => v * k, (k: number) => Math.sqrt(v * v * k * k + wc * wc), (k: number) => chainDispersion(k, 1, 1, 0.5), (k: number) => (c * k) / n];
    const nondisp = rels.map((om) => {
      const vp = ks.map((k) => om(k) / k);
      return Math.max(...vp) - Math.min(...vp) < 1e-9 * Math.abs(vp[0]);
    });
    const vpChain = [1, 4].map((p) => ringModeOmega(16, 1, 0.5, 0.5, p) / ((2 * Math.PI * p) / (16 * 0.5)));
    check(Math.abs(vpChain[0] - vpChain[1]) > 0.05, 'p2 D 模拟出的链的相速度随波数变');
    const p2 = chosen(nondisp);

    // p3（%）
    const T3 = 2;
    const m3 = 0.3;
    const a3 = 0.05;
    const N3 = 40;
    const k3 = (2 * Math.PI * 4) / (N3 * a3); // λ = 10a
    const vp3 = ringModeOmega(N3, T3, m3, a3, 4) / k3;
    const vLong = a3 * Math.sqrt(T3 / (m3 * a3));
    const p3 = agree((1 - vp3 / vLong) * 100, (1 - Math.sin(Math.PI / 10) / (Math.PI / 10)) * 100, 'p3 相速度小的百分数', 1e-7);

    // p4（m）
    const mu4 = 0.01;
    const T4 = 4;
    const kap = 40;
    const v4 = Math.sqrt(T4 / mu4);
    const wc4 = Math.sqrt(kap / mu4);
    const L = bisect((LL) => foundationLowestContinuum(T4, mu4, kap, LL) - 2 * wc4, 0.1, 5);
    const p4 = agree(2 * L, (2 * Math.PI) / ((Math.sqrt(3) * wc4) / v4), 'p4 波长', 1e-9);

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
