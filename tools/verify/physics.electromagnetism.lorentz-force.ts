// 独立验算 physics.electromagnetism.lorentz-force 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的公式 R = mv/(|q|B)、f = |q|B/(2πm)、速度选择器 v = E/B、螺距 v∥·2πm/(|q|B)；
// 二是不用这些式子：用四阶龙格-库塔法积分 m dv/dt = q(E + v × B)，二分出速度分量变号的时刻，读位置。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.lorentz-force.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { type V3, agree, bisect, check, chosen, cross, lorentzRhs, rk4, rk4Until } from './physics.electromagnetism._es.ts';

const zero = (): V3 => [0, 0, 0];

/**
 * 粒子从原点以 v x̂ 出发，磁场 B ẑ：积到 vy 由负变成非负（正电荷是半圈，负电荷是一整圈），返回那一刻的状态和时间。
 * 步长取 dtGuess（只用来定步长，结果由二分决定）。
 */
function orbitEvent(qOverM: number, v: number, B: number, dtGuess: number, vz = 0) {
  const f = lorentzRhs(qOverM, zero, () => [0, 0, B]);
  return rk4Until(f, [0, 0, 0, v, 0, vz], 0, dtGuess, 1e7, (_t, s) => s[4]);
}

/** 数值求回旋半径：正电荷半圈后 y = −2R。 */
function radiusNumeric(qOverM: number, v: number, B: number): number {
  const dt = 1e-4 / Math.abs(qOverM * B);
  const s = orbitEvent(Math.abs(qOverM), v, B, dt);
  return Math.abs(s.y[1]) / 2;
}

/** 数值求回旋周期：负电荷绕一整圈后 vy 才由负变成非负。 */
function periodNumeric(qOverM: number, B: number): number {
  const dt = 1e-4 / Math.abs(qOverM * B);
  return orbitEvent(-Math.abs(qOverM), 1, B, dt).t;
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.lorentz-force',
  notes: {
    p1: 'R = mv/(eB)；和龙格-库塔法积分质子的运动、半圈后到起点的距离除以 2 核对。',
    p2: '逐条用龙格-库塔法数值求半径、周期：A 同速度时电子和质子的半径之比是 mₑ/mₚ（错）；B 同动量时半径相同（对）；C B 加倍时周期减半、频率加倍（对）；D 反例：速度平行于磁场时沿直线匀速运动，磁场不为零（错）；E v × B = x̂ × ẑ = −ŷ，受力沿 −y（错）。',
    p3: 'v = E/B₁，落点距离 2mv/(eB₂)；和数值核对：在速度选择器里二分出直线通过（横向位移为零）的速度，再积分半圈读落点。常量按题面：1 u = 1.6605×10⁻²⁷ kg，e = 1.6022×10⁻¹⁹ C。',
    p4: '螺距 v cos30°·2πm/(eB)；和龙格-库塔法积分电子绕一整圈（垂直于磁场的速度分量回到原方向）沿磁场前进的距离核对。',
  },
  compute() {
    // p1
    const mp = 1.6726e-27;
    const e1 = 1.6022e-19;
    const v1 = 3.0e5;
    const B1 = 0.1;
    const p1 = agree(radiusNumeric(e1 / mp, v1, B1) * 100, ((mp * v1) / (e1 * B1)) * 100, 'p1', 1e-8);

    // p2
    const me = 9.109e-31;
    const v = 1e5;
    const B = 0.5;
    const Re = radiusNumeric(e1 / me, v, B);
    const Rp = radiusNumeric(e1 / mp, v, B);
    check(Math.abs(Re / Rp - me / mp) < 1e-7, 'p2 A：同速度半径之比 = 质量之比');
    const A = Math.abs(Re / Rp - 1) < 1e-6;
    const p = mp * v;
    const ReP = radiusNumeric(e1 / me, p / me, B);
    const RpP = radiusNumeric(e1 / mp, p / mp, B);
    const Bopt = Math.abs(ReP / RpP - 1) < 1e-7;
    const T1 = periodNumeric(e1 / mp, B);
    const T2 = periodNumeric(e1 / mp, 2 * B);
    const C = Math.abs(T1 / T2 - 2) < 1e-7;
    const par = rk4(lorentzRhs(e1 / mp, zero, () => [0, 0, B]), [0, 0, 0, 0, 0, v], 0, 1e-6, 1000);
    check(Math.abs(par[3]) + Math.abs(par[4]) === 0 && Math.abs(par[2] - v * 1e-6) < 1e-12, 'p2 D：沿磁场运动走直线');
    const D = false; // 有反例
    const F = cross([1, 0, 0], [0, 0, 1]);
    const E = F[1] > 0;
    const p2 = chosen([A, Bopt, C, D, E]);

    // p3
    const m3 = 40 * 1.6605e-27;
    const e3 = 1.6022e-19;
    const qm3 = e3 / m3;
    const Esel = 1.0e4;
    const Bsel = 0.1;
    const Bmag = 0.4;
    // 速度选择器：E 沿 +y、B 沿 +z，离子沿 +x 飞 10 cm，横向位移为零的速度
    const deflect = (vx: number) => {
      const f = lorentzRhs(qm3, () => [0, Esel, 0], () => [0, 0, Bsel]);
      return rk4(f, [0, 0, 0, vx, 0, 0], 0, 0.1 / vx, 2000)[1];
    };
    const vSel = bisect(deflect, 0.5e5, 2e5);
    const hit3 = orbitEvent(qm3, vSel, Bmag, 1e-4 / (qm3 * Bmag));
    const p3 = agree(Math.abs(hit3.y[1]) * 100, ((2 * m3 * (Esel / Bsel)) / (e3 * Bmag)) * 100, 'p3', 1e-8);

    // p4
    const m4 = 9.109e-31;
    const e4 = 1.602e-19;
    const v4 = 3.0e6;
    const B4 = 2.0e-3;
    const th = Math.PI / 6;
    const hit4 = orbitEvent(-e4 / m4, v4 * Math.sin(th), B4, 1e-4 / ((e4 / m4) * B4), v4 * Math.cos(th));
    const p4 = agree(hit4.y[2] * 100, v4 * Math.cos(th) * ((2 * Math.PI * m4) / (e4 * B4)) * 100, 'p4', 1e-8);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
