// 独立验算 physics.analytical-mechanics.hamiltons-principle 的 p1–p4（简单题、中等题）。
// 真实路径用打靶法求：按达朗贝尔原理数值积分，二分初速度让终点落在指定位置；作用量和运动一起积分（S' = L）。
// 作用量的变化用辛普森公式直接对变动后的路径积分，不用讲解里的二阶变分公式；再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.hamiltons-principle.ts

import { fileURLToPath } from 'node:url';
import { RK4 } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import {
  accelerations,
  agree,
  bisect,
  chosen,
  derivative,
  eulerLagrange,
  lagrangian,
  simpson,
  type System,
} from './physics.analytical-mechanics._mech.ts';

const g = 9.8;

/** 一维系统从 (0, x0) 到 (T, x1) 的真实路径：打靶（割线法）求初速度，同时积分作用量。返回 [初速度, 作用量]。 */
function trueAction(sys: System, x0: number, x1: number, T: number): [number, number] {
  const run = (v: number): [number, number] => {
    const steps = 1000;
    const h = T / steps;
    const rk = new RK4(3);
    const y = Float64Array.from([x0, v, 0]);
    for (let i = 0; i < steps; i++) {
      rk.step(
        (t, s, out) => {
          out[0] = s[1];
          out[1] = accelerations(sys, [s[0]], [s[1]], t)[0];
          out[2] = lagrangian(sys, [s[0]], [s[1]], t);
        },
        i * h,
        y,
        h,
      );
    }
    return [y[0], y[2]];
  };
  let [va, vb] = [0, 1];
  let [fa, fb] = [run(va)[0] - x1, run(vb)[0] - x1];
  for (let k = 0; k < 30 && Math.abs(fb) > 1e-12; k++) {
    [va, fa, vb] = [vb, fb, vb - (fb * (vb - va)) / (fb - fa)];
    fb = run(vb)[0] - x1;
  }
  if (Math.abs(fb) > 1e-9) throw new Error('打靶没有收敛');
  return [vb, run(vb)[1]];
}

/** 沿路径 x(t)（t ∈ [0, T]）的作用量，辛普森积分；速度用数值求导。 */
function actionAlong(sys: System, x: (t: number) => number, T: number): number {
  return simpson((t) => lagrangian(sys, [x(t)], [derivative(x, t)], t), 0, T, 1000);
}

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.hamiltons-principle',
  notes: {
    p1: '打靶求出 (0, 0) 到 (1.5 s, 3 m) 的真实运动（自由质点），同时积分作用量。',
    p2: 'A：竖直上抛的真实路径加上两端为零的变动，S(ε) 在 ε = 0 处导数为零；B：谐振子时间间隔超过 π/ω 时找到让 S 变小的变动；C：L 加上 dF/dt 后数值写出的方程和原来一样；D：终点也变动时 dS/dε ≠ 0，真实路径不再是驻点。',
    p3: '真实路径取 x ≡ 0（两端都在 0），直接积分 S[εη] − S[0]，对 T 二分找它变号的地方。',
    p4: '打靶求出 (0, 0) 到 (π/4 s, 1 m) 的真实运动，同时积分作用量。',
  },
  compute() {
    // p1：m = 2 的自由质点
    const free: System = { masses: [2], positions: ([x]) => [[x]] };
    const [, S1] = trueAction(free, 0, 3, 1.5);
    const p1 = agree(S1, 0.5 * 2 * 2 * 2 * 1.5, 'p1 作用量');

    // p2
    // A：竖直上抛（m = 1），t = 0 到 T = 2 的真实路径加上两端为零的变动
    const fall: System = { masses: [1], positions: ([y]) => [[y]], potential: ([y]) => g * y };
    const T = 2;
    const real = (t: number): number => (g / 2) * t * (T - t);
    const eta = (t: number): number => t * (T - t) * (1 + t);
    const firstVariation = derivative((e) => actionAlong(fall, (t) => real(t) + e * eta(t), T), 0);
    const optionA = Math.abs(firstVariation) < 1e-6;
    // B：谐振子 ω = 1、T = 4 > π，两端都在 0 的真实路径 x ≡ 0，变动 sin(πt/T)
    const osc: System = { masses: [1], positions: ([x]) => [[x]], potential: ([x]) => 0.5 * x * x };
    const optionB = !(actionAlong(osc, (t) => 0.1 * Math.sin((Math.PI * t) / 4), 4) < actionAlong(osc, () => 0, 4));
    // C：L' = L + d/dt F(q, t)，F = q² t + sin q
    const L = (q: number[], qd: number[], t: number): number => lagrangian(fall, q, qd, t);
    const Lp = (q: number[], qd: number[], t: number): number =>
      L(q, qd, t) + (2 * q[0] * t + Math.cos(q[0])) * qd[0] + q[0] * q[0];
    const optionC = [
      [0.3, 1.2, 0.5],
      [-1.1, -0.4, 2.1],
    ].every(([q, qd, t]) => Math.abs(eulerLagrange(L, [q], [qd], t)[0] - eulerLagrange(Lp, [q], [qd], t)[0]) < 1e-6);
    // D：终点跟着变动（y + ε t/T），dS/dε 不为零
    const endVariation = derivative((e) => actionAlong(fall, (t) => real(t) + (e * t) / T, T), 0);
    const optionD = Math.abs(endVariation) < 1e-6;
    const p2 = chosen([optionA, optionB, optionC, optionD]);

    // p3：ω = 2，η = sin(2πt/T)，ε = 0.1；S[εη] − S[0] 在哪个 T 变号
    const osc2: System = { masses: [1], positions: ([x]) => [[x]], potential: ([x]) => 0.5 * 4 * x * x };
    const change = (TT: number): number => actionAlong(osc2, (t) => 0.1 * Math.sin((2 * Math.PI * t) / TT), TT);
    const p3 = agree(bisect(change, 1, 6), (2 * Math.PI) / 2, 'p3 临界的 T');

    // p4：m = 1、ω = 1，从 (0, 0) 到 (π/4, 1)
    const osc1: System = { masses: [1], positions: ([x]) => [[x]], potential: ([x]) => 0.5 * x * x };
    const [, S4] = trueAction(osc1, 0, 1, Math.PI / 4);
    const p4 = agree(S4, 0.5 / Math.tan(Math.PI / 4), 'p4 作用量');

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
