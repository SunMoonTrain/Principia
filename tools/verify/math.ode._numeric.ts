// 常微分方程验算脚本共用的数值工具（npm run verify 不把它当成小节脚本）。
// 只放通用的积分、求根、求极值方法，不含任何一道题的答案。

/** 一元方程 y' = f(t, y)。 */
export type Rhs = (t: number, y: number) => number;

/** 四阶龙格-库塔法从 (t0, y0) 积到 t1，等分 steps 步（t1 < t0 时往回积）。 */
export function rk4(f: Rhs, t0: number, y0: number, t1: number, steps = 20_000): number {
  const h = (t1 - t0) / steps;
  let t = t0;
  let y = y0;
  for (let i = 0; i < steps; i++) {
    const k1 = f(t, y);
    const k2 = f(t + h / 2, y + (h / 2) * k1);
    const k3 = f(t + h / 2, y + (h / 2) * k2);
    const k4 = f(t + h, y + h * k3);
    y += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    t = t0 + (i + 1) * h;
  }
  return y;
}

/** 同上，但用 Richardson 外推：步数加倍的两次结果按四阶外推，误差再小两三个数量级。 */
export function rk4Accurate(f: Rhs, t0: number, y0: number, t1: number, steps = 20_000): number {
  const a = rk4(f, t0, y0, t1, steps);
  const b = rk4(f, t0, y0, t1, 2 * steps);
  return b + (b - a) / 15;
}

/**
 * 解往右走多远会跑到无穷：四阶龙格-库塔法，步长随 |y| 变小（每步 y 只变千分之几），
 * 直到 |y| 超过 big。返回那时的 t（再往后到无穷只剩约 1/big 量级的时间，可以忽略）。
 */
export function blowUpTime(f: Rhs, t0: number, y0: number, big = 1e9, tMax = 1e6): number {
  let t = t0;
  let y = y0;
  while (Math.abs(y) < big && t < tMax) {
    const h = 2e-4 / Math.max(1, Math.abs(f(t, y)) / Math.max(1, Math.abs(y)));
    const k1 = f(t, y);
    const k2 = f(t + h / 2, y + (h / 2) * k1);
    const k3 = f(t + h / 2, y + (h / 2) * k2);
    const k4 = f(t + h, y + h * k3);
    y += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    t += h;
  }
  return t;
}

/** 二分法：g(a)、g(b) 异号，返回 [a, b] 里 g 的一个零点。 */
export function bisect(g: (x: number) => number, a: number, b: number, iterations = 200): number {
  let ga = g(a);
  for (let i = 0; i < iterations; i++) {
    const m = (a + b) / 2;
    const gm = g(m);
    if (gm === 0) return m;
    if (ga * gm < 0) b = m;
    else {
      a = m;
      ga = gm;
    }
  }
  return (a + b) / 2;
}

/** 黄金分割法求单峰函数 g 在 [a, b] 上的最大值点。 */
export function argMax(g: (x: number) => number, a: number, b: number, iterations = 200): number {
  const r = (Math.sqrt(5) - 1) / 2;
  let x1 = b - r * (b - a);
  let x2 = a + r * (b - a);
  let g1 = g(x1);
  let g2 = g(x2);
  for (let i = 0; i < iterations; i++) {
    if (g1 < g2) {
      a = x1;
      x1 = x2;
      g1 = g2;
      x2 = a + r * (b - a);
      g2 = g(x2);
    } else {
      b = x2;
      x2 = x1;
      g2 = g1;
      x1 = b - r * (b - a);
      g1 = g(x1);
    }
  }
  return (a + b) / 2;
}

/** 在等距格点上取 g 的最大值，再在最大的格点附近用黄金分割加细（g 在那里单峰即可）。 */
export function maxOnGrid(g: (x: number) => number, a: number, b: number, n = 4000): number {
  let best = a;
  let bestValue = -Infinity;
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n;
    const v = g(x);
    if (v > bestValue) {
      bestValue = v;
      best = x;
    }
  }
  const h = (b - a) / n;
  const x = argMax(g, Math.max(a, best - h), Math.min(b, best + h));
  return Math.max(bestValue, g(x));
}

/** 复合辛普森公式，n 取偶数。 */
export function simpson(f: (x: number) => number, a: number, b: number, n = 2000): number {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 === 1 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

/**
 * 平衡点 y* 是否把两侧的解都吸过来：从 y* ± d 出发积分到 T，看离 y* 的距离是否都变小到原来的一成以下。
 * 只用来区分「两侧都回来」和「至少一侧跑开」，不预设 f'(y*) 的符号。
 */
export function attractsBothSides(f: (y: number) => number, yStar: number, d = 1e-3, T = 50): boolean {
  return [yStar - d, yStar + d].every((y0) => {
    const y = rk4((_, y) => f(y), 0, y0, T, 50_000);
    return Number.isFinite(y) && Math.abs(y - yStar) < 0.1 * d;
  });
}
