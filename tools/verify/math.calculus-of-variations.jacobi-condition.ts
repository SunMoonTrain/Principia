// 独立验算 math.calculus-of-variations.jacobi-condition 的 p1–p4（简单题、中等题）。
// 共轭点用两条互相独立的路求：
//   一是数值地写出雅可比方程 −(P h′)′ + Q h = 0（P = F_y′y′、Q = F_yy − (F_yy′)′ 沿极值曲线数值求），RK4 积分，找第一个零点；
//   二是不用雅可比方程：按数值的欧拉-拉格朗日方程打出参数相差 ±δ 的两条相邻极值曲线，h ≈ 两者之差 / 2δ，找它的第一个零点。
// 单独运行：npx tsx tools/verify/math.calculus-of-variations.jacobi-condition.ts

import { fileURLToPath } from 'node:url';
import type { Derivative } from '../../packages/anim/src/ode.ts';
import { RK4 } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, chosen, derivative, eulerLagrangeAccel, type Integrand } from './math.calculus-of-variations._variational.ts';

type Fn = (x: number) => number;

/** 从 x0 出发积分，返回「value(状态) 第一次变号」的位置（在一步之内再二分），到 xmax 都不变号就返回 null。 */
function firstZero(f: Derivative, init: number[], x0: number, xmax: number, value: (s: Float64Array) => number, dt = 2e-3): number | null {
  const rk = new RK4(init.length);
  const s = Float64Array.from(init);
  let x = x0;
  // 跳过出发点本身的零点
  rk.step(f, x, s, dt);
  x += dt;
  let v = value(s);
  while (x < xmax - 1e-12) {
    const h = Math.min(dt, xmax - x);
    const saved = Float64Array.from(s);
    rk.step(f, x, s, h);
    const v2 = value(s);
    if (Math.sign(v2) !== Math.sign(v) && v2 !== 0) {
      const at = (t: number): number => {
        const w = Float64Array.from(saved);
        if (t > x) rk.step(f, x, w, t - x);
        return value(w);
      };
      return bisect(at, x, x + h);
    }
    x += h;
    v = v2;
  }
  return null;
}

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

/** 沿极值曲线 y(x) 数值地写出雅可比方程：状态 [h, h′]，h″ = (Q h − P′ h′)/P。 */
function jacobiFlow(F: Integrand, y: Fn): Derivative {
  const v = (x: number): [number, number, number] => [x, y(x), derivative(y, x)];
  const P = (x: number): number => partial2(F, 2, 2, v(x));
  const Q = (x: number): number => partial2(F, 1, 1, v(x)) - derivative((t) => partial2(F, 1, 2, v(t)), x);
  return (x, s, out) => {
    out[0] = s[1];
    out[1] = (Q(x) * s[0] - derivative(P, x) * s[1]) / P(x);
  };
}

/** 两条相邻的极值曲线：状态 [y₁, y₁′, y₂, y₂′]，各按数值的欧拉-拉格朗日方程走。 */
function pairFlow(F: Integrand): Derivative {
  return (x, s, out) => {
    out[0] = s[1];
    out[1] = eulerLagrangeAccel(F, x, s[0], s[1]);
    out[2] = s[3];
    out[3] = eulerLagrangeAccel(F, x, s[2], s[3]);
  };
}

/** 极值曲线 y = 0 上，a 的共轭点（两种算法），没有就是 null。 */
function conjugate(F: Integrand, a: number, xmax: number): [number | null, number | null] {
  const viaJacobi = firstZero(jacobiFlow(F, () => 0), [0, 1], a, xmax, (s) => s[0]);
  const d = 1e-3;
  const viaFamily = firstZero(pairFlow(F), [0, d, 0, -d], a, xmax, (s) => (s[0] - s[2]) / (2 * d));
  return [viaJacobi, viaFamily];
}

export const verification: Verification = {
  lesson: 'math.calculus-of-variations.jacobi-condition',
  notes: {
    p1: '一是数值地写出雅可比方程（P、Q 由 F 的二阶偏导数数值求）、RK4 积分到 π/6；二是从 (0, 0) 打出初始斜率 ±10⁻³ 的两条极值曲线，差除以 2·10⁻³。两者核对；和 sin(3x)/3 在 π/6 处的 1/3 核对。',
    p2: '五个选项各用两种算法找左端点的共轭点（数值的雅可比方程；相邻极值曲线之差），看它是否落在 (a, b] 里：B 在 π/2、E 在 π/4，落在区间里；A（h = ln x）、C（sinh x）没有零点，D 在 π/√4.5 ≈ 1.481 > 1。',
    p3: '同 p1 的两种算法找第一个零点；和 h″ + h/2 = 0 的 π√2 核对。',
    p4: '二分 c·cosh(0.6/c) = 1 的较小根 c；一是沿 y = c cosh(x/c) 数值地写出 F = y√(1 + y′²) 的雅可比方程，从 h(0) = 1、h′(0) = 0 积分到第一个零点；二是不用雅可比方程，从 x = 0 打出 y(0) = c ± δ、y′(0) = 0 的两条极值曲线，差除以 2δ。两者核对；和 c·t*（t·tanh t = 1）核对。',
  },
  compute() {
    // p1
    const F1: Integrand = (_x, y, p) => p * p - 9 * y * y;
    const hJ = (() => {
      const f = jacobiFlow(F1, () => 0);
      const rk = new RK4(2);
      const s = Float64Array.from([0, 1]);
      const n = 2000;
      for (let i = 0; i < n; i++) rk.step(f, (i * Math.PI) / 6 / n, s, Math.PI / 6 / n);
      return s[0];
    })();
    const hF = (() => {
      const f = pairFlow(F1);
      const rk = new RK4(4);
      const d = 1e-3;
      const s = Float64Array.from([0, d, 0, -d]);
      const n = 2000;
      for (let i = 0; i < n; i++) rk.step(f, (i * Math.PI) / 6 / n, s, Math.PI / 6 / n);
      return (s[0] - s[2]) / (2 * d);
    })();
    const p1 = agree(agree(hJ, hF, 'p1 两种算法', 1e-6), 1 / 3, 'p1 h(π/6)');

    // p2
    const cases: [Integrand, number, number, number | null][] = [
      [(x, _y, p) => x * p * p, 1, 3, null],
      [(_x, y, p) => p * p - 4 * y * y, 0, 2, Math.PI / 2],
      [(_x, y, p) => p * p + y * y, 0, 2, null],
      [(_x, y, p) => 2 * p * p - 9 * y * y, 0, 1, Math.PI / Math.sqrt(4.5)],
      [(_x, y, p) => p * p - 16 * y * y, 0, 1, Math.PI / 4],
    ];
    const p2 = chosen(
      cases.map(([F, a, b, expected]) => {
        // 找到比 b 稍远的地方，D 的共轭点在区间外也要找到它
        const [cJ, cF] = conjugate(F, a, a + 1.6 * (b - a));
        if ((cJ === null) !== (cF === null)) throw new Error('p2 两种算法对有没有共轭点看法不一');
        if (cJ !== null && cF !== null) agree(cJ, cF, 'p2 两种算法', 1e-6);
        if ((cJ === null) !== (expected === null) || (cJ !== null && Math.abs(cJ - expected!) > 1e-6)) throw new Error(`p2 共轭点和手算的不一致：${cJ}`);
        return cJ === null || cJ > b;
      }),
    );

    // p3
    const [c3J, c3F] = conjugate((_x, y, p) => 2 * p * p - y * y, 0, 6);
    const p3 = agree(agree(c3J!, c3F!, 'p3 两种算法', 1e-6), Math.PI * Math.SQRT2, 'p3 共轭点');

    // p4
    const c = bisect((cc) => cc * Math.cosh(0.6 / cc) - 1, 0.05, 0.5);
    const Fsoap: Integrand = (_x, y, p) => y * Math.sqrt(1 + p * p);
    const catenary: Fn = (x) => c * Math.cosh(x / c);
    const zJ = firstZero(jacobiFlow(Fsoap, catenary), [1, 0], 0, 1.2, (s) => s[0])!;
    const d = 1e-5;
    const zF = firstZero(pairFlow(Fsoap), [c + d, 0, c - d, 0], 0, 1.2, (s) => (s[0] - s[2]) / (2 * d))!;
    const tStar = bisect((t) => t * Math.tanh(t) - 1, 0.5, 2);
    const p4 = agree(agree(zJ, zF, 'p4 两种算法', 1e-6), c * tStar, 'p4 雅可比场的零点');

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
