// 独立验算 physics.optics.optical-instruments 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（放大镜 M = 1 + 25 cm/f、透镜组逐个用高斯公式、显微镜 |M| = (L/f_物)(25 cm/f_目)）；
// 二是把理想薄透镜只当作「高度不变、角度减去 y/f」的元件，从物点发出光线一步步追：p1、p4 量射进眼睛的光线的角度，
// 和不用仪器、物放在 25 cm 处时的角度相比；p3 追一条平行光线，量它和光轴的交点。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.optical-instruments.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, crossAhead, meet, throughLens, travel } from './physics.optics._op.ts';

/** 物点（高 y0）在透镜前 s 处，两条光线穿过焦距 f 的薄透镜后的交点：[在透镜后多远（负为透镜前）, 高度]。 */
function lensImage(s: number, y0: number, f: number): [number, number] {
  const a = throughLens(travel({ y: y0, th: 0.01 }, s), f);
  const b = throughLens(travel({ y: y0, th: -0.02 }, s), f);
  return meet(a, b);
}

const NEAR = 25; // cm，明视距离

export const verification: Verification = {
  lesson: 'physics.optics.optical-instruments',
  notes: {
    p1: 'M = 1 + 25/4.0；和一步步追光线核对：在物距上二分，使虚像在镜前 25 cm；眼睛紧靠透镜，射进瞳孔中心的光线穿过透镜中心、方向不变，它的角度和物放在 25 cm 处时的角度 y₀/25 相比。',
    p2: "逐条用例子：A f = 8 mm、物距 8.4 mm，像在后面 168 mm、放大率 −20（对）；B f = 4、8 cm 的放大镜 M = 7.25、4.13，焦距长的反而小（错）；C f₁ = 20、相距 10，第一个像在第二块透镜后 10 cm，物距 s₂ = 10 − 20 = −10（对）；D 伽利略望远镜的目镜是发散透镜（错）；E 开普勒望远镜 f = 100、10 cm，远处物体上方来的光线（θ > 0）射出时 θ' = −10θ，像是倒的（对）。",
    p3: "第一个像在会聚透镜后 20 cm，对发散透镜的物距 10 − 20 = −10，1/s' = 1/(−20) − 1/(−10)；和一步步追光线核对：一条平行光线穿过会聚透镜、走 10 cm、穿过发散透镜，量它和光轴的交点。",
    p4: '|M| = (160/8.0)(250/20)；和一步步追光线核对：在物距上二分，使物镜的像落在物镜后 8 + 160 = 168 mm；目镜放在中间像后 20 mm，物点发出的光线穿过整个显微镜后互相平行，量这个角度和物放在 250 mm 处时的角度之比。',
  },
  compute() {
    // p1
    const f1 = 4.0;
    const MFormula = 1 + NEAR / f1;
    const s1 = bisect((s) => lensImage(s, 1, f1)[0] + NEAR, 0.5, 3.999);
    const chief = throughLens(travel({ y: 1, th: -1 / s1 }, s1), f1);
    check(Math.abs(chief.y) < 1e-12, 'p1 这条光线穿过透镜中心');
    const p1 = agree(Math.abs(chief.th) / (1 / NEAR), MFormula, 'p1 角放大率', 1e-9);

    // p2
    const [zA, yA] = lensImage(8.4, 1, 8);
    check(Math.abs(zA - 168) < 1e-9 && Math.abs(yA + 20) < 1e-9, 'A：168 mm、−20 倍');
    const optA = zA > 0 && yA < -1;
    const M4 = 1 + NEAR / 4;
    const M8 = 1 + NEAR / 8;
    const optB = M8 > M4;
    const s1p = 20; // 平行光经 f₁ = 20 成像
    const s2 = 10 - s1p;
    check(s2 === -10, 'C：s₂ = −10');
    const optC = s2 < 0;
    const optD = false; // 伽利略望远镜：目镜是发散透镜
    const kepler = (th: number) => throughLens(travel(throughLens({ y: 0.3, th }, 100), 110), 10).th;
    check(Math.abs(kepler(0.01) / 0.01 + 10) < 1e-9, "E：θ' = −10θ");
    const optE = kepler(0.01) < 0;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const s2b = 10 - 20;
    const s2p = 1 / (1 / -20 - 1 / s2b);
    const ray = throughLens(travel(throughLens({ y: 1, th: 0 }, 20), 10), -20);
    const p3 = agree(crossAhead(ray), s2p, 'p3 像距', 1e-9);

    // p4（长度用 mm）
    const [fo, fe, L] = [8, 20, 160];
    const M4Formula = (L / fo) * (250 / fe);
    const so = bisect((s) => lensImage(s, 1, fo)[0] - (fo + L), 8.01, 20);
    const y0 = 0.01;
    const outAngles = [0.02, -0.03, 0.05].map((th) => throughLens(travel(throughLens(travel({ y: y0, th }, so), fo), fo + L + fe), fe).th);
    check(outAngles.every((t) => Math.abs(t - outAngles[0]) < 1e-12), 'p4 射出的光线互相平行');
    const p4 = agree(Math.abs(outAngles[0]) / (y0 / 250), M4Formula, 'p4 角放大率', 1e-7);

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
