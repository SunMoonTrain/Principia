// 独立验算 physics.optics.jones-calculus 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的琼斯矩阵（复数矩阵连乘：P(θ)、W = diag(1, e^{−iδ})、R(θ)MR(−θ)）；
// 二是不用矩阵：把琼斯矢量 (Ẽx, Ẽy) 按 E = Re(Ẽ e^{it}) 换回时间域的电场，偏振片取瞬时投影，波片让慢轴分量在时间上推迟 δ（_op.ts 的「偏振」一段）。
// 两个偏振态是否相同，用归一化的斯托克斯参量比较。选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.jones-calculus.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, analyze, check, chosen, deg, meanSq, polarizer, spin, stokes, wavePlate, type Field } from './physics.optics._op.ts';

type C = [number, number];
const cmul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cadd = (a: C, b: C): C => [a[0] + b[0], a[1] + b[1]];
const cexp = (ph: number): C => [Math.cos(ph), Math.sin(ph)];
const re = (x: number): C => [x, 0];
type M = [[C, C], [C, C]];
type J = [C, C];
const apply = (m: M, v: J): J => [cadd(cmul(m[0][0], v[0]), cmul(m[0][1], v[1])), cadd(cmul(m[1][0], v[0]), cmul(m[1][1], v[1]))];
const mmul = (a: M, b: M): M => [
  [cadd(cmul(a[0][0], b[0][0]), cmul(a[0][1], b[1][0])), cadd(cmul(a[0][0], b[0][1]), cmul(a[0][1], b[1][1]))],
  [cadd(cmul(a[1][0], b[0][0]), cmul(a[1][1], b[1][0])), cadd(cmul(a[1][0], b[0][1]), cmul(a[1][1], b[1][1]))],
];
const rot = (th: number): M => [[re(Math.cos(th)), re(-Math.sin(th))], [re(Math.sin(th)), re(Math.cos(th))]];
const Pol = (th: number): M => [[re(Math.cos(th) ** 2), re(Math.sin(th) * Math.cos(th))], [re(Math.sin(th) * Math.cos(th)), re(Math.sin(th) ** 2)]];
const Wav = (th: number, dl: number): M => mmul(mmul(rot(th), [[re(1), re(0)], [re(0), cexp(-dl)]]), rot(-th));
const norm2 = (v: J) => v[0][0] ** 2 + v[0][1] ** 2 + v[1][0] ** 2 + v[1][1] ** 2;
/** 琼斯矢量换成时间域的电场：E = Re(Ẽ e^{it})。 */
const toField = (v: J): Field => (t) => [v[0][0] * Math.cos(t) - v[0][1] * Math.sin(t), v[1][0] * Math.cos(t) - v[1][1] * Math.sin(t)];
const sameState = (a: Field, b: Field) => stokes(a).every((x, i) => Math.abs(x - stokes(b)[i]) < 1e-9);

export const verification: Verification = {
  lesson: 'physics.optics.jones-calculus',
  notes: {
    p1: '|Ẽx|²/(|Ẽx|² + |Ẽy|²) = 9/25；和时间域核对：Ex = 3cos t、Ey = −4sin t 投影到 x 轴上，时间平均。',
    p2: '逐条用例子（时间域，偏振态用归一化斯托克斯参量比较）：A (1, i) 和 (−i, 1) 的斯托克斯参量都是 (0, 0, −1)（对）；B (1, 1) 端点走直线，s₃ = 0，是 45° 线偏振（错）；C 先波片后偏振片得 45° 线偏振 (0, 1, 0)，对调后得圆偏振 (0, 0, 1)，不同（错）；D (1, e^{−iπ/4}) 的转向量为正，迎着光看逆时针（对）；E 偏振片把沿 y 的线偏振光变成零，不同的输入得到同一个输出，不可逆（错）。',
    p3: '矩阵连乘 P(90°)·R(30°)WR(−30°)，即 sin²2θ·sin²(δ/2) = 3/16；和时间域核对：慢轴分量推迟 π/3，再投影到 y 轴。',
    p4: '过四分之一波片后琼斯矢量 (2, 1) 是实的，沿 arctan½ 线偏振，透振方向和它垂直时为零：26.57° + 90°；和时间域核对：转动偏振片粗扫再黄金分割找光强最小的方向。',
  },
  compute() {
    // p1
    const J1: J = [re(3), [0, 4]];
    const formula1 = norm2(apply(Pol(0), J1)) / norm2(J1);
    const f1 = toField(J1);
    const p1 = agree(meanSq(polarizer(0)(f1)) / meanSq(f1), formula1, 'p1 透过的比例', 1e-9);

    // p2
    const optA = sameState(toField([re(1), [0, 1]]), toField([[0, -1], re(1)]));
    const sB = stokes(toField([re(1), re(1)]));
    check(Math.abs(sB[1] - 1) < 1e-9 && Math.abs(sB[2]) < 1e-9, 'B：45° 线偏振');
    const optB = Math.abs(Math.abs(sB[2]) - 1) < 1e-9;
    const xLin = toField([re(1), re(0)]);
    const c1 = polarizer(45 * deg)(wavePlate(0, Math.PI / 2)(xLin));
    const c2 = wavePlate(0, Math.PI / 2)(polarizer(45 * deg)(xLin));
    check(Math.abs(stokes(c2)[2] - 1) < 1e-9 && Math.abs(stokes(c1)[1] - 1) < 1e-9, 'C：一个圆偏振、一个 45° 线偏振');
    const optC = sameState(c1, c2);
    const optD = spin(toField([re(1), cexp(-Math.PI / 4)])) > 0;
    const yLin = toField([re(0), re(1)]);
    const optE = meanSq(polarizer(0)(yLin)) > 1e-12; // 能被变成零的非零输入存在 → 不可逆
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const J3: J = [re(1), re(0)];
    const out3 = apply(Pol(90 * deg), apply(Wav(30 * deg, Math.PI / 3), J3));
    const formula3 = norm2(out3) / norm2(J3);
    check(Math.abs(formula3 - 3 / 16) < 1e-12, 'p3 = 3/16');
    const f3 = toField(J3);
    const t3 = polarizer(90 * deg)(wavePlate(30 * deg, Math.PI / 3)(f3));
    const p3 = agree(meanSq(t3) / meanSq(f3), formula3, 'p3 透过的比例', 1e-9);

    // p4（度，0 到 180）
    const J4: J = [re(2), [0, 1]];
    const out4 = apply(Wav(0, Math.PI / 2), J4);
    check(Math.abs(out4[0][1]) < 1e-12 && Math.abs(out4[1][1]) < 1e-12, 'p4 过波片后是实矢量');
    const formula4 = Math.atan2(out4[1][0], out4[0][0]) / deg + 90;
    const r4 = analyze([wavePlate(0, Math.PI / 2)(toField(J4))]);
    check(r4.min < 1e-12, 'p4 能完全挡住');
    const p4 = agree(r4.thMin / deg, formula4, 'p4 透过为零时的透振方向', 1e-7);

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
