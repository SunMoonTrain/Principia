// 独立验算 math.vector-calculus.delta-3d 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.vector-calculus.delta-3d.ts
// 不用筛选性质和 ∇²(1/r) = −4πδ³：
// - p1、p2 把 δ³ 换成宽度为 ε 的三维高斯分布，在 a 周围的小立方体上做三重高斯-勒让德求积，ε 取 0.02、0.01 外推到 0；
// - p3 把 1/|r − a| 换成光滑的 1/√(|r − a|² + ε²)，它的拉普拉斯算子用直角坐标的二阶差分求，在以 a 为中心的球坐标里对全空间积分（R = ε tan u），ε 取得很小；
// - p4 在球面上直接积通量，不用散度定理。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { gaussLegendre, surfaceFlux, type Vec } from './math.vector-calculus._vc.ts';

/** g 对以 a 为中心、各方向标准差为 eps 的三维高斯分布的平均（[−8ε, 8ε]³ 上 48³ 个高斯-勒让德点）。 */
function gaussAverage(g: (p: Vec) => number, a: Vec, eps: number): number {
  const { x, w } = gaussLegendre(48);
  const L = 8;
  const phi = (u: number): number => Math.exp(-u * u / 2) / Math.sqrt(2 * Math.PI);
  let s = 0;
  for (let i = 0; i < x.length; i++)
    for (let j = 0; j < x.length; j++)
      for (let k = 0; k < x.length; k++) {
        const [u, v, t] = [L * x[i], L * x[j], L * x[k]];
        const weight = L ** 3 * w[i] * w[j] * w[k] * phi(u) * phi(v) * phi(t);
        s += weight * g([a[0] + eps * u, a[1] + eps * v, a[2] + eps * t]);
      }
  return s;
}
const smeared = (g: (p: Vec) => number, a: Vec): number => (4 * gaussAverage(g, a, 0.01) - gaussAverage(g, a, 0.02)) / 3;

export const verification: Verification = {
  lesson: 'math.vector-calculus.delta-3d',
  notes: {
    p1: 'δ³ 换成以 a 为中心、宽 ε 的高斯分布，三重求积后 ε → 0 外推。',
    p2: '同 p1，被积函数乘上「在半径 2 的球里」的示性函数。',
    p3: '1/|r − a| 换成 1/√(|r − a|² + ε²)（ε = 1e-5），拉普拉斯算子用二阶差分求，在以 a 为中心的球坐标里对全空间积分。',
    p4: '球面 (2 sin θ cos φ, 2 sin θ sin φ, 2 cos θ) 上直接积 F·(r_θ × r_φ)。',
  },
  compute() {
    // p1
    const p1 = smeared(([x, y, z]) => x + y * y + z ** 3, [2, -1, 1]);

    // p2
    const p2 = smeared(([x, y, z]) => (x * x + y * y + z * z <= 4 ? x * x + y * y + z * z : 0), [1, 1, 1]);

    // p3
    const a: Vec = [Math.PI / 6, Math.PI / 6, 0];
    const eps = 1e-5;
    const Phi = (p: Vec): number => 1 / Math.sqrt((p[0] - a[0]) ** 2 + (p[1] - a[1]) ** 2 + (p[2] - a[2]) ** 2 + eps * eps);
    const lapPhi = (p: Vec, R: number): number => {
      const h = 2e-4 * Math.max(R, eps);
      const c = Phi(p);
      let s = 0;
      for (let i = 0; i < 3; i++) {
        const q1 = [...p];
        const q2 = [...p];
        q1[i] += h;
        q2[i] -= h;
        s += (Phi(q1) - 2 * c + Phi(q2)) / (h * h);
      }
      return s;
    };
    const gu = gaussLegendre(400);
    const gm = gaussLegendre(48);
    const nPhi = 48;
    let p3 = 0;
    for (let i = 0; i < gu.x.length; i++) {
      const u = (Math.PI / 4) * (gu.x[i] + 1);
      const wu = (Math.PI / 4) * gu.w[i];
      const R = eps * Math.tan(u);
      const jac = eps ** 3 * Math.tan(u) ** 2 / Math.cos(u) ** 2; // R² dR/du
      for (let j = 0; j < gm.x.length; j++) {
        const mu = gm.x[j];
        const st = Math.sqrt(1 - mu * mu);
        for (let k = 0; k < nPhi; k++) {
          const ph = (2 * Math.PI * (k + 0.5)) / nPhi;
          const p: Vec = [a[0] + R * st * Math.cos(ph), a[1] + R * st * Math.sin(ph), a[2] + R * mu];
          p3 += wu * gm.w[j] * ((2 * Math.PI) / nPhi) * jac * Math.cos(p[0] + p[1] + p[2]) * lapPhi(p, R);
        }
      }
    }

    // p4
    const b: Vec = [0, 0, 5];
    const F4 = (p: Vec): Vec => {
      const r = Math.hypot(...p);
      const d = p.map((v, i) => v - b[i]);
      const db = Math.hypot(...d);
      return p.map((v, i) => (3 * v) / r ** 3 + d[i] / db ** 3);
    };
    const sphere = (th: number, ph: number): Vec => [2 * Math.sin(th) * Math.cos(ph), 2 * Math.sin(th) * Math.sin(ph), 2 * Math.cos(th)];
    const p4 = surfaceFlux(F4, sphere, 0, Math.PI, 0, 2 * Math.PI);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
