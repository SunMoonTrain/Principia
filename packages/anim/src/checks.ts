// docs/plan.md「测试用例与验收 / 动画」里台阶 7 的两条物理检查。
// 单元测试（ode.test.ts）和组件画廊都跑这两个函数：测试管对错，画廊页上在浏览器里再核对一次。

import { RK4, type Derivative } from './ode.ts';

/** 单摆从 0.1 弧度静止放手，用 RK4（dt = 0.001）算出的周期与小角度公式 2π√(L/g) 的相对误差。 */
export function pendulumPeriodError(): number {
  const g = 9.8;
  const L = 1;
  const pendulum: Derivative = (_t, y, out) => {
    out[0] = y[1];
    out[1] = -(g / L) * Math.sin(y[0]);
  };
  const y = new Float64Array([0.1, 0]);
  const solver = new RK4(2);
  const dt = 0.001;
  // 记下角速度由负变正的时刻：每两次之间是一个周期
  const crossings: number[] = [];
  let t = 0;
  let previous = y[1];
  while (crossings.length < 4) {
    solver.step(pendulum, t, y, dt);
    t += dt;
    // 线性插值求过零的时刻
    if (previous < 0 && y[1] >= 0) crossings.push(t - (dt * y[1]) / (y[1] - previous));
    previous = y[1];
  }
  const period = (crossings[3] - crossings[0]) / 3;
  const expected = 2 * Math.PI * Math.sqrt(L / g);
  return Math.abs(period - expected) / expected;
}

/** 无阻尼弹簧振子（k = 4，m = 1，dt = 0.01）运行 100 个周期后，能量的相对漂移。 */
export function springEnergyDrift(): number {
  const k = 4;
  const m = 1;
  const spring: Derivative = (_t, y, out) => {
    out[0] = y[1];
    out[1] = (-k / m) * y[0];
  };
  const energy = (y: Float64Array): number => 0.5 * m * y[1] ** 2 + 0.5 * k * y[0] ** 2;
  const y = new Float64Array([1, 0]);
  const start = energy(y);
  const solver = new RK4(2);
  const dt = 0.01;
  const steps = Math.round((100 * 2 * Math.PI * Math.sqrt(m / k)) / dt);
  for (let i = 0; i < steps; i++) solver.step(spring, i * dt, y, dt);
  return Math.abs(energy(y) - start) / start;
}
