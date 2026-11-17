// 独立验算 physics.newtonian-mechanics.earth-rotation 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的结论（傅科摆以 ω|sin λ| 转、水平运动受的科里奥利力 2mωv′|sin λ|、铅垂线偏角的近似式）；
// 二是不用这些结论：傅科摆在地面参考系里积分摆球的水平运动，科里奥利力用完整的 ω（竖直、水平两个分量）按分量算叉积，
// 量出摆动平面转动的快慢；列车的科里奥利力按东、北、上三个分量算叉积；铅垂线的方向把吸引和离心力按矢量相加。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.earth-rotation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, check, chosen, cross, deg, rk4Step, rk4Until, scale, type V3 } from './physics.newtonian-mechanics._nm.ts';

const DAY = 86164;
const OMEGA = (2 * Math.PI) / DAY;

/** 地面参考系（东、北、上）里纬度 λ 处的角速度矢量。 */
const omegaAt = (latDeg: number, w = OMEGA): V3 => [0, w * Math.cos(latDeg * deg), w * Math.sin(latDeg * deg)];

/**
 * 傅科摆：摆球在水平面里的小振动（周期 16 s，回复力指向平衡位置），加上科里奥利力 −2ω × v′ 的水平分量
 * （ω 取完整的矢量）。从 (1, 0) 由静止释放，积分 hours 小时，记下每次离平衡位置最远时位置的方向；
 * 方向角加倍后展开（摆动平面转半圈就和原来重合），用最小二乘求出转动的角速度（rad/s，逆时针为正）。
 */
function foucaultRate(latDeg: number, hours: number): number {
  const W = omegaAt(latDeg);
  const O2 = ((2 * Math.PI) / 16) ** 2;
  const rhs = (_t: number, s: number[]): number[] => {
    const c = cross(W, [s[2], s[3], 0]);
    return [s[2], s[3], -O2 * s[0] - 2 * c[0], -O2 * s[1] - 2 * c[1]];
  };
  const h = 0.02;
  let s = [1, 0, 0, 0];
  let t = 0;
  const ts: number[] = [];
  const as: number[] = [];
  let prev = 0;
  while (t < hours * 3600) {
    const n = rk4Step(rhs, t, s, h);
    const rv = n[0] * n[2] + n[1] * n[3];
    if (prev > 0 && rv <= 0) {
      let lo = 0;
      let hi = h;
      for (let k = 0; k < 60; k++) {
        const mid = (lo + hi) / 2;
        const m = rk4Step(rhs, t, s, mid);
        if (m[0] * m[2] + m[1] * m[3] > 0) lo = mid;
        else hi = mid;
      }
      const m = rk4Step(rhs, t, s, (lo + hi) / 2);
      ts.push(t + (lo + hi) / 2);
      as.push(2 * Math.atan2(m[1], m[0]));
    }
    s = n;
    t += h;
    prev = rv;
  }
  for (let i = 1; i < as.length; i++) {
    while (as[i] - as[i - 1] > Math.PI) as[i] -= 2 * Math.PI;
    while (as[i] - as[i - 1] < -Math.PI) as[i] += 2 * Math.PI;
  }
  const n = ts.length;
  const mt = ts.reduce((a, b) => a + b, 0) / n;
  const ma = as.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (ts[i] - mt) * (as[i] - ma);
    sxx += (ts[i] - mt) ** 2;
  }
  return sxy / sxx / 2;
}

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.earth-rotation',
  notes: {
    p1: 'T = 86164 s / sin 39.9°；和积分核对：地面参考系里积分摆球 2 小时，科里奥利力用完整的 ω 按分量算，量出摆动平面转动的角速度（顺时针），转一圈的时间。',
    p2: '逐条用例子：A 南纬 30° 向北运动，−2ω × v′ 的水平分量指向西，是前进方向的左边（对）；B 积分量出北纬 30°、60° 的傅科摆转动的角速度，60° 的大（对）；C 球对称模型（g₀ = 9.8）把吸引和离心力按矢量相加，赤道上 9.766、两极 9.800，赤道的小（错）；D 北半球（科里奥利参数取 0.1）空气受指向低压中心的力、由静止开始流向中心，积分后绕中心的角动量为正，逆时针（错）；E 北纬 90° 积分量出转一圈 86164 s，约一天（对）。',
    p3: '2mωv sin40°；和分量核对：列车朝东、朝北、朝东北行驶时，在东、北、上坐标里算 −2mω × v′，水平分量的大小都一样。',
    p4: '吸引 −g₀r̂ 加离心力 ω²R cos λ（背离地轴），按矢量相加后和 −r̂ 的夹角（精确值 0.09913°）；和讲解的近似式 (ω²R/g₀) sin λ cos λ = 0.09896° 比较，差 0.17%。返回的是精确值。',
  },
  compute() {
    // p1（小时）
    const rate1 = foucaultRate(39.9, 2);
    check(rate1 < 0, 'p1 北半球顺时针转');
    const p1 = agree((2 * Math.PI) / Math.abs(rate1) / 3600, DAY / Math.sin(39.9 * deg) / 3600, 'p1 北京的傅科摆', 1e-6);

    // p2
    const fA = scale(-2, cross(omegaAt(-30), [0, 1, 0]));
    const left = cross([0, 0, 1], [0, 1, 0]); // 前进方向（北）的左边
    const optA = fA[0] * left[0] + fA[1] * left[1] > 0;
    const optB = Math.abs(foucaultRate(60, 1)) > Math.abs(foucaultRate(30, 1));
    const gEff = (latDeg: number) => {
      const lat = latDeg * deg;
      const R = 6.37e6;
      const rhat: V3 = [Math.cos(lat), 0, Math.sin(lat)]; // 地心系：x 在赤道面里，z 沿地轴
      const cf: V3 = [OMEGA * OMEGA * R * Math.cos(lat), 0, 0];
      const v: V3 = [-9.8 * rhat[0] + cf[0], -9.8 * rhat[1] + cf[1], -9.8 * rhat[2] + cf[2]];
      return Math.hypot(...v);
    };
    const optC = gEff(0) > gEff(90);
    // D：北半球，f = 2ω_z 取 0.1，指向原点、大小 1 的力，从 (10, 0) 由静止出发
    const f = 0.1;
    const typhoon = rk4Until(
      (_t, s) => {
        const r = Math.hypot(s[0], s[1]);
        return [s[2], s[3], -s[0] / r + f * s[3], -s[1] / r - f * s[2]];
      },
      [10, 0, 0, 0],
      0,
      1e-3,
      1e7,
      (_t, s) => 5 - Math.hypot(s[0], s[1]),
    ).y;
    const optD = typhoon[0] * typhoon[3] - typhoon[1] * typhoon[2] < 0; // 角动量为负才是顺时针
    const tPole = (2 * Math.PI) / Math.abs(foucaultRate(90, 1));
    const optE = Math.abs(tPole / 86400 - 1) < 0.01;
    check(Math.abs(tPole / DAY - 1) < 1e-6, 'p2 E 北极转一圈 86164 s');
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（N）
    const m3 = 4.0e5;
    const v3 = 300 / 3.6;
    const W3 = omegaAt(40, 7.29e-5);
    const horiz = (dir: V3) => {
      const F = scale(-2 * m3, cross(W3, scale(v3, dir)));
      return Math.hypot(F[0], F[1]);
    };
    const h1 = horiz([1, 0, 0]);
    check(Math.abs(horiz([0, 1, 0]) - h1) < 1e-9 * h1 && Math.abs(horiz([Math.SQRT1_2, Math.SQRT1_2, 0]) - h1) < 1e-9 * h1, 'p3 朝向不影响水平分量');
    const p3 = agree(h1, 2 * m3 * 7.29e-5 * v3 * Math.sin(40 * deg), 'p3 列车受的科里奥利力的水平分量', 1e-12);

    // p4（度）
    const lat = 45 * deg;
    const w4 = 7.29e-5;
    const R4 = 6.37e6;
    const rhat: V3 = [Math.cos(lat), 0, Math.sin(lat)];
    const geff: V3 = [-9.8 * rhat[0] + w4 * w4 * R4 * Math.cos(lat), 0, -9.8 * rhat[2]];
    const cosA = -(geff[0] * rhat[0] + geff[2] * rhat[2]) / Math.hypot(...geff);
    const exact = Math.atan2(Math.sqrt(Math.max(0, 1 - cosA * cosA)), cosA) / deg;
    const viaAtan = Math.atan((w4 * w4 * R4 * Math.sin(lat) * Math.cos(lat)) / (9.8 - w4 * w4 * R4 * Math.cos(lat) ** 2)) / deg;
    const p4 = agree(exact, viaAtan, 'p4 铅垂线的偏角', 1e-9);
    const approx = ((w4 * w4 * R4) / 9.8) * Math.sin(lat) * Math.cos(lat) / deg;
    check(Math.abs(p4 / approx - 1) < 0.002, 'p4 精确值和近似式相差不到 0.2%');

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
