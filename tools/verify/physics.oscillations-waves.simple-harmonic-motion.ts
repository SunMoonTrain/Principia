// 独立验算 physics.oscillations-waves.simple-harmonic-motion 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 T = 2π√(m/k)、由初位置初速度定振幅和初相；二是用 RK4 积分运动方程，量向上过零的时刻
// （周期）或第一个极大值的时刻。选择题按定义判：一个 x(t) 是简谐运动，当且仅当 ẍ/x 是一个负的常数 −ω²（x 不恒为零）。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.simple-harmonic-motion.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, maxima, oscillator, periodOf } from './physics.oscillations-waves._ow.ts';

const g = 9.8;
/** 数值二阶导数。 */
const d2 = (f: (t: number) => number, t: number, h = 1e-3) => (f(t + h) - 2 * f(t) + f(t - h)) / (h * h);
/** x(t) 是不是简谐运动：在一组时刻上 ẍ/x 是否同一个负数。 */
function isShm(f: (t: number) => number): boolean {
  const ts = [0.17, 0.53, 0.91, 1.37, 2.03, 2.71, 3.3];
  const r = ts.filter((t) => Math.abs(f(t)) > 1e-3).map((t) => d2(f, t) / f(t));
  return r.every((x) => x < 0) && Math.max(...r) - Math.min(...r) < 1e-4 * Math.abs(r[0]);
}

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.simple-harmonic-motion',
  notes: {
    p1: 'T = 2π√(0.20/80)；和用 RK4 积分 m ẍ = −kx、量 10 个周期的向上过零时刻核对。',
    p2: '按定义逐条：在 7 个时刻上数值算 ẍ/x，是同一个负数才是简谐运动。A cos t + cos 2t 的比值在变（错）；B sin t cos t = ½ sin 2t，比值恒为 −4（对）；C e^{−0.1t} cos t 比值在变（错）；D cos t − √3 sin t = 2cos(t + π/3)，比值恒为 −1（对）。',
    p3: 'ω0 = 4 rad/s，A = √(0.03² + (0.16/4)²) = 0.05 m，cos φ = 0.6、sin φ = −0.8，第一次到最远处是 ω0t + φ = 0；和 RK4 积分、找速度由正变负的时刻（位移的第一个极大值）核对。',
    p4: '静止时伸长 Δl = mg/k，T = 2π√(Δl/g)；和带重力积分竖直的弹簧振子（取 m = 0.3 kg，k = mg/Δl）、量相邻两个最低点的间隔核对。周期和多拉的 1.0 cm 无关。',
  },
  compute() {
    // p1（s）
    const p1 = agree(periodOf(oscillator(0.2, 0, 80), [0.01, 0], 0, 1e-4, 10), 2 * Math.PI * Math.sqrt(0.2 / 80), 'p1 周期', 1e-9);

    // p2
    const opts = [(t: number) => Math.cos(t) + Math.cos(2 * t), (t: number) => Math.sin(t) * Math.cos(t), (t: number) => Math.exp(-0.1 * t) * Math.cos(t), (t: number) => Math.cos(t) - Math.sqrt(3) * Math.sin(t)];
    check(Math.abs(d2(opts[1], 0.4) / opts[1](0.4) + 4) < 1e-4 && Math.abs(d2(opts[3], 0.4) / opts[3](0.4) + 1) < 1e-4, 'p2 B、D 的 ω² 是 4 和 1');
    const p2 = chosen(opts.map(isShm));

    // p3（s）
    const w0 = 4;
    const x0 = 0.03;
    const v0 = 0.16;
    const A = Math.hypot(x0, v0 / w0);
    const phi = Math.atan2(-v0 / (w0 * A), x0 / A);
    check(Math.abs(A - 0.05) < 1e-15 && phi < 0, 'p3 振幅 5 cm，初相为负');
    const first = maxima(oscillator(1.0, 0, 16), [x0, v0], 0, 1, 1e-5, 1)[0];
    check(Math.abs(first.value - A) < 1e-9, 'p3 第一个极大值就是振幅');
    const p3 = agree(first.t, -phi / w0, 'p3 第一次到最远处的时刻', 1e-9);

    // p4（s）：竖直弹簧，x 向下为正、从原长算起
    const dl = 0.02;
    const m = 0.3;
    const k = (m * g) / dl;
    const vertical = (_t: number, y: number[]) => [y[1], g - (k / m) * y[0]];
    const mins = maxima(vertical, [dl + 0.01, 0], 0, 1, 1e-5, 3, 1e-9); // 最低点是 x 的极大值
    const p4 = agree(mins[2].t - mins[1].t, 2 * Math.PI * Math.sqrt(dl / g), 'p4 竖直弹簧的周期', 1e-8);

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
