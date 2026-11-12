// 独立验算 physics.optics.graded-index 的 p1–p4（简单题、中等题）。
// 两套算法：一是讲解里的式子（分层介质里 n sinθ 沿光线不变、蜃景的临界角 cosα = n_路面/n_高处、渐变折射率光纤近轴光线的周期 2π/√α）；
// 二是不用这些式子：p1 把介质切成许多薄层，用向量形式的折射定律逐层折射；p3、p4 用龙格-库塔法积分光线方程
// dθ/ds = (∂n/∂y) cosθ / n（θ 从水平量起）或 r″ = (1/2β²) d(n²)/dr（β = n cosθ 沿光线不变，θ 从轴量起），
// p3 在入射角上二分出「刚好在路面弯回」的角，p4 量周期，振幅取两档外推到零。
// 选择题用具体例子逐条核对。
// 单独运行：npx tsx tools/verify/physics.optics.graded-index.ts

import { fileURLToPath } from 'node:url';
import { runVerification, type Verification } from './lib.ts';
import { agree, angleBetween, bisect, check, chosen, deg, dirOf, paraxialLimit, refract, rk4, rk4Step, type V2 } from './physics.optics._op.ts';

/** 光线方程（n 只随 y 变）：状态 [x, y, θ]，θ 从水平量起、向上为正；以弧长 s 为自变量。 */
const rayRhs = (n: (y: number) => number, dndy: (y: number) => number) => (_s: number, u: number[]) => [Math.cos(u[2]), Math.sin(u[2]), (dndy(u[1]) * Math.cos(u[2])) / n(u[1])];

/** 从 y0 处以和水平成 −alpha（向下）出发，在线性梯度里走：先到 y ≤ 0 返回 'road'，先转成向上返回 'turn'。 */
function mirageOutcome(alpha: number, nRoad: number, nHigh: number, H: number, ds: number): 'road' | 'turn' {
  const n = (y: number) => nRoad + ((nHigh - nRoad) * Math.min(Math.max(y, 0), H)) / H;
  const dndy = (y: number) => (y >= 0 && y <= H ? (nHigh - nRoad) / H : 0);
  const f = rayRhs(n, dndy);
  let u = [0, H, -alpha];
  for (let k = 0; k < 5_000_000; k++) {
    u = rk4Step(f, 0, u, ds);
    if (u[1] <= 0) return 'road';
    if (u[2] >= 0) return 'turn';
  }
  throw new Error('mirageOutcome：没走完');
}

export const verification: Verification = {
  lesson: 'physics.optics.graded-index',
  notes: {
    p1: 'sinθ₂ = 1.50 sin30°/1.20；和逐层折射核对：从 1.50 到 1.20 均匀切成 300 层，每个界面用向量形式的折射定律折射一次，量最后和竖直方向的夹角。',
    p2: '逐条用例子（龙格-库塔法积分光线方程）：A 300 层逐层折射，每层的 n sinθ 都等于 0.75（对）；B 折射率随高度线性增大（梯度 10⁻⁵/m），水平射入的光走 100 m 后上升了 0.05 m，向折射率大的一侧弯（错）；C 第 3 题的设定里，向下射来的光在路面上方就转成向上，路径上没有界面，不是反射（错）；D α = 2.18×10⁷ m⁻² 的抛物线分布，振幅 0.01 μm 的光线在三处和 a·cos(√α z) 相差都不到振幅的 10⁻⁶（对）；E 同 B（对）。',
    p3: 'cosα = (1.00026 − 3.0×10⁻⁵)/1.00026；和积分光线方程核对：贴近路面 1 m 内折射率线性变化，光从 1 m 高处向下射来，在入射角上二分出刚好在路面处转向的角（步长 0.01 m）。',
    p4: 'α = 2(1 − 1.46/1.47)/(25 μm)²，周期 2π/√α；和积分光线方程核对：r″ = (1/2β²) d(n²)/dr，β = n(a)，从 r = a 出发算到 r = 0 的时间乘 4，振幅 a 取 1、0.5 μm 外推到零。',
  },
  compute() {
    // p1
    const th1 = 30 * deg;
    const formula1 = Math.asin((1.5 * Math.sin(th1)) / 1.2) / deg;
    const layers = 300;
    let d: V2 = dirOf(Math.PI / 2 - th1); // 和竖直方向成 30°，向上（向折射率小的方向）走
    let nPrev = 1.5;
    const invariants: number[] = [];
    for (let k = 1; k <= layers; k++) {
      const nNext = 1.5 - (0.3 * k) / layers;
      d = refract(d, [0, 1], nPrev, nNext)!;
      nPrev = nNext;
      invariants.push(nNext * Math.sin(angleBetween(d, [0, 1])));
    }
    const p1 = agree(angleBetween(d, [0, 1]) / deg, formula1, 'p1 角度', 1e-9);

    // p2
    const optA = invariants.every((v) => Math.abs(v - 0.75) < 1e-12);
    const g = 1e-5;
    const up = rk4(rayRhs((y) => 1 + g * y, () => g), [0, 0, 0], 0, 100, 2000);
    check(Math.abs(up[1] - 0.05) < 1e-3, 'B、E：走 100 m 上升约 0.05 m');
    const optB = up[1] < 0;
    const optC = false; // 下面第 3 题的积分里，光线在 y > 0 处就转向，路径上没有界面
    check(mirageOutcome(0.5 * 7.745e-3, 1.00023, 1.00026, 1, 0.01) === 'turn', 'C：小角度射来的光在路面上方就转回');
    // D：抛物线分布的光纤，近轴光线 r = a cos(√α z)
    const alphaF = (2 * (1 - 1.46 / 1.47)) / (25e-6) ** 2;
    const nF = (r: number) => 1.47 * (1 - (alphaF * r * r) / 2);
    const a0 = 1e-8;
    const beta0 = nF(a0);
    const fib = (_z: number, u: number[]) => [u[1], (2 * nF(u[0]) * 1.47 * (-alphaF * u[0])) / (2 * beta0 * beta0)];
    const k = Math.sqrt(alphaF);
    const sinusoidal = [0.3e-3, 0.7e-3, 1.1e-3].every((z) => Math.abs(rk4(fib, [a0, 0], 0, z, 4000)[0] - a0 * Math.cos(k * z)) < 1e-6 * a0);
    const optD = sinusoidal;
    const optE = up[1] > 0;
    const p2 = chosen([optA, optB, optC, optD, optE]);

    // p3
    const nHigh = 1.00026;
    const nRoad = nHigh - 3.0e-5;
    const formula3 = Math.acos(nRoad / nHigh) / deg;
    const crit = bisect((a) => (mirageOutcome(a, nRoad, nHigh, 1, 0.01) === 'turn' ? -1 : 1), 5e-3, 1e-2);
    const p3 = agree(crit / deg, formula3, 'p3 临界角', 1e-6);

    // p4（长度用 m，答案用 mm）
    const formula4 = ((2 * Math.PI) / Math.sqrt(alphaF)) * 1000;
    const period = (a: number) => {
      const beta = nF(a);
      const rhs = (_z: number, u: number[]) => [u[1], (2 * nF(u[0]) * 1.47 * (-alphaF * u[0])) / (2 * beta * beta)];
      // r 从 a 降到 0 的时间（四分之一周期）：先粗走，再在最后一步里二分
      const h = 1e-6;
      let u = [a, 0];
      let z = 0;
      while (true) {
        const next = rk4Step(rhs, z, u, h);
        if (next[0] <= 0) {
          const t = bisect((x) => rk4Step(rhs, z, u, x)[0], 0, h);
          return 4 * (z + t) * 1000;
        }
        u = next;
        z += h;
      }
    };
    const p4 = agree(paraxialLimit((a) => period(a), 1e-6), formula4, 'p4 周期', 1e-7);

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
