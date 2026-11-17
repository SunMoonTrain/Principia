// 独立验算 physics.newtonian-mechanics.kepler-orbits 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（T²/a³ 相同、E = −GMm/(2a)、近心点速率由机械能求）；二是不用这些式子：
// 用平方反比引力积分轨道（_nm.ts 的 keplerHalf），二分出让另一个拱点正好在指定位置的近心点速率，
// 周期是转过半圈用的时间的两倍；比较周期时 GM 取 1，比的是两条轨道积分出的周期之比，不用开普勒第三定律。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.kepler-orbits.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisectN, check, chosen, circularPeriod, keplerHalf, rk4Until } from './physics.newtonian-mechanics._nm.ts';

/** 二分出从 r0 垂直于半径出发、转过半圈时到力心的距离正好是 rOther（> r0）的出发速率。框住范围用圆轨道和逃逸的速率。 */
const speedForApsis = (GM: number, r0: number, rOther: number) =>
  bisectN((v) => keplerHalf(GM, r0, v, 8000).r - rOther, Math.sqrt(GM / r0), 0.999 * Math.sqrt((2 * GM) / r0), 55);

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.kepler-orbits',
  notes: {
    p1: 'T = 1.52^{3/2} 年；和轨道积分核对：GM 取 1，积出半径 1.52 和 1 的圆轨道周期，取比值。',
    p2: '逐条用例子（GM = 1，从 r = 1 的近心点出发）：A v = 1.1 和 1.3 的轨道偏心率 0.21、0.69，后者远心点和近心点之比更大，离圆更远（错）；B v = 1.2 的轨道积到远心点，速率 0.47 < 1.2（对）；C v = 1.5（机械能为正），积分到 r = 1000 时仍在远离、速率大于那里的逃逸速率，不是椭圆（错）；D 近心点 1 和 0.5、远心点 3 和 3.5（半长轴都是 2）的两条轨道，机械能都是 −0.25（对）；E 同 D 的两条轨道，积出的周期相同（对）。',
    p3: 'a = 5.0 AU，T = 5^{3/2} 年；和轨道积分核对：GM 取 1，二分出近日点 0.5、远日点 9.5 的轨道，积出的周期除以半径 1 的圆轨道周期。',
    p4: 'v² = GM(2/r − 1/a)；和轨道积分核对：二分出从近地点出发、转过半圈正好到 1.4×10⁷ m 的速率。',
  },
  compute() {
    // p1（年）
    const p1 = agree(circularPeriod(1, 1.52) / circularPeriod(1, 1), 1.52 ** 1.5, 'p1 火星的周期', 1e-9);

    // p2
    const e = (v: number) => {
      const ra = keplerHalf(1, 1, v).r;
      return (ra - 1) / (ra + 1);
    };
    const optA = e(1.3) > e(1.1) && keplerHalf(1, 1, 1.3).r < keplerHalf(1, 1, 1.1).r;
    const optB = keplerHalf(1, 1, 1.2).v < 1.2;
    const out = rk4Until(
      (_s, y) => {
        const r = Math.hypot(y[0], y[1]);
        return [r * y[2], r * y[3], (-r * y[0]) / r ** 3, (-r * y[1]) / r ** 3];
      },
      [1, 0, 0, 1.5],
      0,
      1e-3,
      1e8,
      (_s, y) => Math.hypot(y[0], y[1]) - 1000,
    ).y;
    const rOut = Math.hypot(out[0], out[1]);
    check((out[0] * out[2] + out[1] * out[3]) / rOut > 0 && Math.hypot(out[2], out[3]) > Math.sqrt(2 / rOut), 'p2 C 机械能为正的轨道一去不回');
    const optC = false; // 一去不回，不是椭圆
    const vA = speedForApsis(1, 1, 3);
    const vB = speedForApsis(1, 0.5, 3.5);
    const E1 = 0.5 * vA * vA - 1;
    const E2 = 0.5 * vB * vB - 1 / 0.5;
    const optD = Math.abs(E1 - E2) < 1e-9;
    const optE = Math.abs(keplerHalf(1, 1, vA).t - keplerHalf(1, 0.5, vB).t) < 1e-9;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（年）
    const vp3 = speedForApsis(1, 0.5, 9.5);
    const T3 = 2 * keplerHalf(1, 0.5, vp3, 40000).t;
    const p3 = agree(T3 / circularPeriod(1, 1), 5 ** 1.5, 'p3 彗星的周期', 1e-8);

    // p4（km/s）
    const GM = 3.98e14;
    const rp = 7.0e6;
    const ra = 1.4e7;
    const a = (rp + ra) / 2;
    const p4 = agree(speedForApsis(GM, rp, ra) / 1000, Math.sqrt(GM * (2 / rp - 1 / a)) / 1000, 'p4 近地点的速率', 1e-9);

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
