// 独立验算 physics.optics.fabry-perot 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（自由光谱范围 c/(2nd)、F = 4R/(1 − R)²、T = 1/(1 + F sin²(δ/2))、R 接近 1 时 𝓕 = π√R/(1 − R)）；
// 二是不用这些式子：透射的各束光振幅依次是 (1 − R)(Re^{iδ})^k，直接相加后取模平方（multiBeamT），
// p1 在频率上做黄金分割找相邻两个透射峰；p3 在 δ 上二分出半高处，按定义算「峰间隔/半高宽」
// （定理是 R 接近 1 时的近似，和精确的半高宽差约 10⁻⁴，返回定理的值）；p4 直接算 δ = π 处的透射率。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.fabry-perot.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, bisect, check, chosen, multiBeamT, phasorIntensity } from './physics.optics._op.ts';

const C3 = 3.0e8; // 题面给的光速

/** 透射峰在 δ 上的半高宽（精确：在 δ = 0 两侧二分出 T = 1/2）。 */
const fwhm = (R: number) => 2 * bisect((x) => multiBeamT(R, x) - 0.5, 0, Math.PI);

export const verification: Verification = {
  lesson: 'physics.optics.fabry-perot',
  notes: {
    p1: 'c/(2nd)，n = 1、d = 1.0 cm；和多光束直接相加核对：R = 0.9，δ = 4πdν/c，在 500 THz 附近相邻两个透射峰上各做黄金分割，两个峰的频率相减。',
    p2: '逐条用例子（多光束直接相加）：A R = 0.9，d = 1、2 cm 时透射峰按频率的半高宽 0.50、0.25 GHz，间距大的反而窄（错）；B d = 1 cm，R = 0.5、0.9 时半高宽 3.45、0.50 GHz，反射率高的窄（对）；C d = 1、2 cm 的峰间隔 15、7.5 GHz（对）；D 透射率在 δ = 4πd/λ = 2πm 处为 1，往返光程 2d = mλ（对）；E R = 0.04 时多光束算出的 T（在 0.85 和 1 之间起伏）和只取前两束（两束干涉）的相差不到 0.4%（错）。',
    p3: '𝓕 = π√R/(1 − R)；和多光束直接相加核对：R = 0.95，在 δ 上二分出 T = 1/2 的两点，按定义 2π/半高宽，得 61.234，和定理的 61.241 差 1×10⁻⁴（定理是 R 接近 1 的近似）。',
    p4: 'T = 1/(1 + F)，F = 4R/(1 − R)²；和多光束直接相加核对：R = 0.90，δ = π 处把 4000 束光的振幅相加取模平方。',
  },
  compute() {
    // p1（GHz）
    const d = 0.01;
    const formula1 = C3 / (2 * d) / 1e9;
    const T = (nu: number) => multiBeamT(0.9, (4 * Math.PI * d * nu) / C3);
    const m0 = Math.round((2 * d * 5e14) / C3);
    const nuPeak = (m: number) => argmax(T, ((m - 0.2) * C3) / (2 * d), ((m + 0.2) * C3) / (2 * d));
    const p1 = agree((nuPeak(m0 + 1) - nuPeak(m0)) / 1e9, formula1, 'p1 自由光谱范围', 1e-7);

    // p2
    const fsr = (dd: number) => C3 / (2 * dd);
    const halfWidthHz = (R: number, dd: number) => (fwhm(R) / (2 * Math.PI)) * fsr(dd);
    check(Math.abs(halfWidthHz(0.9, 0.01) / 1e9 - 0.504) < 1e-3 && Math.abs(halfWidthHz(0.9, 0.02) / 1e9 - 0.252) < 1e-3, 'A：0.50、0.25 GHz');
    const optA = halfWidthHz(0.9, 0.02) > halfWidthHz(0.9, 0.01);
    check(Math.abs(halfWidthHz(0.5, 0.01) / 1e9 - 3.45) < 0.01, 'B：R = 0.5 时 3.45 GHz');
    const optB = halfWidthHz(0.9, 0.01) < halfWidthHz(0.5, 0.01);
    const optC = fsr(0.02) < fsr(0.01) && Math.abs(fsr(0.01) / 1e9 - 15) < 1e-9;
    const optD = Math.abs(multiBeamT(0.9, 2 * Math.PI * 7) - 1) < 1e-12;
    // E：只取前两束（透射的第 0、1 束）和全部相加比
    const twoBeam = (R: number, delta: number) => phasorIntensity([[1 - R, 0], [(1 - R) * R, delta]]);
    let maxRel = 0;
    for (let k = 0; k <= 100; k++) {
      const delta = (2 * Math.PI * k) / 100;
      maxRel = Math.max(maxRel, Math.abs(twoBeam(0.04, delta) - multiBeamT(0.04, delta)) / multiBeamT(0.04, delta));
    }
    check(maxRel < 4e-3, 'E：R = 0.04 时和两束干涉相差不到 0.4%');
    const optE = maxRel > 0.1;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const R3 = 0.95;
    const formula3 = (Math.PI * Math.sqrt(R3)) / (1 - R3);
    const exact3 = (2 * Math.PI) / fwhm(R3);
    check(Math.abs(exact3 - 61.234) < 1e-3, 'p3 按定义精确算 61.234');
    agree(exact3, formula3, 'p3 精细度（定义 vs 定理）', 2e-4);
    const p3 = formula3;

    // p4
    const R4 = 0.9;
    const formula4 = 1 / (1 + (4 * R4) / (1 - R4) ** 2);
    const p4 = agree(multiBeamT(R4, Math.PI), formula4, 'p4 透射率', 1e-9);

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
