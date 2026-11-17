// 独立验算 physics.newtonian-mechanics.momentum-conservation 的 p1–p4（简单题、中等题）。
// 两套算法：一是质心的定义、动量守恒的式子；二是不用守恒式：p1 先求两个质点的质心再和第三个合并，
// p3、p4 把爆炸、发射时一对等大反向的内力随时间的变化交给四阶龙格-库塔法积分，从模拟里读出另一块的速度。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.momentum-conservation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, rk4, solveLinear } from './physics.newtonian-mechanics._nm.ts';

/** 两块碎片：一对等大反向的内力 (Ax, Ay)·sin(πt/τ)，积分后返回两块的速度 [vx1, vy1, vx2, vy2]。 */
function explode(m1: number, m2: number, v0: [number, number], Ax: number, Ay: number): number[] {
  const tau = 1e-3;
  const rhs = (t: number, _s: number[]): number[] => {
    const f = Math.sin((Math.PI * t) / tau);
    return [(Ax * f) / m1, (Ay * f) / m1, (-Ax * f) / m2, (-Ay * f) / m2];
  };
  return rk4(rhs, [v0[0], v0[1], v0[0], v0[1]], 0, tau, 2000);
}

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.momentum-conservation',
  notes: {
    p1: 'r_C = Σmᵢrᵢ/M = (4/3, 3/2)，|r_C| = √(16/9 + 9/4)；和分组核对：先求 1 kg、2 kg 两球的质心，3 kg 的放在它和第三个球之间按质量反比分点。',
    p2: '逐条用例子：A 两球之间的弹簧力随便多大，模拟前后总动量都不变（对）；B 1 kg 以 0、3 kg 以 4 m/s 运动，质心速度 3 m/s，不是平均值 2 m/s（错）；C 两球动量改变 −4、+4（对）；D 两球以 1、3 m/s 同向匀速，总动量守恒，质心以 2 m/s 运动（错）；E 四个质点分两组，两组质心再求质心，和直接求的一样（对）。',
    p3: '另一块的速度 = (3.0 × (4, 0) − 1.0 × (0, 6))/2.0 = (6, −3)，速率 √45；和模拟核对：一对内力 (Ax, Ay)·sin(πt/τ)，解出让 1 kg 那块变成 (0, 6) 的 Ax、Ay，读出 2 kg 那块的速度。',
    p4: '水平方向动量守恒：2000v = 10 × 600 cos60°；和模拟核对：水平方向一对内力，二分出让炮弹的水平速度达到 300 m/s 的力，读出炮车的速度。',
  },
  compute() {
    // p1（m）
    const ms = [1, 2, 3];
    const xs = [0, 4, 0];
    const ys = [0, 0, 3];
    const M = ms[0] + ms[1] + ms[2];
    const cx = (ms[0] * xs[0] + ms[1] * xs[1] + ms[2] * xs[2]) / M;
    const cy = (ms[0] * ys[0] + ms[1] * ys[1] + ms[2] * ys[2]) / M;
    const m12 = ms[0] + ms[1];
    const c12x = xs[0] + (ms[1] / m12) * (xs[1] - xs[0]);
    const c12y = ys[0] + (ms[1] / m12) * (ys[1] - ys[0]);
    const gx = c12x + (ms[2] / M) * (xs[2] - c12x);
    const gy = c12y + (ms[2] / M) * (ys[2] - c12y);
    const p1 = agree(Math.hypot(gx, gy), Math.hypot(cx, cy), 'p1 质心到原点的距离', 1e-12);

    // p2
    const s = explode(1, 2, [0, 0], 37, -11);
    const optA = Math.abs(1 * s[0] + 2 * s[2]) < 1e-9 && Math.abs(1 * s[1] + 2 * s[3]) < 1e-9;
    const vC = (1 * 0 + 3 * 4) / 4;
    const optB = Math.abs(vC - (0 + 4) / 2) < 1e-12;
    const optC = Math.abs(-4 + 4) < 1e-12; // 两球的动量改变 −4、+4
    const vC2 = (1 * 1 + 1 * 3) / 2;
    const optD = vC2 === 0;
    const pm = [1, 2, 3, 4];
    const px = [0, 1, 5, -2];
    const all = (pm[0] * px[0] + pm[1] * px[1] + pm[2] * px[2] + pm[3] * px[3]) / 10;
    const gA = (pm[0] * px[0] + pm[1] * px[1]) / 3;
    const gB = (pm[2] * px[2] + pm[3] * px[3]) / 7;
    const optE = Math.abs((3 * gA + 7 * gB) / 10 - all) < 1e-12;
    check(!optB && !optD, 'B、D 的反例成立');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m/s）
    const ex = explode(1, 2, [4, 0], 1, 0);
    const ey = explode(1, 2, [4, 0], 0, 1);
    // 1 kg 那块的末速度对 (Ax, Ay) 是线性的：解出让它变成 (0, 6) 的力
    const [Ax, Ay] = solveLinear(
      [
        [ex[0] - 4, ey[0] - 4],
        [ex[1], ey[1]],
      ],
      [0 - 4, 6],
    );
    const e3 = explode(1, 2, [4, 0], Ax, Ay);
    check(Math.abs(e3[0]) < 1e-9 && Math.abs(e3[1] - 6) < 1e-9, 'p3 1 kg 那块是 (0, 6)');
    const formula3 = Math.hypot((3 * 4 - 0) / 2, (0 - 6) / 2);
    const p3 = agree(Math.hypot(e3[2], e3[3]), formula3, 'p3 另一块的速率', 1e-9);

    // p4（m/s）
    const mShell = 10;
    const mGun = 2000;
    const vx = (A: number) => explodeX(mShell, mGun, A);
    const A4 = bisect((a) => vx(a)[0] - 600 * Math.cos(Math.PI / 3), 0, 1e7);
    const formula4 = (mShell * 600 * Math.cos(Math.PI / 3)) / mGun;
    const p4 = agree(-vx(A4)[1], formula4, 'p4 炮车后退的速度', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

/** 一维：一对等大反向的内力 A·sin(πt/τ)，两者原来静止，返回 [炮弹的速度, 炮车的速度]。 */
function explodeX(m1: number, m2: number, A: number): number[] {
  const tau = 1e-2;
  return rk4((t) => {
    const f = A * Math.sin((Math.PI * t) / tau);
    return [f / m1, -f / m2];
  }, [0, 0], 0, tau, 2000);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
