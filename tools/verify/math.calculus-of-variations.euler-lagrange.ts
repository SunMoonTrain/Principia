// 独立验算 math.calculus-of-variations.euler-lagrange 的 p1–p4（简单题、中等题）。
// 两种算法：一是把泛函离散成节点值的二次函数，直接求驻点（不用欧拉-拉格朗日方程），N 和 2N 做理查森外推；
// 二是由被积函数数值地写出欧拉-拉格朗日方程，用 RK4 打靶。两者先互相核对，再和手推的结果核对。
// 单独运行：npx tsx tools/verify/math.calculus-of-variations.euler-lagrange.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import {
  agree,
  bisect,
  derivative,
  discreteExtremal,
  discretize,
  extremalFlow,
  integrate,
  integrateTo,
  quadraticStationary,
  richardson,
  type Integrand,
} from './math.calculus-of-variations._variational.ts';

/** 打靶：从 (a, ya) 出发、初始斜率 s，积分到 b 时 y(b) = yb，二分出 s。 */
const findSlope = (F: Integrand, a: number, ya: number, b: number, yb: number): number =>
  bisect((s) => integrateTo(extremalFlow(F), [ya, s, 0], a, b, 1e-3)[0] - yb, -50, 50);

/** 从 (a, ya)、斜率 s 出发积分到 x，返回 [y, y′, ∫F]。 */
const shootTo = (F: Integrand, a: number, ya: number, s: number, x: number): Float64Array =>
  integrateTo(extremalFlow(F), [ya, s, 0], a, x, 1e-3);

/** 两端给定时极值曲线在 x 处的值：离散求驻点、打靶两种算法。 */
function bothWays(F: Integrand, a: number, ya: number, b: number, yb: number, x: number): [number, number] {
  const discrete = discreteExtremal(F, a, b, 40, ya, yb)(x);
  const shot = shootTo(F, a, ya, findSlope(F, a, ya, b, yb), x)[0];
  return [discrete, shot];
}

export const verification: Verification = {
  lesson: 'math.calculus-of-variations.euler-lagrange',
  notes: {
    p1: '一是把 J 离散成节点值的二次函数直接求驻点（40 段、80 段外推）；二是由 F 数值地写出欧拉-拉格朗日方程打靶。读出 x = ½ 处的值，两者核对；和 y = x²/2 + 3x/2 核对。',
    p2: '对 J[y + εη] 数值积分，再对 ε 在 0 处数值求导；和 ∫2y′η′ dx 手算的 −2/3 核对。',
    p3: '一是离散求驻点，算出最小的 J（40 段、80 段外推）；二是打靶得到极值曲线，同时沿它积分出 J。两者核对；和 y = ln x、J = 1 核对。',
    p4: '同 p1 的两种算法；和 y = x³/3 + 2x/3 核对。',
  },
  compute() {
    // p1：F = y′² + 2y，y(0) = 0、y(1) = 2
    const F1: Integrand = (_x, y, p) => p * p + 2 * y;
    const [d1, s1] = bothWays(F1, 0, 0, 1, 2, 0.5);
    const p1 = agree(agree(d1, s1, 'p1 两种算法'), 1 / 8 + 3 / 4, 'p1 y(½)');

    // p2：J = ∫ y′²，y = x²，η = x(1 − x)
    const J2 = (eps: number): number => integrate((x) => derivative((s) => s * s + eps * s * (1 - s), x) ** 2, 0, 1);
    const p2 = agree(derivative(J2, 0), integrate((x) => 2 * (2 * x) * (1 - 2 * x), 0, 1), 'p2 δJ');

    // p3：F = x y′²，y(1) = 0、y(e) = 1
    const F3: Integrand = (x, _y, p) => x * p * p;
    const Jmin = (N: number): number => {
      const d = discretize(F3, 1, Math.E, N, 0, 1);
      return d.J(quadraticStationary(d.J, d.count));
    };
    const discreteJ = richardson(Jmin(40), Jmin(80));
    const slope3 = findSlope(F3, 1, 0, Math.E, 1);
    const shotJ = shootTo(F3, 1, 0, slope3, Math.E)[2];
    if (Math.abs(shootTo(F3, 1, 0, slope3, 2)[0] - Math.log(2)) > 1e-8) throw new Error('p3 极值曲线不是 ln x');
    const p3 = agree(agree(discreteJ, shotJ, 'p3 两种算法', 1e-6), 1, 'p3 J');

    // p4：F = y′² + 2yy′ + 4xy，y(0) = 0、y(1) = 1
    const F4: Integrand = (x, y, p) => p * p + 2 * y * p + 4 * x * y;
    const [d4, s4] = bothWays(F4, 0, 0, 1, 1, 0.5);
    const p4 = agree(agree(d4, s4, 'p4 两种算法'), 1 / 24 + 1 / 3, 'p4 y(½)');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
