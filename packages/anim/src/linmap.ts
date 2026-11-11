// LinearMap2D 的计算部分：从单位矩阵插值、几个矩阵依次作用、时间轴、特征向量的方向、网格画多远。
// 不碰 DOM 和 React，单元测试直接调用。

/** 2×2 矩阵，按行存：[a, b, c, d] 表示 [[a, b], [c, d]]。 */
export type Mat2 = readonly [number, number, number, number];

export const IDENTITY: Mat2 = [1, 0, 0, 1];

/** 1× 时每一步用几秒（你定的）。 */
export const STEP_SECONDS = 2;
/** 两步之间停多久（1× 时，秒），让读者看清中间的样子。 */
export const STEP_HOLD = 0.5;

/** m·n：先作用 n，再作用 m。 */
export function multiply(m: Mat2, n: Mat2): Mat2 {
  return [m[0] * n[0] + m[1] * n[2], m[0] * n[1] + m[1] * n[3], m[2] * n[0] + m[3] * n[2], m[2] * n[1] + m[3] * n[3]];
}

export function det(m: Mat2): number {
  return m[0] * m[3] - m[1] * m[2];
}

export function apply(m: Mat2, x: number, y: number): [number, number] {
  return [m[0] * x + m[1] * y, m[2] * x + m[3] * y];
}

/** (1 − s)I + sM：s = 0 是单位矩阵，s = 1 是 M。 */
export function lerpFromIdentity(m: Mat2, s: number): Mat2 {
  return [1 - s + s * m[0], s * m[1], s * m[2], 1 - s + s * m[3]];
}

/** 依次作用的几个矩阵合起来：后面的乘在左边。 */
export function product(mats: readonly Mat2[]): Mat2 {
  return mats.reduce<Mat2>((acc, m) => multiply(m, acc), IDENTITY);
}

/** 前 index 步已经做完、第 index 步走到 s 时的矩阵：((1 − s)I + sM_index)·M_(index−1)⋯M_0。 */
export function composeAt(mats: readonly Mat2[], index: number, s: number): Mat2 {
  return multiply(lerpFromIdentity(mats[index], s), product(mats.slice(0, index)));
}

/** 时间轴的总长（1× 时，秒）：每步 STEP_SECONDS，步与步之间停 STEP_HOLD。 */
export function totalTime(steps: number): number {
  return steps * STEP_SECONDS + (steps - 1) * STEP_HOLD;
}

/** 两头放慢的插值进度。 */
function ease(u: number): number {
  return u * u * (3 - 2 * u);
}

/** 时间轴上 time 秒处：第几步、这一步走了多少（0 到 1，两头放慢），以及进度条的位置（0 到步数，没放慢）。 */
export function stepAt(time: number, steps: number): { index: number; s: number; progress: number } {
  const period = STEP_SECONDS + STEP_HOLD;
  const t = Math.max(0, Math.min(time, totalTime(steps)));
  const index = Math.min(steps - 1, Math.floor(t / period));
  const raw = Math.min(1, (t - index * period) / STEP_SECONDS);
  return { index, s: ease(raw), progress: index + raw };
}

/** 进度条的位置（0 到步数）→ 时间轴上的时刻。 */
export function timeAtProgress(progress: number, steps: number): number {
  const p = Math.max(0, Math.min(progress, steps));
  if (p >= steps) return totalTime(steps);
  const index = Math.floor(p);
  return index * (STEP_SECONDS + STEP_HOLD) + (p - index) * STEP_SECONDS;
}

/**
 * 实特征值对应的特征向量方向（单位向量，重根且只有一个方向时只给一个）。
 * 复特征值时没有；矩阵是单位矩阵的倍数时每个方向都是，directions 为空、all 为真。
 */
export function eigenDirections(m: Mat2): { directions: [number, number][]; all: boolean } {
  const [a, b, c, d] = m;
  const scale = Math.max(1, Math.abs(a), Math.abs(b), Math.abs(c), Math.abs(d));
  const eps = 1e-9 * scale;
  if (Math.abs(b) <= eps && Math.abs(c) <= eps && Math.abs(a - d) <= eps) return { directions: [], all: true };
  const tr = a + d;
  const disc = tr * tr - 4 * det(m);
  if (disc < -eps * scale) return { directions: [], all: false };
  const root = Math.sqrt(Math.max(0, disc));
  const lambdas = root <= Math.sqrt(eps) * scale ? [tr / 2] : [(tr + root) / 2, (tr - root) / 2];
  const directions: [number, number][] = [];
  for (const lambda of lambdas) {
    // (A − λI)v = 0：用 A − λI 里大的那一行，第一行 (a − λ, b) 给出 v = (b, λ − a)，第二行 (c, d − λ) 给出 v = (λ − d, c)
    const v: [number, number] = Math.hypot(a - lambda, b) >= Math.hypot(c, d - lambda) ? [b, lambda - a] : [lambda - d, c];
    const n = Math.hypot(v[0], v[1]);
    directions.push([v[0] / n, v[1] / n]);
  }
  return { directions, all: false };
}

/**
 * 网格画多远：变换后要盖住显示范围，原来的网格就要画到显示范围的四个角逆变换回去的地方。
 * 矩阵不可逆或接近不可逆时，平面被压扁，网格线挤在一起，画到 cap 为止。
 */
export function gridExtent(m: Mat2, x: readonly [number, number], y: readonly [number, number], cap: number): number {
  const D = det(m);
  const scale = Math.max(Math.abs(m[0]), Math.abs(m[1]), Math.abs(m[2]), Math.abs(m[3]));
  if (!(Math.abs(D) > 1e-12 * scale * scale)) return cap;
  let extent = 0;
  for (const px of x) {
    for (const py of y) {
      // 逆矩阵是 [[d, −b], [−c, a]] / det
      const u = (m[3] * px - m[1] * py) / D;
      const v = (-m[2] * px + m[0] * py) / D;
      extent = Math.max(extent, Math.abs(u), Math.abs(v));
    }
  }
  return Math.min(cap, extent);
}
