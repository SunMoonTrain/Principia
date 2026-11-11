// 独立验算 physics.electromagnetism.ampere-law 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里用安培环路定理得到的式子（螺线管 μ₀nI、螺绕环 μ₀NI/(2πs)、圆柱里 μ₀I_enc/(2πs)）；
// 二是不用安培环路定理，直接叠加：
//   - 螺线管：把一段 ±10⁶ 倍半径长的螺线管看成许多圆线圈，每个线圈在轴上的磁场用毕奥-萨伐尔定律数值积分，再沿轴积分；
//   - 螺绕环：500 个分立的圆线圈绕成一圈（截面半径 2 cm），逐个用毕奥-萨伐尔定律数值积分再相加；
//   - 圆柱、同轴电缆：横截面上每一小块电流都是一根长直导线，磁场 μ₀ dI/(2π) · ẑ × (P − r′)/|P − r′|²，
//     以场点为中心按方向积分（沿方向 u 的射线在载流区域里的长度 L(u)，B = −(μ₀J/2π)∫L(u) ẑ × u du）。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.ampere-law.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { type V3, MU0, add, agree, curveB, integrate, norm, ringB, scale } from './physics.electromagnetism._es.ts';

/**
 * 圆心在原点、半径 R 的圆面上均匀分布、沿 +z 的电流（面密度 J）在平面上 P 处的磁场 (Bx, By)：
 * B = −(μ₀J/2π)∫ L(α) ẑ × u(α) dα，ẑ × u = (−sinα, cosα)。P 在圆外时只在切线夹住的角度里有贡献，用 α = αc + Δ sin φ 换元去掉端点的根号。
 */
function diskB(R: number, J: number, P: [number, number]): [number, number] {
  const r = Math.hypot(P[0], P[1]);
  const L = (al: number) => {
    const ux = Math.cos(al);
    const uy = Math.sin(al);
    const pu = P[0] * ux + P[1] * uy;
    const disc = pu * pu - r * r + R * R;
    if (disc <= 0) return 0;
    const hi = -pu + Math.sqrt(disc);
    const lo = -pu - Math.sqrt(disc);
    return Math.max(0, hi) - Math.max(0, lo);
  };
  const k = (-MU0 * J) / (2 * Math.PI);
  if (r < R) {
    const bx = integrate((al) => L(al) * -Math.sin(al), 0, 2 * Math.PI, 256, 16);
    const by = integrate((al) => L(al) * Math.cos(al), 0, 2 * Math.PI, 256, 16);
    return [k * bx, k * by];
  }
  const ac = Math.atan2(-P[1], -P[0]);
  const D = Math.asin(R / r);
  const al = (ph: number) => ac + D * Math.sin(ph);
  const w = (ph: number) => D * Math.cos(ph);
  const bx = integrate((ph) => L(al(ph)) * -Math.sin(al(ph)) * w(ph), -Math.PI / 2, Math.PI / 2, 256, 16);
  const by = integrate((ph) => L(al(ph)) * Math.cos(al(ph)) * w(ph), -Math.PI / 2, Math.PI / 2, 256, 16);
  return [k * bx, k * by];
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.ampere-law',
  notes: {
    p1: 'μ₀nI；和叠加核对：半径 1 cm、长 ±10⁶ 倍半径的螺线管，每个圆线圈在轴上中点的磁场由毕奥-萨伐尔定律数值积分得出，再沿轴（z = R sinh u 换元）乘 n dz 积分。',
    p2: 'μ₀NI/(2πs)；和叠加核对：500 个半径 2 cm 的圆线圈，圆心均匀排在半径 10 cm 的圆上，各自所在的平面过对称轴，逐个数值积分出离轴 10 cm 处的磁场再相加。',
    p3: 'μ₀Is/(2πR²)；和叠加核对：横截面上每一小块电流看成长直导线，以场点为中心按方向数值积分。',
    p4: 'μ₀I_enc/(2πs)，I_enc = I − I(s² − b²)/(c² − b²)；和叠加核对：内导体当成半径 1 mm 的均匀圆柱，外导体是半径 5 mm 的圆面减去 4 mm 的圆面（电流反向），都按方向数值积分。',
  },
  compute() {
    // p1
    const n1 = 2000;
    const I1 = 1.5;
    const Rs = 0.01;
    const U = Math.asinh(1e6);
    const Baxis = integrate((u) => n1 * I1 * ringB(Rs, 1, [0, 0, Rs * Math.sinh(u)], 16, 8)[2] * Rs * Math.cosh(u), -U, U, 128, 16);
    const p1 = agree(Baxis * 1e3, MU0 * n1 * I1 * 1e3, 'p1', 1e-9);

    // p2
    const N2 = 500;
    const I2 = 0.8;
    const R0 = 0.1;
    const a2 = 0.02;
    let B2: V3 = [0, 0, 0];
    for (let k = 0; k < N2; k++) {
      const ph = (2 * Math.PI * (k + 0.5)) / N2;
      const es: V3 = [Math.cos(ph), Math.sin(ph), 0];
      const c = scale(R0, es);
      B2 = add(
        B2,
        curveB(
          (t) => add(c, add(scale(a2 * Math.cos(t), es), [0, 0, a2 * Math.sin(t)])),
          (t) => add(scale(-a2 * Math.sin(t), es), [0, 0, a2 * Math.cos(t)]),
          0,
          2 * Math.PI,
          I2,
          [R0, 0, 0],
          16,
          16,
        ),
      );
    }
    const p2 = agree(norm(B2) * 1e3, ((MU0 * N2 * I2) / (2 * Math.PI * R0)) * 1e3, 'p2', 1e-9);

    // p3
    const Rw = 2.0e-3;
    const I3 = 10;
    const b3 = diskB(Rw, I3 / (Math.PI * Rw * Rw), [1.0e-3, 0]);
    const p3 = agree(Math.hypot(...b3) * 1e3, ((MU0 * I3 * 1.0e-3) / (2 * Math.PI * Rw * Rw)) * 1e3, 'p3', 1e-9);

    // p4
    const I4 = 5.0;
    const b = 4.0e-3;
    const c = 5.0e-3;
    const s = 4.5e-3;
    const Jout = -I4 / (Math.PI * (c * c - b * b));
    const inner = diskB(1.0e-3, I4 / (Math.PI * 1e-6), [s, 0]);
    const outerBig = diskB(c, Jout, [s, 0]);
    const outerHole = diskB(b, Jout, [s, 0]);
    const B4: [number, number] = [inner[0] + outerBig[0] - outerHole[0], inner[1] + outerBig[1] - outerHole[1]];
    const Ienc = I4 - (I4 * (s * s - b * b)) / (c * c - b * b);
    const p4 = agree(Math.hypot(...B4) * 1e3, ((MU0 * Ienc) / (2 * Math.PI * s)) * 1e3, 'p4', 1e-8);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
