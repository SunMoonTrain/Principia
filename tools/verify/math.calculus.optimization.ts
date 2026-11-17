// 独立验算 math.calculus.optimization 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.optimization.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { maxOn } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.optimization',
  notes: {
    p1: '在 [−1, 2] 上 2 万等分的格点里找最大值，再在最好的格点两侧用黄金分割细化（不用导数）。',
    p2: '同样在 [1, 4] 上对 −f 求最大值，得 f 的最小值。',
    p3: '设垂直于墙的两边各长 x m，平行于墙的一边长 120 − 2x m，0 < x < 60；面积 x(120 − 2x) 在 (0, 60) 上数值求最大值。最大值点在内部，取得到（例子：x 就取那个点）。',
    p4: '曲线上的点 (x, √x)，x ≥ 0；距离 √((x − 3)² + x) 在 [0, 20] 上对相反数求最大值（x > 20 时距离已超过 17，不会更短）。',
  },
  compute() {
    const p1 = maxOn((x) => x ** 4 - 2 * x * x, -1, 2).value;
    const p2 = -maxOn((x) => -(x * x + 16 / x), 1, 4).value;
    const best3 = maxOn((x) => x * (120 - 2 * x), 0, 60);
    if (!(best3.x > 0.01 && best3.x < 59.99)) throw new Error('p3：最大值点落在端点，菜地退化');
    const p4 = -maxOn((x) => -Math.hypot(x - 3, Math.sqrt(x)), 0, 20).value;
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: best3.value },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
