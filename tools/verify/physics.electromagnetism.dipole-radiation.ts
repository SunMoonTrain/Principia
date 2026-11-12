// 独立验算 physics.electromagnetism.dipole-radiation 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（平均辐射功率 μ₀p₀²ω⁴/(12πc)，辐射区电场振幅 μ₀p₀ω² sinθ/(4πr)，短天线 p₀ = I₀L/ω）；
// 二是不用这些式子：由点偶极子的推迟势 A = μ₀ṗ(t − r/c)/(4πr) ẑ、φ = cosθ/(4πε₀)·[p(t_r)/r² + ṗ(t_r)/(cr)]
// 数值求导得 E = −∇φ − ∂A/∂t、B = ∇ × A（不做 r ≫ λ 的近似），坡印亭矢量对一个周期取平均，再在球面上积分。
// 天线的 p₀ 由电流对时间积分出两端积累的电荷得到。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.dipole-radiation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, cross, dot, integrate, norm, type V3 } from './physics.electromagnetism._es.ts';

const MU0_GIVEN = 4 * Math.PI * 1e-7;
const C_GIVEN = 3.0e8;
const EPS0_GIVEN = 1 / (MU0_GIVEN * C_GIVEN * C_GIVEN);

/** 振荡点偶极子 p(t) = p₀cos ωt ẑ 的场（由推迟势数值求导）。 */
function dipole(p0: number, w: number) {
  const p = (t: number) => p0 * Math.cos(w * t);
  const pd = (t: number) => -p0 * w * Math.sin(w * t);
  const phi = (x: V3, t: number) => {
    const r = norm(x);
    const tr = t - r / C_GIVEN;
    return ((x[2] / r) * (p(tr) / (r * r) + pd(tr) / (C_GIVEN * r))) / (4 * Math.PI * EPS0_GIVEN);
  };
  const Az = (x: V3, t: number) => {
    const r = norm(x);
    return (MU0_GIVEN / (4 * Math.PI * r)) * pd(t - r / C_GIVEN);
  };
  const lam = (2 * Math.PI * C_GIVEN) / w;
  const h = lam * 1e-4;
  const ht = (2 * Math.PI) / w / 1e4;
  const sh = (x: V3, i: number, d: number): V3 => {
    const y: V3 = [x[0], x[1], x[2]];
    y[i] += d;
    return y;
  };
  const E = (x: V3, t: number): V3 => {
    const g = [0, 1, 2].map((i) => (phi(sh(x, i, h), t) - phi(sh(x, i, -h), t)) / (2 * h));
    const dAz = (Az(x, t + ht) - Az(x, t - ht)) / (2 * ht);
    return [-g[0], -g[1], -g[2] - dAz];
  };
  const B = (x: V3, t: number): V3 => {
    const dAzdx = (Az(sh(x, 0, h), t) - Az(sh(x, 0, -h), t)) / (2 * h);
    const dAzdy = (Az(sh(x, 1, h), t) - Az(sh(x, 1, -h), t)) / (2 * h);
    return [dAzdy, -dAzdx, 0];
  };
  /** (r, θ) 处（xz 平面里）坡印亭矢量径向分量对一个周期的平均。 */
  const meanSr = (r: number, th: number) => {
    const x: V3 = [r * Math.sin(th), 0, r * Math.cos(th)];
    const n: V3 = [Math.sin(th), 0, Math.cos(th)];
    const T = (2 * Math.PI) / w;
    let s = 0;
    const N = 8;
    for (let i = 0; i < N; i++) {
      const t = (i / N) * T;
      s += dot(cross(E(x, t), B(x, t)), n) / MU0_GIVEN;
    }
    return s / N;
  };
  /** 平均辐射功率：半径 r 的球面上积分。 */
  const power = (r: number) => integrate((th) => meanSr(r, th) * 2 * Math.PI * r * r * Math.sin(th), 0, Math.PI, 8, 16);
  /** 场点处 E_z 的振幅：相差四分之一周期的两个时刻合成。 */
  const ampEz = (x: V3) => {
    const T = (2 * Math.PI) / w;
    return Math.hypot(E(x, 0)[2], E(x, T / 4)[2]);
  };
  return { E, B, meanSr, power, ampEz, lam };
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.dipole-radiation',
  notes: {
    p1: '(300/100)⁴ = 81；和数值核对：p₀ 相同，两种频率下由推迟势求出完整的 E、B（不做 r ≫ λ 的近似），平均坡印亭矢量在半径 5λ 的球面上积分，相除。',
    p2: '逐条用例子：A 轴线上（θ = 0）平均能流为零（对）；B θ = 90° 处 100λ 和 200λ 的电场振幅之比是 2（对）；C 100λ、θ = 60° 处 E·B ≈ 0，E_θ 和 B_φ 随时间同号同步（对）；D 频率变成 3 倍，功率变成 81 倍而不是 9 倍（错）；E kr = 0.01 处电场振幅是辐射场 μ₀p₀ω²/(4πr) 的约 10⁶ 倍（错）。',
    p3: 'I₀ = √(12πcP/(μ₀L²ω²))；和数值核对：电流 I₀cos ωt 对四分之一周期积分得两端电荷的振幅 I₀/ω，p₀ = I₀L/ω；I₀ = 1 A 时用球面积分求功率，再按 P ∝ I₀² 求要的电流。',
    p4: 'E = μ₀I₀Lω/(4πr)；和数值核对：p₀ = I₀L/ω，由推迟势求 r = 10 km、θ = 90° 处的完整电场，用相差四分之一周期的两个时刻合成振幅。',
  },
  compute() {
    // p1
    const w100 = 2 * Math.PI * 100e6;
    const w300 = 2 * Math.PI * 300e6;
    const d100 = dipole(1e-12, w100);
    const d300 = dipole(1e-12, w300);
    const P100 = d100.power(5 * d100.lam);
    const P300 = d300.power(5 * d300.lam);
    const p1 = agree(P300 / P100, 81, 'p1', 1e-5);

    // p2
    const dd = dipole(1e-12, w100);
    const lam = dd.lam;
    const A = Math.abs(dd.meanSr(10 * lam, 0)) < 1e-9 * dd.meanSr(10 * lam, Math.PI / 2);
    const B = Math.abs(dd.ampEz([100 * lam, 0, 0]) / dd.ampEz([200 * lam, 0, 0]) - 2) < 1e-4;
    const xC: V3 = [100 * lam * Math.sin(Math.PI / 3), 0, 100 * lam * Math.cos(Math.PI / 3)];
    const T = (2 * Math.PI) / w100;
    let perp = 0;
    let corr = 0;
    let nE = 0;
    let nB = 0;
    for (let i = 0; i < 16; i++) {
      const t = (i / 16) * T;
      const e = dd.E(xC, t);
      const b = dd.B(xC, t);
      perp = Math.max(perp, Math.abs(dot(e, b)) / (norm(e) * norm(b) + 1e-300));
      const eTheta = e[0] * Math.cos(Math.PI / 3) - e[2] * Math.sin(Math.PI / 3);
      const bPhi = b[1];
      corr += eTheta * bPhi;
      nE += eTheta * eTheta;
      nB += bPhi * bPhi;
    }
    const C = perp < 1e-3 && corr / Math.sqrt(nE * nB) > 0.9999;
    const D = Math.abs(P300 / P100 - 9) < 1e-6;
    const kNear = 0.01;
    const rNear = (kNear * lam) / (2 * Math.PI);
    const radOnly = (MU0_GIVEN * 1e-12 * w100 * w100) / (4 * Math.PI * rNear);
    const E = dd.ampEz([rNear, 0, 0]) / radOnly < 10;
    check(A && B && C && !D && !E, 'p2');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const L = 1.0;
    const w3 = 2 * Math.PI * 30e6;
    const q0 = integrate((t) => Math.cos(w3 * t), 0, Math.PI / (2 * w3), 4, 16); // I₀ = 1 A 时一端积累的电荷振幅
    const d3 = dipole(q0 * L, w3);
    const P1A = d3.power(5 * d3.lam);
    const I3 = Math.sqrt(1000 / P1A);
    const p3 = agree(I3, Math.sqrt((1000 * 12 * Math.PI * C_GIVEN) / (MU0_GIVEN * L * L * w3 * w3)), 'p3', 1e-5);

    // p4
    const I4 = 10;
    const d4 = dipole((I4 * L) / w3, w3);
    const E4 = d4.ampEz([1e4, 0, 0]);
    const p4 = agree(E4 * 1e3, ((MU0_GIVEN * I4 * L * w3) / (4 * Math.PI * 1e4)) * 1e3, 'p4', 1e-6);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
