// 独立验算 physics.electromagnetism.lienard-wiechert 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里匀速运动的结论（垂直方向的电场是静止时的 γ 倍；推迟距离 c τ = √(v²τ² + d²)；标势 q/(4πε₀R(1 − β·R̂))）；
// 二是不用这些结论：对给定的轨道 w(t) 二分出推迟时间，用李纳-维谢尔场的一般式
// E = q/(4πε₀) · R/(R·u)³ · [(c² − v²)u + R × (u × a)]，u = cR̂ − v，B = R̂ × E / c 算场；
// p4 把一根很短的匀速运动的带电棒的推迟势 ∫ρ(r', t_r)/|r − r'| dV' 直接数值积分（被「看到」的那一段的端点用二分求）。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.lienard-wiechert.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { add, agree, bisect, check, chosen, cross, dot, integrate, norm, scale, sub, type V3 } from './physics.electromagnetism._es.ts';

const C_GIVEN = 3.0e8;

type Orbit = { w: (t: number) => V3; v: (t: number) => V3; a: (t: number) => V3 };

/** 推迟时间：c(t − t_r) = |r − w(t_r)|，速度小于 c 时只有一个根。 */
function retardedTime(o: Orbit, r: V3, t: number, span = 1e-3): number {
  return bisect((tr) => C_GIVEN * (t - tr) - norm(sub(r, o.w(tr))), t - span, t);
}

/** 李纳-维谢尔场（q/(4πε₀) 取 1）：返回电场、磁场和其中的辐射部分。 */
function lwField(o: Orbit, r: V3, t: number): { E: V3; B: V3; Erad: V3; tr: number } {
  const tr = retardedTime(o, r, t);
  const R = sub(r, o.w(tr));
  const nR = norm(R);
  const v = o.v(tr);
  const a = o.a(tr);
  const u = sub(scale(C_GIVEN / nR, R), v);
  const k = nR / dot(R, u) ** 3;
  const Evel = scale(k * (C_GIVEN * C_GIVEN - dot(v, v)), u);
  const Erad = scale(k, cross(R, cross(u, a)));
  const E = add(Evel, Erad);
  const B = scale(1 / (C_GIVEN * nR), cross(R, E));
  return { E, B, Erad, tr };
}

/** 沿 x 轴匀速运动、t = 0 时过原点。 */
const uniform = (beta: number): Orbit => ({
  w: (t) => [beta * C_GIVEN * t, 0, 0],
  v: () => [beta * C_GIVEN, 0, 0],
  a: () => [0, 0, 0],
});

/** 很短的带电棒（实验室里长 ell，线电荷密度 q/ell）沿 x 轴运动，看原点处的推迟标势（q/(4πε₀) 取 1）。
 *  dir = +1：朝原点运动；dir = −1：背着原点运动。t = 0 时看，棒中心的推迟位置在 x = −1。 */
function rodPotential(beta: number, dir: 1 | -1, ell: number): number {
  const center = (t: number) => -1 + dir * beta * C_GIVEN * (t + 1 / C_GIVEN);
  // x' < 0 处的推迟时间是 x'/c；那一刻棒占据 [center − ell/2, center + ell/2]
  const front = bisect((x) => x - (center(x / C_GIVEN) + ell / 2), -1 - 10 * ell, -1 + 10 * ell);
  const back = bisect((x) => x - (center(x / C_GIVEN) - ell / 2), -1 - 10 * ell, -1 + 10 * ell);
  return integrate((x) => (1 / ell) / Math.abs(x), back, front, 4, 16);
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.lienard-wiechert',
  notes: {
    p1: 'E/E静 = γ = 1/√(1 − β²)；和李纳-维谢尔场核对：t = 0 时场点在 (0, r, 0)，二分出推迟时间，用一般式算电场的大小，除以 1/r²。',
    p2: '逐条用例子：A 0.9c 匀速运动，在推迟时间可能的范围里扫一遍，c(t − t_r) − |r − w(t_r)| 只变号一次（对）；B 0.6c 匀速时电场沿「此刻位置 → 场点」，和「推迟位置 → 场点」夹角约 32°（错）；C 加速度 10¹⁰ m/s²、推迟时刻静止的电荷，辐射项在 R 和 2R 处之比是 2（对）；D 匀速时 R̂ × E / c 和 v × E / c² 相等（对）；E 0.6c 时同样距离上，沿运动方向的电场是静止时的 0.64 倍，垂直方向是 1.25 倍（错）。',
    p3: 't_r = −d/(c√(1 − β²))，x_r = v t_r；和二分核对：直接解 c(0 − t_r) = |(0, 6, 0) − (v t_r, 0, 0)|。',
    p4: 'φ/φ静 = 1/(1 ∓ β)；和数值核对：长 10⁻⁶R 的带电棒，二分出它在推迟时间里被「看到」的两端，把 λ/|x′| 在这一段上积分。',
  },
  compute() {
    // p1
    const b1 = 0.6;
    const r1 = 1.0;
    const f1 = lwField(uniform(b1), [0, r1, 0], 0);
    const p1 = agree(norm(f1.E) * r1 * r1, 1 / Math.sqrt(1 - b1 * b1), 'p1', 1e-9);

    // p2
    // A：0.9c，场点 (3, 4, 0)，t = 0；在 [t − 1 ms, t] 上细扫
    const o9 = uniform(0.9);
    const rA: V3 = [3, 4, 0];
    const g = (tr: number) => C_GIVEN * (0 - tr) - norm(sub(rA, o9.w(tr)));
    let changes = 0;
    let prev = g(-1e-3);
    for (let i = 1; i <= 200000; i++) {
      const cur = g(-1e-3 + (i / 200000) * 1e-3);
      if (prev * cur < 0) changes++;
      prev = cur;
    }
    const A = changes === 1;
    // B：0.6c，场点 (1, 2, 0)，t = 0
    const o6 = uniform(0.6);
    const rB: V3 = [1, 2, 0];
    const fB = lwField(o6, rB, 0);
    const angle = (x: V3, y: V3) => Math.atan2(norm(cross(x, y)), dot(x, y));
    const toPresent = angle(fB.E, sub(rB, o6.w(0)));
    const toRetarded = angle(fB.E, sub(rB, o6.w(fB.tr)));
    const B = toRetarded < 1e-9;
    check(toPresent < 1e-9 && toRetarded > 0.5, 'p2 B：电场沿此刻位置');
    // C：此刻静止、加速度 a 沿 x 的电荷，场点在 y 轴上，选 t 使推迟时间为 0
    const acc: Orbit = { w: (t) => [0.5 * 1e10 * t * t, 0, 0], v: (t) => [1e10 * t, 0, 0], a: () => [1e10, 0, 0] };
    const radAt = (R: number) => norm(lwField(acc, [0, R, 0], R / C_GIVEN).Erad);
    const C = Math.abs(radAt(1e3) / radAt(2e3) - 2) < 1e-6;
    // D：匀速运动时 B = R̂ × E / c 和 v × E / c² 比较
    const vB = cross(o6.v(0), fB.E);
    const D = norm(sub(fB.B, scale(1 / (C_GIVEN * C_GIVEN), vB))) < 1e-9 * norm(fB.B);
    // E：0.6c，此刻位置前方 r 处和侧面 r 处
    const along = norm(lwField(o6, [1, 0, 0], 0).E);
    const side = norm(lwField(o6, [0, 1, 0], 0).E);
    const E = along > side;
    check(Math.abs(along - 0.64) < 1e-9 && Math.abs(side - 1.25) < 1e-9, 'p2 E 的数');
    check(A && !B && C && D && !E, 'p2');
    const p2 = chosen([A, B, C, D, E]);

    // p3
    const b3 = 0.6;
    const d3 = 6.0;
    const tr3 = retardedTime(uniform(b3), [0, d3, 0], 0);
    const tau = d3 / (C_GIVEN * Math.sqrt(1 - b3 * b3));
    const p3t = agree(tr3 * 1e9, -tau * 1e9, 'p3 推迟时间', 1e-9);
    const p3x = agree(b3 * C_GIVEN * tr3, -b3 * C_GIVEN * tau, 'p3 推迟位置', 1e-9);

    // p4
    const b4 = 0.5;
    const ell = 1e-6;
    const toward = agree(rodPotential(b4, 1, ell), 1 / (1 - b4), 'p4 正对着', 1e-5);
    const away = agree(rodPotential(b4, -1, ell), 1 / (1 + b4), 'p4 正背着', 1e-5);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [p3t, p3x] },
      p4: { type: 'tuple', value: [toward, away] },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
