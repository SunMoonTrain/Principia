// 独立验算 math.analysis.parseval 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.parseval.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { gaussLegendre, goldenMax, grid, richardson, seededRandom, solveLinear } from './math.analysis._numeric.ts';

const P = Math.PI;
const pieces = grid(-P, P, 64);
const integrate = (f: (x: number) => number): number => gaussLegendre(f, pieces);

export const verification: Verification = {
  lesson: 'math.analysis.parseval',
  notes: {
    p1: '直接对 f² 在 [−π, π] 上分段高斯-勒让德求积。',
    p2: 'J(c) = ∫(|x| − c)² dx 用求积算，c 在 [0, π] 上用黄金分割求最小（J 是 c 的二次函数，单峰）。',
    p3: '题目要的数是 Σ1/(2k − 1)⁴：部分和对 k = 1000·2ⁱ 做 Richardson 外推。',
    p4:
      '不预设三角函数系正交：对 1、cos x、sin x、cos 2x、sin 2x 求积算出格拉姆矩阵和 ∫x·φ，解正规方程得最小二乘的 T，' +
      '再求积算 ∫(x − T)²；另随机扰动 T 的 5 个系数 200 次，核对积分都不比它小。',
  },
  compute() {
    // p1
    const f1 = (x: number): number => 1 + 2 * Math.cos(x) - 3 * Math.sin(2 * x);
    const p1 = integrate((x) => f1(x) ** 2);

    // p2
    const J = (c: number): number => integrate((x) => (Math.abs(x) - c) ** 2);
    const p2 = goldenMax((c) => -J(c), 0, P);

    // p3
    const p3 = richardson((K) => {
      let s = 0;
      for (let k = 1; k <= K; k++) s += 1 / (2 * k - 1) ** 4;
      return s;
    }, 1000, 5);

    // p4
    const basis = [() => 1, Math.cos, Math.sin, (x: number) => Math.cos(2 * x), (x: number) => Math.sin(2 * x)];
    const G = basis.map((u) => basis.map((v) => integrate((x) => u(x) * v(x))));
    const rhs = basis.map((u) => integrate((x) => x * u(x)));
    const coef = solveLinear(G, rhs);
    const residual = (c: number[]): number => integrate((x) => (x - c.reduce((s, ck, k) => s + ck * basis[k](x), 0)) ** 2);
    const p4 = residual(coef);
    const rand = seededRandom(2026_11_10);
    for (let t = 0; t < 200; t++) {
      const c = coef.map((v) => v + (rand() - 0.5) * 0.2);
      if (residual(c) < p4 - 1e-9) throw new Error('p4：扰动以后积分反而更小');
    }

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
