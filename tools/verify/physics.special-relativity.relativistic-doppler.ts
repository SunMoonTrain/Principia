// 独立验算 physics.special-relativity.relativistic-doppler 的 p1–p4（简单题、中等题）。
// 频率比不用多普勒公式：光源的钟每走一个周期发一个波峰（S 里相隔多久由光钟追光算出），波峰沿传播方向
// 到达远处的观察者，到达的时间差 = 发出的时间差 − 光源位移在传播方向上的投影 / c（_relativity.ts 的 dopplerRatio）。
// 光源静止系里的发射方向换到观察者系，用批次 6 的雷达法算光的速度（radarVelocity）。都和公式核对。
// 单独运行：npx tsx tools/verify/physics.special-relativity.relativistic-doppler.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, clockRate, dot4, dopplerRatio, gamma, radarVelocity } from './physics.special-relativity._relativity.ts';

export const verification: Verification = {
  lesson: 'physics.special-relativity.relativistic-doppler',
  notes: {
    p1: '光源沿 +x 以 0.8c 飞走，观察者在后方，光沿 −x 传播：用光钟和波峰的到达时间差算频率比；和 √((1 − β)/(1 + β)) 核对。',
    p2: 'A：同一个情形分别在光源静止系和观察者静止系里算频率比，结果相同；B：观察者系里光沿 y 方向传来时频率比是 √(1 − β²) < 1；C：β = 0.5 时远离的频率比 0.577 ≠ 1 − β（反例）；D：光的四维波矢 (ω/c, k) 满足 k·k = 0；E：A 的反面（反例）。',
    p3: '对 β 二分，使远离时的频率比（波峰到达时间差算）等于 1/1.5；和 (1.5² − 1)/(1.5² + 1) 核对。',
    p4: '光源静止系里光沿 +y 发出，用雷达法换到观察者系得传播方向 (0.6, 0.8)；再用波峰到达时间差算频率比；和 γ = 1.25 核对。',
  },
  compute() {
    // p1
    const p1 = agree(dopplerRatio(0.8, 1, [-1, 0]), Math.sqrt(0.2 / 1.8), 'p1');

    // p2
    // A：观察者静止、光源以 β 飞来；换成光源静止、观察者以 β 迎上去：在观察者的系里算的就是同一件事，
    //    这里在光源系里另算：观察者以 −β 运动，接收的波峰间隔用观察者的钟（光钟读数比）量。
    const beta = 0.5;
    const sourceMoving = dopplerRatio(beta, 1, [1, 0]);
    const observerMoving = (() => {
      // 光源静止，波峰每 1 个单位发一个，沿 +x 传播；观察者从右边以 −β 迎上来：S 里相遇的时间间隔 1/(1 + β)，
      // 观察者自己的钟只走这段时间乘光钟的读数比。
      const meet = 1 / (1 + beta);
      return 1 / (meet * clockRate(-beta, 1));
    })();
    const A2 = Math.abs(sourceMoving - observerMoving) < 1e-9;
    const B2 = dopplerRatio(0.6, 1, [0, 1]) < 1 && Math.abs(dopplerRatio(0.6, 1, [0, 1]) - 0.8) < 1e-9;
    const C2 = Math.abs(dopplerRatio(0.5, 1, [-1, 0]) - (1 - 0.5)) < 1e-6;
    const k = [2, 1.2, -1.6, 0] as [number, number, number, number];
    const D2 = Math.abs(dot4(k, k)) < 1e-12;
    const E2 = !A2;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const b3 = bisect((b) => dopplerRatio(b, 1, [-1, 0]) - 1 / 1.5, 0, 0.99);
    const p3 = agree(b3, (1.5 ** 2 - 1) / (1.5 ** 2 + 1), 'p3');

    // p4
    const dir = radarVelocity(-0.6, 1, 0, 1);
    check(Math.abs(Math.hypot(...dir) - 1) < 1e-9, 'p4：光在观察者系里速率仍是 c');
    const p4 = agree(dopplerRatio(0.6, 1, dir), gamma(0.6), 'p4');

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
