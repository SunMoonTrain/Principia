// 独立验算 math.pde.transport-equation 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.pde.transport-equation.ts
// 做法：不用通解公式，而是数值地走特征线。对一阶线性方程 a u_x + b u_t（或 u_y）+ γu = f，
// 沿 dx/ds = a、dt/ds = b 的曲线，U(s) = u(x(s), t(s)) 满足常微分方程 U' = f − γU。
// 用四阶龙格-库塔法把特征线从所求的点往回积到给初值的那条线上，读出初值，再沿特征线往前积 U。
// 为了确认这样拼出来的 u 真是方程的解，在所求点附近用中心差分算方程的残差（应接近 0）。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { rk4Accurate, rk4VecAccurate } from './math.ode._numeric.ts';

/** 中心差分求偏导数（步长 1e-4，误差约 1e-8 量级）。 */
function partial(u: (x: number, y: number) => number, x: number, y: number, which: 'x' | 'y', h = 1e-4): number {
  return which === 'x' ? (u(x + h, y) - u(x - h, y)) / (2 * h) : (u(x, y + h) - u(x, y - h)) / (2 * h);
}

function assertSmall(label: string, value: number, tol = 1e-6): void {
  if (!(Math.abs(value) < tol)) throw new Error(`${label}：残差 ${value} 不接近 0`);
}

// ---------- p1：u_t + 3u_x = 0，u(x, 0) = e^{−x²}，求 u(5, 1) ----------
// 特征线 dx/dt = 3；沿它 u 不变。从 (x, t) 往回积到 t = 0。
function u1(x: number, t: number): number {
  const x0 = rk4Accurate(() => 3, t, x, 0, 2000);
  return Math.exp(-x0 * x0);
}

// ---------- p2：u_t − 2u_x = 0 的解 ----------
// 特征线 dx/dt = −2。给一个初值 φ，沿特征线往回积到 t = 0 得到 u(x, t) = φ(x0)。
const testInitials: { name: string; phi: (x: number) => number }[] = [
  { name: 'sin x', phi: Math.sin },
  { name: 'e^{−x²}', phi: (x) => Math.exp(-x * x) },
  { name: 'x³ − x', phi: (x) => x * x * x - x },
  { name: 'arctan x', phi: Math.atan },
];
function solution2(phi: (x: number) => number): (x: number, t: number) => number {
  return (x, t) => phi(rk4Accurate(() => -2, t, x, 0, 2000));
}
const samplePoints: [number, number][] = [
  [0.3, 0.7],
  [-1.2, 2.5],
  [2.4, -0.8],
  [1, 3],
  [-3.1, 1.4],
];

// ---------- p3：u_t + 2u_x + u = e^{−t}，u(x, 0) = x²，求 u(3, 1) ----------
// 特征线 dx/dt = 2；沿它 U' = e^{−t} − U。先把 x 从 (3, 1) 往回积到 t = 0，再把 (x, U) 一起往前积。
function u3(x: number, t: number): number {
  const x0 = rk4Accurate(() => 2, t, x, 0, 2000);
  const [, U] = rk4VecAccurate((s, Y) => [2, Math.exp(-s) - Y[1]], 0, [x0, x0 * x0], t, 20_000);
  return U;
}

// ---------- p4：y u_x − x u_y = 0（去掉原点），u(x, 0) = ln x（x > 0），求 u(3, 4) ----------
// 特征线 dx/ds = y、dy/ds = −x；沿它 u 不变。从所求的点出发积到正 x 轴（y 由正变为 0 且 x > 0），读出 ln x。
function traceToPositiveXAxis(x: number, y: number): number {
  const F = (Y: number[]): number[] => [Y[1], -Y[0]];
  const step = (Y: number[], h: number): number[] => {
    const k1 = F(Y);
    const k2 = F([Y[0] + (h / 2) * k1[0], Y[1] + (h / 2) * k1[1]]);
    const k3 = F([Y[0] + (h / 2) * k2[0], Y[1] + (h / 2) * k2[1]]);
    const k4 = F([Y[0] + h * k3[0], Y[1] + h * k3[1]]);
    return [Y[0] + (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), Y[1] + (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])];
  };
  const h = 1e-4;
  let Y = [x, y];
  for (let i = 0; i < 2e6; i++) {
    const next = step(Y, h);
    if (Y[1] > 0 && next[1] <= 0 && next[0] > 0) {
      // 在这一步里二分步长，找 y = 0 的位置
      let a = 0;
      let b = h;
      for (let k = 0; k < 100; k++) {
        const m = (a + b) / 2;
        if (step(Y, m)[1] > 0) a = m;
        else b = m;
      }
      return step(Y, (a + b) / 2)[0];
    }
    Y = next;
  }
  throw new Error('p4：特征线没有到达正 x 轴');
}
function u4(x: number, y: number): number {
  return Math.log(traceToPositiveXAxis(x, y));
}

export const verification: Verification = {
  lesson: 'math.pde.transport-equation',
  notes: {
    p1: '不用 u = φ(x − 3t)：沿特征线 dx/dt = 3 用四阶龙格-库塔法从 (5, 1) 往回积到 t = 0，读初值 e^{−x0²}；再在 (5, 1) 附近用中心差分核对这样拼出的 u 满足 u_t + 3u_x = 0。',
    p2: '用 4 个初值 φ（sin x、e^{−x²}、x³ − x、arctan x）沿特征线 dx/dt = −2 数值往回积，拼出 4 个解，先用中心差分核对它们满足方程；再在 5 个点上逐条检验：A 看 u 沿 x − 2t = 常数是否不变（反例 φ = sin x）；B 看 u(x, t) 是否等于 u(x + 2t, 0)（图像向左平移 2t）；C 看 u(1, 3) 是否等于 φ(7)；D 看 u(x, t) 是否等于 u(x, 0)（反例 φ = sin x）；E 用中心差分算 sin(x + 2t) + 5 的残差 u_t − 2u_x。',
    p3: '沿特征线 dx/dt = 2，U(t) = u(x(t), t) 满足 U′ = e^{−t} − U。先把 x 从 (3, 1) 往回积到 t = 0 得 x0，再把 (x, U) 从 (x0, x0²) 用四阶龙格-库塔法往前积到 t = 1；最后在 (3, 1) 附近用中心差分核对方程的残差。',
    p4: '特征线 dx/ds = y、dy/ds = −x，沿它 u 不变。从 (3, 4) 用四阶龙格-库塔法（步长 1e-4）积到正 x 轴，在最后一步里二分出交点，读 ln x；再在 (3, 4) 附近用中心差分核对 y u_x − x u_y = 0。',
  },
  compute() {
    // p1
    const p1 = u1(5, 1);
    assertSmall('p1', partial(u1, 5, 1, 'y') + 3 * partial(u1, 5, 1, 'x'));

    // p2
    const sols = testInitials.map((c) => ({ ...c, u: solution2(c.phi) }));
    for (const s of sols) for (const [x, t] of samplePoints) assertSmall(`p2 ${s.name}`, partial(s.u, x, t, 'y') - 2 * partial(s.u, x, t, 'x'));
    const close = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
    const allTrue = (pred: (s: (typeof sols)[number], x: number, t: number) => boolean): boolean =>
      sols.every((s) => samplePoints.every(([x, t]) => pred(s, x, t)));
    const optionA = allTrue((s, x, t) => close(s.u(x, t), s.u(x + 2 * 1.7, t + 1.7))); // 沿 x − 2t = 常数走一段
    const optionB = allTrue((s, x, t) => close(s.u(x, t), s.u(x + 2 * t, 0)));
    const optionC = sols.every((s) => close(s.u(1, 3), s.phi(7)));
    const optionD = allTrue((s, x, t) => close(s.u(x, t), s.u(x, 0)));
    const uE = (x: number, t: number): number => Math.sin(x + 2 * t) + 5;
    const optionE = samplePoints.every(([x, t]) => Math.abs(partial(uE, x, t, 'y') - 2 * partial(uE, x, t, 'x')) < 1e-6);
    const p2 = [optionA, optionB, optionC, optionD, optionE].flatMap((ok, i) => (ok ? [i + 1] : []));

    // p3
    const p3 = u3(3, 1);
    assertSmall('p3', partial(u3, 3, 1, 'y') + 2 * partial(u3, 3, 1, 'x') + u3(3, 1) - Math.exp(-1));

    // p4
    const p4 = u4(3, 4);
    assertSmall('p4', 4 * partial(u4, 3, 4, 'x') - 3 * partial(u4, 3, 4, 'y'), 1e-5);

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
