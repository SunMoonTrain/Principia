// 独立验算 physics.optics.thin-lenses 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（透镜制造者公式 1/f = (n − 1)(1/R₁ − 1/R₂)、高斯公式 1/s + 1/s' = 1/f、m = −s'/s，实正符号规则）；
// 二是不用这些公式：p1 对真实的球面和平面用向量形式的折射定律精确追光线（厚度为零，再用 0.5 cm 厚的透镜核对等效焦距），外推到近轴；
// p3、p4 把理想薄透镜只当作「高度不变、角度减去 y/f」的元件，从物点发出两条光线一步步追，求交点，再在物距或焦距上二分。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.thin-lenses.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, axisCrossing, bisect, check, chosen, meet, paraxialLimit, refractAt, throughLens, travel, type PRay } from './physics.optics._op.ts';

/** 物点（高 y0）在透镜前 s 处，从它发出的两条光线穿过焦距 f 的薄透镜后的交点：[在透镜后多远（负为透镜前）, 高度]。 */
function lensImage(s: number, y0: number, f: number): [number, number] {
  const a = throughLens(travel({ y: y0, th: 0.01 }, s), f);
  const b = throughLens(travel({ y: y0, th: -0.02 }, s), f);
  return meet(a, b);
}

export const verification: Verification = {
  lesson: 'physics.optics.thin-lenses',
  notes: {
    p1: '1/f = (1.52 − 1)(1/26 − 0)；和精确追光线核对：凸面（R = 26，球心在右）和平面都在 x = 0（厚度为零），平行光高度取 26 × 10⁻³、26 × 5×10⁻⁴，逐面折射，量和光轴的交点，外推到近轴；再用 0.5 cm 厚的同一块透镜量等效焦距 h/(−tan u\')，平凸透镜的平面在后时也是 50。',
    p2: '逐条用例子（薄透镜只当作「高度不变、角度减去 y/f」）：A f = +20 和 −20 贴在一起，任意光线 (y, θ) 穿过后不变（对）；B f = 10、实物物距 30，两条光线交在透镜后 15 处（对）；解答说的虚物例外也核了：射向透镜后 5 处的会聚光交在透镜后 3.33 处，和虚物同侧；C f = 10、物距 5，交点在透镜前 10 处，和物同侧（错）；D 远点 2 m 的近视眼要把无穷远成像到眼前 2 m，焦距 −2 m，光焦度 −0.5 D（对）；E 只让物点发出、穿过透镜下半部分的光线通过，它们仍交在同一点，像完整、只是变暗（错）。',
    p3: '1/s = 1/10 − 1/300，宽 = 2.40 × 300/s；和一步步追光线核对：胶片边缘的点发出两条光线，在物距上二分，使交点在透镜后 300 cm，量交点高度。',
    p4: 'Φ = 1/0.25 − 1/0.75；和一步步追光线核对：书上的点在镜前 0.25 m，两条光线穿过镜片后反向延长相交；在焦距上二分，使交点在镜前 0.75 m（近点）。',
  },
  compute() {
    // p1
    const n = 1.52;
    const fFormula = 1 / ((n - 1) * (1 / 26 - 0));
    const thin = paraxialLimit((h) => {
      const r1 = refractAt({ p: [-1, 26 * h], d: [1, 0] }, 0, 26, 1, n)!;
      return axisCrossing(refractAt(r1, 0, Infinity, n, 1)!);
    }, 1e-3);
    const p1 = agree(thin, fFormula, 'p1 焦距', 1e-7);
    const efl = paraxialLimit((h) => {
      const r1 = refractAt({ p: [-1, 26 * h], d: [1, 0] }, 0, 26, 1, n)!;
      const r2 = refractAt(r1, 0.5, Infinity, n, 1)!;
      return (26 * h) / (-r2.d[1] / r2.d[0]);
    }, 1e-3);
    agree(efl, fFormula, 'p1 厚透镜的等效焦距', 1e-7);

    // p2
    const pair = (r: PRay) => throughLens(throughLens(r, 20), -20);
    const optA = [
      { y: 1, th: 0 },
      { y: 0.5, th: 0.03 },
      { y: -2, th: -0.01 },
    ].every((r) => {
      const o = pair(r);
      return Math.abs(o.y - r.y) < 1e-12 && Math.abs(o.th - r.th) < 1e-12;
    });
    const [zB] = lensImage(30, 1, 10);
    check(Math.abs(zB - 15) < 1e-9, 'B：像在透镜后 15');
    const optB = zB > 0;
    // 解答 B 补的半句：虚物在出射一侧时，像和物可以在同一侧。射向透镜后 5 处的会聚光，经 f = 10 的透镜会聚在透镜后 3.33 处。
    const conv = [0.01, -0.02].map((th) => throughLens({ y: -5 * th, th }, 10)); // 在透镜处高 −5θ，延长线交光轴于透镜后 5
    const [zV] = meet(conv[0], conv[1]);
    check(Math.abs(zV - 10 / 3) < 1e-9, 'B 的解答：虚物在透镜后 5，像在透镜后 3.33，和虚物同侧');
    const [zC] = lensImage(5, 1, 10);
    check(Math.abs(zC + 10) < 1e-9, 'C：交点在透镜前 10');
    const optC = zC > 0;
    // D：无穷远来的平行光，穿过镜片后反向延长线交在镜前 2 m
    const fD = bisect((f) => {
      const a = throughLens({ y: 1, th: 0 }, f);
      return -a.y / a.th + 2; // 交点在镜片后 −a.y/a.th 处，要等于 −2
    }, -10, -0.1);
    check(Math.abs(fD + 2) < 1e-9, 'D：焦距 −2 m');
    const optD = 1 / fD < 0;
    // E：从物点 (y0 = 1，物距 30) 发出、只打在透镜下半部分（y < 0）的光线
    const lower = [-0.04, -0.06, -0.08].map((th) => throughLens(travel({ y: 1, th }, 30), 10));
    check(lower.every((r) => r.y < 0), 'E：这些光线都打在下半部分');
    const [zE, yE] = meet(lower[0], lower[1]);
    const [zE2, yE2] = meet(lower[0], lower[2]);
    const [zFull, yFull] = lensImage(30, 1, 10);
    check(Math.abs(zE - zFull) < 1e-9 && Math.abs(yE - yFull) < 1e-9 && Math.abs(zE2 - zFull) < 1e-9 && Math.abs(yE2 - yFull) < 1e-9, 'E：仍交在同一个像点');
    const optE = false;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const s3 = 1 / (1 / 10 - 1 / 300);
    const wFormula = (2.4 * 300) / s3;
    const sTrace = bisect((s) => lensImage(s, 1.2, 10)[0] - 300, 10.01, 20);
    const [z3, y3] = lensImage(sTrace, 1.2, 10);
    check(Math.abs(z3 - 300) < 1e-6, 'p3 像在 300 cm');
    const p3 = agree(2 * Math.abs(y3), wFormula, 'p3 画面宽', 1e-7);

    // p4
    const PFormula = 1 / 0.25 - 1 / 0.75;
    const fTrace = bisect((f) => lensImage(0.25, 0.01, f)[0] + 0.75, 0.26, 2);
    const p4 = agree(1 / fTrace, PFormula, 'p4 光焦度', 1e-7);

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
