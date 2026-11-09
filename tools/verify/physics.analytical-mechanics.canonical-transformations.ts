// 独立验算 physics.analytical-mechanics.canonical-transformations 的 p1–p4（简单题、中等题）。
// 「是不是正则变换」直接看动力学：按旧变量的正则方程（偏导数数值求）积分一段运动，换成新变量后数值求 Q̇、Ṗ，
// 看它们是否满足以 K(Q, P) = H(q(Q, P), p(Q, P)) 为哈密顿量的正则方程；同时数值求括号 {Q, P} 互相核对。
// 生成函数的题：由 Q = ∂F₂/∂P 数值地反解出 q，p = ∂F₂/∂q、∂F₂/∂t 都数值求导；再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.canonical-transformations.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, chosen, derivative, integrateTo, random } from './physics.analytical-mechanics._mech.ts';
import { canonical, poisson, type Hamiltonian } from './physics.analytical-mechanics._hamilton.ts';

const rnd = random(1834);

/** 一个自由度的换元：正变换 (q, p) → (Q, P) 和逆变换。 */
interface Map1 {
  forward(q: number, p: number): [number, number];
  inverse(Q: number, P: number): [number, number];
}

/** 按旧变量的正则方程积分出的运动，按时刻缓存：数值求时间导数时同一组时刻会反复用到。 */
function trajectory(H: Hamiltonian, q0: number, p0: number): (t: number) => [number, number] {
  const f = canonical(H);
  const cache = new Map<number, [number, number]>();
  return (t) => {
    let y = cache.get(t);
    if (!y) {
      const end = integrateTo(f, [q0, p0], 0, t, 1e-3);
      y = [end[0], end[1]];
      cache.set(t, y);
    }
    return y;
  };
}

/**
 * 动力学检验：沿积分出的运动，在 t* 处数值求 Q̇、Ṗ（对时间中心差分），
 * 和 ∂K/∂P、−∂K/∂Q（K = H∘逆变换，对 Q、P 数值求导）比较，返回 Q̇ − ∂K/∂P 和 Ṗ + ∂K/∂Q。
 */
function residuals(H: Hamiltonian, map: Map1, motion: (t: number) => [number, number], tStar = 0.6): [number, number] {
  const newVars = (t: number): [number, number] => map.forward(...motion(t));
  const Qd = derivative((s) => newVars(tStar + s)[0], 0);
  const Pd = derivative((s) => newVars(tStar + s)[1], 0);
  const [Q, P] = newVars(tStar);
  const K = (a: number, b: number): number => {
    const [q, p] = map.inverse(a, b);
    return H([q], [p], tStar);
  };
  return [Qd - derivative((s) => K(Q, P + s), 0), Pd + derivative((s) => K(Q + s, P), 0)];
}

const residual = (H: Hamiltonian, map: Map1, q0: number, p0: number): number =>
  Math.max(...residuals(H, map, trajectory(H, q0, p0)).map(Math.abs));

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.canonical-transformations',
  notes: {
    p1: '取 H = p²/2 + 0.5/q²（q 始终为正），积分一段运动，换成 (Q, P) 后看 Q̇ 和 ∂K/∂P 的差，对 a 二分出差为零的 a，再核对 Ṗ = −∂K/∂Q；和数值括号 {Q, P} = 2a = 1 核对。',
    p2: '取 H = p²/2 + q⁴/4 + 0.3qp，从 3 个随机状态积分，换成新变量后看是否满足以 K = H∘逆变换为哈密顿量的正则方程；C 取 α = 0.4、1.3、2.9 各试一次。A、C 满足，B、D 不满足。',
    p3: '由 Q = ∂F₂/∂P 二分反解出 q（偏导数数值求），p = ∂F₂/∂q，K = H(q, p)；和手推的 q = ln Q、p = QP 核对。',
    p4: '由 Q = ∂F₂/∂P 在 t = 0 反解出 q，p = ∂F₂/∂q，∂F₂/∂t 都数值求导，K = H + ∂F₂/∂t；顺带用积分出的运动核对这个 K 给出的正则方程成立。和手推的值核对。',
  },
  compute() {
    // p1：Q = q²、P = ap/q
    const H1: Hamiltonian = (q, p) => p[0] ** 2 / 2 + 0.5 / q[0] ** 2;
    const map1 = (a: number): Map1 => ({
      forward: (q, p) => [q * q, (a * p) / q],
      inverse: (Q, P) => [Math.sqrt(Q), (P * Math.sqrt(Q)) / a],
    });
    // Q̇ − ∂K/∂P 带符号的残差，用来二分；运动和 a 无关，只积分一次
    const motion1 = trajectory(H1, 1.2, 0.5);
    const signedResidual = (a: number): number => residuals(H1, map1(a), motion1)[0];
    const a1 = bisect(signedResidual, 0.1, 5);
    if (Math.abs(residuals(H1, map1(a1), motion1)[1]) > 1e-6) throw new Error('p1 Ṗ 的方程不成立');
    const bracket = poisson((q) => q[0] ** 2, (q, p) => (1 * p[0]) / q[0], [1.3], [0.7]); // a = 1 时 {Q, P}
    const p1 = agree(agree(a1, 1 / bracket, 'p1 两种算法'), 1 / 2, 'p1 a');

    // p2
    const H2: Hamiltonian = (q, p) => p[0] ** 2 / 2 + q[0] ** 4 / 4 + 0.3 * q[0] * p[0];
    const rotation = (al: number): Map1 => ({
      forward: (q, p) => [q * Math.cos(al) - p * Math.sin(al), q * Math.sin(al) + p * Math.cos(al)],
      inverse: (Q, P) => [Q * Math.cos(al) + P * Math.sin(al), -Q * Math.sin(al) + P * Math.cos(al)],
    });
    const maps: Map1[][] = [
      [{ forward: (q, p) => [p, -q], inverse: (Q, P) => [-P, Q] }],
      [{ forward: (q, p) => [p, q], inverse: (Q, P) => [P, Q] }],
      [0.4, 1.3, 2.9].map(rotation),
      [{ forward: (q, p) => [2 * q, 2 * p], inverse: (Q, P) => [Q / 2, P / 2] }],
    ];
    const isCanonical = (ms: Map1[]): boolean =>
      ms.every((m) => Array.from({ length: 3 }, () => residual(H2, m, 2 * rnd() - 1, 2 * rnd() - 1) < 1e-6).every(Boolean));
    const p2 = chosen(maps.map(isCanonical));

    // p3：H = p²/2 + q，F₂ = e^q P，求 K(Q = 2, P = 3)
    const F3 = (q: number, P: number): number => Math.exp(q) * P;
    const [Q3, P3] = [2, 3];
    const q3 = bisect((q) => derivative((s) => F3(q, P3 + s), 0) - Q3, -10, 10);
    const p3mom = derivative((s) => F3(q3 + s, P3), 0);
    if (Math.abs(q3 - Math.log(Q3)) > 1e-8 || Math.abs(p3mom - Q3 * P3) > 1e-6) throw new Error('p3 反解和手推的不一致');
    const p3 = agree(p3mom ** 2 / 2 + q3, 18 + Math.log(2), 'p3 K');

    // p4：H = (p² + q²)/2，F₂ = qPe^t，求 K(t = 0, Q = 1, P = 1)
    const F4 = (q: number, P: number, t: number): number => q * P * Math.exp(t);
    const H4: Hamiltonian = (q, p) => 0.5 * (p[0] ** 2 + q[0] ** 2);
    const Kof = (Q: number, P: number, t: number): number => {
      const q = bisect((x) => derivative((s) => F4(x, P + s, t), 0) - Q, -50, 50);
      const p = derivative((s) => F4(q + s, P, t), 0);
      return H4([q], [p], t) + derivative((s) => F4(q, P, t + s), 0);
    };
    // 核对：沿积分出的运动，新变量 Q = qe^t、P = pe^{−t} 满足以这个 K 为哈密顿量的正则方程
    {
      const motion4 = trajectory(H4, 0.8, -0.3);
      const newVars = (t: number): [number, number] => {
        const [q, p] = motion4(t);
        return [q * Math.exp(t), p * Math.exp(-t)];
      };
      const ts = 0.5;
      const [Q, P] = newVars(ts);
      const Qd = derivative((s) => newVars(ts + s)[0], 0);
      const Pd = derivative((s) => newVars(ts + s)[1], 0);
      const dKdP = derivative((s) => Kof(Q, P + s, ts), 0, 1e-2);
      const dKdQ = derivative((s) => Kof(Q + s, P, ts), 0, 1e-2);
      if (Math.abs(Qd - dKdP) > 1e-5 || Math.abs(Pd + dKdQ) > 1e-5) throw new Error('p4 K 给出的正则方程不成立');
    }
    const p4 = agree(Kof(1, 1, 0), 0.5 * (1 + 1) + 1, 'p4 K');

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
