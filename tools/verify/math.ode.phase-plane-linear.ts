// 独立验算 math.ode.phase-plane-linear 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.ode.phase-plane-linear.ts
// 不用迹-行列式的分类定理：p1 按特征值的定义归类，p2 数值积分量周期，p4 往回积分找趋于原点的方向。

import { fileURLToPath } from 'node:url';
import { infOfPredicate, runVerification, type Verification } from './lib.ts';
import { eig2, rk4Vec } from './math.ode._numeric.ts';

export const verification: Verification = {
  lesson: 'math.ode.phase-plane-linear',
  notes: {
    p1: '由 det(A − λI) = 0 求两个特征值，按定义归类：同号实数是结点，异号实数是鞍点，实部不为零的复数是焦点，纯虚数是中心。选项依次是结点、鞍点、焦点、中心。',
    p2: '从 (1, 0) 出发用四阶龙格-库塔法（步长 1e-5）积分，记下第二分量的变号时刻（线性插值），出发后第二次变号的时刻就是转一圈的时间；再核对第四次变号正好是它的两倍。',
    p3: '对 c 求「两个特征值都是实数」的下确界（在 [0, 20] 上细扫再二分）。',
    p4: '把方程组反过来积分（x′ = −Ax），从原点附近的 (0.01, 0.003) 积 10 个单位：往回走时趋于原点的那个方向被放大，最后的点所在直线的斜率就是答案；换一个起点 (−0.02, 0.005) 核对。',
  },
  compute() {
    // p1
    const ev = eig2([
      [2, 3],
      [1, -1],
    ]);
    let kind: number;
    if (ev[0].im === 0) kind = ev[0].re * ev[1].re > 0 ? 1 : 2;
    else kind = Math.abs(ev[0].re) > 1e-12 ? 3 : 4;

    // p2
    const crossings: number[] = [];
    {
      const F = ([x, y]: number[]): number[] => [2 * y, -8 * x];
      const h = 1e-5;
      let Y = [1, 0];
      let t = 0;
      while (crossings.length < 4 && t < 10) {
        const Y0 = Y;
        const k1 = F(Y0);
        const k2 = F(Y0.map((v, j) => v + (h / 2) * k1[j]));
        const k3 = F(Y0.map((v, j) => v + (h / 2) * k2[j]));
        const k4 = F(Y0.map((v, j) => v + h * k3[j]));
        Y = Y0.map((v, j) => v + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
        if (t > 0 && Y0[1] * Y[1] < 0) crossings.push(t + (h * Y0[1]) / (Y0[1] - Y[1]));
        t += h;
      }
    }
    const p2 = crossings[1];
    if (Math.abs(crossings[3] - 2 * p2) > 1e-6) throw new Error('p2：不是周期运动');

    // p3
    const p3 = infOfPredicate(
      (c) =>
        eig2([
          [0, 1],
          [-4, -c],
        ]).every((e) => e.im === 0),
      0,
      20,
      200_000,
    );

    // p4
    const back = (_: number, [x, y]: number[]): number[] => [-(2 * x + y), -(3 * x)];
    const slope = (p: number[]): number => {
      const [x, y] = rk4Vec(back, 0, p, 10, 20_000);
      return y / x;
    };
    const p4 = slope([0.01, 0.003]);
    if (Math.abs(slope([-0.02, 0.005]) - p4) > 1e-9) throw new Error('p4：两个起点给出的方向不同');

    return {
      p1: { type: 'choice', value: [kind] },
      p2: { type: 'number', value: p2 },
      p3: { type: 'number', value: p3 ?? NaN },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
