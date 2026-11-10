// 独立验算 math.ode.autonomous-equations 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.autonomous-equations.ts
// 稳定性不用 f′ 的符号判断，而是从平衡点两侧各偏一点出发数值积分，看解回不回来。

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { argMax, attractsBothSides, rk4 } from './math.ode._numeric.ts';

export const verification: Verification = {
  lesson: 'math.ode.autonomous-equations',
  notes: {
    p1: '在 [−20, 20] 上找 y² − 4y + 3 的零点（粗扫变号再二分）。',
    p2: '找出 y(2 − y) 的零点，从每个零点两侧各偏 10⁻³ 出发积到 t = 50，两侧都回来的才是稳定的。',
    p3:
      '龙格-库塔法从 y = 1.5 积到 t = 10⁴（解靠近 2 时像 1/t 那样慢，这时离极限约 10⁻⁴），确认 y 单调增、停在 2 附近；' +
      '极限取 y(10⁴) 附近 |f| 的最小点，即那里的平衡点（2 是二重根，f 不变号，所以不用找变号的办法）。',
    p4: '龙格-库塔法从 y = 0.5 积到 t = 200（这时离极限远小于 10⁻¹²），再核对它是 f 的零点。',
  },
  compute() {
    // p1
    const p1 = rootsOf((y) => y * y - 4 * y + 3, -20, 20);

    // p2
    const f2 = (y: number): number => y * (2 - y);
    const stable2 = rootsOf(f2, -20, 20).filter((y) => attractsBothSides(f2, y));
    if (stable2.length !== 1) throw new Error('p2：稳定的平衡点不是恰好一个');

    // p3
    const f3 = (y: number): number => (y - 1) * (y - 2) ** 2;
    const yT = rk4((_, y) => f3(y), 0, 1.5, 1e4, 2_000_000);
    const yHalf = rk4((_, y) => f3(y), 0, 1.5, 5e3, 1_000_000);
    if (!(yHalf < yT && yT < 2 && 2 - yT < 1e-3)) throw new Error('p3：解没有单调地停到一个值附近');
    const p3 = argMax((y) => -Math.abs(f3(y)), yT - 0.01, yT + 0.01);

    // p4
    const f4 = (y: number): number => y * (1 - y) - 0.21;
    const p4 = rk4((_, y) => f4(y), 0, 0.5, 200, 200_000);
    if (Math.abs(f4(p4)) > 1e-12) throw new Error('p4：积分的终点不是平衡点');

    return {
      p1: { type: 'set', value: p1 },
      p2: { type: 'number', value: stable2[0] },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
