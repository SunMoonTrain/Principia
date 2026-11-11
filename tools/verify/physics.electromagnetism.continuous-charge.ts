// 独立验算 physics.electromagnetism.continuous-charge 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的公式（圆环轴线上的电场等）；二是把带电体分成许多点电荷，逐个算电场按矢量相加，
// 求最大值用黄金分割搜索。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.continuous-charge.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { K8988, agree, argmax, check, chosen, fieldAt, norm, ringCharges, type Charge, type V3 } from './physics.electromagnetism._es.ts';

/** 沿 z 方向、在 (x0, 0) 处、z 从 zc − half 到 zc + half 的均匀带电细棒，分成 n 个点电荷。 */
function rodCharges(lambda: number, x0: number, zc: number, half: number, n: number): Charge[] {
  const dz = (2 * half) / n;
  return Array.from({ length: n }, (_, i) => ({ q: lambda * dz, r: [x0, 0, zc - half + (i + 0.5) * dz] as V3 }));
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.continuous-charge',
  notes: {
    p1: '圆环分成 3600 个点电荷，逐个算 (0, 0, 0.12 m) 处的电场按矢量相加；和 kQz/(z²+R²)^{3/2} 核对。',
    p2: 'A：2.0 μC ÷ 0.50 m = 4.0 μC/m；B：Q/(4πR²) 是面电荷密度的式子，体电荷密度是 Q/(4πR³/3)（反例）；C：半圆环分成 10⁵ 个点电荷，圆心电场不为零（反例）；D：两根平行细棒（各长 200 m，分成 2×10⁵ 段，关于场点对称摆放）在中线上一点的电场为零；E：半圆环各小块电场大小之和是合电场大小的 π/2 倍（反例）。',
    p3: '半圆环分成 10⁵ 个点电荷，逐个算圆心的电场按矢量相加；和 2kQ/(πR²) 核对。',
    p4: '圆环分成 360 个点电荷，在轴线上用黄金分割搜索电场最大的地方，再算那里的电场；和 z = R/√2 处的 2kQ/(3√3R²) 核对。',
  },
  compute() {
    // p1
    const E1 = fieldAt(ringCharges(2.0e-9, 0.05, 3600), [0, 0, 0.12], K8988);
    const p1 = agree(norm(E1), (K8988 * 2.0e-9 * 0.12) / (0.12 ** 2 + 0.05 ** 2) ** 1.5, 'p1', 1e-10);

    // p2
    const A2 = Math.abs(2.0e-6 / 0.5 - 4.0e-6) < 1e-18;
    const R = 0.3;
    const Q = 1e-9;
    const B2 = Math.abs(Q / (4 * Math.PI * R * R) - Q / ((4 / 3) * Math.PI * R ** 3)) < 1e-15;
    const half = ringCharges(Q, R, 100000, -Math.PI / 2, Math.PI / 2);
    const Ec = fieldAt(half, [0, 0, 0], K8988);
    const C2 = norm(Ec) < 1e-9 * K8988 * Q / (R * R);
    const lam = 1e-9;
    const pt: V3 = [0, 0, 0.3];
    const rods = [...rodCharges(lam, -0.5, pt[2], 100, 200000), ...rodCharges(lam, 0.5, pt[2], 100, 200000)];
    const D2 = norm(fieldAt(rods, pt, K8988)) < 1e-9 * (2 * K8988 * lam) / 0.5;
    const sumOfMagnitudes = half.reduce((s, c) => s + norm(fieldAt([c], [0, 0, 0], K8988)), 0);
    check(Math.abs(sumOfMagnitudes / norm(Ec) - Math.PI / 2) < 1e-6, 'p2 E：大小之和是合电场的 π/2 倍');
    const E2 = Math.abs(sumOfMagnitudes - norm(Ec)) < 1e-9 * norm(Ec);
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const semi = ringCharges(3.0e-9, 0.1, 100000, -Math.PI / 2, Math.PI / 2);
    const p3 = agree(norm(fieldAt(semi, [0, 0, 0], K8988)), (2 * K8988 * 3.0e-9) / (Math.PI * 0.1 * 0.1), 'p3', 1e-9);

    // p4
    const ring = ringCharges(1.0e-9, 0.1, 360);
    const Ez = (z: number) => fieldAt(ring, [0, 0, z], K8988)[2];
    const zMax = argmax(Ez, 0.01, 0.5);
    agree(zMax, 0.1 / Math.SQRT2, 'p4：最大值的位置', 1e-6);
    const p4 = agree(Ez(zMax), (2 * K8988 * 1.0e-9) / (3 * Math.sqrt(3) * 0.1 * 0.1), 'p4', 1e-10);

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
