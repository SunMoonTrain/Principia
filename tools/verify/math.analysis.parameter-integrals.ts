// 独立验算 math.analysis.parameter-integrals 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.parameter-integrals.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { adaptiveSimpson, gaussLegendre, richardson } from './math.analysis._numeric.ts';

export const verification: Verification = {
  lesson: 'math.analysis.parameter-integrals',
  notes: {
    p1: 'F(y) 用自适应辛普森公式算（x = 0 处取 f(0, y) = y）；F′(π/3) 用对称差商对 h = 1/(100·2ⁱ) 做 Richardson 外推。',
    p2: '对 y = 1/(100·2ⁱ) 算积分（自适应辛普森），再对 y → 0 做 Richardson 外推。',
    p3: '自适应辛普森公式积分到 x = 12（余下的小于 e⁻²⁸⁸）。',
    p4:
      '内层积分用分段高斯-勒让德求积（每段 20 点）：被积函数的尺度是 x，分段点取 0、x·2⁻²⁰…x/2、x、2x、4x…直到 1，按几何级数加密；' +
      '外层在 [0, 1] 上分 2⁻³⁰…1/2、1 几何加密的段，同样求积（节点都不取 0）。',
  },
  compute() {
    // p1
    const F = (y: number): number => adaptiveSimpson((x) => (x === 0 ? y : Math.sin(x * y) / x), 0, 1, 1e-14);
    const p1 = richardson((k) => (F(Math.PI / 3 + 1 / k) - F(Math.PI / 3 - 1 / k)) * (k / 2), 100, 4);

    // p2
    const I = (y: number): number => adaptiveSimpson((x) => 1 / (1 + x * x + y * y), 0, 2, 1e-14);
    const p2 = richardson((k) => I(1 / k), 100, 4);

    // p3
    const p3 = adaptiveSimpson((x) => x ** 4 * Math.exp(-2 * x * x), 0, 12, 1e-14);

    // p4：两个累次积分
    const f = (x: number, y: number): number => (x * x - y * y) / (x * x + y * y) ** 2;
    /** [0, 1] 的分段点：在尺度 s 附近按 2 倍几何加密（往小到 s·2⁻²⁰，往大到 1）。 */
    const scaled = (s: number): number[] => {
      const pts = new Set<number>([0, 1]);
      for (let k = -20; k <= 40; k++) {
        const p = s * 2 ** k;
        if (p > 0 && p < 1) pts.add(p);
      }
      return [...pts].sort((p, q) => p - q);
    };
    const outer = [0, ...Array.from({ length: 30 }, (_, k) => 2 ** (k - 30)), 1];
    const I1 = gaussLegendre((x) => gaussLegendre((y) => f(x, y), scaled(x)), outer);
    const I2 = gaussLegendre((y) => gaussLegendre((x) => f(x, y), scaled(y)), outer);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: [I1, I2] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
