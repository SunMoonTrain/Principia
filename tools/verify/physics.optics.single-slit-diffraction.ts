// 独立验算 physics.optics.single-slit-diffraction 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（暗纹 a sinθ = mλ、小角度时中央亮纹宽 2λL/a、I = I₀(sinβ/β)²）；
// 二是不用这些式子：把缝分成 4000 段，各段的次波直接相加（振幅关于缝中心对称，是实数、过暗纹时变号），
// 在 sinθ 上二分出暗纹，再按精确几何 y = L·tanθ 换到屏上（和小角度的公式差约 θ² 量级，容差相应放宽，返回公式的值）。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.single-slit-diffraction.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, slitRelIntensity, symmetricSum } from './physics.optics._op.ts';

const N = 4000;
/** 宽 a 的缝在 sinθ = s 方向上的振幅（相对值，带号）。 */
const amp = (a: number, lambda: number, s: number) => symmetricSum(N, (2 * Math.PI * (a / N) * s) / lambda) / N;
/** 第 m 条暗纹的 sinθ（在相邻两个暗纹之间二分）。 */
const darkS = (a: number, lambda: number, m: number) => bisect((s) => amp(a, lambda, s), ((m - 0.5) * lambda) / a, ((m + 0.5) * lambda) / a);

export const verification: Verification = {
  lesson: 'physics.optics.single-slit-diffraction',
  notes: {
    p1: '2λL/a；和次波直接相加核对：缝分成 4000 段，在 sinθ 上二分出第一条暗纹，屏上位置 L·tanθ 的 2 倍（和小角度公式差约 2×10⁻⁶）。',
    p2: '逐条用例子（次波直接相加）：A 缝宽从 0.30 mm 减半，算出的中央亮纹宽从 5.89 mm 变成 11.78 mm，加倍（错）；B 第一、二条暗纹在 sinθ = λ/a、2λ/a，中央亮纹宽 2λ/a、两侧亮纹宽 λ/a（对）；C 中央亮纹的半角宽 arcsin(λ/a) 和屏距无关（错）；D 589 nm 换成 650 nm，第一条暗纹的 sinθ 变大（对）；E 缝宽 0.8λ 时，sinθ 从 0 到 1 光强单调下降，最暗在 sinθ = 1、仍有中央的 0.055，没有零点（对）。',
    p3: 'a = 2λL/(18.0 mm/2)；和次波相加核对：第二条暗纹在屏上 9.0 mm 处，按精确几何 sinθ = sin(arctan(9.0/1200))，再由二分出的第二条暗纹位置反推缝宽（差约 3×10⁻⁵，返回公式的值）。',
    p4: '(sinβ/β)²，β = π/2；和次波相加核对：在跨缝相位差为 π 的方向上把 4000 段次波相加，振幅平方除以中央的。',
  },
  compute() {
    // p1（mm）
    const lam1 = 589e-9;
    const a1 = 0.3e-3;
    const L1 = 1.5;
    const formula1 = ((2 * lam1 * L1) / a1) * 1000;
    const s1 = darkS(a1, lam1, 1);
    const width1 = 2 * L1 * Math.tan(Math.asin(s1)) * 1000;
    agree(width1, formula1, 'p1 中央亮纹宽（精确几何）', 1e-5);
    const p1 = formula1;

    // p2
    const w = (a: number, l: number) => 2 * L1 * Math.tan(Math.asin(darkS(a, l, 1))) * 1000;
    const wFull = w(0.3e-3, lam1);
    const wHalf = w(0.15e-3, lam1);
    check(Math.abs(wFull - 5.89) < 0.01 && Math.abs(wHalf - 11.78) < 0.01, 'A：5.89、11.78 mm');
    const optA = Math.abs(wHalf / wFull - 0.5) < 0.01;
    const d1 = darkS(0.3e-3, lam1, 1);
    const d2 = darkS(0.3e-3, lam1, 2);
    const optB = Math.abs(2 * d1 / (d2 - d1) - 2) < 1e-6;
    const optC = false; // 暗纹由 sinθ 决定，和屏距无关；屏远了只是在屏上更宽
    check(Math.abs(darkS(0.3e-3, lam1, 1) - lam1 / 0.3e-3) < 1e-12, 'C：第一条暗纹的方向和屏距无关');
    const optD = darkS(0.3e-3, 650e-9, 1) > darkS(0.3e-3, lam1, 1);
    let minI = Infinity;
    for (let k = 0; k <= 1000; k++) minI = Math.min(minI, slitRelIntensity(0.8 * lam1, lam1, k / 1000, N));
    check(Math.abs(minI - 0.0547) < 1e-3, 'E：缝宽 0.8λ 时最暗在 sinθ = 1，光强 0.055');
    const optE = minI > 0;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（mm）
    const lam3 = 600e-9;
    const L3 = 1.2;
    const formula3 = ((2 * lam3 * L3) / (18.0e-3 / 2)) * 1000;
    const sTarget = Math.sin(Math.atan(9.0e-3 / L3));
    // 第二条暗纹的 sinθ 正比于 1/a：用 a = 1 mm 二分出的位置换算
    const s2ref = darkS(1e-3, lam3, 2);
    const aExact = ((s2ref * 1e-3) / sTarget) * 1000;
    agree(aExact, formula3, 'p3 缝宽（精确几何）', 1e-4);
    const p3 = formula3;

    // p4
    const formula4 = (Math.sin(Math.PI / 2) / (Math.PI / 2)) ** 2;
    const a4 = 1e-4;
    const lam4 = 500e-9;
    const p4 = agree(slitRelIntensity(a4, lam4, lam4 / (2 * a4), N), formula4, 'p4 光强之比', 1e-6);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
