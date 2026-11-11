// 独立验算 physics.special-relativity.four-force 的 p1–p4（简单题、中等题）。
// 运动不用双曲运动的解析解：用四阶龙格-库塔法直接积分 dp/dt = F（p = γ_u m u，由 p 反解 u），
// 需要固有时就同时积分 dτ = dt/γ_u；电场题积分到走过题给的距离为止。都和讲解里的公式核对。
// 单独运行：npx tsx tools/verify/physics.special-relativity.four-force.ts

import { fileURLToPath } from 'node:url';
import { RK4, type Derivative } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, dot4, type Four } from './physics.special-relativity._relativity.ts';

/** c = 1、m = 1 时由动量求速度。 */
const uOf = (p: number): number => p / Math.sqrt(1 + p * p);

/** 状态 [t, x, p, τ]，自变量取「力的作用时间」s，力 F 不变：dt/ds = 1，dx/ds = u，dp/ds = F，dτ/ds = 1/γ。 */
const motion =
  (F: number): Derivative =>
  (_s, y, out) => {
    const u = uOf(y[2]);
    out[0] = 1;
    out[1] = u;
    out[2] = F;
    out[3] = Math.sqrt(1 - u * u);
  };

/** 从静止出发积分到 stop(状态) 由负变正，最后一步按线性插值收尾；返回那一刻的状态。 */
function integrateUntil(F: number, stop: (y: Float64Array) => number, h = 1e-4, maxSteps = 5e7): Float64Array {
  const rk = new RK4(4);
  const y = new Float64Array([0, 0, 0, 0]);
  const prev = new Float64Array(4);
  for (let i = 0; i < maxSteps; i++) {
    prev.set(y);
    rk.step(motion(F), y[0], y, h);
    if (stop(y) >= 0) {
      const a = stop(prev);
      const b = stop(y);
      const w = a / (a - b);
      return prev.map((v, k) => v + w * (y[k] - v));
    }
  }
  throw new Error('积分没有到达终止条件');
}

export const verification: Verification = {
  lesson: 'physics.special-relativity.four-force',
  notes: {
    p1: '取 c = m = F = 1，用龙格-库塔法积分 dp/dt = F 到 t = 1（Ft = mc），由 p 求 u；和 γ_u u = c 解出的 1/√2 核对。',
    p2: 'A：积分到 Ft = 100mc，u 仍小于 c（反例）；B：几组 F、u 算 K = γ_u(F·u/c, F)、U = γ_u(c, u)，K·U = 0；C：u = 0.6c 时 du/dt = α/γ_u³ ≠ α（反例）；D：积分中数值求 dE/dt，和 F·u 一致；E：积分 dτ = dt/γ_u，快度 artanh(u/c) 和 ατ/c 一致。',
    p3: '取 c = α = 1 积分到 u = 0.9，读积分出的固有时，再换成年；和 (c/α)·artanh 0.9 核对。',
    p4: '取 c = 1、长度单位 m，力 eE = 1.5 MeV/m，用 MeV 作能量单位积分到 x = 2 m，由动量求 u；和动能 3 MeV 用 γ_u = 3.511/0.511 算出的 u 核对。',
  },
  compute() {
    // p1
    const s1 = integrateUntil(1, (y) => y[0] - 1);
    const p1 = agree(uOf(s1[2]), 1 / Math.SQRT2, 'p1', 1e-8);

    // p2
    const long = integrateUntil(1, (y) => y[0] - 100, 1e-2);
    const A2 = uOf(long[2]) >= 1;
    const forces: [Four, number[]][] = [
      [[0, 1, 0.5, -0.2], [0.3, -0.4, 0.1]],
      [[0, -2, 0, 3], [0.6, 0.2, -0.7]],
    ];
    const B2 = forces.every(([F, u]) => {
      const g = 1 / Math.sqrt(1 - (u[0] ** 2 + u[1] ** 2 + u[2] ** 2));
      const Fu = F[1] * u[0] + F[2] * u[1] + F[3] * u[2];
      const K: Four = [g * Fu, g * F[1], g * F[2], g * F[3]];
      const U: Four = [g, g * u[0], g * u[1], g * u[2]];
      return Math.abs(dot4(K, U)) < 1e-12;
    });
    const g6 = 1 / Math.sqrt(1 - 0.36);
    const C2 = Math.abs(1 / g6 ** 3 - 1) < 1e-9;
    const mid = integrateUntil(1, (y) => y[0] - 0.75);
    const eps = 1e-4;
    const after = integrateUntil(1, (y) => y[0] - 0.75 - eps);
    const before = integrateUntil(1, (y) => y[0] - 0.75 + eps);
    const energy = (y: Float64Array): number => Math.sqrt(1 + y[2] * y[2]);
    const D2 = Math.abs((energy(after) - energy(before)) / (2 * eps) - 1 * uOf(mid[2])) < 1e-6;
    const E2 = [0.5, 1, 2].every((T) => {
      const y = integrateUntil(1, (st) => st[0] - T);
      return Math.abs(Math.atanh(uOf(y[2])) - y[3]) < 1e-8;
    });
    check(A2 === false, 'p2 A 应为错');
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const c = 2.99792458e8;
    const year = 365.25 * 86400;
    const s3 = integrateUntil(1, (y) => uOf(y[2]) - 0.9);
    const p3 = agree((s3[3] * (c / 10)) / year, ((c / 10) * Math.atanh(0.9)) / year, 'p3', 1e-8);

    // p4（MeV、m；c = 1；力 1.5 MeV/m）
    const me = 0.511;
    const s4 = (() => {
      const rk = new RK4(2);
      const y = new Float64Array([0, 0]);
      const prev = new Float64Array(2);
      const f: Derivative = (_t, st, out) => {
        out[0] = st[1] / Math.hypot(st[1], me);
        out[1] = 1.5;
      };
      const h = 1e-5;
      for (let i = 0; i < 1e7; i++) {
        prev.set(y);
        rk.step(f, i * h, y, h);
        if (y[0] >= 2) {
          const w = (2 - prev[0]) / (y[0] - prev[0]);
          return prev[1] + w * (y[1] - prev[1]);
        }
      }
      throw new Error('p4 积分没走到 2 m');
    })();
    const g4 = (me + 3) / me;
    const p4 = agree(s4 / Math.hypot(s4, me), Math.sqrt(1 - 1 / (g4 * g4)), 'p4', 1e-8);

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
