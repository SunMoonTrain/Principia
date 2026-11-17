// 独立验算 math.calculus.concavity 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.concavity.ts
import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { convexityCounterexample, extremumKind, roundTo } from './math.calculus._calc.ts';
import { Jet } from './math.calculus._jet.ts';

/** 多项式 Σ c_k x^k 在 x0 处的 k 阶导数（用 Jet 按系数算，不做差商）。 */
function polyDerivative(coef: number[], x0: number, k: number): number {
  const x = Jet.variable(x0, k);
  let y = Jet.constant(0, k);
  let p = Jet.constant(1, k);
  for (const c of coef) {
    y = y.add(p.mul(c));
    p = p.mul(x);
  }
  return y.derivative(k);
}

export const verification: Verification = {
  lesson: 'math.calculus.concavity',
  notes: {
    p1: '用 Jet 算 f″，在 [−10, 10] 上求根；再按定义（中点凸）检查左侧一段凹、右侧一段凸，确认是拐点，取 (x0, f(x0))。',
    p2: '用 Jet 算 f′、f″，f′ 的零点里取 f″ < 0 的那个，再用邻域取样确认是极大值点，取函数值。',
    p3: '「f(1) = 3、f″(1) = 0」对 (a, b) 是一次的：在三组 (a, b) 上用 Jet 算出两个条件，解方程组；再按定义确认 x = 1 两侧一凹一凸。',
    p4: '按定义在 [0.01, 20] 的 401 个格点上检查任意两点的中点凸性：e^{−x}、x ln x 没有反例；ln x、sin x 找得到反例。',
  },
  compute() {
    const c1 = [2, 9, -6, 1];
    const f1 = (x: number) => c1.reduce((s, c, k) => s + c * x ** k, 0);
    const r1 = rootsOf((x) => polyDerivative(c1, x, 2), -10, 10, 2001).map((r) => roundTo(r, 9));
    if (r1.length !== 1) throw new Error(`p1：f″ 的零点不是一个：${r1}`);
    const x1 = r1[0];
    const leftConcave = convexityCounterexample((x) => -f1(x), x1 - 1, x1) === null && convexityCounterexample(f1, x1 - 1, x1) !== null;
    const rightConvex = convexityCounterexample(f1, x1, x1 + 1) === null && convexityCounterexample((x) => -f1(x), x1, x1 + 1) !== null;
    if (!(leftConcave && rightConvex)) throw new Error('p1：两侧不是一凹一凸');

    const c2 = [1, -9, -3, 1];
    const f2 = (x: number) => c2.reduce((s, c, k) => s + c * x ** k, 0);
    const crit = rootsOf((x) => polyDerivative(c2, x, 1), -10, 10, 2001);
    const maxima = crit.filter((x) => polyDerivative(c2, x, 2) < 0);
    if (maxima.length !== 1 || extremumKind(f2, maxima[0]) !== 'max') throw new Error('p2：极大值点不是恰好一个');
    const p2 = f2(maxima[0]);

    const cond = (a: number, b: number): [number, number] => {
      const coef = [0, 0, b, a];
      return [polyDerivative(coef, 1, 0) - 3, polyDerivative(coef, 1, 2)];
    };
    const k0 = cond(0, 0);
    const ka = cond(1, 0).map((v, i) => v - k0[i]);
    const kb = cond(0, 1).map((v, i) => v - k0[i]);
    const det = ka[0] * kb[1] - ka[1] * kb[0];
    const a = roundTo((-k0[0] * kb[1] + k0[1] * kb[0]) / det, 9);
    const b = roundTo((-ka[0] * k0[1] + ka[1] * k0[0]) / det, 9);
    const f3 = (x: number) => a * x ** 3 + b * x * x;
    const sideA = convexityCounterexample(f3, 0, 1) === null;
    const sideB = convexityCounterexample((x) => -f3(x), 1, 2) === null;
    const sideC = convexityCounterexample((x) => -f3(x), 0, 1) === null;
    const sideD = convexityCounterexample(f3, 1, 2) === null;
    if (!((sideA && sideB) || (sideC && sideD))) throw new Error('p3：x = 1 两侧不是一凹一凸');

    const fs4: ((x: number) => number)[] = [(x) => Math.exp(-x), (x) => Math.log(x), (x) => x * Math.log(x), (x) => Math.sin(x)];
    const p4 = fs4.flatMap((f, i) => (convexityCounterexample(f, 0.01, 20) === null ? [i + 1] : []));

    return {
      p1: { type: 'tuple', value: [x1, f1(x1)] },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: [a, b] },
      p4: { type: 'choice', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
