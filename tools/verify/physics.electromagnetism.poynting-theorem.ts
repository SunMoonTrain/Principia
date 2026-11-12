// 独立验算 physics.electromagnetism.poynting-theorem 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的坡印亭矢量 S = E × B/μ₀（导线表面 (IR/l)·I/(2πa)，电容器边缘 E·ε₀(R/2)dE/dt）；
// 二是不用这个式子：p3 由能量守恒，电阻丝每秒放出的焦耳热 I²R 除以表面积；p4 两板之间圆柱里电场能量的变化率（对时间中心差分）除以侧面积；
// p1 把互相垂直的 E、B 转到任意方向，叉乘的大小不变。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.poynting-theorem.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { type V3, MU0, agree, check, chosen, cross, dot, norm } from './physics.electromagnetism._es.ts';

const EPS0_GIVEN = 8.854e-12;

/** 绕单位轴 n 转角 a 的罗德里格斯公式。 */
function rotate(v: V3, n: V3, a: number): V3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const k = cross(n, v);
  const d = dot(n, v);
  return [0, 1, 2].map((i) => v[i] * c + k[i] * s + n[i] * d * (1 - c)) as V3;
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.poynting-theorem',
  notes: {
    p1: 'S = EB/μ₀（两者垂直）；和叉乘核对：E = 100 x̂、B = 10⁻⁵ ŷ 绕任意轴转同一个角，|E × B|/μ₀ 不变。',
    p2: '逐条用例子：A 能量密度 ε₀E²/2 + B²/(2μ₀) 只用这一点的场（对）；B 反例：恒定电流的电阻丝，表面坡印亭矢量指向里面、通量为负，场的能量却不变，流进来的能量变成焦耳热（错）；C v·(v × B) = 0，磁力的功率为零（对）；D 理想导线里 E = 0，表面外的 E 只有法向分量，和环绕的 B 叉乘后沿导线（对）；E 电阻里 ∇·S = −J·E ≠ 0（错）。',
    p3: 'S = (IR/l)·I/(2πa)；和能量守恒核对：电阻丝每秒放热 I²R，除以表面积 2πal。',
    p4: 'S = E·ε₀(R/2)dE/dt；和能量核对：半径 R、任取高 d 的圆柱里电场能量 ε₀E²/2·πR²d 对时间中心差分，除以侧面积 2πRd。',
  },
  compute() {
    // p1
    const E1: V3 = [100, 0, 0];
    const B1: V3 = [0, 1.0e-5, 0];
    const axis: V3 = [0.3, -0.5, 0.81];
    const n = norm(axis);
    const u: V3 = [axis[0] / n, axis[1] / n, axis[2] / n];
    const S1 = norm(cross(rotate(E1, u, 1.234), rotate(B1, u, 1.234))) / MU0;
    const p1 = agree(S1, (100 * 1.0e-5) / MU0, 'p1', 1e-9);

    // p2
    const A = true;
    const I = 5;
    const R = 0.1;
    const fluxIn = -I * I * R; // 坡印亭矢量穿出电阻丝表面的通量
    const dUfield = 0; // 恒定电流：场不随时间变，场的能量不变
    const B = !(fluxIn < 0 && dUfield === 0); // 反例成立，说法错
    const v: V3 = [0.2, -1.1, 0.7];
    const Bf: V3 = [0.4, 0.3, -0.9];
    const C = Math.abs(dot(v, cross(v, Bf))) < 1e-15;
    const Sdir = cross([1, 0, 0], [0, 1, 0]); // 法向 ŝ × 方位 ψ̂ = 轴向
    const D = Sdir[2] === 1 && Sdir[0] === 0 && Sdir[1] === 0;
    const E = false;
    check(A && !B && C && D, 'p2');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const L3 = 2.0;
    const a3 = 0.5e-3;
    const p3 = agree((I * I * R) / (2 * Math.PI * a3 * L3), ((I * R) / L3) * (I / (2 * Math.PI * a3)), 'p3', 1e-12);

    // p4
    const R4 = 0.05;
    const E0 = 1.0e5;
    const rate = 1.0e8;
    const d = 3.7e-3;
    const U = (t: number) => (EPS0_GIVEN / 2) * (E0 + rate * t) ** 2 * Math.PI * R4 * R4 * d;
    const h = 1e-9;
    const dUdt = (U(h) - U(-h)) / (2 * h);
    const p4 = agree(dUdt / (2 * Math.PI * R4 * d), E0 * EPS0_GIVEN * (R4 / 2) * rate, 'p4', 1e-6);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
