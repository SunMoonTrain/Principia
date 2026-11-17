// 独立验算 math.calculus.volumes 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.volumes.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { integrate } from './math.calculus._calc.ts';

function agree(a: number, b: number, what: string) {
  if (Math.abs(a - b) > 1e-10 * Math.max(1, Math.abs(a))) throw new Error(`${what}：两种切法不一致 ${a}、${b}`);
}

export const verification: Verification = {
  lesson: 'math.calculus.volumes',
  notes: {
    p1: '圆盘法 π∫₀⁴(√x)²dx 和柱壳法（绕 x 轴，按 y 切）2π∫₀²y(4 − y²)dy 各做数值积分，一致才取。',
    p2: '柱壳法 2π∫₀¹x·x²dx 和垫圈法（按 y 切，外半径 1、内半径 √y）π∫₀¹(1 − y)dy 各做数值积分，一致才取。',
    p3: '垫圈法 π∫₀¹(x² − x⁴)dx 和柱壳法（绕 x 轴，按 y 切，宽 √y − y）2π∫₀¹y(√y − y)dy 各做数值积分，一致才取。',
    p4: '截面是边长 1 − x² 的正方形，数值积分 ∫₋₁¹(1 − x²)²dx；再按 y 切（y 处的薄片是 x ∈ [−√y, √y]、高 1 − x² 的一块，面积 ∫(1 − x²)dx）核对。',
  },
  compute() {
    const p1 = Math.PI * integrate((x) => x, 0, 4);
    agree(p1, 2 * Math.PI * integrate((y) => y * (4 - y * y), 0, 2), 'p1');

    const p2 = 2 * Math.PI * integrate((x) => x * x * x, 0, 1);
    agree(p2, Math.PI * integrate((y) => 1 - y, 0, 1), 'p2');

    const p3 = Math.PI * integrate((x) => x * x - x ** 4, 0, 1);
    agree(p3, 2 * Math.PI * integrate((y) => y * (Math.sqrt(y) - y), 0, 1), 'p3');

    const p4 = integrate((x) => (1 - x * x) ** 2, -1, 1);
    // 按 y（底面上的纵坐标）切：y 处垂直于 y 轴的薄片，x 从 −√y 到 √y，每个 x 处立体的高是 1 − x²
    const byY = integrate((y) => integrate((x) => 1 - x * x, -Math.sqrt(y), Math.sqrt(y)), 0, 1);
    agree(p4, byY, 'p4');
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
