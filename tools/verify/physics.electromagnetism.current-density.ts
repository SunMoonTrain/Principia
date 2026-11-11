// 独立验算 physics.electromagnetism.current-density 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的公式 R = ρL/A、J = σE、v = J/(ne)、同轴电缆的漏电电阻 ln(b/a)/(2πσL)；
// 二是不用这些式子：加上电势差，由 E、J 求出电流再算 V/I；把电阻沿电流方向切成薄层、数值积分 dR 相加；选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.current-density.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { E_CHARGE, type V3, agree, check, chosen, cubeFlux, integrate, scale } from './physics.electromagnetism._es.ts';

export const verification: Verification = {
  lesson: 'physics.electromagnetism.current-density',
  notes: {
    p1: 'R = ρL/A；和加上 1 V 电势差、E = V/L、J = E/ρ、I = JA 算出的 V/I 核对。',
    p2: '逐条用例子：A 电子带负电，J = n(−e)v 和漂移方向相反（错）；B 截面积 A(x) = A₀(1 + x²) 的铜导线，恒定电流处处同一个 I，J = I/A，漂移速度 J/(ne) 在细处大（同一种铜 n 相同；对）；C 球里 ρ 均匀增加、J = −(ρ̇/3)r，小立方体的净通量数值积分为负，即净电流向里（对）；D 体积不变拉长 2 倍，ρL/A 变成 4 倍，同样的电势差下电流是 1/4（对）；E 反例：匀强的 J 穿过一个闭合的立方体面，净通量数值积分为零而 J 处处不为零（错）。',
    p3: 'v = σ(V/L)/(ne)；和 R = L/(σA)、I = V/R、v = I/(neA) 核对（直径约掉）。e 取 CODATA 值。',
    p4: 'R = ln(b/a)/(2πσL)；和沿半径切成薄圆筒、dR = dr/(σ·2πrL) 数值积分核对。',
  },
  compute() {
    // p1
    const rho = 1.68e-8;
    const L1 = 100;
    const A1 = 1.5e-6;
    const V1 = 1;
    const I1 = (V1 / L1 / rho) * A1;
    const p1 = agree(V1 / I1, (rho * L1) / A1, 'p1');

    // p2
    const vDrift: V3 = [1, 0, 0]; // 向东
    const J: V3 = scale(-E_CHARGE * 1e28, vDrift);
    const A = J[0] > 0;
    const Ix = 2;
    const nCu = 8.5e28;
    const area = (x: number) => 1e-6 * (1 + x * x);
    const vd = (x: number) => Ix / area(x) / (nCu * E_CHARGE);
    const B = vd(0) > vd(1.5);
    check(B, 'p2 B：x = 0 处细、漂移速度大');
    const rhoDot = 3;
    const Jgrow = (p: V3): V3 => scale(-rhoDot / 3, p);
    const fluxC = cubeFlux(Jgrow, [0.1, -0.2, 0.05], 0.2);
    check(Math.abs(fluxC - -rhoDot * 0.2 ** 3) < 1e-12, 'p2 C：净通量 = −ρ̇V');
    const C = fluxC < 0;
    const R0 = (1 * 1) / 1;
    const R2 = (1 * 2) / (1 / 2);
    const D = Math.abs(1 / R2 / (1 / R0) - 1 / 4) < 1e-12;
    const fluxE = cubeFlux(() => [3, -1, 2], [0, 0, 0], 1);
    const E = !(Math.abs(fluxE) < 1e-12); // 净电流为零、J 却处处不为零：说法不成立
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const sigma = 5.96e7;
    const V3v = 0.1;
    const L3 = 2.0;
    const d3 = 1.0e-3;
    const n = 8.5e28;
    const area3 = (Math.PI * d3 * d3) / 4;
    const I3 = V3v / (L3 / (sigma * area3));
    const p3 = agree((I3 / (n * E_CHARGE * area3)) * 1e3, ((sigma * (V3v / L3)) / (n * E_CHARGE)) * 1e3, 'p3');

    // p4
    const a = 0.5e-3;
    const b = 2.0e-3;
    const s4 = 1.0e-10;
    const L4 = 100;
    const Rnum = integrate((r) => 1 / (s4 * 2 * Math.PI * r * L4), a, b, 64, 16);
    const p4 = agree(Rnum, Math.log(b / a) / (2 * Math.PI * s4 * L4), 'p4');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
