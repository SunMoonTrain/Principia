// 独立验算 physics.newtonian-mechanics.statics 的 p1–p4（简单题、中等题）。
// 两套算法：一是对一点取力矩、一个方程解出来；二是把所有未知力（包括支点、支架的力）列成力和力矩的方程组，
// 用 solveLinear 一起解（p1、p3），或者用 bisect 找力矩之和为零的支点位置、杆按很多小段算（p4）。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.statics.ts

import { fileURLToPath } from 'node:url';
import { agree, bisect, check, chosen, solveLinear } from './physics.newtonian-mechanics._nm.ts';
import { runVerification, type Verification } from './lib.ts';

const g = 9.8;
/** 平面里力 F = (Fx, Fy) 作用在 (x, y) 处，对点 (px, py) 的力矩。 */
const tq = (x: number, y: number, Fx: number, Fy: number, px = 0, py = 0) => (x - px) * Fy - (y - py) * Fx;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.statics',
  notes: {
    p1: '对支点：F×1.0 = 600×0.20；和 solveLinear 联立「竖直方向力之和为零、对石头那端的力矩之和为零」（未知数 F 和支点的力）核对。',
    p2: '逐条用例子（例 2 那样的梯子，长 4 m、质量 10 kg、和墙成 30°，墙光滑）：A 重力对梯子下端的力矩不为零（错）；B 平衡时外力对墙外 (5, −3) 处的力矩之和为零（对）；C 线密度 1 + x 的木棒（长 1），重心在 5/9 处，左段质量约 0.710、右段约 0.790（错）；D 把地面的支持力和摩擦力合成一个力，梯子只受三个力，三条作用线交于重力作用线和墙的支持力作用线的交点（对）；E 长 2 m、斜放 45° 的均匀杆，g 按 1/r² 随高度变，在地面和 2000 m 高处算出的重心位置相差不到 1e-9 m（对）。',
    p3: '对右端：N左×4.0 = 20g×2.0 + 50g×2.8；和 solveLinear 联立两个支架的力核对。',
    p4: '质心离铁块那端 (2.0×0.5)/3.0；和把杆分成 100000 小段、用 bisect 找对支点力矩之和为零的位置核对。',
  },
  compute() {
    // p1（N）：撬棍沿 x 轴，石头那端 x = 0，支点 x = 0.2，人在 x = 1.2；石头的力向下 600 N
    // 未知数 [F, N]：竖直方向 N − 600 − F = 0；对 x = 0：0.2N − 1.2F = 0
    const [F1] = solveLinear(
      [
        [-1, 1],
        [-1.2, 0.2],
      ],
      [600, 0],
    );
    const p1 = agree(F1, (600 * 0.2) / 1.0, 'p1 人用的力', 1e-12);

    // p2：梯子
    const L = 4;
    const m = 10;
    const th = Math.PI / 6;
    const top = [0, L * Math.cos(th)];
    const bottom = [L * Math.sin(th), 0];
    const mid = [bottom[0] / 2, top[1] / 2];
    const N2 = m * g;
    const f = 0.5 * m * g * Math.tan(th); // 指向墙（−x）
    const N1 = f; // 离开墙（+x）
    const forces = [
      { x: mid[0], y: mid[1], Fx: 0, Fy: -m * g },
      { x: top[0], y: top[1], Fx: N1, Fy: 0 },
      { x: bottom[0], y: bottom[1], Fx: -f, Fy: N2 },
    ];
    const sumTorque = (px: number, py: number) => forces.reduce((s, F) => s + tq(F.x, F.y, F.Fx, F.Fy, px, py), 0);
    check(Math.abs(sumTorque(bottom[0], bottom[1])) < 1e-9 && Math.abs(sumTorque(0, 0)) < 1e-9, 'p2 梯子平衡');
    const optA = Math.abs(tq(mid[0], mid[1], 0, -m * g, bottom[0], bottom[1])) < 1e-12;
    const optB = Math.abs(sumTorque(5, -3)) < 1e-9;
    // C：线密度 1 + x
    const total = 1.5;
    const xc = (1 / 2 + 1 / 3) / total;
    const left = xc + (xc * xc) / 2;
    check(Math.abs(xc - 5 / 9) < 1e-15, 'p2 C 重心在 5/9 处');
    const optC = Math.abs(left - (total - left)) < 1e-9;
    // D：三力汇交——重力的作用线 x = mid.x，墙的支持力的作用线 y = top.y，交点 P；地面合力的作用线是否过 P
    const P = [mid[0], top[1]];
    const optD = Math.abs((P[0] - bottom[0]) * N2 - (P[1] - bottom[1]) * -f) < 1e-9;
    // E：g 随高度变时的重心
    const RE = 6.371e6;
    const cg = (base: number) => {
      const n = 2000;
      let sw = 0;
      let swx = 0;
      for (let i = 0; i < n; i++) {
        const s = (i + 0.5) / n;
        const x = 2 * s * Math.cos(Math.PI / 4);
        const z = base + 2 * s * Math.sin(Math.PI / 4);
        const gz = g * (RE / (RE + z)) ** 2;
        sw += gz;
        swx += gz * x;
      }
      return swx / sw;
    };
    const optE = Math.abs(cg(0) - cg(2000)) < 1e-9;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（N）：木板 [0, 4]，人在 1.2 处；未知数 [N左, N右]
    const [NL] = solveLinear(
      [
        [1, 1],
        [0, 4],
      ],
      [70 * g, 20 * g * 2 + 50 * g * 1.2],
    );
    const p3 = agree(NL, (20 * g * 2.0 + 50 * g * 2.8) / 4.0, 'p3 左边支架的力', 1e-12);

    // p4（m）：铁块在 x = 0，杆 [0, 1]
    const n = 100000;
    const torqueAbout = (x: number) => {
      let s = 1.0 * g * (0 - x);
      for (let i = 0; i < n; i++) s += (2.0 / n) * g * ((i + 0.5) / n - x);
      return s;
    };
    const xNum = bisect(torqueAbout, 0, 1);
    const p4 = agree(xNum, (2.0 * 0.5) / 3.0, 'p4 支点的位置', 1e-9);

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
