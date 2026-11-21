// 独立验算 physics.general-relativity.equivalence-principle 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的做法：均匀场里匀加速运动的式子，加速参考系里加上惯性力 −m a₀；二是不用这些式子：
// 在惯性系（地面，或远离天体的太空）里把每个物体的运动方程交给四阶龙格-库塔法积分，用 rk4Until 在「着地」
// 「回到手里」「速度转到斜向下 45°」这类事件处二分出时刻。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.general-relativity.equivalence-principle.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, deg, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;

/**
 * 两球在竖直方向上从高 h 处同时由静止落下，加速度 a1、a2（向下）；积到球 1 着地，返回那时球 2 离地多高。
 * 状态 [y1, v1, y2, v2]，竖直向上为正。
 */
function heightOfBall2WhenBall1Lands(h: number, a1: number, a2: number): number {
  const land = rk4Until((_t, s) => [s[1], -a1, s[3], -a2], [h, 0, h, 0], 0, 1e-3, 1e8, (_t, s) => -s[0]);
  return land.y[2];
}

/**
 * 地面（惯性系）上看：手静止，小球以 v 竖直上抛、加速度 −g，积到小球回到手的高度，返回用的时间。
 * 先走一小步再开始找事件，免得出发那一刻就算「回到手里」。
 */
function returnTimeOnGround(v: number, gField: number): number {
  const dt = 1e-4;
  const back = rk4Until((_t, s) => [s[1], -gField], [v * dt - 0.5 * gField * dt * dt, v - gField * dt], dt, 1e-4, 1e8, (_t, s) => -s[0]);
  return back.t;
}

/**
 * 远离天体的惯性系里看：火箭（连同手）以 a 向上加速，抛出时火箭的速度取 V0（任取，结果应和它无关）；
 * 小球离手后不受力，速度是 V0 + v。积到小球回到手的高度，返回用的时间。状态 [手 y, 手 v, 球 y, 球 v]。
 */
function returnTimeInRocket(v: number, a: number, V0: number): number {
  const dt = 1e-4;
  const y0 = [V0 * dt + 0.5 * a * dt * dt, V0 + a * dt, (V0 + v) * dt, V0 + v];
  const back = rk4Until((_t, s) => [s[1], a, s[3], 0], y0, dt, 1e-4, 1e8, (_t, s) => s[0] - s[2]);
  return back.t;
}

export const verification: Verification = {
  lesson: 'physics.general-relativity.equivalence-principle',
  notes: {
    p1: '式子：球 1 着地用时 √(2h/a₁)，球 2 离地 h(a₁−a₂)/a₁（精确，不作线性近似）；和数值积分核对：a₁ 取 9.8、1.6 两种（结果应与 a₁ 无关），a₂ = a₁(1 − 2.0×10⁻⁶)，两球同时积分到球 1 着地，读球 2 的高度。',
    p2: '逐条用例子：A 铁球 1 kg、木球 0.1 kg，加速度都是 g，受的引力 m g 是 9.8 N 和 0.98 N（错）；B 引力按 m_引 × 场强、加速度按 F/m_惯，普通物体 m_引 = m_惯，比值 1.01 的材料加速度是普通物体的 1.01 倍（对）；C 指向同一个中心、大小都是 9.8 的两个矢量 (0,−9.8) 和 (9.8 sin30°, −9.8 cos30°) 不相等，按「各处 g 都相同」不均匀（错）；D 地面上积分舱和平抛小球，两者之差的加速度为零、相对速度保持抛出速度（对）；E 地面上竖直上抛 5.0 m/s 回到手里用时，和远离天体、以 9.8 向上加速的火箭里（惯性系中积分，火箭初速取 0、100 m/s）回到手里用时相同，都是 2v/g，说「不同」错。',
    p3: '式子：只受引力，水平速度不变，竖直速度由 +v sin45° 变到 −v sin45°，用时 2v sin45°/g；和数值积分核对：积分速度到 vx + vy 由正变为零（方向转到斜向下 45°）的时刻。',
    p4: '火箭里看：小球受惯性力，相对火箭以 6.0 m/s² 落向地板，t = √(2h/a)，水平距离 u t；和惯性系里的积分核对：火箭以 a 加速（初速取 0、50 m/s），小球离手后不受力、水平速度 u，积到小球的竖直位置和地板相遇，水平距离 u t。',
  },
  compute() {
    // p1（μm）
    const h1 = 20;
    const rel = 2.0e-6;
    const exact1 = h1 * rel;
    for (const a1 of [9.8, 1.6]) {
      agree(heightOfBall2WhenBall1Lands(h1, a1, a1 * (1 - rel)), exact1, `p1 球 2 离地的高度（a₁ = ${a1}）`, 1e-6);
    }
    const p1 = exact1 * 1e6;

    // p2
    const optA = 1 * g === 0.1 * g; // 加速度相同，受的引力 m g 并不相同
    const fieldStrength = g; // 由普通物体（m_引 = m_惯）定出的场强
    const accel = (mGrav: number, mInert: number) => (mGrav * fieldStrength) / mInert;
    const optB = Math.abs(accel(1.01, 1) / accel(1, 1) - 1.01) < 1e-12;
    const gA = [0, -g];
    const gB = [g * Math.sin(30 * deg), -g * Math.cos(30 * deg)];
    check(Math.abs(Math.hypot(gA[0], gA[1]) - Math.hypot(gB[0], gB[1])) < 1e-12, 'p2 C 两处大小相同');
    const optC = gA[0] === gB[0] && gA[1] === gB[1];
    // D：地面上看，舱和小球都只受引力；状态 [舱 x, 舱 y, 舱 vx, 舱 vy, 球 x, 球 y, 球 vx, 球 vy]
    const u = 2.0;
    const V = [0.5, -3.0];
    const sD = rk4Until(
      (_t, s) => [s[2], s[3], 0, -g, s[6], s[7], 0, -g],
      [0, 0, V[0], V[1], 0, 1, V[0] + u, V[1]],
      0,
      1e-3,
      1500,
      (t) => t - 1.2,
    );
    const relX = sD.y[4] - sD.y[0];
    const relY = sD.y[5] - sD.y[1];
    const relVx = sD.y[6] - sD.y[2];
    const relVy = sD.y[7] - sD.y[3];
    const optD = Math.abs(relVx - u) < 1e-9 && Math.abs(relVy) < 1e-9 && Math.abs(relX - u * sD.t) < 1e-9 && Math.abs(relY - 1) < 1e-9;
    const vE = 5.0;
    const tGround = returnTimeOnGround(vE, g);
    agree(tGround, (2 * vE) / g, 'p2 E 地面上回到手里的时间', 1e-8);
    const tRocket0 = returnTimeInRocket(vE, g, 0);
    const tRocket100 = returnTimeInRocket(vE, g, 100);
    agree(tRocket0, tRocket100, 'p2 E 火箭初速不同时回到手里的时间', 1e-8);
    const optE = Math.abs(tGround - tRocket0) > 1e-6 * tGround;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（s）
    const v3 = 180;
    const vx = v3 * Math.cos(45 * deg);
    const vy = v3 * Math.sin(45 * deg);
    const turn = rk4Until((_t, _s) => [0, -g], [vx, vy], 0, 1e-3, 1e8, (_t, s) => -(s[0] + s[1]));
    const p3 = agree(turn.t, (2 * v3 * Math.sin(45 * deg)) / g, 'p3 失重持续的时间', 1e-9);

    // p4（m）
    const a4 = 6.0;
    const h4 = 1.2;
    const u4 = 3.0;
    const byFrame = u4 * Math.sqrt((2 * h4) / a4);
    for (const V0 of [0, 50]) {
      // 状态 [地板 y, 地板 v, 球 x, 球 y, 球 vx, 球 vy]；惯性系里地板以 a 加速，小球离手后不受力
      const hit = rk4Until((_t, s) => [s[1], a4, s[4], s[5], 0, 0], [0, V0, 0, h4, u4, V0], 0, 1e-4, 1e8, (_t, s) => s[0] - s[3]);
      agree(hit.y[2], byFrame, `p4 落点离正下方的距离（火箭初速 ${V0}）`, 1e-8);
    }
    const p4 = byFrame;

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
