// 独立验算 math.calculus.polar-area 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.polar-area.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect, sweptArea } from './math.calculus._calc.ts';

function done(r: { value: number; converged: boolean }, what: string): number {
  if (!r.converged) throw new Error(`${what}：外推没有收敛`);
  return r.value;
}

export const verification: Verification = {
  lesson: 'math.calculus.polar-area',
  notes: {
    p1: '依次填 x、y：直接按 x = r cos θ、y = r sin θ 算。',
    p2: '向径沿螺线 (θ cos θ, θ sin θ) 从 θ = 0 扫到 π，用内接折线和原点连成的三角形求和再外推（sweptArea），不用 ½∫r²dθ。',
    p3: '向径沿 r = cos 2θ 从 −π/4 扫到 π/4（这一段 r ≥ 0），三角形求和外推（sweptArea）。',
    p4: '二分法求两曲线交点 θ = ±π/2 附近（1 = 1 − cos θ），在 (−π/2, π/2) 上单位圆扫过的面积减去心形线扫过的面积（sweptArea）；再用 2000×2000 的网格数点粗核（差小于 10⁻²）。',
  },
  compute() {
    const p1: [number, number] = [2 * Math.cos((2 * Math.PI) / 3), 2 * Math.sin((2 * Math.PI) / 3)];

    const p2 = done(sweptArea((t) => t * Math.cos(t), (t) => t * Math.sin(t), 0, Math.PI), 'p2');

    const r3 = (t: number) => Math.cos(2 * t);
    const p3 = done(sweptArea((t) => r3(t) * Math.cos(t), (t) => r3(t) * Math.sin(t), -Math.PI / 4, Math.PI / 4), 'p3');

    const a = bisect((t) => 1 - (1 - Math.cos(t)), 1, 2);
    const circle = done(sweptArea(Math.cos, Math.sin, -a, a), 'p4 圆');
    const card = (t: number) => 1 - Math.cos(t);
    const cardioid = done(sweptArea((t) => card(t) * Math.cos(t), (t) => card(t) * Math.sin(t), -a, a), 'p4 心形线');
    const p4 = circle - cardioid;
    // 粗核：数单位圆里、心形线外（r > 1 − cos θ）的网格点
    const N = 2000;
    let inside = 0;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const x = -1 + (2 * (i + 0.5)) / N;
        const y = -1 + (2 * (j + 0.5)) / N;
        const r = Math.hypot(x, y);
        if (r < 1 && r > 1 - x / r) inside++;
      }
    }
    const grid = (inside * 4) / (N * N);
    if (Math.abs(grid - p4) > 1e-2) throw new Error(`p4：网格数点 ${grid} 和扫过面积之差 ${p4} 相差太大`);
    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
