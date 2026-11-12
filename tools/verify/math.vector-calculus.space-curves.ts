// 独立验算 math.vector-calculus.space-curves 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.space-curves.ts
// 速度用位置的中心差分；弧长不用 ∫|r'| 的公式，用内接折线的总长，再做理查森外推。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { derivative, norm, polylineSum, richardson, type Vec } from './math.vector-calculus._vc.ts';

export const verification: Verification = {
  lesson: 'math.vector-calculus.space-curves',
  notes: {
    p1: '三个分量在 t = 1 处中心差分，取长度。',
    p2: '把 [0,1] 分成 2000、4000 段，内接折线的总长做理查森外推。',
    p3: '取 t = 1 ± 10⁻⁶ 两点连成的弦，单位化。',
    p4: '把 |r(t)| 当一元函数，在 t = 1 处中心差分。',
  },
  compute() {
    // p1
    const r1 = (t: number): Vec => [t * t, 2 * t, Math.log(t)];
    const p1 = norm([0, 1, 2].map((i) => derivative((t) => r1(t)[i], 1)));

    // p2
    const r2 = (t: number): Vec => [t, t * t, (2 / 3) * t ** 3];
    const p2 = richardson((n) => polylineSum(r2, 0, 1, n, (_p, d) => norm(d)), 2000);

    // p3
    const r3 = (t: number): Vec => [t, t * t, t ** 3];
    const chord = r3(1 + 1e-6).map((x, i) => x - r3(1 - 1e-6)[i]);
    const p3 = chord.map((x) => x / norm(chord));

    // p4
    const r4 = (t: number): Vec => [t, t * t, 1];
    const p4 = derivative((t) => norm(r4(t)), 1);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
