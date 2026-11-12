// 独立验算 math.vector-calculus.extrema 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.extrema.ts
// 驻点用牛顿法解「数值梯度 = 0」，从一片网格的初值出发找全；分类不用二阶导数判别法，在驻点周围的小圆上看函数值比驻点处大还是小。
// p4 的最值：区域内部在细网格上找、再用黄金分割法细化，边界用参数 θ 搜，两边比较。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { argMin, grad, newton, onCircle, type Fn, type Vec } from './math.vector-calculus._vc.ts';

/** 驻点周围小圆上的函数值：都大 → 1（极小），都小 → 2（极大），有大有小 → 3（不是极值点），否则 4。 */
function kind(f: Fn, p: Vec): number {
  const f0 = f(p);
  const kinds = [1e-2, 1e-3].map((rho) => {
    const v = onCircle(f, p, rho).map((x) => x - f0);
    if (v.every((d) => d > 0)) return 1;
    if (v.every((d) => d < 0)) return 2;
    if (v.some((d) => d > 0) && v.some((d) => d < 0)) return 3;
    return 4;
  });
  if (kinds[0] !== kinds[1]) throw new Error('两个半径上的判断不一致');
  return kinds[0];
}

/** 从 [−3,3]² 上的网格出发找全部驻点（去重）。 */
function stationary(f: Fn): Vec[] {
  const found: Vec[] = [];
  for (let i = -6; i <= 6; i++)
    for (let j = -6; j <= 6; j++) {
      const p = newton((x) => grad(f, x), [i / 2 + 0.013, j / 2 - 0.007]);
      if (!p.every(Number.isFinite) || Math.max(...grad(f, p).map(Math.abs)) > 1e-7) continue;
      if (!found.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 1e-6)) found.push(p);
    }
  return found;
}

export const verification: Verification = {
  lesson: 'math.vector-calculus.extrema',
  notes: {
    p1: '从网格上各点出发，牛顿法解数值梯度为 0，只得到一个驻点。',
    p2: '在原点周围半径 10⁻²、10⁻³ 的圆上各取 3600 个点：函数值有比 0 大的也有比 0 小的，不是极值点，即鞍点（选项 3）。',
    p3: '网格初值加牛顿法找全驻点，小圆上看哪些是极小点，取那里的函数值。',
    p4: '内部：在步长 0.01 的网格上找最大、最小的点，再用黄金分割法沿 x、y 交替细化；边界 x = 2cos θ、y = 2sin θ：θ 每 0.1° 取一点，再细化。两边比较。',
  },
  compute() {
    // p1
    const f1: Fn = ([x, y]) => x * x + y * y - 4 * x + 6 * y;
    const s1 = stationary(f1);
    if (s1.length !== 1) throw new Error(`p1：驻点有 ${s1.length} 个`);
    const p1 = s1[0];

    // p2
    const p2 = [kind(([x, y]) => x * x - 3 * x * y + y * y, [0, 0])];

    // p3
    const f3: Fn = ([x, y]) => x ** 3 + y ** 3 - 3 * x * y;
    const mins = stationary(f3).filter((p) => kind(f3, p) === 1);
    if (mins.length !== 1) throw new Error(`p3：局部极小点有 ${mins.length} 个`);
    const p3 = f3(mins[0]);

    // p4
    const f4: Fn = ([x, y]) => x * x + y * y - 2 * x;
    const inside = ([x, y]: Vec): boolean => x * x + y * y <= 4;
    const refine = (p: Vec, sign: number): Vec => {
      let [x, y] = p;
      for (let k = 0; k < 20; k++) {
        const ylim = Math.sqrt(Math.max(0, 4 - x * x));
        y = argMin((t) => sign * f4([x, t]), Math.max(-ylim, y - 0.02), Math.min(ylim, y + 0.02));
        const xlim = Math.sqrt(Math.max(0, 4 - y * y));
        x = argMin((t) => sign * f4([t, y]), Math.max(-xlim, x - 0.02), Math.min(xlim, x + 0.02));
      }
      return [x, y];
    };
    let best = { max: -Infinity, min: Infinity, pmax: [0, 0], pmin: [0, 0] };
    for (let i = -200; i <= 200; i++)
      for (let j = -200; j <= 200; j++) {
        const p = [i / 100, j / 100];
        if (!inside(p)) continue;
        const v = f4(p);
        if (v > best.max) best = { ...best, max: v, pmax: p };
        if (v < best.min) best = { ...best, min: v, pmin: p };
      }
    const interiorMax = f4(refine(best.pmax, -1));
    const interiorMin = f4(refine(best.pmin, 1));
    const onEdge = (th: number): number => f4([2 * Math.cos(th), 2 * Math.sin(th)]);
    const step = Math.PI / 1800;
    let kMax = 0;
    let kMin = 0;
    for (let k = 0; k < 3600; k++) {
      if (onEdge(k * step) > onEdge(kMax * step)) kMax = k;
      if (onEdge(k * step) < onEdge(kMin * step)) kMin = k;
    }
    const edgeMax = onEdge(argMin((th) => -onEdge(th), (kMax - 1) * step, (kMax + 1) * step));
    const edgeMin = onEdge(argMin(onEdge, (kMin - 1) * step, (kMin + 1) * step));
    const p4 = [Math.max(interiorMax, edgeMax), Math.min(interiorMin, edgeMin)];

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
