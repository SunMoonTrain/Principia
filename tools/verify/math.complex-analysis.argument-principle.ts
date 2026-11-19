// 独立验算 math.complex-analysis.argument-principle 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.argument-principle.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cexp, circle, circleIntegral, Complex, cx, derivativeC, mullerRoot, polyEval, polyRoots, type Path, windingNumber } from './math.complex-analysis._complex.ts';

export const verification: Verification = {
  lesson: 'math.complex-analysis.argument-principle',
  notes: {
    p1: '三条路互相核对：(1) 圆周 |z| = 2 上用梯形公式积 f′/f（f′ 用小圆上的柯西积分 derivativeC 数值求，不用对数导数的分解），除以 2πi；(2) 像曲线 f(2e^{it}) 绕原点的圈数（累计辐角增量）；(3) 分子 (z − 1)³(z + 5) 展开后同时迭代求根、分母 z² + 1 求根，数 |z| < 2 里的个数（按重数）相减。三者都要离整数小于 10⁻⁶ 且相等。',
    p2: '四条曲线各取 20000 段折线累计 w 的辐角增量除以 2π（windingNumber），挑出圈数离 2 小于 10⁻⁶ 的那一条；另外核对每条曲线都不经过原点（最小模大于 0.5）。',
    p3: '两条路核对：(1) 圆周 |z| = 2 上梯形公式积 z f′(z)/f(z)（f′ 数值求），除以 2πi；(2) 求出分子 z² + 1、分母 z − ½ 的根，圆内零点之和减极点之和。两者相差小于 10⁻⁹。',
    p4: '三条路核对：(1) 圆周 |z| = 10 上 4096 点梯形公式积 e^z/(e^z − 1)（circleIntegral 内部再用 2048 点核对），除以 2πi；(2) 像曲线 e^{10e^{it}} − 1 绕原点的圈数；(3) 在 [−10, 10]² 的格点上撒初值用 Muller 法求 e^z − 1 的零点，去重后数 |z| < 10 的个数，并核对找到的零点都离 2πik 小于 10⁻⁹、离圆周至少 2。',
  },
  compute() {
    // ---- p1 ----
    const num1 = polyMul(polyMul(polyMul([1, -1], [1, -1]), [1, -1]), [1, 5]); // (z − 1)³(z + 5)
    const den1 = [1, 0, 1]; // z² + 1
    const f1 = (z: Complex) => polyEval(num1, z).div(polyEval(den1, z));
    const R1 = 2;
    const int1 = circleIntegral((z) => derivativeC(f1, z).div(f1(z)), 0, R1, 1024).div(new Complex(0, 2 * Math.PI));
    const wind1 = windingNumber(mapPath(f1, circle(0, R1)), 0);
    const count1 = countInside(polyRoots(num1), R1) - countInside(polyRoots(den1), R1);
    if (Math.abs(int1.im) > 1e-6 || !nearInt(int1.re) || !nearInt(wind1)) throw new Error(`p1：积分 ${int1.toString(8)}、圈数 ${wind1} 不是整数`);
    if (Math.round(int1.re) !== count1 || Math.round(wind1) !== count1) throw new Error(`p1：积分 ${int1.re}、圈数 ${wind1}、N − P = ${count1} 对不上`);

    // ---- p2 ----
    const e = (t: number, k: number) => Complex.fromPolar(1, k * t);
    const curves: Path[] = [
      { z: (t) => e(t, 1).mul(cx(2).add(e(t, 1))), t0: 0, t1: 2 * Math.PI },
      { z: (t) => e(t, 2).mul(cx(2).add(e(t, 1))), t0: 0, t1: 2 * Math.PI },
      { z: (t) => e(t, -2), t0: 0, t1: 2 * Math.PI },
      { z: (t) => cx(2).add(e(t, 2)), t0: 0, t1: 2 * Math.PI },
    ];
    for (const [i, c] of curves.entries()) {
      let minAbs = Infinity;
      for (let k = 0; k <= 4000; k++) minAbs = Math.min(minAbs, c.z((2 * Math.PI * k) / 4000).abs());
      if (minAbs < 0.5) throw new Error(`p2：第 ${i + 1} 条曲线离原点太近`);
    }
    const winds2 = curves.map((c) => windingNumber(c, 0));
    if (!winds2.every(nearInt)) throw new Error(`p2：圈数不是整数 ${winds2}`);
    const p2 = winds2.map((w, i) => (Math.abs(w - 2) < 1e-6 ? i + 1 : 0)).filter((i) => i > 0);

    // ---- p3 ----
    const num3 = [1, 0, 1]; // z² + 1
    const den3 = [1, -0.5]; // z − ½
    const f3 = (z: Complex) => polyEval(num3, z).div(polyEval(den3, z));
    const R3 = 2;
    const int3 = circleIntegral((z) => z.mul(derivativeC(f3, z)).div(f3(z)), 0, R3, 1024).div(new Complex(0, 2 * Math.PI));
    const sumInside = (zs: Complex[]) => zs.filter((z) => z.abs() < R3).reduce((s, z) => s.add(z), cx(0));
    const byRoots3 = sumInside(polyRoots(num3)).sub(sumInside(polyRoots(den3)));
    if (!int3.isClose(byRoots3, 1e-9)) throw new Error(`p3：积分 ${int3.toString(8)} 和零点之和减极点之和 ${byRoots3.toString(8)} 对不上`);
    if (Math.abs(int3.im) > 1e-9) throw new Error('p3 应是实数');

    // ---- p4 ----
    const R4 = 10;
    const g4 = (z: Complex) => cexp(z).sub(1);
    const int4 = circleIntegral((z) => cexp(z).div(g4(z)), 0, R4, 4096).div(new Complex(0, 2 * Math.PI));
    const wind4 = windingNumber(mapPath(g4, circle(0, R4)), 0);
    const zeros4: Complex[] = [];
    for (let x = -10; x <= 10; x += 1) {
      for (let y = -10; y <= 10; y += 0.5) {
        const r = mullerRoot(g4, cx(x, y));
        if (!(g4(r).abs() < 1e-12) || !Number.isFinite(r.re)) continue;
        if (!zeros4.some((s) => s.sub(r).abs() < 1e-6)) zeros4.push(r);
      }
    }
    const inside4 = zeros4.filter((z) => z.abs() < R4);
    for (const z of zeros4) {
      const k = Math.round(z.im / (2 * Math.PI));
      if (z.sub(cx(0, 2 * Math.PI * k)).abs() > 1e-9) throw new Error(`p4：找到的零点 ${z.toString(8)} 不是 2πik`);
      if (Math.abs(z.abs() - R4) < 2) throw new Error(`p4：零点 ${z.toString(8)} 离圆周太近`);
    }
    // 格点覆盖了 |z| < 10 的整个圆盘，k = 0、±1 都得找到
    if (Math.abs(int4.im) > 1e-6 || !nearInt(int4.re) || !nearInt(wind4)) throw new Error(`p4：积分 ${int4.toString(8)}、圈数 ${wind4} 不是整数`);
    if (Math.round(int4.re) !== inside4.length || Math.round(wind4) !== inside4.length) throw new Error(`p4：积分 ${int4.re}、圈数 ${wind4}、零点个数 ${inside4.length} 对不上`);

    return {
      p1: { type: 'number', value: Math.round(int1.re) },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: int3.re },
      p4: { type: 'number', value: Math.round(int4.re) },
    };
  },
};

/** 多项式相乘，系数从最高次排起。 */
function polyMul(a: number[], b: number[]): number[] {
  const out = new Array<number>(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => (out[i + j] += x * y)));
  return out;
}

/** 曲线在 f 下的像。 */
function mapPath(f: (z: Complex) => Complex, p: Path): Path {
  return { z: (t) => f(p.z(t)), t0: p.t0, t1: p.t1 };
}

/** 圆 |z| < R 里的根的个数；重根的近似值各自算一个。根离圆周太近就报错。 */
function countInside(roots: Complex[], R: number): number {
  for (const z of roots) if (Math.abs(z.abs() - R) < 1e-3) throw new Error(`根 ${z.toString(8)} 离圆周太近`);
  return roots.filter((z) => z.abs() < R).length;
}

const nearInt = (x: number) => Math.abs(x - Math.round(x)) < 1e-6;

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
