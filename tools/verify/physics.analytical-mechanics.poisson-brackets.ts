// 独立验算 physics.analytical-mechanics.poisson-brackets 的 p1–p4（简单题、中等题）。
// 泊松括号按本节的定义用数值偏导数算；「守不守恒」既看 {f, H} 在随机状态上是不是零，也积分一段运动看 f 变没变；
// 周期平均把被平均的量挂在状态上和运动一起积分；再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.poisson-brackets.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, integrateTo, random } from './physics.analytical-mechanics._mech.ts';
import { canonical, onePeriod, poisson, withIntegral, type PhaseFunction } from './physics.analytical-mechanics._hamilton.ts';

const rnd = random(1781);

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.poisson-brackets',
  notes: {
    p1: '按定义数值求 ∂(q²)/∂q·∂(p²)/∂p − ∂(q²)/∂p·∂(p²)/∂q 在 (1, 2) 处的值；和 4qp 核对。',
    p2: '对每个量：在 6 个随机状态上数值求 {f, H}，再从一个随机状态积分 5 秒看 f 的变化；两样都为零才算守恒。A、D 守恒，L_z 和 p_y 不守恒。',
    p3: '在 (x, y, p_x, p_y) = (1, 0, 0, 2) 处数值求 {L_z, A}（L_z 在前）；先在随机状态上核对 L_z、A 确实守恒；和手算的 p_y² − p_x² + y² − x² 核对。',
    p4: '从 q = 0、p = √6（E = 3）出发积分一个周期，同时积分 p²/2，除以周期得到平均动能；顺带核对 qp 回到原值。和 ⟨p²⟩ = ⟨q⁴⟩ 推出的 2E/3 核对。',
  },
  compute() {
    // p1
    const p1 = agree(
      poisson((q) => q[0] ** 2, (_q, p) => p[0] ** 2, [1], [2]),
      4 * 1 * 2,
      'p1 括号',
    );

    // p2：H = ½(p_x² + p_y²) + ½(x² + 4y²)，状态 q = (x, y)、p = (p_x, p_y)
    const H2: PhaseFunction = (q, p) => 0.5 * (p[0] ** 2 + p[1] ** 2) + 0.5 * (q[0] ** 2 + 4 * q[1] ** 2);
    const fs: PhaseFunction[] = [
      (q, p) => 0.5 * (p[0] ** 2 + q[0] ** 2),
      (q, p) => q[0] * p[1] - q[1] * p[0],
      (_q, p) => p[1],
      (q, p) => 0.5 * p[1] ** 2 + 2 * q[1] ** 2,
    ];
    const state = (): [number[], number[]] => [
      [2 * rnd() - 1, 2 * rnd() - 1],
      [2 * rnd() - 1, 2 * rnd() - 1],
    ];
    const conserved = (f: PhaseFunction): boolean => {
      const bracketZero = Array.from({ length: 6 }, () => {
        const [q, p] = state();
        return Math.abs(poisson(f, H2, q, p)) < 1e-7;
      }).every(Boolean);
      const [q0, p0] = state();
      const end = integrateTo(canonical(H2), [...q0, ...p0], 0, 5, 1e-3);
      const drift = Math.abs(f([end[0], end[1]], [end[2], end[3]], 5) - f(q0, p0, 0));
      return bracketZero && drift < 1e-7;
    };
    const p2 = chosen(fs.map(conserved));

    // p3：各向同性振子
    const H3: PhaseFunction = (q, p) => 0.5 * (p[0] ** 2 + p[1] ** 2 + q[0] ** 2 + q[1] ** 2);
    const Lz: PhaseFunction = (q, p) => q[0] * p[1] - q[1] * p[0];
    const A: PhaseFunction = (q, p) => p[0] * p[1] + q[0] * q[1];
    for (let i = 0; i < 4; i++) {
      const [q, p] = state();
      if (Math.abs(poisson(Lz, H3, q, p)) > 1e-7 || Math.abs(poisson(A, H3, q, p)) > 1e-7) throw new Error('p3 L_z 或 A 不守恒');
    }
    const [x, y, px, py] = [1, 0, 0, 2];
    const p3 = agree(poisson(Lz, A, [x, y], [px, py]), py ** 2 - px ** 2 + y ** 2 - x ** 2, 'p3 {L_z, A}');

    // p4：H = p²/2 + q⁴/4，E = 3，周期平均的动能
    const H4: PhaseFunction = (q, p) => p[0] ** 2 / 2 + q[0] ** 4 / 4;
    const f4 = withIntegral(canonical(H4), 1, (_q, p) => p[0] ** 2 / 2);
    const per = onePeriod(f4, [0, Math.sqrt(6), 0], 0, 1e-4, 100);
    if (Math.abs(per.y[0] * per.y[1] - 0) > 1e-6) throw new Error('p4 qp 没回到原值');
    const p4 = agree(per.y[2] / per.T, (2 * 3) / 3, 'p4 平均动能');

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
