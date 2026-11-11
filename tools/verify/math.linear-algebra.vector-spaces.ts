// 独立验算 math.linear-algebra.vector-spaces 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.vector-spaces.ts
// 多项式的坐标用「在几个点上取值」解出来，不比较系数；是不是向量空间随机取元素检验；维数用正交补数个数。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { orthogonalComplement, rng, solve, spanDim, triple } from './math.linear-algebra._la.ts';

/** 多项式按系数 [a0, a1, a2, …] 表示，在 x 处取值。 */
const evalPoly = (p: number[], x: number): number => p.reduce((s, a, i) => s + a * x ** i, 0);

/** 随机检验一个集合是不是子空间：含零元，加法、数乘封闭。 */
function closedUnder<T>(o: { zero: T; has: (t: T) => boolean; sample: () => T; add: (a: T, b: T) => T; mul: (c: number, a: T) => T }, rand: () => number): boolean {
  if (!o.has(o.zero)) return false;
  for (let trial = 0; trial < 200; trial++) {
    const a = o.sample();
    const b = o.sample();
    if (!o.has(a) || !o.has(b)) throw new Error('p2：取的元素不在集合里');
    if (!o.has(o.add(a, b)) || !o.has(o.mul(rand() * 6 - 3, a))) return false;
  }
  return true;
}

export const verification: Verification = {
  lesson: 'math.linear-algebra.vector-spaces',
  notes: {
    p1: '在 x = 0、1、2 三点取值：基里三个多项式的值排成方程组，解出组合系数；再在 x = −1、3、0.5 核对两边相等。',
    p2: '每个集合随机取 200 组元素和数，检验含零元、加法和数乘封闭。多项式按系数判断（选项 1 看 x² 的系数是否等于另两个之和，选项 2 看系数是否都是整数），函数直接算 f(1)、f(0)，「处处 |f| ≤ 1」在 [−10, 10] 的 401 个点上查。',
    p3: 'p(1) = a0 + a1 + a2 + a3 = 0，W 就是 R⁴ 里和 (1, 1, 1, 1) 正交的向量：用正交补数个数；再核对 x − 1、x² − 1、x³ − 1 在 W 里并且线性无关。',
    p4: '三个多项式的系数向量混合积为零时相关：对 k 找零点，核对只有一个，并且正交化后只剩 2 个向量。',
  },
  compute() {
    // p1
    const basis = [[1], [1, 1], [1, 1, 1]];
    const p = [3, 2, -1];
    const xs = [0, 1, 2];
    const p1 = solve(
      xs.map((x) => basis.map((q) => evalPoly(q, x))),
      xs.map((x) => evalPoly(p, x)),
    );
    for (const x of [-1, 3, 0.5]) {
      if (Math.abs(basis.reduce((s, q, i) => s + p1[i] * evalPoly(q, x), 0) - evalPoly(p, x)) > 1e-9) throw new Error('p1：不是恒等式');
    }

    // p2
    const rand = rng(30);
    const coef = (n: number): number[] => Array.from({ length: n }, () => rand() * 4 - 2);
    const addPoly = (a: number[], b: number[]): number[] => a.map((x, i) => x + b[i]);
    const mulPoly = (c: number, a: number[]): number[] => a.map((x) => c * x);
    type Fn = (x: number) => number;
    const randomFn = (): Fn => {
      const [a, b, c] = coef(3);
      return (x) => a * Math.sin(x) + b * x * x + c * Math.exp(x / 3);
    };
    const fnOps = { add: (f: Fn, g: Fn): Fn => (x) => f(x) + g(x), mul: (c: number, f: Fn): Fn => (x) => c * f(x) };
    const isInt = (x: number): boolean => Math.abs(x - Math.round(x)) < 1e-9;
    const verdicts = [
      closedUnder(
        {
          zero: [0, 0, 0],
          has: (q) => Math.abs(q[2] - q[0] - q[1]) < 1e-9,
          sample: () => {
            const [a, b] = coef(2);
            return [a, b, a + b];
          },
          add: addPoly,
          mul: mulPoly,
        },
        rand,
      ),
      closedUnder({ zero: [0, 0, 0, 0], has: (q) => q.every(isInt), sample: () => coef(4).map((x) => Math.round(5 * x)), add: addPoly, mul: mulPoly }, rand),
      closedUnder<Fn>(
        {
          zero: () => 0,
          has: (f) => Math.abs(f(1)) < 1e-9,
          sample: () => {
            const g = randomFn();
            return (x) => (x - 1) * g(x);
          },
          ...fnOps,
        },
        rand,
      ),
      closedUnder<Fn>(
        {
          zero: () => 0,
          has: (f) => Math.abs(f(0) - 1) < 1e-9,
          sample: () => {
            const g = randomFn();
            return (x) => 1 + x * g(x);
          },
          ...fnOps,
        },
        rand,
      ),
      closedUnder<Fn>(
        {
          zero: () => 0,
          // 「处处 |f| ≤ 1」在 [−10, 10] 上 401 个点检查
          has: (f) => Array.from({ length: 401 }, (_, i) => -10 + i / 20).every((x) => Math.abs(f(x)) <= 1 + 1e-12),
          sample: () => {
            const [a, b, c] = coef(3);
            return (x) => (a / 2) * Math.sin(b * x + c);
          },
          ...fnOps,
        },
        rand,
      ),
    ];
    const p2 =verdicts.flatMap((ok, i) => (ok ? [i + 1] : []));

    // p3
    const p3 = orthogonalComplement([[1, 1, 1, 1]], 4).length;
    const wBasis = [
      [-1, 1, 0, 0],
      [-1, 0, 1, 0],
      [-1, 0, 0, 1],
    ];
    if (wBasis.some((q) => Math.abs(evalPoly(q, 1)) > 1e-12) || spanDim(wBasis) !== 3) throw new Error('p3：x − 1、x² − 1、x³ − 1 不对');

    // p4
    const ks = rootsOf((k) => triple([1, 1, 0], [0, 1, 1], [k, 0, 1]), -10.0123, 9.9871, 4000);
    if (ks.length !== 1) throw new Error('p4：k 不唯一');
    if (spanDim([
      [1, 1, 0],
      [0, 1, 1],
      [ks[0], 0, 1],
    ]) !== 2) throw new Error('p4：不相关');

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: ks[0] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
