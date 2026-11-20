// 独立验算 physics.thermal-physics.internal-energy 的 p1–p4（简单题、中等题）。
// 不走讲解里「用绝热功定义内能、再看外界做的功」那条路，改成直接模拟：把水分成几块，每块的内能按
// 「1 卡让 1 g 水升温 1 K」记作 U = m·c·T（c = 4.184 J/cal × 1000 g/kg = 4184 J/(kg·K)），
// 搅拌的功按随时间变化、各块不均匀的功率分给各块，块与块之间按温差交换热量，用四阶龙格-库塔法一直积到温度处处相同，
// 读出末温；再和「总能量 ÷ 总热容」的一行算式核对。p4 给四个状态配上一个热容为常数的具体系统（温度当状态），
// 再换几个参考值，核对答案和参考值无关。选择题逐条用具体的数造例子（正例或反例），例子写在 notes 里。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.internal-energy.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, rk4 } from './physics.newtonian-mechanics._nm.ts';

const J_PER_CAL = 4.184;
const C_WATER = J_PER_CAL * 1000; // J/(kg·K)，由「1 卡让 1 g 水升温 1 K」

/**
 * 隔热容器里的几块水：masses（kg）、初温 temps（K 或 °C 都行，只用温差）。
 * 外界搅拌的总功率 P(t) 只在 0 ≤ t ≤ tStir 时不为零，按 share(i, t) 的比例分给第 i 块（各块之和为 1）；
 * 相邻两块之间按 G·(T_j − T_i) 交换热量（只在块与块之间，容器隔热，对外不传热）。
 * 一直积到 tEnd，返回各块的末温和外界做的总功（对 P 数值积分，和能量账独立）。
 */
function stirAndMix(
  masses: number[],
  temps: number[],
  P: (t: number) => number,
  share: (i: number, t: number) => number,
  tStir: number,
  G: number,
  tEnd: number,
  steps: number,
): { final: number[]; work: number } {
  const n = masses.length;
  // 状态：各块的温度，最后一个分量是累计的功；stirring 为 false 时功率为零
  const rhs = (stirring: boolean) => (t: number, y: number[]): number[] => {
    const d = new Array(n + 1).fill(0);
    const power = stirring ? P(t) : 0;
    for (let i = 0; i < n; i++) {
      let heatIn = 0;
      if (i > 0) heatIn += G * (y[i - 1] - y[i]);
      if (i < n - 1) heatIn += G * (y[i + 1] - y[i]);
      d[i] = (heatIn + power * share(i, t)) / (masses[i] * C_WATER);
    }
    d[n] = power;
    return d;
  };
  // 搅拌阶段和之后的混合阶段分开积，免得功率在 tStir 处的跳变落在一步中间
  const y1 = rk4(rhs(true), [...temps, 0], 0, tStir, steps);
  const y2 = rk4(rhs(false), y1, tStir, tEnd, steps);
  return { final: y2.slice(0, n), work: y2[n] };
}

export const verification: Verification = {
  lesson: 'physics.thermal-physics.internal-energy',
  notes: {
    p1: '把 2.00 kg 水分成 5 块（0.2、0.3、0.4、0.5、0.6 kg），功率随时间变化（P ∝ 1 + 0.5 sin t），各块分到的比例不等且随时间变，积分的总功调到 1.20×10⁴ J；块之间按温差传热，积到温度一致，末温减初温 = 1.43403 K；和「功折成卡 ÷ 克数」W/(4.184×2000) 核对。',
    p2: 'A：铁块 10 kg（热容 4500 J/K）、木块 0.5 kg（850 J/K）都和屋里的空气热平衡、同为 293.15 K，接触后按 G·ΔT 传热，积 1 小时温度一点不变、传的热为 0（对；对照：差 10 K 时会传热）。B：搅拌的功先变成水流的动能 K，再按 dK/dt = P − K^1.5/κ 耗散成内能，快（200 W）、慢（20 W）两种功率各搅到动能耗尽、内能增加 5000 J，所需的功都是 5000 J（对）。C：p1 的配置，绝热包着、外界搅拌做功 1.2×10⁴ J，内能增加（错）。D：上热下冷的一层静止空气（1 cm 厚，上下差 10 K）不对流，靠热导率约 0.026 W/(m·K) 的热传导仍有约 26 W/m² 的热流；水的热导率约 0.6 W/(m·K)（错）。E：靠流体本身流动把热带走，就是对流（对）。',
    p3: '两块水 1.20 kg、15.0 °C 和 0.800 kg、65.0 °C，搅拌功率 400 W 搅 25 s（总功 1.00×10⁴ J），先分给冷水 80%、后来渐渐全给热水，同时按温差交换热量，积到温度一致得 36.1950 °C；另按「先混合、后搅拌」「先搅拌、后混合」两种次序各算一次，末温相同；和 (Σm·t + W/c)/Σm 核对。',
    p4: '给四个状态配一个热容 C = 100 J/K 的系统（温度当状态）：T₁ = 290 K，1→2 绝热做功 500 J 得 T₂ = 295 K，1→3 吸热 300 J 得 T₃ = 293 K，3→4 绝热做功 350 J 得 T₄ = 296.5 K；4→2 不做功，吸的热 = C(T₂ − T₄) = −150 J。再取 U₁ 为 0、1000、−777 J 三个参考值按 U₂ − U₄ 算，结果都相同。',
  },
  compute() {
    // ---------- p1（K）----------
    const m1 = [0.2, 0.3, 0.4, 0.5, 0.6];
    check(Math.abs(m1.reduce((a, b) => a + b, 0) - 2.0) < 1e-12, 'p1 各块质量之和是 2.00 kg');
    const W1 = 1.2e4;
    const tStir1 = 60;
    // P(t) = P0 (1 + 0.5 sin t)，选 P0 使 0..tStir 上的积分正好是 W1
    const P0 = W1 / (tStir1 + 0.5 * (1 - Math.cos(tStir1)));
    const share1 = (i: number, t: number) => {
      const w = m1.map((_, j) => (j + 1) * (1 + 0.3 * Math.cos(t + j)));
      return w[i] / w.reduce((a, b) => a + b, 0);
    };
    const T0 = 20;
    const run1 = stirAndMix(m1, m1.map(() => T0), (t) => P0 * (1 + 0.5 * Math.sin(t)), share1, tStir1, 50, 3000, 60000);
    agree(run1.work, W1, 'p1 数值积分的总功', 1e-9);
    const spread1 = Math.max(...run1.final) - Math.min(...run1.final);
    check(spread1 < 1e-9, 'p1 积到最后温度处处相同');
    const p1 = agree(run1.final[0] - T0, W1 / J_PER_CAL / 2000, 'p1 模拟和「功折成卡 ÷ 克数」', 1e-8);

    // ---------- p2 ----------
    // A：同温接触，不传热
    const Ciron = 4500;
    const Cwood = 850;
    const Gcontact = 2; // W/K
    const contact = (Ta: number, Tb: number) => {
      const y = rk4((_t, s) => [(-Gcontact * (s[0] - s[1])) / Ciron, (Gcontact * (s[0] - s[1])) / Cwood, Gcontact * (s[0] - s[1])], [Ta, Tb, 0], 0, 3600, 3600);
      return { Ta: y[0], Tb: y[1], heat: y[2] };
    };
    const same = contact(293.15, 293.15);
    check(same.heat === 0 && same.Ta === 293.15 && same.Tb === 293.15, 'A：同温接触，温度不变、传的热为 0');
    const differ = contact(303.15, 293.15);
    check(differ.heat > 100, 'A 的对照：差 10 K 时铁块向木块传热');
    const optA = same.heat === 0;
    // B：绝热搅拌，快慢两种功率，所需的功只看始末
    const kappa = 30;
    const workFor = (P: number) => {
      const target = 5000; // 内能增加 5000 J 时停：先搅 target/P 秒，再等水流的动能耗尽
      const tS = target / P;
      const rhs = (p: number) => (_t: number, s: number[]) => {
        const diss = Math.pow(Math.max(s[0], 0), 1.5) / kappa;
        return [p - diss, diss, p];
      };
      const a = rk4(rhs(P), [0, 0, 0], 0, tS, 20000);
      const b = rk4(rhs(0), a, tS, tS + 20000, 200000);
      return { K: b[0], dU: b[1], W: b[2] };
    };
    const fast = workFor(200);
    const slow = workFor(20);
    check(fast.K < 1e-3 && slow.K < 1e-3, 'B：最后水流停下');
    agree(fast.dU, 5000, 'B 快搅：内能增加 5000 J', 1e-6);
    agree(slow.dU, 5000, 'B 慢搅：内能增加 5000 J', 1e-6);
    const optB = Math.abs(fast.W - slow.W) < 1e-6 * fast.W;
    // C：绝热包着照样能靠做功改变内能（p1 的配置）
    const dUc = run1.work; // 隔热容器、外界搅拌：内能增加量 = 外界做的功
    const optC = !(dUc > 0);
    // D：静止的流体里照样有热传导
    const kAir = 0.026;
    const kWater = 0.6;
    const qAir = (kAir * 10) / 0.01;
    check(qAir > 20 && kWater > 0, 'D 的反例：上热下冷的静止空气层有热流');
    const optD = false;
    // E：流体流动带走热量，就是对流
    const optE = true;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // ---------- p3（°C）----------
    const m3 = [1.2, 0.8];
    const t3 = [15.0, 65.0];
    const W3 = 1.0e4;
    const P3 = 400;
    const tStir3 = W3 / P3;
    const share3 = (i: number, t: number) => {
      const toCold = 0.8 * (1 - t / tStir3);
      return i === 0 ? toCold : 1 - toCold;
    };
    const run3 = stirAndMix(m3, t3, () => P3, share3, tStir3, 20, 4000, 80000);
    agree(run3.work, W3, 'p3 数值积分的总功', 1e-9);
    check(Math.abs(run3.final[0] - run3.final[1]) < 1e-9, 'p3 积到最后两块温度相同');
    const closed3 = (m3[0] * t3[0] + m3[1] * t3[1] + W3 / C_WATER) / (m3[0] + m3[1]);
    // 两种次序：先混合（不做功）再搅拌；先各自搅拌（功按质量分）再混合
    const mixFirst = (m3[0] * t3[0] + m3[1] * t3[1]) / (m3[0] + m3[1]) + W3 / ((m3[0] + m3[1]) * C_WATER);
    const stirFirst = t3.map((t, i) => t + (W3 * 0.5) / (m3[i] * C_WATER));
    const thenMix = (m3[0] * stirFirst[0] + m3[1] * stirFirst[1]) / (m3[0] + m3[1]);
    agree(mixFirst, closed3, 'p3 先混合后搅拌', 1e-12);
    agree(thenMix, closed3, 'p3 先搅拌后混合', 1e-12);
    const p3 = agree(run3.final[0], closed3, 'p3 模拟和总能量 ÷ 总热容', 1e-9);

    // ---------- p4（J）----------
    const C4 = 100; // J/K
    const T1 = 290;
    const T2 = T1 + 500 / C4;
    const T3 = T1 + 300 / C4;
    const T4 = T3 + 350 / C4;
    const Q42model = C4 * (T2 - T4);
    const byRef = [0, 1000, -777].map((U1) => {
      const U2 = U1 + 500;
      const U3 = U1 + 300;
      const U4 = U3 + 350;
      return U2 - U4;
    });
    check(byRef.every((q) => q === byRef[0]), 'p4 和参考值无关');
    const p4 = agree(Q42model, byRef[0], 'p4 具体系统和状态函数记账', 1e-12);

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
