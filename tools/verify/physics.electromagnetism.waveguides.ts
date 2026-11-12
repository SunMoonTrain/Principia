// 独立验算 physics.electromagnetism.waveguides 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（截止频率 f_mn = (c/2)√((m/a)² + (n/b)²)，k² = (ω² − ω_c²)/c²，v_g = c√(1 − (f_c/f)²)）；
// 二是不用这些式子：横电模的 B_z 在截面上满足 ∂²B/∂x² + k_x²B = 0、管壁处法向导数为零，
// 用龙格-库塔法从一壁积到另一壁（打靶法），对 k_x 二分出满足边界条件的值，k_y 同样求，截止频率 f = c√(k_x² + k_y²)/(2π)；
// 色散关系由 ω² = c²(k² + k_c²) 对 ω 二分，群速度用 dω/dk 的中心差分。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.waveguides.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, rk4 } from './physics.electromagnetism._es.ts';

const C_GIVEN = 3.0e8;

/** 打靶：B'' = −k²B，B(0) = 1、B'(0) = 0，积到 x = L 时的 B'(L)。 */
const slopeAtEnd = (k: number, L: number) => rk4((_x, y) => [y[1], -k * k * y[0]], [1, 0], 0, L, 400)[1];

/** 边长 L 方向上第 m 个（m ≥ 1）满足两壁法向导数为零的波数：在 (m − ½)π/L 到 (m + ½)π/L 之间二分。 */
const shootK = (m: number, L: number) => (m === 0 ? 0 : bisect((k) => slopeAtEnd(k, L), ((m - 0.5) * Math.PI) / L, ((m + 0.5) * Math.PI) / L));

/** 横电模 (m, n) 的截止频率（打靶法）。 */
const cutoffShoot = (m: number, n: number, a: number, b: number) => (C_GIVEN * Math.hypot(shootK(m, a), shootK(n, b))) / (2 * Math.PI);

/** 讲解的式子。 */
const cutoff = (m: number, n: number, a: number, b: number) => (C_GIVEN / 2) * Math.hypot(m / a, n / b);

/** 由色散关系 ω² = c²(k² + k_c²) 对 ω 二分。 */
const omegaOf = (k: number, kc: number) => bisect((w) => w * w - C_GIVEN * C_GIVEN * (k * k + kc * kc), 0, 10 * C_GIVEN * (k + kc));

export const verification: Verification = {
  lesson: 'physics.electromagnetism.waveguides',
  notes: {
    p1: 'f₁₀ = c/(2a)；和打靶法核对：B″ + k²B = 0、两壁 B′ = 0，用龙格-库塔法积过 3.0 cm 宽的一边，对 k 二分；两个方向各取最小的非零波数，比较 TE₁₀、TE₀₁。',
    p2: '逐条用例子（打靶法求截止频率）：A 3.0 cm × 1.5 cm 放大到 6.0 cm × 3.0 cm，前 6 个模的截止频率都减半（对）；B a = 2.0 cm，b 取 0.8 cm 和 1.5 cm，TE₁₀ 的截止频率不变（对）；C a = 2.0 cm，频率是截止频率的 1.1、2、10 倍时，dω/dk 分别是 0.417c、0.866c、0.995c（对）；D 正方形截面 TE₁₀、TE₀₁ 的截止频率相同（错）；E TE₁₁ 是 √2 倍而不是 2 倍（错）。',
    p3: 'λ_g = 6.0 cm，f = c√(1/λ_g² + 1/(2a)²)，v_g = c√(1 − (f_c/f)²)；和数值核对：k_c 用打靶法求，ω 由色散关系对 ω 二分，v_g 取 dω/dk 的中心差分。',
    p4: '第二低的截止频率 min(c/a, c/(2b))；和打靶法核对：(m, n) 取到 3，逐个求截止频率排序，取第二小的。',
  },
  compute() {
    // p1
    const a1 = 0.03;
    const b1 = 0.015;
    const f10 = cutoffShoot(1, 0, a1, b1);
    const f01 = cutoffShoot(0, 1, a1, b1);
    const p1 = agree(Math.min(f10, f01) / 1e9, cutoff(1, 0, a1, b1) / 1e9, 'p1', 1e-9);

    // p2
    const modes: [number, number][] = [
      [1, 0], [0, 1], [2, 0], [1, 1], [0, 2], [2, 1],
    ];
    const A = modes.every(([m, n]) => Math.abs(cutoffShoot(m, n, 2 * a1, 2 * b1) / cutoffShoot(m, n, a1, b1) - 0.5) < 1e-9);
    const B = Math.abs(cutoffShoot(1, 0, 0.02, 0.008) - cutoffShoot(1, 0, 0.02, 0.015)) < 1e-9 * cutoffShoot(1, 0, 0.02, 0.015);
    const kc = shootK(1, 0.02);
    const fc = (C_GIVEN * kc) / (2 * Math.PI);
    const vg = (f: number) => {
      const w = 2 * Math.PI * f;
      const k = Math.sqrt(w * w / (C_GIVEN * C_GIVEN) - kc * kc);
      const dk = k * 1e-6;
      return (omegaOf(k + dk, kc) - omegaOf(k - dk, kc)) / (2 * dk);
    };
    const g = [1.1, 2, 10].map((x) => vg(x * fc) / C_GIVEN);
    const C = g[0] < g[1] && g[1] < g[2] && g[2] > 0.99;
    check(Math.abs(g[0] - 0.4166) < 1e-3 && Math.abs(g[1] - 0.8660) < 1e-3 && Math.abs(g[2] - 0.99499) < 1e-4, 'p2 C 的数');
    const D = Math.abs(cutoffShoot(1, 0, 0.02, 0.02) - cutoffShoot(0, 1, 0.02, 0.02)) > 1e-6 * cutoffShoot(1, 0, 0.02, 0.02);
    const E = Math.abs(cutoffShoot(1, 1, a1, b1) - (cutoffShoot(1, 0, a1, b1) + cutoffShoot(0, 1, a1, b1))) < 1e-6 * cutoffShoot(1, 1, a1, b1);
    check(A && B && C && !D && !E, 'p2');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const a3 = 0.02;
    const lg = 2 * 0.03;
    const k3 = (2 * Math.PI) / lg;
    const kc3 = shootK(1, a3);
    const w3 = omegaOf(k3, kc3);
    const dk = k3 * 1e-6;
    const vg3 = (omegaOf(k3 + dk, kc3) - omegaOf(k3 - dk, kc3)) / (2 * dk);
    const fExact = C_GIVEN * Math.sqrt(1 / (lg * lg) + 1 / (4 * a3 * a3));
    const f3 = agree(w3 / (2 * Math.PI) / 1e9, fExact / 1e9, 'p3 频率', 1e-9);
    const v3 = agree(vg3 / 1e8, (C_GIVEN * Math.sqrt(1 - (C_GIVEN / (2 * a3) / fExact) ** 2)) / 1e8, 'p3 群速度', 1e-7);

    // p4
    const a4 = 0.024;
    const b4 = 0.015;
    const list: number[] = [];
    for (let m = 0; m <= 3; m++) for (let n = 0; n <= 3; n++) if (m + n > 0) list.push(cutoffShoot(m, n, a4, b4));
    list.sort((x, y) => x - y);
    check(Math.abs(list[0] - cutoff(1, 0, a4, b4)) < 1e-6 * list[0], 'p4 最低的是 TE₁₀');
    const p4 = agree(list[1] / 1e9, Math.min(C_GIVEN / a4, C_GIVEN / (2 * b4)) / 1e9, 'p4', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [f3, v3] },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
