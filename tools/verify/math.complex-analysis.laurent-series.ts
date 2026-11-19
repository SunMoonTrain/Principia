// 独立验算 math.complex-analysis.laurent-series 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.laurent-series.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cexp, circle, circleIntegral, Complex, contourIntegral, cx, partialSumsC, radiusByRatio } from './math.complex-analysis._complex.ts';

const twoPiI = cx(0, 2 * Math.PI);

/** z^n，n 可以是负整数。 */
function cpowInt(z: Complex, n: number): Complex {
  let base = n >= 0 ? z : cx(1).div(z);
  let k = Math.abs(n);
  let out = cx(1);
  while (k > 0) {
    if (k & 1) out = out.mul(base);
    base = base.mul(base);
    k >>= 1;
  }
  return out;
}

/** (1/2πi)∮_{|ζ−c|=ρ} g(ζ) dζ：折线和外推（contourIntegral）与圆周梯形公式（circleIntegral）两条路互相核对。 */
function onCircle(g: (z: Complex) => Complex, c: number, rho: number): Complex {
  const a = contourIntegral(g, circle(c, rho)).value;
  const b = circleIntegral(g, c, rho);
  if (!a.isClose(b, 1e-8)) throw new Error(`|z − ${c}| = ${rho} 上两种算法的复积分不一致`);
  return a.div(twoPiI);
}

/**
 * 圆环里第 n 项系数：(1/2πi)∮_{C_ρ} f(ζ)(ζ − c)^{−n−1} dζ，在圆环里取两三个不同的 ρ 各算一次，
 * 结果要和 ρ 无关（不一致说明 ρ 取到了圆环外面）。
 */
function laurentCoeff(f: (z: Complex) => Complex, c: number, rhos: number[], n: number): Complex {
  const vals = rhos.map((rho) => onCircle((z) => f(z).mul(cpowInt(z.sub(c), -n - 1)), c, rho));
  for (const v of vals) if (!v.isClose(vals[0], 1e-8)) throw new Error(`a_${n} 和所取的圆周有关：圆周不全在圆环里`);
  return vals[0];
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.laurent-series',
  notes: {
    p1:
      '正幂部分的系数 2^{−n}、负幂部分（看成 w = 1/z 的幂级数）的系数 2^{−n} 各用系数比外推求收敛半径（radiusByRatio），' +
      'R 是前者，r 是后者的倒数；再核对 |z| = 0.55、0.7、1、1.9 的点上正负两半的部分和都收敛，|z| = 0.45、2.1 和两条边界圆周 |z| = 0.5、2 上的点通项不趋于 0' +
      '（边界上通项的模恒为 1），算出的 r < |z| < R 和这两组点对得上。',
    p2:
      '在 |z| = 4、6 两个圆周上用积分求 1/(z + 3) 的系数 a_n（n = −8…8），和四个选项展开后的系数逐项比；' +
      '另在 |z| > 3 的 6 个点（含 |z| = 3.2）上求各选项的部分和，看哪个收敛到 1/(z + 3)。',
    p3: '在 |z| = 1.2、1.5、1.8 三个圆周上用积分求 1/((z − 1)(z + 2)) 的系数 a_{−2}、a_1（三个圆周结果一致才算），不先拆部分分式。',
    p4: '按定义求 ∮_{|z|=1} z³e^{1/z} dz（折线和外推，圆周梯形公式核对），再除以 2πi，不展开 e^{1/z}。',
  },
  compute() {
    // p1：正幂部分 ∑_{n≥0} z^n/2^n，负幂部分 ∑_{n≥1} z^{−n}/2^n = ∑ w^n/2^n（w = 1/z）。
    const Rpos = radiusByRatio((n) => -n * Math.LN2);
    const Rneg = radiusByRatio((n) => -n * Math.LN2);
    if (!Rpos.converged || !Rneg.converged) throw new Error('p1：系数比没有收敛');
    const R = Rpos.value;
    const r = 1 / Rneg.value;
    // 核对：圆环里面的点部分和收敛到同一个值，外面和边界上通项不趋于 0。
    // z^n/2^{|n|} 写成 (z/2)^n 或 (1/(2z))^{|n|}，免得 z^n 和 2^{−|n|} 分开算时溢出成 ∞·0。
    const term = (z: Complex, n: number) => (n >= 0 ? cpowInt(z.scale(0.5), n) : cpowInt(cx(1).div(z.scale(2)), -n));
    const converges = (z: Complex) => {
      const Ns = [1000, 2000, 4000];
      const pos = partialSumsC((n) => term(z, n), Ns, 0);
      const neg = partialSumsC((n) => term(z, -n), Ns, 1);
      const tail = Math.max(term(z, 4000).abs(), term(z, -4000).abs());
      if (!(Number.isFinite(tail)) || tail > 1e-6) return false;
      return pos[2].isClose(pos[1], 1e-10) && neg[2].isClose(neg[1], 1e-10);
    };
    const inside = [cx(0.55), cx(0, 1), Complex.fromPolar(1.9, 2.3), Complex.fromPolar(0.7, -1)];
    const outside = [cx(0.45), Complex.fromPolar(2.1, 0.4), Complex.fromPolar(0.5, 1.1), Complex.fromPolar(2, -2.5)];
    if (!inside.every(converges)) throw new Error('p1：圆环里有点不收敛');
    if (outside.some(converges)) throw new Error('p1：圆环外或边界上有点收敛');
    const inAnnulus = (z: Complex) => z.abs() > r + 1e-9 && z.abs() < R - 1e-9;
    if (!inside.every(inAnnulus) || outside.some(inAnnulus)) throw new Error('p1：算出的 r、R 和部分和的核对对不上');

    // p2
    const f2 = (z: Complex) => cx(1).div(z.add(3));
    const ns = Array.from({ length: 17 }, (_, i) => i - 8);
    const coeff2 = new Map(ns.map((n) => [n, laurentCoeff(f2, 0, [4, 6], n)]));
    // 各选项的 z^n 系数（n 从 −∞ 到 ∞），以及部分和。
    const opts: ((n: number) => number)[] = [
      (n) => (n >= 0 ? (-1) ** n / 3 ** (n + 1) : 0),
      (n) => (n <= -1 ? 3 ** (-n - 1) : 0),
      (n) => (n <= -1 ? (-3) ** (-n - 1) : 0),
      (n) => (n <= -1 ? (-3) ** -n : 0),
    ];
    const byCoeff = opts.map((o, i) => (ns.every((n) => coeff2.get(n)!.isClose(o(n), 1e-8)) ? i + 1 : 0)).filter((i) => i > 0);
    const testPts = [cx(4), cx(0, -5), cx(3.5, 2), cx(-7), Complex.fromPolar(10, 1), Complex.fromPolar(3.2, 2.9)];
    // 部分和用各选项第 k 项（k = 0, 1, 2, …）的乘积形式，免得 3^n、z^{−n} 分开算时溢出。
    const optTerms: ((z: Complex, k: number) => Complex)[] = [
      (z, k) => cpowInt(z.scale(-1 / 3), k).scale(1 / 3),
      (z, k) => cpowInt(cx(3).div(z), k).div(z),
      (z, k) => cpowInt(cx(-3).div(z), k).div(z),
      (z, k) => cpowInt(cx(-3).div(z), k + 1),
    ];
    const byValue = optTerms
      .map((t, i) =>
        testPts.every((z) => {
          const [s1, s2] = partialSumsC((k) => t(z, k), [400, 800]);
          return Number.isFinite(s2.abs()) && s2.isClose(s1, 1e-9) && s2.isClose(f2(z), 1e-9);
        })
          ? i + 1
          : 0,
      )
      .filter((i) => i > 0);
    if (byCoeff.join() !== byValue.join()) throw new Error('p2：系数比较和部分和比较的结论不一致');

    // p3
    const f3 = (z: Complex) => cx(1).div(z.sub(1).mul(z.add(2)));
    const a3m2 = laurentCoeff(f3, 0, [1.2, 1.5, 1.8], -2);
    const a31 = laurentCoeff(f3, 0, [1.2, 1.5, 1.8], 1);

    // p4
    const p4 = onCircle((z) => cpowInt(z, 3).mul(cexp(cx(1).div(z))), 0, 1);

    for (const v of [a3m2, a31, p4]) if (Math.abs(v.im) > 1e-10) throw new Error('p3、p4 的结果应是实数');
    return {
      p1: { type: 'tuple', value: [r, R] },
      p2: { type: 'choice', value: byCoeff },
      p3: { type: 'tuple', value: [a3m2.re, a31.re] },
      p4: { type: 'number', value: p4.re },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
