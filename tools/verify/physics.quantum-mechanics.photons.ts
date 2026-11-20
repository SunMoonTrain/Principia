// 独立验算 physics.quantum-mechanics.photons 的 p1–p4（简单题、中等题）。
// 只按题干算（npm run statements 导出的题面），算完后由 runVerification 读标准答案比对。
// 常量：题面没给，用 CODATA 2022（h、c、e 是定义值；mₑ 取 9.1093837139×10⁻³¹ kg）。
// 每题两条路互相核对：一条按 SI 单位直接算，另一条换成 eV、nm（hc ≈ 1239.84 eV·nm）或改用别的算法。
// 单独运行：npx tsx tools/verify/physics.quantum-mechanics.photons.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { E_CHARGE, M_E, agree, check, chosen } from './physics.electromagnetism._es.ts';

// ---------- 常量（CODATA 2022） ----------
const H = 6.62607015e-34; // J·s，定义值
const C = 299792458; // m/s，定义值
const K_COULOMB = 8.9875517862e9; // 1/(4πε₀)，只在 p2 E 的模拟里用
/** hc，单位 eV·nm（由定义值算出，约 1239.842）。 */
const HC_EV_NM = (H * C) / E_CHARGE / 1e-9;

/** 波长 λ（nm）的光子能量，单位 eV。 */
const photonEV = (lambdaNm: number): number => HC_EV_NM / lambdaNm;
/** 光子能量（J），按 SI 直接算。 */
const photonJ = (lambdaM: number): number => (H * C) / lambdaM;

/**
 * p2 E 的模拟：原来不带电的孤立金属球（半径 R），每一步有一批光电子离开表面，
 * 初动能在 [0, Kmax] 里均匀取（真实分布不同，但都不超过 Kmax，结论只靠这一点）。
 * 球带正电 Q 时球面电势 φ = kQ/R，电子要跑到无穷远需要 K > eφ，否则被拉回。
 * 跑足够多步，返回最后的 φ（V）和 Kmax/e。
 */
function chargeSphere(KmaxEV: number, R: number, steps: number, perStep: number): { phi: number; limit: number; history: number[] } {
  let Q = 0;
  let seed = 12345;
  const rand = (): number => {
    // 线性同余，结果可复现
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const history: number[] = [];
  for (let s = 0; s < steps; s++) {
    for (let j = 0; j < perStep; j++) {
      const K = rand() * KmaxEV * E_CHARGE; // J
      const phi = (K_COULOMB * Q) / R;
      if (K > E_CHARGE * phi) Q += E_CHARGE; // 跑掉一个电子，球多一个正电荷
    }
    history.push((K_COULOMB * Q) / R);
  }
  return { phi: (K_COULOMB * Q) / R, limit: KmaxEV, history };
}

export const verification: Verification = {
  lesson: 'physics.quantum-mechanics.photons',
  notes: {
    p1: 'N = Pλ/(hc)：SI 直接算 5.0×10⁻³ W ÷ (hc/532 nm)；另一条先求光子能量 1239.84/532 eV，再用 P/(E·e) 算，两者核对。结果以 10¹⁶ s⁻¹ 为单位。',
    p2: 'A：500 nm 光子 2.48 eV > 2.3 eV，打得出（假）；B：同一束光 hν 固定，eΔφc = hν − W₀ 在 W₀ ∈ {1.8, 2.0, 2.3, 2.6} eV、λ ∈ {300, 350, 400} nm 的网格上随 W₀ 严格减（真）；C：Kmax = h(ν − νc)，2νc 时 hνc、4νc 时 3hνc，比是 1/3 不是 1/2，取铯 νc 举反例（假）；D：光子数 = 光强×面积×时间/(hν)，取 450 nm 和 650 nm，光强相同时蓝光光子少（真）；E：模拟半径 1 μm 的孤立球（跑掉一个电子电势升约 1.44 mV，结论和半径无关），共 80 万个电子，初动能在 [0, Kmax] 均匀分布，K > eφ 才跑得掉，取 Kmax = 1.0 eV：φ 升到 Kmax/e = 1.0 V 附近就停（至多多最后一个电子的 1.44 mV），最后 1000 步几乎不变（假）。',
    p3: 'Kmax = hc/λ − W₀ = 1239.84/405 − 2.14 eV，v = √(2Kmax/mₑ)；另一条用相对论 K = (γ − 1)mₑc² 反解 v，两者差约 3×10⁻⁶（v/c ≈ 1.9×10⁻³），按 2×10⁻⁵ 核对；答案取非相对论值，以 10⁵ m/s 为单位。',
    p4: 'eΔφc = hν − W₀：两点定直线，斜率 h/e = ΔV/Δν、截距 −W₀/e；截止频率是直线和 Δφc = 0 的交点。另一条用克拉默法则解 2×2 方程组 [ν, −1]·[h/e, W₀/e] = Δφc，截止频率再用二分求直线的零点，两者核对。不代入 h。',
  },
  compute() {
    // ---------- p1 ----------
    const P1 = 5.0e-3; // W
    const lam1 = 532e-9; // m
    const n1SI = P1 / photonJ(lam1);
    const n1eV = P1 / (photonEV(532) * E_CHARGE);
    const p1 = agree(n1eV, n1SI, 'p1', 1e-12) / 1e16;

    // ---------- p2 ----------
    // A：500 nm 照逸出功 2.3 eV 的金属
    const eA = photonEV(500);
    check(Math.abs(eA - 2.4797) < 1e-3, 'p2 A：500 nm 光子能量约 2.48 eV');
    const A2 = !(eA > 2.3); // 说法是「打不出」：光子能量超过逸出功就打得出，说法为假

    // B：同一束光照两种金属，逸出功小的遏止电压大
    let B2 = true;
    for (const lam of [300, 350, 400]) {
      const hv = photonEV(lam);
      const Ws = [1.8, 2.0, 2.3, 2.6].filter((W) => W < hv); // 题设：都打得出
      check(Ws.length >= 2, `p2 B：λ = ${lam} nm 时至少两种金属打得出`);
      const Vc = Ws.map((W) => hv - W); // 遏止电压（V），数值等于 Kmax（eV）
      for (let i = 0; i + 1 < Ws.length; i++) if (!(Vc[i] > Vc[i + 1])) B2 = false;
    }

    // C：截止频率 νc，用 2νc 和 4νc 照
    const nuC = (2.14 * E_CHARGE) / H; // 取铯，具体值不影响比值
    const K2 = H * (2 * nuC) - H * nuC;
    const K4 = H * (4 * nuC) - H * nuC;
    check(Math.abs(K2 / K4 - 1 / 3) < 1e-12, 'p2 C：比值是 1/3');
    const C2 = Math.abs(K2 / K4 - 1 / 2) < 1e-9;

    // D：蓝光、红光，光强相同、面积相同
    const I = 10; // W/m²
    const A = 1e-4; // m²
    const flux = (lamNm: number): number => (I * A) / (photonEV(lamNm) * E_CHARGE);
    const blue = flux(450);
    const red = flux(650);
    let D2 = blue < red;
    // 再在可见光范围内随便取几对，只要蓝光波长更短，结论都成立
    for (const [b, r] of [
      [400, 700],
      [470, 620],
      [430, 680],
    ] as [number, number][])
      if (!(flux(b) < flux(r))) D2 = false;

    // E：孤立金属球一直被照射，电势能不能升到任意高
    // 取半径 1 μm 的小球，跑掉一个电子电势升 kE/R ≈ 1.44 mV，几千个电子就到顶，模拟跑得动；
    // 结论和半径无关，半径大只是要跑掉的电子更多
    const R2 = 1e-6;
    const dPhi = (K_COULOMB * E_CHARGE) / R2;
    const sim = chargeSphere(1.0, R2, 4000, 200);
    const last = sim.history.slice(-1000);
    // 只有 φ < Kmax/e 时才可能再跑掉电子，所以 φ 至多比 Kmax/e 多最后一个电子的 kE/R
    check(sim.phi <= sim.limit + dPhi, 'p2 E：电势停在 Kmax/e 附近，至多多一个电子的电势');
    check(sim.phi > 0.95 * sim.limit, 'p2 E：电势已经接近 Kmax/e，说明照得够久');
    check(last[last.length - 1] - last[0] < 0.02 * sim.limit, 'p2 E：最后 1000 步电势几乎不再上升');
    const E2 = false; // 电势有上限 Kmax/e，说法为假

    const p2 = chosen([A2, B2, C2, D2, E2]);

    // ---------- p3 ----------
    const W3 = 2.14; // eV
    const K3eV = photonEV(405) - W3;
    check(K3eV > 0, 'p3：405 nm 能打出光电子');
    const K3J = (H * C) / 405e-9 - W3 * E_CHARGE;
    agree(K3eV * E_CHARGE, K3J, 'p3 Kmax 两种单位', 1e-12);
    const vNR = Math.sqrt((2 * K3J) / M_E);
    // 相对论：K = (γ − 1) m c²，γ = 1 + K/(mc²)，v = c √(1 − 1/γ²)
    const gamma = 1 + K3J / (M_E * C * C);
    const vR = C * Math.sqrt(1 - 1 / (gamma * gamma));
    agree(vR, vNR, 'p3 相对论修正（只差约 3×10⁻⁶）', 2e-5);
    const p3 = vNR / 1e5;

    // ---------- p4 ----------
    const nuA = 8.21e14;
    const VA = 1.49;
    const nuB = 5.49e14;
    const VB = 0.36;
    // 路一：两点定直线
    const slope = (VA - VB) / (nuA - nuB); // h/e，V·s
    const W0a = slope * nuA - VA; // eV
    const nuCa = nuA - VA / slope;
    // 路二：克拉默法则解 [ν, −1][s; w] = V
    const det = nuA * -1 - -1 * nuB;
    const s2 = (VA * -1 - -1 * VB) / det;
    const w2 = (nuA * VB - nuB * VA) / det;
    agree(s2, slope, 'p4 斜率', 1e-12);
    const W0 = agree(w2, W0a, 'p4 逸出功', 1e-12);
    // 截止频率：二分求直线 V(ν) = s ν − w 的零点
    let lo = 0;
    let hi = nuB;
    for (let i = 0; i < 200; i++) {
      const m = (lo + hi) / 2;
      if (s2 * m - w2 < 0) lo = m;
      else hi = m;
    }
    const nuCb = (lo + hi) / 2;
    const nuCfinal = agree(nuCb, nuCa, 'p4 截止频率', 1e-12);
    // 顺带看一眼：斜率接近 h/e = 4.1357×10⁻¹⁵ V·s（数据是实验值，不要求相等）
    check(Math.abs(slope / (H / E_CHARGE) - 1) < 0.01, 'p4：斜率和 h/e 相差不到 1%');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [W0, nuCfinal / 1e14] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
