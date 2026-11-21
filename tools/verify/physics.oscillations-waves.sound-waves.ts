// 独立验算 physics.oscillations-waves.sound-waves 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 v = √(K/ρ₀)、p − p₀ = −Kξ_x、压强振幅 KkA = ρ₀vωA、有风时相对地面的速度 v ± w；
// 二是不用这些式子，把一柱流体切成厚 a 的薄层（每层质量 ρ₀a，截面积取 1），层与层之间那段流体的压强由它此刻的厚度 h
// 按状态方程算（线性的 p₀ − K(h − a)/a，或体积模量处处为 K 的 p₀ + K ln(a/h)），用牛顿第二定律逐层积分（速度 Verlet），
// 再从数值解里量脉冲质心的速度、驱动出来的压强振幅；有风的那题按「声音的波前跟着空气漂移」二分出到达时刻、再二分反解。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.sound-waves.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, waveResidual } from './physics.oscillations-waves._ow.ts';

/**
 * 一柱流体的薄层模型：节点 j（j = 0..n）静止时在 x_j = ja，此刻位移 ξ_j、速度 u_j；节点 j、j+1 之间那段流体此刻厚 h = a + ξ_{j+1} − ξ_j，
 * 压强 pOf(h)。节点质量 ρ₀a，受力 p(左边那段) − p(右边那段)。左端可以按 drive(t) 给定位移，否则两端是不动的墙。
 */
interface LayerChain {
  n: number;
  a: number;
  xi: Float64Array;
  u: Float64Array;
  t: number;
  gapPressure(j: number): number;
  step(dt: number): void;
}

function layerChain(o: { n: number; a: number; rho0: number; pOf: (h: number) => number; xi0?: (x: number) => number; drive?: (t: number) => number }): LayerChain {
  const { n, a, rho0, pOf } = o;
  const m = rho0 * a;
  const xi = Float64Array.from({ length: n + 1 }, (_, j) => (o.xi0 ? o.xi0(j * a) : 0));
  const u = new Float64Array(n + 1);
  const acc = new Float64Array(n + 1);
  const gap = new Float64Array(n);
  const fixEnds = (t: number) => {
    xi[0] = o.drive ? o.drive(t) : 0;
    xi[n] = 0;
  };
  const computeAcc = () => {
    for (let j = 0; j < n; j++) gap[j] = pOf(a + xi[j + 1] - xi[j]);
    for (let j = 1; j < n; j++) acc[j] = (gap[j - 1] - gap[j]) / m;
    acc[0] = acc[n] = 0;
  };
  fixEnds(0);
  computeAcc();
  const chain: LayerChain = {
    n,
    a,
    xi,
    u,
    t: 0,
    gapPressure: (j) => pOf(a + xi[j + 1] - xi[j]),
    step(dt) {
      for (let j = 1; j < n; j++) u[j] += 0.5 * dt * acc[j];
      for (let j = 1; j < n; j++) xi[j] += dt * u[j];
      chain.t += dt;
      fixEnds(chain.t);
      computeAcc();
      for (let j = 1; j < n; j++) u[j] += 0.5 * dt * acc[j];
    },
  };
  return chain;
}

/** 把模拟推进到 tEnd，步长不超过 dtMax，最后一步正好落在 tEnd；每步之后调用 each。 */
function runTo(c: LayerChain, tEnd: number, dtMax: number, each?: () => void): void {
  const steps = Math.ceil((tEnd - c.t) / dtMax);
  const dt = (tEnd - c.t) / steps;
  for (let i = 0; i < steps; i++) {
    c.step(dt);
    each?.();
  }
}

const linearEos = (p0: number, K: number, a: number) => (h: number) => p0 - (K * (h - a)) / a;
/** 体积模量处处为 K 的状态方程：−V dp/dV = K 对任何体积都成立（V 和薄层厚度成正比）。 */
const logEos = (p0: number, K: number, a: number) => (h: number) => p0 + K * Math.log(a / h);

/**
 * 量声速：中心在 xc、宽 w、峰高 amp 的静止高斯位移，放开后分成左右两半；在 t1、t2 两个时刻（两半已经分开、都没碰到墙）
 * 量右半边位移的质心，速度 = 质心移动的距离 / 时间。不用 √(K/ρ₀)：步长和时刻都按 vGuess 取，vGuess 只要大致对就行。
 */
function measuredSpeed(o: { K: number; rho0: number; p0: number; eos: 'linear' | 'log'; amp: number; vGuess: number }): number {
  const a = 1e-3;
  const n = 4000;
  const w = 30 * a;
  const xc = 1.0;
  const pOf = (o.eos === 'linear' ? linearEos : logEos)(o.p0, o.K, a);
  const c = layerChain({ n, a, rho0: o.rho0, pOf, xi0: (x) => o.amp * Math.exp(-(((x - xc) / w) ** 2)) });
  const centroid = () => {
    let s = 0;
    let sx = 0;
    for (let j = 0; j <= n; j++) {
      const x = j * a;
      if (x <= xc) continue;
      s += c.xi[j];
      sx += x * c.xi[j];
    }
    return sx / s;
  };
  const dtMax = (0.5 * a) / o.vGuess;
  const t1 = 0.3 / o.vGuess;
  const t2 = 1.6 / o.vGuess;
  runTo(c, t1, dtMax);
  const c1 = centroid();
  runTo(c, t2, dtMax);
  const c2 = centroid();
  return (c2 - c1) / (t2 - t1);
}

/**
 * 量压强振幅：左端按 A sin ωt 来回推（前两个周期用 sin² 慢慢加大），在离左端半个波长处记下那一段流体的 |p − p₀| 的最大值，
 * 记录的时间窗避开了加大的过程和右端的反射。
 */
function drivenPressureAmplitude(o: { K: number; rho0: number; f: number; A: number; vGuess: number }): number {
  const p0 = 1.0e5;
  const omega = 2 * Math.PI * o.f;
  const T = 1 / o.f;
  const lam = o.vGuess / o.f;
  const a = lam / 400;
  const n = 2000;
  const ramp = (t: number) => (t >= 2 * T ? 1 : Math.sin((Math.PI * t) / (4 * T)) ** 2);
  const c = layerChain({ n, a, rho0: o.rho0, pOf: linearEos(p0, o.K, a), drive: (t) => o.A * ramp(t) * Math.sin(omega * t) });
  const jm = Math.round(lam / 2 / a);
  const dtMax = (0.25 * a) / o.vGuess;
  runTo(c, 4 * T, dtMax);
  let pMax = 0;
  runTo(c, 6 * T, dtMax, () => {
    pMax = Math.max(pMax, Math.abs(c.gapPressure(jm) - p0));
  });
  check(((n * a + (n * a - lam / 2)) / o.vGuess) > 6 * T, 'p4 记录结束前右端的反射还没回到记录处');
  return pMax;
}

/**
 * 量波长：左端按 sin ωt 推（前两个周期用 sin² 慢慢加大），推到第 6 个周期末，在已经稳定、又没碰到右端的那一段
 * （离左端 0.5 到 3.5 个波长，波长按 vGuess 粗估）里找位移的过零点（线性插值），相邻过零点间距的 2 倍就是波长。
 */
function drivenWavelength(o: { K: number; rho0: number; f: number; a: number; n: number; vGuess: number }): number {
  const omega = 2 * Math.PI * o.f;
  const T = 1 / o.f;
  const ramp = (t: number) => (t >= 2 * T ? 1 : Math.sin((Math.PI * t) / (4 * T)) ** 2);
  const c = layerChain({ n: o.n, a: o.a, rho0: o.rho0, pOf: linearEos(1.0e5, o.K, o.a), drive: (t) => 1e-6 * ramp(t) * Math.sin(omega * t) });
  runTo(c, 6 * T, (0.25 * o.a) / o.vGuess);
  const lamGuess = o.vGuess / o.f;
  check(6 * T * o.vGuess * 1.05 < o.n * o.a, '量波长时波前还没到右端');
  const zeros: number[] = [];
  for (let j = 0; j < o.n; j++) {
    const x0 = j * o.a;
    if (x0 < 0.5 * lamGuess || x0 > 3.5 * lamGuess) continue;
    const y0 = c.xi[j];
    const y1 = c.xi[j + 1];
    if (y0 === 0 || y0 * y1 < 0) zeros.push(x0 + (o.a * y0) / (y0 - y1));
  }
  check(zeros.length >= 4, '量波长时找到足够多的过零点');
  return (2 * (zeros[zeros.length - 1] - zeros[0])) / (zeros.length - 1);
}

/** 有风（风速 w，从 A 吹向 B）时，从 A 发出的声音到达 B 的时刻：波前是以 v 扩大的球面，球心随空气以 w 漂移。二分求 v t = |L − w t|。 */
function arrivalDownwind(v: number, w: number, L: number): number {
  return bisect((t) => v * t - Math.abs(L - w * t), 0, (10 * L) / v);
}
/** 从 B（在 x = L）发出的声音到达 A（在 x = 0）的时刻：球心在 L + w t，二分求 v t = L + w t。 */
function arrivalUpwind(v: number, w: number, L: number): number {
  return bisect((t) => v * t - Math.abs(0 - (L + w * t)), 0, (10 * L) / (v - w));
}

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.sound-waves',
  notes: {
    p1: 'v = √(2.85×10¹⁰ / 1.36×10⁴)；和薄层模型核对：体积模量处处为 K 的状态方程 p₀ + K ln(a/h)，a = 1 mm，宽 30a、|ξ_x| 约 10⁻⁶ 的静止高斯脉冲，量右半边位移质心在 t = 0.3/v 到 1.6/v 之间移动的速度。',
    p2: 'A 取 ξ = A cos kx 在 kx = 3π/2 处（ξ_x > 0），量那里一段流体的厚度变大、按两种状态方程算压强都低于 p₀，是膨胀不是压缩（错）；B 空气 K = 1.2×343²、ρ₀ = 1.2：cos(2πf(t − x/v)) 对 f = 500、1000 Hz 都满足同一个波动方程（中心差分残差为零）；薄层模型左端分别以 500、1000 Hz 驱动，数稳定段位移的过零点量出波长，之比 0.5（对）；C 反例：水 K = 2.2×10⁹、ρ = 998 和水银 K = 2.85×10¹⁰、ρ = 1.36×10⁴，薄层模型量出 K 大的水银声速反而小（错）；D 薄层模型（线性状态方程，以及 ln 状态方程下 |ξ_x| 约 10⁻⁶、2×10⁻⁶）量出两种振幅的速度相同（错）；E K 都乘 4、ρ₀ 都乘 4 的两种流体，薄层模型量出的速度相同（对）。',
    p3: 'v = (600/1.635 + 600/1.954)/2，w = (600/1.635 − 600/1.954)/2；和二分核对：波前球心随空气漂移，二分求到达时刻，先对 w 二分对上顺风的 1.635 s，再对 v 二分对上逆风的 1.954 s。另算把两次时间平均的错法 1200/(1.635 + 1.954)，和 v 差 7.9×10⁻³，超出 rel 5×10⁻³（批次 25 复核时照修订后的题改的数）。',
    p4: 'A = 0.30/(ρ₀vω)，ρ₀ = 1.20、v = 343、ω = 2π×500，换成 μm；和薄层模型核对：K = ρ₀v²，左端按 A sin ωt 推（前两个周期慢慢加大），a = λ/400，在离左端半个波长处量 |p − p₀| 的最大值，按线性反解出压强振幅为 0.30 Pa 的 A。',
  },
  compute() {
    // p1（m/s）
    const K1 = 2.85e10;
    const rho1 = 1.36e4;
    const v1 = Math.sqrt(K1 / rho1);
    const p1 = agree(measuredSpeed({ K: K1, rho0: rho1, p0: 1.0e5, eos: 'log', amp: 3e-8, vGuess: 1400 }), v1, 'p1 水银中的声速', 1e-4);

    // p2
    const p0 = 1.0e5;
    // A：ξ = A cos kx 在 kx = 3π/2 处 ξ_x = Ak > 0；量那里厚 a 的一段，判断「被压缩、压强高于 p₀」成不成立
    const Kair = 1.2 * 343 ** 2;
    let optA: boolean;
    {
      const amp = 1e-6;
      const k = (2 * Math.PI) / 0.686;
      const xA = (3 * Math.PI) / 2 / k;
      const a = 1e-5;
      const xiA = (x: number) => amp * Math.cos(k * x);
      check((xiA(xA + 1e-7) - xiA(xA - 1e-7)) / 2e-7 > 0, 'p2 A 取的点 ξ_x > 0');
      const h = a + xiA(xA + a / 2) - xiA(xA - a / 2);
      const compressed = h < a;
      const higher = [linearEos(p0, Kair, a)(h), logEos(p0, Kair, a)(h)].map((p) => p > p0);
      check(higher[0] === higher[1], 'p2 A 两种状态方程的判断一致');
      optA = compressed && higher[0];
    }
    // B：同一种空气，频率 500、1000 Hz，各自驱动出来的波长之比
    const vAir = measuredSpeed({ K: Kair, rho0: 1.2, p0, eos: 'linear', amp: 1e-6, vGuess: 340 });
    agree(vAir, Math.sqrt(Kair / 1.2), 'p2 B 空气中的速度', 1e-4);
    for (const f of [500, 1000]) {
      const res = waveResidual((x, t) => Math.cos(2 * Math.PI * f * (t - x / vAir)), vAir, 0.37, 0.011, 1e-6);
      check(Math.abs(res) < 1e-3 * (2 * Math.PI * f) ** 2, `p2 B f = ${f} Hz 的简谐波满足同一个波动方程`);
    }
    const lams = [500, 1000].map((f) => drivenWavelength({ K: Kair, rho0: 1.2, f, a: 0.686 / 400, n: 4000, vGuess: 340 }));
    agree(lams[0], vAir / 500, 'p2 B 500 Hz 的波长', 1e-3);
    const optB = Math.abs(lams[1] / lams[0] - 0.5) < 1e-3;
    // C：水银（K 大）和水（K 小）：K 大的那种声速是不是更大
    const vHg = p1;
    const vWater = measuredSpeed({ K: 2.2e9, rho0: 998, p0, eos: 'log', amp: 3e-8, vGuess: 1400 });
    agree(vWater, Math.sqrt(2.2e9 / 998), 'p2 C 水中的声速', 1e-4);
    const pairs = [
      { K: 2.85e10, v: vHg },
      { K: 2.2e9, v: vWater },
    ];
    const bigK = pairs[0].K > pairs[1].K ? pairs[0] : pairs[1];
    const smallK = bigK === pairs[0] ? pairs[1] : pairs[0];
    const optC = bigK.v > smallK.v;
    // D：同一种流体（空气），振幅相差一倍
    const vSmall = measuredSpeed({ K: Kair, rho0: 1.2, p0, eos: 'log', amp: 3e-8, vGuess: 340 });
    const vBig = measuredSpeed({ K: Kair, rho0: 1.2, p0, eos: 'log', amp: 6e-8, vGuess: 340 });
    const vLinSmall = measuredSpeed({ K: Kair, rho0: 1.2, p0, eos: 'linear', amp: 1e-6, vGuess: 340 });
    const vLinBig = measuredSpeed({ K: Kair, rho0: 1.2, p0, eos: 'linear', amp: 5e-6, vGuess: 340 });
    const optD = vBig > vSmall * (1 + 1e-5) || vLinBig > vLinSmall * (1 + 1e-9);
    // E：第一种 K = 4K₂、ρ = 4ρ₂
    const vE1 = measuredSpeed({ K: 4 * 2.2e9, rho0: 4 * 998, p0, eos: 'log', amp: 3e-8, vGuess: 1400 });
    const optE = Math.abs(vE1 / vWater - 1) < 1e-6;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m/s）
    const L = 600;
    const t1 = 1.635;
    const t2 = 1.954;
    const vExact = (L / t1 + L / t2) / 2;
    const wExact = (L / t1 - L / t2) / 2;
    const wFor = (v: number) => bisect((w) => arrivalDownwind(v, w, L) - t1, -0.5 * v, 0.5 * v);
    const vNum = bisect((v) => arrivalUpwind(v, wFor(v), L) - t2, 300, 400);
    const p3 = [agree(vNum, vExact, 'p3 静止空气中的声速', 1e-9), agree(wFor(vNum), wExact, 'p3 风速', 1e-7)];
    // 把两次时间平均的错法要落在判题容差（rel 5×10⁻³）以外
    check(Math.abs((2 * L) / (t1 + t2) / vExact - 1) > 5e-3, 'p3 时间平均的错法超出容差');

    // p4（μm）
    const rho4 = 1.2;
    const v4 = 343;
    const f4 = 500;
    const Aexact = 0.3 / (rho4 * v4 * 2 * Math.PI * f4);
    const Atest = 1e-6;
    const pAmp = drivenPressureAmplitude({ K: rho4 * v4 * v4, rho0: rho4, f: f4, A: Atest, vGuess: v4 });
    const Anum = (Atest * 0.3) / pAmp;
    const p4 = agree(Anum * 1e6, Aexact * 1e6, 'p4 位移振幅', 1e-3);

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
