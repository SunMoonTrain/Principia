// 独立验算 physics.analytical-mechanics.hamiltonian-chaos 的 p1–p4（简单题、中等题）。
// 标准映射的那几题：p1 不用映射的公式，直接积分受冲击的转子（把 δ 冲击换成宽 w 的光滑脉冲，w → 0 外推）；
// 不动点的类型和李雅普诺夫指数由映射的雅可比矩阵数值求出（求迹、幂迭代），再用一串迭代的点核对。
// 可积的那题按定义逐条查守恒量的泊松括号和梯度是否独立；反例用亨农-海利斯系统，数出它的李雅普诺夫指数大于零。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.hamiltonian-chaos.ts

import { fileURLToPath } from 'node:url';
import type { Derivative } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, chosen, integrateTo, jacobian, random, rank, type Vec } from './physics.analytical-mechanics._mech.ts';
import { canonical, dp, dq, poisson, type PhaseFunction } from './physics.analytical-mechanics._hamilton.ts';

/** 标准映射（不取模）。 */
const standardMap =
  (K: number) =>
  ([q, p]: Vec): Vec => {
    const p1 = p + K * Math.sin(q);
    return [q + p1, p1];
  };

/** 两个轨道相距 10⁻⁸ 出发，每隔单位时间量一次距离再缩回 10⁻⁸，取对数的平均。 */
function lyapunov(f: Derivative, y0: Vec, T: number): number {
  let a: Float64Array = Float64Array.from(y0);
  let b: Float64Array = Float64Array.from(y0.map((x, i) => (i === 0 ? x + 1e-8 : x)));
  let sum = 0;
  for (let i = 0; i < T; i++) {
    a = integrateTo(f, Array.from(a), i, i + 1, 0.01);
    b = integrateTo(f, Array.from(b), i, i + 1, 0.01);
    const d = Math.hypot(...a.map((ai, k) => b[k] - ai));
    sum += Math.log(d / 1e-8);
    b = Float64Array.from(a.map((ai, k) => ai + ((b[k] - ai) * 1e-8) / d));
  }
  return sum / T;
}

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.hamiltonian-chaos',
  notes: {
    p1: '把 H = p²/2 + K cos q Σδ(t − n) 的 δ 换成宽 w 的光滑脉冲 (1 − cos(2πt/w))/w，按正则方程从 (π/2, 0) 积分一个周期；w 取 10⁻⁴ 和 5×10⁻⁵，误差和 w 成正比，外推到 w → 0；和映射的公式 q₁ = π/2 + 1 核对。',
    p2: 'A 取 H = p²/2 + q⁴ − q²，B 取两个频率不同的振子，C 取 V = r⁴/4 − r² 的平面有心力：在 8 个随机点上查守恒量和 H 的泊松括号、守恒量之间的泊松括号为零、梯度的秩等于自由度数。D 的反例是亨农-海利斯系统，E = 0.16、从 (0, −0.1) 出发，李雅普诺夫指数约 0.12（大于 0.05 才算混沌；B 的振子算出来是 0）。',
    p3: '数值求标准映射在 (π, 0) 的雅可比矩阵，对 K 二分出迹等于 −2 的地方；再从 (π + 10⁻³, 0) 出发迭代 5000 次核对：K = 3.5 时一直在附近，K = 4.5 时跑开。和迹 2 − K = −2 核对。',
    p4: '数值求 (0, 0) 处的雅可比矩阵，幂迭代得最大特征值；再沿不稳定方向偏离 10⁻¹²，迭代 15 次，偏离的增长倍数开 15 次方，两者核对；和特征方程 λ² − 2.5λ + 1 = 0 的大根 2 取对数核对。',
  },
  compute() {
    // p1：K = 1
    const kickOnce = (w: number): number => {
      const H = (q: Vec, p: Vec, t: number): number =>
        p[0] ** 2 / 2 + (t >= 0 && t <= w ? (Math.cos(q[0]) * (1 - Math.cos((2 * Math.PI * t) / w))) / w : 0);
      const f = canonical(H);
      const afterKick = integrateTo(f, [Math.PI / 2, 0], 0, w, w / 200);
      return integrateTo(f, Array.from(afterKick), w, 1, 1e-3)[0];
    };
    const q1 = 2 * kickOnce(5e-5) - kickOnce(1e-4);
    const p1 = agree(q1, standardMap(1)([Math.PI / 2, 0])[0], 'p1 q₁', 1e-7);

    // p2
    const rnd = random(731);
    const integrable = (H: PhaseFunction, others: PhaseFunction[]): boolean => {
      const F = [H, ...others];
      for (let k = 0; k < 8; k++) {
        const n = others.length + 1;
        const q = Array.from({ length: n }, () => 2 * rnd() - 1);
        const p = Array.from({ length: n }, () => 2 * rnd() - 1);
        for (let i = 0; i < n; i++)
          for (let j = i + 1; j < n; j++) if (Math.abs(poisson(F[i], F[j], q, p)) > 1e-8) return false;
        const grads = F.map((Fi) => [...q.map((_, m) => dq(Fi, q, p, 0, m)), ...p.map((_, m) => dp(Fi, q, p, 0, m))]);
        if (rank(grads) < n) return false;
      }
      return true;
    };
    const flagA = integrable((q, p) => p[0] ** 2 / 2 + q[0] ** 4 - q[0] ** 2, []);
    const flagB = integrable(
      (q, p) => (p[0] ** 2 + q[0] ** 2) / 2 + (p[1] ** 2 + 2 * q[1] ** 2) / 2,
      [(q, p) => (p[0] ** 2 + q[0] ** 2) / 2],
    );
    const flagC = integrable(
      (q, p) => (p[0] ** 2 + p[1] ** 2) / 2 + (q[0] ** 2 + q[1] ** 2) ** 2 / 4 - (q[0] ** 2 + q[1] ** 2),
      [(q, p) => q[0] * p[1] - q[1] * p[0]],
    );
    const henonHeiles: Derivative = (_t, s, o) => {
      o[0] = s[2];
      o[1] = s[3];
      o[2] = -s[0] - 2 * s[0] * s[1];
      o[3] = -s[1] - s[0] * s[0] + s[1] * s[1];
    };
    const y = -0.1;
    const lambdaHH = lyapunov(henonHeiles, [0, y, Math.sqrt(2 * (0.16 - (y * y) / 2 + (y * y * y) / 3)), 0], 1000);
    const oscillators: Derivative = (_t, s, o) => {
      o[0] = s[2];
      o[1] = s[3];
      o[2] = -s[0];
      o[3] = -2 * s[1];
    };
    if (lyapunov(oscillators, [0.3, 0.2, 0.1, -0.4], 1000) > 0.01) throw new Error('p2 可积的振子算出了正的李雅普诺夫指数');
    const p2 = chosen([flagA, flagB, flagC, lambdaHH < 0.05]);

    // p3
    const traceAt = (K: number, x: Vec): number => {
      const J = jacobian(standardMap(K), x);
      return J[0][0] + J[1][1];
    };
    const Kstar = bisect((K) => traceAt(K, [Math.PI, 0]) + 2, 1, 10);
    const stays = (K: number): boolean => {
      let x = [Math.PI + 1e-3, 0];
      for (let i = 0; i < 5000; i++) {
        x = standardMap(K)(x);
        if (Math.hypot(x[0] - Math.PI, x[1]) > 0.05) return false;
      }
      return true;
    };
    if (!stays(3.5) || stays(4.5)) throw new Error('p3 迭代的结果和不动点的类型不符');
    const p3 = agree(Kstar, 4, 'p3 K*');

    // p4：K = 0.5
    const J = jacobian(standardMap(0.5), [0, 0]);
    let u = [1, 0.3];
    let growth = 1;
    for (let i = 0; i < 60; i++) {
      const v = [J[0][0] * u[0] + J[0][1] * u[1], J[1][0] * u[0] + J[1][1] * u[1]];
      growth = Math.hypot(...v) / Math.hypot(...u);
      u = v.map((vi) => vi / Math.hypot(...v));
    }
    let x4 = u.map((ui) => 1e-12 * ui);
    for (let i = 0; i < 15; i++) x4 = standardMap(0.5)(x4);
    const perStep = (Math.hypot(...x4) / 1e-12) ** (1 / 15);
    const p4 = agree(agree(Math.log(perStep), Math.log(growth), 'p4 两种算法', 1e-6), Math.log((2.5 + Math.sqrt(2.25)) / 2), 'p4 指数');

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
