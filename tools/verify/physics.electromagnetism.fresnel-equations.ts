// 独立验算 physics.electromagnetism.fresnel-equations 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（斯涅耳定律、菲涅耳公式 r_s、r_p，垂直入射 R = ((n − 1)/(n + 1))²）；
// 二是不用这些式子：p1 用费马原理，对界面上的通过点做黄金分割搜索，使光程最短；
// p3、p4 直接解界面条件：E、H 的切向分量连续（不显磁性，H ∝ n·E），对 s、p 两种偏振各列一个二元线性方程组求反射振幅。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.fresnel-equations.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, check, chosen, solveLinear } from './physics.electromagnetism._es.ts';

const deg = Math.PI / 180;

/** 由界面条件解反射率（n₁ = 1，n₂ = n，入射角 θ）：s 偏振 E 垂直入射面，p 偏振 E 在入射面里。 */
function reflectance(n: number, th: number): { Rs: number; Rp: number } {
  const ci = Math.cos(th);
  const st = Math.sin(th) / n;
  const ct = Math.sqrt(1 - st * st);
  // s：E 切向 1 + r = t；H 切向 ∝ cosθ·n·E：ci(1 − r) = n·ct·t
  const [rs] = solveLinear([[1, -1], [ci, n * ct]], [-1, ci]);
  // p：H 垂直入射面、切向连续 1 − r = n·t（取反射波的 H 和入射同向时 r 为正）；E 切向 ci(1 + r) = ct·t
  const [rp] = solveLinear([[1, n], [ci, -ct]], [1, -ci]);
  return { Rs: rs * rs, Rp: rp * rp };
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.fresnel-equations',
  notes: {
    p1: 'sinθ_t = sin45°/1.33；和费马原理核对：A(0, 1) 在空气里、B(2, −1) 在水里，对通过点 x 求光程 √(x² + 1) + 1.33√((2 − x)² + 1) 的最小值，再由 x 求折射角（B 的位置按这个角调好，见脚本）。',
    p2: '逐条用例子：A 界面条件对所有时刻成立，频率相同（对）；B n > 1 时 sinθ_t < sinθ_i（对）；C 垂直入射时由界面条件解出 R_s = R_p（错）；D n = 1.5 时 R_s 在 0°–89° 每隔 1° 都比前一个大（对）；E 从空气射向水不会全反射（错）。',
    p3: 'R = ((n − 1)/(n + 1))²；和界面条件核对：垂直入射，1 + r = t、1 − r = n·t 解线性方程组。',
    p4: 'R_s、R_p 用菲涅耳公式；和界面条件核对：s、p 各列切向 E、H 连续的二元方程组，解出 r 再平方。',
  },
  compute() {
    // p1：费马原理。先让 B 的位置正好使折射角是答案附近的值无关紧要——直接对一条从 A 到界面再到很远处的光线求最短光程。
    const n1 = 1.33;
    const th1 = 45 * deg;
    // A 在 (0, 1)，入射点在原点时入射角 45°：取 A = (−1, 1)。B 在水里 (X, −Y)；对给定的 B，最短光程的通过点 x* 满足斯涅耳定律。
    // 把 B 放得很远（Y = 1），对 X 二分，使通过点正好在原点；这时折射角就是 atan(X/Y)。
    const crossing = (X: number) => argmax((x) => -(Math.hypot(x + 1, 1) + n1 * Math.hypot(X - x, 1)), -1, X);
    let lo = 0;
    let hi = 5;
    for (let i = 0; i < 80; i++) {
      const mid = (lo + hi) / 2;
      if (crossing(mid) > 0) hi = mid;
      else lo = mid;
    }
    const thT = Math.atan((lo + hi) / 2) / deg;
    const p1 = agree(thT, Math.asin(Math.sin(th1) / n1) / deg, 'p1', 1e-6);

    // p2
    const A = true;
    const B = Math.asin(Math.sin(30 * deg) / 1.33) < 30 * deg;
    const r0 = reflectance(1.5, 0);
    const C = Math.abs(r0.Rs - r0.Rp) > 1e-12;
    let mono = true;
    for (let a = 1; a < 90; a++) if (reflectance(1.5, a * deg).Rs <= reflectance(1.5, (a - 1) * deg).Rs) mono = false;
    const D = mono;
    const E = false;
    check(B && !C && D, 'p2');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const n3 = 2.42;
    const p3 = agree(reflectance(n3, 0).Rs * 100, ((n3 - 1) / (n3 + 1)) ** 2 * 100, 'p3', 1e-9);

    // p4
    const n4 = 1.5;
    const th = 60 * deg;
    const tt = Math.asin(Math.sin(th) / n4);
    const rsF = (Math.cos(th) - n4 * Math.cos(tt)) / (Math.cos(th) + n4 * Math.cos(tt));
    const rpF = (n4 * Math.cos(th) - Math.cos(tt)) / (n4 * Math.cos(th) + Math.cos(tt));
    const R4 = reflectance(n4, th);
    const s4 = agree(R4.Rs * 100, rsF * rsF * 100, 'p4 s 偏振', 1e-9);
    const q4 = agree(R4.Rp * 100, rpF * rpF * 100, 'p4 p 偏振', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [s4, q4] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
