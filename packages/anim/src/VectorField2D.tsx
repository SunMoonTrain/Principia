// VectorField2D：二维向量场。格点上画箭头，粒子沿流线跑，跑出范围或到了寿命就在随机位置重新出现。
// 写法见 docs/plan.md「附录：动画组件参数」。改了滑块，粒子接着跑（只是场变了），不重新开始。

import { useCallback, useEffect, useMemo } from 'react';
import { compileExpr, type CompiledExpr } from './expr';
import {
  AnimError,
  arrow,
  ControlBar,
  drawAxes,
  SliderPanel,
  useAnimationFrame,
  useCanvas,
  useInView,
  usePlayback,
  useSliders,
  useTheme,
  Viewport,
  withAlpha,
  type AnimProps,
  type Theme,
} from './kit';
import { RK4, StepClock, type Derivative } from './ode';
import type { VectorField2DParams } from './specs';

const DEFAULT_PARTICLES = 200;
/** 尾迹记几个点，每隔多少模拟时间（秒）记一个：尾迹的长短只看场的大小，和帧率、速度档无关。 */
const TRAIL = 12;
const TRAIL_INTERVAL = 0.025;
/** 粒子寿命（模拟时间，秒），在这个范围里随机取。 */
const LIFE: [number, number] = [2, 6];

class FieldSim {
  t = 0;
  readonly pos: Float64Array;
  readonly trail: Float32Array;
  /** 尾迹环形缓冲区里最新一帧的位置。 */
  head = 0;
  readonly clock: StepClock;
  private readonly age: Float64Array;
  private readonly life: Float64Array;
  private readonly recordEvery: number;
  private steps = 0;
  private readonly solver: RK4;
  private readonly values: Float64Array;
  private readonly derivative: Derivative;

  constructor(
    private readonly fx: CompiledExpr,
    private readonly fy: CompiledExpr,
    readonly dt: number,
    sliderCount: number,
    readonly count: number,
    private readonly range: VectorField2DParams['range'],
  ) {
    // 变量数组：x、y、t，然后是滑块
    const values = new Float64Array(3 + sliderCount);
    this.values = values;
    this.pos = new Float64Array(count * 2);
    this.trail = new Float32Array(count * TRAIL * 2);
    this.age = new Float64Array(count);
    this.life = new Float64Array(count);
    // 所有粒子合成一个 2N 维的方程组，一次 RK4 走一步
    this.solver = new RK4(count * 2);
    this.derivative = (t, y, out) => {
      values[2] = t;
      for (let i = 0; i < count; i++) {
        values[0] = y[2 * i];
        values[1] = y[2 * i + 1];
        out[2 * i] = fx(values);
        out[2 * i + 1] = fy(values);
      }
    };
    this.clock = new StepClock(dt);
    this.recordEvery = Math.max(1, Math.round(TRAIL_INTERVAL / dt));
    this.restart();
  }

  setSliders(values: number[]): void {
    this.values.set(values, 3);
  }

  field(x: number, y: number, out: Float64Array): void {
    this.values[0] = x;
    this.values[1] = y;
    this.values[2] = this.t;
    out[0] = this.fx(this.values);
    out[1] = this.fy(this.values);
  }

  restart(): void {
    this.t = 0;
    this.clock.reset();
    // 一开始各粒子的年龄错开，免得同时消失
    for (let i = 0; i < this.count; i++) this.respawn(i, Math.random());
  }

  private respawn(i: number, ageFraction = 0): void {
    const { x, y } = this.range;
    this.pos[2 * i] = x[0] + Math.random() * (x[1] - x[0]);
    this.pos[2 * i + 1] = y[0] + Math.random() * (y[1] - y[0]);
    this.life[i] = LIFE[0] + Math.random() * (LIFE[1] - LIFE[0]);
    this.age[i] = ageFraction * this.life[i];
    for (let k = 0; k < TRAIL; k++) {
      this.trail[(i * TRAIL + k) * 2] = this.pos[2 * i];
      this.trail[(i * TRAIL + k) * 2 + 1] = this.pos[2 * i + 1];
    }
  }

  advance(steps: number): void {
    const { x, y } = this.range;
    // 出了显示范围一点点才算跑出去，让粒子看得见地离开
    const mx = (x[1] - x[0]) * 0.03;
    const my = (y[1] - y[0]) * 0.03;
    for (let s = 0; s < steps; s++) {
      this.solver.step(this.derivative, this.t, this.pos, this.dt);
      this.t += this.dt;
      for (let i = 0; i < this.count; i++) {
        this.age[i] += this.dt;
        const px = this.pos[2 * i];
        const py = this.pos[2 * i + 1];
        const outside = !(px >= x[0] - mx && px <= x[1] + mx && py >= y[0] - my && py <= y[1] + my);
        if (outside || this.age[i] > this.life[i]) this.respawn(i);
      }
      if (++this.steps % this.recordEvery === 0) this.record();
    }
  }

  private record(): void {
    this.head = (this.head + 1) % TRAIL;
    for (let i = 0; i < this.count; i++) {
      this.trail[(i * TRAIL + this.head) * 2] = this.pos[2 * i];
      this.trail[(i * TRAIL + this.head) * 2 + 1] = this.pos[2 * i + 1];
    }
  }
}

/** 箭头网格：方向是场的方向，长度随大小变化（以第 90 百分位的大小为满长，太小的也留三成长度）。 */
function drawArrows(ctx: CanvasRenderingContext2D, view: Viewport, theme: Theme, sim: FieldSim): void {
  const cell = 38;
  const cols = Math.max(4, Math.round((view.right - view.left) / cell));
  const rows = Math.max(3, Math.round((view.bottom - view.top) / cell));
  const cw = (view.right - view.left) / cols;
  const ch = (view.bottom - view.top) / rows;
  const full = Math.min(cw, ch) * 0.8;
  const [sx, sy] = view.scale;
  const out = new Float64Array(2);
  const grid: { px: number; py: number; dx: number; dy: number; m: number }[] = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const px = view.left + (i + 0.5) * cw;
      const py = view.top + (j + 0.5) * ch;
      const [x, y] = view.fromPx(px, py);
      sim.field(x, y, out);
      const dx = out[0] * sx;
      const dy = -out[1] * sy;
      const m = Math.hypot(dx, dy);
      if (m > 0 && Number.isFinite(m)) grid.push({ px, py, dx, dy, m });
    }
  }
  if (!grid.length) return;
  const sorted = grid.map((g) => g.m).sort((a, b) => a - b);
  const reference = sorted[Math.floor(0.9 * (sorted.length - 1))];
  ctx.beginPath();
  for (const g of grid) {
    const len = full * Math.max(0.3, Math.min(1, g.m / reference));
    const ux = g.dx / g.m;
    const uy = g.dy / g.m;
    arrow(ctx, g.px - (ux * len) / 2, g.py - (uy * len) / 2, ux * len, uy * len, 4);
  }
  ctx.strokeStyle = withAlpha(theme.muted, 0.55);
  ctx.lineWidth = 1.1;
  ctx.stroke();
}

/** 粒子：按尾迹从旧到新分几遍画，越旧越淡。 */
function drawParticles(ctx: CanvasRenderingContext2D, view: Viewport, color: string, sim: FieldSim): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (let j = 0; j < TRAIL - 1; j++) {
    const a = (sim.head + 1 + j) % TRAIL;
    const b = (a + 1) % TRAIL;
    ctx.globalAlpha = ((j + 1) / (TRAIL - 1)) ** 1.4;
    ctx.beginPath();
    for (let i = 0; i < sim.count; i++) {
      const ia = (i * TRAIL + a) * 2;
      const ib = (i * TRAIL + b) * 2;
      ctx.moveTo(view.px(sim.trail[ia]), view.py(sim.trail[ia + 1]));
      ctx.lineTo(view.px(sim.trail[ib]), view.py(sim.trail[ib + 1]));
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.lineCap = 'butt';
}

function compile(p: VectorField2DParams): [CompiledExpr, CompiledExpr] | string {
  const names = ['x', 'y', 't', ...(p.sliders ?? []).map((s) => s.name)];
  try {
    return [compileExpr(p.field.x, names), compileExpr(p.field.y, names)];
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}

export function VectorField2D({ params: p, labels }: AnimProps<VectorField2DParams>) {
  const compiled = useMemo(() => compile(p), [p]);
  const sliders = useSliders(p.sliders);
  const playback = usePlayback();
  const theme = useTheme();
  const { x: rx, y: ry } = p.range;
  const ratio = (ry[1] - ry[0]) / (rx[1] - rx[0]);
  const { box, canvas, size, context } = useCanvas(Math.max(0.45, Math.min(0.85, ratio)), 540, ratio);
  const inView = useInView(box);

  const sim = useMemo(
    () =>
      typeof compiled === 'string'
        ? null
        : new FieldSim(compiled[0], compiled[1], p.dt, p.sliders?.length ?? 0, p.particles ?? DEFAULT_PARTICLES, p.range),
    [compiled, p.dt, p.sliders, p.particles, p.range],
  );
  const view = useMemo(() => new Viewport(rx, ry, size.width, size.height), [rx, ry, size]);

  const draw = useCallback(() => {
    const ctx = context();
    if (!ctx || !sim) return;
    ctx.clearRect(0, 0, size.width, size.height);
    drawAxes(ctx, view, theme, ['x', 'y']);
    ctx.save();
    view.clip(ctx);
    drawArrows(ctx, view, theme, sim);
    drawParticles(ctx, view, theme.series[0], sim);
    ctx.restore();
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = theme.muted;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(`t = ${sim.t.toFixed(2)}`, view.right - 6, view.top + 6);
  }, [context, sim, size, view, theme]);

  useEffect(() => {
    sim?.setSliders((p.sliders ?? []).map((s) => sliders.values[s.name]));
  }, [sim, p.sliders, sliders.values]);
  useEffect(draw, [draw, sliders.values]);

  useAnimationFrame(playback.playing && inView && !!sim, (elapsed) => {
    if (!sim) return;
    sim.advance(sim.clock.steps(elapsed, playback.speed));
    draw();
  });

  if (typeof compiled === 'string') return <AnimError message={compiled} />;

  const reset = (): void => {
    sim?.restart();
    sliders.reset();
  };

  return (
    <div className="anim" data-component="vector-field-2d">
      <div className="anim-stage" ref={box}>
        <canvas ref={canvas} style={{ width: size.width, height: size.height }} role="img" aria-label="向量场" />
      </div>
      <div className="anim-controls">
        <SliderPanel sliders={p.sliders} values={sliders.values} onChange={sliders.set} labels={labels} />
        <ControlBar playing={playback.playing} onToggle={playback.toggle} speed={playback.speed} onSpeed={playback.setSpeed} onReset={reset} />
      </div>
    </div>
  );
}
