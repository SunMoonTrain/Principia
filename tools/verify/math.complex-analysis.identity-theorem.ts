// 独立验算 math.complex-analysis.identity-theorem 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.identity-theorem.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cexp, circle, Complex, csin, cx, derivativeC, I, mullerRoot, radiusByRatio, taylorCoefficients, windingNumber, type Path } from './math.complex-analysis._complex.ts';

/** 离整数够近就取整，否则报错（零点个数、阶都应是整数）。 */
function asInteger(x: number, what: string, tol = 1e-6): number {
  const n = Math.round(x);
  if (Math.abs(x - n) > tol) throw new Error(`${what}：${x} 不是整数`);
  return n;
}

/** 圆盘 |z − c| < r 里（含圆周）的格点，用来看一个函数在圆盘上是不是恒为 0。 */
function discGrid(c: Complex, r: number, n = 41): Complex[] {
  const pts: Complex[] = [];
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      const z = c.add(cx(-r + (2 * r * i) / n, -r + (2 * r * j) / n));
      if (z.sub(c).abs() < r) pts.push(z);
    }
  }
  return pts;
}

const maxAbsOn = (g: (z: Complex) => number, pts: Complex[]) => Math.max(...pts.map((z) => Math.abs(g(z))));

/** p2 的检验函数：都在单位圆盘 D 上全纯、不恒为 0（各自在 0.3 处的值或某阶导数不为 0）。 */
const tests: { name: string; f: (z: Complex) => Complex }[] = [
  { name: 'z³', f: (z) => z.mul(z).mul(z) },
  { name: '(z − 0.5)³', f: (z) => z.sub(0.5).mul(z.sub(0.5)).mul(z.sub(0.5)) },
  { name: 'z²(z − 0.2)', f: (z) => z.mul(z).mul(z.sub(0.2)) },
  { name: 'i', f: () => I },
  { name: '2i', f: () => cx(0, 2) },
  { name: 'z', f: (z) => z },
  { name: 'iz', f: (z) => z.mul(I) },
  { name: 'sin πz', f: (z) => csin(z.scale(Math.PI)) },
  { name: 'sin(π/(z − 2))', f: (z) => csin(cx(Math.PI).div(z.sub(2))) },
  { name: 'e^z − 1', f: (z) => cexp(z).sub(1) },
  { name: 'z − i/2', f: (z) => z.sub(cx(0, 0.5)) },
];

export const verification: Verification = {
  lesson: 'math.complex-analysis.identity-theorem',
  notes: {
    p1: '在 0 处按圆周采样（半径 0.5，1024 点）求 e^{z²} − 1 − z² 的泰勒系数 a_0…a_12，取第一个 |a_n| > 10⁻⁸ 的 n（前面的都小于 10⁻¹²）；再沿 4 个方向看 f(z)/z^n 在 z → 0 时趋于同一个不为 0 的数（1/2）、f(z)/z^{n−1} → 0。',
    p2: '取 D 为单位圆盘，拿 11 个在 D 上全纯、不恒为 0 的函数（z³、(z − 0.5)³、z²(z − 0.2)、i、2i、z、iz、sin πz、sin(π/(z − 2))、e^z − 1、z − i/2）逐条找反例：A 用圆周上的柯西积分求 0、0.5、0.2 处的 f、f′、f″，z³ 在 0 处、(z − 0.5)³ 在 0.5 处全为 0，A 不成立；B 看 (−1, 1) 上 201 个实数点处 |f| 的最大值，没有一个检验函数处处为 0（D 是开集，D 与实轴的交含一个区间，区间里有收敛到区间内一点的点列，唯一性定理给出 f ≡ 0，B 成立）；C 看 3 个开圆盘里格点上 |Re f| 的最大值，常数 i、2i 的实部恒为 0 却不恒为 0，C 不成立；D 看同样 3 个圆盘里 |f²| 的最大值，没有检验函数为 0（|f|² = |f²| = 0 推出 f 在那个圆盘上为 0，再用唯一性定理，D 成立）。',
    p3: '把条件写成 f(1/n) = h(n)，h(n) = 1/(n² + 1)，令 g(z) = h(1/z) = 1/(z⁻² + 1)（复数运算，不化简）；核对 g(1/n) = h(n)（n = 2…200）；在 0 处取半径 0.9 的圆周采样求 g 的泰勒系数（采样不碰 0；半径 0.9 和 0.45 算出的低阶系数一致，说明 0 处可去），偶次项系数比外推出收敛半径 1，g 在 |z| < 1 上全纯；1/n → 0 在圆盘里，唯一性定理给出 f = g，算 g(i/2)，并用泰勒级数在 i/2 处求和核对。',
    p4: '令 F(z) = sin(1/z)，在圆环 1/10 < |z| < 1 上全纯。先核对两个圆周上 |F| 的最小值都远离 0（边界上没有零点），再用辐角原理：外圆周的像绕 0 的圈数减去内圆周的像绕 0 的圈数（都逆时针，各 2×10⁵ 步）；另从圆环里 600 个起点用 Muller 法找 F 的零点，去重后数落在闭圆环里的个数，两种算法核对。',
  },
  compute() {
    // ---- p1 ----
    const f1 = (z: Complex) => cexp(z.mul(z)).sub(1).sub(z.mul(z));
    const a = taylorCoefficients(f1, 0, 12, 0.5, 1024);
    const order = a.findIndex((c) => c.abs() > 1e-8);
    if (order < 1) throw new Error('p1：没找到非零系数');
    for (let n = 0; n < order; n++) if (a[n].abs() > 1e-12) throw new Error(`p1：a_${n} = ${a[n].abs()} 不够小`);
    for (const dir of [cx(1), cx(0, 1), Complex.fromPolar(1, 0.7), Complex.fromPolar(1, 2.5)]) {
      const lim = [1e-1, 3e-2, 1e-2].map((t) => {
        const z = dir.scale(t);
        return f1(z).div(z.mul(z).mul(z).mul(z));
      });
      // f(z)/z^order 应趋于 a_order（不为 0）
      if (!lim[2].isClose(a[order], 1e-3)) throw new Error('p1：f/z^n 的极限和系数对不上');
      const z = dir.scale(1e-2);
      if (f1(z).div(z.mul(z).mul(z)).abs() > 1e-1) throw new Error('p1：f/z^{n−1} 不趋于 0');
    }
    const p1 = order;

    // ---- p2 ----
    const zeroTol = 1e-12;
    // A：某点 a 处 f(a) = f′(a) = f″(a) = 0，f 却不恒为 0
    const A = !tests.some(({ f }) =>
      [cx(0), cx(0.5), cx(0.2)].some((p) => [0, 1, 2].every((k) => (k === 0 ? f(p) : derivativeC(f, p, k, 0.1, 512)).abs() < 1e-10)),
    );
    // B：(−1, 1) 上每个实数点处 f(x) = 0
    const realPts = Array.from({ length: 201 }, (_, k) => cx(-0.995 + (1.99 * k) / 200));
    const B = !tests.some(({ f }) => maxAbsOn((z) => f(z).abs(), realPts) < zeroTol);
    // C、D：在 D 里的某个开圆盘上 Re f ≡ 0、f² ≡ 0
    const discs = [discGrid(cx(0), 0.5), discGrid(cx(0.5, 0.2), 0.3), discGrid(cx(-0.3, -0.4), 0.2)];
    const C = !tests.some(({ f }) => discs.some((pts) => maxAbsOn((z) => f(z).re, pts) < zeroTol));
    const D = !tests.some(({ f }) => discs.some((pts) => maxAbsOn((z) => f(z).mul(f(z)).abs(), pts) < zeroTol));
    // 检验函数确实都不恒为 0
    for (const { name, f } of tests) {
      if (f(cx(0.3, 0.1)).abs() < 1e-6) throw new Error(`p2：检验函数 ${name} 在 0.3 + 0.1i 处为 0，换一个点`);
    }
    const p2 = [A, B, C, D].map((ok, i) => (ok ? i + 1 : 0)).filter((i) => i > 0);

    // ---- p3 ----
    const h = (n: Complex) => cx(1).div(n.mul(n).add(1));
    const g = (z: Complex) => h(cx(1).div(z));
    for (let n = 2; n <= 200; n++) {
      if (!g(cx(1 / n)).isClose(cx(1 / (n * n + 1)), 1e-12)) throw new Error(`p3：g(1/${n}) 对不上`);
    }
    const b = taylorCoefficients(g, 0, 300, 0.9, 2048);
    const R = radiusByRatio((n) => Math.log(b[n].abs()), 2, 8, 5);
    if (!R.converged || Math.abs(R.value - 1) > 1e-6) throw new Error(`p3：收敛半径 ${R.value}`);
    const w = cx(0, 0.5);
    let series = cx(0);
    let pow = cx(1);
    for (let n = 0; n <= 300; n++) {
      series = series.add(b[n].mul(pow));
      pow = pow.mul(w);
    }
    const direct = g(w);
    if (!series.isClose(direct, 1e-9)) throw new Error('p3：级数求和与直接代入不一致');
    if (Math.abs(direct.im) > 1e-14) throw new Error('p3：g(i/2) 应是实数');
    const p3 = direct.re;

    // ---- p4 ----
    const F = (z: Complex) => csin(cx(1).div(z));
    const image = (p: Path): Path => ({ z: (t) => F(p.z(t)), t0: p.t0, t1: p.t1 });
    const outer = circle(0, 1);
    const inner = circle(0, 0.1);
    const minOn = (p: Path) => {
      let m = Infinity;
      for (let k = 0; k <= 20000; k++) m = Math.min(m, F(p.z(p.t0 + ((p.t1 - p.t0) * k) / 20000)).abs());
      return m;
    };
    if (minOn(outer) < 0.1 || minOn(inner) < 0.1) throw new Error('p4：边界上离零点太近');
    const byWinding = asInteger(windingNumber(image(outer), 0, 200000) - windingNumber(image(inner), 0, 200000), 'p4 辐角原理', 1e-3);
    const found: Complex[] = [];
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 30; j++) {
        const z0 = Complex.fromPolar(0.1 + (0.9 * (i + 0.5)) / 20, (2 * Math.PI * (j + 0.3)) / 30);
        const z = mullerRoot(F, z0, 0.01);
        if (!Number.isFinite(z.re) || !Number.isFinite(z.im) || F(z).abs() > 1e-10) continue;
        if (z.abs() < 0.1 - 1e-12 || z.abs() > 1 + 1e-12) continue;
        if (!found.some((u) => u.isClose(z, 1e-8))) found.push(z);
      }
    }
    if (found.length !== byWinding) throw new Error(`p4：Muller 找到 ${found.length} 个，辐角原理给 ${byWinding} 个`);
    const p4 = byWinding;

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
