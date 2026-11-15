// 独立验算 physics.optics.brewster-angle 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（tanθ_B = n₂/n₁、菲涅耳公式 r_s、r_p、偏振度 P = (R_s − R_p)/(R_s + R_p)）；
// 二是不用菲涅耳公式：对 s、p 两种偏振直接解界面上电场、磁场切向分量连续的线性方程组（不显磁性），得到反射振幅，
// 布儒斯特角由 p 偏振反射振幅变号的地方二分；偏振度按定义用转动的偏振片检查反射光（s、p 两部分互不相干）。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.brewster-angle.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, analyze, bisect, check, chosen, deg, fieldOf, solveLinear } from './physics.optics._op.ts';

/**
 * 解边界条件：光从 n1 以入射角 th 射到 n2 上（界面 z = 0，入射面 xz）。返回 s、p 偏振的反射振幅、透射振幅。
 * s：电场沿 y，Ey、Hx 连续；p：磁场沿 y，Hy、Ex 连续（所有量取入射波为 1，H 的单位里约去了 1/(μ₀c)）。
 */
function boundary(n1: number, n2: number, th: number) {
  const ci = Math.cos(th);
  const st = (n1 * Math.sin(th)) / n2;
  const ct = Math.sqrt(1 - st * st);
  // s：1 + r = t；Hx：−n1·ci·1 + n1·ci·r = −n2·ct·t
  const [rs, ts] = solveLinear([[1, -1], [n1 * ci, n2 * ct]], [-1, n1 * ci]);
  // p：1 + r = t（Hy）；Ex：(1 − r)·ci/n1 = t·ct/n2
  const [rp, tp] = solveLinear([[1, -1], [-ci / n1, -ct / n2]], [-1, -ci / n1]);
  // 能量守恒核对：透射能流 = (n2 ct)/(n1 ci)·t²（s）；p 的 H 振幅换成 E 要乘 n1/n2
  const Ts = ((n2 * ct) / (n1 * ci)) * ts * ts;
  const Tp = ((n2 * ct) / (n1 * ci)) * (tp * n1 / n2) ** 2;
  return { rs, rp, Rs: rs * rs, Rp: rp * rp, Ts, Tp };
}
/** 讲解和电磁学里的菲涅耳公式。 */
function fresnel(n1: number, n2: number, th: number) {
  const ci = Math.cos(th);
  const ct = Math.sqrt(1 - ((n1 * Math.sin(th)) / n2) ** 2);
  const rs = (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct);
  const rp = (n1 * ct - n2 * ci) / (n1 * ct + n2 * ci);
  return { Rs: rs * rs, Rp: rp * rp };
}
/** p 偏振反射振幅变号的入射角（二分）。 */
const brewsterBC = (n1: number, n2: number) => bisect((th) => boundary(n1, n2, th).rp, 0.01, Math.PI / 2 - 0.01);

export const verification: Verification = {
  lesson: 'physics.optics.brewster-angle',
  notes: {
    p1: 'θ_B = arctan 2.42；和边界条件核对：解 p 偏振的边界方程，二分出反射振幅为零的入射角。',
    p2: '逐条用例子（边界方程）：A 玻璃 n = 1.5 在 θ_B 处 R_p = 0、R_s = 0.148，反射光只剩电场垂直于入射面的 s 偏振（错）；B 折射光 T_p = 1、T_s = 0.852，两种都有，不是线偏振（错）；C 水→空气 36.94° 加空气→水 53.06° 等于 90°（对）；D R_s = 0.148 ≠ 0（错）；E 反射光只有 s 偏振，偏振片在 [0, 2π) 上转一圈，光强为零的方向有两个（对）。',
    p3: 'R = ½R_s(θ_B)，r_s = (1 − n²)/(1 + n²)；和边界条件核对：二分出 θ_B，再解 s 偏振的边界方程。',
    p4: 'P = (R_s − R_p)/(R_s + R_p)（菲涅耳公式）；和定义核对：边界方程算出 R_s、R_p，反射光是强度 ½R_s、½R_p 的两束互不相干的线偏振光，转动偏振片求最大、最小光强。',
  },
  compute() {
    // 边界方程的能量守恒（核对方程本身没写错）
    for (const th of [10, 45, 70]) {
      const b = boundary(1, 1.5, th * deg);
      check(Math.abs(b.Rs + b.Ts - 1) < 1e-12 && Math.abs(b.Rp + b.Tp - 1) < 1e-12, `能量守恒 ${th}°`);
      const f = fresnel(1, 1.5, th * deg);
      check(Math.abs(f.Rs - b.Rs) < 1e-12 && Math.abs(f.Rp - b.Rp) < 1e-12, `和菲涅耳公式一致 ${th}°`);
    }

    // p1
    const formula1 = Math.atan(2.42) / deg;
    const p1 = agree(brewsterBC(1, 2.42) / deg, formula1, 'p1 布儒斯特角', 1e-9);

    // p2
    const thG = brewsterBC(1, 1.5);
    const bG = boundary(1, 1.5, thG);
    check(bG.Rp < 1e-20 && Math.abs(bG.Rs - 0.1479) < 1e-4, 'A：R_p = 0、R_s ≈ 0.148');
    const optA = bG.Rs < 1e-12 && bG.Rp > 0; // 只剩 p 偏振才对
    check(Math.abs(bG.Tp - 1) < 1e-12 && bG.Ts < 0.86, 'B：T_p = 1、T_s ≈ 0.852');
    const optB = bG.Ts < 1e-12 || bG.Tp < 1e-12;
    const sumC = (brewsterBC(1.33, 1) + brewsterBC(1, 1.33)) / deg;
    const optC = Math.abs(sumC - 90) < 1e-9;
    const optD = bG.Rs < 1e-12;
    // E：反射光只有 s 偏振（取 y 方向），偏振片转一圈数光强为零的方向
    const reflected = fieldOf(0, Math.sqrt(bG.Rs), 0);
    let zeros = 0;
    const N = 3600;
    const I = (th: number) => {
      const u = [Math.cos(th), Math.sin(th)];
      return (u[1] ** 2) * bG.Rs / 2 + 0 * u[0];
    };
    for (let j = 0; j < N; j++) {
      const a = I((2 * Math.PI * j) / N);
      const prev = I((2 * Math.PI * (j - 1)) / N);
      const next = I((2 * Math.PI * (j + 1)) / N);
      if (a <= prev && a < next && a < 1e-12) zeros++;
    }
    check(analyze([reflected]).min < 1e-15, 'E：反射光能被完全挡住');
    const optE = zeros === 2;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（%）
    const n3 = 1.33;
    const formula3 = 50 * ((1 - n3 * n3) / (1 + n3 * n3)) ** 2;
    const b3 = boundary(1, n3, brewsterBC(1, n3));
    const p3 = agree(50 * (b3.Rs + b3.Rp), formula3, 'p3 反射的百分比', 1e-9);

    // p4
    const f4 = fresnel(1, 1.52, 45 * deg);
    const formula4 = (f4.Rs - f4.Rp) / (f4.Rs + f4.Rp);
    const b4 = boundary(1, 1.52, 45 * deg);
    const r4 = analyze([fieldOf(0, Math.sqrt(b4.Rs), 0), fieldOf(Math.sqrt(b4.Rp), 0, 0)]);
    const p4 = agree((r4.max - r4.min) / (r4.max + r4.min), formula4, 'p4 反射光的偏振度', 1e-9);

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
