// 独立验算 physics.oscillations-waves.group-velocity 的 p1–p4（简单题、中等题）。
// 两套算法：一是 v_p = ω/k、v_g = dω/dk（两列波时是 Δω/Δk）和题面给的展宽时间 w²/(2|ω''|)，导数用色散关系的解析式；
// 二是不用这些式子，把许多列简谐波直接加起来，再从叠加出的波形里量：两列波跟踪 y 的两族零点，
// 波包跟踪 |f| 的峰和峰前、峰后的局部波数，长浪找窄波包的 |f| 在海岸处最大的时刻、再二分距离。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.group-velocity.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, bisect, cabs, check, chosen, type Cx } from './physics.oscillations-waves._ow.ts';

/** 高斯波包：Σ exp(−w²(k−k0)²/4) e^{i(ω(k)t − kx)}，k 在 k0 左右 span/w 的范围里等间隔取 2n+1 个。返回 f 和 ∂f/∂x。 */
function packet(omega: (k: number) => number, k0: number, w: number, n = 300, span = 12) {
  const dk = span / w / n;
  const ks = Array.from({ length: 2 * n + 1 }, (_, i) => k0 + (i - n) * dk);
  const amp = ks.map((k) => Math.exp(-((w * (k - k0)) ** 2) / 4));
  const om = ks.map(omega);
  check(ks.every((k, i) => k > 0 || amp[i] < 1e-12), '波包里只有 k > 0 的成分');
  return (x: number, t: number): { f: Cx; fx: Cx } => {
    let re = 0;
    let im = 0;
    let dre = 0;
    let dim = 0;
    for (let i = 0; i < ks.length; i++) {
      const ph = om[i] * t - ks[i] * x;
      const c = amp[i] * Math.cos(ph);
      const s = amp[i] * Math.sin(ph);
      re += c;
      im += s;
      dre += ks[i] * s; // ∂/∂x e^{i(ωt−kx)} = −ik e^{…}
      dim += -ks[i] * c;
    }
    return { f: [re, im], fx: [dre, dim] };
  };
}

/** |f| 在 [lo, hi] 里的峰：先粗扫再黄金分割。 */
function peakAt(p: ReturnType<typeof packet>, t: number, lo: number, hi: number, scan = 400): number {
  let best = lo;
  let bv = -1;
  const h = (hi - lo) / scan;
  for (let i = 0; i <= scan; i++) {
    const v = cabs(p(lo + i * h, t).f);
    if (v > bv) {
      bv = v;
      best = lo + i * h;
    }
  }
  return argmax((x) => cabs(p(x, t).f), best - h, best + h);
}

/** 局部波数：e^{i(ωt−kx)} 的相位随 x 减小的快慢，−Im(f_x/f)。 */
function localK(p: ReturnType<typeof packet>, x: number, t: number): number {
  const { f, fx } = p(x, t);
  return -(fx[1] * f[0] - fx[0] * f[1]) / (f[0] * f[0] + f[1] * f[1]);
}

/** 中心差分加一次理查森外推。 */
const diff = (g: (x: number) => number, x: number, h: number): number => {
  const d = (s: number) => (g(x + s) - g(x - s)) / (2 * s);
  return (4 * d(h / 2) - d(h)) / 3;
};
const diff2 = (g: (x: number) => number, x: number, h: number): number => {
  const d = (s: number) => (g(x + s) - 2 * g(x) + g(x - s)) / (s * s);
  return (4 * d(h / 2) - d(h)) / 3;
};

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.group-velocity',
  notes: {
    p1: '波峰 (59+61)/(1.9+2.1)，包络 (61−59)/(2.1−1.9)；和跟踪 y₁+y₂ 的两族零点（快因子的、慢因子的）在 t = 0 到 0.02 s 里各移动多远核对；再用一个载波周期里 y² 的平均值找包络的峰，量它的速度。',
    p2: '取 ω = k²、k + k³、e^k − 1、0.5k + 0.3k²、√(1+k²)·k（都满足 ω(0)=0、ω\'(0)≥0、ω\'\'>0），k₀ = 0.8、1.5、2.4，造窄高斯波包直接叠加、量 |f| 的峰的速度：A 载波零点的速度等于 OP 的斜率（对）；B 峰的速度和 OP 的斜率不等（错）；C 峰的速度总比相速度大（错）；D 把 k₀ 加大 0.3，峰的速度变大（对）；E t = 3·w²/(2ω\'\') 时峰前面的局部波数比峰后面的大（对）。',
    p3: 'ω = √(v²k²+ω_c²)：v_g = v²k/ω，ω\'\' = v²ω_c²/ω³，距离 v_g·w²/(2ω\'\')；和差分求导核对，再直接叠加这个波包、量 |f| 的峰在那段时间里走了多远（波包不是无限窄，容差 1%）。',
    p4: 'v_g = g/(2ω) = gT/(4π)，d = Δt/(1/v₁₅ − 1/v₁₈)；和在海岸处叠加频率在 2π/18、2π/15 附近很窄一段里的波（k = ω²/g）、找 |f| 最大的时刻、再二分 d 使两个时刻差 10 h 核对。',
  },
  compute() {
    // p1（m/s）
    const y = (x: number, t: number) => Math.cos(59 * t - 1.9 * x) + Math.cos(61 * t - 2.1 * x);
    // 快因子的一个零点（t = 0 时在 x = π/4 附近）和慢因子的一个零点（t = 0 时在 x = 5π 附近）
    const track = (x0: number, t1: number): number => {
      let x = x0;
      const steps = 200;
      for (let i = 0; i <= steps; i++) {
        const t = (t1 * i) / steps;
        const d = 0.12;
        x = bisect((xx) => y(xx, t), x - d, x + d);
      }
      return x;
    };
    const t1 = 0.02;
    const vFast = (track(Math.PI / 4, t1) - Math.PI / 4) / t1;
    const vSlow = (track(5 * Math.PI, t1) - 5 * Math.PI) / t1;
    // 一个载波周期里 y² 的平均：平均时让 x 不动、对时间平均（π/30 s），峰随 t 走
    const env = (x: number, t: number) => {
      const n = 400;
      let s = 0;
      for (let i = 0; i < n; i++) s += y(x, t + ((i + 0.5) / n - 0.5) * (Math.PI / 30)) ** 2;
      return s / n;
    };
    const xe = [0, 0.3].map((t) => argmax((x) => env(x, t), 10 * t - 6, 10 * t + 6));
    const p1: number[] = [agree(vFast, (59 + 61) / (1.9 + 2.1), 'p1 波峰（快因子的零点）', 1e-9), agree(vSlow, (61 - 59) / (2.1 - 1.9), 'p1 包络（慢因子的零点）', 1e-9)];
    check(Math.abs((xe[1] - xe[0]) / 0.3 - 10) < 0.2, 'p1 y² 平均值的峰的速度约 10');

    // p2
    const fns: ((k: number) => number)[] = [(k) => k * k, (k) => k + k ** 3, (k) => Math.exp(k) - 1, (k) => 0.5 * k + 0.3 * k * k, (k) => k * Math.sqrt(1 + k * k)];
    const k0s = [0.8, 1.5, 2.4];
    const flags: boolean[][] = [];
    for (const om of fns) {
      check(Math.abs(om(0)) < 1e-15 && diff(om, 1e-3, 5e-4) >= -1e-9 && [0.2, 0.5, 1, 2, 3].every((k) => diff2(om, k, 1e-3) > 0), 'p2 检验函数满足题设');
      const speed = (k0: number, w: number, t: number) => {
        const p = packet(om, k0, w);
        const L = om(k0 * 1.6) / (k0 * 1.6);
        const guessMax = 6 * L * t + 4 * w;
        const a = peakAt(p, 0, -2 * w, 2 * w);
        const b = peakAt(p, t, -2 * w, guessMax, 3000);
        return (b - a) / t;
      };
      for (const k0 of k0s) {
        const w = 80 / k0;
        const t = (0.2 * w) / Math.max(1e-9, om(k0) / k0);
        // A：载波 cos(ωt − k0x) 的一个零点
        const xz = [0, t / 50].map((s, i) => bisect((x) => Math.cos(om(k0) * s - k0 * x), Math.PI / 2 / k0 + (i * om(k0) * s) / k0 - 0.5 / k0, Math.PI / 2 / k0 + (i * om(k0) * s) / k0 + 0.5 / k0));
        const vp = (xz[1] - xz[0]) / (t / 50);
        const slopeOP = (om(k0) - om(0)) / k0;
        const vg = speed(k0, w, t);
        const vg2 = speed(k0 + 0.3, 80 / k0, t);
        const p = packet(om, k0, w, 600);
        const tl = (3 * w * w) / (2 * Math.abs(diff2(om, k0, 1e-3)));
        // 峰在 t = tl 时的位置（不用群速度公式，从 |f| 上找），峰前、峰后各 1.5w 处量局部波数
        const xc = peakAt(p, tl, 0.2 * (om(k0) / k0) * tl, 4 * (om(k0) / k0) * tl, 3000);
        const ahead = localK(p, xc + 1.5 * w, tl);
        const behind = localK(p, xc - 1.5 * w, tl);
        check(Math.abs(vg - diff(om, k0, 1e-3)) < 0.02 * vg, 'p2 量出的峰速就是切线斜率');
        flags.push([Math.abs(vp - slopeOP) < 1e-6 * slopeOP, Math.abs(vg - slopeOP) < 0.02 * slopeOP, vg < vp, vg2 > vg, ahead > behind]);
      }
    }
    const p2 = chosen([0, 1, 2, 3, 4].map((i) => {
      const vals = flags.map((f) => f[i]);
      check(vals.every((v) => v === vals[0]), `p2 选项 ${'ABCDE'[i]} 在各个检验函数上真假一致`);
      return vals[0];
    }));

    // p3（m）
    const v = 40;
    const wc = 30;
    const k0 = 1;
    const w = 12;
    const om3 = (k: number) => Math.sqrt(v * v * k * k + wc * wc);
    const vg3 = agree(diff(om3, k0, 1e-2), (v * v * k0) / om3(k0), 'p3 群速度', 1e-7);
    const om2 = agree(diff2(om3, k0, 1e-2), (v * v * wc * wc) / om3(k0) ** 3, 'p3 二阶导数', 1e-6);
    const ts = (w * w) / (2 * Math.abs(om2));
    const pk = packet(om3, k0, w, 600, 11.9);
    const moved = peakAt(pk, ts, 100, 300, 2000) - peakAt(pk, 0, -20, 20);
    check(Math.abs(moved - vg3 * ts) < 0.01 * vg3 * ts, `p3 直接叠加出的波包走了 ${moved} m`);
    const p3 = vg3 * ts;

    // p4（km）
    const g = 9.8;
    const arrival = (T: number, d: number): number => {
      const w0 = (2 * Math.PI) / T;
      const s = 0.0015;
      const N = 600; // 频率间隔 1.25e-5 rad/s，叠加的波形每隔 5.0e5 s 重复，比要扫的范围（约 3e5 s）长
      const oms = Array.from({ length: 2 * N + 1 }, (_, i) => w0 + ((i - N) / N) * 5 * s);
      const amp = oms.map((o) => Math.exp(-(((o - w0) / s) ** 2) / 2));
      const mag = (t: number) => {
        let re = 0;
        let im = 0;
        for (let i = 0; i < oms.length; i++) {
          const ph = oms[i] * t - (oms[i] * oms[i] * d) / g;
          re += amp[i] * Math.cos(ph);
          im += amp[i] * Math.sin(ph);
        }
        return Math.hypot(re, im);
      };
      // 粗扫（步长约 190 s，比到岸时脉冲的宽度小）后黄金分割
      const lo = 0.02 * ((4 * Math.PI * d) / (g * T));
      const hi = 1.6 * ((4 * Math.PI * d) / (g * T));
      let best = lo;
      let bv = -1;
      const scan = 1500;
      for (let i = 0; i <= scan; i++) {
        const t = lo + ((hi - lo) * i) / scan;
        const m = mag(t);
        if (m > bv) {
          bv = m;
          best = t;
        }
      }
      const h = (hi - lo) / scan;
      return argmax(mag, best - 2 * h, best + 2 * h);
    };
    const exact4 = (36000 / (1 / ((g * 15) / (4 * Math.PI)) - 1 / ((g * 18) / (4 * Math.PI)))) / 1000;
    const dNum = bisect((dkm) => arrival(15, dkm * 1000) - arrival(18, dkm * 1000) - 36000, 2000, 3200);
    const p4 = agree(dNum, exact4, 'p4 距离', 1e-4);

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
