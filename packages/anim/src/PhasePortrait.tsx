// PhasePortrait：二维相平面。方向场画成小箭头，轨迹是跑动的点加尾迹；在图上点一下，就从那里放一条新轨迹。
// 写法见 docs/plan.md「附录：动画组件参数」。改了滑块，所有轨迹从各自的起点、t = 0 重新开始，方便比较不同参数下的相图。

import { useCallback, useEffect, useMemo, type PointerEvent } from 'react';
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
import type { PhasePortraitParams } from './specs';

/** 同时最多几条轨迹；超出时先去掉最早点出来的。 */
const MAX_TRAJECTORIES = 12;
/** 尾迹保留多长的模拟时间（秒），最多多少个点。 */
const TRAIL_SECONDS = 8;
const MAX_TRAIL = 3000;
/** 跑到这么远就不再算了（发散的轨迹）。 */
const ESCAPE = 1e6;

interface Trajectory {
  start: [number, number];
  /** 在图上点出来的（重置时去掉）。 */
  user: boolean;
  y: Float64Array;
  /** 尾迹：环形缓冲区，每个点两个数。 */
  trail: Float64Array;
  length: number;
  head: number;
  color: number;
  stopped: boolean;
}

class PhaseSim {
  t = 0;
  list: Trajectory[] = [];
  readonly clock: StepClock;
  readonly capacity: number;
  private colors = 0;
  private readonly solver = new RK4(2);
  private readonly values: Float64Array;
  private readonly derivative: Derivative;
  private readonly xy = new Float64Array(2);

  constructor(fx: CompiledExpr, fy: CompiledExpr, readonly dt: number, sliderCount: number, initial: [number, number][]) {
    // 变量数组：两个状态变量、t，然后是滑块
    const values = new Float64Array(3 + sliderCount);
    this.values = values;
    this.derivative = (t, y, out) => {
      values[0] = y[0];
      values[1] = y[1];
      values[2] = t;
      out[0] = fx(values);
      out[1] = fy(values);
    };
    this.clock = new StepClock(dt);
    this.capacity = Math.min(MAX_TRAIL, Math.ceil(TRAIL_SECONDS / dt));
    for (const start of initial) this.add(start, false);
  }

  setSliders(values: number[]): void {
    this.values.set(values, 3);
  }

  /** (x, y) 处的导数，画方向场用。 */
  field(x: number, y: number, out: Float64Array): void {
    this.xy[0] = x;
    this.xy[1] = y;
    this.derivative(this.t, this.xy, out);
  }

  add(start: [number, number], user: boolean): void {
    const trajectory: Trajectory = {
      start,
      user,
      y: Float64Array.from(start),
      trail: new Float64Array(this.capacity * 2),
      length: 0,
      head: 0,
      color: this.colors++,
      stopped: false,
    };
    this.record(trajectory);
    this.list.push(trajectory);
    if (this.list.length > MAX_TRAJECTORIES) {
      const oldest = this.list.findIndex((tr) => tr.user);
      this.list.splice(oldest >= 0 && oldest < this.list.length - 1 ? oldest : 0, 1);
    }
  }

  removeUser(): void {
    this.list = this.list.filter((tr) => !tr.user);
  }

  restart(): void {
    this.t = 0;
    this.clock.reset();
    for (const tr of this.list) {
      tr.y.set(tr.start);
      tr.length = 0;
      tr.head = 0;
      tr.stopped = false;
      this.record(tr);
    }
  }

  advance(steps: number): void {
    for (let s = 0; s < steps; s++) {
      for (const tr of this.list) {
        if (tr.stopped) continue;
        this.solver.step(this.derivative, this.t, tr.y, this.dt);
        const [x, y] = tr.y;
        if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > ESCAPE || Math.abs(y) > ESCAPE) {
          tr.stopped = true;
          continue;
        }
        this.record(tr);
      }
      this.t += this.dt;
    }
  }

  private record(tr: Trajectory): void {
    tr.trail[tr.head * 2] = tr.y[0];
    tr.trail[tr.head * 2 + 1] = tr.y[1];
    tr.head = (tr.head + 1) % this.capacity;
    tr.length = Math.min(this.capacity, tr.length + 1);
  }
}

/** 方向场：格点上画单位长度的小箭头，只表示方向。 */
function drawDirectionField(ctx: CanvasRenderingContext2D, view: Viewport, theme: Theme, sim: PhaseSim): void {
  const cell = 34;
  const cols = Math.max(4, Math.round((view.right - view.left) / cell));
  const rows = Math.max(3, Math.round((view.bottom - view.top) / cell));
  const cw = (view.right - view.left) / cols;
  const ch = (view.bottom - view.top) / rows;
  const half = Math.min(cw, ch) * 0.34;
  const [sx, sy] = view.scale;
  const out = new Float64Array(2);
  ctx.beginPath();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const px = view.left + (i + 0.5) * cw;
      const py = view.top + (j + 0.5) * ch;
      const [x, y] = view.fromPx(px, py);
      sim.field(x, y, out);
      const dx = out[0] * sx;
      const dy = -out[1] * sy;
      const m = Math.hypot(dx, dy);
      if (!(m > 0) || !Number.isFinite(m)) continue;
      arrow(ctx, px - (dx / m) * half, py - (dy / m) * half, (2 * dx * half) / m, (2 * dy * half) / m, 3.5);
    }
  }
  ctx.strokeStyle = withAlpha(theme.muted, 0.5);
  ctx.lineWidth = 1;
  ctx.stroke();
}

/** 尾迹分几段画，越早的越淡。 */
function drawTrail(ctx: CanvasRenderingContext2D, view: Viewport, tr: Trajectory, capacity: number): void {
  const n = tr.length;
  if (n < 2) return;
  const chunks = 10;
  const oldest = (tr.head - n + capacity) % capacity;
  for (let c = 0; c < chunks; c++) {
    const from = Math.floor((c * (n - 1)) / chunks);
    const to = Math.floor(((c + 1) * (n - 1)) / chunks);
    if (to <= from) continue;
    ctx.globalAlpha = 0.08 + 0.92 * ((c + 1) / chunks) ** 1.6;
    ctx.beginPath();
    for (let k = from; k <= to; k++) {
      const at = ((oldest + k) % capacity) * 2;
      const px = view.px(tr.trail[at]);
      const py = view.py(tr.trail[at + 1]);
      if (k === from) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function compile(p: PhasePortraitParams): [CompiledExpr, CompiledExpr] | string {
  const vars = Object.keys(p.system);
  const names = [...vars, 't', ...(p.sliders ?? []).map((s) => s.name)];
  try {
    return [compileExpr(p.system[vars[0]], names), compileExpr(p.system[vars[1]], names)];
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}

export function PhasePortrait({ params: p, labels }: AnimProps<PhasePortraitParams>) {
  const compiled = useMemo(() => compile(p), [p]);
  const [vx, vy] = Object.keys(p.system);
  const rx = p.range[vx];
  const ry = p.range[vy];
  const sliders = useSliders(p.sliders);
  const playback = usePlayback();
  const theme = useTheme();
  const ratio = (ry[1] - ry[0]) / (rx[1] - rx[0]);
  const { box, canvas, size, context } = useCanvas(Math.max(0.45, Math.min(0.85, ratio)), 540, ratio);
  const inView = useInView(box);

  const sim = useMemo(
    () => (typeof compiled === 'string' ? null : new PhaseSim(compiled[0], compiled[1], p.dt, p.sliders?.length ?? 0, p.initial ?? [])),
    [compiled, p.dt, p.sliders, p.initial],
  );
  const view = useMemo(() => new Viewport(rx, ry, size.width, size.height), [rx, ry, size]);

  const draw = useCallback(() => {
    const ctx = context();
    if (!ctx || !sim) return;
    ctx.clearRect(0, 0, size.width, size.height);
    drawAxes(ctx, view, theme, [vx, vy]);
    ctx.save();
    view.clip(ctx);
    drawDirectionField(ctx, view, theme, sim);
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    for (const tr of sim.list) {
      const color = theme.series[tr.color % theme.series.length];
      ctx.strokeStyle = color;
      drawTrail(ctx, view, tr, sim.capacity);
      const at = ((tr.head - 1 + sim.capacity) % sim.capacity) * 2;
      ctx.beginPath();
      ctx.arc(view.px(tr.trail[at]), view.py(tr.trail[at + 1]), 4.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = theme.surface;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.lineWidth = 2;
    }
    ctx.restore();
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = theme.muted;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(`t = ${sim.t.toFixed(2)}`, view.right - 6, view.top + 6);
    if (!sim.list.length) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('在图上点一下，从那里放一条轨迹', (view.left + view.right) / 2, (view.top + view.bottom) / 2);
    }
  }, [context, sim, size, view, theme, vx, vy]);

  // 改了滑块：所有轨迹从起点重新开始（换主题、改尺寸只重画，不重来）
  useEffect(() => {
    if (!sim) return;
    sim.setSliders((p.sliders ?? []).map((s) => sliders.values[s.name]));
    sim.restart();
  }, [sim, p.sliders, sliders.values]);
  useEffect(draw, [draw, sliders.values]);

  useAnimationFrame(playback.playing && inView && !!sim, (elapsed) => {
    if (!sim) return;
    sim.advance(sim.clock.steps(elapsed, playback.speed));
    draw();
  });

  if (typeof compiled === 'string') return <AnimError message={compiled} />;

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>): void => {
    if (!sim || e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (px < view.left || px > view.right || py < view.top || py > view.bottom) return;
    sim.add(view.fromPx(px, py), true);
    draw();
  };

  const reset = (): void => {
    sim?.removeUser();
    sim?.restart();
    sliders.reset();
  };

  return (
    <div className="anim" data-component="phase-portrait">
      <div className="anim-stage" ref={box}>
        <canvas
          ref={canvas}
          className="anim-clickable"
          style={{ width: size.width, height: size.height }}
          onPointerDown={onPointerDown}
          role="img"
          aria-label={`相平面：${vx}、${vy}`}
        />
      </div>
      <div className="anim-controls">
        <SliderPanel sliders={p.sliders} values={sliders.values} onChange={sliders.set} labels={labels} />
        <ControlBar playing={playback.playing} onToggle={playback.toggle} speed={playback.speed} onSpeed={playback.setSpeed} onReset={reset}>
          <span className="anim-hint">点图放一条轨迹</span>
        </ControlBar>
      </div>
    </div>
  );
}
