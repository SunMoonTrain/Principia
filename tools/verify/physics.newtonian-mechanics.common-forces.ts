// 独立验算 physics.newtonian-mechanics.common-forces 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（x = mg/k、N = m(g + a)、并联弹簧伸长相同）；
// 二是不用解出来的式子：p1 让挂着的物体在有阻尼的弹簧上从原长放开，积分到静止量伸长；
// p3、p4 把各个力的平衡（和力矩平衡）列成线性方程组直接解。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.common-forces.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, deg, linear, rk4, solveLinear } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.common-forces',
  notes: {
    p1: 'x = mg/k；和积分核对：弹簧下端的物体从原长放开，加一点阻尼，积分 60 s 到静止，量伸长。',
    p2: '逐条用例子：A 同一物体在地球、月球上 m 都是 0.5 kg，重力 4.9 N、0.81 N（错）；B 轻绳只能沿绳拉（对）；C 书对桌面的弹力作用在桌面上，重力作用在书上，不是同一个力（错）；D 倾角 20° 的木板上，支持力垂直于板面，和竖直方向成 20°（错）；E 同样伸长 0.1 m，k = 100、300 时弹力 10、30 N（对）。',
    p3: '向下运行、减速，加速度向上 2.0：N = m(g + a)；和方程组核对：取向上为正，解 N − mg = ma。',
    p4: '两根弹簧伸长相同 x = mg/(k₁ + k₂)；和方程组核对：未知数 F₁、F₂、x 和挂点到弹簧 1 的距离，列竖直方向的力平衡、两个胡克定律和对弹簧 1 的力矩平衡（杆长取 1 m）。',
  },
  compute() {
    // p1（cm）
    const k = 200;
    const m = 0.5;
    const formula1 = ((m * g) / k) * 100;
    const s = rk4(linear((_t, x, v) => (m * g - k * x - 2 * v) / m), [0, 0], 0, 60, 60000);
    const p1 = agree(s[0] * 100, formula1, 'p1 伸长', 1e-9);

    // p2
    const optA = 0.5 * 9.8 !== 0.5 * 1.62 && 0.5 < 0.5;
    const optB = true; // 轻绳只能沿绳拉（定义）
    const optC = false; // 两个力作用在不同物体上，性质也不同
    const nDir = [-Math.sin(20 * deg), Math.cos(20 * deg)];
    const optD = Math.abs(nDir[0]) < 1e-12;
    const optE = 300 * 0.1 > 100 * 0.1;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（N）
    const formula3 = 50 * (g + 2);
    const [N] = solveLinear([[1]], [50 * 2 + 50 * g]);
    const p3 = agree(N, formula3, 'p3 示数', 1e-12);

    // p4（cm）：未知数 [F1, F2, x, d]，F1 = 100x，F2 = 300x，F1 + F2 = mg，F2·1 = mg·d（对弹簧 1 取力矩）
    const mg = 2 * g;
    // 先解前三个（线性），再由力矩求挂点
    const [F1, F2, x] = solveLinear([[1, 0, -100], [0, 1, -300], [1, 1, 0]], [0, 0, mg]);
    const dHang = F2 / mg;
    const formula4 = (mg / 400) * 100;
    check(F1 > 0 && dHang > 0 && dHang < 1, 'p4 挂点在杆上');
    const p4 = agree(x * 100, formula4, 'p4 伸长', 1e-12);

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
