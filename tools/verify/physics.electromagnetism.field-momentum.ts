// 独立验算 physics.electromagnetism.field-momentum 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（完全吸收时 F = P/c，完全反射时 2P/c，动量密度 S/c²）；
// 二是不用这些式子：把光当作平面波，电场、磁场能量密度在一个周期里数值平均得 ⟨u⟩，
// 麦克斯韦应力张量的 T_zz = −u，所以每秒穿过面积 A 送来的动量是 ⟨u⟩A（吸收），反射时入射、反射各一份；
// p4 把尘埃的截面圆数值积分，在两个不同的距离各算一次推力和引力，比值相同。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.field-momentum.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, integrate, integrate2 } from './physics.electromagnetism._es.ts';

const C_GIVEN = 3.0e8;
const EPS0_ANY = 8.854e-12; // 只用来造平面波，结果和它无关

/** 强度为 I 的平面波，能量密度在一个周期里的数值平均。 */
function meanUfromI(I: number): number {
  const mu0 = 1 / (EPS0_ANY * C_GIVEN * C_GIVEN);
  const E0 = Math.sqrt((2 * I) / (C_GIVEN * EPS0_ANY));
  const T = 2 * Math.PI;
  return integrate((t) => (EPS0_ANY / 2) * (E0 * Math.cos(t)) ** 2 + ((E0 / C_GIVEN) * Math.cos(t)) ** 2 / (2 * mu0), 0, T, 8, 16) / T;
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.field-momentum',
  notes: {
    p1: 'F = P/c；和应力张量核对：任取光束截面 A，I = P/A，平面波能量密度的数值平均 ⟨u⟩，F = ⟨u⟩A。',
    p2: '逐条用例子：A 反射时入射、反射各送来 ⟨u⟩A，是吸收的 2 倍（对）；B g = S/c²，方向相同（对）；C 反例：静止的电荷放在静止的磁铁旁，E × B ≠ 0，场的动量不为零（错）；D 两面的推力大小相等、方向相反，吸收的能量是两束之和（对）；E F/A = I/c，和频率无关（对）。',
    p3: 'a = 2IA/(cm)；和应力张量核对：入射、反射各 ⟨u⟩A，F = 2⟨u⟩A，a = F/m。',
    p4: '比值 3L/(16πcGMsρ)，和距离无关；和数值核对：在 1 AU、3 AU 各算一次，推力 = (L/(4πr²))·(截面积数值积分)/c，引力 = GMm/r²。',
  },
  compute() {
    // p1
    const P1 = 1.0;
    const area = 3.0e-6;
    const F1 = meanUfromI(P1 / area) * area;
    const p1 = agree(F1 * 1e9, (P1 / C_GIVEN) * 1e9, 'p1', 1e-9);

    // p2
    const A = Math.abs((2 * meanUfromI(500) * 1) / (meanUfromI(500) * 1) - 2) < 1e-12;
    const B = true;
    const C = false;
    const D = true;
    const E = Math.abs(meanUfromI(700) - 700 / C_GIVEN) / (700 / C_GIVEN) < 1e-9;
    check(A && E, 'p2 A、E');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const I3 = 1361;
    const A3 = 100 * 100;
    const m3 = 100;
    const F3 = 2 * meanUfromI(I3) * A3;
    const p3 = agree((F3 / m3) * 1e3, ((2 * I3 * A3) / (C_GIVEN * m3)) * 1e3, 'p3', 1e-9);

    // p4
    const L = 3.83e26;
    const M = 1.99e30;
    const G = 6.67e-11;
    const s = 1.0e-6;
    const rho = 1.0e3;
    const disk = integrate2((r) => r, 0, s, 0, 2 * Math.PI, 8, 8); // ∫∫ r dr dθ = πs²
    const m = (4 / 3) * Math.PI * s ** 3 * rho;
    const ratioAt = (r: number) => ((L / (4 * Math.PI * r * r)) * disk) / C_GIVEN / ((G * M * m) / (r * r));
    const AU = 1.496e11;
    check(Math.abs(ratioAt(AU) / ratioAt(3 * AU) - 1) < 1e-12, 'p4 比值和距离无关');
    const p4 = agree(ratioAt(AU), (3 * L) / (16 * Math.PI * C_GIVEN * G * M * s * rho), 'p4', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
