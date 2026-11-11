// 独立验算 physics.electromagnetism.capacitors 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的电容公式和 U = ½CΔφ²；二是直接从电场出发：大圆盘的库仑场积分出板间电场、电场能量密度对体积积分、
// 对充电过程 ∫(q/C)dq 数值积分、按电荷守恒解中间节点的电势。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.capacitors.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { EPS0, K_EXACT, agree, integrate } from './physics.electromagnetism._es.ts';

/** 半径 R、面电荷密度 σ 的均匀圆盘在轴上 z 处的电场：分成一圈圈细圆环，对圆环的轴线库仑场按半径积分。 */
function diskField(sigma: number, R: number, z: number): number {
  // 换元 s = z·sinh(u)，让 R 很大时也积得准
  const umax = Math.asinh(R / Math.abs(z));
  return integrate(
    (u) => {
      const s = Math.abs(z) * Math.sinh(u);
      const ds = Math.abs(z) * Math.cosh(u);
      return (K_EXACT * sigma * 2 * Math.PI * s * Math.abs(z)) / (z * z + s * s) ** 1.5 * ds;
    },
    0,
    umax,
    400,
    16,
  );
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.capacitors',
  notes: {
    p1: 'C = ε₀A/d；和另一种算法核对：两块极板换成半径 10⁶ m 的均匀带电圆盘（±Q/A），由圆环的库仑场积分出两板正中的电场，乘以 d 得 Δφ，C = Q/Δφ。',
    p2: 'U = ½CΔφ²；和对充电过程 ∫₀^Q (q/C) dq 数值积分核对。',
    p3: 'C = 4πε₀ab/(b − a)，U = ½CΔφ²；和电场能量 ∫(ε₀/2)E²·4πr²dr（a 到 b，E = Q/(4πε₀r²)，Q = CΔφ）数值积分核对。题面没给 ε₀，取 CODATA 2022 的值。',
    p4: 'C₁、C₂ 串联得 1.2 μF，Q = 1.2 μF × 10 V，Δφ₂ = Q/C₂；和按电荷守恒解中间节点的电势 C₁(10 − x) = C₂x 核对，U₂ = ½C₂x²。',
  },
  compute() {
    // p1
    const A = 0.1 * 0.1;
    const d = 1.0e-3;
    const Q = 1e-9;
    const sigma = Q / A;
    const Emid = diskField(sigma, 1e6, d / 2) + diskField(sigma, 1e6, d / 2); // 正板推、负板拉，同向
    const p1 = agree(Q / (Emid * d) / 1e-12, (EPS0 * A) / d / 1e-12, 'p1', 1e-6);

    // p2
    const C2 = 4.7e-6;
    const V2 = 12;
    const p2 = agree(integrate((q) => q / C2, 0, C2 * V2, 8, 8), 0.5 * C2 * V2 * V2, 'p2', 1e-12);

    // p3
    const a = 0.1;
    const b = 0.12;
    const V3 = 1000;
    const C3 = (4 * Math.PI * EPS0 * a * b) / (b - a);
    const Q3 = C3 * V3;
    const field = integrate((r) => (EPS0 / 2) * ((K_EXACT * Q3) / (r * r)) ** 2 * 4 * Math.PI * r * r, a, b, 64, 16);
    const p3 = agree(field, 0.5 * C3 * V3 * V3, 'p3', 1e-10);

    // p4
    const c1 = 2e-6;
    const c2 = 3e-6;
    const V = 10;
    const x = (c1 * V) / (c1 + c2); // C₁(V − x) = C₂x
    const series = (c1 * c2) / (c1 + c2);
    const p4 = agree(0.5 * c2 * x * x, 0.5 * c2 * ((series * V) / c2) ** 2, 'p4', 1e-12);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
