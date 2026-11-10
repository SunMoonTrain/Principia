// 独立验算 math.calculus-of-variations.holonomic-constraints 的 p1–p4（简单题、中等题）。
// 最短路径不用测地线方程，也不用展开图：把路径换成落在曲面上的 N 段折线（节点用曲面的两个参数表示，
// 两端固定），对各段弦长的平方和求极小（带阻尼的牛顿法，梯度解析地写，黑塞矩阵由梯度差分），再量弦长之和，N 和 2N 外推。
// 另一种算法是展开图或球面上的夹角公式，两者核对。完整约束的选择题按定义逐条看：约束是不是逐点成立、含不含导数。
// 单独运行：npx tsx tools/verify/math.calculus-of-variations.holonomic-constraints.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, richardson, solve, type Vec } from './math.calculus-of-variations._variational.ts';

type P3 = [number, number, number];
type Surface = (a: number, b: number) => P3;

const sub = (u: P3, v: P3): P3 => [u[0] - v[0], u[1] - v[1], u[2] - v[2]];
const norm = (u: P3): number => Math.hypot(u[0], u[1], u[2]);
const dot = (u: P3, v: P3): number => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];

/**
 * 曲面上从参数 start 到 end 的离散测地线的长度。直接对弦长之和求极小不行：节点会挤到一起，让一段弦从曲面内部穿过去。
 * 所以对「能量」Σ|P_{i+1} − P_i|² 求极小（极小时各段弦一样长），再量弦长之和；误差按 1/N² 变小。init(t) 给出初始猜测（t ∈ [0, 1]）。
 */
function shortestPolyline(S: Surface, start: [number, number], end: [number, number], N: number, init: (t: number) => [number, number]): number {
  const n = 2 * (N - 1);
  const params = (u: Vec): [number, number][] => [start, ...Array.from({ length: N - 1 }, (_, i) => [u[2 * i], u[2 * i + 1]] as [number, number]), end];
  const chords = (u: Vec): number[] => {
    const pts = params(u).map(([a, b]) => S(a, b));
    return Array.from({ length: N }, (_, i) => norm(sub(pts[i + 1], pts[i])));
  };
  const energy = (u: Vec): number => chords(u).reduce((s, c) => s + c * c, 0);
  const length = (u: Vec): number => chords(u).reduce((s, c) => s + c, 0);
  const gradient = (u: Vec): Vec => {
    const ps = params(u);
    const pts = ps.map(([a, b]) => S(a, b));
    const g: Vec = new Array<number>(n).fill(0);
    for (let i = 1; i < N; i++) {
      const d1 = sub(pts[i], pts[i - 1]);
      const d2 = sub(pts[i], pts[i + 1]);
      const dP: P3 = [0, 1, 2].map((k) => 2 * (d1[k] + d2[k])) as P3;
      const [a, b] = ps[i];
      const e = 1e-7;
      const Pa = sub(S(a + e, b), S(a - e, b)).map((v) => v / (2 * e)) as P3;
      const Pb = sub(S(a, b + e), S(a, b - e)).map((v) => v / (2 * e)) as P3;
      g[2 * (i - 1)] = dot(dP, Pa);
      g[2 * (i - 1) + 1] = dot(dP, Pb);
    }
    return g;
  };
  let u: Vec = Array.from({ length: N - 1 }, (_, i) => init((i + 1) / N)).flat();
  // 带阻尼的牛顿法（列文伯格-马夸特）：解 (H + μI)d = −g，能量变小就接受并减小 μ，否则加大 μ
  let mu = 1e-3;
  for (let it = 0; it < 300; it++) {
    const g = gradient(u);
    if (Math.max(...g.map(Math.abs)) < 1e-13) break;
    const e = 1e-5;
    const H = u.map((_, j) => {
      const up = gradient(u.map((v, k) => (k === j ? v + e : v)));
      const um = gradient(u.map((v, k) => (k === j ? v - e : v)));
      return up.map((v, k) => (v - um[k]) / (2 * e));
    });
    const E0 = energy(u);
    for (let tries = 0; tries < 60; tries++) {
      const step = solve(H.map((row, i) => row.map((v, j) => (i === j ? v + mu : v))), g.map((v) => -v));
      const trial = u.map((v, k) => v + step[k]);
      if (energy(trial) < E0) {
        u = trial;
        mu = Math.max(mu / 4, 1e-12);
        break;
      }
      mu *= 8;
    }
  }
  return length(u);
}

/** N 段和 2N 段外推。 */
const extrapolated = (S: Surface, start: [number, number], end: [number, number], N: number, init: (t: number) => [number, number]): number =>
  richardson(shortestPolyline(S, start, end, N, init), shortestPolyline(S, start, end, 2 * N, init));

export const verification: Verification = {
  lesson: 'math.calculus-of-variations.holonomic-constraints',
  notes: {
    p1: '圆柱面上的点用 (θ, z) 表示，32 段、64 段折线求离散测地线（对 Σ弦长² 求极小，初始猜测故意弯曲），量弦长之和再外推；另由展开图算 √(π² + 2²)。两者核对。',
    p2: '把每个条件写成 (x, y, z, y′, z′) 的函数或积分：A、C、E 逐点成立、对 y′、z′ 的数值偏导数为零，是完整约束；B 是积分约束，D 含 y′。',
    p3: '圆锥面上的点用 (r, φ) 表示为 (r cos φ, r sin φ, r)，同 p1 的做法求离散测地线（初始猜测往锥顶弯），外推；另由展开图：母线长 √2、扇形角 √2·π，两点在扇形上相隔 π/√2，弦长 2√2·sin(π/(2√2))。两者核对。',
    p4: '球面上的点用（纬度，经度）表示，同 p1 的做法求离散测地线，外推；另由两点位置向量的夹角 arccos(3/4)。两者核对。',
  },
  compute() {
    // p1
    const cylinder: Surface = (th, z) => [Math.cos(th), Math.sin(th), z];
    const L1 = extrapolated(cylinder, [0, 0], [Math.PI, 2], 32, (t) => [Math.PI * t + 0.3 * Math.sin(Math.PI * t), 2 * t + 0.3 * Math.sin(2 * Math.PI * t)]);
    const p1 = agree(L1, Math.hypot(Math.PI, 2), 'p1 最短路径', 1e-6);

    // p2：[是否积分约束, 逐点的式子 g(x, y, z, y′, z′)]
    const conditions: (null | ((x: number, y: number, z: number, yp: number, zp: number) => number))[] = [
      (x, y, z) => x * x + 2 * y * y - z,
      null,
      (x, y, z) => y - x * z,
      (_x, _y, z, yp) => yp - z,
      (x, y, z) => z - Math.sin(x + y),
    ];
    const samples = [
      [0.3, -0.7, 1.1, 0.4, -1.2],
      [-1.4, 0.9, -0.2, 2.1, 0.5],
      [0.8, 0.1, 0.6, -0.9, 1.7],
    ];
    const p2 = chosen(
      conditions.map((g) => {
        if (g === null) return false;
        return samples.every(([x, y, z, yp, zp]) => {
          const e = 1e-6;
          const dyp = (g(x, y, z, yp + e, zp) - g(x, y, z, yp - e, zp)) / (2 * e);
          const dzp = (g(x, y, z, yp, zp + e) - g(x, y, z, yp, zp - e)) / (2 * e);
          return Math.abs(dyp) < 1e-9 && Math.abs(dzp) < 1e-9;
        });
      }),
    );

    // p3
    const cone: Surface = (r, ph) => [r * Math.cos(ph), r * Math.sin(ph), r];
    const L3 = extrapolated(cone, [1, 0], [1, Math.PI], 32, (t) => [1 - 0.3 * Math.sin(Math.PI * t), Math.PI * t]);
    const p3 = agree(L3, 2 * Math.SQRT2 * Math.sin(Math.PI / (2 * Math.SQRT2)), 'p3 最短路径', 1e-6);

    // p4
    const sphere: Surface = (lat, lon) => [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];
    const L4 = extrapolated(sphere, [Math.PI / 3, 0], [Math.PI / 3, Math.PI / 2], 32, (t) => [Math.PI / 3 + 0.05 * Math.sin(Math.PI * t), (Math.PI / 2) * t]);
    const A = sphere(Math.PI / 3, 0);
    const B = sphere(Math.PI / 3, Math.PI / 2);
    const p4 = agree(agree(L4, Math.acos(dot(A, B)), 'p4 两种算法', 1e-6), Math.acos(3 / 4), 'p4 球面距离');

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
