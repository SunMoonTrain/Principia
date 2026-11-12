// 独立验算 physics.optics.diffraction-gratings 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（光栅方程 d sinθ = mλ、缺级、色分辨本领 R = mN）；
// 二是不用这些式子：把 N 条缝（每条缝再分成许多段）发出的次波直接相加，
// p1 在 sinθ 上做黄金分割找第一级主极大；p3 在每个可能的级次方向上算光强，数亮的有几条；
// p4 对 N = 60000 条缝直接相加，二分出第一级主极大旁边的第一个零点，按瑞利判据换成能分开的波长差。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.diffraction-gratings.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, bisect, check, chosen, deg, slitRelIntensity, symmetricSum } from './physics.optics._op.ts';

/** N 条缝（缝距 d）的阵列因子：振幅带号、除以 N。 */
const arrayAmp = (N: number, d: number, lambda: number, s: number) => symmetricSum(N, (2 * Math.PI * d * s) / lambda) / N;
/** 光栅在 sinθ = s 方向上的相对光强：阵列因子的平方乘单缝（缝宽 a）的衍射因子，两者都由次波直接相加。 */
const gratingI = (N: number, d: number, a: number, lambda: number, s: number) => arrayAmp(N, d, lambda, s) ** 2 * slitRelIntensity(a, lambda, s, 2000);

/** 第 m 级主极大旁边（sinθ 增大一侧）的第一个零点。 */
function firstZeroAfter(N: number, d: number, lambda: number, m: number): number {
  const s0 = (m * lambda) / d;
  const w = lambda / (N * d);
  return bisect((s) => arrayAmp(N, d, lambda, s), s0 + 0.5 * w, s0 + 1.5 * w);
}

export const verification: Verification = {
  lesson: 'physics.optics.diffraction-gratings',
  notes: {
    p1: 'sinθ = λ/d，d = 1/600 mm；和次波相加核对：100 条缝的阵列因子在第一级附近黄金分割求最大。',
    p2: '逐条用例子（次波直接相加）：A 500 nm 时每毫米 300、600 条的最高级次 6、3，刻线多的反而低（错）；B 第一级在 d = 3.33、1.67 μm 时偏 8.6°、17.5°，光栅常量大的偏得少（错）；C N = 1000，第一、二级主极大旁的第一个零点算出能分开的波长差 λ/1000、λ/2000（对）；D d = 2 μm、500 nm，第一级主极大到第一个零点，N = 100 时 Δsinθ = 2.5×10⁻³，N = 1000 时 2.5×10⁻⁴（对）；E d = 4a 时第 4 级方向的光强不到中央的 10⁻²⁰（对）。',
    p3: '最高级次 floor(d/λ) = 3，d = 3a，第 3 级缺级，剩 0、±1、±2；和次波相加核对：50 条缝、每条分 2000 段，在 m = −3…3 的方向上算光强（|sinθ| < 1 的才算），比中央的 10⁻⁶ 大的数一数。',
    p4: 'Δλ = λ/(mN)，N = 5.0 cm × 1200/mm；和次波相加核对：60000 条缝直接相加，二分出第一级主极大旁边的第一个零点 s₁，按瑞利判据另一波长的第一级主极大落在 s₁，λ′ = d·s₁，Δλ = λ′ − λ。',
  },
  compute() {
    // p1
    const d1 = 1e-3 / 600;
    const lam1 = 633e-9;
    const formula1 = Math.asin(lam1 / d1) / deg;
    const s0 = lam1 / d1;
    const sPeak = argmax((s) => arrayAmp(100, d1, lam1, s) ** 2, s0 - 0.002, s0 + 0.002);
    const p1 = agree(Math.asin(sPeak) / deg, formula1, 'p1 第一级的偏角', 1e-7);

    // p2
    const maxOrder = (d: number, l: number) => { let m = 0; while (((m + 1) * l) / d < 1) m++; return m; };
    check(maxOrder(1e-3 / 300, 500e-9) === 6 && maxOrder(1e-3 / 600, 500e-9) === 3, 'A：最高级次 6、3');
    const optA = maxOrder(1e-3 / 600, 500e-9) > maxOrder(1e-3 / 300, 500e-9);
    const th = (d: number) => Math.asin(500e-9 / d) / deg;
    check(Math.abs(th(1e-3 / 300) - 8.63) < 0.01 && Math.abs(th(1e-3 / 600) - 17.46) < 0.01, 'B：8.6°、17.5°');
    const optB = th(1e-3 / 300) > th(1e-3 / 600);
    const dC = 2e-6;
    const lamC = 500e-9;
    const dl = (m: number) => dC * firstZeroAfter(1000, dC, lamC, m) / m - lamC;
    check(Math.abs(dl(1) - lamC / 1000) < 1e-15 && Math.abs(dl(2) - lamC / 2000) < 1e-15, 'C：λ/1000、λ/2000');
    const optC = Math.abs(dl(1) / dl(2) - 2) < 1e-6;
    const width = (N: number) => firstZeroAfter(N, dC, lamC, 1) - lamC / dC;
    check(Math.abs(width(100) - 2.5e-3) < 1e-6 && Math.abs(width(1000) - 2.5e-4) < 1e-7, 'D：2.5×10⁻³、2.5×10⁻⁴');
    const optD = width(1000) < width(100);
    const iE = gratingI(10, 4e-6, 1e-6, 500e-9, (4 * 500e-9) / 4e-6);
    const optE = iE < 1e-20;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const d3 = 1e-3 / 500;
    const a3 = d3 / 3;
    const lam3 = 589e-9;
    let count = 0;
    for (let m = -10; m <= 10; m++) {
      const s = (m * lam3) / d3;
      if (Math.abs(s) >= 1) continue;
      if (gratingI(50, d3, a3, lam3, s) > 1e-6) count++;
    }
    const formula3 = 1 + 2 * (Math.floor(d3 / lam3) - 1); // 3 级缺掉，剩 0、±1、±2
    check(Math.floor(d3 / lam3) === 3, 'p3 最高级次 3');
    const p3 = agree(count, formula3, 'p3 主极大条数', 0);

    // p4（pm）
    const N4 = 50000 * 1.2; // 5.0 cm × 1200 条/mm
    const d4 = 1e-3 / 1200;
    const lam4 = 500e-9;
    const formula4 = (lam4 / (1 * N4)) * 1e12;
    const s1 = firstZeroAfter(N4, d4, lam4, 1);
    const p4 = agree((d4 * s1 - lam4) * 1e12, formula4, 'p4 能分开的最小波长差', 1e-6);

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
