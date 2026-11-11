// 独立验算 physics.electromagnetism.gauss-differential 的 p1–p4（简单题、中等题）。
// 两套算法：一是解析地求散度，ρ = ε₀∇·E；二是把电场穿出小立方体的通量数值积分再除以体积，或者用中心差分求散度再对体积数值积分。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.gauss-differential.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { EPS0, K_EXACT, agree, check, chosen, cubeFlux, divergence, integrate, integrate3, norm, scale, type Field, type V3 } from './physics.electromagnetism._es.ts';

/** 球对称的径向电场 E_r(r) 写成矢量场。 */
const radial = (Er: (r: number) => number): Field => (p) => scale(Er(norm(p)) / norm(p), p);

/** 球对称的电荷分布 ρ(r)：用球壳定理（每层薄球壳在外面像点电荷、在里面为零）逐层加出 E_r，不用高斯定律。 */
const fieldOfBall = (rho: (r: number) => number, R: number) => (r: number) =>
  (K_EXACT / (r * r)) * integrate((s) => rho(s) * 4 * Math.PI * s * s, 0, Math.min(r, R), 64, 16);

/** 均匀带电球面（半径 a、电荷 Q）在 r 处的径向电场：分成一圈圈细圆环，用圆环轴线上的库仑场对极角积分。 */
function shellFieldByRings(Q: number, a: number, r: number): number {
  return integrate(
    (th) => {
      const dq = (Q / 2) * Math.sin(th);
      const zc = a * Math.cos(th);
      const s = a * Math.sin(th);
      return (K_EXACT * dq * (r - zc)) / ((r - zc) ** 2 + s * s) ** 1.5;
    },
    0,
    Math.PI,
    256,
    16,
  );
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.gauss-differential',
  notes: {
    p1: '解析地 ∇·E = k(2 + 3 − 1)，ρ = ε₀∇·E；和穿出以 (0.3, −0.2, 0.5) 为心、边长 0.1 m 的立方体的电通量（六个面数值积分）除以体积核对。',
    p2: 'A：均匀带电球面（半径 1）的电场由圆环的库仑场积分得到，r = 0.3、0.6 处取小立方体算通量，散度为零（对）；B：均匀带电球体（逐层球壳加出电场）外面 r = 2、3 处散度都是零，不和 1/r³ 成正比（反例）；C：ρ(r) = 1 − 2r² 的球体，逐层加出电场后在 r = 0.3、0.9 处用立方体通量求散度，符号和 ρ 相同、数值是 ρ/ε₀（对）；D：点电荷和同电荷的均匀球面在 r > 0.5 处电场相同，两者的散度在 r = 0.8、1.5 处都等于零，电荷密度相同（对，ρ = ε₀∇·E）；E：−1 nC 的点电荷，在 (1, 0, 0) 处沿电场方向（指向电荷）电场变强，散度却是零（反例）。',
    p3: '解析地 ρ = ε₀(1/r²)d(r²E_r)/dr = Q e^{−r/b}/(4πb r²)；和在 (b, 0, 0) 处取边长 10⁻⁴b 的小立方体算通量、除以体积核对。',
    p4: '对立方体用散度定理：穿出 x = a 面的通量 E₀a²，x = 0 面为零，Q = ε₀E₀a²；和把中心差分求出的 ε₀∇·E 在立方体上做三重数值积分核对。题面没给 ε₀，取 CODATA 2022 的值。',
  },
  compute() {
    // p1
    const k1 = 2.0e3;
    const E1: Field = ([x, y, z]) => [k1 * 2 * x, k1 * 3 * y, -k1 * z];
    const h1 = 0.1;
    const p1 = agree((EPS0 * cubeFlux(E1, [0.3, -0.2, 0.5], h1)) / h1 ** 3, EPS0 * k1 * 4, 'p1', 1e-9);

    // p2
    const Q = 1e-9;
    const divAt = (E: Field, p: V3, h = 1e-3) => cubeFlux(E, p, h) / h ** 3;
    // A：球面里面
    const shell = radial((r) => shellFieldByRings(Q, 1, r));
    const scaleA = (K_EXACT * Q) / 1; // 球面外表面附近电场的量级
    const A2 = [0.3, 0.6].every((r) => Math.abs(divAt(shell, [r, 0, 0], 1e-2)) < 1e-6 * scaleA);
    // B：球体外面
    const ball = radial(fieldOfBall(() => 1, 1));
    const total = (4 / 3) * Math.PI;
    const dB = [2, 3].map((r) => divAt(ball, [r / Math.sqrt(3), r / Math.sqrt(3), r / Math.sqrt(3)], 1e-2));
    const B2 = !dB.every((d, i) => Math.abs(d) < 1e-6 * ((K_EXACT * total) / [2, 3][i] ** 3));
    // C：ρ = 1 − 2r²（球心正、外层负）
    const rhoC = (r: number) => 1 - 2 * r * r;
    const ballC = radial(fieldOfBall(rhoC, 1));
    const C2 = [0.3, 0.9].every((r) => {
      const d = divAt(ballC, [0, r, 0], 1e-3);
      return Math.sign(d) === Math.sign(rhoC(r)) && Math.abs(EPS0 * d - rhoC(r)) < 1e-4 * Math.abs(rhoC(r));
    });
    // D：点电荷和同电荷的均匀球面（半径 0.5）
    const point = radial((r) => (K_EXACT * Q) / (r * r));
    const shellD = radial((r) => shellFieldByRings(Q, 0.5, r));
    const D2 = [0.8, 1.5].every((r) => {
      const p: V3 = [r, 0, 0];
      check(Math.abs(norm(point(p)) - norm(shellD(p))) < 1e-9 * norm(point(p)), 'p2 D：两种分布在 r > 0.5 处电场相同');
      return Math.abs(divAt(point, p, 1e-2) - divAt(shellD, p, 1e-2)) < 1e-6 * ((K_EXACT * Q) / r ** 3);
    });
    // E：负点电荷
    const neg = radial((r) => (-K_EXACT * Q) / (r * r));
    const pE: V3 = [1, 0, 0];
    const dir = scale(1 / norm(neg(pE)), neg(pE)); // 电场方向
    const stronger = norm(neg([pE[0] + 1e-3 * dir[0], 0, 0])) > norm(neg(pE));
    check(stronger, 'p2 E：沿电场方向电场变强');
    const dE = divAt(neg, pE, 1e-2);
    check(Math.abs(dE) < 1e-6 * K_EXACT * Q, 'p2 E：点电荷外面散度为零');
    const E2 = dE > 1e-9 * K_EXACT * Q; // 说法要求散度为正，这里不成立

    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const Q3 = 1.0e-9;
    const b = 1.0e-2;
    const Er3 = (r: number) => (K_EXACT * Q3 * (1 - Math.exp(-r / b))) / (r * r);
    const h3 = 1e-4 * b;
    const numeric3 = (EPS0 * cubeFlux(radial(Er3), [b, 0, 0], h3)) / h3 ** 3;
    const p3 = agree(numeric3, (Q3 * Math.exp(-1)) / (4 * Math.PI * b ** 3), 'p3', 1e-6);

    // p4
    const E0 = 300;
    const a = 0.2;
    const E4: Field = ([x]) => [E0 * (x / a) ** 2, 0, 0];
    const numeric4 = integrate3((x, y, z) => EPS0 * divergence(E4, [x, y, z], 1e-6), [0, 0, 0], [a, a, a], 2, 8);
    const p4 = agree(numeric4, EPS0 * E0 * a * a, 'p4', 1e-7);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
