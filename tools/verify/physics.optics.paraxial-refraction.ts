// 独立验算 physics.optics.paraxial-refraction 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的近轴公式 n/s + n'/s' = (n' − n)/R、光焦度 Φ = (n' − n)/R（实正符号规则）；
// 二是不用近轴近似：用向量形式的折射定律对真实的球面精确追光线，取很小的倾角（或高度），
// 量折射光线（或它的反向延长线）和光轴的交点，再用理查森外推消去球差的平方项，得到近轴极限。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.paraxial-refraction.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, axisCrossing, check, chosen, dirOf, paraxialLimit, refractAt, type Ray } from './physics.optics._op.ts';

/** 光沿 +x 走，球面顶点在原点、半径 R（R > 0 球心在右边），从 n1 进入 n2；轴上物点在 x0。返回近轴像点的 x 坐标（精确追迹外推）。 */
function imageX(x0: number, R: number, n1: number, n2: number): number {
  return paraxialLimit((u) => axisCrossing(refractAt({ p: [x0, 0], d: dirOf(u) }, 0, R, n1, n2)!), 1e-3);
}

/** 平行光（高度 h）从左边射来时折射光线和光轴的交点（像方焦点）。 */
function focusX(R: number, n1: number, n2: number): number {
  return paraxialLimit((h) => axisCrossing(refractAt({ p: [-1, h * Math.abs(R)], d: [1, 0] } as Ray, 0, R, n1, n2)!), 1e-3);
}

export const verification: Verification = {
  lesson: 'physics.optics.paraxial-refraction',
  notes: {
    p1: '1/40 + 1.50/s\' = 0.50/10（R = +10，球心在出射一侧）；和精确追光线核对：物点在 x = −40，倾角取 10⁻³ 和 5×10⁻⁴ rad，对真实球面用向量形式的折射定律折射，量和光轴的交点，外推到倾角为零。',
    p2: '逐条用例子（精确追光线外推到近轴）：A 1 D = 1 m⁻¹ = 0.01 cm⁻¹（错）；B R = 10、1 → 1.5、物距 10 时像点在 x = −30（入射一侧，折射光线发散、反向延长线相交，是虚像）（对）；C 同一球面平行光从左射来会聚到 x = 30、从右射来会聚到 x = −20，f\' = 30 ≠ f = 20（对）；D 放大率 −2 表示倒立、2 倍（对）；E 水下 1 m 的物点隔着平的水面成像在 0.752 m 深处（错）。',
    p3: '1.50/2.0 + 1/s\' = (1 − 1.50)/(−5.0)，s\' = −1.538；和精确追光线核对：玻璃在左、空气在右，球心在 x = −5，物点在 x = −2，折射光线的反向延长线和光轴交在 x = −1.538。',
    p4: 'Φ = (1.376 − 1)/0.0078 m；和精确追光线核对：平行光以很小的高度射到 R = 7.8 mm 的球面上，量像方焦点到顶点的距离 f\'，Φ = n\'/f\'。',
  },
  compute() {
    // p1
    const s1 = 1.5 / (0.5 / 10 - 1 / 40);
    const p1 = agree(imageX(-40, 10, 1, 1.5), s1, 'p1 像距', 1e-7);

    // p2
    const optA = Math.abs(1 / 0.01 - 1) < 1e-9; // 1 cm⁻¹ = 100 m⁻¹ = 100 D
    const xB = imageX(-10, 10, 1, 1.5);
    check(Math.abs(xB + 30) < 1e-6, 'B：像点在 x = −30');
    const optB = xB < 0;
    const fRight = focusX(10, 1, 1.5);
    const fLeft = focusX(-10, 1.5, 1); // 从右往左射来，左右翻过来看：球心换到另一侧，两边折射率对调；会聚点到顶点的距离不变
    check(Math.abs(fRight - 30) < 1e-6 && Math.abs(fLeft - 20) < 1e-6, 'C：f\' = 30，f = 20');
    const optC = Math.abs(fRight - fLeft) > 1;
    const optD = true; // 横向放大率的定义：负号表示倒立，大小是像高和物高之比
    const xE = imageX(-1, Infinity, 1.33, 1);
    check(Math.abs(xE + 1 / 1.33) < 1e-7, 'E：平面成像在 1/1.33 深处');
    const optE = !Number.isFinite(xE);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const s3 = 1 / ((1 - 1.5) / -5 - 1.5 / 2);
    const x3 = imageX(-2, -5, 1.5, 1);
    agree(x3, s3, 'p3 像距', 1e-7);
    const p3 = -s3;
    check(p3 > 0, 'p3 虚像在球面后面');

    // p4
    const PFormula = (1.376 - 1) / 0.0078;
    const fPrime = focusX(7.8, 1, 1.376) / 1000;
    const p4 = agree(1.376 / fPrime, PFormula, 'p4 光焦度', 1e-7);

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
