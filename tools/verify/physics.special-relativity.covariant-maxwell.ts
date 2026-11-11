// 独立验算 physics.special-relativity.covariant-maxwell 的 p1–p4（简单题、中等题）。
// 两套算法：一是四维电流 J′ = ΛJ、场张量 F′ = ΛFΛᵀ（F 由洛伦兹力反解，见 physics.special-relativity._em.ts）；
// 二是数电荷：用雷达法量运动的电荷在另一个惯性系里同一时刻的间距（得电荷密度），雷达法量速度（得电流），
// 导线按正离子和电子分别数；场用 S′ 里的试探电荷读，或由数出的电流按安培环路定律求。
// 单独运行：npx tsx tools/verify/physics.special-relativity.covariant-maxwell.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, bisect, check, chosen, clockRate, gamma, radar, radarVelocity, restPoint } from './physics.special-relativity._relativity.ts';
import { apply, boostDir, fieldsByTensor, fieldsByTestCharges, lwField, norm3, tensorFromForce, type V3 } from './physics.special-relativity._em.ts';

const C = 299792458;

/** S 里静止、间距为 1 的一列电荷，在沿 x 轴以 β 运动的 S′ 里（c = 1）：同一时刻 t′ = 0 的间距和速度，返回 (ρ′/ρ₀, J′_x/(cρ₀))。 */
function countRestCharges(beta: number): [number, number] {
  const tOf = bisect((t) => radar(beta, 1, { t, x: 1 }).t, -5, 5);
  const xp = radar(beta, 1, { t: tOf, x: 1 }).x;
  const ratio = 1 / xp;
  const [up] = radarVelocity(beta, 1, 0);
  return [ratio, ratio * up];
}

/**
 * 实验室里不带电、电流为 I（沿 +x）的导线：正离子静止，电子以速度 −drift 运动（国际单位制）。
 * 在沿 x 轴以 v 运动的惯性系里分别数正离子和电子：线密度按各自的速度用光钟换算（静止时的线密度 × 1/光钟读数比），速度用雷达法。
 */
function wireLineCharge(I: number, v: number, drift: number): number {
  const lamIon = I / drift;
  const lamEl = -lamIon;
  const ionPrime = lamIon / clockRate(v, C);
  const [uEl] = radarVelocity(v, C, -drift);
  const elRest = lamEl * clockRate(drift, C);
  const elPrime = elRest / clockRate(Math.abs(uEl), C);
  return ionPrime + elPrime;
}

/** 二阶中心差分求 □f = ∂²f/∂t² − ∇²f（c = 1，f 是 t、x、y 的函数）。 */
function box(f: (t: number, x: number, y: number) => number, t: number, x: number, y: number, h = 1e-3): number {
  const d2 = (g: (s: number) => number): number => (g(h) - 2 * g(0) + g(-h)) / (h * h);
  return d2((s) => f(t + s, x, y)) - d2((s) => f(t, x + s, y)) - d2((s) => f(t, x, y + s));
}

export const verification: Verification = {
  lesson: 'physics.special-relativity.covariant-maxwell',
  notes: {
    p1: '取 c = 1。数电荷：S 里静止、间距为 1 的电荷，用雷达法找出它们在 S′ 里同一时刻的位置，间距的倒数是 ρ′/ρ₀；雷达法量出的速度乘 ρ′ 得 J′_x。和 J′ = Λ(0.6)(cρ₀, 0, 0, 0) 核对。',
    p2: 'A：里面没有电流，只有一种静止的电荷：雷达法量它们在运动的惯性系里的间距，0.8c 时密度是静止时的 5/3（另核：有电流的中性导线换惯性系后带电，不是 γ 乘 0）；B：∂_μF^{μν} 的 ν 有 4 个取值，在一组任意的光滑场上用差分核对 ν = 0 分量就是 ∇·E/c；C：p1 的数法，S 里 J = 0、ρ₀ ≠ 0，S′ 里 J′_x ≠ 0（反例）；D：题面说 S 里的场满足麦克斯韦方程组：以 (0.3c, 0.2c, 0) 运动的点电荷的李纳-维谢尔场，沿 x 轴以 0.6c 推进后在两处差分算 ∇′·B′，都为零；解答说只知道 ∇·B = 0 不够：在一组任意的光滑场上核对 ∇′·B′ = γ[∇·B + β(∂_t B_x + (∇×E)_x)]，E = 0、B = (t, 0, 0) 推进后 ∇′·B′ = γβ；E：一个高斯型函数在 S 和 S′ 里差分算 □f，两者相等，不差 γ² 倍（反例）。',
    p3: '导线按正离子和电子分别数（电子漂移速度取 0.01c 和 0.3c 两种，结果一样），各自的线密度按速度用光钟换算；和 (cλ′, I′) = Λ(cλ, I) 核对。',
    p4: 'S′ 里电荷密度和电流用雷达法数出来，再按安培环路定律 B′ = μ₀I′/(2πr)；和 S 里的电场（高斯定律）经场的变换（两种算法）核对。',
  },
  compute() {
    // p1
    const [rho1, j1] = countRestCharges(0.6);
    const J1 = apply(boostDir(0.6), [1, 0, 0, 0]);
    const p1: [number, number] = [agree(rho1, J1[0], 'p1 ρ′', 1e-9), agree(j1, J1[1], 'p1 J′_x', 1e-9)];

    // p2
    const sp = restPoint(0.8, 1, 1).x - restPoint(0.8, 1, 0).x;
    const A2 = Math.abs(1 / sp - 5 / 3) < 1e-9;
    // 题面的前提「里面没有电流」不能省：通电的中性导线（ρ₀ = 0）换惯性系后带电
    check(Math.abs(wireLineCharge(1, 0.8 * C, 0.01 * C)) > 1e-12, 'p2 A：有电流时换惯性系后的电荷密度不是 γρ₀');
    const Efield = (x: number, y: number, z: number, t: number): V3 => [Math.sin(x + 2 * y) * Math.cos(t), x * z + t, Math.exp(-y * y) * z];
    const Bfield = (x: number, y: number, z: number, t: number): V3 => [y * t, Math.cos(z - x), x * y];
    const h = 1e-4;
    const F0 = (x: number, y: number, z: number): number[][] => tensorFromForce(Efield(x, y, z, 0.3), Bfield(x, y, z, 0.3), 1);
    const [x0, y0, z0] = [0.2, -0.4, 0.7];
    const dFi0 = [0, 1, 2].reduce((s, i) => {
      const step = [0, 0, 0];
      step[i] = h;
      const plus = F0(x0 + step[0], y0 + step[1], z0 + step[2]);
      const minus = F0(x0 - step[0], y0 - step[1], z0 - step[2]);
      return s + (plus[i + 1][0] - minus[i + 1][0]) / (2 * h);
    }, 0);
    const divE = (() => {
      const E = (dx: number, dy: number, dz: number) => Efield(x0 + dx, y0 + dy, z0 + dz, 0.3);
      return (E(h, 0, 0)[0] - E(-h, 0, 0)[0] + E(0, h, 0)[1] - E(0, -h, 0)[1] + E(0, 0, h)[2] - E(0, 0, -h)[2]) / (2 * h);
    })();
    const B2 = [0, 1, 2, 3].length === 4 && Math.abs(dFi0 - divE) < 1e-6;
    const C2 = Math.abs(countRestCharges(0.6)[1]) < 1e-12;
    // D：S′ 里的事件 (t′, x′, y′, z′) 对应 S 里的 t = γ(t′ + βx′)，x = γ(x′ + βt′)，y、z 不变；B′ 由 S 里同一事件的场变换得到，差分求 ∇′·B′
    const bD = 0.6;
    const gD = gamma(bD);
    type Field = (t: number, x: number, y: number, z: number) => { E: V3; B: V3 };
    const divBPrime = (field: Field, tp: number, xp: number, yp: number, zp: number): number => {
      const Bp = (dx: number, dy: number, dz: number): V3 => {
        const [x1, y1, z1] = [xp + dx, yp + dy, zp + dz];
        const f = field(gD * (tp + bD * x1), gD * (x1 + bD * tp), y1, z1);
        return fieldsByTensor(f.E, f.B, bD, 1).B;
      };
      return (Bp(h, 0, 0)[0] - Bp(-h, 0, 0)[0] + Bp(0, h, 0)[1] - Bp(0, -h, 0)[1] + Bp(0, 0, h)[2] - Bp(0, 0, -h)[2]) / (2 * h);
    };
    // 满足麦克斯韦方程组的场：以 (0.3, 0.2, 0) 运动的点电荷的李纳-维谢尔场，在离电荷较远处
    const moving: Field = (t, x, y, z) => lwField(1, [0.3, 0.2, 0], [0, 0, 0], 1, t, [x, y, z]);
    const D2 = [[0.4, 1.0, 0.7, -0.5], [-0.3, -0.8, 1.2, 0.6]].every(([tp, xp, yp, zp]) => Math.abs(divBPrime(moving, tp, xp, yp, zp)) < 1e-6);
    // 解答说只知道 ∇·B = 0 不够、∇′·B′ 混进了法拉第定律的 x 分量：在任意的光滑场上核对 ∇′·B′ = γ[∇·B + β(∂_t B_x + (∇×E)_x)]
    const anyField: Field = (t, x, y, z) => ({ E: Efield(x, y, z, t), B: Bfield(x, y, z, t) });
    const [tq, xq, yq, zq] = [0.1, 0.3, -0.2, 0.5];
    const [tS, xS] = [gD * (tq + bD * xq), gD * (xq + bD * tq)];
    const d1 = (g: (s: number) => number): number => (g(h) - g(-h)) / (2 * h);
    const divB = d1((s) => Bfield(xS + s, yq, zq, tS)[0]) + d1((s) => Bfield(xS, yq + s, zq, tS)[1]) + d1((s) => Bfield(xS, yq, zq + s, tS)[2]);
    const faradayX = d1((s) => Bfield(xS, yq, zq, tS + s)[0]) + d1((s) => Efield(xS, yq + s, zq, tS)[2]) - d1((s) => Efield(xS, yq, zq + s, tS)[1]);
    check(Math.abs(divBPrime(anyField, tq, xq, yq, zq) - gD * (divB + bD * faradayX)) < 1e-6, 'p2 D 的解答：∇′·B′ = γ[∇·B + β(∂_t B_x + (∇×E)_x)]');
    // 只知道 ∇·B = 0 的反例：E = 0、B = (t, 0, 0)，不满足法拉第定律，推进后 ∇′·B′ = γβ
    const onlyDivB: Field = (t) => ({ E: [0, 0, 0], B: [t, 0, 0] });
    check(Math.abs(divBPrime(onlyDivB, 0.2, 0.1, 0, 0) - gD * bD) < 1e-6, 'p2 D 的反例：∇′·B′ = γβ');
    const f = (t: number, x: number, y: number): number => Math.exp(-((x - 0.3) ** 2) - 2 * y * y - (t - 0.1) ** 2 + 0.5 * x * t);
    const bE = 0.6;
    const gE = gamma(bE);
    const fPrime = (tp: number, xp: number, yp: number): number => f(gE * (tp + bE * xp), gE * (xp + bE * tp), yp);
    const [tE, xE, yE] = [0.2, -0.1, 0.3];
    const boxS = box(f, tE, xE, yE);
    const boxSp = box(fPrime, gE * (tE - bE * xE), gE * (xE - bE * tE), yE);
    check(Math.abs(boxSp - boxS) < 1e-5 * Math.abs(boxS), 'p2 E：□f 在两个惯性系里相等');
    const E2 = Math.abs(boxSp / boxS - gE * gE) < 1e-3;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const I3 = 2.0;
    const v3 = 0.8 * C;
    const lam = [0.01, 0.3].map((d) => wireLineCharge(I3, v3, d * C));
    agree(lam[0], lam[1], 'p3：和电子的漂移速度无关', 1e-9);
    const J3 = apply(boostDir(0.8), [0, I3, 0, 0]);
    const p3 = agree(lam[0], J3[0] / C, 'p3', 1e-9);

    // p4
    const mu0 = 4 * Math.PI * 1e-7;
    const eps0 = 1 / (mu0 * C * C);
    const R = 0.01;
    const rho0 = 1.0e-6;
    const r = 0.05;
    const [rhoRatio, jRatio] = countRestCharges(0.6);
    const Iprime = Math.abs(jRatio * C * rho0) * Math.PI * R * R;
    const byAmpere = (mu0 * Iprime) / (2 * Math.PI * r);
    check(Math.abs(rhoRatio - 1.25) < 1e-9, 'p4：S′ 里电荷密度是 1.25ρ₀');
    const lambda = rho0 * Math.PI * R * R;
    const E: V3 = [0, lambda / (2 * Math.PI * eps0 * r), 0];
    const a = norm3(fieldsByTensor(E, [0, 0, 0], 0.6, C).B);
    const b = norm3(fieldsByTestCharges(E, [0, 0, 0], 0.6, C).B);
    agree(a, b, 'p4：场的变换两种算法', 1e-9);
    const p4 = agree(byAmpere, a, 'p4', 1e-9);

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
