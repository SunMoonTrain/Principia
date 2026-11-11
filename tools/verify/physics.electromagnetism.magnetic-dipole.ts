// 独立验算 physics.electromagnetism.magnetic-dipole 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的偶极子磁场（轴上 (μ₀/4π)2m/r³、中垂面 (μ₀/4π)m/r³、一般方向 √(1 + 3cos²θ) 倍）和磁矩 m = IA；
// 二是不用这些式子：把偶极子换成半径很小（10⁻⁴ 倍距离）、IπR² = m 的圆线圈，用毕奥-萨伐尔定律沿线圈数值积分；
// 折过的线圈按 m = (I/2)∮ r × dl 沿折线数值积分。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.magnetic-dipole.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { type V3, agree, loopMoment, norm, ringB } from './physics.electromagnetism._es.ts';

/** 磁矩 m（沿 +z）的小圆线圈在 p 处的磁场：半径取 |p| 的 10⁻⁴ 倍。 */
function smallLoopB(m: number, p: V3): V3 {
  const R = 1e-4 * norm(p);
  return ringB(R, m / (Math.PI * R * R), p, 16, 16);
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.magnetic-dipole',
  notes: {
    p1: '(μ₀/4π)·2m/r³；和半径 10⁻⁴ m、IπR² = 2.0 A m² 的圆线圈在轴上 1.0 m 处的磁场（毕奥-萨伐尔定律数值积分）核对，有限大小的修正约 10⁻⁸。',
    p2: '(μ₀/4π)·m/r³；和同样的小圆线圈在自己平面里 20 cm 处的磁场数值积分核对。',
    p3: '赤道上的值乘 √(1 + 3cos²30°)；和小圆线圈在离轴 30°、同一距离处与赤道面上的磁场之比（数值积分）核对。',
    p4: 'IA/√2：两半各是 IA/2、方向互相垂直；和沿折过以后的 6 段折线数值积分 (I/2)∮ r × dl 核对。',
  },
  compute() {
    // p1
    const B1 = norm(smallLoopB(2.0, [0, 0, 1.0]));
    const p1 = agree(B1 * 1e6, 1e-7 * ((2 * 2.0) / 1.0 ** 3) * 1e6, 'p1', 1e-6);

    // p2
    const B2 = norm(smallLoopB(1.0, [0.2, 0, 0]));
    const p2 = agree(B2 * 1e6, 1e-7 * (1.0 / 0.2 ** 3) * 1e6, 'p2', 1e-6);

    // p3
    const th = Math.PI / 6;
    const Bpol = norm(smallLoopB(1, [Math.sin(th), 0, Math.cos(th)]));
    const Beq = norm(smallLoopB(1, [1, 0, 0]));
    const p3 = agree(3.0e-5 * (Bpol / Beq) * 1e6, 3.0e-5 * Math.sqrt(1 + 3 * Math.cos(th) ** 2) * 1e6, 'p3', 1e-6);

    // p4：正方形 (0,0)、(a,0)、(a,a)、(0,a)，沿 x = a/2 折，右半边转到平面 x = a/2 里
    const a = 0.1;
    const I = 2.0;
    const folded: V3[] = [
      [0, 0, 0],
      [a / 2, 0, 0],
      [a / 2, 0, a / 2],
      [a / 2, a, a / 2],
      [a / 2, a, 0],
      [0, a, 0],
    ];
    const flat: V3[] = [
      [0, 0, 0],
      [a, 0, 0],
      [a, a, 0],
      [0, a, 0],
    ];
    agree(norm(loopMoment(flat, I)), I * a * a, 'p4 折之前', 1e-12);
    const p4 = agree(norm(loopMoment(folded, I)), (I * a * a) / Math.SQRT2, 'p4', 1e-12);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
