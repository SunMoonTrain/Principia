// 独立验算 physics.thermal-physics.heat-capacity 的 p1–p4（简单题、中等题）。
// 两套算法：一是课本的式子 Q = cmΔT、ΔU = nC_{V,m}ΔT、等压时 W = nRΔT、迈耶公式 C_{p,m} = C_{V,m} + R、γ = C_p/C_V；
// 二是不用这些式子，直接由定义算：理想气体的内能 U 只和温度有关（U(T) = n∫C_{V,m}dT，零点任取），状态方程 pV = nRT；
// 准静态过程沿路径 (T(s), V(s)) 数值积分 W = ∫p dV，再由第一定律 Q = ΔU + W；
// 定容热容是 V 不变时 U 对 T 的偏导数、定压热容是 p 不变时焓 H = U + pV 对 T 的偏导数，都用中心差分数值求；
// 已知 γ 求 C_{V,m} 时，在一族不同 C_{V,m} 的理想气体里用二分法找 C_p/C_V = γ 的那一个。
// 题面没给 R：取 R = N_A k_B（两个定义值的乘积，8.314 462 618…）。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.heat-capacity.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, integrate } from './physics.electromagnetism._es.ts';

const NA = 6.02214076e23;
const kB = 1.380649e-23;
const R = NA * kB;

/** n mol 理想气体：摩尔定容热容 cvm(T) 可以随温度变；内能只和温度有关；状态方程 pV = nRT。 */
function idealGas(n: number, cvm: (T: number) => number) {
  const U = (T: number, _V: number) => n * integrate(cvm, 1, T, 32); // V 不出现：理想气体的内能只和温度有关
  const pOf = (T: number, V: number) => (n * R * T) / V;
  const VOf = (T: number, p: number) => (n * R * T) / p;
  const H = (T: number, p: number) => U(T, VOf(T, p)) + p * VOf(T, p);
  const d = (f: (T: number) => number, T: number) => {
    const h = 1e-3 * T;
    return (f(T + h) - f(T - h)) / (2 * h);
  };
  /** 定容热容：V 不变，U 对 T 的偏导数。 */
  const CV = (T: number, V: number) => d((t) => U(t, V), T);
  /** 定压热容：p 不变，H 对 T 的偏导数。 */
  const Cp = (T: number, p: number) => d((t) => H(t, p), T);
  /** 沿准静态路径 s ↦ (T(s), V(s))（s 从 s0 到 s1）：W = ∫p dV，ΔU，Q = ΔU + W。 */
  const process = (Ts: (s: number) => number, Vs: (s: number) => number, s0: number, s1: number) => {
    const dV = (s: number) => {
      const h = 1e-6 * Math.max(1, Math.abs(s));
      return (Vs(s + h) - Vs(s - h)) / (2 * h);
    };
    const W = integrate((s) => pOf(Ts(s), Vs(s)) * dV(s), s0, s1, 64);
    const dU = U(Ts(s1), Vs(s1)) - U(Ts(s0), Vs(s0));
    return { W, dU, Q: dU + W, dH: H(Ts(s1), pOf(Ts(s1), Vs(s1))) - H(Ts(s0), pOf(Ts(s0), Vs(s0))) };
  };
  return { U, pOf, VOf, H, CV, Cp, process };
}

const close = (a: number, b: number, rel = 1e-6) => Math.abs(a - b) <= rel * Math.max(Math.abs(a), Math.abs(b));

export const verification: Verification = {
  lesson: 'physics.thermal-physics.heat-capacity',
  notes: {
    p1: 'Q = cmΔT = 900 × 0.50 × 60（温差 60 °C 就是 60 K）；和把 mc 从 293.15 K 积到 353.15 K 核对。',
    p2: 'A 对 5 种理想气体（C_{V,m} = 1.5R、2.5R、3R、3.37R、随温度变的 2.5R + 0.002R·T/K），在 200、300、500 K 和 10⁴、10⁵、10⁶ Pa 下，数值求 (∂H/∂T)_p 和 (∂U/∂T)_V，摩尔量之差都是 R（对）；B 反例：1 kg 水（c = 4.18×10³）和 10 kg 铁（c = 4.5×10²）都升高 10 K，水吸热 4.18×10⁴ J、铁 4.5×10⁴ J，比热容大的反而少（错）；C 1 mol 单原子理想气体等容从 300 K 到 400 K：沿路径积分 W = 0，Q = ΔU = 150R，而 ΔH = 250R（错）；D C_{V,m} 取 0.5R 到 100R 的 6 个值，数值求出的 γ = C_p/C_V 都大于 1（对）。',
    p3: '等压路径：T 从 290 K 到 350 K、V = nRT/p₀，对 p₀ = 1.013×10⁵、2.0×10⁵ Pa 两种取法沿路径数值积分 W = ∫p dV，ΔU 由 U(T) 之差，Q = ΔU + W；和 ΔU = n·(5/2)R·ΔT、W = nRΔT、Q = n·(7/2)R·ΔT 核对，Q 再和 ∫(∂H/∂T)_p dT 核对。',
    p4: 'C_{V,m} = R/(γ − 1)；和在 C_{V,m} ∈ [0.5R, 100R] 上二分：数值求 (∂H/∂T)_p / (∂U/∂T)_V = 1.30 的那种气体核对。',
  },
  compute() {
    // p1（J）
    const p1 = agree(integrate(() => 0.5 * 900, 293.15, 353.15, 8), 900 * 0.5 * (80 - 20), 'p1 铝块吸热', 1e-12);

    // p2
    const gases = [() => 1.5 * R, () => 2.5 * R, () => 3 * R, () => 3.37 * R, (T: number) => 2.5 * R + 0.002 * R * T];
    let optA = true;
    for (const cvm of gases) {
      const g = idealGas(2, cvm);
      for (const T of [200, 300, 500]) {
        for (const p of [1e4, 1e5, 1e6]) {
          const diff = g.Cp(T, p) / 2 - g.CV(T, g.VOf(T, p)) / 2;
          if (!close(diff, R, 1e-6)) optA = false;
        }
      }
    }
    const qWater = integrate(() => 1 * 4.18e3, 300, 310, 8);
    const qIron = integrate(() => 10 * 4.5e2, 300, 310, 8);
    check(qIron > qWater, 'p2 B 反例：比热容小的铁吸热更多');
    const optB = false;
    const mono = idealGas(1, () => 1.5 * R);
    const Vfix = mono.VOf(300, 1e5);
    const iso = mono.process((s) => s, () => Vfix, 300, 400);
    check(Math.abs(iso.W) < 1e-9 && close(iso.Q, 150 * R) && close(iso.dH, 250 * R), 'p2 C 等容：Q = 150R，ΔH = 250R');
    const optC = close(iso.Q, iso.dH);
    const optD = [0.5, 1.5, 2.5, 3, 10, 100].every((k) => {
      const g = idealGas(1, () => k * R);
      const gamma = g.Cp(300, 1e5) / g.CV(300, g.VOf(300, 1e5));
      return gamma > 1;
    });
    const p2 = chosen([optA, optB, optC, optD]);

    // p3（J）
    const n3 = 1.2;
    const N2 = idealGas(n3, () => 2.5 * R);
    const runs = [1.013e5, 2.0e5].map((p0) => N2.process((s) => s, (s) => N2.VOf(s, p0), 290, 350));
    check(close(runs[0].Q, runs[1].Q, 1e-9) && close(runs[0].W, runs[1].W, 1e-9), 'p3 结果和取哪个压强无关');
    const QfromCp = integrate((T) => N2.Cp(T, 1.013e5), 290, 350, 16);
    check(close(QfromCp, runs[0].Q, 1e-6), 'p3 Q = ∫C_p dT');
    const dT = 350 - 290;
    const p3 = [
      agree(runs[0].dU, n3 * 2.5 * R * dT, 'p3 ΔU', 1e-9),
      agree(runs[0].W, n3 * R * dT, 'p3 W', 1e-9),
      agree(runs[0].Q, n3 * 3.5 * R * dT, 'p3 Q', 1e-9),
    ];

    // p4（J/(mol·K)）
    const gammaOf = (cvm: number) => {
      const g = idealGas(1, () => cvm);
      return g.Cp(300, 1e5) / g.CV(300, g.VOf(300, 1e5));
    };
    const cv4 = bisect((c) => gammaOf(c) - 1.3, 0.5 * R, 100 * R);
    const p4 = agree(cv4, R / (1.3 - 1), 'p4 C_{V,m}', 1e-6);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
