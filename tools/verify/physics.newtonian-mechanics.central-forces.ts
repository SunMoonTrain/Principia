// 独立验算 physics.newtonian-mechanics.central-forces 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（有效势的最低点 r₀ = L²/(mk)、两个转折点的和 −k/E）；二是不用这些式子：
// p1、p4 用数值求导找有效势的最低点，p4 再积分弹簧力下的轨道，二分出转过四分之一圈后到 O 的距离不变的半径；
// p3 用平方反比引力积分轨道，从近地点转过半圈量到远地点（_nm.ts 的 keplerHalf）。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.central-forces.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, bisectN, check, chosen, deriv, keplerHalf, planar, rk4, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const GM = 6.67e-11 * 5.97e24;

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.central-forces',
  notes: {
    p1: 'r₀ = (L/m)²/(GM)；和数值核对：每千克的有效势 −GM/r + (L/m)²/(2r²) 数值求导，二分出导数为零的 r。',
    p2: '逐条用例子（m = k = 1）：A 近心点处力的大小 k/r² 不为零（错）；B、C 取 L = 1、E = −0.4 和 −0.3，二分出 U_eff = E 的两个根：E 大的近心点 0.613 < 0.691、远心点 2.72 > 1.81（B 错、C 对），再用轨道积分核对远心点；D 积分一条轨道，E 和 L 在 200 个时刻都不变（对）；E L = 1、2 时有效势最低点 1、4（对）。',
    p3: 'r_近 + r_远 = GM/(−E/m)；和轨道积分核对：从近地点出发转过半圈，那里径向速度为零，量出的距离就是远地点。',
    p4: 'r⁴ = L²/(mk)；和数值核对：有效势 kr²/2 + L²/(2mr²) 数值求导二分出最低点；再积分弹簧力下的轨道，二分出转过 90° 后到 O 的距离仍等于出发时的半径。',
  },
  compute() {
    // p1（m）
    const h1 = 5.3e10;
    const Ueff1 = (r: number) => -GM / r + (h1 * h1) / (2 * r * r);
    const r1 = bisect((r) => deriv(Ueff1, r, r * 1e-6), 1e6, 1e8);
    const p1 = agree(r1, (h1 * h1) / GM, 'p1 圆轨道的半径', 1e-7);

    // p2（m = k = 1）
    const Ueff = (L: number) => (r: number) => -1 / r + (L * L) / (2 * r * r);
    const roots = (L: number, E: number) => {
      const r0 = L * L;
      return [bisect((r) => Ueff(L)(r) - E, 1e-3, r0), bisect((r) => Ueff(L)(r) - E, r0, 1e4)];
    };
    const [p40, a40] = roots(1, -0.4);
    const [p30, a30] = roots(1, -0.3);
    check(Math.abs(keplerHalf(1, p30, 1 / p30).r - a30) < 1e-9, 'p2 轨道积分的远心点和 U_eff = E 的根一致');
    const optA = 1 / (p30 * p30) === 0;
    const optB = a30 < a40;
    const optC = p30 < p40;
    // D：积分一条轨道（从 (1, 0) 以 (0, 1.2) 出发），检查 E、L 不变
    let s = [1, 0, 0, 1.2];
    const rhs = planar((_t, x, y) => {
      const r3 = Math.hypot(x, y) ** 3;
      return [-x / r3, -y / r3];
    });
    const EL = (y: number[]) => [0.5 * (y[2] ** 2 + y[3] ** 2) - 1 / Math.hypot(y[0], y[1]), y[0] * y[3] - y[1] * y[2]];
    const [E0, L0] = EL(s);
    let optD = true;
    for (let i = 0; i < 200; i++) {
      s = rk4(rhs, s, 0.1 * i, 0.1 * (i + 1), 200);
      const [E, L] = EL(s);
      if (Math.abs(E - E0) > 1e-9 || Math.abs(L - L0) > 1e-9) optD = false;
    }
    const rMin = (L: number) => bisect((r) => deriv(Ueff(L), r, r * 1e-6), 0.01, 100);
    const optE = rMin(2) > rMin(1);
    check(Math.abs(rMin(1) - 1) < 1e-6 && Math.abs(rMin(2) - 4) < 1e-6, 'p2 E 的最低点');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m）
    const rp = 6.6e6;
    const vp = 8.4e3;
    const half = keplerHalf(GM, rp, vp);
    check(Math.abs(half.vr) < 1e-6 * vp, 'p3 转过半圈处径向速度为零，是远地点');
    const E3 = 0.5 * vp * vp - GM / rp;
    const p3 = agree(half.r, GM / -E3 - rp, 'p3 远地点', 1e-9);

    // p4（m）
    const m = 0.5;
    const k = 2.0;
    const L = 0.36;
    const Ueff4 = (r: number) => 0.5 * k * r * r + (L * L) / (2 * m * r * r);
    const r4a = bisect((r) => deriv(Ueff4, r, r * 1e-6), 0.1, 2);
    const quarter = (r: number) => {
      const e = rk4Until(planar((_t, x, y) => [(-k / m) * x, (-k / m) * y]), [r, 0, 0, L / (m * r)], 0, 1e-4, 1e7, (_t, y) => -y[0]);
      return e.y[1] - r;
    };
    const r4b = bisectN(quarter, 0.3, 1.0, 50);
    agree(r4b, r4a, 'p4 两种数值做法', 1e-7);
    const p4 = agree(r4a, ((L * L) / (m * k)) ** 0.25, 'p4 圆周运动的半径', 1e-7);

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
