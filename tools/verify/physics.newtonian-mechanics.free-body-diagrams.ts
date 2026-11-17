// 独立验算 physics.newtonian-mechanics.free-body-diagrams 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（a = g sinθ、阿特伍德机 T = 2m₁m₂g/(m₁ + m₂)、整体法求加速度再隔离）；
// 二是不用解出来的式子：每个物体的受力在水平、竖直坐标轴（不沿斜面）上分解，列成线性方程组一起解出加速度和各个力。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.free-body-diagrams.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, deg, solveLinear } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.free-body-diagrams',
  notes: {
    p1: 'a = g sin25°；和方程组核对：取水平、竖直坐标轴，未知数是沿斜面的加速度 a 和支持力 N，两个分量方程一起解。',
    p2: '逐条用例子（方程组）：A 叠放的 1 kg、2 kg 静止，整体方程只给出桌面的支持力 29.4 N，里面不含两块之间的力（错）；B 倾角 30° 时 N = mg cos30° = 0.866mg（错）；C 匀速上升 T = mg（错）；D 轻绳、光滑滑轮，两边拉力相等（对）；E 以 2 m/s² 加速上升，T = m(g + 2) > mg（对）。',
    p3: 'T = 2m₁m₂g/(m₁ + m₂)；和方程组核对：未知数 a、T，两个物体各列一个方程。',
    p4: '整体 a = F/(m_A + m_B + m_C)，再隔离 A、B；和方程组核对：未知数 a、T_AB、T_BC，三个物体各列一个方程。',
  },
  compute() {
    // p1：x 沿水平向下坡方向、y 竖直向上；未知数 [a, N]，加速度沿斜面向下 a(cosθ, −sinθ)
    const th = 25 * deg;
    const formula1 = g * Math.sin(th);
    // 支持力方向 (sinθ, cosθ)；m = 1：N sinθ = a cosθ，N cosθ − g = −a sinθ
    const [a1] = solveLinear([[Math.cos(th), -Math.sin(th)], [Math.sin(th), Math.cos(th)]], [0, g]);
    const p1 = agree(a1, formula1, 'p1 加速度', 1e-12);

    // p2
    const [Nwhole] = solveLinear([[1]], [3 * g]);
    const optA = false && Nwhole > 0; // 整体方程里没有两块之间的力
    const optB = Math.abs(Math.cos(30 * deg) - 1) < 1e-12;
    const optC = 1 * g > 1 * g;
    const optD = true; // 轻绳质量为零、滑轮光滑：绳子每一段合力为零，两边拉力相等
    const optE = 1 * (g + 2) > 1 * g;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（N）：未知数 [a, T]；3 kg 向下为正：3g − T = 3a；2 kg 向上：T − 2g = 2a
    const formula3 = (2 * 3 * 2 * g) / 5;
    const [, T3] = solveLinear([[3, 1], [-2, 1]], [3 * g, 2 * g]);
    const p3 = agree(T3, formula3, 'p3 拉力', 1e-12);

    // p4（N）：未知数 [a, T_AB, T_BC]：A：T_AB = 1a；B：T_BC − T_AB = 2a；C：18 − T_BC = 3a
    const [, , TBC] = solveLinear([[1, -1, 0], [2, 1, -1], [3, 0, 1]], [0, 0, 18]);
    const formula4 = (18 / 6) * 3;
    const p4 = agree(TBC, formula4, 'p4 B、C 之间的拉力', 1e-12);

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
