// 独立验算 math.pde.string-modes 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 每道题都用两种互不依赖的算法：一是打靶求特征值、照达朗贝尔公式（奇延拓、按周期 2L 延开）积分或照级数求和；
// 二是不用任何公式，用显式中心差分格式（Courant 数 0.5，两端 u = 0）直接解 u_tt = c²u_xx 的初边值问题。
// 单独运行：npx tsx tools/verify/math.pde.string-modes.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { rk4Vec, simpson } from './math.ode._numeric.ts';

type F1 = (x: number) => number;
type F2 = (x: number, t: number) => number;

function check(ok: boolean, what: string): void {
  if (!ok) throw new Error(`核对失败：${what}`);
}

/** 打靶：X″ + λX = 0，X(0) = 0、X′(0) = 1，四阶龙格-库塔积到 L，返回 X(L)。 */
function shoot(lambda: number, L: number, steps = 1000): number {
  return rk4Vec((_x, Y) => [Y[1], -lambda * Y[0]], 0, [0, 1], L, steps)[0];
}

/**
 * 两端为零的边值问题 X″ + λX = 0、X(0) = X(L) = 0 的前 k 个特征值：
 * 不用公式，把 μ = λL² 在 [−50, 1000] 上以 0.1 为步粗扫 X(L) 的变号，再二分；同时核对 μ ≤ 0 一段 X(L) 不为零（只有零解）。
 */
function eigenvalues(L: number, k: number): number[] {
  const g = (mu: number): number => shoot(mu / (L * L), L);
  for (let mu = -50; mu <= 0; mu += 0.5) check(Math.abs(g(mu)) > 1e-6 * L, `λ ≤ 0 时 X(L) 不为零（L = ${L}，μ = ${mu}）`);
  const roots: number[] = [];
  let a = 0.05;
  let ga = g(a);
  for (let b = a + 0.1; b <= 1000 && roots.length < k; b += 0.1) {
    const gb = g(b);
    if (ga * gb < 0) {
      let l = a;
      let r = b;
      let gl = ga;
      for (let it = 0; it < 80; it++) {
        const m = (l + r) / 2;
        const gm = g(m);
        if (gl * gm <= 0) r = m;
        else {
          l = m;
          gl = gm;
        }
      }
      roots.push((l + r) / 2 / (L * L));
    }
    a = b;
    ga = gb;
  }
  check(roots.length === k, `找到 ${k} 个特征值（L = ${L}）`);
  return roots;
}

/**
 * 不用公式：[0, L] 上 N 段的中心差分格式解 u_tt = c²u_xx，两端 u = 0，初值 φ、ψ，推进到 T（步长调成 T 的整数分之一，Courant 数 ≤ 0.5）。
 * 第一步 u¹ = u⁰ + Δt·ψ + ½r²δ²u⁰（二阶精度），之后 u^{n+1} = 2uⁿ − u^{n−1} + r²δ²uⁿ。每一步把 (t, u) 交给 onStep，返回 T 时刻的格点值。
 */
function waveFD(c: number, L: number, phi: F1, psi: F1, N: number, T: number, onStep?: (t: number, u: number[]) => void): number[] {
  const dx = L / N;
  const steps = Math.ceil(T / ((0.5 * dx) / c) - 1e-9);
  const dt = T / steps;
  const r2 = ((c * dt) / dx) ** 2;
  const xs = Array.from({ length: N + 1 }, (_, j) => j * dx);
  let prev = xs.map((x, j) => (j === 0 || j === N ? 0 : phi(x)));
  let cur = prev.map((u, j) => (j === 0 || j === N ? 0 : u + dt * psi(xs[j]) + 0.5 * r2 * (prev[j + 1] - 2 * u + prev[j - 1])));
  onStep?.(0, prev);
  onStep?.(dt, cur);
  for (let n = 1; n < steps; n++) {
    const next = cur.map((u, j) => (j === 0 || j === N ? 0 : 2 * u - prev[j] + r2 * (cur[j + 1] - 2 * u + cur[j - 1])));
    prev = cur;
    cur = next;
    onStep?.((n + 1) * dt, cur);
  }
  return cur;
}

/** f 在 [0, L] 上的值奇延拓、再按周期 2L 延到整条直线。 */
function oddPeriodic(f: F1, L: number): F1 {
  return (x) => {
    const y = ((x % (2 * L)) + 2 * L) % (2 * L);
    return y <= L ? f(y) : -f(2 * L - y);
  };
}

/** 达朗贝尔公式（初值换成延拓后的函数）：½[φ̃(x − ct) + φ̃(x + ct)] + (1/2c)∫ψ̃，积分在 L 的整数倍处分段、每段辛普森 2000 段。 */
function dalembertExtended(c: number, L: number, phi: F1, psi: F1, x: number, t: number): number {
  const pt = oddPeriodic(phi, L);
  const st = oddPeriodic(psi, L);
  const a = x - c * t;
  const b = x + c * t;
  const cuts = [a];
  for (let k = Math.ceil(a / L); k * L < b; k++) if (k * L > a) cuts.push(k * L);
  cuts.push(b);
  let integral = 0;
  for (let i = 0; i + 1 < cuts.length; i++) integral += simpson(st, cuts[i], cuts[i + 1], 2000);
  return 0.5 * (pt(a) + pt(b)) + integral / (2 * c);
}

/**
 * 按定义判断 u 是不是一个简正模：对 n = 1…8，在 19 × 41 个格点 (x, t) 上用最小二乘拟合
 * u ≈ (A cos ω_n t + B sin ω_n t) sin(nπx/L)（ω_n 取打靶算出的 c√λ_n），残差的均方根相对 u 小于 10⁻⁶（打靶的特征值有约 10⁻¹⁰ 的相对误差）、且 A、B 不全为零时返回 n，否则返回 0。
 */
function modeIndex(u: F2, L: number, c: number, omegas: number[]): { n: number; A: number; B: number } {
  const none = { n: 0, A: Number.NaN, B: Number.NaN };
  const xs = Array.from({ length: 19 }, (_, i) => (L * (i + 1)) / 20);
  const ts = Array.from({ length: 41 }, (_, j) => (j * 0.05 * 2 * L) / c);
  let norm = 0;
  for (const x of xs) for (const t of ts) norm += u(x, t) ** 2;
  if (norm < 1e-20) return none;
  for (let n = 1; n <= omegas.length; n++) {
    const w = omegas[n - 1];
    // 正规方程 [Σp², Σpq; Σpq, Σq²][A; B] = [Σpu; Σqu]，p = cos·sin、q = sin·sin
    let pp = 0;
    let pq = 0;
    let qq = 0;
    let pu = 0;
    let qu = 0;
    for (const x of xs)
      for (const t of ts) {
        const s = Math.sin((n * Math.PI * x) / L);
        const p = Math.cos(w * t) * s;
        const q = Math.sin(w * t) * s;
        const v = u(x, t);
        pp += p * p;
        pq += p * q;
        qq += q * q;
        pu += p * v;
        qu += q * v;
      }
    const det = pp * qq - pq * pq;
    const A = (pu * qq - qu * pq) / det;
    const B = (pp * qu - pq * pu) / det;
    let res = 0;
    for (const x of xs)
      for (const t of ts) {
        const s = Math.sin((n * Math.PI * x) / L);
        res += (u(x, t) - (A * Math.cos(w * t) + B * Math.sin(w * t)) * s) ** 2;
      }
    if (Math.sqrt(res / norm) < 1e-6 && Math.abs(A) + Math.abs(B) > 1e-8) return { n, A, B };
  }
  return none;
}

/** 方程的残差（中心差分，步长 h）和两端的值，用来说明 B、D 为什么不是简正模。 */
function pdeResidual(u: F2, L: number, c: number): number {
  const h = 1e-3 * L;
  let worst = 0;
  for (let i = 1; i < 10; i++)
    for (let j = 0; j < 10; j++) {
      const x = (L * i) / 10;
      const t = (j * L) / (5 * c) + 0.1;
      const utt = (u(x, t + h / c) - 2 * u(x, t) + u(x, t - h / c)) / (h / c) ** 2;
      const uxx = (u(x + h, t) - 2 * u(x, t) + u(x - h, t)) / h ** 2;
      worst = Math.max(worst, Math.abs(utt - c * c * uxx));
    }
  return worst;
}
function boundaryValue(u: F2, L: number, c: number): number {
  let worst = 0;
  for (let j = 0; j <= 40; j++) {
    const t = (j * L) / (10 * c);
    worst = Math.max(worst, Math.abs(u(0, t)), Math.abs(u(L, t)));
  }
  return worst;
}

export const verification: Verification = {
  lesson: 'math.pde.string-modes',
  notes: {
    p1:
      '不用 ω_n = nπc/L：打靶解 X″ + λX = 0、X(0) = 0、X′(0) = 1（四阶龙格-库塔），把 λL² 在 [−50, 1000] 上粗扫 X(1.5) 的变号再二分，λ ≤ 0 一段没有零点，' +
      '取第二个特征值，ω₂ = c√λ₂ = 180√λ₂（约 240π）。另用差分格式（600 段）从初始形状 sin(2πx/1.5)、静止开始推进，读 x = L/4 处相邻两次过零的时间差 Δt，π/Δt 和它相差小于 10⁻⁴（相对）。',
    p2:
      '取 (L, c) = (1, 1) 和 (2.3, 0.7)。A、B、D 按定义判：对 n = 1…8 在 19 × 41 个格点上最小二乘拟合 (A cos ω_n t + B sin ω_n t) sin(nπx/L)（ω_n 用打靶算出的 c√λ_n），' +
      '残差的均方根不到 u 的 10⁻⁶（打靶的特征值有约 10⁻¹⁰ 的相对误差）、A、B 不全为零才算简正模。A：拟合 n = 3、A = cos 1、B = −sin 1，对；B：方程残差不为零（u_tt 是 c²u_xx 的 4 倍），错；D：满足方程、但 u(L, t) = cos(πct/2L) ≠ 0，错。' +
      'C：在 (L, c) = (1, 1)、(1.5, 180)、(0.65, 300)、(2.3, 0.7) 上分别打靶求长 L 的 ω₁ 和长 2L 的 ω₂，都相等，对。' +
      'E：在 (1, 1)、(2, 3) 上取 φ = 0、ψ 为 x²(L−x)²、x(L−x)(x−0.3L)、sin³(πx/L)、max(0, 1−((x−0.3L)/0.15L)²)²（都满足定理的条件），' +
      '用差分格式（800 段）和达朗贝尔公式（奇延拓后数值积分）算 u(·, L/c)，最大绝对值分别不到 t = L/2c 时的 2×10⁻⁴、5×10⁻⁹（容差取 10⁻³、10⁻⁷；' +
      '误差最大的是二阶导数有跳跃的那个鼓包，其余三个是 10⁻⁵、10⁻¹² 量级），对。',
    p3:
      'L = π、c = 1、φ = 0、ψ = sin³x。三种算法：达朗贝尔公式 u(π/2, π/2) = ½∫₀^π ψ̃（ψ̃ 是奇延拓、按周期 2π 延开的 ψ，辛普森公式）；' +
      '级数 Σ B_n sin(nt) sin(nx)，B_n = (2/nπ)∫₀^π ψ sin nx dx 用辛普森公式算到 n = 40；差分格式（2000 段）直接推进到 t = π/2 读 x = π/2 处的值。三者相差都小于 10⁻⁶，等于 2/3。',
    p4:
      'L = 2、c = 4、ψ = 0，取 a = 0.01（方程是线性的，周期和 a 无关）。正弦系数 A_n = (2/L)∫φ sin(nπx/L) 用辛普森公式算到 n = 12，u = Σ A_n cos(nπct/L) sin(nπx/L)；' +
      '令 D(T) = max |u(x, t + T) − u(x, t)|（x 取 41 个点、t ∈ [0, 1] 取 41 个点），在 (0, 1.5] 上以 0.001 为步扫，再在局部极小处黄金分割细化，D(T) < 10⁻¹² 的最小 T 是 0.5；' +
      '同时核对 T = 2L/c = 1 也是周期、0.25 不是。另用差分格式（400 段）推进到 t = 1.2，每一步记形状和初始形状的最大差，t > 0.05 后第一次小于 10⁻³·a 的局部极小在 0.5 附近（差小于 10⁻³）。',
  },
  compute() {
    // ---- p1：L = 1.5，c = 180 ----
    const L1 = 1.5;
    const c1 = 180;
    const lam1 = eigenvalues(L1, 2);
    const p1 = c1 * Math.sqrt(lam1[1]);
    {
      const N = 600;
      const j = N / 4;
      const crossings: number[] = [];
      let lastT = 0;
      let lastU = 0;
      waveFD(c1, L1, (x) => Math.sin((2 * Math.PI * x) / L1), () => 0, N, 0.02, (t, u) => {
        if (t > 0 && lastU * u[j] < 0) crossings.push(lastT + ((t - lastT) * lastU) / (lastU - u[j]));
        lastT = t;
        lastU = u[j];
      });
      check(crossings.length >= 2, 'p1 差分：至少两次过零');
      const wFD = Math.PI / (crossings[1] - crossings[0]);
      check(Math.abs(wFD - p1) < 1e-4 * p1, `p1 差分 ${wFD} 和打靶 ${p1}`);
    }

    // ---- p2 ----
    const opts: ((L: number, c: number) => F2)[] = [
      (L, c) => (x, t) => Math.sin((3 * Math.PI * x) / L) * Math.cos((3 * Math.PI * c * t) / L + 1), // A
      (L, c) => (x, t) => Math.sin((Math.PI * x) / L) * Math.cos((2 * Math.PI * c * t) / L), // B
      () => () => Number.NaN, // C 另判
      (L, c) => (x, t) => Math.sin((Math.PI * x) / (2 * L)) * Math.cos((Math.PI * c * t) / (2 * L)), // D
      () => () => Number.NaN, // E 另判
    ];
    const truth: boolean[] = [];
    const pairs: [number, number][] = [
      [1, 1],
      [2.3, 0.7],
    ];
    const omegaCache = new Map<string, number[]>();
    const omegasFor = (L: number, c: number): number[] => {
      const key = `${L},${c}`;
      if (!omegaCache.has(key)) omegaCache.set(key, eigenvalues(L, 8).map((lam) => c * Math.sqrt(lam)));
      return omegaCache.get(key) as number[];
    };
    for (const idx of [0, 1, 3]) {
      truth[idx] = pairs.every(([L, c]) => modeIndex(opts[idx](L, c), L, c, omegasFor(L, c)).n > 0);
    }
    // A 拟合出来的是第 3 个，A = cos 1、B = −sin 1；B 不满足方程；D 满足方程、不满足右端的条件
    const fitA = modeIndex(opts[0](1, 1), 1, 1, omegasFor(1, 1));
    check(fitA.n === 3 && Math.abs(fitA.A - Math.cos(1)) < 1e-6 && Math.abs(fitA.B + Math.sin(1)) < 1e-6, `p2 A 是第 3 个简正模（${JSON.stringify(fitA)}）`);
    check(pdeResidual(opts[1](1, 1), 1, 1) > 1, 'p2 B 不满足方程');
    check(pdeResidual(opts[3](1, 1), 1, 1) < 1e-4 && boundaryValue(opts[3](1, 1), 1, 1) > 0.5, 'p2 D 满足方程、右端不为零');
    // C：长 2L 的 ω₂ 和长 L 的 ω₁
    truth[2] = (
      [
        [1, 1],
        [1.5, 180],
        [0.65, 300],
        [2.3, 0.7],
      ] as [number, number][]
    ).every(([L, c]) => {
      const w1 = c * Math.sqrt(eigenvalues(L, 1)[0]);
      const w2long = c * Math.sqrt(eigenvalues(2 * L, 2)[1]);
      return Math.abs(w2long - w1) < 1e-8 * w1;
    });
    // E：φ = 0、ψ 满足定理的条件时 t = L/c 的形状
    truth[4] = (
      [
        [1, 1],
        [2, 3],
      ] as [number, number][]
    ).every(([L, c]) => {
      const psis: F1[] = [
        (x) => x * x * (L - x) * (L - x),
        (x) => x * (L - x) * (x - 0.3 * L),
        (x) => Math.sin((Math.PI * x) / L) ** 3,
        (x) => Math.max(0, 1 - ((x - 0.3 * L) / (0.15 * L)) ** 2) ** 2,
      ];
      return psis.every((psi) => {
        const N = 800;
        const atHalf = waveFD(c, L, () => 0, psi, N, L / (2 * c));
        const atFull = waveFD(c, L, () => 0, psi, N, L / c);
        const scale = Math.max(...atHalf.map(Math.abs));
        const fdMax = Math.max(...atFull.map(Math.abs));
        const formulaMax = Math.max(...Array.from({ length: 21 }, (_, i) => Math.abs(dalembertExtended(c, L, () => 0, psi, (L * i) / 20, L / c))));
        // 最后一个 ψ 的二阶导数在 0.15L、0.45L 处跳跃，差分约 2×10⁻⁴、辛普森约 5×10⁻⁹ 的相对误差，容差放到 10⁻³、10⁻⁷
        return scale > 1e-3 && fdMax < 1e-3 * scale && formulaMax < 1e-7 * scale;
      });
    });
    const p2 = truth.map((ok, i) => (ok ? i + 1 : 0)).filter((i) => i > 0);

    // ---- p3：L = π，c = 1，φ = 0，ψ = sin³x ----
    const psi3: F1 = (x) => Math.sin(x) ** 3;
    const p3 = dalembertExtended(1, Math.PI, () => 0, psi3, Math.PI / 2, Math.PI / 2);
    {
      let series = 0;
      for (let n = 1; n <= 40; n++) {
        const Bn = (2 / (n * Math.PI)) * simpson((x) => psi3(x) * Math.sin(n * x), 0, Math.PI, 4000);
        series += Bn * Math.sin((n * Math.PI) / 2) * Math.sin((n * Math.PI) / 2);
      }
      check(Math.abs(series - p3) < 1e-6, `p3 级数 ${series} 和公式 ${p3}`);
      const N = 2000;
      const fd = waveFD(1, Math.PI, () => 0, psi3, N, Math.PI / 2);
      check(Math.abs(fd[N / 2] - p3) < 1e-6, `p3 差分 ${fd[N / 2]} 和公式 ${p3}`);
      check(Math.abs(p3 - 2 / 3) < 1e-9, `p3 ${p3} 等于 2/3`);
    }

    // ---- p4：L = 2，c = 4，ψ = 0，φ = a(sin(2πx/L) + sin(4πx/L)) ----
    const L4 = 2;
    const c4 = 4;
    const a4 = 0.01;
    const phi4: F1 = (x) => a4 * (Math.sin((2 * Math.PI * x) / L4) + Math.sin((4 * Math.PI * x) / L4));
    const An = Array.from({ length: 12 }, (_, k) => (2 / L4) * simpson((x) => phi4(x) * Math.sin(((k + 1) * Math.PI * x) / L4), 0, L4, 4000));
    const u4: F2 = (x, t) => An.reduce((sum, A, k) => sum + A * Math.cos(((k + 1) * Math.PI * c4 * t) / L4) * Math.sin(((k + 1) * Math.PI * x) / L4), 0);
    const xs4 = Array.from({ length: 41 }, (_, i) => (L4 * i) / 40);
    const ts4 = Array.from({ length: 41 }, (_, j) => j / 40);
    const D = (T: number): number => {
      let worst = 0;
      for (const x of xs4) for (const t of ts4) worst = Math.max(worst, Math.abs(u4(x, t + T) - u4(x, t)));
      return worst;
    };
    let p4 = Number.NaN;
    for (let k = 1; k <= 1500 && Number.isNaN(p4); k++) {
      const T = k / 1000;
      if (D(T) < D(T - 0.001) && D(T) <= D(T + 0.001)) {
        // 局部极小：在 [T − 0.001, T + 0.001] 上黄金分割
        let lo = T - 0.001;
        let hi = T + 0.001;
        const g = 0.6180339887498949;
        for (let it = 0; it < 100; it++) {
          const m1 = hi - g * (hi - lo);
          const m2 = lo + g * (hi - lo);
          if (D(m1) < D(m2)) hi = m2;
          else lo = m1;
        }
        const Tmin = (lo + hi) / 2;
        if (D(Tmin) < 1e-12) p4 = Tmin;
      }
    }
    check(!Number.isNaN(p4), 'p4 找到周期');
    check(D(1) < 1e-12, 'p4 2L/c = 1 也是周期');
    check(D(0.25) > 1e-3 * a4, 'p4 0.25 不是周期');
    {
      const N = 400;
      const dev: { t: number; d: number }[] = [];
      waveFD(c4, L4, phi4, () => 0, N, 1.2, (t, u) => {
        let worst = 0;
        u.forEach((v, j) => {
          worst = Math.max(worst, Math.abs(v - phi4((j * L4) / N)));
        });
        dev.push({ t, d: worst });
      });
      let tFD = Number.NaN;
      for (let i = 1; i + 1 < dev.length && Number.isNaN(tFD); i++) {
        if (dev[i].t > 0.05 && dev[i].d <= dev[i - 1].d && dev[i].d <= dev[i + 1].d && dev[i].d < 1e-3 * a4) tFD = dev[i].t;
      }
      check(Math.abs(tFD - p4) < 1e-3, `p4 差分 ${tFD} 和级数 ${p4}`);
    }

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
