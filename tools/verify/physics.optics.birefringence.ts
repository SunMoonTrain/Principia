// 独立验算 physics.optics.birefringence 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（波片相位差 δ = 2π|nₑ − nₒ|d/λ、正交偏振片间的光强 sin²(δ/2)、波片定理）；
// 二是不用这些式子：两个分量各自穿过晶片，相位各落后 2πn d/λ，在时间域里分别推迟，再用偏振片取投影、时间平均（_op.ts 的「偏振」一段）；
// p1 在厚度上找出射光第一次变成圆偏振（端点轨迹最小、最大半径之比为 1）的地方。
// 选择题用具体例子逐条核对；o 光、e 光的折射率用单轴晶体的折射率椭球 1/n(ψ)² = cos²ψ/nₒ² + sin²ψ/nₑ²（ψ 是传播方向和光轴的夹角）。
// 单独运行：npx tsx tools/verify/physics.optics.birefringence.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { add2, agree, analyze, argmax, check, chosen, deg, dirOf, dot2, fieldOf, meanSq, polarizer, radii, scale2, spin, wavePlate, type Field } from './physics.optics._op.ts';

/** 光轴平行于表面的晶片：沿光轴（e）和垂直于光轴（o）的分量各自穿过厚度 d，相位各落后 2πn d/λ。axis 是光轴和 x 轴的夹角。 */
function crystal(axis: number, no: number, ne: number, d: number, lambda: number) {
  const phE = (2 * Math.PI * ne * d) / lambda;
  const phO = (2 * Math.PI * no * d) / lambda;
  const e = dirOf(axis);
  const o = dirOf(axis + Math.PI / 2);
  return (E: Field): Field => (t) => add2(scale2(dot2(E(t - phE), e), e), scale2(dot2(E(t - phO), o), o));
}
/** e 光沿和光轴成 psi 的方向传播时的折射率（折射率椭球）。 */
const nE = (psi: number, no: number, ne: number) => 1 / Math.sqrt(Math.cos(psi) ** 2 / no ** 2 + Math.sin(psi) ** 2 / ne ** 2);

export const verification: Verification = {
  lesson: 'physics.optics.birefringence',
  notes: {
    p1: 'd = λ/(4|nₑ − nₒ|)；和时间域核对：和光轴成 45° 的线偏振光穿过方解石片，两个分量各推迟 2πnd/λ，在 0 到 1.5 μm 上找出射光的最小、最大半径之比第一次达到 1 的厚度。',
    p2: '逐条用例子：A 方解石里沿光轴传播（ψ = 0）时 e 光折射率等于 nₒ = 1.658，两束速度相同（对）；B 传播方向 z、光轴在 xz 面内成 45°：o 光电场沿 y，e 光电场在 xz 面内，两者垂直（错）；C 右旋圆偏振（δ = −90°）过二分之一波片，转向量由负变正，成左旋（对）；D 光轴垂直于入射面时，入射面内各方向 ψ = 90°，e 光折射率恒为 nₑ，满足折射定律（错）；E δ 和 λ 成反比，600 nm 的 π/2 到 300 nm 是 π，线偏振光和快轴成 30° 时射出光和快轴成 −30°（对）。',
    p3: '出射光是长、短半轴沿快轴、慢轴的椭圆，最大、最小比 cot²30° = 3；和时间域核对：转动偏振片粗扫再黄金分割。',
    p4: 'I/I₁ = sin²(π|nₑ − nₒ|d/λ)；和时间域核对：两个分量各推迟 2πnd/λ，再投影到第二片的透振方向上。',
  },
  compute() {
    // p1（μm）
    const no1 = 1.658;
    const ne1 = 1.486;
    const lam1 = 0.633; // μm
    const formula1 = lam1 / (4 * Math.abs(ne1 - no1));
    const ratio = (d: number) => {
      const [rMax, rMin] = radii(crystal(0, no1, ne1, d, lam1)(fieldOf(1, 1, 0)), 720);
      return rMin / rMax;
    };
    // 粗扫找到比值第一次接近 1 的格点，再黄金分割
    let dGuess = 0;
    for (let d = 0.01; d < 1.5; d += 0.01) {
      if (ratio(d) > 0.99) {
        dGuess = d;
        break;
      }
    }
    check(dGuess > 0, 'p1 找到圆偏振的厚度');
    const dBest = argmax(ratio, dGuess - 0.05, dGuess + 0.05);
    check(ratio(dBest) > 1 - 1e-6, 'p1 那里是圆偏振');
    const p1 = agree(dBest, formula1, 'p1 零级四分之一波片的厚度', 1e-5);

    // p2
    const optA = Math.abs(nE(0, 1.658, 1.486) - 1.658) < 1e-12;
    // B：传播方向 k = z，光轴 c 在 xz 面内和 z 成 45°；o 光电场 ∝ k × c，e 光电场在 k、c 所在平面内且垂直于 k
    const k: [number, number, number] = [0, 0, 1];
    const c: [number, number, number] = [Math.sin(45 * deg), 0, Math.cos(45 * deg)];
    const eO = [k[1] * c[2] - k[2] * c[1], k[2] * c[0] - k[0] * c[2], k[0] * c[1] - k[1] * c[0]];
    const eEv = [c[0], c[1], 0]; // c 去掉沿 k 的分量
    const dotOE = eO[0] * eEv[0] + eO[1] * eEv[1] + eO[2] * eEv[2];
    const optB = Math.abs(dotOE) > 1e-9 && Math.abs(Math.abs(dotOE) - Math.hypot(...eO) * Math.hypot(...eEv)) < 1e-9;
    check(Math.abs(dotOE) < 1e-12, 'B：o、e 电场垂直');
    const right = fieldOf(1, 1, -90 * deg);
    check(spin(right) < -0.99, 'C：入射是右旋');
    const optC = spin(wavePlate(0, Math.PI)(right)) > 0.99;
    // D：光轴沿 y（垂直于入射面 xz），晶体里沿 (sin a, 0, cos a) 传播的 e 光，和光轴的夹角 ψ = arccos(k·y) = 90°
    const nInPlane = [0, 20, 45, 70, 89].map((a) => nE(Math.acos(0 * Math.sin(a * deg) + 0 * Math.cos(a * deg)), 1.658, 1.486));
    const optD = !nInPlane.every((n) => Math.abs(n - 1.486) < 1e-12); // 都等于 nₑ：满足折射定律，所以「总是不满足」错
    const dE = 0.6 / (4 * 0.009); // 石英零级四分之一波片（μm），对 600 nm
    const deltaAt300 = (2 * Math.PI * 0.009 * dE) / 0.3;
    const outE = wavePlate(0, deltaAt300)(fieldOf(Math.cos(30 * deg), Math.sin(30 * deg), 0));
    const [, rMinE] = radii(outE);
    const angE = analyze([outE]).thMax / deg;
    const optE = Math.abs(deltaAt300 - Math.PI) < 1e-12 && rMinE < 1e-6 && Math.abs(angE - 150) < 1e-6;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const out3 = wavePlate(0, Math.PI / 2)(fieldOf(Math.cos(30 * deg), Math.sin(30 * deg), 0));
    const r3 = analyze([out3]);
    const formula3 = 1 / Math.tan(30 * deg) ** 2;
    const p3 = agree(r3.max / r3.min, formula3, 'p3 最大、最小之比', 1e-9);

    // p4
    const no4 = 1.544;
    const ne4 = 1.553;
    const d4 = 42.0;
    const lam4 = 0.6;
    const in4 = fieldOf(1, 0, 0);
    const out4 = polarizer(90 * deg)(crystal(45 * deg, no4, ne4, d4, lam4)(in4));
    const formula4 = Math.sin((Math.PI * Math.abs(ne4 - no4) * d4) / lam4) ** 2;
    const p4 = agree(meanSq(out4) / meanSq(in4), formula4, 'p4 透过的比例', 1e-9);

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
