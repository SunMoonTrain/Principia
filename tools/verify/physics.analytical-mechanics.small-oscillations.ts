// 独立验算 physics.analytical-mechanics.small-oscillations 的 p1–p4（简单题、中等题）。
// 两种算法：一是在平衡位置数值求动能对 q̇ 的二阶导数（T 矩阵）和势能的黑塞矩阵（V 矩阵），解 det(V − ω²T) = 0；
// 二是从这个简正模的形状、很小的振幅出发，按完整的（不展开的）运动方程积分，ω 由相邻两次过零的时间读出，
// 并检验各坐标一直保持同一个比例（确实是简正模）。两者先互相核对，再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.small-oscillations.ts

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
  kinetic,
  systemDerivative,
  type Mat,
  type System,
  type Vec,
} from './physics.analytical-mechanics._mech.ts';

/** 二元函数 f 在 x 处的黑塞矩阵（对梯度再数值求导）。 */
const hessian = (f: (x: Vec) => number, x: Vec): Mat =>
  x.map((_, j) => x.map((__, k) => derivative((s) => gradient(f, x.map((xi, i) => (i === k ? xi + s : xi)))[j], 0)));

/** 两个自由度：det(V − λT) = 0 的两个根 λ = ω²（从小到大）和对应的简正模 a（(V − λT)a = 0）。 */
function modes(T: Mat, V: Mat): { w2: number; a: Vec }[] {
  const A = T[0][0] * T[1][1] - T[0][1] ** 2;
  const B = -(T[0][0] * V[1][1] + T[1][1] * V[0][0] - 2 * T[0][1] * V[0][1]);
  const C = V[0][0] * V[1][1] - V[0][1] ** 2;
  const disc = Math.sqrt(B * B - 4 * A * C);
  return [(-B - disc) / (2 * A), (-B + disc) / (2 * A)].map((w2) => {
    const a = [-(V[0][1] - w2 * T[0][1]), V[0][0] - w2 * T[0][0]];
    const scale = Math.max(Math.abs(a[0]), Math.abs(a[1]));
    return { w2, a: a.map((ai) => ai / scale) }; // 最大的分量取成 ±1，振幅由 ε 决定
  });
}

/**
 * 从 q = ε·a、q̇ = 0 出发积分，第一个坐标相邻两次过零相隔半个周期，返回角频率；
 * 途中检验两个坐标之比一直是 a₂/a₁（只有在 q₁ 离零较远时比较）。
 */
function modeFrequency(f: Derivative, a: Vec, eps: number, dt: number): number {
  const y0 = [eps * a[0], eps * a[1], 0, 0];
  const check = (y: Float64Array): void => {
    if (Math.abs(y[0]) > 0.3 * eps * Math.abs(a[0]) && Math.abs(y[1] / y[0] - a[1] / a[0]) > 1e-4 * Math.abs(a[1] / a[0]) + 1e-6) {
      throw new Error(`坐标之比 ${y[1] / y[0]} 不是简正模的 ${a[1] / a[0]}`);
    }
  };
  const event = (_t: number, y: Float64Array): number => (check(y), y[0]);
  const first = integrateUntil(f, y0, 0, dt, 100, event)!;
  const away = integrateTo(f, Array.from(first.y), first.t, first.t + 10 * dt, dt);
  const second = integrateUntil(f, Array.from(away), first.t + 10 * dt, dt, 200, event)!;
  return Math.PI / (second.t - first.t);
}

/** 由 System 在平衡位置 q = 0 数值求 T、V 两个矩阵。 */
function matrices(sys: System): { T: Mat; V: Mat } {
  const zero = [0, 0];
  return { T: hessian((qd) => kinetic(sys, zero, qd, 0), zero), V: hessian((q) => sys.potential!(q, 0), zero) };
}

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.small-oscillations',
  notes: {
    p1: '解 det(V − λT) = 0 取大根开方；另外把 L₂ 直接交给数值的拉格朗日方程，从这个简正模的形状出发积分，读出角频率，两者核对；和 V 的特征值 6、1 核对。',
    p2: '对四个势能在原点数值求黑塞矩阵，质量为 1 时 ω² 就是它的两个特征值，两个都大于 10⁻⁶ 才算两个简正频率都大于零（C 的一个特征值是 0）。',
    p3: '取 m = l = g = 1，两个摆球的直角坐标写成摆角的函数，在竖直位置数值求 T、V，解出两个 ω²；再从每个简正模、振幅 10⁻⁴ 出发按完整的运动方程积分读出角频率，两者核对；和手解 ω² = 2ω₀²/3、2ω₀² 之比开方核对。',
    p4: '珠子的直角坐标 (x, y, (x² + 2y²)/(2R))，以 x、y 为广义坐标，数值求 T、V，解出两个 ω²；再从较高的那个简正模、振幅 10⁻⁴ 出发按完整的运动方程积分读出角频率，两者核对；和 √(2g/R) 核对。',
  },
  compute() {
    // p1
    const T1 = [
      [1, 0],
      [0, 1],
    ];
    const V1 = [
      [5, -2],
      [-2, 2],
    ];
    const high1 = modes(T1, V1)[1];
    const L2 = (q: Vec, qd: Vec): number =>
      0.5 * (qd[0] * qd[0] + qd[1] * qd[1]) - 0.5 * (V1[0][0] * q[0] ** 2 + 2 * V1[0][1] * q[0] * q[1] + V1[1][1] * q[1] ** 2);
    const f1: Derivative = (t, y, out) => {
      const a = eulerLagrange(L2, [y[0], y[1]], [y[2], y[3]], t);
      out[0] = y[2];
      out[1] = y[3];
      out[2] = a[0];
      out[3] = a[1];
    };
    const p1 = agree(agree(modeFrequency(f1, high1.a, 1, 1e-3), Math.sqrt(high1.w2), 'p1 两种算法'), Math.sqrt(6), 'p1 高频');

    // p2
    const potentials = [
      (x: number, y: number) => x * x + x * y + y * y,
      (x: number, y: number) => x * x - y * y,
      (x: number, y: number) => x * x + 2 * x * y + y * y,
      (x: number, y: number) => 2 * x * x + 3 * x * y + 2 * y * y,
    ];
    const p2 = chosen(
      potentials.map((V) => {
        const H = hessian((q) => V(q[0], q[1]), [0, 0]);
        return modes(T1, H).every(({ w2 }) => w2 > 1e-6);
      }),
    );

    // p3：上面的摆球 3m、下面的 m
    const pendulum: System = {
      masses: [3, 1],
      positions: ([a, b]) => {
        const r1 = [Math.sin(a), -Math.cos(a)];
        return [r1, [r1[0] + Math.sin(b), r1[1] - Math.cos(b)]];
      },
      potential: ([a, b]) => -3 * Math.cos(a) - (Math.cos(a) + Math.cos(b)),
    };
    const m3 = matrices(pendulum);
    const modes3 = modes(m3.T, m3.V);
    const f3 = systemDerivative(pendulum);
    const w3 = modes3.map(({ w2, a }) => agree(modeFrequency(f3, a, 1e-4, 1e-3), Math.sqrt(w2), 'p3 两种算法', 1e-6));
    const p3 = agree(w3[1] / w3[0], Math.sqrt(2 / (2 / 3)), 'p3 频率之比');

    // p4：R = 0.5、g = 9.8
    const [R, g] = [0.5, 9.8];
    const bead: System = {
      masses: [1],
      positions: ([x, y]) => [[x, y, (x * x + 2 * y * y) / (2 * R)]],
      potential: ([x, y]) => (g * (x * x + 2 * y * y)) / (2 * R),
    };
    const modes4 = modes(matrices(bead).T, matrices(bead).V);
    const high4 = modes4[1];
    // 较高的模沿 y 方向：a 的第一个分量是 0，改读 y 的过零
    const f4 = systemDerivative(bead);
    const swapped: Derivative = (t, y, out) => {
      const yy = Float64Array.from([y[1], y[0], y[3], y[2]]);
      const o = new Float64Array(4);
      f4(t, yy, o);
      out[0] = o[1];
      out[1] = o[0];
      out[2] = o[3];
      out[3] = o[2];
    };
    const w4 = modeFrequency(swapped, [high4.a[1], high4.a[0]], 1e-4, 1e-4);
    const p4 = agree(agree(w4, Math.sqrt(high4.w2), 'p4 两种算法', 1e-6), Math.sqrt((2 * g) / R), 'p4 高频');

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
