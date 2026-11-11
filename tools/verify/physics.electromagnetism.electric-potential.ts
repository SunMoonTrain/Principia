// 独立验算 physics.electromagnetism.electric-potential 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的公式（点电荷的电势、能量守恒、梯度的解析式）；
// 二是从远处沿一条路径对电场做数值线积分、用龙格-库塔法积分 α 粒子的运动、对电势做数值差分。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.electric-potential.ts

import { fileURLToPath } from 'node:url';
import { RK4, type Derivative } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import { E_CHARGE, HBARC_MEV_FM, ALPHA, K8988, K_EXACT, agree, check, chosen, dot, fieldAt, integrate, potentialAt, type Charge, type V3 } from './physics.electromagnetism._es.ts';

/**
 * 从离 target 为 W 的远处沿直线（单位方向 dir）走到 target：φ(target) = φ(远处) − ∫E·dl。
 * 按到 target 的距离 w 积分：w ∈ [0, 1] 直接积，w ∈ [1, W] 换成 w = e^v，远处走得快。
 */
function potentialByLineIntegral(charges: Charge[], target: V3, dir: V3, W: number, k: number): number {
  const at = (w: number): V3 => [target[0] + w * dir[0], target[1] + w * dir[1], target[2] + w * dir[2]];
  // 沿走向（w 从 W 减到 0）dl = dir dw，所以 ∫_远处^target E·dl = −∫_0^W E(w)·dir dw
  const near = integrate((w) => dot(fieldAt(charges, at(w), k), dir), 0, 1, 64, 16);
  const far = integrate((v) => dot(fieldAt(charges, at(Math.exp(v)), k), dir) * Math.exp(v), 0, Math.log(W), 256, 16);
  return potentialAt(charges, at(W), k) + (near + far);
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.electric-potential',
  notes: {
    p1: '从 (0, 10⁴ m) 沿直线走到 (0, 0.30 m)，对两个点电荷的电场做数值线积分 −∫E·dl（起点的电势用点电荷公式，量级只有 10⁻⁴ V）；和 k(q₁/r₁ + q₂/r₂) 核对。',
    p2: 'A：W = q(φ_A − φ_B) = (−2e)(0 − 100 V) = +200 eV；B：两种参考点下各算 2 m、3 m 处的电势，差相同；C：φ = 3x 时 E_x = −3 < 0（反例）；D：常数电势的数值梯度为零；E：点电荷外 r = 1 的球面是等势面而电场大小处处相同，可两个等量同号电荷的一个等势面上 E 不处处相等（反例）。',
    p3: '取 MeV、fm 为单位（ke² = αħc），用龙格-库塔法积分 α 粒子正对金核的运动（从 10⁵ fm 外出发，起点动能扣掉那里的势能），找速度变号的地方；和 k(2e)(79e)/K 核对。',
    p4: '对 φ = 3x²y − y³ 做中心差分求梯度；和解析的 (6xy, 3x² − 3y²) 核对。',
  },
  compute() {
    // p1
    const charges1: Charge[] = [
      { q: 3.0e-9, r: [0, 0, 0] },
      { q: -2.0e-9, r: [0.4, 0, 0] },
    ];
    const target: V3 = [0, 0.3, 0];
    const p1 = agree(potentialByLineIntegral(charges1, target, [0, 1, 0], 1e4, K8988), K8988 * (3.0e-9 / 0.3 - 2.0e-9 / 0.5), 'p1', 1e-9);

    // p2
    const A2 = Math.abs((-2 * E_CHARGE * (0 - 100)) / E_CHARGE - 200) < 1e-9;
    const phiRef = (r: number, ref: number) => K_EXACT * 1e-9 * (1 / r - 1 / ref);
    const d1 = phiRef(2, Infinity) - phiRef(3, Infinity);
    const d2 = phiRef(2, 1) - phiRef(3, 1);
    const B2 = Math.abs(d1 - d2) < 1e-12 && Math.abs(phiRef(2, 1) - phiRef(2, Infinity)) > 1;
    const h = 1e-5;
    const phiC = (x: number) => 3 * x;
    const C2 = -(phiC(1 + h) - phiC(1 - h)) / (2 * h) > 0;
    const phiD = () => 50;
    const D2 = Math.abs(-(phiD() - phiD()) / (2 * h)) === 0;
    // 两个等量同号点电荷：在过中点的等势面上取两点，比较电场大小
    const pair: Charge[] = [
      { q: 1e-9, r: [-1, 0, 0] },
      { q: 1e-9, r: [1, 0, 0] },
    ];
    const phi0 = potentialAt(pair, [0, 0.5, 0], K_EXACT);
    // 沿 x 轴找同一电势的点（x > 1 一侧）
    let lo = 1.0001;
    let hi = 100;
    for (let i = 0; i < 200; i++) {
      const m = (lo + hi) / 2;
      if (potentialAt(pair, [m, 0, 0], K_EXACT) > phi0) lo = m;
      else hi = m;
    }
    const xEq = (lo + hi) / 2;
    const Ea = Math.hypot(...fieldAt(pair, [0, 0.5, 0], K_EXACT));
    const Eb = Math.hypot(...fieldAt(pair, [xEq, 0, 0], K_EXACT));
    check(Math.abs(potentialAt(pair, [xEq, 0, 0], K_EXACT) - phi0) < 1e-9 * Math.abs(phi0), 'p2 E：两点在同一等势面上');
    const E2 = Math.abs(Ea - Eb) < 1e-9 * Ea;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3（MeV、fm、c = 1；质量取 α 粒子的 3727.38 MeV，结果和质量无关）
    const ke2 = ALPHA * HBARC_MEV_FM; // MeV fm
    const Kq = 2 * 79 * ke2;
    const mass = 3727.38;
    const x0 = 1e5;
    const K0 = 5.0 - Kq / x0;
    const f: Derivative = (_t, y, out) => {
      out[0] = y[1];
      out[1] = Kq / (y[0] * y[0]) / mass;
    };
    const rk = new RK4(2);
    const y = new Float64Array([x0, -Math.sqrt((2 * K0) / mass)]);
    const prev = new Float64Array(2);
    let dtLast = 0;
    for (let i = 0; i < 1e8; i++) {
      prev.set(y);
      // 每步走当前距离的 0.2%，但不超过动力学时间的 0.05 倍（速度接近零时靠后一个限制）
      dtLast = Math.min((0.002 * y[0]) / Math.abs(y[1]), 0.05 * Math.sqrt((y[0] ** 3 * mass) / Kq));
      rk.step(f, 0, y, dtLast);
      if (y[1] >= 0) break;
    }
    // 速度过零的那一步：从上一步的状态出发，对步长二分，找速度恰好为零的时刻，读那时的位置
    const trial = new Float64Array(2);
    const vAfter = (h: number): number => {
      trial.set(prev);
      rk.step(f, 0, trial, h);
      return trial[1];
    };
    let hLo = 0;
    let hHi = dtLast;
    for (let i = 0; i < 200; i++) {
      const hm = (hLo + hHi) / 2;
      if (vAfter(hm) < 0) hLo = hm;
      else hHi = hm;
    }
    vAfter((hLo + hHi) / 2);
    const rmin = trial[0] * 1e-15;
    const p3 = agree(rmin, (K_EXACT * (2 * E_CHARGE) * (79 * E_CHARGE)) / (5.0e6 * E_CHARGE), 'p3', 1e-6);

    // p4
    const phi4 = (x: number, yy: number) => 3 * x * x * yy - yy ** 3;
    const hh = 1e-4;
    const Ex = -(phi4(1 + hh, 2) - phi4(1 - hh, 2)) / (2 * hh);
    const Ey = -(phi4(1, 2 + hh) - phi4(1, 2 - hh)) / (2 * hh);
    const p4 = agree(Math.hypot(Ex, Ey), Math.hypot(6 * 1 * 2, 3 * 1 - 3 * 4), 'p4', 1e-7);

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
