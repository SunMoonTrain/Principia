// 独立验算 math.calculus-of-variations.several-functions 的 p1–p4（简单题、中等题）。
// 含 y″ 的泛函：一是离散成节点值的二次函数（y″ 用二阶差分，两端给定的斜率用镜像的虚节点），直接求驻点，N 和 2N 外推；
// 二是在满足四个端点条件的多项式里直接求极小（里茨法），都不用欧拉-泊松方程。
// 两个未知函数：离散求驻点，另外按数值的欧拉-拉格朗日方程组打靶。
// 单独运行：npx tsx tools/verify/math.calculus-of-variations.several-functions.ts

import { fileURLToPath } from 'node:url';
import type { Derivative } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import {
  agree,
  chosen,
  derivative,
  integrate,
  integrateTo,
  quadraticStationary,
  richardson,
  secondDerivative,
  solve,
  type Vec,
} from './math.calculus-of-variations._variational.ts';

type Second = (x: number, y: number, ypp: number) => number;

/** ∫₀¹ G(x, y, y″) dx 在两端给定 y、y′ 时的极小：节点 0…N，虚节点 y₋₁ = y₁ − 2h y′(0)、y_{N+1} = y_{N−1} + 2h y′(1)，梯形公式。 */
function minimizeSecond(G: Second, N: number, y0: number, yp0: number, y1: number, yp1: number): { y: Vec; J: number } {
  const h = 1 / N;
  const nodes = (u: Vec): Vec => [y0, ...u, y1];
  const J = (u: Vec): number => {
    const y = nodes(u);
    const at = (i: number): number => (i < 0 ? y[1] - 2 * h * yp0 : i > N ? y[N - 1] + 2 * h * yp1 : y[i]);
    let s = 0;
    for (let i = 0; i <= N; i++) {
      const w = i === 0 || i === N ? 0.5 : 1;
      s += w * h * G(i * h, at(i), (at(i + 1) - 2 * at(i) + at(i - 1)) / (h * h));
    }
    return s;
  };
  const u = quadraticStationary(J, N - 1);
  return { y: nodes(u), J: J(u) };
}

/** 里茨法：y = p(x) + x²(1 − x)²·(c₀ + c₁x + … ) 自动满足四个端点条件，对系数求 ∫₀¹ G 的极小。 */
function ritzSecond(G: Second, base: (x: number) => number, terms: number): (x: number) => number {
  const bump = (x: number): number => x * x * (1 - x) ** 2;
  const shape = (c: Vec) => (x: number): number => base(x) + bump(x) * c.reduce((s, ck, k) => s + ck * x ** k, 0);
  const J = (c: Vec): number => integrate((x) => G(x, shape(c)(x), secondDerivative(shape(c), x)), 0, 1, 16);
  return shape(quadraticStationary(J, terms));
}

export const verification: Verification = {
  lesson: 'math.calculus-of-variations.several-functions',
  notes: {
    p1: '一是离散求极小（40 段、80 段外推）；二是里茨法，在 3x² − 2x³ + x²(1 − x)²·（三次多项式）里求极小。两者核对；和 y = 3x² − 2x³、J = 12 核对。',
    p2: '把三个任意的试探函数各取两点，数值地算 F_y − (F_{y′})′ + (F_{y″})″（F 的偏导数和对 x 的导数都数值地求），看它是否处处等于同一个不为零的常数乘选项的左边减右边：只有 A 是。',
    p3: '一是离散求驻点（两个函数的值都是未知数，二次型不定，求的是鞍点；40 段、80 段外推）；二是由 F 数值地写出两个欧拉-拉格朗日方程打靶（两个初始斜率，方程是线性的，三次打靶解出）。两者核对；和 y = x、z = x³/3 − x/3 核对。',
    p4: '同 p1 的两种算法，里茨法在 x²(1 − x)²·（二次多项式）里求极小；和 y = x²(1 − x)²/24、y(½) = 1/384 核对。',
  },
  compute() {
    // p1：∫ y″²，y(0) = 0、y′(0) = 0、y(1) = 1、y′(1) = 0
    const G1: Second = (_x, _y, q) => q * q;
    const fd1 = richardson(minimizeSecond(G1, 40, 0, 0, 1, 0).J, minimizeSecond(G1, 80, 0, 0, 1, 0).J);
    const ritz1 = ritzSecond(G1, (x) => 3 * x * x - 2 * x ** 3, 4);
    const ritzJ = integrate((x) => secondDerivative(ritz1, x) ** 2, 0, 1, 16);
    const p1 = agree(agree(fd1, ritzJ, 'p1 两种算法', 1e-6), 12, 'p1 最小值');

    // p2：F = y″² + y′²
    const F2 = (_y: number, p: number, q: number): number => q * q + p * p;
    const tests: ((x: number) => number)[] = [
      (x) => Math.sin(1.3 * x) + x ** 3,
      (x) => Math.exp(0.5 * x) * Math.cos(x),
      (x) => x ** 4 - x,
    ];
    const d = (f: (x: number) => number, k: number) => (x: number): number => {
      let g = f;
      for (let i = 0; i < k; i++) {
        const prev = g;
        g = (t: number) => derivative(prev, t, 2e-2);
      }
      return g(x);
    };
    const residual = (y: (x: number) => number, x: number): number => {
      const at = (t: number): [number, number, number] => [y(t), d(y, 1)(t), d(y, 2)(t)];
      const Fy = (t: number): number => derivative((s) => F2(at(t)[0] + s, at(t)[1], at(t)[2]), 0);
      const Fp = (t: number): number => derivative((s) => F2(at(t)[0], at(t)[1] + s, at(t)[2]), 0);
      const Fq = (t: number): number => derivative((s) => F2(at(t)[0], at(t)[1], at(t)[2] + s), 0);
      return Fy(x) - derivative(Fp, x, 2e-2) + secondDerivative(Fq, x, 2e-2);
    };
    const candidates: ((y: (x: number) => number, x: number) => number)[] = [
      (y, x) => d(y, 4)(x) - d(y, 2)(x),
      (y, x) => d(y, 4)(x) + d(y, 2)(x),
      (y, x) => d(y, 2)(x) - y(x),
      (y, x) => d(y, 4)(x) - y(x),
    ];
    const pairs = tests.flatMap((y) => [0.3, 0.8].map((x) => [y, x] as const));
    const p2 = chosen(
      candidates.map((cand) => {
        const values = pairs.map(([y, x]) => [residual(y, x), cand(y, x)]);
        const lambda = values[0][0] / values[0][1];
        return Math.abs(lambda) > 1e-3 && values.every(([r, c]) => Math.abs(r - lambda * c) < 1e-4 * Math.max(1, Math.abs(r)));
      }),
    );

    // p3：J[y, z] = ∫ (y′z′ + 2xy)，y(0) = 0、y(1) = 1、z(0) = z(1) = 0
    const zHalf = (N: number): number => {
      const h = 1 / N;
      const J = (u: Vec): number => {
        const y = [0, ...u.slice(0, N - 1), 1];
        const z = [0, ...u.slice(N - 1), 0];
        let s = 0;
        for (let i = 0; i < N; i++) {
          const x = (i + 0.5) * h;
          s += h * (((y[i + 1] - y[i]) / h) * ((z[i + 1] - z[i]) / h) + 2 * x * ((y[i] + y[i + 1]) / 2));
        }
        return s;
      };
      const u = quadraticStationary(J, 2 * (N - 1));
      return u[N - 1 + N / 2 - 1];
    };
    const discrete3 = richardson(zHalf(40), zHalf(80));
    // 打靶：F(x, y, z, p, q) = pq + 2xy；数值地写出 F_pp、F_pq … 解出 y″、z″
    const F3 = (x: number, y: number, _z: number, p: number, q: number): number => p * q + 2 * x * y;
    const vars = (s: Float64Array, x: number) => [x, s[0], s[1], s[2], s[3]];
    const part = (f: (v: number[]) => number, v: number[], k: number): number => derivative((e) => f(v.map((vi, i) => (i === k ? vi + e : vi))), 0);
    const F3v = (v: number[]): number => F3(v[0], v[1], v[2], v[3], v[4]);
    const flow: Derivative = (x, s, out) => {
      const v = vars(s, x);
      const Fp = (w: number[]): number => part(F3v, w, 3);
      const Fq = (w: number[]): number => part(F3v, w, 4);
      const M = [
        [part(Fp, v, 3), part(Fp, v, 4)],
        [part(Fq, v, 3), part(Fq, v, 4)],
      ];
      const rhs = [
        part(F3v, v, 1) - part(Fp, v, 0) - part(Fp, v, 1) * s[2] - part(Fp, v, 2) * s[3],
        part(F3v, v, 2) - part(Fq, v, 0) - part(Fq, v, 1) * s[2] - part(Fq, v, 2) * s[3],
      ];
      const acc = solve(M, rhs);
      out[0] = s[2];
      out[1] = s[3];
      out[2] = acc[0];
      out[3] = acc[1];
    };
    const endAt = (sy: number, sz: number, x: number): Float64Array => integrateTo(flow, [0, 0, sy, sz], 0, x, 1e-3);
    const e00 = endAt(0, 0, 1);
    const e10 = endAt(1, 0, 1);
    const e01 = endAt(0, 1, 1);
    const [sy, sz] = solve(
      [
        [e10[0] - e00[0], e01[0] - e00[0]],
        [e10[1] - e00[1], e01[1] - e00[1]],
      ],
      [1 - e00[0], 0 - e00[1]],
    );
    const shot3 = endAt(sy, sz, 0.5)[1];
    const p3 = agree(agree(discrete3, shot3, 'p3 两种算法', 1e-6), 1 / 24 - 1 / 6, 'p3 z(½)');

    // p4：∫ (½y″² − y)，两端夹紧
    const G4: Second = (_x, y, q) => 0.5 * q * q - y;
    const fd4 = richardson(minimizeSecond(G4, 40, 0, 0, 0, 0).y[20], minimizeSecond(G4, 80, 0, 0, 0, 0).y[40]);
    const ritz4 = ritzSecond(G4, () => 0, 3)(0.5);
    const p4 = agree(agree(fd4, ritz4, 'p4 两种算法', 1e-6), 1 / 384, 'p4 y(½)');

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
