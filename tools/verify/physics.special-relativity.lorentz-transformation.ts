// 独立验算 physics.special-relativity.lorentz-transformation 的 p1–p4（简单题、中等题）。
// 事件在 S′ 里的坐标用两种算法：一是洛伦兹变换的公式；二是 _relativity.ts 的雷达法（S′ 原点的光钟发光、收光，
// 按爱因斯坦对钟定 t′、x′，只用光在 S 里以 c 传播），两者先互相核对。
// 单独运行：npx tsx tools/verify/physics.special-relativity.lorentz-transformation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, boost, chosen, gamma, lambdaMatrix, radar } from './physics.special-relativity._relativity.ts';

export const verification: Verification = {
  lesson: 'physics.special-relativity.lorentz-transformation',
  notes: {
    p1: '雷达法求 (t, x) = (3 s, 2 光秒) 在 S′（0.6c）里的 t′；和 γ(t − βx) 核对。',
    p2: 'A：v = 250 m/s，事件取 x = ±4000 km 和 ±1000 km、t = 0 和 5 s，雷达法算出的 t′ 和 γt 之差和 γv|x|/c² 一致，最大约 11 ns；B：x 相同、t 不同的两个事件，x′ 不同（反例）；C：雷达法把 (ct, x) = (1, 0)、(0, 1) 换成 S′ 坐标，拼成矩阵求行列式，等于 1，和 Λ(β) 的行列式一致；D：S 里 x = 0 先后两个事件，在 S′ 里 x′ 不同（反例）；E：先用雷达法换到 S′，再把 S′ 当成静止、S 以 −v 运动换回去，回到原来的坐标。',
    p3: '对 v 二分，使雷达法算出 A、B 在 S′ 里的 t′ 相同；和 c²Δt/Δx 核对。',
    p4: '雷达法求 S 里同时、相距 900 m 的两个事件在 S′（0.8c）里的 t′ 之差；和 γvΔx/c² 核对。',
  },
  compute() {
    // p1（c = 1）
    const p1 = agree(radar(0.6, 1, { t: 3, x: 2 }).t, boost(0.6, 3, 2)[0], 'p1');

    // p2
    const c = 3e8;
    const vA = 250;
    const xs = [-4e6, -1e6, 1e6, 4e6];
    const diffs = xs.flatMap((x) => [0, 5].map((t) => [x, radar(vA, c, { t, x }).t - gamma(vA / c) * t]));
    diffs.forEach(([x, d]) => agree(Math.abs(d), (gamma(vA / c) * vA * Math.abs(x)) / (c * c), 'p2 A', 1e-4));
    const A2 = diffs.every(([, d]) => Math.abs(d) < 1e-6);
    const B2 = Math.abs(radar(0.6, 1, { t: 0, x: 1 }).x - radar(0.6, 1, { t: 2, x: 1 }).x) < 1e-12;
    const col = (ct: number, x: number): [number, number] => {
      const e = radar(0.6, 1, { t: ct, x });
      return [e.t, e.x];
    };
    const [a, b] = col(1, 0);
    const [cc, d] = col(0, 1);
    const det = a * d - cc * b;
    const L = lambdaMatrix(0.6);
    agree(det, L[0][0] * L[1][1] - L[0][1] * L[1][0], 'p2 C', 1e-9);
    const C2 = Math.abs(det - 1) < 1e-9;
    const D2 = Math.abs(radar(0.6, 1, { t: 0, x: 0 }).x - radar(0.6, 1, { t: 1, x: 0 }).x) < 1e-12;
    const there = radar(0.6, 1, { t: 1.3, x: -0.7 });
    const backAgain = radar(-0.6, 1, { t: there.t, x: there.x });
    const E2 = Math.abs(backAgain.t - 1.3) < 1e-9 && Math.abs(backAgain.x + 0.7) < 1e-9;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const dt3 = 1e-6;
    const dx3 = 600;
    const v3 = bisect((v) => radar(v, c, { t: dt3, x: dx3 }).t - radar(v, c, { t: 0, x: 0 }).t, -0.99 * c, 0.99 * c);
    const p3 = agree(v3 / c, (c * c * dt3) / dx3 / c, 'p3', 1e-8);

    // p4
    const v4 = 0.8 * c;
    const gap = Math.abs(radar(v4, c, { t: 0, x: 900 }).t - radar(v4, c, { t: 0, x: 0 }).t);
    const p4 = agree(gap * 1e6, ((gamma(0.8) * v4 * 900) / (c * c)) * 1e6, 'p4');

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
