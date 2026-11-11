// 独立验算 math.ode.laplace-transform 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.laplace-transform.ts
// 变换都按定义做数值积分，不查表；逆变换用固定塔尔博特（fixed Talbot）数值反演，不猜原函数。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { simpson } from './math.ode._numeric.ts';

/** ∫₀^∞ e^{−st} f(t) dt：积到被积函数小于 1e−17 的地方，分段辛普森。 */
function laplace(f: (t: number) => number, s: number, decay: number): number {
  const T = 40 / decay;
  let sum = 0;
  for (let k = 0; k < 40; k++) sum += simpson((t) => Math.exp(-s * t) * f(t), (k * T) / 40, ((k + 1) * T) / 40, 400);
  return sum;
}

type C = [number, number];
const cmul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a: C, b: C): C => {
  const d = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
};
const cexp = (a: C): C => [Math.exp(a[0]) * Math.cos(a[1]), Math.exp(a[0]) * Math.sin(a[1])];

/** 固定塔尔博特法（Abate–Valkó）求 F 的逆变换在 t 处的值。 */
function talbot(F: (s: C) => C, t: number, M = 32): number {
  const r = (2 * M) / (5 * t);
  let sum = 0.5 * Math.exp(r * t) * F([r, 0])[0];
  for (let k = 1; k < M; k++) {
    const th = (k * Math.PI) / M;
    const cot = Math.cos(th) / Math.sin(th);
    const s: C = [r * th * cot, r * th];
    const sigma = th + (th * cot - 1) * cot;
    sum += cmul(cmul(cexp([t * s[0], t * s[1]]), F(s)), [1, sigma])[0];
  }
  return (r / M) * sum;
}

export const verification: Verification = {
  lesson: 'math.ode.laplace-transform',
  notes: {
    p1: '按定义对 e^{−5t}e^{2t} 在 [0, 40/3] 上分段辛普森求积（再往后的部分小于 e^{−40}）。',
    p2: '按定义对 e^{−2t}t² 分段求积。',
    p3: '按定义对 e^{−2t}e^{−t}cos 2t 分段求积。',
    p4: '对 F(s) = 2/(s + 3)³ 用固定塔尔博特法（M = 32）做数值逆变换，求 t = 1 处的值；另用 M = 24 核对，两次相差小于 1e−9。',
  },
  compute() {
    const p1 = laplace((t) => Math.exp(2 * t), 5, 3);
    const p2 = laplace((t) => t * t, 2, 1.5);
    const p3 = laplace((t) => Math.exp(-t) * Math.cos(2 * t), 2, 3);
    const F = (s: C): C => {
      const w: C = [s[0] + 3, s[1]];
      return cdiv([2, 0], cmul(cmul(w, w), w));
    };
    const p4 = talbot(F, 1);
    if (Math.abs(talbot(F, 1, 24) - p4) > 1e-9) throw new Error('p4：两种 M 的反演结果对不上');
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
