// 独立验算 physics.oscillations-waves.damped-oscillations 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 γ = b/m、ω_d = √(ω0² − γ²/4)、振幅按 e^{−γt/2} 衰减；二是用 RK4 积分 m ẍ + b ẋ + k x = 0，
// 量向上过零的平均间隔（周期）、相邻极大值之比（衰减），或者数位移变号的次数（是不是来回振动）。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.damped-oscillations.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, maxima, oscillator, periodOf, rk4Step } from './physics.oscillations-waves._ow.ts';

/** 从 x = 1、v = 0 放开，积分到 tEnd，数位移变号的次数。 */
function signChanges(m: number, b: number, k: number, tEnd: number): number {
  const f = oscillator(m, b, k);
  const h = (2 * Math.PI) / Math.sqrt(k / m) / 2000;
  let y = [1, 0];
  let n = 0;
  for (let t = 0; t < tEnd; t += h) {
    const yn = rk4Step(f, t, y, h);
    if (Math.sign(yn[0]) !== Math.sign(y[0]) && yn[0] !== 0) n++;
    y = yn;
  }
  return n;
}

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.damped-oscillations',
  notes: {
    p1: 'ω_d = √(25 − 9) = 4；和取 m = 1、b = γ、k = ω0² 积分、量 10 个周期的向上过零时刻，2π/T 核对。',
    p2: '欠阻尼当且仅当 b² < 4mk：A 64 = 64 临界，B 9 > 4 过阻尼，C 9 < 16，D 49 > 36 过阻尼，E 2.25 < 16。和积分 200 s、数位移变号的次数核对：欠阻尼变号很多次，临界阻尼、过阻尼至多一次。',
    p3: 'γ = 0.2 s⁻¹，ω_d = √(100 − 0.01)，10 个周期后是 e^{−0.1 × 10 × 2π/ω_d}；和积分、取第 1 个和第 11 个极大值之比核对。',
    p4: '临界阻尼 b = 2√(mk) = 10 kg/s，取 5 kg/s，γ = 10 s⁻¹ = ω0，ω_d = √(100 − 25)，间隔是 2π/ω_d；和积分、量向上过零的平均间隔核对。',
  },
  compute() {
    // p1（rad/s）
    const w0 = 5;
    const gam = 6;
    const p1 = agree((2 * Math.PI) / periodOf(oscillator(1, gam, w0 * w0), [1, 0], 0, 1e-4, 10), Math.sqrt(w0 * w0 - (gam * gam) / 4), 'p1 ω_d', 1e-9);

    // p2
    const sets: [number, number, number][] = [[2, 8, 8], [0.5, 2, 3], [1, 4, 3], [1, 9, 7], [4, 1, 1.5]];
    const byFormula = sets.map(([m, k, b]) => b * b < 4 * m * k);
    const bySim = sets.map(([m, k, b]) => signChanges(m, b, k, 200) >= 3);
    check(byFormula.every((x, i) => x === bySim[i]), 'p2 两种判法一致');
    check(sets.map(([m, k, b]) => signChanges(m, b, k, 200)).every((n, i) => byFormula[i] || n <= 1), 'p2 非欠阻尼至多越过平衡位置一次');
    const p2 = chosen(byFormula);

    // p3
    const m3 = 0.1;
    const k3 = 10;
    const b3 = 0.02;
    const g3 = b3 / m3;
    const wd3 = Math.sqrt(k3 / m3 - (g3 * g3) / 4);
    const mx = maxima(oscillator(m3, b3, k3), [0.01, 0], 0, 1, 1e-4, 11);
    const p3 = agree(mx[10].value / mx[0].value, Math.exp((-g3 / 2) * 10 * ((2 * Math.PI) / wd3)), 'p3 10 个周期后的振幅之比', 1e-9);

    // p4（s）
    const m4 = 0.5;
    const k4 = 50;
    const b4 = Math.sqrt(m4 * k4); // 临界阻尼 2√(mk) 的一半
    const g4 = b4 / m4;
    const p4 = agree(periodOf(oscillator(m4, b4, k4), [0.01, 0], 0, 1e-5, 3), (2 * Math.PI) / Math.sqrt(k4 / m4 - (g4 * g4) / 4), 'p4 相邻两次同向过平衡位置的间隔', 1e-8);

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
