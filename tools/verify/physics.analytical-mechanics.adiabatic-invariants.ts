// 独立验算 physics.analytical-mechanics.adiabatic-invariants 的 p1–p4（简单题、中等题）。
// 直接模拟参数缓慢变化的过程：参数按 tanh 平滑地从初值变到终值（_hamilton.ts 的 ramp，ε = 0.02 或 0.05），
// 运动按正则方程（偏导数数值求）或由直角坐标按达朗贝尔原理用 RK4 积分；变完以后读出能量、高度、振幅，
// 和由作用量变量不变手推的结果核对（容差 1e-5，余下的差是积分误差，步长减半时跟着变小）。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.adiabatic-invariants.ts

import { fileURLToPath } from 'node:url';
import type { Derivative } from '../../packages/anim/src/ode.ts';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, integrateTo, integrateUntil, systemDerivative, type System } from './physics.analytical-mechanics._mech.ts';
import { canonical, ramp } from './physics.analytical-mechanics._hamilton.ts';

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.adiabatic-invariants',
  notes: {
    p1: '取 m = 1，k 从 1 缓慢变到 4（ε = 0.02，历时 1000），从能量 1 出发积分，变完读出能量；和 I = E/ω 不变推出的 2 核对。',
    p2: '摆球 l(t)(sinϕ, −cosϕ)，g = 1，l 从 1 缓慢变到 0.3（ε = 0.05），按达朗贝尔原理积分；开始和变完各量一个周期里的振幅 ϕ₀、算 E_osc = ½l²ϕ̇² + gl(1 − cosϕ)。四个量的前后之比：A、D 约为 1，B 约 1.83，C 约 2.47。',
    p3: '取 g₀ = 1、最大高度 1，g 从 1 缓慢变到 8（ε = 0.02），积分竖直上抛、落地时速度反向，变完读出最大高度 v²/(2g)；和 E^{3/2}/g 不变推出的 8^{−1/3} 核对。',
    p4: '取 m = 1，λ 从 1 缓慢变到 8（ε = 0.02），H = p²/2 + λq⁴，从能量 1 出发积分，变完读出能量；和 E^{3/4}λ^{−1/4} 不变推出的 8^{1/3} 核对。',
  },
  compute() {
    // p1：k 从 1 变到 4，E₀ = 1
    const r1 = ramp(1, 4, 0.02);
    const y1 = integrateTo(canonical((q, p, t) => p[0] ** 2 / 2 + 0.5 * r1.lambda(t) * q[0] ** 2), [0, Math.sqrt(2)], 0, r1.end, 0.005);
    const p1 = agree(y1[1] ** 2 / 2 + 0.5 * 4 * y1[0] ** 2, Math.sqrt(4), 'p1 末能量', 1e-5);

    // p2：摆长从 1 变到 0.3
    const g = 1;
    const r2 = ramp(1, 0.3, 0.05);
    const pend: System = {
      masses: [1],
      positions: ([ph], t) => [[r2.lambda(t) * Math.sin(ph), -r2.lambda(t) * Math.cos(ph)]],
      potential: ([ph], t) => -g * r2.lambda(t) * Math.cos(ph),
    };
    const f2 = systemDerivative(pend);
    /** 从状态 y 起积分 span，返回这段时间里 |ϕ| 的最大值（振幅）。 */
    const amplitude = (y: Float64Array, t: number, span: number): number => {
      let max = 0;
      const steps = Math.round(span / 0.005);
      let cur = y;
      for (let i = 0; i < steps; i++) {
        cur = integrateTo(f2, Array.from(cur), t + i * 0.005, t + (i + 1) * 0.005, 0.005);
        max = Math.max(max, Math.abs(cur[0]));
      }
      return max;
    };
    const Eosc = (y: Float64Array, l: number): number => 0.5 * l * l * y[1] ** 2 + g * l * (1 - Math.cos(y[0]));
    const start = Float64Array.from([0, 0.02]);
    const before = { E: Eosc(start, 1), w: Math.sqrt(g / 1), phi: amplitude(start, 0, 7), l: 1 };
    const yEnd = integrateTo(f2, [0, 0.02], 0, r2.end, 0.01);
    const after = { E: Eosc(yEnd, 0.3), w: Math.sqrt(g / 0.3), phi: amplitude(yEnd, r2.end, 4), l: 0.3 };
    const quantities = [
      (s: typeof before): number => s.E / s.w,
      (s: typeof before): number => s.E,
      (s: typeof before): number => s.phi,
      (s: typeof before): number => s.phi ** 2 * s.l ** 1.5,
    ];
    const ratios = quantities.map((Q) => Q(after) / Q(before));
    // 变了的两个量，前后之比也和手推的 l^{−1/2}、l^{−3/4} 对得上
    if (Math.abs(ratios[1] / (1 / 0.3) ** 0.5 - 1) > 0.01 || Math.abs(ratios[2] / (1 / 0.3) ** 0.75 - 1) > 0.01) {
      throw new Error(`p2 E_osc、ϕ₀ 的变化和手推的不一致：${ratios.join(', ')}`);
    }
    const p2 = chosen(ratios.map((r) => Math.abs(r - 1) < 0.01));

    // p3：弹跳小球，g 从 1 变到 8，开始时最大高度 1
    const r3 = ramp(1, 8, 0.02);
    const fall: Derivative = (t, y, out) => {
      out[0] = y[1];
      out[1] = -r3.lambda(t);
    };
    let t3 = 0;
    let state = [0, Math.sqrt(2)];
    while (t3 < r3.end) {
      // 先离开地面一小段再找落地，免得把出发点当成一次落地
      const away = integrateTo(fall, state, t3, t3 + 1e-3, 1e-3);
      const hit = integrateUntil(fall, Array.from(away), t3 + 1e-3, 1e-3, r3.end + 100, (_t, y) => y[0])!;
      t3 = hit.t;
      state = [0, -hit.y[1]];
    }
    const p3 = agree(state[1] ** 2 / (2 * 8), 8 ** (-1 / 3), 'p3 最大高度之比', 1e-5);

    // p4：λ 从 1 变到 8，E₀ = 1
    const r4 = ramp(1, 8, 0.02);
    const y4 = integrateTo(canonical((q, p, t) => p[0] ** 2 / 2 + r4.lambda(t) * q[0] ** 4), [0, Math.sqrt(2)], 0, r4.end, 0.005);
    const p4 = agree(y4[1] ** 2 / 2 + 8 * y4[0] ** 4, 8 ** (1 / 3), 'p4 末能量', 1e-5);

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
