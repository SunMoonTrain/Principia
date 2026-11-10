// 独立验算 math.calculus-of-variations.direct-methods 的 p1–p4（简单题、中等题）。
// 里茨近似一是把 J 在 y = Σc_iφ_i 上数值积分、直接对系数求极小（一元时黄金分割，多元时求二次函数的驻点）；
// 二是用多项式精确积分写出方程组 A c = b 再解。关于里茨方法的说法，在 p1 的泛函上用 1、2、3 个基函数实际算一遍，
// 再和离散成节点值的完整问题（不用欧拉-拉格朗日方程）比较。
// 单独运行：npx tsx tools/verify/math.calculus-of-variations.direct-methods.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import {
  agree,
  chosen,
  derivative,
  discretize,
  goldenMin,
  integrate,
  polyAdd,
  polyDer,
  polyInt01,
  polyMul,
  polyScale,
  quadraticStationary,
  richardson,
  secondDerivative,
  solve,
  type Integrand,
  type Vec,
} from './math.calculus-of-variations._variational.ts';

type Fn = (x: number) => number;

/** J[y] = ∫_0^1 F(x, y, y′)，y′ 数值求。 */
const J = (F: Integrand) => (y: Fn): number => integrate((x) => F(x, y(x), derivative(y, x)), 0, 1, 64);

/** 在 Σc_iφ_i 里求 J 的极小（J 是 c 的二次函数）：返回 [系数, 极小值]。 */
function ritzNumeric(F: Integrand, basis: Fn[]): [Vec, number] {
  const shape = (c: Vec): Fn => (x) => basis.reduce((s, phi, i) => s + c[i] * phi(x), 0);
  const Jc = (c: Vec): number => J(F)(shape(c));
  const c = quadraticStationary(Jc, basis.length);
  return [c, Jc(c)];
}

/** 完整问题离散成节点值（N 段、2N 段外推）的极小值。 */
function fullMinimum(F: Integrand, N: number): number {
  const value = (n: number): number => {
    const d = discretize(F, 0, 1, n, 0, 0);
    return d.J(quadraticStationary(d.J, d.count));
  };
  return richardson(value(N), value(2 * N));
}

export const verification: Verification = {
  lesson: 'math.calculus-of-variations.direct-methods',
  notes: {
    p1: '一是对 J(c) = J[c·x(1 − x)]（数值积分）黄金分割求极小；二是 c = ∫xφ/∫φ′²，两个积分按多项式精确算（1/12 ÷ 1/3）。两者核对；和 1/4 核对。',
    p2: '在 p1 的泛函上实际算：1、2、3 个基函数 x(1 − x)·x^k 的里茨值依次不增，都不小于完整问题离散后的极小值（A、B 对）；一项近似 x(1 − x)/4 的 y″ = −1/2 ≠ −x，不满足方程（C 错）；∫y′²、y(0) = 0、y(1) = 1 在 y = x 处取到 1，任意扰动都不更小（D 错）；三项近似的 J(c) 对 c 的梯度的二阶差分为零，即梯度是 c 的一次函数（E 对）。',
    p3: '一是在 c₁φ₁ + c₂φ₂ 上数值积分 J、求二次函数的驻点；二是多项式精确积分写出 2 × 2 方程组再解。两者核对；和 −1/45 核对（两个基函数正好张出精确解 (x − x³)/6，所以它也等于完整问题离散后外推的极小值，一并核过）。',
    p4: '同 p1 的两种算法（∫(1 + x)φ′² = 1/2，∫φ = 1/6，极小值 −b²/A）；和 −1/18 核对。',
  },
  compute() {
    const F1: Integrand = (x, y, p) => p * p - 2 * x * y;
    const phi: Fn = (x) => x * (1 - x);
    const phiPoly: Vec = [0, 1, -1];

    // p1
    const cGolden = goldenMin((c) => J(F1)((x) => c * phi(x)), -2, 2);
    const cExact = polyInt01(polyMul([0, 1], phiPoly)) / polyInt01(polyMul(polyDer(phiPoly), polyDer(phiPoly)));
    const p1 = agree(agree(cGolden, cExact, 'p1 两种算法', 1e-6), 1 / 4, 'p1 c');

    // p2
    const basis = [0, 1, 2].map((k) => (x: number) => x * (1 - x) * x ** k);
    const ritzValues = [1, 2, 3].map((n) => ritzNumeric(F1, basis.slice(0, n))[1]);
    const full = fullMinimum(F1, 64);
    const A2 = ritzValues.every((v) => v >= full - 1e-9);
    const B2 = ritzValues.every((v, i) => i === 0 || v <= ritzValues[i - 1] + 1e-12);
    const oneTerm: Fn = (x) => phi(x) * ritzNumeric(F1, basis.slice(0, 1))[0][0];
    const C2 = [0.2, 0.5, 0.8].every((x) => Math.abs(secondDerivative(oneTerm, x) + x) < 1e-6);
    const Jd = J((_x, _y, p) => p * p);
    const perturbations: Fn[] = [(x) => Math.sin(Math.PI * x), (x) => x * (1 - x) * (x - 0.3), (x) => Math.sin(3 * Math.PI * x) * x];
    const attained = Math.abs(Jd((x) => x) - 1) < 1e-9 && perturbations.every((eta) => [0.3, -0.05, 0.01].every((e) => Jd((x) => x + e * eta(x)) > 1));
    const D2 = !attained;
    const Jc3 = (c: Vec): number => J(F1)((x) => basis.reduce((s, b, i) => s + c[i] * b(x), 0));
    const grad = (c: Vec): Vec => c.map((_, i) => (Jc3(c.map((v, k) => (k === i ? v + 1 : v))) - Jc3(c.map((v, k) => (k === i ? v - 1 : v)))) / 2);
    const g0 = grad([0.1, -0.2, 0.3]);
    const g1 = grad([0.6, 0.1, -0.4]);
    const g2 = grad([1.1, 0.4, -1.1]);
    const E2 = g0.every((v, i) => Math.abs(v - 2 * g1[i] + g2[i]) < 1e-9);
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const [, ritz3] = ritzNumeric(F1, [phi, (x) => x * x * (1 - x)]);
    const polys: Vec[] = [phiPoly, [0, 0, 1, -1]];
    const Aex = polys.map((pi) => polys.map((pj) => polyInt01(polyMul(polyDer(pi), polyDer(pj)))));
    const bex = polys.map((pi) => polyInt01(polyMul([0, 1], pi)));
    const cex = solve(Aex, bex);
    const yPoly = polyAdd(polyScale(polys[0], cex[0]), polyScale(polys[1], cex[1]));
    const exact3 = polyInt01(polyMul(polyDer(yPoly), polyDer(yPoly))) - 2 * polyInt01(polyMul([0, 1], yPoly));
    const p3 = agree(agree(ritz3, exact3, 'p3 两种算法', 1e-6), -1 / 45, 'p3 里茨极小值');
    agree(fullMinimum(F1, 64), p3, 'p3 和完整问题', 1e-6);

    // p4
    const F4: Integrand = (x, y, p) => (1 + x) * p * p - 2 * y;
    const J4 = (c: number): number => J(F4)((x) => c * phi(x));
    const viaGolden = J4(goldenMin(J4, -2, 2));
    const A4 = polyInt01(polyMul([1, 1], polyMul(polyDer(phiPoly), polyDer(phiPoly))));
    const b4 = polyInt01(phiPoly);
    const p4 = agree(agree(viaGolden, -(b4 * b4) / A4, 'p4 两种算法', 1e-6), -1 / 18, 'p4 极小值');

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
