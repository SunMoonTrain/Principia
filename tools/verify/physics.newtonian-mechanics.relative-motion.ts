// 独立验算 physics.newtonian-mechanics.relative-motion 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的伽利略变换 v = v′ + u；
// 二是不用解出来的式子：在地面参考系里把两个物体的位置随时间一步步算出来再相减，或者在船头方向上扫描、黄金分割找最小的漂移。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.relative-motion.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, check, chosen, deg, planar, rk4Until } from './physics.newtonian-mechanics._nm.ts';

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.relative-motion',
  notes: {
    p1: 't = 24/(0.75 + 1.25)；和积分核对：地面系里人的位置 = 扶梯上的位置 + 扶梯的位移，积分到 24 m。',
    p2: '逐条用例子：A 原点处静止的点，在以 ω = 1 转动的参考系里坐标是 (cos t, −sin t)，走圆周（对）；B S 里速度 (3, 4) 的匀速运动，换到以 (1, 2) 运动的 S′ 里加速度仍是零（对）；C 同向 20、15 m/s，慢车上看快车 5 m/s（错）；D 船速 3、水速 5，船头在 1°–179° 间每隔 1° 试，沿岸的合速度都向下游（对）；E 两质点在两个参考系里的距离都是 5（错）。',
    p3: '地面系里风速 = 相对船的风速 (10, 0) + 船速 (0, 10)；和逐时核对：一缕烟在船上看 t 时刻的位置加上船的位置，除以 t。',
    p4: '最短漂移 d√(u² − v²)/v；和数值核对：船头和上游方向的夹角在 0–180° 上黄金分割，积分到对岸算漂移。',
  },
  compute() {
    // p1（s）
    const formula1 = 24 / (0.75 + 1.25);
    const e1 = rk4Until(planar(() => [0, 0]), [0, 0, 0.75 + 1.25, 0], 0, 1e-3, 1e6, (_t, s) => s[0] - 24);
    const p1 = agree(e1.t, formula1, 'p1 时间', 1e-9);

    // p2
    const rot = (t: number) => [Math.cos(t) * 1 + Math.sin(t) * 0, -Math.sin(t) * 1 + Math.cos(t) * 0]; // 点 (1, 0) 在转动系里的坐标
    const radii = [0, 1, 2, 3].map((t) => Math.hypot(...rot(t)));
    const optA = radii.every((r) => Math.abs(r - 1) < 1e-12) && Math.abs(rot(1)[1] - rot(0)[1]) > 0.5;
    const posS = (t: number) => [3 * t, 4 * t];
    const posSp = (t: number) => [posS(t)[0] - 1 * t, posS(t)[1] - 2 * t];
    const accSp = (t: number) => [posSp(t + 1)[0] - 2 * posSp(t)[0] + posSp(t - 1)[0], posSp(t + 1)[1] - 2 * posSp(t)[1] + posSp(t - 1)[1]];
    const optB = Math.hypot(...accSp(2)) < 1e-12;
    const optC = Math.abs(20 - 15 - 35) < 1e-12;
    let allDown = true;
    for (let b = 1; b < 180; b++) if (5 + 3 * Math.cos(b * deg) <= 0) allDown = false; // 船头和下游方向成 b 时沿岸分速度
    const optD = allDown;
    const pA = [1, 2];
    const pB = [4, 6];
    const u = [7, -3];
    const t = 2.5;
    const dS = Math.hypot(pA[0] - pB[0], pA[1] - pB[1]);
    const dSp = Math.hypot(pA[0] - u[0] * t - (pB[0] - u[0] * t), pA[1] - u[1] * t - (pB[1] - u[1] * t));
    check(Math.abs(dS - 5) < 1e-12, 'E：距离 5');
    const optE = Math.abs(dS - dSp) > 1e-12;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（km/h）：x 向东，y 向北
    const formula3 = Math.hypot(10 + 0, 0 + 10);
    const smokeShip = (tt: number) => [10 * tt, 0];
    const ship = (tt: number) => [0, 10 * tt];
    const g3 = [(smokeShip(3)[0] + ship(3)[0]) / 3, (smokeShip(3)[1] + ship(3)[1]) / 3];
    const p3 = agree(Math.hypot(g3[0], g3[1]), formula3, 'p3 风相对地面的速度', 1e-12);

    // p4（m）：x 沿下游，y 指向对岸
    const d = 90;
    const uw = 5;
    const vb = 3;
    const formula4 = (d * Math.sqrt(uw * uw - vb * vb)) / vb;
    const drift = (a: number) => {
      // a：船头和上游方向的夹角（弧度）
      const vx = uw - vb * Math.cos(a);
      const vy = vb * Math.sin(a);
      return rk4Until(planar(() => [0, 0]), [0, 0, vx, vy], 0, 1e-2, 1e7, (_t, s) => s[1] - d).y[0];
    };
    const best = argmax((a) => -drift(a), 0.2, Math.PI - 0.2);
    const p4 = agree(drift(best), formula4, 'p4 最短漂移', 1e-8);

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
