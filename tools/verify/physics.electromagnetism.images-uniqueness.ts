// 独立验算 physics.electromagnetism.images-uniqueness 的 p1–p4（简单题、中等题）。
// 两套算法：一是镜像电荷的公式；二是把平面上的感应电荷分成一圈圈圆环、对它们给点电荷的力积分，对力沿路径积分求功，
// 以及把点电荷的电势在球面上按勒让德多项式展开、逐项加出接地导体球上感应电荷对点电荷的力（不用镜像）。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.images-uniqueness.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { EPS0, K8988, K_EXACT, agree, fieldAt, integrate } from './physics.electromagnetism._es.ts';

export const verification: Verification = {
  lesson: 'physics.electromagnetism.images-uniqueness',
  notes: {
    p1: '镜像：kq²/(2d)²；和把平面上的感应电荷 σ(s) = −qd/(2π(s² + d²)^{3/2}) 分成圆环、对每个圆环给 q 的力的 z 分量积分核对（k = 8.988×10⁹）。',
    p2: 'σ = −q/(2πd²)；和 ε₀ 乘以紧贴平面处 q 与镜像电荷 −q 的电场（逐点相加）的 z 分量核对，结果和 k 无关。',
    p3: '把 q 从 d 移到无穷远，外力做功 ∫_d^∞ kq²/(2z)² dz = kq²/(4d)；和对 z = d/t 换元后的数值积分核对。',
    p4: '镜像电荷 −qR/a 在 R²/a 处，F = kq·(qR/a)/(a − R²/a)²；和不用镜像的算法核对：q 的电势在球面上按勒让德多项式展开，接地后感应电荷在球外的电势是 −kqΣR^{2l+1}P_l/(a^{l+1}r^{l+1})，对 r 求导得 q 处的电场，逐项加到 l = 200。',
  },
  compute() {
    const q = 2.0e-9;
    const d = 0.01;

    // p1
    const ringForce = integrate(
      (u) => {
        const s = d * Math.sinh(u);
        const ds = d * Math.cosh(u);
        const sigma = (-q * d) / (2 * Math.PI * (s * s + d * d) ** 1.5);
        // 圆环 2πs ds 上的电荷对 q 的力的 z 分量（指向平面为负）
        return (K8988 * q * sigma * 2 * Math.PI * s * ds * d) / (s * s + d * d) ** 1.5;
      },
      0,
      40,
      400,
      16,
    );
    const p1 = agree(Math.abs(ringForce), (K8988 * q * q) / (2 * d) ** 2, 'p1', 1e-8);

    // p2
    const Ez = fieldAt(
      [
        { q, r: [0, 0, d] },
        { q: -q, r: [0, 0, -d] },
      ],
      [0, 0, 0],
      K_EXACT,
    )[2];
    const p2 = agree(EPS0 * Ez, -q / (2 * Math.PI * d * d), 'p2', 1e-12);

    // p3：z = d/t，dz = −d/t² dt
    const work = integrate((t) => ((K8988 * q * q) / (2 * (d / t)) ** 2) * (d / (t * t)), 0, 1, 64, 16);
    const p3 = agree(work, (K8988 * q * q) / (4 * d), 'p3', 1e-12);

    // p4
    const R = 0.1;
    const a = 0.3;
    const q4 = 1.0e-9;
    let series = 0;
    for (let l = 0; l <= 200; l++) series += ((l + 1) * R ** (2 * l + 1)) / a ** (2 * l + 3);
    const legendreForce = K8988 * q4 * q4 * series;
    const b = (R * R) / a;
    const image = (K8988 * q4 * ((q4 * R) / a)) / (a - b) ** 2;
    const p4 = agree(legendreForce, image, 'p4', 1e-12);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
