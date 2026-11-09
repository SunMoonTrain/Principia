// 独立验算 physics.analytical-mechanics.hamiltons-equations 的 p1–p4（简单题、中等题）。
// 勒让德变换数值地做：由 L 数值求 p = ∂L/∂q̇，反解出 q̇（二分或解线性方程），再算 H = Σ p q̇ − L；
// 拉格朗日量由各质点在惯性系里的直角坐标数值地算出，加速度按达朗贝尔原理解；再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.hamiltons-equations.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import {
  accelerations,
  agree,
  along,
  bisect,
  chosen,
  derivative,
  gradient,
  lagrangian,
  random,
  solve,
  type System,
  type Vec,
} from './physics.analytical-mechanics._mech.ts';

const g = 9.8;
const rnd = random(2041);

/** 广义动量 p_j = ∂L/∂q̇_j（数值求导）。 */
const momenta = (sys: System, q: Vec, qd: Vec, t: number): Vec => gradient((v) => lagrangian(sys, q, v, t), qd);

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.hamiltons-equations',
  notes: {
    p1: '由 L = ½·2ẋ² − 3x² 数值求 ∂L/∂ẋ，二分解出 p = 4 对应的 ẋ，再算 pẋ − L；和 p²/(2m) + V 核对。',
    p2: '在 20 个随机的 (q, q̇) 上数值求 ∂p/∂q̇ = ∂²L/∂q̇²：处处同号且不为零才能由 p 唯一解出 q̇（A 取 m = 1.3、V = q²）。B、D 的 ∂p/∂q̇ 处处为零。',
    p3: '摆球 (sinθ cosφ, sinθ sinφ, −cosθ)，按达朗贝尔原理求 θ̈；θ = π/3、θ̇ = 0 时二分出让 θ̈ = 0 的 φ̇，再数值求 p_φ = ∂L/∂φ̇；和 ṗ_θ = 0 手推的 p_φ² = m²gl³ sin⁴θ / cosθ 核对。',
    p4: '两个摆球的直角坐标写出 L，在 θ₁ = θ₂ = 0 处数值求 ∂²L/∂q̇∂q̇（质量矩阵），解 M q̇ = p，再验算 ∂L/∂q̇ 确实等于 (3, 1)；和手解 2θ̇₁ + θ̇₂ = 3、θ̇₁ + θ̇₂ = 1 核对。',
  },
  compute() {
    // p1：m = 2、V = 3x²，x = 1、p = 4
    const L1 = (x: number, xd: number): number => 0.5 * 2 * xd * xd - 3 * x * x;
    const pOf = (xd: number): number => derivative((s) => L1(1, xd + s), 0);
    const xd1 = bisect((v) => pOf(v) - 4, -100, 100);
    const p1 = agree(4 * xd1 - L1(1, xd1), 16 / (2 * 2) + 3, 'p1 H');

    // p2：∂²L/∂q̇² 在随机点上是否处处同号、不为零
    const Ls: ((q: number, qd: number) => number)[] = [
      (q, qd) => 0.5 * 1.3 * qd * qd - q * q,
      (q, qd) => q * qd - 0.5 * q * q,
      (q, qd) => 0.5 * qd * qd + q * qd,
      (q, qd) => qd * Math.cos(q),
    ];
    const invertible = (L: (q: number, qd: number) => number): boolean => {
      const curv = Array.from({ length: 20 }, () => {
        const q = 6 * rnd() - 3;
        const qd = 6 * rnd() - 3;
        return derivative((s) => derivative((u) => L(q, qd + s + u), 0), 0);
      });
      return curv.every((c) => c > 1e-6) || curv.every((c) => c < -1e-6);
    };
    const p2 = chosen(Ls.map(invertible));

    // p3：球面摆，m = l = 1，θ = π/3 处匀速圆周运动
    const sph: System = {
      masses: [1],
      positions: ([th, ph]) => [[Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), -Math.cos(th)]],
      potential: ([th]) => -g * Math.cos(th),
    };
    const th0 = Math.PI / 3;
    const thetaAcc = (phd: number): number => accelerations(sph, [th0, 0.4], [0, phd], 0)[0];
    const phd3 = bisect(thetaAcc, 0.1, 20);
    const pphi = momenta(sph, [th0, 0.4], [0, phd3], 0)[1];
    const p3 = agree(pphi, Math.sqrt((g * Math.sin(th0) ** 4) / Math.cos(th0)), 'p3 p_φ');

    // p4：双摆，l = m = 1，θ₁ = θ₂ = 0，p = (3, 1)
    const dbl: System = {
      masses: [1, 1],
      positions: ([a, b]) => {
        const r1 = [Math.sin(a), -Math.cos(a)];
        return [r1, [r1[0] + Math.sin(b), r1[1] - Math.cos(b)]];
      },
      potential: ([a, b]) => -g * Math.cos(a) - g * (Math.cos(a) + Math.cos(b)),
    };
    const q4 = [0, 0];
    const M = [0, 1].map((j) => [0, 1].map((k) => derivative((s) => momenta(dbl, q4, along([0, 0], k ? [0, 1] : [1, 0], s), 0)[j], 0)));
    const qd4 = solve(M, [3, 1])!;
    const back = momenta(dbl, q4, qd4, 0);
    if (Math.abs(back[0] - 3) > 1e-6 || Math.abs(back[1] - 1) > 1e-6) throw new Error('p4 反解出的速度给不回题给的动量');
    const p4 = agree(qd4[0], 2, 'p4 θ̇₁');

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
