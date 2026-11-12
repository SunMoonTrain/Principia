// 独立验算 physics.optics.total-internal-reflection 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（sinθ_c = n₂/n₁、亮圈半径 h·tanθ_c、数值孔径 sinθ_max = √(n₁² − n₂²)）；
// 二是不用这些式子：用向量形式的折射定律判断折射光线还在不在，在入射角（或水面上的位置、端面的入射角）上二分出全反射的边界。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.total-internal-reflection.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, deg, dirOf, refract, unit2, type V2 } from './physics.optics._op.ts';

/** 光从 n1 以入射角 i 射向法线为 (0, 1) 的界面（向上射），进入 n2：有折射光线返回 −1，全反射返回 1。 */
const tirSign = (i: number, n1: number, n2: number): number => (refract(dirOf(Math.PI / 2 - i), [0, 1], n1, n2) ? -1 : 1);

export const verification: Verification = {
  lesson: 'physics.optics.total-internal-reflection',
  notes: {
    p1: 'θ_c = arcsin(1/1.33)；和追光线核对：用向量形式的折射定律，从水里射向水面，在入射角上二分出折射光线消失的边界。',
    p2: '逐条用例子（都用向量形式的折射定律）：A 从 n = 1.5 的玻璃以 70° 射向水，折射光线不存在（对）；B 入射角 45° 时，玻璃（临界角 41.8°）对空气全反射、水（48.8°）对空气不全反射（对）；C 从空气射进水，入射角 0°–89.99° 都有折射光线（错）；D 全反射时 r_s = (a − ib)/(a + ib)，|r_s|² = 1（错）；E n₁ = 1.5，n₂ = 1.47、1.49 时数值孔径 0.298、0.173（对）。',
    p3: 'r = h·tanθ_c = h/√(n² − 1)；和追光线核对：眼睛在 (0, −2)，看水面上的点 (x, 0)，用向量形式的折射定律在 x 上二分出折射光线消失的位置。',
    p4: 'sinθ_max = √(1.50² − 1.47²)；和追光线核对：光从空气以和轴成 θ 的角射进端面（法线沿轴），折射进纤芯，再射到纤芯和包层的界面（法线垂直于轴），在 θ 上二分出界面上恰好全反射的那个角。',
  },
  compute() {
    // p1
    const nw = 1.33;
    const tc = Math.asin(1 / nw);
    const tcTrace = bisect((i) => tirSign(i, nw, 1), 1 * deg, 89 * deg);
    const p1 = agree(tcTrace / deg, tc / deg, 'p1 临界角', 1e-9);

    // p2
    const optA = tirSign(70 * deg, 1.5, 1.33) > 0;
    const tcGlass = Math.asin(1 / 1.5) / deg;
    check(Math.abs(tcGlass - 41.81) < 0.01 && Math.abs(tc / deg - 48.75) < 0.01, 'B：临界角 41.8° 和 48.8°');
    const optB = tirSign(45 * deg, 1.5, 1) > 0 && tirSign(45 * deg, nw, 1) < 0;
    let anyTir = false;
    for (let a = 0; a <= 89.99; a += 0.01) if (tirSign(a * deg, 1, nw) > 0) anyTir = true;
    const optC = anyTir;
    // D：全反射时 cosθ_t = i·b 是纯虚数，r_s = (n₁cosθ_i − n₂cosθ_t)/(n₁cosθ_i + n₂cosθ_t)
    const i70 = 70 * deg;
    const a = 1.5 * Math.cos(i70);
    const b = 1 * Math.sqrt((1.5 * Math.sin(i70)) ** 2 - 1);
    const R = (a * a + b * b) / (a * a + b * b);
    const optD = Math.abs(R - 0.5) < 1e-9;
    const NA = (n1: number, n2: number) => Math.sqrt(n1 * n1 - n2 * n2);
    check(Math.abs(NA(1.5, 1.47) - 0.2985) < 1e-4 && Math.abs(NA(1.5, 1.49) - 0.1729) < 1e-4, 'E：0.298 和 0.173');
    const optE = NA(1.5, 1.49) < NA(1.5, 1.47);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const h = 2.0;
    const rFormula = h / Math.sqrt(nw * nw - 1);
    const eye: V2 = [0, -h];
    const rTrace = bisect((x) => (refract(unit2([x - eye[0], -eye[1]]), [0, 1], nw, 1) ? -1 : 1), 0.1, 10);
    const p3 = agree(rTrace, rFormula, 'p3 亮圈半径', 1e-9);
    check(Math.abs(rFormula - h * Math.tan(tc)) < 1e-12, 'p3 两种写法');

    // p4
    const [n1, n2] = [1.5, 1.47];
    const thFormula = Math.asin(NA(n1, n2)) / deg;
    const guided = (th: number): number => {
      const dCore = refract(dirOf(th), [1, 0], 1, n1)!; // 端面法线沿轴
      return refract(dCore, [0, 1], n1, n2) ? 1 : -1; // 射到纤芯和包层的界面：有折射光线就漏出去
    };
    const thTrace = bisect(guided, 1 * deg, 80 * deg) / deg;
    const p4 = agree(thTrace, thFormula, 'p4 最大入射角', 1e-9);

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
