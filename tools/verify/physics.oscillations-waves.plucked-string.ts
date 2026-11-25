// 独立验算 physics.oscillations-waves.plucked-string 的 p1–p4（简单题、中等题）。
// 不用讲解里的系数公式。第一套：把弦按特征线的格子一步步推（格距 a、步长恰为 a/v 时差分格式就是达朗贝尔公式本身，
// 折角落在格点上，每个格点的位移随时间就是精确的折线），在一个周期里对时间投影，量出第 n 次成分在每个格点的幅度，
// 沿弦取最大就是这一次谐波的振幅。第二套：直接对初始的折线做正弦积分（折角两侧分开，高斯-勒让德）。两套逐次核对。
// 第三套只用在 p1、p4 上：一串 240 个小球的弦（stringSim，蛙跳法），在好几个周期上投影，容差放宽。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.plucked-string.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, integrate, runString, stringOmega, stringSim } from './physics.oscillations-waves._ow.ts';

/** 在 x = d 处拨起 h 的弦（长 L）的形状：两段直线。 */
const pluck = (d: number, h = 1, L = 1) => (x: number) => (x <= d ? (h * x) / d : (h * (L - x)) / (L - d));

/**
 * 弦长 1、波速 v，分成 N 格，从静止放开，按特征线的格子推一个周期（2N 步，步长 1/(Nv)）。
 * 返回 hist[m][j]：第 m 步时格点 j 的位移。只用「相邻两点之和减去上一步」，即达朗贝尔公式在格点上的样子。
 */
function characteristic(N: number, f: (x: number) => number): number[][] {
  const y0 = Array.from({ length: N + 1 }, (_, j) => (j === 0 || j === N ? 0 : f(j / N)));
  const y1 = y0.map((_, j) => (j === 0 || j === N ? 0 : (y0[j - 1] + y0[j + 1]) / 2));
  const hist = [y0, y1];
  for (let m = 2; m <= 2 * N; m++) {
    const a = hist[m - 1];
    const b = hist[m - 2];
    hist.push(a.map((_, j) => (j === 0 || j === N ? 0 : a[j - 1] + a[j + 1] - b[j])));
  }
  return hist;
}

/**
 * 格点 j 的位移对时间是折线，折点都在整步上：横向速度在每一步里是常数，∫ v sin(nω₁t) dt 逐步精确积出来（基本周期取 1）。
 * 返回横向速度里第 n 次成分的幅度（速度以 1/周期 为单位，只用来比大小）和位移里第 n 次成分的幅度。
 */
function timeHarmonic(hist: number[][], j: number, n: number): { vel: number; disp: number } {
  const M = hist.length - 1;
  const w = 2 * Math.PI * n;
  let s = 0;
  let c = 0;
  for (let m = 0; m < M; m++) {
    const slope = (hist[m + 1][j] - hist[m][j]) * M;
    const t0 = m / M;
    const t1 = (m + 1) / M;
    s += (slope * (Math.cos(w * t0) - Math.cos(w * t1))) / w;
    c += (slope * (Math.sin(w * t1) - Math.sin(w * t0))) / w;
  }
  const vel = 2 * Math.hypot(s, c);
  return { vel, disp: vel / w };
}

/** 第 n 次谐波的振幅：各格点上第 n 次成分幅度的最大值（格数 N 取 2n 的倍数，波腹落在格点上）。 */
function harmonicAmplitude(hist: number[][], n: number): number {
  const N = hist[0].length - 1;
  check(N % (2 * n) === 0, `格数 ${N} 是 2×${n} 的倍数`);
  return Math.max(...Array.from({ length: N + 1 }, (_, j) => timeHarmonic(hist, j, n).disp));
}

/** 第 n 次谐波的振幅（第二套）：初始折线的正弦系数，折角两侧分开做高斯-勒让德积分。 */
function sineCoefficient(d: number, n: number, h = 1, L = 1): number {
  const f = pluck(d, h, L);
  const g = (x: number) => f(x) * Math.sin((n * Math.PI * x) / L);
  return (2 / L) * (integrate(g, 0, d, 8 * n) + integrate(g, d, L, 8 * n));
}

/** 一串小球的弦（长 1、张力 1、线密度 1，n 格）从折线静止放开，在 x 处记 periods 个周期的位移，投影出第 k 次成分的幅度。 */
function chainHarmonics(d: number, x: number, ks: number[], n = 240, periods = 4): { disp: number[]; vel: number[] } {
  const sim = stringSim({ L: 1, n, T: 1, mu: () => 1, y0: pluck(d) });
  const j = Math.round(x * n);
  const steps = Math.ceil((2 * periods) / sim.dtMax);
  const dt = (2 * periods) / steps;
  const cd = ks.map(() => [0, 0]);
  const cv = ks.map(() => [0, 0]);
  for (let m = 0; m < steps; m++) {
    // 链有色散，第 k 次的角频率比 kπ 略低：按这条链自己的值投影
    ks.forEach((k, i) => {
      const w = 2 * n * Math.sin((k * Math.PI) / (2 * n));
      const t = m * dt;
      cd[i][0] += sim.y[j] * Math.cos(w * t);
      cd[i][1] += sim.y[j] * Math.sin(w * t);
      cv[i][0] += sim.v[j] * Math.cos(w * t);
      cv[i][1] += sim.v[j] * Math.sin(w * t);
    });
    sim.step(dt);
  }
  return { disp: cd.map(([a, b]) => (2 * Math.hypot(a, b)) / steps), vel: cv.map(([a, b]) => (2 * Math.hypot(a, b)) / steps) };
}

/** 两套算法都算一遍第 n 次谐波的振幅，核对后返回。 */
function amplitude(d: number, n: number, N: number, h = 1): number {
  const hist = characteristic(N, pluck(d, h));
  const A = harmonicAmplitude(hist, n);
  const B = Math.abs(sineCoefficient(d, n, h));
  check(Math.abs(A - B) < 1e-10 * h, `d = ${d}、n = ${n} 的振幅两套算法一致（${A}，${B}）`);
  return A;
}

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.plucked-string',
  notes: {
    p1: '弦长 1，取 N = 24 格、d = 4/24，按特征线的格子推一个周期，对时间投影，沿弦取最大，A₃/A₁；和折线的正弦积分核对；再和 240 个小球的链在 x = 1/2（第 1、3 次都是波腹）处 4 个周期的投影核对（容差 1%）。',
    p2: '同一算法。A 取 d = 1/8，第 4 次谐波的振幅不是零（错）；B 取 d = 3/8，n = 1…7 都不是零、n = 8 是零（对）；C 取 d = 1/3、1/8、2/5，h 变为 2 倍，n = 1…12 各次振幅都变为 2 倍，推完一个周期都回到初始形状（对）；D 用小球链的数值固有频率：张力 4 倍，n = 1…6 的频率都变为 2 倍，初始形状没变所以各次振幅不变，另用 240 个小球的链核对张力 4 倍时 t = 0.35 的形状就是原来 t = 0.7 的形状（对）；E 取 d = 1/8、1/5、3/10、0.37，和 1 − d 比，n = 1…12 各次振幅相同（所以「有的会变」错）。',
    p3: '对 d/ℓ 在 (0, 1/2) 里二分，要求折线的正弦积分给出 |A₂/A₁| = 0.45，乘 63；和 (ℓ/π) arccos 0.9 核对；再查 |A₂/A₁| 在 (0, 1/2) 上单调、关于中点对称，所以离较近的一端只有一个解；用 N = 1000 格、最近的格点 144/1000 的特征线推法复核附近的值。',
    p4: 'ℓ = 1，N = 24 格，拨点 3/24，拾音器对着 2/24 的格点：横向速度是逐步的常数，精确投影出第 1、2 次成分的幅度之比；和「振幅 × 角频率 × 那一点的正弦」核对；再和 240 个小球的链在 x = 1/12 处的速度投影核对（容差 1%）。拨点、拾音器都从同一端（琴桥）量起。',
  },
  compute() {
    // p1
    const r31 = amplitude(1 / 6, 3, 24) / amplitude(1 / 6, 1, 24);
    const chain1 = chainHarmonics(1 / 6, 1 / 2, [1, 3]).disp;
    agree(chain1[1] / chain1[0], r31, 'p1 小球链', 1e-2);
    const p1 = agree(r31, Math.abs(sineCoefficient(1 / 6, 3) / sineCoefficient(1 / 6, 1)), 'p1 A3/A1', 1e-10);

    // p2
    const amps = (d: number, h = 1, nMax = 12) => Array.from({ length: nMax }, (_, i) => Math.abs(sineCoefficient(d, i + 1, h)));
    // A：d = 1/8 时第 4 次谐波（N = 48：4×2 的倍数，1/8 = 6/48 是格点）
    const a4 = amplitude(1 / 8, 4, 48);
    const optA = a4 < 1e-12;
    check(a4 > 0.01, 'p2 A 第 4 次谐波明显不为零');
    // B：d = 3/8，n = 1…8（每个 n 取 N = 16n 的格子，3/8 是格点）
    const b = Array.from({ length: 8 }, (_, i) => amplitude(3 / 8, i + 1, 16 * (i + 1)));
    const optB = b.slice(0, 7).every((x) => x > 1e-3) && b[7] < 1e-12;
    // C：h 加倍
    const optC = [1 / 3, 1 / 8, 2 / 5].every((d) => {
      const q1 = amps(d, 1);
      const q2 = amps(d, 2);
      const shape = (h: number) => characteristic(120, pluck(d, h));
      const h1 = shape(1);
      const h2 = shape(2);
      const back = h1[240].every((y, j) => Math.abs(y - h1[0][j]) < 1e-12) && h2[240].every((y, j) => Math.abs(y - h2[0][j]) < 1e-12);
      const linear = h1.every((row, m) => row.every((y, j) => Math.abs(h2[m][j] - 2 * y) < 1e-12));
      return back && linear && q1.every((x, i) => Math.abs(q2[i] - 2 * x) < 1e-12);
    });
    // D：张力 4 倍（形状相同，所以振幅就是同一条折线的正弦系数；频率由小球链的数值本征值）
    const shapeAt = (T: number, t: number) => {
      const sim = runString(stringSim({ L: 1, n: 240, T, mu: () => 1, y0: pluck(1 / 5) }), t);
      return Array.from(sim.y);
    };
    const slow = shapeAt(1, 0.7);
    const fast = shapeAt(4, 0.35);
    const optD =
      [1, 2, 3, 4, 5, 6].every((k) => Math.abs(stringOmega(4, 1, 1, k) / stringOmega(1, 1, 1, k) - 2) < 1e-9) &&
      slow.every((y, j) => Math.abs(y - fast[j]) < 1e-10);
    // E：换到另一端
    const same = [1 / 8, 1 / 5, 3 / 10, 0.37].every((d) => {
      const p = amps(d);
      const q = amps(1 - d);
      return p.every((x, i) => Math.abs(x - q[i]) < 1e-12);
    });
    const optE = !same;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（cm）
    const ratio = (u: number) => Math.abs(sineCoefficient(u, 2) / sineCoefficient(u, 1));
    const grid = Array.from({ length: 49 }, (_, i) => ratio((i + 1) / 100));
    check(grid.every((x, i) => i === 0 || x < grid[i - 1]), 'p3 |A2/A1| 在 (0, 1/2) 上递减');
    check([0.1, 0.2, 0.3, 0.45].every((u) => Math.abs(ratio(u) - ratio(1 - u)) < 1e-10), 'p3 关于中点对称');
    const u3 = bisect((u) => ratio(u) - 0.45, 0.02, 0.49);
    const p3 = agree(63 * u3, (63 * Math.acos(0.9)) / Math.PI, 'p3 拨点', 1e-9);
    const hist3 = characteristic(1000, pluck(0.144));
    agree(harmonicAmplitude(hist3, 2) / harmonicAmplitude(hist3, 1), ratio(0.144), 'p3 特征线', 1e-9);
    check(Math.abs(ratio(0.144) - 0.45) < 2e-3, 'p3 0.144 附近');

    // p4
    const hist4 = characteristic(24, pluck(1 / 8));
    const v1 = timeHarmonic(hist4, 2, 1).vel;
    const v2 = timeHarmonic(hist4, 2, 2).vel;
    const viaModes = (n: number) => Math.abs(sineCoefficient(1 / 8, n)) * n * Math.abs(Math.sin((n * Math.PI) / 12));
    agree(v2 / v1, viaModes(2) / viaModes(1), 'p4 速度之比', 1e-10);
    const chain4 = chainHarmonics(1 / 8, 1 / 12, [1, 2]).vel;
    agree(chain4[1] / chain4[0], v2 / v1, 'p4 小球链', 1e-2);
    const p4 = v2 / v1;

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
