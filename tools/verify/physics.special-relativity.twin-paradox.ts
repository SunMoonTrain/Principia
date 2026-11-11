// 独立验算 physics.special-relativity.twin-paradox 的 p1–p4（简单题、中等题）。
// 钟走多少不用 √(1 − β²) 的式子：沿世界线逐段乘光钟的读数比（clockRate，在 S 里追光），或在别的惯性系里
// 用雷达法换坐标后再算；「此刻」用雷达法在乙的惯性系里找和掉头事件同时的地球事件（二分）；梯子长度用
// restPoint（S′ 里静止的点在 S 的同一时刻在哪里）。最后都和讲解里的公式核对。
// 单独运行：npx tsx tools/verify/physics.special-relativity.twin-paradox.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, clockRate, radar, radarVelocity, restPoint } from './physics.special-relativity._relativity.ts';

/** 地球系里乙以 β 去、以 β 回（掉头不计时间），到 D 光年处掉头：乙的钟走的年数，逐段乘光钟的读数比。 */
const travellerS = (beta: number, D: number): number => 2 * (D / beta) * clockRate(beta, 1);

/** 同一趟旅行在乙去程的惯性系 S′ 里算：去程乙静止；回程乙的速度用雷达法换到 S′，再乘那个速度的读数比。 */
function travellerSprime(beta: number, D: number): number {
  const T = radar(beta, 1, { t: D / beta, x: D });
  const R = radar(beta, 1, { t: (2 * D) / beta, x: 0 });
  const [back] = radarVelocity(beta, 1, -beta);
  return (T.t - 0) * 1 + (R.t - T.t) * clockRate(back, 1);
}

/** 地球在乙的惯性系（相对地球以 w 运动）里和掉头事件 T 同时的时刻：对地球时间二分。 */
function earthNow(w: number, T: { t: number; x: number }): number {
  const tT = radar(w, 1, T).t;
  return bisect((tE) => radar(w, 1, { t: tE, x: 0 }).t - tT, -20, 40);
}

export const verification: Verification = {
  lesson: 'physics.special-relativity.twin-paradox',
  notes: {
    p1: '地球系里两段各 5 年，乘光钟（0.6c）的读数比；另在乙去程的惯性系里用雷达法换坐标、回程速度也换过去再乘读数比；和 2·(3/0.6)·√(1 − 0.36) 核对。',
    p2: 'A：p1 的两种算法（地球系、乙的去程系）结果相同；B：去程系里地球以 −0.6c 运动，读数比小于 1；C：掉头改成用时 δ 的匀减速、匀加速，δ → 0 时乙的钟读数趋于同一个值，年龄差不来自加速度；D：车库系里同时关上的两扇门，雷达法换到梯子系里 t′ 不同（反例）；E：两事件之间随意取几条折线世界线，固有时都比直线短。',
    p3: '掉头事件 T = (5 年, 3 光年)。用雷达法分别在乙去程（+0.6c）和回程（−0.6c）的惯性系里，对地球时间二分，找和 T 同时的地球事件，相减；和 2·0.6·3 核对。',
    p4: '对 v 二分：梯子（S′ 里静止、长 6）在车库系同一时刻两端的距离（restPoint）正好是 5；和 √(1 − (5/6)²) 核对。',
  },
  compute() {
    // p1
    const p1 = agree(travellerS(0.6, 3), 2 * (3 / 0.6) * Math.sqrt(1 - 0.36), 'p1');
    agree(travellerSprime(0.6, 3), p1, 'p1 在乙的去程系里算');

    // p2
    const A2 = Math.abs(travellerSprime(0.6, 3) - travellerS(0.6, 3)) < 1e-9;
    const B2 = clockRate(-0.6, 1) < 1;
    // C：掉头用时 δ（地球系），这段里速度从 0.6 线性降到 −0.6：钟的读数随 δ → 0 收敛到 p1
    const withTurn = (delta: number): number => {
      const cruise = 2 * ((3 - (0.6 * delta) / 4) / 0.6);
      const steps = 2000;
      let turn = 0;
      for (let i = 0; i < steps; i++) {
        const u = 0.6 - (1.2 * (i + 0.5)) / steps;
        turn += (delta / steps) * clockRate(u, 1);
      }
      return cruise * clockRate(0.6, 1) + turn;
    };
    check(Math.abs(withTurn(1e-3) - p1) < 1e-3 && Math.abs(withTurn(1e-1) - p1) < 1e-1, 'p2 C：掉头时间趋于零时读数趋于 8 年');
    const C2 = false;
    const D2 = Math.abs(radar(0.8, 1, { t: 0, x: 0 }).t - radar(0.8, 1, { t: 0, x: 4 }).t) < 1e-12;
    const straight = 10;
    const bends: [number, number][] = [
      [5, 1],
      [5, 4],
      [2, 1.5],
      [8, 1.5],
    ];
    const E2 = bends.every(([tm, xm]) => {
      const leg1 = tm * clockRate(xm / tm, 1);
      const leg2 = (10 - tm) * clockRate(xm / (10 - tm), 1);
      return leg1 + leg2 < straight;
    });
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const T = { t: 5, x: 3 };
    const p3 = agree(earthNow(-0.6, T) - earthNow(0.6, T), 2 * 0.6 * 3, 'p3');

    // p4
    const v4 = bisect((v) => restPoint(v, 1, 6).x - 5, 0.01, 0.99);
    const p4 = agree(v4, Math.sqrt(1 - (5 / 6) ** 2), 'p4');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
