// 独立验算 physics.analytical-mechanics.constraint-forces 的 p1–p4（简单题、中等题）。
// 约束力都在直角坐标里配乘子数值地解（不用讲解里的极坐标公式），需要运动过程的用 RK4 积分，
// 约束力变号的时刻用事件定位（对那一步的步长二分）求出；再和手推的公式核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.constraint-forces.ts

import { fileURLToPath } from 'node:url';
import { RK4 } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import {
  agree,
  chosen,
  constrained,
  constrainedDerivative,
  dot,
  integrateUntil,
  jacobian,
  solve,
  type ConstrainedSystem,
  type Vec,
} from './physics.analytical-mechanics._mech.ts';

const g = 9.8;

/** 半径 1、圆心在原点的光滑圆环（或圆柱面）上，受重力的质点。 */
const ring = (mass: number): ConstrainedSystem => ({
  masses: [mass, mass],
  force: () => [0, -mass * g],
  constraints: [(x) => x[0] * x[0] + x[1] * x[1] - 1],
});

/** 约束力沿半径向外的分量。 */
function outwardForce(sys: ConstrainedSystem, y: Float64Array): number {
  const x = [y[0], y[1]];
  const r = constrained(sys, x, [y[2], y[3]], 0)!;
  return dot(r.constraintForces[0], x) / Math.hypot(x[0], x[1]);
}

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.constraint-forces',
  notes: {
    p1: '直角坐标里配乘子（约束 x² + y² − l² = 0），在最低点、速度 2 m/s 时解出约束力的大小。',
    p2: 'A：约束写成 f 和 2f 各解一次乘子，λ 减半、力相同；B：(r − R)² 的梯度在约束上为零，乘子方程奇异；C：沿一段摆动乘子在变；D：冰刀的速度约束配乘子能解，积分后约束一直满足。',
    p3: '取 R = 1，直角坐标里配乘子、RK4 积分珠子从 θ0 = 2π/3 由静止下滑，定位约束力沿半径分量为零的时刻，读出那一刻的速率除以 √(gR)；再用手推的 cosθ = (2/3)cosθ0 和 v² = 2gR(cosθ − cosθ0) 核对。',
    p4: '同上，质点从球顶以 v0² = gR/2 出发，定位球面向外的推力减到零的时刻，读出 cosθ。',
  },
  compute() {
    // p1：l = 1，m = 0.5，最低点速率 2
    const r1 = constrained(ring(0.5), [0, -1], [2, 0], 0)!;
    const tension = Math.hypot(...r1.constraintForces[0]);
    const p1 = agree(tension, 0.5 * 4 + 0.5 * g, 'p1 拉力');

    // p2
    const base: ConstrainedSystem = { masses: [1, 1], force: () => [0, -g], constraints: [(x) => Math.hypot(x[0], x[1]) - 1] };
    const doubled: ConstrainedSystem = { ...base, constraints: [(x) => 2 * (Math.hypot(x[0], x[1]) - 1)] };
    const squared: ConstrainedSystem = { ...base, constraints: [(x) => (Math.hypot(x[0], x[1]) - 1) ** 2] };
    const x2 = [0.6, -0.8];
    const v2 = [0.8, 0.6];
    const rBase = constrained(base, x2, v2, 0)!;
    const rDoubled = constrained(doubled, x2, v2, 0)!;
    const optionA =
      Math.abs(rDoubled.lambda[0] - rBase.lambda[0] / 2) < 1e-6 &&
      rBase.constraintForces[0].every((f, i) => Math.abs(f - rDoubled.constraintForces[0][i]) < 1e-6);
    const optionB = constrained(squared, x2, v2, 0) !== null; // 写成 (r − R)² 后还能解出约束力吗
    const later = integrateUntil(constrainedDerivative(base), [...x2, ...v2], 0, 1e-3, 0.3, (t) => t - 0.25)!;
    const rLater = constrained(base, [later.y[0], later.y[1]], [later.y[2], later.y[3]], later.t)!;
    const optionC = Math.abs(rLater.lambda[0] - rBase.lambda[0]) > 1e-3;
    // D：冰刀 (x, y, θ)，约束 a·q̇ = 0，a = (sinθ, −cosθ, 0)；配乘子：M q̈ = λ a，a·q̈ + (∂a/∂q q̇)·q̇ = 0
    const skateA = (q: Vec): Vec => [Math.sin(q[2]), -Math.cos(q[2]), 0];
    const skate = (q: Vec, qd: Vec): Vec | null => {
      const a = skateA(q);
      const adot = jacobian(skateA, q).map((row) => dot(row, qd));
      const M = [1, 1, 0.2];
      const sol = solve(
        [
          [M[0], 0, 0, -a[0]],
          [0, M[1], 0, -a[1]],
          [0, 0, M[2], -a[2]],
          [a[0], a[1], a[2], 0],
        ],
        [0, 0, 0, -dot(adot, qd)],
      );
      return sol ? sol.slice(0, 3) : null;
    };
    const rk = new RK4(6);
    const ySkate = Float64Array.from([0, 0, 0.3, Math.cos(0.3), Math.sin(0.3), 0.7]);
    let skateOk = true;
    for (let i = 0; i < 2000 && skateOk; i++) {
      rk.step(
        (_t, y, out) => {
          const acc = skate(Array.from(y.subarray(0, 3)), Array.from(y.subarray(3)));
          if (!acc) {
            skateOk = false;
            return;
          }
          for (let k = 0; k < 3; k++) {
            out[k] = y[3 + k];
            out[3 + k] = acc[k];
          }
        },
        i * 1e-3,
        ySkate,
        1e-3,
      );
    }
    const drift = Math.abs(dot(skateA(Array.from(ySkate.subarray(0, 3))), Array.from(ySkate.subarray(3, 6))));
    const optionD = !(skateOk && drift < 1e-8); // 「处理不了速度之间的约束」
    const p2 = chosen([optionA, optionB, optionC, optionD]);

    // p3：竖直圆环（R = 1），θ0 = 2π/3（从最低点量起），由静止释放；圆环的力为零时的速率，以 √(gR) 为单位
    const th0 = (2 * Math.PI) / 3;
    const sys3 = ring(1);
    const hit3 = integrateUntil(constrainedDerivative(sys3), [Math.sin(th0), -Math.cos(th0), 0, 0], 0, 1e-3, 5, (_t, y) =>
      outwardForce(sys3, y),
    )!;
    const cos3 = (2 / 3) * Math.cos(th0);
    agree(-hit3.y[1], cos3, 'p3 力为零处的 cosθ');
    const p3 = agree(Math.hypot(hit3.y[2], hit3.y[3]) / Math.sqrt(g), Math.sqrt(2 * (cos3 - Math.cos(th0))), 'p3 速率');

    // p4：光滑半球（R = 1）顶点出发，v0² = gR/2；θ 从竖直向上量起
    const sys4 = ring(1);
    const hit4 = integrateUntil(constrainedDerivative(sys4), [0, 1, Math.sqrt(g / 2), 0], 0, 1e-3, 5, (_t, y) =>
      outwardForce(sys4, y),
    )!;
    const p4 = agree(hit4.y[1], 5 / 6, 'p4 cosθ');

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
