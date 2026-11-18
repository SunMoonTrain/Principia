// 独立验算 physics.newtonian-mechanics.rolling 的 p1–p4（简单题、中等题）。
// 两套算法：一是机械能守恒加 K = ½(M + I_C/R²)v_C²；二是用质心运动定理加绕质心的转动定律求加速度，
// 再用 RK4 积分沿斜面的运动（p1、p4），或者柯尼希定理里的 I_C 用数值积分算（p3）。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.rolling.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, integrate, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;
/** 均匀实心球对过球心的轴的转动惯量，按体积分（球坐标）。 */
const solidSphereI = (M: number, R: number) => {
  const rho = M / ((4 / 3) * Math.PI * R ** 3);
  return integrate((r) => integrate((th) => (r * Math.sin(th)) ** 2 * rho * 2 * Math.PI * r * r * Math.sin(th), 0, Math.PI, 16, 16), 0, R, 16, 16);
};
/** 均匀薄球壳对过球心的轴的转动惯量，按面积分。 */
const shellI = (M: number, R: number) => integrate((th) => (R * Math.sin(th)) ** 2 * (M / (4 * Math.PI * R * R)) * 2 * Math.PI * R * R * Math.sin(th), 0, Math.PI, 16, 16);
/** 沿倾角 θ 的斜面纯滚动：Mg sinθ − f = Ma，fR = I·a/R ⇒ a。k = I_C/(MR²)。 */
const accel = (k: number, theta: number) => (g * Math.sin(theta)) / (1 + k);

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.rolling',
  notes: {
    p1: '机械能守恒 Mgh = ½·(3/2)Mv²；和取倾角 20° 的斜面、a = g sinθ/(1 + ½)，用 RK4 积分到滚过 h/sin20° 时的速率核对（和倾角无关）。',
    p2: '逐条用例子（R = 0.3 m、v_C = 2 m/s）：A 和轮心一样高的点速度是 (v_C, ±Rω)，大小 √2·v_C（对）；B 高 1 m 的斜面上纯滚动的圆盘到底端 √(4g/3) ≈ 3.61 m/s，光滑斜面上滑下 √(2g) ≈ 4.43 m/s（错）；C 圆盘 ½Iω² 占 ¼Mv²÷¾Mv² = 1/3（对）；D 最低点速率 0、最高点 2v_C（错）；E 数值积分得薄球壳 I = 2/3、实心球 I = 2/5（M = R = 1），球壳的加速度小、后到（错）。',
    p3: 'K = ½·(7/5)mv²；和柯尼希定理 ½mv² + ½I_Cω²、I_C 按体积分算（R 取 0.07 m）核对。',
    p4: '½·(3/2)Mv² = Mg·s·sin30°；和用 RK4 积分减速度 g sin30°/(3/2) 到速度为零时滚过的距离核对。',
  },
  compute() {
    // p1（m/s）
    const h = 0.9;
    const th20 = (20 * Math.PI) / 180;
    const a20 = accel(0.5, th20);
    const s1 = rk4Until((_t, y) => [y[1], a20], [0, 0], 0, 1e-4, 1e7, (_t, y) => y[0] - h / Math.sin(th20));
    const p1 = agree(s1.y[1], Math.sqrt((2 * g * h) / 1.5), 'p1 底端的速率', 1e-9);

    // p2
    const R = 0.3;
    const vc = 2;
    const w = vc / R;
    const optA = Math.abs(Math.hypot(vc, R * w) - Math.SQRT2 * vc) < 1e-12;
    const vRoll = Math.sqrt((2 * g * 1) / 1.5);
    const vSlide = Math.sqrt(2 * g * 1);
    const optB = Math.abs(vRoll - vSlide) < 1e-9;
    const Kt = 0.5 * vc * vc; // M = 1
    const Kr = 0.5 * 0.5 * R * R * w * w;
    const optC = Math.abs(Kr / (Kt + Kr) - 1 / 3) < 1e-12;
    const optD = Math.abs(vc - R * w) === Math.abs(vc + R * w);
    const kShell = shellI(1, 1);
    const kSolid = solidSphereI(1, 1);
    check(Math.abs(kShell - 2 / 3) < 1e-12 && Math.abs(kSolid - 2 / 5) < 1e-12, 'p2 E 球壳 2/3、实心球 2/5');
    const optE = accel(kShell, 0.5) > accel(kSolid, 0.5);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（J）
    const m = 0.5;
    const v = 2.0;
    const Rb = 0.07;
    const Kkoenig = 0.5 * m * v * v + 0.5 * solidSphereI(m, Rb) * (v / Rb) ** 2;
    const p3 = agree(Kkoenig, 0.5 * (1 + 2 / 5) * m * v * v, 'p3 总动能', 1e-12);

    // p4（m）
    const th30 = Math.PI / 6;
    const up = rk4Until((_t, y) => [y[1], -accel(0.5, th30)], [0, 3.0], 0, 1e-5, 1e8, (_t, y) => -y[1]);
    const p4 = agree(up.y[0], (0.75 * 3.0 * 3.0) / (g * Math.sin(th30)), 'p4 滚上的距离', 1e-9);

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
