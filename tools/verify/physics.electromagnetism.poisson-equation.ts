// 独立验算 physics.electromagnetism.poisson-equation 的 p1–p4（简单题、中等题）。
// 两套算法：一是解析地求拉普拉斯算子、解泊松方程；二是中心差分求拉普拉斯算子、用有限差分解一维泊松方程、用高斯定律由电场求包住的电荷。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.poisson-equation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { EPS0, K_EXACT, agree, check, chosen, integrate, laplacian, type V3 } from './physics.electromagnetism._es.ts';

/** 在 [0, d] 上解 φ'' = −ρ₀/ε₀、φ(0) = φ(d) = 0：N 个内点的三对角方程（追赶法），返回 x = 0 处的 φ'（单侧二阶差分）。 */
function slopeAtZero(rho0: number, d: number, N: number): number {
  const h = d / (N + 1);
  const rhs = new Array(N).fill((-rho0 / EPS0) * h * h);
  // 系数：φ_{i−1} − 2φ_i + φ_{i+1} = rhs_i
  const c = new Array(N).fill(0);
  const dd = new Array(N).fill(0);
  c[0] = 1 / -2;
  dd[0] = rhs[0] / -2;
  for (let i = 1; i < N; i++) {
    const m = -2 - c[i - 1];
    c[i] = 1 / m;
    dd[i] = (rhs[i] - dd[i - 1]) / m;
  }
  const phi = new Array(N).fill(0);
  phi[N - 1] = dd[N - 1];
  for (let i = N - 2; i >= 0; i--) phi[i] = dd[i] - c[i] * phi[i + 1];
  // φ(0) = 0；单侧差分 φ'(0) ≈ (−3φ₀ + 4φ₁ − φ₂)/(2h)
  return (-3 * 0 + 4 * phi[0] - phi[1]) / (2 * h);
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.poisson-equation',
  notes: {
    p1: '解析地 ∇²φ = k(2 + 4 − 2)，ρ = −ε₀∇²φ；和在 (0.4, −1.2, 0.7) 处用中心差分求 ∇²φ 核对。',
    p2: '在 (0.3, 0.7, −0.5)、(1.1, −0.4, 0.9) 两点用中心差分求拉普拉斯算子：A、C、D 为零（对）；B 是 6（反例）；E 是 2/r⁴（反例）。',
    p3: '解析解 φ = ρ₀x(d − x)/(2ε₀)，x = 0 处 E_x = −ρ₀d/(2ε₀)，板面朝向电荷一侧 σ = ε₀E_x；和用有限差分（4000 个内点、追赶法）解一维泊松方程、由 x = 0 处的斜率求 σ 核对。',
    p4: '由泊松方程得电荷密度 ρ = −ε₀φ/λ²，加上中心的 q，积到 r = λ：1 − (1 − 2/e) = 2/e；和用高斯定律由 r = λ 处的电场（中心差分求 −dφ/dr）求包住的总电荷核对。',
  },
  compute() {
    // p1
    const k1 = 30;
    const phi1 = ([x, y, z]: V3) => k1 * (x * x + 2 * y * y - z * z);
    const p1 = agree(-EPS0 * laplacian(phi1, [0.4, -1.2, 0.7], 1e-3), -EPS0 * k1 * 4, 'p1', 1e-6);

    // p2
    const r = ([x, y, z]: V3) => Math.hypot(x, y, z);
    const fs = [
      ([x, y, z]: V3) => x * x + y * y - 2 * z * z,
      ([x, y, z]: V3) => x * x + y * y + z * z,
      ([x, y]: V3) => Math.exp(x) * Math.sin(y),
      ([x, y]: V3) => Math.log(x * x + y * y),
      (p: V3) => 1 / r(p) ** 2,
    ];
    const pts: V3[] = [
      [0.3, 0.7, -0.5],
      [1.1, -0.4, 0.9],
    ];
    const harmonic = fs.map((f) => pts.every((p) => Math.abs(laplacian(f, p, 1e-3)) < 1e-4));
    check(Math.abs(laplacian(fs[4], pts[1], 1e-3) - 2 / r(pts[1]) ** 4) < 1e-4, 'p2 E：∇²(1/r²) = 2/r⁴');
    const p2 = chosen(harmonic);

    // p3
    const rho0 = 1.0e-6;
    const d = 0.02;
    const sigmaFD = EPS0 * -slopeAtZero(rho0, d, 4000); // E_x = −φ'
    const p3 = agree(sigmaFD, -(rho0 * d) / 2, 'p3', 1e-6);

    // p4（q、λ 取 1）
    const lam = 1;
    const phi4 = (rr: number) => (K_EXACT * Math.exp(-rr / lam)) / rr;
    const h = 1e-5;
    const Er = -(phi4(lam + h) - phi4(lam - h)) / (2 * h);
    const gauss = 4 * Math.PI * EPS0 * lam * lam * Er;
    const cloud = integrate((rr) => ((-EPS0 * phi4(rr)) / lam ** 2) * 4 * Math.PI * rr * rr, 0, lam, 64, 16);
    const p4 = agree(gauss, 1 + cloud, 'p4', 1e-8);
    check(Math.abs(p4 - 2 / Math.E) < 1e-9, 'p4：等于 2/e');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
