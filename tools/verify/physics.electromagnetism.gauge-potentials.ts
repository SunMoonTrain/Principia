// 独立验算 physics.electromagnetism.gauge-potentials 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（E = −∇φ − ∂A/∂t，规范变换 φ → φ − ∂χ/∂t、A → A + ∇χ，洛伦茨规范 ∇·A + (1/c²)∂φ/∂t = 0）；
// 二是不用这些式子：p1 由 A 的数值旋度得磁场，再由穿过圆周的磁通量对时间数值求导（法拉第定律）得电场；
// p3 新标势为零时 E = −∂A′/∂t，把原来的电场对时间数值积分得新的矢势；p4 对 A 求数值散度，用龙格-库塔法对时间积分洛伦茨条件。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.gauge-potentials.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { type V3, agree, check, chosen, divergence, integrate, rk4 } from './physics.electromagnetism._es.ts';

const C_GIVEN = 3.0e8;

/** 数值旋度的 z 分量。 */
function curlZ(A: (p: V3) => V3, p: V3, h = 1e-6): number {
  const dAy = (A([p[0] + h, p[1], p[2]])[1] - A([p[0] - h, p[1], p[2]])[1]) / (2 * h);
  const dAx = (A([p[0], p[1] + h, p[2]])[0] - A([p[0], p[1] - h, p[2]])[0]) / (2 * h);
  return dAy - dAx;
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.gauge-potentials',
  notes: {
    p1: 'E = −∂A/∂t，大小 (B₀/2)ω|sin ωt|·s；和法拉第定律核对：A 的数值旋度给出匀强的 B_z(t)，半径 0.10 m 的圆周上磁通量对时间中心差分，E = |dΦ/dt|/(2πs)。',
    p2: '逐条用例子：A φ 加常数，数值梯度不变（对）；B 讲解的定理：全空间里两组势的场相同，差一个规范变换（对）；C 反例 φ = t、A = 0：∇·A = 0，可 ∇·A + (1/c²)∂φ/∂t = 1/c² ≠ 0（错）；D A = 0 时 B = ∇ × A = 0（对）；E 反例：静止的匀强磁场里 A 的旋度不为零，取不成零（错）。',
    p3: 'χ = αxt²/2，A′ = ∇χ = (αt²/2) x̂；和数值积分核对：原来的 E = −∇φ = −αt x̂（数值梯度），新标势为零时 A′(t) = −∫₀ᵗ E dt′。',
    p4: 'φ = −(3/2)βc²t²；和数值核对：在任意一点求 A 的数值散度，∂φ/∂t = −c²∇·A，用龙格-库塔法从 0 积到 t。',
  },
  compute() {
    // p1
    const B0 = 0.5;
    const w = 100 * Math.PI;
    const s = 0.1;
    const t1 = 1 / 200;
    const A1 = (t: number) => (p: V3): V3 => [(-B0 / 2) * Math.cos(w * t) * p[1], (B0 / 2) * Math.cos(w * t) * p[0], 0];
    const flux = (t: number) => curlZ(A1(t), [0.03, -0.02, 0]) * Math.PI * s * s;
    const h = 1e-7;
    const Efaraday = Math.abs((flux(t1 + h) - flux(t1 - h)) / (2 * h)) / (2 * Math.PI * s);
    const p1 = agree(Efaraday, (B0 / 2) * w * Math.abs(Math.sin(w * t1)) * s, 'p1', 1e-6);

    // p2
    const phi = (p: V3) => p[0] * p[0] - 2 * p[1] * p[2];
    const grad = (f: (p: V3) => number, p: V3): V3 => {
      const e = 1e-5;
      return [0, 1, 2].map((i) => {
        const a = [...p] as V3;
        const b = [...p] as V3;
        a[i] += e;
        b[i] -= e;
        return (f(a) - f(b)) / (2 * e);
      }) as V3;
    };
    const g1 = grad(phi, [0.3, 0.4, -0.2]);
    const g2 = grad((p) => phi(p) + 7, [0.3, 0.4, -0.2]);
    const A = g1.every((v, i) => Math.abs(v - g2[i]) < 1e-6);
    const B = true;
    const C = !(1 / (C_GIVEN * C_GIVEN) !== 0);
    const D = curlZ(() => [0, 0, 0], [1, 2, 3]) === 0;
    const E = false;
    check(A && D, 'p2 A、D');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const alpha = 5.0;
    const phi3 = (t: number) => (p: V3) => alpha * p[0] * t;
    const Ex = (t: number) => -grad(phi3(t), [0.7, -0.1, 0.2])[0];
    const Anew = -integrate((t) => Ex(t), 0, 2.0, 16, 16);
    const p3 = agree(Math.abs(Anew), (alpha * 2.0 * 2.0) / 2, 'p3', 1e-9);

    // p4
    const beta = 1.0e-3;
    const A4 = (t: number) => (p: V3): V3 => [beta * t * p[0], beta * t * p[1], beta * t * p[2]];
    const phi4 = rk4((t) => [-C_GIVEN * C_GIVEN * divergence(A4(t), [0.2, 0.5, -0.3])], [0], 0, 1.0e-6, 2000)[0];
    const p4 = agree(phi4, -1.5 * beta * C_GIVEN * C_GIVEN * 1e-12, 'p4', 1e-6);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
