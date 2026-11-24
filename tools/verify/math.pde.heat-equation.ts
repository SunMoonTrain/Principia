// 独立验算 math.pde.heat-equation 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.pde.heat-equation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';

type Vec3 = [number, number, number];
const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const scale = (k: number, a: Vec3): Vec3 => [k * a[0], k * a[1], k * a[2]];

/** 中心差分求三元函数的梯度（步长 1e-4）。 */
function gradient(u: (r: Vec3) => number, r: Vec3, h = 1e-4): Vec3 {
  const g: Vec3 = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    const rp = [...r] as Vec3;
    const rm = [...r] as Vec3;
    rp[i] += h;
    rm[i] -= h;
    g[i] = (u(rp) - u(rm)) / (2 * h);
  }
  return g;
}

/** 一维热方程 u_t = D u_xx 在 (x, t) 处的残差，导数用中心差分。 */
function heatResidual(u: (x: number, t: number) => number, D: number, x: number, t: number, h = 1e-3): number {
  const ut = (u(x, t + h) - u(x, t - h)) / (2 * h);
  const uxx = (u(x + h, t) - 2 * u(x, t) + u(x - h, t)) / (h * h);
  return ut - D * uxx;
}

/**
 * 杆 [0, L] 上 u_t = D u_xx 的显式差分（N 段，dt = 0.4 h²/D）：
 * 左端给流进杆的热流密度 qIn（-κ u_x(0) = qIn，用虚格点 u_{-1} = u_1 + 2h·qIn/κ），右端温度固定为 uRight。
 * 推进到相邻两步的最大变化小于 tol，返回整条杆的温度。
 */
function rodToSteady(phi: (x: number) => number, L: number, kappa: number, D: number, qIn: number, uRight: number, N = 80, tol = 1e-14): number[] {
  const h = L / N;
  const dt = (0.4 * h * h) / D;
  let u = Array.from({ length: N + 1 }, (_, j) => phi(j * h));
  u[N] = uRight;
  for (let step = 0; step < 5_000_000; step++) {
    const next = u.slice();
    for (let j = 0; j < N; j++) {
      const left = j === 0 ? u[1] + (2 * h * qIn) / kappa : u[j - 1];
      next[j] = u[j] + (D * dt * (u[j + 1] - 2 * u[j] + left)) / (h * h);
    }
    next[N] = uRight;
    const change = Math.max(...next.map((v, j) => Math.abs(v - u[j])));
    u = next;
    if (change < tol) return u;
  }
  throw new Error('差分没有收敛到稳态');
}

/**
 * 杆 [0, L] 上 u_t = D u_xx，左端温度固定为 0（插在冰水混合物里），右端绝热（u_x = 0），初温 phi。
 * 显式差分推进到 tEnd，记录各时刻左端的温度和左端的 u_x（单侧二阶差分）。
 */
function iceEndHistory(phi: (x: number) => number, L: number, D: number, tEnd: number, N = 60): { uLeft: number[]; uxLeft: number[] } {
  const h = L / N;
  const steps = Math.ceil(tEnd / ((0.4 * h * h) / D));
  const dt = tEnd / steps;
  let u = Array.from({ length: N + 1 }, (_, j) => phi(j * h));
  u[0] = 0;
  const uLeft: number[] = [];
  const uxLeft: number[] = [];
  for (let s = 1; s <= steps; s++) {
    const next = u.slice();
    for (let j = 1; j <= N; j++) {
      const right = j === N ? u[N - 1] : u[j + 1];
      next[j] = u[j] + (D * dt * (right - 2 * u[j] + u[j - 1])) / (h * h);
    }
    next[0] = 0;
    u = next;
    if (s % Math.floor(steps / 5) === 0) {
      uLeft.push(u[0]);
      uxLeft.push((-3 * u[0] + 4 * u[1] - u[2]) / (2 * h));
    }
  }
  return { uLeft, uxLeft };
}

export const verification: Verification = {
  lesson: 'math.pde.heat-equation',
  notes: {
    p1:
      '取梯度为 (30, −40, 0) K/m 的线性温度场 u = 30x − 40y + 常数，用中心差分求 ∇u 核对，' +
      '按傅里叶定律 q = −κ∇u（κ = 400）算出 q，再和 y 轴正方向的单位向量点乘，得每秒穿过单位面积的热量（W/m²），除以 1000 换成 kW/m²。',
    p2:
      'A：显式差分模拟一端插在冰水里（u = 0）、另一端绝热的杆，取两种初温（均匀 50 °C、正弦起伏），' +
      '五个时刻的端点温度都等于 0，端点的 u_x 却随时间、随初温而变：物理上给定的是 u 本身，是狄利克雷条件，对。' +
      'B：取 D = 1.1×10⁻⁴ m²/s，用解 e^{−Dk²t} sin kx（k = 3 /m）换成厘米，x′ = 100x、k′ = k/100，要 D′k′² = Dk²，D′/D = 10⁴，对。' +
      'C：取精确解 u = e^{−Dt} sin x + 3e^{−4Dt} cos 2x（D = 0.7），在 12 个点用差分核对 u + 273.15 的残差仍为 0，对。' +
      'D：反例 u = 3x + 2y，q = −κ∇u 和 ∇u 的点积为负，q 指向温度降低最快的方向，错。' +
      'E：取铜的 κ = 400、c = 385、ρ = 8960，κ、c 都乘 2 后 D = κ/(cρ) 的比值是 1，不是 2，错。',
    p3:
      'D = κ/(cρ) = 0.756/(840·1800) m²/s，t = L²/D，L = 0.24 m，再除以 3600 换成小时。',
    p4:
      '稳态、无热源：一维 κu″ = 0，u 是一次函数；左端流进杆的热流 −κu′(0) = 50 W/m²，右端 u(0.2) = 0，' +
      '得 u(0) = 50·0.2/0.8。另用显式差分（80 段，虚格点给左端的热流）从两种初温推进到稳态，左端温度都收敛到同一个值，和上面相差小于 10⁻⁸。',
  },
  compute() {
    // ---- p1 ----
    const kappa1 = 400;
    const u1 = (r: Vec3): number => 30 * r[0] - 40 * r[1] + 0 * r[2] + 20;
    const g1 = gradient(u1, [0.3, -0.2, 0.5]);
    if (Math.abs(g1[0] - 30) > 1e-6 || Math.abs(g1[1] + 40) > 1e-6 || Math.abs(g1[2]) > 1e-6) throw new Error('p1：梯度对不上');
    const q1 = scale(-kappa1, g1);
    const p1 = dot(q1, [0, 1, 0]) / 1000; // W/m² → kW/m²

    // ---- p2 ----
    const truth: boolean[] = [];
    // A：冰水混合物里的一端
    {
      const L = 1;
      const D = 1;
      const hA = iceEndHistory(() => 50, L, D, 0.3);
      const hB = iceEndHistory((x) => 20 + 30 * Math.sin((Math.PI * x) / (2 * L)), L, D, 0.3);
      const endFixed = [...hA.uLeft, ...hB.uLeft].every((v) => v === 0);
      const uxVaries =
        Math.max(...hA.uxLeft) - Math.min(...hA.uxLeft) > 1 && hA.uxLeft.some((v, i) => Math.abs(v - hB.uxLeft[i]) > 1);
      truth.push(endFixed && uxVaries);
    }
    // B：长度单位米 → 厘米
    {
      const D = 1.1e-4; // m²/s
      const k = 3; // 1/m
      const kCm = k / 100; // 1/cm
      const decayRate = D * k * k; // 1/s，与单位制无关
      const Dcm = decayRate / (kCm * kCm); // cm²/s
      const uM = (x: number, t: number): number => Math.exp(-D * k * k * t) * Math.sin(k * x);
      const uCm = (xc: number, t: number): number => Math.exp(-Dcm * kCm * kCm * t) * Math.sin(kCm * xc);
      for (const [x, t] of [[0.2, 10], [0.7, 300], [-0.4, 1000]] as [number, number][]) {
        if (Math.abs(uM(x, t) - uCm(100 * x, t)) > 1e-12) throw new Error('B：换单位前后不是同一个温度场');
      }
      truth.push(Math.abs(Dcm / D - 1e4) < 1e-6);
    }
    // C：各处读数加 273.15
    {
      const D = 0.7;
      const u = (x: number, t: number): number => Math.exp(-D * t) * Math.sin(x) + 3 * Math.exp(-4 * D * t) * Math.cos(2 * x);
      const v = (x: number, t: number): number => u(x, t) + 273.15;
      const pts: [number, number][] = Array.from({ length: 12 }, (_, i) => [-2 + 0.37 * i, 0.1 + 0.15 * i]);
      const maxU = Math.max(...pts.map(([x, t]) => Math.abs(heatResidual(u, D, x, t))));
      const maxV = Math.max(...pts.map(([x, t]) => Math.abs(heatResidual(v, D, x, t))));
      if (maxU > 1e-4) throw new Error('C：举的 u 本身不是解');
      truth.push(maxV < 1e-3);
    }
    // D：热流密度指向温度升高最快的方向？
    {
      const kappa = 50;
      const u = (r: Vec3): number => 3 * r[0] + 2 * r[1];
      const g = gradient(u, [0.1, 0.2, 0.3]);
      const q = scale(-kappa, g);
      truth.push(dot(q, g) > 0); // 指向升高最快的方向才为正
    }
    // E：κ、c 都乘 2
    {
      const kappa = 400;
      const c = 385;
      const rho = 8960;
      const D0 = kappa / (c * rho);
      const D1 = (2 * kappa) / (2 * c * rho);
      truth.push(Math.abs(D1 / D0 - 2) < 1e-12);
    }
    const p2 = truth.map((t, i) => (t ? i + 1 : 0)).filter((i) => i > 0);

    // ---- p3 ----
    const D3 = 0.756 / (840 * 1800);
    const p3 = (0.24 * 0.24) / D3 / 3600;

    // ---- p4 ----
    const L4 = 0.2;
    const kappa4 = 0.8;
    const qIn = 50;
    const p4 = (qIn * L4) / kappa4; // u(0) − u(L) = q L / κ，u(L) = 0
    for (const phi of [(): number => 0, (x: number): number => 40 * Math.cos((Math.PI * x) / (2 * L4)) + 5]) {
      const u = rodToSteady(phi, L4, kappa4, 1e-6, qIn, 0);
      if (Math.abs(u[0] - p4) > 1e-8) throw new Error(`p4：差分的稳态 ${u[0]} 和 ${p4} 对不上`);
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
