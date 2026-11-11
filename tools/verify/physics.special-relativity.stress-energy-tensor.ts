// 独立验算 physics.special-relativity.stress-energy-tensor 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（T = mn₀UU、理想流体的 T、T′ = ΛTΛᵀ）；
// 二是数粒子：用雷达法量运动的尘埃有多密、光钟量 γ，按「粒子流 × 每个粒子带的量」算流密度；光子气体按方向把各束光子加起来。
// 单独运行：npx tsx tools/verify/physics.special-relativity.stress-energy-tensor.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, clockRate, gamma, restPoint } from './physics.special-relativity._relativity.ts';
import { ETA, boostDir, mul, photonGasT, transpose, type M4 } from './physics.special-relativity._em.ts';

const C = 299792458;

/** 尘埃（m = n₀ = c = 1）以速度 u = (ux, uy, uz) 运动时的 T^{μν} = UU。 */
function dustT(u: [number, number, number]): M4 {
  const g = 1 / Math.sqrt(1 - (u[0] ** 2 + u[1] ** 2 + u[2] ** 2));
  const U = [g, g * u[0], g * u[1], g * u[2]];
  return U.map((a) => U.map((b) => a * b));
}

/** 理想流体（c = 1）以 β 沿 x 轴运动时的 T^{μν}：静止系的 diag(ε, p, p, p) 用 Λ(−β) 变过来。 */
function fluidT(eps: number, p: number, beta: number): M4 {
  const L = boostDir(-beta);
  return mul(mul(L, [[eps, 0, 0, 0], [0, p, 0, 0], [0, 0, p, 0], [0, 0, 0, p]]), transpose(L));
}

/** η_{μν}T^{μν}：对两个指标都求和，η 只有对角元。 */
const contract = (T: M4): number => T.reduce((s, row, a) => s + row.reduce((t, x, b) => t + ETA[a][b] * x, 0), 0);

export const verification: Verification = {
  lesson: 'physics.special-relativity.stress-energy-tensor',
  notes: {
    p1: '取 m = n₀ = c = 1。数粒子：尘埃静止系里间距为 1 的粒子，用雷达法量出在 S 里同一时刻的间距（得数密度），光钟给每个粒子的 γ（能量 γmc²），T^{01} = 能流密度 / c = n·u·E；和 mn₀U⁰U¹ 核对。',
    p2: 'A：尘埃沿 x 轴以 0.3c、0.6c、0.9c 运动时 T^{11} ≠ 0，静止时 0（题面写明了沿 x 轴；沿 y 轴运动时 T^{11} = 0）；B：理想流体 ε = 1、p = 0.2 以 0.5c 运动时 T^{01} ≠ 0（反例）；C：光子 p = E/c，能流 nEc = 1 W/m²，动量密度 nE/c = 1/c²（国际单位制）；D：尘埃以 5 个不同的速度运动，η_{μν}T^{μν} 都等于 mn₀c²；E：静止的理想流体 T^{12} = 0 ≠ p（反例）。',
    p3: '光子气体按方向 μ = cos θ 均匀分布的各束光子加起来（数流和四维动量都用雷达法变换），对 β 二分使 T^{00} = 2ε；和理想流体的式子 γ²(ε + β²ε/3) = 2ε 解出的 √(3/7) 核对。',
    p4: '数光子：任取光子能量 hν（2 eV 和 0.5 eV 两种），每秒射到平板上 IA/(hν) 个，每个反射时交出动量 2hν/c；和入射、反射两束光的动量流密度 2T^{11} = 2I/c 乘面积核对。',
  },
  compute() {
    // p1
    const beta1 = 0.6;
    const spacing = restPoint(beta1, 1, 1).x - restPoint(beta1, 1, 0).x;
    const n1 = 1 / spacing;
    const energy1 = 1 / clockRate(beta1, 1);
    const p1 = agree(n1 * beta1 * energy1, dustT([beta1, 0, 0])[0][1], 'p1', 1e-9);

    // p2
    const A2 = [0.3, 0.6, 0.9].every((b) => Math.abs(dustT([b, 0, 0])[1][1]) > 1e-3) && dustT([0, 0, 0])[1][1] === 0;
    check(dustT([0, 0.6, 0])[1][1] === 0, 'p2 A：沿 y 轴运动时 T^{11} = 0，所以题面要写「沿 x 轴」');
    const moving = fluidT(1, 0.2, 0.5);
    const B2 = Math.abs(moving[0][1]) < 1e-12;
    check(Math.abs(moving[0][1] - gamma(0.5) ** 2 * 1.2 * 0.5) < 1e-12, 'p2 B：T^{01} = γ²(ε + p)β');
    const hnu = 2 * 1.602176634e-19;
    const nPhotons = 1 / (hnu * C);
    const C2 = Math.abs((nPhotons * hnu) / C - 1 / C ** 2) < 1e-12 / C ** 2;
    const D2 = [
      [0, 0, 0],
      [0.5, 0, 0],
      [0, 0.7, 0],
      [0.3, -0.4, 0.5],
      [0.9, 0.1, 0],
    ].every((u) => Math.abs(contract(dustT(u as [number, number, number])) - 1) < 1e-9);
    const E2 = Math.abs(fluidT(1, 0.2, 0)[1][2] - 0.2) < 1e-12;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3（ε = 1）
    const bGas = bisect((b) => photonGasT(b)[0][0] - 2, 0, 0.99);
    const bFluid = bisect((b) => fluidT(1, 1 / 3, b)[0][0] - 2, 0, 0.99);
    agree(bGas, bFluid, 'p3 两种算法', 1e-10);
    check(Math.abs(photonGasT(0.4)[1][1] - fluidT(1, 1 / 3, 0.4)[1][1]) < 1e-12, 'p3：光子气体的 T^{11} 和理想流体的式子一致');
    const p3 = agree(bGas, Math.sqrt(3 / 7), 'p3', 1e-10);

    // p4
    const I = 1361;
    const area = 100;
    const byPhotons = [2, 0.5].map((eV) => {
      const e = eV * 1.602176634e-19;
      return ((I * area) / e) * ((2 * e) / C);
    });
    agree(byPhotons[0], byPhotons[1], 'p4：结果和光子能量无关', 1e-12);
    // 平板前面是入射、反射两束光：每束 T^{μν} = w(1, n̂)(1, n̂)，能流密度 cw = I，n̂ = ±x̂，T^{11} 都是 w
    const w = I / C;
    const T11 = [1, -1].reduce((s, nx) => s + w * nx * nx, 0);
    const p4 = agree(byPhotons[0], T11 * area, 'p4', 1e-12);

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
