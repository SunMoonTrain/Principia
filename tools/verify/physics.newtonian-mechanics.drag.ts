// 独立验算 physics.newtonian-mechanics.drag 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的解（v_T、v_T(1 − e^{−t/τ})、平方阻力下 1/v 线性增长）；二是不用这些解：
// 把运动方程交给四阶龙格-库塔法积分——p1 积到速度不再变，p3 积到 0.20 s，p4 积到速度减半。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.drag.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, linear, rk4, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;

/** 线性阻力下从静止下落（取向下为正），积到 t 时的速度。 */
const vLinear = (m: number, b: number, t: number) => rk4((_s, y) => [g - (b / m) * y[0]], [0], 0, t, 20000)[0];

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.drag',
  notes: {
    p1: 'v_T = √(mg/c) = √(75 × 9.8/0.25)；和积分核对：75 dv/dt = 75g − 0.25v² 从静止积 200 s。',
    p2: '逐条用例子：A c = 0.1、m = 1 和 4 kg 积分 100 s，末速度之比 2（对）；B b = 1、m = 1 和 2 kg 积分 200 s，末速度之比 2，不是 √2（错）；C m = b = 1 时 τ = 1 s，积分到 2 s 是 v_T 的 86.5%（对）；D 平方阻力 c/m = 0.05、以 20 m/s 上抛，积分出上升 1.37 s、下落 1.65 s，上升的短（错）；E 同 C，二分出 v = v_T/2 的时刻，等于 τ ln 2（对）。',
    p3: 'τ = m/b = 0.10 s，v_T = mg/b = 0.98 m/s，v = v_T(1 − e^{−2})；和积分核对。',
    p4: '平方阻力：1/v − 1/v₀ = ct/m，v = v₀/2 时 t = m/(cv₀) = 2.0 s；和积分核对：500 dv/dt = −25v² 从 10 m/s 积到 5 m/s。',
  },
  compute() {
    // p1（m/s）
    const vEnd = rk4((_s, y) => [g - (0.25 / 75) * y[0] * y[0]], [0], 0, 200, 200000)[0];
    const p1 = agree(vEnd, Math.sqrt((75 * g) / 0.25), 'p1 终端速度', 1e-9);

    // p2
    const quadEnd = (m: number) => rk4((_s, y) => [g - (0.1 / m) * y[0] * y[0]], [0], 0, 100, 100000)[0];
    const optA = Math.abs(quadEnd(4) / quadEnd(1) - 2) < 1e-6;
    const optB = Math.abs(vLinear(2, 1, 200) / vLinear(1, 1, 200) - Math.SQRT2) < 1e-6;
    const optC = Math.abs(vLinear(1, 1, 2) / g - 0.86) < 0.01;
    // D：上抛，取向上为正，阻力和速度反向
    const k = 0.05;
    const upE = rk4Until(linear((_t, _x, v) => -g - k * v * Math.abs(v)), [0, 20], 0, 1e-4, 1e8, (_t, s) => -s[1]);
    const downE = rk4Until(linear((_t, _x, v) => -g - k * v * Math.abs(v)), [upE.y[0], 0], upE.t, 1e-4, 1e8, (_t, s) => -s[0]);
    const tUp = upE.t;
    const tDown = downE.t - upE.t;
    const optD = tUp > tDown;
    check(tDown > tUp, 'D 下落比上升用时长');
    const tHalf = bisect((t) => vLinear(1, 1, t) - g / 2, 0.01, 5);
    const optE = Math.abs(tHalf - Math.log(2)) < 1e-6;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m/s）
    const m = 0.002;
    const b = 0.02;
    const vT = (m * g) / b;
    const tau = m / b;
    const p3 = agree(vLinear(m, b, 0.2), vT * (1 - Math.exp(-0.2 / tau)), 'p3 0.20 s 末的速度', 1e-9);

    // p4（s）
    const e4 = rk4Until((_t, y) => [-(25 / 500) * y[0] * y[0]], [10], 0, 1e-5, 1e8, (_t, y) => 5 - y[0]);
    const p4 = agree(e4.t, 500 / (25 * 10), 'p4 速度减半的时间', 1e-8);

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
