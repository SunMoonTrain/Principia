// 独立验算 physics.optics.coherence 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（相干宽度 w = λ/θ_s、相干长度 l_c = λ²/Δλ、可见度 V = (I_max − I_min)/(I_max + I_min)）；
// 二是不用这些式子：p1 把单缝光源分成许多互不相干的点，各点在双缝后产生的条纹直接相加，在缝间距上二分出条纹消失的位置；
// p3 把均匀光谱按波数分成许多份，各份的条纹相加，在光程差上二分出条纹消失的位置；p4 把两束光的振幅直接相加、在相位差上扫。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.coherence.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, phasorIntensity } from './physics.optics._op.ts';

/**
 * 宽 b 的均匀光源（N 个点，互不相干）离双缝 L，双缝间距 d：屏中央附近条纹的「带号的可见度」，
 * 即各点条纹相位的余弦平均（光源对称，正弦部分抵消）；它变号的地方条纹消失。
 */
function sourceVisibility(b: number, L: number, d: number, lambda: number, N = 2000): number {
  let s = 0;
  for (let j = 0; j < N; j++) {
    const x = -b / 2 + (b * (j + 0.5)) / N;
    s += Math.cos((2 * Math.PI * d * x) / (lambda * L));
  }
  return s / N;
}

/** 波数在 [σ1, σ2] 里均匀分布的光，光程差 Δ 时条纹的带号可见度。 */
function spectrumVisibility(sigma1: number, sigma2: number, delta: number, N = 4000): number {
  const mid = (sigma1 + sigma2) / 2;
  let s = 0;
  for (let j = 0; j < N; j++) {
    const sg = sigma1 + ((sigma2 - sigma1) * (j + 0.5)) / N;
    s += Math.cos(2 * Math.PI * (sg - mid) * delta);
  }
  return s / N;
}

const visibilityOf = (a1: number, a2: number) => {
  let hi = -Infinity;
  let lo = Infinity;
  for (let k = 0; k < 2000; k++) {
    const I = phasorIntensity([[a1, 0], [a2, (2 * Math.PI * k) / 2000]]);
    hi = Math.max(hi, I);
    lo = Math.min(lo, I);
  }
  return (hi - lo) / (hi + lo);
};

export const verification: Verification = {
  lesson: 'physics.optics.coherence',
  notes: {
    p1: 'w = λ/θ_s = λL/b；和直接相加核对：把宽 0.20 mm 的光源分成 2000 个互不相干的点，各点在屏中央附近的条纹相加，在缝间距上二分出带号可见度变号（条纹消失）的位置。',
    p2: '逐条用例子：A λ = 600 nm，Δλ = 1、10 nm 时 l_c = 360、36 μm，越宽越短（错）；B 振幅都为 1、完全相干，相位扫一周最亮 4、最暗 0，V = 1（对）；C 白光 400–700 nm 的相干长度约 0.9 μm、约 2 条条纹，滤成 540–560 nm 后约 15 μm、约 27 条（对）；D 两束光的光强都乘 10，V 不变（错）；E 宽 0.20 mm 的光源离双缝 1 m，缝间距从 0 加大到 2.5 mm，可见度从 1 单调降到 0（对）。',
    p3: 'λ²/Δλ；和直接相加核对：光谱按波数在 [1/(λ+Δλ/2), 1/(λ−Δλ/2)] 里均匀分成 4000 份，在光程差上二分出带号可见度变号的位置（和 λ²/Δλ 只差 (Δλ/2λ)² 量级）。',
    p4: '2√(I₁I₂)/(I₁ + I₂)；和直接相加核对：振幅 3、1，相位差扫一周 2000 点，(最亮 − 最暗)/(最亮 + 最暗)。',
  },
  compute() {
    // p1（mm）
    const lam = 500e-9;
    const formula1 = ((lam * 1.0) / 0.2e-3) * 1000;
    const dZero = bisect((d) => sourceVisibility(0.2e-3, 1.0, d, lam), 0.5e-3, 3.5e-3) * 1000;
    const p1 = agree(dZero, formula1, 'p1 相干宽度', 1e-9);

    // p2
    const lc = (l: number, dl: number) => (l * l) / dl;
    check(Math.abs(lc(600e-9, 1e-9) - 360e-6) < 1e-12 && Math.abs(lc(600e-9, 10e-9) - 36e-6) < 1e-12, 'A：360、36 μm');
    const optA = lc(600e-9, 10e-9) > lc(600e-9, 1e-9);
    const optB = Math.abs(visibilityOf(1, 1) - 1) < 1e-9;
    const zeroAt = (l1: number, l2: number) => bisect((x) => spectrumVisibility(1 / l2, 1 / l1, x), 0.5 / (1 / l1 - 1 / l2), 1.5 / (1 / l1 - 1 / l2));
    const white = zeroAt(400e-9, 700e-9);
    const filt = zeroAt(540e-9, 560e-9);
    check(Math.abs(white - 0.93e-6) < 0.01e-6 && Math.abs(filt - 15.1e-6) < 0.1e-6, 'C：0.93、15.1 μm');
    const optC = filt / 550e-9 > white / 550e-9;
    const optD = Math.abs(visibilityOf(Math.sqrt(10) * 3, Math.sqrt(10) * 1) - visibilityOf(3, 1)) > 1e-12;
    const vs = Array.from({ length: 26 }, (_, k) => sourceVisibility(0.2e-3, 1.0, (k * 2.5e-3) / 25, lam));
    const optE = Math.abs(vs[0] - 1) < 1e-12 && Math.abs(vs[25]) < 1e-9 && vs.every((v, k) => k === 0 || v < vs[k - 1]);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m）
    const l3 = 632.8e-9;
    const dl3 = 2.0e-15;
    const formula3 = lc(l3, dl3);
    const s1 = 1 / (l3 + dl3 / 2);
    const s2 = 1 / (l3 - dl3 / 2);
    const lcNum = bisect((x) => spectrumVisibility(s1, s2, x), 0.5 / (s2 - s1), 1.5 / (s2 - s1));
    const p3 = agree(lcNum, formula3, 'p3 相干长度', 1e-6);

    // p4
    const formula4 = (2 * Math.sqrt(9 * 1)) / (9 + 1);
    const p4 = agree(visibilityOf(3, 1), formula4, 'p4 可见度', 1e-9);

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
