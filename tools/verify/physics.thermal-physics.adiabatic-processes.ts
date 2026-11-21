// 独立验算 physics.thermal-physics.adiabatic-processes 的 p1–p4（简单题、中等题）。
// 两套算法：一是闭式（准静态绝热过程 TV^(γ−1)、pV^γ 不变，功 W = (p1V1 − p2V2)/(γ − 1)；等温时 pV 不变）；
// 二是不用这些闭式，以体积 V 为自变量，把准静态绝热过程的热力学第一定律 nC_{V,m} dT = −p dV（p = nRT/V）交给
// 四阶龙格-库塔法一步步积分，得到 T(V)、p(V)；功 ∫p dV 用复合高斯-勒让德沿积出的 p(V) 另算，再和 −ΔU = nC_{V,m}(T1 − T2)
// 对一遍（第一定律的核对）；压强到题面要的倍数时的体积用二分求。
// 选择题逐条在具体的 γ、状态上量（γ 取 1.40、5/3，C 另加 1.05、1.20），脚本里写明了例子。
// 题面没给摩尔气体常量，按 CODATA：R = N_A·k_B（都是定义值）；它只用来把 n、T 换成 pV，答案和 R 的取值无关。
// 单原子理想气体的 C_{V,m} = 3R/2（链上 heat-capacity 由 kinetic-theory 得出），C_{p,m} = C_{V,m} + R（迈耶公式），γ = 5/3；
// 空气按题面 γ = 1.40，C_{V,m} = R/(γ − 1)。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.adiabatic-processes.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, integrate, rk4 } from './physics.newtonian-mechanics._nm.ts';

const R = 6.022_140_76e23 * 1.380_649e-23;
const LITRE = 1e-3; // m³

/** 理想气体：给 C_{V,m}/R，返回比热容比（迈耶公式 C_{p,m} = C_{V,m} + R）。 */
const gammaOf = (cvOverR: number) => (cvOverR + 1) / cvOverR;

/**
 * 准静态绝热过程，自变量取 V：nC_{V,m} dT = −p dV、p = nRT/V ⇒ dT/dV = −(R/C_{V,m})·T/V。
 * 从 (T0, V0) 积到 V1，返回 T1。只用到第一定律和状态方程，不用 TV^(γ−1) 不变。
 */
function adiabatT(cvOverR: number, T0: number, V0: number, V1: number, steps = 4000): number {
  const rhs = (V: number, y: number[]) => [-(y[0] / cvOverR) / V];
  return rk4(rhs, [T0], V0, V1, steps)[0];
}

/** 沿准静态绝热过程，体积为 V 时的压强（n mol，从 (T0, V0) 出发）。 */
function adiabatP(n: number, cvOverR: number, T0: number, V0: number, V: number): number {
  return (n * R * adiabatT(cvOverR, T0, V0, V, 400)) / V;
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.adiabatic-processes',
  notes: {
    p1: '单原子 γ = 5/3（C_{V,m} = 3R/2，迈耶公式），T2 = 400 × 8^(−2/3) = 100 K。第二套：以 V 为自变量 RK4 积第一定律 dT/dV = −(2/3)T/V，从 1 L 积到 8 L；另取起点 2.5 L 积到 20 L，末温相同（和气体多少、体积的绝对值无关）。',
    p2: '逐条用例子（都用 RK4 积出的准静态绝热过程量）：A 2 mol、250 K、2 L 压缩到 0.5 L（γ = 1.40），温度升到 435.3 K，p/T 从 8.31e3 变到 3.33e4 Pa/K，不是常数（错）；B 在 (250 K, 2 L) 处对积出的 p(V) 中心差分，绝热线斜率是等温线的 γ 倍（1.40、5/3），更陡（错）；C 压缩到一半体积，压强比 2^γ：γ = 1.05、1.20、1.40、5/3 时 2.07、2.30、2.64、3.17，都大于 2（对；C_{p,m} = C_{V,m} + R > C_{V,m}，γ > 1）；D 沿积出的过程取 V = 0.4、0.8、3、6 倍几个点，T^γ/p^(γ−1) 的相对变化 < 1e-9（对），对照 T/p 在这几个点都变了 10% 以上；E 都从 250 K、2 L 膨胀到 4 L：单原子末温 157.5 K，空气 189.5 K，空气更高（错）。',
    p3: 'p1V1 = 600 J，W = (p1V1 − p2V2)/(γ − 1) = 1500 × (1 − 0.5^0.4) ≈ 363.21 J。第二套：取 T1 = 300 K 定出 n = p1V1/(RT1)，对 RK4 积出的 p(V) 用高斯-勒让德积分 ∫p dV（3 L 到 6 L），再和 nC_{V,m}(T1 − T2) 对一遍（第一定律 Q = 0）；另取 T1 = 500 K，结果相同。',
    p4: '干绝热递减率：绝热时 T ∝ p^((γ−1)/γ)，周围 dp/dz = −ρg = −pMg/(RT)（气团温度和周围相同），dT/dz = −((γ−1)/γ)·Mg/R，γ = 1.40、M = 29 g/mol、g = 9.8，R 取精确值，每千米 9.7661 K（R 取 8.314 时 9.7667，三位有效数字一样）。第二套：以高度 z 为自变量，RK4 同时积静力学平衡 dp/dz = −pMg/(RT) 和每摩尔气团的第一定律 C_{V,m} dT = −p dV（V = RT/p，即 (C_{V,m} + R) dT = RT dp/p，不用 TV^(γ−1) 不变），从地面 101 325 Pa、288 K 和 80 000 Pa、260 K 两个起点各积 1 km，温度差都和闭式一致（递减率和起点无关）。第 1 轮修订换的题（原题求压强都变为 4 倍时绝热、等温末体积之比）。',
  },
  compute() {
    const mono = 1.5; // 单原子 C_{V,m}/R
    const gMono = gammaOf(mono);
    check(Math.abs(gMono - 5 / 3) < 1e-15, '单原子 γ = 5/3');
    const air = 1 / (1.4 - 1); // 空气 C_{V,m}/R，使 γ = 1.40
    check(Math.abs(gammaOf(air) - 1.4) < 1e-12, '空气 γ = 1.40');

    // p1（K）
    const p1Exact = 400 * 8 ** -(gMono - 1);
    agree(adiabatT(mono, 400, 1 * LITRE, 8 * LITRE), p1Exact, 'p1 RK4（1 L → 8 L）', 1e-9);
    agree(adiabatT(mono, 400, 2.5 * LITRE, 20 * LITRE), p1Exact, 'p1 RK4（2.5 L → 20 L）', 1e-9);
    const p1 = p1Exact;

    // p2
    const nA = 2;
    const TA = 250;
    const VA = 2 * LITRE;
    // A：p 和 T 成正比？
    const TAend = adiabatT(air, TA, VA, VA / 4);
    const pAstart = (nA * R * TA) / VA;
    const pAend = (nA * R * TAend) / (VA / 4);
    const optA = Math.abs(pAend / TAend / (pAstart / TA) - 1) < 1e-6;
    // B：过同一点，绝热线比等温线平缓？对积出的 p(V) 中心差分
    const optB = [1.4, gMono].every((g) => {
      const cv = 1 / (g - 1);
      const h = 1e-5 * VA;
      const adi = (adiabatP(nA, cv, TA, VA, VA + h) - adiabatP(nA, cv, TA, VA, VA - h)) / (2 * h);
      const iso = ((nA * R * TA) / (VA + h) - (nA * R * TA) / (VA - h)) / (2 * h);
      agree(adi / iso, g, `p2 B 斜率之比（γ = ${g}）`, 1e-6);
      return Math.abs(adi) < Math.abs(iso);
    });
    // C：压缩到一半体积，压强变为原来的 2 倍多？
    const optC = [1.05, 1.2, 1.4, gMono].every((g) => {
      const cv = 1 / (g - 1);
      const ratio = adiabatP(nA, cv, TA, VA, VA / 2) / pAstart;
      agree(ratio, 2 ** g, `p2 C 压强比（γ = ${g}）`, 1e-9);
      return ratio > 2;
    });
    // D：T^γ 和 p^(γ−1) 成正比？沿积出的过程取几个点
    const optD = [1.4, gMono].every((g) => {
      const cv = 1 / (g - 1);
      const q = (T: number, p: number) => T ** g / p ** (g - 1);
      const q0 = q(TA, pAstart);
      return [0.4, 0.8, 3, 6].every((k) => {
        const T = adiabatT(cv, TA, VA, k * VA);
        const p = (nA * R * T) / (k * VA);
        check(Math.abs(T / p / (TA / pAstart) - 1) > 0.1, `p2 D 对照：T/p 在 V = ${k}V0 处变了`);
        return Math.abs(q(T, p) / q0 - 1) < 1e-9;
      });
    });
    // E：同一状态出发，都膨胀到 2 倍体积，空气的末温更低？
    const TeMono = adiabatT(mono, TA, VA, 2 * VA);
    const TeAir = adiabatT(air, TA, VA, 2 * VA);
    agree(TeMono, TA * 2 ** -(gMono - 1), 'p2 E 单原子末温', 1e-9);
    agree(TeAir, TA * 2 ** -0.4, 'p2 E 空气末温', 1e-9);
    const optE = TeAir < TeMono;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（J）
    const p1V1 = 2.0e5 * 3.0 * LITRE;
    const p3Exact = (p1V1 - 2.0e5 * (3.0 / 6.0) ** 1.4 * 6.0 * LITRE) / (1.4 - 1);
    for (const T1 of [300, 500]) {
      const n3 = p1V1 / (R * T1);
      const W = integrate((V) => adiabatP(n3, air, T1, 3.0 * LITRE, V), 3.0 * LITRE, 6.0 * LITRE, 16, 12);
      const T2 = adiabatT(air, T1, 3.0 * LITRE, 6.0 * LITRE);
      agree(W, p3Exact, `p3 积分 ∫p dV（T1 = ${T1} K）`, 1e-9);
      agree(n3 * air * R * (T1 - T2), p3Exact, `p3 第一定律 −ΔU（T1 = ${T1} K）`, 1e-9);
    }
    const p3 = p3Exact;

    // p4（K）：干燥空气上升 1 km 降温多少（干绝热递减率）
    const M4 = 0.029;
    const g4 = 9.8;
    const p4Exact = ((1.4 - 1) / 1.4) * ((M4 * g4) / R) * 1000;
    // 第二套：z 为自变量，y = [p, T]；dp/dz = −pMg/(RT)，(C_{V,m} + R) dT = RT dp/p（第一定律 + 状态方程）
    const cv4 = air * R;
    const rhs4 = (_z: number, y: number[]) => {
      const [p, T] = y;
      const dp = (-p * M4 * g4) / (R * T);
      return [dp, ((R * T) / (cv4 + R)) * (dp / p)];
    };
    for (const [pz0, Tz0] of [
      [101325, 288],
      [80000, 260],
    ]) {
      const [, T1km] = rk4(rhs4, [pz0, Tz0], 0, 1000, 2000);
      agree(Tz0 - T1km, p4Exact, `p4 RK4 积 1 km（起点 ${pz0} Pa、${Tz0} K）`, 1e-9);
    }
    check(Math.abs(((0.4 / 1.4) * ((M4 * g4) / 8.314) * 1000) - p4Exact) < 5e-3, 'p4 R 取 8.314 时三位有效数字一样');
    const p4 = p4Exact;

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
