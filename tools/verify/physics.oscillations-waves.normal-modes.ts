// 独立验算 physics.oscillations-waves.normal-modes 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里两个简正模的式子 ω1² = k/m、ω2² = (k + 2κ)/m；二是用雅可比方法直接求刚度矩阵的本征值，
// 或者用 RK4 积分两个物块的运动方程：判一个开始状态是不是简正模，看位移 (x1, x2) 是否始终在过原点的一条直线上
// （x(t) = c(t)e 代入 Mẍ = −Kx 就得 Ke ∝ Me，e 是简正模）。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.normal-modes.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, normalModes, periodOf, trajectory, type Rhs } from './physics.oscillations-waves._ow.ts';

/** 两面墙之间两个物块：两边弹簧 k、中间 κ。 */
const wallK = (k: number, kappa: number) => [[k + kappa, -kappa], [-kappa, k + kappa]];
/** 状态 [x1, x2, v1, v2] 的右端。 */
const twoMass = (m: number, K: number[][]): Rhs => (_t, y) => [y[2], y[3], -(K[0][0] * y[0] + K[0][1] * y[1]) / m, -(K[1][0] * y[0] + K[1][1] * y[1]) / m];

/** 积分一段时间，看位移是否始终在过原点的一条直线上：Σxxᵀ 的较小本征值和较大本征值之比。 */
function lineRatio(m: number, K: number[][], y0: number[]): number {
  const traj = trajectory(twoMass(m, K), y0, 0, 20, 40000);
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i <= 4000; i++) {
    const [x1, x2] = traj(i * 0.005);
    sxx += x1 * x1;
    sxy += x1 * x2;
    syy += x2 * x2;
  }
  const tr = sxx + syy;
  const det = sxx * syy - sxy * sxy;
  const disc = Math.sqrt(Math.max(tr * tr / 4 - det, 0));
  return (tr / 2 - disc) / (tr / 2 + disc);
}

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.normal-modes',
  notes: {
    p1: '反向的模 ω² = (k + 2κ)/m = 100；和雅可比法求 M^{−1/2}KM^{−1/2} 的本征值（较大的那个，模是 (1, −1)）、再积分 (1, −1) 出发的运动量周期核对。',
    p2: '取 m = 1、k = 4、κ = 1，积分 20 s，看位移是否始终在一条过原点的直线上：A 同向等量、静止放开，在 (1, 1) 上（是）；B (1, 2) 混了两个模（否）；C (−3, 3) 在 (1, −1) 上（是）；D 位移为零、速度 (v, −v)，在 (1, −1) 上（是）；E 位移 (1, 1)、速度 (0, v)，混了两个模（否）。',
    p3: '(f2/f1)² = (k + 2κ)/k = 1.5625，κ/k = 0.28125；和二分 κ/k、使雅可比法求出的两个频率之比是 1.25 核对。',
    p4: '质心匀速，相对运动的约化质量 0.10 kg、相对速度 1.0 m/s，½μv² = ½kx²，x = 5.0 cm；和积分两个物块的运动、在相对速度第一次变号时量 x1 − x2 核对。',
  },
  compute() {
    // p1（rad/s）
    const K1 = wallK(20, 15);
    const nm = normalModes(K1, [0.5, 0.5]);
    check(Math.abs(nm.modes[1][0] - 1) < 1e-12 && Math.abs(nm.modes[1][1] + 1) < 1e-12, 'p1 较高的模是反向的 (1, −1)');
    const T1 = periodOf(twoMass(0.5, K1), [0.01, -0.01, 0, 0], 0, 1e-5, 5);
    check(Math.abs((2 * Math.PI) / T1 - nm.omegas[1]) < 1e-8 * nm.omegas[1], 'p1 积分出的周期和本征值一致');
    const p1 = agree(nm.omegas[1], Math.sqrt((20 + 2 * 15) / 0.5), 'p1 反向模的简正频率', 1e-12);

    // p2
    const K2 = wallK(4, 1);
    const v = 0.05;
    const starts = [[0.02, 0.02, 0, 0], [0.01, 0.02, 0, 0], [-0.03, 0.03, 0, 0], [0, 0, v, -v], [0.01, 0.01, 0, v]];
    const ratios = starts.map((y0) => lineRatio(1, K2, y0));
    check(ratios.every((r) => r < 1e-12 || r > 1e-3), 'p2 每个开始状态都判得清楚');
    const p2 = chosen(ratios.map((r) => r < 1e-12));

    // p3
    const ratioOf = (q: number) => {
      const w = normalModes(wallK(1, q), [1, 1]).omegas;
      return w[1] / w[0];
    };
    const p3 = agree(bisect((q) => ratioOf(q) - 2.5 / 2.0, 0.01, 10), ((2.5 / 2.0) ** 2 - 1) / 2, 'p3 κ/k', 1e-9);

    // p4（cm）
    const m = 0.2;
    const k = 40;
    const free: Rhs = (_t, y) => [y[2], y[3], (-k * (y[0] - y[1])) / m, (k * (y[0] - y[1])) / m];
    const traj = trajectory(free, [0, 0, 1, 0], 0, 0.3, 300000);
    const tStop = bisect((t) => traj(t)[2] - traj(t)[3], 0.01, 0.15);
    const s = traj(tStop);
    const mu = (m * m) / (m + m);
    const p4 = agree((s[0] - s[1]) * 100, 1.0 * Math.sqrt(mu / k) * 100, 'p4 最大压缩量', 1e-9);

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
