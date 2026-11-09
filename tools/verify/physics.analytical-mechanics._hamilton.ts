// 哈密顿力学各节（批次 2）验算脚本共用的数值工具：正则方程、泊松括号、相流、作用量积分、参数缓慢变化的模拟。
// 文件名第三段以下划线开头，npm run verify 不把它当成小节的验算脚本（见 index.ts 的文件名规则）。
//
// 偏导数一律数值地求（中心差分加理查森外推，见 _mech.ts 的 derivative），不用讲解或题目里推好的式子；
// 积分一律用 RK4 固定步长。泊松括号按本领域的定义：{f, g} = Σ (∂f/∂q ∂g/∂p − ∂f/∂p ∂g/∂q)。

import type { Derivative } from '../../packages/anim/src/ode.ts';
import { derivative, integrateTo, integrateUntil, type Vec } from './physics.analytical-mechanics._mech.ts';

/** 哈密顿量 H(q, p, t)，q、p 各 n 个分量。 */
export type Hamiltonian = (q: Vec, p: Vec, t: number) => number;
/** 相空间上的函数 f(q, p, t)。 */
export type PhaseFunction = (q: Vec, p: Vec, t: number) => number;

const bump = (x: Vec, k: number, s: number): Vec => x.map((xi, i) => (i === k ? xi + s : xi));

export const dq = (f: PhaseFunction, q: Vec, p: Vec, t: number, k: number): number =>
  derivative((s) => f(bump(q, k, s), p, t), 0);
export const dp = (f: PhaseFunction, q: Vec, p: Vec, t: number, k: number): number =>
  derivative((s) => f(q, bump(p, k, s), t), 0);
export const dt = (f: PhaseFunction, q: Vec, p: Vec, t: number): number => derivative((s) => f(q, p, t + s), 0);

/** 泊松括号 {f, g}，偏导数数值地求。 */
export function poisson(f: PhaseFunction, g: PhaseFunction, q: Vec, p: Vec, t = 0): number {
  let s = 0;
  for (let k = 0; k < q.length; k++) s += dq(f, q, p, t, k) * dp(g, q, p, t, k) - dp(f, q, p, t, k) * dq(g, q, p, t, k);
  return s;
}

const split = (y: Float64Array): [Vec, Vec] => {
  const n = y.length / 2;
  return [Array.from(y.subarray(0, n)), Array.from(y.subarray(n, 2 * n))];
};

/** 正则方程 q̇ = ∂H/∂p、ṗ = −∂H/∂q 的右边，状态 y = [q, p]，偏导数数值地求。 */
export function canonical(H: Hamiltonian): Derivative {
  return (t, y, out) => {
    const [q, p] = split(y);
    for (let k = 0; k < q.length; k++) {
      out[k] = dp(H, q, p, t, k);
      out[q.length + k] = -dq(H, q, p, t, k);
    }
  };
}

/**
 * 在状态后面多挂一个分量 J，J̇ = rate(q, p, t)：积分到哪里，J 就是 rate 沿运动对时间的积分。
 * 用来算 ∮p dq（rate = p q̇）、一个周期里的时间积分（rate = 被平均的量）。
 */
export function withIntegral(f: Derivative, n: number, rate: (q: Vec, p: Vec, t: number, qd: Vec) => number): Derivative {
  const inner = new Float64Array(2 * n);
  const innerOut = new Float64Array(2 * n);
  return (t, y, out) => {
    for (let i = 0; i < 2 * n; i++) inner[i] = y[i];
    f(t, inner, innerOut);
    for (let i = 0; i < 2 * n; i++) out[i] = innerOut[i];
    const [q, p] = split(inner);
    out[2 * n] = rate(q, p, t, Array.from(innerOut.subarray(0, n)));
  };
}

/**
 * 一个自由度的周期运动：从 q = 0、p > 0 的状态出发，定位 q 第二次回到 0 的时刻（一个周期）。
 * 返回周期和那一刻的状态（含挂上去的积分分量）。
 */
export function onePeriod(f: Derivative, y0: Vec, t0: number, step: number, tMax: number): { T: number; y: Float64Array } {
  const half = integrateUntil(f, y0, t0, step, tMax, (_t, y) => y[0]);
  if (!half) throw new Error('半个周期内 q 没有回到 0');
  // 先离开 q = 0 一小段：半周期处的 q 只是舍入到 0 附近，符号不定，直接接着找会把它当成一次变号
  const nudge = 10 * step;
  const away = integrateTo(f, Array.from(half.y), half.t, half.t + nudge, step);
  const full = integrateUntil(f, Array.from(away), half.t + nudge, step, tMax, (_t, y) => y[0]);
  if (!full) throw new Error('一个周期内 q 没有回到 0');
  return { T: full.t - t0, y: full.y };
}

/** 相流 g_{t0→t1} 在 y0 处的雅可比行列式：对初值做中心差分（2×2，一个自由度）。 */
export function flowJacobianDet(f: Derivative, y0: Vec, t0: number, t1: number, step: number, h = 1e-5): number {
  const col = (k: number): Vec => {
    const plus = integrateTo(f, y0.map((v, i) => (i === k ? v + h : v)), t0, t1, step);
    const minus = integrateTo(f, y0.map((v, i) => (i === k ? v - h : v)), t0, t1, step);
    return [0, 1].map((i) => (plus[i] - minus[i]) / (2 * h));
  };
  const a = col(0);
  const b = col(1);
  return a[0] * b[1] - a[1] * b[0];
}

/** 多边形的有向面积（鞋带公式），顶点按顺序给出。 */
export function polygonArea(pts: Vec[]): number {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    s += x1 * y2 - x2 * y1;
  }
  return s / 2;
}

/** 闭合折线的周长。 */
export function polygonPerimeter(pts: Vec[]): number {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    s += Math.hypot(x2 - x1, y2 - y1);
  }
  return s;
}

/**
 * 参数缓慢变化：λ(t) 从 a 平滑地变到 b，λ = a + (b − a)(1 + tanh(εt − 10))/2，t 从 0 到 20/ε。
 * tanh 处处光滑，两端的变化率小到 e^{−20} 量级，开始和结束时参数都可以看成不变。
 */
export function ramp(a: number, b: number, eps: number): { lambda: (t: number) => number; end: number } {
  return { lambda: (t) => a + ((b - a) * (1 + Math.tanh(eps * t - 10))) / 2, end: 20 / eps };
}
