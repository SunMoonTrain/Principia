// 独立验算 math.linear-algebra.inner-product-spaces 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.inner-product-spaces.ts
// 积分用辛普森公式数值算；p3 不用判别式，直接在单位圆上找 ⟨u,u⟩ 的最小值，看它是不是正数。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { circleMinMax, rng, simpson, type Vec } from './math.linear-algebra._la.ts';

export const verification: Verification = {
  lesson: 'math.linear-algebra.inner-product-spaces',
  notes: {
    p1: '辛普森公式数值积分 ∫₀¹ x·x² dx。',
    p2: '按题里的式子直接代入 u = v = (1, −2)。',
    p3: '每个 a：对称、线性由式子的形状保证（另随机取 20 组向量核对）；在单位圆上粗扫再细化，求 ⟨u,u⟩ 的最小值，最小值大于 0 才是内积。',
    p4: '辛普森公式数值算 ⟨f,g⟩、‖f‖²、‖g‖²，再求 ⟨f,g⟩/(‖f‖‖g‖)。',
  },
  compute() {
    // p1
    const p1 = simpson((x) => x * x ** 2, 0, 1);

    // p2
    const ip2 = (u: Vec, v: Vec): number => 2 * u[0] * v[0] + 3 * u[1] * v[1];
    const p2 = ip2([1, -2], [1, -2]);

    // p3
    const options = [0, 1.5, 2, -1, -2.5];
    const rand = rng(12);
    const p3: number[] = [];
    options.forEach((a, k) => {
      const ip = (u: Vec, v: Vec): number => u[0] * v[0] + a * (u[0] * v[1] + u[1] * v[0]) + 4 * u[1] * v[1];
      for (let t = 0; t < 20; t++) {
        const u = [rand() * 4 - 2, rand() * 4 - 2];
        const v = [rand() * 4 - 2, rand() * 4 - 2];
        const w = [rand() * 4 - 2, rand() * 4 - 2];
        const c = rand() * 4 - 2;
        if (Math.abs(ip(u, v) - ip(v, u)) > 1e-12) throw new Error('p3：不对称');
        const lhs = ip([u[0] + c * w[0], u[1] + c * w[1]], v);
        if (Math.abs(lhs - ip(u, v) - c * ip(w, v)) > 1e-12) throw new Error('p3：不线性');
      }
      const [min] = circleMinMax((u) => ip(u, u));
      if (min > 1e-7) p3.push(k + 1);
    });

    // p4
    const f = (x: number): number => 1 + x;
    const g = (x: number): number => 1 - x;
    const fg = simpson((x) => f(x) * g(x), -1, 1);
    const ff = simpson((x) => f(x) ** 2, -1, 1);
    const gg = simpson((x) => g(x) ** 2, -1, 1);
    const p4 = fg / Math.sqrt(ff * gg);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'choice', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
