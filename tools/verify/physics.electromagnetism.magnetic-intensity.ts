// 独立验算 physics.electromagnetism.magnetic-intensity 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（M = χ_m H、B = μ₀(1 + χ_m)H、界面上 tanθ 之比等于磁导率之比、带缝铁环的磁路）；
// 二是不用这些式子：由 B = μ₀(H + M)、M = χ_m H 二分出 H；界面条件用矢量分量直接算；带缝铁环对 B 二分，满足 ∮H·dl = NI。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.magnetic-intensity.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { MU0, agree, bisect, check, chosen } from './physics.electromagnetism._es.ts';

export const verification: Verification = {
  lesson: 'physics.electromagnetism.magnetic-intensity',
  notes: {
    p1: 'M = χ_m B/(μ₀(1 + χ_m))；和由 B = μ₀(H + χ_m H) 二分出 H、再乘 χ_m 核对。',
    p2: '逐条用例子：A μ_r < 1 即 χ_m < 0，抗磁性（对）；B 反例：条形磁铁外面没有自由电流，H = B/μ₀ ≠ 0（错）；C 铁磁性物质 B 对 H 不是直线、有磁滞，取两点比值不同（错）；D 螺绕环 ∮H·dl = NI 只含自由电流，填不填介质 H 都是 NI/(2πs)（对）；E 钢是硬磁性材料、剩磁大，软铁剩磁小（对，按讲解）。',
    p3: 'tanθ_空气 = tanθ_铁/μ_r；和矢量分量核对：铁里取 B 和法线成 80°，B 的法向分量连续、H 的切向分量连续，算出空气里的 B 再求夹角。',
    p4: 'B = μ₀NI/((2πR − g)/μ_r + g)；和对 B 二分核对：铁里 H = B/(μ₀μ_r)、缝里 H = B/μ₀，要求 H 沿环一圈的积分等于 NI。',
  },
  compute() {
    // p1
    const chi = 1.5e-3;
    const B1 = 1.2;
    const H = bisect((h) => MU0 * (h + chi * h) - B1, 0, 1e7);
    const p1 = agree((chi * H) / 1e3, (chi * B1) / (MU0 * (1 + chi)) / 1e3, 'p1', 1e-9);

    // p2
    const A = -0.3e-5 < 0;
    const B = false; // 反例：磁铁外 H ≠ 0
    const ferro = (h: number) => 1.5 * Math.tanh(h / 200); // 一条饱和的 B–H 曲线
    const C = Math.abs(ferro(50) / (MU0 * 50) - ferro(400) / (MU0 * 400)) < 1e-9;
    check(!C, 'p2 C：比值随 H 变');
    const N = 300;
    const I = 1.2;
    const s = 0.08;
    const Hvac = (N * I) / (2 * Math.PI * s);
    const Hmed = (N * I) / (2 * Math.PI * s); // ∮H·dl 只含自由电流
    const D = Math.abs(Hvac - Hmed) < 1e-12;
    const E = true;
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const mur = 1000;
    const th = (80 * Math.PI) / 180;
    const Bfe = 1.0;
    const Bn = Bfe * Math.cos(th);
    const Ht = (Bfe * Math.sin(th)) / (MU0 * mur);
    const Bair_t = MU0 * Ht;
    const angAir = (Math.atan2(Bair_t, Bn) * 180) / Math.PI;
    const p3 = agree(angAir, (Math.atan(Math.tan(th) / mur) * 180) / Math.PI, 'p3', 1e-12);

    // p4
    const N4 = 500;
    const I4 = 1.0;
    const R = 0.1;
    const g = 2.0e-3;
    const mu4 = 2000;
    const Bgap = bisect((b) => (b / (MU0 * mu4)) * (2 * Math.PI * R - g) + (b / MU0) * g - N4 * I4, 0, 10);
    const p4 = agree(Bgap, (MU0 * N4 * I4) / ((2 * Math.PI * R - g) / mu4 + g), 'p4', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
