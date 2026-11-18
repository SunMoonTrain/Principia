// 独立验算 physics.oscillations-waves.wave-energy 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 P̄ = ½Zω²A²、透射功率占 (Z2/Z1)τ²、一个波长里的能量 = 平均能量密度 × λ；二是不用这些式子，
// 直接由定义算：能流 j = −T y_x y_t 在一个周期上数值求时间平均，能量密度 ½μy_t² + ½Ty_x² 在一个波长上数值积分，
// 或者把两根弦分成小段做数值模拟，脉冲射到连接处以后分别数两边的能量（pulseAtJunction）。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.wave-energy.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, impedance, integrate, pulseAtJunction, stringSim, timeAverage } from './physics.oscillations-waves._ow.ts';

/** 向右的简谐波 y = A cos(ωt − kx)，k = ω/v；数值偏导数。 */
function wave(T: number, mu: number, f: number, A: number) {
  const v = Math.sqrt(T / mu);
  const w = 2 * Math.PI * f;
  const k = w / v;
  const y = (x: number, t: number) => A * Math.cos(w * t - k * x);
  const h = 1e-7;
  const yx = (x: number, t: number) => (y(x + h, t) - y(x - h, t)) / (2 * h);
  const yt = (x: number, t: number) => (y(x, t + h) - y(x, t - h)) / (2 * h);
  const j = (x: number, t: number) => -T * yx(x, t) * yt(x, t);
  const u = (x: number, t: number) => 0.5 * mu * yt(x, t) ** 2 + 0.5 * T * yx(x, t) ** 2;
  return { v, w, k, y, yx, yt, j, u, lam: (2 * Math.PI) / k, period: 1 / f };
}

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.wave-energy',
  notes: {
    p1: 'P̄ = ½√(Tμ)ω²A²；和由定义 j = −T y_x y_t（数值偏导数）在一个周期上数值求时间平均核对。',
    p2: '在 T = 40、μ = 0.004、f = 50、A = 0.003 的行波上逐条：A 某一点的动能密度和势能密度时时相等，不是此消彼长（错）；B 振幅加倍，时间平均的能流变为 4 倍（错）；C 5 个点上 j = v·u（对）；D 数值模拟：脉冲射到固定端，末端节点的速度始终为零，那里的能流为零（对）；E 波峰处 y_t = y_x = 0，能量密度为零（错）。',
    p3: 'Z2/Z1 = 9，τ = 0.2，(Z2/Z1)τ² = 0.36；和数值模拟：μ2 = 81μ1，脉冲射到连接处以后数弦 2 上的能量占总能量的比例核对。',
    p4: '一个波长里的能量 = ½μω²A² × λ；和在一个波长上数值积分 ½μy_t² + ½Ty_x²（任取一个时刻）核对。',
  },
  compute() {
    // p1（W）
    const w1 = wave(40, 0.004, 50, 0.003);
    const p1 = agree(timeAverage((t) => w1.j(0.37, t), w1.period), 0.5 * impedance(40, 0.004) * w1.w ** 2 * 0.003 ** 2, 'p1 平均功率', 1e-6);

    // p2
    const pts = [0.1, 0.33, 0.8, 1.7, 2.6];
    const ke = (x: number, t: number) => 0.5 * 0.004 * w1.yt(x, t) ** 2;
    const pe = (x: number, t: number) => 0.5 * 40 * w1.yx(x, t) ** 2;
    const optA = !pts.every((t) => Math.abs(ke(0.5, t * 0.01) - pe(0.5, t * 0.01)) < 1e-6 * (ke(0.5, t * 0.01) + 1e-12));
    const w2 = wave(40, 0.004, 50, 0.006);
    const ratioB = timeAverage((t) => w2.j(0.37, t), w2.period) / timeAverage((t) => w1.j(0.37, t), w1.period);
    check(Math.abs(ratioB - 4) < 1e-6, 'p2 B 振幅加倍，平均功率变为 4 倍');
    const optB = Math.abs(ratioB - 2) < 1e-6;
    const optC = pts.every((x) => Math.abs(w1.j(x, 0.0123) - w1.v * w1.u(x, 0.0123)) < 1e-6 * Math.abs(w1.j(x, 0.0123)) + 1e-12);
    const f = (x: number) => Math.exp(-(((x - 0.5) / 0.05) ** 2));
    const simD = stringSim({ L: 1, n: 2000, T: 1, mu: () => 1, y0: f, v0: (x) => ((2 * (x - 0.5)) / 0.0025) * f(x), right: 'fixed' });
    let maxEndFlux = 0;
    const nD = simD.x.length - 1;
    for (let i = 0; simD.t < 0.9; i++) {
      simD.step(simD.dtMax);
      const yxEnd = (simD.y[nD] - simD.y[nD - 1]) / (1 / nD);
      maxEndFlux = Math.max(maxEndFlux, Math.abs(-1 * yxEnd * simD.v[nD]));
    }
    const optD = maxEndFlux === 0;
    // 波峰：y 取最大值的点
    const xCrest = (2 * Math.PI * 50 * 0.0123) / w1.k; // ωt − kx = 0
    const optE = w1.u(xCrest, 0.0123) > w1.u(xCrest + w1.lam / 4, 0.0123);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（%）
    const s3 = pulseAtJunction({ mu1: 1, mu2: 81, n: 12000, s: 0.06 });
    const z = 9;
    const tau = 2 / (1 + z);
    const p3 = agree((s3.eRight / (s3.eLeft + s3.eRight)) * 100, z * tau * tau * 100, 'p3 透射功率的百分比', 2e-3);

    // p4（mJ）
    const w4 = wave(50, 0.005, 200, 0.001);
    const E = integrate((x) => w4.u(x, 0.00071), 0, w4.lam, 64);
    const p4 = agree(E * 1000, 0.5 * 0.005 * w4.w ** 2 * 0.001 ** 2 * w4.lam * 1000, 'p4 一个波长里的能量', 1e-6);

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
