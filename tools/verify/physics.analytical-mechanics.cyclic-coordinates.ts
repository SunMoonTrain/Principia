// 独立验算 physics.analytical-mechanics.cyclic-coordinates 的 p1–p4（简单题、中等题）。
// 拉格朗日量都由各质点的直角坐标数值地算出（T 用惯性系里的速度），广义动量、∂L/∂q 用数值求导；
// 需要运动过程的按达朗贝尔原理数值解、RK4 积分，再和手推的守恒量结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.cyclic-coordinates.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import {
  agree,
  chosen,
  derivative,
  integrateTo,
  integrateUntil,
  kinetic,
  lagrangian,
  partial,
  random,
  systemDerivative,
  velocities,
  type System,
  type Vec,
} from './physics.analytical-mechanics._mech.ts';

const g = 9.8;
const rnd = random(42);

/** 在几个随机状态上（n 个广义坐标），L 对第 k 个坐标的偏导数是否都为零。 */
function isCyclic(sys: System, n: number, k: number): boolean {
  return Array.from({ length: 5 }, () => {
    const q = Array.from({ length: n }, () => 3 * rnd() + 0.5);
    const qd = Array.from({ length: n }, () => 2 * rnd() - 1);
    return Math.abs(partial((x) => lagrangian(sys, x, qd, 0), q, k));
  }).every((d) => d < 1e-8);
}

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.cyclic-coordinates',
  notes: {
    p1: '由 (r cosφ, r sinφ) 数值地算出 L，对 φ̇ 数值求偏导数；再用直角坐标的速度算 m(xẏ − yẋ) 核对。',
    p2: '四个拉格朗日量都由质点的直角坐标数值地算出，在随机状态上看 ∂L/∂q 是否恒为零。',
    p3: '小球的位置 r(t)(cosφ, sinφ)，r(t) 用两端导数为零的平滑曲线从 r1 拉到 r1/2，按达朗贝尔原理积分 φ，比较前后动能。',
    p4: '斜面 (X, 0)、滑块 (X + s cosα, −s sinα)，按达朗贝尔原理从静止积分到 s = 1 m，读出 X。',
  },
  compute() {
    // p1：m = 0.5，r = 2，φ̇ = 3；势能随便取一个只依赖 r 的
    const polar: System = {
      masses: [0.5],
      positions: ([r, phi]) => [[r * Math.cos(phi), r * Math.sin(phi)]],
      potential: ([r]) => r ** 3,
    };
    const q1 = [2, 0.7];
    const qd1 = [0.4, 3];
    const pPhi = derivative((s) => lagrangian(polar, q1, [qd1[0], qd1[1] + s], 0), 0);
    const [x, y] = polar.positions(q1, 0)[0];
    const [vx, vy] = velocities(polar, q1, qd1, 0);
    const p1 = agree(pPhi, 0.5 * (x * vy - y * vx), 'p1 p_φ 与 m(xẏ − yẋ)');

    // p2：哪些是循环坐标
    const pendulum: System = {
      masses: [1],
      positions: ([th]) => [[Math.sin(th), -Math.cos(th)]],
      potential: ([th]) => -g * Math.cos(th),
    };
    const free: System = { masses: [1], positions: ([r, phi]) => [[r * Math.cos(phi), r * Math.sin(phi)]] };
    const alpha = 0.6;
    const wedge: System = {
      masses: [2, 1],
      positions: ([X, s]) => [
        [X, 0],
        [X + s * Math.cos(alpha), -s * Math.sin(alpha)],
      ],
      potential: ([, s]) => -g * s * Math.sin(alpha),
    };
    const p2 = chosen([isCyclic(pendulum, 1, 0), isCyclic(free, 2, 0), isCyclic(free, 2, 1), isCyclic(wedge, 2, 0)]);

    // p3：穿过小孔的绳，r 从 r1 = 1 慢慢拉到 1/2
    const tau = 40;
    const radius = (t: number): number => 1 - 0.5 * (t >= tau ? 1 : (1 - Math.cos((Math.PI * t) / tau)) / 2);
    const hole: System = { masses: [1], positions: ([phi], t) => [[radius(t) * Math.cos(phi), radius(t) * Math.sin(phi)]] };
    const start: Vec = [0, 2];
    const end = integrateTo(systemDerivative(hole), start, 0, tau, 2e-3);
    const ratio = kinetic(hole, [end[0]], [end[1]], tau) / kinetic(hole, [start[0]], [start[1]], 0);
    const p3 = agree(ratio, 4, 'p3 动能之比', 1e-7);

    // p4：M = 3m、α = π/3，从静止释放，滑块沿斜面滑下 1 m
    const a4 = Math.PI / 3;
    const wedge4: System = {
      masses: [3, 1],
      positions: ([X, s]) => [
        [X, 0],
        [X + s * Math.cos(a4), -s * Math.sin(a4)],
      ],
      potential: ([, s]) => -g * s * Math.sin(a4),
    };
    const hit = integrateUntil(systemDerivative(wedge4), [0, 0, 0, 0], 0, 1e-3, 10, (_t, yy) => yy[1] - 1)!;
    const p4 = agree(Math.abs(hit.y[0]), (1 * Math.cos(a4)) / (3 + 1), 'p4 斜面移动的距离');

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
