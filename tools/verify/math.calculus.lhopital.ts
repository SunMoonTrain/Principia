// 独立验算 math.calculus.lhopital 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.lhopital.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { limitAt } from './math.calculus._calc.ts';

function need(v: number | null, name: string): number {
  if (v === null) throw new Error(`${name}：两侧极限不存在或不一致`);
  return v;
}

export const verification: Verification = {
  lesson: 'math.calculus.lhopital',
  notes: {
    p1: '在 0 的两侧直接取函数值看极限（数值外推，不求导）；e^x − 1 用 expm1 算，免得相减丢精度。',
    p2: '在 1 的两侧直接取函数值看极限。',
    p3: '在 0 的两侧直接取函数值看极限，e^x − 1 用 expm1 算。',
    p4: '在 0 的两侧直接取 (cos x)^{1/x²} 的值看极限；ln cos x 写成 log1p(−2sin²(x/2))，免得 cos x 接近 1 时丢精度。',
  },
  compute() {
    const p1 = need(limitAt((x) => (Math.expm1(x) - x) / (x * x), 0), 'p1');
    const p2 = need(limitAt((x) => (x ** 3 - 1) / Math.log(x), 1), 'p2');
    const p3 = need(limitAt((x) => 1 / Math.expm1(x) - 1 / x, 0), 'p3');
    const p4 = need(limitAt((x) => Math.exp(Math.log1p(-2 * Math.sin(x / 2) ** 2) / (x * x)), 0), 'p4');
    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
