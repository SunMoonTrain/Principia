// 独立验算 physics.oscillations-waves.superposition-beats 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的拍频 |f1 − f2|、合振幅在 |A1 − A2| 和 A1 + A2 之间、李萨如图形的切点数之比等于频率之比；
// 二是直接对叠加后的 x(t) 采样：数包络的极小值、找 |x(t)| 的各个峰值，或者对候选频率画出李萨如图形、数它碰到
// 竖直边和水平边的次数。椭圆的选择题用 x ẏ − y ẋ 的符号判转向、用 ⟨xy⟩ 和二阶矩矩阵的本征值判轴向和扁的程度。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.superposition-beats.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen } from './physics.oscillations-waves._ow.ts';

/** x = A cos θ、y = B cos(θ + φ) 一周上的二阶矩：返回 ⟨xy⟩ 和短轴与长轴之比。 */
function ellipseShape(A: number, B: number, phi: number): { xy: number; ratio: number } {
  const n = 3600;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    const th = (2 * Math.PI * i) / n;
    const x = A * Math.cos(th);
    const y = B * Math.cos(th + phi);
    sxx += x * x;
    sxy += x * y;
    syy += y * y;
  }
  const tr = (sxx + syy) / n;
  const det = (sxx * syy - sxy * sxy) / (n * n);
  const disc = Math.sqrt(Math.max((tr * tr) / 4 - det, 0));
  return { xy: sxy / n, ratio: Math.sqrt(Math.max(tr / 2 - disc, 0) / (tr / 2 + disc)) };
}

/** 一个周期里 cos(2πft + φ) 的极大值个数（数导数由正变负）。 */
function countMaxima(f: number, phase: number, T: number): number {
  const n = Math.ceil(T * f * 400);
  let c = 0;
  let prev = -Math.sin(phase);
  for (let i = 1; i <= n; i++) {
    const d = -Math.sin(2 * Math.PI * f * ((i * T) / n) + phase);
    if (prev > 0 && d <= 0) c++;
    prev = d;
  }
  return c;
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.superposition-beats',
  notes: {
    p1: '拍频 |260 − 256| = 4；和对 cos(2π·256t) + cos(2π·260t) 逐个载波周期取 |x| 的最大值当包络、数 1 s 里包络的极小值核对。',
    p2: '取 A = 1、B = 2：A φ = π/2 时 x ẏ − y ẋ = −ABω < 0，顺时针（错）；B φ = 0 时 y/x 恒为 2，x = 0 时 y = 0（对）；C φ = π/4 时 ⟨xy⟩ ≠ 0，轴是斜的（错）；D φ 取一周上 720 个值，x² + y² 都不是常数（对）；E φ 由 0 到 π/2，短轴与长轴之比由 0 单调增到 1/2，越来越圆（错）。',
    p3: '最大 3 + 2，最小 3 − 2；和在一个拍的周期（0.25 s）里找 x(t) 的所有极值点（二分 ẋ = 0），取 |x| 的最大值和最小值核对。',
    p4: '切点数之比等于频率之比：f_y/f_x = 4/3，f_y = 400 Hz；和对 10 Hz 到 1000 Hz 的每个整十候选频率，在图形的一个周期里数 x、y 各取极大值几次（碰到竖直边、水平边的次数），只有 400 Hz 是 3 次、4 次。',
  },
  compute() {
    // p1
    const f1 = 256;
    const f2 = 260;
    const fc = (f1 + f2) / 2;
    const x1 = (t: number) => Math.cos(2 * Math.PI * f1 * t) + Math.cos(2 * Math.PI * f2 * t);
    const env: number[] = [];
    for (let c = 0; c < fc; c++) {
      let mx = 0;
      for (let j = 0; j < 400; j++) mx = Math.max(mx, Math.abs(x1((c + j / 400) / fc)));
      env.push(mx);
    }
    let beats = 0;
    for (let i = 1; i < env.length - 1; i++) if (env[i] < env[i - 1] && env[i] <= env[i + 1] && env[i] < 0.5) beats++;
    const p1 = agree(beats, Math.abs(f2 - f1), 'p1 每秒的拍数', 0);

    // p2
    const A = 1;
    const B = 2;
    const w = 1;
    const t0 = 0.3;
    const xs = (t: number) => A * Math.cos(w * t);
    const ys = (t: number) => B * Math.cos(w * t + Math.PI / 2);
    const h = 1e-6;
    const Lz = xs(t0) * (ys(t0 + h) - ys(t0 - h)) / (2 * h) - ys(t0) * (xs(t0 + h) - xs(t0 - h)) / (2 * h);
    const optA = Lz > 0;
    const optB = [0.2, 0.9, 2.1, 4.0].every((t) => Math.abs(B * Math.cos(t) - (B / A) * A * Math.cos(t)) < 1e-15) && Math.abs(B * Math.cos(Math.PI / 2)) < 1e-15;
    const optC = Math.abs(ellipseShape(A, B, Math.PI / 4).xy) < 1e-12;
    const optD = Array.from({ length: 720 }, (_, i) => (2 * Math.PI * i) / 720).every((phi) => {
      const r2 = Array.from({ length: 360 }, (_, j) => (2 * Math.PI * j) / 360).map((th) => (A * Math.cos(th)) ** 2 + (B * Math.cos(th + phi)) ** 2);
      return Math.max(...r2) - Math.min(...r2) > 1e-6;
    });
    const ratios = [0, 1, 2, 3, 4].map((i) => ellipseShape(A, B, (i * Math.PI) / 8).ratio);
    check(ratios.every((r, i) => i === 0 || r > ratios[i - 1]) && Math.abs(ratios[4] - A / B) < 1e-9, 'p2 E 越来越圆，到 π/2 时短长轴之比是 A/B');
    const optE = ratios.every((r, i) => i === 0 || r < ratios[i - 1]);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（mm）
    const W1 = 2 * Math.PI * 500;
    const W2 = 2 * Math.PI * 504;
    const x3 = (t: number) => 3 * Math.cos(W1 * t) + 2 * Math.cos(W2 * t);
    const dx3 = (t: number) => -3 * W1 * Math.sin(W1 * t) - 2 * W2 * Math.sin(W2 * t);
    const peaks: number[] = [];
    const step = 1e-6;
    for (let t = -1e-4; t < 0.2501; t += step) if (dx3(t) * dx3(t + step) < 0) peaks.push(Math.abs(x3(bisect(dx3, t, t + step))));
    const p3: number[] = [agree(Math.max(...peaks), 3 + 2, 'p3 最大值', 1e-9), agree(Math.min(...peaks), 3 - 2, 'p3 最小值', 1e-9)];

    // p4（Hz）
    const fx = 300;
    const hits = [];
    for (let fy = 10; fy <= 1000; fy += 10) {
      const T = 1 / gcd(fx, fy);
      if (countMaxima(fx, 0.17, T) === 3 && countMaxima(fy, 0.4, T) === 4) hits.push(fy); // 初相取得让极大值不落在区间端点
    }
    check(hits.length === 1, 'p4 只有一个候选频率符合');
    const p4 = agree(hits[0], (fx * 4) / 3, 'p4 竖直方向的频率', 1e-12);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
