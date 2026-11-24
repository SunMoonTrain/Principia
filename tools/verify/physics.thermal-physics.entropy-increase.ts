// 独立验算 physics.thermal-physics.entropy-increase 的 p1–p4（简单题、中等题）。
// 算法一（闭式）：熵是状态函数，借一条可逆路径算 ΔS = ∫δQ/T；理想气体 ΔS = nC_{V,m} ln(T2/T1) + nR ln(V2/V1)，
// 热容 C 不变、体积不变的物体 ΔS = C ln(T2/T1)，温度为 T 的热库吸热 Q 时 ΔS = Q/T。
// 算法二（不用上面的对数式子）：
//   p1 沿可逆等温路径把 pdV/T 用复合高斯-勒让德积起来；再换一条路（准静态绝热膨胀用四阶龙格-库塔法积出末温，
//      然后等容加热回到原温度，积 nC_{V,m}dT/T），两条路、两种气体、三个温度得到同一个数（末态一样，熵变就一样）。
//   p3 让热量一小份一小份从铜块流到水里，到两边温度相等为止（末温用二分求，不用加权平均的式子），积 δQ(1/T_水 − 1/T_铜)；
//      再用有限的 N 份热量（N 次有限大小的传热）外推核对；最后拿「先把铜块可逆地降温、再把水可逆地升温」的一串热库核对。
//   p4 袋里的水同样一小份一小份吸热；水池用热容很大的有限物体代替热库（热容取 1e6、1e7、1e8 J/K），看它的熵变趋于 −Q/T。
// 选择题逐条用具体的数造例子或反例（数都写在 notes 里）。
// 题面没给摩尔气体常量，按 CODATA：R = N_A·k_B（都是定义值）。题面给了 0 ℃ = 273.15 K 和比热容，照题面的值算。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.entropy-increase.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, integrate, rk4 } from './physics.newtonian-mechanics._nm.ts';

const R = 6.022_140_76e23 * 1.380_649e-23;
const LITRE = 1e-3; // m³
const C0 = 273.15; // 题面：0 ℃ = 273.15 K

/** 沿可逆等温路径（温度 T）从 V1 到 V2：δQ = p dV（ΔU = 0），熵变 ∫δQ/T，逐点用 p = nRT/V。 */
function entropyIsothermal(n: number, T: number, V1: number, V2: number): number {
  return integrate((V) => (n * R * T) / V / T, V1, V2, 64);
}

/**
 * 另一条可逆路径：先准静态绝热膨胀（δQ = 0，nC_{V,m}dT = −p dV，用 RK4 积出温度），再等容加热回到 T（δQ = nC_{V,m}dT）。
 * 两段的 ∫δQ/T 加起来。
 */
function entropyAdiabaticThenIsochoric(n: number, cvOverR: number, T: number, V1: number, V2: number): number {
  const rhs = (V: number, y: number[]) => [-(y[0] / cvOverR) / V];
  const Tcold = rk4(rhs, [T], V1, V2, 20000)[0];
  check(Tcold < T, '准静态绝热膨胀以后温度降低');
  return integrate((t) => (n * cvOverR * R) / t, Tcold, T, 64);
}

/** 热容 Ca、Cb 的两个物体从 Ta > Tb 热接触，流过热量 q 以后两边的温度。 */
const after = (Ca: number, Ta: number, Cb: number, Tb: number, q: number): [number, number] => [Ta - q / Ca, Tb + q / Cb];

/** 一直流到两边温度相等：要流过的热量（二分）。 */
function heatToEquilibrium(Ca: number, Ta: number, Cb: number, Tb: number): number {
  const f = (q: number) => {
    const [a, b] = after(Ca, Ta, Cb, Tb, q);
    return a - b;
  };
  return bisect(f, 0, Math.min(Ca * Ta, 10 * Cb * (Ta - Tb)));
}

/** 一小份一小份地流：∫(1/T_b − 1/T_a)dq。 */
function entropyOfContact(Ca: number, Ta: number, Cb: number, Tb: number): number {
  const q = heatToEquilibrium(Ca, Ta, Cb, Tb);
  return integrate(
    (x) => {
      const [a, b] = after(Ca, Ta, Cb, Tb, x);
      return 1 / b - 1 / a;
    },
    0,
    q,
    64,
  );
}

/** 物体（热容 C）经过 N 个温度等间隔的热库，从 T1 逐级到 T2：物体的熵变（逐级精确相加）和各热库熵变之和。 */
function viaReservoirs(C: number, T1: number, T2: number, N: number): { body: number; reservoirs: number } {
  let body = 0;
  let reservoirs = 0;
  const d = (T2 - T1) / N;
  for (let k = 1; k <= N; k++) {
    const Tk = T1 + k * d;
    const Tprev = T1 + (k - 1) * d;
    body += integrate((t) => C / t, Tprev, Tk, 1, 8);
    reservoirs += (-C * d) / Tk; // 热库 Tk 放出（d > 0）或吸收（d < 0）的热
  }
  return { body, reservoirs };
}

/** 理想气体从 (T1, V1) 到 (T2, V2) 的熵变（闭式，供选择题的例子用）。 */
const idealS = (n: number, cvOverR: number, T1: number, V1: number, T2: number, V2: number): number =>
  n * cvOverR * R * Math.log(T2 / T1) + n * R * Math.log(V2 / V1);

export const verification: Verification = {
  lesson: 'physics.thermal-physics.entropy-increase',
  notes: {
    p1: 'Q = 0、W = 0，ΔU = 0，温度不变；体积 5 L → 15 L，ΔS = nR ln 3 = 2 × 8.3144626 × 1.0986123 ≈ 18.2688 J/K。第二套：可逆等温路径上积 pdV/T（250、300、450 K 同一个数）；第三套：先准静态绝热膨胀到 15 L（RK4 积末温）再等容加热回去，单原子、双原子都得同一个数。',
    p2: 'A 反例：1 mol 理想气体和 300 K 热库可逆等温地从 1 L 胀到 2 L，气体 +5.763 J/K、热库 −5.763 J/K，把气体、热库连同举起的重物一起当孤立系统，总熵变为 0，错。B 反例：300 K 的热库吸 600 J，熵增加 2 J/K（用热容 1e5–1e8 J/K 的有限物体逼近，温度升高趋于 0，熵变趋于 2），错。C：理想气体节流，温度不变，p2 < p1，体积由 nRT/p1 变到 nRT/p2，ΔS = nR ln(p1/p2) > 0；取 (p1/p2) = 1.01、1.5、2、10 都为正，且和温度、气体的 C_{V,m} 无关；和外界没有热交换，对。D 反例：可逆等温膨胀，气体的熵增加 nR ln 2，错（不变的是绝热的可逆过程，或系统和外界的总熵）。E：绝热过程熵不减，S_B > S_A，B→A 会使熵减少，不可能；另用随机的绝热过程（向真空膨胀、外压突变、搅拌、准静态压缩膨胀）从 B 出发走 2000 条各 12 步，熵没有一次低于 S_B，对。所以选 C、E。',
    p3: 'C_铜 = 192.5 J/K、C_水 = 8360 J/K，末温 294.95064 K（21.80 ℃），ΔS = 192.5 ln(294.95064/373.15) + 8360 ln(294.95064/293.15) ≈ 5.923 J/K（两项各约 −45.271、+51.193，大半相消：末温取 294.95 K 得 5.904，在 0.5% 的容差里，取 295.0 K 得 7.35）。第二套：末温用二分，热量一小份一小份地流，积 δQ(1/T_水 − 1/T_铜)；第三套：用 N 个热库分别把铜块降温、水升温（N 越大热库的熵变越接近物体的熵变的相反数），核对物体的熵变。',
    p4: 'ΔS_水 = mc ln(363.15/288.15) ≈ +967.0 J/K；Q = mc × 75 = 3.135×10⁵ J，ΔS_池 = −Q/363.15 ≈ −863.3 J/K，和为正（约 +103.7 J/K）。第二套：水一小份一小份吸热积 δQ/T；水池用热容 1e6、1e7、1e8 J/K 的有限物体从 363.15 K 起放热，熵变趋于 −Q/T。',
  },
  compute() {
    // ---------- p1（J/K）----------
    const n1 = 2.0;
    const p1 = n1 * R * Math.log(15 / 5.0);
    for (const T of [250, 300, 450]) {
      agree(entropyIsothermal(n1, T, 5.0 * LITRE, 15 * LITRE), p1, `p1 可逆等温路径（${T} K）`, 1e-10);
      for (const cv of [1.5, 2.5]) {
        agree(entropyAdiabaticThenIsochoric(n1, cv, T, 5.0 * LITRE, 15 * LITRE), p1, `p1 先绝热再等容（${T} K，C_V,m = ${cv}R）`, 1e-9);
      }
    }

    // ---------- p2 ----------
    // A：可逆过程里孤立系统的熵不变
    const gasA = entropyIsothermal(1, 300, 1 * LITRE, 2 * LITRE);
    const heatA = integrate((V) => (R * 300) / V, 1 * LITRE, 2 * LITRE, 64);
    const totalA = gasA - heatA / 300;
    check(Math.abs(totalA) < 1e-12 * Math.abs(gasA) + 1e-12, 'A：可逆等温膨胀，气体加热库总熵变为 0');
    const optA = totalA > 1e-9;
    // B：热库吸热，熵增加 Q/T
    const limits = [1e5, 1e6, 1e7, 1e8].map((C) => {
      const T = 300;
      const Tend = T + 600 / C;
      return { dT: Tend - T, dS: integrate((t) => C / t, T, Tend, 4, 8) };
    });
    for (let i = 1; i < limits.length; i++) {
      check(limits[i].dT < limits[i - 1].dT, 'B：热容越大，温度升高越少');
      check(Math.abs(limits[i].dS - 2) < Math.abs(limits[i - 1].dS - 2), 'B：热容越大，熵变越接近 Q/T = 2 J/K');
    }
    const optB = Math.abs(limits[limits.length - 1].dS) < 0.1;
    // C：理想气体节流（绝热、温度不变、压强降低）
    let optC = true;
    for (const ratio of [1.01, 1.5, 2, 10]) {
      for (const T of [200, 300, 600]) {
        for (const cv of [1.5, 2.5, 3.5]) {
          const pIn = 2e5;
          const pOut = pIn / ratio;
          const Vin = (R * T) / pIn;
          const Vout = (R * T) / pOut;
          // 管外推入 pIn·Vin 的功、推出 pOut·Vout 的功相等，ΔU = 0，和「温度不变」一致
          check(Math.abs(pIn * Vin - pOut * Vout) < 1e-9 * pIn * Vin, 'C：推入和推出的功相等');
          const dS = entropyIsothermal(1, T, Vin, Vout);
          agree(idealS(1, cv, T, Vin, T, Vout), dS, 'C：两条路径', 1e-10);
          agree(dS, R * Math.log(ratio), 'C：nR ln(p1/p2)', 1e-10);
          if (!(dS > 0)) optC = false;
        }
      }
    }
    // D：可逆等温膨胀是可逆过程，系统（气体）的熵增加
    const optD = Math.abs(gasA) < 1e-9;
    // E：随机的绝热过程走下去，熵不会低于出发时的熵
    let seed = 20251124;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    let optE = true;
    let steps = 0;
    for (let run = 0; run < 2000; run++) {
      const cv = rand() < 0.5 ? 1.5 : 2.5;
      let T = 300;
      let V = 1;
      let S = 0;
      for (let k = 0; k < 12; k++) {
        const kind = Math.floor(rand() * 4);
        let T2 = T;
        let V2 = V;
        if (kind === 0) {
          V2 = V * (1 + 3 * rand()); // 向真空膨胀，温度不变
        } else if (kind === 1) {
          // 外压突变成 x·p：nCv(T2 − T1) = −p_ext(V2 − V1)，末态压强等于外压
          const x = Math.exp((rand() - 0.5) * 3);
          // cv(T2 − T) = −x(T/V)(V2 − V)，x T V2/V = T2 ⇒ V2 = T2 V/(xT)
          T2 = (T * (cv + x)) / (cv + 1);
          V2 = (T2 * V) / (x * T);
        } else if (kind === 2) {
          T2 = T * (1 + rand()); // 搅拌：外界做功，体积不变
        } else {
          V2 = V * Math.exp((rand() - 0.5) * 2); // 准静态绝热
          T2 = T * (V2 / V) ** (-1 / cv);
        }
        const dS = idealS(1, cv, T, V, T2, V2);
        if (dS < -1e-9) optE = false;
        S += dS;
        if (S < -1e-7) optE = false;
        T = T2;
        V = V2;
        steps++;
      }
    }
    check(steps === 24000, 'E：随机绝热过程走满 2000 条各 12 步');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3（J/K）----------
    const Ccu = 0.5 * 385;
    const Cw = 2.0 * 4.18e3;
    const Tcu = 100 + C0;
    const Tw = 20 + C0;
    const q3 = heatToEquilibrium(Ccu, Tcu, Cw, Tw);
    const Tf = Tw + q3 / Cw;
    agree(Tf, (Ccu * Tcu + Cw * Tw) / (Ccu + Cw), 'p3 末温', 1e-12);
    agree(Tcu - q3 / Ccu, Tf, 'p3 两边温度相等', 1e-12);
    const dCu = Ccu * Math.log(Tf / Tcu);
    const dW = Cw * Math.log(Tf / Tw);
    const p3 = dCu + dW;
    agree(entropyOfContact(Ccu, Tcu, Cw, Tw), p3, 'p3 热量一小份一小份地流', 1e-9);
    {
      const a = viaReservoirs(Ccu, Tcu, Tf, 4000);
      const b = viaReservoirs(Cw, Tw, Tf, 4000);
      agree(a.body + b.body, p3, 'p3 逐级热库：物体的熵变', 1e-9);
      // 热库的熵变之和随 N 增大趋于物体熵变的相反数（过程趋于可逆）
      check(Math.abs(a.reservoirs + a.body) < 1e-2 && Math.abs(b.reservoirs + b.body) < 1e-2, 'p3 逐级热库趋于可逆');
    }
    check(p3 > 0, 'p3 总熵增加');

    // ---------- p4（J/K）----------
    const C4 = 1.0 * 4.18e3;
    const T15 = 15 + C0;
    const T90 = 90 + C0;
    const Q4 = C4 * (T90 - T15);
    const water = C4 * Math.log(T90 / T15);
    agree(integrate((q) => 1 / (T15 + q / C4), 0, Q4, 64), water, 'p4 水一小份一小份吸热', 1e-10);
    const pool = -Q4 / T90;
    let last = Infinity;
    for (const C of [1e6, 1e7, 1e8]) {
      const dS = C * Math.log1p(-Q4 / (C * T90));
      const err = Math.abs(dS - pool);
      check(err < last, 'p4 水池的热容越大，熵变越接近 −Q/T');
      last = err;
    }
    check(last < 1.5 && last / Math.abs(pool) < 2e-3, 'p4 热容 1e8 J/K 的水池，熵变和 −Q/T 差不到 0.2%');
    check(water + pool > 0, 'p4 总熵增加');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [water, pool] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
