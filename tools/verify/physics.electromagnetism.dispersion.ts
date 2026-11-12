// 独立验算 physics.electromagnetism.dispersion 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（柯西公式 n = A + B/λ²，等离子体频率 ω_p = √(ne²/(ε₀m))）；
// 二是不用这些式子：p1 把 dn/dλ = −2B/λ³ 从 700 nm 数值积分到 400 nm；
// p3、p4 用自由电子气的相对介电常量 ε_r(ω) = 1 − ne²/(ε₀mω²)，对电子密度或频率二分，使 ε_r = 0（k² 由正变负的地方）。
// 选择题用振子模型的 ε_r(ω) 和具体的数值核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.dispersion.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, bisect, check, chosen, integrate } from './physics.electromagnetism._es.ts';

const E_GIVEN = 1.602e-19;
const ME_GIVEN = 9.109e-31;
const EPS0_GIVEN = 8.854e-12;
const C_GIVEN = 3.0e8;

/** 自由电子气的相对介电常量。 */
const epsFree = (n: number, w: number) => 1 - (n * E_GIVEN * E_GIVEN) / (EPS0_GIVEN * ME_GIVEN * w * w);

export const verification: Verification = {
  lesson: 'physics.electromagnetism.dispersion',
  notes: {
    p1: 'Δn = B(1/400² − 1/700²)；和数值核对：dn/dλ = −2B/λ³ 从 700 nm 积到 400 nm。',
    p2: '逐条用例子：A 柯西公式 B > 0 时短波折射率大（对）；B 振子模型 ε_r = 1 + ω_p²/(ω₀² − ω² + iγω)，虚部的最大值点在 ω₀ 附近（γ = 0.05ω₀ 时差不到 0.1%，对）；C 信号速度不超过 c（错）；D ω < ω_p 时 ε_r < 0，k² < 0（对）；E 水在光频的 ε_r = n² ≈ 1.77（错）。',
    p3: 'n = ε₀mω²/e²，ω = 2π·7.0 MHz；和数值核对：对电子密度二分，使 ε_r(2π·7.0 MHz) = 0。',
    p4: 'λ_p = 2πc/ω_p；和数值核对：对频率二分，使钠的 ε_r(ω) = 0，再 λ = 2πc/ω。',
  },
  compute() {
    // p1
    const Bc = 4.22e3;
    const dn = integrate((lam) => (-2 * Bc) / lam ** 3, 700, 400, 16, 16);
    const p1 = agree(dn, Bc * (1 / 400 ** 2 - 1 / 700 ** 2), 'p1', 1e-10);

    // p2
    const A = 1.5 + Bc / 400 ** 2 > 1.5 + Bc / 700 ** 2;
    const w0 = 1;
    const gam = 0.05;
    const wp = 0.5;
    const imEps = (w: number) => {
      const re = w0 * w0 - w * w;
      const im = gam * w;
      return (wp * wp * im) / (re * re + im * im); // −Im ε_r 的大小（吸收）
    };
    const B = Math.abs(argmax(imEps, 0.5, 1.5) - w0) < 1e-3;
    const C = false;
    const nNa = 2.65e28;
    const wpNa = Math.sqrt((nNa * E_GIVEN * E_GIVEN) / (EPS0_GIVEN * ME_GIVEN));
    const D = epsFree(nNa, 0.5 * wpNa) < 0;
    const E = false;
    check(A && B && D, 'p2 A、B、D');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const w3 = 2 * Math.PI * 7.0e6;
    const n3 = bisect((n) => epsFree(n, w3), 1e8, 1e14);
    const p3 = agree(n3 / 1e11, (EPS0_GIVEN * ME_GIVEN * w3 * w3) / (E_GIVEN * E_GIVEN) / 1e11, 'p3', 1e-8);

    // p4
    const w4 = bisect((w) => epsFree(nNa, w), 1e14, 1e17);
    const p4 = agree(((2 * Math.PI * C_GIVEN) / w4) * 1e9, ((2 * Math.PI * C_GIVEN) / wpNa) * 1e9, 'p4', 1e-8);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
