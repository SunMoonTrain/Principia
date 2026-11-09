// 独立验算 physics.analytical-mechanics.inertia-tensor 的 p1–p4（简单题、中等题）。
// 刚体换成一组质点：均匀的板和立方体取高斯-勒让德节点上的质点（每一维 3 个节点，二次多项式的积分是精确的），
// 惯性张量、转动惯量、动能都按质点逐个求和；力矩由 L(t) 对时间数值求导。再和手推的结果核对。
// 单独运行：npx tsx tools/verify/physics.analytical-mechanics.inertia-tensor.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, chosen, derivative, dot, type Mat, type Vec } from './physics.analytical-mechanics._mech.ts';
import { cross, diag, matMul, matVec, norm, Ry, Rz, transpose } from './physics.analytical-mechanics._rigid.ts';

interface Point {
  m: number;
  r: Vec;
}

const GAUSS = [
  [-Math.sqrt(3 / 5), 5 / 9],
  [0, 8 / 9],
  [Math.sqrt(3 / 5), 5 / 9],
];

/** 质量 M 的均匀长方体 [lo, hi]（某一维长度为 0 时是薄板），换成 27 个高斯-勒让德节点上的质点。 */
function box(M: number, lo: Vec, hi: Vec): Point[] {
  const pts: Point[] = [];
  for (const [a, wa] of GAUSS)
    for (const [b, wb] of GAUSS)
      for (const [c, wc] of GAUSS) {
        const u = [a, b, c];
        pts.push({ m: (M * wa * wb * wc) / 8, r: u.map((ui, i) => (lo[i] + hi[i]) / 2 + (ui * (hi[i] - lo[i])) / 2) });
      }
  return pts;
}

/** 对原点的惯性张量 I_jk = Σ m (r² δ_jk − x_j x_k)。 */
const tensor = (pts: Point[]): Mat =>
  [0, 1, 2].map((j) =>
    [0, 1, 2].map((k) => pts.reduce((s, { m, r }) => s + m * ((j === k ? dot(r, r) : 0) - r[j] * r[k]), 0)),
  );

/** 对过原点、沿单位矢量 n 的轴的转动惯量 Σ m d²。 */
const momentAbout = (pts: Point[], n: Vec): number => pts.reduce((s, { m, r }) => s + m * (dot(r, r) - dot(n, r) ** 2), 0);

export const verification: Verification = {
  lesson: 'physics.analytical-mechanics.inertia-tensor',
  notes: {
    p1: '造一个主转动惯量正好是 (1, 2, 3) 的刚体：质量 1 的两个质点在 ±e₁，质量 0.5 的两个在 ±e₂（先验它的惯性张量是 diag(1, 2, 3)），直接算 Σ ½m|ω × r|²；和 ½Σ I_k ω′_k² 核对。',
    p2: '取 a = 1、b = 2 和 a = 0.3、b = 0.7 两块板，算出对中心的惯性张量：A 看惯量积，B 看 I₃₃ − I₁₁ − I₂₂，C 看板面里与 1 轴成 0.3 rad 的轴是否满足 In ∥ n，D 看对角线方向是否满足 In ∥ n。',
    p3: '取 M = a = 1，立方体 [0, 1]³ 的 27 个节点质点，直接对过 O、沿 (1, 1, 0)/√2 的轴求 Σ m d²；和由例 1 的 I^O 算出的 nᵀI^O n = 5/12 核对。',
    p4: '盘的对称轴在 t = 0 时偏离转轴 γ，R(t) = R_z(ωt)R_y(γ)，L(t) = R I′ Rᵀ ω（I′ = diag(¼MR², ¼MR², ½MR²)），在两个时刻数值求 dL/dt 的大小，两者一样；和 ω²(I₃ − I₁) sinγ cosγ 核对。',
  },
  compute() {
    // p1
    const body1: Point[] = [
      { m: 1, r: [1, 0, 0] },
      { m: 1, r: [-1, 0, 0] },
      { m: 0.5, r: [0, 1, 0] },
      { m: 0.5, r: [0, -1, 0] },
    ];
    const I1 = tensor(body1);
    if (I1.some((row, i) => row.some((x, j) => Math.abs(x - (i === j ? i + 1 : 0)) > 1e-12))) {
      throw new Error('p1 造的刚体主转动惯量不是 (1, 2, 3)');
    }
    const w1 = [1, 1, 1];
    const T1 = body1.reduce((s, { m, r }) => s + 0.5 * m * norm(cross(w1, r)) ** 2, 0);
    const p1 = agree(T1, 0.5 * (1 + 2 + 3), 'p1 动能');

    // p2：薄板在 z = 0 平面里，中心在原点
    const parallel = (I: Mat, n: Vec): boolean => norm(cross(matVec(I, n), n)) < 1e-10;
    const flags2 = [
      [1, 2],
      [0.3, 0.7],
    ].map(([a, b]) => {
      const I = tensor(box(1, [-a / 2, -b / 2, 0], [a / 2, b / 2, 0]));
      const products = Math.max(Math.abs(I[0][1]), Math.abs(I[0][2]), Math.abs(I[1][2]));
      return [
        products < 1e-12,
        Math.abs(I[2][2] - I[0][0] - I[1][1]) < 1e-12,
        parallel(I, [Math.cos(0.3), Math.sin(0.3), 0]),
        parallel(I, [a / Math.hypot(a, b), b / Math.hypot(a, b), 0]),
      ];
    });
    if (flags2[0].some((f, i) => f !== flags2[1][i])) throw new Error('p2 两块板的结论不同');
    const p2 = chosen(flags2[0]);

    // p3：立方体对顶点 O 的面对角线
    const cube = box(1, [0, 0, 0], [1, 1, 1]);
    const n3 = [Math.SQRT1_2, Math.SQRT1_2, 0];
    const IO = [
      [2 / 3, -1 / 4, -1 / 4],
      [-1 / 4, 2 / 3, -1 / 4],
      [-1 / 4, -1 / 4, 2 / 3],
    ];
    const p3 = agree(momentAbout(cube, n3), dot(n3, matVec(IO, n3)), 'p3 转动惯量');

    // p4：M = 2、R = 0.3、γ = 0.01、ω = 20
    const [M4, R4, gamma, w4] = [2, 0.3, 0.01, 20];
    const Ibody = diag([0.25 * M4 * R4 ** 2, 0.25 * M4 * R4 ** 2, 0.5 * M4 * R4 ** 2]);
    const L4 = (t: number): Vec => {
      const R = matMul(Rz(w4 * t), Ry(gamma));
      return matVec(matMul(matMul(R, Ibody), transpose(R)), [0, 0, w4]);
    };
    const torque = (t: number): number => norm([0, 1, 2].map((i) => derivative((s) => L4(s)[i], t, 1e-4)));
    const p4 = agree(
      agree(torque(0), torque(0.37), 'p4 不同时刻'),
      w4 ** 2 * (Ibody[2][2] - Ibody[0][0]) * Math.sin(gamma) * Math.cos(gamma),
      'p4 力矩',
    );

    return {
      p1: { type: 'number', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'number', value: p3 },
      p4: { type: 'number', value: p4 },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
