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
