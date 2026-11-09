// 独立验算 math.calculus-of-variations.natural-boundary-conditions 的 p1–p4（简单题、中等题）。
// 端点自由的问题，离散以后把那一端的值也当作未知数，直接求驻点：自然边界条件、横截条件都不事先写进去，
// 由「取极值」自己产生。另一种算法按数值的欧拉-拉格朗日方程打靶，或在端点所在的曲线上做一元极小。
// 单独运行：npx tsx tools/verify/math.calculus-of-variations.natural-boundary-conditions.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import {
  agree,
  bisect,
  chosen,
  derivative,
  discreteExtremal,
  discretize,
  extremalFlow,
  goldenMin,
  integrateTo,
  quadraticStationary,
  type Integrand,
} from './math.calculus-of-variations._variational.ts';

export const verification: Verification = {
  lesson: 'math.calculus-of-variations.natural-boundary-conditions',
  notes: {
    p1: '一是离散时把 y(2) 也当作未知数，直接求驻点（40 段、80 段外推）；二是打靶，初始斜率由「F 对 y′ 的偏导数在 x = 2 处为零」二分出。两者核对；和 y = x³/6 − 2x、y(2) = −8/3 核对。',
    p2: '取 a = 0、b = 1、y(0) = 1，右端自由，离散求驻点（400 段），在右端用二阶单侧差分估计 y′(1)，把四个选项的左边都算一遍：只有 C 接近 0（小于 10⁻⁴），其余都在 0.1 以上。',
    p3: '一是对终点在抛物线上的位置 t 做一元极小（距离的平方，黄金分割）；二是二分解「连线和抛物线的切线垂直」。两者核对；和 t = √(3/2) 核对。',
    p4: '两层极小：对给定的终点横坐标 x_b，离散求两端固定的极小（20 段；F 只含 y′，离散的极小正好是直线，段数不影响结果）；再对 x_b 做黄金分割。和斜率 √2 − 1 的直线、J = 2√2 − 2 核对。',
  },
  compute() {
    // p1：F = y′² + 2xy，y(0) = 0，y(2) 自由
    const F1: Integrand = (x, y, p) => p * p + 2 * x * y;
    const discrete1 = discreteExtremal(F1, 0, 2, 40, 0, null)(2);
    const Fp = (F: Integrand, s: Float64Array, x: number): number => derivative((e) => F(x, s[0], s[1] + e), 0);
    const end1 = (slope: number): Float64Array => integrateTo(extremalFlow(F1), [0, slope, 0], 0, 2, 1e-3);
    const shot1 = end1(bisect((s) => Fp(F1, end1(s), 2), -10, 10))[0];
    const p1 = agree(agree(discrete1, shot1, 'p1 两种算法'), 8 / 6 - 4, 'p1 y(2)');

    // p2：F = y′² + yy′ + y²，a = 0、b = 1、y(0) = 1，右端自由
    const F2: Integrand = (_x, y, p) => p * p + y * p + y * y;
    const N2 = 400;
    const d2 = discretize(F2, 0, 1, N2, 1, null);
    const y2 = d2.nodes(quadraticStationary(d2.J, d2.count));
    const yb = y2[N2];
    const ypb = (3 * y2[N2] - 4 * y2[N2 - 1] + y2[N2 - 2]) / (2 * d2.h);
    const candidates = [ypb, yb, 2 * ypb + yb, ypb + 2 * yb];
    if (candidates.some((v) => Math.abs(v) > 1e-4 && Math.abs(v) < 0.1)) throw new Error(`p2 分不清：${candidates.join(', ')}`);
    const p2 = chosen(candidates.map((v) => Math.abs(v) < 1e-4));

    // p3：从 (0, 2) 到抛物线 y = x²
    const dist2 = (t: number): number => t * t + (t * t - 2) ** 2;
    const tMin = goldenMin(dist2, 0.1, 3);
    const tPerp = bisect((t) => (t - 0) * 1 + (t * t - 2) * (2 * t), 0.5, 3);
    const p3 = agree(agree(tMin, tPerp, 'p3 两种算法', 1e-7), Math.sqrt(1.5), 'p3 x_b');

    // p4：从 (0, 0) 到直线 y = 1 − x，F = 1 + y′²
    const F4: Integrand = (_x, _y, p) => 1 + p * p;
    const inner = (xb: number): number => {
      const d = discretize(F4, 0, xb, 20, 0, 1 - xb);
      return d.J(quadraticStationary(d.J, d.count));
    };
    const xb = goldenMin(inner, 0.05, 1.5);
    const p4 = agree(inner(xb), 2 * Math.SQRT2 - 2, 'p4 最小值', 1e-7);
    if (Math.abs((1 - xb) / xb - (Math.SQRT2 - 1)) > 1e-5) throw new Error('p4 最优直线的斜率不是 √2 − 1');

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
