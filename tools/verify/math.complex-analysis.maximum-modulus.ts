// 独立验算 math.complex-analysis.maximum-modulus 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.maximum-modulus.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cexp, circle, Complex, csin, cx, integrate, maxModulusOnPath, maxOnGrid } from './math.complex-analysis._complex.ts';

const inDisc = (z: Complex) => z.abs() <= 1;
const box: [number, number, number, number] = [-1, 1, -1, 1];

/** 闭单位圆盘上 |f| 的最大值：圆周上细找，圆盘里格点上粗找，取大的。 */
function maxOnClosedDisc(f: (z: Complex) => Complex): number {
  const b = maxModulusOnPath(f, circle(0, 1)).value;
  const g = maxOnGrid((z) => f(z).abs(), inDisc, box, 300).value;
  return Math.max(b, g);
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.maximum-modulus',
  notes: {
    p1: '闭圆盘上 |z² + 2z| 的最大值：圆周上细找（黄金分割），圆盘里 301² 个格点粗找，取大的。',
    p2: '在单位圆盘上拿 5 个不是常数的全纯函数（z、z² + 1、e^z、(z − 0.3)²、sin 2z）逐条对照：A、C 看 |f|、Re f 在半径 0.99 以内格点上的最大值是不是总比圆周上的小；B 找反例（z 在 0 处取到最小值 0）；D 取 30 个点 z0（含 f 的零点），在以 z0 为圆心、含在圆盘里的 3 个圆周上求 |f| 的最大值，看是不是都不小于 |f(z0)|。',
    p3: '同 p1，函数换成 e^{z²}。',
    p4: '直接在 [0, 2π] 上数值积 ln|3 + e^{it}|（双指数求积），不用平均值性质。',
  },
  compute() {
    const p1 = maxOnClosedDisc((z) => z.mul(z).add(z.scale(2)));

    const tests: ((z: Complex) => Complex)[] = [(z) => z, (z) => z.mul(z).add(1), cexp, (z) => z.sub(0.3).mul(z.sub(0.3)), (z) => csin(z.scale(2))];
    const inner = (z: Complex) => z.abs() <= 0.99;
    const A = tests.some((f) => maxOnGrid((z) => f(z).abs(), inner, box, 200).value >= maxModulusOnPath(f, circle(0, 1)).value);
    const B = !(tests[0](cx(0)).abs() === 0); // f = z 在 0 处取到最小值 0：B 不成立
    // 圆周上 Re f 的最大值：借 e^{Re f} 用 maxModulusOnPath 细找，再取对数
    const C = tests.every((f) => maxOnGrid((z) => f(z).re, inner, box, 200).value < Math.log(maxModulusOnPath((z) => cx(Math.exp(f(z).re)), circle(0, 1)).value));
    // D：以 z0 为圆心、含在单位圆盘里的每个圆周上，都有点使 |f| ≥ |f(z0)|。取 30 个 z0（含 f 的零点）、各 3 个半径，比圆周上 |f| 的最大值
    let D = true;
    const z0s = [cx(0), cx(0.3), cx(-0.5, 0.2), ...Array.from({ length: 27 }, (_, k) => Complex.fromPolar(0.8 * ((k % 9) + 1) / 9, 0.9 * k))];
    for (const f of tests) {
      for (const z0 of z0s) {
        const v0 = f(z0).abs();
        for (const frac of [0.25, 0.5, 0.9]) {
          const r = frac * (1 - z0.abs());
          if (maxModulusOnPath(f, circle(z0, r), 2000).value < v0 * (1 - 1e-12)) D = false;
        }
      }
    }
    const p2 = [A, B, C, D].map((ok, i) => (ok ? i + 1 : 0)).filter((i) => i > 0);

    const p3 = maxOnClosedDisc((z) => cexp(z.mul(z)));
    const p4 = integrate((t) => Math.log(Math.hypot(3 + Math.cos(t), Math.sin(t))), 0, 2 * Math.PI);
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
