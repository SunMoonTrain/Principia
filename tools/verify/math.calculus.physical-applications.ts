// 独立验算 math.calculus.physical-applications 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.physical-applications.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { integrate } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.physical-applications',
  notes: {
    p1: '拉力 F = 200x（N），数值积分 ∫_{0.1}^{0.3} 200x dx。',
    p2: '依次填质量和质心：m = ∫₀²(1 + x)dx，x_C = ∫₀² x(1 + x)dx / m，都数值积分。',
    p3: '按离碗口的深度 y 分层：截面是半径 √(1 − y²) 的圆，这一层提升 y，W = ρg∫₀¹π(1 − y²)·y dy（ρ = 1000、g = 9.8）。再用「总重乘质心到碗口的距离」核对：质心深度由 ∫y·π(1 − y²)dy / ∫π(1 − y²)dy 数值算出。',
    p4: '按深度 h 切成水平窄带，宽 2 m：F = ∫₁³ ρg·h·2 dh（ρ = 1000、g = 9.8）；再用「形心处的压强乘面积」9800 × 2 × 4 核对。',
  },
  compute() {
    const rho = 1000;
    const g = 9.8;
    const p1 = integrate((x) => 200 * x, 0.1, 0.3);

    const m = integrate((x) => 1 + x, 0, 2);
    const xc = integrate((x) => x * (1 + x), 0, 2) / m;

    const area = (y: number) => Math.PI * (1 - y * y);
    const p3 = rho * g * integrate((y) => area(y) * y, 0, 1);
    const vol = integrate(area, 0, 1);
    const depth = integrate((y) => y * area(y), 0, 1) / vol;
    if (Math.abs(rho * vol * g * depth - p3) > 1e-9 * p3) throw new Error('p3：两种算法不一致');

    const p4 = integrate((h) => rho * g * h * 2, 1, 3);
    if (Math.abs(p4 - rho * g * 2 * (2 * 2)) > 1e-9 * p4) throw new Error('p4：和形心处压强乘面积不一致');
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'tuple', value: [m, xc] },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
