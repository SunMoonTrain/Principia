// 独立验算 physics.optics.reflection-refraction 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（折射定律 n₁ sinθ₁ = n₂ sinθ₂、平行板侧移、两次反射转过两镜夹角的 2 倍）；
// 二是不用这些式子：p1 用费马原理，对界面上的通过点做黄金分割搜索使光程最短，再二分调出射点的位置；
// p3 用向量形式的折射定律逐面追光线，量两条平行线的距离；p4 在两面镜子之间逐次求交、反射，换几个入射方向都试。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.reflection-refraction.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { add2, agree, angleBetween, argmax, bisect, check, chosen, deg, dirOf, refract, reflect, scale2, type V2 } from './physics.optics._op.ts';

const C_LIGHT = 299792458;

/** 费马原理：A 在空气里、B 在折射率 n 的介质里，界面是 y = 0。对通过点 x 求光程最短的位置。 */
function fermatCrossing(A: V2, B: V2, n: number): number {
  const L = (x: number) => Math.hypot(x - A[0], A[1]) + n * Math.hypot(B[0] - x, B[1]);
  return argmax((x) => -L(x), A[0], B[0]);
}

/** 射线和从原点出发、方向角为 phi、长 6 的镜面的交点参数；没有交点返回 null。 */
function hitMirror(p: V2, d: V2, phi: number): number | null {
  const m = dirOf(phi);
  const den = d[0] * m[1] - d[1] * m[0];
  if (Math.abs(den) < 1e-15) return null;
  // p + t d = s m
  const t = (p[1] * m[0] - p[0] * m[1]) / den;
  const s = (p[1] * d[0] - p[0] * d[1]) / den;
  return t > 1e-12 && s > 0 && s < 6 ? t : null;
}

/** 在夹角为 alpha 的两面镜子（方向角 0 和 alpha）之间追光线，返回 [反射次数, 最后的方向]。 */
function bounce(p0: V2, d0: V2, alpha: number): [number, V2] {
  let p = p0;
  let d = d0;
  let count = 0;
  for (let k = 0; k < 20; k++) {
    const t1 = hitMirror(p, d, 0);
    const t2 = hitMirror(p, d, alpha);
    if (t1 === null && t2 === null) break;
    const useFirst = t2 === null || (t1 !== null && t1 < t2);
    const t = useFirst ? t1! : t2!;
    const phi = useFirst ? 0 : alpha;
    const normal: V2 = [-Math.sin(phi), Math.cos(phi)];
    p = add2(p, scale2(t, d));
    d = reflect(d, normal);
    count++;
  }
  return [count, d];
}

export const verification: Verification = {
  lesson: 'physics.optics.reflection-refraction',
  notes: {
    p1: 'sinθ₂ = sin60°/1.50；和费马原理核对：A(−tan60°, 1) 在空气里，B(X, −1) 在玻璃里，对界面上的通过点做黄金分割搜索使光程最短，再二分调 X 使通过点正好在原点（入射角就是 60°），折射角 = arctan X。',
    p2: '逐条用例子：A 入射角 89.9999° 时用向量形式的折射定律算出折射角 41.81°，小于 42°（对）；B 频率不变、波长变成 1/1.33 倍（错）；C c/1.5 = 1.999×10⁸ m/s，和 2.0×10⁸ 相差不到 1%（对）；D 从 n = 1.33 斜射进 n = 1.5，入射角 40° 时折射角 34.7°，偏向法线（对）；E 入射角 20° 和 40° 的折射角之比不是 2（错）。',
    p3: '侧移 = t·sin(θ − θ₂)/cosθ₂；和逐面追光线核对：用向量形式的折射定律在 y = 0、y = −t 两个面上各折射一次，量出射线到入射线所在直线的距离，并核对出射方向和入射方向平行。',
    p4: '两次反射方向转过 2 × 60° = 120°；和逐次求交、反射核对：两面镜子的方向角为 0° 和 60°，镜长 6，从开口射进六条不同方向的光线，只取正好反射两次的，出射方向和入射方向的夹角都是 120°。',
  },
  compute() {
    // p1
    const n = 1.5;
    const th2 = Math.asin(Math.sin(60 * deg) / n) / deg;
    const A: V2 = [-Math.tan(60 * deg), 1];
    const X = bisect((x) => fermatCrossing(A, [x, -1], n), 0, 5);
    const p1 = agree(Math.atan(X) / deg, th2, 'p1 折射角', 1e-7);

    // p2
    // 入射角 θ（和法线 (0, −1) 的夹角）的方向是 dirOf(−(90° − θ))；θ = 89.9999° 时几乎贴着界面射来
    const graze = refract(dirOf(-1e-4 * deg), [0, 1], 1, 1.5)!;
    const maxRefr = angleBetween(graze, [0, -1]) / deg;
    check(maxRefr < 42 && maxRefr > 41.8, 'A：最大折射角 41.81°');
    const lamRatio = 1 / 1.33;
    const optB = Math.abs(lamRatio - 1) < 1e-9;
    const v = C_LIGHT / 1.5;
    const optC = Math.abs(v - 2.0e8) / 2.0e8 < 0.01;
    const inc = dirOf(-50 * deg); // 入射角 40°（和法线 (0, −1) 的夹角）
    const out = refract(inc, [0, 1], 1.33, 1.5)!;
    const optD = angleBetween(out, [0, -1]) < angleBetween(inc, [0, -1]);
    const r20 = Math.asin(Math.sin(20 * deg) / 1.5);
    const r40 = Math.asin(Math.sin(40 * deg) / 1.5);
    const optE = Math.abs(r40 / r20 - 2) < 1e-9;
    check(!optE && Math.abs(r40 / r20 - 2) > 0.05, 'E：比值明显不是 2');
    const p2 = chosen([true, optB, optC, optD, optE]);

    // p3（长度用 mm）
    const t = 10;
    const thi = 45 * deg;
    const tht = Math.asin(Math.sin(thi) / n);
    const shiftFormula = (t * Math.sin(thi - tht)) / Math.cos(tht);
    const d0 = dirOf(-45 * deg);
    const dIn = refract(d0, [0, 1], 1, n)!;
    const P2 = scale2(-t / dIn[1], dIn); // 从原点走到 y = −t
    const dOut = refract(dIn, [0, 1], n, 1)!;
    check(angleBetween(dOut, d0) < 1e-12, 'p3 出射光线和入射光线平行');
    const shiftTrace = Math.abs(P2[0] * d0[1] - P2[1] * d0[0]);
    const p3 = agree(shiftTrace, shiftFormula, 'p3 侧移', 1e-9);

    // p4
    const alpha = 60 * deg;
    const angles: number[] = [];
    for (const [px, py, a] of [
      [3, 1.0, 240],
      [3, 0.5, 250],
      [4, 1.0, 230],
      [3, 1.0, 260],
      [5, 1.5, 225],
      [3, 0.5, 200],
    ] as const) {
      const d = dirOf(a * deg);
      const [count, dEnd] = bounce([px, py], d, alpha);
      if (count === 2) angles.push(angleBetween(d, dEnd) / deg);
    }
    check(angles.length >= 3, 'p4 至少三条光线正好反射两次');
    for (const a of angles) agree(a, 120, 'p4 出射和入射方向的夹角', 1e-9);
    const p4 = agree(angles[0], 2 * 60, 'p4');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
