// 独立验算 math.calculus.improper-unbounded 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.improper-unbounded.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { convergesByIncrements, integrate, integrateEndpoints, integrateToInfinity, partialIntegralsNearLeft } from './math.calculus._calc.ts';

export const verification: Verification = {
  lesson: 'math.calculus.improper-unbounded',
  notes: {
    p1: 'tanh-sinh 数值积分 ∫₀¹x^(−1/3)dx，取样点不落在瑕点 0 上。',
    p2: '每个瑕点附近算部分积分（被积函数写成到瑕点的距离 u 的函数，u 从 10⁻² 缩到 10⁻¹²），看增量每步平均缩成几分之一（r）：r < 0.6 判收敛（convergesByIncrements）。C 的瑕点 1 在区间内部，两侧都要收敛。先拿已知的 u^(−1/2)（收敛）、1/u（发散）检验判法。',
    p3: '在 1 处拆开：∫₀¹ 用 tanh-sinh（瑕点 0 不取样），∫₁^{+∞} 用 integrateToInfinity，相加。',
    p4: 'integrateEndpoints：被积函数用到左端点的距离 dl 写成 x/√dl，避开 x − 1 的舍入。',
  },
  compute() {
    const p1 = integrate((x) => 1 / Math.cbrt(x), 0, 1);

    const near = (g: (u: number) => number, len: number) => convergesByIncrements(partialIntegralsNearLeft(g, 0, len)).converges;
    if (!near((u) => 1 / Math.sqrt(u), 1) || near((u) => 1 / u, 1)) throw new Error('p2：判法在已知例子上判错');
    const options: boolean[] = [
      near((u) => 1 / (u * Math.sqrt(u)), 1), // A：瑕点 0，u = x
      near((u) => 1 / Math.sqrt(u), 1), // B：瑕点 1，u = 1 − x，被积函数 1/√u
      near((u) => 1 / Math.cbrt(u * u), 1) && near((u) => 1 / Math.cbrt(u * u), 2), // C：瑕点 1，左边 u = 1 − x ∈ (0, 1]，右边 u = x − 1 ∈ (0, 2]
      near((u) => 1 / (Math.sqrt(u) + u * u), 1), // D：瑕点 0，u = x
    ];
    const p2 = options.map((ok, i) => (ok ? i + 1 : 0)).filter((i) => i > 0);

    const f3 = (x: number) => Math.exp(-3 * Math.sqrt(x)) / Math.sqrt(x);
    const p3 = integrate(f3, 0, 1) + integrateToInfinity(f3, 1);
    const p4 = integrateEndpoints((x, dl) => x / Math.sqrt(dl), 1, 2);
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
