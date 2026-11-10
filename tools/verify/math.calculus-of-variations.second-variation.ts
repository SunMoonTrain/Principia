// 独立验算 math.calculus-of-variations.second-variation 的 p1–p4（简单题、中等题）。
// 第二变分按讲解的定义取 δ²J = Φ″(0)，Φ(ε) = J[y + εη]。一是直接把 Φ(ε) 积分出来、对 ε 数值求二阶导数；
// 二是按 ∫(F_yy η² + 2F_yy′ ηη′ + F_y′y′ η′²) 的式子算，三个二阶偏导数都数值地求。勒让德条件的选择题在网格上数值求 F_y′y′，
// 判为不满足的选项再从一个 F_y′y′ < 0 的点数值地积分出一条极值曲线，确认反例真的在某条极值曲线上。
// 单独运行：npx tsx tools/verify/math.calculus-of-variations.second-variation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import {
  agree,
  bisect,
  chosen,
  derivative,
  eulerLagrangeAccel,
  extremalFlow,
  integrate,
  integrateTo,
  secondDerivative,
  type Integrand,
} from './math.calculus-of-variations._variational.ts';

type Fn = (x: number) => number;

/** J[y] = ∫_a^b F(x, y, y′)，y′ 数值地求。 */
const functional = (F: Integrand, a: number, b: number) => (y: Fn): number => integrate((x) => F(x, y(x), derivative(y, x)), a, b, 64);

/** 二阶偏导数：F 对第 i、j 个变量（0 = x，1 = y，2 = p）。 */
function partial2(F: Integrand, i: number, j: number, v: [number, number, number], h = 1e-3): number {
  const at = (di: number, dj: number): number => {
    const w: [number, number, number] = [...v];
    w[i] += di;
    w[j] += dj;
    return F(...w);
  };
  return (at(h, h) - at(h, -h) - at(-h, h) + at(-h, -h)) / (4 * h * h);
}

/** 第二变分的两种算法：Φ″(0) 数值求；按二阶偏导数的式子积分。返回 [前者, 后者]。 */
function secondVariation(F: Integrand, a: number, b: number, y: Fn, eta: Fn): [number, number] {
  const J = functional(F, a, b);
  const phi = (e: number): number => J((x) => y(x) + e * eta(x));
  const direct = secondDerivative(phi, 0, 2e-2);
  const viaPartials = integrate((x) => {
    const v: [number, number, number] = [x, y(x), derivative(y, x)];
    const e = eta(x);
    const ep = derivative(eta, x);
    return partial2(F, 1, 1, v) * e * e + 2 * partial2(F, 1, 2, v) * e * ep + partial2(F, 2, 2, v) * ep * ep;
  }, a, b, 64);
  return [direct, viaPartials];
}

export const verification: Verification = {
  lesson: 'math.calculus-of-variations.second-variation',
  notes: {
    p1: '一是把 Φ(ε) = J[εη] 积分出来，对 ε 数值求二阶导数；二是按 ∫(F_yy η² + 2F_yy′ηη′ + F_y′y′η′²) 积分，偏导数数值地求。两者核对；和 2·⅓ + 4·1/30 = 4/5 核对。',
    p2: '在 x、y、p ∈ [−2, 2] 的网格上数值求 F_y′y′：A、B、E 处处 ≥ 0；C 处处是 −6，D 在 p < 0 时为负。C、D 再从 F_y′y′ < 0 的点出发按数值的欧拉-拉格朗日方程积分一小段，确认那里真有一条极值曲线（C 是抛物线 y″ = −1/6，D 是斜率为负的直线），勒让德条件在它上面不成立。',
    p3: '对给定的 b 数值积分 ∫(η′² − 4η²)（J 是二次的，J[εη] = ε² 乘它），二分求变号的 b；和 π/2 核对。',
    p4: '同 p1 的两种算法（Φ(ε) = ∫e^{1 + επcosπx}dx 数值求二阶导数；F_y′y′ 数值求后积分）；和 eπ²/2 核对。',
  },
  compute() {
    // p1
    const [d1, f1] = secondVariation((_x, y, p) => p * p + 2 * y * y, 0, 1, () => 0, (x) => x * (1 - x));
    const p1 = agree(agree(d1, f1, 'p1 两种算法', 1e-6), 4 / 5, 'p1 δ²J');

    // p2
    const options: Integrand[] = [
      (x, _y, p) => x * x * Math.sqrt(1 + p * p),
      (x, y, p) => p * p + x * y * p,
      (_x, y, p) => y - 3 * p * p,
      (_x, _y, p) => p ** 3,
      (_x, _y, p) => (1 + p * p) ** 1.5,
    ];
    const grid = [-2, -1.3, -0.6, 0, 0.6, 1.3, 2];
    const p2 = chosen(
      options.map((F) => {
        let worst: [number, number, number] | null = null;
        let min = Infinity;
        for (const x of grid) for (const y of grid) for (const p of grid) {
          const v = partial2(F, 2, 2, [x, y, p]);
          if (v < min) [min, worst] = [v, [x, y, p]];
        }
        if (min >= -1e-6) return true;
        // 反例：从 F_y′y′ < 0 的点出发积分一小段极值曲线，沿途 F_y′y′ 仍为负、方程的余项为零
        const [x0, y0, p0] = worst!;
        const end = integrateTo(extremalFlow(F), [y0, p0, 0], x0, x0 + 0.2, 1e-3);
        const residual = Math.abs(eulerLagrangeAccel(F, x0 + 0.2, end[0], end[1]) - secondDerivative((t) => integrateTo(extremalFlow(F), [y0, p0, 0], x0, t, 1e-3)[0], x0 + 0.2, 1e-2));
        if (residual > 1e-5 || partial2(F, 2, 2, [x0 + 0.2, end[0], end[1]]) >= 0) throw new Error('p2 反例不成立');
        return false;
      }),
    );

    // p3
    const q = (b: number): number =>
      integrate((x) => (Math.PI / b) ** 2 * Math.cos((Math.PI * x) / b) ** 2 - 4 * Math.sin((Math.PI * x) / b) ** 2, 0, b, 64);
    const p3 = agree(bisect(q, 0.5, 3), Math.PI / 2, 'p3 临界的 b');

    // p4
    const [d4, f4] = secondVariation((_x, _y, p) => Math.exp(p), 0, 1, (x) => x, (x) => Math.sin(Math.PI * x));
    const p4 = agree(agree(d4, f4, 'p4 两种算法', 1e-6), (Math.E * Math.PI * Math.PI) / 2, 'p4 δ²J');

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
