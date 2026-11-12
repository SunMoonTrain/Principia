// 独立验算 physics.optics.aberrations 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（色差 f_C − f_F ≈ f/V、球面镜的纵向球差 ≈ h²/(8f)、消色差条件 Φ₁/V₁ + Φ₂/V₂ = 0）；
// 二是：p1 对透镜制造者公式的焦距按折射率做数值微分，乘 n_F − n_C；p3 对真实球面镜用向量形式的反射定律精确追光线，
// 量球差除以 h² 外推到 h → 0 再乘 h²；p4 取具体的两种玻璃（各给 n_C、n_d、n_F），在冕牌那块的形状因子上二分，使双透镜对 C、F 两线的焦距相等。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.aberrations.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, axisCrossing, bisect, check, chosen, paraxialLimit, reflectAt, refractAt } from './physics.optics._op.ts';

/** 半径为 R 的凹面镜（球心在镜前），高度 h 的平行光反射后和光轴的交点到顶点的距离。 */
const mirrorCross = (R: number, h: number): number => -axisCrossing(reflectAt({ p: [-1, h], d: [1, 0] }, 0, -R)!);

/** 双凸薄透镜（R₁ = 10、R₂ = −10，厚度为零），高度 h 的平行光折射后和光轴的交点。 */
const lensCross = (n: number, h: number): number => axisCrossing(refractAt(refractAt({ p: [-1, h], d: [1, 0] }, 0, 10, 1, n)!, 0, -10, n, 1)!);

export const verification: Verification = {
  lesson: 'physics.optics.aberrations',
  notes: {
    p1: 'f_C − f_F ≈ f/V = 200/60；和数值微分核对：f(n) = K/(n − 1)，K 取得使 f(n_d) = 200，n_d 分别取 1.5 和 1.7，n_F − n_C = (n_d − 1)/60，(n_F − n_C)·|df/dn| 都是 3.333（n_d − n_C 占 n_F − n_C 的 30% 时，照两条谱线的折射率直接算是 3.31，差约 0.6%，题面只给 V、说「大约」）。',
    p2: '逐条用例子（精确追光线）：A R = 100 cm 的球面镜，高 1 cm、5 cm 的平行光交轴点离顶点 49.997、49.937 cm，不重合（错）；B 同一面镜子不管光的颜色，交轴点都一样，但球差还在（错）；C 只用高 1 cm 以内的光，交轴点的散布从 0.063 cm 降到 0.003 cm（对）；D 双凸薄透镜 n_C = 1.514、n_F = 1.522，蓝光焦距 9.579 小于红光 9.728（对）；E 会聚的消色差双透镜 Φ = Φ₁ + Φ₂ > 0、Φ₁/V₁ + Φ₂/V₂ = 0，Φ₁ > 0 时只有 V₂ < V₁ 才行（对）。',
    p3: 'h²/(8f) = 0.05²/(8 × 0.50) m；和精确追光线核对：R = 1.0 m 的球面镜，量 R/2 和平行光交轴点到顶点的距离之差，除以 h² 后取 h = 10⁻³、5×10⁻⁴ m 外推到 h → 0，再乘 0.05²（h = 5.0 cm 照实追是 0.626 mm，题面写明按近似式）。',
    p4: 'Φ₁ = Φ·V₁/(V₁ − V₂)，f₁ = 200 × (64.2 − 36.4)/64.2；和具体玻璃核对：冕牌 n_d = 1.5168、火石 n_d = 1.6200，n_C、n_F 按各自的阿贝数分在 n_d 两边（n_d − n_C 占 30%），两块的形状因子 K₁、K₂ 满足 Φ_d = 1/200；在 K₁ 上二分使 Φ_C = Φ_F，f₁ = 1/((n_d1 − 1)K₁)。',
  },
  compute() {
    // p1
    const f = 200;
    const V = 60;
    const est = f / V;
    for (const nd of [1.5, 1.7]) {
      const K = f * (nd - 1);
      const fn = (n: number) => K / (n - 1);
      const dfdn = (fn(nd + 1e-6) - fn(nd - 1e-6)) / 2e-6;
      agree(Math.abs(dfdn) * ((nd - 1) / V), est, `p1 n_d = ${nd} 的数值微分`, 1e-7);
      const dn = (nd - 1) / V;
      const direct = fn(nd - 0.3 * dn) - fn(nd + 0.7 * dn);
      check(Math.abs(direct / est - 1) > 0.005 && Math.abs(direct / est - 1) < 0.008, `p1 n_d = ${nd} 直接算差约 0.6%`);
    }
    const p1 = est;

    // p2
    const x1 = mirrorCross(100, 1);
    const x5 = mirrorCross(100, 5);
    check(Math.abs(x1 - 49.997) < 1e-3 && Math.abs(x5 - 49.937) < 1e-3, 'A：49.997 和 49.937');
    const optA = Math.abs(x1 - x5) < 1e-9;
    const optB = false; // 反射和波长无关，色差没有了；但 x1 ≠ x5，球差还在
    const spreadAll = Math.abs(50 - x5);
    const spreadSmall = Math.abs(50 - x1);
    check(Math.abs(spreadAll - 0.063) < 1e-3 && Math.abs(spreadSmall - 0.0025) < 1e-3, 'C：散布 0.063 和 0.003');
    const optC = spreadSmall < spreadAll;
    const fC = paraxialLimit((h) => lensCross(1.514, h), 1e-2);
    const fF = paraxialLimit((h) => lensCross(1.522, h), 1e-2);
    check(Math.abs(fC - 9.728) < 1e-3 && Math.abs(fF - 9.579) < 1e-3, 'D：9.728 和 9.579');
    const optD = fF < fC;
    // E：Φ₁ = Φ V₁/(V₁ − V₂) > 0 且 Φ > 0 ⇔ V₁ > V₂（Φ₂ = −Φ₁V₂/V₁ < 0）
    const P = 1;
    const tryPair = (V1: number, V2: number) => {
      const P1 = (P * V1) / (V1 - V2);
      const P2 = P - P1;
      return P1 > 0 && P2 < 0;
    };
    check(tryPair(64.2, 36.4) && !tryPair(36.4, 64.2), 'E：正透镜用 V 大的、负透镜用 V 小的才成立');
    const optE = true;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const R = 1.0;
    const h = 0.05;
    const approx = (h * h) / (8 * (R / 2)) * 1000;
    const coef = paraxialLimit((hh) => (R / 2 - mirrorCross(R, hh)) / (hh * hh), 1e-3);
    const p3 = agree(coef * h * h * 1000, approx, 'p3 球差', 1e-7);
    check(Math.abs((R / 2 - mirrorCross(R, h)) * 1000 - 0.626) < 5e-4, 'p3 照实追 0.626 mm');

    // p4
    const [V1, V2] = [64.2, 36.4];
    const f1Formula = (f * (V1 - V2)) / V1;
    const glass = (nd: number, Vg: number) => {
      const dn = (nd - 1) / Vg;
      return { C: nd - 0.3 * dn, d: nd, F: nd + 0.7 * dn };
    };
    const g1 = glass(1.5168, V1);
    const g2 = glass(1.62, V2);
    const K2of = (K1: number) => (1 / f - (g1.d - 1) * K1) / (g2.d - 1);
    const power = (K1: number, line: 'C' | 'd' | 'F') => (g1[line] - 1) * K1 + (g2[line] - 1) * K2of(K1);
    const K1 = bisect((k) => power(k, 'F') - power(k, 'C'), 1e-4, 1);
    agree(1 / power(K1, 'd'), f, 'p4 双透镜焦距', 1e-9);
    const p4 = agree(1 / ((g1.d - 1) * K1), f1Formula, 'p4 冕牌透镜的焦距', 1e-9);

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
