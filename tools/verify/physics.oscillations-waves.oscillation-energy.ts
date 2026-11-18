// 独立验算 physics.oscillations-waves.oscillation-energy 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的 E = ½kA²、v = ω0√(A² − x²)、U″(x0)；二是用 RK4 积分运动方程，在数值解上直接算动能和势能
// （p1），由两组位置、速率二分出振幅（p3），或者用真实的非线性弹簧力积分小振幅的运动、量周期（p4）。选择题在一个具体的
// 振子上逐条核对。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.oscillation-energy.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, oscillator, periodOf, trajectory } from './physics.oscillations-waves._ow.ts';

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.oscillation-energy',
  notes: {
    p1: '½×200×0.030²；和取 m = 0.5 kg 积分 0.37 s，在数值解上算 ½mv² + ½kx² 核对。',
    p2: '在 m = 0.5 kg、k = 200 N/m、A = 0.03 m 的振子上逐条：A 速率最大的时刻位移为零，弹性势能为零（对）；B 动能隔半个周期就重复（错）；C 动能等于势能时 |x| = A/√2（错）；D 速率是最大的一半时 |x| = (√3/2)A（对）；E k 加倍、A 不变，机械能加倍（对）。',
    p3: 'v² = ω²(A² − x²) 两式相减得 ω² = 100，A² = 0.0025；和二分：由第一组定 ω，找使第二组也满足的 A。',
    p4: '每根弹簧伸长 0.05 m、拉力 2.5 N，横向 U″(0) = 2·k(L − L0)/L = 20 N/m，T = 2π√(m/20)；和用两根弹簧的真实合力（沿弹簧方向，大小 k(√(L² + y²) − L0)）积分振幅 1e-5 m 的运动、量周期核对。',
  },
  compute() {
    // p1（J）
    const k = 200;
    const A = 0.03;
    const m = 0.5;
    const traj = trajectory(oscillator(m, 0, k), [A, 0], 0, 0.5, 50000);
    const s = traj(0.37);
    const p1 = agree(0.5 * m * s[1] ** 2 + 0.5 * k * s[0] ** 2, 0.5 * k * A * A, 'p1 机械能', 1e-9);

    // p2
    const w = Math.sqrt(k / m);
    const T = (2 * Math.PI) / w;
    const KE = (t: number) => 0.5 * m * traj(t)[1] ** 2;
    const PE = (t: number) => 0.5 * k * traj(t)[0] ** 2;
    const tMax = Math.PI / 2 / w; // x = A cos ωt，速率最大
    const optA = Math.abs(PE(tMax)) < 1e-9 && Math.abs(KE(tMax) - 0.5 * k * A * A) < 1e-9;
    const optB = !([0.03, 0.07, 0.11].every((t) => Math.abs(KE(t + T / 2) - KE(t)) < 1e-9));
    check(!optB, 'p2 B 动能半个周期就重复');
    const tEq = bisect((t) => KE(t) - PE(t), 0.001, tMax);
    const optC = Math.abs(Math.abs(traj(tEq)[0]) - A / 2) < 1e-6;
    check(Math.abs(Math.abs(traj(tEq)[0]) - A / Math.SQRT2) < 1e-8, 'p2 C 动能等于势能时 |x| = A/√2');
    const tHalf = bisect((t) => Math.abs(traj(t)[1]) - 0.5 * w * A, 0.0001, tMax);
    const optD = Math.abs(Math.abs(traj(tHalf)[0]) - (Math.sqrt(3) / 2) * A) < 1e-8;
    const optE = Math.abs(0.5 * (2 * k) * A * A - 2 * (0.5 * k * A * A)) < 1e-15;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（cm）
    const x1 = 0.03;
    const v1 = 0.4;
    const x2 = 0.04;
    const v2 = 0.3;
    const Anum = bisect((AA) => {
      const om = v1 / Math.sqrt(AA * AA - x1 * x1);
      return om * Math.sqrt(AA * AA - x2 * x2) - v2;
    }, 0.0401, 1);
    const om2 = (v1 * v1 - v2 * v2) / (x2 * x2 - x1 * x1);
    const p3 = agree(Anum * 100, Math.sqrt(v1 * v1 / om2 + x1 * x1) * 100, 'p3 振幅', 1e-9);

    // p4（s）
    const ks = 50;
    const L0 = 0.2;
    const L = 0.25;
    const mb = 0.1;
    const force = (y: number) => {
      const len = Math.hypot(L, y);
      return (-2 * ks * (len - L0) * y) / len;
    };
    const Tnum = periodOf((_t, yy) => [yy[1], force(yy[0]) / mb], [1e-5, 0], 0, 1e-5, 4);
    const keff = (2 * ks * (L - L0)) / L;
    const p4 = agree(Tnum, 2 * Math.PI * Math.sqrt(mb / keff), 'p4 小振动的周期', 1e-7);

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
