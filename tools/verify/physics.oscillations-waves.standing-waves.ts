// 独立验算 physics.oscillations-waves.standing-waves 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 f_n = nv/(2ℓ)、λ_n = 2ℓ/n；二是不用这些式子，把两端固定的弦分成小段、对每个小球列牛顿第二定律，
// 用斯图姆序列求第 n 个简正频率并外推到连续极限（stringOmega），或者在整数里搜索相邻的两个固有频率的阶数。
// 选择题用具体的驻波 y = 2cos kx cos ωt 和弦逐条核对。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.standing-waves.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, stringOmega } from './physics.oscillations-waves._ow.ts';

/** 波速为 v、长 L、两端固定的弦的第 n 个固有频率（Hz），由小球链的数值本征值外推。 */
const fn = (v: number, L: number, n: number) => stringOmega(v * v, 1, L, n) / (2 * Math.PI);

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.standing-waves',
  notes: {
    p1: 'f1 = v/(2ℓ)；和取 T = v²、μ = 1 的弦，斯图姆序列求最低简正频率、外推到连续极限核对。',
    p2: '在 y = 2cos 2x cos 3t 和 v = 1、ℓ = 1 的弦上逐条：A 零点 x = π/4 在 t = 0.1、0.7 都还是零点，波形不平移（错）；B 相邻两个零点相距 π/2 = λ/2（对）；C 数值本征值求出的基频对应的波长 2πv/ω1 = 2ℓ（对）；D x = 0.3 和 x = 1.2 两点（隔着波节）的位移反号（错）；E 张力变为 4 倍，数值基频之比是 2（对）。',
    p3: '相邻两个固有频率之差就是基频 70 Hz；和在 n = 1…100 里搜索 420/n = 490/(n + 1) 的整数 n 核对。',
    p4: '分成 4 段是 n = 4，λ = 2ℓ/4，v = λf；和二分波速：数值求出的第 4 个固有频率等于 120 Hz。',
  },
  compute() {
    // p1（Hz）
    const p1 = agree(fn(240, 0.8, 1), 240 / (2 * 0.8), 'p1 基频', 1e-9);

    // p2
    const y = (x: number, t: number) => 2 * Math.cos(2 * x) * Math.cos(3 * t);
    const optA = !(Math.abs(y(Math.PI / 4, 0.1)) < 1e-12 && Math.abs(y(Math.PI / 4, 0.7)) < 1e-12);
    const zeros: number[] = [];
    for (let x = 0; x < 4 && zeros.length < 2; x += 0.01) if (Math.cos(2 * x) * Math.cos(2 * (x + 0.01)) < 0) zeros.push(bisect((s) => Math.cos(2 * s), x, x + 0.01));
    const optB = Math.abs(zeros[1] - zeros[0] - Math.PI / 2) < 1e-12;
    const w1 = stringOmega(1, 1, 1, 1);
    const optC = Math.abs((2 * Math.PI * 1) / w1 - 2 * 1) < 1e-9;
    const optD = y(0.3, 0.2) * y(1.2, 0.2) > 0;
    check(y(0.3, 0.2) * y(1.2, 0.2) < 0, 'p2 D 隔着波节的两点反相');
    const optE = Math.abs(stringOmega(4, 1, 1, 1) / stringOmega(1, 1, 1, 1) - 2) < 1e-9;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（Hz）
    const ns = Array.from({ length: 100 }, (_, i) => i + 1).filter((n) => Math.abs(420 / n - 490 / (n + 1)) < 1e-9);
    check(ns.length === 1, 'p3 只有一个整数阶数');
    const p3 = agree(420 / ns[0], 490 - 420, 'p3 基频', 1e-12);

    // p4（m/s）
    const vSim = bisect((v) => fn(v, 1.2, 4) - 120, 10, 500);
    const p4 = agree(vSim, ((2 * 1.2) / 4) * 120, 'p4 波速', 1e-9);

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
