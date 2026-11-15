// 独立验算 physics.optics.michelson-interferometer 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（光程差 2d cosθ、中心每变一个圆环反射镜移 λ/2、钠双线可见度的周期 λ²/(2Δλ)）；
// 二是不用这些式子：两路光的电场直接相加（复数），p1 跟踪反射镜移动时干涉项的相位、展开后数转了几圈，二分出波长；
// p3 把两条谱线各自的两路光相加，光强相加后取条纹的包络（两条线干涉项之和的模），二分出相邻两个零点；
// p4 在倾角上扫描两路光相加的光强，数出中心以外的第 5 个亮环，再黄金分割。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.michelson-interferometer.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, bisect, check, chosen, deg } from './physics.optics._op.ts';

/** 两路等强的光，光程差 opd、波长 lambda 时，相加后的光强 |1 + e^{−i2π·opd/λ}|²/4。 */
const twoBeam = (opd: number, lambda: number) => {
  const ph = (2 * Math.PI * opd) / lambda;
  return ((1 + Math.cos(ph)) ** 2 + Math.sin(ph) ** 2) / 4;
};
/** 几条互不相干的谱线（各自强度 w）时，光程差 opd 附近条纹的可见度：干涉项 Σ w e^{i2π·opd/λ} 的模除以 Σ w。 */
function visibility(opd: number, lines: [number, number][]): number {
  let re = 0;
  let im = 0;
  let tot = 0;
  for (const [lam, w] of lines) {
    re += w * Math.cos((2 * Math.PI * opd) / lam);
    im += w * Math.sin((2 * Math.PI * opd) / lam);
    tot += w;
  }
  return Math.hypot(re, im) / tot;
}
/** 干涉项（两条线时取有符号的包络，零点处变号，便于二分）：Re(e^{i2π·opd/λ₁} + e^{i2π·opd/λ₂}) 乘回中间相位。 */
const signedEnvelope = (opd: number, l1: number, l2: number) => {
  const a = (2 * Math.PI * opd) / l1;
  const b = (2 * Math.PI * opd) / l2;
  const mid = (a + b) / 2;
  // e^{ia} + e^{ib} = e^{i·mid}·2cos((a − b)/2)：取 (e^{ia} + e^{ib})·e^{−i·mid} 的实部
  return Math.cos(a - mid) + Math.cos(b - mid);
};

export const verification: Verification = {
  lesson: 'physics.optics.michelson-interferometer',
  notes: {
    p1: 'λ = 2Δd/N；和两路光相加核对：反射镜从 0 移到 0.250 mm，跟踪干涉项 e^{−i4πx/λ} 的相位、展开后数转过的圈数，二分出圈数恰为 820 的波长。',
    p2: '逐条用例子：A 反射镜移 λ，中心干涉项转 2 圈（对）；B M₁、M₂′ 夹角 10⁻⁴ rad 时光程差 2(d₀ + αx) 只随 x 变，等光程线是直线（错）；C d = 0 时各倾角光强都等于 1，没有圆环（错）；D 去掉补偿板相当于多一段固定光程差 1 mm，单色光（谱宽 0）的可见度仍是 1（错）；E 钠双线 589.0、589.6 nm 一样亮时，可见度在光程差 0 到 2 mm 上降到零又恢复（对）。',
    p3: '两条一样亮的谱线，反射镜每移 λ₁λ₂/(2|λ₂ − λ₁|) 看不见一次；和直接相加核对：两条线的干涉项相加取包络，二分出相邻两个零点。',
    p4: '中心级次 2d/λ = 1600，第 5 个亮环 2d cosθ = 1595λ；和直接相加核对：在倾角上扫描两路光的光强，数中心以外的第 5 个极大，再黄金分割。',
  },
  compute() {
    // p1（nm）
    const dd1 = 0.25e-3;
    const N1 = 820;
    const formula1 = ((2 * dd1) / N1) * 1e9;
    const turnsOver = (dd: number, lam: number) => {
      // 反射镜位置 x 从 0 到 dd 分 20000 步，干涉项相位 −4πx/λ，逐步展开
      let total = 0;
      let prev = 0;
      for (let j = 1; j <= 20000; j++) {
        const x = (dd * j) / 20000;
        const ph = Math.atan2(-Math.sin((4 * Math.PI * x) / lam), Math.cos((4 * Math.PI * x) / lam));
        let dph = ph - prev;
        while (dph > Math.PI) dph -= 2 * Math.PI;
        while (dph < -Math.PI) dph += 2 * Math.PI;
        total += dph;
        prev = ph;
      }
      return Math.abs(total) / (2 * Math.PI);
    };
    const p1 = agree(bisect((l) => turnsOver(dd1, l) - N1, 500e-9, 700e-9) * 1e9, formula1, 'p1 波长', 1e-9);

    // p2
    const lamA = 600e-9;
    const optA = Math.abs(turnsOver(lamA, lamA) - 2) < 1e-9;
    // B：光程差随视场位置 x 线性变化，沿 y 不变；等光程的点 (x, y) 满足 x = 常数
    const alpha = 1e-4;
    const opdB = (x: number, _y: number) => 2 * (1e-4 + alpha * x);
    const optB = Math.abs(opdB(1e-3, 0) - opdB(1e-3, 5e-3)) > 1e-15;
    const opdC = (th: number) => 2 * 0 * Math.cos(th); // d = 0
    const optC = [0, 2, 5, 10].some((t) => Math.abs(twoBeam(opdC(t * deg), 600e-9) - twoBeam(opdC(0), 600e-9)) > 1e-12);
    const optD = visibility(1e-3, [[632.8e-9, 1]]) < 0.99;
    const naD: [number, number][] = [[589.0e-9, 1], [589.6e-9, 1]];
    let minV = 1;
    let maxAfter = 0;
    for (let o = 0; o <= 2e-3; o += 1e-7) {
      const v = visibility(o, naD);
      if (v < minV) minV = v;
      if (minV < 1e-3) maxAfter = Math.max(maxAfter, v);
    }
    const optE = minV < 1e-3 && maxAfter > 0.999;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（mm）：反射镜位移 x，光程差 2x
    const l1 = 577.0e-9;
    const l2 = 579.1e-9;
    const formula3 = ((l1 * l2) / (2 * Math.abs(l2 - l1))) * 1e3;
    const env = (x: number) => signedEnvelope(2 * x, l1, l2);
    const zeros: number[] = [];
    const h = 1e-6;
    for (let x = 0; x < 0.3e-3 && zeros.length < 3; x += h) {
      if (env(x) * env(x + h) < 0) zeros.push(bisect(env, x, x + h));
    }
    check(zeros.length === 3, 'p3 找到三个零点');
    check(visibility(2 * zeros[0], [[l1, 1], [l2, 1]]) < 1e-9, 'p3 零点处看不见');
    const gap = (zeros[2] - zeros[0]) / 2;
    const p3 = agree(gap * 1e3, formula3, 'p3 相邻两次看不见的间隔', 1e-9);

    // p4（度）
    const d4 = 0.4e-3;
    const lam4 = 500e-9;
    const m0 = (2 * d4) / lam4;
    check(Math.abs(m0 - Math.round(m0)) < 1e-9, 'p4 中心是亮点');
    const formula4 = Math.acos((Math.round(m0) - 5) / m0) / deg;
    const I4 = (th: number) => twoBeam(2 * d4 * Math.cos(th), lam4);
    let count = 0;
    let found = NaN;
    const step = 1e-5;
    for (let th = step; th < 0.2; th += step) {
      if (I4(th) > I4(th - step) && I4(th) >= I4(th + step)) {
        count++;
        if (count === 5) {
          found = argmax(I4, th - step, th + step);
          break;
        }
      }
    }
    const p4 = agree(found / deg, formula4, 'p4 第 5 个亮环的倾角', 1e-7);

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
