// 独立验算 physics.electromagnetism.gauss-applications 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里用高斯定律得出的对称电场；二是不用高斯定律，直接对库仑场积分：
//   直线按长度积分；球对称的分成一层层薄球壳、每层再分成一圈圈圆环（圆环轴线上的库仑场）；
//   平板分成一层层薄圆盘（圆盘轴线上的电场取半径很大的极限）。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.gauss-applications.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { EPS0, K_EXACT, agree, check, chosen, fieldAt, integrate, norm, type Charge, type V3 } from './physics.electromagnetism._es.ts';

/** 半径 a、总电荷 Q 的均匀球面，在离球心 r 处的径向电场：分成圆环，对极角积分；r 靠近 a 时自动加密。 */
function shellField(Q: number, a: number, r: number): number {
  const gap = Math.abs(r - a) / Math.max(a, r);
  const panels = Math.min(8192, Math.max(64, Math.ceil(8 / Math.max(gap, 1e-9))));
  return integrate(
    (th) => {
      const zc = a * Math.cos(th);
      const rho = a * Math.sin(th);
      return (K_EXACT * (Q / 2) * Math.sin(th) * (r - zc)) / ((r - zc) ** 2 + rho * rho) ** 1.5;
    },
    0,
    Math.PI,
    panels,
    16,
  );
}

/** 体电荷密度 rho(r′) 球对称分布在 [r1, r2] 里，离球心 r 处的电场：一层层薄球壳叠加，在 r 处把径向积分分段。 */
function sphericalField(rho: (rp: number) => number, r1: number, r2: number, r: number): number {
  const layer = (rp: number) => shellField(rho(rp) * 4 * Math.PI * rp * rp, rp, r);
  const pieces = r > r1 && r < r2 ? [[r1, r], [r, r2]] : [[r1, r2]];
  return pieces.reduce((s, [lo, hi]) => s + integrate(layer, lo, hi, 32, 16), 0);
}

/** 半径为 a 的均匀带电圆柱面（单位长度带电 lam），离轴 s 处的径向电场：分成一根根无限长直线，对方位角积分。 */
function cylShellField(lam: number, a: number, s: number): number {
  const gap = Math.abs(s - a) / Math.max(a, s);
  const panels = Math.min(8192, Math.max(64, Math.ceil(8 / Math.max(gap, 1e-9))));
  return integrate(
    (ph) => {
      const dx = s - a * Math.cos(ph);
      const dy = -a * Math.sin(ph);
      return ((lam / (2 * Math.PI)) * dx) / (2 * Math.PI * EPS0 * (dx * dx + dy * dy));
    },
    0,
    2 * Math.PI,
    panels,
    16,
  );
}

/** 小立方体、细棒、圆盘按格点分成点电荷（各维 n 段，取每段中点）。 */
function boxCharges(rho: number, lo: V3, hi: V3, n: number): Charge[] {
  const out: Charge[] = [];
  const d = [0, 1, 2].map((i) => (hi[i] - lo[i]) / n);
  const dq = rho * d[0] * d[1] * d[2];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < n; k++) out.push({ q: dq, r: [lo[0] + (i + 0.5) * d[0], lo[1] + (j + 0.5) * d[1], lo[2] + (k + 0.5) * d[2]] });
  return out;
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.gauss-applications',
  notes: {
    p1: '把细线上 x 处一小段的库仑场按长度积分（x = s sinh u，积到 ±10⁸ m）；和 λ/(2πε₀s) 核对。',
    p2: 'A：均匀带电的圆柱（半径 1），分成一层层圆柱面、每层再分成无限长直线直接积分，里面 s = 0.5、外面 s = 2 处都和高斯定律的结果一致；C：ρ = r′³ 的球体，分层直接积分，r = 0.5、2 两处都和 Q(r)/(4πε₀r²) 一致；B：边长 1 的均匀带电正方体，外接的 r = 1.5 球面上，沿面法线和沿体对角线两处电场大小差几个百分点，找不到 E 处处相同的高斯面（反例）；D：长 2 的细棒，同轴圆柱面（半径 0.5）上中点和靠近一端处电场大小不同，靠近一端还有沿轴的分量（反例）；E：半径 1 的圆盘，z = 0.5 的平面上轴上一点和离轴 0.8 的一点电场大小不同（反例）。',
    p3: '把 a < r′ < 8 cm 和 8 cm < r′ < b 两段分成一层层薄球壳，每层分成圆环直接积分库仑场（不用高斯定律）；和 ρ(r³ − a³)/(3ε₀r²) 核对。',
    p4: '把平板分成一层层薄圆盘，用圆盘轴线上的电场（直接积分得到的那个式子）、半径取 10⁹ m 逼近无穷大，在场点处分段积分；和 ρx/ε₀ 核对。',
  },
  compute() {
    // p1
    const lam = 3.0e-9;
    const s = 0.2;
    const U = Math.asinh(1e8 / s);
    const p1 = agree(
      integrate((u) => (K_EXACT * lam * s * (s * Math.cosh(u))) / (s * s * Math.cosh(u) ** 2) ** 1.5, -U, U, 256, 16),
      lam / (2 * Math.PI * EPS0 * s),
      'p1',
      1e-10,
    );

    // p2
    // A：均匀带电无限长圆柱（ρ = 1，半径 1），直接积分 vs 高斯定律
    const cylinder = (sp: number) =>
      [[0, Math.min(sp, 1)], ...(sp < 1 ? [[sp, 1]] : [])].reduce((acc, [lo, hi]) => acc + integrate((a) => cylShellField(2 * Math.PI * a, a, sp), lo, hi, 32, 16), 0);
    const A2 =
      Math.abs(cylinder(0.5) - 0.5 / (2 * EPS0)) < 1e-6 * (0.5 / (2 * EPS0)) && Math.abs(cylinder(2) - 1 / (2 * EPS0 * 2)) < 1e-6 * (1 / (4 * EPS0));
    // C：ρ = r′³ 的球体（半径 1），Q(r) = π r⁶ ·(4/6)
    const Qr = (r: number) => (4 * Math.PI * Math.min(r, 1) ** 6) / 6;
    const C2 = [0.5, 2].every((r) => Math.abs(sphericalField((rp) => rp ** 3, 0, 1, r) - (K_EXACT * Qr(r)) / (r * r)) < 1e-6 * ((K_EXACT * Qr(r)) / (r * r)));
    // B：均匀带电正方体
    const cube = boxCharges(1, [-0.5, -0.5, -0.5], [0.5, 0.5, 0.5], 40);
    const e1 = norm(fieldAt(cube, [1.5, 0, 0]));
    const e2 = norm(fieldAt(cube, [1.5 / Math.sqrt(3), 1.5 / Math.sqrt(3), 1.5 / Math.sqrt(3)]));
    check(Math.abs(e1 - e2) / e1 > 1e-3, 'p2 B：正方体外接球面上电场大小不同');
    const B2 = false;
    // D：有限长细棒（z ∈ [−1, 1]），同轴圆柱面上两点
    const rod: Charge[] = Array.from({ length: 20000 }, (_, i) => ({ q: 1e-9 / 10000, r: [0, 0, -1 + (i + 0.5) / 10000] as V3 }));
    const m1 = fieldAt(rod, [0.5, 0, 0]);
    const m2 = fieldAt(rod, [0.5, 0, 0.9]);
    check(Math.abs(norm(m1) - norm(m2)) / norm(m1) > 1e-2 && Math.abs(m2[2]) > 1e-2 * norm(m2), 'p2 D：同轴圆柱面上电场不均匀、不沿径向');
    const D2 = false;
    // E：圆盘（半径 1），z = 0.5 处轴上一点和离轴一点
    const disk: Charge[] = [];
    for (let i = 0; i < 400; i++) {
      const rr = (i + 0.5) / 400;
      const nphi = Math.max(8, Math.round(2 * Math.PI * rr * 400));
      for (let j = 0; j < nphi; j++) {
        const ph = (2 * Math.PI * (j + 0.5)) / nphi;
        disk.push({ q: (2 * Math.PI * rr * (1 / 400)) / nphi, r: [rr * Math.cos(ph), rr * Math.sin(ph), 0] });
      }
    }
    const d1 = norm(fieldAt(disk, [0, 0, 0.5]));
    const d2 = norm(fieldAt(disk, [0.8, 0, 0.5]));
    check(Math.abs(d1 - d2) / d1 > 1e-2, 'p2 E：圆盘上方同一平面上电场大小不同');
    const E2 = false;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const rho3 = 2.0e-6;
    const p3 = agree(sphericalField(() => rho3, 0.05, 0.1, 0.08), (rho3 * (0.08 ** 3 - 0.05 ** 3)) / (3 * EPS0 * 0.08 ** 2), 'p3', 1e-7);

    // p4
    const rho4 = 1.0e-6;
    const x = 0.005;
    const Rbig = 1e9;
    const layer = (z: number) => {
      const h = x - z;
      return ((rho4 / (2 * EPS0)) * Math.sign(h) * (1 - Math.abs(h) / Math.sqrt(h * h + Rbig * Rbig)));
    };
    const p4 = agree(integrate(layer, -0.01, x, 16, 16) + integrate(layer, x, 0.01, 16, 16), (rho4 * x) / EPS0, 'p4', 1e-10);

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
