// 独立验算 math.pde.spherical-waves 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 三套办法互相核对：
//   一、球对称时 w = ru 满足一维波动方程，w(0, t) = 0；把 rφ、rψ 延成奇函数，用达朗贝尔公式（积分用分段高斯-勒让德公式）；
//   二、不用球对称的化简：三维的基尔霍夫公式 u(x, t) = ∂t[t·M_φ(x, ct)] + t·M_ψ(x, ct)，M 是以 x 为心、半径 ct 的球面上的平均，
//       在球面上用二维求积直接算（cosθ 方向高斯-勒让德、方位角方向等距梯形），取的点 x 不在极轴上，被积函数两个角都依赖；
//   三、不用任何公式：在 [0, R] 上用中心差分格式解 w_tt = c²w_rr、w(0, t) = 0，再读 u = w/r（原点处用两点外推）。
// p2 的「满足方程」另在三维直角坐标里用中心差分算 u_tt − c²(u_xx + u_yy + u_zz) 的残差。
// 单独运行：npx tsx tools/verify/math.pde.spherical-waves.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { gaussLegendre, gaussLegendreRule, seededRandom } from './math.analysis._numeric.ts';

type F1 = (s: number) => number;
type F3 = (x: number, y: number, z: number) => number;

function check(ok: boolean, what: string): void {
  if (!ok) throw new Error(`核对失败：${what}`);
}

const RULE = gaussLegendreRule(24);

/** [a, b] 上的积分：等分 m 段，每段 24 点高斯-勒让德。 */
function integrate(f: F1, a: number, b: number, m = 200): number {
  if (a === b) return 0;
  if (a > b) return -integrate(f, b, a, m);
  const pts = Array.from({ length: m + 1 }, (_, k) => a + ((b - a) * k) / m);
  return gaussLegendre(f, pts, RULE);
}

/** 办法一：φ、ψ 是 r 的函数（r ≥ 0），w = ru 的初值 rφ、rψ 延成奇函数，用达朗贝尔公式算 u(r, t) = w(r, t)/r（r > 0）。 */
function sphericalDalembert(c: number, phi: F1, psi: F1, r: number, t: number): number {
  const Phi: F1 = (s) => s * phi(Math.abs(s)); // s·φ(|s|) 本身就是奇函数
  const Psi: F1 = (s) => s * psi(Math.abs(s));
  const w = 0.5 * (Phi(r - c * t) + Phi(r + c * t)) + integrate(Psi, r - c * t, r + c * t) / (2 * c);
  return w / r;
}

// 球面求积：cosθ 方向 40 点高斯-勒让德，方位角 96 点等距（周期函数，梯形公式收敛很快）。
const MU = gaussLegendreRule(40);
const NPHI = 96;

/** 以 (x, y, z) 为心、半径 rho 的球面上 f 的平均（直接在三维里算，不用球对称）。 */
function sphereMean(f: F3, x: number, y: number, z: number, rho: number): number {
  let s = 0;
  for (let i = 0; i < MU.nodes.length; i++) {
    const mu = MU.nodes[i];
    const st = Math.sqrt(1 - mu * mu);
    let ring = 0;
    for (let k = 0; k < NPHI; k++) {
      const a = (2 * Math.PI * k) / NPHI;
      ring += f(x + rho * st * Math.cos(a), y + rho * st * Math.sin(a), z + rho * mu);
    }
    s += MU.weights[i] * (ring / NPHI);
  }
  return s / 2; // ∫₋₁¹ dμ 的权和是 2
}

/** 办法二：基尔霍夫公式 u(x, t) = ∂t[t·M_φ(x, ct)] + t·M_ψ(x, ct)，对 t 的导数用四阶中心差分。 */
function kirchhoff(c: number, phi: F3, psi: F3, x: number, y: number, z: number, t: number): number {
  const g = (s: number) => s * sphereMean(phi, x, y, z, c * s);
  const h = 1e-3;
  const dg = (-g(t + 2 * h) + 8 * g(t + h) - 8 * g(t - h) + g(t - 2 * h)) / (12 * h);
  return dg + t * sphereMean(psi, x, y, z, c * t);
}

/**
 * 办法三：在 [0, R] 上用中心差分解 w_tt = c²w_rr，w(0, t) = w(R, t) = 0，初值 w = rφ、w_t = rψ，Courant 数 0.5，算到 T。
 * 返回 u(r, T) = w(r, T)/r；r = 0 时用 w(h)/h、w(2h)/(2h) 两点外推（w 关于 r 是奇函数，w/r = a + b r² + …）。
 */
function radialFD(c: number, phi: F1, psi: F1, R: number, dr: number, T: number): (r: number) => number {
  const nu = 0.5;
  const dt = (nu * dr) / c;
  const steps = Math.round(T / dt);
  check(Math.abs(steps * dt - T) < 1e-9, '差分：T 不是步长的整数倍');
  const N = Math.round(R / dr);
  const rs = Array.from({ length: N + 1 }, (_, j) => j * dr);
  let prev = rs.map((r) => r * phi(r));
  prev[0] = prev[N] = 0;
  let cur = prev.map((w, j) => (j === 0 || j === N ? 0 : w + dt * rs[j] * psi(rs[j]) + 0.5 * nu * nu * (prev[j + 1] - 2 * w + prev[j - 1])));
  for (let n = 1; n < steps; n++) {
    const next = cur.map((w, j) => (j === 0 || j === N ? 0 : 2 * w - prev[j] + nu * nu * (cur[j + 1] - 2 * w + cur[j - 1])));
    prev = cur;
    cur = next;
  }
  return (r: number) => {
    if (r === 0) return (4 * (cur[1] / dr) - cur[2] / (2 * dr)) / 3;
    const j = Math.round(r / dr);
    check(Math.abs(j * dr - r) < 1e-9, '差分：只读格点上的值');
    return cur[j] / r;
  };
}

/** 三维直角坐标里 u_tt − c²Δu 的残差：每个二阶偏导数用四阶中心差分 (−f₂ + 16f₁ − 30f₀ + 16f₋₁ − f₋₂)/(12h²)。 */
function residual(u: (x: number, y: number, z: number, t: number) => number, c: number, x: number, y: number, z: number, t: number, h = 1e-3): number {
  const second = (g: (s: number) => number) => (-g(2 * h) + 16 * g(h) - 30 * g(0) + 16 * g(-h) - g(-2 * h)) / (12 * h * h);
  const utt = second((s) => u(x, y, z, t + s));
  const lap = second((s) => u(x + s, y, z, t)) + second((s) => u(x, y + s, z, t)) + second((s) => u(x, y, z + s, t));
  return utt - c * c * lap;
}

const radius = (x: number, y: number, z: number) => Math.hypot(x, y, z);

export const verification: Verification = {
  lesson: 'math.pde.spherical-waves',
  notes: {
    p1:
      '由 t = 0、r = 2 处 u = 0.9 得 F(2) = 1.8；t = 0.01 时 r = 5.4 处 r − ct = 5.4 − 3.4 = 2，u = F(2)/5.4。' +
      '另取三个只在 s = 2 处取值 1.8 相同、别处不同的 F（高斯、平移的正弦、三次多项式），算出的 u(5.4, 0.01) 都相同。',
    p2:
      'A、B、C 在三维直角坐标里用四阶中心差分（h = 10⁻³）算 u_tt − c²Δu 的残差，c 取 0.7、1、2.5，各取 12 个随机点（r ∈ [0.5, 3]、t ∈ [0, 3]，C 另加原点）：A 残差最大约 10² 量级（错），B、C 小于 10⁻⁴（对）；' +
      'D 设 u = [cos(r − ct) + G(r + ct)]/r，原点附近有界要 r·u → cos(−ct) + G(ct) = 0，G 取 −cos、cos、−cos + 0.1sin、−cos + 0.2 四个候选，在 t ∈ (0, 5] 的 50 个时刻看 r = 10⁻⁶ 处的 r·u，只有 −cos 趋于 0，再查它满足方程（对）；' +
      'E 取 F 是 [−2, −1] 上的 (s+2)³(−1−s)³、别处为 0，c = 1.5，在 r = 1、2 处扫 t 量 u ≠ 0 的时长，两处都是 1/c（错）。',
    p3:
      'c = 1，φ = e^{−r²}，ψ = 0：办法一在 r = 10⁻³、5×10⁻⁴ 算 w/r，两点外推到 r → 0⁺；办法二基尔霍夫公式在原点算 ∂t[t·M_φ(0, t)]，并在离原点 10⁻³ 的一般方向的点上再算一次；' +
      '办法三差分（R = 12，Δr = 10⁻³）原点外推。三者差小于 10⁻⁵，交的是办法一的值。',
    p4:
      'c = 2，φ = 0，ψ = e^{−r²}：办法一 u(1, ½) = (1/4)∫₀²s e^{−s²}ds；办法二基尔霍夫公式 u = t·M_ψ(x, 1)，x 取 (1, 1, 1)/√3（|x| = 1，不在极轴上）；' +
      '办法三差分（R = 12，Δr = 10⁻³）读 r = 1。三者差小于 10⁻⁵，交的是办法一的值。',
  },
  compute() {
    // p1
    const c1 = 340;
    const F2 = 0.9 * 2;
    const p1 = F2 / 5.4;
    check(Math.abs(5.4 - c1 * 0.01 - 2) < 1e-12, 'p1 相位 r − ct = 2');
    const Fs: F1[] = [
      (s) => 1.8 * Math.exp(-((s - 2) ** 2) * 3),
      (s) => 1.8 + 0.7 * Math.sin(5 * (s - 2)),
      (s) => 1.8 + (s - 2) - 4 * (s - 2) ** 3,
    ];
    for (const F of Fs) {
      check(Math.abs(F(2 - c1 * 0) / 2 - 0.9) < 1e-12, 'p1 F 满足 t = 0 的条件');
      check(Math.abs(F(5.4 - c1 * 0.01) / 5.4 - p1) < 1e-12, 'p1 不同的 F 给同一个值');
    }

    // p2
    const rand = seededRandom(20261120);
    const pts: [number, number, number, number][] = [];
    for (let k = 0; k < 12; k++) {
      // 随机方向、r ∈ [0.5, 3]、t ∈ [0, 3]
      const mu = 2 * rand() - 1;
      const a = 2 * Math.PI * rand();
      const r = 0.5 + 2.5 * rand();
      const st = Math.sqrt(1 - mu * mu);
      pts.push([r * st * Math.cos(a), r * st * Math.sin(a), r * mu, 3 * rand()]);
    }
    const cs = [0.7, 1, 2.5];
    const maxRes = (u: (c: number) => (x: number, y: number, z: number, t: number) => number, extra: [number, number, number, number][] = []) => {
      let m = 0;
      for (const c of cs) for (const [x, y, z, t] of [...pts, ...extra]) m = Math.max(m, Math.abs(residual(u(c), c, x, y, z, t)));
      return m;
    };
    const uA = (c: number) => (x: number, y: number, z: number, t: number) => Math.cos(radius(x, y, z) - c * t) / radius(x, y, z) ** 2;
    const uB = (c: number) => (x: number, y: number, z: number, t: number) => Math.cos(radius(x, y, z) - c * t) / radius(x, y, z);
    const uC = (c: number) => (x: number, y: number, z: number, t: number) => radius(x, y, z) ** 2 + 3 * c * c * t * t;
    const resA = maxRes(uA);
    const resB = maxRes(uB);
    const resC = maxRes(uC, [[0, 0, 0, 0.7]]);
    const A = resA < 1e-4;
    const B = resB < 1e-4;
    const C = resC < 1e-4;
    check(resA > 1e-2, `p2 A 的残差 ${resA} 应明显不为零`);

    // D：有界性逼出 G(s) = −cos s
    const candidates: [string, F1][] = [
      ['−cos', (s) => -Math.cos(s)],
      ['cos', (s) => Math.cos(s)],
      ['−cos + 0.1 sin', (s) => -Math.cos(s) + 0.1 * Math.sin(s)],
      ['−cos + 0.2', (s) => -Math.cos(s) + 0.2],
    ];
    const ts = Array.from({ length: 50 }, (_, i) => ((i + 1) * 5) / 50);
    const bounded = candidates.filter(([, G]) => {
      const c = 1.3;
      const rr = 1e-6;
      return ts.every((t) => Math.abs(Math.cos(rr - c * t) + G(rr + c * t)) < 1e-5); // r·u → 0
    });
    check(bounded.length === 1 && bounded[0][0] === '−cos', `p2 D 有界的候选 ${bounded.map((b) => b[0]).join(',')}`);
    const uD = (c: number) => (x: number, y: number, z: number, t: number) => {
      const r = radius(x, y, z);
      return (Math.cos(r - c * t) - Math.cos(r + c * t)) / r;
    };
    const resD = maxRes(uD);
    // 原点附近确实有界：r → 0 时 u → 2 sin(ct)
    const nearOrigin = ts.every((t) => Math.abs(uD(1.3)(1e-7, 0, 0, t) - 2 * Math.sin(1.3 * t)) < 1e-5);
    const D = resD < 1e-4 && nearOrigin;

    // E：只在一段区间上不为零的 F，量两处的振动时长
    const cE = 1.5;
    const FE: F1 = (s) => (s > -2 && s < -1 ? (s + 2) ** 3 * (-1 - s) ** 3 : 0);
    const duration = (r: number) => {
      const dt = 1e-5;
      let first = -1;
      let last = -1;
      for (let i = 0; i <= 10 / dt; i++) {
        const t = i * dt;
        if (FE(r - cE * t) / r !== 0) {
          if (first < 0) first = t;
          last = t;
        }
      }
      return last - first;
    };
    const tau1 = duration(1);
    const tau2 = duration(2);
    check(Math.abs(tau1 - 1 / cE) < 1e-4 && Math.abs(tau2 - 1 / cE) < 1e-4, `p2 E 两处时长 ${tau1}、${tau2}`);
    const E = Math.abs(tau2 - 2 * tau1) < 1e-4;

    const p2: number[] = [];
    [A, B, C, D, E].forEach((ok, i) => {
      if (ok) p2.push(i + 1);
    });

    // p3：c = 1，φ = e^{−r²}，ψ = 0
    const phi3: F1 = (r) => Math.exp(-r * r);
    const zero: F1 = () => 0;
    // u(r, 1) = a + b r² + …（w 是 r 的奇函数），取 r = 10⁻³、5×10⁻⁴ 两点外推出 r → 0⁺ 的极限
    const p3 = (4 * sphericalDalembert(1, phi3, zero, 5e-4, 1) - sphericalDalembert(1, phi3, zero, 1e-3, 1)) / 3;
    const phi3d: F3 = (x, y, z) => Math.exp(-(x * x + y * y + z * z));
    const zero3: F3 = () => 0;
    const k3 = kirchhoff(1, phi3d, zero3, 0, 0, 0, 1);
    const e = 1e-3 / Math.sqrt(3);
    const k3off = kirchhoff(1, phi3d, zero3, e, e, e, 1);
    const fd3 = radialFD(1, phi3, zero, 12, 1e-3, 1)(0);
    check(Math.abs(k3 - p3) < 1e-5, `p3 基尔霍夫 ${k3} 和办法一 ${p3}`);
    check(Math.abs(k3off - p3) < 1e-5, `p3 离原点 10⁻³ 处 ${k3off} 和办法一 ${p3}`);
    check(Math.abs(fd3 - p3) < 1e-5, `p3 差分 ${fd3} 和办法一 ${p3}`);

    // p4：c = 2，φ = 0，ψ = e^{−r²}
    const psi4: F1 = (r) => Math.exp(-r * r);
    const p4 = sphericalDalembert(2, zero, psi4, 1, 0.5);
    const s = 1 / Math.sqrt(3);
    const k4 = kirchhoff(2, zero3, phi3d, s, s, s, 0.5);
    const fd4 = radialFD(2, zero, psi4, 12, 1e-3, 0.5)(1);
    check(Math.abs(k4 - p4) < 1e-5, `p4 基尔霍夫 ${k4} 和办法一 ${p4}`);
    check(Math.abs(fd4 - p4) < 1e-5, `p4 差分 ${fd4} 和办法一 ${p4}`);

    console.log(
      `  （核对：p2 残差 A ${resA.toExponential(2)}、B ${resB.toExponential(2)}、C ${resC.toExponential(2)}、D ${resD.toExponential(2)}；` +
        `p3 基尔霍夫 ${k3.toPrecision(10)}、偏离原点 ${k3off.toPrecision(10)}、差分 ${fd3.toPrecision(10)}；p4 基尔霍夫 ${k4.toPrecision(10)}、差分 ${fd4.toPrecision(10)}）`,
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
