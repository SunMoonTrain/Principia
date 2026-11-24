// 独立验算 math.pde.separation-of-variables 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.pde.separation-of-variables.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { d1, d2, rk4Vec, simpson } from './math.ode._numeric.ts';

/** 打靶：X'' + λX = 0，X(0) = 0、X'(0) = 1，用四阶龙格-库塔积到 b，返回 X(b)。 */
function shootDirichlet(lambda: number, b: number, steps = 1500): number {
  return rk4Vec((_x, Y) => [Y[1], -lambda * Y[0]], 0, [0, 1], b, steps)[0];
}

/** 在 [lo, hi] 上粗扫 g 的变号，再二分，返回所有零点（升序）。 */
function scanRoots(g: (s: number) => number, lo: number, hi: number, step: number): number[] {
  const roots: number[] = [];
  let a = lo;
  let ga = g(a);
  for (let b = lo + step; b <= hi + 1e-12; b += step) {
    const gb = g(b);
    if (ga === 0) roots.push(a);
    else if (ga * gb < 0) {
      let l = a;
      let r = b;
      let gl = ga;
      for (let k = 0; k < 60; k++) {
        const m = (l + r) / 2;
        const gm = g(m);
        if (gl * gm <= 0) r = m;
        else {
          l = m;
          gl = gm;
        }
      }
      roots.push((l + r) / 2);
    }
    a = b;
    ga = gb;
  }
  return roots;
}

/**
 * 杆 [0, π] 上 u_t = u_xx 的显式差分（N 段，dt ≤ 0.4h²），推进到 tEnd。
 * left、right 为 'neumann' 时用虚格点 u_{-1} = u_1（u_x = 0）；为数时是那一端保持的温度（t > 0 起）。
 */
function heatFD(phi: (x: number) => number, left: 'neumann' | number, right: 'neumann' | number, tEnd: number, N: number): (x: number) => number {
  const L = Math.PI;
  const h = L / N;
  const steps = Math.ceil(tEnd / (0.4 * h * h));
  const dt = tEnd / steps;
  const r = dt / (h * h);
  let u = Array.from({ length: N + 1 }, (_, j) => phi(j * h));
  for (let s = 0; s < steps; s++) {
    const next = u.slice();
    for (let j = 0; j <= N; j++) {
      if (j === 0 && left !== 'neumann') continue;
      if (j === N && right !== 'neumann') continue;
      const um = j === 0 ? u[1] : u[j - 1];
      const up = j === N ? u[N - 1] : u[j + 1];
      next[j] = u[j] + r * (up - 2 * u[j] + um);
    }
    if (left !== 'neumann') next[0] = left;
    if (right !== 'neumann') next[N] = right;
    u = next;
  }
  return (x: number): number => {
    const j = Math.min(N - 1, Math.floor(x / h));
    const w = x / h - j;
    return (1 - w) * u[j] + w * u[j + 1];
  };
}

export const verification: Verification = {
  lesson: 'math.pde.separation-of-variables',
  notes: {
    p1:
      '不用公式，直接打靶：对每个 λ 解 X″ + λX = 0、X(0) = 0、X′(0) = 1（四阶龙格-库塔，1500 步），看 X(3) 何时为零；' +
      '在 λ ∈ [−20, 40] 上以 0.05 为步粗扫变号再二分。λ ≤ 0 一段没有零点（只有零解），零点依次约为 1.0966、4.3865、9.8696、17.546，' +
      '取第二个，并和 (nπ/3)² 核对到相对误差 10⁻⁸。',
    p2:
      '对每个选项分别取 L = 1、L = 2.7：五点差分求 X″，在 [0.1L, 0.9L] 的 9 个点上检查 −X″/X 是同一个常数 λ（X 为常数 1 时 X″ = 0，λ = 0），' +
      '再查 X(0) = 0、X′(L) = 0（差分步长 1e−4）且 X 不恒为零。A：X′(L) = −π/L ≠ 0；B、D：X(0) = 1 ≠ 0；C、E：都满足。',
    p3:
      '余弦级数：a_n = (2/π)∫₀^π x cos nx dx 用辛普森公式（4000 段）数值算到 n = 60，u(0, 1) = a₀/2 + Σ a_n e^{−n²}。' +
      '另用显式差分（400 段，两端虚格点 u_{−1} = u₁）从 u = x 推进到 t = 1，读 x = 0 处的值，两者相差 < 10⁻⁴。',
    p4:
      '先求稳态：u″ = 0、u(0) = 0、u(π) = π 得 u = x；v = u − x 满足两端为 0、v(x, 0) = −x，' +
      '正弦系数 b_n = (2/π)∫₀^π (−x) sin nx dx 用辛普森公式数值算到 n = 60，u(π/2, 1) = π/2 + Σ b_n e^{−n²} sin(nπ/2)。' +
      '另用显式差分（400 段，左端 0、右端 π，内部初值 0）推进到 t = 1，读 x = π/2 处的值，两者相差 < 10⁻⁴。',
  },
  compute() {
    // ---- p1 ----
    const roots = scanRoots((lam) => shootDirichlet(lam, 3), -20, 40, 0.05);
    if (roots.length < 2) throw new Error('p1：没找到两个特征值');
    if (roots[0] <= 0) throw new Error('p1：λ ≤ 0 出现了非零解');
    roots.forEach((lam, i) => {
      const exact = ((i + 1) * Math.PI / 3) ** 2;
      if (Math.abs(lam - exact) > 1e-8 * exact) throw new Error(`p1：第 ${i + 1} 个特征值 ${lam} 和 ${exact} 对不上`);
    });
    const p1 = roots[1];

    // ---- p2 ----
    const options: ((x: number, L: number) => number)[] = [
      (x, L) => Math.sin((Math.PI * x) / L),
      (x, L) => Math.cos((Math.PI * x) / (2 * L)),
      (x, L) => Math.sin((Math.PI * x) / (2 * L)),
      () => 1,
      (x, L) => Math.sin((3 * Math.PI * x) / (2 * L)),
    ];
    const p2: number[] = [];
    options.forEach((X, idx) => {
      let ok = true;
      for (const L of [1, 2.7]) {
        const f = (x: number): number => X(x, L);
        // 常数 λ：在 X 不太小的点上 −X″/X 相同
        const xs = Array.from({ length: 9 }, (_, k) => L * (0.1 + 0.1 * k));
        const lams = xs.filter((x) => Math.abs(f(x)) > 0.05).map((x) => -d2(f, x, 1e-3) / f(x));
        const lamSpread = Math.max(...lams) - Math.min(...lams);
        const residual = Math.max(...xs.map((x) => Math.abs(d2(f, x, 1e-3) + lams[0] * f(x))));
        const nonzero = xs.some((x) => Math.abs(f(x)) > 1e-3);
        const bc0 = Math.abs(f(0)) < 1e-9;
        const bcL = Math.abs(d1(f, L, 1e-4)) < 1e-6;
        if (!(lamSpread < 1e-4 && residual < 1e-4 && nonzero && bc0 && bcL)) ok = false;
      }
      if (ok) p2.push(idx + 1);
    });

    // ---- p3 ----
    const N3 = 60;
    let p3 = 0;
    for (let n = 0; n <= N3; n++) {
      const an = (2 / Math.PI) * simpson((x) => x * Math.cos(n * x), 0, Math.PI, 4000);
      p3 += (n === 0 ? an / 2 : an) * Math.exp(-n * n * 1) * Math.cos(n * 0);
    }
    const fd3 = heatFD((x) => x, 'neumann', 'neumann', 1, 400)(0);
    if (Math.abs(fd3 - p3) > 1e-4) throw new Error(`p3：差分 ${fd3} 和级数 ${p3} 对不上`);

    // ---- p4 ----
    const steady = (x: number): number => x; // u'' = 0，u(0) = 0，u(π) = π
    if (Math.abs(steady(0)) > 0 || Math.abs(steady(Math.PI) - Math.PI) > 0) throw new Error('p4：稳态不满足边界条件');
    let p4 = steady(Math.PI / 2);
    for (let n = 1; n <= 60; n++) {
      const bn = (2 / Math.PI) * simpson((x) => (0 - steady(x)) * Math.sin(n * x), 0, Math.PI, 4000);
      p4 += bn * Math.exp(-n * n * 1) * Math.sin((n * Math.PI) / 2);
    }
    const fd4 = heatFD(() => 0, 0, Math.PI, 1, 400)(Math.PI / 2);
    if (Math.abs(fd4 - p4) > 1e-4) throw new Error(`p4：差分 ${fd4} 和级数 ${p4} 对不上`);

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
