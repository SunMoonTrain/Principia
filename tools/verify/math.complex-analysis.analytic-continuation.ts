// 独立验算 math.complex-analysis.analytic-continuation 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.analytic-continuation.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { arc, cexp, clog, Complex, contourIntegral, cx, integrateC, logAlongPath, partialSumsC, radiusByRatio, segment, taylorCoefficients, windingNumber } from './math.complex-analysis._complex.ts';

/** 一组检验点：给定圆心、半径以内（不含边界）的若干点，避开实轴上的特殊位置。 */
function testPoints(c: Complex | number, rMax: number, count = 24): Complex[] {
  const C0 = Complex.of(c);
  return Array.from({ length: count }, (_, k) => C0.add(Complex.fromPolar(rMax * (0.15 + (0.8 * ((k * 7) % count)) / count), 0.37 + 2.1 * k)));
}

/**
 * 幂级数 ∑_{n≥0} a(n) zⁿ 在 z 处的和：部分和取到 nMax（调用处保证 |z| 离收敛半径足够远，尾巴可以不计），再和 nMax/2 处的部分和核对。
 * zⁿ 逐次相乘，|z| 要小于 1（∑zⁿ/3ⁿ、∑(−z²/4)ⁿ 这类先换成 w = z/3、w = −z²/4 再代进来），免得 zⁿ 溢出。
 */
function seriesAt(a: (n: number) => number, z: Complex, nMax: number): Complex {
  let pow = cx(1);
  const terms: Complex[] = [];
  for (let n = 0; n <= nMax; n++) {
    terms.push(pow.scale(a(n)));
    pow = pow.mul(z);
  }
  const [half, full] = partialSumsC((n) => terms[n], [Math.floor(nMax / 2), nMax]);
  if (!half.isClose(full, 1e-12)) throw new Error(`级数在 ${z.toString(6)} 处取 ${nMax} 项还没收敛`);
  return full;
}

/**
 * 实系数列 b_k（k = k0…k1）的最短线性递推 b_k + p b_{k−1} + q b_{k−2} = 0：最小二乘解 p、q，返回相对残差。
 * 用来从泰勒系数本身读出收敛半径（Prony 的办法）：特征根 x² + px + q = 0 的模是 1/R。
 */
function fitOrder2(b: number[], k0: number, k1: number): { p: number; q: number; residual: number } {
  let s11 = 0, s12 = 0, s22 = 0, t1 = 0, t2 = 0;
  for (let k = k0; k <= k1; k++) {
    const u = b[k - 1], v = b[k - 2], y = -b[k];
    s11 += u * u; s12 += u * v; s22 += v * v; t1 += u * y; t2 += v * y;
  }
  const det = s11 * s22 - s12 * s12;
  const p = (t1 * s22 - t2 * s12) / det;
  const q = (s11 * t2 - s12 * t1) / det;
  let res = 0;
  for (let k = k0; k <= k1; k++) res = Math.max(res, Math.abs(b[k] + p * b[k - 1] + q * b[k - 2]) / Math.max(Math.abs(b[k]), Math.abs(b[k - 1])));
  return { p, q, residual: res };
}

/** 一阶递推 b_k + p b_{k−1} = 0 的最小二乘残差（对照用：要是一阶就够，收敛半径直接是系数比）。 */
function fitOrder1Residual(b: number[], k0: number, k1: number): number {
  let s = 0, t = 0;
  for (let k = k0; k <= k1; k++) { s += b[k - 1] * b[k - 1]; t += -b[k - 1] * b[k]; }
  const p = t / s;
  let res = 0;
  for (let k = k0; k <= k1; k++) res = Math.max(res, Math.abs(b[k] + p * b[k - 1]) / Math.max(Math.abs(b[k]), Math.abs(b[k - 1])));
  return res;
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.analytic-continuation',
  notes: {
    p1: '在右半平面 24 个点上用双指数求积算 ∫₀^∞ e^{−zt} dt（换元 t = u/(1 − u)），核对 z·F(z) 都等于 1，所以 F = 1/z；1/z 在连通的 ℂ∖{0} 上全纯，由唯一性定理它就是延拓，代 z = −4。',
    p2: 'A：1/(z + 2) 在 (0, 1) 的 30 个点上和题给的值一致，ℂ∖{−2} 连通、(0, 1) 有聚到 1/2 的点列，唯一性定理给出 F 处处等于它；另取 4 个在 ℂ∖{−2} 上全纯、不恒为 0 的扰动（sin πz、z(z − 1)、e^z − 1、1/(z + 2)²），看它们在 (0, 1) 上都不全为 0（不是反例）。B：部分和核对 ∑zⁿ/3ⁿ = 3/(3 − z)，在 −1 处半径 3.9 的圆周上采样求泰勒系数，系数比外推出收敛半径，和 2 比。C：部分和在单位圆盘 24 个点上核对 ∑(n + 1)zⁿ = 1/(1 − z)²，它在连通的 ℂ∖{1} 上全纯。D：部分和核对 Log(1 + z) 等于级数，再看 Log(1 + z) 在 z = −2 上下两侧差 2πi、在 ℂ∖{−1} 上不连续；绕 −1 一圈 ∮dz/(1 + z) = 2πi ≠ 0，ℂ∖{−1} 上没有任何单值的延拓。',
    p3: '圆周 |z − 1| = 0.95 上用部分和（1500 项）采样，求 f 在 1 处的泰勒系数 b₀…b₃₀（不用和函数的式子）；在 b₂…b₁₄ 上拟合，一阶递推残差大，二阶递推 b_k + p b_{k−1} + q b_{k−2} = 0 残差在 10⁻⁹ 以下，特征根是一对共轭复数、模是 1/R，所以 R = 1/√q；再用递推把系数往后推到 600 项，在 z = 3（|3 − 1| = 2 < R）处求新级数的和。另用部分和核对 f = 4/(4 + z²)（30 个点），对照 4/(4 + 9)。',
    p4: 'f(1/2) 用部分和；f′ = ∑z^{n−1} 的部分和在单位圆盘 24 个点上核对等于 1/(1 − z)，它在 ℂ∖{1} 上单值全纯，所以沿曲线延拓回来的值 = f(1/2) + ∫_γ dz/(1 − z)，积分按定义沿圆周 1 + ½e^{it}（t 从 π 到 3π）求。另用沿路径连续地取 log(1 − z) 核对（f = −log(1 − z)，起点取 log ½ = −ln 2）。',
  },
  compute() {
    // ---- p1 ----
    const F = (z: Complex) => integrateC((u) => (u >= 1 ? cx(0) : cexp(z.scale(-u / (1 - u))).scale(1 / (1 - u) ** 2)), 0, 1);
    const right = Array.from({ length: 24 }, (_, k) => cx(0.4 + 0.3 * (k % 6), -3 + 0.3 * k));
    for (const z of right) if (!z.mul(F(z)).isClose(1, 1e-9)) throw new Error(`p1：z·F(z) 在 ${z.toString(6)} 处不是 1`);
    const p1 = cx(1).div(cx(-4));

    // ---- p2 ----
    // A
    const xs = Array.from({ length: 30 }, (_, k) => (k + 0.5) / 30);
    const candA = (z: Complex) => cx(1).div(z.add(2));
    const A0 = xs.every((x) => Math.abs(candA(cx(x)).re - 1 / (x + 2)) < 1e-15 && candA(cx(x)).im === 0);
    const perturb: ((z: Complex) => Complex)[] = [
      (z) => new Complex(Math.sin(Math.PI * z.re) * Math.cosh(Math.PI * z.im), Math.cos(Math.PI * z.re) * Math.sinh(Math.PI * z.im)),
      (z) => z.mul(z.sub(1)),
      (z) => cexp(z).sub(1),
      (z) => cx(1).div(z.add(2).mul(z.add(2))),
    ];
    // 反例要在 (0, 1) 上处处为 0；这 4 个都不是（各有点不为 0），和唯一性定理一致
    const anyCounter = perturb.some((g) => xs.every((x) => g(cx(x)).abs() < 1e-12));
    const A = A0 && !anyCounter;
    // B
    const geo3 = (z: Complex) => seriesAt(() => 1, z.scale(1 / 3), 4000);
    for (const z of testPoints(0, 2.7)) if (!geo3(z).isClose(cx(3).div(cx(3).sub(z)), 1e-10)) throw new Error('p2 B：∑zⁿ/3ⁿ 和 3/(3 − z) 对不上');
    const bB = taylorCoefficients((z) => cx(3).div(cx(3).sub(z)), -1, 400, 3.9, 2048);
    const RB = radiusByRatio((n) => Math.log(bB[n].abs()), 1, 16, 5);
    if (!RB.converged) throw new Error('p2 B：系数比没有收敛');
    const B = Math.abs(RB.value - 2) < 1e-6;
    // C
    const C = testPoints(0, 0.95).every((z) => seriesAt((n) => n + 1, z, 3000).isClose(cx(1).div(cx(1).sub(z).mul(cx(1).sub(z))), 1e-9));
    // D
    const Dseries = testPoints(0, 0.9).every((z) => seriesAt((n) => (n === 0 ? 0 : (-1) ** (n + 1) / n), z, 3000).isClose(clog(z.add(1)), 1e-9));
    const jump = clog(cx(-2, 1e-12).add(1)).sub(clog(cx(-2, -1e-12).add(1)));
    const discontinuous = Math.abs(jump.im - 2 * Math.PI) < 1e-9;
    const loop = contourIntegral((z) => cx(1).div(z.add(1)), arc(-1, 0.5, 0, 2 * Math.PI)).value; // 延拓回来差的就是它
    const noSingleValued = loop.isClose(cx(0, 2 * Math.PI), 1e-8);
    const D = Dseries && !discontinuous && !noSingleValued;
    const p2 = [A, B, C, D].map((ok, i) => (ok ? i + 1 : 0)).filter((i) => i > 0);

    // ---- p3 ----
    // 题给的级数 ∑(−1)ⁿz²ⁿ/4ⁿ 就是 ∑wⁿ，w = −z²/4（|z| < 2 时 |w| < 1）
    const fSeries = (z: Complex) => seriesAt(() => 1, z.mul(z).scale(-1 / 4), 1500);
    const bC = taylorCoefficients(fSeries, 1, 30, 0.95, 256);
    if (bC.some((c) => Math.abs(c.im) > 1e-9 * Math.max(1, c.abs()))) throw new Error('p3：实轴上展开，系数应是实数');
    const b = bC.map((c) => c.re);
    // 采样半径 0.95 时 b_k 的舍入误差约 10⁻¹⁶/0.95^k，k ≤ 14 的系数相对误差在 10⁻¹¹ 以下，拟合只用这一段
    const r1 = fitOrder1Residual(b, 2, 14);
    const { p, q, residual } = fitOrder2(b, 2, 14);
    if (!(r1 > 1e-2) || !(residual < 1e-9)) throw new Error(`p3：递推拟合不像二阶（一阶残差 ${r1}，二阶残差 ${residual}）`);
    const disc = p * p - 4 * q;
    const rootMod = disc < 0 ? Math.sqrt(q) : Math.max(Math.abs((-p + Math.sqrt(disc)) / 2), Math.abs((-p - Math.sqrt(disc)) / 2));
    const R3 = 1 / rootMod;
    // 用递推把系数推到 600 项，求新级数在 z = 3（离中心 2）处的和
    const ext = [b[0], b[1]];
    for (let k = 2; k <= 600; k++) ext.push(-p * ext[k - 1] - q * ext[k - 2]);
    let s3 = 0;
    for (let k = 0; k <= 600; k++) s3 += ext[k] * 2 ** k;
    for (const z of testPoints(0, 1.9, 30)) if (!fSeries(z).isClose(cx(4).div(cx(4).add(z.mul(z))), 1e-10)) throw new Error('p3：级数和 4/(4 + z²) 对不上');
    if (Math.abs(s3 - 4 / 13) > 1e-8) throw new Error(`p3：递推求和 ${s3} 和 4/13 对不上`);

    // ---- p4 ----
    const f0 = seriesAt((n) => (n === 0 ? 0 : 1 / n), cx(0.5), 200);
    for (const z of testPoints(0, 0.9)) if (!seriesAt(() => 1, z, 3000).isClose(cx(1).div(cx(1).sub(z)), 1e-9)) throw new Error('p4：f′ 的级数和 1/(1 − z) 对不上');
    const gamma = arc(1, 0.5, Math.PI, 3 * Math.PI);
    if (!gamma.z(gamma.t0).isClose(0.5, 1e-15) || Math.abs(windingNumber(gamma, 1) - 1) > 1e-9) throw new Error('p4：曲线不对');
    const inc = contourIntegral((z) => cx(1).div(cx(1).sub(z)), gamma);
    if (!inc.converged) throw new Error('p4：积分没有收敛');
    const p4v = f0.add(inc.value);
    // 核对：w = 1 − z 沿曲线连续取对数
    const wPath = { z: (t: number) => cx(1).sub(gamma.z(t)), t0: gamma.t0, t1: gamma.t1 };
    const logEnd = logAlongPath(wPath, 0);
    if (!logEnd.neg().isClose(p4v, 1e-8)) throw new Error('p4：两种算法不一致');
    // 走到一半（−1 处没有延拓的障碍）只是顺带核对：从 1/2 沿线段到 0 应回到 f(0) = 0
    if (!f0.add(contourIntegral((z) => cx(1).div(cx(1).sub(z)), segment(0.5, 0)).value).isClose(0, 1e-9)) throw new Error('p4：线段核对失败');

    return {
      p1: { type: 'number', value: p1.re },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [R3, s3] },
      p4: { type: 'tuple', value: [p4v.re, p4v.im] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
