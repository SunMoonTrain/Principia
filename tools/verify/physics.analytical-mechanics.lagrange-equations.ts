// 独立验算 physics.analytical-mechanics.lagrange-equations 的 p1–p4（简单题、中等题）。
// 运动方程都从各质点的直角坐标出发数值地解（达朗贝尔原理，或直角坐标里配乘子），不用手推的拉格朗日量；
// 再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.lagrange-equations.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import {
  accelerations,
  agree,
  bisect,
  chosen,
  constrained,
  dot,
  eulerLagrange,
  gradient,
  type ConstrainedSystem,
  type System,
  type Vec,
} from './physics.analytical-mechanics._mech.ts';

const g = 9.8;

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.lagrange-equations',
  notes: {
    p1: '取 m = 0.7、l = 1.7，对四个候选的 L 数值写出拉格朗日方程算 θ̈，和由摆球直角坐标按达朗贝尔原理算出的真实 θ̈ 在几个随机状态上比较。',
    p2: '珠子位置 (x, x²/2)，按达朗贝尔原理数值解 ẍ；再在直角坐标里配乘子（约束 y − x²/2 = 0）解一遍。',
    p3: '取 l = 1、M = m = 1，滑块 (x, 0)、摆球 (x + l sinθ, −l cosθ)，按达朗贝尔原理数值解 θ̈；再在四个直角坐标里配两个乘子（导轨、杆长）解一遍，θ̈ = ∇θ·a。',
    p4: '珠子位置 s(sinα cos ωt, sinα sin ωt, cosα)，按达朗贝尔原理数值求 s̈(s, ṡ = 0)，二分找 s̈ = 0 的 s。',
  },
  compute() {
    // p1：哪些 L 给出正确的单摆方程（l ≠ 1，才能分辨 D）
    const [m, l] = [0.7, 1.7];
    const pendulum: System = {
      masses: [m],
      positions: ([th]) => [[l * Math.sin(th), -l * Math.cos(th)]],
      potential: ([th]) => m * g * (-l * Math.cos(th)),
    };
    const candidates = [
      (th: number, w: number): number => 0.5 * m * l * l * w * w + m * g * l * Math.cos(th),
      (th: number, w: number): number => 0.5 * m * l * l * w * w - m * g * l * Math.cos(th),
      (th: number, w: number): number => 0.5 * m * l * l * w * w - m * g * l * (1 - Math.cos(th)),
      (th: number, w: number): number => 0.5 * m * l * w * w + m * g * l * Math.cos(th),
    ];
    const states = [
      [0.4, 0.3],
      [-1.2, 1.5],
      [2.5, -0.8],
    ];
    const p1 = chosen(
      candidates.map((L) =>
        states.every(([th, w]) => {
          const mine = eulerLagrange((q, qd) => L(q[0], qd[0]), [th], [w], 0)[0];
          const real = accelerations(pendulum, [th], [w], 0)[0];
          return Math.abs(mine - real) < 1e-6 * Math.max(1, Math.abs(real));
        }),
      ),
    );

    // p2：水平放置的抛物线铁丝，x = 1、ẋ = 1
    const parabola: System = { masses: [1], positions: ([x]) => [[x, 0.5 * x * x]] };
    const xdd = accelerations(parabola, [1], [1], 0)[0];
    const wire: ConstrainedSystem = { masses: [1, 1], force: () => [0, 0], constraints: [(x) => x[1] - 0.5 * x[0] * x[0]] };
    const xddMultiplier = constrained(wire, [1, 0.5], [1, 1], 0)!.a[0];
    const p2 = agree(agree(xdd, xddMultiplier, 'p2 两种算法'), -0.5, 'p2 ẍ');

    // p3：滑块下挂摆，M = m，θ0 = π/3，由静止释放；以 g/l 为单位（l = 1）
    const th0 = Math.PI / 3;
    const slider: System = {
      masses: [1, 1],
      positions: ([x, th]) => [
        [x, 0],
        [x + Math.sin(th), -Math.cos(th)],
      ],
      potential: ([, th]) => g * -Math.cos(th),
    };
    const thdd = accelerations(slider, [0, th0], [0, 0], 0)[1] / g;
    const cartesian: ConstrainedSystem = {
      masses: [1, 1, 1, 1],
      force: () => [0, -g, 0, -g],
      constraints: [(x) => x[1], (x) => (x[2] - x[0]) ** 2 + (x[3] - x[1]) ** 2 - 1],
    };
    const x0 = [0, 0, Math.sin(th0), -Math.cos(th0)];
    const a = constrained(cartesian, x0, [0, 0, 0, 0], 0)!.a;
    const angle = (x: Vec): number => Math.atan2(x[2] - x[0], -(x[3] - x[1]));
    const thddMultiplier = dot(gradient(angle, x0), a) / g; // 静止时 θ̈ = ∇θ·a
    const p3 = agree(agree(thdd, thddMultiplier, 'p3 两种算法'), (-4 * Math.sqrt(3)) / 7, 'p3 θ̈/(g/l)');

    // p4：斜向上张开的转动铁丝，α = π/4，ω = 2
    const [alpha, omega] = [Math.PI / 4, 2];
    const cone: System = {
      masses: [1],
      positions: ([s], t) => [
        [s * Math.sin(alpha) * Math.cos(omega * t), s * Math.sin(alpha) * Math.sin(omega * t), s * Math.cos(alpha)],
      ],
      potential: ([s]) => g * s * Math.cos(alpha),
    };
    const s0 = bisect((s) => accelerations(cone, [s], [0], 0.3)[0], 0.1, 20);
    const p4 = agree(s0, (g * Math.cos(alpha)) / (omega * omega * Math.sin(alpha) ** 2), 'p4 s0');

    return {
      p1: { type: 'choice', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
