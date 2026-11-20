// 独立验算 physics.thermal-physics.ideal-gas-law 的 p1–p4（简单题、中等题）。
// 题面没给 R，按 CODATA 取精确值 R = N_A·k_B（N_A = 6.022 140 76×10^23 /mol，k_B = 1.380 649×10^-23 J/K，都是定义值）。
// 两套算法：一是讲解里的 pV = nRT 直接解出；二是换一条路——p1 先数分子 N = pV/(k_B T) 再除以 N_A；
// p3 不用 1/T1 − 1/T2 的闭式，而是让温度一小步一小步升高、每步算出溢出球外的空气（对 dm/dT 做辛普森积分），
// 再和「先后两个状态的质量直接相减」核对；p4 不用闭式，而是模拟细管里的气体从压强高的一边慢慢流到低的一边
// （每步流过的物质的量正比于压强差），直到压强不再变化，再和「总物质的量守恒、二分出终压」核对。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.ideal-gas-law.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen } from './physics.electromagnetism._es.ts';

const NA = 6.02214076e23; // mol^-1
const kB = 1.380649e-23; // J/K
const R = NA * kB; // J/(mol·K)

/** 理想气体的压强：n mol、体积 V（m³）、温度 T（K）。 */
const pressure = (n: number, V: number, T: number): number => (n * R * T) / V;
/** 物质的量。 */
const moles = (p: number, V: number, T: number): number => (p * V) / (R * T);
/** 分子数。 */
const molecules = (p: number, V: number, T: number): number => (p * V) / (kB * T);
/** 密度（kg/m³），M 是摩尔质量（kg/mol）。 */
const density = (p: number, T: number, M: number): number => (p * M) / (R * T);

/** 复合辛普森公式。 */
function simpson(f: (x: number) => number, a: number, b: number, n = 2000): number {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.ideal-gas-law',
  notes: {
    p1: 'n = pV/(RT)，V = 2.50×10⁻³ m³、p = 2.00×10⁵ Pa、T = 300 K，R 取 CODATA 精确值 N_A·k_B（题面没给 R）；和「先数分子 N = pV/(k_B T)、再除以 N_A」核对。得 0.200454…（取 R = 8.31 时是 0.20056，三位有效数字会写成 0.201，看容差收不收）。',
    p2: 'A 取 1 mol、0.01 m³、300 K，体积变成 1/4、温度变成 600 K，压强之比 8（对）；B 各 1 g 的氢（2.016 g/mol）和氧（31.998 g/mol）在 300 K、10⁵ Pa 下体积之比 15.9，不等（错）；C 300 K、10⁵ Pa 下 2 L 氦和 1 L 氮的分子数之比 2，和气体种类无关（对）；D 300 K 下同一份气体压强加倍，密度也加倍，是正比不是反比（错）；E 1 mol 在 300 K、400 K 的两条等温线，在 V 从 10⁻⁶ 到 10³ m³ 的 20 万个点上压强差都大于 0，且等于 R·100/V，不相交（对）。',
    p3: '质量差 Δm = pVM/R·(1/280 − 1/350)，p = 1.0×10⁵ Pa、V = 2200 m³、M = 0.029 kg/mol，R 取 CODATA 精确值；和两条路核对：先后两个状态的质量直接相减，以及温度从 280 K 升到 350 K 时对 −dm/dT = pVM/(RT²) 做辛普森积分（球囊开口、压强不变，每升一点温度就有一点空气溢出）。得 548.098 kg（取 R = 8.31 得 548.39，也写成 548）。',
    p4: '终态两边压强相同、总物质的量守恒：p = (p_A V_A/T_A + p_B V_B/T_B)/(V_A/T_A + V_B/T_B) = 3300/17 kPa；和两条路核对：二分出使两边物质的量之和等于开始时的 p，以及模拟细管里每步流过正比于压强差的一点气体、直到压强差小于 10⁻⁶ Pa（约 5500 步）。',
  },
  compute() {
    // p1（mol）
    const p1Gas = { p: 2.0e5, V: 2.5e-3, T: 300 };
    const p1 = agree(molecules(p1Gas.p, p1Gas.V, p1Gas.T) / NA, moles(p1Gas.p, p1Gas.V, p1Gas.T), 'p1 物质的量', 1e-12);
    const p1Rough = (p1Gas.p * p1Gas.V) / (8.31 * p1Gas.T);
    console.log(`  p1：R 取精确值得 ${p1.toPrecision(6)} mol，取 8.31 得 ${p1Rough.toPrecision(6)} mol，取 8.314 得 ${((p1Gas.p * p1Gas.V) / (8.314 * p1Gas.T)).toPrecision(6)} mol`);

    // p2
    // A：一定质量的气体，体积变成 1/4，热力学温度变成 2 倍
    const pA1 = pressure(1, 0.01, 300);
    const pA2 = pressure(1, 0.01 / 4, 600);
    const optA = Math.abs(pA2 / pA1 - 8) < 1e-12;
    // B：同温同压下，质量相同的氢气和氧气的体积
    const T0 = 300;
    const p0 = 1.0e5;
    const VH2 = ((1e-3 / 2.016e-3) * R * T0) / p0;
    const VO2 = ((1e-3 / 31.998e-3) * R * T0) / p0;
    check(VH2 / VO2 > 15 && VH2 / VO2 < 16.5, 'p2 B 体积之比约 16');
    const optB = Math.abs(VH2 - VO2) < 1e-12 * VH2;
    // C：同温同压下，2 L 氦气和 1 L 氮气的分子数（理想气体的 N 只和 p、V、T 有关，和气体种类无关）
    const NHe = molecules(p0, 2e-3, T0);
    const NN2 = molecules(p0, 1e-3, T0);
    const optC = Math.abs(NHe / NN2 - 2) < 1e-12;
    // D：温度不变，同一份气体的密度和压强
    const rho1 = density(p0, T0, 0.029);
    const rho2 = density(2 * p0, T0, 0.029);
    check(Math.abs(rho2 / rho1 - 2) < 1e-12, 'p2 D 压强加倍，密度也加倍');
    const optD = Math.abs(rho2 / rho1 - 0.5) < 1e-12; // 反比要求压强加倍时密度减半
    // E：同一份气体（1 mol）在 300 K、400 K 的两条等温线
    let crosses = false;
    const steps = 200_000;
    for (let i = 0; i <= steps; i++) {
      const V = 10 ** (-6 + (9 * i) / steps);
      const diff = pressure(1, V, 400) - pressure(1, V, 300);
      if (!(diff > 0) || Math.abs(diff - (R * 100) / V) > 1e-9 * diff) crosses = true;
    }
    const optE = !crosses;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（kg）
    const V3 = 2200;
    const p3p = 1.0e5;
    const M3 = 0.029;
    const closed3 = ((p3p * V3 * M3) / R) * (1 / 280 - 1 / 350);
    const direct3 = density(p3p, 280, M3) * V3 - density(p3p, 350, M3) * V3;
    agree(direct3, closed3, 'p3 质量差（直接相减）', 1e-12);
    const integral3 = simpson((T) => (p3p * V3 * M3) / (R * T * T), 280, 350);
    const p3 = agree(integral3, closed3, 'p3 质量差（逐步加热积分）', 1e-10);
    console.log(`  p3：R 取精确值得 ${p3.toPrecision(6)} kg，取 8.31 得 ${(((p3p * V3 * M3) / 8.31) * (1 / 1400)).toPrecision(6)} kg`);

    // p4（kPa）
    const A = { V: 2.0e-3, p: 3.0e5, T: 300 };
    const B = { V: 3.0e-3, p: 1.0e5, T: 400 };
    const nTotal = moles(A.p, A.V, A.T) + moles(B.p, B.V, B.T);
    const closed4 = (A.p * A.V / A.T + B.p * B.V / B.T) / (A.V / A.T + B.V / B.T);
    const bisected4 = bisect((p) => moles(p, A.V, A.T) + moles(p, B.V, B.T) - nTotal, 1e4, 1e6);
    agree(bisected4, closed4, 'p4 终压（二分）', 1e-12);
    // 模拟：每步从高压一侧流过 dn = k·(pA − pB) 到低压一侧
    let nA = moles(A.p, A.V, A.T);
    let nB = moles(B.p, B.V, B.T);
    const k = 2e-9; // mol/Pa，每步
    let pa = pressure(nA, A.V, A.T);
    let pb = pressure(nB, B.V, B.T);
    let iter = 0;
    while (Math.abs(pa - pb) > 1e-6 && iter < 1e6) {
      const dn = k * (pa - pb);
      nA -= dn;
      nB += dn;
      pa = pressure(nA, A.V, A.T);
      pb = pressure(nB, B.V, B.T);
      iter++;
    }
    check(iter < 1e6, 'p4 模拟在 10⁶ 步内停下');
    check(Math.abs(nA + nB - nTotal) < 1e-12 * nTotal, 'p4 模拟中总物质的量守恒');
    const p4 = agree(pa, closed4, 'p4 终压（模拟流动）', 1e-10) / 1000;
    console.log(`  p4：终压 ${p4.toPrecision(8)} kPa（3300/17 = ${(3300 / 17).toPrecision(8)}），模拟 ${iter} 步；A 里剩 ${(nA / nTotal * 100).toFixed(2)}% 的气体`);

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
