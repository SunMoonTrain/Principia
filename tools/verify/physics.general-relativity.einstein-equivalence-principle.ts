// 独立验算 physics.general-relativity.einstein-equivalence-principle 的 p1–p4（简单题、中等题）。
// 光在加速舱、地面实验室里下落多少：一是讲解的做法，舱（或实验室）相对局部惯性系以固有加速度 α 向上加速，
// 光在局部惯性系里走水平直线，舱里看光低 αL²/(2c²)；二是不用这个式子，在局部惯性系里把舱的双曲运动
// （dv/dt = α(1 − v²/c²)^{3/2}）和光的水平运动交给四阶龙格-库塔法积分，到光走到对面为止读舱升高了多少；
// 三是匀加速参考系（里德勒坐标）里光线的精确轨迹：水平射出的光是圆心在视界上、半径 c²/α 的圆，
// 走过水平距离 L 时低 c²/α − √(c⁴/α² − L²)。中等题 p4 另在地面参考系里积分一遍：光按 p1 的结论以 g 下落，
// 火箭相对地面以 2g 上升，发光时两者竖直速度相同（取 0、0.5 m/s）。
// 潮汐：一是讲解的估计式（竖直相距 h 的两球相对加速度 2gh/R）；二是平方反比引力下把下面那个球和两球的间距一起积分，
// 间距的加速度写成 GM s(2r+s)/(r²(r+s)²)，免得两个大数相减丢精度。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.general-relativity.einstein-equivalence-principle.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;
const c = 3.0e8;

/** 讲解的式子：相对局部惯性系以 α 向上加速的舱里，光水平走过 L 后比出发处低多少。 */
const dropFormula = (alpha: number, L: number): number => (alpha * L * L) / (2 * c * c);

/**
 * 局部惯性系（发光时和舱同速）里积分：光以 c 沿水平方向走直线；舱从静止开始做固有加速度为 α 的双曲运动，
 * 竖直速度满足 dv/dt = α(1 − v²/c²)^{3/2}。状态 [光的 x, 舱的 z, 舱的 v]，积到光的 x 等于 L，返回舱升高了多少。
 */
function dropByInertialFrame(alpha: number, L: number): number {
  const tEnd = L / c;
  const hit = rk4Until(
    (_t, s) => [c, s[2], alpha * Math.pow(1 - (s[2] * s[2]) / (c * c), 1.5)],
    [0, 0, 0],
    0,
    tEnd / 2000,
    10000,
    (_t, s) => s[0] - L,
  );
  return hit.y[1];
}

/** 匀加速参考系里光线的精确轨迹（圆心在视界上的圆）：水平走过 L 时下落 c²/α − √(c⁴/α² − L²)，写成不相减的形式。 */
function dropByRindlerCircle(alpha: number, L: number): number {
  const rho = (c * c) / alpha;
  return (L * L) / (rho + Math.sqrt(rho * rho - L * L));
}

/**
 * 地面参考系里积分（p4 用）：光以 c 水平前进，按 p1 的结论在地面参考系里以 g 下落；火箭相对地面以 aRocket 向上加速。
 * 发光时光和舱的竖直速度都是 v0。状态 [光 x, 光 z, 光 vz, 舱 z, 舱 vz]，积到光的 x 等于 L，返回舱里看光低了多少。
 */
function dropByGroundFrame(aRocket: number, L: number, v0: number): number {
  const tEnd = L / c;
  // 步数取少：四阶龙格-库塔法对二次多项式本来就是精确的，步数多了只会让 v0·t 这一大项的舍入误差在相减时累积
  const hit = rk4Until(
    (_t, s) => [c, s[2], -g, s[4], aRocket],
    [0, 0, v0, 0, v0],
    0,
    tEnd / 40,
    200,
    (_t, s) => s[0] - L,
  );
  return hit.y[3] - hit.y[1];
}

/**
 * 平方反比引力 GM/r²：下面的球从 r0 由静止落下，上面的球在它正上方 s0 处、同时由静止落下，积 T 秒，返回间距增加了多少。
 * 状态 [r, v, s, w]：r、v 是下面那个球的位置和速度，s、w 是两球的间距和相对速度；
 * 间距的加速度 GM/r² − GM/(r+s)² 写成 GM s(2r+s)/(r²(r+s)²)。
 */
function tidalStretch(GM: number, r0: number, s0: number, T: number): number {
  const rhs = (_t: number, y: number[]): number[] => {
    const [r, v, s, w] = y;
    return [v, -GM / (r * r), w, (GM * s * (2 * r + s)) / (r * r * (r + s) * (r + s))];
  };
  const end = rk4Until(rhs, [r0, 0, s0, 0], 0, T / 20000, 40000, (t) => t - T);
  return end.y[2] - s0;
}

/** 质量 M 的球心看作质点，它在距离 r 处给每千克物质的引力（大小）。 */
const pull = (GM: number, r: number): number => GM / (r * r);

export const verification: Verification = {
  lesson: 'physics.general-relativity.einstein-equivalence-principle',
  notes: {
    p1: '地面实验室相对局部惯性系以 g 向上加速，L = 3.0 km：式子 gL²/(2c²)，和两种不用这个式子的算法核对：局部惯性系里积分实验室的双曲运动（固有加速度 g）到光走完 L；匀加速参考系里光线的精确圆弧。结果换成 nm。',
    p2: '逐条用例子：A 舱高 1000 km、自由下落，上下两端每千克受地球引力之差 GM/R² − GM/(R+h)² 约 2.6 m/s²，舱里松开的东西明显相对运动（错）；B 局部惯性系里狭义相对论成立，并核对：地面参考系里光以 g 下落（p1 的结论），自由下落的舱也以 g 下落，舱里光走直线（对）；C 地球两侧自由下落的小舱加速度 (0, −9.8)、(0, +9.8)，相对加速度 19.6 不为零，合不成一个惯性系（对）；D 地面附近竖直相距 1 m、2 m 的两球，相对加速度按平方反比引力精确算，1 m 的较小（错）；E 地月距离 3.84×10⁸ m、月球半径 1.737×10⁶ m、GM = 3.986×10¹⁴，近端、远端每千克受地球引力不同，减去月心处的值后仍不同（对）。',
    p3: '竖直相距 h = 1.00 m 的两球相对加速度 2gh/R，间距增加 ½·(2gh/R)·t² = ght²/R，t = 4.74 s，换成 μm；和平方反比引力下的积分核对（GM = gR²，下面的球从 r = R 由静止落下，积 4.74 s），容差 5×10⁻⁴（积分里间距呈 cosh 增长、下落途中 r 变小，相对差约 10⁻⁵）。',
    p4: '火箭相对地面 2g、地面相对局部惯性系 g，火箭相对局部惯性系以 3g 加速，舱里看光低 3gL²/(2c²)，L = 4.00 m，换成 10⁻¹⁵ m；和局部惯性系里积分（固有加速度 3g 的双曲运动）、精确圆弧、地面参考系里积分（光以 g 下落、火箭以 2g 上升，发光时竖直速度取 0、0.5 m/s；后者两个高度都约 v₀t，相减丢有效数字，容差 10⁻⁶）核对。',
  },
  compute() {
    // p1（nm）
    const L1 = 3.0e3;
    const exact1 = dropFormula(g, L1);
    agree(dropByInertialFrame(g, L1), exact1, 'p1 局部惯性系里积分', 1e-9);
    agree(dropByRindlerCircle(g, L1), exact1, 'p1 匀加速参考系里的精确圆弧', 1e-9);
    const p1 = exact1 * 1e9;

    // p2
    const R = 6.37e6;
    const GMe = g * R * R;
    // A：「不论舱多大」要求任意大的舱里松开的东西也没有相对加速度；反例：1000 km 高的自由下落舱，
    // 上下两端每千克受的引力之差约 2.6 m/s²
    const hA = 1.0e6;
    const diffA = pull(GMe, R) - pull(GMe, R + hA);
    check(diffA > 1, 'p2 A 大舱里潮汐加速度明显不为零');
    const optA = diffA === 0;
    // B：地面参考系里光水平射出后以 g 下落（p1 的结论，这里用 p1 的算法），自由下落的舱也以 g 下落：
    // 光相对舱的竖直位移为零，舱里光走直线，和狭义相对论一致
    const LB = 3.0e3;
    const tB = LB / c;
    const lightDropGround = dropByInertialFrame(g, LB);
    const cabinDropGround = 0.5 * g * tB * tB;
    const optB = Math.abs(lightDropGround - cabinDropGround) < 1e-9 * cabinDropGround;
    // C：地球两侧（一个在上、一个在下）自由下落的小舱，加速度都指向地心；各自是局部惯性系（小、自由下落、不转动），
    // 可两舱之间有相对加速度，同一个惯性系里只受引力的物体不会有
    const aTop = [0, -g];
    const aBottom = [0, g];
    const relC = Math.hypot(aTop[0] - aBottom[0], aTop[1] - aBottom[1]);
    const optC = relC > 0;
    // D：竖直相距 1 m 与 2 m 的两球，相对加速度按平方反比引力精确算
    const tidal = (h: number): number => (GMe * h * (2 * R + h)) / (R * R * (R + h) * (R + h));
    const optD = tidal(1) > tidal(2);
    // E：月球近端、远端每千克受地球的引力，以及减去月心处的值以后的差
    const GMearth = 3.986e14;
    const dEM = 3.84e8;
    const Rm = 1.737e6;
    const near = pull(GMearth, dEM - Rm);
    const far = pull(GMearth, dEM + Rm);
    const center = pull(GMearth, dEM);
    check(Math.abs(near - far) > 1e-6, 'p2 E 近端、远端受的引力不一样大');
    const optE = Math.abs(near - center - (far - center)) > 1e-6;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（μm）
    const T3 = 4.74;
    const h3 = 1.0;
    const formula3 = (g * h3 * T3 * T3) / R;
    agree(tidalStretch(GMe, R, h3, T3), formula3, 'p3 平方反比引力下的积分', 5e-4);
    const p3 = formula3 * 1e6;

    // p4（10⁻¹⁵ m）
    const L4 = 4.0;
    const alpha4 = g + 2 * g;
    const exact4 = dropFormula(alpha4, L4);
    agree(dropByInertialFrame(alpha4, L4), exact4, 'p4 局部惯性系里积分', 1e-9);
    agree(dropByRindlerCircle(alpha4, L4), exact4, 'p4 匀加速参考系里的精确圆弧', 1e-9);
    // 发光时竖直速度不为零时，舱和光的高度都约是 v0·t，相减丢掉有效数字，容差放到 10⁻⁶
    for (const v0 of [0, 0.5]) {
      agree(dropByGroundFrame(2 * g, L4, v0), exact4, `p4 地面参考系里积分（发光时竖直速度 ${v0}）`, 1e-6);
    }
    const p4 = exact4 * 1e15;

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
