// 独立验算 physics.optics.fourier-optics 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（傅里叶变换的平移、卷积定理：光栅 = 单缝因子 × 多缝因子，余弦光栅只有 0、±1 级）；
// 二是不用变换的性质：把孔径函数在很细的格点上取值，各点的次波按 t(x)·e^{ikx sinθ} 直接相加，在 sinθ 上扫描、黄金分割找峰。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.fourier-optics.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, check, chosen, deg } from './physics.optics._op.ts';

type Aperture = (x: number) => [number, number]; // 复数透过率 t(x)
/** 宽为 W（−W/2 到 W/2）的孔径，按每段 dx 取中点，次波直接相加，返回 sinθ = s 方向的光强。 */
function farIntensity(t: Aperture, W: number, dx: number, lambda: number, s: number): number {
  const k = (2 * Math.PI) / lambda;
  const n = Math.round(W / dx);
  let re = 0;
  let im = 0;
  for (let j = 0; j < n; j++) {
    const x = -W / 2 + (j + 0.5) * dx;
    const [tr, ti] = t(x);
    const c = Math.cos(k * x * s);
    const sn = Math.sin(k * x * s);
    re += tr * c - ti * sn;
    im += tr * sn + ti * c;
  }
  return (re * dx) ** 2 + (im * dx) ** 2;
}
/** N 条宽 a、间距 d 的缝（可以各带一个相位），中心对称排开。 */
const grating = (N: number, d: number, a: number, phase: (j: number) => number = () => 0): Aperture => (x) => {
  const j = Math.round(x / d + (N - 1) / 2);
  if (j < 0 || j >= N) return [0, 0];
  const xc = (j - (N - 1) / 2) * d;
  if (Math.abs(x - xc) > a / 2) return [0, 0];
  return [Math.cos(phase(j)), Math.sin(phase(j))];
};

export const verification: Verification = {
  lesson: 'physics.optics.fourier-optics',
  notes: {
    p1: '余弦光栅只有 0、±1 级，sinθ = λ/d；和直接相加核对：宽 200 个周期的 t(x) = ½(1 + cos 2πx/d)，在 sinθ 上扫描，正前方以外最亮的峰再黄金分割。',
    p2: '逐条用例子（直接相加）：A 40 条缝（a = d/3）平移 d/2，0 到 3 级的光强都不变（对）；B 缝宽比波长大得多：a = 100λ 加倍，第一暗纹的偏角由 0.5730° 变成 0.2865°，比值 0.49999（对）；C 透过率 cos²(πx/d) 的宽光栅 ±2、±3 级的光强不到零级的 10⁻⁸（对）；D 照明宽 2 mm 里一根 0.1 mm 的细丝和同宽的单缝，正前方的光强相差约 360 倍（错）；E 空间频率 q/2π > 1/λ 时要 sinθ > 1，传不到远处（错）。',
    p3: '单缝因子 (sinβ/β)²，β = π/3；和直接相加核对：60 条缝、每条分 2000 段，第一级方向和正前方的光强之比。',
    p4: '相位交替的两组缝合成周期 2d、零级和原来各级相消，最近的亮纹 sinθ = λ/(2d)；和直接相加核对：缝的相位交替为 0、π（缝宽取 d/2 和 d/4 两种），40 条缝从正前方往外扫到第一个亮峰，再用 2000 条缝在它附近定位置。',
  },
  compute() {
    // p1（度）
    const d1 = 2.0e-6;
    const lam1 = 500e-9;
    const W1 = 200 * d1;
    // 照明光束用平滑的 cos² 窗（宽 W1），压掉有限宽度带来的旁瓣，否则零级的旁瓣会把第一级的峰挤偏十万分之几
    const cosG: Aperture = (x) => [0.5 * (1 + Math.cos((2 * Math.PI * x) / d1)) * Math.cos((Math.PI * x) / W1) ** 2, 0];
    const I1 = (s: number) => farIntensity(cosG, W1, d1 / 40, lam1, s);
    // 扫描 0 < s < 1（避开正前方的峰），找最亮处
    let sBest = 0;
    let vBest = -1;
    const w1 = lam1 / W1; // 峰的宽度
    for (let s = 5 * w1; s < 0.999; s += w1 / 4) {
      const v = I1(s);
      if (v > vBest) {
        vBest = v;
        sBest = s;
      }
    }
    const sPeak = argmax(I1, sBest - w1 / 2, sBest + w1 / 2);
    // 其余方向（第二级的位置）几乎没有光
    check(I1(2 * lam1 / d1) < 1e-8 * I1(0), 'p1 没有第二级');
    const formula1 = Math.asin(lam1 / d1) / deg;
    const p1 = agree(Math.asin(sPeak) / deg, formula1, 'p1 衍射光的偏角', 1e-6);

    // p2
    const dA = 1;
    const lamA = 0.25;
    const gA = grating(40, dA, dA / 3);
    const gAshift: Aperture = (x) => gA(x - dA / 2);
    const optA = [0, 1, 2, 3].every((m) => {
      const s = (m * lamA) / dA;
      const i0 = farIntensity(gA, 42 * dA, dA / 200, lamA, s);
      const i1 = farIntensity(gAshift, 42 * dA, dA / 200, lamA, s);
      return Math.abs(i0 - i1) < 1e-9 * farIntensity(gA, 42 * dA, dA / 200, lamA, 0);
    });
    const halfB = (a: number) => Math.asin(1 / a) / deg; // λ = 1
    const ratioB = halfB(200) / halfB(100);
    check(Math.abs(ratioB - 0.5) < 1e-4, 'B：角度小时减半');
    const optB = Math.abs(ratioB - 0.5) < 1e-4;
    const dC = 1;
    const lamC = 0.3;
    const cos2: Aperture = (x) => [Math.cos((Math.PI * x) / dC) ** 2, 0];
    const i0C = farIntensity(cos2, 200 * dC, dC / 40, lamC, 0);
    const optC = [2, 3].every((m) => farIntensity(cos2, 200 * dC, dC / 40, lamC, (m * lamC) / dC) < 1e-8 * i0C) &&
      farIntensity(cos2, 200 * dC, dC / 40, lamC, lamC / dC) > 0.01 * i0C;
    const Wd = 2e-3;
    const aD = 0.1e-3;
    const wire: Aperture = (x) => [Math.abs(x) > aD / 2 ? 1 : 0, 0];
    const slit: Aperture = (x) => [Math.abs(x) <= aD / 2 ? 1 : 0, 0];
    const iw = farIntensity(wire, Wd, 1e-6, 600e-9, 0);
    const is = farIntensity(slit, Wd, 1e-6, 600e-9, 0);
    check(iw / is > 300, 'D：正前方相差几百倍');
    const optD = Math.abs(iw / is - 1) < 0.01;
    const optE = false; // sinθ = λ·q/2π > 1，没有这个方向（见 notes）
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const d3 = 1;
    const lam3 = 0.2;
    const g3 = grating(60, d3, d3 / 3);
    const formula3 = (Math.sin(Math.PI / 3) / (Math.PI / 3)) ** 2;
    // 每条缝分 2000 段（中点求和的误差 ∝ 1/段数²，分 200 段时有 10⁻⁵ 的偏差）
    const num3 = farIntensity(g3, 61 * d3, d3 / 6000, lam3, lam3 / d3) / farIntensity(g3, 61 * d3, d3 / 6000, lam3, 0);
    const p3 = agree(num3, formula3, 'p3 第一级和零级之比', 1e-6);

    // p4（度）
    const d4 = 2.0e-6;
    const lam4 = 600e-9;
    const formula4 = Math.asin(lam4 / (2 * d4)) / deg;
    // 先用 40 条缝从正前方往外扫，找到第一个亮峰（亮过最亮处的一半）；单缝包络的斜率会把有限光栅的峰挤偏，
    // 偏移 ∝ 1/条数²，再用 2000 条缝在这个峰的附近细扫、黄金分割定位置。
    const firstPeak = (a: number) => {
      const coarse = grating(40, d4, a, (j) => (j % 2) * Math.PI);
      const Ic = (s: number) => farIntensity(coarse, 41 * d4, d4 / 40, lam4, s);
      const wc = lam4 / (40 * d4);
      let top = 0;
      for (let s = 0; s < 0.5; s += wc / 8) top = Math.max(top, Ic(s));
      let sc = NaN;
      for (let s = wc / 8; s < 0.5; s += wc / 8) {
        const v = Ic(s);
        if (v > 0.5 * top && v >= Ic(s - wc / 8) && v >= Ic(s + wc / 8)) {
          sc = s;
          break;
        }
      }
      const fine = grating(2000, d4, a, (j) => (j % 2) * Math.PI);
      // 格点取 d/24：缝边界正好落在两个格点之间，不和格点重合（重合时舍入会让各条缝宽窄不一）
      const If = (s: number) => farIntensity(fine, 2001 * d4, d4 / 24, lam4, s);
      const wf = lam4 / (2000 * d4);
      let sBest = sc;
      let vBest = -1;
      for (let s = sc - wc; s <= sc + wc; s += wf / 8) {
        const v = If(s);
        if (v > vBest) {
          vBest = v;
          sBest = s;
        }
      }
      return Math.asin(argmax(If, sBest - wf / 4, sBest + wf / 4)) / deg;
    };
    const a1 = firstPeak(d4 / 2);
    const a2 = firstPeak(d4 / 4);
    check(Math.abs(a1 - a2) < 1e-6 * a1, 'p4 和缝宽无关');
    const p4 = agree(a1, formula4, 'p4 最近的亮纹', 1e-6);

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
