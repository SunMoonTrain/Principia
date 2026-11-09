// 独立验算 physics.analytical-mechanics.noether-theorem 的 p1–p4（简单题、中等题）。
// 拉格朗日量由质点的直角坐标数值地算出；生成元由变换族对 s 数值求导得到；
// 对称性直接看 L(Q(q, s), Q̇) 在随机状态上变不变；守恒量积分一段运动核对；再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.noether-theorem.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import {
  agree,
  bisect,
  chosen,
  derivative,
  gradient,
  integrateTo,
  jacobian,
  lagrangian,
  random,
  systemDerivative,
  velocities,
  type System,
  type Vec,
} from './physics.analytical-mechanics._mech.ts';

const rnd = random(1918);

/** 广义动量 p_j = ∂L/∂q̇_j（数值求导）。 */
const momenta = (sys: System, q: Vec, qd: Vec, t: number): Vec =>
  gradient((v) => lagrangian(sys, q, v, t), qd);

/** 变换族 Q(q, s) 下拉格朗日量变不变：在几个随机状态、几个 s 上比较 L(Q, Q̇) 和 L(q, q̇)。Q̇ = (∂Q/∂q) q̇。 */
function isSymmetry(sys: System, family: (q: Vec, s: number) => Vec): boolean {
  return Array.from({ length: 4 }, () => {
    const q = [2 * rnd() - 1, 2 * rnd() - 1];
    const qd = [2 * rnd() - 1, 2 * rnd() - 1];
    return [0.3, -0.8].every((s) => {
      const J = jacobian((x) => family(x, s), q);
      const Qd = J.map((row) => row.reduce((acc, a, k) => acc + a * qd[k], 0));
      return Math.abs(lagrangian(sys, family(q, s), Qd, 0) - lagrangian(sys, q, qd, 0)) < 1e-8;
    });
  }).every(Boolean);
}

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.noether-theorem',
  notes: {
    p1: '生成元由转动族对 s 数值求导，p 由 L 对 q̇ 数值求导，I = p·K；再用 m(xẏ − yẋ) 核对。',
    p2: '四个变换族各自作用在随机状态上，比较变换前后的 L（含 Q̇ = (∂Q/∂q) q̇），只有转动不改变 L。',
    p3: '随便取一个只依赖 ρ 和 φ − kz 的势能，积分一段运动确认 p_φ + p_z/k 守恒（L_z、p_z 各自在变）；再由守恒量对 ż 二分求解。',
    p4: '质点 (x, y)、V = (x² + 4y²)/2，按达朗贝尔原理积分到 t = π/4，算 xẏ − yẋ。',
  },
  compute() {
    // p1：m = 2 的平面自由质点，(1, 2)、速度 (3, −1)
    const free: System = { masses: [2], positions: ([x, y]) => [[x, y]] };
    const rotate = ([x, y]: Vec, s: number): Vec => [x * Math.cos(s) - y * Math.sin(s), x * Math.sin(s) + y * Math.cos(s)];
    const q1 = [1, 2];
    const qd1 = [3, -1];
    const K = [0, 1].map((k) => derivative((s) => rotate(q1, s)[k], 0));
    const p = momenta(free, q1, qd1, 0);
    const I1 = p[0] * K[0] + p[1] * K[1];
    const p1 = agree(I1, 2 * (q1[0] * qd1[1] - q1[1] * qd1[0]), 'p1 I 与 L_z');

    // p2：平面各向同性振子，k = 1.3
    const osc: System = {
      masses: [1],
      positions: ([x, y]) => [[x, y]],
      potential: ([x, y]) => 0.5 * 1.3 * (x * x + y * y),
    };
    const p2 = chosen([
      isSymmetry(osc, ([x, y], s) => [x + s, y]),
      isSymmetry(osc, rotate),
      isSymmetry(osc, ([x, y], s) => [Math.exp(s) * x, Math.exp(s) * y]),
      isSymmetry(osc, ([x, y], s) => [x + s * y, y]),
    ]);

    // p3：螺旋对称，m = 1、k = 2；q = (ρ, φ, z)
    const k = 2;
    const helix: System = {
      masses: [1],
      positions: ([rho, phi, z]) => [[rho * Math.cos(phi), rho * Math.sin(phi), z]],
      potential: ([rho, phi, z]) => 0.5 * rho * rho + 0.8 * rho * Math.cos(phi - k * z) + 0.3 * Math.sin(2 * (phi - k * z)),
    };
    const conserved = (q: Vec, qd: Vec): number => {
      const pp = momenta(helix, q, qd, 0);
      return pp[1] + pp[2] / k;
    };
    const qs = [1.1, 0.2, -0.3];
    const qds = [0.4, 1.5, 0.7];
    const end = integrateTo(systemDerivative(helix), [...qs, ...qds], 0, 3, 1e-3);
    const qe = Array.from(end.subarray(0, 3));
    const qde = Array.from(end.subarray(3));
    const before = momenta(helix, qs, qds, 0);
    const after = momenta(helix, qe, qde, 3);
    const changes = Math.abs(after[1] - before[1]) > 1e-2 && Math.abs(after[2] - before[2]) > 1e-2;
    if (!changes || Math.abs(conserved(qe, qde) - conserved(qs, qds)) > 1e-8) throw new Error('p3：p_φ + p_z/k 没有守恒');
    // 题中的数：开始 ρ = 1、φ̇ = 3、ż = 4；后来 ρ = 2、φ̇ = 0.5（ρ̇ 不影响 p_φ、p_z，随便取）
    const I0 = conserved([1, 0, 0], [0.3, 3, 4]);
    const zdot = bisect((v) => conserved([2, 0.4, 0.1], [-0.2, 0.5, v]) - I0, -100, 100);
    const p3 = agree(zdot, k * (1 * 1 * 3 + 4 / k - 2 * 2 * 0.5), 'p3 ż');

    // p4：V = (x² + 4y²)/2，从 (1, 0)、速度 (0, 1) 出发到 t = π/4
    const aniso: System = { masses: [1], positions: ([x, y]) => [[x, y]], potential: ([x, y]) => 0.5 * (x * x + 4 * y * y) };
    const s4 = integrateTo(systemDerivative(aniso), [1, 0, 0, 1], 0, Math.PI / 4, 1e-4);
    const [x4, y4] = [s4[0], s4[1]];
    const [vx4, vy4] = velocities(aniso, [x4, y4], [s4[2], s4[3]], Math.PI / 4);
    const p4 = agree(x4 * vy4 - y4 * vx4, Math.sqrt(2) / 4, 'p4 L_z');

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
