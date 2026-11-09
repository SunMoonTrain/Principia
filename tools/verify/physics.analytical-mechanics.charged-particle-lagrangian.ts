// 独立验算 physics.analytical-mechanics.charged-particle-lagrangian 的 p1–p4（简单题、中等题）。
// 正则动量由 L 数值求 ∂L/∂ṙ；规范变换的那题取几组任意的势和规范函数，E、B 由势数值求导，运动按数值的拉格朗日方程积分；
// 交叉场里的运动不用拉格朗日量，直接按牛顿定律 m r̈ = q(E + v × B) 积分，在 v_y 由正变负（速率最大、离出发线最远）
// 的时刻读出速率和位移；再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.charged-particle-lagrangian.ts

import { fileURLToPath } from 'node:url';
import type { Derivative } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import {
  agree,
  chosen,
  derivative,
  eulerLagrange,
  gradient,
  integrateTo,
  integrateUntil,
  type Vec,
} from './physics.analytical-mechanics._mech.ts';
import { cross, norm } from './physics.analytical-mechanics._rigid.ts';

type Scalar = (r: Vec, t: number) => number;
type VectorField = (r: Vec, t: number) => Vec;

/** 带电粒子的拉格朗日量 ½m v² − qφ + q v·A。 */
const lagrangianOf =
  (m: number, q: number, phi: Scalar, A: VectorField) =>
  (r: Vec, v: Vec, t: number): number =>
    0.5 * m * (v[0] ** 2 + v[1] ** 2 + v[2] ** 2) - q * phi(r, t) + q * A(r, t).reduce((s, Ai, i) => s + Ai * v[i], 0);

/** 由势数值地求 E = −∇φ − ∂A/∂t 和 B = ∇ × A。 */
function fields(phi: Scalar, A: VectorField, r: Vec, t: number): { E: Vec; B: Vec } {
  const dA = (j: number, k: number): number => derivative((s) => A(r.map((ri, i) => (i === k ? ri + s : ri)), t)[j], 0);
  const gradPhi = gradient((x) => phi(x, t), r);
  const E = [0, 1, 2].map((j) => -gradPhi[j] - derivative((s) => A(r, t + s)[j], 0));
  return { E, B: [dA(2, 1) - dA(1, 2), dA(0, 2) - dA(2, 0), dA(1, 0) - dA(0, 1)] };
}

/** 匀强的 E = E ŷ、B = B ẑ 里由静止出发，积分到 v_y 由正变负，返回那时的速率和 y。 */
function crossedFields(qm: number, E: number, B: number): { speed: number; y: number } {
  const f: Derivative = (_t, s, out) => {
    const force = cross([s[3], s[4], s[5]], [0, 0, B]);
    out[0] = s[3];
    out[1] = s[4];
    out[2] = s[5];
    out[3] = qm * force[0];
    out[4] = qm * (E + force[1]);
    out[5] = qm * force[2];
  };
  const period = (2 * Math.PI) / (qm * B);
  const turn = integrateUntil(f, [0, 0, 0, 0, 0, 0], 0, period / 20000, 2 * period, (_t, s) => s[4])!;
  return { speed: norm([turn.y[3], turn.y[4], turn.y[5]]), y: turn.y[1] };
}

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.charged-particle-lagrangian',
  notes: {
    p1: '取任意的 φ 和 A（在这一点 A_x = 4），对 L = ½m v² − qφ + q v·A 数值求 ∂L/∂ẋ；和 m v_x + qA_x 核对。',
    p2: '取 φ = xy − 0.3tz²、A = (yt, z² − x, t sin x)、χ = sin(xy) + t²z，m = 1.3、q = 0.7：E、B 在两个点上由势数值求导比较；再从同一个位置和速度出发，用 L 和 L′ 按数值的拉格朗日方程各积分到 t = 1，比较 m ṙ 和正则动量 m ṙ + qA。',
    p3: '直接按 m r̈ = q(E + v × B) 积分，在 v_y 由正变负时读出速率，q/m 取质子的值和 10⁸ C/kg 两种，结果一样（与 q、m 无关）；和 2E/B 核对。',
    p4: '同上，按质子的 q/m 积分，在 v_y 由正变负时读出 y（之后 y 减小）；和 2mE/(qB²) 核对。',
  },
  compute() {
    // p1：m = 2、q = 0.5，此刻 v_x = 3、A_x = 4（φ、A 的其余部分任取）
    const r1 = [0.4, -1.1, 0.8];
    const phi1: Scalar = (r) => 2 * r[0] - r[1] * r[2];
    const A1: VectorField = (r) => [4 + 0.3 * (r[1] - r1[1]), 1.2 * r[0], -0.5];
    const L1 = lagrangianOf(2, 0.5, phi1, A1);
    const v1 = [3, -1, 2];
    const p1 = agree(derivative((s) => L1(r1, [v1[0] + s, v1[1], v1[2]], 0), 0), 2 * 3 + 0.5 * 4, 'p1 p_x');

    // p2
    const [m2, q2] = [1.3, 0.7];
    const phi: Scalar = (r, t) => r[0] * r[1] - 0.3 * t * r[2] ** 2;
    const A: VectorField = (r, t) => [r[1] * t, r[2] ** 2 - r[0], t * Math.sin(r[0])];
    const chi: Scalar = (r, t) => Math.sin(r[0] * r[1]) + t * t * r[2];
    const phiG: Scalar = (r, t) => phi(r, t) - derivative((s) => chi(r, t + s), 0);
    const AG: VectorField = (r, t) => {
      const g = gradient((x) => chi(x, t), r);
      return A(r, t).map((Ai, i) => Ai + g[i]);
    };
    const points: [Vec, number][] = [
      [[0.3, -0.8, 1.1], 0.4],
      [[-1.2, 0.5, 0.2], 1.7],
    ];
    const same = (a: Vec, b: Vec): boolean => norm(a.map((ai, i) => ai - b[i])) < 1e-6 * Math.max(1, norm(a));
    const sameE = points.every(([r, t]) => same(fields(phi, A, r, t).E, fields(phiG, AG, r, t).E));
    const sameB = points.every(([r, t]) => same(fields(phi, A, r, t).B, fields(phiG, AG, r, t).B));
    const motion = (L: (r: Vec, v: Vec, t: number) => number): Derivative => (t, s, out) => {
      const a = eulerLagrange(L, [s[0], s[1], s[2]], [s[3], s[4], s[5]], t);
      for (let i = 0; i < 3; i++) {
        out[i] = s[3 + i];
        out[3 + i] = a[i];
      }
    };
    const s0 = [0.3, -0.8, 1.1, 0.5, 0.2, -0.4];
    const end = integrateTo(motion(lagrangianOf(m2, q2, phi, A)), s0, 0, 1, 1e-3);
    const endG = integrateTo(motion(lagrangianOf(m2, q2, phiG, AG)), s0, 0, 1, 1e-3);
    const mech = (s: Float64Array): Vec => [3, 4, 5].map((i) => m2 * s[i]);
    const canon = (s: Float64Array, Af: VectorField): Vec => mech(s).map((pi, i) => pi + q2 * Af([s[0], s[1], s[2]], 1)[i]);
    const p2 = chosen([sameE, sameB, same(canon(end, A), canon(endG, AG)), same(mech(end), mech(endG))]);

    // p3、p4：E = 1000、B = 0.01
    const [E, B] = [1000, 0.01];
    const qmProton = 1.6e-19 / 1.67e-27;
    const proton = crossedFields(qmProton, E, B);
    const other = crossedFields(1e8, E, B);
    const p3 = agree(agree(other.speed, proton.speed, 'p3 不同的 q/m', 1e-8), (2 * E) / B, 'p3 最大速率', 1e-8);
    const p4 = agree(proton.y, (2 * E) / (qmProton * B * B), 'p4 最远距离');

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
