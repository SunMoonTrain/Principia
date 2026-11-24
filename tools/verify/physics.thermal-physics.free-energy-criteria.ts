// 独立验算 physics.thermal-physics.free-energy-criteria 的 p1–p4（简单题、中等题）。
// 算法一（闭式）：等温时 W ≤ −ΔF，等温等压时 W_其他 ≤ −ΔG，ΔG = ΔH − TΔS。
// 算法二（不用 F、G）：只用热力学第一定律和总熵不减，系统加热库逐项记账。
//   p1、p3：由 W_其他 反推系统吸的热 Q = ΔH + W_其他（始末压强都是 p、外界的压强一直是 p），热库的熵变 −Q/T，
//     总熵变 ΔS − Q/T ≥ 0 的最大的 W_其他 由 supOfPredicate 扫出来。
//   p4：把气缸和热库真的走一遍：
//     （a）准静态等温膨胀，p dV 用高斯-勒让德积分；
//     （b）外压分 N 级突然降下来（每一级里外压恒定，走完这一级再和热库平衡），N = 1、10、…、10⁵，
//         功单调地趋于（a）、总熵变单调地趋于 0；
//     （c）有限快慢的膨胀：气体内部均匀，活塞以有限速度走，气体和热库之间按 dQ/dt = K(T0 − T) 传热，用四阶龙格-库塔法积
//         （中间气体比热库凉，停住以后等它回到 T0，始末都是 T0 的平衡态，正是本节意思的「等温」），
//         气体的熵变由 ∫δQ/T_气 直接积出来，每一条都核对 W = nRT ln(V2/V1) − T·ΔS_总；
//     （d）实际只做了 1.5 kJ：造三个不同的过程，总熵变都直接按「气体的熵变 − 热库给出的热量/T」算，互相核对。
// 选择题逐条造例子或反例，再拿一族随机的等温过程（理想气体和范德瓦耳斯气体、分级恒外压）核对成立的两条；
// 用到的数都写在 notes 里。
// 题面没给摩尔气体常量，按 CODATA：R = N_A·k_B（都是定义值）。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.free-energy-criteria.ts

import { fileURLToPath } from 'node:url';
import { runVerification, supOfPredicate, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, integrate, rk4, rk4Until } from './physics.newtonian-mechanics._nm.ts';

const R = 6.022_140_76e23 * 1.380_649e-23;
const ATM = 101_325;

/** 固定种子的伪随机数（mulberry32），[0, 1)。 */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 1 mol 流体：压强、内能、熵（C_{V,m} = 1.5R，零点任取）。a = b = 0 就是理想气体。 */
interface Fluid {
  a: number; // J·m³/mol²
  b: number; // m³/mol
}
const IDEAL: Fluid = { a: 0, b: 0 };
const VDW: Fluid = { a: 0.364, b: 4.27e-5 }; // 二氧化碳的量级
const pOf = (f: Fluid, T: number, V: number) => (R * T) / (V - f.b) - f.a / (V * V);
const uOf = (f: Fluid, T: number, V: number) => 1.5 * R * T - f.a / V;
const sOf = (f: Fluid, T: number, V: number) => 1.5 * R * Math.log(T) + R * Math.log(V - f.b);
const fOf = (f: Fluid, T: number, V: number) => uOf(f, T, V) - T * sOf(f, T, V);

interface Bath {
  W: number; // 系统对外做的功
  Q: number; // 系统从热库吸的热
  dS: number; // 系统的熵变
  dStot: number; // 系统和热库的总熵变
}

/** 给定一串（外压, 走到的体积）的级：每一级外压恒定，活塞突然移过去，再和温度为 T 的热库平衡。始末都是温度 T 的平衡态。 */
function stepped(f: Fluid, T: number, V1: number, steps: [number, number][]): Bath {
  let V = V1;
  let W = 0;
  for (const [pExt, Vn] of steps) {
    W += pExt * (Vn - V);
    V = Vn;
  }
  const dU = uOf(f, T, V) - uOf(f, T, V1);
  const Q = dU + W;
  const dS = sOf(f, T, V) - sOf(f, T, V1);
  return { W, Q, dS, dStot: dS - Q / T };
}

/** 准静态等温（可逆）：W = ∫p dV。 */
function reversibleIso(f: Fluid, T: number, V1: number, V2: number): Bath {
  const W = integrate((s) => pOf(f, T, Math.exp(s)) * Math.exp(s), Math.log(V1), Math.log(V2), 64);
  const dU = uOf(f, T, V2) - uOf(f, T, V1);
  const dS = sOf(f, T, V2) - sOf(f, T, V1);
  return { W, Q: dU + W, dS, dStot: dS - (dU + W) / T };
}

/**
 * 有限快慢的「等温」过程（理想气体 n mol，C_{V,m} = 1.5R，内部均匀）：活塞在时间 tau 里匀速把体积从 V1 变到 V2，
 * 气体和热库（T0）之间传热 dQ/dt = K(T0 − T)；停住以后再等很久，回到 T0。
 * 气体的熵变直接由积分 ∫δQ/T_气 得到（不用末态的熵），热库的熵变是 −Q/T0。
 */
function finiteSpeed(n: number, T0: number, V1: number, V2: number, tau: number, K: number, steps = 20_000): Bath & { Tmin: number; Tmax: number } {
  const C = 1.5 * n * R;
  const v = (V2 - V1) / tau;
  let Tmin = T0;
  let Tmax = T0;
  // y = [T, W, Q, S_gas]
  const rhsMove = (t: number, y: number[]) => {
    const V = V1 + v * t;
    const pw = ((n * R * y[0]) / V) * v;
    const q = K * (T0 - y[0]);
    return [(q - pw) / C, pw, q, q / y[0]];
  };
  let y = [T0, 0, 0, 0];
  const chunks = 200;
  for (let i = 0; i < chunks; i++) {
    y = rk4(rhsMove, y, (tau * i) / chunks, (tau * (i + 1)) / chunks, Math.max(20, Math.ceil(steps / chunks)));
    Tmin = Math.min(Tmin, y[0]);
    Tmax = Math.max(Tmax, y[0]);
  }
  const rhsRest = (_t: number, z: number[]) => {
    const q = K * (T0 - z[0]);
    return [q / C, 0, q, q / z[0]];
  };
  y = rk4(rhsRest, y, 0, (60 * C) / K, 20_000);
  return { W: y[1], Q: y[2], dS: y[3], dStot: y[3] - y[2] / T0, Tmin, Tmax };
}

/**
 * 刚性容器浸在温度 T 的热库里，导热的活塞隔开两份 1 mol 理想气体，总体积 Vtot；活塞从左边体积 x0 处由静止放开，
 * 走到第一次停住（转折点）就卡住。气体始终是温度 T（导热极好），活塞的运动方程 M·V″ = p左 − p右 − M·c·V′（M 是质量除以面积的平方），
 * 摩擦生的热全部交给热库。返回卡住时左边的体积、气体的功、摩擦热。
 */
function releasePiston(T: number, Vtot: number, x0: number, c: number): { x1: number; gasWork: number; heat: number } {
  const M = 1e6;
  const pL = (V: number) => (R * T) / V;
  const pR = (V: number) => (R * T) / (Vtot - V);
  // y = [V, u, ∫(p左 − p右)dV, ∫Mc u² dt]
  const rhs = (_t: number, y: number[]) => {
    const dp = pL(y[0]) - pR(y[0]);
    return [y[1], dp / M - c * y[1], dp * y[1], M * c * y[1] * y[1]];
  };
  // x0 在左半边：左边压强大，活塞向右走（u > 0），停在 u 由正变零处
  const hit = rk4Until(rhs, [x0, 0, 0, 0], 0, 1e-4, 1e6, (t, y) => (t < 1e-3 ? -1 : -y[1]));
  return { x1: hit.y[0], gasWork: hit.y[2], heat: hit.y[3] };
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.free-energy-criteria',
  notes: {
    p1: 'ΔG = ΔH − TΔS = 12 000 − 300×50 = −3000 J。第二套：除推开大气以外不做别的功，Q = ΔH，环境的熵变 −12 000/300 = −40 J/K，总熵变 +10 J/K，ΔG = −T·ΔS_总；再取三组任意的始态（体积、熵、焓各不相同，末态加上题给的 ΔH、ΔS 和任意的 ΔV），由 U = H − pV、G = U + pV − TS 的定义直接算差。',
    p2: 'A 反例：373.15 K、1 标准大气压下 1 mol 水可逆地汽化（吸热 40.7 kJ，V 从 18.8 mL 到 RT/p ≈ 30.6 L），ΔG = 0，对外做功 pΔV ≈ 3.1 kJ > 0（错）。B：1 mol 理想气体（和范德瓦耳斯气体）300 K 从 10 L 到 20 L，准静态等温和自由膨胀（外压为 0）始末态相同，F 由始末态的 U − TS 算，差是同一个数（错）。C：300 K 下 20 L→8 L 压缩，准静态、1、3、30、300 级恒外压、2000 组随机分级（理想气体和范德瓦耳斯气体），另加有限快慢的压缩（气体中途热到 315–530 K），外界做的功都 ≥ ΔF，准静态取等号（对）。D 反例：刚性容器浸在 300 K 热库里，隔板一抽气体从 10 L 自由膨胀到 20 L（不做功、整个系统的体积 20 L 不变），过程不可逆，ΔF = −RT ln2 ≈ −1729 J < 0，判据照样管（错）。E：等温、体积不变、没有别的功时 W = 0，ΔS_总 = −ΔF/T；ΔF = 0 ⇒ 总熵不变 ⇒ 可逆。用刚性容器里导热活塞隔开的两份 1 mol 理想气体（总体积 40 L，300 K 热库）真的放开活塞走一遍（运动方程用四阶龙格-库塔法积到第一次停住、卡住）：没有摩擦时停在镜像位置，ΔF = 0、总熵变 0，接着松开它还会自己走回去（可逆）；摩擦系数 0.3、1、3（每秒）时停不到镜像位置，ΔF < 0、ΔF = −摩擦热、总熵变 = 摩擦热/T > 0。两者一一对应（对）。所以选 C、E。',
    p3: '闭式：W_其他 ≤ −ΔG = 285.8 − 298×0.1633 = 237.1366 kJ，此时 Q = TΔS = −48.6634 kJ，放出 48.6634 kJ。第二套：对 W_其他（kJ）在 [0, 285.8] 上扫总熵变 ΔS − (ΔH + W)/T ≥ 0 的最大值，核对正好在总熵变为 0 处；放出的热量由第一定律 −Q = −(ΔH + W)。再用 100 个不同的电功（0 到最大）核对总熵变都 ≥ 0 而再大一点就 < 0。',
    p4: '(1) −ΔF = nRT ln 3 ≈ 2740.3 J；(2) ΔS_总 = (2740.3 − 1500)/300 ≈ 4.134 J/K。第二套：准静态等温的 ∫p dV；外压分 N = 1、10、10²、…、10⁵ 级，功由 1663 J 单调趋于 2740.3 J；有限快慢的膨胀（活塞走完用 0.01、5、100 s，传热系数 5 W/K，中间气体温度最低降到约 145、230、292 K），逐条核对 W = nRT ln(V2/V1) − T·ΔS_总；做功恰为 1500 J 的三个不同过程（恒外压 75 kPa 一级、挡块挡在 30 L；先向真空自由膨胀到约 16.4 L、再准静态等温到 30 L；先自由膨胀到约 15.2 L、再用 5 s 匀速膨胀到 30 L），总熵变都是 4.134 J/K。',
  },
  compute() {
    // ---------- p1（J）----------
    const T1 = 300;
    const dH1 = 12_000;
    const dS1 = 50;
    const dG1 = dH1 - T1 * dS1;
    {
      // 总熵记账：除推开大气以外没有别的功，Q = ΔU + pΔV = ΔH
      const dSenv = -dH1 / T1;
      agree(-T1 * (dS1 + dSenv), dG1, 'p1 −TΔS_总', 1e-12);
      // 从定义算：任意始态，末态加上题给的 ΔH、ΔS 和任意的 ΔV
      for (const [H0, S0, V0, dV] of [
        [1.2e5, 90, 1e-3, 2e-3],
        [-3.4e4, 310, 2.5e-2, -1.1e-2],
        [0, 12, 4e-5, 7e-5],
      ]) {
        const G = (H: number, S: number, V: number) => {
          const U = H - ATM * V;
          return U + ATM * V - T1 * S;
        };
        agree(G(H0 + dH1, S0 + dS1, V0 + dV) - G(H0, S0, V0), dG1, 'p1 从 G = U + pV − TS 的定义算', 1e-9);
        // F 的改变和 G 的改变差 pΔV：这里顺便核对 ΔF = ΔG − pΔV
        const F = (H: number, S: number, V: number) => H - ATM * V - T1 * S;
        agree(F(H0 + dH1, S0 + dS1, V0 + dV) - F(H0, S0, V0), dG1 - ATM * dV, 'p1 ΔF = ΔG − pΔV', 1e-9);
      }
    }

    // ---------- p2 ----------
    const T2 = 300;
    // A：水在 373.15 K、1 标准大气压下可逆地汽化
    const Tb = 373.15;
    const Hv = 40_700;
    const Vl = 18.8e-6;
    const Vg = (R * Tb) / ATM;
    const Wvap = ATM * (Vg - Vl);
    const dGvap = Hv - Tb * (Hv / Tb);
    const dFvap = dGvap - Wvap;
    check(Math.abs(dGvap) < 1e-9 && Wvap > 3000 && Wvap < 3200, 'A 的反例：ΔG = 0、W ≈ 3.1 kJ');
    agree(Wvap, -dFvap, 'A：可逆汽化的功等于 −ΔF', 1e-12);
    const optA = !(Wvap > -dGvap + 1);

    // B：F 是状态函数
    let optB = false;
    for (const f of [IDEAL, VDW]) {
      const rev = reversibleIso(f, T2, 0.01, 0.02);
      const free = stepped(f, T2, 0.01, [[0, 0.02]]);
      const dFrev = fOf(f, T2, 0.02) - fOf(f, T2, 0.01);
      agree(-rev.W, dFrev, 'B：可逆过程 ΔF = −W', 1e-9);
      check(free.dStot > 1 && Math.abs(rev.dStot) < 1e-9, 'B：自由膨胀不可逆、准静态可逆');
      // 自由膨胀的 ΔF 按定义 ΔU − TΔS 算：ΔU = Q − W
      const dFirr = free.Q - free.W - T2 * free.dS;
      agree(dFirr, dFrev, 'B：两个过程的 ΔF 相同', 1e-9);
      if (dFirr > dFrev + 1e-6) optB = true;
    }

    // C：外界对气体做的功 ≥ ΔF
    let optC = true;
    const rand = rng(20_261_124);
    for (const f of [IDEAL, VDW]) {
      const V1 = 0.02;
      const V2 = 0.008;
      const dF = fOf(f, T2, V2) - fOf(f, T2, V1);
      const rev = reversibleIso(f, T2, V1, V2);
      agree(-rev.W, dF, 'C：可逆压缩取等号', 1e-9);
      for (const N of [1, 3, 30, 300]) {
        // 每一级外压取这一级末体积的平衡压强
        const steps: [number, number][] = [];
        for (let i = 1; i <= N; i++) {
          const V = V1 + ((V2 - V1) * i) / N;
          steps.push([pOf(f, T2, V), V]);
        }
        const b = stepped(f, T2, V1, steps);
        if (!(-b.W >= dF - 1e-9 * Math.abs(dF))) optC = false;
        check(b.dStot >= -1e-12, 'C：分级压缩总熵不减');
        agree(-b.W, dF + T2 * b.dStot, 'C：W_外 = ΔF + TΔS_总', 1e-9);
      }
      for (let k = 0; k < 2000; k++) {
        const N = 1 + Math.floor(rand() * 6);
        const cuts = Array.from({ length: N - 1 }, () => V2 + (V1 - V2) * rand()).sort((x, y) => y - x);
        const vs = [...cuts, V2];
        let V = V1;
        const steps: [number, number][] = [];
        for (const Vn of vs) {
          // 压缩要推得动：外压不小于这一级里气体的平衡压强
          const pMin = Math.max(pOf(f, T2, Vn), pOf(f, T2, V));
          steps.push([pMin * (1 + 2 * rand()), Vn]);
          V = Vn;
        }
        const b = stepped(f, T2, V1, steps);
        if (!(-b.W >= dF - 1e-9 * Math.abs(dF))) optC = false;
        check(b.dStot >= 0, 'C：随机分级总熵不减');
      }
    }
    for (const tau of [0.5, 5, 50]) {
      // 有限快慢的压缩：气体温度中途高于热库
      const b = finiteSpeed(1, T2, 0.02, 0.008, tau, 5);
      const dF = -R * T2 * Math.log(0.008 / 0.02);
      check(b.Tmax > T2 + 10, 'C：有限快慢压缩，中途气体比热库热');
      if (!(-b.W >= dF - 1e-6)) optC = false;
      agree(-b.W, dF + T2 * b.dStot, `C：有限快慢压缩 tau = ${tau}`, 1e-6);
    }

    // D：判据管不可逆过程：刚性容器里的自由膨胀
    const freeD = stepped(IDEAL, T2, 0.01, [[0, 0.02]]);
    const dFfree = fOf(IDEAL, T2, 0.02) - fOf(IDEAL, T2, 0.01);
    check(freeD.dStot > 0 && freeD.W === 0 && dFfree < 0, 'D：自由膨胀不可逆、W = 0、ΔF < 0');
    agree(dFfree, -R * T2 * Math.log(2), 'D：ΔF = −RT ln 2', 1e-9);
    const optD = !(freeD.dStot > 0 && dFfree < 0); // 「只适用于可逆过程」：有不可逆的例子就不成立

    // E：刚性容器里两份 1 mol 理想气体，中间一个导热的活塞，总体积 40 L，整个浸在 300 K 热库里
    const Vtot = 0.04;
    const Ftot = (x: number) => fOf(IDEAL, T2, x) + fOf(IDEAL, T2, Vtot - x);
    const Stot = (x: number) => sOf(IDEAL, T2, x) + sOf(IDEAL, T2, Vtot - x);
    let optE = true;
    let zeroSeen = 0;
    let negSeen = 0;
    for (const x0 of [0.008, 0.012, 0.016, 0.019]) {
      for (const c of [0, 0.3, 1, 3]) {
        const r = releasePiston(T2, Vtot, x0, c);
        const dF = Ftot(r.x1) - Ftot(x0);
        // 活塞从静止到静止：气体的功全部变成摩擦热；系统对外不做功，W = 0；内能不变，净吸热 = 0
        check(Math.abs(r.gasWork - r.heat) < 1e-6 * R * T2, 'E：静止到静止，气体的功等于摩擦热');
        // 总熵变：气体的熵变 − 净吸热（零）/T
        const dStot = Stot(r.x1) - Stot(x0);
        if (c === 0) {
          agree(r.x1, Vtot - x0, 'E：没有摩擦时停在镜像位置', 1e-7);
          if (!(Math.abs(dF) < 1e-5 * R * T2 && Math.abs(dStot) < 1e-5 * R)) optE = false;
          zeroSeen++;
        } else {
          agree(dF, -r.heat, 'E：ΔF = −摩擦热', 1e-5);
          agree(dStot, r.heat / T2, 'E：ΔS_总 = 摩擦热/T', 1e-5);
          if (!(dF < -1e-3 && dStot > 1e-6)) optE = false;
          negSeen++;
        }
      }
    }
    check(zeroSeen === 4 && negSeen === 12, 'E：两类都见到');
    // 没有摩擦的那一类确实可逆：从镜像位置再放开，活塞自己回到出发点
    {
      const a = releasePiston(T2, Vtot, 0.012, 0);
      // 左右对调，等价于从左边 Vtot − x1 处放开
      const back = releasePiston(T2, Vtot, Vtot - a.x1, 0);
      agree(Vtot - back.x1, 0.012, 'E：没有摩擦时放开后能自己走回出发点', 1e-6);
    }
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3（kJ）----------
    const T3 = 298;
    const dH3 = -285.8;
    const dS3 = -163.3e-3; // kJ/K
    const Wmax3 = -(dH3 - T3 * dS3);
    const heat3 = -(T3 * dS3);
    {
      const dStot = (W: number) => dS3 - (dH3 + W) / T3; // 始末压强都是 p、外界压强一直是 p：Q = ΔH + W_其他
      const sup = supOfPredicate((W) => dStot(W) >= 0, 0, 285.8, 400_000);
      check(sup !== null, 'p3 扫到了');
      agree(sup as number, Wmax3, 'p3 总熵不减的最大电功', 1e-9);
      agree(-(dH3 + (sup as number)), heat3, 'p3 放出的热量（第一定律）', 1e-9);
      for (let k = 0; k <= 100; k++) {
        const W = (Wmax3 * k) / 100;
        check(dStot(W) >= -1e-12, 'p3 每个不超过最大值的电功，总熵都不减');
      }
      check(dStot(Wmax3 * 1.0001) < 0, 'p3 再大一点总熵就减少');
      agree(dH3 - T3 * dS3, -Wmax3, 'p3 ΔG', 1e-12);
    }

    // ---------- p4 ----------
    const n4 = 1.0;
    const T4 = 300;
    const V1 = 0.01;
    const V2 = 0.03;
    const Wmax4 = n4 * R * T4 * Math.log(V2 / V1);
    const W4 = 1500;
    const dStot4 = (Wmax4 - W4) / T4;
    {
      // （a）准静态
      const rev = reversibleIso(IDEAL, T4, V1, V2);
      agree(rev.W, Wmax4, 'p4 准静态 ∫p dV', 1e-9);
      check(Math.abs(rev.dStot) < 1e-9, 'p4 准静态总熵变为 0');
      // （b）外压分 N 级
      let prev = -Infinity;
      for (const N of [1, 10, 100, 1000, 10_000, 100_000]) {
        const steps: [number, number][] = [];
        for (let i = 1; i <= N; i++) {
          const V = V1 * Math.exp((Math.log(V2 / V1) * i) / N);
          steps.push([pOf(IDEAL, T4, V), V]);
        }
        const b = stepped(IDEAL, T4, V1, steps);
        check(b.W > prev && b.W < Wmax4, 'p4 分级越多，功越大而小于最大功');
        agree(b.W, Wmax4 - T4 * b.dStot, `p4 分 ${N} 级：W = W_max − TΔS_总`, 1e-9);
        prev = b.W;
      }
      agree(prev, Wmax4, 'p4 分 10⁵ 级已很接近最大功', 1e-4);
      // （c）有限快慢
      for (const tau of [0.01, 5, 100]) {
        const b = finiteSpeed(n4, T4, V1, V2, tau, 5);
        check(b.Tmin < T4 && b.W < Wmax4 && b.dStot > 0, 'p4 有限快慢：中途气体比热库凉、功小于最大功');
        agree(b.W, Wmax4 - T4 * b.dStot, `p4 有限快慢 tau = ${tau}`, 1e-6);
        agree(b.dS, n4 * R * Math.log(V2 / V1), `p4 有限快慢 tau = ${tau}：气体的熵变只看始末`, 1e-6);
      }
      // （d）恰好做 1500 J 的三个过程
      const pExt = W4 / (V2 - V1);
      check(pExt < pOf(IDEAL, T4, V2), 'p4 恒外压 75 kPa 小于末态压强 83.1 kPa，推得动，末态用挡块挡在 30 L');
      const d1 = stepped(IDEAL, T4, V1, [[pExt, V2]]);
      agree(d1.W, W4, 'p4 恒外压一级做功 1500 J', 1e-12);
      agree(d1.dStot, dStot4, 'p4 恒外压一级的总熵变', 1e-9);
      // 先自由膨胀到 Vm，再准静态等温到 V2：nRT ln(V2/Vm) = 1500
      const Vm = bisect((V) => n4 * R * T4 * Math.log(V2 / V) - W4, V1, V2);
      const d2a = stepped(IDEAL, T4, V1, [[0, Vm]]);
      const d2b = reversibleIso(IDEAL, T4, Vm, V2);
      agree(d2a.W + d2b.W, W4, 'p4 先自由膨胀再准静态：功 1500 J', 1e-9);
      agree(d2a.dStot + d2b.dStot, dStot4, 'p4 先自由膨胀再准静态的总熵变', 1e-9);
      // 先自由膨胀到 Vm2，再用 5 s 匀速膨胀到 V2（气体中途比热库凉）
      const Vm2 = bisect((V) => finiteSpeed(n4, T4, V, V2, 5, 5, 4000).W - W4, 0.011, 0.028);
      const d3a = stepped(IDEAL, T4, V1, [[0, Vm2]]);
      const d3b = finiteSpeed(n4, T4, Vm2, V2, 5, 5, 4000);
      agree(d3a.W + d3b.W, W4, 'p4 先自由膨胀再有限快慢：功 1500 J', 1e-6);
      agree(d3a.dStot + d3b.dStot, dStot4, 'p4 先自由膨胀再有限快慢的总熵变', 1e-5);
    }

    return {
      p1: { type: 'number', value: dG1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [Wmax3, heat3] },
      p4: { type: 'tuple', value: [Wmax4, dStot4] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
