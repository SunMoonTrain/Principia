// 独立验算 physics.oscillations-waves.phasors 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的复振幅（x = Re(X̃e^{iωt})）相加、相减；二是不用复数，把实际的 x(t) 在整数个周期上投影到
// cos ωt、sin ωt，量出振幅和初相（fitSinusoid）。选择题在具体的振动上逐条核对。
// 单独运行：npx tsx tools/verify/physics.oscillations-waves.phasors.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, cabs, cadd, carg, check, chosen, cmul, cpolar, csub, fitSinusoid, wrapAngle, type Cx } from './physics.oscillations-waves._ow.ts';

const w = 2;
/** 数值一阶、二阶导数。 */
const d1 = (f: (t: number) => number, t: number, h = 1e-4) => (f(t + h) - f(t - h)) / (2 * h);
const d2 = (f: (t: number) => number, t: number, h = 1e-3) => (f(t + h) - 2 * f(t) + f(t - h)) / (h * h);
/** 用拟合出的振幅、初相写成复振幅。 */
const phasorOf = (g: (t: number) => number, omega = w): Cx => {
  const { A, phi } = fitSinusoid(g, omega, 0, 4);
  return cpolar(A, phi);
};

export const verification: Verification = {
  lesson: 'physics.oscillations-waves.phasors',
  notes: {
    p1: '5 sin ωt = 5 cos(ωt − π/2)，复振幅 5e^{−iπ/2} = −5i，即 (0, −5)；和把 5 sin 2t 投影到 cos、sin 量出振幅、初相核对。',
    p2: '取 ω = 2、x = cos(2t + 0.3)：A 乘 e^{−iπ/3} 后的振动是 x(t − π/6)，比原来落后（错）；B 数值求速度再拟合，辐角大 π/2（对）；C cos 2t + cos(2t + π/2) 拟合出的振幅是 √2，不是 2（错）；D cos 2t + cos 3t 的 ẍ/x 不是常数，根本不是简谐运动，谈不上复振幅（错）；E 数值求加速度再拟合，辐角差 π（对）。',
    p3: '4 + 3e^{iπ/3} 的模 √37；和把 x1 + x2 拟合出振幅核对。',
    p4: '6e^{iπ/3} − 4 = −1 + 3√3 i，模 √28；和把 x − x1 投影到 cos、sin 拟合出振幅核对，另用余弦定理 6² + 4² − 2·6·4·cos 60° 核一次。',
  },
  compute() {
    // p1
    const z1 = phasorOf((t) => 5 * Math.sin(w * t));
    check(Math.abs(z1[0]) < 1e-12, 'p1 实部为零');
    const p1: number[] = [0, agree(z1[1], cpolar(5, -Math.PI / 2)[1], 'p1 虚部', 1e-12)];

    // p2
    const x = (t: number) => Math.cos(w * t + 0.3);
    const X = phasorOf(x);
    const X2 = cmul(X, cpolar(1, -Math.PI / 3));
    const x2 = (t: number) => cabs(X2) * Math.cos(w * t + carg(X2));
    const dt = Math.PI / 3 / w;
    check([0.1, 0.7, 1.9].every((t) => Math.abs(x2(t) - x(t - dt)) < 1e-12), 'p2 A 乘 e^{−iπ/3} 是落后 π/3');
    const optA = [0.1, 0.7, 1.9].every((t) => Math.abs(x2(t) - x(t + dt)) < 1e-9);
    const V = phasorOf((t) => d1(x, t));
    const optB = Math.abs(wrapAngle(carg(V) - carg(X) - Math.PI / 2)) < 1e-6;
    const optC = Math.abs(cabs(phasorOf((t) => Math.cos(w * t) + Math.cos(w * t + Math.PI / 2))) - 2) < 1e-6;
    check(Math.abs(cabs(phasorOf((t) => Math.cos(w * t) + Math.cos(w * t + Math.PI / 2))) - Math.SQRT2) < 1e-9, 'p2 C 合振幅是 √2 A');
    const two = (t: number) => Math.cos(2 * t) + Math.cos(3 * t);
    const r = [0.2, 0.9, 1.4].map((t) => d2(two, t) / two(t));
    const optD = Math.max(...r) - Math.min(...r) < 1e-4 * Math.abs(r[0]);
    const Acc = phasorOf((t) => d2(x, t));
    const optE = Math.abs(Math.abs(wrapAngle(carg(Acc) - carg(X))) - Math.PI) < 1e-6;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（cm）
    const p3 = agree(cabs(phasorOf((t) => 4 * Math.cos(w * t) + 3 * Math.cos(w * t + Math.PI / 3))), cabs(cadd([4, 0], cpolar(3, Math.PI / 3))), 'p3 合振幅', 1e-10);

    // p4（cm）
    const A4 = cabs(csub(cpolar(6, Math.PI / 3), [4, 0]));
    check(Math.abs(A4 * A4 - (6 * 6 + 4 * 4 - 2 * 6 * 4 * Math.cos(Math.PI / 3))) < 1e-12, 'p4 余弦定理');
    const p4 = agree(cabs(phasorOf((t) => 6 * Math.cos(w * t + Math.PI / 3) - 4 * Math.cos(w * t))), A4, 'p4 x2 的振幅', 1e-10);

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
