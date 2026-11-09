// 独立验算 physics.analytical-mechanics.phase-space-liouville 的 p1–p4（简单题、中等题）。
// 相轨道和相流都用 RK4 数值地积分：面积用 ∮p dq（挂在状态上一起积分）或鞋带公式，
// 「保持面积」看相流的雅可比行列式（对初值做中心差分），周长把边界上的点逐个积分过去再量；再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.phase-space-liouville.ts

import { fileURLToPath } from 'node:url';
import type { Derivative } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, integrateTo, random } from './physics.analytical-mechanics._mech.ts';
import {
  canonical,
  flowJacobianDet,
  onePeriod,
  polygonPerimeter,
  withIntegral,
} from './physics.analytical-mechanics._hamilton.ts';

const rnd = random(1838);

/** 方程组 q̇ = a(q, p, t)、ṗ = b(q, p, t)。 */
const field =
  (a: (q: number, p: number, t: number) => number, b: (q: number, p: number, t: number) => number): Derivative =>
  (t, y, out) => {
    out[0] = a(y[0], y[1], t);
    out[1] = b(y[0], y[1], t);
  };

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.phase-space-liouville',
  notes: {
    p1: '从同一条轨道（能量取 (1, 0) 处的值）上 q = 0 的点出发，按正则方程（偏导数数值求）积分一个周期，同时积分 p q̇，得到 ∮p dq；和椭圆面积 π·1·2 核对。',
    p2: '每个方程组在 4 个随机初值（D 还取不同的出发时刻）上把相流积分 1.5，对初值中心差分求雅可比行列式，等于 1 才保持面积：A、C、D 是 1，B 是 e^{−0.3}。',
    p3: '直接积分 q̇ = p/m、ṗ = −kq − γp/m 到 t = 4，雅可比行列式乘 A₀；和 A₀e^{−γt/m} 核对。',
    p4: '按 H = qp 的正则方程（偏导数数值求）把正方形边界上 400 个点各自积分到 ln 2，量折线的周长；和 [2, 4] × [1/2, 1] 的周长核对。',
  },
  compute() {
    // p1：H = p²/2 + 2q²，相点 (1, 0)；改从同一条轨道上 q = 0、p = 2 的点出发，好用「q 回到 0」定周期
    const H1 = (q: number[], p: number[]): number => p[0] ** 2 / 2 + 2 * q[0] ** 2;
    const start = [0, Math.sqrt(2 * H1([1], [0]))];
    const f1 = withIntegral(canonical(H1), 1, (_q, p, _t, qd) => p[0] * qd[0]);
    const per = onePeriod(f1, [...start, 0], 0, 1e-3, 100);
    const p1 = agree(Math.abs(per.y[2]), 2 * Math.PI, 'p1 面积');

    // p2：雅可比行列式
    const systems: Derivative[] = [
      field((_q, p) => p, (q) => -q),
      field((_q, p) => p, (q, p) => -q - 0.2 * p),
      field((q) => q, (_q, p) => -p),
      field((_q, p) => p, (q, _p, t) => -Math.sin(q) + 0.5 * Math.cos(t)),
    ];
    const preserves = (f: Derivative): boolean =>
      Array.from({ length: 4 }, () => {
        const t0 = 3 * rnd();
        const det = flowJacobianDet(f, [2 * rnd() - 1, 2 * rnd() - 1], t0, t0 + 1.5, 1e-3);
        return Math.abs(det - 1) < 1e-6;
      }).every(Boolean);
    const p2 = chosen(systems.map(preserves));

    // p3：m = 2、k = 8、γ = 1，t = 4
    const damped = field((_q, p) => p / 2, (q, p) => -8 * q - (1 * p) / 2);
    const p3 = agree(0.01 * flowJacobianDet(damped, [0.3, -0.2], 0, 4, 1e-3), 0.01 * Math.exp(-2), 'p3 面积');

    // p4：H = qp，正方形 [1, 2] × [1, 2] 的边界逐点积分到 ln 2
    const f4 = canonical((q, p) => q[0] * p[0]);
    const boundary: number[][] = [];
    const n = 100;
    for (let i = 0; i < n; i++) boundary.push([1 + i / n, 1]);
    for (let i = 0; i < n; i++) boundary.push([2, 1 + i / n]);
    for (let i = 0; i < n; i++) boundary.push([2 - i / n, 2]);
    for (let i = 0; i < n; i++) boundary.push([1, 2 - i / n]);
    const image = boundary.map((y0) => Array.from(integrateTo(f4, y0, 0, Math.LN2, 1e-3)));
    const p4 = agree(polygonPerimeter(image), 2 * (2 + 0.5), 'p4 周长');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
