// 独立验算 physics.optics.resolving-power 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（最小分辨角 θ_min = 1.22λ/D、显微镜 d_min = 0.61λ/(n sin u)）；
// 二是不用 1.22 这个系数：把圆孔分成垂直于观察方向的细条，细条长 2√(R² − x²)，次波直接积分得到夫琅禾费振幅，
// 二分出第一个暗环（得到的系数是 1.2197），再按瑞利判据换算；它和 1.22 差万分之三，题目要三位有效数字，按 5×10⁻⁴ 的相对误差核对，
// 和标准答案比对的是讲解约定的 1.22。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.resolving-power.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen } from './physics.optics._op.ts';
import { integrate } from './physics.electromagnetism._es.ts';

/** 直径 D 的圆孔在 sinθ = s 方向上的夫琅禾费振幅（相对于正前方）：细条长度加权的次波积分。 */
function airyAmp(D: number, lambda: number, s: number): number {
  const R = D / 2;
  const k = (2 * Math.PI) / lambda;
  const f = (x: number) => 2 * Math.sqrt(Math.max(0, R * R - x * x));
  return integrate((x) => f(x) * Math.cos(k * x * s), -R, R, 200, 16) / integrate(f, -R, R, 200, 16);
}
/** 第一个暗环的 sinθ（二分）。 */
const firstDark = (D: number, lambda: number) => bisect((s) => airyAmp(D, lambda, s), (1.0 * lambda) / D, (1.4 * lambda) / D);
const ARCSEC = Math.PI / 180 / 3600;

export const verification: Verification = {
  lesson: 'physics.optics.resolving-power',
  notes: {
    p1: 'θ_min = 1.22λ/D 换成角秒；和细条积分核对：二分出第一个暗环 sinθ₁ = 1.2197λ/D，相对差 2.7×10⁻⁴（三位有效数字内）。',
    p2: '逐条用例子（细条积分）：A D = 10、20 cm 时第一个暗环 3.05×10⁻⁶、1.53×10⁻⁶（λ = 500 nm），减半（对）；B 650 nm 的暗环比 450 nm 的大（错）；C d_min = 0.61λ/(n sin u) 只含物镜一侧的量，和目镜无关（错）；D 两颗星相距 0.3 个最小分辨角，合起来的光强在两者之间只有一个极大（对）；E u 不变、n 由 1 变 1.5，d_min 乘 2/3（对）。',
    p3: '距离 = 1.20 m/(1.22λ/D)；和细条积分核对：1.20 m/sinθ₁。',
    p4: '按题给的 d_min = 0.61λ/(n sin u)；和细条积分核对：0.61 换成 sinθ₁·D/(2λ) = 0.6098。',
  },
  compute() {
    // 系数本身
    const coef = firstDark(1, 1) / 1;
    check(Math.abs(coef - 1.21967) < 1e-4, '第一个暗环的系数 1.2197');

    // p1（角秒）
    const D1 = 0.2;
    const lam1 = 500e-9;
    const formula1 = (1.22 * lam1) / D1 / ARCSEC;
    const p1 = agree(Math.asin(firstDark(D1, lam1)) / ARCSEC, formula1, 'p1 最小分辨角（角秒）', 5e-4);

    // p2
    const tA1 = firstDark(0.1, 500e-9);
    const tA2 = firstDark(0.2, 500e-9);
    const optA = Math.abs(tA2 / tA1 - 0.5) < 1e-9;
    const optB = firstDark(0.1, 650e-9) < firstDark(0.1, 450e-9);
    const optC = false; // d_min 的式子里没有目镜的量（见 notes）
    // D：两颗星相距 0.3·θ₁，沿连线看合起来的光强（两个艾里斑光强相加），在两者之间数极大
    const th1 = firstDark(1, 1);
    const sep = 0.3 * th1;
    const total = (s: number) => airyAmp(1, 1, s - sep / 2) ** 2 + airyAmp(1, 1, s + sep / 2) ** 2;
    let peaks = 0;
    const n = 200;
    for (let j = 1; j < n; j++) {
      const s = -sep + (2 * sep * j) / n;
      const h = (2 * sep) / n;
      if (total(s) > total(s - h) && total(s) > total(s + h)) peaks++;
    }
    const optD = peaks === 1;
    const dmin = (lam: number, nn: number, u: number) => (0.61 * lam) / (nn * Math.sin(u));
    const optE = Math.abs(dmin(500e-9, 1.5, 1) / dmin(500e-9, 1, 1) - 2 / 3) < 1e-12;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（km）
    const lam3 = 550e-9;
    const D3 = 5e-3;
    const formula3 = 1.2 / ((1.22 * lam3) / D3) / 1e3;
    const p3 = agree(1.2 / firstDark(D3, lam3) / 1e3, formula3, 'p3 能分辨的最远距离', 5e-4);

    // p4（nm）
    const n4 = 1.52;
    const u4 = (64 * Math.PI) / 180;
    const formula4 = (0.61 * 450) / (n4 * Math.sin(u4));
    const p4 = agree(((th1 / 2) * 450) / (n4 * Math.sin(u4)), formula4, 'p4 能分辨的最小距离', 5e-4);

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
