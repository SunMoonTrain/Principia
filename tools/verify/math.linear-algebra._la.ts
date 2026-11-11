// 线性代数验算脚本共用的工具（npm run verify 不把它当成小节脚本）。
// 只放通用的向量、矩阵运算和消元，不含任何一道题的答案。

export type Vec = number[];
export type Mat = number[][];

export const add = (u: Vec, v: Vec): Vec => u.map((x, i) => x + v[i]);
export const sub = (u: Vec, v: Vec): Vec => u.map((x, i) => x - v[i]);
export const scale = (c: number, v: Vec): Vec => v.map((x) => c * x);
export const dot = (u: Vec, v: Vec): number => u.reduce((s, x, i) => s + x * v[i], 0);
export const norm = (v: Vec): number => Math.sqrt(dot(v, v));

/** 叉积按列维-奇维塔符号逐项求和：w_i = Σ ε_ijk u_j v_k。 */
export function cross(u: Vec, v: Vec): Vec {
  const eps = (i: number, j: number, k: number): number => ((i - j) * (j - k) * (k - i)) / 2;
  return [0, 1, 2].map((i) => {
    let s = 0;
    for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) s += eps(i, j, k) * u[j] * v[k];
    return s;
  });
}

/** 矩阵乘向量：按列组合 x_1 a_1 + … + x_n a_n。 */
export const matVec = (A: Mat, x: Vec): Vec => A.map((row) => row.reduce((s, a, j) => s + a * x[j], 0));
export const matMul = (A: Mat, B: Mat): Mat => A.map((row) => B[0].map((_, j) => row.reduce((s, a, k) => s + a * B[k][j], 0)));
export const transpose = (A: Mat): Mat => A[0].map((_, j) => A.map((row) => row[j]));
export const identity = (n: number): Mat => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
/** 由各列拼成矩阵。 */
export const fromColumns = (cols: Vec[]): Mat => cols[0].map((_, i) => cols.map((c) => c[i]));

/**
 * 化成简化行阶梯形（列主元，|x| < tol 当作零）。返回结果和主元所在的列。
 * 只用三种初等行变换：交换、乘非零数、加倍数。
 */
export function rref(M: Mat, tol = 1e-10): { R: Mat; pivots: number[] } {
  const R = M.map((r) => [...r]);
  const m = R.length;
  const n = R[0].length;
  const pivots: number[] = [];
  let row = 0;
  for (let col = 0; col < n && row < m; col++) {
    let p = row;
    for (let r = row + 1; r < m; r++) if (Math.abs(R[r][col]) > Math.abs(R[p][col])) p = r;
    if (Math.abs(R[p][col]) < tol) continue;
    [R[row], R[p]] = [R[p], R[row]];
    const piv = R[row][col];
    R[row] = R[row].map((x) => x / piv);
    for (let r = 0; r < m; r++) {
      if (r === row) continue;
      const f = R[r][col];
      if (f !== 0) R[r] = R[r].map((x, j) => x - f * R[row][j]);
    }
    pivots.push(col);
    row++;
  }
  for (const r of R) for (let j = 0; j < n; j++) if (Math.abs(r[j]) < tol) r[j] = 0;
  return { R, pivots };
}

/** 解方阵方程组 Ax = b（化 (A | b) 的简化行阶梯形）；不唯一或无解时抛错。 */
export function solve(A: Mat, b: Vec): Vec {
  const n = A.length;
  const { R, pivots } = rref(A.map((row, i) => [...row, b[i]]));
  if (pivots.length !== n || pivots.includes(n)) throw new Error('方程组不是恰有一个解');
  return R.map((row) => row[n]);
}

/** 用 (A | I) 的简化行阶梯形求逆；左半边化不成 I 时抛错。 */
export function inverse(A: Mat): Mat {
  const n = A.length;
  const { R, pivots } = rref(A.map((row, i) => [...row, ...identity(n)[i]]));
  if (pivots.slice(0, n).some((p, i) => p !== i) || pivots.length < n) throw new Error('不可逆');
  return R.map((row) => row.slice(n));
}

/** 行列式：消元时累乘主元，交换一次变一次号。 */
export function det(A: Mat): number {
  const M = A.map((r) => [...r]);
  const n = M.length;
  let d = 1;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (M[p][c] === 0) return 0;
    if (p !== c) {
      [M[c], M[p]] = [M[p], M[c]];
      d = -d;
    }
    d *= M[c][c];
    for (let r = c + 1; r < n; r++) {
      const f = M[r][c] / M[c][c];
      for (let j = c; j < n; j++) M[r][j] -= f * M[c][j];
    }
  }
  return d;
}

/** 黄金分割法求单峰函数 g 在 [a, b] 上的最小值点。 */
export function argMin(g: (x: number) => number, a: number, b: number, iterations = 200): number {
  const r = (Math.sqrt(5) - 1) / 2;
  let x1 = b - r * (b - a);
  let x2 = a + r * (b - a);
  let g1 = g(x1);
  let g2 = g(x2);
  for (let i = 0; i < iterations; i++) {
    if (g1 > g2) {
      a = x1;
      x1 = x2;
      g1 = g2;
      x2 = a + r * (b - a);
      g2 = g(x2);
    } else {
      b = x2;
      x2 = x1;
      g2 = g1;
      x1 = b - r * (b - a);
      g1 = g(x1);
    }
  }
  return (a + b) / 2;
}

/** 可重复的伪随机数（线性同余），给「随便取几个例子」用。 */
export function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

/** 混合积 a · (b × c)，不经过行列式。 */
export const triple = (a: Vec, b: Vec, c: Vec): number => dot(a, cross(b, c));

/**
 * 施密特正交化：依次减去在前面各个方向上的投影，剩下的长度小于 tol 就丢掉。
 * 返回张成同一空间的单位正交组，它的个数就是张成空间的维数（不用消元）。
 */
export function orthonormalize(vectors: Vec[], tol = 1e-9): Vec[] {
  const basis: Vec[] = [];
  for (const v of vectors) {
    let w = [...v];
    for (let pass = 0; pass < 2; pass++) for (const q of basis) w = sub(w, scale(dot(w, q), q));
    const len = norm(w);
    if (len > tol * Math.max(1, norm(v))) basis.push(scale(1 / len, w));
  }
  return basis;
}

/** 张成空间的维数：正交化后剩下几个向量。 */
export const spanDim = (vectors: Vec[]): number => orthonormalize(vectors).length;

/**
 * 和给定各行都正交的向量组成的子空间（齐次方程组的解集）在 R^n 里的一组单位正交基：
 * 把标准基向量逐个减去在各行张成的空间上的投影，再正交化。不用消元。
 */
export function orthogonalComplement(rows: Vec[], n: number): Vec[] {
  const q = orthonormalize(rows);
  const residues = identity(n).map((e) => q.reduce((w, u) => sub(w, scale(dot(w, u), u)), e));
  return orthonormalize(residues);
}

/** 行列式按排列展开（莱布尼茨公式）：对所有排列求和，符号按逆序数的奇偶。不用消元。 */
export function permDet(A: Mat): number {
  const n = A.length;
  let total = 0;
  const perm: number[] = [];
  const used = new Array<boolean>(n).fill(false);
  const go = (row: number): void => {
    if (row === n) {
      let inv = 0;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (perm[i] > perm[j]) inv++;
      total += (inv % 2 === 0 ? 1 : -1) * perm.reduce((p, col, i) => p * A[i][col], 1);
      return;
    }
    for (let col = 0; col < n; col++) {
      if (used[col]) continue;
      used[col] = true;
      perm.push(col);
      go(row + 1);
      perm.pop();
      used[col] = false;
    }
  };
  go(0);
  return total;
}

/** 方阵的迹：主对角元之和。 */
export const trace = (A: Mat): number => A.reduce((s, row, i) => s + row[i], 0);

/**
 * det(λI − A) 的系数 [c_0, c_1, …, c_n]（c_n = 1），用法捷耶夫-勒维耶递推：
 * M_1 = I，c_{n−k} = −tr(A M_k)/k，M_{k+1} = A M_k + c_{n−k} I。不展开行列式。
 */
export function charPoly(A: Mat): number[] {
  const n = A.length;
  const c = new Array<number>(n + 1).fill(0);
  c[n] = 1;
  let M = identity(n);
  for (let k = 1; k <= n; k++) {
    const AM = matMul(A, M);
    c[n - k] = -trace(AM) / k;
    M = AM.map((row, i) => row.map((x, j) => x + (i === j ? c[n - k] : 0)));
  }
  return c;
}

/** 复数写成 [实部, 虚部]。 */
export type Cx = [number, number];
export const cadd = (a: Cx, b: Cx): Cx => [a[0] + b[0], a[1] + b[1]];
export const csub = (a: Cx, b: Cx): Cx => [a[0] - b[0], a[1] - b[1]];
export const cmul = (a: Cx, b: Cx): Cx => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
export function cdiv(a: Cx, b: Cx): Cx {
  const d = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
}
export const cabs = (a: Cx): number => Math.hypot(a[0], a[1]);

/** 实系数多项式 Σ c_k z^k 的全部复根（杜朗-克尔纳迭代，不用求根公式）。 */
export function polyRoots(c: number[]): Cx[] {
  const n = c.length - 1;
  const monic = c.map((x) => x / c[n]);
  const value = (z: Cx): Cx => monic.reduceRight<Cx>((s, a) => cadd(cmul(s, z), [a, 0]), [0, 0]);
  let z: Cx[] = Array.from({ length: n }, (_, k) => {
    const r = 0.4 + 0.9 * k;
    return [r * Math.cos(0.7 + k), r * Math.sin(0.7 + k)];
  });
  for (let it = 0; it < 500; it++) {
    z = z.map((zi, i) => {
      let den: Cx = [1, 0];
      z.forEach((zj, j) => {
        if (j !== i) den = cmul(den, csub(zi, zj));
      });
      return csub(zi, cdiv(value(zi), den));
    });
  }
  return z;
}

/** 多项式按系数 [a_0, a_1, …] 表示。 */
export const polyEval = (p: number[], x: number): number => p.reduce((s, a, i) => s + a * x ** i, 0);
export const polyAdd = (p: number[], q: number[]): number[] => Array.from({ length: Math.max(p.length, q.length) }, (_, i) => (p[i] ?? 0) + (q[i] ?? 0));
export const polyScale = (c: number, p: number[]): number[] => p.map((a) => c * a);
export function polyMul(p: number[], q: number[]): number[] {
  const r = new Array<number>(p.length + q.length - 1).fill(0);
  p.forEach((a, i) => q.forEach((b, j) => (r[i + j] += a * b)));
  return r;
}
export const polyDeriv = (p: number[]): number[] => (p.length > 1 ? p.slice(1).map((a, i) => (i + 1) * a) : [0]);
/** 补零或截到 n 个系数；截掉的系数不为零时抛错（次数超了）。 */
export function polyPad(p: number[], n: number): number[] {
  if (p.slice(n).some((a) => Math.abs(a) > 1e-12)) throw new Error('多项式次数超出');
  return Array.from({ length: n }, (_, i) => p[i] ?? 0);
}
