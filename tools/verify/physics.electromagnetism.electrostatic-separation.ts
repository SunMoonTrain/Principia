// 独立验算 physics.electromagnetism.electrostatic-separation 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里分离变量的解（勒让德展开）；二是不用分离变量：匀强电场换成远处一对 ±Q 的电场、用接地球的镜像电荷求感应电荷，
// 以及用球外狄利克雷问题的泊松积分直接积出电势。
// 单独运行：npx tsx tools/verify/physics.electromagnetism.electrostatic-separation.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { EPS0, K_EXACT, agree, check, chosen, dot, fieldAt, integrate, legendre, type Charge, type V3 } from './physics.electromagnetism._es.ts';

/** 远处一对点电荷 +Q（z = −L）、−Q（z = +L）在原点产生沿 +z 的电场 E₀，连同半径 R 的球的镜像电荷（总量为零，所以球不带电、电势为零）。 */
function farPairWithImages(E0: number, R: number, L: number): Charge[] {
  const Q = (E0 * L * L) / (2 * K_EXACT);
  return [
    { q: Q, r: [0, 0, -L] },
    { q: -Q, r: [0, 0, L] },
    { q: (-Q * R) / L, r: [0, 0, (-R * R) / L] },
    { q: (Q * R) / L, r: [0, 0, (R * R) / L] },
  ];
}

export const verification: Verification = {
  lesson: 'physics.electromagnetism.electrostatic-separation',
  notes: {
    p1: 'p = 4πε₀R³E₀；和镜像算法核对：匀强电场换成 z = ∓L 处的 ±Q（L = 10⁴R，原点电场为 E₀），每个配一个接地球的镜像电荷，两个镜像电荷的电偶极矩 Σqz。',
    p2: 'A：用递推算 P_l(1)，l = 0…30 都是 1（对）；B：B_l/r^{l+1} 在 r → 0 时发散，包含原点的区域里只能为零（对）；C：A₂r²P₂ 在 r = 10³ 处远大于 r = 1 处，不趋于零（反例）；D：常数在 [−1, 1] 上和 P₁…P₁₀ 的积分都为零，只剩 l = 0（对）；E：θ = 0.7 处 P₂(cosθ) ≠ cos²θ（反例）。',
    p3: '把 σ = 3ε₀E₀cosθ 在 θ < π/2 上积分得 3πε₀E₀R²；和镜像算法核对：σ = ε₀E·r̂，E 由远处 ±Q 和两个镜像电荷逐点相加，在半个球面上数值积分（L = 10⁴R）。',
    p4: 'V₀cos²θ = V₀(P₀ + 2P₂)/3，球外 φ = V₀[(R/r)/3 + (2/3)(R/r)³P₂]，r = 2R、θ = 0 处是 V₀/4；和球外狄利克雷问题的泊松积分 φ(x) = (|x|² − R²)/(4πR)∮φ(y)/|x − y|³ dS 数值积分核对（先拿常数边界值检验积分式给出 V₀R/r）。',
  },
  compute() {
    // p1
    const R1 = 0.05;
    const E01 = 1.0e5;
    const cs1 = farPairWithImages(E01, R1, 1e4 * R1);
    check(Math.abs(fieldAt(cs1.slice(0, 2), [0, 0, 0])[2] - E01) < 1e-12 * E01, 'p1：原点电场是 E₀');
    const pImages = cs1.slice(2).reduce((s, c) => s + c.q * c.r[2], 0);
    const p1 = agree(pImages, 4 * Math.PI * EPS0 * R1 ** 3 * E01, 'p1', 1e-10);

    // p2
    const A2 = Array.from({ length: 31 }, (_, l) => legendre(l, 1)).every((v) => Math.abs(v - 1) < 1e-12);
    const B2 = [1, 2, 3].every((l) => 1 / 1e-6 ** (l + 1) > 1e6); // r → 0 发散
    const C2 = Math.abs(1e3 ** 2 * legendre(2, 0.5)) <= Math.abs(1 ** 2 * legendre(2, 0.5)); // 远处应当趋于零
    const D2 = Array.from({ length: 10 }, (_, i) => integrate((x) => legendre(i + 1, x), -1, 1, 8, 16)).every((v) => Math.abs(v) < 1e-12);
    const E2 = Math.abs(legendre(2, Math.cos(0.7)) - Math.cos(0.7) ** 2) < 1e-12;
    const p2 = chosen([A2, B2, C2, D2, E2]);

    // p3
    const R3 = 0.1;
    const E03 = 2.0e4;
    const cs3 = farPairWithImages(E03, R3, 1e4 * R3);
    const halfCharge = integrate(
      (th) => {
        const n: V3 = [Math.sin(th), 0, Math.cos(th)];
        const sigma = EPS0 * dot(fieldAt(cs3, [R3 * n[0], 0, R3 * n[2]]), n);
        return sigma * 2 * Math.PI * R3 * R3 * Math.sin(th);
      },
      0,
      Math.PI / 2,
      64,
      16,
    );
    const p3 = agree(halfCharge, 3 * Math.PI * EPS0 * E03 * R3 * R3, 'p3', 1e-6);

    // p4（R 取 1）
    const V0 = 30;
    const poisson = (bc: (u: number) => number, r: number) =>
      ((r * r - 1) / (4 * Math.PI)) * 2 * Math.PI * integrate((u) => bc(u) / (r * r + 1 - 2 * r * u) ** 1.5, -1, 1, 64, 16);
    check(Math.abs(poisson(() => V0, 2) - V0 / 2) < 1e-10 * V0, 'p4：常数边界值给出 V₀R/r');
    const legendreSum = V0 * ((1 / 3) * (1 / 2) + (2 / 3) * (1 / 2) ** 3 * legendre(2, 1));
    const p4 = agree(poisson((u) => V0 * u * u, 2), legendreSum, 'p4', 1e-10);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) runVerification(verification);
