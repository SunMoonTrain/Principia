// 光学验算脚本的公用部分（文件名以下划线开头，npm run verify 不把它当成小节脚本）。
// 一是二维精确光线追迹：光线和球面、平面求交，用向量形式的折射定律、反射定律算出射方向，不做近轴近似；
// 取很小的倾角或高度，再用理查森外推消去像差的平方项，得到近轴极限，和讲解里的近轴公式互相核对。
// 二是理想薄透镜和自由传播对光线 (y, θ) 的作用，用来按光路一步步追两条光线、求交点，和成像公式核对。
// 三是波的叠加（批次 16 加的）：把许多个次波的振幅、相位直接相加，再取模平方，不用讲解里求和以后的式子。
// agree、check、chosen、bisect、argmax、rk4 借用电磁学的辅助文件。

export { agree, argmax, bisect, check, chosen, rk4, rk4Step, solveLinear } from './physics.electromagnetism._es.ts';

export const deg = Math.PI / 180;

export type V2 = [number, number];
export const add2 = (a: V2, b: V2): V2 => [a[0] + b[0], a[1] + b[1]];
export const sub2 = (a: V2, b: V2): V2 => [a[0] - b[0], a[1] - b[1]];
export const scale2 = (k: number, a: V2): V2 => [k * a[0], k * a[1]];
export const dot2 = (a: V2, b: V2): number => a[0] * b[0] + a[1] * b[1];
export const unit2 = (a: V2): V2 => scale2(1 / Math.hypot(a[0], a[1]), a);
/** 和 +x 轴成 angle（弧度，逆时针为正）的单位向量。 */
export const dirOf = (angle: number): V2 => [Math.cos(angle), Math.sin(angle)];
/** 两个方向之间的夹角（0 到 π）。 */
export const angleBetween = (a: V2, b: V2): number => Math.atan2(Math.abs(a[0] * b[1] - a[1] * b[0]), dot2(a, b));

/**
 * 向量形式的折射定律：d 是入射方向（单位向量），normal 是界面的单位法线（朝哪边都行），
 * 从折射率 n1 进入 n2。返回折射方向（单位向量）；全反射时返回 null。
 * d' = η d + (η cos i − cos t) N，N 取和入射方向相对的那一侧，η = n1/n2。
 */
export function refract(d: V2, normal: V2, n1: number, n2: number): V2 | null {
  let N = normal;
  let ci = -dot2(d, N);
  if (ci < 0) {
    N = scale2(-1, N);
    ci = -ci;
  }
  const eta = n1 / n2;
  const k = 1 - eta * eta * (1 - ci * ci);
  if (k < 0) return null;
  return add2(scale2(eta, d), scale2(eta * ci - Math.sqrt(k), N));
}

/** 反射定律的向量形式：d' = d − 2(d·N)N（N 朝哪边都一样）。 */
export const reflect = (d: V2, normal: V2): V2 => sub2(d, scale2(2 * dot2(d, normal), normal));

export interface Ray {
  p: V2;
  d: V2;
}

/**
 * 顶点在 (v, 0)、曲率半径的大小为 |R| 的面：R > 0 时球心在顶点右边（+x 一侧），R < 0 在左边，R = ±Infinity 是平面 x = v。
 * 返回光线所在直线和顶点那半个球面的交点、交点处的单位法线。
 * 交点可以在光线起点后面（参数为负），用来追「厚度为零」的面，或者从虚物出发的光线。
 */
export function hitSurface(ray: Ray, v: number, R: number): { q: V2; normal: V2 } | null {
  if (!Number.isFinite(R)) {
    const t = (v - ray.p[0]) / ray.d[0];
    return { q: add2(ray.p, scale2(t, ray.d)), normal: [1, 0] };
  }
  const c: V2 = [v + R, 0];
  const m = sub2(ray.p, c);
  const b = dot2(m, ray.d);
  const disc = b * b - (dot2(m, m) - R * R);
  if (disc < 0) return null;
  const s = Math.sqrt(disc);
  for (const t of [-b - s, -b + s]) {
    const q = add2(ray.p, scale2(t, ray.d));
    if ((q[0] - c[0]) * (v - c[0]) > 0) return { q, normal: unit2(sub2(q, c)) };
  }
  return null;
}

/** 光线在顶点为 v、半径为 R 的面上从 n1 折射进 n2。 */
export function refractAt(ray: Ray, v: number, R: number, n1: number, n2: number): Ray | null {
  const h = hitSurface(ray, v, R);
  if (!h) return null;
  const d = refract(ray.d, h.normal, n1, n2);
  return d ? { p: h.q, d } : null;
}

/** 光线在顶点为 v、半径为 R 的镜面上反射。 */
export function reflectAt(ray: Ray, v: number, R: number): Ray | null {
  const h = hitSurface(ray, v, R);
  return h ? { p: h.q, d: reflect(ray.d, h.normal) } : null;
}

/** 光线所在直线和光轴（y = 0）的交点的 x 坐标。 */
export const axisCrossing = (ray: Ray): number => ray.p[0] - (ray.p[1] * ray.d[0]) / ray.d[1];

/** 两条光线所在直线的交点。 */
export function intersect(a: Ray, b: Ray): V2 {
  const den = a.d[0] * b.d[1] - a.d[1] * b.d[0];
  const w = sub2(b.p, a.p);
  const t = (w[0] * b.d[1] - w[1] * b.d[0]) / den;
  return add2(a.p, scale2(t, a.d));
}

/** 近轴极限：g(ε) = g₀ + aε² + bε⁴ + …，用 ε 和 ε/2 两点做理查森外推，消去 ε² 项。 */
export const paraxialLimit = (g: (eps: number) => number, eps: number): number => (4 * g(eps / 2) - g(eps)) / 3;

// ---------- 理想薄透镜和自由传播（按光路一步步算，不用矩阵乘法） ----------

/** 近轴光线：高度 y、和光轴的夹角 θ（向上为正）。 */
export interface PRay {
  y: number;
  th: number;
}
/** 自由传播距离 d。 */
export const travel = (r: PRay, d: number): PRay => ({ y: r.y + d * r.th, th: r.th });
/** 穿过焦距为 f 的理想薄透镜：高度不变，角度减去 y/f。 */
export const throughLens = (r: PRay, f: number): PRay => ({ y: r.y, th: r.th - r.y / f });
/** 光线在当前参考面之后多远处和高度为 0 的光轴相交（可以为负）。 */
export const crossAhead = (r: PRay): number => -r.y / r.th;

/** 两条近轴光线（都在同一个参考面上）所在直线的交点：返回 [在参考面之后的距离, 高度]。 */
export function meet(a: PRay, b: PRay): [number, number] {
  const z = (b.y - a.y) / (a.th - b.th);
  return [z, a.y + a.th * z];
}

// ---------- 波的叠加（批次 16） ----------

/** 一组次波（振幅 a、相位 φ）直接相加以后的光强 |Σ a e^{iφ}|²。 */
export function phasorIntensity(terms: Iterable<[number, number]>): number {
  let re = 0;
  let im = 0;
  for (const [a, ph] of terms) {
    re += a * Math.cos(ph);
    im += a * Math.sin(ph);
  }
  return re * re + im * im;
}

/**
 * 关于中心对称地排开的 n 个等强次波，相邻两个的相位差为 phi：振幅之和（实数，会变号），
 * Σ_j cos(phi·(j − (n−1)/2))。用来在暗纹处二分（光强只碰到零、不变号，振幅才变号）。
 */
export function symmetricSum(n: number, phi: number): number {
  let s = 0;
  const c = (n - 1) / 2;
  for (let j = 0; j < n; j++) s += Math.cos(phi * (j - c));
  return s;
}

/** 宽为 a 的单缝在方向 sinθ = s 上的相对光强 I/I(0)：把缝分成 n 段，各段的次波直接相加（夫琅禾费，垂直入射）。 */
export function slitRelIntensity(a: number, lambda: number, s: number, n = 4000): number {
  const amp = symmetricSum(n, (2 * Math.PI * (a / n) * s) / lambda);
  return (amp / n) ** 2;
}

/**
 * 法布里-珀罗：两面振幅反射率都是 r（反射率 R = r²）、不吸收，往返相位差 delta。
 * 透射的各束光振幅依次是 t²·(r²e^{iδ})^k，直接相加 K 项后取模平方（t² = 1 − R）。
 */
export function multiBeamT(R: number, delta: number, K = 4000): number {
  let re = 0;
  let im = 0;
  let amp = 1 - R;
  for (let k = 0; k < K; k++) {
    re += amp * Math.cos(k * delta);
    im += amp * Math.sin(k * delta);
    amp *= R;
    if (amp < 1e-18) break;
  }
  return re * re + im * im;
}

// ---------- 偏振（批次 17） ----------
// 不用琼斯矩阵：在一个固定位置上把电场写成时间的函数 E(t) = (Ex(t), Ey(t))，取 ω = 1，一个周期 2π；
// 元件按物理作用逐个改写这个函数：偏振片取瞬时电场沿透振方向的投影，波片让慢轴分量在时间上推迟 δ（ω = 1 时推迟 δ 就是相位落后 δ）。
// 坐标约定和讲解一样：迎着光看，x 向右、y 向上、z 指向看的人。

/** 固定位置上的电场随时间的变化（ω = 1）。 */
export type Field = (t: number) => V2;
/** Ex = Ax cos t，Ey = Ay cos(t − δ)：δ 是 Ey 比 Ex 落后的相位。 */
export const fieldOf = (Ax: number, Ay: number, delta: number): Field => (t) => [Ax * Math.cos(t), Ay * Math.cos(t - delta)];
/** 一个周期上 n 个等距时刻的平均 ⟨|E|²⟩；|E|² 是次数不超过 2 的三角多项式，n ≥ 3 时这个平均是精确的。 */
export function meanSq(E: Field, n = 360): number {
  let s = 0;
  for (let j = 0; j < n; j++) {
    const e = E((2 * Math.PI * j) / n);
    s += e[0] * e[0] + e[1] * e[1];
  }
  return s / n;
}
/** 理想偏振片，透振方向和 x 轴成 theta（弧度）：只留下瞬时电场沿透振方向的分量。 */
export const polarizer = (theta: number) => (E: Field): Field => {
  const u = dirOf(theta);
  return (t) => scale2(dot2(E(t), u), u);
};
/** 波片：快轴和 x 轴成 theta，慢轴方向的分量在时间上推迟 delta（相位落后 delta），快轴分量不变。 */
export const wavePlate = (theta: number, delta: number) => (E: Field): Field => {
  const f = dirOf(theta);
  const s = dirOf(theta + Math.PI / 2);
  return (t) => add2(scale2(dot2(E(t), f), f), scale2(dot2(E(t - delta), s), s));
};
/** 迎着光看电场端点的转向：Ex·dEy/dt − Ey·dEx/dt 在一个周期上的平均（数值求导）；正为逆时针（左旋），负为顺时针（右旋），线偏振为 0。 */
export function spin(E: Field, n = 720): number {
  const h = 1e-5;
  let s = 0;
  for (let j = 0; j < n; j++) {
    const t = (2 * Math.PI * j) / n;
    const e = E(t);
    const a = E(t + h);
    const b = E(t - h);
    s += e[0] * (a[1] - b[1]) / (2 * h) - e[1] * (a[0] - b[0]) / (2 * h);
  }
  return s / n;
}
/** 电场端点轨迹到原点的最大、最小距离（在一个周期上取 n 个时刻，再在最小处附近用黄金分割细化）。 */
export function radii(E: Field, n = 3600): [number, number] {
  const r = (t: number) => Math.hypot(...E(t));
  let max = 0;
  let min = Infinity;
  let tMin = 0;
  for (let j = 0; j < n; j++) {
    const t = (2 * Math.PI * j) / n;
    const v = r(t);
    if (v > max) max = v;
    if (v < min) {
      min = v;
      tMin = t;
    }
  }
  const h = (2 * Math.PI) / n;
  const tBest = argmaxLocal((t) => -r(t), tMin - h, tMin + h);
  return [max, Math.min(min, r(tBest))];
}
/** 区间上的黄金分割求最大（只在这个文件里用，避免和借来的 argmax 互相依赖）。 */
function argmaxLocal(f: (x: number) => number, lo: number, hi: number): number {
  const g = (Math.sqrt(5) - 1) / 2;
  let a = lo;
  let b = hi;
  let c = b - g * (b - a);
  let d = a + g * (b - a);
  for (let k = 0; k < 200; k++) {
    if (f(c) > f(d)) b = d;
    else a = c;
    c = b - g * (b - a);
    d = a + g * (b - a);
  }
  return (a + b) / 2;
}
/**
 * 用转动的理想偏振片检查一束光（可以是几束互不相干的光，光强直接相加）：透振方向 θ 在 [0, π) 上粗扫 n 格，
 * 再在最大、最小的格点附近用黄金分割细化。返回最大、最小光强和对应的 θ（弧度）。
 */
export function analyze(beams: Field[], n = 720): { max: number; min: number; thMax: number; thMin: number } {
  const I = (th: number) => beams.reduce((s, E) => s + meanSq(polarizer(th)(E), 12), 0);
  let iMax = 0;
  let iMin = 0;
  let vMax = -Infinity;
  let vMin = Infinity;
  for (let j = 0; j < n; j++) {
    const v = I((Math.PI * j) / n);
    if (v > vMax) {
      vMax = v;
      iMax = j;
    }
    if (v < vMin) {
      vMin = v;
      iMin = j;
    }
  }
  const h = Math.PI / n;
  const thMax = argmaxLocal(I, (iMax - 1) * h, (iMax + 1) * h);
  const thMin = argmaxLocal((t) => -I(t), (iMin - 1) * h, (iMin + 1) * h);
  return { max: Math.max(vMax, I(thMax)), min: Math.min(vMin, I(thMin)), thMax, thMin };
}
/** 归一化的斯托克斯参量 (s1, s2, s3)：⟨Ex² − Ey²⟩、⟨2ExEy⟩ 和转向（spin）各除以 ⟨Ex² + Ey²⟩；两束完全偏振的光偏振态相同，当且仅当三者都相等。 */
export function stokes(E: Field, n = 360): [number, number, number] {
  let s0 = 0;
  let s1 = 0;
  let s2 = 0;
  for (let j = 0; j < n; j++) {
    const e = E((2 * Math.PI * j) / n);
    s0 += e[0] * e[0] + e[1] * e[1];
    s1 += e[0] * e[0] - e[1] * e[1];
    s2 += 2 * e[0] * e[1];
  }
  return [s1 / s0, s2 / s0, spin(E, n) / (s0 / n)];
}
/** 自然光：偏振方向在 [0, π) 上均匀分布的 m 束线偏振光，强度各 1/m，互不相干（光强直接相加）。返回每一束的电场。 */
export function naturalLight(m = 720): Field[] {
  const out: Field[] = [];
  const a = Math.sqrt(2 / m); // ⟨|E|²⟩ = a²/2 = 1/m
  for (let j = 0; j < m; j++) {
    const phi = (Math.PI * (j + 0.5)) / m;
    out.push((t) => scale2(a * Math.cos(t), dirOf(phi)));
  }
  return out;
}
