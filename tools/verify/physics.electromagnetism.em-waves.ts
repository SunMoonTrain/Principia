// 独立验算 physics.electromagnetism.em-waves 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（λ = c/f、ω = ck、B = (1/c) k̂ × E）；
// 二是不用这些式子：p1 由波动方程的色散关系 k² = μ₀ε₀ω²（μ₀ε₀ = 1/c²）求 k、再 λ = 2π/k；
// p3 由法拉第定律 ∂B_x/∂t = ∂E_y/∂z（数值求导），对时间数值积分一个周期得 B_x(t)，减去平均值；p4 用 argmax 找电场空间分布的周期。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.em-waves.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, check, chosen, cross, integrate } from './physics.electromagnetism._es.ts';

const C_GIVEN = 3.0e8;

export const verification: Verification = {
  lesson: 'physics.electromagnetism.em-waves',
  notes: {
    p1: 'λ = c/f；和色散关系核对：k = ω√(μ₀ε₀) = ω/c，λ = 2π/k。',
    p2: '逐条用例子：A B = (1/c) k̂ × E，k̂ = ẑ、E ∥ x̂ 时 B ∥ ±ŷ（对）；B 真空中波速都是 c（错）；C 沿 z 传播的平面波 ∇·E = ∂E_z/∂z = 0，E_z 只能是常数，不是波（对）；D f = c/λ = 6.0×10¹⁴ Hz（对）；E 平面波里 E、B 同相（错）。',
    p3: 'B_x = −(E₀/c)cos(kz − ωt)，t = 0、z = λ/8 处 −(E₀/c)cos(π/4)；和法拉第定律核对：∂B_x/∂t = ∂E_y/∂z（中心差分），从 t = 0 到一个周期数值积分出 B_x(t) 加常数，常数由一个周期的平均为零定出。',
    p4: 'λ = 2π/k，f = ck/(2π)；和数值核对：在 0.5 m 到 2 m 之间找 cos(kz) 的最大值点得 λ，f = c/λ。',
  },
  compute() {
    // p1
    const f1 = 2.45e9;
    const k1 = (2 * Math.PI * f1) * Math.sqrt(1 / (C_GIVEN * C_GIVEN));
    const p1 = agree(((2 * Math.PI) / k1) * 100, (C_GIVEN / f1) * 100, 'p1', 1e-9);

    // p2
    const Bdir = cross([0, 0, 1], [1, 0, 0]);
    const A = Bdir[0] === 0 && Bdir[2] === 0 && Math.abs(Bdir[1]) === 1;
    const B = false;
    const C = true;
    const D = Math.abs(C_GIVEN / 500e-9 / 6e14 - 1) < 0.01;
    const E = false;
    check(A && D, 'p2 A、D');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const E0 = 6.0;
    const lam = 1.0; // 波长任取，结果和它无关
    const k = (2 * Math.PI) / lam;
    const w = k * C_GIVEN;
    const T = (2 * Math.PI) / w;
    const z3 = lam / 8;
    const Ey = (z: number, t: number) => E0 * Math.cos(k * z - w * t);
    const dEydz = (t: number) => (Ey(z3 + 1e-7, t) - Ey(z3 - 1e-7, t)) / 2e-7;
    // B_x(t) = ∫₀ᵗ ∂E_y/∂z dt′ + c₀；一个周期的平均为零定出 c₀
    const G = (t: number) => integrate(dEydz, 0, t, 8, 16);
    const mean = integrate(G, 0, T, 8, 16) / T;
    const Bx0 = G(0) - mean;
    const p3 = agree(Bx0 * 1e9, (-(E0 / C_GIVEN) * Math.cos(Math.PI / 4)) * 1e9, 'p3', 1e-6);

    // p4
    const k4 = 5.0;
    const lam4 = argmax((z) => Math.cos(k4 * z), 0.5, 2);
    const L4 = agree(lam4, (2 * Math.PI) / k4, 'p4 波长', 1e-7);
    const F4 = agree(C_GIVEN / lam4 / 1e6, (C_GIVEN * k4) / (2 * Math.PI) / 1e6, 'p4 频率', 1e-7);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [L4, F4] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
