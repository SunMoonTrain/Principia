// 独立验算 physics.oscillations-waves.harmonic-waves 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 λ = v/f、相位差 kΔx、由初始状态定初相；二是不用这些式子，直接对行波 y = F(t − x/v)
// （F 以 1/f 为周期）做数值计算：二分出同一时刻相邻两个波峰的位置量波长，把两点的振动各自投影到 cos、sin 量出初相再相减，
// 在 (−π, π] 上二分出满足位移和运动方向的初相。选择题用具体的数逐条核对。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.harmonic-waves.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, fitSinusoid, wrapAngle } from './physics.oscillations-waves._ow.ts';

/** 同一时刻 g(x) 在 [x0, x0 + span] 里相邻两个极大值的间距（二分 g′ = 0，只取由正变负的）。 */
function crestSpacing(g: (x: number) => number, x0: number, span: number, n = 4000): number {
  const d = (x: number) => (g(x + 1e-7) - g(x - 1e-7)) / 2e-7;
  const peaks: number[] = [];
  const h = span / n;
  for (let i = 0; i < n && peaks.length < 2; i++) {
    const a = x0 + i * h;
    if (d(a) > 0 && d(a + h) <= 0) peaks.push(bisect(d, a, a + h));
  }
  check(peaks.length === 2, '找到两个相邻的波峰');
  return peaks[1] - peaks[0];
}

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.harmonic-waves',
  notes: {
    p1: 'λ = 343/440；和在 t = 0 时对 y = cos(2π·440·(t − x/343)) 二分出相邻两个波峰的位置、量间距核对。',
    p2: '取 A = 1、ω = 3、k = 2：A 同一时刻 y(x + λ) − y(x) 在 5 个点上都是 0（对）；B k = 2，每米的波长个数是 k/(2π) ≈ 0.32（错）；C y(x + λ/2) = −y(x)（对）；D cos(kx − ωt) 的波峰位置随时间增大，向 +x 传（错）；E 最大横向速率 Aω = 3，波速 ω/k = 1.5，不相等（错）。',
    p3: 'Δφ = 2π·0.40·25/30；和把两点的位移随时间的变化各自投影到 cos、sin 量出初相再相减核对。',
    p4: 'cos φ = 1/2、向下运动要 sin φ > 0，φ = π/3；和在 (−π, π] 上二分 A cos φ = A/2、再用数值导数挑出向下运动的那个核对。',
  },
  compute() {
    // p1（m）
    const v1 = 343;
    const f1 = 440;
    const p1 = agree(crestSpacing((x) => Math.cos(2 * Math.PI * f1 * (0 - x / v1)), 0.01, 2), v1 / f1, 'p1 波长', 1e-8);

    // p2
    const A = 1;
    const w = 3;
    const k = 2;
    const lam = (2 * Math.PI) / k;
    const y = (x: number, t: number) => A * Math.cos(w * t - k * x);
    const xs = [0.1, 0.7, 1.3, 2.2, 3.9];
    const optA = xs.every((x) => Math.abs(y(x + lam, 0.4) - y(x, 0.4)) < 1e-12);
    const optB = Math.abs(k - 1 / lam) < 1e-9;
    const optC = xs.every((x) => Math.abs(y(x + lam / 2, 0.4) + y(x, 0.4)) < 1e-12);
    const crestAt = (t: number) => {
      const g = (x: number) => Math.cos(k * x - w * t);
      const d = (x: number) => -k * Math.sin(k * x - w * t);
      for (let x = 0; x < 10; x += 0.01) if (d(x) > 0 && d(x + 0.01) <= 0 && g(x) > 0) return bisect(d, x, x + 0.01);
      throw new Error('没找到波峰');
    };
    const optD = crestAt(0.2) < crestAt(0.1); // 说法是「向 −x 传」：波峰位置应随时间减小
    const ytAt = (t: number) => Math.abs((y(0.3, t + 1e-6) - y(0.3, t - 1e-6)) / 2e-6);
    let vmax = 0;
    for (let i = 0; i <= 200000; i++) vmax = Math.max(vmax, ytAt((i * (2 * Math.PI)) / w / 200000));
    const optE = Math.abs(vmax - w / k) < 1e-6;
    check(Math.abs(vmax - A * w) < 1e-6 * A * w + 1e-8, 'p2 E 最大横向速率是 Aω');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（rad）
    const f3 = 25;
    const v3 = 30;
    const om3 = 2 * Math.PI * f3;
    const wave3 = (x: number) => (t: number) => Math.cos(om3 * (t - x / v3));
    const dphi = wrapAngle(fitSinusoid(wave3(0), om3, 0, 4).phi - fitSinusoid(wave3(0.4), om3, 0, 4).phi);
    const p3 = agree(dphi, (2 * Math.PI * 0.4 * f3) / v3, 'p3 相位差', 1e-9);

    // p4（rad）
    const yt = (phi: number) => (Math.cos(1e-6 + phi) - Math.cos(-1e-6 + phi)) / 2e-6; // ω = 1 时 y(0, t) 在 t = 0 的导数
    const roots = [bisect((phi) => Math.cos(phi) - 0.5, 0, Math.PI), bisect((phi) => Math.cos(phi) - 0.5, -Math.PI, 0)];
    const down = roots.filter((phi) => yt(phi) < 0);
    check(down.length === 1, 'p4 只有一个初相是向下运动');
    const p4 = agree(down[0], Math.PI / 3, 'p4 初相', 1e-12);

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
