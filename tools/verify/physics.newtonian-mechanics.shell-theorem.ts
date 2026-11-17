// 独立验算 physics.newtonian-mechanics.shell-theorem 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的结论（球壳内引力为零、球外如同质量集中在球心、均匀球体内引力和 r 成正比）；
// 二是不用球壳定理：对球体按 (r′, θ) 做二重数值积分求引力势能，再数值求导得到引力（_nm.ts 的 spherePotential、
// sphereField，只用万有引力定律和叠加）。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.shell-theorem.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisectN, check, chosen, integrate, sphereField, spherePotential } from './physics.newtonian-mechanics._nm.ts';

const G = 6.67e-11;
const uniform = () => 1;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.shell-theorem',
  notes: {
    p1: '均匀球体内 g ∝ r，g 减半在 r = R/2，深 R/2；和数值核对：R = 1 的均匀球体，二分出数值求得的引力等于球面上一半的 r。',
    p2: '逐条用例子（G = 1）：A 均匀厚球壳（0.95 ≤ r′ ≤ 1）里 r = 0.3、0.6 处数值求得的引力约为 0（对）；B 质量相同、半径 1 和 2 的均匀球体在 r = 3 处的引力相同（错）；C 球壳外 r = 3 处的势能比 r = 2 处大（错）；D 均匀球体内 r = 0.3 处的引力小于 r = 0.6 处（对）；E 均匀球体在 r = 1.5、3 处的引力都等于 M/r²，即对外如同质点，再由牛顿第三定律逐个体元相加，两个球之间的力就是质点之间的力（对）。',
    p3: 'g = (4/3)πGρR；和数值核对：ρ = 2.0×10³ kg/m³、R = 10 km 的均匀球体，在球面外侧用单侧差分对数值势能求导。',
    p4: 'g_核/g = (M_核/M)(R/R_核)²；和数值核对：取两种分层模型（地核均匀、地幔均匀；地核密度随 r 线性减小、地幔均匀），总质量和地核质量都按题给，数值求出地核表面和地面的引力之比，两种模型相同。',
  },
  compute() {
    // p1（km）
    const gSurf = sphereField(uniform, 1, 1, [], -1);
    const rHalf = bisectN((r) => sphereField(uniform, 1, r) - gSurf / 2, 0.2, 0.9, 40);
    const p1 = agree(((1 - rHalf) * 6.37e6) / 1000, 6.37e6 / 2 / 1000, 'p1 g 减半的深度', 1e-6);

    // p2
    const shell = (rp: number) => (rp >= 0.95 ? 1 : 0);
    const gOut = sphereField(shell, 1, 2, [0.95]);
    const optA = Math.abs(sphereField(shell, 1, 0.3, [0.95])) < 1e-8 * gOut && Math.abs(sphereField(shell, 1, 0.6, [0.95])) < 1e-8 * gOut;
    const big = () => 1 / 8; // 半径 2、质量和半径 1 的相同
    const optB = sphereField(big, 2, 3) > sphereField(uniform, 1, 3) * (1 + 1e-6);
    check(Math.abs(sphereField(big, 2, 3) / sphereField(uniform, 1, 3) - 1) < 1e-7, 'p2 B 两个引力相等');
    const optC = spherePotential(shell, 1, 3, [0.95]) < spherePotential(shell, 1, 2, [0.95]);
    const optD = sphereField(uniform, 1, 0.3) < sphereField(uniform, 1, 0.6);
    const Mu = (4 * Math.PI) / 3;
    const optE = [1.5, 3].every((r) => Math.abs(sphereField(uniform, 1, r) / (Mu / (r * r)) - 1) < 1e-7);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m/s²）
    const rho3 = 2.0e3;
    const R3 = 1.0e4;
    const g3 = G * sphereField(() => rho3, R3, R3, [], 1);
    const p3 = agree(g3, (4 / 3) * Math.PI * G * rho3 * R3, 'p3 小行星表面的重力加速度', 1e-6);

    // p4
    const R = 6.37e6;
    const Rc = 3.48e6;
    const Mc = 1.94e24;
    const M = 5.97e24;
    const x = Rc / R; // 以地球半径为长度单位
    const mantle = (M - Mc) / ((4 / 3) * Math.PI * (1 - x ** 3));
    const coreUniform = Mc / ((4 / 3) * Math.PI * x ** 3);
    const model1 = (rp: number) => (rp < x ? coreUniform : mantle);
    // 地核密度 a(1.5 − r′/x)：∫₀ˣ a(1.5 − r′/x)4πr′² dr′ = a·4π·x³(0.5 − 0.25) = Mc
    const a = Mc / (4 * Math.PI * x ** 3 * 0.25);
    const model2 = (rp: number) => (rp < x ? a * (1.5 - rp / x) : mantle);
    const ratio = (rho: (rp: number) => number) => sphereField(rho, 1, x, [x], -1) / sphereField(rho, 1, 1, [x], -1);
    const r1 = ratio(model1);
    const r2 = ratio(model2);
    agree(r1, r2, 'p4 两种分层模型', 1e-6);
    check(Math.abs(integrate((rp) => model2(rp) * 4 * Math.PI * rp * rp, 0, x) / Mc - 1) < 1e-12, 'p4 模型 2 的地核质量');
    const p4 = agree(r1, (Mc / M) * (R / Rc) ** 2, 'p4 地核表面和地面的重力加速度之比', 1e-6);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
