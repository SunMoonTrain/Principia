// 独立验算 math.complex-analysis.real-integrals 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 每道数值题走两条互不依赖的路：（甲）直接对实变量的被积函数做数值积分（双指数求积，无穷区间先用 x = tan t 换到有限区间）；
// （乙）照留数定理：手算出分母的多项式、用 polyRoots 求根并挑出围道里面的，每个奇点的留数用以它为圆心的小圆周上的
// 复积分除以 2πi 求（小圆不碰别的奇点；被积函数按代换直接复合出来，不用手化简的式子），再乘 2πi 相加。两条路要对上。
// 单独运行：npx tsx tools/verify/math.complex-analysis.real-integrals.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { circleIntegral, Complex, cx, I, integrate, polyEval, polyRoots } from './math.complex-analysis._complex.ts';

const twoPiI = cx(0, 2 * Math.PI);

/** 小圆周上的复积分除以 2πi，即孤立奇点 a 处的留数；r 取得比 a 到别的奇点的距离小。 */
function residueByCircle(f: (z: Complex) => Complex, a: Complex, r: number): Complex {
  return circleIntegral(f, a, r, 2048).div(twoPiI);
}

/** 一组点两两之间的最小距离（取小圆半径用）。 */
function minGap(zs: Complex[]): number {
  let m = Number.POSITIVE_INFINITY;
  for (let i = 0; i < zs.length; i++) for (let j = i + 1; j < zs.length; j++) m = Math.min(m, zs[i].sub(zs[j]).abs());
  return m;
}

/** 把很接近的根并成一个（重根 polyRoots 只精确到 1e-8 左右）。 */
function distinct(zs: Complex[], tol = 1e-6): Complex[] {
  const out: Complex[] = [];
  for (const z of zs) if (!out.some((w) => w.sub(z).abs() < tol)) out.push(z);
  return out;
}

/**
 * 周期积分 ∫_0^{2π} R(sin θ, cos θ) dθ 的留数算法：F(z) = R((z − 1/z)/(2i), (z + 1/z)/2)/(iz)，
 * 单位圆里的奇点由 candidates 给出（手算出的分母多项式的根，再加上 0），逐个用小圆求留数；
 * 不是奇点的候选点小圆积分为 0，不影响结果；漏了奇点则和数值积分对不上。
 */
function periodByResidues(R: (s: Complex, c: Complex) => Complex, candidates: Complex[]): Complex {
  const F = (z: Complex) => R(z.sub(cx(1).div(z)).div(cx(0, 2)), z.add(cx(1).div(z)).scale(0.5)).div(I.mul(z));
  const inside = distinct(candidates.filter((z) => z.abs() < 1 - 1e-9));
  const r = Math.min(0.5 * minGap(distinct(candidates)), 0.5 * Math.min(...inside.map((z) => 1 - z.abs())), 0.1);
  let s = cx(0);
  for (const a of inside) s = s.add(residueByCircle(F, a, r));
  return s.mul(twoPiI);
}

/** 实轴上的积分 ∫_{−∞}^{+∞} f(x) dx：x = tan t，∫_{−π/2}^{π/2} f(tan t) sec² t dt。 */
function wholeLine(f: (x: number) => number): number {
  return integrate((t) => f(Math.tan(t)) / Math.cos(t) ** 2, -Math.PI / 2, Math.PI / 2);
}

/** 有理函数 P/Q（系数从最高次排起，实系数）的留数算法：Q 在上半平面的根逐个用小圆求留数，乘 2πi 相加。 */
function upperByResidues(P: number[], Q: number[]): Complex {
  const roots = distinct(polyRoots(Q));
  const upper = roots.filter((z) => z.im > 1e-9);
  const r = Math.min(0.4 * minGap(roots), 0.4 * Math.min(...upper.map((z) => z.im)));
  const f = (z: Complex) => polyEval(P, z).div(polyEval(Q, z));
  let s = cx(0);
  for (const a of upper) s = s.add(residueByCircle(f, a, r));
  return s.mul(twoPiI);
}

function close(a: number, b: number, tol = 1e-9): boolean {
  return Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.real-integrals',
  notes: {
    p1: '（甲）在 [0, 2π] 上直接数值积分 1/(3 + sin θ)；（乙）乘 2iz 后分母是 z² + 6iz − 1，求根（i(−3 ± 2√2)），单位圆里的一个用小圆求留数，乘 2πi。两条路对上，结果是 π/√2。',
    p2: '逐项查定理的两个条件：分母比分子至少高 2 次（看系数数组的长度），分母没有实根（polyRoots 的根虚部都不为 0）。只 A、D 满足；A、D 再用留数和 x = tan t 数值积分核对相等。B 只高一次：∫_0^b x³/(x⁴+1) dx 在 b = 10²、10⁴ 处随 ln b 增长（发散）；C 在 ±2 有实根：∫_{2+ε}^3 dx/(x² − 4) 在 ε = 10⁻³、10⁻⁶ 处随 ln(1/ε) 增长（发散）。',
    p3: '（甲）x = tan t 换到 (−π/2, π/2) 上数值积分；（乙）分母展开成 z⁴ + 5z² + 4，上半平面的根 i、2i 用小圆求留数，乘 2πi。两条路对上，结果是 π/3。',
    p4: '（甲）在 [0, 2π] 上直接数值积分 cos 2θ/(5 − 4 cos θ)；（乙）F 按 cos 2θ = 2cos²θ − 1 复合出来（化简后分子是 (z² + z⁻²)/2），5 − 4 cos θ 乘 z 后是 −(2z² − 5z + 2)，候选奇点是 2z² − 5z + 2 的根和 0（z⁻² 与 1/(iz) 带来的），单位圆里的 0、1/2 用小圆求留数，乘 2πi。两条路对上，结果是 π/6。',
  },
  compute() {
    // p1
    const p1Num = integrate((t) => 1 / (3 + Math.sin(t)), 0, 2 * Math.PI);
    const p1Res = periodByResidues(
      (s) => cx(1).div(s.add(3)),
      [...polyRoots([cx(1), cx(0, 6), cx(-1)]), cx(0)],
    );
    if (!close(p1Num, p1Res.re, 1e-9) || Math.abs(p1Res.im) > 1e-9) throw new Error(`p1 两条路不一致：${p1Num} 与 ${p1Res.toString()}`);
    if (!close(p1Num, Math.PI / Math.SQRT2, 1e-12)) throw new Error('p1 和 π/√2 对不上');

    // p2：P、Q 的系数从最高次排起
    const opts: { P: number[]; Q: number[] }[] = [
      { P: [1], Q: [1, 0, 0, 0, 1] },
      { P: [1, 0, 0, 0], Q: [1, 0, 0, 0, 1] },
      { P: [1], Q: [1, 0, -4] },
      { P: [1, 0, 0], Q: [1, 0, 1, 0, 1] },
    ];
    const meets = opts.map(({ P, Q }) => {
      const degGap = Q.length - P.length;
      const realRoot = polyRoots(Q).some((z) => Math.abs(z.im) < 1e-7);
      return degGap >= 2 && !realRoot;
    });
    const p2 = meets.map((ok, i) => (ok ? i + 1 : 0)).filter((i) => i > 0);
    for (const i of p2) {
      const { P, Q } = opts[i - 1];
      const num = wholeLine((x) => polyEval(P, cx(x)).re / polyEval(Q, cx(x)).re);
      const res = upperByResidues(P, Q);
      if (!close(num, res.re, 1e-8) || Math.abs(res.im) > 1e-9) throw new Error(`p2 选项 ${i}：留数 ${res.toString()} 和数值积分 ${num} 对不上`);
    }
    // 不满足条件的两项确实发散（不是「定理没说、其实也能这样算」）
    const growB = [1e2, 1e4].map((b) => integrate((x) => x ** 3 / (x ** 4 + 1), 0, b));
    if (!(growB[1] - growB[0] > 0.9 * Math.log(100))) throw new Error('B 的部分积分没有像 ln b 那样增长');
    const growC = [1e-3, 1e-6].map((e) => integrate((x) => 1 / (x * x - 4), 2 + e, 3));
    if (!(growC[1] - growC[0] > 0.2 * Math.log(1000))) throw new Error('C 在 2 附近的积分没有像 ln(1/ε) 那样增长');

    // p3
    const p3f = (x: number) => (x * x) / ((x * x + 1) * (x * x + 4));
    const p3Num = wholeLine(p3f);
    const p3Res = upperByResidues([1, 0, 0], [1, 0, 5, 0, 4]);
    if (!close(p3Num, p3Res.re, 1e-9) || Math.abs(p3Res.im) > 1e-9) throw new Error(`p3 两条路不一致：${p3Num} 与 ${p3Res.toString()}`);
    if (!close(p3Num, Math.PI / 3, 1e-12)) throw new Error('p3 和 π/3 对不上');

    // p4
    const p4Num = integrate((t) => Math.cos(2 * t) / (5 - 4 * Math.cos(t)), 0, 2 * Math.PI);
    const p4Res = periodByResidues(
      (_s, c) => {
        const cos2 = c.mul(c).scale(2).sub(1); // cos 2θ = 2cos²θ − 1，按复合直接算
        return cos2.div(cx(5).sub(c.scale(4)));
      },
      [...polyRoots([2, -5, 2]), cx(0)],
    );
    if (!close(p4Num, p4Res.re, 1e-9) || Math.abs(p4Res.im) > 1e-9) throw new Error(`p4 两条路不一致：${p4Num} 与 ${p4Res.toString()}`);
    if (!close(p4Num, Math.PI / 6, 1e-12)) throw new Error('p4 和 π/6 对不上');

    return {
      p1: { type: 'number', value: p1Num },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3Num },
      p4: { type: 'number', value: p4Num },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
