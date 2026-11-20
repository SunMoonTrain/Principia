// 独立验算 physics.thermal-physics.equipartition 的 p1–p4（简单题、中等题）。
// 不直接套「每个平方项平均 ½k_BT」「C_{V,m} = f/2·R」这些式子，而是从分子的几何和玻尔兹曼权重数值算：
// 1. 平方项的个数从分子的几何算：刚体运动时第 i 个原子的速度 v_i = V + ω × r_i（r_i 从质心量起），
//    动能 K = ½ q̇ᵀ M q̇（q̇ = (V, ℓω) ∈ R⁶，ℓ = 1 Å），M 用雅可比方法求本征值；非零本征值的个数就是动能里独立平方项的个数
//    （转到本征方向上 K = Σ ½λ_k y_k²，λ_k = 0 的方向根本没有动能，例如线形分子绕自身的轴转）。
//    r_i 从质心量起时 M 分成平动块（总质量 × 单位矩阵）和转动块（惯量张量），交叉块为 0（脚本里核对），平动、转动可以分开算。
// 2. 每个平方项的平均能量用玻尔兹曼权重数值积分：⟨½λy²⟩ = ∫ ½λy² e^{−½λy²/k_BT} dy / ∫ e^{−½λy²/k_BT} dy
//    （复合高斯-勒让德，积到 ±14 个标准差），不用解析结果 ½k_BT。
// 3. 1 mol 的内能 U(T) = N_A × 各平方项平均能量之和，C_V = dU/dT 用中心差分；焓 H = U + pV = U + nRT，C_p = dH/dT；γ = C_p/C_V。
// 4. 混合气体再用准静态绝热过程核对：C_V dT = −p dV、p = n_总RT/V，RK4 从 V₀ 积到 2V₀，由 ln p 对 ln V 的斜率读出 γ。
// 5. 固体：每个原子在平衡位置附近是三维谐振子 H = p²/2m + ½κr²，动能、势能各 3 个平方项照 2 数值求平均，
//    取两种 κ 核对和 κ 无关；比热容 c = (1 mol 原子的 dU/dT) / 摩尔质量。
// 分子几何：H₂O 键长 0.9572 Å、键角 104.52°；N₂ 键长 1.098 Å；He 单原子。原子质量按 u（只有比值要紧）。
// 题面没给 R：取 R = N_A k_B（两个定义值的乘积，8.314 462 618…）。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.equipartition.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, integrate } from './physics.electromagnetism._es.ts';

const NA = 6.02214076e23; // mol^-1
const kB = 1.380649e-23; // J/K
const R = NA * kB; // J/(mol·K)
const U_KG = 1.66053906892e-27; // 原子质量单位
const ANG = 1e-10;

type V3 = [number, number, number];
type Mat = number[][];

/** 对称矩阵的本征值：雅可比旋转法。 */
function eigenvaluesSym(A0: Mat): number[] {
  const n = A0.length;
  const A = A0.map((row) => [...row]);
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-30 * Math.max(1e-300, A.reduce((s, row, i) => s + row[i] * row[i], 0))) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (A[p][q] === 0) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
    }
  }
  return A.map((row, i) => row[i]).sort((a, b) => b - a);
}

interface Atom {
  m: number; // kg
  r: V3; // m
}

/**
 * 刚性分子的动能矩阵：q̇ = (V, ℓω)，v_i = V + ω × r_i，K = ½ Σ m_i |v_i|² = ½ q̇ᵀ M q̇。
 * 角速度乘 ℓ = 1 Å 换成和速度同量纲的分量，免得平动、转动的本征值差 20 个数量级、分不清哪个是 0
 * （这样换坐标是线性的、雅可比行列式是常数，不改变平方项的个数和玻尔兹曼平均）。
 * M 由二次型的极化求：M_ii = 2K(e_i)，M_ij = K(e_i + e_j) − K(e_i) − K(e_j)。
 */
function kineticMatrix(atoms: Atom[]): Mat {
  // 先把原点移到质心
  const mt = atoms.reduce((s, a) => s + a.m, 0);
  const cm: V3 = [0, 1, 2].map((k) => atoms.reduce((s, a) => s + a.m * a.r[k], 0) / mt) as V3;
  const rel = atoms.map((a) => ({ m: a.m, r: [a.r[0] - cm[0], a.r[1] - cm[1], a.r[2] - cm[2]] as V3 }));
  const K = (q: number[]): number => {
    const V: V3 = [q[0], q[1], q[2]];
    const w: V3 = [q[3] / ANG, q[4] / ANG, q[5] / ANG];
    let s = 0;
    for (const a of rel) {
      const wxr: V3 = [w[1] * a.r[2] - w[2] * a.r[1], w[2] * a.r[0] - w[0] * a.r[2], w[0] * a.r[1] - w[1] * a.r[0]];
      const v = [V[0] + wxr[0], V[1] + wxr[1], V[2] + wxr[2]];
      s += 0.5 * a.m * (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    }
    return s;
  };
  const M: Mat = Array.from({ length: 6 }, () => new Array(6).fill(0));
  const e = (i: number) => {
    const q = new Array(6).fill(0);
    q[i] = 1;
    return q;
  };
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      M[i][j] = i === j ? 2 * K(e(i)) : K(e(i).map((x, k) => x + e(j)[k])) - K(e(i)) - K(e(j));
    }
  }
  return M;
}

const block = (M: Mat, rows: number[], cols: number[]): Mat => rows.map((i) => cols.map((j) => M[i][j]));

/** 一个平方项 ½λy² 的玻尔兹曼平均：数值积分，积到 ±14 个标准差。 */
function quadAverage(lambda: number, T: number): number {
  const sigma = Math.sqrt((kB * T) / lambda);
  const L = 14 * sigma;
  const w = (y: number) => Math.exp((-0.5 * lambda * y * y) / (kB * T));
  const num = integrate((y) => 0.5 * lambda * y * y * w(y), -L, L, 64, 16);
  const den = integrate(w, -L, L, 64, 16);
  return num / den;
}

/** 非零本征值（相对最大本征值大于 1e-9 的）。 */
const nonzero = (ev: number[]) => ev.filter((x) => x > 1e-9 * ev[0]);

/** 刚性分子：平动、转动各有哪些平方项，单个分子的平均平动、转动动能（T 的函数）。 */
function rigidMolecule(atoms: Atom[]) {
  const M = kineticMatrix(atoms);
  const cross = block(M, [0, 1, 2], [3, 4, 5]).flat();
  const scaleM = Math.max(...M.flat().map(Math.abs));
  check(cross.every((x) => Math.abs(x) <= 1e-12 * scaleM), '质心为原点时平动、转动的交叉项为 0');
  const evT = nonzero(eigenvaluesSym(block(M, [0, 1, 2], [0, 1, 2])));
  const evRall = eigenvaluesSym(block(M, [3, 4, 5], [3, 4, 5]));
  const evR = evRall[0] > 0 ? nonzero(evRall) : [];
  const evAll = nonzero(eigenvaluesSym(M));
  check(evAll.length === evT.length + evR.length, '整体 6×6 矩阵的秩 = 平动块的秩 + 转动块的秩');
  const trans = (T: number) => evT.reduce((s, l) => s + quadAverage(l, T), 0);
  const rot = (T: number) => evR.reduce((s, l) => s + quadAverage(l, T), 0);
  return { nT: evT.length, nR: evR.length, trans, rot, eps: (T: number) => trans(T) + rot(T) };
}

/** n mol 某种分子组成的理想气体：内能 U(T) = nN_A⟨ε⟩，焓 H = U + nRT。 */
const gas = (n: number, eps: (T: number) => number) => ({
  n,
  U: (T: number) => n * NA * eps(T),
  H: (T: number) => n * NA * eps(T) + n * R * T,
});

const deriv = (f: (T: number) => number, T: number) => {
  const h = 1e-3 * T;
  return (f(T + h) - f(T - h)) / (2 * h);
};

/** 一组气体（可以是混合物）在温度 T 下的 C_V、C_p、γ。 */
function heatCaps(parts: ReturnType<typeof gas>[], T: number) {
  const U = (t: number) => parts.reduce((s, g) => s + g.U(t), 0);
  const H = (t: number) => parts.reduce((s, g) => s + g.H(t), 0);
  const CV = deriv(U, T);
  const Cp = deriv(H, T);
  return { CV, Cp, gamma: Cp / CV, ntot: parts.reduce((s, g) => s + g.n, 0), U };
}

/** 准静态绝热过程：C_V(T) dT = −p dV，p = n_总RT/V；RK4 从 V0 积到 V1，返回由 ln p 对 ln V 的斜率读出的 γ。 */
function adiabaticGamma(parts: ReturnType<typeof gas>[], T0: number, V0: number, V1: number, steps = 4000): number {
  const ntot = parts.reduce((s, g) => s + g.n, 0);
  const U = (t: number) => parts.reduce((s, g) => s + g.U(t), 0);
  const CV = (t: number) => deriv(U, t);
  const f = (V: number, T: number) => (-(ntot * R * T) / V) / CV(T);
  let T = T0;
  let V = V0;
  const h = (V1 - V0) / steps;
  for (let i = 0; i < steps; i++) {
    const k1 = f(V, T);
    const k2 = f(V + h / 2, T + (h / 2) * k1);
    const k3 = f(V + h / 2, T + (h / 2) * k2);
    const k4 = f(V + h, T + h * k3);
    T += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    V += h;
  }
  const p0 = (ntot * R * T0) / V0;
  const p1 = (ntot * R * T) / V1;
  return Math.log(p0 / p1) / Math.log(V1 / V0);
}

// ---------- 分子 ----------

const deg = Math.PI / 180;
const water = (() => {
  const d = 0.9572 * ANG;
  const half = (104.52 / 2) * deg;
  return rigidMolecule([
    { m: 15.999 * U_KG, r: [0, 0, 0] },
    { m: 1.008 * U_KG, r: [d * Math.sin(half), d * Math.cos(half), 0] },
    { m: 1.008 * U_KG, r: [-d * Math.sin(half), d * Math.cos(half), 0] },
  ]);
})();
const nitrogen = rigidMolecule([
  { m: 14.007 * U_KG, r: [0.549 * ANG, 0, 0] },
  { m: 14.007 * U_KG, r: [-0.549 * ANG, 0, 0] },
]);
const helium = rigidMolecule([{ m: 4.0026 * U_KG, r: [0, 0, 0] }]);
// 另取一个不对称的线形分子（CO）和一个三原子线形分子（CO₂），核对「线形就少一个转动平方项」不靠对称
const carbonMonoxide = rigidMolecule([
  { m: 12.011 * U_KG, r: [0, 0, 0] },
  { m: 15.999 * U_KG, r: [1.128 * ANG, 0, 0] },
]);
const carbonDioxide = rigidMolecule([
  { m: 12.011 * U_KG, r: [0, 0, 0] },
  { m: 15.999 * U_KG, r: [1.16 * ANG, 0, 0] },
  { m: 15.999 * U_KG, r: [-1.16 * ANG, 0, 0] },
]);

/** 固体里的一个原子：三维谐振子，动能 3 个平方项 ½m v²，势能 3 个平方项 ½κ x²。 */
const solidAtom = (m: number, kappa: number) => (T: number) => 3 * quadAverage(m, T) + 3 * quadAverage(kappa, T);

const TEMPS = [100, 300, 1000];

export const verification: Verification = {
  lesson: 'physics.thermal-physics.equipartition',
  notes: {
    p1: 'H₂O（键角 104.52°）的 6×6 动能矩阵秩为 6（平动 3、转动 3）；每个平方项的平均能量数值积分，1 mol 的 U(T) 中心差分得 C_V，H = U + RT 得 C_p，γ = C_p/C_V，在 100、300、1000 K 都一样；保留三位有效数字。',
    p2: 'N₂（键长 1.098 Å）秩 5（平动 3、转动 2），He 秩 3；另核 CO、CO₂ 也是转动 2。A：数值求 N₂ 的 C_{p,m} = 3.5R ≠ 2.5R（错）；B：100、300、1000 K 下 U_He/U_N₂ 都是 0.6（对）；C：γ_N₂ = 1.4 < γ_He = 1.667（错）；D：300 K 下 ⟨ε⟩_He = 1.5k_BT、⟨ε⟩_N₂ = 2.5k_BT（错）；E：三个温度下 N₂ 的 ⟨ε_转⟩/⟨ε_平⟩ 都是 2/3（对）。',
    p3: '2.0 mol He + 3.0 mol N₂：混合物的 U = 各组分之和、H = U + (n₁+n₂)RT，数值求 C_p/C_V；再用准静态绝热过程（RK4 积 C_V dT = −p dV，V 从 1 到 2 m³）的 ln p–ln V 斜率核对；两者都是 31/21 ≈ 1.476。',
    p4: '每个铜原子当三维谐振子（m = 63.55 u，κ 取 10 N/m 和 40 N/m 两种），动能、势能 6 个平方项数值求平均，1 mol 原子的 dU/dT = 3R（与 κ 无关），除以 0.06355 kg/mol 得 392.50 J/(kg·K)，三位有效数字 393（按 R = 8.314 算是 392.48，也在容差内）。',
  },
  compute() {
    // 几何给出的平方项个数
    check(water.nT === 3 && water.nR === 3, 'H₂O：平动 3、转动 3');
    check(nitrogen.nT === 3 && nitrogen.nR === 2, 'N₂：平动 3、转动 2');
    check(carbonMonoxide.nR === 2 && carbonDioxide.nR === 2, 'CO、CO₂：线形分子转动 2');
    check(helium.nT === 3 && helium.nR === 0, 'He：只有平动 3');

    // p1
    const g1 = TEMPS.map((T) => heatCaps([gas(1, water.eps)], T).gamma);
    check(g1.every((g) => Math.abs(g - g1[0]) < 1e-7), 'p1 γ 与温度无关');
    const p1 = agree(g1[1], 4 / 3, 'p1 水蒸气的 γ', 1e-7);

    // p2
    const capsN2 = heatCaps([gas(1, nitrogen.eps)], 300);
    const capsHe = heatCaps([gas(1, helium.eps)], 300);
    const optA = Math.abs(capsN2.Cp - 2.5 * R) < 1e-6 * R;
    agree(capsN2.Cp, 3.5 * R, 'p2 A：N₂ 的 C_{p,m}', 1e-7);
    const ratiosB = TEMPS.map((T) => gas(1, helium.eps).U(T) / gas(1, nitrogen.eps).U(T));
    const optB = ratiosB.every((x) => Math.abs(x - 3 / 5) < 1e-9);
    const optC = capsN2.gamma > capsHe.gamma;
    agree(capsN2.gamma, 1.4, 'p2 C：γ_N₂', 1e-7);
    agree(capsHe.gamma, 5 / 3, 'p2 C：γ_He', 1e-7);
    const optD = Math.abs(helium.eps(300) - nitrogen.eps(300)) < 1e-9 * nitrogen.eps(300);
    agree(helium.eps(300) / (kB * 300), 1.5, 'p2 D：⟨ε⟩_He / k_BT', 1e-9);
    agree(nitrogen.eps(300) / (kB * 300), 2.5, 'p2 D：⟨ε⟩_N₂ / k_BT', 1e-9);
    const ratiosE = TEMPS.map((T) => nitrogen.rot(T) / nitrogen.trans(T));
    const optE = ratiosE.every((x) => Math.abs(x - 2 / 3) < 1e-9);
    const ratiosE2 = TEMPS.map((T) => carbonMonoxide.rot(T) / carbonMonoxide.trans(T));
    check(ratiosE2.every((x) => Math.abs(x - 2 / 3) < 1e-9), 'p2 E：不对称的 CO 也是 2/3');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const mix = [gas(2.0, helium.eps), gas(3.0, nitrogen.eps)];
    const capsMix = heatCaps(mix, 300);
    const gAd = adiabaticGamma(mix, 300, 1, 2);
    agree(gAd, capsMix.gamma, 'p3 绝热过程读出的 γ 与 C_p/C_V', 1e-7);
    const p3 = agree(capsMix.gamma, 31 / 21, 'p3 混合气体的 γ', 1e-7);

    // p4（J/(kg·K)）
    const M = 63.55e-3; // kg/mol
    const mCu = 63.55 * U_KG;
    const cm = [10, 40].map((kappa) => deriv((T) => NA * solidAtom(mCu, kappa)(T), 300));
    check(Math.abs(cm[0] - cm[1]) < 1e-7 * cm[0], 'p4 摩尔热容与 κ 无关');
    const p4 = agree(cm[0] / M, (3 * R) / M, 'p4 铜的比热容', 1e-7);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
