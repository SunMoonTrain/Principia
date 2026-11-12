// 独立验算 math.vector-calculus.double-integrals 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.double-integrals.ts
// 二重积分都用嵌套的双指数求积数值地算；区域按另一个次序（先对 x 积分）写出来，不照提示的次序；p4 照题面的次序硬算内层的 ∫e^{y³}dy，不交换次序。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { integrate, integrate2 } from './math.vector-calculus._vc.ts';

export const verification: Verification = {
  lesson: 'math.vector-calculus.double-integrals',
  notes: {
    p1: '在矩形上先对 x、再对 y 数值积分 6xy²。',
    p2: '先对 x 积分：y 从 0 到 4，x 从 y/2 到 √y，被积函数取 1。',
    p3: '先对 x 积分：y 从 0 到 1，x 从 −√y 到 √y，被积函数 x²y。',
    p4: '不交换次序：外层 x 从 0 到 1，内层数值求 ∫_{√x}^1 e^{y³}dy；外层换元 x = t² 只为数值精度。',
  },
  compute() {
    // p1
    const p1 = integrate2((y, x) => 6 * x * y * y, 0, 2, () => 0, () => 1);

    // p2
    const p2 = integrate2(() => 1, 0, 4, (y) => y / 2, (y) => Math.sqrt(y));

    // p3
    const p3 = integrate2((y, x) => x * x * y, 0, 1, (y) => -Math.sqrt(y), (y) => Math.sqrt(y));

    // p4：∫_0^1 g(x) dx，g(x) = ∫_{√x}^1 e^{y³} dy；令 x = t²，dx = 2t dt
    const g = (x: number): number => integrate((y) => Math.exp(y ** 3), Math.sqrt(x), 1);
    const p4 = integrate((t) => g(t * t) * 2 * t, 0, 1);

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
