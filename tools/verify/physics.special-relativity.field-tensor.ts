// 独立验算 physics.special-relativity.field-tensor 的 p1–p4（简单题、中等题）。
// 两套算法（见 physics.special-relativity._em.ts）：一是 F′ = ΛFΛᵀ，F 由洛伦兹力反解；
// 二是 S′ 里的试探电荷（雷达法变换四维速度和四维力），以及李纳-维谢尔推迟场。
// 单独运行：npx tsx tools/verify/physics.special-relativity.field-tensor.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, gamma } from './physics.special-relativity._relativity.ts';
import {
  add3,
  apply,
  boostDir,
  cross,
  dot3,
  fieldsByTensor,
  fieldsByTestCharges,
  lwField,
  mul,
  norm3,
  scale3,
  tensorFromForce,
  transpose,
  type V3,
} from './physics.special-relativity._em.ts';

const C = 299792458;

/** 两种算法求 S′（沿 x 轴以 β 运动）里的场，互相核对后返回。 */
function fieldsPrimed(E: V3, B: V3, beta: number, c: number, what: string): { E: V3; B: V3 } {
  const a = fieldsByTensor(E, B, beta, c);
  const b = fieldsByTestCharges(E, B, beta, c);
  const scaleE = Math.max(norm3(a.E), c * norm3(a.B), 1e-300);
  for (let i = 0; i < 3; i++) {
    check(Math.abs(a.E[i] - b.E[i]) <= 1e-9 * scaleE, `${what}：E′ 两种算法一致`);
    check(Math.abs(a.B[i] - b.B[i]) * c <= 1e-9 * scaleE, `${what}：B′ 两种算法一致`);
  }
  return a;
}

export const verification: Verification = {
  lesson: 'physics.special-relativity.field-tensor',
  notes: {
    p1: '国际单位制。F′ = ΛFΛᵀ（F 由洛伦兹力反解）读出 E′_y；和 S′ 里静止的试探电荷受的力（四维速度、四维力用雷达法变换）核对。',
    p2: 'A：3 组随机的 E、B，沿 3 个方向推进，ΛFΛᵀ 的对角元都是 0；B：只有 E_x，沿 x 推进，两种算法都得 E′ = E、B′ = 0；C：只有 E_y，沿 x 推进出现 B′_z ≠ 0（反例）；D：E ⊥ B、E = cB 的 3 组场沿 3 个方向推进，E′ = cB′ 都成立；E：U = (c, 0, 0, 0) 时 qF^{μν}U_ν，只有磁场时为零，只有电场时不为零（反例）。',
    p3: '对 β 二分使 E′_y = 0（两种算法核对场），读出 B′_z；和不变量 √(B² − E²/c²) 核对。',
    p4: '在 S 里用李纳-维谢尔推迟场算一个电子在另一个电子处的 E、B，再算洛伦兹力；和静止系里的库仑力经四维力变换（横向力除以 γ）核对。',
  },
  compute() {
    // p1
    const f1 = fieldsPrimed([0, 0, 0], [0, 0, 0.5], 0.6, C, 'p1');
    const p1 = agree(f1.E[1], -gamma(0.6) * 0.6 * C * 0.5, 'p1', 1e-12);

    // p2
    const rnd = (() => {
      let s = 12345;
      return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648) * 2 - 1;
    })();
    const dirs: V3[] = [
      [1, 0, 0],
      [0.3, -0.8, 0.5],
      [-0.2, 0.1, 0.9],
    ];
    const A2 = [0, 1, 2].every(() => {
      const F = tensorFromForce([rnd(), rnd(), rnd()], [rnd(), rnd(), rnd()], 1);
      return dirs.every((n) => {
        const L = boostDir(0.7, n);
        const Fp = mul(mul(L, F), transpose(L));
        return [0, 1, 2, 3].every((i) => Math.abs(Fp[i][i]) < 1e-12);
      });
    });
    const fb = fieldsPrimed([2, 0, 0], [0, 0, 0], 0.8, 1, 'p2 B');
    const B2 = Math.abs(fb.E[0] - 2) < 1e-12 && Math.abs(fb.E[1]) < 1e-12 && Math.abs(fb.E[2]) < 1e-12 && norm3(fb.B) < 1e-12;
    const fc = fieldsPrimed([0, 2, 0], [0, 0, 0], 0.8, 1, 'p2 C');
    const C2 = norm3(fc.B) < 1e-12;
    const D2 = [0, 1, 2].every(() => {
      const e: V3 = [rnd(), rnd(), rnd()];
      const perp = cross(e, [rnd(), rnd(), rnd()]);
      const b = scale3(norm3(e) / norm3(perp), perp);
      check(Math.abs(dot3(e, b)) < 1e-12 && Math.abs(norm3(e) - norm3(b)) < 1e-12, 'p2 D 的例子');
      return dirs.every((n) => {
        const f = fieldsByTensor(e, b, 0.6, 1, n);
        return Math.abs(norm3(f.E) - norm3(f.B)) < 1e-12;
      });
    });
    const atRest = (E: V3, B: V3) => apply(tensorFromForce(E, B, 1), [1, 0, 0, 0]);
    const onlyB = atRest([0, 0, 0], [0.3, -1, 2]);
    const onlyE = atRest([1, 0.5, -2], [0, 0, 0]);
    // 「只和磁场有关」：只有电场时四维力为零、只有磁场时不为零
    const E2 = onlyE.every((k) => Math.abs(k) < 1e-12) && onlyB.some((k) => Math.abs(k) > 1e-12);
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const E3: V3 = [0, 1.0e6, 0];
    const B3: V3 = [0, 0, 0.01];
    const beta3 = bisect((b) => fieldsByTestCharges(E3, B3, b, C).E[1], 0, 0.9);
    const f3 = fieldsPrimed(E3, B3, beta3, C, 'p3');
    check(Math.abs(f3.E[1]) < 1e-6 * 1e6, 'p3：E′ 为零');
    const p3 = agree(norm3(f3.B), Math.sqrt(0.01 ** 2 - (1.0e6 / C) ** 2), 'p3', 1e-9);

    // p4
    const e = 1.602e-19;
    const k = 8.988e9;
    const d = 1.0e-6;
    const v: V3 = [0.8 * C, 0, 0];
    const lw = lwField(k * -e, v, [0, 0, 0], C, 0, [0, d, 0]);
    const force = scale3(-e, add3(lw.E, cross(v, lw.B)));
    // 静止系里的库仑力只有 y 分量，四维力 (0, 0, F₀, 0)；变到 S（S 相对静止系以 −0.8c 运动），三维力 = K/γ
    const F0 = (k * e * e) / (d * d);
    const K = apply(boostDir(-0.8), [0, 0, F0, 0]);
    const g = gamma(0.8);
    check(Math.abs(K[0]) < 1e-30 && Math.abs(K[1]) < 1e-30, 'p4：横向的四维力推进后仍只有 y 分量');
    const p4 = agree(norm3(force), K[2] / g, 'p4', 1e-9);

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
