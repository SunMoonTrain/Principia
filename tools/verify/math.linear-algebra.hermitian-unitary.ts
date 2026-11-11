// 独立验算 math.linear-algebra.hermitian-unitary 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.linear-algebra.hermitian-unitary.ts
// 复数写成 [实部, 虚部] 逐项运算；厄米、酉都按定义（共轭转置）判断。

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { cabs, cadd, cconj, cconjT, cdiv, cmatDist, cmatMul, cmul, csub, polyRoots, type CMat, type Cx } from './math.linear-algebra._la.ts';

const I2: CMat = [
  [
    [1, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [1, 0],
  ],
];

export const verification: Verification = {
  lesson: 'math.linear-algebra.hermitian-unitary',
  notes: {
    p1: '按 Σ ū_i v_i 逐项做复数乘法再相加。',
    p2: '逐个求共轭转置，和原矩阵逐元素比较。',
    p3: '复数运算算迹和行列式（核对虚部为 0），求 λ² − (tr)λ + det 的根；再对每个根取 v = (−a₁₂, a₁₁ − λ)，核对 Av = λv。',
    p4: '由两列的复内积为 0 解出 x（一次方程），再核对 UᴴU = UUᴴ = I。',
  },
  compute() {
    // p1
    const u: Cx[] = [
      [1, 0],
      [0, 1],
    ];
    const v: Cx[] = [
      [2, 0],
      [1, 1],
    ];
    const p1 = u.reduce<Cx>((s, ui, i) => cadd(s, cmul(cconj(ui), v[i])), [0, 0]);

    // p2
    const options: CMat[] = [
      [
        [
          [1, 0],
          [0, 1],
        ],
        [
          [0, -1],
          [2, 0],
        ],
      ],
      [
        [
          [1, 0],
          [0, 1],
        ],
        [
          [0, 1],
          [2, 0],
        ],
      ],
      [
        [
          [0, 0],
          [2, 0],
        ],
        [
          [2, 0],
          [0, 0],
        ],
      ],
      [
        [
          [0, 1],
          [1, 0],
        ],
        [
          [1, 0],
          [0, 0],
        ],
      ],
      [
        [
          [3, 0],
          [1, 2],
        ],
        [
          [1, -2],
          [-1, 0],
        ],
      ],
    ];
    const p2 = options.flatMap((A, k) => (cmatDist(cconjT(A), A) < 1e-12 ? [k + 1] : []));

    // p3
    const A3: CMat = [
      [
        [0, 0],
        [1, -1],
      ],
      [
        [1, 1],
        [1, 0],
      ],
    ];
    const tr = cadd(A3[0][0], A3[1][1]);
    const dt = csub(cmul(A3[0][0], A3[1][1]), cmul(A3[0][1], A3[1][0]));
    if (Math.abs(tr[1]) > 1e-12 || Math.abs(dt[1]) > 1e-12) throw new Error('p3：迹或行列式不是实数');
    const p3 = polyRoots([dt[0], -tr[0], 1]).map(([re, im]) => {
      if (Math.abs(im) > 1e-9) throw new Error('p3：特征值不是实数');
      const l: Cx = [re, 0];
      const vec: Cx[] = [cmul([-1, 0], A3[0][1]), csub(A3[0][0], l)];
      const Av = A3.map((row) => row.reduce<Cx>((s, a, j) => cadd(s, cmul(a, vec[j])), [0, 0]));
      if (Av.some((x, i) => cabs(csub(x, cmul(l, vec[i]))) > 1e-9)) throw new Error('p3：Av ≠ λv');
      return re;
    });

    // p4
    const c11: Cx = [0.5, 0.5];
    const c21: Cx = [0.5, -0.5];
    const c12: Cx = [0.5, -0.5];
    // 第一列和第二列的复内积：conj(c11)·c12 + conj(c21)·x = 0
    const x = cdiv(cmul([-1, 0], cmul(cconj(c11), c12)), cconj(c21));
    const U: CMat = [
      [c11, c12],
      [c21, x],
    ];
    if (cmatDist(cmatMul(cconjT(U), U), I2) > 1e-12 || cmatDist(cmatMul(U, cconjT(U)), I2) > 1e-12) throw new Error('p4：不是酉矩阵');

    return {
      p1: { type: 'tuple', value: p1 },
      p2: { type: 'choice', value: p2 },
      p3: { type: 'set', value: p3 },
      p4: { type: 'tuple', value: x },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
