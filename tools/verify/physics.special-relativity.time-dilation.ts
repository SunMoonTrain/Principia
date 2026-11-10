// 独立验算 physics.special-relativity.time-dilation 的 p1–p4（简单题、中等题）。
// 运动的钟走多快不用 γ 的式子：在 S 里追光钟里的光一个来回（_relativity.ts 的 clockRate，二分法），
// 再和 γ = 1/√(1 − β²) 核对。低速（p4）时 1 − rate 太小，按 β = 0.01、0.02 两处的光钟外推（slowClockLag）。
// 单独运行：npx tsx tools/verify/physics.special-relativity.time-dilation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, clockRate, gamma, radar, restPoint, slowClockLag } from './physics.special-relativity._relativity.ts';

export const verification: Verification = {
  lesson: 'physics.special-relativity.time-dilation',
  notes: {
    p1: '光钟随飞船以 0.8c 运动，二分法追光得出钟的读数/地面时间，地面时间 = 6 μs ÷ 它；和 6γ 核对。',
    p2: 'A：再造一只沿运动方向放置的光钟（镜距在 S 里按雷达法量出），追光算出的周期和横放的光钟相同，所以不是「光钟特有」；B：飞船世界线上两个事件，钟的读数差等于 √(Δt² − Δx²/c²)；C：从 S′ 看 S 的钟（S 以 −v 运动）读数比同样是 √(1 − β²)；D：β 从 0 扫到 0.999，γ 都不小于 1；E：0.6c 时地面时间/钟的读数 = 1.25。',
    p3: '地面时间 9000 m ÷ 0.995c，乘以光钟算出的读数比；和 ÷γ 核对。',
    p4: '少走的时间 = 10 h ×（1 − 读数比），读数比由光钟在 β = 0.01、0.02 外推到 250 m/s；和 t·β²/(1 + √(1 − β²)) 核对，换成 ns。',
  },
  compute() {
    // p1（c = 1）
    const r1 = clockRate(0.8, 1);
    const p1 = agree(6 / r1, 6 * gamma(0.8), 'p1');

    // p2
    const v = 0.6;
    // A：沿运动方向放的光钟，静止时镜距 1：在 S 里的镜距按雷达法量（S 里同一时刻两镜的位置）
    const len = restPoint(v, 1, 1).x;
    const go = len / (1 - v);
    const back = len / (1 + v);
    const longPeriod = go + back;
    const transversePeriod = 2 / clockRate(v, 1);
    const A2 = Math.abs(longPeriod - transversePeriod) > 1e-9;
    // B：飞船（以 v 运动）上的两个事件 (0, 0)、(5, 5v)
    const shipReading = clockRate(v, 1) * 5;
    const B2 = Math.abs(shipReading - Math.sqrt(25 - (5 * v) ** 2)) < 1e-12;
    // C：S 的原点的钟，在 S′ 里看（S 相对 S′ 以 −v 运动）
    const C2 = Math.abs(clockRate(-v, 1) - clockRate(v, 1)) < 1e-15 && Math.abs(radar(-v, 1, { t: 1, x: -v }).t - clockRate(v, 1)) < 1e-12;
    const D2 = !Array.from({ length: 1000 }, (_, i) => i * 0.000999).every((b) => gamma(b) >= 1);
    const E2 = Math.abs(1 / clockRate(0.6, 1) - 1.25) < 1e-12;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const c = 3e8;
    const ground = 9000 / (0.995 * c);
    const p3 = agree(ground * clockRate(0.995, 1) * 1e6, (ground / gamma(0.995)) * 1e6, 'p3');

    // p4
    const T = 10 * 3600;
    const beta4 = 250 / c;
    const lag = T * slowClockLag(250, c);
    const p4 = agree(lag * 1e9, ((T * beta4 * beta4) / (1 + Math.sqrt(1 - beta4 * beta4))) * 1e9, 'p4', 1e-8);

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
