// 独立验算 physics.newtonian-mechanics.gyroscopes 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 φ̇ = Mgl/(I₃ω₃)；二是在陀螺仪近似下直接用 RK4 积分 d(I₃ω₃e₃)/dt = Mgl·e_z × e₃，
// 看对称轴的水平投影转一整圈用多久（p4 再对 ω₃ 二分，使这个时间等于 5.0 s）。
// 另外用重陀螺稳定进动的精确条件 Mgl = φ̇(I₃ω₃ − I₁φ̇cosθ) 的慢根看陀螺仪近似在题目的数下差多少（只作检查）。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.newtonian-mechanics.gyroscopes.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, cross, rk4Until, type V3 } from './physics.newtonian-mechanics._nm.ts';

const g = 9.8;
const EZ: V3 = [0, 0, 1];

/** 陀螺仪近似：L = I₃ω₃e₃，dL/dt = Mgl·e_z × e₃。返回对称轴的水平投影转一整圈（φ 增加 2π，ω₃ < 0 时减少 2π）的时间。 */
/** 状态 [e₃x, e₃y, e₃z, φ]：de₃/dt = (Mgl/(I₃ω₃)) e_z × e₃，φ 是对称轴水平投影的方位角。spin = I₃ω₃（带正负）。 */
const rhsFor = (Mgl: number, spin: number) => (_t: number, s: number[]): number[] => {
  const e: V3 = [s[0], s[1], s[2]];
  const de = cross(EZ, e).map((c) => (Mgl / spin) * c) as V3;
  const rho2 = e[0] * e[0] + e[1] * e[1];
  const dphi = (e[0] * de[1] - e[1] * de[0]) / rho2;
  return [de[0], de[1], de[2], dphi];
};
const start = (theta0: number) => [Math.sin(theta0), 0, Math.cos(theta0), 0];

function precessionPeriod(Mgl: number, spin: number, theta0 = Math.PI / 6): number {
  const sign = Math.sign(spin);
  const rate = Mgl / Math.abs(spin);
  const h = (2 * Math.PI) / rate / 4000;
  const rhs = rhsFor(Mgl, spin);
  const y0 = start(theta0);
  const res = rk4Until(rhs, y0, 0, h, 1e7, (_t, s) => sign * s[3] - 2 * Math.PI);
  return res.t;
}

/** 重陀螺稳定进动的慢根：I₁cosθ·φ̇² − I₃ω₃·φ̇ + Mgl = 0。 */
const slowRoot = (I1: number, theta: number, spinL: number, Mgl: number) => {
  const A = I1 * Math.cos(theta);
  return (spinL - Math.sqrt(spinL * spinL - 4 * A * Mgl)) / (2 * A);
};

export const verification: Verification = {
  lesson: 'physics.newtonian-mechanics.gyroscopes',
  notes: {
    p1: 'φ̇ = Mgl/(I₃ω₃) = 0.098/0.2；和陀螺仪近似下 RK4 积分 de₃/dt 的周期核对。检查：取 I₁ = 7.5e-4 kg·m²（转子当圆盘，对支点再加 Ml²）、θ = 30°，精确的稳定进动慢根和近似值差约 0.16%。',
    p2: '逐条用例子（I₃ = 2e-4、M = 0.15、l = 0.04、ω₃ = 300；选项顺序照批次 21 修订后的，原来的 B、A、C、E、D）：A 匀速进动时质心的高度 l·cosθ 不变，重力的功率 Mg·v_z 一直为零（错）；B ω₃ 变号后积分出的 φ 反向转（对）；C 密度加倍，M、I₃ 都加倍，φ̇ 不变（对）；D 月球 g = 1.62，φ̇ 是地球上的 1.62/9.8（对）；E 质量加倍、I₃ 不变，φ̇ 变成 2 倍而不是一半（错）。',
    p3: '圆盘 I₃ = ½MR²，T = 2πI₃ω₃/(Mgl)；和 RK4 积分（对称轴水平，θ = 90°）的周期核对。',
    p4: 'ω₃ = Mgl·T/(2πI₃)；和对 ω₃ 二分、使 RK4 积分出的进动周期等于 5.0 s 核对。',
  },
  compute() {
    // p1（rad/s）
    const I3a = 5.0e-4;
    const wa = 400;
    const Mgla = 0.2 * g * 0.05;
    const rateA = Mgla / (I3a * wa);
    const p1 = agree((2 * Math.PI) / precessionPeriod(Mgla, I3a * wa), rateA, 'p1 进动角速度', 1e-9);
    const exactA = slowRoot(7.5e-4, Math.PI / 6, I3a * wa, Mgla);
    check(Math.abs(exactA / rateA - 1) < 5e-3, 'p1 陀螺仪近似和稳定进动精确慢根相差不到 0.5%');

    // p2
    const I3 = 2e-4;
    const M = 0.15;
    const l = 0.04;
    const w3 = 300;
    const phiDot = (spin: number) => rhsFor(M * g * l, spin)(0, start(Math.PI / 6))[3];
    check(Math.abs(precessionPeriod(M * g * l, -I3 * w3) - precessionPeriod(M * g * l, I3 * w3)) < 1e-9, 'p2 A 反向时转一圈的时间不变');
    const optA = phiDot(I3 * w3) > 0 && phiDot(-I3 * w3) < 0;
    // B：对称轴绕竖直线转，质心 (l sinθ cos φ, l sinθ sin φ, l cosθ)，v_z = 0
    const vz = (phiDot: number) => 0 * phiDot; // z = l cosθ 不随 φ 变
    const optB = Math.abs(M * g * vz(1.3)) > 0;
    const rate = (MM: number, II: number, gg = g) => (MM * gg * l) / (II * w3);
    const optC = Math.abs(rate(2 * M, 2 * I3) - rate(M, I3)) < 1e-15;
    const optD = Math.abs(rate(2 * M, I3) - 0.5 * rate(M, I3)) < 1e-15;
    check(Math.abs(rate(2 * M, I3) / rate(M, I3) - 2) < 1e-12, 'p2 D 质量加倍，进动角速度变成 2 倍');
    const optE = rate(M, I3, 1.62) < rate(M, I3);
    // 变量名是修订前的字母；修订后的顺序是原来的 B、A、C、E、D
    const p2 = chosen([optB, optA, optC, optE, optD]);

    // p3（s）
    const I3c = 0.5 * 1.5 * 0.1 ** 2;
    const Mglc = 1.5 * g * 0.15;
    const Tnum = precessionPeriod(Mglc, I3c * 100, Math.PI / 2 - 1e-9);
    const p3 = agree(Tnum, (2 * Math.PI * I3c * 100) / Mglc, 'p3 进动一圈的时间', 1e-9);

    // p4（rad/s）
    const I3d = 1.2e-4;
    const Mgld = 0.1 * g * 0.03;
    const wNum = bisect((w) => precessionPeriod(Mgld, I3d * w) - 5.0, 50, 1000);
    const p4 = agree(wNum, (Mgld * 5.0) / (2 * Math.PI * I3d), 'p4 自转角速度', 1e-9);

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
