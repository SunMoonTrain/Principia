// 独立验算 physics.oscillations-waves.driven-oscillations 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的稳态复振幅 (F0/m)/(ω0² − ω² + iγω)、Q = ω0/γ；二是不用这些式子，直接对运动方程做数值计算：
// 稳态用「打靶」求——积分一个驱动周期，周期解满足 y(T) = y(0)，一周期的映射是仿射的，解一个 2×2 方程组即得；
// 平均功率由稳态的振幅和相位算 ½F0ωA sin(−φ)，再二分出降到一半的两个角频率；衰减由积分自由振动、量极大值得到。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.driven-oscillations.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, maxima, oscillator, periodOf, rk4, solveLinear, steadyState, wrapAngle } from './physics.oscillations-waves._ow.ts';

/** 打靶求稳态：x ≈ A cos(ωt + φ)。 */
function shoot(m: number, b: number, k: number, F0: number, omega: number): { A: number; phi: number } {
  const T = (2 * Math.PI) / omega;
  const T0 = (2 * Math.PI) / Math.sqrt(k / m);
  const steps = Math.ceil(Math.max(4000, (4000 * T) / T0));
  const f = oscillator(m, b, k, (t) => F0 * Math.cos(omega * t));
  const c = rk4(f, [0, 0], 0, T, steps);
  const e1 = rk4(f, [1, 0], 0, T, steps);
  const e2 = rk4(f, [0, 1], 0, T, steps);
  // y(T) = Φ y(0) + c，Φ 的两列是 e1 − c、e2 − c；周期解 (I − Φ) y = c
  const [x0, v0] = solveLinear(
    [
      [1 - (e1[0] - c[0]), -(e2[0] - c[0])],
      [-(e1[1] - c[1]), 1 - (e2[1] - c[1])],
    ],
    c,
  );
  return { A: Math.hypot(x0, v0 / omega), phi: Math.atan2(-v0 / omega, x0) };
}

/** 平均功率 ½F0ωA sin(−φ)。 */
function power(m: number, b: number, k: number, F0: number, omega: number): number {
  const { A, phi } = shoot(m, b, k, F0, omega);
  return 0.5 * F0 * omega * A * Math.sin(-phi);
}

/** 平均功率降到 ω0 处一半的两个角频率之差。 */
function halfWidth(m: number, b: number, k: number): number {
  const w0 = Math.sqrt(k / m);
  const pmax = power(m, b, k, 1, w0);
  check(power(m, b, k, 1, w0 * 0.999) < pmax && power(m, b, k, 1, w0 * 1.001) < pmax, '平均功率在 ω0 处最大');
  const lo = bisect((w) => power(m, b, k, 1, w) - pmax / 2, w0 / 2, w0);
  const hi = bisect((w) => power(m, b, k, 1, w) - pmax / 2, w0, 2 * w0);
  return hi - lo;
}

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.driven-oscillations',
  notes: {
    p1: 'ω0 = 20 rad/s，γ = 0.8 s⁻¹，Q = 25；和数值求平均功率曲线（打靶求稳态），二分出半功率的两个角频率，ω0/Δω 核对。',
    p2: '在 m = 1、k = 1 的振子上打靶求稳态：A b = 0.2、ω = 0.01 时振幅和 F0/k 差 0.01% 量级、相位差 0.002（对）；B b 由 0.2 减到 0.1，半功率宽度减半（错）；C ω 由 20 加到 40，振幅之比 0.2502（对）；D b = 1、ω = 1.5 从静止积分 60 s 后量周期，正是驱动周期 2π/1.5（错）；E ω = ω0 时速度的相位 φ + π/2 = 0（对）。',
    p3: 'F0/m = 2，(ω0² − ω², γω) = (−225, 50)，A = 2/√53125 m；和 RK4 从静止积分到暂态衰减完、在 4 个周期上投影核对。',
    p4: '振幅 e^{−γt/2}，2.0 s 降为 1/e，γ = 1.0 s⁻¹，Q = 2π × 440/1.0；和取 b/m = 1 积分自由振动、由相隔 100 个周期的两个极大值之比量出 1/e 时间（2.0 s）核对。',
  },
  compute() {
    // p1
    const p1 = agree(Math.sqrt(200 / 0.5) / halfWidth(0.5, 0.4, 200), Math.sqrt(200 / 0.5) / (0.4 / 0.5), 'p1 品质因数', 1e-8);

    // p2
    const sA = shoot(1, 0.2, 1, 1, 0.01);
    const optA = Math.abs(sA.A - 1) < 1e-3 && Math.abs(sA.phi) < 0.01;
    const optB = halfWidth(1, 0.1, 1) > halfWidth(1, 0.2, 1);
    check(Math.abs(halfWidth(1, 0.1, 1) / halfWidth(1, 0.2, 1) - 0.5) < 1e-8, 'p2 B 半功率宽度正比于阻尼');
    const ratioC = shoot(1, 0.2, 1, 1, 40).A / shoot(1, 0.2, 1, 1, 20).A;
    const optC = Math.abs(ratioC - 0.25) < 0.01;
    const fD = oscillator(1, 1, 1, (t) => Math.cos(1.5 * t));
    const y60 = rk4(fD, [0, 0], 0, 60, 60000);
    const TD = periodOf(fD, y60, 0, 1e-4, 5, 60);
    check(Math.abs(TD - (2 * Math.PI) / 1.5) < 1e-8, 'p2 D 稳态的周期就是驱动周期');
    const optD = TD > (2 * Math.PI) / 1.5 + 1e-6 && TD < 2 * Math.PI - 1e-6;
    const sE = shoot(1, 0.2, 1, 1, 1);
    const optE = Math.abs(wrapAngle(sE.phi + Math.PI / 2)) < 1e-9;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（cm）
    const m3 = 0.1;
    const b3 = 0.2;
    const k3 = 40;
    const w3 = 25;
    const g3 = b3 / m3;
    const A3 = 0.2 / m3 / Math.hypot(k3 / m3 - w3 * w3, g3 * w3);
    check(Math.abs(shoot(m3, b3, k3, 0.2, w3).A - A3) < 1e-9 * A3, 'p3 打靶和式子一致');
    const p3 = agree(steadyState(m3, b3, k3, 0.2, w3).A * 100, A3 * 100, 'p3 稳态振幅', 1e-7);

    // p4
    const w0 = 2 * Math.PI * 440;
    const gam = 2 / 2.0;
    const Td = (2 * Math.PI) / Math.sqrt(w0 * w0 - (gam * gam) / 4);
    const mx = maxima(oscillator(1, gam, w0 * w0), [1, 0], 0, 1, Td / 1000, 101);
    const tau = -(mx[100].t - mx[0].t) / Math.log(mx[100].value / mx[0].value);
    check(Math.abs(tau - 2.0) < 1e-8, 'p4 b/m = 1 时振幅 2.0 s 降为 1/e');
    const p4 = agree(w0 / (2 / tau), w0 / gam, 'p4 品质因数', 1e-8);

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
