// 独立验算 physics.electromagnetism.vector-potential 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（B = ∇ × A；A 沿闭合回路的环量等于磁通量；长直导线 A_z = −(μ₀I/2π)ln s + 常数）；
// 二是不用这些式子：
//   - 旋度用 A 沿小正方形回路的环量除以面积（数值线积分），选择题在几个点上用中心差分求旋度；
//   - 螺线管外回路的环量：由电流直接算 A（每个圆线圈 A = (μ₀I/4π)∮dl′/|r − r′|），沿正方形回路数值积分（诺伊曼公式），再沿轴积分各线圈；
//   - 长直导线：由 A_z = (μ₀I/4π)∫dz/√(s² + z²) 在两点的差数值积分（差值收敛，导线取 ±10⁶ m 量级）。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.vector-potential.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { type V3, MU0, agree, check, chosen, integrate } from './physics.electromagnetism._es.ts';

type VF = (p: V3) => V3;

/** 中心差分求旋度。 */
function curl(A: VF, p: V3, h = 1e-4): V3 {
  const d = (i: number, j: number) => {
    const a: V3 = [...p];
    const b: V3 = [...p];
    a[j] += h;
    b[j] -= h;
    return (A(a)[i] - A(b)[i]) / (2 * h);
  };
  return [d(2, 1) - d(1, 2), d(0, 2) - d(2, 0), d(1, 0) - d(0, 1)];
}

/** A 沿 xy 平面里以 c 为中心、边长 h 的正方形（逆时针）的环量：四条边数值线积分。 */
function circulationSquare(A: VF, c: V3, h: number): number {
  const corners: [number, number][] = [
    [-h / 2, -h / 2],
    [h / 2, -h / 2],
    [h / 2, h / 2],
    [-h / 2, h / 2],
  ];
  let s = 0;
  for (let i = 0; i < 4; i++) {
    const [x0, y0] = corners[i];
    const [x1, y1] = corners[(i + 1) % 4];
    s += integrate(
      (t) => {
        const a = A([c[0] + x0 + t * (x1 - x0), c[1] + y0 + t * (y1 - y0), c[2]]);
        return a[0] * (x1 - x0) + a[1] * (y1 - y0);
      },
      0,
      1,
      8,
      16,
    );
  }
  return s;
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.vector-potential',
  notes: {
    p1: 'B = ∂A_y/∂x − ∂A_x/∂y；和 A 沿边长 1 cm 的小正方形回路的环量除以面积（数值线积分，取两个不同的位置）核对。',
    p2: '在三个点上用中心差分求每个候选的旋度，和 (0, 0, B) 比较（B 取 1.3）：A、E 对；B 的旋度为零；C 的旋度是 −B ẑ；D 的旋度多了 x 分量 −2。',
    p3: '环量 = 管内的磁通量 BπR²；和由电流直接算 A 核对：螺线管看成 ±10⁶ 倍半径长、nI = B/μ₀ 的圆线圈叠加，每个线圈对正方形回路的 ∮∮dl·dl′/|r − r′| 数值积分（四条边由对称性算一条乘 4），再沿轴（z = R sinh u）积分。',
    p4: '(μ₀I/2π)ln 3；和 (μ₀I/4π)∫[1/√(s₁² + z²) − 1/√(s₂² + z²)]dz 在 ±10⁸ m 上数值积分（z = s₁ sinh u 换元）核对。',
  },
  compute() {
    // p1
    const A1: VF = ([x, y]) => [-3e-2 * y, 2e-2 * x, 0];
    const h = 0.01;
    const c1 = circulationSquare(A1, [0.3, -1.2, 0], h) / (h * h);
    const c1b = circulationSquare(A1, [-2, 0.7, 5], h) / (h * h);
    agree(c1, c1b, 'p1 两个位置', 1e-9);
    const p1 = agree(Math.abs(c1), 2e-2 + 3e-2, 'p1', 1e-9);

    // p2
    const B = 1.3;
    const cands: VF[] = [
      ([x, y]) => [-B * y + y * y, 2 * x * y, 0],
      ([x, y]) => [B * x, B * y, 0],
      ([, y]) => [B * y, 0, 0],
      ([, y, z]) => [-B * y + 3, 2 * z, 0],
      ([x, y]) => [-B * y + 5 * x, 0, 0],
    ];
    const pts: V3[] = [
      [0.2, -0.5, 1.1],
      [-1.3, 0.4, -0.2],
      [2.5, 1.5, 0.7],
    ];
    const flags = cands.map((A) =>
      pts.every((p) => {
        const c = curl(A, p);
        return Math.abs(c[0]) < 1e-6 && Math.abs(c[1]) < 1e-6 && Math.abs(c[2] - B) < 1e-6;
      }),
    );
    const cD = curl(cands[3], pts[0]);
    check(Math.abs(cD[0] + 2) < 1e-6 && Math.abs(cD[2] - B) < 1e-6, 'p2 D：旋度 (−2, 0, B)');
    const p2 = chosen(flags);

    // p3
    const Bs = 0.2;
    const Rs = 0.01;
    const half = 0.03;
    const nI = Bs / MU0;
    const U = Math.asinh(1e6);
    // 一个圆线圈（在高度 z、半径 Rs、电流 1）和正方形的一条边（x = half，y 从 −half 到 half，沿 +y）的 ∮∮ dl·dl′/|r − r′|
    const edgeRing = (z: number) =>
      integrate(
        (y) =>
          integrate(
            (t) => {
              const dx = half - Rs * Math.cos(t);
              const dy = y - Rs * Math.sin(t);
              // dl = ŷ dy，dl′ = Rs(−sin t, cos t, 0) dt，dl·dl′ = Rs cos t
              return (Rs * Math.cos(t)) / Math.sqrt(dx * dx + dy * dy + z * z);
            },
            0,
            2 * Math.PI,
            8,
            16,
          ),
        -half,
        half,
        8,
        16,
      );
    const circ = integrate((u) => ((MU0 * nI) / (4 * Math.PI)) * 4 * edgeRing(Rs * Math.sinh(u)) * Rs * Math.cosh(u), -U, U, 64, 16);
    const p3 = agree(Math.abs(circ) * 1e6, Bs * Math.PI * Rs * Rs * 1e6, 'p3', 1e-8);

    // p4
    const I4 = 10;
    const s1 = 0.01;
    const s2 = 0.03;
    const Z = Math.asinh(1e10);
    const dA = integrate(
      (u) => {
        const z = s1 * Math.sinh(u);
        return (1 / Math.sqrt(s1 * s1 + z * z) - 1 / Math.sqrt(s2 * s2 + z * z)) * s1 * Math.cosh(u);
      },
      -Z,
      Z,
      256,
      16,
    );
    const p4 = agree(((MU0 * I4) / (4 * Math.PI)) * dA * 1e6, ((MU0 * I4) / (2 * Math.PI)) * Math.log(s2 / s1) * 1e6, 'p4', 1e-9);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
