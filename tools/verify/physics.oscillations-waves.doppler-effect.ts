// 独立验算 physics.oscillations-waves.doppler-effect 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的多普勒公式 f = f0(v + u_o)/(v − u_s)、马赫锥 sin α = 1/M；二是不用这些式子，直接数波峰：
// 波源每隔 1/f0 发出一个波峰，二分求每个波峰追上观察者的时刻（crestArrivals），频率是到达间隔的倒数；
// 音爆用「对发声时刻求最早到达的声音」（earliestArrival）找激波到达地面的时刻，再看那一刻飞机的仰角，二分出马赫数。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.doppler-effect.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, crestArrivals, earliestArrival, receivedFrequency } from './physics.oscillations-waves._ow.ts';

const c = 340;

/** 超音速（马赫数 M）、高 h 处水平飞行的飞机，地面上原点处的人听到音爆那一刻，看到飞机的仰角（弧度）。 */
function elevationAtBoom(M: number, h = 1000): number {
  const u = M * c;
  const xs = (t: number) => [u * t, h];
  const { tArrive } = earliestArrival(c, xs, [0, 0], -60, 60, 4000);
  const [x] = xs(tArrive);
  return Math.atan2(h, x);
}

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.doppler-effect',
  notes: {
    p1: 'f = 500/(1 + 30/340)；和数 30 个波峰：波源从原点以 30 m/s 驶离 100 m 外静止的人，二分出每个波峰到达的时刻核对。',
    p2: 'A 波源静止时，t 时刻第 i 个波峰的半径是 c(t − i/f)，相邻相差 c/f，和观察者无关（对）；B 波源以 0.5c 运动，前方相邻波峰相距 (c − u)/f、后方 (c + u)/f，不同（错）；C 数波峰：波源以 30 m/s 远离，频率 459 Hz < 500 Hz，按定义是红移（对）；D 由音爆到达的时刻和那时飞机的位置量出半顶角，M = 2 时 30°、M = 3 时 19.5°，变小（错）；E 数波峰：波源以 0.3c 驶近，频率 1/(1 − 0.3) 倍，比 1 + 0.3 倍高（对）。',
    p3: 'f = 400 × (340 + 5)/(340 − 20)；和数波峰：汽车（波源）和自行车（观察者）相距 200 m、相向而行核对。',
    p4: 'M = 1/sin 40°；和二分马赫数：对发声时刻求地面上最早听到的声音（激波）到达的时刻，那一刻飞机的仰角等于 40°。',
  },
  compute() {
    // p1（Hz）
    const f0 = 500;
    const p1 = agree(receivedFrequency(crestArrivals(c, f0, (t) => [30 * t], () => [-100], 30)), f0 / (1 + 30 / c), 'p1 驶离时听到的频率', 1e-12);

    // p2
    const f = 100;
    const t = 1.0;
    const radii = Array.from({ length: 5 }, (_, i) => c * (t - i / f));
    const optA = radii.every((r, i) => i === 0 || Math.abs(radii[i - 1] - r - c / f) < 1e-9);
    const u = 0.5 * c;
    // 波源沿 +x 运动：第 i 个波峰的圆心在 u·te_i，此刻前缘在 u·te_i + c(t − te_i)、后缘在 u·te_i − c(t − te_i)
    const fronts = Array.from({ length: 5 }, (_, i) => u * (i / f) + c * (t - i / f));
    const backs = Array.from({ length: 5 }, (_, i) => u * (i / f) - c * (t - i / f));
    const ahead = fronts[0] - fronts[1];
    const behind = backs[1] - backs[0];
    check(Math.abs(ahead - (c - u) / f) < 1e-9 && Math.abs(behind - (c + u) / f) < 1e-9, 'p2 B 前后的波长是 (c ∓ u)/f');
    const optB = Math.abs(ahead - behind) < 1e-9;
    const fRecede = receivedFrequency(crestArrivals(c, f0, (tt) => [30 * tt], () => [-100], 30));
    const optC = fRecede < f0;
    // 水平飞行时，音爆那一刻飞机的仰角就是马赫锥的半顶角
    const a2 = elevationAtBoom(2);
    const a3 = elevationAtBoom(3);
    check(Math.abs(a2 - Math.asin(1 / 2)) < 1e-6 && Math.abs(a3 - Math.asin(1 / 3)) < 1e-6, 'p2 D 量出的半顶角是 arcsin(1/M)');
    const optD = a3 > a2;
    const beta = 0.3;
    const fApproach = receivedFrequency(crestArrivals(c, f0, (tt) => [-100 + beta * c * tt], () => [0], 30));
    const optE = fApproach > f0 * (1 + beta);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（Hz）
    const p3 = agree(receivedFrequency(crestArrivals(c, 400, (tt) => [20 * tt], (tt) => [200 - 5 * tt], 30)), (400 * (c + 5)) / (c - 20), 'p3 骑车人听到的频率', 1e-12);

    // p4
    const M = bisect((MM) => elevationAtBoom(MM) - (40 * Math.PI) / 180, 1.05, 5);
    const p4 = agree(M, 1 / Math.sin((40 * Math.PI) / 180), 'p4 马赫数', 1e-6);

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
