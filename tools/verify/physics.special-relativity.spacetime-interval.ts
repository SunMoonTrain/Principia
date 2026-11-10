// 独立验算 physics.special-relativity.spacetime-interval 的 p1–p4（简单题、中等题）。
// 固有时、固有距离不用 √(Δs²) 的式子：对 S′ 的速度二分，用 _relativity.ts 的雷达法（只用光信号）找出让两个事件
// 同地（或同时）的惯性系，在那里直接读 Δt′（或 Δx′）；再和 √(c²Δt² − Δx²) 核对。
// 单独运行：npx tsx tools/verify/physics.special-relativity.spacetime-interval.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, chosen, clockRate, radar, type Ev } from './physics.special-relativity._relativity.ts';

/** 雷达坐标下两个事件的坐标差。 */
function diff(v: number, c: number, a: Ev, b: Ev): { t: number; x: number; y: number } {
  const A = radar(v, c, a);
  const B = radar(v, c, b);
  return { t: B.t - A.t, x: B.x - A.x, y: B.y - A.y };
}

/** 让两个事件（空间位移沿 x）同地的惯性系里的 Δt′；没有这样的惯性系（|v| < c 里找不到变号）返回 null。 */
function sameplace(c: number, a: Ev, b: Ev): number | null {
  const f = (v: number): number => diff(v, c, a, b).x;
  const lo = -0.999999 * c;
  const hi = 0.999999 * c;
  if (f(lo) * f(hi) > 0) return null;
  const v = bisect(f, lo, hi);
  return Math.abs(diff(v, c, a, b).t);
}

/** 让两个事件同时的惯性系里的 |Δx′|；没有返回 null。 */
function sametime(c: number, a: Ev, b: Ev): number | null {
  const f = (v: number): number => diff(v, c, a, b).t;
  const lo = -0.999999 * c;
  const hi = 0.999999 * c;
  if (f(lo) * f(hi) > 0) return null;
  const v = bisect(f, lo, hi);
  return Math.abs(diff(v, c, a, b).x);
}

export const verification: Verification = {
  lesson: 'physics.special-relativity.spacetime-interval',
  notes: {
    p1: '对 S′ 的速度二分，用雷达法找出让两事件同地的惯性系，读 Δt′；和 √(Δt² − Δx²/c²) 核对。',
    p2: '先按 Δs² 的正负分类；再对 A 到 E 各自（D 先把空间位移转到 x 轴上，长 √0.72）用二分法找让两事件同地的惯性系，找得到的正是 Δs² > 0 的 A、D。',
    p3: '粒子的世界线是两段直线（地面时间各 5 μs）：每一段用二分法找出让这一段两端同地的惯性系，读 Δt′ 再相加；另把粒子的钟当成光钟、按两段的速度分别追光求读数比；和 Σ Δt_i √(1 − β_i²) 核对。顺带核对两端之间直线的固有时 √51 ≈ 7.14 比它长。',
    p4: '对 S′ 的速度二分，找出让两事件同时的惯性系，读 |Δx′|；和 √(Δx² − c²Δt²) 核对。',
  },
  compute() {
    const c = 3e8;
    const O: Ev = { t: 0, x: 0 };

    // p1
    const tau1 = sameplace(c, O, { t: 13e-6, x: 3600 });
    if (tau1 === null) throw new Error('p1 不是类时');
    const p1 = agree(tau1 * 1e6, Math.sqrt(13e-6 ** 2 - (3600 / c) ** 2) * 1e6, 'p1');

    // p2（c = 1，单位秒、光秒）
    const pairs: [number, number][] = [
      [2, 1.2],
      [1, 1.5],
      [3, 3],
      [1, Math.hypot(0.6, 0.6)],
      [0, 0.1],
    ];
    const bySign = pairs.map(([dt, dr]) => dt * dt - dr * dr > 1e-12);
    const byFrame = pairs.map(([dt, dr]) => sameplace(1, O, { t: dt, x: dr }) !== null && dt * dt - dr * dr !== 0);
    bySign.forEach((s, i) => {
      if (s !== byFrame[i]) throw new Error(`p2 第 ${i + 1} 项两种判法不一致`);
    });
    const p2 = chosen(bySign);

    // p3（c = 1，时间用 μs、距离用光走 1 μs 的距离）
    const M: Ev = { t: 5, x: 0.6 * 5 };
    const B: Ev = { t: 10, x: M.x + 0.8 * 5 };
    const leg1 = sameplace(1, O, M);
    const leg2 = sameplace(1, M, B);
    if (leg1 === null || leg2 === null) throw new Error('p3 某一段不是类时');
    const byClock = 5 * clockRate(0.6, 1) + 5 * clockRate(0.8, 1);
    agree(leg1 + leg2, byClock, 'p3 两种操作性算法');
    const p3 = agree(leg1 + leg2, 5 * Math.sqrt(1 - 0.36) + 5 * Math.sqrt(1 - 0.64), 'p3');
    const straight = sameplace(1, O, B);
    if (straight === null || !(straight > p3)) throw new Error('p3 两端之间的直线固有时应当更长');
    agree(straight, Math.sqrt(51), 'p3 直线的固有时');

    // p4
    const d4 = sametime(c, O, { t: 2e-6, x: 1000 });
    if (d4 === null) throw new Error('p4 不是类空');
    const p4 = agree(d4, Math.sqrt(1000 ** 2 - (c * 2e-6) ** 2), 'p4');

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
