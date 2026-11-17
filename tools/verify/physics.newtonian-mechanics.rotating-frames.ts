// 独立验算 physics.newtonian-mechanics.rotating-frames 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的做法：在转动参考系里加上离心力 −mω×(ω×r′) 和科里奥利力 −2mω×v′；
// 二是不用惯性力：在地面这个惯性系里，由质点的轨迹数值求两次导数得到加速度，再用牛顿第二定律。
// 选择题按分量算叉积，用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.rotating-frames.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, chosen, cross, norm, scale, type V3 } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;

/** 平面轨迹 p(t) 在 t 处的加速度（中心差分求两次导数）。 */
const accel = (p: (t: number) => [number, number], t: number, h = 1e-4): [number, number] => {
  const a = p(t - h);
  const b = p(t);
  const c = p(t + h);
  return [(a[0] - 2 * b[0] + c[0]) / (h * h), (a[1] - 2 * b[1] + c[1]) / (h * h)];
};
const coriolis = (m: number, w: V3, v: V3) => scale(-2 * m, cross(w, v));
/**
 * 惯性系里的另一种算法（m = 1）：物体在转动参考系里从 (x0, y0) 以不变的 v′ 做匀速直线运动，惯性系里的轨迹是
 * 把 (x0 + v′ₓt, y0 + v′ᵧt) 转过 ωt；数值求出它在 t = 0 的加速度 a。转动参考系里 a′ = 0，真实的力 a 和两个惯性力平衡，
 * 所以离心力加科里奥利力 = −a。v′ = 0 时只剩离心力；再减去离心力就是科里奥利力。
 */
const inertialForces = (w: number, x0: number, y0: number, vx: number, vy: number): [number, number] => {
  const a = accel((t) => {
    const x = x0 + vx * t;
    const y = y0 + vy * t;
    return [x * Math.cos(w * t) - y * Math.sin(w * t), x * Math.sin(w * t) + y * Math.cos(w * t)];
  }, 0);
  return [-a[0], -a[1]];
};
const centrifugalNum = (w: number, x0: number, y0: number) => inertialForces(w, x0, y0, 0, 0);
const coriolisNum = (w: number, x0: number, y0: number, vx: number, vy: number): [number, number] => {
  const all = inertialForces(w, x0, y0, vx, vy);
  const cf = centrifugalNum(w, x0, y0);
  return [all[0] - cf[0], all[1] - cf[1]];
};

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.rotating-frames',
  notes: {
    p1: '转动参考系里离心力 mω²R = mg，T = 2π√(R/g)；和惯性系核对：人沿半径 50 m 的圆以 ω 转，数值求轨迹的加速度，二分出它等于 g 的 ω。',
    p2: '逐条用例子（ω = 1 逆时针，m = 1）：物体在转盘上做匀速直线运动，数值求它在惯性系里的加速度，反推出离心力、科里奥利力（和叉积核对）。A 同一个 v′ = (0, 1) 在离轴 1 和 3 处，科里奥利力都是 2（错）；B 在 (1, 0) 处以 v′ = (−1, 0) 向中心运动，科里奥利力 (0, 2)，和前进方向的右边 v′ × ẑ 同向（对）；C 离轴 1、2 处的离心力 1、2（对）；D ω = 1、2 时离心力 1、4（错）；E v′ ⊥ 转轴、速率 1 和 3 时科里奥利力 2、6（对）。',
    p3: '槽壁的力和科里奥利力平衡，2mωv′；和惯性系核对：小珠沿槽的距离 s(t) = s₀cosh ωt + (v′/ω)sinh ωt，数值求 p(t) = s(t)(cos ωt, sin ωt) 的加速度：沿槽的分量为零（槽光滑），垂直于槽的分量乘 m 就是槽壁的力。',
    p4: '转动参考系里 k(L − L₀) = mω²L；和惯性系核对：小球沿半径 L 的圆转，数值求加速度，二分出弹簧力等于 m|a| 的 L。',
  },
  compute() {
    // p1（s）
    const R1 = 50;
    const w1 = bisect((w) => Math.hypot(...accel((t) => [R1 * Math.cos(w * t), R1 * Math.sin(w * t)], 0.3)) - g, 0.1, 2);
    const p1 = agree((2 * Math.PI) / w1, 2 * Math.PI * Math.sqrt(R1 / g), 'p1 转一圈的时间', 1e-6);

    // p2（ω = 1 逆时针，m = 1；数值做法和叉积互相核对）
    const w: V3 = [0, 0, 1];
    const len = (v: [number, number]) => Math.hypot(v[0], v[1]);
    const near = (a: number, b: number) => Math.abs(a - b) < 1e-5 * Math.max(1, Math.abs(b));
    // A：同一个 v′ = (0, 1)，离轴 1 和 3
    const cA1 = coriolisNum(1, 1, 0, 0, 1);
    const cA3 = coriolisNum(1, 3, 0, 0, 1);
    if (!near(len(cA1), norm(coriolis(1, w, [0, 1, 0])))) throw new Error('p2 两种算法的科里奥利力不一致');
    const optA = len(cA3) > len(cA1) * (1 + 1e-4);
    // B：在 (1, 0) 处以 v′ = (−1, 0) 向中心运动；前进方向的右边是 v′ × ẑ
    const fB = coriolisNum(1, 1, 0, -1, 0);
    const right = cross([-1, 0, 0], [0, 0, 1]);
    const optB = fB[0] * right[0] + fB[1] * right[1] > 0 && Math.abs(fB[0] * right[1] - fB[1] * right[0]) < 1e-5;
    // C、D：相对转盘静止，只有离心力
    const optC = near(len(centrifugalNum(1, 2, 0)) / len(centrifugalNum(1, 1, 0)), 2);
    const optD = near(len(centrifugalNum(2, 1, 0)) / len(centrifugalNum(1, 1, 0)), 2);
    // E：v′ ⊥ 转轴，速率 1 和 3
    const optE = near(len(coriolisNum(1, 1, 0, 0, 3)) / len(cA1), 3);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（N）
    const m3 = 0.2;
    const w3 = 3.0;
    const vrel = 0.4;
    const s0 = 0.1;
    const s = (t: number) => s0 * Math.cosh(w3 * t) + (vrel / w3) * Math.sinh(w3 * t);
    const pos = (t: number): [number, number] => [s(t) * Math.cos(w3 * t), s(t) * Math.sin(w3 * t)];
    const a3 = accel(pos, 0, 1e-4);
    const along = a3[0]; // t = 0 时槽沿 x 轴
    const across = a3[1];
    if (Math.abs(along) > 1e-5) throw new Error('p3 沿槽的加速度应为零');
    const p3 = agree(m3 * Math.abs(across), 2 * m3 * w3 * vrel, 'p3 槽壁的水平作用力', 1e-6);

    // p4（m）
    const k = 50;
    const L0 = 0.2;
    const m4 = 0.5;
    const w4 = 4.0;
    const L = bisect((x) => k * (x - L0) - m4 * Math.hypot(...accel((t) => [x * Math.cos(w4 * t), x * Math.sin(w4 * t)], 0.1)), L0, 1);
    const p4 = agree(L, (k * L0) / (k - m4 * w4 * w4), 'p4 弹簧的长度', 1e-6);

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
