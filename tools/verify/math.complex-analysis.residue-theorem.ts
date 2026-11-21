// 独立验算 math.complex-analysis.residue-theorem 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.complex-analysis.residue-theorem.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { ccos, cexp, circle, circleIntegral, Complex, contourIntegral, csin, cx, polyEval, polyRoots } from './math.complex-analysis._complex.ts';

const twoPiI = cx(0, 2 * Math.PI);

/** 按定义求 ∮_{|z−c|=r} g dz（逆时针）：折线和外推，再用圆周梯形公式核对，两条路要对上。 */
function onCircle(g: (z: Complex) => Complex, c: Complex | number, r: number): Complex {
  const a = contourIntegral(g, circle(c, r));
  if (!a.converged) throw new Error('折线和没有收敛');
  const b = circleIntegral(g, c, r);
  if (!a.value.isClose(b, 1e-8)) throw new Error('两种算法的复积分不一致');
  return a.value;
}

/**
 * 留数按定义取洛朗级数里 (z − a)^{−1} 的系数：在只围住 a 一个奇点的小圆上积分再除以 2πi。
 * 取两个半径算，对不上说明小圆里还有别的奇点或者取的半径碰到了奇点。
 */
function residueAt(g: (z: Complex) => Complex, a: Complex | number, r1: number, r2: number): Complex {
  const x = onCircle(g, a, r1).div(twoPiI);
  const y = onCircle(g, a, r2).div(twoPiI);
  if (!x.isClose(y, 1e-9)) throw new Error('两个半径上算出的留数不一致');
  return x;
}

export const verification: Verification = {
  lesson: 'math.complex-analysis.residue-theorem',
  notes: {
    p1: '在 |z − 1| = 0.5、0.25 两个小圆上按定义积分（折线和外推，圆周梯形公式核对）再除以 2πi，取的就是 (z − 1)^{−1} 的系数；不用一阶极点的公式。手算核对：(1 + 2)/(1 + 3) = 3/4。',
    p2: '四个函数各在 |z| = 0.5、0.25 上积分除以 2πi 求在 0 的留数（选项 C 的另一个极点 2 在圆外），|留数| < 1e-10 的算「留数为 0」。手算核对：e^z/z² 的留数 1，sin z/z² 的 1，1/(z(z − 2)) 的 −1/2，cos z/z² 的 0。',
    p3: '直接按定义求 ∮_{|z|=2}（折线和外推、梯形公式核对），不用留数；另用留数定理核对：圆里只有 1 这个二阶极点（−3 在圆外），在 1 的留数 = (z²/(z + 3))′|_{z=1} = 7/16，积分 = 7πi/8。',
    p4: '直接按定义求 ∮_{|z−1|=1}（折线和外推、梯形公式核对）。另用 polyRoots 求 z⁴ + 1 的四个根，|z − 1| < 1 的只有 e^{±iπ/4}（离 1 约 0.765，另两个约 1.848），各点留数 1/(4a³) = −a/4，和为 −√2/4，积分 = −(√2/2)πi，和直接积出的核对。',
  },
  compute() {
    // p1
    const f1 = (z: Complex) => z.add(2).div(z.sub(1).mul(z.add(3)));
    const p1 = residueAt(f1, 1, 0.5, 0.25);
    if (!p1.isClose(cx(0.75), 1e-10)) throw new Error('p1 和手算的 3/4 对不上');

    // p2
    const opts: ((z: Complex) => Complex)[] = [
      (z) => cexp(z).div(z.mul(z)),
      (z) => csin(z).div(z.mul(z)),
      (z) => cx(1).div(z.mul(z.sub(2))),
      (z) => ccos(z).div(z.mul(z)),
    ];
    const res2 = opts.map((g) => residueAt(g, 0, 0.5, 0.25));
    const hand2 = [cx(1), cx(1), cx(-0.5), cx(0)];
    res2.forEach((r, i) => {
      if (!r.isClose(hand2[i], 1e-9)) throw new Error(`p2 选项 ${i + 1} 的留数和手算对不上`);
    });
    const p2 = res2.map((r, i) => (r.abs() < 1e-10 ? i + 1 : 0)).filter((i) => i > 0);

    // p3
    const f3 = (z: Complex) => z.mul(z).div(z.sub(1).mul(z.sub(1)).mul(z.add(3)));
    const p3 = onCircle(f3, 0, 2);
    const g3 = (z: Complex) => z.mul(z).div(z.add(3));
    const dg3 = residueAt((z) => g3(z).div(z.sub(1).mul(z.sub(1))), 1, 0.5, 0.25);
    if (!dg3.isClose(cx(7 / 16), 1e-10)) throw new Error('p3 在 1 的留数和手算的 7/16 对不上');
    if (!p3.isClose(twoPiI.mul(cx(7 / 16)), 1e-9)) throw new Error('p3 直接积分和留数定理对不上');

    // p4
    const f4 = (z: Complex) => cx(1).div(polyEval([1, 0, 0, 0, 1], z));
    const p4 = onCircle(f4, 1, 1);
    const roots = polyRoots([1, 0, 0, 0, 1]);
    const inside = roots.filter((a) => a.sub(1).abs() < 1);
    if (inside.length !== 2) throw new Error('p4 圆里应有两个极点');
    roots.forEach((a) => {
      if (Math.abs(a.sub(1).abs() - 1) < 0.1) throw new Error('p4 有极点太靠近圆周');
    });
    const sumRes = inside.reduce((s, a) => s.add(cx(1).div(a.mul(a).mul(a).scale(4))), cx(0));
    if (!p4.isClose(twoPiI.mul(sumRes), 1e-9)) throw new Error('p4 直接积分和留数定理对不上');

    return {
      p1: { type: 'number', value: p1.re },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'tuple', value: [p3.re, p3.im] },
      p4: { type: 'tuple', value: [p4.re, p4.im] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
