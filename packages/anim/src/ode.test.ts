import { describe, expect, it } from 'vitest';
import { pendulumPeriodError, springEnergyDrift } from './checks.ts';
import { StepClock } from './ode.ts';

// docs/plan.md「测试用例与验收 / 动画」里台阶 7 的两条
describe('四阶龙格-库塔法', () => {
  it('单摆小角度（0.1 弧度）的周期与 2π√(L/g) 相差小于 1%', () => {
    expect(pendulumPeriodError()).toBeLessThan(0.01);
  });

  it('无阻尼弹簧振子运行 100 个周期，能量漂移小于 0.1%', () => {
    expect(springEnergyDrift()).toBeLessThan(0.001);
  });

  it('速度只改每帧的步数，不改步长；卡顿以后一帧最多补 maxSteps 步', () => {
    // 每秒 60 帧跑 1 秒：1 倍速推进 1 秒的模拟时间，即 100 步 dt = 0.01
    const run = (speed: number): number => {
      const clock = new StepClock(0.01);
      let total = 0;
      for (let i = 0; i < 60; i++) total += clock.steps(1 / 60, speed);
      return total;
    };
    expect(Math.abs(run(1) - 100)).toBeLessThanOrEqual(1);
    expect(Math.abs(run(2) - 200)).toBeLessThanOrEqual(1);
    expect(Math.abs(run(0.5) - 50)).toBeLessThanOrEqual(1);
    expect(new StepClock(0.01, 5).steps(5, 1)).toBe(5);
  });
});
