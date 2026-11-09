// 刚体各节（批次 3）验算脚本共用的工具：3×3 矩阵、转动矩阵和欧拉角、由取向随时间的变化数值地求角速度，
// 以及直接按 L̇ = τ 积分刚体的转动。
// 文件名第三段以下划线开头，npm run verify 不把它当成小节的验算脚本（见 index.ts 的文件名规则）。
//
// 角速度不用讲解里的 Ω = ṘRᵀ，而由体坐标轴的速度求：刚体上每一点 ṙ = ω × r，三根正交规范的体坐标轴
// 满足 Σ_k e'_k × ė'_k = Σ_k (ω − (e'_k·ω) e'_k) = 2ω。转动按角动量定理 L̇ = τ（对固定点或质心）和
// ė'_k = ω × e'_k 积分，ω 由 L = Iω 解出（空间坐标轴下 I = R I' Rᵀ），不用欧拉方程。

import type { Derivative } from '../../packages/anim/src/ode.ts';
import { derivative, dot, solve, type Mat, type Vec } from './physics.analytical-mechanics._mech.ts';

export const matMul = (A: Mat, B: Mat): Mat =>
  A.map((row) => B[0].map((_, j) => row.reduce((s, a, k) => s + a * B[k][j], 0)));
export const transpose = (A: Mat): Mat => A[0].map((_, j) => A.map((row) => row[j]));
export const matVec = (A: Mat, v: Vec): Vec => A.map((row) => dot(row, v));
export const cross = (a: Vec, b: Vec): Vec => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const norm = (v: Vec): number => Math.hypot(...v);
export const det3 = (A: Mat): number => dot(A[0], cross(A[1], A[2]));
export const column = (A: Mat, k: number): Vec => A.map((row) => row[k]);
export const diag = (d: Vec): Mat => d.map((x, i) => d.map((_, j) => (i === j ? x : 0)));

/** 绕 z、x、y 轴按右手方向转 a 角。 */
export const Rz = (a: number): Mat => [
  [Math.cos(a), -Math.sin(a), 0],
  [Math.sin(a), Math.cos(a), 0],
  [0, 0, 1],
];
export const Rx = (a: number): Mat => [
  [1, 0, 0],
  [0, Math.cos(a), -Math.sin(a)],
  [0, Math.sin(a), Math.cos(a)],
];
export const Ry = (a: number): Mat => [
  [Math.cos(a), 0, Math.sin(a)],
  [0, 1, 0],
  [-Math.sin(a), 0, Math.cos(a)],
];

/** z-x-z 欧拉角：R_z(φ) R_x(θ) R_z(ψ)。 */
export const eulerMatrix = (phi: number, theta: number, psi: number): Mat => matMul(matMul(Rz(phi), Rx(theta)), Rz(psi));

/** 取向 R(t) 在时刻 t 的角速度（空间分量）：ω = ½ Σ_k e'_k × ė'_k，ė'_k 是 R 的第 k 列数值求导。 */
export function angularVelocity(R: (t: number) => Mat, t: number): Vec {
  const R0 = R(t);
  let w = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    const ed = [0, 1, 2].map((i) => derivative((s) => R(s)[i][k], t));
    const c = cross(column(R0, k), ed);
    w = w.map((wi, i) => wi + c[i] / 2);
  }
  return w;
}

// ---------- 按 L̇ = τ 积分刚体的转动 ----------

/** 刚体转动的状态：R 的 9 个元素（按行），再接 L 的 3 个空间分量。 */
export const rigidState = (R: Mat, L: Vec): Vec => [...R.flat(), ...L];
export const stateR = (y: ArrayLike<number>): Mat => [
  [y[0], y[1], y[2]],
  [y[3], y[4], y[5]],
  [y[6], y[7], y[8]],
];
export const stateL = (y: ArrayLike<number>): Vec => [y[9], y[10], y[11]];

/** 状态 y 下的角速度（空间分量）：解 R I' Rᵀ ω = L，I' 是体坐标轴下的惯性张量。 */
export function omegaOf(Ibody: Mat, y: ArrayLike<number>): Vec {
  const R = stateR(y);
  const w = solve(matMul(matMul(R, Ibody), transpose(R)), stateL(y));
  if (!w) throw new Error('惯性张量奇异');
  return w;
}

/** 角速度的体分量 ω' = Rᵀω。 */
export const bodyOmegaOf = (Ibody: Mat, y: ArrayLike<number>): Vec => matVec(transpose(stateR(y)), omegaOf(Ibody, y));

/** 刚体绕固定点（或质心）转动：Ṙ 的第 k 列是 ω × e'_k，L̇ = τ；torque 给出外力矩的空间分量，省略时是自由刚体。 */
export function rigidDerivative(Ibody: Mat, torque?: (R: Mat, L: Vec, t: number) => Vec): Derivative {
  return (t, y, out) => {
    const R = stateR(y);
    const w = omegaOf(Ibody, y);
    for (let k = 0; k < 3; k++) {
      const d = cross(w, column(R, k));
      for (let i = 0; i < 3; i++) out[3 * i + k] = d[i];
    }
    const tau = torque ? torque(R, stateL(y), t) : [0, 0, 0];
    for (let i = 0; i < 3; i++) out[9 + i] = tau[i];
  };
}
