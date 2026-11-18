// 独立验算 math.complex-analysis.complex-derivative 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.complex-derivative.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { Complex, complexDifferentiableAt, cx, derivativeC, I } from './math.complex-analysis._complex.ts';

/**
 * 集合是不是区域（开、连成一片），只在窗口 [−3, 3]² 里看：
 * 开：给出边界上坐标恰好可以精确表示的点（如 ±1、±i、实轴上的点），其中有一个属于集合就不是开集
 * （这几个集合的每段边界要么整段属于集合、要么整段不属于，取几个点就够；曲线上的一般点在浮点数里落不准，所以不二分去找）；
 * 连成一片：步长 0.05 的网格上，属于集合的格点之间连边，一条边要两端都在集合里、沿边 20 个点都在集合里，
 * 并且每个 boundary 函数沿边不变号（变号说明穿过了边界曲线），再数连通块。
 */
function isDomain(inSet: (z: Complex) => boolean, boundary: ((z: Complex) => number)[], boundaryPoints: Complex[]): boolean {
  const step = 0.05;
  const N = Math.round(6 / step);
  const pt = (i: number, j: number) => cx(-3 + i * step + 1e-3, -3 + j * step + 2e-3);
  if (boundaryPoints.some(inSet)) return false;
  // 连成一片：并查集
  const parent = Array.from({ length: (N + 1) * (N + 1) }, (_, k) => k);
  const find = (k: number): number => (parent[k] === k ? k : (parent[k] = find(parent[k])));
  const idx = (i: number, j: number) => i * (N + 1) + j;
  const edgeOk = (p: Complex, q: Complex) => {
    for (let k = 0; k <= 20; k++) if (!inSet(p.add(q.sub(p).scale(k / 20)))) return false;
    return boundary.every((b) => b(p) * b(q) > 0);
  };
  for (let i = 0; i <= N; i++) {
    for (let j = 0; j <= N; j++) {
      if (!inSet(pt(i, j))) continue;
      if (i < N && inSet(pt(i + 1, j)) && edgeOk(pt(i, j), pt(i + 1, j))) parent[find(idx(i, j))] = find(idx(i + 1, j));
      if (j < N && inSet(pt(i, j + 1)) && edgeOk(pt(i, j), pt(i, j + 1))) parent[find(idx(i, j))] = find(idx(i, j + 1));
    }
  }
  const roots = new Set<number>();
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) if (inSet(pt(i, j))) roots.add(find(idx(i, j)));
  return roots.size === 1;
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.complex-derivative',
  notes: {
    p1: '小圆上的柯西积分求导数（derivativeC），不用求导公式。',
    p2: '在窗口 [−3, 3]² 里按定义查：边界上取几个坐标能精确表示的点，有一个属于集合就不是开集；网格上连边（沿边不穿过边界曲线）数连通块。先拿闭圆盘（不开）、{Re z ≠ 0}（不连通）、去掉原点的平面（是区域）检验判法。',
    p3: '按定义：12 个方向的差商极限（complexDifferentiableAt），相同才取。',
    p4: '小圆上的柯西积分求导数（derivativeC，半径 0.1，离极点 1 有 √2 远）。',
  },
  compute() {
    const p1 = derivativeC((z) => z.mul(z).mul(z).sub(z.scale(2)), I);

    const unit = [cx(1), cx(0, 1), cx(-1), cx(0, -1)];
    const radius2 = [cx(2), cx(0, 2), cx(-2), cx(0, -2)];
    const realAxis = [cx(-2), cx(0), cx(1.5)];
    const imagAxis = [cx(0, -2), cx(0), cx(0, 1.5)];
    const known: [string, (z: Complex) => boolean, ((z: Complex) => number)[], Complex[], boolean][] = [
      ['闭圆盘', (z) => z.abs() <= 1, [(z) => z.abs() - 1], unit, false],
      ['Re z ≠ 0', (z) => z.re !== 0, [(z) => z.re], imagAxis, false],
      ['去掉原点的平面', (z) => z.abs() !== 0, [], [cx(0)], true],
    ];
    for (const [name, s, b, bp, want] of known) if (isDomain(s, b, bp) !== want) throw new Error(`p2：判法在 ${name} 上判错`);
    const options: [(z: Complex) => boolean, ((z: Complex) => number)[], Complex[]][] = [
      [(z) => z.abs() > 1 && z.abs() < 2, [(z) => z.abs() - 1, (z) => z.abs() - 2], [...unit, ...radius2]],
      [(z) => z.re > 0, [(z) => z.re], imagAxis],
      [(z) => z.im >= 0, [(z) => z.im], realAxis],
      [(z) => z.abs() !== 1, [(z) => z.abs() - 1], unit],
    ];
    const p2 = options.map(([s, b, bp], i) => (isDomain(s, b, bp) ? i + 1 : 0)).filter((i) => i > 0);

    const d3 = complexDifferentiableAt((z) => z.mul(z).add(z.scale(3)), cx(1, -1));
    if (!d3.differentiable) throw new Error('p3：各方向的差商极限不一致');
    const p4 = derivativeC((z) => z.add(1).div(z.sub(1)), I);
    return {
      p1: { type: 'tuple', value: [p1.re, p1.im] },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [d3.derivative.re, d3.derivative.im] },
      p4: { type: 'tuple', value: [p4.re, p4.im] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
