// 独立验算 math.pde.wave-3d 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 几套办法互相核对：
//   一、三维的基尔霍夫公式 u(x, t) = ∂t[t·M_φ(x, ct)] + t·M_ψ(x, ct)，M 是以 x 为心、半径 ct 的球面上的平均，直接在三维里求积：
//       光滑的被积函数用 cosθ 方向分段高斯-勒让德、方位角方向等距梯形（取的轴不对着任何对称方向）；
//       球的示性函数用斐波那契格点（N 个近似均匀分布在球面上的点）数落在球里的比例；对 t 的导数用中心差分；
//   二、初值关于某一点球对称时，不用基尔霍夫公式：w = ru 满足一维波动方程，rφ、rψ 延成奇函数，用达朗贝尔公式；
//   三、写得出闭式解的，用四阶中心差分算 u_tt − c²Δu 的残差，再查初值；二维的反例另用极坐标的有限差分解 u_tt = c²(u_rr + u_r/r)，
//       并和二维的泊松公式 u = (1/2πc)∬_{|y−x|<ct} ψ(y)/√(c²t² − |y−x|²) dy 核对（泊松公式是第 6 题要证的，只用来核对数值，不参与判断）。
// 单独运行：npx tsx tools/verify/math.pde.wave-3d.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { gaussLegendre, gaussLegendreRule, seededRandom } from './math.analysis._numeric.ts';

type F1 = (s: number) => number;
type F3 = (x: number, y: number, z: number) => number;
type V3 = [number, number, number];

function check(ok: boolean, what: string): void {
  if (!ok) throw new Error(`核对失败：${what}`);
}

const RULE24 = gaussLegendreRule(24);

/** [a, b] 上的积分：等分 m 段，每段 24 点高斯-勒让德；breaks 里落在 (a, b) 的点另加为分段点。 */
function integrate(f: F1, a: number, b: number, m = 100, breaks: number[] = []): number {
  if (a === b) return 0;
  if (a > b) return -integrate(f, b, a, m, breaks);
  const pts = Array.from({ length: m + 1 }, (_, k) => a + ((b - a) * k) / m);
  for (const p of breaks) if (p > a && p < b) pts.push(p);
  pts.sort((u, v) => u - v);
  return gaussLegendre(f, pts, RULE24);
}

// ---------- 办法一：三维球面平均 ----------

/** 以 x 为心、半径 rho 的球面上 f 的平均。球面参数取一个斜着的轴 n（不对着坐标轴），cosθ 方向在 [−1, 1] 上分段高斯-勒让德，方位角 128 点梯形。 */
function sphereMean(f: F3, x: V3, rho: number, muBreaks: number[] = []): number {
  // 斜着的正交标架 n、e1、e2
  const n: V3 = normalize([0.37, -0.52, 0.77]);
  const e1: V3 = normalize(cross(n, [1, 0, 0]));
  const e2: V3 = cross(n, e1);
  const NA = 128;
  const ring = (mu: number) => {
    const st = Math.sqrt(Math.max(0, 1 - mu * mu));
    let s = 0;
    for (let k = 0; k < NA; k++) {
      const a = (2 * Math.PI * (k + 0.5)) / NA;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const d: V3 = [0, 1, 2].map((i) => mu * n[i] + st * (ca * e1[i] + sa * e2[i])) as V3;
      s += f(x[0] + rho * d[0], x[1] + rho * d[1], x[2] + rho * d[2]);
    }
    return s / NA;
  };
  return integrate(ring, -1, 1, 16, muBreaks) / 2;
}

/** 斐波那契格点：N 个近似均匀分布在单位球面上 z ≥ zmin 那一块（球冠）里的点；zmin = −1 就是整个球面。 */
function fibonacciCap(N: number, zmin = -1): V3[] {
  const pts: V3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const z = 1 - ((1 - zmin) * (i + 0.5)) / N;
    const r = Math.sqrt(Math.max(0, 1 - z * z));
    const a = golden * i;
    pts.push([r * Math.cos(a), r * Math.sin(a), z]);
  }
  return pts;
}
const FIB = fibonacciCap(20_000);

/**
 * 以 x 为心、半径 rho 的球面落在「以 center 为心、半径 a 的开球」里的比例（数格点）。
 * 小球从 x 看去张成半顶角 arcsin(a/R) 的圆锥（R = |center − x| > a），球面上落在小球里的点都在这个圆锥里：
 * 只在圆锥对应的球冠上（半顶角放宽 1%）铺 N 个格点，数落在小球里的个数，再乘球冠占整个球面的比例 (1 − cosΘ)/2。
 */
function fractionInBall(x: V3, rho: number, center: V3, a: number, N = 400_000): number {
  const R = dist(x, center);
  check(R > a, 'fractionInBall 只管 x 在小球外的情形');
  const theta = Math.min(Math.PI, 1.01 * Math.asin(a / R));
  const e: V3 = normalize([center[0] - x[0], center[1] - x[1], center[2] - x[2]]);
  const e1: V3 = normalize(cross(e, Math.abs(e[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]));
  const e2: V3 = cross(e, e1);
  const zmin = Math.cos(theta);
  let k = 0;
  for (const d of fibonacciCap(N, zmin)) {
    const dir = [0, 1, 2].map((i) => d[2] * e[i] + d[0] * e1[i] + d[1] * e2[i]);
    const p0 = x[0] + rho * dir[0] - center[0];
    const p1 = x[1] + rho * dir[1] - center[1];
    const p2 = x[2] + rho * dir[2] - center[2];
    if (p0 * p0 + p1 * p1 + p2 * p2 < a * a) k++;
  }
  return (k / N) * ((1 - zmin) / 2);
}

/** 基尔霍夫公式，对 t 的导数用四阶中心差分。 */
function kirchhoff(c: number, Mphi: (rho: number) => number, Mpsi: (rho: number) => number, t: number, h = 1e-4): number {
  const g = (s: number) => s * Mphi(c * s);
  const dg = (-g(t + 2 * h) + 8 * g(t + h) - 8 * g(t - h) + g(t - 2 * h)) / (12 * h);
  return dg + t * Mpsi(c * t);
}

// ---------- 办法二：球对称的达朗贝尔公式 ----------

/** 初值关于某点球对称（φ、ψ 是到那一点的距离 r 的函数），rφ、rψ 延成奇函数，u(r, t) = w(r, t)/r。 */
function sphericalDalembert(c: number, phi: F1, psi: F1, r: number, t: number, breaks: number[] = []): number {
  const Phi: F1 = (s) => s * phi(Math.abs(s));
  const Psi: F1 = (s) => s * psi(Math.abs(s));
  const w = 0.5 * (Phi(r - c * t) + Phi(r + c * t)) + integrate(Psi, r - c * t, r + c * t, 50, breaks) / (2 * c);
  return w / r;
}

// ---------- 办法三：残差 ----------

/** 三维直角坐标里 u_tt − c²Δu 的残差：每个二阶偏导数用四阶中心差分。 */
function residual(u: (x: number, y: number, z: number, t: number) => number, c: number, x: number, y: number, z: number, t: number, h = 1e-3): number {
  const second = (g: F1) => (-g(2 * h) + 16 * g(h) - 30 * g(0) + 16 * g(-h) - g(-2 * h)) / (12 * h * h);
  const utt = second((s) => u(x, y, z, t + s));
  const lap = second((s) => u(x + s, y, z, t)) + second((s) => u(x, y + s, z, t)) + second((s) => u(x, y, z + s, t));
  return utt - c * c * lap;
}

/** 二维、球对称（只依赖 r）的初值问题 u_tt = c²(u_rr + u_r/r)，[0, Rmax] 上中心差分，原点用 Δu = 2u_rr，Courant 数 0.5。返回 T 时刻的 u(0)。 */
function radial2D(c: number, phi: F1, psi: F1, Rmax: number, dr: number, T: number): number {
  const nu = 0.5;
  const dt = (nu * dr) / c;
  const steps = Math.round(T / dt);
  check(Math.abs(steps * dt - T) < 1e-9, '二维差分：T 不是步长的整数倍');
  const N = Math.round(Rmax / dr);
  const rs = Array.from({ length: N + 1 }, (_, j) => j * dr);
  const lap = (u: number[], j: number) =>
    j === 0 ? (4 * (u[1] - u[0])) / (dr * dr) : (u[j + 1] - 2 * u[j] + u[j - 1]) / (dr * dr) + (u[j + 1] - u[j - 1]) / (2 * rs[j] * dr);
  let prev = rs.map((r) => phi(r));
  let cur = prev.map((u, j) => (j === N ? 0 : u + dt * psi(rs[j]) + 0.5 * dt * dt * c * c * lap(prev, j)));
  for (let k = 1; k < steps; k++) {
    const next = cur.map((u, j) => (j === N ? 0 : 2 * u - prev[j] + dt * dt * c * c * lap(cur, j)));
    prev = cur;
    cur = next;
  }
  return cur[0];
}

// ---------- 小工具 ----------

function normalize(v: V3): V3 {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
}
function cross(a: V3, b: V3): V3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
const dist = (p: V3, q: V3) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
/** 光滑的鼓包：|x − center| < a 时 (1 − |x − center|²/a²)⁴，别处 0（有连续的三阶偏导数）。 */
const bump = (center: V3, a: number): F3 => (x, y, z) => {
  const q = ((x - center[0]) ** 2 + (y - center[1]) ** 2 + (z - center[2]) ** 2) / (a * a);
  return q < 1 ? (1 - q) ** 4 : 0;
};

export const verification: Verification = {
  lesson: 'math.pde.wave-3d',
  notes: {
    p1:
      '两个小球的初速度分别关于各自球心球对称，叠加；每个用办法二（rψ 延成奇函数的达朗贝尔公式，被积函数分段线性，按 ±a 分段精确积分）算 P 处的 u(t)。' +
      '两球心相距至少 103 − 100 = 3 > 2，两球不相交。t 在 [0, 0.4] 秒上以 10⁻⁶ 秒扫一遍找 u 由零变非零、由非零变零的时刻，再二分到 10⁻¹⁵，各段长度相加，换成毫秒。' +
      '另用办法一（u = t·ψ₀·球面落在小球里的比例；比例用斐波那契格点数：小球从 P 看去张成半顶角 arcsin(a/R) 的圆锥，在对应的球冠上铺 40 万个点，数落在小球里的再乘球冠的面积比例）' +
      '在每段里取 5 个时刻核对 u（相对差 < 10⁻³），段外取 6 个时刻核对 u = 0。ψ₀ 取 1、2.5 结果相同。',
    p2:
      'A 反例：φ = |x − r₀|² − (ct₀)²，ψ = 0，在以 r₀ 为心、半径 ct₀ 的球面上 φ = ψ = 0；闭式解 u = |x − r₀|² − (ct₀)² + 3c²t² 残差 < 10⁻⁶、初值对，u(r₀, t₀) = 2c²t₀² ≠ 0；' +
      '另取有界支集的 φ = s·b(s)（s = |x − r₀|² − (ct₀)²，b 是 (−1, 1) 上的 e^{−1/(1−s²)}），办法一算得 u(r₀, t₀) ≈ 2c²t₀²/e ≠ 0（错）。' +
      'B：a = 1、c = 1.5，φ、ψ 取两个支集在球里的光滑鼓包（不对称，ψ 偏心），球里随机 40 个点、t ∈ (2a/c + 0.01, 3a/c + 0.01) 随机 40 个时刻（留出差分步长），球面上的点到原点都 > a，办法一算得 |u| < 10⁻¹²；' +
      '再在一个点、略早于 (|x| + a)/c 的时刻查 u ≠ 0，说明不是空话（对）。' +
      'C 反例：二维 a = 1、c = 1、φ = 0、ψ = (1 − |x|²)⁴，圆心处 t = 3 > 2a/c：二维极坐标差分（Δr = 0.002）、和 z 无关地延到三维后用办法一、二维泊松公式三者相差 < 10⁻³，u ≈ 0.0336 > 0（错）。' +
      'D：ψ 取三个随机鼓包之和（≥ 0），随机 40 个点和时刻，u = t·M_ψ 都 ≥ 0，且有严格为正的（对）。' +
      'E 反例：c = 1、φ = (1 − |x|²)⁴（|x| < 1）、ψ = 0，原点 t = 0.5：办法二（r = 10⁻³、5×10⁻⁴ 两点外推）和办法一都得 u ≈ −0.527 < 0；离原点 (0.1, 0.05, 0) 处 t = 0.6 办法一也为负（错）。',
    p3:
      'c = 3、ψ = x²、φ = 0、点 (2, 1, 0)、t = 1：办法一 u = t·M_ψ(x, 3)，斜轴球面求积；另查闭式解 u = x²t + c²t³/3 的残差 < 10⁻⁶ 和初值，代入点值相同。',
    p4:
      'c = 1、ψ = 0、φ 是单位开球的示性函数，|x| = 10、t = 10.4：φ 关于原点球对称，办法二 u = [Φ(r − ct) + Φ(r + ct)]/(2r)，Φ(s) = s·1{|s|<1}；' +
      '办法一用斐波那契格点数球面落在单位球里的比例 M(ρ)，u = ∂t[t·M(ct)] 用 h = 0.05 的四阶中心差分（M 在 9 < ρ < 11 内光滑），点取斜方向 (10/√3)(1, 1, 1)，两者相差 < 3×10⁻⁴。',
  },
  compute() {
    // ---------------- p1 ----------------
    const c1 = 340;
    const a1 = 1;
    const R = [100, 103];
    const uBall = (psi0: number, Rj: number, t: number) => {
      // rψ 延成奇函数：Ψ(s) = ψ₀·s（|s| < a），在 [Rj − ct, Rj + ct] 上精确积分
      const lo = Math.max(Rj - c1 * t, -a1);
      const hi = Math.min(Rj + c1 * t, a1);
      const integral = hi > lo ? (psi0 * (hi * hi - lo * lo)) / 2 : 0;
      return integral / (2 * c1 * Rj);
    };
    const durations: number[] = [];
    for (const psi0 of [1, 2.5]) {
      const u = (t: number) => uBall(psi0, R[0], t) + uBall(psi0, R[1], t);
      const nz = (t: number) => Math.abs(u(t)) > 0;
      const dt = 1e-6;
      const T = 0.4;
      const edges: number[] = [];
      let prevNz = nz(0);
      for (let i = 1; i <= T / dt; i++) {
        const t = i * dt;
        const cur = nz(t);
        if (cur !== prevNz) {
          let lo = t - dt;
          let hi = t;
          for (let k = 0; k < 80; k++) {
            const m = (lo + hi) / 2;
            if (nz(m) === prevNz) lo = m;
            else hi = m;
          }
          edges.push((lo + hi) / 2);
          prevNz = cur;
        }
      }
      check(edges.length === 4, `p1 找到 ${edges.length} 个边界时刻`);
      check(!prevNz, 'p1 最后应当静止');
      durations.push((edges[1] - edges[0] + edges[3] - edges[2]) * 1000);
      // 办法一核对：P 放在原点，两个球心放在不同方向
      const P: V3 = [0, 0, 0];
      const C1: V3 = [R[0], 0, 0];
      const C2: V3 = normalize([0.3, 0.8, -0.5]).map((v) => v * R[1]) as V3;
      check(Math.abs(dist(C1, C2)) > 2 * a1, 'p1 两球不相交');
      const uK = (t: number) => t * psi0 * (fractionInBall(P, c1 * t, C1, a1) + fractionInBall(P, c1 * t, C2, a1));
      for (const [s, e] of [
        [edges[0], edges[1]],
        [edges[2], edges[3]],
      ]) {
        for (let k = 1; k <= 5; k++) {
          const t = s + ((e - s) * k) / 6;
          const ref = u(t);
          check(Math.abs(uK(t) - ref) < 1e-3 * Math.abs(ref) + 1e-9, `p1 办法一 ${uK(t)} 和办法二 ${ref}（t = ${t}）`);
        }
      }
      for (const t of [0.2, edges[0] - 1e-4, (edges[1] + edges[2]) / 2, edges[3] + 1e-4, 0.35, 0.39]) {
        check(uK(t) === 0 && u(t) === 0, `p1 段外 t = ${t} 应为 0`);
      }
    }
    check(Math.abs(durations[0] - durations[1]) < 1e-9, 'p1 与 ψ₀ 无关');
    const p1 = durations[0];

    // ---------------- p2 ----------------
    const rand = seededRandom(20261120);
    // A：多项式反例
    const cA = 1.7;
    const t0 = 0.8;
    const r0: V3 = [0.3, -0.4, 0.2];
    const KA = (cA * t0) ** 2;
    const uA = (x: number, y: number, z: number, t: number) => (x - r0[0]) ** 2 + (y - r0[1]) ** 2 + (z - r0[2]) ** 2 - KA + 3 * cA * cA * t * t;
    let resAmax = 0;
    for (let k = 0; k < 10; k++) resAmax = Math.max(resAmax, Math.abs(residual(uA, cA, rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1, rand() * 2)));
    check(resAmax < 1e-6, `p2 A 闭式解残差 ${resAmax}`);
    const ut0 = (uA(0.1, 0.2, 0.3, 1e-6) - uA(0.1, 0.2, 0.3, -1e-6)) / 2e-6;
    check(Math.abs(ut0) < 1e-6, 'p2 A 初速度为 0');
    const phiA: F3 = (x, y, z) => uA(x, y, z, 0);
    const MphiA = (rho: number) => sphereMean(phiA, r0, rho);
    check(Math.abs(MphiA(cA * t0)) < 1e-10, 'p2 A 球面上 φ 的平均为 0');
    // 球面上逐点为 0
    for (const d of FIB.slice(0, 2000)) check(Math.abs(phiA(r0[0] + cA * t0 * d[0], r0[1] + cA * t0 * d[1], r0[2] + cA * t0 * d[2])) < 1e-12, 'p2 A 球面上 φ = 0');
    const uAat = uA(r0[0], r0[1], r0[2], t0);
    const kA = kirchhoff(cA, MphiA, () => 0, t0);
    check(Math.abs(uAat - 2 * cA * cA * t0 * t0) < 1e-12 && Math.abs(kA - uAat) < 1e-7, `p2 A u(r₀, t₀) 闭式 ${uAat}、基尔霍夫 ${kA}`);
    // A：有界支集的反例
    const b = (s: number) => (Math.abs(s) < 1 ? Math.exp(-1 / (1 - s * s)) : 0);
    const phiA2: F3 = (x, y, z) => {
      const s = (x - r0[0]) ** 2 + (y - r0[1]) ** 2 + (z - r0[2]) ** 2 - KA;
      return s * b(s);
    };
    const kA2 = kirchhoff(cA, (rho) => sphereMean(phiA2, r0, rho), () => 0, t0, 1e-3);
    check(Math.abs(kA2 - (2 * cA * cA * t0 * t0) / Math.E) < 1e-5, `p2 A 有界支集 ${kA2} 应约为 2c²t₀²/e`);
    const A = Math.abs(uAat) < 1e-9 && Math.abs(kA2) < 1e-9;

    // B
    const aB = 1;
    const cB = 1.5;
    const phiB: F3 = (x, y, z) => bump([0, 0, 0], aB)(x, y, z) * (1 + 0.3 * x - 0.2 * y * z);
    const psiB: F3 = bump([0.2, -0.1, 0.15], 0.7);
    // 支集在球里：ψ 的支集离原点至多 |(0.2, −0.1, 0.15)| + 0.7 < 1
    check(Math.hypot(0.2, -0.1, 0.15) + 0.7 < aB, 'p2 B ψ 的支集在球里');
    let maxB = 0;
    let geoOk = true;
    for (let k = 0; k < 40; k++) {
      // 球里随机点（含接近球面的）
      const d = normalize([rand() - 0.5, rand() - 0.5, rand() - 0.5]);
      const rr = aB * Math.cbrt(rand());
      const x: V3 = [rr * d[0], rr * d[1], rr * d[2]];
      const t = (2 * aB) / cB + 0.01 + rand() * (aB / cB);
      // 球面上的点到原点的距离 ≥ ct − |x| > a
      for (const q of FIB.slice(0, 5000)) if (Math.hypot(x[0] + cB * t * q[0], x[1] + cB * t * q[1], x[2] + cB * t * q[2]) <= aB) geoOk = false;
      const u = kirchhoff(cB, (rho) => sphereMean(phiB, x, rho), (rho) => sphereMean(psiB, x, rho), t, 1e-3);
      maxB = Math.max(maxB, Math.abs(u));
    }
    // 不是空话：(0.9, 0, 0) 处 t 略早于 (0.9 + a)/c 时 u ≠ 0
    const xEdge: V3 = [0.9, 0, 0];
    const uEarly = kirchhoff(cB, (rho) => sphereMean(phiB, xEdge, rho), (rho) => sphereMean(psiB, xEdge, rho), (0.9 + aB) / cB - 0.15, 1e-3);
    check(Math.abs(uEarly) > 1e-4, `p2 B 早一点时 u = ${uEarly} 应不为 0`);
    const B = geoOk && maxB < 1e-12;

    // C：二维反例
    const cC = 1;
    const aC = 1;
    const psiC: F1 = (r) => (r < aC ? (1 - (r * r) / (aC * aC)) ** 4 : 0);
    const tC = 3;
    // 二维泊松公式（圆心处，极坐标）
    const poisson = (1 / cC) * integrate((s) => (s * psiC(s)) / Math.sqrt(cC * cC * tC * tC - s * s), 0, aC, 50);
    // 延到三维（和 z 无关），办法一：u = t·M_ψ3(0, ct)，被积函数在 |μ| > √(1 − (a/ct)²) 才不为零
    const mu0 = Math.sqrt(1 - (aC / (cC * tC)) ** 2);
    const psi3: F3 = (x, y) => psiC(Math.hypot(x, y));
    // 这里用 z 轴做对称轴求积，在 ±μ₀ 处分段
    const meanZ = (rho: number) => integrate((mu) => psiC(rho * Math.sqrt(Math.max(0, 1 - mu * mu))), -1, 1, 40, [-mu0, mu0]) / 2;
    const uC3 = tC * meanZ(cC * tC);
    check(Math.abs(psi3(0.1, 0.2, 7) - psiC(Math.hypot(0.1, 0.2))) < 1e-15, 'p2 C 延拓和 z 无关');
    const fdC = radial2D(cC, () => 0, psiC, 8, 0.002, tC);
    check(Math.abs(poisson - uC3) < 1e-6, `p2 C 泊松公式 ${poisson}、三维降维 ${uC3}`);
    check(Math.abs(fdC - poisson) < 1e-3, `p2 C 差分 ${fdC}、泊松公式 ${poisson}`);
    // 判断用差分和降维两种办法的值（泊松公式只用来核对），两者都为零才算「对」
    const C = Math.abs(fdC) < 1e-6 && Math.abs(uC3) < 1e-9;

    // D
    const centers: V3[] = [0, 1, 2].map(() => [rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1] as V3);
    const psiD: F3 = (x, y, z) => centers.reduce((s, cc, i) => s + (i + 1) * bump(cc, 0.6 + 0.2 * i)(x, y, z), 0);
    let minD = Infinity;
    let maxD = 0;
    for (let k = 0; k < 40; k++) {
      const x: V3 = [rand() * 4 - 2, rand() * 4 - 2, rand() * 4 - 2];
      const cD = 0.5 + rand() * 2;
      const t = rand() * 2.5;
      const u = t * sphereMean(psiD, x, cD * t);
      minD = Math.min(minD, u);
      maxD = Math.max(maxD, u);
    }
    check(maxD > 1e-3, `p2 D 有严格为正的值（最大 ${maxD}）`);
    const D = minD >= 0;

    // E：反例
    const cE = 1;
    const phiE: F1 = (r) => (r < 1 ? (1 - r * r) ** 4 : 0);
    const zero: F1 = () => 0;
    const tE = 0.5;
    const uE0 = (4 * sphericalDalembert(cE, phiE, zero, 5e-4, tE, [-1, 1]) - sphericalDalembert(cE, phiE, zero, 1e-3, tE, [-1, 1])) / 3;
    const phiE3: F3 = (x, y, z) => phiE(Math.hypot(x, y, z));
    const kE0 = kirchhoff(cE, (rho) => sphereMean(phiE3, [0, 0, 0], rho), () => 0, tE);
    check(Math.abs(uE0 - kE0) < 1e-5, `p2 E 原点 办法二 ${uE0}、办法一 ${kE0}`);
    const xE: V3 = [0.1, 0.05, 0];
    const kE1 = kirchhoff(cE, (rho) => sphereMean(phiE3, xE, rho), () => 0, 0.6, 1e-3);
    const uE1 = sphericalDalembert(cE, phiE, zero, Math.hypot(0.1, 0.05), 0.6, [-1, 1]);
    check(Math.abs(kE1 - uE1) < 1e-5, `p2 E 偏离原点 办法一 ${kE1}、办法二 ${uE1}`);
    const E = uE0 >= 0 && kE1 >= 0;

    const p2: number[] = [];
    [A, B, C, D, E].forEach((ok, i) => {
      if (ok) p2.push(i + 1);
    });

    // ---------------- p3 ----------------
    const c3 = 3;
    const x3: V3 = [2, 1, 0];
    const psi3b: F3 = (x) => x * x;
    const p3 = 1 * sphereMean(psi3b, x3, c3 * 1);
    const u3 = (x: number, _y: number, _z: number, t: number) => x * x * t + (c3 * c3 * t ** 3) / 3;
    let res3 = 0;
    for (let k = 0; k < 10; k++) res3 = Math.max(res3, Math.abs(residual(u3, c3, rand() * 4 - 2, rand() * 4 - 2, rand() * 4 - 2, rand() * 2)));
    check(res3 < 1e-6, `p3 闭式解残差 ${res3}`);
    check(u3(1.3, 0, 0, 0) === 0, 'p3 初位移 0');
    check(Math.abs((u3(1.3, 0, 0, 1e-6) - u3(1.3, 0, 0, -1e-6)) / 2e-6 - 1.3 * 1.3) < 1e-6, 'p3 初速度 x²');
    check(Math.abs(u3(2, 1, 0, 1) - p3) < 1e-10, `p3 闭式 ${u3(2, 1, 0, 1)}、基尔霍夫 ${p3}`);

    // ---------------- p4 ----------------
    const c4 = 1;
    const r4 = 10;
    const t4 = 10.4;
    const Phi4: F1 = (s) => (Math.abs(s) < 1 ? s : 0);
    const p4 = (Phi4(r4 - c4 * t4) + Phi4(r4 + c4 * t4)) / (2 * r4);
    const x4: V3 = [r4 / Math.sqrt(3), r4 / Math.sqrt(3), r4 / Math.sqrt(3)];
    const k4 = kirchhoff(c4, (rho) => fractionInBall(x4, rho, [0, 0, 0], 1), () => 0, t4, 0.05);
    check(Math.abs(k4 - p4) < 3e-4, `p4 办法一 ${k4}、办法二 ${p4}`);

    console.log(
      `  （核对：p1 两种 ψ₀ 的总时长 ${durations.map((d) => d.toPrecision(10)).join('、')} ms；p2 A 闭式 ${uAat.toPrecision(6)}、有界支集 ${kA2.toPrecision(6)}，` +
        `B 最大 |u| ${maxB.toExponential(1)}、提前时 ${uEarly.toPrecision(4)}，C 泊松 ${poisson.toPrecision(6)}、降维 ${uC3.toPrecision(6)}、差分 ${fdC.toPrecision(6)}，` +
        `D 最小 ${minD.toPrecision(3)}、最大 ${maxD.toPrecision(3)}，E 原点 ${uE0.toPrecision(6)}、偏离原点 ${kE1.toPrecision(6)}；p4 格点 ${k4.toPrecision(6)}）`,
    );

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
