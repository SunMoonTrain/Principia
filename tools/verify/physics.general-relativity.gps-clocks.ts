// 独立验算 physics.general-relativity.gps-clocks 的 p1–p4（简单题、中等题）。
// 钟的快慢两套算法：一是讲解定理的式子 dτ/dt ≈ 1 + Φ/c² − u²/(2c²)，两只钟相减；二是不用这个式子，把两样分开算：
// 速度项用狭义相对论的光钟（_relativity.ts 的 slowClockLag：在惯性系里追光一个来回，低速时由 β = 0.01、0.02 外推），
// 引力项用引力场强沿径向做的功 ∫ g dr（高斯-勒让德数值积分）除以 c²，即引力红移一节「两处引力势之差 / c²」；
// 圆轨道的半径、速率用牛顿力学 _nm.ts 的轨道积分（circularPeriod、circularSpeed：数值积分平方反比引力下的运动，
// 不用 v = √(GM/r)、开普勒第三定律）二分出来。p3 再用第三种：弱场线元 dτ = √(1 + 2Φ/c² − u²/c²) dt，
// 沿龙格-库塔法积分出的轨道把卫星的钟、地面的钟各积一天再相减（√(1 + X) − 1 写成 X/(1 + √(1 + X))，免得在 1 附近相减丢精度）。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.general-relativity.gps-clocks.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisectN, check, chosen, circularPeriod, circularSpeed, integrate, rk4 } from './physics.newtonian-mechanics._nm.ts';
import { slowClockLag } from './physics.special-relativity._relativity.ts';

const c = 3.0e8;
const DAY = 86400;

/** 讲解定理的式子：引力势 Φ 处以速率 u 运动的钟，dτ/dt − 1（一阶）。 */
const rateExcess = (Phi: number, u: number): number => Phi / (c * c) - (u * u) / (2 * c * c);

/** 不用定理的式子：两处的引力项 = 场强 GM/r² 从 r1 积到 r2 的功 / c²（r2 > r1 时为正，高处的钟快）。 */
const gravityTermByWork = (GM: number, r1: number, r2: number): number => integrate((r) => GM / (r * r), r1, r2, 256, 16) / (c * c);

/** 不用定理的式子：速度项 = 光钟每单位时间少走的比例（追光算出，负号表示变慢）。 */
const velocityTermByLightClock = (u: number): number => -slowClockLag(u, c);

/** √(1 + X) − 1，不相减。 */
const sqrtOnePlusMinusOne = (X: number): number => X / (1 + Math.sqrt(1 + X));

/**
 * 弱场线元下沿积分出的圆轨道积一天：状态 [x, y, vx, vy, 卫星钟多走的]，加速度 −GM r/r³，
 * 卫星钟 dτ/dt − 1 = √(1 + 2Φ/c² − u²/c²) − 1；地面钟静止在 R，同样按线元算。返回卫星钟减地面钟（秒）。
 */
function dayDifferenceByLineElement(GM: number, R: number, r: number, u: number, T: number): number {
  const rhs = (_t: number, s: number[]): number[] => {
    const rr = Math.hypot(s[0], s[1]);
    const k = -GM / (rr * rr * rr);
    const uu = s[2] * s[2] + s[3] * s[3];
    return [s[2], s[3], k * s[0], k * s[1], sqrtOnePlusMinusOne((2 * (-GM / rr)) / (c * c) - uu / (c * c))];
  };
  const end = rk4(rhs, [r, 0, 0, u, 0], 0, T, 17280);
  // 轨道仍是圆：积完一天半径不变
  check(Math.abs(Math.hypot(end[0], end[1]) - r) < 1e-6 * r, 'p3 积分一天后仍在圆轨道上');
  const ground = T * sqrtOnePlusMinusOne((2 * (-GM / R)) / (c * c));
  return end[4] - ground;
}

export const verification: Verification = {
  lesson: 'physics.general-relativity.gps-clocks',
  notes: {
    p1: '模拟一次测距：卫星离接收机 2.02×10⁷ m，真实发出时刻取 0.3 s 和 5 s 两种，信号上写的是卫星钟当时的读数（真实时刻减 25 ns），接收机按（收到时刻 − 写的时刻）× c 算距离，减去真实距离；和 c × 25 ns 核对。慢了 → 写的发出时刻偏早 → 算出的距离偏大，答案为正。',
    p2: '逐条用例子（GM 取 6.674×10⁻¹¹ × 5.97×10²⁴，r = 2.66×10⁷ m）：A 速率用轨道积分二分出（circularSpeed），速度项用光钟算，2r 处与 r 处之比 0.5（对）；B GPS 处光钟算的速度项为负（让钟变慢），引力项（∫g dr / c²）为正，快是引力造成的（错）；C 横放的光钟（另一种构造的理想钟）算出的速度项和 u²/(2c²) 一致，差别照样有（错）；D 调低 4.4647×10⁻¹⁰ 的钟和地面钟在同一处、同一速度，读数比 1 − 4.4647×10⁻¹⁰ < 1，走得慢（对）；E 同一处、同一速率，沿圆周运动和沿直线运动的钟按定理快慢相同（只看此刻的 Φ 和 u），光钟追光也只用此刻的速率，加速度不改快慢（错）。',
    p3: '同步轨道半径：用轨道积分的 circularPeriod 二分出周期 86164 s 的 r，和 (GM T²/4π²)^{1/3} 核对；三种算法：定理的式子 GM/c²(1/R − 3/(2r)) × 86400；光钟的速度项（速率由 circularSpeed 二分出）加 ∫g dr / c²；弱场线元沿龙格-库塔法积分的轨道积一天。换成 μs。',
    p4: '定理的式子：[g h/c² − (715² − 465²)/(2c²)] × 36000 s；另用光钟分别算 715、465 m/s 的速度项，引力项为 ∫₀ʰ g dz / c²（均匀场）。换成 ns，飞机的钟少走，答案为负。',
  },
  compute() {
    // p1（m）
    const lagNs = 25e-9;
    const dTrue = 2.02e7;
    let p1 = Number.NaN;
    for (const tEmit of [0.3, 5]) {
      const tRecv = tEmit + dTrue / c;
      const stamp = tEmit - lagNs; // 卫星钟比约定的时间慢 25 ns
      const dComputed = (tRecv - stamp) * c;
      p1 = agree(dComputed - dTrue, c * lagNs, `p1 多算的距离（发出时刻 ${tEmit} s）`, 1e-6);
    }

    // p2
    const GMex = 6.674e-11 * 5.97e24;
    const rGps = 2.66e7;
    const lagAt = (r: number) => velocityTermByLightClock(circularSpeed(GMex, r));
    const ratioA = lagAt(2 * rGps) / lagAt(rGps);
    const optA = Math.abs(ratioA - 0.5) < 1e-6;
    const velGps = lagAt(rGps);
    const gravGps = gravityTermByWork(GMex, 6.37e6, rGps);
    check(velGps < 0 && gravGps > 0 && gravGps + velGps > 0, 'p2 B GPS 卫星的钟净快、速度项为负、引力项为正');
    const optB = velGps > 0 && Math.abs(velGps) > Math.abs(gravGps); // 「主要是因为运动得快」要速度项让钟变快且占上风
    const uGps = circularSpeed(GMex, rGps);
    const lightClockShowsIt = Math.abs(velocityTermByLightClock(uGps) - -(uGps * uGps) / (2 * c * c)) < 1e-6 * ((uGps * uGps) / (2 * c * c));
    const optC = !lightClockShowsIt;
    const tuned = 1 - 4.4647e-10;
    const PhiGround = -GMex / 6.37e6;
    const ratioOnGround = (tuned * (1 + rateExcess(PhiGround, 0))) / (1 + rateExcess(PhiGround, 0));
    const optD = ratioOnGround < 1;
    const PhiGps = -GMex / rGps;
    const circleRate = rateExcess(PhiGps, uGps); // 沿圆周：此刻 Φ、u
    const straightRate = rateExcess(PhiGps, Math.hypot(uGps * 0.6, uGps * 0.8)); // 沿直线、同一速率（方向不同）
    const optE = Math.abs(circleRate - straightRate) > 1e-20;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（μs）
    const GM3 = 6.67e-11 * 5.97e24;
    const R3 = 6.37e6;
    const Tsid = 86164;
    const rKepler = Math.cbrt((GM3 * Tsid * Tsid) / (4 * Math.PI * Math.PI));
    const rGeo = bisectN((r) => circularPeriod(GM3, r) - Tsid, 0.9 * rKepler, 1.1 * rKepler, 45);
    agree(rGeo, rKepler, 'p3 同步轨道半径', 1e-7);
    const uGeo = circularSpeed(GM3, rGeo);
    agree(uGeo, (2 * Math.PI * rKepler) / Tsid, 'p3 同步卫星的速率', 1e-7);
    const byFormula = (GM3 / (c * c)) * (1 / R3 - 3 / (2 * rKepler)) * DAY;
    const byParts = (gravityTermByWork(GM3, R3, rGeo) + velocityTermByLightClock(uGeo)) * DAY;
    const byLine = dayDifferenceByLineElement(GM3, R3, rGeo, uGeo, DAY);
    agree(byParts, byFormula, 'p3 光钟 + 功 与 定理的式子', 1e-6);
    agree(byLine, byFormula, 'p3 弱场线元 与 定理的式子', 1e-6);
    const p3 = byFormula * 1e6;

    // p4（ns）
    const g = 9.8;
    const h = 1.0e4;
    const T4 = 10.0 * 3600;
    const uGround = 465;
    const uPlane = 465 + 250;
    const formula4 = (rateExcess(g * h, uPlane) - rateExcess(0, uGround)) * T4;
    const grav4 = integrate(() => g, 0, h, 4, 4) / (c * c);
    const parts4 = (grav4 + velocityTermByLightClock(uPlane) - velocityTermByLightClock(uGround)) * T4;
    const p4 = agree(parts4, formula4, 'p4 光钟 + 功 与 定理的式子', 1e-6) * 1e9;

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
