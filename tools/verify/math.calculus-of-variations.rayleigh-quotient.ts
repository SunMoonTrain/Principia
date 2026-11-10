// 独立验算 math.calculus-of-variations.rayleigh-quotient 的 p1–p4（简单题、中等题）。
// 瑞利商一是数值积分（导数数值求），二是多项式精确积分或积分的封闭形式；关于特征值的说法，
// 用差分把 −d²/dx² 离散成三对角矩阵，数值求最小的两个特征值和特征向量来核对。矩阵的题一是反幂法，二是特征多项式二分。
// 单独运行：npx tsx tools/verify/math.calculus-of-variations.rayleigh-quotient.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import {
  agree,
  bisect,
  chosen,
  derivative,
  integrate,
  polyDer,
  polyInt01,
  polyMul,
  secondDerivative,
  solveTridiagonal,
  type Mat,
  type Vec,
} from './math.calculus-of-variations._variational.ts';

type Fn = (x: number) => number;

/** 带系数的瑞利商 ∫(p y′² + q y²)/∫w y²，[0, 1] 上数值积分。 */
const rayleigh = (y: Fn, p: Fn = () => 1, q: Fn = () => 0, w: Fn = () => 1): number =>
  integrate((x) => p(x) * derivative(y, x) ** 2 + q(x) * y(x) ** 2, 0, 1, 64) / integrate((x) => w(x) * y(x) ** 2, 0, 1, 64);

/** −(p y′)′ = λ y、y(0) = y(1) = 0 离散成 N 段（对称三对角），反幂法求最小的特征值和特征向量；再对它正交化求第二个。 */
function lowestTwo(N: number, p: Fn = () => 1): { l1: number; l2: number; v1: Vec } {
  const h = 1 / N;
  const n = N - 1;
  const di = Array.from({ length: n }, (_, i) => (p((i + 0.5) * h) + p((i + 1.5) * h)) / (h * h));
  const off = Array.from({ length: n }, (_, i) => -p((i + 1.5) * h) / (h * h));
  const lo = [0, ...off.slice(0, n - 1)];
  const up = [...off.slice(0, n - 1), 0];
  const apply = (v: Vec): Vec => v.map((vi, i) => di[i] * vi + (i > 0 ? lo[i] * v[i - 1] : 0) + (i < n - 1 ? up[i] * v[i + 1] : 0));
  const dotv = (a: Vec, b: Vec): number => a.reduce((s, x, i) => s + x * b[i], 0);
  const inverseIteration = (orth: Vec[]): [number, Vec] => {
    let v: Vec = Array.from({ length: n }, (_, i) => Math.sin((i + 1) * 0.7) + 0.3);
    for (let it = 0; it < 400; it++) {
      for (const o of orth) v = v.map((x, i) => x - (dotv(v, o) / dotv(o, o)) * o[i]);
      v = solveTridiagonal(lo, di, up, v);
      const s = Math.sqrt(dotv(v, v));
      v = v.map((x) => x / s);
    }
    for (const o of orth) v = v.map((x, i) => x - (dotv(v, o) / dotv(o, o)) * o[i]);
    return [dotv(v, apply(v)) / dotv(v, v), v];
  };
  const [l1, v1] = inverseIteration([]);
  const [l2] = inverseIteration([v1]);
  return { l1, l2, v1 };
}

export const verification: Verification = {
  lesson: 'math.calculus-of-variations.rayleigh-quotient',
  notes: {
    p1: '一是数值积分 ∫y′²、∫y²（y′ 数值求）；二是把 y = x(1 − x)² 当多项式精确地平方、求导、积分（2/15 和 1/105）。两者核对；和 14 核对。',
    p2: 'A：任取一个两端为零的函数比较 R[y] 和 R[−2y]；B：在几个点上数值求 −y″ − 25π²y 为零，并数值积分 R；C：−y″/y 在几个点上不是常数；D：数值积分得 R = 10.5 > π²；E：差分离散后最小的两个特征值分开（约 π² 和 4π²），R 取到 π² 的只有第一个特征向量的倍数。',
    p3: '一是数值积分 ∫(1 + x)π²cos²πx / ∫sin²πx；二是封闭形式（∫(1 + x)cos²πx = 3/4）得 3π²/2。两者核对；另用差分算出真正的最小特征值约 14.34，确认 3π²/2 确实是上界。',
    p4: '一是对 4I − A 做幂法，得到 A 最小的特征值；二是二分特征多项式 (2 − λ)³ − 2(2 − λ) 在 [0, 1] 上的根。两者核对；和 2 − √2 核对。',
  },
  compute() {
    // p1
    const y1: Fn = (x) => x * (1 - x) ** 2;
    const poly1 = polyMul([0, 1], polyMul([1, -1], [1, -1]));
    const exact1 = polyInt01(polyMul(polyDer(poly1), polyDer(poly1))) / polyInt01(polyMul(poly1, poly1));
    const p1 = agree(agree(rayleigh(y1), exact1, 'p1 两种算法', 1e-6), 14, 'p1 瑞利商');

    // p2
    const some: Fn = (x) => Math.sin(Math.PI * x) + 0.4 * x * (1 - x) * (x - 0.3);
    const A2 = Math.abs(rayleigh(some) - rayleigh((x) => -2 * some(x))) < 1e-9;
    const s5: Fn = (x) => Math.sin(5 * Math.PI * x);
    const B2 =
      [0.13, 0.41, 0.77].every((x) => Math.abs(-secondDerivative(s5, x, 1e-3) - 25 * Math.PI ** 2 * s5(x)) < 1e-3) &&
      Math.abs(rayleigh(s5) - 25 * Math.PI ** 2) < 1e-6;
    const quad: Fn = (x) => x * (1 - x);
    const ratios = [0.2, 0.5, 0.8].map((x) => -secondDerivative(quad, x) / quad(x));
    const C2 = Math.max(...ratios) - Math.min(...ratios) < 1e-6;
    const D2 = rayleigh((x) => x - x ** 3) < Math.PI ** 2;
    if (Math.abs(rayleigh((x) => x - x ** 3) - 10.5) > 1e-6) throw new Error('p2 D 的瑞利商不是 10.5');
    const { l1, l2, v1 } = lowestTwo(400);
    const sine = v1.map((_, i) => Math.sin(Math.PI * (i + 1) / 400));
    const cos = Math.abs(v1.reduce((s, v, i) => s + v * sine[i], 0)) / Math.sqrt(sine.reduce((s, v) => s + v * v, 0));
    const E2 = Math.abs(l1 - Math.PI ** 2) < 1e-3 && l2 - l1 > 20 && Math.abs(cos - 1) < 1e-9;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const R3 = rayleigh((x) => Math.sin(Math.PI * x), (x) => 1 + x);
    const p3 = agree(R3, (3 * Math.PI ** 2) / 2, 'p3 瑞利商', 1e-6);
    const true3 = lowestTwo(400, (x) => 1 + x).l1;
    if (!(true3 < p3 && Math.abs(true3 - 14.34) < 0.01)) throw new Error(`p3 真正的最小特征值 ${true3} 不在预期范围`);

    // p4
    const A: Mat = [
      [2, -1, 0],
      [-1, 2, -1],
      [0, -1, 2],
    ];
    let v: Vec = [1, 0.3, -0.2];
    for (let it = 0; it < 2000; it++) {
      const w = v.map((_, i) => 4 * v[i] - A[i].reduce((s, a, j) => s + a * v[j], 0));
      const s = Math.hypot(...w);
      v = w.map((x) => x / s);
    }
    const Av = A.map((row) => row.reduce((s, a, j) => s + a * v[j], 0));
    const viaPower = v.reduce((s, x, i) => s + x * Av[i], 0);
    const viaPoly = bisect((l) => (2 - l) ** 3 - 2 * (2 - l), 0, 1);
    const p4 = agree(agree(viaPower, viaPoly, 'p4 两种算法', 1e-9), 2 - Math.SQRT2, 'p4 最小值');

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
