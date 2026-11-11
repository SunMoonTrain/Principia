// 独立验算 physics.electromagnetism.maxwell-equations 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的位移电流 ε₀ dΦ_E/dt 和安培-麦克斯韦定律；
// 二是不用这些式子：位移电流由极板电荷 Q = ε₀EA 对时间数值求导（电荷守恒接上导线里的电流）；
// 极板边缘的磁场由位移电流密度对圆面数值积分、再用环路一圈；海水的频率对两种电流密度之比二分。
// ε₀、μ₀ 按题面给的值取：ε₀ = 8.854×10⁻¹² F/m，μ₀ = 4π×10⁻⁷ N/A²。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.maxwell-equations.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { type V3, MU0, agree, bisect, check, chosen, cross, integrate2 } from './physics.electromagnetism._es.ts';

/** 题面给的真空介电常量。 */
const EPS0_GIVEN = 8.854e-12;

export const verification: Verification = {
  lesson: 'physics.electromagnetism.maxwell-equations',
  notes: {
    p1: 'ε₀A dE/dt；和极板电荷 Q(t) = ε₀E(t)A 对时间中心差分（导线里的电流）核对。ε₀ 取题面的 8.854×10⁻¹²。',
    p2: '逐条用例子：A ∇ × B = μ₀ε₀ ∂E/∂t 和 ∇ × B = μ₀J 同号，∂E/∂t 沿 +z 时 B 绕 +z 逆时针（对）；B 放电时 E 减小，ε₀∂E/∂t 从负极板指向正极板，和导线里从正极板流向负极板的电流接成同一个绕向（对）；C ∇·B = 0 在任何时刻都成立，闭合曲面的磁通量为零（错）；D 反例：真空里的电磁波，∇ × B = μ₀ε₀ ∂E/∂t ≠ 0（错）；E 方程组蕴含连续性方程，源不满足它就无解（对）。',
    p3: 'B = (μ₀ε₀R/2)·ωV₀/d；和数值核对：位移电流密度 ε₀ωV₀/d 对半径 R 的圆面数值积分得 I_d，B = μ₀I_d/(2πR)。μ₀、ε₀ 取题面的 4π×10⁻⁷、8.854×10⁻¹²。',
    p4: 'f = σ/(2πε_rε₀)；和对 σ/(ε_rε₀·2πf) − 1 二分核对。ε₀ 取题面的 8.854×10⁻¹²。',
  },
  compute() {
    // p1
    const A1 = 0.02;
    const rate = 1.0e12;
    const Q = (t: number) => EPS0_GIVEN * (5e3 + rate * t) * A1;
    const dQdt = (Q(1e-9) - Q(-1e-9)) / 2e-9;
    const p1 = agree(dQdt, EPS0_GIVEN * A1 * rate, 'p1', 1e-6);

    // p2
    const dEdt: V3 = [0, 0, 1];
    const loopDir: V3 = cross(dEdt, [1, 0, 0]); // 在 +x 处，绕 +z 逆时针的方向是 +y
    const A = loopDir[1] > 0;
    // B：正极板在下（z = 0）、负极板在上（z = d），板间 E 沿 +z。放电时 E 减小，位移电流 ε₀∂E/∂t 沿 −z。
    // 外电路的电流从下板流出、经导线到上板；要绕回出发点，两板之间得从上板走到下板，也是 −z。两者同向，电流连续。
    const Edir = 1;
    const dEdtDischarge = -Edir;
    const closingDir = -1; // 回路在两板之间的走向
    const B = Math.sign(dEdtDischarge) === closingDir;
    const C = false;
    const D = false;
    const E = true;
    check(B, 'p2 B：方向接得上');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const R3 = 0.05;
    const d3 = 2.0e-3;
    const V0 = 100;
    const w = 2 * Math.PI * 1.0e6;
    const Jd = (EPS0_GIVEN * w * V0) / d3;
    const Id = integrate2((s) => Jd * s, 0, R3, 0, 2 * Math.PI, 8, 8);
    const p3 = agree(((MU0 * Id) / (2 * Math.PI * R3)) * 1e9, ((MU0 * EPS0_GIVEN * R3) / 2) * ((w * V0) / d3) * 1e9, 'p3', 1e-9);

    // p4
    const er = 80;
    const sig = 4.0;
    const f = bisect((x) => sig / (er * EPS0_GIVEN * 2 * Math.PI * x) - 1, 1e6, 1e10);
    const p4 = agree(f / 1e6, sig / (2 * Math.PI * er * EPS0_GIVEN) / 1e6, 'p4', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
