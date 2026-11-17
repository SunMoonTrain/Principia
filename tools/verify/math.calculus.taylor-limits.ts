// 独立验算 math.calculus.taylor-limits 的 p1–p4（简单题、中等题）。
// 只按题意计算，不读标准答案；比对在 lib.ts 的 runVerification 里做。
// 单独运行：npx tsx tools/verify/math.calculus.taylor-limits.ts
import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { atInfinity, extrapolate } from './math.calculus._calc.ts';
import { Jet } from './math.calculus._jet.ts';

export const verification: Verification = {
  lesson: 'math.calculus.taylor-limits',
  notes: {
    p1: '函数是偶函数、在 0 附近可按 x² 展开：在 x = 0.2、0.1、0.05、0.025 处直接取 (sin x − x + x³/6)/x⁵ 的值做理查森外推（x 再小分子就被舍入误差淹没）；再用 Jet 求分子的五阶导数除以 5!（相当于连用五次洛必达法则）核对。',
    p2: '阶数：g(h)/g(h/2) 在 h = 1/64 处约等于 2^k，取最接近的整数 k；系数：g(h)/h^k 在 h → 0 时外推。g(x) = log1p(x²) − x²。',
    p3: '直接在 x → +∞ 时数值求极限（换成 t = 1/x → 0⁺，取值外推），ln(1 + 1/x) 用 log1p 算。',
    p4: '分子 x − a·sin x − b·cos x·sin x 对 (a, b) 是一次的；用 Jet 求它在 0 处的一阶、三阶导数，令两者为 0 解出 (a, b)；再数值确认 x = 10⁻²、10⁻³ 时分子除以 x³ 越来越接近 0（约按 x² 缩小）。',
  },
  compute() {
    const r1 = extrapolate((h) => (Math.sin(h) - h + h ** 3 / 6) / h ** 5, 0.2, 4);
    const x = Jet.variable(0, 5);
    const num = x.sin().sub(x).add(x.mul(x).mul(x).mul(1 / 6));
    const viaJet = num.derivative(5) / 120;
    if (Math.abs(r1.value - viaJet) > 1e-7) throw new Error(`p1：外推 ${r1.value} 和 Jet ${viaJet} 不一致`);

    const g = (h: number) => Math.log1p(h * h) - h * h;
    const k = Math.round(Math.log2(g(1 / 64) / g(1 / 128)));
    const c = extrapolate((h) => g(h) / h ** k);
    if (!c.converged) throw new Error('p2：系数外推不收敛');

    const s3 = atInfinity((x) => x - x * x * Math.log1p(1 / x), 1);
    if (s3.kind !== 'finite') throw new Error('p3：极限不是有限数');

    const coeff = (a: number, b: number): [number, number] => {
      const t = Jet.variable(0, 3);
      const n = t.sub(t.sin().mul(a)).sub(t.cos().mul(t.sin()).mul(b));
      return [n.derivative(1), n.derivative(3)];
    };
    const k0 = coeff(0, 0);
    const ka = coeff(1, 0).map((v, i) => v - k0[i]);
    const kb = coeff(0, 1).map((v, i) => v - k0[i]);
    const det = ka[0] * kb[1] - ka[1] * kb[0];
    const a = (-k0[0] * kb[1] + k0[1] * kb[0]) / det;
    const b = (-ka[0] * k0[1] + ka[1] * k0[0]) / det;
    const ratio = (t: number) => Math.abs(t - (a + b * Math.cos(t)) * Math.sin(t)) / t ** 3;
    if (!(ratio(1e-2) < 1e-3 && ratio(1e-3) < ratio(1e-2) / 50)) throw new Error('p4：分子不是比 x³ 高阶的无穷小');

    return {
      p1: { type: 'number', value: r1.value },
      p2: { type: 'tuple', value: [c.value, k] },
      p3: { type: 'number', value: s3.value },
      p4: { type: 'tuple', value: [a, b] },
    };
  },
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = runVerification(verification) ? 0 : 1;
}
