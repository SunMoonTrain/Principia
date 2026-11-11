// 独立验算 physics.electromagnetism.gauss-law 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的高斯定律、立体角和对称性；二是把点电荷的库仑场直接在曲面上做数值面积分（不用高斯定律）。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.gauss-law.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { EPS0, K_EXACT, agree, check, chosen, dot, fieldAt, integrate, integrate2, type Charge, type V3 } from './physics.electromagnetism._es.ts';

/** 穿出以 c 为心、半径 R 的球面的电通量：E·r̂ R² sinθ 对 θ、φ 数值积分。 */
function fluxThroughSphere(charges: Charge[], c: V3, R: number): number {
  return integrate2(
    (th, ph) => {
      const n: V3 = [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)];
      const p: V3 = [c[0] + R * n[0], c[1] + R * n[1], c[2] + R * n[2]];
      return dot(fieldAt(charges, p), n) * R * R * Math.sin(th);
    },
    0,
    Math.PI,
    0,
    2 * Math.PI,
    24,
    16,
  );
}

/** 均匀带电球面（球心在原点，半径 a，总电荷 Q）在离球心 r 处的径向电场：分成一圈圈细圆环，用圆环轴线上的库仑场对极角积分。 */
function shellFieldByRings(Q: number, a: number, r: number): number {
  return integrate(
    (th) => {
      const dq = (Q / 2) * Math.sin(th);
      const zc = a * Math.cos(th);
      const rho = a * Math.sin(th);
      return (K_EXACT * dq * (r - zc)) / ((r - zc) ** 2 + rho * rho) ** 1.5;
    },
    0,
    Math.PI,
    64,
    16,
  );
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.gauss-law',
  notes: {
    p1: '平面取 0.050 m² 的正方形，E 和法线成 60°，把 E·n 在正方形上数值积分；和 EA cos 60° 核对。',
    p2: 'A：两个点电荷放在单位球里不同的位置，库仑场在球面上数值积分，得 2 nC/ε₀；B：把面里的电荷挪到另一处，数值积分的电通量不变；C：电荷在面外时数值积分为零、在面里时是 q/ε₀；D：中心放 +q、外面套一个 −q 的均匀球面（球面的电场由一圈圈圆环的库仑场积分得到），再外面的高斯面上电场处处为零，面里却有电荷（反例）；E：sinθ 在整个球面上积分是 4π（反例）。',
    p3: '点电荷放在原点，立方体占 [0, a]³，在 x = a 那个面上把 E_x 数值积分（取 a = 1 m，结果和 a 无关）；和 q/(24ε₀) 核对。',
    p4: '圆面放在 z = R 处，把点电荷的 E_z 在圆面上按半径数值积分；和立体角 2π(1 − cos 45°) 乘 q/(4πε₀) 核对。',
  },
  compute() {
    // p1
    const E: V3 = [2.0e3 * Math.cos(Math.PI / 3), 0, 2.0e3 * Math.sin(Math.PI / 3)];
    const n: V3 = [1, 0, 0];
    const side = Math.sqrt(0.05);
    const p1 = agree(integrate2(() => dot(E, n), 0, side, 0, side, 4, 8), 2.0e3 * 0.05 * Math.cos(Math.PI / 3), 'p1', 1e-12);

    // p2
    const inside: Charge[] = [
      { q: 3e-9, r: [0.2, 0.1, -0.3] },
      { q: -1e-9, r: [-0.4, 0.2, 0.1] },
    ];
    const A2 = Math.abs(fluxThroughSphere(inside, [0, 0, 0], 1) - 2e-9 / EPS0) < 1e-8 * (2e-9 / EPS0);
    const one = (r: V3): number => fluxThroughSphere([{ q: 1e-9, r }], [0, 0, 0], 1);
    const B2 = Math.abs(one([0.1, 0, 0]) - one([-0.3, 0.4, 0.2])) < 1e-8 * (1e-9 / EPS0);
    const C2 = Math.abs(one([2, 0.5, 0])) < 1e-8 * (1e-9 / EPS0) && Math.abs(one([0.3, 0, 0]) - 1e-9 / EPS0) < 1e-8 * (1e-9 / EPS0);
    // D 的反例：+q 在中心，−q 均匀分布在半径 0.5 的球面上；在 r = 0.8、1.5 两处算径向电场
    const fieldOutside = (r: number) => (K_EXACT * 1e-9) / (r * r) + shellFieldByRings(-1e-9, 0.5, r);
    const counterexample = [0.8, 1.5].every((r) => Math.abs(fieldOutside(r)) < 1e-9 * ((K_EXACT * 1e-9) / (r * r)));
    const D2 = !counterexample;
    const solid = integrate2((th) => Math.sin(th), 0, Math.PI, 0, 2 * Math.PI, 8, 16);
    check(Math.abs(solid - 4 * Math.PI) < 1e-12, 'p2 E：整个球面的立体角是 4π');
    const E2 = Math.abs(solid - 2 * Math.PI) < 1e-9;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3（q = 2.0 nC，立方体边长取 1 m）
    const q3 = 2.0e-9;
    const face = integrate2((y, z) => fieldAt([{ q: q3, r: [0, 0, 0] }], [1, y, z])[0], 0, 1, 0, 1, 16, 16);
    const p3 = agree(face, q3 / (24 * EPS0), 'p3', 1e-10);

    // p4（q = 1.0 nC，R 取 1 m）
    const q4 = 1.0e-9;
    const disk = integrate((s) => fieldAt([{ q: q4, r: [0, 0, 0] }], [s, 0, 1])[2] * 2 * Math.PI * s, 0, 1, 64, 16);
    const p4 = agree(disk, ((q4 / (4 * Math.PI * EPS0)) * 2 * Math.PI * (1 - Math.SQRT1_2)), 'p4', 1e-10);

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
