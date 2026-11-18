// 独立验算 physics.oscillations-waves.waves-in-3d 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 λ = 2π/|k|、球面波振幅按 1/r、强度 P/(4πr²)；二是不用这些式子，直接对 ψ 做数值计算：
// 沿波矢方向二分出相邻两个波峰量波长，用相位的数值梯度定传播方向，用中心差分检查球面波满足三维波动方程，
// 把均匀的强度在球面上数值积分（∮ I dA = P）反求强度。选择题用具体的例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.waves-in-3d.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, integrate, timeAverage, waveResidual3D } from './physics.oscillations-waves._ow.ts';

type V3 = [number, number, number];
const norm = (a: V3) => Math.hypot(...a);

/** 沿单位矢量 n 从原点出发，t = 0 时 ψ 相邻两个极大值的间距。 */
function crestSpacingAlong(psi: (r: V3) => number, n: V3, span: number): number {
  const g = (s: number) => psi([n[0] * s, n[1] * s, n[2] * s]);
  const d = (s: number) => (g(s + 1e-7) - g(s - 1e-7)) / 2e-7;
  const peaks: number[] = [];
  const steps = 20000;
  for (let i = 0; i < steps && peaks.length < 2; i++) {
    const a = (i * span) / steps + 1e-3;
    const b = a + span / steps;
    if (d(a) > 0 && d(b) <= 0) peaks.push(bisect(d, a, b));
  }
  check(peaks.length === 2, '找到两个相邻的波峰');
  return peaks[1] - peaks[0];
}

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.waves-in-3d',
  notes: {
    p1: '|k| = 5，λ = 2π/5；和沿 (3, 4, 0)/5 方向二分出 t = 0 时相邻两个波峰、量间距核对。',
    p2: 'A ψ 沿垂直于 k 的 (4, −3, 0) 方向不变，波阵面垂直于 k（对）；B f(r − vt)/r 的振幅在 r = 1、2 处之比是 2，不是 4（错）；C k = (3, 4, 0) 和 z 轴垂直（错）；D 弦上的行波，振幅加倍、时间平均的能流变为 4 倍（对）；E 1/r 在 r = 1、2、4 处每走一步减小 0.5、0.25，越远减小得越慢（错）。另用中心差分核对 f(r − vt)/r 满足三维波动方程。',
    p3: 'λ = 2π/3，cos γ = 1/3；和沿 k 的方向量相邻波峰的间距、由相位的数值梯度求传播方向再算和 z 轴的夹角核对。',
    p4: 'I = P/(4πr²)；和把均匀的强度 I 在半径 5 m 的球面上做二重数值积分（r² sin θ dθ dφ），由 ∮ I dA = P 反求 I 核对。',
  },
  compute() {
    // p1（m）
    const psi1 = (r: V3) => Math.cos(1700 * 0 - 3 * r[0] - 4 * r[1]);
    const p1 = agree(crestSpacingAlong(psi1, [0.6, 0.8, 0], 5), (2 * Math.PI) / 5, 'p1 波长', 1e-8);

    // p2
    const psi2 = (r: V3, t: number) => Math.cos(2 * t - 3 * r[0] - 4 * r[1]);
    const optA = [0.3, 1.1, 2.7].every((s) => Math.abs(psi2([0.2 + 0.8 * s, 0.5 - 0.6 * s, 0.1], 0.3) - psi2([0.2, 0.5, 0.1], 0.3)) < 1e-12);
    const v = 2;
    const fsh = (s: number) => Math.exp(-((s - 3) ** 2));
    const sph = (x: number, y: number, z: number, t: number) => { const rr = Math.hypot(x, y, z); return fsh(rr - v * t) / rr; };
    check(Math.abs(waveResidual3D(sph, v, [1.2, 0.9, 0.7], 0.3)) < 1e-4, 'p2 f(r − vt)/r 满足三维波动方程');
    const ampAt = (r: number) => Math.max(...Array.from({ length: 2001 }, (_, i) => Math.abs(sph(r, 0, 0, (r - 3) / v - 1 + i * 0.001))));
    const optB = Math.abs(ampAt(1) / ampAt(2) - 4) < 1e-3;
    check(Math.abs(ampAt(1) / ampAt(2) - 2) < 1e-6, 'p2 B 振幅之比是 2');
    const k2: V3 = [3, 4, 0];
    const optC = Math.abs(Math.abs(k2[2]) / norm(k2) - 1) < 1e-12;
    const flux = (A: number) => { const w = 3; const kk = 1.5; const T = 2; return timeAverage((t) => -T * (A * kk * Math.sin(w * t - kk * 0.4)) * (-A * w * Math.sin(w * t - kk * 0.4)), (2 * Math.PI) / w); };
    const optD = Math.abs(flux(2) / flux(1) - 4) < 1e-9;
    const drops = [1 / 1 - 1 / 2, 1 / 2 - 1 / 4];
    const optE = drops[1] > drops[0];
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（m，度）
    const k3: V3 = [2, 2, 1];
    const psi3 = (r: V3) => Math.cos(-(k3[0] * r[0] + k3[1] * r[1] + k3[2] * r[2]));
    // 相位 θ = −k·r 的数值梯度
    const phase = (r: V3) => -(k3[0] * r[0] + k3[1] * r[1] + k3[2] * r[2]);
    const h = 1e-5;
    const grad: V3 = [0, 1, 2].map((i) => {
      const a: V3 = [0.3, -0.2, 0.5];
      const b: V3 = [0.3, -0.2, 0.5];
      a[i] += h;
      b[i] -= h;
      return -(phase(a) - phase(b)) / (2 * h); // 传播方向沿 −∇θ
    }) as V3;
    const dir: V3 = [grad[0] / norm(grad), grad[1] / norm(grad), grad[2] / norm(grad)];
    const lam3 = crestSpacingAlong(psi3, dir, 5);
    const ang = (Math.acos(dir[2]) * 180) / Math.PI;
    const p3: number[] = [agree(lam3, (2 * Math.PI) / norm(k3), 'p3 波长', 1e-8), agree(ang, (Math.acos(1 / 3) * 180) / Math.PI, 'p3 和 z 轴的夹角', 1e-9)];

    // p4（mW/m²）
    const R = 5;
    const area = integrate((th) => integrate(() => R * R * Math.sin(th), 0, 2 * Math.PI, 4), 0, Math.PI, 16);
    const p4 = agree((0.5 / area) * 1000, (0.5 / (4 * Math.PI * R * R)) * 1000, 'p4 强度', 1e-12);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
