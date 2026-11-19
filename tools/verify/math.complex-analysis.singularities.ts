// 独立验算 math.complex-analysis.singularities 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.singularities.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { ccos, cexp, circleIntegral, clog, Complex, cx, radiusByRatio, taylorCoefficients } from './math.complex-analysis._complex.ts';

const twoPiI = cx(0, 2 * Math.PI);

/** w 的整数次幂（k 可以是负数），反复乘除，不经过对数。 */
function ipow(w: Complex, k: number): Complex {
  let out = cx(1);
  for (let i = 0; i < Math.abs(k); i++) out = k > 0 ? out.mul(w) : out.div(w);
  return out;
}

/**
 * 洛朗系数 a_n = (1/2πi)∮_{|z−c|=r} f(z)(z − c)^{−n−1} dz：圆周上的梯形公式（circleIntegral，N 点和 N/2 点互相核对）。
 * 圆周要落在 f 全纯的圆环里；同一个圆环里换两个半径算出的值应一样，调用处自己核对。
 */
function laurent(f: (z: Complex) => Complex, c: number, n: number, r: number, N = 2048): Complex {
  return circleIntegral((z) => f(z).mul(ipow(z.sub(c), -n - 1)), c, r, N).div(twoPiI);
}

/** 两个半径上算洛朗系数 a_n，核对一致后返回。 */
function laurentChecked(f: (z: Complex) => Complex, n: number, r1: number, r2: number): Complex {
  const a = laurent(f, 0, n, r1);
  const b = laurent(f, 0, n, r2);
  if (!a.isClose(b, 1e-8)) throw new Error(`半径 ${r1}、${r2} 上算出的 a_${n} 不一致：两个圆周不在同一个圆环里`);
  return a;
}

/**
 * 以 0 为中心的泰勒系数的对数 ln|a_n|（n = 0…nMax）：圆周 |z| = r 上等分 N 点求离散傅里叶系数 S_n，ln|a_n| = ln|S_n| − n ln r。
 * 和 taylorCoefficients 一样，只是不除以 rⁿ（n 到 500 时 rⁿ 会溢出）；低阶系数（n ≤ 5）用半径 r/2 核对，
 * 闭圆盘 |z| ≤ r 里有 f 不全纯（补值以后仍不全纯）的点就对不上、报错。
 */
function logTaylorAbs(f: (z: Complex) => Complex, r: number, nMax: number, N = 4096): number[] {
  if (N <= 2 * nMax) throw new Error('N 取小了');
  const dft = (rad: number, upTo: number) => {
    const vals = Array.from({ length: N }, (_, k) => f(Complex.fromPolar(rad, (2 * Math.PI * k) / N)));
    const out: Complex[] = [];
    for (let n = 0; n <= upTo; n++) {
      let s = cx(0);
      for (let k = 0; k < N; k++) s = s.add(vals[k].mul(Complex.fromPolar(1, (-2 * Math.PI * ((n * k) % N)) / N)));
      out.push(s.scale(1 / N));
    }
    return { out, M: Math.max(...vals.map((v) => v.abs())) };
  };
  const big = dft(r, nMax);
  const small = dft(r / 2, 5);
  for (let n = 0; n <= 5; n++) {
    const a = big.out[n].scale(r ** -n);
    const b = small.out[n].scale((r / 2) ** -n);
    if (a.sub(b).abs() > 1e-9 * (a.abs() + big.M / r ** n)) throw new Error(`半径 ${r} 和 ${r / 2} 算出的 a_${n} 不一致：圆盘里有 f 不全纯的点`);
  }
  return big.out.map((s, n) => Math.log(s.abs()) - n * Math.log(r));
}

/** 以 0 为中心的小圆 |z| = r 上 |f| 的最大值（等分 720 点，不碰 0）。 */
function maxOnSmallCircle(f: (z: Complex) => Complex, r: number): number {
  let m = 0;
  for (let k = 0; k < 720; k++) m = Math.max(m, f(Complex.fromPolar(r, (2 * Math.PI * k) / 720 + 0.01)).abs());
  return m;
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.singularities',
  notes: {
    p1:
      '在 |z| = 1、0.3 两个圆周上按定义积出 (1 − e^z)/z⁴ 的洛朗系数 a_{−12}…a_{−1}，系数不为 0 的最负下标是 −m，m 就是极点的阶；' +
      '再沿 8 个方向看 ln|f| 对 ln|z| 的斜率（|z| 从 10⁻² 到 10⁻³），核对是 −m，不展开 e^z。',
    p2:
      '每个选项在去心圆盘里的两个圆周上积出负次幂系数 a_{−1}…a_{−20}（A、B 取 |z| = 1、0.5；C 取 0.5、0.25，避开 Log(1 + z) 在 −1 处的支割线；D 取 1、0.5，' +
      '避开 2π），全为 0 才算可去；另看小圆 |z| = 10⁻²、10⁻⁴ 上 |f| 的最大值是否有界（黎曼定理的条件：半径缩小 100 倍，最大值不到原来的 2 倍且小于 1000），两种判法要一致。',
    p3:
      '在 |z| = 6 的圆周上等分 4096 点求 f 的泰勒系数的对数 ln|a_n|（n ≤ 520，用 6 和 3 两个半径核对低阶系数，圆盘里有不可去的奇点就报错），' +
      '先在 |z| = 3 上核对奇次项为 0（f 是偶函数），偶次项按步长 2 求系数比、在 n = 16…512 上外推出收敛半径；只看系数，不找 1 − cos z 的零点。' +
      '再核对：算出的半径处的实轴点附近 |f| 无界。',
    p4: '在 |z| = 1、3 两个圆周上（都在 2πi 以内）按定义积出 1/(z(e^z − 1)) 的 a_{−2}、a_{−1}，并核对 a_{−3}…a_{−10} 为 0（主部只有这两项）。',
  },
  compute() {
    // p1
    const f1 = (z: Complex) => cx(1).sub(cexp(z)).div(ipow(z, 4));
    let order1 = 0;
    for (let n = -12; n <= -1; n++) {
      const a = laurentChecked(f1, n, 1, 0.3);
      if (a.abs() > 1e-10) {
        order1 = -n;
        break;
      }
    }
    const slopes: number[] = [];
    for (let k = 0; k < 8; k++) {
      const th = (2 * Math.PI * k) / 8 + 0.3;
      const z1 = Complex.fromPolar(1e-2, th);
      const z2 = Complex.fromPolar(1e-3, th);
      slopes.push((Math.log(f1(z2).abs()) - Math.log(f1(z1).abs())) / (Math.log(1e-3) - Math.log(1e-2)));
    }
    if (!slopes.every((s) => Math.abs(s + order1) < 0.01)) throw new Error(`p1：增长的斜率 ${slopes.map((s) => s.toFixed(4)).join(', ')} 和 −${order1} 对不上`);

    // p2
    const options: { f: (z: Complex) => Complex; r: [number, number] }[] = [
      { f: (z) => z.mul(sinC(cx(1).div(z))), r: [1, 0.5] },
      { f: (z) => cexp(z).sub(cexp(z.neg())).div(z), r: [1, 0.5] },
      { f: (z) => clog(cx(1).add(z)).div(z), r: [0.5, 0.25] },
      { f: (z) => z.div(cx(1).sub(ccos(z))), r: [1, 0.5] },
    ];
    const p2: number[] = [];
    options.forEach(({ f, r }, i) => {
      let removableByLaurent = true;
      for (let n = -20; n <= -1; n++) {
        if (laurentChecked(f, n, r[0], r[1]).abs() > 1e-10) removableByLaurent = false;
      }
      const m2 = maxOnSmallCircle(f, 1e-2);
      const m4 = maxOnSmallCircle(f, 1e-4);
      const bounded = Number.isFinite(m4) && m4 < 2 * m2 && m4 < 1e3;
      if (bounded !== removableByLaurent) throw new Error(`p2 选项 ${i + 1}：洛朗系数和有界性两种判法不一致`);
      if (removableByLaurent) p2.push(i + 1);
    });

    // p3
    const f3 = (z: Complex) => cx(1).div(cx(1).sub(ccos(z))).sub(cx(2).div(z.mul(z)));
    const a3 = taylorCoefficients(f3, 0, 41, 3, 1024);
    for (let n = 1; n <= 41; n += 2) if (a3[n].abs() > 1e-12) throw new Error('p3：奇次项应为 0（f 是偶函数）');
    const L3 = logTaylorAbs(f3, 6, 520);
    const rad = radiusByRatio((n) => L3[n], 2, 16, 6);
    if (!rad.converged) throw new Error('p3：系数比没有收敛');
    const near = f3(cx(rad.value - 1e-4)).abs();
    if (!(near > 1e6)) throw new Error('p3：算出的半径处 |f| 没有变大');

    // p4
    const f4 = (z: Complex) => cx(1).div(z.mul(cexp(z).sub(1)));
    for (let n = -10; n <= -3; n++) if (laurentChecked(f4, n, 1, 3).abs() > 1e-10) throw new Error(`p4：a_${n} 不为 0`);
    const am2 = laurentChecked(f4, -2, 1, 3);
    const am1 = laurentChecked(f4, -1, 1, 3);
    if (Math.abs(am2.im) > 1e-12 || Math.abs(am1.im) > 1e-12) throw new Error('p4：系数应是实数');

    return {
      p1: { type: 'number', value: order1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: rad.value },
      p4: { type: 'tuple', value: [am2.re, am1.re] },
    };
  },
};

/** sin w = (e^{iw} − e^{−iw})/(2i)，A 项要在 1/z 处取值；不用 _complex.ts 的 csin，换一条路算。 */
function sinC(w: Complex): Complex {
  const iw = w.mul(cx(0, 1));
  return cexp(iw).sub(cexp(iw.neg())).div(cx(0, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
