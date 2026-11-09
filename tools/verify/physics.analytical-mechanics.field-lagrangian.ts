// 独立验算 physics.analytical-mechanics.field-lagrangian 的 p1–p4（简单题、中等题）。
// 两种算法：一是把试探的场 y(x, t) 代进场的欧拉-拉格朗日方程的左边，所有偏导数（对 ℒ 的各个变量、对 x、对 t）
// 都数值地求；二是回到小球链：N 个小球、间距 a，按离散的拉格朗日量直接写出每个小球的运动方程积分，
// 读出脉冲的速度、最低模的周期。两者先互相核对，再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.field-lagrangian.ts

import { fileURLToPath } from 'node:url';
import type { Derivative } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, chosen, derivative, integrateTo, integrateUntil } from './physics.analytical-mechanics._mech.ts';

type Density = (y: number, yt: number, yx: number) => number;
type Field = (x: number, t: number) => number;

/** 场 y 在 (x, t) 处代进 ∂ℒ/∂y − ∂_t(∂ℒ/∂y_t) − ∂_x(∂ℒ/∂y_x)；hx、ht 是对 x、t 数值求导的步长。 */
function residual(L: Density, y: Field, x: number, t: number, hx: number, ht: number): number {
  const vars = (xx: number, tt: number): number[] => [
    y(xx, tt),
    derivative((s) => y(xx, tt + s), 0, ht),
    derivative((s) => y(xx + s, tt), 0, hx),
  ];
  const dL =
    (k: number) =>
    (xx: number, tt: number): number => {
      const v = vars(xx, tt);
      return derivative((s) => L(...(v.map((vi, i) => (i === k ? vi + s : vi)) as [number, number, number])), 0);
    };
  return dL(0)(x, t) - derivative((s) => dL(1)(x, t + s), 0, ht) - derivative((s) => dL(2)(x + s, t), 0, hx);
}

/** 两端固定的小球链：N 个质量 m 的小球、间距 a、张力 T，另有每单位长度 −κy 的恢复力。状态 [y₁…y_N, ẏ₁…ẏ_N]。 */
function chain(N: number, a: number, mu: number, T: number, kappa: number): Derivative {
  const m = mu * a;
  return (_t, y, out) => {
    for (let j = 0; j < N; j++) {
      const left = j > 0 ? y[j - 1] : 0;
      const right = j < N - 1 ? y[j + 1] : 0;
      out[j] = y[N + j];
      out[N + j] = ((T / a) * (left - 2 * y[j] + right) - kappa * a * y[j]) / m;
    }
  };
}

const GAUSS = [
  [-Math.sqrt(3 / 5), 5 / 9],
  [0, 8 / 9],
  [Math.sqrt(3 / 5), 5 / 9],
];

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.field-lagrangian',
  notes: {
    p1: '一是把 y = f(x − ct) 代进场的欧拉-拉格朗日方程，二分出让左边为零的 c（两种脉冲形状、两个点，结果一样）；二是间距 1 mm 的小球链从静止的高斯形隆起出发，向右的那一半的峰在 t = 4 ms 到 8 ms 之间走的距离除以时间（相对偏差小于 10⁻⁴）。和 √(T/μ) 核对。',
    p2: '取 μ = 2、T = 3、κ = 1.5，对四种 ℒ 把三个任意的场代进欧拉-拉格朗日方程，各取两个点：左边处处等于同一个不为零的常数乘 Ty_xx − μy_tt，才给出波动方程（A 的倍数是 1，C 是 3）。',
    p3: '一是把 y = sin(πx/ℓ)cos ωt 代进带基底的欧拉-拉格朗日方程，二分出 ω，再验证别的 (x, t) 处左边也为零；二是 400 个小球的链（每个小球另受 −κa y 的力）从最低模的形状出发积分，相邻两次过零读出周期，两者核对（相对 10⁻⁵）；和 √((T/μ)(π/ℓ)² + κ/μ) 核对。',
    p4: '能量密度 ½μy_t² + ½Ty_x² 里的导数都对 y = f(x − vt) 数值地求，在三角形的两条边上各用高斯-勒让德公式积分；μ 取 0.01 和 0.04（v = √(T/μ) 跟着变），结果一样；和 2TA²/w 核对。',
  },
  compute() {
    // p1：T = 100、μ = 0.01
    const [T, mu] = [100, 0.01];
    const string: Density = (_y, yt, yx) => 0.5 * mu * yt * yt - 0.5 * T * yx * yx;
    const pulses: ((u: number) => number)[] = [(u) => Math.exp(-u * u / 0.04), (u) => 1 / (1 + 30 * u * u)];
    const speeds = pulses.flatMap((f) =>
      [0.05, -0.12].map((x) => bisect((c) => residual(string, (xx, tt) => f(xx - c * tt), x, 0, 1e-3, 1e-5), 50, 200)),
    );
    const cField = speeds.reduce((a, b) => agree(a, b, 'p1 不同脉冲、不同点'));
    const N1 = 3001;
    const a1 = 3 / (N1 + 1);
    const xs = Array.from({ length: N1 }, (_, j) => -1.5 + (j + 1) * a1);
    const start = [...xs.map((x) => Math.exp(-x * x / 0.01)), ...xs.map(() => 0)];
    const peak = (y: Float64Array): number => {
      let j = 0;
      for (let i = 0; i < N1; i++) if (xs[i] > 0 && (j === 0 || y[i] > y[j])) j = i;
      const [l, c, r] = [y[j - 1], y[j], y[j + 1]];
      return xs[j] + (a1 * (l - r)) / (2 * (l - 2 * c + r));
    };
    const f1 = chain(N1, a1, mu, T, 0);
    const y4ms = integrateTo(f1, start, 0, 0.004, 2e-6);
    const y8ms = integrateTo(f1, Array.from(y4ms), 0.004, 0.008, 2e-6);
    const cChain = (peak(y8ms) - peak(y4ms)) / 0.004;
    const p1 = agree(agree(cChain, cField, 'p1 两种算法', 1e-4), Math.sqrt(T / mu), 'p1 波速');

    // p2：μ = 2、T = 3、κ = 1.5
    const [m2, T2, k2] = [2, 3, 1.5];
    const densities: Density[] = [
      (_y, yt, yx) => 0.5 * m2 * yt * yt - 0.5 * T2 * yx * yx,
      (_y, yt, yx) => 0.5 * m2 * yt * yt + 0.5 * T2 * yx * yx,
      (_y, yt, yx) => 3 * (0.5 * m2 * yt * yt - 0.5 * T2 * yx * yx),
      (y, yt, yx) => 0.5 * m2 * yt * yt - 0.5 * T2 * yx * yx - 0.5 * k2 * y * y,
    ];
    const fields: Field[] = [
      (x, t) => Math.sin(1.3 * x + 0.7 * t) + 0.5 * Math.cos(0.4 * x - 2.1 * t),
      (x, t) => Math.exp(0.3 * x) * Math.sin(t) + x * x * t,
      (x, t) => Math.cos(x - Math.sqrt(T2 / m2) * t), // 本身就满足波动方程
    ];
    const wave = (y: Field, x: number, t: number): number =>
      T2 * derivative((s) => derivative((r) => y(x + s + r, t), 0), 0) -
      m2 * derivative((s) => derivative((r) => y(x, t + s + r), 0), 0);
    const p2 = chosen(
      densities.map((L) => {
        const pairs = fields.flatMap((y) =>
          [
            [0.3, 0.2],
            [-0.7, 1.1],
          ].map(([x, t]) => [residual(L, y, x, t, 1e-3, 1e-3), wave(y, x, t)]),
        );
        const lambda = pairs[0][0] / pairs[0][1];
        return Math.abs(lambda) > 1e-3 && pairs.every(([r, w]) => Math.abs(r - lambda * w) < 1e-5);
      }),
    );

    // p3：T = 100、μ = 0.01、ℓ = 1、κ = 400
    const kappa = 400;
    const bedded: Density = (y, yt, yx) => 0.5 * mu * yt * yt - 0.5 * T * yx * yx - 0.5 * kappa * y * y;
    const mode = (w: number): Field => (x, t) => Math.sin(Math.PI * x) * Math.cos(w * t);
    const wField = bisect((w) => residual(bedded, mode(w), 0.3, 1e-3, 1e-3, 1e-5), 200, 600);
    for (const [x, t] of [
      [0.71, 0.004],
      [0.12, 0.0123],
    ]) {
      // 方程里各项的大小约 10³，数值求导的误差约 10⁻⁵；ω 差千分之一时左边约 0.2
      if (Math.abs(residual(bedded, mode(wField), x, t, 1e-3, 1e-5)) > 1e-3) throw new Error('p3 分离变量的解不成立');
    }
    const N3 = 400;
    const a3 = 1 / (N3 + 1);
    const shape = Array.from({ length: N3 }, (_, j) => Math.sin(Math.PI * (j + 1) * a3));
    const f3 = chain(N3, a3, mu, T, kappa);
    const middle = (_t: number, y: Float64Array): number => y[N3 / 2];
    const first = integrateUntil(f3, [...shape, ...shape.map(() => 0)], 0, 1e-5, 1, middle)!;
    const away = integrateTo(f3, Array.from(first.y), first.t, first.t + 1e-4, 1e-5);
    const second = integrateUntil(f3, Array.from(away), first.t + 1e-4, 1e-5, 1, middle)!;
    const wChain = Math.PI / (second.t - first.t);
    const p3 = agree(
      agree(wChain, wField, 'p3 两种算法', 1e-5),
      Math.sqrt((T / mu) * Math.PI ** 2 + kappa / mu),
      'p3 最低频率',
    );

    // p4：T = 100、A = 0.01、w = 0.1
    const [A, w] = [0.01, 0.1];
    const tri = (u: number): number => (Math.abs(u) < w ? A * (1 - Math.abs(u) / w) : 0);
    const energies = [0.01, 0.04].map((m4) => {
      const v = Math.sqrt(T / m4);
      const density = (x: number): number => {
        const yt = derivative((s) => tri(x - v * s), 0, 1e-7);
        const yx = derivative((s) => tri(x + s), 0, 1e-7);
        return 0.5 * m4 * yt * yt + 0.5 * T * yx * yx;
      };
      return [
        [-w, 0],
        [0, w],
      ].reduce((sum, [lo, hi]) => sum + GAUSS.reduce((s, [u, wt]) => s + ((wt * (hi - lo)) / 2) * density((lo + hi) / 2 + (u * (hi - lo)) / 2), 0), 0);
    });
    const p4 = agree(energies.reduce((a, b) => agree(a, b, 'p4 不同 μ')), (2 * T * A * A) / w, 'p4 能量');

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
