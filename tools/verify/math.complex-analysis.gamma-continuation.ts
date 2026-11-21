// 独立验算 math.complex-analysis.gamma-continuation 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.gamma-continuation.ts
//
// Γ 用三条互不相干的路算，先在一组检验点上互相核对，再拿来答题：
//   (1) Re z > 0 时直接积 ∫_0^∞ t^{z−1}e^{−t} dt（换元 t = e^u，在整条实轴上用梯形公式，被积函数在带形里全纯、两头衰减很快，梯形公式按指数收敛）；
//   (2) 汉克尔围道给出的整函数 1/Γ（对所有 z 都成立，不用递推公式）：
//       1/Γ(z) = (sin πz/π)∫_1^∞ e^{−s}s^{−z} ds + (1/2π)∫_{−π}^{π} exp(e^{iθ} + i(1 − z)θ) dθ
//       （围道从 −∞ 沿负实轴下沿进来，绕单位圆逆时针一圈，沿上沿回到 −∞；两条射线上 t^{−z} 差一个 e^{±iπz}）；
//   (3) 兰乔斯近似（g = 7，9 个系数）加余元公式 Γ(z)Γ(1 − z) = π/sin πz。
// 三条路都不用本节的延拓式 Γ(z) = Γ(z + n)/(z(z + 1)⋯(z + n − 1))。
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { circleIntegral, Complex, cexp, cpow, csin, cx, integrate } from './math.complex-analysis._complex.ts';

const PI = Math.PI;

/** (1) Re z > 0：Γ(z) = ∫_{−∞}^{∞} exp(zu − e^u) du，梯形公式取两种步长核对。 */
function gammaIntegral(z: Complex): Complex {
  if (!(z.re > 0)) throw new Error('积分只在 Re z > 0 时收敛');
  const lo = -Math.max(40, 45 / z.re); // e^{Re z·u} 在 u = lo 处小于 e^{−45}
  const hi = Math.log(80 + 4 * Math.abs(z.re)); // e^{−e^u} 在 hi 处小到可以不计
  const trap = (h: number) => {
    let re = 0;
    let im = 0;
    for (let u = lo; u <= hi; u += h) {
      const v = cexp(z.scale(u).sub(cx(Math.exp(u))));
      re += v.re;
      im += v.im;
    }
    return new Complex(re * h, im * h);
  };
  const a = trap(1 / 32);
  const b = trap(1 / 64);
  if (!a.isClose(b, 1e-12)) throw new Error(`Γ(${z.toString(6)}) 的积分两种步长对不上`);
  return b;
}

/** (2) 汉克尔围道（半径 1）给出的 1/Γ(z)，对所有复数 z 都成立。 */
function recipGammaHankel(z: Complex): Complex {
  // J = ∫_1^∞ e^{−s}s^{−z} ds，换元 s = e^u：∫_0^∞ exp((1 − z)u − e^u) du，u 取到 6 以后可以不计（e^{−e^6} ≈ e^{−403}）
  const oneMinusZ = cx(1).sub(z);
  const jIntegrand = (u: number) => cexp(oneMinusZ.scale(u).sub(cx(Math.exp(u))));
  const J = new Complex(
    integrate((u) => jIntegrand(u).re, 0, 7),
    integrate((u) => jIntegrand(u).im, 0, 7),
  );
  // C = ∫_{−π}^{π} exp(e^{iθ} + i(1 − z)θ) dθ
  const cIntegrand = (t: number) => cexp(Complex.fromPolar(1, t).add(oneMinusZ.mul(cx(0, t))));
  const C = new Complex(
    integrate((t) => cIntegrand(t).re, -PI, PI),
    integrate((t) => cIntegrand(t).im, -PI, PI),
  );
  return csin(z.scale(PI)).scale(1 / PI).mul(J).add(C.scale(1 / (2 * PI)));
}

const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
];

/** (3) 兰乔斯近似；Re z < 1/2 时用余元公式。 */
function gammaLanczos(z: Complex): Complex {
  if (z.re < 0.5) return cx(PI).div(csin(z.scale(PI)).mul(gammaLanczos(cx(1).sub(z))));
  const w = z.sub(1);
  let a = cx(LANCZOS[0]);
  for (let k = 1; k < LANCZOS.length; k++) a = a.add(cx(LANCZOS[k]).div(w.add(k)));
  const t = w.add(7.5);
  return cpow(t, w.add(0.5)).mul(cexp(t.neg())).mul(a).scale(Math.sqrt(2 * PI));
}

/** 三条路的核对：右半平面上 (1)(2)(3) 互相对，左半平面（不在极点上）(2)(3) 互相对。 */
function crossCheck(): void {
  const right = [cx(0.5), cx(1), cx(2.5), cx(0.3, 1.7), cx(2, 1), cx(1.2, -0.8), cx(0.5, 1), cx(3, 2), cx(2 / 3)];
  for (const z of right) {
    const g1 = gammaIntegral(z);
    const g2 = cx(1).div(recipGammaHankel(z));
    const g3 = gammaLanczos(z);
    if (!g1.isClose(g2, 1e-10) || !g1.isClose(g3, 1e-11)) throw new Error(`Γ(${z.toString(6)}) 三种算法对不上`);
  }
  const left = [cx(-0.5), cx(-1 / 3), cx(-3.5), cx(-2.7, 0.4), cx(-0.2, -1.1), cx(0, 1), cx(-5.5), cx(-1.5, 2)];
  for (const z of left) {
    const g2 = cx(1).div(recipGammaHankel(z));
    const g3 = gammaLanczos(z);
    if (!g2.isClose(g3, 1e-10)) throw new Error(`Γ(${z.toString(6)}) 汉克尔围道和兰乔斯近似对不上`);
  }
  // 已知值：Γ(1) = 1，Γ(1/2) = √π，Γ(5) = 24；1/Γ 在 0、−1、−2、−3 处为 0
  if (!gammaIntegral(cx(0.5)).isClose(cx(Math.sqrt(PI)), 1e-12)) throw new Error('Γ(1/2) ≠ √π');
  if (!gammaIntegral(cx(5)).isClose(cx(24), 1e-12)) throw new Error('Γ(5) ≠ 24');
  for (const k of [0, -1, -2, -3]) {
    if (recipGammaHankel(cx(k)).abs() > 1e-12) throw new Error(`1/Γ 在 ${k} 处不为 0`);
  }
}

/** Γ 在 a 处的留数：在 |z − a| = r 上积分再除以 2πi，取两个半径核对（小圆里只有 a 一个极点）。 */
function residueOfGamma(a: number, gamma: (z: Complex) => Complex): Complex {
  const twoPiI = cx(0, 2 * PI);
  const x = circleIntegral(gamma, a, 0.3, 512).div(twoPiI);
  const y = circleIntegral(gamma, a, 0.15, 512).div(twoPiI);
  if (!x.isClose(y, 1e-10)) throw new Error(`Γ 在 ${a} 处两个半径上算出的留数不一致`);
  return x;
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.gamma-continuation',
  notes: {
    p1: 'Γ(−7/2) 用汉克尔围道算 1/Γ 再取倒数（不用递推公式），和兰乔斯近似加余元公式核对；手算核对：Γ(1/2)/((−7/2)(−5/2)(−3/2)(−1/2)) = 16√π/105 ≈ 0.270088。',
    p2: '逐项判：A 算 Γ(−1/3)（汉克尔围道）≈ −4.0624，而 −(1/3)Γ(2/3)（直接积分）≈ −0.4514，不等（应为 −3Γ(2/3)）；B 在 −1/2、−1/3、−2.7 + 0.4i、−0.2 − 1.1i 处 1/Γ 都不为 0、Γ 有有限值（Γ(−1/2) = −2√π），所以左半平面上有定义的点很多，B 错；C 在 |z + 3| = 0.3、0.15 上积分除以 2πi 得 −1/6，对；D 在 Re z = 1/2 > 0 上直接积 ∫_0^∞ t^{−1/2+i}e^{−t} dt（|t^{−1/2+i}| = t^{−1/2} 在 0 附近可积，绝对收敛），和汉克尔围道、兰乔斯近似给的 Γ(1/2 + i) 对上，对。',
    p3: '先按定义在 |z| = N + 1/2 上积 Γ（N = 0…8，圆周梯形公式 4096 点，Γ 用兰乔斯近似，与汉克尔围道在检验点上核过）除以 2πi，再在每个 −k 处用小圆积分求留数，核对 I_N 等于 k = 0…N 的留数之和；留数按 1/k! 衰减，把 k = 0…25 的留数加起来就是极限，和 e^{−1} 对上（手算：留数 (−1)^k/k!，∑ = e^{−1}）。',
    p4: 'Γ(2 + i) 用直接积分（Re = 2 > 0），Γ(i) 用汉克尔围道（Re = 0，积分不收敛），相除；再用兰乔斯近似的比值核对；手算：Γ(2 + i) = (1 + i)·i·Γ(i)，比值 −1 + i。',
  },
  compute() {
    crossCheck();

    // p1
    const g1 = cx(1).div(recipGammaHankel(cx(-3.5)));
    if (!g1.isClose(gammaLanczos(cx(-3.5)), 1e-11)) throw new Error('p1 两种算法对不上');
    if (!g1.isClose(cx((16 * Math.sqrt(PI)) / 105), 1e-11)) throw new Error('p1 和手算的 16√π/105 对不上');
    if (Math.abs(g1.im) > 1e-13) throw new Error('p1 应是实数');

    // p2
    const truth: boolean[] = [];
    // A：Γ(−1/3) 与 −(1/3)Γ(2/3)
    const gm13 = cx(1).div(recipGammaHankel(cx(-1 / 3)));
    const rhsA = gammaIntegral(cx(2 / 3)).scale(-1 / 3);
    truth.push(gm13.isClose(rhsA, 1e-8));
    if (!gm13.isClose(gammaIntegral(cx(2 / 3)).scale(-3), 1e-10)) throw new Error('p2 A：Γ(−1/3) 应等于 −3Γ(2/3)');
    // B：左半平面上找有定义的点（1/Γ ≠ 0，值有限）
    const leftPts = [cx(-0.5), cx(-1 / 3), cx(-2.7, 0.4), cx(-0.2, -1.1)];
    const definedSomewhere = leftPts.some((z) => recipGammaHankel(z).abs() > 1e-6);
    truth.push(!definedSomewhere);
    if (!cx(1).div(recipGammaHankel(cx(-0.5))).isClose(cx(-2 * Math.sqrt(PI)), 1e-11)) throw new Error('p2 B：Γ(−1/2) 应为 −2√π');
    // C：在 −3 处的留数
    const resC = residueOfGamma(-3, gammaLanczos);
    const resCh = residueOfGamma(-3, (z) => cx(1).div(recipGammaHankel(z)));
    if (!resC.isClose(resCh, 1e-9)) throw new Error('p2 C：两种算法的留数对不上');
    truth.push(resC.isClose(cx(-1 / 6), 1e-9));
    // D：Re z = 1/2 > 0 时直接积分
    const zD = cx(0.5, 1);
    const direct = gammaIntegral(zD);
    // 另用 t 本身做变量、在 [0, 60] 上用双指数求积再核一次（端点 t = 0 处 t^{−1/2} 可积）
    const tIntegrand = (t: number) => (t === 0 ? cx(0) : cpow(cx(t), cx(-0.5, 1)).mul(cx(Math.exp(-t))));
    const direct2 = new Complex(
      integrate((t) => tIntegrand(t).re, 0, 60),
      integrate((t) => tIntegrand(t).im, 0, 60),
    );
    if (!direct.isClose(direct2, 1e-9)) throw new Error('p2 D：两种积分对不上');
    const contD = cx(1).div(recipGammaHankel(zD));
    truth.push(direct.isClose(contD, 1e-9) && direct.isClose(gammaLanczos(zD), 1e-9));
    const p2 = truth.map((t, i) => (t ? i + 1 : 0)).filter((i) => i > 0);

    // p3
    const twoPiI = cx(0, 2 * PI);
    const residues: Complex[] = [];
    for (let k = 0; k <= 25; k++) residues.push(residueOfGamma(-k, gammaLanczos));
    residues.forEach((r, k) => {
      let fact = 1;
      for (let j = 2; j <= k; j++) fact *= j;
      if (!r.isClose(cx((k % 2 === 0 ? 1 : -1) / fact), 1e-9)) throw new Error(`p3 在 −${k} 处的留数和 (−1)^k/k! 对不上`);
    });
    let partial = cx(0);
    for (let N = 0; N <= 8; N++) {
      partial = partial.add(residues[N]);
      const IN = circleIntegral(gammaLanczos, 0, N + 0.5, 4096).div(twoPiI);
      if (!IN.isClose(partial, 1e-8)) throw new Error(`p3 I_${N} 和留数之和对不上`);
    }
    // 小 N 再用汉克尔围道算的 Γ 直接积一次
    for (let N = 0; N <= 2; N++) {
      const IN = circleIntegral((z) => cx(1).div(recipGammaHankel(z)), 0, N + 0.5, 256).div(twoPiI);
      let s = cx(0);
      for (let k = 0; k <= N; k++) s = s.add(residues[k]);
      if (!IN.isClose(s, 1e-8)) throw new Error(`p3 用汉克尔围道算的 I_${N} 和留数之和对不上`);
    }
    let limit = cx(0);
    for (const r of residues) limit = limit.add(r);
    if (!limit.isClose(cx(Math.exp(-1)), 1e-12)) throw new Error('p3 极限和 e^{−1} 对不上');

    // p4
    const g2i = gammaIntegral(cx(2, 1));
    const gi = cx(1).div(recipGammaHankel(cx(0, 1)));
    const ratio = g2i.div(gi);
    const ratioL = gammaLanczos(cx(2, 1)).div(gammaLanczos(cx(0, 1)));
    if (!ratio.isClose(ratioL, 1e-10)) throw new Error('p4 两种算法对不上');
    if (!ratio.isClose(cx(-1, 1), 1e-10)) throw new Error('p4 和手算的 −1 + i 对不上');

    return {
      p1: { type: 'number', value: g1.re },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: limit.re },
      p4: { type: 'tuple', value: [ratio.re, ratio.im] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
