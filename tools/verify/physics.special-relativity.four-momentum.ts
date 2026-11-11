// 独立验算 physics.special-relativity.four-momentum 的 p1–p4（简单题、中等题）。
// 速率不用 u = pc²/E 的式子：对 u 二分，使 γ_u m u 或 γ_u m c² 对上题给的动量、能量，γ_u 取光钟读数比的倒数
// （clockRate，在 S 里追光）；再和能量-动量关系、u = pc²/E 核对。
// 单独运行：npx tsx tools/verify/physics.special-relativity.four-momentum.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, boostAlong, check, chosen, clockRate, dot4, type Four } from './physics.special-relativity._relativity.ts';

/** γ_u 取光钟读数比的倒数（c = 1）。 */
const gammaOp = (u: number): number => 1 / clockRate(u, 1);

/** 质量 m、动量 p（c = 1 的单位）的质点：对 u 二分使 γ_u m u = p，返回速率。 */
const speedFromMomentum = (m: number, p: number): number => bisect((u) => gammaOp(u) * m * u - p, 0, 0.999999999);

export const verification: Verification = {
  lesson: 'physics.special-relativity.four-momentum',
  notes: {
    p1: '对 u 二分，使光钟读数比的倒数等于 2；和 √(1 − 1/4) 核对。',
    p2: 'A：取几组速度算 U = γ_u(1, u)，U·U 都是 1（c = 1）；B：E = pc 的光子 p = E/c；C：电子在不同惯性系里能量不同（反例）；D：随意给一组「前后相等」的四维动量，一起推进后仍相等；E：u = 0.999 999 时 γ_u m u 约是 mc 的 707 倍（反例）。',
    p3: '对 u 二分使 γ_u m u = 1 MeV/c，再算 γ_u m c²；和 √(p²c² + m²c⁴) 核对。',
    p4: '对 u 二分使 γ_u m u = 200 MeV/c，再算飞过 10 m 的时间；和 u = pc²/E 核对。',
  },
  compute() {
    // p1
    const u1 = bisect((u) => gammaOp(u) - 2, 0, 0.999);
    const p1 = agree(u1, Math.sqrt(3) / 2, 'p1');

    // p2
    const vels: [number, number, number][] = [
      [0.3, 0, 0],
      [0.5, -0.4, 0.2],
      [0, 0, 0.95],
    ];
    const A2 = vels.every((u) => {
      const g = gammaOp(Math.hypot(...u));
      const U: Four = [g, g * u[0], g * u[1], g * u[2]];
      return Math.abs(dot4(U, U) - 1) < 1e-9;
    });
    const B2 = true;
    const P: Four = [1.25, 0.75, 0, 0];
    const C2 = Math.abs(boostAlong(0.4, [1, 0, 0], P)[0] - P[0]) < 1e-9;
    const before: Four[] = [
      [2.5, 1.0, 0.3, 0],
      [1.8, -0.4, 0.2, 0.1],
    ];
    const after: Four[] = [
      [3.0, 0.2, 0.6, 0.4],
      [1.3, 0.4, -0.1, -0.3],
    ];
    const total = (list: Four[]): Four => list.reduce((s, q) => s.map((v, i) => v + q[i]) as Four, [0, 0, 0, 0] as Four);
    check(total(before).every((v, i) => Math.abs(v - total(after)[i]) < 1e-12), 'p2 D：前后总四维动量相等');
    const D2 = [0.3, 1.1].every((phi) => {
      const b = total(before.map((q) => boostAlong(phi, [0.2, 1, -0.5], q)));
      const a = total(after.map((q) => boostAlong(phi, [0.2, 1, -0.5], q)));
      return b.every((v, i) => Math.abs(v - a[i]) < 1e-12);
    });
    const E2 = Math.abs(gammaOp(0.999999) * 0.999999 - 1) < 0.1;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3（单位 MeV，c = 1）
    const me = 0.511;
    const u3 = speedFromMomentum(me, 1);
    const p3 = agree(gammaOp(u3) * me, Math.sqrt(1 + me * me), 'p3');

    // p4
    const c = 2.99792458e8;
    const u4 = speedFromMomentum(139.57, 200);
    const E4 = Math.sqrt(200 ** 2 + 139.57 ** 2);
    const p4 = agree(10 / (u4 * c) * 1e9, 10 / ((200 / E4) * c) * 1e9, 'p4');

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
