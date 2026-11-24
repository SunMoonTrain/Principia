// 独立验算 physics.thermal-physics.thermodynamic-potentials 的 p1–p4（简单题、中等题）。
// 算法一（闭式）：H = U + pV，F = U − TS，G = U − TS + pV；dF = −S dT − p dV，dG = −S dT + V dp。
// 算法二（不用 U ± TS ± pV 这几个式子）：造两个满足题给状态的具体物质，只给它们的 U(S, V)：
//   一是单原子理想气体 U = U0 + 1.5nRT0 (V0/V)^(2/3) e^{2(S − S0)/(3nR)}，二是一个正定的二次函数；
//   热力学势用勒让德变换的极值刻画当场数值求：F(T, V) = min_S (U − TS)，H(S, p) = min_V (U + pV)，
//   G(T, p) = min_V (F(T, V) + pV)，最小值用黄金分割法，极小点处再用中心差分核对 ∂U/∂S = T、∂U/∂V = −p。
// p3 另用两条路核对：等温下 ∫V dp 用高斯-勒让德积分；ΔG = ΔH − TΔS，ΔS 沿「先等压降温、再等容升温」的准静态过程积 δQ/T。
// p4 另用 U = ∫T dS（体积不变，从 0 K 积起，S 由 F 的数值差分得到）核对。
// 选择题逐条在上面两个物质上量（写明用了哪些例子）。
// 题面没给摩尔气体常量，按 CODATA：R = N_A·k_B（都是定义值）。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.thermodynamic-potentials.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, integrate } from './physics.newtonian-mechanics._nm.ts';

const R = 6.022_140_76e23 * 1.380_649e-23;

/** 黄金分割法求单峰函数在 [a, b] 上的最小值点；最小值点不许落在端点。 */
function argMin(g: (x: number) => number, a: number, b: number, what: string): number {
  const r = (Math.sqrt(5) - 1) / 2;
  let lo = a;
  let hi = b;
  let x1 = hi - r * (hi - lo);
  let x2 = lo + r * (hi - lo);
  let g1 = g(x1);
  let g2 = g(x2);
  for (let i = 0; i < 200; i++) {
    if (g1 > g2) {
      lo = x1;
      x1 = x2;
      g1 = g2;
      x2 = lo + r * (hi - lo);
      g2 = g(x2);
    } else {
      hi = x2;
      x2 = x1;
      g2 = g1;
      x1 = hi - r * (hi - lo);
      g1 = g(x1);
    }
  }
  const x = (lo + hi) / 2;
  check(x - a > 1e-6 * (b - a) && b - x > 1e-6 * (b - a), `${what}：最小值点不在端点`);
  return x;
}

/** 一种物质：只给 U(S, V)，另给搜索极小值的范围。 */
interface Matter {
  name: string;
  U: (S: number, V: number) => number;
  S: [number, number];
  V: [number, number];
}

const dS = (m: Matter, S: number, V: number, h = 1e-4) => (m.U(S + h, V) - m.U(S - h, V)) / (2 * h);
const dV = (m: Matter, S: number, V: number, h = 1e-8) => (m.U(S, V + h) - m.U(S, V - h)) / (2 * h);

/** F(T, V) = min_S (U − TS)，并核对极小点处 ∂U/∂S = T。 */
function helmholtz(m: Matter, T: number, V: number): number {
  const S = argMin((s) => m.U(s, V) - T * s, m.S[0], m.S[1], `${m.name} F(T, V)`);
  agree(dS(m, S, V), T, `${m.name}：极小点处 ∂U/∂S = T`, 1e-4);
  return m.U(S, V) - T * S;
}

/** H(S, p) = min_V (U + pV)，并核对极小点处 ∂U/∂V = −p。 */
function enthalpy(m: Matter, S: number, p: number): number {
  const V = argMin((v) => m.U(S, v) + p * v, m.V[0], m.V[1], `${m.name} H(S, p)`);
  agree(-dV(m, S, V), p, `${m.name}：极小点处 −∂U/∂V = p`, 1e-4);
  return m.U(S, V) + p * V;
}

/** G(T, p) = min_V (F(T, V) + pV)。 */
function gibbs(m: Matter, T: number, p: number): number {
  const V = argMin((v) => helmholtz(m, T, v) + p * v, m.V[0], m.V[1], `${m.name} G(T, p)`);
  return helmholtz(m, T, V) + p * V;
}

/** 单原子理想气体：状态 (T0, V0) 处熵取 S0、内能另加常数 U0。nR 由 p0 V0 = nRT0 定。 */
function idealGas(T0: number, p0: number, V0: number, S0: number, Utot: number, copies = 1): Matter {
  const nR = (p0 * V0) / T0; // 一份
  const U0 = Utot - 1.5 * nR * T0;
  return {
    name: copies === 1 ? '理想气体' : `${copies} 份理想气体`,
    // copies 份合在一起：每份的熵 S/copies、体积 V/copies
    U: (S, V) => copies * (U0 + 1.5 * nR * T0 * Math.pow(V0 / (V / copies), 2 / 3) * Math.exp((2 * (S / copies - S0)) / (3 * nR))),
    S: [copies * (S0 - 3), copies * (S0 + 1.2)],
    V: [copies * V0 * 0.3, copies * V0 * 3],
  };
}

/** 正定二次型的 U(S, V)：在 (S0, V0) 处取给定的 U、T、p。 */
function quadratic(T0: number, p0: number, V0: number, S0: number, Utot: number): Matter {
  const a = 40; // ∂²U/∂S²
  const c = 1e8; // ∂²U/∂V²
  const b = -2e4; // ∂²U/∂S∂V，a c − b² = 4e9 − 4e8 > 0
  check(a * c - b * b > 0, '二次型正定');
  return {
    name: '二次型物质',
    U: (S, V) => {
      const s = S - S0;
      const v = V - V0;
      return Utot + T0 * s - p0 * v + 0.5 * a * s * s + b * s * v + 0.5 * c * v * v;
    },
    S: [S0 - 5, S0 + 5],
    V: [V0 * 0.2, V0 * 3],
  };
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.thermodynamic-potentials',
  notes: {
    p1: 'H = 1500 + 1.0e5 × 2.0e-3 = 1700 J，F = 1500 − 300 × 8.0 = −900 J，G = 1700 − 2400 = −700 J。第二套：单原子理想气体（nR = pV/T = 2/3 J/K，内能另加 1200 J 的常数）和一个正定二次型 U(S, V) 都取题给的状态，用 F = min_S(U − TS)、H = min_V(U + pV)、G = min_V(F + pV) 数值求极小，三个值都和闭式一致。',
    p2: '都在两个物质（单原子理想气体、正定二次型）上量：A 用 H(S, p) = min_V(U + pV) 的数值，对 S、p 中心差分，得 T = 300 K、V = 2.0e-3 m³（另在偏离的状态 S = 8.1、p = 1.1e5 处核对和 U 在那里的偏导数、体积相同），对；B 两份同样的气体合成一份的 U = 2U1(S/2, V/2)，同样 T、p 下数值求的 G 是一份的 2.000 倍（对照 U 也加倍），对；C 只把 V 换成 p 得到的 min_V(U + pV) = 1700 J 是焓，不是 F = −900 J，错；D 两份合成一份，V、n 都加倍，V/n 不变（不加倍），是强度量，错；E 用数值求的 F(T, V) 对 V 中心差分得 −1.0e5 Pa，即 −p，错。选 A、B。',
    p3: 'ΔG = nRT ln(p2/p1) = 1.5 × R × 350 × ln 4 ≈ 6051.3 J（R = N_A k_B；R 取 8.314 时 6051.0，8.31 时 6048.1，都在容差以内）。第二套：等温下 ∫V dp（V = nRT/p）用高斯-勒让德积；第三套：ΔG = ΔH − TΔS，理想气体 ΔH = 0，ΔS 沿先等压降温到 T·p1/p2、再等容升温回 T 的准静态路径积 nC_p dT/T、nC_V dT/T（单原子、双原子两种热容），都一致。',
    p4: 'p = −∂F/∂V = aT⁴/3 = 0.0204282 Pa，U = F + TS = F − T∂F/∂T = aVT⁴ = 0.0612846 J。第二套：对 F(T, V) 中心差分得 p、S；U 另用 ∫₀^T T′(∂S/∂T′)dT′（体积不变，绝对零度时没有热辐射，U = 0）积一遍；再核对 p = U/(3V)。',
  },
  compute() {
    // ---------- p1（J）----------
    const U1 = 1500;
    const T1 = 300;
    const S1 = 8.0;
    const p1_ = 1.0e5;
    const V1 = 2.0e-3;
    const H1 = U1 + p1_ * V1;
    const F1 = U1 - T1 * S1;
    const G1 = U1 - T1 * S1 + p1_ * V1;
    const gas = idealGas(T1, p1_, V1, S1, U1);
    const quad = quadratic(T1, p1_, V1, S1, U1);
    for (const m of [gas, quad]) {
      agree(m.U(S1, V1), U1, `${m.name}：题给状态的 U`, 1e-12);
      agree(dS(m, S1, V1), T1, `${m.name}：题给状态的 T`, 1e-6);
      agree(-dV(m, S1, V1), p1_, `${m.name}：题给状态的 p`, 1e-5);
      agree(enthalpy(m, S1, p1_), H1, `p1 ${m.name} H`, 1e-9);
      agree(helmholtz(m, T1, V1), F1, `p1 ${m.name} F`, 1e-9);
      agree(gibbs(m, T1, p1_), G1, `p1 ${m.name} G`, 1e-7);
    }

    // ---------- p2 ----------
    // A：∂H/∂S = T、∂H/∂p = V（在题给状态和另一个偏离的状态都量）
    const optA = [gas, quad].every((m) =>
      [
        [S1, p1_],
        [8.1, 1.1e5],
      ].every(([S, p]) => {
        const V = argMin((v) => m.U(S, v) + p * v, m.V[0], m.V[1], `${m.name} 状态`);
        const T = dS(m, S, V);
        const hS = 1e-3;
        const hp = 10;
        const dHdS = (enthalpy(m, S + hS, p) - enthalpy(m, S - hS, p)) / (2 * hS);
        const dHdp = (enthalpy(m, S, p + hp) - enthalpy(m, S, p - hp)) / (2 * hp);
        return Math.abs(dHdS / T - 1) < 1e-4 && Math.abs(dHdp / V - 1) < 1e-4;
      }),
    );
    // B：两份同样的气体合成一份，G 加倍
    const two = idealGas(T1, p1_, V1, S1, U1, 2);
    agree(two.U(2 * S1, 2 * V1), 2 * U1, 'p2 B 对照：U 加倍', 1e-12);
    const optB = Math.abs(gibbs(two, T1, p1_) / (2 * gibbs(gas, T1, p1_)) - 1) < 1e-6;
    // C：只把 V 换成 p，得到的是 F？
    const optC = [gas, quad].every((m) => Math.abs(enthalpy(m, S1, p1_) - helmholtz(m, T1, V1)) < 1);
    check(
      [gas, quad].every((m) => Math.abs(enthalpy(m, S1, p1_) - H1) < 1e-3),
      'p2 C：只换 V 得到的是焓',
    );
    // D：V/n 是广延量（两份合成一份时加倍）？
    const n1 = (p1_ * V1) / (R * T1);
    const optD = Math.abs((2 * V1) / (2 * n1) / (2 * (V1 / n1)) - 1) < 1e-9;
    check(Math.abs((2 * V1) / (2 * n1) / (V1 / n1) - 1) < 1e-12, 'p2 D：摩尔体积不变，是强度量');
    // E：(∂F/∂V)_T = p？
    const optE = [gas, quad].every((m) => {
      const h = 1e-6;
      const d = (helmholtz(m, T1, V1 + h) - helmholtz(m, T1, V1 - h)) / (2 * h);
      agree(d, -p1_, `p2 E ${m.name}：(∂F/∂V)_T = −p`, 1e-4);
      return Math.abs(d / p1_ - 1) < 1e-3;
    });
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3（J）----------
    const n3 = 1.5;
    const T3 = 350;
    const pa = 1.0e5;
    const pb = 4.0e5;
    const p3 = n3 * R * T3 * Math.log(pb / pa);
    agree(
      integrate((p) => (n3 * R * T3) / p, pa, pb, 64),
      p3,
      'p3 ∫V dp',
      1e-10,
    );
    for (const cvOverR of [1.5, 2.5]) {
      const Tlow = (T3 * pa) / pb; // 等压降温到体积等于末态体积 nRT3/pb
      const dSisobar = integrate((T) => (n3 * (cvOverR + 1) * R) / T, T3, Tlow, 64);
      const dSisochor = integrate((T) => (n3 * cvOverR * R) / T, Tlow, T3, 64);
      const dH = 0; // 理想气体的焓只由温度决定
      agree(dH - T3 * (dSisobar + dSisochor), p3, `p3 ΔH − TΔS（C_V = ${cvOverR}R）`, 1e-9);
    }
    for (const r of [8.314, 8.31]) {
      check(Math.abs((n3 * r * T3 * Math.log(4)) / p3 - 1) < 1e-3, `p3 R 取 ${r} 时在容差以内`);
    }

    // ---------- p4（Pa，J）----------
    const a4 = 7.566e-16;
    const V4 = 1.0;
    const T4 = 3000;
    const F4 = (T: number, V: number) => -(1 / 3) * a4 * V * T ** 4;
    const press = (a4 * T4 ** 4) / 3;
    const ener = a4 * V4 * T4 ** 4;
    agree(-(F4(T4, V4 + 1e-3) - F4(T4, V4 - 1e-3)) / 2e-3, press, 'p4 −∂F/∂V', 1e-9);
    const S4 = (T: number) => -(F4(T + 1e-2, V4) - F4(T - 1e-2, V4)) / 2e-2;
    agree(F4(T4, V4) + T4 * S4(T4), ener, 'p4 F + TS', 1e-6);
    // U = ∫ T dS（体积不变，从 0 K 起，U(0) = 0）
    const dSdT = (T: number) => (S4(T + 1) - S4(T - 1)) / 2;
    agree(
      integrate((T) => T * dSdT(T), 0, T4, 64),
      ener,
      'p4 ∫T dS',
      1e-4,
    );
    agree(press, ener / (3 * V4), 'p4 p = U/(3V)', 1e-12);

    return {
      p1: { type: 'tuple', value: [H1, F1, G1] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [press, ener] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
