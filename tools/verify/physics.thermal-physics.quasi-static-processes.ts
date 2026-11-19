// 独立验算 physics.thermal-physics.quasi-static-processes 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（等压 pΔV、等温 nRT ln(V2/V1)、三角形面积）；二是把过程参数化成 (V(s), p(s))，
// 用复合高斯-勒让德数值积分 ∫p dV = ∫p(s)V′(s) ds（循环按各段的走向逐段积分再相加），或者把准静态过程拆成
// N 小步、每一步按这一步开始时的压强算 pΔV 再求和（N 取得很大），和精确值核对。选择题用具体例子逐条核对。
// 题面没给摩尔气体常量，按 CODATA：R = N_A·k_B（两者都是定义值）。
// 单独运行：npx tsx tools/verify/physics.thermal-physics.quasi-static-processes.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, integrate } from './physics.newtonian-mechanics._nm.ts';

const NA = 6.022_140_76e23;
const kB = 1.380_649e-23;
const R = NA * kB;
const L = 1e-3; // 1 L = 1e-3 m³

/** 参数化的准静态过程 s ∈ [0, 1] ↦ (V(s), p(s))：∫p dV = ∫p(s)V′(s) ds，V′ 用中心差分。 */
function pathWork(V: (s: number) => number, p: (s: number) => number, panels = 64): number {
  const h = 1e-6;
  const dV = (s: number) => (V(Math.min(1, s + h)) - V(Math.max(0, s - h))) / (Math.min(1, s + h) - Math.max(0, s - h));
  return integrate((s) => p(s) * dV(s), 0, 1, panels, 16);
}

/** 把同一个过程拆成 n 小步，每一步按这一步开始时的压强算 p·ΔV 再求和（左端点和）。 */
function stepWork(V: (s: number) => number, p: (s: number) => number, n: number): number {
  let w = 0;
  for (let i = 0; i < n; i++) {
    const s0 = i / n;
    const s1 = (i + 1) / n;
    w += p(s0) * (V(s1) - V(s0));
  }
  return w;
}

/** 两点之间的直线段（在 p-V 图上），s 从 0 到 1。 */
const segment = (V0: number, p0: number, V1: number, p1: number) => ({
  V: (s: number) => V0 + (V1 - V0) * s,
  p: (s: number) => p0 + (p1 - p0) * s,
});

/** 理想气体等温过程：V 从 V0 均匀变到 V1，p = nRT/V。 */
const isotherm = (n: number, T: number, V0: number, V1: number) => ({
  V: (s: number) => V0 + (V1 - V0) * s,
  p: (s: number) => (n * R * T) / (V0 + (V1 - V0) * s),
});

export const verification: Verification = {
  lesson: 'physics.thermal-physics.quasi-static-processes',
  notes: {
    p1: '等压：W = pΔV = 1.5e5 × (5.0 − 2.0)e-3 = 450 J；和把 V 参数化、数值积分 ∫p dV 核对，再和拆成 10⁵ 小步的 Σp·ΔV 核对。',
    p2: '逐条用例子（都是准静态）：A 1 mol、300 K 从 2 L 等温压缩到 1 L，数值积分 ∫nRT/V dV ≈ −1729 J < 0（错）；B 1 mol，T 从 300 K 升到 600 K、p = (1e5/300)·T，V = nRT/p 始终是 nR·300/1e5，参数化后积出的功为 0，再换 2 mol、T 从 400 K 降到 250 K 的另一例也是 0（对）；C 透镜形循环：1 L 到 3 L，膨胀沿 p = 2e5 − 3.2e5·s(1 − s)，压缩沿 p = 2e5 + 3.2e5·s(1 − s)，逐段积分得净功 −3.2e5 × 2e-3 / 3 ≈ −213.3 J < 0；另取膨胀沿等压 1e5、压缩沿等压 2e5（两头用等容连起来）的矩形，净功 −200 J（对）；D 1e5 Pa 下从 1 L 等压膨胀到 3 L，曲线下面积 200 J，外界对气体做的功是 −200 J，不等于面积（错）。',
    p3: '等温压缩，外界做的功 = −∫nRT/V dV = nRT ln(V1/V2) = 2.00 × 8.314462618 × 350 × ln(30/12) ≈ 5332.9 J（R 按 CODATA，题面没给）；和数值积分、拆成 10⁶ 小步的 −Σp·ΔV 核对。',
    p4: 'A(1 L, 4e5) → B(5 L, 2e5) 直线：∫p dV = 平均压强 3e5 × 4e-3 = 1200 J；B → C 等压压缩：2e5 × (−4e-3) = −800 J；C → A 等容：0；净功 400 J。和逐段数值积分、鞋带公式算出的有向面积（顺时针为正）核对。',
  },
  compute() {
    // p1（J）：等压膨胀
    const p1Exact = 1.5e5 * (5.0 - 2.0) * L;
    const iso1 = segment(2.0 * L, 1.5e5, 5.0 * L, 1.5e5);
    agree(pathWork(iso1.V, iso1.p), p1Exact, 'p1 数值积分', 1e-9);
    agree(stepWork(iso1.V, iso1.p, 100_000), p1Exact, 'p1 小步求和', 1e-9);
    const p1 = p1Exact;

    // p2：逐条找例子
    // A：等温压缩到一半，气体对外做的功
    const isoA = isotherm(1, 300, 2 * L, 1 * L);
    const wA = pathWork(isoA.V, isoA.p);
    agree(wA, 1 * R * 300 * Math.log(1 / 2), 'p2 A 等温压缩的功', 1e-9);
    const optA = wA > 0;
    // B：p ∝ T，一定量的理想气体：V = nRT/p 不变
    const caseB = (n: number, T0: number, T1: number, c: number) => {
      const T = (s: number) => T0 + (T1 - T0) * s;
      const p = (s: number) => c * T(s);
      const V = (s: number) => (n * R * T(s)) / p(s);
      return pathWork(V, p);
    };
    const wB1 = caseB(1, 300, 600, 1e5 / 300);
    const wB2 = caseB(2, 400, 250, 3e5 / 400);
    const optB = Math.abs(wB1) < 1e-6 && Math.abs(wB2) < 1e-6;
    // C：膨胀段整个在压缩段下方的循环
    const V1c = 1 * L;
    const V2c = 3 * L;
    const lower = { V: (s: number) => V1c + (V2c - V1c) * s, p: (s: number) => 2e5 - 3.2e5 * s * (1 - s) };
    const upper = { V: (s: number) => V2c - (V2c - V1c) * s, p: (s: number) => 2e5 + 3.2e5 * s * (1 - s) }; // 走回去，s 从 V2 到 V1
    const wLens = pathWork(lower.V, lower.p) + pathWork(upper.V, upper.p);
    // 精确值：∫(p_u − p_l)dV = ∫₀¹ 2·3.2e5·s(1 − s)·(V2 − V1) ds = 3.2e5·(V2 − V1)/3，净功取负号
    agree(wLens, -(3.2e5 * (V2c - V1c)) / 3, 'p2 C 透镜形循环的净功', 1e-6);
    const rect = [
      segment(1 * L, 1e5, 3 * L, 1e5), // 膨胀，等压 1e5
      segment(3 * L, 1e5, 3 * L, 2e5), // 等容升压
      segment(3 * L, 2e5, 1 * L, 2e5), // 压缩，等压 2e5
      segment(1 * L, 2e5, 1 * L, 1e5), // 等容降压
    ];
    const wRect = rect.reduce((sum, seg) => sum + pathWork(seg.V, seg.p), 0);
    agree(wRect, -200, 'p2 C 矩形循环的净功', 1e-9);
    const optC = wLens < 0 && wRect < 0;
    // D：膨胀时外界做的功和曲线下面积
    const isoD = segment(1 * L, 1e5, 3 * L, 1e5);
    const area = integrate(() => 1e5, 1 * L, 3 * L); // 曲线下面积（正）
    const wByGas = pathWork(isoD.V, isoD.p);
    const wOnGas = -wByGas;
    check(Math.abs(area - 200) < 1e-9, 'p2 D 面积 200 J');
    const optD = Math.abs(wOnGas - area) < 1e-9;
    const p2 = chosen([optA, optB, optC, optD]);

    // p3（J）：等温压缩，外界对氦气做的功
    const n3 = 2.0;
    const T3 = 350;
    const p3Exact = n3 * R * T3 * Math.log(30.0 / 12.0);
    const iso3 = isotherm(n3, T3, 30.0 * L, 12.0 * L);
    agree(-pathWork(iso3.V, iso3.p), p3Exact, 'p3 数值积分', 1e-9);
    agree(-stepWork(iso3.V, iso3.p, 1_000_000), p3Exact, 'p3 小步求和', 2e-6);
    const p3 = p3Exact;

    // p4（J）：三角形循环的净功
    const A = [1.0 * L, 4.0e5];
    const B = [5.0 * L, 2.0e5];
    const C = [1.0 * L, 2.0e5];
    const legs = [segment(A[0], A[1], B[0], B[1]), segment(B[0], B[1], C[0], C[1]), segment(C[0], C[1], A[0], A[1])];
    const wLegs = legs.map((seg) => pathWork(seg.V, seg.p));
    agree(wLegs[0], 1200, 'p4 A→B', 1e-9);
    agree(wLegs[1], -800, 'p4 B→C', 1e-9);
    check(Math.abs(wLegs[2]) < 1e-9, 'p4 C→A 等容不做功');
    const wNum = wLegs[0] + wLegs[1] + wLegs[2];
    // 鞋带公式：横轴 V、纵轴 p，逆时针为正；∮p dV 是顺时针为正，所以取负号
    const pts = [A, B, C];
    let shoelace = 0;
    for (let i = 0; i < 3; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[(i + 1) % 3];
      shoelace += x0 * y1 - x1 * y0;
    }
    const p4 = agree(wNum, -shoelace / 2, 'p4 净功', 1e-9);

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
