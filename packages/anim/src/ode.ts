// 解微分方程：一律用四阶龙格-库塔法（RK4），固定步长（docs/plan.md「可复用动画组件库 · 统一约定」）。
// 调节动画速度时改的是每帧算多少步，不改步长。

/** y' = f(t, y)：把导数写进 out，不要改 y。 */
export type Derivative = (t: number, y: Float64Array, out: Float64Array) => void;

/** 一个固定维数的 RK4 积分器；中间结果的数组复用，每步不分配内存。 */
export class RK4 {
  private readonly k1: Float64Array;
  private readonly k2: Float64Array;
  private readonly k3: Float64Array;
  private readonly k4: Float64Array;
  private readonly tmp: Float64Array;

  constructor(readonly dimension: number) {
    this.k1 = new Float64Array(dimension);
    this.k2 = new Float64Array(dimension);
    this.k3 = new Float64Array(dimension);
    this.k4 = new Float64Array(dimension);
    this.tmp = new Float64Array(dimension);
  }

  /** 从 t 走一步 dt，直接改写 y。 */
  step(f: Derivative, t: number, y: Float64Array, dt: number): void {
    const { k1, k2, k3, k4, tmp, dimension: n } = this;
    f(t, y, k1);
    for (let i = 0; i < n; i++) tmp[i] = y[i] + (dt / 2) * k1[i];
    f(t + dt / 2, tmp, k2);
    for (let i = 0; i < n; i++) tmp[i] = y[i] + (dt / 2) * k2[i];
    f(t + dt / 2, tmp, k3);
    for (let i = 0; i < n; i++) tmp[i] = y[i] + dt * k3[i];
    f(t + dt, tmp, k4);
    for (let i = 0; i < n; i++) y[i] += (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  }
}

/**
 * 动画时钟：按「每秒推进多少模拟时间」（速度 × 1）累积，换算成这一帧要走几步 dt。
 * 帧率不稳时步数跟着变，但步长不变；一帧最多走 maxSteps 步，免得卡顿后一次算太多。
 */
export class StepClock {
  private carry = 0;

  constructor(
    private readonly dt: number,
    private readonly maxSteps = 400,
  ) {}

  /** elapsed：距上一帧的真实时间（秒）；speed：速度倍数。 */
  steps(elapsed: number, speed: number): number {
    this.carry += Math.min(elapsed, 0.1) * speed;
    const n = Math.min(this.maxSteps, Math.floor(this.carry / this.dt));
    this.carry -= n * this.dt;
    if (n === this.maxSteps) this.carry = 0;
    return n;
  }

  reset(): void {
    this.carry = 0;
  }
}
