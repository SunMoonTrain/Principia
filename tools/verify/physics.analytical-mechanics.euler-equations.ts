// 独立验算 physics.analytical-mechanics.euler-equations 的 p1–p4（简单题、中等题）。
// 不用欧拉方程：自由刚体在空间里 L 不变，按 ė'_k = ω × e'_k 积分取向，ω 由 L = R I′ Rᵀ ω 解出（见 _rigid.ts），
// 角速度的体分量是 ω′ = Rᵀω；变化率、稳定性、振动频率、进动角速度都从积分出的运动里读出，再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.euler-equations.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, derivative, dot, integrateTo, integrateUntil, type Vec } from './physics.analytical-mechanics._mech.ts';
import {
  bodyOmegaOf,
  column,
  cross,
  diag,
  norm,
  rigidDerivative,
  rigidState,
  stateR,
} from './physics.analytical-mechanics._rigid.ts';

const identity = diag([1, 1, 1]);

/** 主转动惯量 I、体分量 ω′₀ 出发（t = 0 时体坐标轴和空间坐标轴重合）的自由刚体。 */
function freeBody(I: Vec, w0: Vec): { f: ReturnType<typeof rigidDerivative>; y0: Vec } {
  return { f: rigidDerivative(diag(I)), y0: rigidState(identity, I.map((Ik, k) => Ik * w0[k])) };
}

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.euler-equations',
  notes: {
    p1: 'I = (2, 3, 4)，ω′ = (1, 2, 3)，按 L 守恒积分取向，在 t = ±10⁻³ 附近读出 ω′₃(t) 数值求导；和 ω̇₃ = (I₁ − I₂)ω₁ω₂/I₃ 核对。',
    p2: '取 I = (1, 2, 3)，分别绕三根主轴以 ω = 1 转、另外两个分量各加 10⁻⁴ 的扰动，积分到 t = 60：另外两个分量的最大值，绕 1、3 轴的停在 10⁻⁴ 的量级，绕 2 轴的长到和 1 同一量级（书翻了面）。',
    p3: '从 ω′ = (3, 10⁻⁵, 0) 出发积分，ω′₂ 相邻两次过零相隔半个周期，读出周期算角频率；和 Ω²(I₂ − I₁)(I₃ − I₁)/(I₂I₃) 开方核对。',
    p4: '从 ω′ = (1.5, 0, 2) 出发积分到 t = 20，对称轴（R 的第三列）在垂直于 L 的平面里的投影每 0.01 记一次方位角，展开后除以时间；和 |L|/I₁ 核对。',
  },
  compute() {
    // p1
    const b1 = freeBody([2, 3, 4], [1, 2, 3]);
    const w3 = (s: number): number => bodyOmegaOf(diag([2, 3, 4]), integrateTo(b1.f, b1.y0, 0, s, Math.abs(s) / 10))[2];
    const p1 = agree(derivative(w3, 0), ((2 - 3) * 1 * 2) / 4, 'p1 ω̇₃');

    // p2
    const I2 = [1, 2, 3];
    const stable = [0, 1, 2].map((k) => {
      const w0 = [1e-4, 1e-4, 1e-4];
      w0[k] = 1;
      const b = freeBody(I2, w0);
      let y: Float64Array = Float64Array.from(b.y0);
      let worst = 0;
      for (let i = 0; i < 600; i++) {
        y = integrateTo(b.f, Array.from(y), i * 0.1, (i + 1) * 0.1, 2e-3);
        const w = bodyOmegaOf(diag(I2), y);
        worst = Math.max(worst, ...w.filter((_, j) => j !== k).map(Math.abs));
      }
      if (worst > 1e-3 && worst < 0.1) throw new Error(`p2 绕第 ${k + 1} 轴：偏离 ${worst}，分不清稳不稳`);
      return worst < 1e-3;
    });
    const p2 = chosen(stable);

    // p3
    const b3 = freeBody([1, 2, 3], [3, 1e-5, 0]);
    const w2 = (y: Float64Array): number => bodyOmegaOf(diag([1, 2, 3]), y)[1];
    const first = integrateUntil(b3.f, b3.y0, 0, 1e-3, 20, (_t, y) => w2(y))!;
    const away = integrateTo(b3.f, Array.from(first.y), first.t, first.t + 0.01, 1e-3);
    const second = integrateUntil(b3.f, Array.from(away), first.t + 0.01, 1e-3, 40, (_t, y) => w2(y))!;
    const nu = (2 * Math.PI) / (2 * (second.t - first.t));
    const p3 = agree(nu, Math.sqrt((9 * (2 - 1) * (3 - 1)) / (2 * 3)), 'p3 角频率', 1e-5);

    // p4
    const I4 = [2, 2, 3];
    const b4 = freeBody(I4, [1.5, 0, 2]);
    const L = I4.map((Ik, k) => Ik * [1.5, 0, 2][k]);
    const Lhat = L.map((x) => x / norm(L));
    // 垂直于 L 的平面里取一组正交基 u、v
    const u = cross(Lhat, [0, 1, 0]).map((x) => x / norm(cross(Lhat, [0, 1, 0])));
    const v = cross(Lhat, u);
    const azimuth = (y: ArrayLike<number>): number => {
      const axis = column(stateR(y), 2);
      return Math.atan2(dot(axis, v), dot(axis, u));
    };
    let y4: Float64Array = Float64Array.from(b4.y0);
    let total = 0;
    let last = azimuth(y4);
    for (let i = 0; i < 2000; i++) {
      y4 = integrateTo(b4.f, Array.from(y4), i * 0.01, (i + 1) * 0.01, 1e-3);
      const a = azimuth(y4);
      total += ((a - last + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
      last = a;
    }
    const p4 = agree(total / 20, norm(L) / I4[0], 'p4 进动角速度', 1e-6);

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
