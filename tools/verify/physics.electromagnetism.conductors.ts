// 独立验算 physics.electromagnetism.conductors 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里静电平衡导体的性质（表面外侧 E = σ/ε₀、等势、感应电荷）；
// 二是把导体换成具体的电荷分布直接算：均匀带电球面分成圆环积分库仑场，接地球用镜像电荷，电势从无穷远对电场做数值积分。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.conductors.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { EPS0, K8988, K_EXACT, agree, check, chosen, dot, fieldAt, integrate, potentialAt, scale, sub, norm, type Charge, type V3 } from './physics.electromagnetism._es.ts';

/** 半径 a、总电荷 Q 的均匀球面，离球心 r 处的径向电场：分成圆环，对极角积分（r 不等于 a）。 */
function shellField(Q: number, a: number, r: number, k = K_EXACT): number {
  return integrate(
    (th) => {
      const zc = a * Math.cos(th);
      const rho = a * Math.sin(th);
      return (k * (Q / 2) * Math.sin(th) * (r - zc)) / ((r - zc) ** 2 + rho * rho) ** 1.5;
    },
    0,
    Math.PI,
    256,
    16,
  );
}

/** 从无穷远沿径向积分到 R：φ(R) = −∫_∞^R E(r) dr = ∫_R^∞ E(r) dr，换成 r = R/u。 */
const potentialFromField = (E: (r: number) => number, R: number): number => integrate((u) => (E(R / u) * R) / (u * u), 1e-12, 1, 256, 16);

export const verification: Verification = {
  lesson: 'physics.electromagnetism.conductors',
  notes: {
    p1: '把地球看成半径 6.371×10⁶ m 的导体球，电荷均匀分布在球面上：球面分成圆环直接积分，核对外面的电场就是 kQ/r²；由表面处向下 100 V/m 定出 Q，σ = Q/(4πR²)；和 σ = ε₀E_n 核对。',
    p2: 'A：均匀带电球面分成圆环积分，球心附近（r = 10⁻³a）电场为零；B：两个孤立导体球表面电荷密度 1 和 2 nC/m²，表面外侧电场按圆环积分算，后者大；C：内表面 −q、壳中性，外表面是 0 − (−q) = +q（反例）；D：半径 1 m 的接地导体球、3 m 外放 q：镜像电荷 −q/3 在 1/3 m 处，球面上各点电势为零，球面上的感应电荷总共 −q/3（反例）；E：同一个例子，球面上电场的切向分量为零（反例）。',
    p3: '由表面电场 3.0×10⁶ V/m 定出球的电荷，再从无穷远对 kQ/r² 做数值积分得电势；和 E·R 核对。',
    p4: '里面的球带 Q，壳的内表面 −Q、外表面 +Q；按 r 分段写出电场，从无穷远数值积分到 a；和三个球面的电势叠加 k(Q/a − Q/b + Q/c) 核对。',
  },
  compute() {
    // p1
    const R = 6.371e6;
    const Q1 = (-100 * R * R) / K_EXACT;
    check(Math.abs(shellField(Q1, R, 1.5 * R) - (K_EXACT * Q1) / (1.5 * R) ** 2) < 1e-10 * Math.abs((K_EXACT * Q1) / (1.5 * R) ** 2), 'p1：球面外电场是 kQ/r²');
    const p1 = agree(Q1 / (4 * Math.PI * R * R), EPS0 * -100, 'p1', 1e-12);

    // p2
    const A2 = Math.abs(shellField(1e-9, 0.1, 1e-4)) < 1e-9 * ((K_EXACT * 1e-9) / 0.01);
    const Eout = (sigma: number) => shellField(sigma * 4 * Math.PI * 0.1 ** 2, 0.1, 0.1 * (1 + 1e-3));
    const B2 = Eout(2e-9) > Eout(1e-9);
    const inner = -1;
    const C2 = 0 - inner === -1;
    // D、E：接地导体球（R = 1）外 3 m 处的点电荷 q，镜像电荷 −q/3 在 1/3 m 处
    const q = 1e-9;
    const img: Charge[] = [
      { q, r: [3, 0, 0] },
      { q: -q / 3, r: [1 / 3, 0, 0] },
    ];
    const surf = [0.3, 1.1, 2.0, 2.9].map((th): V3 => [Math.cos(th), Math.sin(th), 0]);
    check(surf.every((p) => Math.abs(potentialAt(img, p)) < 1e-12 * (K_EXACT * q)), 'p2 D：球面上电势为零');
    // 球面上的感应电荷：σ = ε₀ E·n̂ 对球面积分
    const induced = integrate(
      (th) => {
        const n: V3 = [Math.cos(th), Math.sin(th), 0];
        return EPS0 * dot(fieldAt(img, scale(1 + 1e-9, n)), n) * 2 * Math.PI * Math.sin(th);
      },
      0,
      Math.PI,
      256,
      16,
    );
    check(Math.abs(induced + q / 3) < 1e-6 * (q / 3), 'p2 D：感应电荷总共 −q/3');
    const D2 = Math.abs(induced) < 1e-15;
    const tangential = surf.map((n) => {
      const Ef = fieldAt(img, n);
      return norm(sub(Ef, scale(dot(Ef, n), n))) / norm(Ef);
    });
    const E2 = tangential.some((t) => t > 1e-9);
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const R3 = 0.2;
    const Emax = 3.0e6;
    const Q3 = (Emax * R3 * R3) / K_EXACT;
    const p3 = agree(potentialFromField((r) => (K_EXACT * Q3) / (r * r), R3), Emax * R3, 'p3', 1e-10);

    // p4
    const [a, b, c] = [0.05, 0.1, 0.12];
    const Q = 2.0e-9;
    const E4 = (r: number) => (r > c ? (K8988 * Q) / (r * r) : r > b ? 0 : (K8988 * Q) / (r * r));
    const numeric = integrate((r) => E4(r), a, b, 64, 16) + integrate((u) => (E4(c / u) * c) / (u * u), 1e-12, 1, 256, 16);
    const p4 = agree(numeric, K8988 * Q * (1 / a - 1 / b + 1 / c), 'p4', 1e-10);

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
