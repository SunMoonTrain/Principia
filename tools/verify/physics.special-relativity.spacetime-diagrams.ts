// 独立验算 physics.special-relativity.spacetime-diagrams 的 p1–p4（简单题、中等题）。
// 带撇的坐标用 _relativity.ts 的雷达法（只用光信号）求；轴的方向、单位点在 S 的时空图上的位置，
// 都用二分法从「t′ = 0」「x′ = 0、钟读 1」这些条件直接找，再和 tanθ = β、(γ, γβ) 核对。
// 单独运行：npx tsx tools/verify/physics.special-relativity.spacetime-diagrams.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, boost, chosen, clockRate, gamma, radar } from './physics.special-relativity._relativity.ts';

export const verification: Verification = {
  lesson: 'physics.special-relativity.spacetime-diagrams',
  notes: {
    p1: '在 x = 1 处对 ct 二分，找雷达法 t′ = 0 的事件，它和原点连成 x′ 轴，求和 x 轴的夹角；和 arctan 0.6 核对，换成度。',
    p2: '能否有因果联系：一是看 c²Δt² − Δx² ≥ 0（且不是同一个事件）；二是看有没有不超过光速的信号连得上（|Δx| ≤ c|Δt|，Δt ≠ 0），对类空的两项另用雷达法确认先后会随惯性系颠倒。两种判法一致：A、C、D。',
    p3: '雷达法求 P 在 S′（0.6c）里的 ct′，取绝对值；和 γ(ct − βx) 核对。',
    p4: 'S′ 原点的世界线是 x = βct，它的光钟读到 1 时 ct = 1/读数比，求这一点到原点的纸面距离；和 √(γ² + γ²β²) 核对。',
  },
  compute() {
    // p1（c = 1）
    const ct1 = bisect((ct) => radar(0.6, 1, { t: ct, x: 1 }).t, -2, 2);
    const p1 = agree((Math.atan2(ct1, 1) * 180) / Math.PI, (Math.atan(0.6) * 180) / Math.PI, 'p1');

    // p2：(ct, x)
    const evs: [number, number][] = [
      [3, 2],
      [1, -2],
      [-2, 1],
      [2, 2],
      [0, 0.5],
    ];
    const byInterval = evs.map(([ct, x]) => ct * ct - x * x >= 0 && (ct !== 0 || x !== 0));
    const bySignal = evs.map(([ct, x]) => ct !== 0 && Math.abs(x) <= Math.abs(ct));
    byInterval.forEach((s, i) => {
      if (s !== bySignal[i]) throw new Error(`p2 第 ${i + 1} 项两种判法不一致`);
    });
    evs.forEach(([ct, x], i) => {
      if (byInterval[i]) return;
      const early = radar(0.9, 1, { t: ct, x }).t;
      const late = radar(-0.9, 1, { t: ct, x }).t;
      if (early * late >= 0) throw new Error(`p2 第 ${i + 1} 项：类空却没有颠倒先后`);
    });
    const p2 = chosen(byInterval);

    // p3
    const p3 = agree(Math.abs(radar(0.6, 1, { t: 1, x: 4 }).t), Math.abs(boost(0.6, 1, 4)[0]), 'p3');

    // p4
    const beta = 0.8;
    const ct4 = 1 / clockRate(beta, 1);
    const p4 = agree(Math.hypot(ct4, beta * ct4), Math.hypot(gamma(beta), gamma(beta) * beta), 'p4');

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
