// 独立验算 physics.optics.spherical-mirrors 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的镜面公式 1/s + 1/s' = 1/f = 2/R、放大率 m = −s'/s（实正：凹面镜 f > 0，镜前的像为正）；
// 二是不用近轴公式：用向量形式的反射定律对真实的球面精确追光线，取很小的倾角，量反射光线（或反向延长线）和光轴的交点，
// 理查森外推到近轴极限；像高由物点发出的两条光线的交点求出（物高取得很小，再按比例放大，近轴像高和物高成正比）。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.spherical-mirrors.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, axisCrossing, bisect, check, chosen, dirOf, intersect, paraxialLimit, reflectAt } from './physics.optics._op.ts';

// 约定：光沿 +x 射向镜面，镜面顶点在原点；凹面镜的球心在镜前（x < 0），这里记为 Rgeo = −|R|；凸面镜 Rgeo = +|R|。
// 镜前（x < 0）的像距记为正。

/** 轴上物点在镜前 s 处（x = −s），返回近轴像距（镜前为正）。 */
function mirrorImage(s: number, Rgeo: number): number {
  return paraxialLimit((u) => -axisCrossing(reflectAt({ p: [-s, 0], d: dirOf(u) }, 0, Rgeo)!), 1e-3);
}

/** 平行光（高度很小）射来时反射光线和光轴的交点：焦距（镜前为正）。 */
function mirrorFocus(Rgeo: number): number {
  return paraxialLimit((h) => -axisCrossing(reflectAt({ p: [-1, h * Math.abs(Rgeo)], d: [1, 0] }, 0, Rgeo)!), 1e-3);
}

/** 物高 y（很小）在镜前 s 处，由物点发出的两条光线反射后的交点求像点：返回 [像距（镜前为正）, 像高]。 */
function mirrorImagePoint(s: number, y: number, Rgeo: number): [number, number] {
  const g = (u: number, k: 0 | 1) => {
    const a = reflectAt({ p: [-s, y], d: dirOf(-u) }, 0, Rgeo)!;
    const b = reflectAt({ p: [-s, y], d: dirOf(u) }, 0, Rgeo)!; // 倾角 ±u 成对：交点是 u 的偶函数，理查森外推才消得掉 u² 项
    const q = intersect(a, b);
    return k === 0 ? -q[0] : q[1];
  };
  return [paraxialLimit((u) => g(u, 0), 1e-3), paraxialLimit((u) => g(u, 1), 1e-3)];
}

export const verification: Verification = {
  lesson: 'physics.optics.spherical-mirrors',
  notes: {
    p1: '1/45 + 1/s\' = 2/30；和精确追光线核对：球心在镜前 30 处，物点在镜前 45 处，倾角取 10⁻³、5×10⁻⁴ rad，按反射定律的向量形式反射，量和光轴的交点，外推到倾角为零。',
    p2: '逐条用例子（精确追光线外推到近轴）：A 反射定律和介质无关，平行光会聚点不变（对）；B R = 20、40 时焦距 10、20，半径大的离镜面远（错）；C 凸面镜 R = 30，物距 5、30、300、3000 的像距 −3.75、−10、−14.3、−14.9，都在镜后（错）；D 凹面镜 f = 15，物距 20、17、16 时像距 60、127.5、240，放大率 3、7.5、15（对）；E 同一组物距，凸面镜对实物的像离顶点都小于 15（对）；解答说的虚物例外也核了：射向镜后 5 处的会聚光，反射后交在镜前 7.5 处。',
    p3: '要正立放大 2 倍：s\' = −30，1/f = 1/15 − 1/30，R = 2f；和精确追光线核对：在 R 上二分，使物距 15 的近轴像距（追光线外推）等于 −30，再用两条光线的交点核对像高是物高的 +2 倍。',
    p4: '1/4.0 + 1/s\' = 1/(−0.40)，像高 = 1.8 × (−s\'/4.0)；和精确追光线核对：物高取 1.8 μm（近轴；取 1.8 mm 时像距已差 4×10⁻⁶），由物点发出两条光线反射后的反向延长线求交点，像高按比例放大 10⁶ 倍。',
  },
  compute() {
    // p1
    const s1 = 1 / (2 / 30 - 1 / 45);
    const p1 = agree(mirrorImage(45, -30), s1, 'p1 像距', 1e-7);

    // p2
    const optA = true; // 反射定律的向量形式里没有折射率，焦距和周围介质无关
    const f20 = mirrorFocus(-20);
    const f40 = mirrorFocus(-40);
    check(Math.abs(f20 - 10) < 1e-4 && Math.abs(f40 - 20) < 1e-4, 'B：焦距 10 和 20');
    const optB = f40 < f20;
    const convex = [5, 30, 300, 3000].map((s) => mirrorImage(s, 30));
    check(convex.every((x) => x < 0 && x > -15), 'C、E：凸面镜的像都在镜后、离顶点不到 15');
    const optC = convex.some((x) => x > 0);
    const near = [20, 17, 16].map((s) => mirrorImagePoint(s, 1e-4, -30));
    check(
      near[0][0] < near[1][0] && near[1][0] < near[2][0] && Math.abs(near[0][1]) < Math.abs(near[1][1]) && Math.abs(near[1][1]) < Math.abs(near[2][1]),
      'D：物越靠近焦点，像越远越大',
    );
    check(Math.abs(near[0][0] - 60) < 1e-4 && Math.abs(near[2][0] - 240) < 1e-3, 'D：像距 60 和 240');
    const optD = true;
    const optE = convex.every((x) => x < 0 && -x < 15);
    // 解答 E 补的半句：对虚物不一定。会聚的光射向凸面镜，虚物在镜后 5（焦距以内），成镜前的实像（追光线：光射向镜后的点）。
    const virt = paraxialLimit((u) => -axisCrossing(reflectAt({ p: [-20, 25 * Math.tan(u)], d: dirOf(-u) }, 0, 30)!), 1e-3);
    check(Math.abs(virt - 1 / (1 / -15 - 1 / -5)) < 1e-6 && virt > 0, 'E 的解答：虚物在镜后 5 时像在镜前 7.5（实像）');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const f3 = 1 / (1 / 15 - 1 / 30);
    const R3 = 2 * f3;
    const RTrace = bisect((R) => mirrorImage(15, -R) + 30, 31, 200);
    agree(RTrace, R3, 'p3 半径', 1e-7);
    const [, y3] = mirrorImagePoint(15, 1e-4, -R3);
    agree(y3 / 1e-4, 2, 'p3 放大率 +2', 1e-6);
    const p3 = R3;

    // p4（长度用 m，答案用 cm）
    const si = 1 / (1 / -0.4 - 1 / 4.0);
    const h4 = 1.8 * (-si / 4.0) * 100;
    const [x4, y4] = mirrorImagePoint(4.0, 1.8e-6, 0.8);
    agree(x4, si, 'p4 像距', 1e-7);
    const p4 = agree(y4 * 1e6 * 100, h4, 'p4 像高', 1e-7);

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
