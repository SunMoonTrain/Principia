// 独立验算 physics.general-relativity.gravitational-redshift 的 p1–p4（简单题、中等题）。
// 两套算法：
// 一是讲解的一阶式子：光从引力势 Φ发 处传到 Φ收 处，f/f₀ ≈ 1 − (Φ收 − Φ发)/c²，均匀场里 Φ = g × 高度；
//   静止的钟 dτ/dt ≈ 1 + Φ/c²，两只钟在一段时间 T 里的读数差 ≈ (Φ₁ − Φ₂)T/c²。
// 二是不用这些式子：
//   （甲）惯性系里追光：火箭从静止开始加速，地板、天花板各做双曲运动（固有加速度 α 和 α/(1 + αH/c²)，玻恩刚性，
//        两条双曲线同一个中心），地板按自己的钟每隔 dτ 发一个波峰，波峰以 c 向上走，二分出它追上天花板的时刻，
//        换成天花板自己的钟（τ = asinh(α′t)/α′）读出的间隔，得 f/f₀。题目里 gh/c² 只有 10⁻¹⁴ 量级，双精度直接追光
//        会被舍入淹没，所以在无量纲的 ε = αH/c² = 10⁻³、10⁻⁴ 上追：核对 f/f₀ = 1/(1 + ε)（匀加速参考系的精确值，
//        也就是难题 p6（2）的 ρ下/ρ上），(1 − f/f₀)/ε 和 1 只差 ε 量级，即一阶项正是 gH/c²，再把一阶式子用到题目的数上。
//   （乙）不均匀的场（p3）：从太阳表面到 10⁹ 倍半径处按等比的层厚分成约 4 万层薄壳，每层当作均匀场（层中点的 g），
//        各层的频率比连乘（取对数相加），10⁹ 倍半径以外的一点按 GM/r 补上，得 1 − f/f₀，和 GM/(Rc²) 核对；
//        等效的远离速度另用狭义相对论的操作性算法（运动光源发波峰、沿接收方向追，_relativity.ts 的 dopplerRatio）
//        二分出精确的 v，和一阶的 v = c·Δf/f₀ 核对（差在 β 的二阶）。
//   （丙）p4：飞机高度随时间起伏（平均 9.0 km），逐时刻积分两钟的读数差，结果只和平均高度有关；
//        另用平方反比引力（GM = gR²，R = 6.37×10⁶ m）的引力势算一遍，差约 h/R ≈ 0.14%。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.general-relativity.gravitational-redshift.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, dopplerRatio } from './physics.special-relativity._relativity.ts';
import { integrate } from './physics.electromagnetism._es.ts';

const g = 9.8;
const c = 3.0e8;

/**
 * 讲解的一阶式子：光从引力势 phiEmit 处传到 phiRecv 处，相对频移 1 − f/f₀ = (Φ收 − Φ发)/c²（正是红移，负是蓝移）。
 * 直接算差，不写成 1 − f/f₀：10⁻¹⁴ 量级的数从 1 里减出来只剩两三位有效数字。
 */
const shiftFormula = (phiEmit: number, phiRecv: number): number => (phiRecv - phiEmit) / (c * c);

/** 讲解的一阶式子：引力势 phi1、phi2 处静止的两只钟，dτ₁/dt − dτ₂/dt = (Φ₁ − Φ₂)/c²（同样直接算差）。 */
const rateDiff = (phi1: number, phi2: number): number => (phi1 - phi2) / (c * c);

/**
 * （甲）惯性系里追光，以 c = 1、地板到天花板的距离 H = 1 为单位：地板固有加速度 eps，天花板 eps/(1 + eps)（玻恩刚性），
 * t = 0 时都静止。地板在自己的钟读 tau0、tau0 + dTau 时各发一个波峰；返回天花板的钟量出的频率 ÷ 地板的钟量出的频率。
 * 高度写成 x²/(√(1 + x²) + 1) 的形式，免得 √(1 + x²) − 1 相减丢有效数字。
 */
function chaseRatio(eps: number, tau0: number, dTau: number): number {
  const aF = eps;
  const aC = eps / (1 + eps);
  const rise = (a: number, t: number): number => {
    const x = a * t;
    return (x * x) / (Math.sqrt(1 + x * x) + 1) / a;
  };
  const zFloor = (t: number): number => rise(aF, t);
  const zCeil = (t: number): number => 1 + rise(aC, t);
  const tauCeil = (t: number): number => Math.asinh(aC * t) / aC;
  const arrive = (tauEmit: number): number => {
    const te = Math.sinh(aF * tauEmit) / aF;
    const ze = zFloor(te);
    // 波峰的高度 ze + (t − te)，追上天花板的时刻
    return bisect((t) => ze + (t - te) - zCeil(t), te, te + 10);
  };
  const dTauCeil = tauCeil(arrive(tau0 + dTau)) - tauCeil(arrive(tau0));
  return dTau / dTauCeil;
}

/**
 * （乙）从 r0 到很远处，按等比的层厚（公比 q）把场分层，每层当作均匀场（层中点的 g = GM/r²），频率比连乘；
 * 返回 1 − f/f₀（f₀ 是 r0 处发出时那里的钟量出的，f 是很远处的钟量出的）。
 */
function layeredShift(GM: number, r0: number, rMax: number, q: number): number {
  let logRatio = 0;
  let r = r0;
  while (r < rMax) {
    const dr = r * (q - 1);
    const mid = r + dr / 2;
    logRatio += Math.log1p(-((GM / (mid * mid)) * dr) / (c * c));
    r += dr;
  }
  // rMax 以外还剩 GM/r 那么多引力势
  logRatio += Math.log1p(-GM / r / (c * c));
  return -Math.expm1(logRatio);
}

export const verification: Verification = {
  lesson: 'physics.general-relativity.gravitational-redshift',
  notes: {
    p1: '均匀场里 (f₀ − f)/f₀ = gh/c²，h = 450 m，换成 10⁻¹⁴；先用（甲）在 ε = 10⁻³、10⁻⁴ 上追光，核对 f/f₀ = 1/(1 + ε) 且 (1 − f/f₀)/ε 与 1 只差 ε 量级（发波峰的时刻取 τ = 0、3，间隔取 0.5、0.01），再按一阶式子代题目的数；二阶项 (gh/c²)² 约 2×10⁻²⁷，不影响。',
    p2: '逐条用例子：A 地球 GM = 3.986×10¹⁴、R = 6.37×10⁶ m，地面到 r = 2.66×10⁷ m 的卫星，Φ = −GM/r：上行 f/f₀ < 1（红移），下行 > 1（蓝移）（对）；B（甲）里波峰间隔取 0.5 和 0.01（频率差 50 倍），1 − f/f₀ 相同到 10⁻⁹（错）；C Φ = gz，0→10 m 和 100→110 m 的 Φ收 − Φ发 都是 98 J/kg，相对频移相同（对；匀加速参考系的精确式在 (gh/c²)² 才有差别）；D 远处 Φ = 0 的钟 dτ/dt = 1，地面的钟 1 − GM/(Rc²)（再减自转 465 m/s 的 u²/(2c²) 更慢），远处的快（错）；E 楼顶 100 m 处的钟比底层快 g·100/c²（对）。',
    p3: 'Δf/f₀ = GM/(Rc²)（太阳 M = 1.99×10³⁰ kg、R = 6.96×10⁸ m、G = 6.67×10⁻¹¹），一阶纵向多普勒 f/f₀ = 1 − v/c，v = c·Δf/f₀ = GM/(Rc)；和（乙）的分层连乘（公比 1.0005，到 10⁹ R，约 4.1 万层，容差 10⁻⁵）、对数变量的高斯-勒让德积分 ∫GM/r² dr（容差 10⁻⁹）核对；精确的相对论多普勒反推的 v 和一阶的差约 β/2 ≈ 10⁻⁶（容差 10⁻⁵）。',
    p4: 'Δτ = (gh/c²)T，h = 9.0 km，T = 41 h，换成 ns；和（丙）的逐时刻积分核对（高度取 9.0 km + 2.0 km·sin(2π·3t/T)，平均 9.0 km，复合高斯-勒让德）；平方反比引力的引力势（GM = gR²，R = 6.37×10⁶ m）给出约 144.4 ns，与均匀场的 144.6 ns 差约 0.14%（h/R），题面「g 取 9.8」按均匀场算。',
  },
  compute() {
    // （甲）追光：核对一阶式子的系数，并给 B 用
    for (const eps of [1e-3, 1e-4]) {
      for (const [tau0, dTau] of [
        [0, 0.5],
        [0, 0.01],
        [3, 0.5],
      ]) {
        const r = chaseRatio(eps, tau0, dTau);
        agree(r, 1 / (1 + eps), `追光 ε = ${eps}、τ₀ = ${tau0}、dτ = ${dTau} 与精确值 1/(1 + ε)`, 1e-9);
        agree((1 - r) / eps, 1, `追光 ε = ${eps} 的一阶系数`, 2 * eps);
      }
    }

    // p1（10⁻¹⁴）
    const h1 = 450;
    const shift1 = shiftFormula(0, g * h1);
    const eps1 = (g * h1) / (c * c);
    agree(eps1 / (1 + eps1), shift1, 'p1 匀加速参考系的精确式', 1e-9);
    const p1 = shift1 / 1e-14;

    // p2
    const GMe = 3.986e14;
    const Re = 6.37e6;
    const rSat = 2.66e7;
    const phiE = (r: number): number => -GMe / r;
    const up = shiftFormula(phiE(Re), phiE(rSat));
    const down = shiftFormula(phiE(rSat), phiE(Re));
    const optA = up > 0 && down < 0;
    const epsB = 1e-3;
    const shiftLow = 1 - chaseRatio(epsB, 0, 0.5);
    const shiftHigh = 1 - chaseRatio(epsB, 0, 0.01);
    agree(shiftHigh, shiftLow, 'p2 B 频率差 50 倍的两列波相对频移相同', 1e-9);
    const optB = shiftHigh > shiftLow * (1 + 1e-6);
    const shiftC1 = shiftFormula(g * 0, g * 10);
    const shiftC2 = shiftFormula(g * 100, g * 110);
    const optC = Math.abs(shiftC1 - shiftC2) <= 1e-9 * shiftC1;
    const uRot = 465;
    // 远处（Φ = 0）的钟减地面的钟：引力那一项减去自转那一项（地面的钟因自转再慢 u²/(2c²)）
    const farMinusGround = rateDiff(0, phiE(Re)) + (uRot * uRot) / (2 * c * c);
    check(rateDiff(0, phiE(Re)) > 0, 'p2 D 不算自转，地面的钟也比远处的慢');
    const optD = farMinusGround < 0;
    const optE = rateDiff(g * 100, g * 0) > 0;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m/s）
    const GMs = 6.67e-11 * 1.99e30;
    const Rs = 6.96e8;
    const shift3 = GMs / (Rs * c * c);
    agree(layeredShift(GMs, Rs, 1e9 * Rs, 1.0005), shift3, 'p3 分层连乘', 1e-5);
    const uMax = Math.log(1e9);
    const phiByIntegral = integrate((u) => GMs / (Rs * Math.exp(u)), 0, uMax, 256, 16) + GMs / (1e9 * Rs);
    agree(phiByIntegral / (c * c), shift3, 'p3 积分 ∫GM/r² dr', 1e-9);
    const v3 = c * shift3;
    const vExact = bisect((v) => 1 - dopplerRatio(v, c, [-1, 0]) - shift3, 0, 2000);
    agree(vExact, v3, 'p3 精确的相对论多普勒反推的远离速度', 1e-5);
    const p3 = v3;

    // p4（ns）
    const h4 = 9.0e3;
    const T4 = 41 * 3600;
    const lead4 = rateDiff(g * h4, 0) * T4;
    const formula4 = ((g * h4) / (c * c)) * T4;
    agree(lead4, formula4, 'p4 两钟速率之差乘时间', 1e-6);
    const profile = (t: number): number => h4 + 2.0e3 * Math.sin((2 * Math.PI * 3 * t) / T4);
    const byProfile = integrate((t) => (g * profile(t)) / (c * c), 0, T4, 256, 16);
    agree(byProfile, formula4, 'p4 高度起伏、平均 9.0 km 的逐时刻积分', 1e-9);
    const GMg = g * Re * Re;
    const byInverseSquare = ((GMg / Re - GMg / (Re + h4)) / (c * c)) * T4;
    agree(byInverseSquare, formula4, 'p4 平方反比引力的引力势（差约 h/R）', 2e-3);
    const p4 = formula4 / 1e-9;

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
