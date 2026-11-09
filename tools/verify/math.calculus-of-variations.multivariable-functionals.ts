// 独立验算 math.calculus-of-variations.multivariable-functionals 的 p1–p4（简单题、中等题）。
// 偏导数、拉普拉斯算子都数值地求；二重积分用高斯-勒让德公式。最后一题不用欧拉-拉格朗日方程：
// 一是把 J 离散到网格上直接求极小（共轭梯度），二是在 x(1 − x)y(1 − y)·（二次多项式）里求极小（里茨法）。
// 单独运行：npx tsx tools/verify/math.calculus-of-variations.multivariable-functionals.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, derivative, integrate2, quadraticStationary, solve, type Vec } from './math.calculus-of-variations._variational.ts';

type Field = (x: number, y: number) => number;
type Density = (u: number, p: number, q: number) => number;

const dx = (f: Field) => (x: number, y: number): number => derivative((s) => f(x + s, y), 0);
const dy = (f: Field) => (x: number, y: number): number => derivative((s) => f(x, y + s), 0);
const laplacian = (f: Field, x: number, y: number): number => dx(dx(f))(x, y) + dy(dy(f))(x, y);

/** 场 u 代进 F_u − ∂_x F_{u_x} − ∂_y F_{u_y}，全部数值地求。 */
function residual(F: Density, u: Field, x: number, y: number): number {
  const at = (xx: number, yy: number): [number, number, number] => [u(xx, yy), dx(u)(xx, yy), dy(u)(xx, yy)];
  const Fk = (k: number): Field => (xx, yy) => {
    const v = at(xx, yy);
    return derivative((s) => F(...(v.map((vi, i) => (i === k ? vi + s : vi)) as [number, number, number])), 0);
  };
  return Fk(0)(x, y) - dx(Fk(1))(x, y) - dy(Fk(2))(x, y);
}

/** 狄利克雷积分 ½∬(u_x² + u_y²)，单位正方形上。 */
const dirichlet = (u: Field): number => 0.5 * integrate2((x, y) => dx(u)(x, y) ** 2 + dy(u)(x, y) ** 2, 0, 1, 0, 1, 8);

export const verification: Verification = {
  lesson: 'math.calculus-of-variations.multivariable-functionals',
  notes: {
    p1: '把三个试探函数代进数值的欧拉-拉格朗日方程，左边 R(u) 和数值的 Δu 满足 R = κ(Δu − c)：由前两个解出 κ、c，第三个核对；和 2 − 2Δu = 0、c = 1 核对。',
    p2: '在 (0.3, 0.7)、(1.1, −0.4)、(−0.8, 0.5) 三点数值求拉普拉斯算子，三点都小于 10⁻⁶ 的才算满足方程：A、C、E。',
    p3: '分别数值积分出 D[v]、D[u]，相减；另外单独算 D[w]（w = sin πx sin πy），两者核对（交叉项为零）；和 π²/4 核对。',
    p4: '一是在 64 × 64 的网格上把 J 离散成节点值的二次函数（梯度按离散的和直接写出），共轭梯度法求极小；二是里茨法，在 x(1 − x)y(1 − y)·（二次多项式）里求极小。两者核对；和 u = x(1 − x)y(1 − y)、u(½, ½) = 1/16 核对。',
  },
  compute() {
    // p1：F = u_x² + u_y² + 2u
    const F1: Density = (u, p, q) => p * p + q * q + 2 * u;
    const tests: Field[] = [(x, y) => x * x * y + Math.sin(y), (x, y) => Math.exp(x) * y * y, (x, y) => Math.cos(x + 2 * y)];
    const pt: [number, number] = [0.4, 0.7];
    const pairs = tests.map((u) => [residual(F1, u, ...pt), laplacian(u, ...pt)]);
    // R = κΔu − κc：两个方程解出 κ、κc
    const [kappa, kc] = solve(
      [
        [pairs[0][1], -1],
        [pairs[1][1], -1],
      ],
      [pairs[0][0], pairs[1][0]],
    );
    if (Math.abs(pairs[2][0] - (kappa * pairs[2][1] - kc)) > 1e-5) throw new Error('p1 第三个试探函数不符合');
    const p1 = agree(kc / kappa, 1, 'p1 c', 1e-6);

    // p2
    const options: Field[] = [
      (x, y) => x ** 3 - 3 * x * y * y,
      (x, y) => x * x + y * y,
      (x, y) => Math.exp(x) * Math.cos(y),
      (x, _y) => Math.exp(x) * Math.sin(x),
      (x, y) => Math.log(x * x + y * y),
    ];
    const points: [number, number][] = [
      [0.3, 0.7],
      [1.1, -0.4],
      [-0.8, 0.5],
    ];
    const p2 = chosen(options.map((u) => points.every(([x, y]) => Math.abs(laplacian(u, x, y)) < 1e-6)));

    // p3
    const u3: Field = (x, y) => x * x - y * y;
    const w3: Field = (x, y) => Math.sin(Math.PI * x) * Math.sin(Math.PI * y);
    const v3: Field = (x, y) => u3(x, y) + w3(x, y);
    const p3 = agree(agree(dirichlet(v3) - dirichlet(u3), dirichlet(w3), 'p3 交叉项'), (Math.PI * Math.PI) / 4, 'p3 差');

    // p4：f = −2x(1 − x) − 2y(1 − y)
    const f: Field = (x, y) => -2 * x * (1 - x) - 2 * y * (1 - y);
    const N = 64;
    const h = 1 / N;
    const n = N - 1;
    const idx = (i: number, j: number): number => (i - 1) * n + (j - 1);
    // J_h = Σ_边 (Δu)² + Σ_节点 2 f u h²；它的梯度是 2(4u − 四个邻点) + 2 f h²
    const apply = (u: Float64Array): Float64Array => {
      const out = new Float64Array(n * n);
      const at = (i: number, j: number): number => (i < 1 || j < 1 || i > n || j > n ? 0 : u[idx(i, j)]);
      for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++) out[idx(i, j)] = 2 * (4 * at(i, j) - at(i + 1, j) - at(i - 1, j) - at(i, j + 1) - at(i, j - 1));
      return out;
    };
    const b = new Float64Array(n * n);
    for (let i = 1; i <= n; i++) for (let j = 1; j <= n; j++) b[idx(i, j)] = -2 * f(i * h, j * h) * h * h;
    const u = new Float64Array(n * n);
    let r = Float64Array.from(b);
    let p = Float64Array.from(r);
    let rr = r.reduce((s, v) => s + v * v, 0);
    for (let it = 0; it < 5000 && Math.sqrt(rr) > 1e-15; it++) {
      const Ap = apply(p);
      const alpha = rr / p.reduce((s, v, k) => s + v * Ap[k], 0);
      for (let k = 0; k < u.length; k++) {
        u[k] += alpha * p[k];
        r[k] -= alpha * Ap[k];
      }
      const rr2 = r.reduce((s, v) => s + v * v, 0);
      p = p.map((v, k) => r[k] + (rr2 / rr) * v);
      rr = rr2;
    }
    const grid = u[idx(N / 2, N / 2)];
    const bubble = (x: number, y: number): number => x * (1 - x) * y * (1 - y);
    const basis: Field[] = [() => 1, (x) => x, (_x, y) => y, (x) => x * x, (x, y) => x * y, (_x, y) => y * y];
    const shape = (c: Vec): Field => (x, y) => bubble(x, y) * basis.reduce((s, phi, k) => s + c[k] * phi(x, y), 0);
    const J4 = (c: Vec): number => {
      const s = shape(c);
      return integrate2((x, y) => dx(s)(x, y) ** 2 + dy(s)(x, y) ** 2 + 2 * f(x, y) * s(x, y), 0, 1, 0, 1, 4);
    };
    const ritz = shape(quadraticStationary(J4, basis.length))(0.5, 0.5);
    const p4 = agree(agree(grid, ritz, 'p4 两种算法', 1e-8), 1 / 16, 'p4 u(½, ½)');

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
