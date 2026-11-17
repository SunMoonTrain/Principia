// 独立验算 physics.newtonian-mechanics.angular-momentum 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（τ = rF sinφ、角动量守恒 r₁v₁ = r₂v₂）；
// 二是不用这些式子：按分量算叉积；p3 用有心力（平方反比）积分彗星的轨道，从近日点积到远日点（径向速度变号）量速率；
// p4 用「力乘力臂」，力臂由点到作用线的距离算。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.angular-momentum.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, cross, deg, norm, planar, rk4Until, sub, type V3 } from './physics.newtonian-mechanics._nm.ts';

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.angular-momentum',
  notes: {
    p1: 'τ = rF sin30°；和叉积核对：r = (0.30, 0, 0)，F = 60(cos30°, sin30°, 0)。',
    p2: '逐条用例子：A 沿过 O 的直线运动的质点 L = 0 却在动（错）；B 过 O 的 5 N 力，力矩为零（错）；C ω = 2 的匀速圆周运动，三个时刻的 L 都是 (0, 0, 2m)（对）；D 同一个力对两个点的力矩 (0, 0, 2)、(0, 0, −4)（错）；E 合力为零的三个力 (1, 2, 0)、(−3, 1, 2)、(2, −3, −2)（不是力偶），对 5 个点的力矩之和都是 (−3, 0, −6)（对）。',
    p3: 'v₂ = r₁v₁/r₂；和轨道积分核对：取能让远日点正好 30 AU 的 GM（由能量相等算），从近日点以 50 km/s 积分到径向速度变号，量那里的距离和速率。',
    p4: '|(r − Q) × F|；和「力乘力臂」核对：力臂是 Q 到过 r、沿 z 方向的作用线的距离。',
  },
  compute() {
    // p1
    const formula1 = 0.3 * 60 * Math.sin(30 * deg);
    const p1 = agree(norm(cross([0.3, 0, 0], [60 * Math.cos(30 * deg), 60 * Math.sin(30 * deg), 0])), formula1, 'p1 力矩', 1e-12);

    // p2
    const L = (r: V3, v: V3) => cross(r, v);
    const optA = norm(L([2, 0, 0], [3, 0, 0])) < 1e-12 && norm([3, 0, 0]) === 0;
    const FB: V3 = [5 / Math.SQRT2, 5 / Math.SQRT2, 0]; // 作用在 (1, 1, 0)、沿 OP 方向的 5 N 力
    const optB = norm(cross([1, 1, 0], FB)) < 1e-12 && norm(FB) === 0;
    const Lc = [0, 0.7, 1.9].map((t) => L([Math.cos(2 * t), Math.sin(2 * t), 0], [-2 * Math.sin(2 * t), 2 * Math.cos(2 * t), 0]));
    const optC = Lc.every((l) => Math.abs(l[2] - 2) < 1e-12 && Math.abs(l[0]) < 1e-12);
    const F: V3 = [0, 2, 0];
    const tau1 = cross(sub([1, 0, 0], [0, 0, 0]), F);
    const tau2 = cross(sub([1, 0, 0], [3, 0, 0]), F);
    check(Math.abs(tau1[2] - 2) < 1e-12 && Math.abs(tau2[2] + 4) < 1e-12, 'D：(0, 0, 2) 和 (0, 0, −4)');
    const optD = norm(sub(tau1, tau2)) < 1e-12;
    // E：合力为零的三个力（不是力偶，也不共面），对 5 个参考点算力矩之和
    const forces: [V3, V3][] = [[[0, 0, 0], [1, 2, 0]], [[1, -1, 0], [-3, 1, 2]], [[0, 2, 1], [2, -3, -2]]];
    check(norm(forces.reduce<V3>((s, [, f]) => [s[0] + f[0], s[1] + f[1], s[2] + f[2]], [0, 0, 0])) < 1e-12, 'E 的三个力合力为零');
    const pts: V3[] = [[0, 0, 0], [1, 2, 0], [-3, 5, 1], [7, -2, 4], [0.5, 0.5, -2]];
    const torqueSum = (O: V3): V3 => forces.reduce<V3>((s, [p, f]) => { const t = cross(sub(p, O), f); return [s[0] + t[0], s[1] + t[1], s[2] + t[2]]; }, [0, 0, 0]);
    check(norm(sub(torqueSum([0, 0, 0]), [-3, 0, -6])) < 1e-12, 'E：对原点的力矩之和 (−3, 0, −6)');
    const optE = pts.every((O) => norm(sub(torqueSum(O), torqueSum(pts[0]))) < 1e-12);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（km/s）：长度以 AU、速度以 km/s 为单位，时间单位随之
    const rp = 0.6;
    const vp = 50;
    const ra = 30;
    const formula3 = (rp * vp) / ra;
    const GM = (vp * vp - formula3 * formula3) / (2 * (1 / rp - 1 / ra)); // 只用来让轨道的远日点在 30 AU 附近
    const f3 = planar((_t, x, y) => { const r = Math.hypot(x, y); return [(-GM * x) / r ** 3, (-GM * y) / r ** 3]; });
    const aph = rk4Until(f3, [rp, 0, 0, vp], 0, 1e-5, 1e8, (_t, s) => -(s[0] * s[2] + s[1] * s[3])); // 径向速度由正变负
    const rAph = Math.hypot(aph.y[0], aph.y[1]);
    check(Math.abs(rAph - ra) < 1e-4, 'p3 积分出的远日点在 30 AU');
    const p3 = agree(Math.hypot(aph.y[2], aph.y[3]), formula3, 'p3 远日点速率', 1e-5);

    // p4（N·m）
    const r4: V3 = [3, 0, 0];
    const Q: V3 = [1, 2, 0];
    const F4: V3 = [0, 0, 5];
    const formula4 = norm(cross(sub(r4, Q), F4));
    const arm = Math.hypot(r4[0] - Q[0], r4[1] - Q[1]); // 作用线沿 z，过 (3, 0)
    const p4 = agree(5 * arm, formula4, 'p4 力矩', 1e-12);

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
