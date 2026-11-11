// 独立验算 physics.electromagnetism.ac-circuits 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的复阻抗（容抗 1/(ωC)、共振 ω₀ = 1/√(LC)、|Z| 和相位、理想变压器）；
// 二是不用复阻抗：电容器的电流对电压数值求导；共振频率用黄金分割搜索 1/|Z| 的最大值；
// 串联 RLC 用龙格-库塔法积分到稳态，把电流投影到 cos、sin 上读振幅和相位；变压器按功率守恒算。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.ac-circuits.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, rk4 } from './physics.electromagnetism._es.ts';

export const verification: Verification = {
  lesson: 'physics.electromagnetism.ac-circuits',
  notes: {
    p1: '1/(2πfC)；和数值核对：电压 V₀ sin ωt，电流 C dV/dt 用中心差分在一个周期里取最大值，V₀/I₀。',
    p2: '1/(2π√(LC))；和用黄金分割搜索 1/|R + i(ωL − 1/(ωC))| 的最大值点核对（R 取 10 Ω，结果和 R 无关）。',
    p3: '|Z| = √(R² + (ωL − 1/(ωC))²)，相位 arctan((ωL − 1/(ωC))/R)；和龙格-库塔法积分 L dI/dt = ℰ(t) − RI − q/C 到 60 个衰减时间以后、把一个整周期里的 I(t) 投影到 cos ωt、sin ωt 上读振幅和落后的相位核对。',
    p4: 'N₂ = N₁V₂/V₁，I₁ = P/V₁；和 I₂ = P/V₂、I₁ = I₂N₂/N₁ 核对。',
  },
  compute() {
    // p1
    const C1 = 10e-6;
    const w1 = 2 * Math.PI * 50;
    const V0 = 1;
    let Imax = 0;
    const T1 = (2 * Math.PI) / w1;
    for (let k = 0; k < 20000; k++) {
      const t = (k / 20000) * T1;
      const dV = (V0 * Math.sin(w1 * (t + 1e-8)) - V0 * Math.sin(w1 * (t - 1e-8))) / 2e-8;
      Imax = Math.max(Imax, Math.abs(C1 * dV));
    }
    const p1 = agree(V0 / Imax, 1 / (w1 * C1), 'p1', 1e-6);

    // p2
    const L2 = 10e-3;
    const C2 = 1.0e-6;
    const fBest = argmax((f) => 1 / Math.hypot(10, 2 * Math.PI * f * L2 - 1 / (2 * Math.PI * f * C2)), 100, 1e4);
    const p2 = agree(fBest / 1e3, 1 / (2 * Math.PI * Math.sqrt(L2 * C2)) / 1e3, 'p2', 1e-6);

    // p3
    const R3 = 30;
    const L3 = 0.1;
    const C3 = 25e-6;
    const w3 = 1000;
    const E0 = 10;
    const rhs = (t: number, y: number[]) => [y[1], (E0 * Math.cos(w3 * t) - R3 * y[1] - y[0] / C3) / L3];
    const T3 = (2 * Math.PI) / w3;
    const tDecay = (2 * L3) / R3;
    const nPer = Math.ceil((60 * tDecay) / T3);
    const t0 = nPer * T3;
    const stepsPer = 4000;
    let y = rk4(rhs, [0, 0], 0, t0, nPer * stepsPer);
    let a = 0;
    let b = 0;
    const h = T3 / stepsPer;
    for (let k = 0; k < stepsPer; k++) {
      const t = t0 + k * h;
      // 梯形：在区间左端取值（周期函数，左端求和即梯形）
      a += y[1] * Math.cos(w3 * t) * h;
      b += y[1] * Math.sin(w3 * t) * h;
      y = rk4(rhs, y, t, t + h, 1);
    }
    a *= 2 / T3;
    b *= 2 / T3;
    // I = a cos ωt + b sin ωt = I₀ cos(ωt − δ)，δ 是电流落后于电动势的相位
    const I0 = Math.hypot(a, b);
    const lag = (Math.atan2(b, a) * 180) / Math.PI;
    const X = w3 * L3 - 1 / (w3 * C3);
    const amp3 = agree(I0, E0 / Math.hypot(R3, X), 'p3 振幅', 1e-7);
    const ph3 = agree(lag, (Math.atan2(X, R3) * 180) / Math.PI, 'p3 相位', 1e-7);

    // p4
    const V1 = 220;
    const V2 = 12;
    const N1 = 1100;
    const P = 24;
    const N2 = (N1 * V2) / V1;
    const I2 = P / V2;
    const I1 = agree((I2 * N2) / N1, P / V1, 'p4 原线圈电流', 1e-12);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: [amp3, ph3] },
      p4: { type: 'tuple', value: [N2, I1] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
