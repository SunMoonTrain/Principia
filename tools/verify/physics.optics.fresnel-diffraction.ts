// 独立验算 physics.optics.fresnel-diffraction 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（r_m ≈ √(mλL)、露出的半波带数 N = a²/(λL)、奇亮偶暗、I = 4I₀sin²(Nπ/2)）；
// 二是不用这些式子：按惠更斯-菲涅耳原理把孔里的次波直接积分。p1 用精确距离 √(L² + r²) = L + λ/2 二分；
// p3 积分 ∫ e^{−ikR}·(1 + cosχ)/2·(1/R)·r dr（R = √(L² + r²)，带倾斜因子），在 L 上找光强的极小；
// p4 按题意不计倾斜：∫₀^a e^{−iπr²/(λL)} r dr，不加遮挡时的振幅用收敛因子 e^{−εr²} 算到 ε → 0（理查森外推）。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.fresnel-diffraction.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, bisect, check, chosen } from './physics.optics._op.ts';
import { integrate } from './physics.electromagnetism._es.ts';

/** 复数积分 ∫ f(x) e^{iφ(x)} dx（实部、虚部分开，用高斯-勒让德）。 */
function cint(f: (x: number) => number, ph: (x: number) => number, a: number, b: number, panels = 400): [number, number] {
  return [integrate((x) => f(x) * Math.cos(ph(x)), a, b, panels, 16), integrate((x) => f(x) * Math.sin(ph(x)), a, b, panels, 16)];
}
const abs2 = (z: [number, number]) => z[0] * z[0] + z[1] * z[1];

/** 圆孔（半径 a）后轴上 L 处的振幅：带倾斜因子和 1/R，换元 r dr = R dR。 */
function onAxisAperture(a: number, L: number, lambda: number): [number, number] {
  const k = (2 * Math.PI) / lambda;
  const Rmax = Math.sqrt(L * L + a * a);
  return cint((R) => (1 + L / R) / 2, (R) => -k * R, L, Rmax, 200);
}
/** 不计倾斜时，半径 a 的孔里次波在轴上 L 处的振幅（傍轴相位）。 */
function paraxialAperture(a: number, L: number, lambda: number): [number, number] {
  return cint((r) => r, (r) => (-Math.PI * r * r) / (lambda * L), 0, a, 400);
}
/** 不加遮挡、不计倾斜的振幅：加收敛因子 e^{−εr²}，对两个 ε 做理查森外推到 ε → 0。 */
function paraxialOpen(L: number, lambda: number): number {
  const amp = (eps: number) => {
    const rMax = Math.sqrt(40 / eps);
    return abs2(cint((r) => r * Math.exp(-eps * r * r), (r) => (-Math.PI * r * r) / (lambda * L), 0, rMax, 4000));
  };
  const e0 = Math.PI / (lambda * L) / 50; // 衰减比相位慢 50 倍
  return (4 * amp(e0 / 2) - amp(e0)) / 3;
}

export const verification: Verification = {
  lesson: 'physics.optics.fresnel-diffraction',
  notes: {
    p1: 'r₁ = √(λL)；和精确距离核对：二分 √(L² + r²) = L + λ/2（差 λ/(8L) 量级）。',
    p2: '逐条用例子（不计倾斜的次波积分）：A 露出 2 个半波带，光强约为不加遮挡时的 0（错）；B N = (0.9 mm)²/(600 nm × 0.45 m) = 3，次波积分得约 4 倍，亮（对）；C 亮斑只要求点光源（或平行光）和圆屏规整，阿拉戈 1818 年用的不是激光（错）；D 半径 √m·0.5 mm 的波带片，奇数圈透光和偶数圈透光两种，在 0.2 到 2 m 上积分找最亮点，都在 r₁²/λ（对）；E N = a²/(λL)，L 从 0.5 m 到 1 m，精确距离数出的半波带由 3.33 个变成 1.67 个（错）。',
    p3: '最远的暗点 N = 2，L = a²/(2λ)；和带倾斜因子的次波积分核对：在 1.1 到 1.3 m 上黄金分割找轴上光强的极小。',
    p4: 'I/I₀ = 4sin²(Nπ/2)，N = a²/(λL)；和次波积分核对：∫₀^a e^{−iπr²/(λL)} r dr 的模平方除以不加遮挡时的（收敛因子外推）。',
  },
  compute() {
    // p1（mm）
    const lam1 = 600e-9;
    const L1 = 1.5;
    const formula1 = Math.sqrt(lam1 * L1) * 1e3;
    const exact1 = bisect((r) => Math.sqrt(L1 * L1 + r * r) - L1 - lam1 / 2, 0, 1e-2) * 1e3;
    const p1 = agree(exact1, formula1, 'p1 第一个半波带的半径', 1e-6);

    // p2
    const ratio = (a: number, L: number, lam: number) => abs2(paraxialAperture(a, L, lam)) / paraxialOpen(L, lam);
    const iA = ratio(Math.sqrt(2 * 500e-9 * 1), 1, 500e-9); // 恰好 2 个半波带
    check(iA < 1e-6, 'A：露出 2 个半波带时几乎全暗');
    const optA = Math.abs(iA - 4) < 0.5;
    const iB = ratio(0.9e-3, 0.45, 600e-9);
    check(Math.abs(iB - 4) < 1e-3, 'B：约 4 倍');
    const optB = iB > 2;
    const optC = false; // 史实和讲解：普通光源的点光源即可（见 notes）
    // D：波带片 r_m = √m·r₁，r₁ = 0.5 mm，λ = 500 nm，f = r₁²/λ = 0.5 m；各透光圈的次波相加（不计倾斜）
    const r1 = 0.5e-3;
    const lamD = 500e-9;
    const plate = (odd: boolean) => (L: number) => {
      let re = 0;
      let im = 0;
      for (let m = odd ? 1 : 2; m <= 40; m += 2) {
        const z = cint((r) => r, (r) => (-Math.PI * r * r) / (lamD * L), Math.sqrt(m - 1) * r1, Math.sqrt(m) * r1, 8);
        re += z[0];
        im += z[1];
      }
      return re * re + im * im;
    };
    const best = (f: (L: number) => number) => {
      let bestL = 0.2;
      let bestV = -1;
      for (let L = 0.2; L <= 2; L += 0.005) {
        const v = f(L);
        if (v > bestV) {
          bestV = v;
          bestL = L;
        }
      }
      return argmax(f, bestL - 0.005, bestL + 0.005);
    };
    const fOdd = best(plate(true));
    const fEven = best(plate(false));
    // 只有 20 个透光圈，焦点的深度约 f/20，振幅前的因子 ∝ L 让最亮点比 f 远万分之几；两种的最亮点重合
    check(Math.abs(fOdd - 0.5) < 2e-3 && Math.abs(fEven - 0.5) < 2e-3, 'D：两种都在 0.5 m 附近');
    const optD = Math.abs(fOdd - fEven) < 1e-4;
    const zones = (a: number, L: number, lam: number) => (Math.sqrt(L * L + a * a) - L) / (lam / 2);
    const nNear = zones(1e-3, 0.5, 600e-9);
    const nFar = zones(1e-3, 1, 600e-9);
    check(Math.abs(nNear - 10 / 3) < 1e-4 && Math.abs(nFar - 5 / 3) < 1e-4, 'E：3.33、1.67 个');
    const optE = nFar > nNear;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m）
    const lam3 = 600e-9;
    const a3 = 1.2e-3;
    const formula3 = (a3 * a3) / (2 * lam3);
    const I3 = (L: number) => abs2(onAxisAperture(a3, L, lam3));
    // 先确认 1.3 m 到 20 m 之间光强没有极小（只有一个极大，在 N = 1 处），所以最远的暗点在 1.3 m 以内
    const grid: number[] = [];
    for (let L = 1.3; L <= 20; L += 0.02) grid.push(I3(L));
    const interiorMin = grid.some((v, i) => i > 0 && i < grid.length - 1 && v < grid[i - 1] && v < grid[i + 1]);
    check(!interiorMin, 'p3 1.3 m 以外没有更远的暗点');
    const Lmin = argmax((L) => -I3(L), 1.1, 1.3);
    check(I3(Lmin) < 1e-3 * I3(2 * Lmin), 'p3 那里几乎全暗');
    const p3 = agree(Lmin, formula3, 'p3 最远的暗点', 1e-5);

    // p4
    const lam4 = 520e-9;
    const a4 = 0.8e-3;
    const L4 = 1;
    const N4 = (a4 * a4) / (lam4 * L4);
    const formula4 = 4 * Math.sin((N4 * Math.PI) / 2) ** 2;
    const p4 = agree(ratio(a4, L4, lam4), formula4, 'p4 光强是不加遮挡时的倍数', 1e-6);

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
