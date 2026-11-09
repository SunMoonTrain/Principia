// 独立验算 math.calculus-of-variations.beltrami-identity 的 p1–p4（简单题、中等题）。
// 贝尔特拉米恒等式的两题沿数值积分出的极值曲线检查 F − y′F_{y′} 是否守恒；
// 最速降线、悬链面两题不用欧拉-拉格朗日方程：把曲线换成折线，直接对折线的顶点求总时间、总面积的极小（牛顿法），
// 折线段数取 100 和 200 做理查森外推；再和摆线、悬链线的手推结果核对。
// 单独运行：npx tsx tools/verify/math.calculus-of-variations.beltrami-identity.ts

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
  richardson,
  secondDerivative,
  solveTridiagonal,
  type Integrand,
  type Vec,
} from './math.calculus-of-variations._variational.ts';

const g = 9.8;

/** 折线的总代价 Σ seg(i, y_i, y_{i+1}) 及它对两个端点的偏导数。 */
interface Chain {
  f(i: number, a: number, b: number): number;
  da(i: number, a: number, b: number): number;
  db(i: number, a: number, b: number): number;
}

/**
 * 两端固定、中间 N − 1 个顶点的高度可动，用牛顿法求总代价的极小：梯度由各段的偏导数相加，
 * 黑塞矩阵是三对角的，对梯度做中心差分得到；每步回溯，保证总代价下降（positive 时还要求顶点在 y > 0 一侧）。
 */
function minimizeChain(c: Chain, N: number, y0: number, yN: number, init: Vec, positive: boolean): Vec {
  let y = [y0, ...init, yN];
  const total = (v: Vec): number => {
    let s = 0;
    for (let i = 0; i < N; i++) s += c.f(i, v[i], v[i + 1]);
    return s;
  };
  const grad = (v: Vec): Vec => {
    const out: Vec = [];
    for (let k = 1; k < N; k++) out.push(c.db(k - 1, v[k - 1], v[k]) + c.da(k, v[k], v[k + 1]));
    return out;
  };
  for (let it = 0; it < 100; it++) {
    const gr = grad(y);
    if (Math.max(...gr.map(Math.abs)) < 1e-13) break;
    const lo = new Array<number>(N - 1).fill(0);
    const di = new Array<number>(N - 1).fill(0);
    const up = new Array<number>(N - 1).fill(0);
    for (let k = 1; k < N; k++) {
      const d = 1e-6 * Math.max(Math.abs(y[k]), 1e-6);
      const gp = grad(y.map((v, i) => (i === k ? v + d : v)));
      const gm = grad(y.map((v, i) => (i === k ? v - d : v)));
      di[k - 1] = (gp[k - 1] - gm[k - 1]) / (2 * d);
      if (k >= 2) up[k - 2] = (gp[k - 2] - gm[k - 2]) / (2 * d);
      if (k <= N - 2) lo[k] = (gp[k] - gm[k]) / (2 * d);
    }
    const step = solveTridiagonal(lo, di, up, gr.map((v) => -v));
    const before = total(y);
    let alpha = 1;
    for (let tries = 0; tries < 60; tries++, alpha /= 2) {
      const trial = y.map((v, i) => (i === 0 || i === N ? v : v + alpha * step[i - 1]));
      if ((!positive || trial.every((v, i) => i === 0 || v > 0)) && total(trial) <= before + 1e-15) {
        y = trial;
        break;
      }
    }
  }
  return y;
}

/** 最速降线：顶点的横坐标按 (i/N)³ 加密在起点附近（那里曲线竖直），每段上小球的平均速率是两端速率的平均。 */
function brachistochroneTime(b: number, h: number, N: number): number {
  const xs = Array.from({ length: N + 1 }, (_, i) => b * (i / N) ** 3);
  const v = (y: number): number => Math.sqrt(2 * g * Math.max(y, 0));
  const chain: Chain = {
    f: (i, a, c) => (2 * Math.hypot(xs[i + 1] - xs[i], c - a)) / (v(a) + v(c)),
    da: (i, a, c) => {
      const L = Math.hypot(xs[i + 1] - xs[i], c - a);
      const s = v(a) + v(c);
      return (2 * ((-(c - a) / L) * s - (a > 0 ? (L * g) / v(a) : 0))) / (s * s);
    },
    db: (i, a, c) => {
      const L = Math.hypot(xs[i + 1] - xs[i], c - a);
      const s = v(a) + v(c);
      return (2 * (((c - a) / L) * s - (L * g) / v(c))) / (s * s);
    },
  };
  const y = minimizeChain(chain, N, 0, h, xs.slice(1, N).map((x) => h * Math.sqrt(x / b)), true);
  let T = 0;
  for (let i = 0; i < N; i++) T += chain.f(i, y[i], y[i + 1]);
  return T;
}

/** 悬链面：两环在 x = ±a、半径 R，折线绕 x 轴转出的面积 2πΣ (y_i + y_{i+1})/2·段长，从圆柱面出发求极小，返回中点的半径。 */
function catenoidWaist(a: number, R: number, N: number): number {
  const h = (2 * a) / N;
  const chain: Chain = {
    f: (_i, p, q) => Math.PI * (p + q) * Math.hypot(h, q - p),
    da: (_i, p, q) => Math.PI * (Math.hypot(h, q - p) - ((p + q) * (q - p)) / Math.hypot(h, q - p)),
    db: (_i, p, q) => Math.PI * (Math.hypot(h, q - p) + ((p + q) * (q - p)) / Math.hypot(h, q - p)),
  };
  return minimizeChain(chain, N, R, R, new Array<number>(N - 1).fill(R), true)[N / 2];
}

export const verification: Verification = {
  lesson: 'math.calculus-of-variations.beltrami-identity',
  notes: {
    p1: '先验证 y = x^{2/3} 确是极值曲线（数值的欧拉-拉格朗日方程给出的 y″ 和它的 y″ 一致），再在 x = 0.5、1、2、3 处数值求 F − y′F_{y′}，四处一样；和 −y y′² = −4/9 核对。',
    p2: '对每个 F，从 (1, 1)、斜率 0.3 出发按数值的欧拉-拉格朗日方程积分到 x = 1.5，沿途六个点算 F − y′F_{y′}：A、C、E 守恒（相对变化小于 10⁻⁹），B、D 不守恒。',
    p3: '一是不用变分法，把轨道换成 N 段折线（N = 100、200，外推），直接对顶点高度求总时间的极小；二是由端点定出摆线 r = 2、θ_B = π/2，沿摆线数值积分 ds/v。两者核对（相对 10⁻⁷）；和 θ_B√(r/g) 核对。',
    p4: '一是从圆柱面出发，对折线绕轴转出的面积求极小（N = 100、200，外推），读出中点的半径，得到的是较粗、稳定的那个；二是二分解 c cosh(1/(2c)) = 1 的较大根。两者核对。',
  },
  compute() {
    // p1：F = y y′²
    const F1: Integrand = (_x, y, p) => y * p * p;
    const curve = (x: number): number => x ** (2 / 3);
    const H1 = [0.5, 1, 2, 3].map((x) => {
      const y = curve(x);
      const p = derivative(curve, x);
      if (Math.abs(eulerLagrangeAccel(F1, x, y, p) - secondDerivative(curve, x)) > 1e-6) throw new Error('p1 x^{2/3} 不是极值曲线');
      return F1(x, y, p) - p * derivative((s) => F1(x, y, p + s), 0);
    });
    const p1 = agree(H1.reduce((u, v) => agree(u, v, 'p1 不同的点')), -4 / 9, 'p1 常数');

    // p2
    const options: Integrand[] = [
      (_x, y, p) => p * p - y ** 4,
      (x, _y, p) => x * p * p,
      (_x, y, p) => y * y * Math.sqrt(1 + p * p),
      (x, y, p) => Math.exp(x) * (p * p + y * y),
      (_x, y, p) => Math.sqrt(1 + p * p) / y,
    ];
    const p2 = chosen(
      options.map((F) => {
        const H = [1, 1.1, 1.2, 1.3, 1.4, 1.5].map((x) => {
          const [y, p] = integrateTo(extremalFlow(F), [1, 0.3, 0], 1, x, 1e-3);
          return F(x, y, p) - p * derivative((s) => F(x, y, p + s), 0);
        });
        const spread = (Math.max(...H) - Math.min(...H)) / Math.abs(H[0]);
        if (spread > 1e-9 && spread < 1e-4) throw new Error(`p2 分不清是否守恒：${spread}`);
        return spread < 1e-9;
      }),
    );

    // p3：A = (0, 0)，B = (π − 2, 2)
    const [b, h] = [Math.PI - 2, 2];
    const discrete = richardson(brachistochroneTime(b, h, 100), brachistochroneTime(b, h, 200));
    const thetaB = bisect((t) => (t - Math.sin(t)) / (1 - Math.cos(t)) - b / h, 0.1, 2 * Math.PI - 0.1);
    const r = h / (1 - Math.cos(thetaB));
    const xc = (t: number): number => r * (t - Math.sin(t));
    const yc = (t: number): number => r * (1 - Math.cos(t));
    const alongCycloid = integrate((t) => Math.hypot(derivative(xc, t), derivative(yc, t)) / Math.sqrt(2 * g * yc(t)), 0, thetaB);
    const p3 = agree(agree(discrete, alongCycloid, 'p3 两种算法', 1e-7), thetaB * Math.sqrt(r / g), 'p3 时间');

    // p4：两环半径 1，相距 1
    const waist = richardson(catenoidWaist(0.5, 1, 100), catenoidWaist(0.5, 1, 200));
    const c = bisect((cc) => cc * Math.cosh(0.5 / cc) - 1, 0.5, 0.99);
    const p4 = agree(waist, c, 'p4 最细处的半径', 1e-6);

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
