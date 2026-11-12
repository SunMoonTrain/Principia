// 独立验算 physics.optics.ray-transfer-matrices 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的矩阵（(y, θ) 约定：自由传播 [[1, d], [0, 1]]、薄透镜 [[1, 0], [−1/f, 1]]、平面折射 [[1, 0], [0, n/n']]，
// 系统矩阵按光经过的先后从右往左乘）；
// 二是不用矩阵：p1 用焦平面作图（平行于入射光线、穿过透镜中心的光线和真实光线在焦平面上相交）；
// p3 一步步追一条平行光线，量等效焦距 −y/θ'；p4 对平板的两个平面用向量形式的折射定律精确追光线，外推到近轴，量出射高度的增量和入射角之比。
// 选择题用具体矩阵逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.ray-transfer-matrices.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, dirOf, paraxialLimit, refractAt, throughLens, travel } from './physics.optics._op.ts';

type M2 = [number, number, number, number]; // [A, B, C, D]
const mul = (m: M2, k: M2): M2 => [m[0] * k[0] + m[1] * k[2], m[0] * k[1] + m[1] * k[3], m[2] * k[0] + m[3] * k[2], m[2] * k[1] + m[3] * k[3]];
/** 按光经过的先后给出各元件的矩阵：后经过的乘在左边。 */
const system = (...ms: M2[]): M2 => ms.reduce((acc, m) => mul(m, acc));
const T = (d: number): M2 => [1, d, 0, 1];
const Lf = (f: number): M2 => [1, 0, -1 / f, 1];
const plane = (n: number, n2: number): M2 => [1, 0, 0, n / n2];
const det = (m: M2) => m[0] * m[3] - m[1] * m[2];
const apply = (m: M2, y: number, th: number): [number, number] => [m[0] * y + m[1] * th, m[2] * y + m[3] * th];

export const verification: Verification = {
  lesson: 'physics.optics.ray-transfer-matrices',
  notes: {
    p1: "(y, θ) = (2.0, 0.010) 乘 [[1, 100], [0, 1]] 再乘 [[1, 0], [−1/50, 1]]；和焦平面作图核对：和入射光线平行、穿过透镜中心的光线到焦平面时高 50 × 0.010 = 0.5 mm，真实光线在透镜处高 3.0 mm，射出后也指向这一点，θ' = (0.5 − 3.0)/50。",
    p2: '逐条用具体矩阵：A 先自由传播 10 再过 f = 20 的透镜，[[1, 0], [−1/20, 1]]·[[1, 10], [0, 1]] 和反过来相乘不同，追一条光线核对前者对（错）；B det [[1, d], [0, 1]] = 1（对）；C 开普勒望远镜 f = 100、10，相距 110，系统矩阵的 C = 0，平行光 (1, 0) 射出时角度为 0（对）；D 薄透镜矩阵的第一行是 (1, 0)，高度不变（错）；E 物距 30、f = 10、像距 15，系统矩阵 B = 0，从同一点发出、角度不同的光线射出时高度相同（对）。',
    p3: "1/f = 1/15 + 1/10 − 5.0/(15 × 10)；和一步步追光线核对：平行光线 (1, 0) 穿过第一块透镜、走 5.0 cm、穿过第二块，等效焦距 = −1/θ'；再和系统矩阵的 −1/C 核对。",
    p4: '[[1, 0], [0, 1.50]]·[[1, 3.0], [0, 1]]·[[1, 0], [0, 1/1.50]] = [[1, 2.0], [0, 1]]；和精确追光线核对：从空气以倾角 u 射到平板前表面，用向量形式的折射定律在两个平面上各折射一次，出射高度的增量除以 tan u，取 u = 10⁻³、5×10⁻⁴ 外推到 u → 0。',
  },
  compute() {
    // p1
    const [, th1] = apply(system(T(100), Lf(50)), 2.0, 0.01);
    const yLens = 2.0 + 100 * 0.01;
    const p1 = agree((50 * 0.01 - yLens) / 50, th1, 'p1 射出的角度', 1e-12);

    // p2
    const right = system(T(10), Lf(20)); // 先 T 后 L：L·T
    const wrong = mul(T(10), Lf(20)); // 按先后从左往右：T·L
    const stepwise = throughLens(travel({ y: 1, th: 0.02 }, 10), 20);
    const [yR, thR] = apply(right, 1, 0.02);
    const [yW, thW] = apply(wrong, 1, 0.02);
    check(Math.abs(yR - stepwise.y) < 1e-12 && Math.abs(thR - stepwise.th) < 1e-12, 'A：后经过的乘在左边');
    const optA = Math.abs(yW - stepwise.y) < 1e-12 && Math.abs(thW - stepwise.th) < 1e-12;
    const optB = [0.5, 10, 300].every((d) => det(T(d)) === 1);
    const tele = system(Lf(100), T(110), Lf(10));
    check(Math.abs(tele[2]) < 1e-15, 'C：望远镜的 C = 0');
    const optC = Math.abs(apply(tele, 1, 0)[1]) < 1e-15;
    const optD = Lf(50)[0] !== 1 || Lf(50)[1] !== 0;
    const img = system(T(30), Lf(10), T(15));
    check(Math.abs(img[1]) < 1e-12, 'E：B = 0');
    const ys = [-0.05, 0, 0.03].map((th) => apply(img, 1, th)[0]);
    const optE = ys.every((y) => Math.abs(y - ys[0]) < 1e-12);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const f3 = 1 / (1 / 15 + 1 / 10 - 5 / (15 * 10));
    const out = throughLens(travel(throughLens({ y: 1, th: 0 }, 15), 5), 10);
    const efl = agree(-1 / out.th, f3, 'p3 一步步追光线', 1e-12);
    const p3 = agree(-1 / system(Lf(15), T(5), Lf(10))[2], efl, 'p3 系统矩阵', 1e-12);

    // p4
    const M = system(plane(1, 1.5), T(3), plane(1.5, 1));
    check(M[0] === 1 && M[3] === 1 && M[2] === 0, 'p4 矩阵是 [[1, B], [0, 1]]');
    const Lexact = paraxialLimit((u) => {
      const r1 = refractAt({ p: [-1, 0], d: dirOf(u) }, 0, Infinity, 1, 1.5)!;
      const r2 = refractAt(r1, 3, Infinity, 1.5, 1)!;
      return (r2.p[1] - r1.p[1]) / Math.tan(u);
    }, 1e-3);
    const p4 = agree(Lexact, M[1], 'p4 等效的自由传播距离', 1e-9);

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
