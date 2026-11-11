// 独立验算 physics.electromagnetism.biot-savart 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的公式（长直导线 μ₀I/(2πs)、圆线圈圆心 μ₀NI/(2R)、平行导线 μ₀I₁I₂/(2πd)、有限长直导线的 sinθ 公式）；
// 二是不用这些式子：毕奥-萨伐尔定律沿导线直接数值积分（_es.ts 的 curveB、polylineB、ringB）。
// 无限长导线取 ±10⁶ 倍距离、按 z = s·sinh u 换元积分，截断误差约 10⁻¹²。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.biot-savart.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { type V3, MU0, agree, cross, curveB, norm, polylineB, ringB, scale } from './physics.electromagnetism._es.ts';

/** z 轴上的长直导线（电流沿 +z）在 p 处的磁场：z = s₀ sinh u 换元后数值积分，导线长 ±10⁶ s₀。 */
function longWireB(I: number, p: V3, s0: number): V3 {
  const U = Math.asinh(1e6);
  return curveB(
    (u) => [0, 0, s0 * Math.sinh(u)],
    (u) => [0, 0, s0 * Math.cosh(u)],
    -U,
    U,
    I,
    p,
    128,
    16,
  );
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.biot-savart',
  notes: {
    p1: 'μ₀I/(2πs)；和毕奥-萨伐尔定律沿 ±10⁶ 倍距离长的导线数值积分核对。',
    p2: 'μ₀NI/(2R)；和沿圆线圈数值积分出圆心的磁场再乘 N 核对。',
    p3: 'μ₀I₁I₂/(2πd)；和数值核对：先数值积分出导线 1 在导线 2 处的磁场，再算 I₂ẑ × B 的大小（每米）；电流反向时力的方向背离导线 1（互相排斥）。',
    p4: '四条边各 μ₀I/(4π·a/2)·(sin45° + sin45°)；和沿正方形四条边数值积分核对。',
  },
  compute() {
    // p1
    const B1 = norm(longWireB(10, [0.05, 0, 0], 0.05));
    const p1 = agree(B1 * 1e6, ((MU0 * 10) / (2 * Math.PI * 0.05)) * 1e6, 'p1', 1e-9);

    // p2
    const B2 = norm(ringB(0.05, 1.5, [0, 0, 0]));
    const p2 = agree(20 * B2 * 1e3, ((MU0 * 20 * 1.5) / (2 * 0.05)) * 1e3, 'p2', 1e-9);

    // p3：导线 1 在原点、电流沿 +z；导线 2 在 (d, 0, 0)、电流沿 −z
    const d = 0.02;
    const Bat2 = longWireB(20, [d, 0, 0], d);
    const F = scale(20, cross([0, 0, -1], Bat2));
    if (!(F[0] > 0)) throw new Error('p3：反向电流应互相排斥');
    const p3 = agree(norm(F) * 1e3, ((MU0 * 20 * 20) / (2 * Math.PI * d)) * 1e3, 'p3', 1e-9);

    // p4
    const a = 0.1;
    const h = a / 2;
    const sq: V3[] = [
      [-h, -h, 0],
      [h, -h, 0],
      [h, h, 0],
      [-h, h, 0],
    ];
    const B4 = norm(polylineB(sq, 2.0, [0, 0, 0]));
    const side = ((MU0 * 2.0) / (4 * Math.PI * h)) * 2 * Math.sin(Math.PI / 4);
    const p4 = agree(B4 * 1e6, 4 * side * 1e6, 'p4', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
