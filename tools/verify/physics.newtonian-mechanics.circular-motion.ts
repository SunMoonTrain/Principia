// 独立验算 physics.newtonian-mechanics.circular-motion 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（a = ω²r，a_t = rα，a_n = v²/r）；
// 二是不用这些式子：写出位置 r(cosθ(t), sinθ(t))，对时间数值求导两次得到速度、加速度矢量，直接量大小和夹角；
// p3 在时间上二分出加速度和速度成 45° 的时刻。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.circular-motion.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, deg } from './physics.newtonian-mechanics._nm.ts';

/** 半径 R、转角 θ(t) 的圆周运动：返回 t 时刻的速度、加速度矢量（中心差分）。 */
function kin(R: number, theta: (t: number) => number, t: number, h = 1e-4) {
  const p = (s: number) => [R * Math.cos(theta(s)), R * Math.sin(theta(s))];
  const [a, b, c] = [p(t - h), p(t), p(t + h)];
  const v = [(c[0] - a[0]) / (2 * h), (c[1] - a[1]) / (2 * h)];
  const acc = [(c[0] - 2 * b[0] + a[0]) / (h * h), (c[1] - 2 * b[1] + a[1]) / (h * h)];
  return { v, a: acc, r: b };
}
const angle = (u: number[], w: number[]) => Math.acos((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(w[0], w[1]))) / deg;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.circular-motion',
  notes: {
    p1: 'a = ω²r，ω = 2π × 20 rad/s；和数值核对：对 0.2(cos ωt, sin ωt) 数值求导两次量加速度的大小。',
    p2: '逐条用例子（数值求导）：A ω = 2 的匀速圆周运动，t = 0 和 0.5 s 的加速度矢量不同（错）；B 速度和半径方向的夹角是 90°（错）；C ω = 3 不变时 d|v|/dt = 0（对）；D θ = 2t − 0.3t²（减速），加速度和速度的夹角大于 90°，不沿半径（错）；E θ = t³（t = 0 时速率为零），法向加速度 v²/r = 0 时速率正是零（对）。',
    p3: 'α²t² = α，t = 1/√α；和数值核对：θ = αt²/2，二分出加速度和速度夹角为 45° 的时刻。',
    p4: 'a_t = −3、a_n = 20²/80，夹角 180° − arctan(5/3)；和数值核对：沿 R = 80 m 的圆以 s = 20t − 1.5t² 运动，在 t = 0 处量夹角。',
  },
  compute() {
    // p1
    const w1 = 2 * Math.PI * 20;
    const formula1 = w1 * w1 * 0.2;
    const k1 = kin(0.2, (t) => w1 * t, 0.37, 1e-6);
    const p1 = agree(Math.hypot(k1.a[0], k1.a[1]), formula1, 'p1 向心加速度', 1e-4);

    // p2
    const aA0 = kin(1, (t) => 2 * t, 0).a;
    const aA1 = kin(1, (t) => 2 * t, 0.5).a;
    const optA = Math.hypot(aA0[0] - aA1[0], aA0[1] - aA1[1]) < 1e-6;
    const kB = kin(1, (t) => 2 * t, 0.3);
    const optB = Math.abs(angle(kB.v, kB.r)) < 1e-3;
    const speed = (t: number) => { const k = kin(2, (s) => 3 * s, t); return Math.hypot(k.v[0], k.v[1]); };
    const optC = Math.abs((speed(0.51) - speed(0.49)) / 0.02) < 1e-4;
    const kD = kin(1.5, (t) => 2 * t - 0.3 * t * t, 1);
    const angD = angle(kD.a, kD.v);
    check(angD > 90.5, 'D：减速时加速度偏向后方');
    const radialD = angle(kD.a, [-kD.r[0], -kD.r[1]]);
    const optD = radialD < 1e-3;
    const kE = kin(1, (t) => t ** 3, 0, 1e-3);
    const vE = Math.hypot(kE.v[0], kE.v[1]);
    const optE = vE < 1e-5; // 法向加速度 v²/r = 0 ⇔ 速率为零（这个例子正是那一刻）
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（s）
    const alpha = 2;
    const formula3 = 1 / Math.sqrt(alpha);
    const ang3 = (t: number) => { const k = kin(1, (s) => (alpha * s * s) / 2, t); return angle(k.a, k.v); };
    const p3 = agree(bisect((t) => ang3(t) - 45, 0.2, 2), formula3, 'p3 时间', 1e-5);

    // p4（度）
    const formula4 = 180 - Math.atan2(20 ** 2 / 80, 3) / deg;
    const k4 = kin(80, (t) => (20 * t - 1.5 * t * t) / 80, 0, 1e-3);
    const p4 = agree(angle(k4.a, k4.v), formula4, 'p4 加速度和速度的夹角', 1e-5);

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
