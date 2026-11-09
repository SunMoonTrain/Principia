// 独立验算 physics.analytical-mechanics.rigid-body-kinematics 的 p1–p4（简单题、中等题）。
// 欧拉角给成时间的函数，R(t) = R_z(φ)R_x(θ)R_z(ψ) 直接乘出来；角速度由体坐标轴的速度数值地求
// （ω = ½ Σ e'_k × ė'_k，见 _rigid.ts），点的速度直接对 R(t)ρ 数值求导；再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.rigid-body-kinematics.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, derivative, dot, type Mat } from './physics.analytical-mechanics._mech.ts';
import {
  angularVelocity,
  column,
  det3,
  eulerMatrix,
  matMul,
  matVec,
  norm,
  transpose,
} from './physics.analytical-mechanics._rigid.ts';

/** 欧拉角从 (φ₀, θ₀, ψ₀) 出发、以给定的变化率匀速变化时的取向。 */
const motion =
  (start: [number, number, number], rates: [number, number, number]) =>
  (t: number): Mat =>
    eulerMatrix(start[0] + rates[0] * t, start[1] + rates[1] * t, start[2] + rates[2] * t);

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.rigid-body-kinematics',
  notes: {
    p1: 'θ = π/3、φ̇ = 2、θ̇ = 1、ψ̇ = 3，此刻的 φ、ψ 取 (0.7, 1.9)，另取 (2.3, 0.4)、(5, 4) 两组，R(t) 乘出来数值求角速度的大小，三组一样；和 |ω|² = φ̇² + θ̇² + ψ̇² + 2φ̇ψ̇cosθ 核对。',
    p2: '逐个验 RᵀR = I（各元素偏差小于 1e-12）和 det R = 1。',
    p3: 'φ = 1.5t、θ = π/3、ψ = 1.5t，在 t = 0、0.8、2.1 三个时刻数值求角速度，和 R 的第三列（3′ 轴）求夹角，三个时刻一样；和 cos α = (φ̇cosθ + ψ̇)/|ω| 核对。',
    p4: 'r(t) = R(t)·(0.5, 0, 0)，对时间数值求导得速度，此刻的 φ 取 0.4，另取 2.5（φ 不影响速率）；和由体分量 ω′₂ = −1、ω′₃ = 2 算出的 0.5·√(ω′₂² + ω′₃²) 核对。',
  },
  compute() {
    // p1
    const speeds1 = [
      [0.7, 1.9],
      [2.3, 0.4],
      [5, 4],
    ].map(([phi, psi]) => norm(angularVelocity(motion([phi, Math.PI / 3, psi], [2, 1, 3]), 0)));
    const p1 = agree(
      speeds1.reduce((a, b) => agree(a, b, 'p1 不同 φ、ψ')),
      Math.sqrt(4 + 1 + 9 + 2 * 2 * 3 * Math.cos(Math.PI / 3)),
      'p1 |ω|',
    );

    // p2
    const options: Mat[] = [
      [
        [0, -1, 0],
        [1, 0, 0],
        [0, 0, 1],
      ],
      [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, -1],
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      [
        [0, 0, 1],
        [1, 0, 0],
        [0, 1, 0],
      ],
    ];
    const isRotation = (R: Mat): boolean => {
      const RtR = matMul(transpose(R), R);
      const orthogonal = RtR.every((row, i) => row.every((x, j) => Math.abs(x - (i === j ? 1 : 0)) < 1e-12));
      return orthogonal && Math.abs(det3(R) - 1) < 1e-12;
    };
    const p2 = chosen(options.map(isRotation));

    // p3
    const precession = motion([0, Math.PI / 3, 0], [1.5, 0, 1.5]);
    const angles3 = [0, 0.8, 2.1].map((t) => {
      const w = angularVelocity(precession, t);
      return Math.acos(dot(w, column(precession(t), 2)) / norm(w));
    });
    const omega3 = Math.sqrt(1.5 ** 2 + 1.5 ** 2 + 2 * 1.5 * 1.5 * Math.cos(Math.PI / 3));
    const p3 = agree(
      angles3.reduce((a, b) => agree(a, b, 'p3 不同时刻')),
      Math.acos((1.5 * Math.cos(Math.PI / 3) + 1.5) / omega3),
      'p3 夹角',
    );

    // p4
    const speeds4 = [0.4, 2.5].map((phi) => {
      const R = motion([phi, Math.PI / 3, Math.PI / 2], [2, 1, 1]);
      const v = [0, 1, 2].map((i) => derivative((s) => matVec(R(s), [0.5, 0, 0])[i], 0));
      return norm(v);
    });
    const p4 = agree(agree(speeds4[0], speeds4[1], 'p4 不同 φ'), 0.5 * Math.sqrt(1 + 4), 'p4 速率');

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
