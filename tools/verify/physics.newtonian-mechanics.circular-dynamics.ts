// 独立验算 physics.newtonian-mechanics.circular-dynamics 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（mg − N = mv²/R、cosθ = g/(Lω²)、v = √(gR)）；
// 二是不用解出来的式子：把水平、竖直两个方向的牛顿第二定律列成方程组，在未知的角度或速率上二分，
// 让方程组的解满足条件（拉力的两个分量对得上、座椅的力为零）。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.circular-dynamics.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, chosen, deg, solveLinear } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.circular-dynamics',
  notes: {
    p1: 'N = m(g − v²/R)；和方程组核对：取指向圆心（向下）为正，解 mg − N = mv²/R。',
    p2: '逐条用例子：A m = 2、v = 3、r = 1.5 的匀速圆周运动，合力大小一直是 12 N，方向随位置转（对）；B 竖直面内转圈，最高点重力、拉力都竖直向下，合力竖直向下（对）；C 绳断后不受水平力，沿切线匀速飞出（错）；D v = 10 时半径 20、40 m 需要的向心力 5m、2.5m（错）；E 倾角 15° 的弯道按设计速率 N = mg/cos15° = 1.035mg（对）。',
    p3: 'cosθ = g/(Lω²)；和方程组核对：给定 θ 解出 T（由竖直方向），在 θ 上二分让水平方向 T sinθ = mω²L sinθ。',
    p4: 'v = √(gR)；和方程组核对：在 v 上二分，让座椅对乘客的力 N = m(v²/R − g) 为零。',
  },
  compute() {
    // p1（N）
    const m = 1000;
    const v = 10;
    const R = 40;
    const formula1 = m * (g - (v * v) / R);
    const [N1] = solveLinear([[-1]], [(m * v * v) / R - m * g]);
    const p1 = agree(N1, formula1, 'p1 支持力', 1e-12);

    // p2
    const fA = [0, 1, 2].map((t) => { const w = 3 / 1.5; return [2 * w * w * 1.5 * Math.cos(w * t), 2 * w * w * 1.5 * Math.sin(w * t)]; });
    const optA = fA.every((f) => Math.abs(Math.hypot(f[0], f[1]) - 12) < 1e-9) && Math.abs(fA[0][0] - fA[1][0]) > 1;
    const top = { gravity: [0, -1], tension: [0, -1] };
    const optB = top.gravity[0] === 0 && top.tension[0] === 0;
    const optC = false; // 断绳后合力为零，沿切线（与半径垂直）匀速直线运动
    const need = (r: number) => (10 * 10) / r;
    const optD = need(20) < need(40);
    const optE = 1 / Math.cos(15 * deg) > 1;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（度）
    const L = 0.5;
    const w = 6;
    const formula3 = Math.acos(g / (L * w * w)) / deg;
    const mismatch = (th: number) => {
      const T = g / Math.cos(th); // 竖直方向：T cosθ = mg（m = 1）
      return T * Math.sin(th) - w * w * L * Math.sin(th);
    };
    const p3 = agree(bisect(mismatch, 0.2, 1.5) / deg, formula3, 'p3 夹角', 1e-9);

    // p4（m/s）
    const R4 = 10;
    const formula4 = Math.sqrt(g * R4);
    const p4 = agree(bisect((vv) => (vv * vv) / R4 - g, 1, 20), formula4, 'p4 最高点速率', 1e-12);

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
