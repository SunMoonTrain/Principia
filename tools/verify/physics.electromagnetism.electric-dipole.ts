// 独立验算 physics.electromagnetism.electric-dipole 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里偶极子的近似式（φ = kp cosθ/r²、E 的两个分量、U = −p·E）；
// 二是用两个点电荷 ±q（间距取场点距离的 10⁻⁵，q = p/d）直接按库仑定律算，做功按两个电荷各自的位移算。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.electric-dipole.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { E_CHARGE, K8988, add, agree, check, chosen, cross, dot, fieldAt, norm, potentialAt, scale, type Charge, type V3 } from './physics.electromagnetism._es.ts';

/** 中心在原点、电偶极矩为 p（沿单位矢量 u）的一对点电荷，间距 d。 */
function pair(p: number, u: V3, d: number, center: V3 = [0, 0, 0]): Charge[] {
  const q = p / d;
  return [
    { q, r: add(center, scale(d / 2, u)) },
    { q: -q, r: add(center, scale(-d / 2, u)) },
  ];
}

/** 匀强电场 E 里一对电荷 ±q（间距 d）的电偶极矩从和 E 成 th1 转到 th2，电场力对两个电荷做的功（按各自的位移算）。 */
function fieldWork(q: number, d: number, E: V3, th1: number, th2: number): number {
  const pos = (th: number): V3 => [(d / 2) * Math.cos(th), (d / 2) * Math.sin(th), 0];
  const dr = [pos(th2)[0] - pos(th1)[0], pos(th2)[1] - pos(th1)[1], 0] as V3;
  // +q 位移 dr，−q 位移 −dr；匀强电场里功和路径无关
  return q * dot(E, dr) + -q * dot(E, scale(-1, dr));
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.electric-dipole',
  notes: {
    p1: '用 ±q 一对点电荷（间距 d = 2×10⁻¹⁴ m，q = p/d）按点电荷公式算 2.0 nm、60° 处的电势；和 kp cosθ/r² 核对。',
    p2: 'A：E 沿 x，p 和 E 成 0° 到 180° 每隔 1° 算 |p×E|，最大值在 90°；B：一对点电荷（d 取 r 的 10⁻⁵）在 r 和 2r 处的电势之比 1/4；C：电场之比是 1/8（反例）；D：p 从和 E 同向转到垂直，电场力对两个电荷做的功按位移算是 −pE；E：+2q 和 −q 相距 d，在 10⁴d 外的电场和 q 的点电荷场相比只差 10⁻⁴ 量级，主要是点电荷的场（反例）。',
    p3: '两个电荷在匀强电场里随杆转动，电场力对它们做的功按各自的位移算，外力的功是它的相反数；和 pE(cos 30° − cos 150°) 核对。',
    p4: '水分子换成一对点电荷（d = 3×10⁻¹⁵ m，q = p/d），按库仑定律算它对钠离子的力；和 2kpe/r³ 核对。',
  },
  compute() {
    const k = K8988;
    // p1
    const p = 1.0e-29;
    const r1 = 2.0e-9;
    const th = Math.PI / 3;
    const pt: V3 = [r1 * Math.sin(th), 0, r1 * Math.cos(th)];
    const exact1 = potentialAt(pair(p, [0, 0, 1], r1 * 1e-5), pt, k);
    const p1 = agree(exact1, (k * p * Math.cos(th)) / (r1 * r1), 'p1', 1e-8);

    // p2
    const E: V3 = [1, 0, 0];
    const torques = Array.from({ length: 181 }, (_, deg) => norm(cross([Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180), 0], E)));
    const A2 = torques.indexOf(Math.max(...torques)) === 90;
    const dir: V3 = [Math.sin(0.7), 0, Math.cos(0.7)];
    const at = (r: number): V3 => scale(r, dir);
    const dip = pair(1, [0, 0, 1], 1e-5);
    const B2 = Math.abs(potentialAt(dip, at(2), k) / potentialAt(dip, at(1), k) - 0.25) < 1e-6;
    const C2 = Math.abs(norm(fieldAt(dip, at(2), k)) / norm(fieldAt(dip, at(1), k)) - 0.25) < 1e-6;
    check(Math.abs(norm(fieldAt(dip, at(2), k)) / norm(fieldAt(dip, at(1), k)) - 0.125) < 1e-6, 'p2 C：电场之比是 1/8');
    const W = fieldWork(1, 1, [1, 0, 0], 0, Math.PI / 2);
    const D2 = W < 0 && Math.abs(W + 1) < 1e-12;
    const mixed: Charge[] = [
      { q: 2, r: [0, 0, 0.5] },
      { q: -1, r: [0, 0, -0.5] },
    ];
    const far: V3 = scale(1e4, dir);
    const ratio = norm(fieldAt(mixed, far, k)) / ((k * 1) / 1e8);
    check(Math.abs(ratio - 1) < 1e-3, 'p2 E：远处主要是净电荷的点电荷场');
    const E2 = Math.abs(ratio - 1) > 0.5;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const q3 = 1.0e-9;
    const d3 = 2.0e-3;
    const E3 = 5.0e4;
    const Wfield = fieldWork(q3, d3, [E3, 0, 0], Math.PI / 6, (5 * Math.PI) / 6);
    const p3 = agree(-Wfield, q3 * d3 * E3 * (Math.cos(Math.PI / 6) - Math.cos((5 * Math.PI) / 6)), 'p3', 1e-12);

    // p4（钠离子在 +x 轴上 0.30 nm 处，水分子的 p 沿 +x）
    const pw = 6.19e-30;
    const r4 = 0.3e-9;
    const water = pair(pw, [1, 0, 0], r4 * 1e-5);
    const F4 = scale(E_CHARGE, fieldAt(water, [r4, 0, 0], k));
    check(F4[0] > 0, 'p4：钠离子被推开');
    const p4 = agree(norm(F4), (2 * k * pw * E_CHARGE) / r4 ** 3, 'p4', 1e-8);

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
