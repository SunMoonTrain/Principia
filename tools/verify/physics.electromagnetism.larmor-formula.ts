// 独立验算 physics.electromagnetism.larmor-formula 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的拉莫尔公式 P = q²a²/(6πε₀c³)；
// 二是不用它：辐射场取李纳-维谢尔场里此刻静止时的辐射项 E = q/(4πε₀c²R) · R̂ × (R̂ × a)，
// 能流 S = ε₀cE²（|B| = |E|/c、两者垂直），在半径 R 的球面上数值积分（对 θ 用高斯-勒让德，绕加速度方向对称）。
// p3 另用龙格-库塔法积分电子的运动，同时累加辐射掉的能量，到走完 2.0 cm 为止；动能用 ½mv² 算，不用 eU。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.larmor-formula.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, cross, integrate, norm, rk4Until, scale, type V3 } from './physics.electromagnetism._es.ts';

const E_GIVEN = 1.602e-19;
const EPS0_GIVEN = 8.854e-12;
const C_GIVEN = 3.0e8;
const ME_GIVEN = 9.109e-31;
const MP_GIVEN = 1.673e-27;

/** 此刻静止、加速度为 a（沿 z）的电荷在 (R, θ) 处的辐射电场。 */
function radField(q: number, a: number, R: number, theta: number): V3 {
  const n: V3 = [Math.sin(theta), 0, Math.cos(theta)];
  const acc: V3 = [0, 0, a];
  return scale(q / (4 * Math.PI * EPS0_GIVEN * C_GIVEN * C_GIVEN * R), cross(n, cross(n, acc)));
}

/** 辐射功率：S = ε₀cE² 在半径 R 的球面上积分。 */
function radiatedPower(q: number, a: number, R = 1.0): number {
  return integrate((th) => EPS0_GIVEN * C_GIVEN * norm(radField(q, a, R, th)) ** 2 * 2 * Math.PI * R * R * Math.sin(th), 0, Math.PI, 16, 16);
}

const larmor = (q: number, a: number) => (q * q * a * a) / (6 * Math.PI * EPS0_GIVEN * C_GIVEN ** 3);

export const verification: Verification = {
  lesson: 'physics.electromagnetism.larmor-formula',
  notes: {
    p1: 'P = e²a²/(6πε₀c³)；和数值核对：辐射场 E = e/(4πε₀c²R)·R̂ × (R̂ × a) 的能流 ε₀cE² 在球面上积分。',
    p2: '逐条用例子：A 加速度加倍，球面积分的功率变成 4 倍（对）；B 加速度为零时辐射项处处为零（对）；C 沿加速度方向 R̂ × (R̂ × a) = 0，那个方向没有辐射（错）；D 同样的力下电子和质子的功率之比 (m_p/m_e)² ≈ 3.4 × 10⁶（对）；E 辐射场在 R 和 2R 处之比是 2，按 1/R 减小（错）。',
    p3: 'W/K = [e²a²/(6πε₀c³)]·√(2d/a)/(eU)，a = eU/(md)；和龙格-库塔法核对：积分 dx/dt = v、dv/dt = eU/(md)、dW/dt = 球面积分得到的辐射功率，到 x = d 为止，动能取 ½mv²。',
    p4: '(m_p/m_e)²；和数值核对：取同一个力，分别算两者的加速度，再用球面积分求辐射功率，相除。',
  },
  compute() {
    // p1
    const a1 = 1.0e18;
    const p1 = agree(radiatedPower(E_GIVEN, a1) / 1e-18, larmor(E_GIVEN, a1) / 1e-18, 'p1', 1e-9);

    // p2
    const A = Math.abs(radiatedPower(E_GIVEN, 2e18) / radiatedPower(E_GIVEN, 1e18) - 4) < 1e-9;
    const B = norm(radField(E_GIVEN, 0, 1, 0.7)) === 0;
    const C = norm(radField(E_GIVEN, 1e18, 1, 0)) > norm(radField(E_GIVEN, 1e18, 1, Math.PI / 2));
    const F = 1e-15;
    const ratio = radiatedPower(E_GIVEN, F / ME_GIVEN) / radiatedPower(E_GIVEN, F / MP_GIVEN);
    const D = ratio > 1e6;
    const E = Math.abs(norm(radField(E_GIVEN, 1e18, 1, 1)) / norm(radField(E_GIVEN, 1e18, 2, 1)) - 4) < 1e-9;
    check(Math.abs(norm(radField(E_GIVEN, 1e18, 1, 1)) / norm(radField(E_GIVEN, 1e18, 2, 1)) - 2) < 1e-12, 'p2 E：按 1/R 减小');
    check(A && B && !C && D && !E, 'p2');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const U = 1000;
    const d = 0.02;
    const acc3 = (E_GIVEN * U) / (ME_GIVEN * d);
    const P3 = radiatedPower(E_GIVEN, acc3);
    const hit = rk4Until((_t, y) => [y[1], acc3, P3], [0, 0, 0], 0, 1e-12, 1e7, (_t, y) => y[0] - d);
    const K = 0.5 * ME_GIVEN * hit.y[1] ** 2;
    const exact3 = (larmor(E_GIVEN, acc3) * Math.sqrt((2 * d) / acc3)) / (E_GIVEN * U);
    const p3 = agree((hit.y[2] / K) / 1e-15, exact3 / 1e-15, 'p3', 1e-8);

    // p4
    const p4 = agree(ratio / 1e6, (MP_GIVEN / ME_GIVEN) ** 2 / 1e6, 'p4', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
