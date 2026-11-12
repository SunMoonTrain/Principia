// 独立验算 physics.optics.fermat-principle 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（光程 Σ n_i l_i、由费马原理得到的折射定律 sinθ₁/v₁ = sinθ₂/v₂、物像之间光程相等）；
// 二是不用这些式子：p1 按光在各段用的时间乘真空光速；p3 对岸上的通过点做黄金分割搜索使用时最短，再二分调落水者的位置；
// p4 取一块具体的薄透镜（厚度差和边缘高度定下焦距），按实际几何算两条光线在空气里的路程，边缘高度外推到零。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.fermat-principle.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, angleBetween, argmax, bisect, check, chosen, deg, paraxialLimit, reflect, refract, type V2 } from './physics.optics._op.ts';

const C_LIGHT = 299792458;

/** 从 A 出发、在 y = 0 上过 (x, 0)、再到 B，两段速度为 v1、v2：用时。 */
const travelTime = (A: V2, B: V2, x: number, v1: number, v2: number) => Math.hypot(x - A[0], A[1]) / v1 + Math.hypot(B[0] - x, B[1]) / v2;

export const verification: Verification = {
  lesson: 'physics.optics.fermat-principle',
  notes: {
    p1: '1.50 × 3.0 + 1.33 × 2.0；和用时核对：两段用时 l_i/(c/n_i) 相加，再乘真空光速。',
    p2: '逐条用例子：A 时间 t 里光在介质中走 l、在真空中走 ct = nl（对）；B 均匀介质里光程正比于几何路程，直线最短（对）；C 半径 1 的圆形凹面镜，A(−0.5, 0)、B(0.5, 0)，经 (0, 1) 反射的路径满足反射定律，光程 2.2361，经附近镜面点（偏 ±5°）的都是 2.2347，实际路径是极大（错）；D A(0, 1)、B(2, −1)、水 n = 1.33，A 到 B 光程最小的通过点在 x = 1.268，正好满足折射定律；从 B 到 A 另按光程最小找通过点，也是 1.268，从 B 射向这一点的光按折射定律（水到空气）出射后正好指向 A，光沿原路返回（对）；E 光程 = n × 几何路程（错）。',
    p3: 'sinθ₂ = (1.5/6.0) sin50°；和直接求最短时间核对：救生员在 (−tan50°, −1)（沙滩一侧），对岸线上的通过点黄金分割求用时最短，再二分调落水者的横坐标 X（离岸 1），使通过点正好在原点，水里的角 = arctan X。',
    p4: '光程相等：空气里多走 n × (4.0 − 1.0)；和具体透镜核对：边缘高 h、中心比边缘厚 Δt = 0.03h²（mm），由厚度差得 1/f = 2(n − 1)Δt/h²，f = 33.3，物距 100、像距 50；按实际几何算边缘光线在空气里的路程 √(s² + h²) + √(s′² + h²) − (边缘厚) 和中心光线的 s + s′ − (中心厚) 之差，除以 Δt，h 取 1、0.5 外推到 0，得 n，再乘 3.0 mm。',
  },
  compute() {
    // p1
    const p1Formula = 1.5 * 3.0 + 1.33 * 2.0;
    const tSec = (0.03 / (C_LIGHT / 1.5) + 0.02 / (C_LIGHT / 1.33)) * C_LIGHT * 100;
    const p1 = agree(tSec, p1Formula, 'p1 光程', 1e-12);

    // p2
    const optA = true;
    const optB = true;
    // C：圆形凹面镜（半径 1、圆心在原点），A(−0.5, 0)、B(0.5, 0)。经 P(0, 1) 反射的路径满足反射定律，
    // 可它比经附近镜面点（偏 ±5°）的路径都长：实际路径是光程的极大，不是极小。
    const Lmir = (phi: number) => { const P: V2 = [Math.cos(phi), Math.sin(phi)]; return Math.hypot(P[0] + 0.5, P[1]) + Math.hypot(P[0] - 0.5, P[1]); };
    const P0: V2 = [0, 1];
    const din: V2 = [P0[0] + 0.5, P0[1]];
    const dl = Math.hypot(din[0], din[1]);
    const dRef = reflect([din[0] / dl, din[1] / dl], [0, 1]);
    check(angleBetween(dRef, [0.5 - P0[0], -P0[1]]) < 1e-12, 'C：经 (0, 1) 的路径满足反射定律');
    const optC = Lmir(90 * deg) < Lmir(85 * deg) && Lmir(90 * deg) < Lmir(95 * deg);
    check(!optC && Lmir(90 * deg) > Lmir(85 * deg), 'C：实际路径的光程比附近的大');
    const A: V2 = [0, 1];
    const B: V2 = [2, -1];
    const nW = 1.33;
    const opl = (x: number) => Math.hypot(x - A[0], A[1]) + nW * Math.hypot(B[0] - x, B[1]);
    const xs = argmax((x) => -opl(x), 0, 2);
    // 按折射定律走的折线：用向量形式的折射定律核对通过点
    const dIn: V2 = [xs - A[0], -A[1]];
    const nIn = Math.hypot(dIn[0], dIn[1]);
    const dOut = refract([dIn[0] / nIn, dIn[1] / nIn], [0, 1], 1, nW)!;
    const toB: V2 = [B[0] - xs, B[1]];
    check(angleBetween(dOut, toB) < 1e-6, 'D：光程最小的通过点正好满足折射定律');
    // D（光路可逆）：光从 B 射向 A（水到空气），按光程最小另找通过点，和 A 射向 B 的比；
    // 再让光从 B 射向这一点，用向量形式的折射定律（水到空气）算出射方向，看是否正好指向 A。
    const oplBA = (x: number) => nW * Math.hypot(x - B[0], B[1]) + Math.hypot(A[0] - x, A[1]);
    const xsBA = argmax((x) => -oplBA(x), 0, 2);
    const dBack: V2 = [xs - B[0], -B[1]];
    const nBack = Math.hypot(dBack[0], dBack[1]);
    const dUp = refract([dBack[0] / nBack, dBack[1] / nBack], [0, -1], nW, 1)!;
    check(angleBetween(dUp, [A[0] - xs, A[1]]) < 1e-6, 'D：从 B 射向通过点的光，折射后正好指向 A');
    const optD = Math.abs(xsBA - xs) < 1e-6;
    const optE = false;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const v1 = 6.0;
    const v2 = 1.5;
    const th2Formula = Math.asin((v2 / v1) * Math.sin(50 * deg)) / deg;
    const Aq: V2 = [-Math.tan(50 * deg), -1];
    const crossing = (X: number) => argmax((x) => -travelTime(Aq, [X, 1], x, v1, v2), Aq[0], X);
    const X = bisect((x) => crossing(x), 0.01, 5);
    const p3 = agree(Math.atan(X) / deg, th2Formula, 'p3 水里的角', 1e-6);

    // p4
    const n = 1.5;
    const p4Formula = n * (4.0 - 1.0);
    const ratio = paraxialLimit((h) => {
      const dt = 0.03 * h * h; // 中心比边缘厚：1/f = 2(n − 1)Δt/h² = 0.03，f = 33.3
      const invF = (2 * (n - 1) * dt) / (h * h);
      const s = 100;
      const sp = 1 / (invF - 1 / s);
      const te = 1.0; // 边缘厚（随便取，抵消掉）
      const tc = te + dt;
      const edgeAir = Math.hypot(s, h) + Math.hypot(sp, h) - te;
      const centerAir = s + sp - tc;
      return (edgeAir - centerAir) / dt;
    }, 1);
    const p4 = agree(ratio * 3.0, p4Formula, 'p4 空气里多走的路程', 1e-6);

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
