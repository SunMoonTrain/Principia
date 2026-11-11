// 独立验算 physics.electromagnetism.dc-circuits 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的公式（闭合电路的 I = ℰ/(R + r)、并联电阻、戴维南等效）；
// 二是不用这些式子：把电路写成节点电势的线性方程组（每个节点流出的电流之和为零，支路电流 = (φ_a − φ_b + ℰ)/R），
// 用高斯消元解出来（_es.ts 的 solveCircuit）。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.dc-circuits.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, solveCircuit, solveLinear } from './physics.electromagnetism._es.ts';

export const verification: Verification = {
  lesson: 'physics.electromagnetism.dc-circuits',
  notes: {
    p1: 'ℰR/(R + r)；和节点法核对：负极接地，电池支路（ℰ、内阻 r）和外电阻接在两极之间，解出正极的电势。',
    p2: '1/(1/12 + 1/6 + 1/4)；和节点法核对：三个电阻并联后接一个 1 V、内阻 1 Ω 的测试电源，由两端电势差 φ 反推 R = φ/(1 − φ)。',
    p3: '戴维南等效：前两条支路等效成 ℰ = (12·4 + 6·2)/6、R = 2·4/6，I = ℰ/(R + 4)；和节点法核对：B 接地，三条支路接在 A、B 之间，读第三条支路的电流。',
    p4: '两个方程 ℰ = I₁(R₁ + r) = I₂(R₂ + r) 消元；和把它写成矩阵、高斯消元解出的 (ℰ, r) 核对，再把解代回节点法电路，两种外电阻下的电流分别是 1.0 A、0.50 A。',
  },
  compute() {
    // p1
    const c1 = solveCircuit(2, [
      { a: 0, b: 1, R: 0.5, emf: 9.0 },
      { a: 1, b: 0, R: 8.5 },
    ]);
    const p1 = agree(c1.phi[1], (9.0 * 8.5) / (8.5 + 0.5), 'p1');

    // p2
    const c2 = solveCircuit(2, [
      { a: 0, b: 1, R: 1, emf: 1 },
      { a: 1, b: 0, R: 12 },
      { a: 1, b: 0, R: 6 },
      { a: 1, b: 0, R: 4 },
    ]);
    const phi = c2.phi[1];
    const p2 = agree(phi / (1 - phi), 1 / (1 / 12 + 1 / 6 + 1 / 4), 'p2');

    // p3：节点 0 = B，节点 1 = A；电源正极朝 A，即从 B 到 A 电势升高 ℰ
    const c3 = solveCircuit(2, [
      { a: 0, b: 1, R: 2.0, emf: 12 },
      { a: 0, b: 1, R: 4.0, emf: 6.0 },
      { a: 1, b: 0, R: 4.0 },
    ]);
    const Eth = (12 * 4 + 6 * 2) / (2 + 4);
    const Rth = (2 * 4) / (2 + 4);
    const p3 = agree(c3.I[2], Eth / (Rth + 4.0), 'p3');

    // p4
    const I1 = 1.0;
    const R1 = 4.0;
    const I2 = 0.5;
    const R2 = 9.0;
    const [emf, r] = solveLinear(
      [
        [1, -I1],
        [1, -I2],
      ],
      [I1 * R1, I2 * R2],
    );
    const rFormula = (I1 * R1 - I2 * R2) / (I2 - I1);
    const p4r = agree(r, rFormula, 'p4 内阻');
    const p4e = agree(emf, I1 * (R1 + rFormula), 'p4 电动势');
    for (const [R, I] of [
      [R1, I1],
      [R2, I2],
    ]) {
      const c = solveCircuit(2, [
        { a: 0, b: 1, R: p4r, emf: p4e },
        { a: 1, b: 0, R },
      ]);
      agree(c.I[1], I, `p4 代回 R = ${R}`);
    }

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [p4e, p4r] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
