// 独立验算 math.calculus.limits-intuition 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.limits-intuition.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { limitAt, oneSided, roundTo, sideIs } from './math.calculus._calc.ts';

/** 两侧极限都存在且（在误差估计内）等于 L：外推收敛时容差 1e-9 量级，能分开 5 和 5.0001。 */
const limitIs = (f: (x: number) => number, a: number, L: number): boolean => sideIs(oneSided(f, a, -1), L) && sideIs(oneSided(f, a, 1), L);

/** 去心邻域 0 < |x − 2| < δ 里的格点上 f 都落在 (4.9, 5.1) 里的 δ 是否存在（δ 试 10⁻¹ … 10⁻⁸）。 */
function someDeltaWorks(f: (x: number) => number): boolean {
  for (let k = 1; k <= 8; k++) {
    const delta = 10 ** -k;
    let all = true;
    for (let i = 0; i < 20000 && all; i++) {
      const d = (delta * (i + 0.37)) / 20000;
      for (const x of [2 - d, 2 + d]) {
        const v = f(x);
        if (!(v > 4.9 && v < 5.1)) all = false;
      }
    }
    if (all) return true;
  }
  return false;
}

export const verification: Verification = {
  lesson: 'math.calculus.limits-intuition',
  notes: {
    p1: '按分段式子写出 f（x = 2 处取 7），在 2 的两侧分别看去心邻域里的振幅并外推单侧极限，两侧一致就是极限。',
    p2: '逐条在检验例子上找反例：A 用 x + 3 和「x ≠ 2 时为 0、f(2) = 5」；B 用 x + 3、5 + (x − 2)sin(1/(x − 2))、5 + |x − 2|，都令 f(2) = 7；C 用 x + 3、1/(x − 2)、sgn(x − 2) 三对，每对在 x = 2 处取不同的值；D 用 x + 3、5 + 10(x − 2)、5 + (x − 2)sin(1/(x − 2))、5 + 100(x − 2)²，找让去心邻域里函数值都在 (4.9, 5.1) 内的 δ；E 用 x + 3 + sin(10π/(2 − x)) 和 x + 3 + 100(x − 1.9)(x − 1.99)(x − 1.999)，三个给定的值都对得上，左极限却不存在或等于 5.0001。',
    p3: '在 −2 的两侧外推 (x³ + 8)/(x + 2) 的单侧极限。',
    p4: '照题意算 ±0.1、±0.01、±0.001 处的值：±0.001 两处的值夹住极限，四舍五入到三位小数都是同一个数，所以三位小数定得下来；再外推求出极限的精确值来比对（三位小数由题目的容差接住）。',
  },
  compute() {
    // p1
    const f1 = (x: number): number => (x < 2 ? 2 * x + 1 : x === 2 ? 7 : x * x + 1);
    const p1 = limitAt(f1, 2)!;

    // p2
    const p2: number[] = [];
    // A：f(2) = 5 ⇒ 极限是 5？
    const A = [(x: number) => x + 3, (x: number) => (x === 2 ? 5 : 0)].every((f) => {
      if (f(2) !== 5) throw new Error('p2 A：检验例子不满足 f(2) = 5');
      return limitIs(f, 2, 5);
    });
    if (A) p2.push(1);
    // B：两侧极限都是 5、f(2) = 7 ⇒ 极限是 5？
    const Bs = [(x: number) => x + 3, (x: number) => 5 + (x - 2) * Math.sin(1 / (x - 2)), (x: number) => 5 + Math.abs(x - 2)].map(
      (g) => (x: number) => (x === 2 ? 7 : g(x)),
    );
    const B = Bs.every((f) => {
      const hyp = sideIs(oneSided(f, 2, -1), 5) && sideIs(oneSided(f, 2, 1), 5) && f(2) === 7;
      if (!hyp) throw new Error('p2 B：检验例子不满足条件');
      return limitIs(f, 2, 5);
    });
    if (B) p2.push(2);
    // C：x ≠ 2 时 f = g、f(2) ≠ g(2) ⇒ 两个极限同时不存在，或都存在且相等？
    const bases = [(x: number) => x + 3, (x: number) => 1 / (x - 2), (x: number) => Math.sign(x - 2)];
    const C = bases.every((g) => {
      const f = (x: number): number => (x === 2 ? 1 : g(x));
      const h = (x: number): number => (x === 2 ? 9 : g(x));
      const lf = limitAt(f, 2);
      const lh = limitAt(h, 2);
      return (lf === null && lh === null) || (lf !== null && lh !== null && Math.abs(lf - lh) < 1e-9);
    });
    if (C) p2.push(3);
    // D：极限是 5 ⇒ x 足够靠近 2 时 f(x) 都在 4.9 和 5.1 之间？
    const Ds = [(x: number) => x + 3, (x: number) => 5 + 10 * (x - 2), (x: number) => 5 + (x - 2) * Math.sin(1 / (x - 2)), (x: number) => 5 + 100 * (x - 2) ** 2];
    const D = Ds.every((f) => {
      if (!limitIs(f, 2, 5)) throw new Error('p2 D：检验例子的极限不是 5');
      return someDeltaWorks(f);
    });
    if (D) p2.push(4);
    // E：f(1.9)、f(1.99)、f(1.999) 依次是 4.9、4.99、4.999 ⇒ 左极限是 5？
    const Es = [(x: number) => x + 3 + Math.sin((10 * Math.PI) / (2 - x)), (x: number) => x + 3 + 100 * (x - 1.9) * (x - 1.99) * (x - 1.999)];
    const E = Es.every((f) => {
      // 2 − x 在浮点数里不精确，sin(10π/(2 − x)) 在这三点约为 1e-9 而不是 0，容差取 1e-6
      if (![1.9, 1.99, 1.999].every((x) => Math.abs(f(x) - (x + 3)) < 1e-6)) throw new Error('p2 E：检验例子对不上给定的值');
      return sideIs(oneSided(f, 2, -1), 5);
    });
    if (E) p2.push(5);

    // p3
    const p3 = limitAt((x) => (x ** 3 + 8) / (x + 2), -2)!;

    // p4
    const g = (x: number): number => (2 ** x - 1) / x;
    const table = [0.1, 0.01, 0.001].map((x) => [g(-x), g(x)]);
    const [lo, hi] = table[2];
    const L = limitAt(g, 0)!;
    if (!(lo < L && L < hi && roundTo(lo, 3) === roundTo(hi, 3) && roundTo(L, 3) === roundTo(lo, 3))) throw new Error('p4：±0.001 处的值定不出三位小数');
    // 和标准答案比对的是极限的精确值；「保留三位小数」由题目的容差接住（读 problems.yaml 时另外核对容差）
    const p4 = L;

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
