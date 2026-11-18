// 振动与波验算脚本的公用部分（文件名以下划线开头，npm run verify 不把它当成小节脚本）。
// 第二套算法的主要办法：不用讲解里解出来的式子，把运动方程交给四阶龙格-库塔法一步步积分，再从数值解里量出
// 周期（向上过零的时刻）、振幅和衰减（相邻的极大值）、稳态的振幅和相位（在整数个周期上投影到 cos、sin）；
// 简正频率和简正模用雅可比方法直接求对称矩阵的本征值，连续弦的最低频率用斯图姆序列求细分的链、再做理查森外推；
// 单摆的精确周期用算术-几何平均，再和直接积分的周期核对。
// agree、argmax、check、chosen、bisect、rk4、rk4Step、rk4Until、solveLinear、integrate 借用电磁学的辅助文件。

import { bisect, integrate, rk4Step } from './physics.electromagnetism._es.ts';

export { agree, argmax, bisect, check, chosen, integrate, rk4, rk4Step, rk4Until, solveLinear } from './physics.electromagnetism._es.ts';

export type Rhs = (t: number, y: number[]) => number[];

// ---------- 复数 ----------

/** 复数 [实部, 虚部]。 */
export type Cx = [number, number];
export const cadd = (a: Cx, b: Cx): Cx => [a[0] + b[0], a[1] + b[1]];
export const csub = (a: Cx, b: Cx): Cx => [a[0] - b[0], a[1] - b[1]];
export const cmul = (a: Cx, b: Cx): Cx => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
export const cdiv = (a: Cx, b: Cx): Cx => {
  const d = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
};
export const cabs = (a: Cx): number => Math.hypot(a[0], a[1]);
export const carg = (a: Cx): number => Math.atan2(a[1], a[0]);
/** r·e^{iθ}。 */
export const cpolar = (r: number, theta: number): Cx => [r * Math.cos(theta), r * Math.sin(theta)];
export const cconj = (a: Cx): Cx => [a[0], -a[1]];

/** 把角度化到 (−π, π]。 */
export function wrapAngle(a: number): number {
  let x = a % (2 * Math.PI);
  if (x <= -Math.PI) x += 2 * Math.PI;
  if (x > Math.PI) x -= 2 * Math.PI;
  return x;
}

// ---------- 从数值解里量周期、极值 ----------

/**
 * 从 t0 起用步长 h 积分，记下 y[idx] 由负变成非负（向上过零）的时刻，每次都在那一步里二分到机器精度。
 * 返回前 n 个过零时刻。
 */
export function upCrossings(f: Rhs, y0: number[], idx: number, h: number, n: number, t0 = 0, maxSteps = 5e7): number[] {
  const out: number[] = [];
  let t = t0;
  let y = [...y0];
  for (let i = 0; i < maxSteps && out.length < n; i++) {
    const yn = rk4Step(f, t, y, h);
    if (y[idx] < 0 && yn[idx] >= 0) {
      let lo = 0;
      let hi = h;
      for (let k = 0; k < 200; k++) {
        const mid = (lo + hi) / 2;
        if (mid === lo || mid === hi) break;
        if (rk4Step(f, t, y, mid)[idx] < 0) lo = mid;
        else hi = mid;
      }
      out.push(t + hi);
    }
    t += h;
    y = yn;
  }
  if (out.length < n) throw new Error(`upCrossings：积了 ${maxSteps} 步只找到 ${out.length} 个过零点`);
  return out;
}

/** 平均周期：第 1 个和第 n+1 个向上过零之间的时间除以 n。 */
export function periodOf(f: Rhs, y0: number[], idx: number, h: number, n = 10, t0 = 0): number {
  const c = upCrossings(f, y0, idx, h, n + 1, t0);
  return (c[n] - c[0]) / n;
}

/**
 * 从 t0 起积分，记下 y[idx] 的极大值：导数分量 y[dIdx] 由正变成非正的地方，在那一步里二分出时刻。
 * 返回前 n 个极大值的时刻和那时的状态。
 */
export function maxima(f: Rhs, y0: number[], idx: number, dIdx: number, h: number, n: number, t0 = 0, maxSteps = 5e7): { t: number; value: number; y: number[] }[] {
  const out: { t: number; value: number; y: number[] }[] = [];
  let t = t0;
  let y = [...y0];
  for (let i = 0; i < maxSteps && out.length < n; i++) {
    const yn = rk4Step(f, t, y, h);
    if (y[dIdx] > 0 && yn[dIdx] <= 0) {
      let lo = 0;
      let hi = h;
      for (let k = 0; k < 200; k++) {
        const mid = (lo + hi) / 2;
        if (mid === lo || mid === hi) break;
        if (rk4Step(f, t, y, mid)[dIdx] > 0) lo = mid;
        else hi = mid;
      }
      const ys = rk4Step(f, t, y, hi);
      out.push({ t: t + hi, value: ys[idx], y: ys });
    }
    t += h;
    y = yn;
  }
  if (out.length < n) throw new Error(`maxima：积了 ${maxSteps} 步只找到 ${out.length} 个极大值`);
  return out;
}

/**
 * 积分 dy/dt = f(t, y)，等步长 RK4，返回可以查任意时刻的函数（相邻节点之间对每个分量做三次埃尔米特插值，
 * 导数取 f 在节点上的值；误差和 RK4 本身同阶）。
 */
export function trajectory(f: Rhs, y0: number[], t0: number, t1: number, steps: number): (t: number) => number[] {
  const h = (t1 - t0) / steps;
  const ys: number[][] = [y0.slice()];
  const ds: number[][] = [f(t0, y0)];
  let y = y0.slice();
  for (let i = 0; i < steps; i++) {
    y = rk4Step(f, t0 + i * h, y, h);
    ys.push(y);
    ds.push(f(t0 + (i + 1) * h, y));
  }
  return (t: number) => {
    const s = Math.min(Math.max((t - t0) / h, 0), steps);
    const i = Math.min(Math.floor(s), steps - 1);
    const u = s - i;
    const h00 = 2 * u ** 3 - 3 * u ** 2 + 1;
    const h10 = u ** 3 - 2 * u ** 2 + u;
    const h01 = -2 * u ** 3 + 3 * u ** 2;
    const h11 = u ** 3 - u ** 2;
    return ys[i].map((a, k) => h00 * a + h10 * h * ds[i][k] + h01 * ys[i + 1][k] + h11 * h * ds[i + 1][k]);
  };
}

/**
 * 把 g(t) 在 [t0, t0 + 周期数 × 2π/ω] 上投影到 cos ωt、sin ωt，写成 g ≈ A cos(ωt + φ)（φ 在 (−π, π]）。
 * g 正好是这个频率的正弦量（加上别的频率在整数个周期上平均为零的成分）时，结果是精确的。
 */
export function fitSinusoid(g: (t: number) => number, omega: number, t0: number, periods = 4): { A: number; phi: number } {
  const T = (2 * Math.PI) / omega;
  const t1 = t0 + periods * T;
  const panels = 32 * periods;
  const c = (2 / (t1 - t0)) * integrate((t) => g(t) * Math.cos(omega * t), t0, t1, panels);
  const s = (2 / (t1 - t0)) * integrate((t) => g(t) * Math.sin(omega * t), t0, t1, panels);
  // g = c cos ωt + s sin ωt = A cos(ωt + φ)：A cos φ = c，−A sin φ = s
  return { A: Math.hypot(c, s), phi: Math.atan2(-s, c) };
}

// ---------- 振子 ----------

/** m x″ + b x′ + k x = F(t) 的右端，状态 [x, v]。 */
export const oscillator = (m: number, b: number, k: number, F: (t: number) => number = () => 0): Rhs => (t, y) => [y[1], (F(t) - b * y[1] - k * y[0]) / m];

/**
 * 受迫振动 m x″ + b x′ + k x = F0 cos ωt 的稳态：从静止出发积分到暂态衰减到 tol 以下（e^{−bt/2m} < tol），
 * 再在 4 个周期上投影。返回振幅和相位（x ≈ A cos(ωt + φ)，φ ≤ 0 表示落后）。b = 0 时不能用。
 */
export function steadyState(m: number, b: number, k: number, F0: number, omega: number, tol = 1e-11): { A: number; phi: number } {
  const T = (2 * Math.PI) / omega;
  const tSettle = Math.ceil(((2 * m) / b) * Math.log(1 / tol) / T) * T;
  const w0 = Math.sqrt(k / m);
  const h = Math.min(T, (2 * Math.PI) / w0) / 400;
  const steps = Math.ceil((tSettle + 4 * T) / h);
  const traj = trajectory(oscillator(m, b, k, (t) => F0 * Math.cos(omega * t)), [0, 0], 0, steps * h, steps);
  return fitSinusoid((t) => traj(t)[0], omega, tSettle, 4);
}

// ---------- 简正模 ----------

/** 对称矩阵的雅可比法：返回本征值（从小到大）和对应的单位本征向量（vectors[i] 对应 values[i]）。 */
export function symEig(A: number[][]): { values: number[]; vectors: number[][] } {
  const n = A.length;
  const a = A.map((r) => r.slice());
  const V: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += a[p][q] ** 2;
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(a[p][q]) < 1e-300) continue;
        const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = a[k][p];
          const akq = a[k][q];
          a[k][p] = c * akp - s * akq;
          a[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = a[p][k];
          const aqk = a[q][k];
          a[p][k] = c * apk - s * aqk;
          a[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = V[k][p];
          const vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }
  const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => a[i][i] - a[j][j]);
  return { values: order.map((i) => a[i][i]), vectors: order.map((i) => V.map((row) => row[i])) };
}

/**
 * 小振动 M ẍ = −K x（M 是对角的质量）：化成 M^{−1/2} K M^{−1/2} 的本征问题。
 * 返回简正角频率（从小到大）和简正模（位移的比例，按最大分量为 1 归一，符号使第一个非零分量为正）。
 */
export function normalModes(K: number[][], masses: number[]): { omegas: number[]; modes: number[][] } {
  const r = masses.map((m) => 1 / Math.sqrt(m));
  const D = K.map((row, i) => row.map((kij, j) => r[i] * kij * r[j]));
  const { values, vectors } = symEig(D);
  const modes = vectors.map((v) => {
    const x = v.map((vi, i) => vi * r[i]);
    const big = x.reduce((s, xi) => (Math.abs(xi) > Math.abs(s) ? xi : s), 0);
    const first = x.find((xi) => Math.abs(xi) > 1e-12 * Math.abs(big)) ?? 1;
    const sgn = Math.sign(first);
    return x.map((xi) => (sgn * xi) / Math.abs(big));
  });
  return { omegas: values.map((w2) => Math.sqrt(Math.max(w2, 0))), modes };
}

/** N 个质量 m 的小球，间距 a，张力 T，两端固定：横向小振动的刚度矩阵（k = T/a 的三对角矩阵）。 */
export function beadedStringK(N: number, T: number, a: number): number[][] {
  const k = T / a;
  return Array.from({ length: N }, (_, i) => Array.from({ length: N }, (_, j) => (i === j ? 2 * k : Math.abs(i - j) === 1 ? -k : 0)));
}

/** 对称三对角矩阵（对角线 d、次对角线 e）小于 λ 的本征值个数：斯图姆序列，即 LDLᵀ 分解里负的主元个数。 */
export function sturmCount(d: number[], e: number[], lambda: number): number {
  let count = 0;
  let q = 1;
  for (let i = 0; i < d.length; i++) {
    q = d[i] - lambda - (i > 0 ? (e[i - 1] * e[i - 1]) / q : 0);
    if (q === 0) q = Number.EPSILON * (Math.abs(d[i]) + Math.abs(lambda));
    if (q < 0) count++;
  }
  return count;
}

/**
 * 两端固定、长 L、线密度 μ、张力 T 的弦分成 n 段（n − 1 个小球，每个质量 μL/n）时最低的简正角频率：
 * 对每个小球列牛顿第二定律得到三对角矩阵，用斯图姆序列二分出最小本征值，不用讲解里的 sin 公式。
 */
export function chainLowestOmega(n: number, T: number, mu: number, L: number): number {
  const a = L / n;
  const k = T / a;
  const m = mu * a;
  const d = Array.from({ length: n - 1 }, () => (2 * k) / m);
  const e = Array.from({ length: n - 2 }, () => -k / m);
  return Math.sqrt(bisect((x) => sturmCount(d, e, x) - 0.5, 0, (4 * k) / m));
}

/** 连续弦（两端固定）的最低简正角频率：n = 100、200、400 段的链做两次理查森外推（误差是 1/n² 的幂级数）。 */
export function stringLowestOmega(T: number, mu: number, L: number): number {
  const w = [100, 200, 400].map((n) => chainLowestOmega(n, T, mu, L));
  const r = [(4 * w[1] - w[0]) / 3, (4 * w[2] - w[1]) / 3];
  return (16 * r[1] - r[0]) / 15;
}

// ---------- 单摆 ----------

/** 算术-几何平均。 */
export function agm(a: number, b: number): number {
  let x = a;
  let y = b;
  for (let i = 0; i < 60 && Math.abs(x - y) > 1e-16 * x; i++) [x, y] = [(x + y) / 2, Math.sqrt(x * y)];
  return (x + y) / 2;
}

/** 单摆（摆长 l、振幅 θ0）的精确周期：T = 2π√(l/g) / AGM(1, cos(θ0/2))。 */
export const pendulumPeriod = (theta0: number, l: number, g: number): number => (2 * Math.PI * Math.sqrt(l / g)) / agm(1, Math.cos(theta0 / 2));

/** 单摆周期的第二种算法：积分 θ″ = −(g/l) sin θ，从 θ0 静止放开，θ 第一次到零用的时间乘 4。 */
export function pendulumPeriodODE(theta0: number, l: number, g: number, steps = 20000): number {
  const w2 = g / l;
  const T0 = 2 * Math.PI / Math.sqrt(w2);
  const h = T0 / steps;
  // θ 从 θ0 减到 0：用 −θ 由负变非负当事件
  const rhs: Rhs = (_t, y) => [y[1], -w2 * Math.sin(y[0])];
  let t = 0;
  let y = [theta0, 0];
  for (let i = 0; i < 100 * steps; i++) {
    const yn = rk4Step(rhs, t, y, h);
    if (y[0] > 0 && yn[0] <= 0) {
      let lo = 0;
      let hi = h;
      for (let k = 0; k < 200; k++) {
        const mid = (lo + hi) / 2;
        if (mid === lo || mid === hi) break;
        if (rk4Step(rhs, t, y, mid)[0] > 0) lo = mid;
        else hi = mid;
      }
      return 4 * (t + hi);
    }
    t += h;
    y = yn;
  }
  throw new Error('pendulumPeriodODE：没有过零');
}

// ---------- 波 ----------

/** u(x, t) 在 (x, t) 处 u_tt − v² u_xx 的数值值（中心差分，步长 h），验证某个函数满足波动方程。 */
export function waveResidual(u: (x: number, t: number) => number, v: number, x: number, t: number, h = 1e-3): number {
  const utt = (u(x, t + h) - 2 * u(x, t) + u(x, t - h)) / (h * h);
  const uxx = (u(x + h, t) - 2 * u(x, t) + u(x - h, t)) / (h * h);
  return utt - v * v * uxx;
}
