// 独立验算 physics.optics.thin-film-interference 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（半波损失按「两次反射里恰有一次才加 λ/2」、增透膜 t = λ/(4n)、劈尖条纹间距 λ/(2θ)、牛顿环 r² ∝ λR/n）；
// 二是不用半波损失的规则：垂直入射时每个界面的振幅反射系数用 (n₁ − n₂)/(n₁ + n₂)（符号自带相位），
// 膜里多次反射的光直接相加（膜的反射振幅 (r₁ + r₂e^{iδ})/(1 + r₁r₂e^{iδ})），p1 在厚度上做黄金分割求反射最小，
// p4 在半径上找第 m 个暗环；p3 数条纹：楔形空气层沿长度 L 一共有 L/间距 个间隔，每个间隔厚度变 λ/2。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.thin-film-interference.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, argmax, check, chosen } from './physics.optics._op.ts';

const rCoef = (n1: number, n2: number) => (n1 - n2) / (n1 + n2);

/** 折射率 n0 | 膜 nf（厚 t）| 基底 ns，垂直入射，真空波长 lambda：反射率（膜里多次反射全部相加）。 */
function filmR(n0: number, nf: number, ns: number, t: number, lambda: number): number {
  const r1 = rCoef(n0, nf);
  const r2 = rCoef(nf, ns);
  const d = (4 * Math.PI * nf * t) / lambda;
  const numRe = r1 + r2 * Math.cos(d);
  const numIm = r2 * Math.sin(d);
  const denRe = 1 + r1 * r2 * Math.cos(d);
  const denIm = r1 * r2 * Math.sin(d);
  return (numRe * numRe + numIm * numIm) / (denRe * denRe + denIm * denIm);
}

export const verification: Verification = {
  lesson: 'physics.optics.thin-film-interference',
  notes: {
    p1: '两次反射都有半波损失，2nt = λ/2，t = λ/(4n)；和不用半波损失规则的算法核对：空气 | MgF₂ 1.38 | 玻璃 1.52，振幅反射系数带符号，膜里多次反射相加，在 50–150 nm 里黄金分割求反射率最小的厚度（垂直入射时和基底折射率无关）。',
    p2: '逐条用例子（振幅反射系数带符号）：A 空气到水 r = (1 − 1.33)/(1 + 1.33) < 0，相位变 π（对）；B 肥皂膜 n = 1.33，上表面 r < 0、下表面 r > 0，只有一束变号（对）；C 玻璃 1.52 上镀四分之一波厚的膜，n = 1.38 时反射率 1.3%，n = 1.70 时 9.7%，比不镀膜的 4.3% 还大（错）；D 牛顿环中心 t = 0，两束反射光振幅 +0.206、−0.206（再乘透射）抵消，是暗斑（错）；E 夹角从 1×10⁻³ 减到 5×10⁻⁴ rad，算出的条纹间距从 0.29 mm 变成 0.59 mm（对）。',
    p3: '间距 0.250 mm，θ = λ/(2 × 间距)，D = Lθ；和数条纹核对：6.00 cm 里有 240 个间隔，每个间隔空气层厚度变 λ/2，丝径 = 240 × λ/2。',
    p4: '暗环 2nt = mλ，r ∝ 1/√n，1/√1.33；和直接相加核对：透镜和平板都是 1.52，中间空气或水，厚度 t = r²/(2R)（R = 1 m），两束反射光振幅带符号相加，在半径上找第 5 个暗环，两种情形的半径相除。',
  },
  compute() {
    // p1（nm）
    const formula1 = 550 / (4 * 1.38);
    const tMin = argmax((t) => -filmR(1, 1.38, 1.52, t * 1e-9, 550e-9), 50, 150);
    const p1 = agree(tMin, formula1, 'p1 膜厚', 1e-6);
    check(Math.abs(argmax((t) => -filmR(1, 1.38, 1.7, t * 1e-9, 550e-9), 50, 150) - formula1) < 1e-4, 'p1 换基底 1.7 最薄厚度不变');

    // p2
    const optA = rCoef(1, 1.33) < 0;
    const optB = rCoef(1, 1.33) < 0 && rCoef(1.33, 1) > 0;
    const Rq = (nf: number) => filmR(1, nf, 1.52, 550e-9 / (4 * nf), 550e-9);
    const bare = rCoef(1, 1.52) ** 2;
    check(Math.abs(Rq(1.38) - 0.0126) < 1e-3 && Math.abs(Rq(1.7) - 0.0965) < 1e-3 && Math.abs(bare - 0.0426) < 1e-3, 'C：1.3%、9.7%、4.3%');
    const optC = Rq(1.7) < Rq(1.38);
    const a1 = rCoef(1.52, 1);
    const a2 = rCoef(1, 1.52);
    check(Math.abs(a1 - 0.206) < 1e-3 && Math.abs(a1 + a2) < 1e-15, 'D：中心两束振幅相反');
    const optD = Math.abs(filmR(1.52, 1, 1.52, 0, 589e-9)) > 1e-12;
    const spacing = (theta: number) => 589e-9 / (2 * theta);
    check(Math.abs(spacing(1e-3) - 0.2945e-3) < 1e-6 && Math.abs(spacing(5e-4) - 0.589e-3) < 1e-6, 'E：0.29、0.59 mm');
    const optE = spacing(5e-4) > spacing(1e-3);
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3（μm）
    const lam = 589e-9;
    const sp = 2.5e-3 / 10;
    const formula3 = 0.06 * (lam / (2 * sp)) * 1e6;
    const counted = (0.06 / sp) * (lam / 2) * 1e6;
    const p3 = agree(counted, formula3, 'p3 丝径', 1e-12);

    // p4：在半径上找第 m 个暗环（反射率的极小）
    const R = 1;
    const darkRing = (nMid: number, m: number) => {
      // 第 m 个暗环附近：t ≈ mλ/(2n)；先粗扫找反射率极小所在的格子，再黄金分割
      const rOf = (r: number) => filmR(1.52, nMid, 1.52, (r * r) / (2 * R), lam);
      const guess = Math.sqrt((2 * R * m * lam) / (2 * nMid));
      return argmax((r) => -rOf(r), guess * 0.9, guess * 1.1);
    };
    const formula4 = 1 / Math.sqrt(1.33);
    const p4 = agree(darkRing(1.33, 5) / darkRing(1, 5), formula4, 'p4 半径之比', 1e-6);

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
