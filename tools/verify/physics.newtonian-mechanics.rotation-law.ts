// 独立验算 physics.newtonian-mechanics.rotation-law 的 p1–p4（简单题、中等题）。
// 两套算法：一是转动定律 τ = Iα 的公式；二是 p1 用 RK4 积分 dω/dt = τ/I，p3 把重物、绳子、圆盘三个方程（a、T、α 三个未知数）
// 用 solveLinear 联立，p4 把杆分成很多小段、数值求重力矩之和与转动惯量。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.rotation-law.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, rk4, solveLinear } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;
/** 力 (Fx, Fy) 作用在 (x, y) 处，对 z 轴的力矩。 */
const tauZ = (x: number, y: number, Fx: number, Fy: number) => x * Fy - y * Fx;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.rotation-law',
  notes: {
    p1: 'ω = (τ/I)t；和用 RK4 积分 dω/dt = τ/I 到 3.0 s 核对。',
    p2: '逐条用例子（门轴取为 z 轴，门面在 xz 平面里）：A 在 (0.8, 0) 处沿门面指向门轴的力 (−50, 0)，τ_z = 0（对）；B τ = 2 N·m，I = 0.5 和 2，α = 4 和 1（错）；C 光滑轴、外力矩为零时以 3 rad/s 和 30 rad/s 匀速转动都不需要力矩（错）；D τ_z 一直为零，积分 10 s 后 ω 不变（对）；E 同一点 (0.8, 0) 上 10 N 的力垂直于门面和与门面成 30°，τ_z = 8 和 4（对）。',
    p3: 'a = mg/(m + M/2)；和 solveLinear 联立 mg − T = ma、TR = Iα、a = Rα 核对。',
    p4: '端点的加速度 αL = (MgL/2)/(ML²/3)·L = 3g/2（刚放开时 ω = 0，没有向心加速度）；和把杆分成 200000 小段、数值求 Σm_i g x_i 与 Σm_i x_i² 核对。',
  },
  compute() {
    // p1（rad/s）
    const I1 = 0.5;
    const tau1 = 2.0;
    const omegaNum = rk4((_t, _s) => [tau1 / I1], [0], 0, 3.0, 300)[0];
    const p1 = agree(omegaNum, (tau1 / I1) * 3.0, 'p1 角速度', 1e-12);

    // p2
    const optA = Math.abs(tauZ(0.8, 0, -50, 0)) < 1e-12;
    const optB = 2 / 0.5 === 2 / 2;
    // C：外力矩为零时，3 rad/s 和 30 rad/s 都保持匀速转动，维持转动需要的力矩都是零，不随转速增大
    const keep = (w0: number) => rk4((_t, _s) => [0 / 0.5], [w0], 0, 5, 500)[0] - w0;
    const neededTorque = (w0: number) => 0.5 * (keep(w0) / 5); // I·α，α 由积分出的角速度变化定
    const optC = neededTorque(30) > neededTorque(3);
    const wD = rk4((_t, _s) => [0 / 1.3], [2.2], 0, 10, 1000)[0];
    const optD = Math.abs(wD - 2.2) < 1e-15;
    const tPerp = tauZ(0.8, 0, 0, 10);
    const t30 = tauZ(0.8, 0, 10 * Math.cos(Math.PI / 6), 10 * Math.sin(Math.PI / 6));
    const optE = Math.abs(tPerp - t30) > 1e-9;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m/s²）
    const M = 4.0;
    const R = 0.2;
    const m = 2.0;
    const Idisc = 0.5 * M * R * R;
    // 未知数 [a, T, α]：m a + T = m g；T R − I α = 0；a − R α = 0
    const [a3] = solveLinear(
      [
        [m, 1, 0],
        [0, R, -Idisc],
        [1, 0, -R],
      ],
      [m * g, 0, 0],
    );
    const p3 = agree(a3, (m * g) / (m + M / 2), 'p3 重物的加速度', 1e-12);

    // p4（m/s²）
    const L = 1.2;
    const Mrod = 1.0; // 质量约掉
    const N = 200000;
    const dx = L / N;
    let torque = 0;
    let I = 0;
    for (let i = 0; i < N; i++) {
      const x = (i + 0.5) * dx;
      const dm = (Mrod / L) * dx;
      torque += dm * g * x;
      I += dm * x * x;
    }
    const p4 = agree((torque / I) * L, 1.5 * g, 'p4 端点的加速度', 1e-9);

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
