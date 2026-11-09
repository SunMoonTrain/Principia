// 独立验算 physics.analytical-mechanics.heavy-symmetric-top 的 p1–p4（简单题、中等题）。
// 不用欧拉角和有效势，直接按角动量定理积分：对称陀螺的惯性张量是 I₁(1 − nnᵀ) + I₃nnᵀ（n 是对称轴方向），
// 所以 ω × n = (L × n)/I₁，状态取 [n, L]，ṅ = (L × n)/I₁，L̇ = 重力矩 l n × (−Mg ẑ) = Mgl ẑ × n；
// p2 用一般的刚体积分（_rigid.ts）。匀速进动、稳定性都从这组方程里读出，再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.heavy-symmetric-top.ts

import { fileURLToPath } from 'node:url';
import type { Derivative } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, chosen, derivative, dot, integrateTo, type Vec } from './physics.analytical-mechanics._mech.ts';
import {
  column,
  cross,
  diag,
  eulerMatrix,
  matVec,
  norm,
  omegaOf,
  rigidDerivative,
  rigidState,
  stateL,
  stateR,
} from './physics.analytical-mechanics._rigid.ts';

const g = 9.8;
const z = [0, 0, 1];

/** 尖端固定的对称陀螺，状态 [n, L]。 */
function top(I1: number, Mgl: number): Derivative {
  return (_t, y, out) => {
    const n = [y[0], y[1], y[2]];
    const nd = cross([y[3], y[4], y[5]], n);
    const Ld = cross(z, n);
    for (let i = 0; i < 3; i++) {
      out[i] = nd[i] / I1;
      out[3 + i] = Mgl * Ld[i];
    }
  };
}

/** 对称轴在 xz 平面里、倾角 θ，对称轴的方位角以 Ω 变化、倾角以 θ̇ 变化，绕对称轴的角速度分量是 ω₃。 */
function topState(I1: number, I3: number, theta: number, Omega: number, thetaDot: number, w3: number): Vec {
  const n = [Math.sin(theta), 0, Math.cos(theta)];
  const nd = cross(z, n).map((x, i) => Omega * x + thetaDot * [Math.cos(theta), 0, -Math.sin(theta)][i]);
  const wPerp = cross(n, nd); // 单位矢量 n 的 ṅ = ω × n 只定出 ω 垂直于 n 的部分
  return [...n, ...wPerp.map((x, i) => I1 * x + I3 * w3 * n[i])];
}

/** 对称轴的竖直分量的二阶导数 n̈_z：沿 ẏ 对 ṅ_z 求方向导数（ṅ 对状态是二次的，数值求导没有截断误差）。 */
function tiltAcceleration(f: Derivative, y: Vec): number {
  const yd = new Float64Array(6);
  f(0, Float64Array.from(y), yd);
  const out = new Float64Array(6);
  return derivative((s) => {
    f(0, Float64Array.from(y.map((yi, i) => yi + s * yd[i])), out);
    return out[2];
  }, 0);
}

/** 匀速进动里慢的那个 Ω：起初 θ̇ = 0、ṅ_z = 0，再要求 n̈_z = 0，在 [lo, hi] 上二分。 */
function slowPrecession(I1: number, I3: number, Mgl: number, theta: number, w3: number, lo: number, hi: number): number {
  const f = top(I1, Mgl);
  return bisect((Omega) => tiltAcceleration(f, topState(I1, I3, theta, Omega, 0, w3)), lo, hi);
}

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.heavy-symmetric-top',
  notes: {
    p1: '快陀螺的近似是 I₃ω₃ 固定、I₁Mgl/(I₃ω₃)² → 0 的极限：取 Mgl = 0.2·9.8·0.05、I₃ω₃ = 0.02，I₁ = I₃ = 10⁻¹⁰，倾角取 0.7 和 1.2，按 [n, L] 的方程二分出让 n̈_z = 0 的慢进动角速度（两个倾角一样）；和 Mgl/(I₃ω₃) 核对。',
    p2: '取 I₁ = 1、I₃ = 0.5、Mgl = 1，从倾角 0.6、ω′ = (0.3, −0.2, 3) 出发（带章动），用一般的刚体积分算到 t = 20：L_z、ω₃ = ω·n、E = ½ω·L + Mgl n_z 的相对变化小于 10⁻⁸，|L| 在 1.53 到 2.11 之间变（倾角在 0.55 到 1.79 之间章动）。',
    p3: '对称轴偏离竖直 10⁻⁹、只绕对称轴转，按 [n, L] 的方程积分 300 s，看倾角会不会超过 10⁻³；对 ω₃ 二分出稳定和不稳定的分界（分辨率约 10⁻⁵）；和 2√(I₁Mgl)/I₃ 核对。',
    p4: '例 1 的陀螺（M = 0.5、l = 0.04、I₁ = 10⁻³、I₃ = 2×10⁻⁴）以 ω₃ = 200、倾角 60° 出发，二分出让 n̈_z = 0 的 Ω，再积分 2 s 验证倾角一直是 60°（偏差小于 10⁻⁸）；和 I₁cosθ₀Ω² − I₃ω₃Ω + Mgl = 0 的小根核对。',
  },
  compute() {
    // p1
    const Mgl1 = 0.2 * g * 0.05;
    const roots1 = [0.7, 1.2].map((theta) => slowPrecession(1e-10, 1e-10, Mgl1, theta, 0.02 / 1e-10, 0.1, 50));
    const p1 = agree(agree(roots1[0], roots1[1], 'p1 不同倾角'), Mgl1 / 0.02, 'p1 慢进动');

    // p2：一般的刚体积分，重力矩 = l n × (−Mg ẑ)，取 l = 1、Mg = 1
    const Ibody = diag([1, 1, 0.5]);
    const gravity = (R: number[][]): Vec => cross(column(R, 2), [0, 0, -1]);
    const f2 = rigidDerivative(Ibody, gravity);
    const R0 = eulerMatrix(0, 0.6, 0);
    let y2: Float64Array = Float64Array.from(rigidState(R0, matVec(R0, matVec(Ibody, [0.3, -0.2, 3]))));
    const measures = (y: Float64Array): Vec => {
      const w = omegaOf(Ibody, y);
      const L = stateL(y);
      const n = column(stateR(y), 2);
      return [L[2], dot(w, n), 0.5 * dot(w, L) + n[2], norm(L)];
    };
    const series: Vec[] = [measures(y2)];
    for (let i = 0; i < 200; i++) {
      y2 = integrateTo(f2, Array.from(y2), i * 0.1, (i + 1) * 0.1, 1e-3);
      series.push(measures(y2));
    }
    const p2 = chosen(
      [0, 1, 2, 3].map((k) => {
        const values = series.map((s) => s[k]);
        const spread = (Math.max(...values) - Math.min(...values)) / Math.abs(values[0]);
        if (spread > 1e-8 && spread < 1e-3) throw new Error(`p2 第 ${k + 1} 个量变化 ${spread}，分不清守不守恒`);
        return spread < 1e-8;
      }),
    );

    // p3：I₁ = 4×10⁻⁴、I₃ = 10⁻⁴、M = 0.1、l = 0.04
    const [I1p3, I3p3, Mgl3] = [4e-4, 1e-4, 0.1 * g * 0.04];
    const f3 = top(I1p3, Mgl3);
    const unstable = (w3: number): boolean => {
      let y: Float64Array = Float64Array.from(topState(I1p3, I3p3, 1e-9, 0, 0, w3));
      for (let s = 0; s < 300; s++) {
        y = integrateTo(f3, Array.from(y), s, s + 1, 2e-3);
        if (Math.hypot(y[0], y[1]) > 1e-3) return true;
      }
      return false;
    };
    let [lo, hi] = [50, 120];
    if (!unstable(lo) || unstable(hi)) throw new Error('p3 二分的两端不对');
    while (hi - lo > 1e-3) {
      const mid = (lo + hi) / 2;
      if (unstable(mid)) lo = mid;
      else hi = mid;
    }
    const p3 = agree((lo + hi) / 2, (2 * Math.sqrt(I1p3 * Mgl3)) / I3p3, 'p3 竖直立住的转速', 1e-4);

    // p4
    const [I1p4, I3p4, Mgl4, theta4] = [1e-3, 2e-4, 0.5 * g * 0.04, Math.PI / 3];
    const Omega4 = slowPrecession(I1p4, I3p4, Mgl4, theta4, 200, 0.1, 20);
    let y4: Float64Array = Float64Array.from(topState(I1p4, I3p4, theta4, Omega4, 0, 200));
    for (let i = 0; i < 200; i++) {
      y4 = integrateTo(top(I1p4, Mgl4), Array.from(y4), i * 0.01, (i + 1) * 0.01, 1e-4);
      if (Math.abs(y4[2] - Math.cos(theta4)) > 1e-8) throw new Error('p4 倾角变了，不是匀速进动');
    }
    const [a, b, c] = [I1p4 * Math.cos(theta4), -I3p4 * 200, Mgl4];
    const p4 = agree(Omega4, (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a), 'p4 慢进动');

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
