// 独立验算 physics.analytical-mechanics.hamilton-jacobi 的 p1–p4（简单题、中等题）。
// 哈密顿-雅可比方程的残差 H(q, ∂S/∂q, t) + ∂S/∂t 用数值偏导数在随机点上算；由 β = ∂S/∂α 二分反解出 q(t)；
// 同时按正则方程（偏导数数值求）或直角坐标里的牛顿方程直接积分运动，两种算法互相核对；再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.hamilton-jacobi.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, chosen, derivative, integrateTo, integrateUntil, random } from './physics.analytical-mechanics._mech.ts';
import { canonical, type Hamiltonian } from './physics.analytical-mechanics._hamilton.ts';

const rnd = random(1834);

/** 一维的 S(q, t)：哈密顿-雅可比方程 H(q, ∂S/∂q, t) + ∂S/∂t 的残差。 */
function hjResidual(H: Hamiltonian, S: (q: number, t: number) => number, q: number, t: number): number {
  const Sq = derivative((s) => S(q + s, t), 0);
  const St = derivative((s) => S(q, t + s), 0);
  return H([q], [Sq], t) + St;
}

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.hamilton-jacobi',
  notes: {
    p1: '先在随机点上核对 S 满足方程；由 ∂S/∂α（数值求导）= β 在 t = 3 二分出 q。另外按正则方程从 t = 0 时的状态（q = β、p = ∂S/∂q）积分到 t = 3，两者核对。',
    p2: '在 8 个随机的 (q, t)（t > 0）上数值求残差 ½(∂S/∂q)² + ∂S/∂t；A、C 的 α 取随机数（避开 0 和 2）。A、B 处处为零；C 只有 α = 0 或 2 时为零，D 不为零。',
    p3: '先在随机点上数值核对 S 满足方程；由 ∂S/∂α = 0 在 t = 1 二分出 q；另外取 t = 0 时的状态（同样由 β = 0 定出 q，p = ∂S/∂q）按正则方程积分到 t = 1，两者核对；和匀加速运动的公式核对。',
    p4: '在直角坐标里按 H = (p_x² + p_y²)/2 − 1/r 的正则方程（偏导数数值求）积分，从 (1, 0)、p = (0, 1.2) 出发，定位径向速度由正变负的时刻读出 r；和例 2 的轨道 r = (α²/mk)/(1 − e) 核对。',
  },
  compute() {
    // p1：m = 2、α = 4、β = −1、t = 3
    const m1 = 2;
    const al1 = 4;
    const H1: Hamiltonian = (_q, p) => p[0] ** 2 / (2 * m1);
    const S1 = (q: number, a: number, t: number): number => a * q - (a * a * t) / (2 * m1);
    for (let i = 0; i < 4; i++) {
      if (Math.abs(hjResidual(H1, (q, t) => S1(q, al1, t), 4 * rnd() - 2, 3 * rnd())) > 1e-7) throw new Error('p1 S 不满足方程');
    }
    const beta = (q: number, t: number): number => derivative((s) => S1(q, al1 + s, t), 0);
    const qHJ = bisect((q) => beta(q, 3) + 1, -100, 100);
    const p0 = derivative((s) => S1(-1 + s, al1, 0), 0);
    const qDyn = integrateTo(canonical(H1), [bisect((q) => beta(q, 0) + 1, -100, 100), p0], 0, 3, 1e-3)[0];
    const p1 = agree(agree(qHJ, qDyn, 'p1 两种算法'), -1 + (al1 / m1) * 3, 'p1 q');

    // p2：H = p²/2
    const H2: Hamiltonian = (_q, p) => p[0] ** 2 / 2;
    const alpha = 0.7 + 0.9 * rnd(); // 在 (0.7, 1.6) 里，避开 0 和 2
    const Ss: ((q: number, t: number) => number)[] = [
      (q, t) => alpha * q - 0.5 * alpha * alpha * t,
      (q, t) => (q * q) / (2 * t),
      (q, t) => alpha * q - alpha * t,
      (q, t) => q * t,
    ];
    const satisfies = (S: (q: number, t: number) => number): boolean =>
      Array.from({ length: 8 }, () => Math.abs(hjResidual(H2, S, 4 * rnd() - 2, 0.5 + 3 * rnd())) < 1e-7).every(Boolean);
    const p2 = chosen(Ss.map(satisfies));
    // C 在 α = 2 时确实满足（题面「α 是常数」的另一种读法，写进报告）
    if (!satisfies((q, t) => 2 * q - 2 * t)) throw new Error('p2 C 在 α = 2 时应当满足');

    // p3：H = p²/(2m) − Fq，m = 1、F = 2、α = 1、β = 0、t = 1
    const [m3, F3, al3] = [1, 2, 1];
    const H3: Hamiltonian = (q, p) => p[0] ** 2 / (2 * m3) - F3 * q[0];
    const S3 = (q: number, a: number, t: number): number => (a + F3 * t) * q - (a + F3 * t) ** 3 / (6 * m3 * F3);
    for (let i = 0; i < 4; i++) {
      if (Math.abs(hjResidual(H3, (q, t) => S3(q, al3, t), 4 * rnd() - 2, 3 * rnd())) > 1e-6) throw new Error('p3 S 不满足方程');
    }
    const beta3 = (q: number, t: number): number => derivative((s) => S3(q, al3 + s, t), 0);
    const qHJ3 = bisect((q) => beta3(q, 1), -100, 100);
    const q03 = bisect((q) => beta3(q, 0), -100, 100);
    const p03 = derivative((s) => S3(q03 + s, al3, 0), 0);
    const qDyn3 = integrateTo(canonical(H3), [q03, p03], 0, 1, 1e-3)[0];
    const p3 = agree(agree(qHJ3, qDyn3, 'p3 两种算法'), q03 + (p03 / m3) * 1 + (F3 / (2 * m3)) * 1, 'p3 q');

    // p4：m = k = 1，r = 1 处速度 1.2 垂直于矢径
    const H4: Hamiltonian = (_q, p) => (p[0] ** 2 + p[1] ** 2) / 2 - 1 / Math.hypot(_q[0], _q[1]);
    const far = integrateUntil(canonical(H4), [1, 0, 0, 1.2], 0, 1e-3, 100, (_t, y) => y[0] * y[2] + y[1] * y[3])!;
    const rMax = Math.hypot(far.y[0], far.y[1]);
    const L = 1.2;
    const E = 0.5 * 1.2 ** 2 - 1;
    const e = Math.sqrt(1 + 2 * E * L * L);
    const p4 = agree(rMax, (L * L) / (1 - e), 'p4 最远距离');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
