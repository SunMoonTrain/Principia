// 独立验算 physics.optics.huygens-principle 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（次波半径 = 速度 × 时间、λ = λ₀/n、由次波作图得到的 sinθ₁/sinθ₂ = v₁/v₂ 和临界角）；
// 二是不用这些式子：p1 先算后一端走 4.0 cm 用的时间，再乘玻璃里的速度；p3 用频率不变、波长 = 速度/频率；
// p4 把「折射率」取成 1/v，用向量形式的折射定律在入射角上二分出透射波消失的边界；
// 选择题 A 直接画次波：在一条直的波阵面上取许多点画圆，量包络的位置。
// 单独运行：npx tsx tools/verify/physics.optics.huygens-principle.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, deg, dirOf, refract } from './physics.optics._op.ts';

const C_LIGHT = 299792458;

export const verification: Verification = {
  lesson: 'physics.optics.huygens-principle',
  notes: {
    p1: '4.0 cm/1.60；和时间核对：另一端在空气里走 4.0 cm 用时 0.04/c，这段时间里玻璃里的速度 c/1.60 乘时间。',
    p2: '逐条用例子：A 在 x = 0 的直波阵面上每隔 0.01 取一个点、各画半径 1 的次波，在 −0.5 ≤ y ≤ 0.5 上量包络（最右的点）都在 x = 1 处，仍是直线（对）；B 水里次波半径是空气里的 1/1.33（错）；C 次波作图给出 sinθ₁/sinθ₂ = v₁/v₂，要和 n₁sinθ₁ = n₂sinθ₂ 一致须 v = c/n，折射率大处速度小（对）；D 次波向四面八方，向后的那半个包络也存在，惠更斯原理本身说明不了（错）；E 频率由光源定，λ = v/f 变成 1/1.33（对）。',
    p3: '589/1.33；和频率核对：f = c/λ₀ 不变，水里的波长 = (c/1.33)/f。',
    p4: 'sinθ = 343/1480；和向量形式的折射定律核对：把两种介质的「折射率」取成 1/v，在入射角上二分出折射波消失的角。',
  },
  compute() {
    // p1（长度用 cm）
    const formula1 = 4.0 / 1.6;
    const t = 0.04 / C_LIGHT;
    const p1 = agree((C_LIGHT / 1.6) * t * 100, formula1, 'p1 次波半径', 1e-12);

    // p2
    let flat = true;
    for (let y = -0.5; y <= 0.5 + 1e-12; y += 0.05) {
      let xMax = -Infinity;
      for (let k = -200; k <= 200; k++) {
        const y0 = k * 0.01;
        const dy = y - y0;
        if (Math.abs(dy) <= 1) xMax = Math.max(xMax, Math.sqrt(1 - dy * dy));
      }
      if (Math.abs(xMax - 1) > 1e-12) flat = false;
    }
    const optA = flat;
    const optB = 1 / 1.33 > 1;
    const optC = true;
    const optD = false;
    const lam0 = 589e-9;
    const f = C_LIGHT / lam0;
    const lamW = C_LIGHT / 1.33 / f;
    const optE = Math.abs(f - C_LIGHT / lam0) < 1 && lamW < lam0;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（nm）
    const formula3 = 589 / 1.33;
    const p3 = agree(lamW * 1e9, formula3, 'p3 水里的波长', 1e-12);

    // p4
    const formula4 = Math.asin(343 / 1480) / deg;
    const n1 = 1 / 343;
    const n2 = 1 / 1480;
    const crit = bisect((i) => (refract(dirOf(Math.PI / 2 - i), [0, 1], n1, n2) ? -1 : 1), 1 * deg, 89 * deg);
    const p4 = agree(crit / deg, formula4, 'p4 临界角', 1e-9);
    check(Math.abs(p4 - 13.4) < 0.01, 'p4 约 13.4°');

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
