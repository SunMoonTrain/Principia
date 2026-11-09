// 独立验算 physics.analytical-mechanics.action-angle-variables 的 p1–p4（简单题、中等题）。
// 运动按正则方程（偏导数数值求）用 RK4 积分；作用量变量把 p q̇ 挂在状态上一起积分一个周期得到 ∮p dq；
// 周期直接从积分里定位（q 回到 0 的时刻）；频率、周期也由 I(E) 数值求导得到，两种算法互相核对；再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.action-angle-variables.ts

import { fileURLToPath } from 'node:url';
import type { Derivative } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import { agree, derivative, integrateTo, integrateUntil } from './physics.analytical-mechanics._mech.ts';
import { canonical, onePeriod, withIntegral, type Hamiltonian } from './physics.analytical-mechanics._hamilton.ts';

/** 一个自由度、能量为 E 的周期运动：从 q = 0、p = √(2m(E − V(0))) 出发积分一个周期，返回周期和 ∮p dq / 2π。 */
function orbit(H: Hamiltonian, m: number, E: number, step: number): { T: number; I: number } {
  const p0 = Math.sqrt(2 * m * (E - H([0], [0], 0)));
  const f = withIntegral(canonical(H), 1, (_q, p, _t, qd) => p[0] * qd[0]);
  const per = onePeriod(f, [0, p0, 0], 0, step, 1000);
  return { T: per.T, I: per.y[2] / (2 * Math.PI) };
}

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.action-angle-variables',
  notes: {
    p1: '能量取振幅处的 ½kA²，积分一个周期，同时积分 p q̇ 得到 ∮p dq，除以 2π；和 E/ω 核对。',
    p2: '对 H(I) = 3I^{4/3} 在 I = 8 处数值求导。',
    p3: 'V = F|q| 在 q = 0 处不光滑，分两段积分：q > 0 一段受力 −F、q < 0 一段受力 +F，各自定位回到 q = 0 的时刻，相加得周期；另外沿积分出的轨道算 I(E ± δ)，由 2π dI/dE 数值求导，两者核对；和 4√(2mE)/F 核对。',
    p4: '取 λ = m = 1，按正则方程分别积分 E = 1 和 E = 16 的一个周期，周期之比；另外由 I(E) 数值求导得到两个周期之比，两者核对；和 I ∝ E^{3/4} 推出的 16^{−1/4} 核对。',
  },
  compute() {
    // p1：m = 2、k = 8、A = 0.5
    const H1: Hamiltonian = (q, p) => p[0] ** 2 / 4 + 4 * q[0] ** 2;
    const o1 = orbit(H1, 2, 0.5 * 8 * 0.5 ** 2, 1e-3);
    const p1 = agree(o1.I, (0.5 * 8 * 0.25) / Math.sqrt(8 / 2), 'p1 I');

    // p2
    const p2 = agree(
      derivative((s) => 3 * (8 + s) ** (4 / 3), 0),
      4 * 8 ** (1 / 3),
      'p2 ω',
    );

    // p3：m = 1、F = 2、E = 2，分两段积分
    const F = 2;
    const side =
      (force: number): Derivative =>
      (_t, y, out) => {
        out[0] = y[1];
        out[1] = force;
        out[2] = y[1] * y[1]; // p q̇（m = 1）
      };
    const period3 = (E: number): { T: number; I: number } => {
      const right = integrateUntil(side(-F), [0, Math.sqrt(2 * E), 0], 0, 1e-3, 100, (_t, y) => y[0])!;
      // 左边一段先走 10 步再找变号：右边一段结束时的 q 只是舍入到 0 附近，符号不定
      const away = integrateTo(side(F), Array.from(right.y), right.t, right.t + 1e-2, 1e-3);
      const left = integrateUntil(side(F), Array.from(away), right.t + 1e-2, 1e-3, 100, (_t, y) => y[0])!;
      return { T: left.t, I: left.y[2] / (2 * Math.PI) };
    };
    const T3 = period3(2).T;
    const T3fromI = 2 * Math.PI * derivative((s) => period3(2 + s).I, 0);
    const p3 = agree(agree(T3, T3fromI, 'p3 两种算法'), (4 * Math.sqrt(2 * 1 * 2)) / F, 'p3 T');

    // p4：V = q⁴，E 从 1 变到 16
    const H4: Hamiltonian = (q, p) => p[0] ** 2 / 2 + q[0] ** 4;
    const ratio = orbit(H4, 1, 16, 1e-4).T / orbit(H4, 1, 1, 1e-4).T;
    const dIdE = (E: number): number => derivative((s) => orbit(H4, 1, E + s, 1e-4).I, 0, 1e-2);
    const ratioFromI = dIdE(16) / dIdE(1);
    const p4 = agree(agree(ratio, ratioFromI, 'p4 两种算法', 1e-5), 16 ** (-1 / 4), 'p4 周期之比');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
