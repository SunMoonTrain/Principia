// 独立验算 math.complex-analysis.liouville 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.liouville.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { ccos, cexp, circle, Complex, csin, cx, derivativeC, I, maxModulusOnPath, pathLength, polyRoots } from './math.complex-analysis._complex.ts';

export const verification: Verification = {
  lesson: 'math.complex-analysis.liouville',
  notes: {
    p1: '极值题分两半：界由导数的积分表示加 ML 估计数值算出（圆周长用折线外推）；再拿 f = (5/4)z²（圆周 |z| = 2 上 |f| 的最大值数值求得 5）算 f″(0)（小圆柯西积分），看界取得到。',
    p2: '四个函数在半径 2、3、5 的圆周上求 |f| 的最大值（maxModulusOnPath），三个半径上都不超过 1 + 10⁻⁹ 的算有界；sin z、e^{iz}、e^{−z²} 在 |z| = 5 上的最大值分别约是 74、148、7×10¹⁰。半径不取更大，是因为 cos² z + sin² z 在 |z| = 10 处相减会丢掉 10⁻⁸ 量级的精度。',
    p3: '同时迭代求出三个根（polyRoots），把模的平方加起来，不先因式分解。',
    p4: '由条件定出 f = az²：f(1) = 1 给 a = 1，核对 |z²| ≤ 2|z|² 在模从 10⁻⁶ 到 6×10³ 的 200 个点上成立；再看 z² + εz^k（k = 0、1、3、4，ε = 10⁻³）都在某个点违反 |f| ≤ 2|z|²（k < 2 在原点附近，k > 2 在远处），所以别的低次项加不进来；最后算 f(2i)。',
  },
  compute() {
    const M = 5;
    const r = 2;
    const L = pathLength(circle(0, r)).value;
    const bound = (2 / (2 * Math.PI)) * (M / r ** 3) * L;
    const ex = (z: Complex) => z.mul(z).scale(5 / 4);
    const exMax = maxModulusOnPath(ex, circle(0, r)).value;
    const exD2 = derivativeC(ex, 0, 2).re;
    if (Math.abs(exMax - M) > 1e-9 || Math.abs(exD2 - bound) > 1e-9) throw new Error('p1：界取不到');

    const fs: ((z: Complex) => Complex)[] = [(z) => ccos(z).mul(ccos(z)).add(csin(z).mul(csin(z))), csin, (z) => cexp(z.mul(I)), (z) => cexp(z.mul(z).neg())];
    // 半径不取太大：cos z、sin z 在 |z| = 10 处已上万，cos² + sin² 相减会丢掉 10⁻⁸ 量级的精度
    const p2 = fs.map((f, i) => ([2, 3, 5].every((R) => maxModulusOnPath(f, circle(0, R), 4000).value <= 1 + 1e-9) ? i + 1 : 0)).filter((i) => i > 0);

    const p3 = polyRoots([1, -3, 4, -2]).reduce((s, z) => s + z.abs() ** 2, 0);

    const a = 1; // f(1) = a·1² = 1
    const f4 = (z: Complex) => z.mul(z).scale(a);
    const pts = Array.from({ length: 200 }, (_, k) => Complex.fromPolar(1e-6 * 1.12 ** k, 0.7 * k)); // 模从 10⁻⁶ 到约 6×10³
    if (!pts.every((z) => f4(z).abs() <= 2 * z.abs() ** 2 + 1e-15)) throw new Error('p4：z² 不满足条件');
    for (const k of [0, 1, 3, 4]) {
      const g = (z: Complex) => f4(z).add(powC(z, k).scale(1e-3));
      if (pts.every((z) => g(z).abs() <= 2 * z.abs() ** 2)) throw new Error(`p4：加上 z^${k} 也满足条件`);
    }
    const p4 = f4(cx(0, 2));
    if (Math.abs(p4.im) > 1e-14) throw new Error('p4 应是实数');
    return {
      p1: { type: 'number', value: bound },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4.re },
    };
  },
};

function powC(z: Complex, n: number): Complex {
  let s = cx(1);
  for (let k = 0; k < n; k++) s = s.mul(z);
  return s;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
