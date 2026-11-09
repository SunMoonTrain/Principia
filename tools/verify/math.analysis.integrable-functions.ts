// 独立验算 math.analysis.integrable-functions 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.analysis.integrable-functions.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { darboux, grid, seededRandom } from './math.analysis._numeric.ts';

/** sin t 在 [t1, t2] 上的最大值、最小值（精确：看区间里有没有 π/2 + 2kπ、−π/2 + 2kπ）。 */
function sinRange(t1: number, t2: number): [number, number] {
  if (t2 - t1 >= 2 * Math.PI) return [1, -1];
  const hasPeak = Math.floor((t2 - Math.PI / 2) / (2 * Math.PI)) >= Math.ceil((t1 - Math.PI / 2) / (2 * Math.PI));
  const hasTrough = Math.floor((t2 + Math.PI / 2) / (2 * Math.PI)) >= Math.ceil((t1 + Math.PI / 2) / (2 * Math.PI));
  const ends = [Math.sin(t1), Math.sin(t2)];
  return [hasPeak ? 1 : Math.max(...ends), hasTrough ? -1 : Math.min(...ends)];
}

export const verification: Verification = {
  lesson: 'math.analysis.integrable-functions',
  notes: {
    p1: '按定义算上和、下和：每一段上的上、下确界在 2000 个格点（含两端）上取。',
    p2:
      '可积 ⟺ 有界并且 n 等分时 U − L 随 n 增大趋于 0（n = 10²…10⁶）。狄利克雷函数每一段的值都放进 1 和 0 两种；⌊3x⌋ 的取样点加上跳跃点 1/3、2/3、1；' +
      '1/x 看第一段上的上确界是否随格点加密无限变大；sin(1/x) 每一段的上、下确界按 t = 1/x 的范围精确算（含 0 的那一段是 1 和 −1，再算上 f(0) = 0）。',
    p3: '同 p1。',
    p4:
      '满足条件的 f 在每一段上 M − m ≤ 3×段长；f(x) = 3x 取到这个界。脚本算 f = 3x 的 U − L，' +
      '再用 2000 个随机折线函数（每段斜率在 [−3, 3] 里随机取）核对：没有一个的 U − L 超过它。',
  },
  compute() {
    // p1：x³ 在 [1, 3] 上四等分
    const [U1, L1] = darboux((x) => [x ** 3], [1, 1.5, 2, 2.5, 3]);

    // p2：哪些在 [0, 1] 上可积
    const equal = (n: number): number[] => Array.from({ length: n + 1 }, (_, i) => i / n);
    const gaps = (fn: (n: number) => number): number[] => [100, 1000, 10_000, 100_000, 1_000_000].map(fn);
    const shrinks = (g: number[]): boolean => g.every((v, i) => i === 0 || v <= g[i - 1] + 1e-12) && g[g.length - 1] < 1e-2;
    const p2: number[] = [];
    // A：狄利克雷函数
    if (shrinks(gaps((n) => (([U, L]) => U - L)(darboux(() => [1, 0], equal(n), [], 2))))) p2.push(1);
    // B：⌊3x⌋
    if (shrinks(gaps((n) => (([U, L]) => U - L)(darboux((x) => [Math.floor(3 * x)], equal(n), [1 / 3, 2 / 3, 1], 2))))) p2.push(2);
    // C：1/x（f(0) = 0）：第一段上的上确界随格点加密无限变大，就没有有限的上和
    const supFirst = [10, 1000, 100_000].map((k) => Math.max(...grid(0, 0.01, k).map((x) => (x === 0 ? 0 : 1 / x))));
    const bounded = supFirst.every((v) => v < 1e6);
    if (bounded) p2.push(3);
    // D：sin(1/x)（f(0) = 0）
    const sinGap = (n: number): number => {
      let s = 0;
      for (let i = 1; i <= n; i++) {
        const a = (i - 1) / n;
        const b = i / n;
        const [M, m] = a === 0 ? [1, -1] : sinRange(1 / b, 1 / a);
        s += (M - m) / n;
      }
      return s;
    };
    if (shrinks(gaps(sinGap))) p2.push(4);

    // p3：4x(1 − x) 在 [0, 1] 上四等分
    const p3 = darboux((x) => [4 * x * (1 - x)], [0, 0.25, 0.5, 0.75, 1]);

    // p4：|f(x) − f(y)| ≤ 3|x − y|，十等分，U − L 的最大值
    const tenths = equal(10);
    const linearGap = (([U, L]) => U - L)(darboux((x) => [3 * x], tenths));
    const rand = seededRandom(2026_11_09);
    for (let trial = 0; trial < 2000; trial++) {
      const m = 50; // 每个随机折线有 50 段
      const slopes = Array.from({ length: m }, () => 6 * rand() - 3);
      const f = (x: number): number => {
        let y = 0;
        for (let j = 0; j < m; j++) {
          const lo = j / m;
          if (x <= lo) break;
          y += slopes[j] * (Math.min(x, (j + 1) / m) - lo);
        }
        return y;
      };
      const [U, L] = darboux((x) => [f(x)], tenths, [], 200);
      if (U - L > linearGap + 1e-12) throw new Error('p4：找到了比 3x 更大的 U − L');
    }

    return {
      p1: { type: 'number', value: U1 - L1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: linearGap },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
