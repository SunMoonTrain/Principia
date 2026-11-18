// 独立验算 physics.oscillations-waves.beaded-string 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 ω_n = 2√(T/(ma)) sin(nπ/(2(N+1)))、小球的振幅正比于 sin(jnπ/(N+1))、连续极限 f1 = v/(2ℓ)；
// 二是不用这些式子，对每个小球列牛顿第二定律得到刚度矩阵，用雅可比方法求本征值和本征向量；连续极限用斯图姆序列
// 求细分到 100、200、400 段的链的最低频率，再做理查森外推。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.beaded-string.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, beadedStringK, check, chosen, normalModes, stringLowestOmega } from './physics.oscillations-waves._ow.ts';

const chain = (N: number, T = 1, a = 1, m = 1) => normalModes(beadedStringK(N, T, a), Array(N).fill(m));

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.beaded-string',
  notes: {
    p1: 'ω1 = 2√(10/(0.010 × 0.10)) sin(π/10)；和雅可比法求 4 × 4 刚度矩阵（对角 2T/a、次对角 −T/a）除以 m 的最小本征值核对。',
    p2: '雅可比法求 N = 5 的本征向量：A 5 个本征值互不相同（对）；B 第 2 个模的第 3 个分量是 0（对）；C 第 5 个模相邻分量的乘积都为负（对）；D 同样的 m、a、T，N = 8 的最低频率比 N = 5 的低（错）；E 第 2 个模的两端振幅是最大的，中间那个是 0（错）。',
    p3: 'sin(5π/12)/sin(π/12) = 2 + √3；和雅可比法求出的最大、最小本征频率之比核对。',
    p4: 'v = √(60/0.003)，f1 = v/(2ℓ)；和把弦细分成 100、200、400 段的链、斯图姆序列求最低频率、理查森外推核对。',
  },
  compute() {
    // p1（rad/s）
    const p1 = agree(chain(4, 10, 0.1, 0.01).omegas[0], 2 * Math.sqrt(10 / (0.01 * 0.1)) * Math.sin(Math.PI / 10), 'p1 最低简正频率', 1e-12);

    // p2
    const c5 = chain(5);
    const optA = c5.omegas.length === 5 && c5.omegas.every((w, i) => i === 0 || w - c5.omegas[i - 1] > 1e-6);
    const optB = Math.abs(c5.modes[1][2]) < 1e-12;
    const optC = c5.modes[4].every((x, j) => j === 0 || x * c5.modes[4][j - 1] < 0);
    const optD = chain(8).omegas[0] > c5.omegas[0];
    const optE = c5.modes.every((v) => {
      const amp = v.map(Math.abs);
      return Math.max(amp[0], amp[4]) <= Math.min(...amp) + 1e-12;
    });
    check(c5.modes[1].map((x, j) => Math.abs(x - Math.sin(((j + 1) * 2 * Math.PI) / 6) / Math.sin(Math.PI / 3))).every((e) => e < 1e-12), 'p2 第 2 个模和 sin(jnπ/(N+1)) 一致');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const p3 = agree(c5.omegas[4] / c5.omegas[0], Math.sin((5 * Math.PI) / 12) / Math.sin(Math.PI / 12), 'p3 最高与最低之比', 1e-12);

    // p4（Hz）
    const p4 = agree(stringLowestOmega(60, 0.003, 0.6) / (2 * Math.PI), Math.sqrt(60 / 0.003) / (2 * 0.6), 'p4 连续极限的最低频率', 1e-9);

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
