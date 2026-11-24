// 独立验算 math.pde.wave-dalembert 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 两套算法：一是照达朗贝尔公式，积分用分段的复合高斯-勒让德公式（在被积函数的断点处分段）；二是不用公式，
// 用显式差分格式（中心差分，Courant 数 0.5）直接解 u_tt = c²u_xx 的初值问题，核对公式算出的数。
// 单独运行：npx tsx tools/verify/math.pde.wave-dalembert.ts

import { fileURLToPath } from 'node:url';
import { runVerification, supOfPredicate, type Verification } from './lib.ts';

type F1 = (x: number) => number;

// 5 点高斯-勒让德求积的节点和权（[−1, 1] 上）。节点都在区间内部，不取端点的值：
// 被积函数在断点处跳跃时（p4 的示性函数在 ±1 处取 0），端点上的值不影响结果。
const GL_X = [0, -0.5384693101056831, 0.5384693101056831, -0.906179845938664, 0.906179845938664];
const GL_W = [0.5688888888888889, 0.4786286704993665, 0.4786286704993665, 0.2369268850561891, 0.2369268850561891];

/** [a, b] 上的复合 5 点高斯-勒让德公式；breaks 是被积函数可能不光滑的点，落在 (a, b) 里的先分段，每段再分 m 个小区间。 */
function integrate(f: F1, a: number, b: number, breaks: number[] = [], m = 400): number {
  if (a === b) return 0;
  if (a > b) return -integrate(f, b, a, breaks, m);
  const pts = [a, ...breaks.filter((p) => p > a && p < b).sort((p, q) => p - q), b];
  let sum = 0;
  for (let k = 0; k + 1 < pts.length; k++) {
    const h = (pts[k + 1] - pts[k]) / m;
    for (let i = 0; i < m; i++) {
      const mid = pts[k] + (i + 0.5) * h;
      for (let q = 0; q < 5; q++) sum += 0.5 * h * GL_W[q] * f(mid + 0.5 * h * GL_X[q]);
    }
  }
  return sum;
}

/** 达朗贝尔公式：u(x, t) = ½[φ(x − ct) + φ(x + ct)] + (1/2c)∫_{x−ct}^{x+ct} ψ。 */
function dalembert(c: number, phi: F1, psi: F1, x: number, t: number, breaks: number[] = []): number {
  return 0.5 * (phi(x - c * t) + phi(x + c * t)) + integrate(psi, x - c * t, x + c * t, breaks) / (2 * c);
}

/**
 * 不用公式：在 [X0, X1] 上用中心差分格式解 u_tt = c²u_xx（两端 u = 0），算到时刻 T，返回 u(x, T)。
 * 第一步 u¹ = u⁰ + Δt·ψ + ½r²δ²u⁰（二阶精度），之后 u^{n+1} = 2uⁿ − u^{n−1} + r²δ²uⁿ，r = cΔt/Δx = 0.5。
 * 端点取得足够远：数值信号每步最多走一格，T 时间内走不到要读的点。
 */
function finiteDifference(c: number, phi: F1, psi: F1, X0: number, X1: number, dx: number, T: number): (x: number) => number {
  const r = 0.5;
  const dt = (r * dx) / c;
  const steps = Math.round(T / dt);
  if (Math.abs(steps * dt - T) > 1e-9) throw new Error('差分：T 不是步长的整数倍');
  const N = Math.round((X1 - X0) / dx);
  const xs = Array.from({ length: N + 1 }, (_, j) => X0 + j * dx);
  let prev = xs.map(phi);
  prev[0] = prev[N] = 0;
  let cur = prev.map((u, j) => (j === 0 || j === N ? 0 : u + dt * psi(xs[j]) + 0.5 * r * r * (prev[j + 1] - 2 * u + prev[j - 1])));
  for (let n = 1; n < steps; n++) {
    const next = cur.map((u, j) => (j === 0 || j === N ? 0 : 2 * u - prev[j] + r * r * (cur[j + 1] - 2 * u + cur[j - 1])));
    prev = cur;
    cur = next;
  }
  const last = steps === 0 ? prev : cur;
  return (x: number) => {
    const j = Math.round((x - X0) / dx);
    if (Math.abs(X0 + j * dx - x) > 1e-9) throw new Error('差分：只读格点上的值');
    return last[j];
  };
}

function check(ok: boolean, what: string): void {
  if (!ok) throw new Error(`核对失败：${what}`);
}

// p2 的检验函数：在 [0, 1] 以外为 0。x³(1 − x)³ 有连续的二阶导数，x²(1 − x)² 有连续的导数。
const bump3: F1 = (x) => (x > 0 && x < 1 ? x ** 3 * (1 - x) ** 3 : 0);
const bump2: F1 = (x) => (x > 0 && x < 1 ? x ** 2 * (1 - x) ** 2 : 0);

export const verification: Verification = {
  lesson: 'math.pde.wave-dalembert',
  notes: {
    p1: 'c = 2，ψ = 0：u(1, 1) = ½[φ(−1) + φ(3)]；另用差分格式（[−30, 30]，Δx = 0.005，Courant 数 0.5）直接解初值问题，读 u(1, 1) 核对，差小于 10⁻⁴。',
    p2:
      'c = 3，按公式在 6 组 (φ, ψ) 上逐条判：φ 取 0、x³(1−x)³、−2x³(1−x)³、x³(1−x)³(x−½)，ψ 取 0、x²(1−x)²、−x²(1−x)²、x²(1−x)²(x−½)（积分为 0），都在 [0, 1] 以外为 0；' +
      'A 看 x = 10、t ∈ (4, 20] 的 400 个时刻（ψ = x²(1−x)² 时 u = ⅙∫ψ = 1/180 ≠ 0，错）；B 看 t = 1、x ∈ [−6, 7] 去掉 [0, 1] 的格点（x = 2 时 u = ⅙∫ψ ≠ 0，错）；' +
      'C 看 u(5, 1)（依赖区间 [2, 8]，对）；D 看 x = 10、t ∈ (0, 3) 的 300 个时刻（依赖区间在 1 右边，对）；E 比较 u(−2, 1) 和 ⅙∫₀¹ψ（φ(1) = φ(−5) = 0，对）。另用差分格式核对一组的 u(−2, 1)。',
    p3: 'c = 1，φ = 0：u(1, 1) = ½∫₀²ψ，高斯-勒让德公式算积分；另用差分格式（[−30, 30]，Δx = 0.005）直接解初值问题核对。',
    p4:
      'c = 2，u(7, t) = ¼∫_{7−2t}^{7+2t}ψ，在 ψ 的跳跃点 ±1 处分段积分；取 t = 200 时的值当作最后的值，用二分求「u(7, t) 和它相差超过 10⁻⁹」的 t 的上确界，就是 t1；' +
      '再核对 t1 以后 2000 个时刻的值都等于它、t1 以前紧挨着的值不等于它。',
  },
  compute() {
    // p1：c = 2
    const phi1: F1 = (x) => 1 / (1 + x * x);
    const zero: F1 = () => 0;
    const p1 = dalembert(2, phi1, zero, 1, 1);
    const fd1 = finiteDifference(2, phi1, zero, -30, 30, 0.005, 1);
    check(Math.abs(fd1(1) - p1) < 1e-4, `p1 差分 ${fd1(1)} 和公式 ${p1}`);

    // p2：c = 3
    const c2 = 3;
    const phis: F1[] = [zero, bump3, (x) => -2 * bump3(x), (x) => bump3(x) * (x - 0.5)];
    const psis: F1[] = [zero, bump2, (x) => -bump2(x), (x) => bump2(x) * (x - 0.5)];
    const pairs: [F1, F1][] = [
      [phis[1], psis[0]],
      [phis[0], psis[1]],
      [phis[1], psis[1]],
      [phis[2], psis[2]],
      [phis[3], psis[3]],
      [phis[3], psis[1]],
    ];
    const u2 = (phi: F1, psi: F1, x: number, t: number) => dalembert(c2, phi, psi, x, t, [0, 1]);
    const isZero = (v: number) => Math.abs(v) < 1e-12;
    const tA = Array.from({ length: 400 }, (_, i) => 4 + ((i + 1) * 16) / 400);
    const xB = Array.from({ length: 1301 }, (_, i) => -6 + i * 0.01).filter((x) => x < -1e-9 || x > 1 + 1e-9);
    const tD = Array.from({ length: 300 }, (_, i) => ((i + 0.5) * 3) / 300);
    const statements: ((phi: F1, psi: F1) => boolean)[] = [
      (phi, psi) => tA.every((t) => isZero(u2(phi, psi, 10, t))), // A
      (phi, psi) => xB.every((x) => isZero(u2(phi, psi, x, 1))), // B
      (phi, psi) => isZero(u2(phi, psi, 5, 1)), // C
      (phi, psi) => tD.every((t) => isZero(u2(phi, psi, 10, t))), // D
      (phi, psi) => Math.abs(u2(phi, psi, -2, 1) - integrate(psi, 0, 1) / 6) < 1e-12, // E
    ];
    const p2: number[] = [];
    statements.forEach((s, i) => {
      if (pairs.every(([phi, psi]) => s(phi, psi))) p2.push(i + 1);
    });
    // A、B 的反例：ψ = x²(1 − x)² 时 ⅙∫ψ = 1/180
    check(Math.abs(u2(zero, bump2, 10, 5) - 1 / 180) < 1e-12, 'p2 A 的反例 u(10, 5) = 1/180');
    check(Math.abs(u2(zero, bump2, 2, 1) - 1 / 180) < 1e-12, 'p2 B 的反例 u(2, 1) = 1/180');
    const fd2 = finiteDifference(c2, bump3, bump2, -20, 20, 0.0025, 1);
    check(Math.abs(fd2(-2) - u2(bump3, bump2, -2, 1)) < 1e-5, `p2 E 差分 ${fd2(-2)} 和公式 ${u2(bump3, bump2, -2, 1)}`);

    // p3：c = 1
    const psi3: F1 = (x) => (2 * x) / (1 + x * x) ** 2;
    const p3 = dalembert(1, zero, psi3, 1, 1);
    const fd3 = finiteDifference(1, zero, psi3, -30, 30, 0.005, 1);
    check(Math.abs(fd3(1) - p3) < 1e-4, `p3 差分 ${fd3(1)} 和公式 ${p3}`);

    // p4：c = 2，ψ 是 (−1, 1) 的示性函数，直接照公式算
    const psi4: F1 = (x) => (Math.abs(x) < 1 ? 1 : 0);
    const u4 = (t: number) => dalembert(2, zero, psi4, 7, t, [-1, 1]);
    const final = u4(200);
    const t1 = supOfPredicate((t) => Math.abs(u4(t) - final) > 1e-9, 0, 200, 20_000);
    if (t1 === null) throw new Error('p4：u(7, t) 一直不变');
    check(Array.from({ length: 2000 }, (_, i) => t1 + 1e-6 + i * 0.05).every((t) => Math.abs(u4(t) - final) < 1e-9), 'p4 t1 以后 u(7, t) 不变');
    check(Math.abs(u4(t1 - 1e-3) - final) > 1e-6, 'p4 t1 以前紧挨着的值不同');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [t1, final] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
