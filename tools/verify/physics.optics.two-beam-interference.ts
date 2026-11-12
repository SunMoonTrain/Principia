// 独立验算 physics.optics.two-beam-interference 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（条纹间距 Δy = λL/d、I = I₁ + I₂ + 2√(I₁I₂)cosδ）；
// 二是不用这些式子：p1、p3 按精确的几何算屏上一点到两条缝的路程差 √(L² + (y ± d/2)²)，在 y 上二分出亮纹的位置
// （和小角度的公式差约 (y/L)² 量级，容差放宽到 10⁻⁴，返回公式的值）；p4 把两束光的振幅、相位直接相加，在 δ 上扫出最亮、最暗。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.two-beam-interference.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, phasorIntensity } from './physics.optics._op.ts';

/** 屏上 y 处到两条缝（间距 d、屏距 L）的路程差。 */
const pathDiff = (y: number, d: number, L: number) => Math.hypot(L, y + d / 2) - Math.hypot(L, y - d / 2);

export const verification: Verification = {
  lesson: 'physics.optics.two-beam-interference',
  notes: {
    p1: '589 nm × 2.0 m/0.50 mm；和精确几何核对：在 y 上二分出路程差等于一个波长的位置，就是第一条亮纹到中央亮纹的距离（差约 10⁻⁶，返回公式的值）。',
    p2: '逐条用例子（两束光的振幅、相位直接相加）：A 等强时 |1 + 1|² = 4 是单独一束的 4 倍（对）；B d 从 0.5 mm 加大到 1.0 mm，算出的间距从 2.36 mm 降到 1.18 mm，变密（错）；C 相位差为 π 的奇数倍时 |1 + e^{iδ}|² = 0（对）；D λ 从 500 nm 换成 600 nm，间距变大到 1.2 倍（对）；E 两个独立光源的相对相位在 0–2π 里乱变，在 0–2π 里均匀取 200 个相对相位平均，屏上各处都是 2，没有条纹（错）。',
    p3: 'λ = (12.0 mm/10) × 0.40 mm/0.80 m；和精确几何核对：11 条亮纹对称排在中央两侧，最外一条在 y = 6.0 mm、是第 5 级，路程差除以 5（差约 3×10⁻⁵，返回公式的值）。',
    p4: '振幅之比 2:1，(2 + 1)²/(2 − 1)²；和直接相加核对：两束光振幅 2、1，相位差 δ 在 0–2π 里扫 2000 点，最亮除以最暗。',
  },
  compute() {
    // p1（m）
    const lam = 589e-9;
    const formula1 = ((lam * 2.0) / 0.5e-3) * 1000;
    const y1 = bisect((y) => pathDiff(y, 0.5e-3, 2.0) - lam, 0, 0.01) * 1000;
    agree(y1, formula1, 'p1 条纹间距（精确几何）', 1e-5);
    const p1 = formula1;

    // p2
    const optA = Math.abs(phasorIntensity([[1, 0], [1, 0]]) - 4) < 1e-12;
    const sp = (d: number, l: number) => bisect((y) => pathDiff(y, d, 2.0) - l, 0, 0.01) * 1000;
    const s05 = sp(0.5e-3, lam);
    const s10 = sp(1.0e-3, lam);
    check(Math.abs(s05 - 2.356) < 1e-3 && Math.abs(s10 - 1.178) < 1e-3, 'B：2.36 和 1.18 mm');
    const optB = s10 > s05;
    const optC = [1, 3, 5].every((k) => phasorIntensity([[1, 0], [1, k * Math.PI]]) < 1e-20);
    const optD = sp(0.5e-3, 600e-9) > sp(0.5e-3, 500e-9);
    const phases = Array.from({ length: 200 }, (_, k) => (2 * Math.PI * k) / 200);
    const avg = (delta: number) => phases.reduce((acc, ph) => acc + phasorIntensity([[1, 0], [1, delta + ph]]), 0) / phases.length;
    const spread = Math.max(...[0, 1, 2, 3].map((k) => avg((k * Math.PI) / 2))) - Math.min(...[0, 1, 2, 3].map((k) => avg((k * Math.PI) / 2)));
    check(spread < 1e-12, 'E：平均以后各处光强都是 2');
    const optE = false;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（nm）
    const formula3 = ((12.0e-3 / 10) * 0.4e-3) / 0.8 * 1e9;
    const exact3 = (pathDiff(6.0e-3, 0.4e-3, 0.8) / 5) * 1e9;
    agree(exact3, formula3, 'p3 波长（精确几何）', 1e-4);
    const p3 = formula3;

    // p4
    const formula4 = (2 + 1) ** 2 / (2 - 1) ** 2;
    let hi = -Infinity;
    let lo = Infinity;
    for (let k = 0; k < 2000; k++) {
      const I = phasorIntensity([[2, 0], [1, (2 * Math.PI * k) / 2000]]);
      hi = Math.max(hi, I);
      lo = Math.min(lo, I);
    }
    const p4 = agree(hi / lo, formula4, 'p4 最亮比最暗', 1e-9);

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
