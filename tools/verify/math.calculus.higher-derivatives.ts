// 独立验算 math.calculus.higher-derivatives 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.higher-derivatives.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { derivativeAt } from './math.calculus._calc.ts';
import { Jet } from './math.calculus._jet.ts';

export const verification: Verification = {
  lesson: 'math.calculus.higher-derivatives',
  notes: {
    p1: '用泰勒展开式算术（_jet.ts）在 x = 2 处展开到 2 阶，取二阶导数；另用差商的差商核对。',
    p2: '速度按定义外推 s 的差商；加速度用泰勒展开式算术取 s 在 t = 3 处的二阶导数。',
    p3: '泰勒展开式算术：x 在 0 处展开到 10 阶，算 cos 2x 的系数，取 10 阶导数（不用求导公式的规律）。',
    p4: '泰勒展开式算术：x² · exp(−x) 在 0 处展开到 8 阶，取 8 阶导数。',
  },
  compute() {
    const f1 = (x: Jet): Jet => x.mul(x).mul(x).mul(x).sub(x.mul(x).mul(x).mul(3)).add(x);
    const p1 = f1(Jet.variable(2, 2)).derivative(2);
    const plain1 = (x: number): number => x ** 4 - 3 * x ** 3 + x;
    if (Math.abs(derivativeAt((t) => derivativeAt(plain1, t), 2) - p1) > 1e-4) throw new Error('p1：两种算法不一致');

    const s = (t: number): number => t ** 3 - 6 * t * t + 9 * t;
    const sJet = (t: Jet): Jet => t.mul(t).mul(t).sub(t.mul(t).mul(6)).add(t.mul(9));
    const p2 = [derivativeAt(s, 3), sJet(Jet.variable(3, 2)).derivative(2)];

    const p3 = Jet.variable(0, 10).mul(2).cos().derivative(10);
    const x4 = Jet.variable(0, 8);
    const p4 = x4.mul(x4).mul(x4.neg().exp()).derivative(8);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
