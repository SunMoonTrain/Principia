// 独立验算 physics.newtonian-mechanics.angular-momentum-systems 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的做法（总角动量守恒、L = r_C × Mv_C + L′、对撞击时质心所在的点算角动量）；
// 二是不用角动量守恒：p1 对本体和两个重物分别用牛顿第二定律（重物沿光滑的杆滑，杆对重物只有垂直于杆的力，
// 反作用在本体上），积分到重物滑到 2.0 m；p3 用冲量：质量不计的刚性杆只能沿杆传力，垂直于杆的冲量只作用在被撞的
// 小球上，撞后两端的速度差除以杆长就是角速度；p4 用质心部分加相对质心部分。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.angular-momentum-systems.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, rk4, rk4Until } from './physics.newtonian-mechanics._nm.ts';

type P = { m: number; x: number; y: number; vx: number; vy: number };
/** 一组质点对点 (px, py) 的总角动量的 z 分量。 */
const Lz = (ps: P[], px: number, py: number) => ps.reduce((s, p) => s + p.m * ((p.x - px) * p.vy - (p.y - py) * p.vx), 0);

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.angular-momentum-systems',
  notes: {
    p1: '角动量守恒：(4.5 + 2×1.0×0.50²)×3.0 = (4.5 + 2×1.0×2.0²)ω；和牛顿第二定律的积分核对：重物 r″ = rΩ²，杆对重物的力 F = m(rΩ′ + 2r′Ω)，反作用在本体上 4.5Ω′ = −2rF，积到 r = 2.0 m。',
    p2: '逐条用例子：A 两个质点（1 kg、2 kg）之间只有弹簧力，积分 20 s，对 (0, 0)、(3, −2) 两点的总角动量都不变（对）；B 同一例子里质量 1 kg 的质点对 (0, 0) 的角动量变了（错）；C 总动量为零的三个质点，对 (3, −2) 和对质心的角动量相同（对）；D 两个小球用很硬的弹簧连成哑铃，一个大小不变、始终沿两球连线的力作用在一个球上，积分 5 s，对质心的角动量不变（对）；E 力偶 (0, 1) 作用在 (1, 0)、(0, −1) 作用在 (−1, 0)，合力为零、对原点的力矩之和为 2（错）。',
    p3: '对撞击时质心所在的点：1.0×5.0×0.32 = (3.0×0.32² + 2.0×0.48²)ω；和冲量做法核对：杆只沿杆传力，撞后油泥和被撞的小球共同速度 5.0×1.0/3.0，另一端速度为零，ω = (5/3)/0.80。',
    p4: '直接按定义 Σm(r − P) × v；和分解核对：r_C × Mv_C 加上对质心的角动量（两个质点的总动量为零，结果和参考点无关）。',
  },
  compute() {
    // p1（rad/s）
    const Ib = 4.5;
    const mw = 1.0;
    const sat = rk4Until(
      (_t, s) => {
        const [W, r, rd] = s;
        // 4.5Ω′ = −2rF，F = m(rΩ′ + 2r′Ω) ⇒ (4.5 + 2mr²)Ω′ = −4mrr′Ω
        const Wd = (-4 * mw * r * rd * W) / (Ib + 2 * mw * r * r);
        return [Wd, rd, r * W * W];
      },
      [3.0, 0.5, 0],
      0,
      1e-5,
      1e8,
      (_t, s) => s[1] - 2.0,
    );
    const p1 = agree(sat.y[0], ((Ib + 2 * mw * 0.25) * 3.0) / (Ib + 2 * mw * 4), 'p1 卫星的角速度', 1e-9);

    // p2
    // A、B：两个质点之间一根弹簧（原长 1、劲度 5），在平面里自由运动
    const spring = (_t: number, s: number[]): number[] => {
      const dx = s[4] - s[0];
      const dy = s[5] - s[1];
      const d = Math.hypot(dx, dy);
      const f = 5 * (d - 1); // 拉伸时互相拉近
      const fx = (f * dx) / d;
      const fy = (f * dy) / d;
      return [s[2], s[3], fx / 1, fy / 1, s[6], s[7], -fx / 2, -fy / 2];
    };
    const toP = (s: number[]): P[] => [
      { m: 1, x: s[0], y: s[1], vx: s[2], vy: s[3] },
      { m: 2, x: s[4], y: s[5], vx: s[6], vy: s[7] },
    ];
    const s0 = [0, 0, 0.3, 1.2, 1.5, 0.2, -0.4, 0.1];
    const s1 = rk4(spring, s0, 0, 20, 200000);
    const optA = [
      [0, 0],
      [3, -2],
    ].every(([px, py]) => Math.abs(Lz(toP(s1), px, py) - Lz(toP(s0), px, py)) < 1e-9);
    const single = (s: number[]) => Lz([toP(s)[0]], 0, 0);
    const optB = Math.abs(single(s1) - single(s0)) < 1e-9;
    // C：总动量为零的三个质点
    const ps: P[] = [
      { m: 1, x: 1, y: 2, vx: 2, vy: -1 },
      { m: 2, x: -1, y: 0, vx: -0.5, vy: 1 },
      { m: 1, x: 0, y: -3, vx: -1, vy: -1 },
    ];
    const Mt = 4;
    const xc = ps.reduce((s, p) => s + p.m * p.x, 0) / Mt;
    const yc = ps.reduce((s, p) => s + p.m * p.y, 0) / Mt;
    const optC = Math.abs(ps.reduce((s, p) => s + p.m * p.vx, 0)) < 1e-15 && Math.abs(ps.reduce((s, p) => s + p.m * p.vy, 0)) < 1e-15 && Math.abs(Lz(ps, 3, -2) - Lz(ps, xc, yc)) < 1e-12;
    // D：哑铃（1 kg、2 kg，很硬的弹簧，原长 1），大小 3、沿两球连线指向另一个球的力作用在 1 kg 的球上
    const dumbbell = (_t: number, s: number[]): number[] => {
      const dx = s[4] - s[0];
      const dy = s[5] - s[1];
      const d = Math.hypot(dx, dy);
      const f = 1e4 * (d - 1);
      const ux = dx / d;
      const uy = dy / d;
      return [s[2], s[3], (f * ux + 3 * ux) / 1, (f * uy + 3 * uy) / 1, s[6], s[7], (-f * ux) / 2, (-f * uy) / 2];
    };
    const Lcm = (s: number[]) => {
      const q = toP(s);
      const X = (q[0].x + 2 * q[1].x) / 3;
      const Y = (q[0].y + 2 * q[1].y) / 3;
      const VX = (q[0].vx + 2 * q[1].vx) / 3;
      const VY = (q[0].vy + 2 * q[1].vy) / 3;
      return q.reduce((sum, p) => sum + p.m * ((p.x - X) * (p.vy - VY) - (p.y - Y) * (p.vx - VX)), 0);
    };
    const d0 = [0, 0, 0, -2, 1, 0, 0, 1];
    const d1 = rk4(dumbbell, d0, 0, 5, 500000);
    const optD = Math.abs(Lcm(d1) - Lcm(d0)) < 1e-6 * Math.abs(Lcm(d0));
    // E：力偶
    const torque = 1 * 1 - 0 * 0 + ((-1) * -1 - 0 * 0);
    const optE = torque === 0;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（rad/s）
    const mb = 2.0;
    const mp = 1.0;
    const v0 = 5.0;
    const len = 0.8;
    const vStruck = (mp * v0) / (mp + mb); // 垂直于杆的冲量只作用在被撞的小球上
    const omegaImpulse = (vStruck - 0) / len;
    const xA = (mb * len) / (2 * mb + mp); // 质心到被撞那端的距离
    const omegaL = (mp * v0 * xA) / ((mb + mp) * xA * xA + mb * (len - xA) ** 2);
    const p3 = agree(omegaImpulse, omegaL, 'p3 绕质心转动的角速度', 1e-12);

    // p4（kg·m²/s）
    const two: P[] = [
      { m: 2, x: 1, y: 0, vx: 0, vy: 3 },
      { m: 1, x: -2, y: 0, vx: 0, vy: -6 },
    ];
    const M = 3;
    const XC = (2 * 1 + 1 * -2) / M;
    const YC = 0;
    const VXC = 0;
    const VYC = (2 * 3 + 1 * -6) / M;
    const decomposed = M * ((XC - 0) * VYC - (YC - 5) * VXC) + Lz(two, XC, YC);
    const p4 = agree(decomposed, Lz(two, 0, 5), 'p4 总角动量', 1e-12);

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
