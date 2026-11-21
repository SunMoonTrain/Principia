// 独立验算 physics.quantum-mechanics.matter-waves 的 p1–p4（简单题、中等题）。
// 常量：h、e 用定义值，m_e、m_p、m_n、c 用 CODATA 2022；题面给了近似值的（p1 的中子质量）按题面的值算。
// 两套算法：一是德布罗意关系 λ = h/p 加非相对论的 p = √(2mK) 直接代；
// 二是不用条纹、谱线的公式：p1 由速度 v = √(2K/m) 算 λ = h/(mv)，再用相对论的 E² = (pc)² + (mc²)² 核对差别可以不计；
// p3 把两条缝当两个相干点源，按精确几何算屏上一点到两缝的路程差 2yd/(r₁ + r₂)（避开两个相近的数相减），
// 在 y 上二分出第 0–5 级亮纹的位置，取相邻亮纹的间距；p4 把表面一排 N = 30 个原子的散射波直接相加
// （沿法线入射，各原子入射相位相同，出射方向和法线成 θ 时相邻两个差 kD sinθ），在 θ 上找第一个主极大
// （用 dI/dθ 的解析式二分），再在加速电势差上二分，让这个主极大落在 30.0°。选择题用具体的数逐条核对。
// 单独运行：npx tsx tools/verify/physics.quantum-mechanics.matter-waves.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen } from './physics.newtonian-mechanics._nm.ts';

const h = 6.62607015e-34; // J·s，定义值
const e = 1.602176634e-19; // C，定义值
const c = 299792458; // m/s
const mE = 9.1093837139e-31; // kg，CODATA 2022
const mP = 1.67262192595e-27; // kg，CODATA 2022
const mN = 1.67492750056e-27; // kg，CODATA 2022（p2 用；p1 按题面取 1.675e-27）
const deg = Math.PI / 180;

/** 非相对论：动能 K（J）的粒子的德布罗意波长。 */
const lamFromK = (m: number, K: number) => h / Math.sqrt(2 * m * K);
/** 相对论：动能 K（J）对应的动量 p = √(E² − (mc²)²)/c，E = K + mc²；写成 √(K² + 2Kmc²)/c 免得相减丢精度。 */
const pRel = (m: number, K: number) => Math.sqrt(K * K + 2 * K * m * c * c) / c;

/** 第二套算法用的：由速度算波长 λ = h/(mv)，速度由 ½mv² = K 得出。 */
const lamViaSpeed = (m: number, K: number) => h / (m * Math.sqrt((2 * K) / m));

/** 双缝（间距 d、屏距 L）：屏上 y 处到两缝的路程差 r₁ − r₂ = (r₁² − r₂²)/(r₁ + r₂) = 2yd/(r₁ + r₂)。 */
const pathDiff = (y: number, d: number, L: number) => (2 * y * d) / (Math.hypot(L, y + d / 2) + Math.hypot(L, y - d / 2));

/** 一排 N 个间距 D 的原子，沿法线入射、在和法线成 θ 的方向上散射：I(θ) 和 dI/dθ。 */
function rowIntensity(N: number, D: number, lam: number, th: number): { I: number; dI: number } {
  const k = (2 * Math.PI) / lam;
  let re = 0;
  let im = 0;
  let dre = 0;
  let dim = 0;
  for (let j = 0; j < N; j++) {
    const ph = k * j * D * Math.sin(th);
    const dph = k * j * D * Math.cos(th);
    re += Math.cos(ph);
    im += Math.sin(ph);
    dre += -Math.sin(ph) * dph;
    dim += Math.cos(ph) * dph;
  }
  return { I: re * re + im * im, dI: 2 * (re * dre + im * dim) };
}

/** 从 θ = 0 往外扫，找第一个主极大（I 超过 N²/2 的局部极大，跳过 θ = 0 的零级），返回它的 θ；没有就返回 π/2。 */
function firstOrderPeak(N: number, D: number, lam: number): number {
  const steps = 40000;
  const hTh = (Math.PI / 2) / steps;
  let prev = rowIntensity(N, D, lam, hTh).I;
  let leftZeroOrder = false;
  for (let i = 2; i < steps; i++) {
    const th = i * hTh;
    const cur = rowIntensity(N, D, lam, th).I;
    if (!leftZeroOrder && cur < 0.1 * N * N) leftZeroOrder = true;
    const next = rowIntensity(N, D, lam, th + hTh).I;
    if (leftZeroOrder && cur > 0.5 * N * N && cur >= prev && cur >= next) {
      return bisect((t) => rowIntensity(N, D, lam, t).dI, th - hTh, th + hTh);
    }
    prev = cur;
  }
  return Math.PI / 2;
}

export const verification: Verification = {
  lesson: 'physics.quantum-mechanics.matter-waves',
  notes: {
    p1: 'K = 0.0250 eV × 1.602176634×10⁻¹⁹ J/eV，m = 1.675×10⁻²⁷ kg（题面的值），λ = h/√(2mK) = 0.180887 nm；和由速度 v = √(2K/m) 算 h/(mv) 核对（一致到 10⁻¹²），再用相对论的动量 √(K² + 2Kmc²)/c 核对：差约 7×10⁻¹²，可以不计。',
    p2: '逐条用 CODATA 2022 的质量造例子：A 两者都取 1.00×10⁶ m/s、再取 1.00×10³ m/s，电子的 λ 都是质子的 1836 倍（错）；B 两者动能都取 100 eV、再取 1 eV，电子的 λ 都是质子的 √(m_p/m_e) ≈ 42.85 倍（对）；C 加速电势差 100 V → 400 V、25 V → 100 V，λ 都变为原来的 1/2，不是 4 倍（错）；D 动量都取 1.00×10⁻²⁴ kg·m/s、再取 3.7×10⁻²³，两者 λ 相等，中子不更短（错）；E λ = 0.1 nm 的电子，按相对论 v/c = pc/√((pc)² + (mc²)²) = 0.024256、按非相对论 p/(mc) = 0.024263，都不到 3%，对应动能约 150.4 eV，用非相对论的 h/√(2mK) 反算波长只差约 7×10⁻⁵（对）。',
    p3: '5.00 kV 加速，λ = h/√(2m_e eΔφ) = 17.3443 pm（非相对论，题面要求不计相对论效应；按相对论约小 0.24%），条纹间距 Lλ/d = 8.67214 μm；和精确几何核对：两缝当两个相干点源，在 y 上二分出路程差为 0、λ、…、5λ 的位置，相邻两条（第 0、1 级）的间距和 Lλ/d 一致到 10⁻⁹，5 个间距的平均差约 4×10⁻⁹（差约 (y/L)² 量级，容差放到 10⁻⁸）。',
    p4: 'D sinθ = λ 得 λ = 0.250 nm × sin 30.0° = 0.125 nm，Δφ = h²/(2m_e eλ²) = 96.2637 V；和直接相加核对：表面一排 30 个原子，沿法线入射，在 θ 上扫出第一个主极大（dI/dθ = 0 二分），再在 50–500 V 之间二分加速电势差，让它落在 30.0°，一致到 10⁻⁸。',
  },
  compute() {
    // ---------- p1（nm）----------
    const K1 = 0.025 * e;
    const m1 = 1.675e-27;
    const lam1 = lamFromK(m1, K1);
    agree(lamViaSpeed(m1, K1), lam1, 'p1 由速度算', 1e-12);
    const lam1Rel = h / pRel(m1, K1);
    check(Math.abs(lam1Rel - lam1) / lam1 < 1e-10, 'p1 相对论修正可以不计');
    const p1 = lam1 * 1e9;

    // ---------- p2 ----------
    // A：速度相同，电子的 λ 较短？
    const optA = [1e6, 1e3].every((v) => h / (mE * v) < h / (mP * v));
    check([1e6, 1e3].every((v) => Math.abs((h / (mE * v)) / (h / (mP * v)) - mP / mE) < 1e-9), 'A：比值是 m_p/m_e');
    // B：动能相同，电子的 λ 较长？
    const optB = [100, 1].every((eV) => lamFromK(mE, eV * e) > lamFromK(mP, eV * e));
    check(Math.abs(lamFromK(mE, 100 * e) / lamFromK(mP, 100 * e) - Math.sqrt(mP / mE)) < 1e-9, 'B：比值是 √(m_p/m_e)');
    // C：加速电势差变为 4 倍，λ 也变为 4 倍？
    const ratioC = [[100, 400], [25, 100]].map(([a, b]) => lamFromK(mE, b * e) / lamFromK(mE, a * e));
    check(ratioC.every((r) => Math.abs(r - 0.5) < 1e-12), 'C：λ 变为原来的 1/2');
    const optC = ratioC.every((r) => Math.abs(r - 4) < 1e-9);
    // D：动量相同，中子的 λ 较短？各自先由动量算速度 v = p/m，再按 λ = h/(mv) 算，看质量会不会留在结果里
    const lamViaMomentum = (m: number, p: number) => h / (m * (p / m));
    const pairsD = [1e-24, 3.7e-23].map((p) => [lamViaMomentum(mE, p), lamViaMomentum(mN, p)]);
    check(pairsD.every(([le, ln]) => Math.abs(le - ln) / le < 1e-12), 'D：两者相等（λ 只由动量决定，和质量无关）');
    const optD = pairsD.every(([le, ln]) => ln < le * (1 - 1e-9));
    // E：λ = 0.1 nm 的电子，速率不到 3%c，可不计相对论效应？
    const pE = h / 0.1e-9;
    const betaRel = (pE * c) / Math.hypot(pE * c, mE * c * c);
    const betaNonRel = pE / (mE * c);
    const KE = Math.hypot(pE * c, mE * c * c) - mE * c * c; // 相对论动能
    const lamNonRelFromKE = lamFromK(mE, KE);
    check(Math.abs(KE / e - 150.4) < 0.1, 'E：动能约 150.4 eV');
    const optE = betaRel < 0.03 && betaNonRel < 0.03 && Math.abs(lamNonRelFromKE - 0.1e-9) / 0.1e-9 < 1e-4;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3（μm）----------
    const dV3 = 5000;
    const d3 = 1.0e-6;
    const L3 = 0.5;
    const lam3 = lamFromK(mE, e * dV3);
    const formula3 = (L3 * lam3) / d3;
    const ys = [0, 1, 2, 3, 4, 5].map((m) => (m === 0 ? 0 : bisect((y) => pathDiff(y, d3, L3) - m * lam3, 0, 1e-3)));
    const adjacent = ys[1] - ys[0];
    const average = (ys[5] - ys[0]) / 5;
    agree(adjacent, formula3, 'p3 相邻亮纹（精确几何）', 1e-9);
    agree(average, formula3, 'p3 五个间距的平均（精确几何）', 1e-8);
    check(Math.abs(h / pRel(mE, e * dV3) / lam3 - 1 + 0.00244) < 2e-4, 'p3 按相对论约小 0.24%（题面说不计）');
    const p3 = formula3 * 1e6;

    // ---------- p4（V）----------
    const D4 = 0.25e-9;
    const th4 = 30.0 * deg;
    const lam4 = D4 * Math.sin(th4);
    const formula4 = (h * h) / (2 * mE * e * lam4 * lam4);
    const N4 = 30;
    const peakAt = (dV: number) => firstOrderPeak(N4, D4, lamFromK(mE, e * dV));
    check(peakAt(50) > th4 && peakAt(500) < th4, 'p4 二分区间两端在 30° 两侧');
    const dV4 = bisect((dV) => peakAt(dV) - th4, 50, 500);
    agree(dV4, formula4, 'p4 直接相加的主极大落在 30°', 1e-8);
    const p4 = formula4;

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
