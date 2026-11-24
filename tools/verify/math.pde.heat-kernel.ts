// 独立验算 math.pde.heat-kernel 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.pde.heat-kernel.ts
// 热核照本领域的记号：K(x, t) = e^{−x²/(4Dt)} / √(4πDt)，解 u(x, t) = ∫ K(x − y, t) φ(y) dy（y 积遍整条直线）。
// 卷积一律直接按定义数值积分（分段高斯-勒让德，每段 20 个节点；初温的间断点放进分段点），
// 积分范围截到 |x − y| ≤ 14√(4Dt)（热核在那里小于 e^{−196}），不用讲解里的误差函数公式；公式只当对照。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { gaussLegendre, gaussLegendreRule } from './math.analysis._numeric.ts';

type F1 = (x: number) => number;

const RULE = gaussLegendreRule(20);

/** 热核 K(x, t)。 */
const K = (x: number, t: number, D: number): number => Math.exp(-(x * x) / (4 * D * t)) / Math.sqrt(4 * Math.PI * D * t);

/** [lo, hi] 按段宽不超过 h 分段，再并上 breaks，排好序去重。 */
function panels(lo: number, hi: number, h: number, breaks: number[] = []): number[] {
  const n = Math.max(1, Math.ceil((hi - lo) / h));
  const pts = Array.from({ length: n + 1 }, (_, k) => lo + ((hi - lo) * k) / n);
  for (const b of breaks) if (b > lo && b < hi) pts.push(b);
  return [...new Set(pts)].sort((p, q) => p - q);
}

function integrate(f: F1, lo: number, hi: number, breaks: number[] = [], h = 0.05): number {
  return gaussLegendre(f, panels(lo, hi, h, breaks), RULE);
}

/**
 * 按定义算 u(x, t) = ∫ K(x − y, t) φ(y) dy：y 取 [x − R, x + R]，R = 14√(4Dt)，
 * 再和 φ 不为零的范围 [lo, hi] 取交；breaksOf 给出这一段里 φ 的间断点。段宽取 √(4Dt)/8。
 */
function heatSolution(phi: F1, x: number, t: number, D: number, opts: { lo?: number; hi?: number; breaksOf?: (a: number, b: number) => number[] } = {}): number {
  const w = Math.sqrt(4 * D * t);
  const a = Math.max(x - 14 * w, opts.lo ?? -Infinity);
  const b = Math.min(x + 14 * w, opts.hi ?? Infinity);
  if (!(a < b)) return 0;
  const breaks = opts.breaksOf ? opts.breaksOf(a, b) : [];
  return integrate((y) => K(x - y, t, D) * phi(y), a, b, breaks, w / 8);
}

/** 二分法求单调函数 g 在 [lo, hi] 里等于 level 的点，要求 g(lo) − level 和 g(hi) − level 异号。 */
function solveLevel(g: F1, level: number, lo: number, hi: number): number {
  let a = lo;
  let b = hi;
  const sa = Math.sign(g(a) - level);
  if (sa === Math.sign(g(b) - level)) throw new Error(`[${lo}, ${hi}] 两端同号`);
  for (let k = 0; k < 200; k++) {
    const m = (a + b) / 2;
    if (Math.sign(g(m) - level) === sa) a = m;
    else b = m;
  }
  return (a + b) / 2;
}

/** 区间 [a, b] 里 k·period + offset 形式的点（周期函数的间断点）。 */
function periodicBreaks(a: number, b: number, period: number, offset = 0): number[] {
  const out: number[] = [];
  for (let k = Math.ceil((a - offset) / period); k * period + offset <= b; k++) out.push(k * period + offset);
  return out;
}

export const verification: Verification = {
  lesson: 'math.pde.heat-kernel',
  notes: {
    p1:
      '取 D = 1×10⁻⁵ m²/s，对 t 用数值积分算热核的 ∫x²K dx，宽度取它的平方根（就是 √(2Dt)），' +
      '二分求宽度为 0.01 m、0.03 m 的两个时刻，相减；另按 t = L²/(2D) 直接算对照（5 s、45 s）。',
    p2:
      'u 一律按定义数值积分 ∫K(x − y, t)φ(y)dy。' +
      'A：φ 取周期 2π 的方波加 0.3cos x（有跳跃），D = 0.7，t = 0.05、0.5、3，x 取 −2.3、0.4、1.9，u(x + 2π, t) 与 u(x, t) 相差都小于 10⁻¹²，对。' +
      'B（复核第 1 轮换的验法）：φ 取 1_(0,1)（x₀ = 0，左右极限的平均 1/2）和「0.3 处从 0 跳到 1 的阶跃加 e^{−(y−1)²}」（x₀ = 0.3，平均 1/2 + e^{−0.49}），' +
      'D = 1，t = 0.01、0.1、1、10，u(x₀, t) 和平均比：1_(0,1) 在后三个时刻差 0.0127、0.240、0.412（t = 0.01 时只差 8×10⁻¹³），' +
      '另一个四个时刻差 5×10⁻⁴、0.017、0.207、0.458；有相差超过 10⁻⁶ 的，不是对每个 t 都相等，错；' +
      '对照：对称的阶跃 u(x₀, t) 恒为 1/2（相差小于 10⁻⁹），检查认得出相等。' +
      'C：φ 取 [−1, 1] 上的 1 − |y|（和 cos²(πy/2)），在对数尺度上积分（先减去被积函数对数的最大值），' +
      'D = 0.01、1、100 时 u(5, 0.01) 都是正数（D = 1、φ = 1 − |y| 时约 10^{−178}），不等于 0，错。' +
      'D：φ 取阶跃、arctan x、截在 [−3, 3] 里的 floor x 三个单调不减的函数，D = 1，t = 0.01、0.1、1，' +
      '在 [−6, 6] 上每隔 0.05 取点，相邻两点的 u 都不减（差不小于 −10⁻¹²）；另取不单调的 φ = 1_[0,1] 核对这个检查能查出减少，对。' +
      'E：φ 取 1_[0,2] 和 e^{−|x|}，D = 1，t = 0.1、1、5，对 x 在 [−60, 60] 上积分 u，都等于 ∫φ（2 和 2），相差小于 10⁻⁸，对。所以选 A、D、E。',
    p3:
      'D = 1，按定义数值积分 u(0, t) = ∫K(−y, t)e^{−y²}dy，二分求 u(0, t) = 1/2 的 t（初值 u(0, 0) = 1）；' +
      '对照：e^{−x²} 是 4Dt₀ = 1 的热核乘 √π，u(0, t) = 1/√(1 + 4t)，t = 3/4。',
    p4:
      'D = 1，u(0, 1) = ∫_0^2 K(−y, 1)dy 按定义数值积分；题面给了 erf 1 ≈ 0.842701，答案按它写成 0.842701/2' +
      '（换元 y = 2s 得 (1/√π)∫_0^1 e^{−s²}ds = (1/2)erf 1），和数值积分相差小于 10⁻⁶。',
  },
  compute() {
    // ---- p1 ----
    const D1 = 1e-5;
    const width = (t: number): number => {
      const s = Math.sqrt(4 * D1 * t);
      return Math.sqrt(integrate((x) => x * x * K(x, t, D1), -14 * s, 14 * s, [], s / 8));
    };
    const t1a = solveLevel(width, 0.01, 0.01, 1000);
    const t1b = solveLevel(width, 0.03, 0.01, 1000);
    const p1 = t1b - t1a;
    const p1Formula = 0.03 ** 2 / (2 * D1) - 0.01 ** 2 / (2 * D1);
    if (Math.abs(p1 - p1Formula) > 1e-6 * p1Formula) throw new Error(`p1：数值 ${p1} 和公式 ${p1Formula} 对不上`);

    // ---- p2 ----
    const truth: boolean[] = [];
    // A：周期初温
    {
      const D = 0.7;
      const square = (y: number): number => {
        const r = ((y % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        return r < Math.PI ? 1 : -1;
      };
      const phi = (y: number): number => square(y) + 0.3 * Math.cos(y);
      const opts = { breaksOf: (a: number, b: number) => periodicBreaks(a, b, Math.PI) };
      let maxDiff = 0;
      for (const t of [0.05, 0.5, 3])
        for (const x of [-2.3, 0.4, 1.9]) {
          const d = Math.abs(heatSolution(phi, x + 2 * Math.PI, t, D, opts) - heatSolution(phi, x, t, D, opts));
          maxDiff = Math.max(maxDiff, d);
        }
      truth.push(maxDiff < 1e-12);
    }
    // B：初温在 x₀ 处跳跃时，对每个 t > 0，u(x₀, t) 都等于 φ 在 x₀ 处左、右极限的平均吗
    // （复核第 1 轮换的验法：修订把 B 从「u 在 x₀ 处也有跳跃」换成了这个说法）
    {
      const D = 1;
      const ts = [0.01, 0.1, 1, 10];
      const cases: { phi: F1; x0: number; avg: number; lo?: number; hi?: number; breaks: number[] }[] = [
        // 1_(0,1)，x₀ = 0：左极限 0、右极限 1，平均 1/2
        { phi: (y) => (y > 0 && y < 1 ? 1 : 0), x0: 0, avg: 0.5, lo: 0, hi: 1, breaks: [0, 1] },
        // 0.3 处从 0 跳到 1 的阶跃，再加一个不对称的光滑鼓包 e^{−(y−1)²}：平均 1/2 + e^{−0.49}
        { phi: (y) => (y > 0.3 ? 1 : 0) + Math.exp(-((y - 1) ** 2)), x0: 0.3, avg: 0.5 + Math.exp(-0.49), breaks: [0.3] },
      ];
      let alwaysAverage = true;
      for (const c of cases)
        for (const t of ts) {
          const u = heatSolution(c.phi, c.x0, t, D, { lo: c.lo, hi: c.hi, breaksOf: (a, b) => c.breaks.filter((p) => p > a && p < b) });
          if (Math.abs(u - c.avg) > 1e-6) alwaysAverage = false;
        }
      // 对照：对称的阶跃，u(x₀, t) 恒为 1/2，检查要认得出「相等」
      for (const t of ts) {
        const u = heatSolution((y) => (y > 0.3 ? 1 : 0), 0.3, t, D, { breaksOf: (a, b) => [0.3].filter((p) => p > a && p < b) });
        if (Math.abs(u - 0.5) > 1e-9) throw new Error(`B：对称阶跃在 t = ${t} 时 u(x₀, t) = ${u}，不是 1/2`);
      }
      // 对照：1_(0,1) 在 t = 0.1 时 u(0, t) = erf(1/√0.4)/2 ≈ 0.4873
      const u01 = heatSolution(cases[0].phi, 0, 0.1, D, { lo: 0, hi: 1, breaksOf: (a, b) => [0, 1].filter((p) => p > a && p < b) });
      if (Math.abs(u01 - 0.48733) > 1e-4) throw new Error(`B：1_(0,1) 在 t = 0.1 时 u(0, t) = ${u01}，和 0.4873 对不上`);
      truth.push(alwaysAverage);
    }
    // C：远处在很短的时间里是不是一点都没热
    {
      const t = 0.01;
      const xFar = 5;
      let allPositive = true;
      const phiLogs = [(y: number): number => Math.log(1 - Math.abs(y)), (y: number): number => 2 * Math.log(Math.cos((Math.PI * y) / 2))];
      phiLogs.forEach((phiLog, which) => {
        for (const D of [0.01, 1, 100]) {
          const logIntegrand = (y: number): number => -((xFar - y) ** 2) / (4 * D * t) - 0.5 * Math.log(4 * Math.PI * D * t) + phiLog(y);
          // 被积函数对数的最大值（在 (−1, 1) 里粗扫）
          let M = -Infinity;
          for (let k = 1; k < 20000; k++) M = Math.max(M, logIntegrand(-1 + k / 10000));
          const I = integrate((y) => Math.exp(logIntegrand(y) - M), -1, 1, [0], 1e-3);
          if (!(I > 0)) allPositive = false;
          if (which === 0 && D === 1) {
            // 手估：y 靠近 1 时被积函数约 e^{−400−200s}·s/√(0.04π)（s = 1 − y），积出来约 e^{−400}·7×10⁻⁵，log10 约 −178
            const log10u = (M + Math.log(I)) / Math.LN10;
            if (!(log10u > -180 && log10u < -176)) throw new Error(`C：D = 1 时 log10 u = ${log10u}，和手估的 −178 左右不符`);
          }
        }
      });
      truth.push(!allPositive); // 选项说 u(5, 0.01) = 0
    }
    // D：单调不减的初温
    {
      const D = 1;
      const xs = Array.from({ length: 241 }, (_, k) => -6 + 0.05 * k);
      const monotoneOn = (phi: F1, breaksOf: (a: number, b: number) => number[], lo?: number, hi?: number): boolean => {
        for (const t of [0.01, 0.1, 1]) {
          const us = xs.map((x) => heatSolution(phi, x, t, D, { breaksOf, lo, hi }));
          for (let k = 1; k < us.length; k++) if (us[k] - us[k - 1] < -1e-12) return false;
        }
        return true;
      };
      const step: [F1, (a: number, b: number) => number[]] = [(y) => (y > 0 ? 1 : 0), (a, b) => [0].filter((p) => p > a && p < b)];
      const arctan: [F1, (a: number, b: number) => number[]] = [Math.atan, () => []];
      const stairs: [F1, (a: number, b: number) => number[]] = [
        (y) => Math.min(3, Math.max(-3, Math.floor(y))),
        (a, b) => [-2, -1, 0, 1, 2, 3].filter((p) => p > a && p < b),
      ];
      const allMonotone = [step, arctan, stairs].every(([phi, br]) => monotoneOn(phi, br));
      // 检查本身能查出减少：不单调的初温 1_[0,1]
      const boxDetected = !monotoneOn((y) => (y >= 0 && y <= 1 ? 1 : 0), (a, b) => [0, 1].filter((p) => p > a && p < b), 0, 1);
      if (!boxDetected) throw new Error('D：单调性检查没查出 1_[0,1] 的解会减少');
      truth.push(allMonotone);
    }
    // E：总热量不变
    {
      const D = 1;
      const cases: { phi: F1; lo?: number; hi?: number; breaksOf: (a: number, b: number) => number[]; total: number }[] = [
        { phi: (y) => (y >= 0 && y <= 2 ? 1 : 0), lo: 0, hi: 2, breaksOf: (a, b) => [0, 2].filter((p) => p > a && p < b), total: 2 },
        { phi: (y) => Math.exp(-Math.abs(y)), breaksOf: (a, b) => [0].filter((p) => p > a && p < b), total: 2 },
      ];
      let conserved = true;
      for (const c of cases)
        for (const t of [0.1, 1, 5]) {
          const totalU = integrate((x) => heatSolution(c.phi, x, t, D, c), -60, 60, [0, 2], 0.25);
          if (Math.abs(totalU - c.total) > 1e-8) conserved = false;
        }
      truth.push(conserved);
    }
    const p2 = truth.map((v, i) => (v ? i + 1 : 0)).filter((i) => i > 0);

    // ---- p3 ----
    const u3 = (t: number): number => heatSolution((y) => Math.exp(-y * y), 0, t, 1);
    const p3 = solveLevel(u3, 0.5, 0.01, 10);
    if (Math.abs(p3 - 0.75) > 1e-9) throw new Error(`p3：数值 ${p3} 和对照 3/4 对不上`);

    // ---- p4 ----
    const numeric4 = heatSolution((y) => (y > 0 && y < 2 ? 1 : 0), 0, 1, 1, { lo: 0, hi: 2 });
    const p4 = 0.842701 / 2;
    if (Math.abs(numeric4 - p4) > 1e-6) throw new Error(`p4：数值积分 ${numeric4} 和 erf 1/2 = ${p4} 对不上`);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
