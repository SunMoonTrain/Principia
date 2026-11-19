// 独立验算 math.complex-analysis.rouche-theorem 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.rouche-theorem.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cexp, circle, circleIntegral, Complex, cx, derivativeC, mullerRoot, polyEval, polyRoots, type Path, windingNumber } from './math.complex-analysis._complex.ts';

export const verification: Verification = {
  lesson: 'math.complex-analysis.rouche-theorem',
  notes: {
    p1: '三条路互相核对：(1) Aberth 同时迭代求 z⁸ − 7z⁶ + 2 的 8 个根，数 |z| < 1 里的个数，并核对没有根离单位圆小于 10⁻³；(2) 单位圆上 1024 点梯形公式积 p′/p（p′ 按系数求导），除以 2πi；(3) 像曲线 p(e^{it}) 绕原点的圈数（累计辐角增量）。三者都要是同一个整数。另外在圆周上 20000 个点核对 |z⁸ + 2| < |7z⁶|（最大比值应为 3/7），作为儒歇定理那条路的旁证。',
    p2: '对四个候选 f（z⁴、6z、6z + 3、3），g = p − f，在 |z| = 2 上取 200000 个等分点算 |f| − |g| 的最小值，最小值大于 0 的才算「处处 |g| < |f|」；不满足的还要找出一个具体的反例点（|g| ≥ |f|）。只有一项满足时才给答案。再核对这一项的 f 在 |z| < 2 里的根数（按重数）和 p 本身的根数（Aberth 求根、像曲线圈数两条路）一致。',
    p3: '三条路核对：(1) Aberth 求 z⁵ − 6z² + 2 的 5 个根，数 1 < |z| < 2 里的个数，核对没有根离两个圆周小于 10⁻³；(2) 两个圆周 |z| = 2、|z| = 1 上各积 p′/p 除以 2πi，相减；(3) 两个圆周上像曲线绕原点的圈数相减。另外在两个圆周上核对占优的项：|z| = 2 上 |−6z² + 2| < |z⁵|，|z| = 1 上 |z⁵ + 2| < |6z²|，并核对单位圆上 p 不为零（圆环是开的，圆周上的根不能算进去也不能漏）。',
    p4: '根的个数三条路核对：(1) 单位圆上梯形公式积 h′/h，h(z) = e^z − 4z²，h′ 用小圆上的柯西积分数值求（derivativeC），除以 2πi；(2) 像曲线 h(e^{it}) 绕原点的圈数；(3) 在 [−1, 1]² 的格点上撒初值用 Muller 法求 h 的零点，去重后数 |z| < 1 的个数（每个零点核对 h′ ≠ 0，所以是单零点，按阶计就是个数）。实根：数出的零点里虚部绝对值小于 10⁻¹² 的个数，再用 (−1, 1) 上 e^x − 4x² 的变号次数（4000 等分）核对；单位圆上 |e^z| = e^{cos t} ≤ e < 4 = |4z²| 也在 20000 个点上核对。',
  },
  compute() {
    // ---- p1 ----
    const c1 = [1, 0, -7, 0, 0, 0, 0, 0, 2]; // z⁸ − 7z⁶ + 2
    const roots1 = polyRoots(c1);
    const count1 = countInDisc(roots1, 1);
    const ap1 = argPrinciplePoly(c1, 1);
    const wind1 = windingNumber(mapPath((z) => polyEval(c1, z), circle(0, 1)), 0);
    if (!nearInt(ap1) || !nearInt(wind1)) throw new Error(`p1：积分 ${ap1}、圈数 ${wind1} 不是整数`);
    if (Math.round(ap1) !== count1 || Math.round(wind1) !== count1) throw new Error(`p1：根数 ${count1}、积分 ${ap1}、圈数 ${wind1} 对不上`);
    const ratio1 = maxRatioOnCircle((z) => polyEval([1, 0, 0, 0, 0, 0, 0, 0, 2], z), (z) => polyEval([-7, 0, 0, 0, 0, 0, 0], z), 1);
    if (!(ratio1 < 1)) throw new Error(`p1：单位圆上 |z⁸ + 2|/|7z⁶| 的最大值 ${ratio1} 不小于 1`);

    // ---- p2 ----
    const c2 = [1, 0, 0, 6, 3]; // z⁴ + 6z + 3
    const candidates2: number[][] = [
      [1, 0, 0, 0, 0], // z⁴
      [6, 0], // 6z
      [6, 3], // 6z + 3
      [3], // 3
    ];
    const good2: number[] = [];
    candidates2.forEach((f, i) => {
      const g = polySub(c2, f);
      const fz = (z: Complex) => polyEval(f, z);
      const gz = (z: Complex) => polyEval(g, z);
      const N = 200000;
      let minGap = Infinity;
      let witness: Complex | null = null;
      for (let k = 0; k < N; k++) {
        const z = Complex.fromPolar(2, (2 * Math.PI * k) / N);
        const gap = fz(z).abs() - gz(z).abs();
        if (gap < minGap) minGap = gap;
        if (gap <= 0 && witness === null) witness = z;
      }
      if (minGap > 1e-9) good2.push(i + 1);
      else if (witness === null) throw new Error(`p2：第 ${i + 1} 项不满足条件，却找不到反例点`);
    });
    if (good2.length !== 1) throw new Error(`p2：满足条件的选项是 ${good2}，不是恰好一个`);
    const fGood = candidates2[good2[0] - 1];
    const countF = countInDisc(polyRoots(fGood), 2);
    const countP2 = countInDisc(polyRoots(c2), 2);
    const windP2 = windingNumber(mapPath((z) => polyEval(c2, z), circle(0, 2)), 0);
    if (countF !== countP2 || Math.round(windP2) !== countP2) throw new Error(`p2：f 的根数 ${countF}、p 的根数 ${countP2}、圈数 ${windP2} 对不上`);

    // ---- p3 ----
    const c3 = [1, 0, 0, -6, 0, 2]; // z⁵ − 6z² + 2
    const roots3 = polyRoots(c3);
    for (const z of roots3) {
      if (Math.abs(z.abs() - 1) < 1e-3 || Math.abs(z.abs() - 2) < 1e-3) throw new Error(`p3：根 ${z.toString(8)} 离圆周太近`);
    }
    const count3 = roots3.filter((z) => z.abs() > 1 && z.abs() < 2).length;
    const ap3 = argPrinciplePoly(c3, 2) - argPrinciplePoly(c3, 1);
    const p3z = (z: Complex) => polyEval(c3, z);
    const wind3 = windingNumber(mapPath(p3z, circle(0, 2)), 0) - windingNumber(mapPath(p3z, circle(0, 1)), 0);
    if (!nearInt(ap3) || !nearInt(wind3)) throw new Error(`p3：积分 ${ap3}、圈数 ${wind3} 不是整数`);
    if (Math.round(ap3) !== count3 || Math.round(wind3) !== count3) throw new Error(`p3：根数 ${count3}、积分 ${ap3}、圈数 ${wind3} 对不上`);
    const ratio3a = maxRatioOnCircle((z) => polyEval([-6, 0, 2], z), (z) => polyEval([1, 0, 0, 0, 0, 0], z), 2);
    const ratio3b = maxRatioOnCircle((z) => polyEval([1, 0, 0, 0, 0, 2], z), (z) => polyEval([-6, 0, 0], z), 1);
    if (!(ratio3a < 1) || !(ratio3b < 1)) throw new Error(`p3：占优的项不成立（${ratio3a}、${ratio3b}）`);

    // ---- p4 ----
    const h4 = (z: Complex) => cexp(z).sub(z.mul(z).scale(4)); // e^z − 4z²
    const ap4c = circleIntegral((z) => derivativeC(h4, z, 1, 0.05).div(h4(z)), 0, 1, 1024).div(new Complex(0, 2 * Math.PI));
    if (Math.abs(ap4c.im) > 1e-6 || !nearInt(ap4c.re)) throw new Error(`p4：积分 ${ap4c.toString(8)} 不是整数`);
    const ap4 = Math.round(ap4c.re);
    const wind4 = windingNumber(mapPath(h4, circle(0, 1)), 0);
    const zeros4: Complex[] = [];
    for (let x = -1; x <= 1.0001; x += 0.1) {
      for (let y = -1; y <= 1.0001; y += 0.1) {
        const r = mullerRoot(h4, cx(x, y));
        if (!Number.isFinite(r.re) || !Number.isFinite(r.im) || !(h4(r).abs() < 1e-12)) continue;
        if (!zeros4.some((s) => s.sub(r).abs() < 1e-6)) zeros4.push(r);
      }
    }
    const inside4 = zeros4.filter((z) => z.abs() < 1);
    for (const z of inside4) {
      if (Math.abs(z.abs() - 1) < 1e-3) throw new Error(`p4：零点 ${z.toString(8)} 离单位圆太近`);
      const d = cexp(z).sub(z.scale(8)); // h′(z) = e^z − 8z
      if (d.abs() < 1e-6) throw new Error(`p4：零点 ${z.toString(8)} 不是单零点`);
    }
    if (ap4 !== inside4.length || Math.round(wind4) !== inside4.length) throw new Error(`p4：积分 ${ap4}、圈数 ${wind4}、找到的零点 ${inside4.length} 对不上`);
    const real4 = inside4.filter((z) => Math.abs(z.im) < 1e-12).length;
    let signChanges = 0;
    const hx = (x: number) => Math.exp(x) - 4 * x * x;
    for (let k = 0; k < 4000; k++) {
      const a = -1 + (2 * k) / 4000;
      const b = -1 + (2 * (k + 1)) / 4000;
      if (hx(a) * hx(b) < 0) signChanges++;
    }
    if (signChanges !== real4) throw new Error(`p4：变号 ${signChanges} 次，找到的实零点 ${real4} 个，对不上`);
    const ratio4 = maxRatioOnCircle((z) => cexp(z), (z) => z.mul(z).scale(4), 1);
    if (!(ratio4 < 1)) throw new Error(`p4：单位圆上 |e^z|/|4z²| 的最大值 ${ratio4} 不小于 1`);

    return {
      p1: { type: 'number', value: count1 },
      p2: { type: 'choice', value: good2 },
      p3: { type: 'number', value: count3 },
      p4: { type: 'tuple', value: [ap4, real4] },
    };
  },
};

/** 曲线在 f 下的像。 */
function mapPath(f: (z: Complex) => Complex, p: Path): Path {
  return { z: (t) => f(p.z(t)), t0: p.t0, t1: p.t1 };
}

/** 两个多项式相减（系数从最高次排起，按次数对齐）。 */
function polySub(a: number[], b: number[]): number[] {
  const n = Math.max(a.length, b.length);
  const pa = [...new Array<number>(n - a.length).fill(0), ...a];
  const pb = [...new Array<number>(n - b.length).fill(0), ...b];
  return pa.map((x, i) => x - pb[i]);
}

/** 多项式求导（系数从最高次排起）。 */
function polyDeriv(a: number[]): number[] {
  const n = a.length - 1;
  return a.slice(0, n).map((x, i) => x * (n - i));
}

/** 圆周 |z| = R 上 (1/2πi)∮ p′/p dz，梯形公式。 */
function argPrinciplePoly(c: number[], R: number): number {
  const d = polyDeriv(c);
  const v = circleIntegral((z) => polyEval(d, z).div(polyEval(c, z)), 0, R, 1024).div(new Complex(0, 2 * Math.PI));
  if (Math.abs(v.im) > 1e-6) throw new Error(`辐角原理的积分 ${v.toString(8)} 不是实数`);
  return v.re;
}

/** |z| < R 里的根数；重根的近似值各自算一个。根离圆周太近就报错。 */
function countInDisc(roots: Complex[], R: number): number {
  for (const z of roots) if (Math.abs(z.abs() - R) < 1e-3) throw new Error(`根 ${z.toString(8)} 离圆周太近`);
  return roots.filter((z) => z.abs() < R).length;
}

/** 圆周 |z| = R 上 |small(z)|/|big(z)| 的最大值（20000 个等分点）。 */
function maxRatioOnCircle(small: (z: Complex) => Complex, big: (z: Complex) => Complex, R: number): number {
  let m = 0;
  for (let k = 0; k < 20000; k++) {
    const z = Complex.fromPolar(R, (2 * Math.PI * k) / 20000);
    m = Math.max(m, small(z).abs() / big(z).abs());
  }
  return m;
}

const nearInt = (x: number) => Math.abs(x - Math.round(x)) < 1e-6;

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
