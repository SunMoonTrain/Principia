// 独立验算 physics.newtonian-mechanics.fluid-statics 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 p = p0 + ρgh；二是从 dp/dz = −ρg 出发数值积分（p1、p4），
// 或者在同一水平面上两边的压强相等、用数值积分出的液柱压强（p3）。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.fluid-statics.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, integrate } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;
/** 从液面往下积 dp/dz = −ρ(z)g，得到深 h 处的压强。 */
const pressureAt = (p0: number, rho: (depth: number) => number, h: number) => p0 + integrate((d) => rho(d) * g, 0, h);

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.fluid-statics',
  notes: {
    p1: '(1.0e5 + 1000×9.8×25)/1.0e5；和从湖面往下数值积分 dp/dz = −ρg 核对。',
    p2: '逐条用例子：A 在深 0.5 m 处取边长 1 mm 的直角三棱柱流体块，由水平面、竖直面的压力和重力平衡推出斜面上的压强，斜面朝上、朝下两种放法，块缩小时都趋于 p0 + ρgh（对）；B 杯底面积 50 cm²、水深 8 cm，放进 30 g 的木块浮着，水面升高 6 mm，杯底压强增加 58.8 Pa（对）；C 等温大气 ρ = ρ0·e^(−z/H)，H = p0/(ρ0g)，把地面以上整根空气柱受的重力除以底面积积出来正好是地面的大气压（对）；D 深 1 m 处水和密度 800 的油压强不同（错）；E 千斤顶 2 cm²、100 cm²，力 240 N、12000 N，两边压强都是 1.2e6 Pa（错）。选项顺序照批次 21 修订后的（原来的 A、B、E、C、D）。',
    p3: '分界面所在的水平面上两边压强相等：ρ水·g·h水 = ρ油·g·0.12，h水 = 9.6 cm，高度差 12 − 9.6；和用 bisect 解「左管水柱在分界面上产生的压强等于油柱的」核对。',
    p4: '桶盖处的压强增加 ρg·10 m，乘桶盖面积 0.20 m²；和数值积分管里 10 m 水柱产生的压强核对。按桶盖面积 0.20 m² 算，没有扣去细管开口的 1.0 cm²（扣了是 19590 N，差 0.05%，在三位有效数字以内）。',
  },
  compute() {
    // p1：大气压的倍数
    const p0 = 1.0e5;
    const rhoW = 1.0e3;
    const exact1 = (p0 + rhoW * g * 25) / p0;
    const p1 = agree(pressureAt(p0, () => rhoW, 25) / p0, exact1, 'p1 压强的倍数', 1e-12);

    // p2
    // A：直角三棱柱，水平边长 a、竖直边长 b（垂直纸面方向取单位长度）。
    // 朝上：水平面在下（深 h + b/2），竖直面在左，斜面朝右上；朝下：水平面在上（深 h − b/2），斜面朝右下。
    // 由水平方向的平衡，斜面上压力的水平分量等于竖直面上的压力；由竖直方向的平衡定出它的竖直分量；斜面上的平均压强 = 合力 / 斜边长。
    const pDepth = (d: number) => p0 + rhoW * g * d;
    const inclinedPressure = (h: number, s: number, up: boolean) => {
      const a = s;
      const b = s;
      const L = Math.hypot(a, b);
      const zTop = up ? h - b / 2 : h - b / 2; // 竖直面上端的深度
      const Fx = integrate((d) => pDepth(d), zTop, zTop + b); // 竖直面上的压力（向右推）
      const W = rhoW * g * (a * b) / 2;
      // 朝上：底面受向上的压力 p(h + b/2)·a，斜面受向左下的压力；竖直方向 p·a − W − Fz = 0
      // 朝下：顶面受向下的压力 p(h − b/2)·a，斜面受向左上的压力；竖直方向 Fz − p·a − W = 0
      const Fz = up ? pDepth(h + b / 2) * a - W : pDepth(h - b / 2) * a + W;
      return Math.hypot(Fx, Fz) / L;
    };
    const target = pDepth(0.5);
    const upP = inclinedPressure(0.5, 1e-3, true);
    const downP = inclinedPressure(0.5, 1e-3, false);
    check(Math.abs(upP - target) / target < 1e-6 && Math.abs(downP - target) / target < 1e-6, 'p2 A 斜面朝上、朝下的压强都趋于 p0 + ρgh');
    const optA = Math.abs(upP - downP) / target < 1e-6;
    // B：放进浮着的木块，水面升高
    const area = 50e-4;
    const dh = 30e-3 / rhoW / area;
    const optB = rhoW * g * (0.08 + dh) - rhoW * g * 0.08 > 0;
    check(Math.abs(rhoW * g * dh - 58.8) < 1e-9, 'p2 B 杯底压强增加 58.8 Pa');
    // C：同样深度，水和油
    const optC = Math.abs(pressureAt(p0, () => rhoW, 1) - pressureAt(p0, () => 800, 1)) < 1e-9;
    // D：液压千斤顶两边的压强
    const optD = 12000 / 100e-4 > 240 / 2e-4 + 1e-6;
    check(Math.abs(12000 / 100e-4 - 240 / 2e-4) < 1e-6, 'p2 D 两边压强相等');
    // E：等温大气整根空气柱受的重力除以底面积
    const rho0 = 1.29;
    const H = p0 / (rho0 * g);
    const column = integrate((z) => rho0 * Math.exp(-z / H) * g, 0, 60 * H, 600);
    const optE = Math.abs(column - p0) / p0 < 1e-9;
    // 变量名是修订前的字母；修订后的顺序是原来的 A、B、E、C、D
    const p2 = chosen([optA, optB, optE, optC, optD]);

    // p3（cm）：U 形管
    const rhoOil = 0.8e3;
    const hOil = 0.12;
    const pOil = integrate(() => rhoOil * g, 0, hOil);
    const hWaterNum = bisect((hw) => integrate(() => rhoW * g, 0, hw) - pOil, 0, 1);
    const p3 = agree((hOil - hWaterNum) * 100, (hOil - (rhoOil / rhoW) * hOil) * 100, 'p3 液面高度差', 1e-9);

    // p4（N）：帕斯卡裂桶
    const lid = 0.2;
    const dpNum = integrate(() => rhoW * g, 0, 10);
    const p4 = agree(dpNum * lid, rhoW * g * 10 * lid, 'p4 桶盖受的压力增加', 1e-12);

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
