// 独立验算 math.vector-calculus.multivariable-limits 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.multivariable-limits.ts
// 极限存在与否：在以原点为圆心、越来越小的圆上取 3600 个点，看函数值和一个候选值的最大偏差是否趋于 0；不用夹逼或换元。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { onCircle, rng, type Fn } from './math.vector-calculus._vc.ts';

/** 极限存在时返回它：候选值取 x 轴上很近处的值，要求两个半径上的最大偏差都小、并且随半径缩小。 */
function limitAtOrigin(f: Fn): number | null {
  const L = f([1e-7, 0]);
  const dev = (rho: number): number => Math.max(...onCircle(f, [0, 0], rho).map((v) => Math.abs(v - L)));
  const d3 = dev(1e-3);
  const d5 = dev(1e-5);
  return d5 < 1e-4 && d5 < d3 + 1e-12 ? L : null;
}

export const verification: Verification = {
  lesson: 'math.vector-calculus.multivariable-limits',
  notes: {
    p1: '从 20 个随机方向、以越来越小的距离逼近 (1,2)，函数值的离散程度趋于 0，取距离 1e-8 时的平均值。',
    p2: '每个函数在半径 1e-3、1e-5 的圆上各取 3600 个点，和 x 轴上很近处的值比较最大偏差；偏差趋于 0 才算极限存在。',
    p3: '沿 x = 2y² 取 y = 10⁻²…10⁻⁶ 逐个代入，看数值趋于什么。',
    p4: '在半径 1e-4 的圆上取 3600 个点，f 的值都相同（离散程度小于 1e-6），这个值就是使 f 连续的 c。',
  },
  compute() {
    const rand = rng(29);

    // p1
    const f1 = (x: number, y: number): number => (x * x + x * y + y) / (x + y);
    const near: number[] = [];
    for (let k = 0; k < 20; k++) {
      const t = 2 * Math.PI * rand();
      near.push(f1(1 + 1e-8 * Math.cos(t), 2 + 1e-8 * Math.sin(t)));
    }
    const spread1 = Math.max(...near) - Math.min(...near);
    if (spread1 > 1e-6) throw new Error('p1：各方向的值不一致');
    const p1 = near.reduce((s, v) => s + v, 0) / near.length;

    // p2
    const options: Fn[] = [
      ([x, y]) => (x * x * y * y) / (x * x + y * y),
      ([x, y]) => (x * x - y * y) / (x * x + y * y),
      ([x, y]) => (2 * x * y) / (x * x + 2 * y * y),
      ([x, y]) => (x ** 3 + y ** 3) / (x * x + y * y),
      ([x, y]) => (x * x) / (x * x + y * y),
    ];
    const p2 = options.flatMap((f, k) => (limitAtOrigin(f) !== null ? [k + 1] : []));

    // p3
    const f3 = (x: number, y: number): number => (x * y * y) / (x * x + y ** 4);
    const along = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6].map((y) => f3(2 * y * y, y));
    if (Math.abs(along[4] - along[3]) > 1e-9) throw new Error('p3：沿曲线不收敛');
    const p3 = along[4];

    // p4
    const f4: Fn = ([x, y]) => (x * x + y * y) / (Math.sqrt(x * x + y * y + 1) - 1);
    const vals = onCircle(f4, [0, 0], 1e-4);
    if (Math.max(...vals) - Math.min(...vals) > 1e-6) throw new Error('p4：各方向的值不一致');
    const p4 = vals[0];

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
