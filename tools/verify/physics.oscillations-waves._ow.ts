// 振动与波验算脚本的公用部分（文件名以下划线开头，npm run verify 不把它当成小节脚本）。
// 第二套算法的主要办法：不用讲解里解出来的式子，把运动方程交给四阶龙格-库塔法一步步积分，再从数值解里量出
// 周期（向上过零的时刻）、振幅和衰减（相邻的极大值）、稳态的振幅和相位（在整数个周期上投影到 cos、sin）；
// 简正频率和简正模用雅可比方法直接求对称矩阵的本征值，连续弦的最低频率用斯图姆序列求细分的链、再做理查森外推；
// 单摆的精确周期用算术-几何平均，再和直接积分的周期核对。
// 批次 23 加的：弦用一串小球近似、蛙跳法积分（量反射、透射的脉冲和能量）；数波峰求多普勒频率；斯图姆序列求驻波第 k 个模
// （右端可自由）；对称势能里的周期用换元后的高斯积分；三维波动方程的差分残差；链的色散关系和它的模拟核对。
// agree、argmax、check、chosen、bisect、rk4、rk4Step、rk4Until、solveLinear、integrate 借用电磁学的辅助文件。

import { argmax, bisect, integrate, rk4Step } from './physics.electromagnetism._es.ts';

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

// ---------- 批次 23：简谐波、色散、多普勒、非线性振动、反射透射、能量、三维、驻波 ----------

/** 三维的 u_tt − v²∇²u（中心差分，步长 h），验证球面波这类函数满足三维波动方程。 */
export function waveResidual3D(u: (x: number, y: number, z: number, t: number) => number, v: number, p: [number, number, number], t: number, h = 1e-3): number {
  const [x, y, z] = p;
  const c = u(x, y, z, t);
  const utt = (u(x, y, z, t + h) - 2 * c + u(x, y, z, t - h)) / (h * h);
  const lap = (u(x + h, y, z, t) + u(x - h, y, z, t) + u(x, y + h, z, t) + u(x, y - h, z, t) + u(x, y, z + h, t) + u(x, y, z - h, t) - 6 * c) / (h * h);
  return utt - v * v * lap;
}

/** g 在 [t0, t0 + T] 上的时间平均（高斯-勒让德积分）。 */
export const timeAverage = (g: (t: number) => number, T: number, t0 = 0, panels = 64): number => integrate(g, t0, t0 + T, panels) / T;

/** 弦的阻抗 Z = √(Tμ)（等于 T/v，也等于 μv）。 */
export const impedance = (T: number, mu: number): number => Math.sqrt(T * mu);

/** 一维链（质量 m、间距 a、张力 T）的色散关系 ω(k) = 2√(T/(ma))·|sin(ka/2)|。 */
export const chainDispersion = (k: number, T: number, m: number, a: number): number => 2 * Math.sqrt(T / (m * a)) * Math.abs(Math.sin((k * a) / 2));

/**
 * 色散关系的第二套算法：N 个小球连成一圈（周期边界），以波数 k = 2πp/(Na) 的余弦形状由静止放开，
 * RK4 积分、量第 0 个小球的周期，换算成角频率。不用色散关系的式子。
 * k0 是每个小球另连到地面的弹簧（弹性基底），连续极限下给出 ω² = v²k² + k0/m。
 */
export function ringModeOmega(N: number, T: number, m: number, a: number, p: number, periods = 4, k0 = 0): number {
  const k = (2 * Math.PI * p) / (N * a);
  const ks = T / a;
  const rhs: Rhs = (_t, s) => {
    const out = new Array<number>(2 * N);
    for (let j = 0; j < N; j++) {
      out[j] = s[N + j];
      out[N + j] = (ks * (s[(j + 1) % N] - 2 * s[j] + s[(j + N - 1) % N]) - k0 * s[j]) / m;
    }
    return out;
  };
  const y0 = [...Array.from({ length: N }, (_, j) => Math.cos(k * j * a)), ...new Array<number>(N).fill(0)];
  const wMax = Math.sqrt((4 * ks + k0) / m);
  return (2 * Math.PI) / periodOf(rhs, y0, 0, (2 * Math.PI) / wMax / 400, periods);
}

/** 第一类完全椭圆积分 K(q) = ∫_0^{π/2} du/√(1 − q² sin²u)，用算术-几何平均：K = π/(2·AGM(1, √(1 − q²)))。 */
export const ellipticK = (q: number): number => Math.PI / (2 * agm(1, Math.sqrt(1 - q * q)));

/**
 * 静止的观察者在 xo，波源沿 xs(t) 运动、一直在发声：t_e 时刻发出的声音在 t_e + |xo − xs(t_e)|/v 到达。
 * 返回 [tLo, tHi] 里最早到达的时刻和对应的发声时刻（先粗扫，再黄金分割）。波源超音速时，这就是激波（音爆）到达的时刻。
 */
export function earliestArrival(v: number, xs: (t: number) => number[], xo: number[], tLo: number, tHi: number, scan = 2000): { tArrive: number; tEmit: number } {
  const ta = (te: number) => te + Math.hypot(...xs(te).map((pi, i) => pi - xo[i])) / v;
  let best = tLo;
  for (let i = 0; i <= scan; i++) {
    const te = tLo + ((tHi - tLo) * i) / scan;
    if (ta(te) < ta(best)) best = te;
  }
  const h = (tHi - tLo) / scan;
  const te = argmax((s) => -ta(s), Math.max(tLo, best - h), Math.min(tHi, best + h));
  return { tArrive: ta(te), tEmit: te };
}

/**
 * 一串小球近似的弦：节点 x_j = jL/n（j = 0..n），张力 T 处处相同，每个节点的质量取它那一格（端点半格）的线密度积分，
 * 所以线密度在某个节点处跳变时，那个节点正好分到两边各半格。两端可以固定或自由（自由端只连一边）。
 * 用速度 Verlet（蛙跳法）积分；dtMax 是半个 a/v_max，稳定、能量误差小。
 */
export interface StringSim {
  x: number[];
  y: Float64Array;
  v: Float64Array;
  t: number;
  dtMax: number;
  step(dt: number): void;
  /** 总能量：各节点的动能加上每一段的弹性势能 ½(T/a)(Δy)²。 */
  energy(): number;
}

export function stringSim(o: { L: number; n: number; T: number; mu: (x: number) => number; y0: (x: number) => number; v0?: (x: number) => number; left?: 'fixed' | 'free'; right?: 'fixed' | 'free' }): StringSim {
  const { L, n, T } = o;
  const a = L / n;
  const ks = T / a;
  const left = o.left ?? 'fixed';
  const right = o.right ?? 'fixed';
  const x = Array.from({ length: n + 1 }, (_, j) => j * a);
  const cell = (j: number) => integrate(o.mu, j === 0 ? 0 : x[j] - a / 2, j === n ? L : x[j] + a / 2, 2, 8);
  const m = Float64Array.from({ length: n + 1 }, (_, j) => cell(j));
  const y = Float64Array.from(x, (xx) => o.y0(xx));
  const v = Float64Array.from(x, (xx) => (o.v0 ? o.v0(xx) : 0));
  const pinned = (j: number) => (j === 0 && left === 'fixed') || (j === n && right === 'fixed');
  for (const j of [0, n]) if (pinned(j)) y[j] = v[j] = 0;
  const acc = new Float64Array(n + 1);
  const computeAcc = () => {
    for (let j = 0; j <= n; j++) {
      if (pinned(j)) {
        acc[j] = 0;
        continue;
      }
      let f = 0;
      if (j > 0) f += ks * (y[j - 1] - y[j]);
      if (j < n) f += ks * (y[j + 1] - y[j]);
      acc[j] = f / m[j];
    }
  };
  computeAcc();
  const vMax = Math.max(...x.map((xx) => Math.sqrt(T / o.mu(xx))));
  const sim: StringSim = {
    x,
    y,
    v,
    t: 0,
    dtMax: (0.5 * a) / vMax,
    step(dt: number) {
      for (let j = 0; j <= n; j++) v[j] += 0.5 * dt * acc[j];
      for (let j = 0; j <= n; j++) y[j] += dt * v[j];
      computeAcc();
      for (let j = 0; j <= n; j++) v[j] += 0.5 * dt * acc[j];
      sim.t += dt;
    },
    energy() {
      let e = 0;
      for (let j = 0; j <= n; j++) e += 0.5 * m[j] * v[j] * v[j];
      for (let j = 0; j < n; j++) e += 0.5 * ks * (y[j + 1] - y[j]) ** 2;
      return e;
    },
  };
  return sim;
}

/**
 * 张力 T 的两根弦在 x = X 处相接（左边线密度 mu1、右边 mu2），从左边射来高 1、宽 s 的高斯脉冲（t = 0 时中心在 x0），
 * 用 stringSim 积分到 tEnd（默认是入射脉冲中心到达连接处以后再过 5s/v1：反射、透射的脉冲都已离开连接处，又都没碰到两端）。
 * 返回弦 1、弦 2 上位移绝对值最大处的带符号的值和位置，两边各自的能量（不含连接处那个节点的动能分界误差），以及开始时的总能量。
 */
export function pulseAtJunction(o: { mu1: number; mu2: number; T?: number; L?: number; X?: number; x0?: number; s?: number; n?: number; tEnd?: number }): { left: number; right: number; xLeft: number; xRight: number; eLeft: number; eRight: number; e0: number; sim: StringSim } {
  const T = o.T ?? 1;
  const L = o.L ?? 2;
  const X = o.X ?? 1;
  const x0 = o.x0 ?? 0.5;
  const s = o.s ?? 0.04;
  const v1 = Math.sqrt(T / o.mu1);
  const mu = (x: number) => (x < X ? o.mu1 : o.mu2);
  const f = (x: number) => Math.exp(-(((x - x0) / s) ** 2));
  const sim = stringSim({ L, n: o.n ?? 8000, T, mu, y0: f, v0: (x) => ((2 * v1 * (x - x0)) / (s * s)) * f(x) });
  const e0 = sim.energy();
  runString(sim, o.tEnd ?? (X - x0 + 5 * s) / v1);
  const n = sim.x.length - 1;
  const a = L / n;
  let left = 0;
  let right = 0;
  let xLeft = 0;
  let xRight = 0;
  for (let j = 0; j <= n; j++) {
    const xj = sim.x[j];
    if (xj < X - 1e-12 && Math.abs(sim.y[j]) > Math.abs(left)) [left, xLeft] = [sim.y[j], xj];
    if (xj > X + 1e-12 && Math.abs(sim.y[j]) > Math.abs(right)) [right, xRight] = [sim.y[j], xj];
  }
  let eLeft = 0;
  let eRight = 0;
  for (let j = 0; j < n; j++) {
    const mid = (sim.x[j] + sim.x[j + 1]) / 2;
    const de = 0.5 * mu(mid) * a * ((sim.v[j] + sim.v[j + 1]) / 2) ** 2 + ((0.5 * T) / a) * (sim.y[j + 1] - sim.y[j]) ** 2;
    if (mid < X) eLeft += de;
    else eRight += de;
  }
  return { left, right, xLeft, xRight, eLeft, eRight, e0, sim };
}

/** 把弦的模拟推进到 tEnd（步长不超过 dtMax，最后一步正好落在 tEnd）。 */
export function runString(sim: StringSim, tEnd: number): StringSim {
  const steps = Math.ceil((tEnd - sim.t) / sim.dtMax);
  const dt = (tEnd - sim.t) / steps;
  for (let i = 0; i < steps; i++) sim.step(dt);
  return sim;
}

/**
 * 数波峰：介质静止、波速 v。波源在 te_i = t0 + i/f 时刻位于 xs(te_i)，发出第 i 个波峰；观察者的位置是 xo(t)。
 * 第 i 个波峰到达观察者的时刻 t 满足 |xo(t) − xs(te_i)| = v(t − te_i)，二分求出。位置是任意维数的数组。
 * 要求波源、观察者都比波慢（每个波峰只追上观察者一次）。
 */
export function crestArrivals(v: number, f: number, xs: (t: number) => number[], xo: (t: number) => number[], count: number, t0 = 0): number[] {
  const dist = (p: number[], q: number[]) => Math.hypot(...p.map((pi, i) => pi - q[i]));
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const te = t0 + i / f;
    const src = xs(te);
    const g = (t: number) => dist(xo(t), src) - v * (t - te);
    if (g(te) <= 0) {
      out.push(te);
      continue;
    }
    let hi = te + 1 / f;
    for (let k = 0; k < 200 && g(hi) > 0; k++) hi = te + 2 * (hi - te);
    out.push(bisect(g, te, hi));
  }
  return out;
}

/** 由相邻波峰的到达时刻求接收到的频率：第一个到最后一个之间的平均。 */
export const receivedFrequency = (arrivals: number[]): number => (arrivals.length - 1) / (arrivals[arrivals.length - 1] - arrivals[0]);

/**
 * 张力 T、线密度 μ、长 L 的弦分成 n 段，左端固定、右端固定或自由，第 k 个简正角频率（k 从 1 起），斯图姆序列二分。
 * 自由端的小球取半格的质量、只连左边一段：这样离散的模正好是长 2L、两端固定的链里关于中点对称的那些，误差仍是 1/n² 的幂级数。
 */
export function chainOmega(n: number, T: number, mu: number, L: number, k: number, right: 'fixed' | 'free' = 'fixed'): number {
  const a = L / n;
  const ks = T / a;
  const m = mu * a;
  const N = right === 'fixed' ? n - 1 : n;
  const d = Array.from({ length: N }, () => (2 * ks) / m);
  const e = Array.from({ length: N - 1 }, () => -ks / m);
  if (right === 'free') e[N - 2] = (-Math.SQRT2 * ks) / m; // 末端质量 m/2、只连一根：K/M 的对角仍是 2ks/m，次对角是 −ks/√(m·m/2)
  return Math.sqrt(bisect((x) => sturmCount(d, e, x) - (k - 0.5), 0, (5 * ks) / m));
}

/** 连续弦的第 k 个简正角频率（左端固定，右端固定或自由）：n = 100、200、400 段的链做两次理查森外推。 */
export function stringOmega(T: number, mu: number, L: number, k: number, right: 'fixed' | 'free' = 'fixed'): number {
  const w = [100, 200, 400].map((n) => chainOmega(n, T, mu, L, k, right));
  const r = [(4 * w[1] - w[0]) / 3, (4 * w[2] - w[1]) / 3];
  return (16 * r[1] - r[0]) / 15;
}

/**
 * 对称势能 U（U(−x) = U(x)，x = 0 处极小）里振幅为 A 的周期 T = 4∫_0^A dx/√(2(U(A) − U(x))/m)。
 * 换元 x = A sin u 去掉端点的奇异性，再做高斯-勒让德积分；不用椭圆积分、不用级数。
 */
export function periodFromPotential(U: (x: number) => number, A: number, m = 1, panels = 64): number {
  const UA = U(A);
  return 4 * integrate((u) => (A * Math.cos(u)) / Math.sqrt((2 * (UA - U(A * Math.sin(u)))) / m), 0, Math.PI / 2, panels);
}
