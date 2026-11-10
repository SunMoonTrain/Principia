// 独立验算 math.ode.numerical-methods 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.numerical-methods.ts
// 三种方法都按一般的 f(x, y) 写成函数，再代入各题的方程，不用 y′ = y 之类的特殊公式。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import type { Rhs } from './math.ode._numeric.ts';

type Step = (f: Rhs, x: number, y: number, h: number) => number;

const euler: Step = (f, x, y, h) => y + h * f(x, y);
const heun: Step = (f, x, y, h) => {
  const k1 = f(x, y);
  const k2 = f(x + h, y + h * k1);
  return y + (h / 2) * (k1 + k2);
};
const rk4: Step = (f, x, y, h) => {
  const k1 = f(x, y);
  const k2 = f(x + h / 2, y + (h / 2) * k1);
  const k3 = f(x + h / 2, y + (h / 2) * k2);
  const k4 = f(x + h, y + h * k3);
  return y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
};

function march(step: Step, f: Rhs, x0: number, y0: number, h: number, n: number): number {
  let y = y0;
  for (let i = 0; i < n; i++) y = step(f, x0 + i * h, y, h);
  return y;
}

export const verification: Verification = {
  lesson: 'math.ode.numerical-methods',
  notes: {
    p1: '欧拉法 y_{n+1} = y_n + h f(x_n, y_n)，h = 0.1 走 2 步。',
    p2: '欧拉法，h = 0.25 从 0 走 4 步到 1。',
    p3: '四阶龙格-库塔法按四个斜率的定义算一步，h = 1。',
    p4: '改进的欧拉法（起点斜率和试走终点斜率取平均），h = 0.5 走 2 步。',
  },
  compute() {
    return {
      p1: { type: 'number', value: march(euler, (x, y) => x + y, 0, 1, 0.1, 2) },
      p2: { type: 'number', value: march(euler, (_, y) => -2 * y, 0, 1, 0.25, 4) },
      p3: { type: 'number', value: march(rk4, (x, y) => x + y, 0, 1, 1, 1) },
      p4: { type: 'number', value: march(heun, (_, y) => y, 0, 1, 0.5, 2) },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
