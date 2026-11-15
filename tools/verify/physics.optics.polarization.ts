// 独立验算 physics.optics.polarization 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（马吕斯定律 I = I₀cos²θ、自然光透过一半、椭圆偏振光透过偏振片的光强式子）；
// 二是不用这些式子：把电场写成时间的函数，偏振片取瞬时电场沿透振方向的投影，时间平均求光强（_op.ts 的「偏振」一段）；
// 自然光用偏振方向均匀分布的 720 束互不相干的线偏振光代替，转动偏振片时粗扫再黄金分割求最大、最小。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.polarization.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, analyze, check, chosen, deg, fieldOf, meanSq, naturalLight, polarizer, radii, spin, type Field } from './physics.optics._op.ts';

/** 一束（或几束不相干的）光依次通过若干偏振片后的总光强。 */
const through = (beams: Field[], angles: number[]) =>
  beams.reduce((s, E) => s + meanSq(angles.reduce((f, th) => polarizer(th)(f), E)), 0);

export const verification: Verification = {
  lesson: 'physics.optics.polarization',
  notes: {
    p1: 'I = ½I₀cos²50°；和时间域核对：720 束不同偏振方向的线偏振光依次投影到两片偏振片的透振方向上，光强相加。',
    p2: '逐条用例子（时间域）：A Ax = Ay、δ = 0，端点轨迹最小半径为 0，方向 45°（对）；B 自然光与线偏振光各占 0.1/0.9、0.5/0.5、0.9/0.1，转动偏振片最小光强 0.05、0.25、0.45，都不为零（错）；C 两片透振方向相同，透过 0.5（对）；D 椭圆 (1, 0.5, 90°)、(1, 1, 45°)、(1, 2, 60°) 转动偏振片最小光强都大于 0（错）；E Ex = A cos t、Ey = 2A cos(t + π/3)（δ = −60°）的端点轨迹最小、最大半径都不为零且不相等，是椭圆，转向量为负，迎着光看顺时针，是右旋（错）。',
    p3: 'I/I₀ = cos¹²15°；和时间域核对：竖直方向的线偏振光依次投影到 6 个透振方向上。',
    p4: '讲解里椭圆偏振光透过偏振片的式子化成 ½(1 + b²) + ½(1 − b²)cos2θ + b cosδ sin2θ，最大、最小比 (5 + √13)/(5 − √13)；和时间域核对：转动偏振片粗扫再黄金分割。',
  },
  compute() {
    // p1
    const formula1 = 0.5 * Math.cos(50 * deg) ** 2;
    const p1 = agree(through(naturalLight(), [0, 50 * deg]), formula1, 'p1 透过的光强', 1e-9);

    // p2
    const eA = fieldOf(1, 1, 0);
    const [, rMinA] = radii(eA);
    const angA = Math.atan2(eA(0)[1], eA(0)[0]) / deg;
    const optA = rMinA < 1e-9 && Math.abs(angA - 45) < 1e-9;
    const minB = [0.1, 0.5, 0.9].map((fn) => {
      const nat = naturalLight(360).map((E) => (t: number) => E(t).map((v) => v * Math.sqrt(fn)) as [number, number]);
      const lin = fieldOf(Math.sqrt(2 * (1 - fn)), 0, 0); // ⟨|E|²⟩ = 1 − fn
      return analyze([...nat, lin], 360).min;
    });
    check(Math.abs(minB[0] - 0.05) < 1e-6 && Math.abs(minB[1] - 0.25) < 1e-6 && Math.abs(minB[2] - 0.45) < 1e-6, 'B：最小光强 0.05、0.25、0.45');
    const optB = minB.some((m) => m < 1e-9);
    const optC = Math.abs(through(naturalLight(), [0.3, 0.3]) - 0.5) < 1e-9;
    const minD = [fieldOf(1, 0.5, 90 * deg), fieldOf(1, 1, 45 * deg), fieldOf(1, 2, 60 * deg)].map((E) => analyze([E]).min);
    const optD = minD.some((m) => m < 1e-9);
    // E（修订后的选项）：Ey = 2A cos(ωt − kz + π/3)，即 δ = −60°；选项说「逆时针、左旋椭圆偏振」
    const eE = fieldOf(1, 2, -60 * deg);
    const [rMaxE, rMinE] = radii(eE);
    check(rMinE > 0.1 && rMaxE - rMinE > 0.1, 'E：是椭圆');
    check(spin(eE) < -0.1, 'E：顺时针');
    const optE = spin(eE) > 0; // 逆时针（左旋）才对
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3：竖直为 y 轴，第 k 片和竖直方向成 15k°，即和 x 轴成 90° − 15k°
    const angles3 = [1, 2, 3, 4, 5, 6].map((k) => (90 - 15 * k) * deg);
    const in3 = fieldOf(0, 1, 0);
    const formula3 = Math.cos(15 * deg) ** 12;
    const p3 = agree(through([in3], angles3) / meanSq(in3), formula3, 'p3 透过的比例', 1e-9);

    // p4
    const b = 2;
    const dl = 60 * deg;
    const S = (1 + b * b) / 2;
    const amp = Math.hypot((1 - b * b) / 2, b * Math.cos(dl));
    const formula4 = (S + amp) / (S - amp);
    check(Math.abs(formula4 - (5 + Math.sqrt(13)) / (5 - Math.sqrt(13))) < 1e-12, 'p4 (5 + √13)/(5 − √13)');
    const r4 = analyze([fieldOf(1, 2, 60 * deg)]);
    const p4 = agree(r4.max / r4.min, formula4, 'p4 最大、最小之比', 1e-9);

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
