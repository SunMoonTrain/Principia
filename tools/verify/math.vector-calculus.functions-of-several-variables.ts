// 独立验算 math.vector-calculus.functions-of-several-variables 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.functions-of-several-variables.ts
// 等值线、等值面的半径和圆心都靠数值求根找出集合上的点，再由这些点定出圆（球），不配方。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect, rng } from './math.vector-calculus._vc.ts';

/** 过三点的圆：圆心和半径。 */
function circleThrough(p: number[], q: number[], r: number[]): [number, number, number] {
  const a = 2 * (q[0] - p[0]);
  const b = 2 * (q[1] - p[1]);
  const c = q[0] ** 2 + q[1] ** 2 - p[0] ** 2 - p[1] ** 2;
  const d = 2 * (r[0] - p[0]);
  const e = 2 * (r[1] - p[1]);
  const f = r[0] ** 2 + r[1] ** 2 - p[0] ** 2 - p[1] ** 2;
  const det = a * e - b * d;
  const cx = (c * e - b * f) / det;
  const cy = (a * f - c * d) / det;
  return [cx, cy, Math.hypot(p[0] - cx, p[1] - cy)];
}

export const verification: Verification = {
  lesson: 'math.vector-calculus.functions-of-several-variables',
  notes: {
    p1: '沿正 x 轴用二分法解 f(r,0) = 4 得 r；再核对 36 个方向上距原点 r 的点都满足 f = 4。',
    p2: '逐个代入，和 f(1,2) 比较。',
    p3: '对几个 x 用二分法解出 f(x,y) = 6 的正的 y，取三个点定出圆，再核对另外 20 个点（含 y 取负的）都在这个圆上。',
    p4: '沿 z 轴用二分法解出等值面 f = 12 的上下两个交点，中点作球心、半距作半径；再随机取 30 个方向，核对离球心这么远的点都满足 f = 12。',
  },
  compute() {
    const rand = rng(13);

    // p1
    const f1 = (x: number, y: number): number => Math.sqrt(25 - x * x - y * y);
    const r1 = bisect((r) => f1(r, 0) - 4, 0, 5);
    for (let k = 0; k < 36; k++) {
      const t = (2 * Math.PI * k) / 36;
      if (Math.abs(f1(r1 * Math.cos(t), r1 * Math.sin(t)) - 4) > 1e-9) throw new Error('p1：不是圆');
    }

    // p2
    const f2 = (x: number, y: number): number => x * x + 2 * y;
    const options: [number, number][] = [
      [-1, 2],
      [2, 1],
      [3, -2],
      [0, 5],
      [Math.sqrt(5), 0],
    ];
    const p2 = options.flatMap(([x, y], k) => (Math.abs(f2(x, y) - f2(1, 2)) < 1e-9 ? [k + 1] : []));

    // p3
    const f3 = (x: number, y: number): number => (x * x + y * y) / x;
    const yOn = (x: number): number => bisect((y) => f3(x, y) - 6, 0, 10);
    const pts = [1, 2.5, 5].map((x) => [x, yOn(x)]);
    const [cx, cy, rad] = circleThrough(pts[0], pts[1], pts[2]);
    for (let k = 0; k < 20; k++) {
      const x = 0.2 + 5.6 * rand();
      const y = (k % 2 === 0 ? 1 : -1) * yOn(x);
      if (Math.abs(Math.hypot(x - cx, y - cy) - rad) > 1e-7) throw new Error('p3：点不在圆上');
    }

    // p4
    const f4 = (x: number, y: number, z: number): number => x * x + y * y + z * z - 4 * z;
    const top = bisect((z) => f4(0, 0, z) - 12, 2, 20);
    const bottom = bisect((z) => f4(0, 0, z) - 12, -20, 2);
    const center = (top + bottom) / 2;
    const r4 = (top - bottom) / 2;
    for (let k = 0; k < 30; k++) {
      const u = [rand() - 0.5, rand() - 0.5, rand() - 0.5];
      const n = Math.hypot(u[0], u[1], u[2]);
      const [x, y, z] = [(u[0] / n) * r4, (u[1] / n) * r4, center + (u[2] / n) * r4];
      if (Math.abs(f4(x, y, z) - 12) > 1e-7) throw new Error('p4：不是球面');
    }

    return {
      p1: { type: 'number', value: r1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [cx, cy, rad] },
      p4: { type: 'number', value: r4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
