// 独立验算 math.ode.what-is-ode 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.what-is-ode.ts

import { fileURLToPath } from 'node:url';
import { rootsOf, runVerification, type Verification } from './lib.ts';
import { blowUpTime, rk4 } from './math.ode._numeric.ts';

/** 五点差分求一阶、二阶导数，误差是步长的四次方量级。 */
function d1(y: (x: number) => number, x: number, h = 1e-2): number {
  return (-y(x + 2 * h) + 8 * y(x + h) - 8 * y(x - h) + y(x - 2 * h)) / (12 * h);
}
function d2(y: (x: number) => number, x: number, h = 1e-2): number {
  return (-y(x + 2 * h) + 16 * y(x + h) - 30 * y(x) + 16 * y(x - h) - y(x - 2 * h)) / (12 * h * h);
}

/** 3 元线性方程组，高斯消元（列主元）。 */
function solve3(A: number[][], b: number[]): number[] {
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < 3; c++) {
    let p = c;
    for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < 3; r++) {
      if (r === c) continue;
      const k = M[r][c] / M[c][c];
      for (let j = c; j < 4; j++) M[r][j] -= k * M[c][j];
    }
  }
  return M.map((row, i) => row[3] / row[i]);
}

export const verification: Verification = {
  lesson: 'math.ode.what-is-ode',
  notes: {
    p1:
      '把 y = x^r 代进 x²y″ − 2xy′ + 2y，导数用五点差分算（不用求导公式），在 x = 1.7 处把残差除以 x^r，' +
      '对 r ∈ [−10, 10] 找零点；再核对找到的 r 在 x = 0.6、2.3 处残差也是 0。',
    p2:
      '把每个选项写成「未知函数的自变量个数」和关于各阶导数的式子 F；把某一阶导数换成别的值看 F 变不变，' +
      '变的最高一阶就是方程的阶。自变量只有一个、阶数是 2 的才选。',
    p3:
      '四阶龙格-库塔法从 (0, 1/2) 往右积 y′ = y²，步长随 y 变小，直到 y 超过 10⁹，那时的 x 就是右端点；' +
      '另往左积到 x = −1000，确认解一直有限，区间左边没有端点。',
    p4: '残差 y′ − (y − x²) 对 a、b、c 是线性的：在 x = 0、1、2 处令残差为 0（导数用差分算），解 3 元线性方程组；再核对 x = −1.3、3.7 处残差也是 0。',
  },
  compute() {
    // p1
    const residual = (r: number, x: number): number => {
      const y = (t: number): number => t ** r;
      return (x * x * d2(y, x) - 2 * x * d1(y, x) + 2 * y(x)) / y(x);
    };
    // 格点故意错开整数：差分有 10⁻¹² 量级的舍入误差，格点正好落在零点上时会看不出变号
    const p1 = rootsOf((r) => residual(r, 1.7), -10.0123, 9.9871, 4000);
    for (const r of p1) for (const x of [0.6, 2.3]) if (Math.abs(residual(r, x)) > 1e-6) throw new Error(`p1：r = ${r} 在 x = ${x} 处残差不为 0`);

    // p2：d[k] 是 k 阶导数（偏微分方程的选项列出了它用到的偏导数）
    const options: { variables: number; F: (d: number[]) => number }[] = [
      { variables: 1, F: (d) => d[2] - d[1] ** 3 - 0.7 }, // A：y″ = (y′)³ + x，取 x = 0.7
      { variables: 1, F: (d) => d[1] ** 2 + d[0] ** 2 - 1 }, // B：(y′)² + y² = 1
      { variables: 2, F: (d) => d[2] + d[3] }, // C：u_xx + u_yy = 0，这里 d[2]、d[3] 是两个二阶偏导数
      { variables: 1, F: (d) => 0.7 * d[2] + d[1] - d[0] - Math.exp(0.7) }, // D：xy″ + y′ − y = eˣ
    ];
    const order = (F: (d: number[]) => number): number => {
      const base = [0.3, -0.8, 1.1, 0.4, -0.6, 0.9];
      let highest = 0;
      for (let k = 1; k < base.length; k++) {
        const changed = [...base];
        changed[k] += 0.37;
        if (Math.abs(F(changed) - F(base)) > 1e-12) highest = k;
      }
      return highest;
    };
    const p2: number[] = [];
    options.forEach((o, i) => {
      if (o.variables === 1 && order(o.F) === 2) p2.push(i + 1);
    });

    // p3
    const p3 = blowUpTime((_, y) => y * y, 0, 0.5);
    const left = rk4((_, y) => y * y, 0, 0.5, -1000, 200_000);
    if (!(Number.isFinite(left) && left > 0)) throw new Error('p3：往左积分时解跑到了无穷');

    // p4
    const res = (a: number, b: number, c: number, x: number): number => {
      const y = (t: number): number => a * t * t + b * t + c;
      return d1(y, x) - (y(x) - x * x);
    };
    const xs = [0, 1, 2];
    const A = xs.map((x) => [res(1, 0, 0, x) - res(0, 0, 0, x), res(0, 1, 0, x) - res(0, 0, 0, x), res(0, 0, 1, x) - res(0, 0, 0, x)]);
    const p4 = solve3(
      A,
      xs.map((x) => -res(0, 0, 0, x)),
    );
    for (const x of [-1.3, 3.7]) if (Math.abs(res(p4[0], p4[1], p4[2], x)) > 1e-8) throw new Error('p4：抛物线不是解');

    return {
      p1: { type: 'set', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'tuple', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
