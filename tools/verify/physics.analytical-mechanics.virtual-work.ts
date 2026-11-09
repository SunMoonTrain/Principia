// 独立验算 physics.analytical-mechanics.virtual-work 的 p1–p4（简单题、中等题）。
// 广义力按定义 Q_j = Σ F_i·∂r_i/∂q_j 数值求导；平衡和加速度另用牛顿定律（杆是二力杆、滑轮两边拉力）列方程组解一遍，两者核对。
// 理想约束：直角坐标里配乘子解出真实的约束力，再在随机的虚位移（约束梯度的零空间）上算虚功。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.virtual-work.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import {
  accelerations,
  agree,
  chosen,
  constrained,
  derivative,
  dot,
  gradient,
  jacobian,
  random,
  solve,
  type ConstrainedSystem,
  type Vec,
} from './physics.analytical-mechanics._mech.ts';

const rnd = random(7);
const randomVec = (n: number): Vec => Array.from({ length: n }, () => 2 * rnd() - 1);

/** 把 w 投影到约束梯度 G 的零空间里：得到一个和此刻（时间冻结）的约束相容的虚位移。 */
function virtualDisplacement(G: Vec[], w: Vec): Vec {
  const GGt = G.map((gi) => G.map((gj) => dot(gi, gj)));
  const coef = solve(GGt, G.map((gi) => dot(gi, w)))!;
  return w.map((wi, k) => wi - G.reduce((s, gi, i) => s + coef[i] * gi[k], 0));
}

/** 约束力 Fc 在几个随机虚位移上的虚功的最大绝对值（相对 |Fc|）。 */
function worstVirtualWork(Fc: Vec, G: Vec[]): number {
  const size = Math.sqrt(dot(Fc, Fc));
  return Math.max(
    ...Array.from({ length: 5 }, () => {
      const dr = virtualDisplacement(G, randomVec(Fc.length));
      return Math.abs(dot(Fc, dr)) / (size * Math.sqrt(dot(dr, dr)));
    }),
  );
}

const g = 9.8;

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.virtual-work',
  notes: {
    p1: '数值求 ∂r/∂φ（r = (r cosφ, r sinφ)），Q_φ = F·∂r/∂φ。',
    p2: '光滑球面、刚性杆、转动的光滑铁丝：配乘子解出真实的约束力，在随机虚位移上虚功为零；粗糙面：支持力加滑动摩擦力，沿运动方向的虚位移上虚功是 −μN|δx| ≠ 0。',
    p3: '以 θ = ∠BAC 为广义坐标，数值求 Q_θ(F) = 0 解出 F；再把两根杆当二力杆，对 B、C 两点列受力平衡解一遍。',
    p4: '广义坐标取 m1 的位置和 m2 在动滑轮下的位置，由三个物块的位置按达朗贝尔原理数值解 ÿ1；再用五个未知量（三个加速度、两段绳的拉力）的牛顿方程组解一遍。',
  },
  compute() {
    // p1：极坐标里的广义力 Q_φ
    const J = jacobian(([r, phi]) => [r * Math.cos(phi), r * Math.sin(phi)], [3, 0]);
    const p1 = agree(J[0][1] * 1 + J[1][1] * 2, 3 * 2, 'p1 Q_φ');

    // p2：哪些是理想约束
    // A 光滑固定球面上的质点（受重力，有切向速度）
    const sphere: ConstrainedSystem = {
      masses: [1, 1, 1],
      force: () => [0, 0, -g],
      constraints: [(x) => dot(x, x) - 4],
    };
    const xA = [1.2, -0.4, Math.sqrt(4 - 1.2 ** 2 - 0.4 ** 2)];
    const vA = [0.3, 0.9, -(0.3 * 1.2 - 0.9 * 0.4) / xA[2]];
    const rA = constrained(sphere, xA, vA, 0)!;
    const idealA = worstVirtualWork(rA.constraintForces[0], [gradient((x) => sphere.constraints[0](x, 0), xA)]) < 1e-8;
    // B 刚性轻杆连着两个质点（受重力，速度随意但和杆长不变相容）
    const rod: ConstrainedSystem = {
      masses: [1, 1, 1, 2, 2, 2],
      force: () => [0, 0, -g, 0, 0, -2 * g],
      constraints: [(x) => (x[0] - x[3]) ** 2 + (x[1] - x[4]) ** 2 + (x[2] - x[5]) ** 2 - 1],
    };
    const xB = [0, 0, 0, 0.6, 0.8, 0];
    const GB = [gradient((x) => rod.constraints[0](x, 0), xB)];
    const vB = virtualDisplacement(GB, [0.5, -1, 0.2, 1.1, 0.3, -0.7]);
    const rB = constrained(rod, xB, vB, 0)!;
    const idealB = worstVirtualWork(rB.constraintForces[0], GB) < 1e-8;
    // C 木块在粗糙水平面上向右滑：地面的力 = 支持力 + 滑动摩擦力 −μN；地面允许任意水平虚位移
    const floor: ConstrainedSystem = { masses: [1, 1], force: () => [0, -g], constraints: [(x) => x[1]] };
    const rC = constrained(floor, [0, 0], [2, 0], 0)!;
    const normal = rC.constraintForces[0];
    const mu = 0.3;
    const contactC = [normal[0] - mu * Math.abs(normal[1]), normal[1]];
    const idealC = worstVirtualWork(contactC, [gradient((x) => floor.constraints[0](x, 0), [0, 0])]) < 1e-8;
    // D 匀速转动的光滑直铁丝（水平面内过原点，和 x 轴夹角 ωt）
    const omega = 1.3;
    const wire: ConstrainedSystem = {
      masses: [1, 1],
      force: () => [0, 0],
      constraints: [(x, t) => -Math.sin(omega * t) * x[0] + Math.cos(omega * t) * x[1]],
    };
    const tD = 0.4;
    const s = 0.8;
    const xD = [s * Math.cos(omega * tD), s * Math.sin(omega * tD)];
    const vD = [0.5 * Math.cos(omega * tD) - s * omega * Math.sin(omega * tD), 0.5 * Math.sin(omega * tD) + s * omega * Math.cos(omega * tD)];
    const rD = constrained(wire, xD, vD, tD)!;
    const idealD = worstVirtualWork(rD.constraintForces[0], [gradient((x) => wire.constraints[0](x, tD), xD)]) < 1e-8;
    const p2 = chosen([idealA, idealB, idealC, idealD]);

    // p3：两杆铰接，B 处挂重物，C 端水平力 F 指向 A，∠BAC = π/6；取 l = 1、mg = 1
    const theta = Math.PI / 6;
    const B = (th: number): Vec => [Math.cos(th), Math.sin(th)];
    const C = (th: number): Vec => [2 * Math.cos(th), 0];
    // 虚功：Q_θ = (0, −mg)·∂B/∂θ + (−F, 0)·∂C/∂θ = 0，对 F 是一次的
    const dBy = derivative((th) => B(th)[1], theta);
    const dCx = derivative((th) => C(th)[0], theta);
    const fVirtual = (-1 * dBy) / dCx; // −mg·dB_y + (−F)·dC_x = 0
    // 牛顿：杆 AB、BC 的拉力 T1、T2（受压为负），B 点受力平衡；C 点水平方向 F = T2·(B − C)_x / l
    const uAB = B(theta);
    const uCB = [B(theta)[0] - C(theta)[0], B(theta)[1] - C(theta)[1]];
    const [, T2] = solve(
      [
        [-uAB[0], -uCB[0]],
        [-uAB[1], -uCB[1]],
      ],
      [0, 1],
    )!; // −T1 uAB − T2 uCB + (0, −mg) = 0
    const fNewton = T2 * uCB[0];
    const p3 = agree(agree(fVirtual, fNewton, 'p3 虚功与牛顿定律'), Math.sqrt(3) / 2, 'p3 F/(mg)');

    // p4：双阿特伍德机，m1 = 4、m2 = 1、m3 = 3（单位 m），向下为正
    const [m1, m2, m3] = [4, 1, 3];
    const atwood = {
      masses: [m1, m2, m3],
      // q = [y1, u]：动滑轮在 5 − y1，m2 在动滑轮下 u 处，m3 在动滑轮下 3 − u 处
      positions: ([y1, u]: Vec): Vec[] => [[y1], [5 - y1 + u], [5 - y1 + 3 - u]],
      potential: ([y1, u]: Vec): number => -g * (m1 * y1 + m2 * (5 - y1 + u) + m3 * (8 - y1 - u)),
    };
    const aDalembert = accelerations(atwood, [1, 1], [0, 0], 0)[0] / g;
    // 牛顿：未知量 [a1, a2, a3, T1, T2]
    const newton = solve(
      [
        [m1, 0, 0, 1, 0],
        [0, m2, 0, 0, 1],
        [0, 0, m3, 0, 1],
        [0, 0, 0, 1, -2],
        [2, 1, 1, 0, 0],
      ],
      [m1 * g, m2 * g, m3 * g, 0, 0],
    )!;
    const p4 = agree(agree(aDalembert, newton[0] / g, 'p4 达朗贝尔与牛顿'), 1 / 7, 'p4 a1/g');

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
