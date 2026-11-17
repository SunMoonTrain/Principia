// 独立验算 physics.newtonian-mechanics.accelerating-frames 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的做法：在加速的参考系里加上惯性力 −ma₀，列平衡方程；二是不用惯性力：
// 换到地面这个惯性系里，用牛顿第二定律列方程组直接解各个力（线性方程组），p4 在地面上把小球和车厢的运动
// 分别积分到小球落地。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.accelerating-frames.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, deg, rk4Until, solveLinear } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;

/** 地面上看：人站在竖直加速度为 ay（向上为正）的电梯里，N − mg = m·ay，解出支持力。 */
const normalForce = (m: number, ay: number) => solveLinear([[1]], [m * g + m * ay])[0];

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.accelerating-frames',
  notes: {
    p1: '电梯里看：N = m(g − a₀)；和地面上的牛顿第二定律核对：N − mg = m·(−2.0)。',
    p2: '逐条用例子（地面上列 N − mg = m·a_y）：A 惯性力不是哪个物体施加的，按定义没有反作用力（错）；B a_y = −g/2 时 N/(mg) = 0.5（对）；C a_y = 0 时 N = mg，不超重（错）；D 惯性力 −ma₀，m = 1、2 kg 时大小 2.0、4.0 N（对）；E 减速下降，加速度向上 a_y = 1.5 时 N > mg（对）。',
    p3: '车厢里看：沿斜面 ma₀cos30° = mg sin30°，a₀ = g tan30°；和地面上的方程组核对：N sin30° = ma₀、N cos30° = mg，解 N、a₀。',
    p4: '车厢里看：小球的加速度是 g 和 −a₀ 的合成，落到后面 a₀h/g；和地面上的积分核对：小球以车厢松开时的速度（取 5 m/s）平抛，车厢以 a₀ 加速，积到小球落地，量两者的水平距离。',
  },
  compute() {
    // p1（N）
    const p1 = agree(normalForce(50, -2.0), 50 * (g - 2.0), 'p1 支持力', 1e-12);

    // p2
    const optA = false; // 惯性力没有施力物体
    const optB = Math.abs(normalForce(1, -g / 2) / g - 0.5) < 1e-12;
    const optC = normalForce(1, 0) > g;
    const inertial = (m: number, a0: number) => m * a0;
    const optD = inertial(2, 2.0) > inertial(1, 2.0);
    const optE = normalForce(1, 1.5) > g;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m/s²）
    const th = 30 * deg;
    const [, a0] = solveLinear(
      [
        [Math.sin(th), -1],
        [Math.cos(th), 0],
      ],
      [0, g],
    );
    const p3 = agree(a0, g * Math.tan(th), 'p3 车厢的加速度', 1e-12);

    // p4（m）
    const A = 3.0;
    const H = 2.0;
    const v0 = 5;
    // 状态 [小球 x, 小球 y, 小球 vx, 小球 vy, 车厢 x, 车厢 vx]
    const land = rk4Until((_t, s) => [s[2], s[3], 0, -g, s[5], A], [0, H, v0, 0, 0, v0], 0, 1e-4, 1e7, (_t, s) => -s[1]);
    const behind = land.y[4] - land.y[0];
    const p4 = agree(behind, (A * H) / g, 'p4 落在后面多远', 1e-9);

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
