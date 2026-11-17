// 独立验算 math.calculus.area-between-curves 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.area-between-curves.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { bisect, integrate } from './math.calculus._calc.ts';

/** 区间上逐点检查 g ≥ 0（容许舍入），确认「上面的减下面的」没有取反。 */
function assertNonNegative(g: (x: number) => number, a: number, b: number, what: string) {
  for (let i = 0; i <= 2000; i++) {
    const x = a + ((b - a) * i) / 2000;
    if (g(x) < -1e-12) throw new Error(`${what}：在 x = ${x} 处上下颠倒`);
  }
}

export const verification: Verification = {
  lesson: 'math.calculus.area-between-curves',
  notes: {
    p1: '二分法求 x² = x + 2 的两个交点，检查其间直线在上，再数值积分 (x + 2 − x²)。',
    p2: '二分法求 sin x 在 (0, 2π) 里的零点，分两段数值积分 |sin x|。',
    p3: '二分法求三个交点（1/x = 2、1/x = x、x = 2），竖着切分两段数值积分；再横着切 ∫₁²(y − 1/y)dy 核对，两者一致才取。',
    p4: '二分法求 sin x = cos x 在 (0, π) 里的交点，分两段数值积分 |sin x − cos x|。',
  },
  compute() {
    const q = (x: number) => x + 2 - x * x;
    const r1 = bisect(q, -2.5, 0.5);
    const r2 = bisect(q, 0.5, 3);
    assertNonNegative(q, r1, r2, 'p1');
    const p1 = integrate(q, r1, r2);

    const z = bisect(Math.sin, 3, 3.3);
    const p2 = integrate((x) => Math.abs(Math.sin(x)), 0, z) + integrate((x) => Math.abs(Math.sin(x)), z, 2 * Math.PI);

    const a = bisect((x) => 1 / x - 2, 0.1, 1);
    const b = bisect((x) => 1 / x - x, 0.5, 1.5);
    const c = bisect((x) => x - 2, 1.5, 2.5);
    assertNonNegative((x) => 2 - 1 / x, a, b, 'p3 左段');
    assertNonNegative((x) => 2 - x, b, c, 'p3 右段');
    const vertical = integrate((x) => 2 - 1 / x, a, b) + integrate((x) => 2 - x, b, c);
    const horizontal = integrate((y) => y - 1 / y, 1, 2);
    if (Math.abs(vertical - horizontal) > 1e-10) throw new Error(`p3：竖切 ${vertical} 和横切 ${horizontal} 不一致`);

    const m = bisect((x) => Math.sin(x) - Math.cos(x), 0.5, 1);
    const d = (x: number) => Math.abs(Math.sin(x) - Math.cos(x));
    const p4 = integrate(d, 0, m) + integrate(d, m, Math.PI);
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: vertical },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
