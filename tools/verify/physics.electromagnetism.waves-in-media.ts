// 独立验算 physics.electromagnetism.waves-in-media 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（v = c/n，λ = λ₀/n，频率不变，n = √(ε_rμ_r)）；
// 二是不用这些式子：由介质里的波动方程 k² = μεω²（ε = ε_rε₀、μ = μ_rμ₀，μ₀ε₀ = 1/c²）对给定的频率求 k，
// 再 v = ω/k、λ = 2π/k；p4 的折射率取 ck/ω。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.waves-in-media.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen } from './physics.electromagnetism._es.ts';

const C_GIVEN = 3.0e8;

/** 波动方程的色散关系：对 k 二分，使 k² = ε_rμ_rω²/c²。 */
function kOf(w: number, er: number, mr: number): number {
  return bisect((k) => k * k - (er * mr * w * w) / (C_GIVEN * C_GIVEN), 0, (10 * Math.sqrt(er * mr) * w) / C_GIVEN);
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.waves-in-media',
  notes: {
    p1: 'v = c/n；和色散关系核对：不显磁性时 ε_r = n²，任取 ω 由 k² = ε_rω²/c² 二分出 k，v = ω/k。',
    p2: '逐条用例子：A 频率由源决定（对）；B v = c/1.5（对）；C λ = λ₀/1.5，变成 2/3 倍（错）；D 不显磁性时 E₀/B₀ = ω/k = v（数值核对，对）；E 静电的相对介电常量和光频的 n² 一般不同（错，讲解里水的 80 和 1.77 是例子）。',
    p3: 'λ = λ₀/n，f = c/λ₀；和色散关系核对：ω = 2πc/λ₀，k² = n²ω²/c² 二分出 k，λ = 2π/k。',
    p4: 'n = √(ε_rμ_r)，λ = c/(nf)；和色散关系核对：k² = ε_rμ_rω²/c² 二分出 k，n = ck/ω，λ = 2π/k。',
  },
  compute() {
    // p1
    const n1 = 2.42;
    const w1 = 3.3e15;
    const p1 = agree(w1 / kOf(w1, n1 * n1, 1) / 1e8, C_GIVEN / n1 / 1e8, 'p1', 1e-9);

    // p2
    const n2 = 1.5;
    const w2 = 3.0e15;
    const k2 = kOf(w2, n2 * n2, 1);
    const A = true;
    const B = Math.abs(w2 / k2 / C_GIVEN - 2 / 3) < 1e-9;
    const C = Math.abs(((2 * Math.PI) / k2) / ((2 * Math.PI * C_GIVEN) / w2) - 1.5) < 1e-9;
    // 法拉第定律：B₀ = (k/ω)E₀，所以 E₀/B₀ = ω/k
    const D = Math.abs(w2 / k2 - C_GIVEN / n2) / (C_GIVEN / n2) < 1e-9;
    const E = false;
    check(B && !C && D, 'p2');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const lam0 = 589e-9;
    const n3 = 1.333;
    const w3 = (2 * Math.PI * C_GIVEN) / lam0;
    const lam3 = agree(((2 * Math.PI) / kOf(w3, n3 * n3, 1)) * 1e9, (lam0 / n3) * 1e9, 'p3 波长', 1e-9);
    const f3 = agree(w3 / (2 * Math.PI) / 1e12, C_GIVEN / lam0 / 1e12, 'p3 频率', 1e-12);

    // p4
    const w4 = 2 * Math.PI * 1.0e6;
    const k4 = kOf(w4, 12, 1000);
    const n4 = agree((C_GIVEN * k4) / w4, Math.sqrt(12 * 1000), 'p4 折射率', 1e-9);
    const l4 = agree((2 * Math.PI) / k4, C_GIVEN / (Math.sqrt(12 * 1000) * 1.0e6), 'p4 波长', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [lam3, f3] },
      p4: { type: 'tuple', value: [n4, l4] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
