// 批次 8 三节（能量-动量张量、电磁场张量、麦克斯韦方程组的协变形式）验算共用的工具。
// 文件名第三段以下划线开头，npm run verify 不把它当成小节的验算脚本。
//
// 两套互相独立的算法：
// 一是矩阵：4×4 的 Λ(β)，T′ = ΛTΛᵀ、F′ = ΛFΛᵀ。F 不照抄讲解里的矩阵，而是由洛伦兹力 K = γ_u(F·u/c, F)
//   对四个线性无关的四维速度反解出 Fη，再右乘 η。
// 二是不用张量变换式的算法：
//   - 场：在 S′ 里放试探电荷（q = 1），把它的四维速度用雷达法（批次 6 的 radar）变回 S，在 S 里按洛伦兹力算四维力，
//     再用雷达法变到 S′，读出 S′ 里的三维力；静止的试探电荷读出 E′，运动的读出 B′。
//   - 运动点电荷的场：李纳-维谢尔推迟势给出的场，只用推迟时间 c(t − t_r) = |r − r_q(t_r)|，不用洛伦兹变换。
//   - 光子气体：静止系里沿各个方向的光子束，每一束的数流四维矢量和四维动量都用雷达法变换，再把 nE 加起来。

import { bisect, radar, type Four } from './physics.special-relativity._relativity.ts';

export type V3 = [number, number, number];
export type M4 = number[][];

export const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale3 = (k: number, a: V3): V3 => [k * a[0], k * a[1], k * a[2]];
export const dot3 = (a: V3, b: V3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm3 = (a: V3): number => Math.hypot(a[0], a[1], a[2]);

// ---------- 一、矩阵 ----------

export const ETA: M4 = [
  [1, 0, 0, 0],
  [0, -1, 0, 0],
  [0, 0, -1, 0],
  [0, 0, 0, -1],
];

/** 沿单位矢量 n 方向、速度 β 的推进（作用在上标分量上）。 */
export function boostDir(beta: number, n: V3 = [1, 0, 0]): M4 {
  const len = norm3(n);
  const m = scale3(1 / len, n);
  const g = 1 / Math.sqrt(1 - beta * beta);
  const L: M4 = [[g, -g * beta * m[0], -g * beta * m[1], -g * beta * m[2]]];
  for (let i = 0; i < 3; i++) {
    const row = [-g * beta * m[i]];
    for (let j = 0; j < 3; j++) row.push((i === j ? 1 : 0) + (g - 1) * m[i] * m[j]);
    L.push(row);
  }
  return L;
}

export function mul(A: M4, B: M4): M4 {
  return A.map((row) => B[0].map((_, j) => row.reduce((s, a, k) => s + a * B[k][j], 0)));
}

export const transpose = (A: M4): M4 => A[0].map((_, j) => A.map((row) => row[j]));

export const apply = (A: M4, x: number[]): Four => A.map((row) => row.reduce((s, a, k) => s + a * x[k], 0)) as Four;

/** 高斯-若尔当消元求逆。 */
export function inv(A: M4): M4 {
  const n = A.length;
  const M = A.map((row, i) => [...row, ...row.map((_, j) => (i === j ? 1 : 0))]);
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    [M[col], M[piv]] = [M[piv], M[col]];
    const d = M[col][col];
    for (let j = 0; j < 2 * n; j++) M[col][j] /= d;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col];
      for (let j = 0; j < 2 * n; j++) M[r][j] -= f * M[col][j];
    }
  }
  return M.map((row) => row.slice(n));
}

/** 洛伦兹力的四维力（q = 1）：速度 u 时 K = γ_u(F·u/c, F)，F = E + u × B。 */
export function lorentzK(E: V3, B: V3, u: V3, c: number): Four {
  const g = 1 / Math.sqrt(1 - dot3(u, u) / (c * c));
  const F = add3(E, cross(u, B));
  return [(g * dot3(F, u)) / c, g * F[0], g * F[1], g * F[2]];
}

/** 由洛伦兹力反解 F^{μν}（q = 1）：四个线性无关的四维速度排成列 U、四维力排成列 K，K = (Fη)U，所以 Fη = KU⁻¹，F = (Fη)η。 */
export function tensorFromForce(E: V3, B: V3, c: number): M4 {
  const us: V3[] = [
    [0, 0, 0],
    [0.3 * c, 0, 0],
    [0, -0.5 * c, 0],
    [0.2 * c, 0.1 * c, 0.6 * c],
  ];
  const Ucols = us.map((u) => {
    const g = 1 / Math.sqrt(1 - dot3(u, u) / (c * c));
    return [g * c, g * u[0], g * u[1], g * u[2]];
  });
  const Kcols = us.map((u) => lorentzK(E, B, u, c));
  const U = transpose(Ucols);
  const K = transpose(Kcols);
  return mul(mul(K, inv(U)), ETA);
}

/** 按讲解的排法读回场：E_i = cF^{i0}，B_x = F^{32}，B_y = F^{13}，B_z = F^{21}。 */
export function fieldsOf(F: M4, c: number): { E: V3; B: V3 } {
  return { E: [c * F[1][0], c * F[2][0], c * F[3][0]], B: [F[3][2], F[1][3], F[2][1]] };
}

/** 方法一：S′ 相对 S 以 β 沿方向 n 运动，F′ = ΛFΛᵀ，读出 E′、B′。 */
export function fieldsByTensor(E: V3, B: V3, beta: number, c: number, n: V3 = [1, 0, 0]): { E: V3; B: V3 } {
  const L = boostDir(beta, n);
  return fieldsOf(mul(mul(L, tensorFromForce(E, B, c)), transpose(L)), c);
}

// ---------- 二、不用张量的变换式 ----------

/** 用雷达法把四维矢量的 (0, 1) 分量变到沿 x 轴以 β 运动的惯性系（c = 1，横向分量不变）。 */
export function boostTX(beta: number, A: Four): Four {
  const e = radar(beta, 1, { t: A[0], x: A[1] });
  return [e.t, e.x, A[2], A[3]];
}

/**
 * S′ 相对 S 以 β 沿 x 轴运动。S′ 里速度为 w 的试探电荷（q = 1）：四维速度用雷达法变回 S（S 相对 S′ 以 −β 运动），
 * 在 S 里按洛伦兹力算四维力，再用雷达法变到 S′，返回 S′ 里的三维力 K′/γ_w。
 */
export function forceInPrimed(E: V3, B: V3, beta: number, c: number, w: V3): V3 {
  const gw = 1 / Math.sqrt(1 - dot3(w, w) / (c * c));
  const Up: Four = [gw, (gw * w[0]) / c, (gw * w[1]) / c, (gw * w[2]) / c];
  const U = boostTX(-beta, Up);
  const u: V3 = [(c * U[1]) / U[0], (c * U[2]) / U[0], (c * U[3]) / U[0]];
  const K = lorentzK(E, B, u, c);
  const Kp = boostTX(beta, K);
  return [Kp[1] / gw, Kp[2] / gw, Kp[3] / gw];
}

/** 方法二：由 S′ 里试探电荷受的力读出 E′、B′。静止的读出 E′；沿 x 运动的给出 B′_y、B′_z，沿 y 运动的给出 B′_x。 */
export function fieldsByTestCharges(E: V3, B: V3, beta: number, c: number): { E: V3; B: V3 } {
  const w = 0.5 * c;
  const E1 = forceInPrimed(E, B, beta, c, [0, 0, 0]);
  const Fx = sub3(forceInPrimed(E, B, beta, c, [w, 0, 0]), E1);
  const Fy = sub3(forceInPrimed(E, B, beta, c, [0, w, 0]), E1);
  // F − E′ = w × B′：w 沿 x 时是 w(0, −B′_z, B′_y)，沿 y 时是 w(B′_z, 0, −B′_x)
  return { E: E1, B: [-Fy[2] / w, Fx[2] / w, -Fx[1] / w] };
}

/**
 * 匀速运动的点电荷的场（李纳-维谢尔，加速度为零）：k = q/(4πε₀)，速度 vel，t = 0 时在 r0。
 * 推迟时间 t_r 由 c(t − t_r) = |r − r_q(t_r)| 二分求出；E = k(1 − β²)(n − β)/(κ³R²)，κ = 1 − n·β，B = n × E/c。
 */
export function lwField(k: number, vel: V3, r0: V3, c: number, t: number, r: V3): { E: V3; B: V3 } {
  const pos = (s: number): V3 => add3(r0, scale3(s, vel));
  const d0 = norm3(sub3(r, pos(t)));
  const span = (2 * d0) / (c - norm3(vel));
  const tr = bisect((s) => c * (t - s) - norm3(sub3(r, pos(s))), t - span, t);
  const R = sub3(r, pos(tr));
  const len = norm3(R);
  const n = scale3(1 / len, R);
  const b = scale3(1 / c, vel);
  const kappa = 1 - dot3(n, b);
  const Ef = scale3((k * (1 - dot3(b, b))) / (kappa ** 3 * len * len), sub3(n, b));
  return { E: Ef, B: scale3(1 / c, cross(n, Ef)) };
}

/**
 * 各向同性的光子气体（c = 1，静止系里能量密度为 1），在它以 β 沿 x 轴运动的惯性系里的 T^{μν}。
 * 方向余弦 μ = cos θ 在 [−1, 1] 上均匀分布（各向同性）；每一束的数流 N = n(1, n̂) 和四维动量 P = E(1, n̂)
 * 都用雷达法变换（观察者相对气体以 −β 运动），T^{μν} = Σ N^μ P^ν。辛普森公式，被积函数是 μ 的二次式，结果精确。
 */
export function photonGasT(beta: number, N = 200): M4 {
  const T: M4 = [0, 1, 2, 3].map(() => [0, 0, 0, 0]);
  const h = 2 / N;
  for (let i = 0; i <= N; i++) {
    const mu = -1 + i * h;
    const w = ((i === 0 || i === N ? 1 : i % 2 === 1 ? 4 : 2) * h) / 3 / 2;
    const s = Math.sqrt(Math.max(0, 1 - mu * mu));
    const dir: Four = [1, mu, s, 0];
    const Nl = boostTX(-beta, dir);
    const Pl = boostTX(-beta, dir);
    for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) T[a][b] += w * Nl[a] * Pl[b];
  }
  return T;
}
