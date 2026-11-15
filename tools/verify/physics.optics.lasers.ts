// 独立验算 physics.optics.lasers 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（纵模间隔 c/(2L)、阈值增益 g_th = ln(1/(R₁R₂))/(2L)）；
// 二是不用这些式子：p1 把谐振腔当法布里-珀罗腔，各次往返的光直接相加（multiBeamT），在频率上扫出相邻两个透射峰；
// p3 一小段一小段地追光在腔里来回（每段按 dI = gI·dz 放大，到镜面乘反射率），二分出往返 1000 趟后光强不变的 g；
// p4 把宽 1.50 GHz 的窗口在纵模的梳子上滑动，数窗口里最多装得下几个纵模。
// 选择题用具体例子逐条核对（速率方程、逐段放大）。
// 单独运行：npx tsx tools/verify/physics.optics.lasers.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, bisect, check, chosen, multiBeamT, rk4 } from './physics.optics._op.ts';

const C = 3.0e8;

/** 光强 I0 在增益系数 g 的介质里走 L（分 n 小段，每段 dI = gI·dz，用 RK4）。 */
const amplify = (I0: number, g: number, L: number) => rk4((_z, y) => [g * y[0]], [I0], 0, L, 200)[0];
/** 在腔里来回 trips 趟以后的光强（介质和腔一样长）。 */
function afterTrips(g: number, L: number, R1: number, R2: number, trips: number): number {
  let I = 1;
  for (let k = 0; k < trips; k++) {
    I = amplify(I, g, L) * R2;
    I = amplify(I, g, L) * R1;
  }
  return I;
}

export const verification: Verification = {
  lesson: 'physics.optics.lasers',
  notes: {
    p1: 'Δν = c/(2L)；和多光束相加核对：反射率 0.9 的腔，往返相位 2π·ν·2L/c，各次往返的透射光直接相加，扫出相邻两个透射峰，峰位黄金分割。',
    p2: '逐条用例子：A g = −0.5 m⁻¹ 时逐段放大，走 1 m 后光强乘 0.61（错）；B 两能级、吸收和受激辐射系数相等，速率方程 dN₂/dt = W(N₁ − N₂) − AN₂ 在 W/A = 0.1、10、1000 时稳态 N₂/N₁ = 0.09、0.91、0.999，都小于 1（错）；C 输出镜反射率 1 时透出的比例 1 − R₂ = 0（错）；D L = 0.3、0.6 m 时纵模间隔 500、250 MHz（对）；E L = 0.5 m，高出阈值的范围 0.4、1.2 GHz 时最多装得下 2、5 个纵模（对）。',
    p3: 'g_th = ln(1/(R₁R₂))/(2L)；和逐段追光核对：二分出往返 1000 趟后光强恰好不变的增益系数。',
    p4: '最多 ⌊Δν/(c/2L)⌋ + 1 个；和滑动窗口核对：纵模间隔 312.5 MHz 的梳子上，把宽 1.50 GHz 的窗口在一个间隔内滑 1000 个位置，数窗口里的纵模，取最多的。',
  },
  compute() {
    // p1（MHz）
    const L1 = 0.42;
    const formula1 = C / (2 * L1) / 1e6;
    const T = (nu: number) => multiBeamT(0.9, (2 * Math.PI * nu * 2 * L1) / C);
    // 在 1 GHz 附近扫：找两个相邻的峰
    const peaks: number[] = [];
    const step = 0.2e6;
    for (let nu = 1e9; nu < 2e9 && peaks.length < 2; nu += step) {
      if (T(nu) > T(nu - step) && T(nu) >= T(nu + step) && T(nu) > 0.5) peaks.push(argmax(T, nu - step, nu + step));
    }
    check(peaks.length === 2, 'p1 找到两个峰');
    const p1 = agree((peaks[1] - peaks[0]) / 1e6, formula1, 'p1 纵模间隔', 1e-7);

    // p2
    const optA = amplify(1, -0.5, 1) > 1;
    check(Math.abs(amplify(1, -0.5, 1) - Math.exp(-0.5)) < 1e-9, 'A：乘 0.61');
    const ratioB = (WA: number) => {
      // 稳态：用 RK4 把速率方程推到稳态（N₁ + N₂ = 1，A = 1）
      const y = rk4((_t, s) => [WA * (s[1] - s[0]) - s[0], -(WA * (s[1] - s[0]) - s[0])], [0, 1], 0, 50 / (1 + 2 * WA), 20000);
      return y[0] / y[1];
    };
    const rB = [0.1, 10, 1000].map(ratioB);
    check(rB.every((r) => r < 1) && Math.abs(rB[0] - 0.1 / 1.1) < 1e-6, 'B：稳态都没有反转');
    const optB = rB.some((r) => r > 1);
    const R2c = 1;
    const optC = 1 - R2c > 0; // 输出镜透出的比例 1 − R₂ 为零，没有输出
    const spacing = (L: number) => C / (2 * L);
    const optD = Math.abs(spacing(0.6) / spacing(0.3) - 0.5) < 1e-12;
    const maxModes = (width: number, sp: number) => {
      let best = 0;
      for (let k = 0; k < 1000; k++) {
        const start = (sp * k) / 1000;
        let n = 0;
        for (let m = 0; m * sp <= start + width + sp; m++) if (m * sp >= start && m * sp <= start + width) n++;
        best = Math.max(best, n);
      }
      return best;
    };
    const eA = maxModes(0.4e9, spacing(0.5));
    const eB = maxModes(1.2e9, spacing(0.5));
    check(eA === 2 && eB === 5, 'E：2、5 个');
    const optE = eB > eA;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m⁻¹）
    const L3 = 0.4;
    const formula3 = Math.log(1 / (1.0 * 0.95)) / (2 * L3);
    const g3 = bisect((g) => Math.log(afterTrips(g, L3, 1.0, 0.95, 1000)), 0, 1);
    const p3 = agree(g3, formula3, 'p3 阈值增益', 1e-6);

    // p4
    const L4 = 0.48;
    const formula4 = Math.floor(1.5e9 / spacing(L4)) + 1;
    const p4 = agree(maxModes(1.5e9, spacing(L4)), formula4, 'p4 最多几个纵模', 0);

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
