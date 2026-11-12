// 独立验算 physics.optics.prisms-dispersion 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（薄棱镜 δ ≈ (n − 1)A、最小偏向角 n = sin((A + δ)/2)/sin(A/2)、阿贝数 V = (n_d − 1)/(n_F − n_C)）；
// 二是不用这些式子：用向量形式的折射定律逐面追光线穿过棱镜，p1 取顶角很小的棱镜、垂直入射，偏向角除以顶角后外推到顶角为零；
// p3 对入射角做黄金分割搜索求最小偏向角，再二分调折射率使它等于 48.0°；p4 用透镜制造者公式算三条谱线下的光焦度，V = Φ_d/(Φ_F − Φ_C)。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.prisms-dispersion.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, angleBetween, argmax, bisect, check, chosen, deg, dirOf, paraxialLimit, refract, type V2 } from './physics.optics._op.ts';

const C_LIGHT = 299792458;

/** 顶角 A、顶点朝上、关于 y 轴对称的棱镜：入射面、出射面的外法线。 */
function faces(A: number): { n1: V2; n2: V2 } {
  return { n1: [-Math.cos(A / 2), Math.sin(A / 2)], n2: [Math.cos(A / 2), Math.sin(A / 2)] };
}

/** 入射角 i（弧度）的光线穿过顶角 A、折射率 n 的棱镜（外面折射率 n0）后的偏向角；在出射面全反射时返回 null。 */
function deviation(A: number, n: number, i: number, n0 = 1): { delta: number; r1: number } | null {
  const { n1, n2 } = faces(A);
  const dIn = dirOf(-A / 2 + i); // 入射面的内法线方向角是 −A/2，入射光线比它朝上转 i
  const dMid = refract(dIn, n1, n0, n);
  if (!dMid) return null;
  const dOut = refract(dMid, n2, n, n0);
  if (!dOut) return null;
  const r1 = angleBetween(dMid, [-n1[0], -n1[1]]);
  return { delta: angleBetween(dIn, dOut), r1 };
}

/** 最小偏向角：对入射角做黄金分割搜索（出射面全反射的入射角当作偏向角很大）。 */
function minDeviation(A: number, n: number, n0 = 1): { delta: number; i: number; r1: number } {
  const f = (i: number) => {
    const r = deviation(A, n, i, n0);
    return r ? r.delta : 10;
  };
  const i = argmax((x) => -f(x), 0, 89.999 * deg);
  const r = deviation(A, n, i, n0)!;
  return { delta: r.delta, i, r1: r.r1 };
}

export const verification: Verification = {
  lesson: 'physics.optics.prisms-dispersion',
  notes: {
    p1: 'δ ≈ (1.52 − 1) × 4.0°；和逐面追光线核对：顶角取 4.0° × ε、垂直入射，用向量形式的折射定律穿过两个面，偏向角除以 ε，取 ε = 0.01 和 0.005 外推到 ε → 0（顶角 4.0° 时照实追，垂直入射 2.087°、最小偏向 2.082°）。',
    p2: '逐条用例子（都用向量形式的折射定律逐面追光线）：A 顶角 60°、n = 1.5 时最小偏向的入射角 48.6°、折射角 30.0°，和是 78.6°，不互余（错）；B 顶角 60° 时 n = 1.5、1.6 的最小偏向角 37.2°、46.3°，越大越大（对）；C n_C = 1.514 < n_F = 1.522，红光的速度 c/n 比紫光大（错）；D 顶角 4°、n = 1.52 的棱镜在空气里和在 n = 1.33 的水里，最小偏向角 2.08° 和 0.57°（对）；E n_d = 1.6，V = 30 时 n_F − n_C = 0.020，V = 60 时 0.010（对）。',
    p3: 'n = sin54°/sin30°；和逐面追光线核对：对给定的 n 在入射角上做黄金分割搜索求最小偏向角，再二分调 n 使它等于 48.0°。',
    p4: 'V = (1.6200 − 1)/(1.6320 − 1.6150)；和透镜的光焦度核对：取 R₁ = 10、R₂ = −15 的薄透镜，按透镜制造者公式算三条谱线下的光焦度，V = Φ_d/(Φ_F − Φ_C)。',
  },
  compute() {
    // p1
    const n = 1.52;
    const A1 = 4.0;
    const thin = (n - 1) * A1;
    const normalDev = (Adeg: number) => {
      const { n1, n2 } = faces(Adeg * deg);
      const d0: V2 = [-n1[0], -n1[1]];
      const d2 = refract(refract(d0, n1, 1, n)!, n2, n, 1)!;
      return angleBetween(d0, d2) / deg;
    };
    const p1 = agree(paraxialLimit((e) => normalDev(A1 * e) / e, 0.01), thin, 'p1 薄棱镜偏向角', 1e-7);
    // 照实追：顶角 4.0° 时
    check(Math.abs(normalDev(4) - 2.087) < 5e-4, 'p1 垂直入射照实追 2.087°');
    check(Math.abs(minDeviation(4 * deg, n).delta / deg - 2.082) < 5e-4, 'p1 最小偏向照实追 2.082°');

    // p2
    const m60 = minDeviation(60 * deg, 1.5);
    const sumA = (m60.i + m60.r1) / deg;
    check(Math.abs(m60.r1 / deg - 30) < 1e-4 && Math.abs(sumA - 78.59) < 0.01, 'A：48.6° + 30.0° = 78.6°');
    const optA = Math.abs(sumA - 90) < 1e-6;
    const d15 = minDeviation(60 * deg, 1.5).delta / deg;
    const d16 = minDeviation(60 * deg, 1.6).delta / deg;
    check(Math.abs(d15 - 37.18) < 0.01 && Math.abs(d16 - 46.26) < 0.01, 'B：37.2° 和 46.3°');
    const optB = d16 > d15;
    const nC = 1.514;
    const nF = 1.522;
    const optC = C_LIGHT / nC < C_LIGHT / nF;
    const air = minDeviation(4 * deg, 1.52).delta / deg;
    const water = minDeviation(4 * deg, 1.52, 1.33).delta / deg;
    check(Math.abs(air - 2.08) < 0.005 && Math.abs(water - 0.571) < 0.005, 'D：2.08° 和 0.57°');
    const optD = water < air;
    const dn = (V: number) => (1.6 - 1) / V;
    const optE = dn(30) > dn(60);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const A3 = 60 * deg;
    const nFormula = Math.sin((A3 + 48 * deg) / 2) / Math.sin(A3 / 2);
    const nTrace = bisect((x) => minDeviation(A3, x).delta - 48 * deg, 1.3, 1.9);
    const p3 = agree(nTrace, nFormula, 'p3 折射率', 1e-9);

    // p4
    const [c, d, F] = [1.615, 1.62, 1.632];
    const Vdef = (d - 1) / (F - c);
    const power = (nn: number) => (nn - 1) * (1 / 10 - 1 / -15);
    const p4 = agree(power(d) / (power(F) - power(c)), Vdef, 'p4 阿贝数', 1e-9);

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
