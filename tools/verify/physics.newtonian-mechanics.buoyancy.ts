// 独立验算 physics.newtonian-mechanics.buoyancy 的 p1–p4（简单题、中等题）。
// 两套算法：一是阿基米德原理 F = ρgV排；二是把物体当成竖直放着的长方体，用上下表面的压强差算浮力（p1），
// 或者直接列受力平衡、用 bisect 解（p3、p4）。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.buoyancy.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;
const rhoW = 1.0e3;
/** 竖直放着的长方体（底面积 S、高 c），上表面在液面下 h1 处：上下表面压力之差。 */
const boxBuoyancy = (rho: number, S: number, c: number, h1: number, p0 = 1.0e5) => (p0 + rho * g * (h1 + c)) * S - (p0 + rho * g * h1) * S;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.buoyancy',
  notes: {
    p1: 'ρ酒精·g·V；和把铁块当成底面 0.10 m × 0.05 m、高 0.10 m 的长方体、上表面在液面下 0.30 m，用上下表面压力之差核对。',
    p2: '逐条用例子（选项顺序照批次 21 修订后的，原来的 B、A、C、E、D）：A 体积 1e-4 m³ 的铁块和木块浸没，浮力都是 0.98 N（错）；B 0.6 kg 的物体漂浮，清水（1000）和盐水（1100）里浮力都等于重力 5.88 N，只是浸入的体积不同（对）；C 0.1 kg 的冰浮着排开 1e-4 m³ 水，化成的水也正好是 1e-4 m³（对）；D 1 m³ 氢气（密度 0.09）加 0.5 kg 的球皮，空气浮力 1.29g 大于重力 0.59g，合力向上才能升空（对）；E 同一个 1e-4 m³ 的物体浸没在清水和盐水里，浮力 0.98 N 和 1.078 N（错）。',
    p3: '水里浸入 3/5，木块密度 600；液体里浸入 3/4，液体密度 600/(3/4)；和对木块列「浮力 = 重力」、用 bisect 解液体密度核对。',
    p4: '空气浮力减去氦气的重力：(1.29 − 0.18)×5.0；和列「浮力 = 氦气重力 + mg」、用 bisect 解 m 核对。题目问的是临界值。',
  },
  compute() {
    // p1（N）
    const rhoAlc = 0.8e3;
    const V = 5.0e-4;
    const p1 = agree(boxBuoyancy(rhoAlc, 0.1 * 0.05, 0.1, 0.3), rhoAlc * g * V, 'p1 浮力', 1e-9);

    // p2
    // A：漂浮时浮力等于重力，和液体密度无关；浸入的体积随密度变
    const m = 0.6;
    const subFresh = m / 1000;
    const subSalt = m / 1100;
    check(subFresh !== subSalt, 'p2 A 浸入的体积不同');
    const optA = Math.abs(1000 * g * subFresh - 1100 * g * subSalt) < 1e-12;
    // B：体积相同、都浸没
    const optB = rhoW * g * 1e-4 > rhoW * g * 1e-4;
    // C：冰化成水
    const mIce = 0.1;
    const displaced = mIce / rhoW; // 漂浮：ρ水·V排 = m冰
    const melted = mIce / rhoW;
    const optC = Math.abs(displaced - melted) < 1e-15;
    // D：浸没在清水、盐水里
    const optD = Math.abs(1000 * g * 1e-4 - 1100 * g * 1e-4) < 1e-12;
    // E：氢气球
    const lift = 1.29 * g * 1;
    const weight = (0.09 * 1 + 0.5) * g;
    const optE = lift > weight;
    // 变量名是修订前的字母；修订后的顺序是原来的 B、A、C、E、D
    const p2 = chosen([optB, optA, optC, optE, optD]);

    // p3（kg/m³）
    const rhoWood = rhoW * (1 - 2 / 5);
    const rhoLiqNum = bisect((rl) => rl * g * (1 - 1 / 4) - rhoWood * g, 100, 5000); // 单位体积木块：浮力 = 重力
    const p3 = agree(rhoLiqNum, rhoWood / (3 / 4), 'p3 液体的密度', 1e-12);

    // p4（kg）
    const Vb = 5.0;
    const mNum = bisect((mm) => 1.29 * g * Vb - 0.18 * g * Vb - mm * g, 0, 100);
    const p4 = agree(mNum, (1.29 - 0.18) * Vb, 'p4 最大质量', 1e-12);

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
