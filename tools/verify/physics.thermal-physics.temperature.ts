// 独立验算 physics.thermal-physics.temperature 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的换算 t = T − 273.15 K、理想气体温标 T = 273.16 K × (p/p₃ 外推到 p₃ → 0)；
// 二是不用这些式子：摄氏度和开尔文按两个定点（0 °C ↔ 273.15 K、100 °C ↔ 373.15 K）的直线插值换算；
// 外推用一般的最小二乘直线拟合（对 (p₃, T读数) 的点）求截距；华氏和摄氏读数相同的点用二分求。
// 选择题用「热接触时热量按温差流动」的集总模型（热流率 G(T₁ − T₂)、各自的热容）逐条模拟，写明取的数。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.temperature.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen } from './physics.electromagnetism._es.ts';

const T0 = 273.15; // 0 °C 对应的热力学温度（K，定义值）
const T3 = 273.16; // 水的三相点（K，理想气体温标的定点）
const R = 8.314462618; // J/(mol·K)

/** 摄氏度 → 开尔文：按两个定点 0 °C ↔ 273.15 K、100 °C ↔ 373.15 K 直线插值（不直接用 T = t + 273.15）。 */
function celsiusToKelvinByFixedPoints(t: number): number {
  const [t1, K1, t2, K2] = [0, 273.15, 100, 373.15];
  return K1 + ((t - t1) * (K2 - K1)) / (t2 - t1);
}

/** 开尔文 → 摄氏度：在 [−300, 1000] °C 上二分 celsiusToKelvinByFixedPoints(t) = T。 */
function kelvinToCelsiusByBisection(T: number): number {
  return bisect((t) => celsiusToKelvinByFixedPoints(t) - T, -300, 1000);
}

/**
 * 两个物体热接触的集总模型：热流率 G(T₁ − T₂) 从 1 流向 2，热容 C₁、C₂（J/K），显式欧拉积分到 tEnd。
 * 返回末了的两个温度和从 1 流到 2 的总热量。
 */
function contact(T1: number, C1: number, T2: number, C2: number, G = 0.05, tEnd = 2000, steps = 200_000): { T1: number; T2: number; Q: number } {
  let a = T1;
  let b = T2;
  let Q = 0;
  const h = tEnd / steps;
  for (let i = 0; i < steps; i++) {
    const P = G * (a - b);
    a -= (P * h) / C1;
    b += (P * h) / C2;
    Q += P * h;
  }
  return { T1: a, T2: b, Q };
}

/** 最小二乘直线 y = a + b x，返回截距 a。 */
function interceptLS(xs: number[], ys: number[]): number {
  const n = xs.length;
  const mx = xs.reduce((s, x) => s + x, 0) / n;
  const my = ys.reduce((s, y) => s + y, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const b = sxy / sxx;
  return my - b * mx;
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.temperature',
  notes: {
    p1: 't = 77.36 − 273.15；和按两个定点（0 °C ↔ 273.15 K、100 °C ↔ 373.15 K）的直线插值、二分出 77.36 K 对应的摄氏读数核对。',
    p2:
      '集总热接触模型（热流率 G(T₁ − T₂)，G = 0.05 W/K，积分 2000 s）。A 冰、水都在 273.15 K，流进冰的热量积出来是 0，冰一点不化（错）；对照：水在 275.15 K 时流进冰的热量为正。' +
      'B 取 T乙 = 301.7 K，热平衡即温度相等，甲 = 乙、丙 = 乙、丁 = 丙，让甲（C = 3 J/K）、丁（C = 5 J/K）接触，两边温度、热流都不变（对）。' +
      'C 反例：300 K 下 1 mol 理想气体装 0.0224 m³ 和 0.0112 m³，压强 1.11×10⁵ Pa 和 2.23×10⁵ Pa（错）。' +
      'D (18 + 273.15) − (−5 + 273.15) = 23 K（对）。' +
      'E 温度计热容 2 J/K、20 °C，水滴 0.05 g（热容 0.209 J/K）、80 °C，稳定后约 25.7 °C，远离 80 °C（错）；对照：200 g 水时约 79.9 °C。',
    p3: '各算 T读数 = 273.16 × p/p₃（696.07 K、694.37 K），直线外推到 p₃ = 0：2T(40) − T(80)；和对 (p₃, T读数) 两点做最小二乘直线拟合求截距核对，再与 273.16 × (p/p₃ 的截距) 比对。',
    p4: 't = 32 + 1.8t ⇒ t = −40 °C，T = 233.15 K；和在 [−100, 100] 上二分 t_F(t) − t = 0（t_F 由两个定点 (0, 32)、(100, 212) 插值）再换算核对。',
  },
  compute() {
    // p1（°C）
    const p1 = agree(kelvinToCelsiusByBisection(77.36), 77.36 - T0, 'p1 液氮沸点的摄氏读数', 1e-9);

    // p2
    // A：冰、水都在 0 °C；冰的热容取 2.1 J/K（1 g），一大杯水取 836 J/K（200 g）
    const iceSame = contact(T0, 836, T0, 2.1);
    check(Math.abs(iceSame.Q) < 1e-12, 'p2 A 同温时流进冰的热量为 0');
    const iceWarm = contact(T0 + 2, 836, T0, 2.1);
    check(iceWarm.Q > 0, 'p2 A 对照：水比冰热时有热量流进冰');
    const optA = iceSame.Q > 0; // 冰要化，得有热量流进去

    // B：零定律 = 热平衡即温度相等；甲、丁接触
    const Tyi = 301.7;
    const [Tjia, Tbing] = [Tyi, Tyi];
    const Tding = Tbing;
    const jd = contact(Tjia, 3, Tding, 5);
    const optB = Math.abs(jd.T1 - Tjia) < 1e-12 && Math.abs(jd.T2 - Tding) < 1e-12 && Math.abs(jd.Q) < 1e-12;

    // C：同温的两份理想气体压强可以不同
    const pa = (1 * R * 300) / 0.0224;
    const pb = (1 * R * 300) / 0.0112;
    const optC = Math.abs(pa - pb) < 1e-9; // 「一定相同」要求同温就同压；反例说明不成立

    // D：温差
    const dT = celsiusToKelvinByFixedPoints(18) - celsiusToKelvinByFixedPoints(-5);
    const optD = Math.abs(dT - 23) < 1e-9;

    // E：冷温度计插进一小滴热水
    const cw = 4.18; // J/(g·K)
    const drop = contact(20 + T0, 2, 80 + T0, 0.05 * cw);
    const mix = (2 * 20 + 0.05 * cw * 80) / (2 + 0.05 * cw);
    check(Math.abs(drop.T1 - T0 - mix) < 1e-6 && Math.abs(drop.T2 - T0 - mix) < 1e-6, 'p2 E 模拟的末温和混合公式一致');
    const cup = (2 * 20 + 200 * cw * 80) / (2 + 200 * cw);
    check(Math.abs(cup - 80) < 0.2, 'p2 E 对照：水很多时读数接近原来的温度');
    const optE = Math.abs(mix - 80) < 0.5; // 0.5 °C 以内才算「就是原来的温度」

    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（K）
    const p3s = [80.0, 40.0];
    const ps = [203.856, 101.68];
    const Tread = ps.map((p, i) => (T3 * p) / p3s[i]);
    const extrap = 2 * Tread[1] - Tread[0]; // p₃ 等距：80 → 40 → 0
    const ls = interceptLS(p3s, Tread);
    const ratio0 = interceptLS(p3s, ps.map((p, i) => p / p3s[i]));
    agree(ls, extrap, 'p3 两种外推', 1e-12);
    const p3 = agree(T3 * ratio0, extrap, 'p3 锌的凝固点', 1e-12);
    check(Math.abs(p3 - 692.7) < 0.05, 'p3 四位有效数字是 692.7');

    // p4（K）
    const tF = (t: number) => 32 + ((t - 0) * (212 - 32)) / (100 - 0);
    const tEq = bisect((t) => tF(t) - t, -100, 100);
    const p4 = agree(tEq + T0, -40 + T0, 'p4 华氏与摄氏读数相同处的热力学温度', 1e-12);

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
