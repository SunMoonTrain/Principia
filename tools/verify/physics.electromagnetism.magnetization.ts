// 独立验算 physics.electromagnetism.magnetization 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（M = 单位体积的磁矩、束缚电流 J_b = ∇ × M、K_b = M × n、均匀磁化圆柱等于螺线管）；
// 二是不用束缚电流：「磁荷」模型，端面上有面磁荷 σ_m = M·n，H 由磁荷按库仑定律的形式数值积分，再用 B = μ₀(H + M)；
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.magnetization.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { type V3, MU0, agree, check, chosen, integrate2 } from './physics.electromagnetism._es.ts';

/** 圆面（圆心在轴上 z0、半径 R）上面磁荷密度 σ(s)，在轴外点 (s0, 0, z) 产生的 H 的 z 分量：H = (1/4π)∫σ (r − r′)/|r − r′|³ dA。 */
function diskPoleHz(sigma: (s: number) => number, R: number, z0: number, p: V3): number {
  return integrate2(
    (s, ph) => {
      const dx = p[0] - s * Math.cos(ph);
      const dy = p[1] - s * Math.sin(ph);
      const dz = p[2] - z0;
      const r3 = Math.hypot(dx, dy, dz) ** 3;
      return (sigma(s) * dz * s) / r3;
    },
    0,
    R,
    0,
    2 * Math.PI,
    32,
    16,
  ) / (4 * Math.PI);
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.magnetization',
  notes: {
    p1: 'M = n·0.60μ_B；和取 1 mm³ 的镍、原子数 N = nV、总磁矩 N·0.60μ_B 除以体积核对。',
    p2: '逐条用例子：A 板面法线 n ∥ M，K_b = M × n = 0（对）；B 居里定律 M ∝ 1/T，温度加倍 M 减半（错）；C 居里温度以上铁磁性消失，无磁场里冷却后磁畴取向杂乱（对，按讲解）；D J_b = ∇ × (kx ẑ)，中心差分得 (0, −k, 0)（对）；E 抗磁性是所有物质都有的响应，有原子磁矩的物质里被顺磁性盖过（错）。',
    p3: '等效螺线管 K = M，中心 B = μ₀M·(L/2)/√((L/2)² + R²)；和磁荷模型核对：两个端面各有 σ_m = ±M，数值积分出中心的 H，B = μ₀(H + M)。',
    p4: '束缚电流 J_b = −k ψ̂、K_b = kR ψ̂，离轴 s 处 B = μ₀ks；和磁荷模型核对：侧面 M·n = 0、体内 ∇·M = 0，只有远处两个端面（取 ±10⁴ R）有 σ_m = ±ks，数值积分出 H ≈ 0，B = μ₀(H + M)。',
  },
  compute() {
    // p1
    const n = 9.14e28;
    const muB = 9.274e-24;
    const V = 1e-9;
    const Mtot = n * V * 0.6 * muB;
    const p1 = agree(Mtot / V / 1e5, (n * 0.6 * muB) / 1e5, 'p1', 1e-12);

    // p2
    const A = true; // K_b = M × n，n ∥ M 时为零
    const T1 = 300;
    const T2 = 600;
    const curie = (T: number) => 1 / T;
    const B = Math.abs(curie(T2) / curie(T1) - 2) < 1e-12;
    check(Math.abs(curie(T2) / curie(T1) - 0.5) < 1e-12, 'p2 B：居里定律下减半');
    const C = true;
    const k = 1.7;
    const Mf = ([x]: V3): V3 => [0, 0, k * x];
    const h = 1e-4;
    const p0: V3 = [0.3, -0.2, 0.5];
    const d = (i: number, j: number) => {
      const a: V3 = [...p0];
      const b: V3 = [...p0];
      a[j] += h;
      b[j] -= h;
      return (Mf(a)[i] - Mf(b)[i]) / (2 * h);
    };
    const Jb: V3 = [d(2, 1) - d(1, 2), d(0, 2) - d(2, 0), d(1, 0) - d(0, 1)];
    const D = Math.abs(Jb[0]) < 1e-9 && Jb[1] < 0 && Math.abs(Jb[1] + k) < 1e-9 && Math.abs(Jb[2]) < 1e-9;
    const E = false;
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const R3 = 0.01;
    const L3 = 0.02;
    const M3 = 8.0e5;
    const Hz = diskPoleHz(() => M3, R3, L3 / 2, [0, 0, 0]) + diskPoleHz(() => -M3, R3, -L3 / 2, [0, 0, 0]);
    const p3 = agree(MU0 * (Hz + M3), MU0 * M3 * (L3 / 2 / Math.hypot(L3 / 2, R3)), 'p3', 1e-8);

    // p4
    const k4 = 3.0e7;
    const R4 = 0.02;
    const s4 = 0.01;
    const Lam = 1e4 * R4;
    const Hz4 = diskPoleHz((s) => k4 * s, R4, Lam, [s4, 0, 0]) + diskPoleHz((s) => -k4 * s, R4, -Lam, [s4, 0, 0]);
    check(Math.abs(Hz4) < 1e-6 * k4 * s4, 'p4：远端磁荷在中段产生的 H 可以忽略');
    const p4 = agree(MU0 * (Hz4 + k4 * s4), MU0 * k4 * s4, 'p4', 1e-6);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
